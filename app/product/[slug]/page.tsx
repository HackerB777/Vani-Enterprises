'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { useBuyNowStore } from '@/store/buyNowStore';
import type { IProduct } from '@/lib/models/Product';
import { categoryGradients, categories, getDiscountPercent } from '@/lib/products';
import { StarRating } from '@/components/store/StarRating';
import { ProductCard } from '@/components/store/ProductCard';
import { RecentlyViewed } from '@/components/store/RecentlyViewed';

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function MinusIcon() {
  return <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" d="M20 12H4" /></svg>;
}
function PlusIcon() {
  return <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" d="M12 4v16m8-8H4" /></svg>;
}
function CheckIcon() {
  return <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
}

interface Props { params: Promise<{ slug: string }> }

export default function ProductPage({ params }: Props) {
  const { slug }      = use(params);
  const router        = useRouter();
  const addItem       = useCartStore((s) => s.addItem);
  const toggleItem    = useWishlistStore((s) => s.toggleItem);
  const wishlistItems = useWishlistStore((s) => s.items);
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addProduct);
  const setBuyNow     = useBuyNowStore((s) => s.setBuyNow);
  const [qty, setQty]         = useState(1);
  const [added, setAdded]     = useState(false);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [related, setRelated] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((r) => r.ok ? r.json() : null)
      .then((p: IProduct | null) => {
        setProduct(p);
        setLoading(false);
        if (p) {
          addRecentlyViewed(p);
          fetch(`/api/products?category=${p.category}&limit=5`)
            .then((r) => r.json())
            .then((all: IProduct[]) => setRelated(all.filter((x) => x.slug !== slug).slice(0, 4)));
        }
      })
      .catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const isWishlisted = wishlistItems.some((i) => i.slug === slug);
  const gradient     = product ? (categoryGradients[product.category] ?? 'from-stone-100 to-stone-50') : '';
  const discountPct  = product?.originalPrice ? getDiscountPercent(product.price, product.originalPrice) : 0;
  const category     = product ? categories.find((c) => c.slug === product.category) : null;

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-brand-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p className="font-display text-2xl font-bold text-stone-900">Product not found</p>
        <p className="mt-2 text-stone-500">This product may have been removed or the link is incorrect.</p>
        <Link href="/shop" className="mt-6 inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    setBuyNow(product, qty);
    router.push('/checkout');
  };

  const images = product.images?.length ? product.images : [];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Breadcrumb */}
      <div className="border-b border-stone-200 bg-white">
        <div className="container py-4">
          <nav className="flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="transition hover:text-stone-900">Home</Link>
            <span>/</span>
            <Link href="/shop" className="transition hover:text-stone-900">Shop</Link>
            {category && (
              <>
                <span>/</span>
                <Link href={`/shop?category=${product.category}`} className="transition hover:text-stone-900">
                  {category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="font-medium text-stone-900 line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image panel */}
          <div className="space-y-4">
            <div className={`relative flex h-96 w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} lg:h-[480px]`}>
              {images[activeImg] ? (
                <Image
                  src={images[activeImg]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <>
                  <div className="absolute left-1/3 top-1/4 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
                  <div className="absolute right-1/4 bottom-1/4 h-32 w-32 rounded-full bg-white/15 blur-xl" />
                  <p className="text-[80px] opacity-10 select-none">
                    {product.category === 'textiles' ? '🧵' :
                     product.category === 'decor'    ? '🏮' :
                     product.category === 'bedding'  ? '🛏' :
                     product.category === 'kitchen'  ? '🍳' :
                     product.category === 'dining'   ? '🍽' :
                     product.category === 'storage'  ? '📦' :
                     product.category === 'bath'     ? '🛁' : '🌿'}
                  </p>
                </>
              )}

              {/* Badges */}
              <div className="absolute left-4 top-4 flex flex-col gap-2 z-10">
                {product.isNewArrival && (
                  <span className="rounded-full bg-sky-500 px-3 py-1 text-xs font-bold text-white shadow-sm">New Arrival</span>
                )}
                {product.isBestSeller && (
                  <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-sm">Best Seller</span>
                )}
                {discountPct > 0 && (
                  <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white shadow-sm">{discountPct}% Off</span>
                )}
              </div>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 ? (
              <div className="flex gap-3">
                {images.map((url, n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`View image ${n + 1}`}
                    onClick={() => setActiveImg(n)}
                    className={`relative h-16 w-16 cursor-pointer overflow-hidden rounded-xl ${n === activeImg ? 'ring-2 ring-brand-600 ring-offset-1' : 'opacity-60 hover:opacity-100'} transition-opacity`}
                  >
                    <Image src={url} alt={`${product.name} ${n + 1}`} fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            ) : images.length === 0 ? (
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className={`h-16 w-16 rounded-xl bg-gradient-to-br ${gradient} ${n === 1 ? 'ring-2 ring-brand-600 ring-offset-1' : 'opacity-60'}`}
                  />
                ))}
              </div>
            ) : null}
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-5">
            <div>
              <Link
                href={`/shop?category=${product.category}`}
                className="text-xs font-bold uppercase tracking-widest text-brand-600 hover:text-brand-700 transition-colors"
              >
                {category?.name ?? product.category}
              </Link>
              <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-stone-900 lg:text-4xl">
                {product.name}
              </h1>
            </div>

            {product.rating && (
              <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-stone-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-stone-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>

            {product.description && (
              <p className="text-base leading-relaxed text-stone-600">{product.description}</p>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Qty selector */}
              <div className="flex items-center gap-0 overflow-hidden rounded-full border border-stone-200 bg-white">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-stone-600 transition hover:bg-stone-100"
                >
                  <MinusIcon />
                </button>
                <span className="min-w-[2.5rem] text-center text-sm font-semibold text-stone-900">
                  {qty}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-11 w-11 items-center justify-center text-stone-600 transition hover:bg-stone-100"
                >
                  <PlusIcon />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all ${
                  added
                    ? 'bg-green-600 text-white'
                    : 'bg-stone-900 text-white hover:bg-brand-700 shadow-card'
                }`}
              >
                {added ? (
                  <><CheckIcon /> Added to Cart!</>
                ) : (
                  'Add to Cart'
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-full bg-brand-600 py-3 text-sm font-semibold text-white shadow-card transition-all hover:bg-brand-700"
              >
                Buy Now
              </button>

              <button
                type="button"
                onClick={() => toggleItem(product)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
                  isWishlisted
                    ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100'
                    : 'border-stone-200 text-stone-500 hover:border-red-200 hover:text-red-500'
                }`}
              >
                <HeartIcon filled={isWishlisted} />
              </button>
            </div>

            {/* Order on WhatsApp */}
            <a
              href={`https://wa.me/919999999999?text=Hi! I'd like to order: ${encodeURIComponent(product.name)} (₹${product.price})`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-green-200 bg-green-50 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Order on WhatsApp
            </a>

            {/* Details */}
            {product.details && product.details.length > 0 && (
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                <h2 className="font-semibold text-stone-900">Product Details</h2>
                <ul className="mt-3 space-y-2">
                  {product.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2.5 text-sm text-stone-600">
                      <CheckIcon />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Delivery info */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '📦', label: 'Free Shipping', sub: 'Above ₹999' },
                { icon: '↩', label: '7-Day Returns', sub: 'Easy returns' },
                { icon: '🔒', label: 'Secure Pay', sub: 'UPI · Cards · COD' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-stone-200 bg-white p-3 text-center">
                  <p className="text-xl">{item.icon}</p>
                  <p className="mt-1 text-xs font-semibold text-stone-800">{item.label}</p>
                  <p className="text-[10px] text-stone-500">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-stone-900 mb-6">You may also like</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        )}

        <RecentlyViewed excludeSlug={slug} />
      </div>
    </div>
  );
}
