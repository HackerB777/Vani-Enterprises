'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { categories } from '@/lib/products';
import type { IProduct } from '@/lib/models/Product';

export default function AdminProducts() {
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [category, setCategory]       = useState('all');
  const [sortBy, setSortBy]           = useState('newest');
  const [deleting, setDeleting]       = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res  = await fetch('/api/products');
      const data = await res.json();
      setAllProducts(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = allProducts
    .filter((p) => {
      const matchCat    = category === 'all' || p.category === category;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name')       return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  async function handleDelete(slug: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(slug);
    try {
      await fetch(`/api/products/${slug}`, { method: 'DELETE' });
      setAllProducts((prev) => prev.filter((p) => p.slug !== slug));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Catalogue</p>
          <h2 className="font-display text-2xl font-bold text-stone-800">Products</h2>
        </div>
        <Link
          href="/admin/products/add"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-brand-400"
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category"
          className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400">
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort products"
          className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400">
          <option value="newest">Newest First</option>
          <option value="name">Name A–Z</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-stone-200 bg-white shadow-card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-stone-400 text-sm">Loading products…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-stone-400">
            <svg className="mx-auto mb-3 h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-sm font-medium">
              {allProducts.length === 0 ? 'No products yet — add your first product' : 'No products match your filters'}
            </p>
            {allProducts.length > 0 && (
              <button type="button" onClick={() => { setSearch(''); setCategory('all'); }} className="mt-2 text-xs text-brand-600 hover:underline">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50 text-left">
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Product</th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Category</th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Price</th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Stock</th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Badges</th>
                  <th className="px-4 py-3.5" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filtered.map((product) => (
                  <tr key={product.slug} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.images[0]} alt={product.name} className="h-10 w-10 flex-shrink-0 rounded-lg object-cover" />
                        ) : (
                          <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-stone-100 flex items-center justify-center text-stone-300">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-stone-800 leading-tight">{product.name}</p>
                          <p className="text-xs text-stone-400 font-mono">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600 capitalize">{product.category}</span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-stone-800">₹{product.price.toLocaleString('en-IN')}</p>
                      {product.originalPrice && (
                        <p className="text-xs text-stone-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {product.stock !== undefined ? (
                        <span className={`text-xs font-semibold ${
                          product.stock === 0 ? 'text-red-600' :
                          product.stock < 10  ? 'text-amber-600' : 'text-green-600'
                        }`}>
                          {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                        </span>
                      ) : <span className="text-xs text-stone-300">—</span>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.isFeatured   && <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">Featured</span>}
                        {product.isBestSeller && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">Best Seller</span>}
                        {product.isNewArrival && <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">New</span>}
                        {product.isOnSale     && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">Sale</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/products/edit/${product.slug}`}
                          className="rounded-lg p-1.5 text-stone-400 hover:bg-brand-50 hover:text-brand-600 transition" title="Edit">
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          type="button"
                          disabled={deleting === product.slug}
                          onClick={() => handleDelete(product.slug, product.name)}
                          className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-40"
                          title="Delete"
                        >
                          {deleting === product.slug ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="animate-spin">
                              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                            </svg>
                          ) : (
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-stone-400 text-center">{allProducts.length} total products in database</p>
    </div>
  );
}
