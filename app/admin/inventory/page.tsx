'use client';

import { useState, useEffect } from 'react';
import type { IProduct } from '@/lib/models/Product';
import { categories, categoryGradients } from '@/lib/products';

interface StockItem {
  slug:     string;
  name:     string;
  category: string;
  price:    number;
  stock:    number;
}

const STOCK_BADGE = (n: number) =>
  n === 0   ? 'bg-red-100 text-red-700'
  : n < 10  ? 'bg-amber-100 text-amber-700'
  : n < 25  ? 'bg-yellow-100 text-yellow-700'
  : 'bg-green-100 text-green-700';

const STOCK_LABEL = (n: number) =>
  n === 0 ? 'Out of Stock' : n < 10 ? 'Low Stock' : n < 25 ? 'Limited' : 'In Stock';

export default function AdminInventory() {
  const [stock, setStock]       = useState<StockItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('all');
  const [filter, setFilter]     = useState<'all' | 'low' | 'out'>('all');
  const [editing, setEditing]   = useState<string | null>(null);
  const [editVal, setEditVal]   = useState('');
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((products: IProduct[]) => {
        setStock(products.map((p) => ({
          slug:     p.slug,
          name:     p.name,
          category: p.category,
          price:    p.price,
          stock:    p.stock ?? 0,
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = stock.filter((item) => {
    const matchCat    = category === 'all' || item.category === category;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'low' && item.stock > 0 && item.stock < 10) || (filter === 'out' && item.stock === 0);
    return matchCat && matchSearch && matchFilter;
  });

  const startEdit = (slug: string, current: number) => {
    setEditing(slug);
    setEditVal(String(current));
  };

  const saveEdit = async (slug: string) => {
    const val = parseInt(editVal, 10);
    if (isNaN(val) || val < 0) { setEditing(null); return; }

    setSaving(true);
    try {
      await fetch(`/api/products/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: val }),
      });
      setStock((prev) => prev.map((s) => s.slug === slug ? { ...s, stock: val } : s));
    } finally {
      setSaving(false);
      setEditing(null);
    }
  };

  const lowCount = stock.filter((s) => s.stock > 0 && s.stock < 10).length;
  const outCount = stock.filter((s) => s.stock === 0).length;

  return (
    <div className="p-6 lg:p-8 space-y-6">

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Warehouse</p>
        <h2 className="font-display text-2xl font-bold text-stone-800">Inventory</h2>
      </div>

      {/* Alert strip */}
      {!loading && (lowCount > 0 || outCount > 0) && (
        <div className="flex flex-wrap gap-3">
          {outCount > 0 && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {outCount} item{outCount !== 1 ? 's' : ''} out of stock
            </div>
          )}
          {lowCount > 0 && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-sm font-medium text-amber-700">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {lowCount} item{lowCount !== 1 ? 's' : ''} low on stock
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            aria-label="Search products"
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
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <div className="flex rounded-xl border border-stone-200 bg-white overflow-hidden">
          {[
            { key: 'all', label: 'All' },
            { key: 'low', label: 'Low' },
            { key: 'out', label: 'Out' },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key as 'all' | 'low' | 'out')}
              className={`px-4 py-2.5 text-sm font-medium transition ${
                filter === key ? 'bg-brand-600 text-white' : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-stone-200 bg-white shadow-card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-brand-600" />
            <p className="mt-3 text-sm text-stone-400">Loading inventory…</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50 text-left">
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Product</th>
                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Category</th>
                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Price</th>
                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Stock</th>
                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Status</th>
                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filtered.map((item) => {
                    const gradient = categoryGradients[item.category] ?? 'from-stone-100 to-stone-200';
                    return (
                      <tr key={item.slug} className={`hover:bg-stone-50/60 transition-colors ${item.stock === 0 ? 'bg-red-50/30' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 flex-shrink-0 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-stone-400`}>
                              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                            <p className="font-medium text-stone-800 leading-tight">{item.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600 capitalize">{item.category}</span>
                        </td>
                        <td className="px-4 py-4 font-medium text-stone-700">₹{item.price.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-4">
                          {editing === item.slug ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                value={editVal}
                                onChange={(e) => setEditVal(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && saveEdit(item.slug)}
                                aria-label="Stock quantity"
                                placeholder="0"
                                className="w-20 rounded-lg border border-brand-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-brand-100"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => saveEdit(item.slug)}
                                disabled={saving}
                                className="rounded-lg bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
                              >
                                {saving ? '…' : 'Save'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditing(null)}
                                className="text-stone-400 hover:text-stone-600 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <span className={`font-semibold ${item.stock === 0 ? 'text-red-600' : item.stock < 10 ? 'text-amber-600' : 'text-stone-800'}`}>
                              {item.stock}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STOCK_BADGE(item.stock)}`}>
                            {STOCK_LABEL(item.stock)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => startEdit(item.slug, item.stock)}
                            className="rounded-lg border border-stone-200 px-2.5 py-1 text-xs font-semibold text-stone-600 transition hover:border-brand-300 hover:text-brand-600"
                          >
                            Edit Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-stone-400">
                <p className="text-sm">No items match your filters</p>
              </div>
            )}
            <div className="border-t border-stone-100 px-6 py-3 text-xs text-stone-400">
              {filtered.length} of {stock.length} items
            </div>
          </>
        )}
      </div>
    </div>
  );
}
