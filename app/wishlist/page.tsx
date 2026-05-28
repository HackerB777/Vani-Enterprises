'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { categoryGradients } from '@/lib/products';

export default function WishlistPage() {
  const items       = useWishlistStore((s) => s.items);
  const removeItem  = useWishlistStore((s) => s.removeItem);
  const addToCart   = useCartStore((s) => s.addItem);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b border-stone-200 bg-white">
        <div className="container py-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Saved for later</p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-stone-900">My Wishlist</h1>
          {items.length > 0 && (
            <p className="mt-1 text-sm text-stone-500">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
          )}
        </div>
      </div>

      <div className="container py-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-stone-400" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="mt-5 font-display text-2xl font-bold text-stone-900">Your wishlist is empty</p>
            <p className="mt-2 text-stone-500">Save products you love and come back to them anytime.</p>
            <Link
              href="/shop"
              className="mt-6 rounded-full bg-stone-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((product) => {
              const gradient = categoryGradients[product.category] ?? 'from-stone-100 to-stone-50';
              return (
                <div key={product.slug} className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card transition hover:shadow-card-hover">
                  <Link href={`/product/${product.slug}`} className="block">
                    <div className={`h-48 bg-gradient-to-br ${gradient}`} />
                  </Link>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      {product.category}
                    </p>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-semibold leading-snug text-stone-900 hover:text-brand-700 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-stone-900">₹{product.price.toLocaleString('en-IN')}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-stone-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    <div className="mt-auto flex gap-2">
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="flex-1 rounded-full bg-stone-900 py-2 text-xs font-semibold text-white transition hover:bg-brand-700"
                      >
                        Add to Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(product.slug)}
                        aria-label="Remove from wishlist"
                        className="rounded-full border border-stone-200 px-3 py-2 text-xs text-stone-500 transition hover:border-red-200 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
