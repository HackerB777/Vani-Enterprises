'use client';

import { useState } from 'react';
import Link from 'next/link';
import { products, categories, categoryGradients } from '@/lib/products';

export default function AdminProducts() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy]     = useState('name');

  const filtered = products
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
      return 0;
    });

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
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort products"
          className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400"
        >
          <option value="name">Sort: Name</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>

      {/* Stats bar */}
      <div className="flex gap-4 text-sm text-stone-500">
        <span><strong className="text-stone-800">{filtered.length}</strong> products</span>
        {filtered.length !== products.length && (
          <button onClick={() => { setSearch(''); setCategory('all'); }} className="text-brand-600 hover:underline text-xs">
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-stone-200 bg-white shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50 text-left">
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Product</th>
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Category</th>
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Price</th>
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Badges</th>
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Rating</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filtered.map((product) => {
                const gradient = categoryGradients[product.category] ?? 'from-stone-100 to-stone-200';
                return (
                  <tr key={product.slug} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-stone-400`}>
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-stone-800 leading-tight">{product.name}</p>
                          <p className="text-xs text-stone-400 font-mono">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600 capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-stone-800">₹{product.price.toLocaleString('en-IN')}</p>
                      {product.originalPrice && (
                        <p className="text-xs text-stone-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.isFeatured   && <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">Featured</span>}
                        {product.isBestSeller && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">Best Seller</span>}
                        {product.isNewArrival && <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">New</span>}
                        {product.isOnSale     && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">Sale</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-stone-600">
                      {product.rating ? (
                        <div className="flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" className="flex-shrink-0">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="text-sm font-medium">{product.rating}</span>
                          {product.reviewCount && <span className="text-xs text-stone-400">({product.reviewCount})</span>}
                        </div>
                      ) : (
                        <span className="text-xs text-stone-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/product/${product.slug}`}
                          target="_blank"
                          className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
                          title="Preview"
                        >
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                        <Link
                          href={`/admin/products/edit/${product.slug}`}
                          className="rounded-lg p-1.5 text-stone-400 hover:bg-brand-50 hover:text-brand-600 transition"
                          title="Edit"
                        >
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-stone-400">
            <p className="text-sm font-medium">No products match your filters</p>
            <button onClick={() => { setSearch(''); setCategory('all'); }} className="mt-2 text-xs text-brand-600 hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
