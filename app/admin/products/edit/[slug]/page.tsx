'use client';

export const dynamic = 'force-dynamic';

import { useState, useRef, useCallback, useId, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { categories } from '@/lib/products';
import {
  getFSProductBySlug, updateFSProduct, deleteFSProduct,
  uploadProductImage, type FSProduct,
} from '@/lib/firestoreProducts';

interface ImagePreview {
  id:          string;
  url:         string;
  name:        string;
  size:        number;
  isPrimary:   boolean;
  file?:       File;
  isExisting?: boolean;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function EditProduct() {
  const uid    = useId();
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const [product, setProduct]   = useState<FSProduct | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState('');
  const [saved, setSaved]       = useState(false);

  const [images, setImages]     = useState<ImagePreview[]>([]);
  const [form, setForm]         = useState({
    name: '', slug: '', category: '', subcategory: '',
    shortDesc: '', longDesc: '',
    price: '', originalPrice: '', stock: '',
    isFeatured: false, isNewArrival: false, isBestSeller: false, isOnSale: false,
  });
  const [details, setDetails]   = useState<string[]>(['']);

  /* ── Load product from Firestore ── */
  useEffect(() => {
    getFSProductBySlug(slug).then((p) => {
      if (p) {
        setProduct(p);
        setForm({
          name:          p.name,
          slug:          p.slug,
          category:      p.category,
          subcategory:   p.subcategory  ?? '',
          shortDesc:     p.description,
          longDesc:      p.longDesc     ?? '',
          price:         String(p.price),
          originalPrice: p.originalPrice ? String(p.originalPrice) : '',
          stock:         p.stock !== undefined ? String(p.stock) : '',
          isFeatured:    p.isFeatured    ?? false,
          isNewArrival:  p.isNewArrival  ?? false,
          isBestSeller:  p.isBestSeller  ?? false,
          isOnSale:      p.isOnSale      ?? false,
        });
        setDetails(p.details?.length ? p.details : ['']);
        setImages(
          (p.images ?? []).map((url, i) => ({
            id: `existing-${i}`,
            url,
            name:        `image-${i + 1}`,
            size:        0,
            isPrimary:   i === 0,
            isExisting:  true,
          }))
        );
      }
      setLoading(false);
    });
  }, [slug]);

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const price     = parseFloat(form.price)         || 0;
  const origPrice = parseFloat(form.originalPrice) || 0;
  const discount  = origPrice > price && price > 0 ? Math.round(((origPrice - price) / origPrice) * 100) : 0;

  /* ── Images ── */
  const addFiles = useCallback((files: File[]) => {
    files.filter((f) => f.type.startsWith('image/')).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) => prev.length >= 8 ? prev : [
          ...prev,
          { id: `${Date.now()}-${Math.random()}`, url: e.target?.result as string, name: file.name, size: file.size, isPrimary: prev.length === 0, file },
        ]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const removeImage = (id: string) => setImages((prev) => {
    const next = prev.filter((img) => img.id !== id);
    if (next.length > 0 && !next.some((img) => img.isPrimary)) next[0].isPrimary = true;
    return next;
  });

  const setPrimary = (id: string) =>
    setImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.id === id })));

  /* ── Details ── */
  const updateDetail = (i: number, v: string) => setDetails((d) => d.map((x, idx) => idx === i ? v : x));
  const addDetail    = () => setDetails((d) => [...d, '']);
  const removeDetail = (i: number) => setDetails((d) => d.length > 1 ? d.filter((_, idx) => idx !== i) : ['']);

  /* ── Save ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!product?.id) return;
    setError(''); setSaving(true);
    try {
      const primaryIdx = images.findIndex((img) => img.isPrimary);
      const ordered    = primaryIdx > 0
        ? [images[primaryIdx], ...images.filter((_, i) => i !== primaryIdx)]
        : images;

      const imageUrls: string[] = [];
      for (const img of ordered) {
        if (img.isExisting) {
          imageUrls.push(img.url);
        } else if (img.file) {
          const url = await uploadProductImage(form.slug, img.file);
          imageUrls.push(url);
        }
      }

      await updateFSProduct(product.id, {
        slug:          form.slug,
        name:          form.name,
        description:   form.shortDesc,
        longDesc:      form.longDesc,
        details:       details.filter(Boolean),
        price,
        originalPrice: origPrice > 0 ? origPrice : undefined,
        stock:         form.stock !== '' ? parseInt(form.stock) : undefined,
        category:      form.category,
        subcategory:   form.subcategory || undefined,
        images:        imageUrls,
        isFeatured:    form.isFeatured,
        isNewArrival:  form.isNewArrival,
        isBestSeller:  form.isBestSeller,
        isOnSale:      form.isOnSale,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  }

  /* ── Delete ── */
  async function handleDelete() {
    if (!product?.id) return;
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteFSProduct(product.id);
      router.replace('/admin/products');
    } catch {
      setError('Failed to delete product.');
      setDeleting(false);
    }
  }

  /* ── Loading / not found ── */
  if (loading) {
    return <div className="p-8 text-center text-sm text-stone-400">Loading product…</div>;
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="text-stone-500">Product not found in database.</p>
        <Link href="/admin/products" className="mt-4 inline-block text-sm text-brand-600 hover:underline">← Back to products</Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">

      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition" aria-label="Back">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Catalogue</p>
          <h2 className="font-display text-2xl font-bold text-stone-800 truncate">Edit: {product.name}</h2>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-medium text-green-700">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          Changes saved successfully.
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Images */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-stone-800">Product Images</h3>
              <p className="text-xs text-stone-400 mt-0.5">Click to set primary. Add new images below.</p>
            </div>
            <span className="text-xs text-stone-400">{images.length}/8</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img) => (
              <div key={img.id} onClick={() => setPrimary(img.id)}
                className={`group relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${img.isPrimary ? 'border-brand-500' : 'border-stone-200 hover:border-brand-300'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.name} className="h-32 w-full object-cover" />
                {img.isPrimary && <span className="absolute top-2 left-2 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">Primary</span>}
                {img.isExisting && <span className="absolute bottom-2 left-2 rounded-full bg-stone-800/60 px-2 py-0.5 text-[10px] text-white">Saved</span>}
                <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                  className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-600" aria-label="Remove image">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                {!img.isExisting && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 opacity-0 group-hover:opacity-100 transition">
                    <p className="truncate text-[10px] text-white font-medium">{img.name}</p>
                    <p className="text-[9px] text-white/70">{formatBytes(img.size)}</p>
                  </div>
                )}
              </div>
            ))}

            {images.length < 8 && (
              <div>
                <button type="button"
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition ${dragging ? 'border-brand-400 bg-brand-50' : 'border-stone-200 text-stone-300 hover:border-brand-300 hover:text-brand-400'}`}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  <span className="text-xs font-medium">Add image</span>
                </button>
                <input ref={fileInputRef} id={`${uid}-file`} type="file" accept="image/*" multiple aria-label="Upload product images" className="hidden" onChange={handleFileInput} />
              </div>
            )}
          </div>
        </div>

        {/* Basic info */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card space-y-4">
          <h3 className="font-semibold text-stone-800 border-b border-stone-100 pb-3">Basic Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">Product Name <span className="text-red-500">*</span></label>
              <input required type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Kanjivaram Silk Saree"
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">URL Slug <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-300 font-mono">/</span>
                <input required type="text" value={form.slug} onChange={(e) => set('slug', e.target.value)}
                  placeholder="product-slug"
                  className="w-full rounded-xl border border-stone-200 py-2.5 pl-6 pr-3.5 text-sm font-mono outline-none transition focus:border-brand-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">Category <span className="text-red-500">*</span></label>
              <select required aria-label="Category" value={form.category} onChange={(e) => set('category', e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 bg-white">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">Subcategory</label>
              <input type="text" value={form.subcategory} onChange={(e) => set('subcategory', e.target.value)} placeholder="e.g. Silk Sarees"
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-500">Short Description <span className="text-red-500">*</span></label>
              <span className={`text-[11px] font-medium ${form.shortDesc.length > 160 ? 'text-red-500' : 'text-stone-400'}`}>{form.shortDesc.length}/160</span>
            </div>
            <textarea required rows={2} maxLength={200} value={form.shortDesc} onChange={(e) => set('shortDesc', e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Full Description</label>
            <textarea rows={5} value={form.longDesc} onChange={(e) => set('longDesc', e.target.value)} placeholder="Detailed description..."
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 resize-none leading-relaxed" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="text-xs font-semibold text-stone-500">Product Details</label>
                <p className="text-[11px] text-stone-400 mt-0.5">Shown as bullet list.</p>
              </div>
              <button type="button" onClick={addDetail} disabled={details.length >= 12}
                className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-2.5 py-1 text-xs font-semibold text-stone-600 hover:border-brand-300 hover:text-brand-600 transition disabled:opacity-40">
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add row
              </button>
            </div>
            <div className="space-y-2">
              {details.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-stone-100 text-[10px] font-bold text-stone-400 flex items-center justify-center">{i + 1}</span>
                  <input type="text" value={d} onChange={(e) => updateDetail(i, e.target.value)} placeholder={['Material', 'Origin', 'Care', 'Dimensions'][i % 4]}
                    className="flex-1 rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none transition focus:border-brand-400" />
                  <button type="button" onClick={() => removeDetail(i)}
                    className="flex-shrink-0 rounded-lg p-1.5 text-stone-300 hover:bg-red-50 hover:text-red-400 transition" aria-label="Remove">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card space-y-4">
          <h3 className="font-semibold text-stone-800 border-b border-stone-100 pb-3">Pricing & Stock</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">Selling Price (₹) <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-medium text-sm">₹</span>
                <input required type="number" min="1" step="0.01" aria-label="Selling price" placeholder="0" value={form.price} onChange={(e) => set('price', e.target.value)}
                  className="w-full rounded-xl border border-stone-200 py-2.5 pl-7 pr-3.5 text-sm outline-none transition focus:border-brand-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">MRP / Original Price (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-medium text-sm">₹</span>
                <input type="number" min="0" step="0.01" aria-label="MRP / original price" placeholder="0" value={form.originalPrice} onChange={(e) => set('originalPrice', e.target.value)}
                  className="w-full rounded-xl border border-stone-200 py-2.5 pl-7 pr-3.5 text-sm outline-none transition focus:border-brand-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">Stock Quantity</label>
              <input type="number" min="0" aria-label="Stock quantity" placeholder="0" value={form.stock} onChange={(e) => set('stock', e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400" />
            </div>
          </div>
          {price > 0 && (
            <div className="rounded-xl bg-stone-50 border border-stone-100 px-4 py-3 flex flex-wrap gap-4 text-sm">
              <div><p className="text-xs text-stone-400 mb-0.5">Selling Price</p><p className="font-bold text-stone-800">₹{price.toLocaleString('en-IN')}</p></div>
              {origPrice > price && (
                <>
                  <div><p className="text-xs text-stone-400 mb-0.5">MRP</p><p className="font-medium text-stone-500 line-through">₹{origPrice.toLocaleString('en-IN')}</p></div>
                  <div><p className="text-xs text-stone-400 mb-0.5">Customer Saves</p><p className="font-bold text-green-600">₹{(origPrice - price).toLocaleString('en-IN')}</p></div>
                  <div><p className="text-xs text-stone-400 mb-0.5">Discount</p><span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">{discount}% OFF</span></div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Labels */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card space-y-4">
          <h3 className="font-semibold text-stone-800 border-b border-stone-100 pb-3">Labels & Visibility</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {([
              { key: 'isFeatured',   label: 'Featured',    hint: 'Show on homepage'    },
              { key: 'isNewArrival', label: 'New Arrival',  hint: 'Show "New" badge'    },
              { key: 'isBestSeller', label: 'Best Seller',  hint: 'Show "Hot" badge'    },
              { key: 'isOnSale',     label: 'On Sale',      hint: 'Show discount badge' },
            ] as const).map(({ key, label, hint }) => (
              <label key={key} className={`flex cursor-pointer flex-col gap-1 rounded-xl border px-3 py-3 transition ${form[key] ? 'border-brand-400 bg-brand-50/60' : 'border-stone-200 hover:border-brand-300 hover:bg-brand-50/30'}`}>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} className="accent-brand-600 h-4 w-4" />
                  <span className="text-sm font-semibold text-stone-700">{label}</span>
                </div>
                <p className="text-[11px] text-stone-400 pl-6">{hint}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button type="button" onClick={handleDelete} disabled={deleting}
            className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50">
            {deleting ? 'Deleting…' : (
              <>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Product
              </>
            )}
          </button>
          <div className="flex items-center gap-3">
            <Link href="/admin/products" className="rounded-xl border border-stone-200 px-6 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-50">Cancel</Link>
            <button type="submit" disabled={saving}
              className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
