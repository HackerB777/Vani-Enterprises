import Link from 'next/link';
import { ProductCard } from '@/components/store/ProductCard';
import { connectDB, serialize } from '@/lib/mongodb';
import { Product } from '@/lib/models/Product';
import { getDiscountPercent } from '@/lib/products';

export default async function OffersPage() {
  await connectDB();
  const products = await Product.find({ isOnSale: true }).sort({ createdAt: -1 }).lean().then(serialize);

  const maxSaving = products.reduce((max, p) => {
    if (!p.originalPrice) return max;
    return Math.max(max, getDiscountPercent(p.price, p.originalPrice));
  }, 0);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 to-brand-900 py-16">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-orange-300 blur-3xl" />
        </div>
        <div className="container relative">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
                Limited Time
              </span>
              <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
                {maxSaving > 0 ? `Up to ${maxSaving}% Off` : 'Sale On Now'}
              </h1>
              <p className="mt-3 text-lg text-brand-200">
                Hand-picked deals on premium home collections. While stocks last.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 text-center backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-200">Sale Items</p>
              <p className="font-display text-5xl font-bold text-white">{products.length}</p>
              <p className="text-sm text-brand-300">Products on sale</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon banner */}
      <div className="bg-amber-50 border-b border-amber-200 py-3">
        <div className="container text-center text-sm font-medium text-amber-800">
          Use code{' '}
          <span className="rounded-md bg-amber-200 px-2 py-0.5 font-mono font-bold tracking-wider">VANI10</span>
          {' '}for an extra 10% off your first order
        </div>
      </div>

      <div className="container py-10">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-stone-500">
            <span className="font-semibold text-stone-900">{products.length}</span> items on sale
          </p>
          <Link href="/shop" className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
            View all products →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white py-24 text-center">
            <p className="font-display text-xl font-bold text-stone-900">No active offers right now</p>
            <p className="mt-2 text-stone-500">Check back soon — we run sales regularly!</p>
            <Link href="/shop" className="mt-4 rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}

        {/* Coupon info */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { code: 'VANI10',   desc: '10% off your first order', min: 'Min. order ₹500' },
            { code: 'SAVE200',  desc: '₹200 off on orders above ₹2,000', min: 'Min. order ₹2,000' },
            { code: 'FREESHIP', desc: 'Free shipping on any order', min: 'No minimum' },
          ].map((coupon) => (
            <div key={coupon.code} className="rounded-2xl border border-dashed border-brand-300 bg-brand-50 p-5">
              <p className="font-mono text-lg font-bold tracking-wider text-brand-700">{coupon.code}</p>
              <p className="mt-1 text-sm font-medium text-stone-800">{coupon.desc}</p>
              <p className="mt-0.5 text-xs text-stone-500">{coupon.min}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
