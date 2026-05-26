'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const slides = [
  {
    tag:       "Chennai's Favourite Store",
    title:     'Everything for',
    highlight: 'Your Home',
    tail:      'At Honest Prices',
    sub:       'Electronics, kitchen, clothing, decor & more — trusted brands, fast delivery across India.',
    cta:       { label: 'Shop Now',     href: '/shop' },
    cta2:      { label: 'New Arrivals', href: '/new-arrivals' },
    // Vibrant deep purple-to-indigo
    from:  '#4f46e5',
    via:   '#7c3aed',
    to:    '#9333ea',
    chip:  'bg-white/20 text-white',
    accent:'#fbbf24',
    icon:  '🛍️',
    tags:  ['Electronics', 'Kitchen', 'Clothing', 'Gifts'],
  },
  {
    tag:       'Gadgets & Appliances',
    title:     'Top Brand',
    highlight: 'Electronics',
    tail:      'Best Prices Guaranteed',
    sub:       'TVs, ACs, refrigerators, washing machines, mixers & air fryers — all with warranty.',
    cta:       { label: 'Shop Electronics', href: '/shop?category=electronics' },
    cta2:      { label: 'View Offers',       href: '/offers' },
    // Electric blue-to-cyan
    from:  '#0369a1',
    via:   '#0284c7',
    to:    '#06b6d4',
    chip:  'bg-white/20 text-white',
    accent:'#34d399',
    icon:  '🖥️',
    tags:  ['TV', 'AC', 'Refrigerator', 'Washing Machine'],
  },
  {
    tag:       'Kitchen & Cookware',
    title:     'Authentic Brass',
    highlight: '& Steel Ware',
    tail:      'Built to Last Generations',
    sub:       'Traditional brass, iron, and stainless steel cookware — robust quality at unbeatable prices.',
    cta:       { label: 'Shop Cookware', href: '/shop?category=kitchen' },
    cta2:      { label: 'Best Sellers',  href: '/best-sellers' },
    // Warm orange-to-red
    from:  '#ea580c',
    via:   '#dc2626',
    to:    '#b91c1c',
    chip:  'bg-white/20 text-white',
    accent:'#fde68a',
    icon:  '🍳',
    tags:  ['Cookware', 'Pressure Cookers', 'Knives', 'Spice Box'],
  },
  {
    tag:       'Fashion & Lifestyle',
    title:     'Clothing,',
    highlight: 'Accessories & More',
    tail:      'Style for Every Occasion',
    sub:       "Men's, women's & kids' clothing, bags, belts, mats, towels — everything for your lifestyle.",
    cta:       { label: 'Shop Clothing',   href: '/shop?category=clothing' },
    cta2:      { label: 'Accessories',     href: '/shop?category=fashion' },
    // Hot rose-to-fuchsia
    from:  '#be185d',
    via:   '#db2777',
    to:    '#c026d3',
    chip:  'bg-white/20 text-white',
    accent:'#f9a8d4',
    icon:  '👗',
    tags:  ['Kurtas', 'Accessories', 'Towels', 'Mats & Rugs'],
  },
  {
    tag:       'Home Decor & Wellness',
    title:     'Artisan Crafted',
    highlight: 'Décor & Gifts',
    tail:      'Elevate Every Corner',
    sub:       'Brass sculptures, handmade candles, puja sets, gift hampers and wellness products.',
    cta:       { label: 'Shop Decor', href: '/shop?category=decor' },
    cta2:      { label: 'Gifts',      href: '/shop?category=gifts' },
    // Rich emerald-to-teal
    from:  '#065f46',
    via:   '#047857',
    to:    '#0f766e',
    chip:  'bg-white/20 text-white',
    accent:'#6ee7b7',
    icon:  '🏺',
    tags:  ['Brass Diyas', 'Puja Sets', 'Gift Hampers', 'Candles'],
  },
];

const STATS = [
  { value: '500+',  label: 'Products'        },
  { value: '10K+',  label: 'Happy Customers' },
  { value: '50+',   label: 'Artisan Partners'},
  { value: '4.8★',  label: 'Avg. Rating'     },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const [query,   setQuery]   = useState('');
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?search=${encodeURIComponent(q)}` : '/shop');
  }

  const go   = useCallback((idx: number) => setCurrent(idx), []);
  const next = useCallback(() => go((current + 1) % slides.length), [current, go]);
  const prev = useCallback(() => go((current - 1 + slides.length) % slides.length), [current, go]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next, paused]);

  const s = slides[current];

  const cssVars = {
    '--slide-from':   s.from,
    '--slide-via':    s.via,
    '--slide-to':     s.to,
    '--slide-accent': s.accent,
  } as React.CSSProperties;

  return (
    <section
      className="hero-slider relative overflow-hidden transition-all duration-700"
      style={cssVars}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Large top-right circle */}
        <div className="absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-white/[0.06]" />
        {/* Bottom-left ellipse */}
        <div className="absolute -bottom-20 -left-20 h-[360px] w-[360px] rounded-full bg-black/[0.08]" />
        {/* Centre glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-white/[0.04] blur-3xl" />
        {/* Dot pattern */}
        <div className="hero-dot-pattern absolute inset-0 opacity-[0.06]" />
      </div>

      <div className="container relative z-10 py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">

          {/* ── Left content — dark admin-style card ── */}
          <div key={current} className="animate-hero-text max-w-xl w-full">
            <div className="rounded-3xl bg-stone-950/88 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_64px_rgba(0,0,0,0.6)] p-7 lg:p-9">

              {/* Tag chip */}
              <span className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-stone-300 border border-stone-700">
                <span className="hero-accent-bg h-1.5 w-1.5 rounded-full animate-pulse" />
                {s.tag}
              </span>

              {/* Heading */}
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
                {s.title}{' '}
                <span className="relative inline-block">
                  <span className="hero-accent">{s.highlight}</span>
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
                    height="5"
                    viewBox="0 0 200 5"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 4 Q100 0 200 4"
                      stroke="var(--slide-accent)"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                  </svg>
                </span>{' '}
                {s.tail}
              </h1>

              <p className="mt-4 text-sm leading-relaxed text-stone-400 sm:text-base">
                {s.sub}
              </p>

              {/* Search bar */}
              <form
                onSubmit={handleSearch}
                className="mt-7 flex w-full overflow-hidden rounded-2xl bg-stone-900 border border-stone-700 shadow-lg"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products…"
                  className="flex-1 px-5 py-3.5 text-sm text-stone-100 placeholder-stone-500 outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="hero-search-btn m-1.5 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 active:scale-95 shrink-0"
                >
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                  </svg>
                  Search
                </button>
              </form>

              {/* Quick category chips */}
              <div className="mt-3 flex flex-wrap gap-2">
                {s.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => router.push(`/shop?search=${encodeURIComponent(tag)}`)}
                    className="rounded-full bg-stone-900 border border-stone-700 px-3.5 py-1 text-xs font-semibold text-stone-400 transition hover:border-stone-500 hover:text-stone-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={s.cta.href}
                  className="hero-from-color rounded-full bg-white px-7 py-3 text-sm font-bold shadow-lg transition hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  {s.cta.label}
                </Link>
                <Link
                  href={s.cta2.href}
                  className="rounded-full border border-stone-600 bg-stone-900 px-7 py-3 text-sm font-semibold text-stone-300 transition hover:bg-stone-800 hover:text-white active:scale-95"
                >
                  {s.cta2.label}
                </Link>
              </div>

              {/* Stats — admin KPI mini-cards */}
              <div className="mt-7 grid grid-cols-4 gap-3 border-t border-stone-800 pt-6">
                {STATS.map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-stone-900 border border-stone-800 p-3 text-center">
                    <p className="font-display text-lg font-extrabold text-white sm:text-xl">{stat.value}</p>
                    <p className="mt-0.5 text-[10px] text-stone-500 leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* ── Right — visual panel ── */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-96 h-96">

              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border border-white/15 animate-spin-slow" />
              {/* Inner ring */}
              <div className="absolute inset-8 rounded-full border border-dashed border-white/10" />

              {/* Centre card */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 px-10 py-8 shadow-2xl">
                  <span className="text-6xl drop-shadow-lg">{s.icon}</span>
                  <p className="text-lg font-bold text-white text-center leading-tight">{s.highlight}</p>
                  <p className="text-xs text-white/60 text-center">{s.tag}</p>
                </div>
              </div>

              {/* Floating badge — top right */}
              <div className="delay-0 absolute -right-6 top-12 animate-float rounded-2xl bg-white px-4 py-3 shadow-xl border border-white/50">
                <p className="hero-from-color text-xs font-bold">Free Shipping</p>
                <p className="text-[10px] text-stone-500">Above ₹999</p>
              </div>

              {/* Floating badge — bottom left */}
              <div className="delay-800 absolute -left-6 bottom-20 animate-float rounded-2xl bg-white px-4 py-3 shadow-xl border border-white/50">
                <p className="hero-from-color text-xs font-bold">COD Available</p>
                <p className="text-[10px] text-stone-500">Pan India</p>
              </div>

              {/* Floating badge — bottom right */}
              <div className="delay-1600 absolute right-0 bottom-6 animate-float rounded-2xl bg-white px-4 py-3 shadow-xl border border-white/50">
                <p className="hero-from-color text-xs font-bold">7-Day Returns</p>
                <p className="text-[10px] text-stone-500">Easy & Free</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Slide controls ── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white border border-white/25 backdrop-blur-sm transition hover:bg-white/35"
        >
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-7 h-2.5 bg-white'
                  : 'w-2.5 h-2.5 bg-white/35 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white border border-white/25 backdrop-blur-sm transition hover:bg-white/35"
        >
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── Progress bar ── */}
      {!paused && (
        <div className="absolute bottom-0 left-0 h-1 w-full bg-white/10 z-20">
          <div key={current} className="hero-progress h-full bg-white/50" />
        </div>
      )}
    </section>
  );
}
