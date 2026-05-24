'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Product, categoryGradients, getDiscountPercent } from '@/lib/products';
import { StarRating } from './StarRating';

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      fill={filled ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const addItem       = useCartStore((s) => s.addItem);
  const toggleItem    = useWishlistStore((s) => s.toggleItem);
  const wishlistItems = useWishlistStore((s) => s.items);
  const [added, setAdded] = useState(false);

  const isWishlisted  = wishlistItems.some((i) => i.slug === product.slug);
  const gradient      = categoryGradients[product.category] ?? 'from-stone-100 to-stone-50';
  const discountPct   = product.originalPrice
    ? getDiscountPercent(product.price, product.originalPrice)
    : 0;

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {/* Image / placeholder */}
      <Link href={`/product/${product.slug}`} className="relative block flex-shrink-0 overflow-hidden">
        <div
          className={`relative h-52 w-full bg-gradient-to-br ${gradient} ${compact ? 'h-44' : 'h-52'} flex items-end justify-end p-3`}
        >
          {/* Decorative circle */}
          <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-2xl" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNewArrival && (
              <span className="rounded-full bg-sky-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                New
              </span>
            )}
            {product.isBestSeller && (
              <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                Best Seller
              </span>
            )}
            {discountPct > 0 && (
              <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                {discountPct}% Off
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleItem(product);
            }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`relative z-10 rounded-full p-1.5 shadow-sm transition-all duration-200 ${
              isWishlisted
                ? 'bg-red-50 text-red-500 hover:bg-red-100'
                : 'bg-white/90 text-stone-400 opacity-0 group-hover:opacity-100 hover:text-red-500'
            }`}
          >
            <HeartIcon filled={isWishlisted} />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/shop?category=${product.category}`} className="w-fit">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 hover:text-brand-600 transition-colors">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </span>
        </Link>

        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-stone-900 transition-colors hover:text-brand-700">
            {product.name}
          </h3>
        </Link>

        {product.rating ? (
          <StarRating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
        ) : null}

        {/* Price row */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-stone-900">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
              added
                ? 'bg-green-600 text-white'
                : 'bg-stone-900 text-white hover:bg-brand-700'
            }`}
          >
            {added ? (
              'Added!'
            ) : (
              <>
                <BagIcon />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
