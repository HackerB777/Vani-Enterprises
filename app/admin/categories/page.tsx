'use client';

import { useState, useEffect, useId } from 'react';
import type { Category } from '@/lib/products';

const GRADIENTS = [
  { label: 'Rose',    value: 'from-rose-100 to-orange-100'    },
  { label: 'Amber',   value: 'from-amber-100 to-yellow-100'   },
  { label: 'Sky',     value: 'from-sky-100 to-blue-100'       },
  { label: 'Stone',   value: 'from-stone-100 to-orange-100'   },
  { label: 'Emerald', value: 'from-emerald-100 to-teal-100'   },
  { label: 'Orange',  value: 'from-orange-100 to-amber-100'   },
  { label: 'Violet',  value: 'from-violet-100 to-purple-100'  },
  { label: 'Green',   value: 'from-green-100 to-emerald-100'  },
  { label: 'Pink',    value: 'from-pink-100 to-rose-100'      },
  { label: 'Cyan',    value: 'from-cyan-100 to-blue-100'      },
  { label: 'Lime',    value: 'from-lime-100 to-green-100'     },
  { label: 'Indigo',  value: 'from-indigo-100 to-violet-100'  },
];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const EMPTY_FORM = { name: '', slug: '', description: '', gradient: GRADIENTS[0].value, count: '0' };

/* ── Modal ───────────────────────────────────────────────────── */
function CategoryModal({
  mode, initial, saving, onSave, onClose,
}: {
  mode: 'add' | 'edit';
  initial: typeof EMPTY_FORM;
  saving: boolean;
  onSave: (data: typeof EMPTY_FORM) => void;
  onClose: () => void;
}) {
  const uid = useId();
  const [form, setForm]         = useState(initial);
  const [slugEdited, setSlugEdited] = useState(mode === 'edit');

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleName = (v: string) => {
    set('name', v);
    if (!slugEdited) set('slug', slugify(v));
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h3 className="font-display text-lg font-bold text-stone-800">
            {mode === 'add' ? 'Add Category' : 'Edit Category'}
          </h3>
          <button type="button" onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition" aria-label="Close">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="p-6 space-y-5">
          <div className={`h-20 w-full rounded-xl bg-gradient-to-br ${form.gradient} flex items-center justify-center transition-all duration-300`}>
            <span className="font-display text-lg font-bold text-stone-700 opacity-60">{form.name || 'Category Name'}</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${uid}-name`} className="block text-xs font-semibold text-stone-500 mb-1.5">Name <span className="text-red-500">*</span></label>
              <input id={`${uid}-name`} required type="text" value={form.name} onChange={(e) => handleName(e.target.value)}
                placeholder="e.g. Textiles & Sarees"
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
            </div>
            <div>
              <label htmlFor={`${uid}-slug`} className="block text-xs font-semibold text-stone-500 mb-1.5">Slug <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-300 font-mono select-none">/</span>
                <input id={`${uid}-slug`} required type="text" value={form.slug}
                  onChange={(e) => { setSlugEdited(true); set('slug', slugify(e.target.value)); }}
                  placeholder="textiles"
                  className="w-full rounded-xl border border-stone-200 py-2.5 pl-6 pr-3.5 text-sm font-mono outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor={`${uid}-desc`} className="block text-xs font-semibold text-stone-500 mb-1.5">Description</label>
            <input id={`${uid}-desc`} type="text" value={form.description} onChange={(e) => set('description', e.target.value)}
              placeholder="e.g. Silk, cotton & handloom fabrics"
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
          </div>

          <div>
            <label htmlFor={`${uid}-count`} className="block text-xs font-semibold text-stone-500 mb-1.5">Product Count</label>
            <input id={`${uid}-count`} type="number" min="0" value={form.count} onChange={(e) => set('count', e.target.value)}
              className="w-32 rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
          </div>

          <div>
            <p className="text-xs font-semibold text-stone-500 mb-2">Gradient Colour</p>
            <div className="grid grid-cols-6 gap-2">
              {GRADIENTS.map((g) => (
                <button key={g.value} type="button" title={g.label} onClick={() => set('gradient', g.value)}
                  className={`h-9 rounded-lg bg-gradient-to-br ${g.value} transition-all ring-offset-1 ${
                    form.gradient === g.value ? 'ring-2 ring-brand-500 scale-105' : 'hover:scale-105 hover:ring-2 hover:ring-stone-300'
                  }`} />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
            <button type="button" onClick={onClose}
              className="rounded-xl border border-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60">
              {saving ? 'Saving…' : mode === 'add' ? 'Add Category' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Card ─────────────────────────────────────────────────────── */
function CategoryCard({ cat, onEdit, onDelete }: { cat: Category; onEdit: () => void; onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="group relative rounded-2xl border border-stone-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className={`mb-4 h-24 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-end justify-between p-3`}>
        <span className="rounded-lg bg-white/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-600">
          {cat.count} products
        </span>
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-stone-800 truncate">{cat.name}</p>
          <p className="text-xs text-stone-400 font-mono mt-0.5">{cat.slug}</p>
          {cat.description && <p className="mt-1 text-xs text-stone-500 line-clamp-2">{cat.description}</p>}
        </div>
        <div className="flex flex-col gap-1 flex-shrink-0">
          <button onClick={onEdit} aria-label={`Edit ${cat.name}`}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-brand-50 hover:text-brand-600 transition">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={() => setConfirming(true)} aria-label={`Delete ${cat.name}`}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500 transition">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      {confirming && (
        <div className="absolute inset-0 rounded-2xl bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 border-2 border-red-200">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-red-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-stone-800">Delete category?</p>
            <p className="text-xs text-stone-500 mt-0.5">&ldquo;{cat.name}&rdquo; will be removed.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setConfirming(false)}
              className="rounded-xl border border-stone-200 px-3.5 py-1.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-50">
              Cancel
            </button>
            <button type="button" onClick={() => { setConfirming(false); onDelete(); }}
              className="rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function AdminCategories() {
  const [cats, setCats]     = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [search, setSearch]   = useState('');
  const [modal, setModal]     = useState<{ open: boolean; mode: 'add' | 'edit'; target: string | null }>
    ({ open: false, mode: 'add', target: null });
  const [toast, setToast]     = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  async function load() {
    setLoading(true);
    try {
      const res  = await fetch('/api/categories');
      const data = await res.json();
      setCats(Array.isArray(data) ? data : []);
    } catch {
      setCats([]);
    } finally {
      setLoading(false);
    }
  }

  async function persist(next: Category[], successMsg: string) {
    setSaving(true);
    try {
      const res = await fetch('/api/categories', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(next),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert(d.error ?? 'Failed to save. Are you logged in as admin?');
        return false;
      }
      setCats(next);
      showToast(successMsg);
      return true;
    } catch {
      alert('Network error — changes not saved.');
      return false;
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = cats.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const editingCat   = modal.target ? cats.find((c) => c.slug === modal.target) : null;
  const modalInitial = editingCat
    ? { name: editingCat.name, slug: editingCat.slug, description: editingCat.description, gradient: editingCat.gradient, count: String(editingCat.count) }
    : { name: '', slug: '', description: '', gradient: GRADIENTS[0].value, count: '0' };

  async function handleSave(data: typeof modalInitial) {
    const entry: Category = {
      name: data.name, slug: data.slug, description: data.description,
      gradient: data.gradient, count: parseInt(data.count, 10) || 0,
    };

    let next: Category[];
    if (modal.mode === 'add') {
      if (cats.some((c) => c.slug === entry.slug)) {
        alert(`Slug "${entry.slug}" already exists.`);
        return;
      }
      next = [...cats, entry];
    } else {
      next = cats.map((c) => c.slug === modal.target ? entry : c);
    }

    const ok = await persist(next, modal.mode === 'add' ? `"${entry.name}" added` : `"${entry.name}" updated`);
    if (ok) setModal({ open: false, mode: 'add', target: null });
  }

  async function handleDelete(slug: string) {
    const name = cats.find((c) => c.slug === slug)?.name ?? slug;
    const next = cats.filter((c) => c.slug !== slug);
    await persist(next, `"${name}" removed`);
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Catalogue</p>
          <h2 className="font-display text-2xl font-bold text-stone-800">Categories</h2>
        </div>
        <button onClick={() => setModal({ open: true, mode: 'add', target: null })}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search categories..." aria-label="Search categories" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
        </div>
        <p className="text-sm text-stone-400 flex-shrink-0">
          <span className="font-semibold text-stone-700">{cats.length}</span> total
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-16 text-center text-stone-400 text-sm">Loading categories…</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((cat) => (
            <CategoryCard key={cat.slug} cat={cat}
              onEdit={() => setModal({ open: true, mode: 'edit', target: cat.slug })}
              onDelete={() => handleDelete(cat.slug)} />
          ))}
          <button type="button" onClick={() => setModal({ open: true, mode: 'add', target: null })}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-stone-200 bg-white p-5 text-stone-300 transition hover:border-brand-300 hover:text-brand-400 hover:bg-brand-50/30 min-h-[200px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-current">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm font-semibold">New Category</span>
          </button>
        </div>
      )}

      {!loading && filtered.length === 0 && cats.length > 0 && (
        <div className="rounded-2xl border border-stone-200 bg-white py-16 text-center text-stone-400">
          <p className="text-sm font-medium">No categories match</p>
          <button onClick={() => setSearch('')} className="mt-2 text-xs text-brand-600 hover:underline">Clear search</button>
        </div>
      )}

      {modal.open && (
        <CategoryModal mode={modal.mode} initial={modalInitial} saving={saving}
          onSave={handleSave}
          onClose={() => setModal({ open: false, mode: 'add', target: null })} />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[400] -translate-x-1/2 flex items-center gap-2 rounded-2xl bg-stone-900 px-5 py-3 text-sm font-medium text-white shadow-2xl animate-slide-up">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="text-green-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {toast}
        </div>
      )}
    </div>
  );
}
