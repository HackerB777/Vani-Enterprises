'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import type { IProduct } from '@/lib/models/Product';
import { categoryGradients, getDiscountPercent } from '@/lib/products';

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
  furniture:   '🪑',
  bedding:     '🛏️',
  textiles:    '🧵',
  toys:        '🧸',
  sports:      '⚽',
  beauty:      '💄',
  jewellery:   '💍',
  footwear:    '👟',
};

interface Props {
  product: IProduct;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: Props) {
  const addItem       = useCartStore((s) => s.addItem);
  const toggleItem    = useWishlistStore((s) => s.toggleItem);
  const wishlistItems = useWishlistStore((s) => s.items);
  const [added, setAdded] = useState(false);

  const isWishlisted = wishlistItems.some((i) => i.slug === product.slug);
  const gradient     = categoryGradients[product.category] ?? 'from-stone-100 to-stone-50';
  const discountPct  = product.originalPrice
    ? getDiscountPercent(product.price, product.originalPrice)
    : 0;
  const primaryImage = product.images?.[0];
  const icon         = CAT_ICONS[product.category] ?? '🛍️';

  function handleAddToCart() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <article className="group relative flex flex-col bg-white border border-stone-200 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">

      {/* ── Image ── */}
      <Link href={`/product/${product.slug}`} className="relative block flex-shrink-0">
        <div className={`relative ${compact ? 'h-36' : 'h-44 sm:h-48'} w-full bg-stone-50 overflow-hidden`}>
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-2`}>
              <span className="text-5xl drop-shadow-sm select-none">{icon}</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                {product.subcategory ?? product.category}
              </span>
            </div>
          )}

          {/* Discount badge */}
          {discountPct > 0 && (
            <span className="absolute left-2 top-2 z-10 rounded bg-green-600 px-1.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
              -{discountPct}%
            </span>
          )}

          {/* New / Bestseller badge */}
          {product.isNewArrival && !discountPct && (
            <span className="absolute left-2 top-2 z-10 rounded bg-sky-500 px-1.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
              NEW
            </span>
          )}
          {product.isBestSeller && !discountPct && !product.isNewArrival && (
            <span className="absolute left-2 top-2 z-10 rounded bg-amber-500 px-1.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
              🔥 BESTSELLER
            </span>
          )}

          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); toggleItem(product); }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border shadow-sm transition-all ${
              isWishlisted
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'bg-white border-stone-200 text-stone-300 opacity-0 group-hover:opacity-100 hover:text-red-400'
            }`}
          >
            <svg width="13" height="13" fill={isWishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </Link>

      {/* ── Details ── */}
      <div className="flex flex-1 flex-col p-3">

        {/* Subcategory */}
        {product.subcategory && (
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-stone-400 truncate">
            {product.subcategory}
          </p>
        )}

        {/* Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-stone-800 hover:text-brand-700 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating — Flipkart green pill style */}
        {product.rating ? (
          <div className="flex items-center gap-1.5 mb-2">
            <span className="inline-flex items-center gap-0.5 rounded bg-green-600 px-1.5 py-0.5 text-[11px] font-bold text-white leading-none">
              {product.rating} ★
            </span>
            {product.reviewCount && (
              <span className="text-[11px] text-stone-400">
                {product.reviewCount.toLocaleString('en-IN')} ratings
              </span>
            )}
          </div>
        ) : (
          <div className="h-5 mb-2" />
        )}

        {/* Stock status */}
        {product.stock !== undefined && (
          <p className={`text-[11px] font-semibold mb-2 ${
            product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {product.stock > 10 ? '✓ In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
          </p>
        )}

        {/* Price block */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-base font-bold text-stone-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-stone-400 line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
          {discountPct > 0 && (
            <span className="text-xs font-semibold text-green-600">{discountPct}% off</span>
          )}
        </div>

        {/* Free delivery tag */}
        {product.price >= 499 && (
          <p className="mt-0.5 text-[11px] text-green-700 font-medium">Free delivery</p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Add to Cart button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`mt-3 w-full rounded-lg py-2 text-sm font-semibold transition-all duration-200 ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.98]'
          }`}
        >
          {added ? '✓ Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
}
