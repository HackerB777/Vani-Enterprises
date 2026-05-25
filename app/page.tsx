import Link from 'next/link';
import { ProductCard } from '@/components/store/ProductCard';
import { HeroSlider } from '@/components/HeroSlider';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import { connectDB, serialize } from '@/lib/mongodb';
import { Product } from '@/lib/models/Product';
import { categories } from '@/lib/products';

const TRUST = [
  {
    title: 'Free Shipping',
    sub:   'On orders above ₹999',
    icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
  },
  {
    title: 'Secure Payments',
    sub:   'Razorpay & COD',
    icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  },
  {
    title: '7-Day Returns',
    sub:   'Easy & hassle-free',
    icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  },
  {
    title: 'Authentic Products',
    sub:   'Direct from artisans',
    icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  },
];

export default async function HomePage() {
  await connectDB();
  const [bestSellers, newArrivals] = await Promise.all([
    Product.find({ isBestSeller: true }).sort({ createdAt: -1 }).limit(4).lean().then(serialize),
    Product.find({ isNewArrival: true }).sort({ createdAt: -1 }).limit(4).lean().then(serialize),
  ]);

  return (
    <>
      {/* ── Hero Slider ── */}
      <HeroSlider />

      {/* ── Trust bar ── */}
      <section className="border-b border-stone-100 bg-white py-5">
        <div className="container grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TRUST.map((item, i) => (
            <AnimateOnScroll key={item.title} animation="fade-up" delay={i * 80}>
              <div className="flex items-center gap-3 group">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-all group-hover:bg-brand-100 group-hover:scale-110">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-800">{item.title}</p>
                  <p className="text-xs text-stone-500">{item.sub}</p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-16 lg:py-20 bg-stone-50">
        <div className="container">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Browse</p>
                <h2 className="mt-1 font-display text-3xl font-bold text-stone-900 lg:text-4xl">
                  Shop by Category
                </h2>
              </div>
              <Link href="/shop" className="text-sm font-semibold text-brand-600 hover:underline underline-offset-4 transition">
                View all categories →
              </Link>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <AnimateOnScroll key={cat.slug} animation="zoom-in" delay={i * 60}>
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className={`h-28 bg-gradient-to-br ${cat.gradient} transition-transform duration-500 group-hover:scale-105`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-stone-800 group-hover:text-brand-700 transition-colors text-sm leading-tight">{cat.name}</p>
                    <p className="mt-0.5 text-xs text-stone-400">{cat.count}+ products</p>
                  </div>
                  <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 opacity-0 shadow-sm transition-all group-hover:opacity-100 group-hover:scale-110">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="text-brand-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Best Sellers ── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Trending</p>
                <h2 className="mt-1 font-display text-3xl font-bold text-stone-900 lg:text-4xl">Best Sellers</h2>
              </div>
              <Link href="/best-sellers" className="text-sm font-semibold text-brand-600 hover:underline underline-offset-4">
                View all →
              </Link>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {bestSellers.map((product, i) => (
              <AnimateOnScroll key={product.slug} animation="fade-up" delay={i * 70}>
                <ProductCard product={product} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promo banner ── */}
      <AnimateOnScroll animation="zoom-in">
        <section className="mx-4 my-6 overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-orange-500 lg:mx-8 lg:my-10">
          <div className="relative px-8 py-12 text-center lg:px-16 lg:py-16">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-2xl animate-float" />
              <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-white/5 blur-2xl animate-float-delayed" />
            </div>
            <p className="relative text-xs font-bold uppercase tracking-widest text-orange-200">Limited Time</p>
            <h2 className="relative mt-2 font-display text-3xl font-bold text-white lg:text-4xl">
              Use code <span className="rounded-lg bg-white/20 px-3 py-1 font-mono">VANI10</span> for 10% off
            </h2>
            <p className="relative mt-3 text-sm text-orange-100">On your first order above ₹999</p>
            <Link
              href="/shop"
              className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-brand-700 shadow-xl transition hover:shadow-glow hover:scale-105 active:scale-95"
            >
              Shop Now
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
      </AnimateOnScroll>

      {/* ── New Arrivals ── */}
      <section className="py-16 lg:py-20 bg-stone-50">
        <div className="container">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Just In</p>
                <h2 className="mt-1 font-display text-3xl font-bold text-stone-900 lg:text-4xl">New Arrivals</h2>
              </div>
              <Link href="/new-arrivals" className="text-sm font-semibold text-brand-600 hover:underline underline-offset-4">
                View all →
              </Link>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {newArrivals.map((product, i) => (
              <AnimateOnScroll key={product.slug} animation="bounce-in" delay={i * 70}>
                <ProductCard product={product} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── About strip ── */}
      <AnimateOnScroll animation="fade-up">
        <section className="border-t border-stone-100 bg-white py-16 lg:py-20">
          <div className="container grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Our Story</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-stone-900 lg:text-4xl">
                Rooted in Chennai,<br />Delivering Across India
              </h2>
              <p className="mt-4 text-stone-500 leading-relaxed">
                Vani Enterprises was born from a passion for authentic Indian craftsmanship. We partner directly with artisans and weavers across Tamil Nadu, bringing you exclusive home collections at honest prices.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-6">
                {[
                  { v: '10+', l: 'Years of Trust' },
                  { v: '500+', l: 'Products' },
                  { v: '10K+', l: 'Happy Homes' },
                ].map(({ v, l }, i) => (
                  <AnimateOnScroll key={l} animation="count-up" delay={i * 120}>
                    <div>
                      <p className="font-display text-3xl font-bold text-brand-600">{v}</p>
                      <p className="mt-0.5 text-xs text-stone-500">{l}</p>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-6 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
              >
                Learn more about us →
              </Link>
            </div>
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {categories.slice(0, 4).map((cat, i) => (
                  <AnimateOnScroll key={cat.slug} animation="zoom-in" delay={i * 100}>
                    <Link
                      href={`/shop?category=${cat.slug}`}
                      className={`group h-36 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-end p-4 overflow-hidden transition-transform hover:scale-105`}
                    >
                      <span className="rounded-lg bg-white/80 px-2.5 py-1 text-xs font-semibold text-stone-700 backdrop-blur-sm transition-transform group-hover:scale-105">
                        {cat.name}
                      </span>
                    </Link>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </div>
        </section>
      </AnimateOnScroll>
    </>
  );
}
