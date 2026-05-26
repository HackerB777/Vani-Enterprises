import Link from 'next/link';
import { ProductCard } from '@/components/store/ProductCard';
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

export default async function NewArrivalsPage() {
  const { data } = await supabase.from('products').select('*').eq('isNewArrival', true).order('createdAt', { ascending: false });
  const products = data ?? [];

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b border-stone-200 bg-white">
        <div className="container py-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Just landed</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-stone-900">New Arrivals</h1>
          <p className="mt-2 text-stone-500">Fresh additions to our collection — be the first to get them.</p>
          <nav className="mt-3 flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-900">New Arrivals</span>
          </nav>
        </div>
      </div>

      {/* Hero strip */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-b border-stone-100">
        <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display text-2xl font-bold text-stone-900">
              {products.length} new product{products.length !== 1 ? 's' : ''} this season
            </p>
            <p className="mt-1 text-stone-500 text-sm">Updated weekly with the freshest handpicked pieces.</p>
          </div>
          <Link
            href="/shop"
            className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-white"
          >
            View all products →
          </Link>
        </div>
      </div>

      <div className="container py-10">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white py-24 text-center">
            <p className="font-display text-xl font-bold text-stone-900">Check back soon!</p>
            <p className="mt-2 text-stone-500">New arrivals are added every week.</p>
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
      </div>
    </div>
  );
}
