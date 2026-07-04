'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/store/ProductCard';
import type { IProduct } from '@/lib/models/Product';

/* ── Icon + display-name maps — covers every category in the DB ── */
const CAT_ICONS: Record<string, string> = {
  all:         '🛍️',
  electronics: '🖥️',
  kitchen:     '🍳',
  clothing:    '👗',
  fashion:     '👜',
  decor:       '🏺',
  linen:       '🛁',
  mats:        '🧘',
  dining:      '🍽️',
  storage:     '📦',
  gifts:       '🎁',
  bath:        '🕯️',
  garden:      '🌿',
  bedding:     '🛏️',
  textiles:    '🧵',
  furniture:   '🪑',
  toys:        '🧸',
  sports:      '⚽',
  books:       '📚',
  beauty:      '💄',
  jewellery:   '💍',
  footwear:    '👟',
  stationery:  '✏️',
};

const CAT_NAMES: Record<string, string> = {
  electronics: 'Electronics',
  kitchen:     'Kitchen & Cookware',
  clothing:    'Clothing & Apparel',
  fashion:     'Fashion Accessories',
  decor:       'Home Decor',
  linen:       'Towels & Linen',
  mats:        'Mats & Rugs',
  dining:      'Dining & Tableware',
  storage:     'Storage & Organise',
  gifts:       'Gifts & Hampers',
  bath:        'Bath & Wellness',
  garden:      'Garden & Outdoors',
  bedding:     'Bedding & Cushions',
  textiles:    'Textiles & Sarees',
  furniture:   'Furniture',
  toys:        'Toys & Games',
  sports:      'Sports & Fitness',
  books:       'Books & Stationery',
  beauty:      'Beauty & Personal Care',
  jewellery:   'Jewellery',
  footwear:    'Footwear',
  stationery:  'Stationery',
};

function catName(slug: string) {
  return CAT_NAMES[slug] ?? (slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '));
}

const sortOptions = [
  { value: 'featured',   label: 'Relevance' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'newest',     label: 'Newest First' },
];

export default function ShopPage() {
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [loading, setLoading]         = useState(true);
  const [category, setCategory]       = useState('all');
  const [sort, setSort]               = useState('featured');
  const [search, setSearch]           = useState('');
  const [maxPrice, setMaxPrice]       = useState(50000);
  const [onlyOnSale, setOnlyOnSale]   = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Read URL params once on mount */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    const q   = params.get('search');
    if (cat) setCategory(cat);
    if (q)   setSearch(q);
  }, []);

  /* Fetch all products once */
  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then((r) => r.json())
      .then((data: IProduct[]) => { setAllProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  /* Dynamic categories derived from actual DB products */
  const dynamicCategories = useMemo(() => {
    const seen = new Set<string>();
    const list: { slug: string; name: string }[] = [{ slug: 'all', name: 'All Categories' }];
    allProducts.forEach((p) => {
      if (!seen.has(p.category)) {
        seen.add(p.category);
        list.push({ slug: p.category, name: catName(p.category) });
      }
    });
    return list;
  }, [allProducts]);

  /* Max price ceiling from real data */
  const priceCeil = useMemo(() => {
    if (!allProducts.length) return 50000;
    return Math.ceil(Math.max(...allProducts.map((p) => p.price)) / 1000) * 1000;
  }, [allProducts]);

  const filtered = useMemo(() => {
    return allProducts
      .filter((p) => category === 'all' || p.category === category)
      .filter((p) => {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q) ||
          (p.subcategory ?? '').toLowerCase().includes(q)
        );
      })
      .filter((p) => p.price <= maxPrice)
      .filter((p) => !onlyOnSale || p.isOnSale)
      .sort((a, b) => {
        switch (sort) {
          case 'price_asc':  return a.price - b.price;
          case 'price_desc': return b.price - a.price;
          case 'rating':     return (b.rating ?? 0) - (a.rating ?? 0);
          case 'newest':     return (a.isNewArrival ? 0 : 1) - (b.isNewArrival ? 0 : 1);
          default:           return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        }
      });
  }, [allProducts, category, sort, search, maxPrice, onlyOnSale]);

  function resetFilters() {
    setCategory('all');
    setSearch('');
    setMaxPrice(priceCeil);
    setOnlyOnSale(false);
    setSort('featured');
  }

  const activeFilters = category !== 'all' || onlyOnSale || maxPrice < priceCeil || search;
  const currentCatName = dynamicCategories.find((c) => c.slug === category)?.name ?? 'All Products';

  return (
    <div className="min-h-screen bg-stone-50">

      {/* ── Page header ── */}
      <div className="bg-stone-900 text-white">
        <div className="container py-5">
          <nav className="flex items-center gap-2 text-xs text-stone-400 mb-1" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
            {category !== 'all' && (
              <>
                <span aria-hidden="true">/</span>
                <span className="text-stone-200">{currentCatName}</span>
              </>
            )}
          </nav>
          <h1 className="font-display text-2xl font-bold text-white">
            {category === 'all' ? 'All Products' : currentCatName}
          </h1>
          <p className="mt-1 text-xs text-stone-400">
            {loading ? (
              'Loading products…'
            ) : (
              <>
                <span className="text-stone-200 font-semibold">{filtered.length}</span> products
                {search && <> for &ldquo;<span className="text-stone-200">{search}</span>&rdquo;</>}
              </>
            )}
          </p>
        </div>
      </div>

      {/* ── Category tab strip ── */}
      <div className="bg-white border-b border-stone-100 shadow-sm">
        <div className="container">
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-8 w-24 rounded-full bg-stone-100 animate-pulse shrink-0" />
                ))
              : dynamicCategories.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setCategory(cat.slug)}
                    className={`flex items-center gap-1.5 shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      category === cat.slug
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <span role="img" aria-hidden="true">{CAT_ICONS[cat.slug] ?? '🛍️'}</span>
                    {cat.name}
                  </button>
                ))}
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle filters"
              className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all lg:hidden ${
                sidebarOpen
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
              }`}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 8h12M9 12h6" />
              </svg>
              Filters
              {activeFilters && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[9px] font-bold text-white">!</span>
              )}
            </button>

            {activeFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-brand-600 font-semibold hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 hidden sm:block">Sort by:</span>
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 outline-none shadow-sm focus:border-brand-400"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[240px_1fr]">

          {/* ── Filter sidebar ── */}
          <aside className={`lg:block ${sidebarOpen ? 'block' : 'hidden'} lg:self-start lg:sticky lg:top-20 space-y-3`}>

            {/* Search */}
            <div className="rounded-xl border border-stone-200 bg-white shadow-sm p-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">Search</p>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                aria-label="Search products"
                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-brand-400 focus:bg-white"
              />
            </div>

            {/* Price range */}
            <div className="rounded-xl border border-stone-200 bg-white shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Max Price</p>
                <span className="text-xs font-bold text-brand-700">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={100}
                max={priceCeil}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                aria-label="Maximum price filter"
                className="w-full accent-brand-600"
              />
              <div className="mt-1 flex justify-between text-[10px] text-stone-400">
                <span>₹100</span>
                <span>₹{priceCeil.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Sale only */}
            <div className="rounded-xl border border-stone-200 bg-white shadow-sm p-4">
              <label className="flex cursor-pointer items-center justify-between">
                <span className="text-sm font-medium text-stone-700">Sale items only</span>
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
              </label>
            </div>

            {/* Category list */}
            <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
              <p className="px-4 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">Category</p>
              <ul>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <li key={i} className="px-4 py-2.5">
                        <div className="h-4 w-32 rounded bg-stone-100 animate-pulse" />
                      </li>
                    ))
                  : dynamicCategories.map((cat) => (
                      <li key={cat.slug}>
                        <button
                          type="button"
                          onClick={() => setCategory(cat.slug)}
                          className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left ${
                            category === cat.slug
                              ? 'bg-brand-50 text-brand-700 font-semibold border-r-2 border-brand-600'
                              : 'text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <span role="img" aria-hidden="true">{CAT_ICONS[cat.slug] ?? '🛍️'}</span>
                          {cat.name}
                        </button>
                      </li>
                    ))}
              </ul>
            </div>

            {/* Reset */}
            {activeFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="w-full rounded-xl border border-stone-200 bg-white py-2.5 text-xs font-semibold text-stone-600 shadow-sm transition hover:bg-stone-50"
              >
                Reset all filters
              </button>
            )}
          </aside>

          {/* ── Product grid ── */}
          <div>
            {loading ? (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-72 animate-pulse rounded-xl bg-stone-200" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white py-20 text-center">
                <span className="text-5xl mb-4" aria-hidden="true">🔍</span>
                <p className="font-display text-xl font-semibold text-stone-900">No products found</p>
                <p className="mt-2 text-sm text-stone-500">Try adjusting your filters or search term.</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
                  {filtered.map((product) => (
                    <ProductCard key={product.slug} product={product} />
                  ))}
                </div>
                <p className="mt-5 text-center text-xs text-stone-400">
                  Showing {filtered.length} of {allProducts.length} products
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
