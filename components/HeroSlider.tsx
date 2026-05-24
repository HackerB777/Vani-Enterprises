'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const slides = [
  {
    tag:      'Chennai Home Collections',
    title:    'Exclusive Home',
    highlight:'Essentials',
    tail:     'Crafted with Care',
    sub:      'Discover premium textiles, handcrafted decor, and artisan kitchenware — curated from the finest artisans across India.',
    cta:      { label: 'Shop the Collection', href: '/shop' },
    cta2:     { label: 'New Arrivals',         href: '/new-arrivals' },
    gradient: 'from-stone-950 via-stone-900 to-brand-950',
    blob1:    'bg-brand-600',
    blob2:    'bg-orange-400',
    accent:   'text-brand-400',
  },
  {
    tag:      'Festive Season Specials',
    title:    'Premium Silk',
    highlight:'Sarees & Textiles',
    tail:     'From Kanchipuram',
    sub:      'Handwoven silk sarees, cotton kurtas, and ethnic home textiles from Tamil Nadu\'s finest weavers.',
    cta:      { label: 'Explore Textiles', href: '/shop?category=textiles' },
    cta2:     { label: 'View Offers',       href: '/offers' },
    gradient: 'from-rose-950 via-stone-900 to-stone-950',
    blob1:    'bg-rose-600',
    blob2:    'bg-pink-400',
    accent:   'text-rose-400',
  },
  {
    tag:      'Kitchen & Cookware',
    title:    'Authentic Brass',
    highlight:'& Steel Ware',
    tail:     'Built to Last Generations',
    sub:      'Traditional brass, iron, and stainless steel cookware — robust quality at unbeatable prices, straight from the manufacturer.',
    cta:      { label: 'Shop Cookware',  href: '/shop?category=kitchen' },
    cta2:     { label: 'Best Sellers',    href: '/best-sellers' },
    gradient: 'from-amber-950 via-stone-900 to-stone-950',
    blob1:    'bg-amber-500',
    blob2:    'bg-yellow-300',
    accent:   'text-amber-400',
  },
  {
    tag:      'Home Decor',
    title:    'Artisan Crafted',
    highlight:'Décor Pieces',
    tail:     'Elevate Every Corner',
    sub:      'Brass sculptures, wooden art, handmade candles and wellness products that bring warmth and character to your home.',
    cta:      { label: 'Shop Decor',   href: '/shop?category=decor' },
    cta2:     { label: 'Explore Bath', href: '/shop?category=bath' },
    gradient: 'from-emerald-950 via-stone-900 to-stone-950',
    blob1:    'bg-emerald-600',
    blob2:    'bg-teal-400',
    accent:   'text-emerald-400',
  },
];

const STATS = [
  { value: '500+', label: 'Products' },
  { value: '10K+', label: 'Happy Customers' },
  { value: '50+',  label: 'Artisan Partners' },
  { value: '4.8★', label: 'Avg. Rating' },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [prev,    setPrev]    = useState<number | null>(null);
  const [paused,  setPaused]  = useState(false);

  const go = useCallback((idx: number) => {
    setPrev(current);
    setCurrent(idx);
  }, [current]);

  const next = useCallback(() => go((current + 1) % slides.length), [current, go]);
  const prev_ = useCallback(() => go((current - 1 + slides.length) % slides.length), [current, go]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, paused]);

  const s = slides[current];

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br ${s.gradient} transition-all duration-700`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Animated blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full ${s.blob1} opacity-[0.07] blur-3xl transition-all duration-700 animate-float`} />
        <div className={`absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full ${s.blob2} opacity-[0.06] blur-3xl transition-all duration-700 animate-float-delayed`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.4))]" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="container relative py-20 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          {/* Left content */}
          <div key={current} className="max-w-xl animate-hero-text">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-stone-300 backdrop-blur-sm">
              <span className={`h-1.5 w-1.5 rounded-full ${s.blob1} animate-pulse`} />
              {s.tag}
            </span>

            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {s.title}{' '}
              <span className={`${s.accent} relative`}>
                {s.highlight}
                <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                  <path d="M0 5 Q100 0 200 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" className="animate-draw" style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }} />
                </svg>
              </span>{' '}
              {s.tail}
            </h1>

            <p className="mt-6 text-base leading-relaxed text-stone-400 sm:text-lg">
              {s.sub}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={s.cta.href}
                className="rounded-full bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-700 hover:shadow-glow active:scale-95"
              >
                {s.cta.label}
              </Link>
              <Link
                href={s.cta2.href}
                className="rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 active:scale-95"
              >
                {s.cta2.label}
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-4 gap-4 border-t border-white/10 pt-8">
              {STATS.map((stat, i) => (
                <div key={stat.label} className="animate-count-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <p className={`font-display text-xl font-bold ${s.accent} sm:text-2xl`}>{stat.value}</p>
                  <p className="mt-0.5 text-xs text-stone-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — decorative cards */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-80 h-80">
              {/* Rotating ring */}
              <div className={`absolute inset-0 rounded-full border-2 border-dashed border-white/10 animate-spin-slow`} />
              {/* Center logo area */}
              <div className={`absolute inset-8 rounded-full bg-gradient-to-br ${s.blob1} opacity-10 blur-xl animate-float`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.jpg" alt="Vani Enterprises" className="logo-screen h-24 w-auto mx-auto" />
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -right-4 top-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 px-3 py-2 animate-float" style={{ animationDelay: '0.5s' }}>
                <p className="text-xs font-bold text-white">Free Shipping</p>
                <p className="text-[10px] text-stone-400">Above ₹999</p>
              </div>
              <div className="absolute -left-4 bottom-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 px-3 py-2 animate-float-delayed">
                <p className="text-xs font-bold text-white">COD Available</p>
                <p className="text-[10px] text-stone-400">Pan India</p>
              </div>
              <div className="absolute right-0 bottom-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 px-3 py-2 animate-float" style={{ animationDelay: '1s' }}>
                <p className="text-xs font-bold text-white">7-Day Returns</p>
                <p className="text-[10px] text-stone-400">Easy & Free</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {/* Prev */}
        <button
          type="button"
          onClick={prev_}
          aria-label="Previous slide"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 h-2.5 bg-brand-400'
                  : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      {!paused && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-brand-500/40 w-full">
          <div
            key={current}
            className="h-full bg-brand-400"
            style={{ animation: 'progressBar 5s linear forwards' }}
          />
        </div>
      )}
    </section>
  );
}
