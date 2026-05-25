import Link from 'next/link';
import { ProductCard } from '@/components/store/ProductCard';
import { connectDB, serialize } from '@/lib/mongodb';
import { Product } from '@/lib/models/Product';

export default async function BestSellersPage() {
  await connectDB();
  const products = await Product.find({ isBestSeller: true }).sort({ createdAt: -1 }).lean().then(serialize);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b border-stone-200 bg-white">
        <div className="container py-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Customer favourites</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-stone-900">Best Sellers</h1>
          <p className="mt-2 text-stone-500">Our most loved products — chosen by thousands of happy customers.</p>
          <nav className="mt-3 flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-900">Best Sellers</span>
          </nav>
        </div>
      </div>

      {/* Stats strip */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-stone-100">
        <div className="container py-8">
          <div className="flex flex-wrap gap-8">
            {[
              { value: '12,000+', label: 'Units sold' },
              { value: '4.8★', label: 'Average rating' },
              { value: '98%', label: 'Customer satisfaction' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold text-stone-900">{stat.value}</p>
                <p className="text-sm text-stone-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-10">
        {products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white py-24 text-center">
            <p className="font-display text-xl font-bold text-stone-900">No best sellers yet</p>
            <p className="mt-2 text-stone-500">Check back soon — products marked as best sellers will appear here.</p>
            <Link href="/shop" className="mt-4 inline-block rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition">
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-stone-500">
                <span className="font-semibold text-stone-900">{products.length}</span> top-rated products
              </p>
              <Link href="/shop" className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                See full catalog →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, i) => (
                <div key={product.slug} className="relative">
                  {i < 3 && (
                    <div className="absolute -left-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white shadow-sm">
                      #{i + 1}
                    </div>
                  )}
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
