import Link from 'next/link';
import { ProductCard } from '@/components/store/ProductCard';
import { HeroSlider } from '@/components/HeroSlider';
import { UserWelcomeBanner } from '@/components/store/UserWelcomeBanner';
import { supabase } from '@/lib/supabase';
import { categories } from '@/lib/products';

export const revalidate = 60;

/* ── Tiny SVG icons for the category strip ──────────────── */
const CAT_ICONS: Record<string, string> = {
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
};

/* ── Section header used for deal zones ─────────────────── */
function SectionHeader({
  label,
  title,
  href,
  labelColor = 'text-brand-600',
  viewAll = 'View All',
}: {
  label: string;
  title: string;
  href: string;
  labelColor?: string;
  viewAll?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 mb-5">
      <div className="flex items-center gap-3">
        <div className={`w-1 h-8 rounded-full bg-current ${labelColor}`} />
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-widest ${labelColor}`}>{label}</p>
          <h2 className="font-display text-xl font-bold text-stone-900 leading-tight">{title}</h2>
        </div>
      </div>
      <Link
        href={href}
        className="shrink-0 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-semibold text-stone-600 shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
      >
        {viewAll} →
      </Link>
    </div>
  );
}

/* ── Horizontal scrollable product row ──────────────────── */
function ProductRow({ products }: { products: Record<string, unknown>[] }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent snap-x snap-mandatory">
      {products.map((product) => (
        <div key={product.slug as string} className="flex-shrink-0 w-44 sm:w-52 snap-start">
          <ProductCard product={product as never} compact />
        </div>
      ))}
    </div>
  );
}

export default async function HomePage() {
  const [
    { data: bestSellersData },
    { data: electronicsData },
    { data: newArrivalsData },
    { data: giftsData },
    { data: dealsData },
    { data: homeItemsData },
  ] = await Promise.all([
    supabase.from('products').select('*').eq('isBestSeller', true).order('createdAt', { ascending: false }).limit(6),
    supabase.from('products').select('*').eq('category', 'electronics').order('createdAt', { ascending: false }).limit(6),
    supabase.from('products').select('*').eq('isNewArrival', true).order('createdAt', { ascending: false }).limit(6),
    supabase.from('products').select('*').eq('category', 'gifts').order('createdAt', { ascending: false }).limit(6),
    supabase.from('products').select('*').eq('isOnSale', true).order('price', { ascending: true }).limit(6),
    supabase.from('products').select('*').in('category', ['decor', 'kitchen', 'dining']).order('createdAt', { ascending: false }).limit(6),
  ]);

  const bestSellers = bestSellersData ?? [];
  const electronics = electronicsData ?? [];
  const newArrivals = newArrivalsData ?? [];
  const gifts       = giftsData       ?? [];
  const deals       = dealsData       ?? [];
  const homeItems   = homeItemsData   ?? [];

  return (
    <>
      {/* ── Hero ── */}
      <HeroSlider />

      {/* ── User greeting banner ── */}
      <UserWelcomeBanner />

      {/* ── Trust bar ── */}
      <div className="border-b border-stone-100 bg-white shadow-sm">
        <div className="container">
          <div className="flex items-center justify-around divide-x divide-stone-100 py-3 overflow-x-auto">
            {[
              { icon: '🚚', text: 'Free shipping above ₹999' },
              { icon: '💳', text: 'Razorpay & COD' },
              { icon: '↩️', text: '7-day easy returns' },
              { icon: '✅', text: 'Genuine products' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 px-5 py-1 shrink-0">
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-medium text-stone-600 whitespace-nowrap">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category icon strip ── */}
      <section className="bg-white border-b border-stone-100 py-5">
        <div className="container">
          <div className="flex items-start gap-2 overflow-x-auto pb-1 scrollbar-thin snap-x">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 snap-start shrink-0 w-20 group"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-50 border border-stone-100 text-3xl transition-all group-hover:bg-brand-50 group-hover:border-brand-200 group-hover:scale-105">
                  {CAT_ICONS[cat.slug] ?? '🛍️'}
                </div>
                <span className="text-center text-[10px] font-semibold text-stone-600 leading-tight line-clamp-2">
                  {cat.name.split(' ')[0]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Deal of the Day — on-sale products ── */}
      {deals.length > 0 && (
        <section className="bg-white border-b border-stone-100 py-6">
          <div className="container">
            <SectionHeader
              label="🔥 Limited Time"
              title="Best Deals Today"
              href="/offers"
              labelColor="text-red-500"
              viewAll="View Offers"
            />
            <ProductRow products={deals} />
          </div>
        </section>
      )}

      {/* ── Best Sellers ── */}
      {bestSellers.length > 0 && (
        <section className="bg-white border-b border-stone-100 py-6">
          <div className="container">
            <SectionHeader
              label="Trending"
              title="Best Sellers"
              href="/best-sellers"
              labelColor="text-amber-500"
              viewAll="View All"
            />
            <ProductRow products={bestSellers} />
          </div>
        </section>
      )}

      {/* ── Promo banner ── */}
      <section className="py-4 bg-stone-50 border-b border-stone-100">
        <div className="container">
          <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">First Order Offer</p>
              <h2 className="font-display text-2xl font-bold text-white">
                Use <span className="rounded-lg bg-white/20 px-2 py-0.5 font-mono text-yellow-300">VANI10</span> for 10% off
              </h2>
              <p className="mt-1 text-sm text-white/70">On orders above ₹999</p>
            </div>
            <Link
              href="/shop"
              className="shrink-0 rounded-full bg-white px-7 py-3 text-sm font-bold text-indigo-700 shadow-xl transition hover:scale-105 active:scale-95"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Electronics ── */}
      {electronics.length > 0 && (
        <section className="bg-white border-b border-stone-100 py-6">
          <div className="container">
            <SectionHeader
              label="Gadgets & Appliances"
              title="Top Electronics"
              href="/shop?category=electronics"
              labelColor="text-blue-600"
              viewAll="Shop Electronics"
            />
            <ProductRow products={electronics} />
          </div>
        </section>
      )}

      {/* ── Home & Kitchen ── */}
      {homeItems.length > 0 && (
        <section className="bg-white border-b border-stone-100 py-6">
          <div className="container">
            <SectionHeader
              label="Decor · Kitchen · Dining"
              title="Home Essentials"
              href="/shop"
              labelColor="text-orange-500"
              viewAll="Explore Home"
            />
            <ProductRow products={homeItems} />
          </div>
        </section>
      )}

      {/* ── New Arrivals ── */}
      {newArrivals.length > 0 && (
        <section className="bg-white border-b border-stone-100 py-6">
          <div className="container">
            <SectionHeader
              label="Just In"
              title="New Arrivals"
              href="/new-arrivals"
              labelColor="text-sky-500"
              viewAll="View All New"
            />
            <ProductRow products={newArrivals} />
          </div>
        </section>
      )}

      {/* ── Gifts & Hampers ── */}
      {gifts.length > 0 && (
        <section className="bg-white border-b border-stone-100 py-6">
          <div className="container">
            <SectionHeader
              label="For Every Occasion"
              title="Gifts & Hampers"
              href="/shop?category=gifts"
              labelColor="text-rose-500"
              viewAll="Shop Gifts"
            />
            <ProductRow products={gifts} />
          </div>
        </section>
      )}

      {/* ── Category grid ── */}
      <section className="bg-stone-50 border-b border-stone-100 py-8">
        <div className="container">
          <h2 className="mb-5 font-display text-xl font-bold text-stone-900">Shop by Category</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className="group flex flex-col items-center gap-2 rounded-xl bg-white border border-stone-100 p-4 text-center shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
              >
                <span className="text-3xl">{CAT_ICONS[cat.slug] ?? '🛍️'}</span>
                <span className="text-xs font-semibold text-stone-700 leading-tight line-clamp-2">
                  {cat.name}
                </span>
                <span className="text-[10px] text-stone-400">{cat.count}+ items</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Collection ── */}
      <section className="bg-white border-b border-stone-100 py-8">
        <div className="container">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-brand-600">Our Collection</p>
              <h2 className="font-display text-xl font-bold text-stone-900">All Products</h2>
            </div>
            <Link
              href="/shop"
              className="shrink-0 rounded-full bg-brand-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-brand-700"
            >
              Browse All →
            </Link>
          </div>

          {/* Category grid tiles */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 p-4 transition hover:border-brand-200 hover:bg-brand-50 hover:shadow-sm"
              >
                <span className="text-2xl">{CAT_ICONS[cat.slug] ?? '🛍️'}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-800 group-hover:text-brand-700 leading-tight truncate">
                    {cat.name}
                  </p>
                  <p className="text-[11px] text-stone-400">{cat.count}+ items</p>
                </div>
                <svg className="ml-auto shrink-0 text-stone-300 group-hover:text-brand-400 transition-colors" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link href="/shop" className="text-sm font-semibold text-brand-600 hover:underline underline-offset-4">
              View all {categories.length} categories →
            </Link>
          </div>
        </div>
      </section>

      {/* ── About strip ── */}
      <section className="bg-white py-12">
        <div className="container flex flex-col items-center text-center gap-4">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Our Story</p>
          <h2 className="font-display text-2xl font-bold text-stone-900 max-w-lg">
            Rooted in Chennai, delivering quality across India since 2014
          </h2>
          <p className="text-sm text-stone-500 max-w-xl leading-relaxed">
            Vani Enterprises brings you the best in home electronics, curated gifts, and premium home essentials — all at honest prices with a quality guarantee you can trust.
          </p>
          <div className="flex items-center gap-10 mt-2">
            {[{ v: '10+', l: 'Years' }, { v: '500+', l: 'Products' }, { v: '10K+', l: 'Happy Homes' }].map(({ v, l }) => (
              <div key={l} className="text-center">
                <p className="font-display text-2xl font-bold text-brand-600">{v}</p>
                <p className="text-xs text-stone-500">{l}</p>
              </div>
            ))}
          </div>
          <Link
            href="/about"
            className="mt-2 rounded-full border border-brand-200 bg-brand-50 px-6 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
          >
            Learn more →
          </Link>
        </div>
      </section>
    </>
  );
}
