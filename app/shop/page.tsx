'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllProducts, filterCategories } from '@/lib/products';
import { ProductCard } from '@/components/store/ProductCard';

function FilterIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
    </svg>
  );
}

const sortOptions = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'newest',     label: 'Newest First' },
];

export default function ShopPage() {
  const allProducts = useMemo(() => getAllProducts(), []);
  const [category, setCategory] = useState('all');
  const [sort, setSort]         = useState('featured');
  const [search, setSearch]     = useState('');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Read category from URL search param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat) setCategory(cat);
  }, []);

  const filtered = useMemo(() => {
    return allProducts
      .filter((p) => category === 'all' || p.category === category)
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => p.price <= maxPrice)
      .filter((p) => !onlyOnSale || p.isOnSale)
      .sort((a, b) => {
        switch (sort) {
          case 'price_asc':  return a.price - b.price;
          case 'price_desc': return b.price - a.price;
          case 'rating':     return (b.rating ?? 0) - (a.rating ?? 0);
          case 'newest':     return a.isNewArrival ? -1 : 1;
          default:           return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        }
      });
  }, [allProducts, category, sort, search, maxPrice, onlyOnSale]);

  const FilterPanel = () => (
    <div className="space-y-7">
      {/* Search */}
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-stone-500">
          Search
        </label>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 outline-none transition focus:border-brand-400 focus:bg-white"
        />
      </div>

      {/* Category */}
      <div>
        <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-stone-500">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {filterCategories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setCategory(cat.slug)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                category === cat.slug
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Max Price</label>
          <span className="text-sm font-semibold text-stone-900">₹{maxPrice.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min={100}
          max={10000}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-brand-600"
        />
        <div className="mt-1 flex justify-between text-[10px] text-stone-400">
          <span>₹100</span>
          <span>₹10,000</span>
        </div>
      </div>

      {/* Sale only */}
      <label className="flex cursor-pointer items-center gap-3">
        <div className="relative">
          <input
            type="checkbox"
            aria-label="Show sale items only"
            checked={onlyOnSale}
            onChange={(e) => setOnlyOnSale(e.target.checked)}
            className="sr-only"
          />
          <div className={`h-5 w-9 rounded-full transition-colors ${onlyOnSale ? 'bg-brand-600' : 'bg-stone-200'}`} />
          <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${onlyOnSale ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </div>
        <span className="text-sm font-medium text-stone-700">Sale items only</span>
      </label>

      {/* Reset */}
      <button
        type="button"
        onClick={() => {
          setCategory('all');
          setSearch('');
          setMaxPrice(10000);
          setOnlyOnSale(false);
          setSort('featured');
        }}
        className="w-full rounded-xl border border-stone-200 py-2 text-xs font-semibold text-stone-600 transition hover:bg-stone-100"
      >
        Reset filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="border-b border-stone-200 bg-white">
        <div className="container py-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Our Collection</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-stone-900">All Products</h1>
          <nav className="mt-3 flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-900">Shop</span>
          </nav>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Mobile filter toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 lg:hidden"
          >
            <FilterIcon />
            Filters
          </button>

          <p className="text-sm text-stone-500">
            <span className="font-semibold text-stone-900">{filtered.length}</span> products found
          </p>

          {/* Sort */}
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 outline-none shadow-sm transition focus:border-brand-400"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar — desktop always visible, mobile conditional */}
          <aside
            className={`rounded-2xl border border-stone-200 bg-white p-6 shadow-soft lg:block ${
              sidebarOpen ? 'block' : 'hidden'
            } lg:self-start lg:sticky lg:top-24`}
          >
            <FilterPanel />
          </aside>

          {/* Product grid */}
          <div>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 py-20 text-center">
                <p className="font-display text-xl font-semibold text-stone-900">No products found</p>
                <p className="mt-2 text-sm text-stone-500">Try adjusting your filters or search term.</p>
                <button
                  type="button"
                  onClick={() => { setCategory('all'); setSearch(''); setMaxPrice(10000); setOnlyOnSale(false); }}
                  className="mt-4 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
