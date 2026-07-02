'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { categoryGradients } from '@/lib/products';

function MinusIcon() {
  return <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" d="M20 12H4" /></svg>;
}
function PlusIcon() {
  return <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" d="M12 4v16m8-8H4" /></svg>;
}
function TrashIcon() {
  return <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
}

export default function CartPage() {
  const items          = useCartStore((s) => s.items);
  const removeItem     = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart      = useCartStore((s) => s.clearCart);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string; discountType: 'percentage' | 'flat'; discountValue: number;
  } | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [applying, setApplying] = useState(false);

  const subtotal  = useMemo(() => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0), [items]);
  const shipping  = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const tax       = Math.round(subtotal * 0.05);
  const discount  = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'percentage')
      return Math.round(subtotal * appliedCoupon.discountValue / 100);
    return Math.min(appliedCoupon.discountValue, subtotal);
  }, [appliedCoupon, subtotal]);
  const total     = subtotal + shipping + tax - discount;
  const savings   = useMemo(() => items.reduce((sum, i) => {
    const orig = i.product.originalPrice ?? i.product.price;
    return sum + (orig - i.product.price) * i.quantity;
  }, 0), [items]);

  async function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setApplying(true); setCouponMsg(null); setAppliedCoupon(null);
    try {
      const res  = await fetch(`/api/coupons/${code}`);
      const data = await res.json();
      if (!res.ok) { setCouponMsg({ text: data.error ?? 'Invalid coupon', ok: false }); return; }
      setAppliedCoupon(data);
      const saving = data.discountType === 'percentage' ? `${data.discountValue}% off` : `₹${data.discountValue} off`;
      setCouponMsg({ text: `Coupon applied! You save ${saving}`, ok: true });
    } finally {
      setApplying(false);
    }
  }

  function removeCoupon() { setAppliedCoupon(null); setCouponInput(''); setCouponMsg(null); }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b border-stone-200 bg-white">
        <div className="container py-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Review your order</p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-stone-900">Shopping Cart</h1>
        </div>
      </div>

      <div className="container py-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-stone-400" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="mt-5 font-display text-2xl font-bold text-stone-900">Your cart is empty</p>
            <p className="mt-2 text-stone-500">Discover our premium home collections and add something you love.</p>
            <Link
              href="/shop"
              className="mt-6 rounded-full bg-stone-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-stone-500">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-semibold text-stone-400 transition hover:text-red-500"
                >
                  Clear cart
                </button>
              </div>

              {items.map((item) => {
                const gradient = categoryGradients[item.product.category] ?? 'from-stone-100 to-stone-50';
                return (
                  <div key={item.product.slug} className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-soft">
                    {/* Product image */}
                    <Link href={`/product/${item.product.slug}`} className="flex-shrink-0">
                      <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-stone-100">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-contain p-1.5"
                            sizes="96px"
                          />
                        ) : (
                          <div className={`h-full w-full bg-gradient-to-br ${gradient} opacity-60`} />
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/product/${item.product.slug}`}>
                          <h3 className="font-semibold text-stone-900 leading-tight hover:text-brand-700 transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <button
                          type="button"
                          aria-label={`Remove ${item.product.name}`}
                          onClick={() => removeItem(item.product.slug)}
                          className="flex-shrink-0 rounded-full p-1.5 text-stone-400 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <TrashIcon />
                        </button>
                      </div>

                      <p className="text-xs text-stone-500 capitalize">{item.product.category}</p>

                      <div className="flex items-center justify-between gap-4 mt-auto">
                        {/* Qty */}
                        <div className="flex items-center gap-0 overflow-hidden rounded-full border border-stone-200">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center text-stone-600 transition hover:bg-stone-100"
                          >
                            <MinusIcon />
                          </button>
                          <span className="min-w-[2rem] text-center text-sm font-semibold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-stone-600 transition hover:bg-stone-100"
                          >
                            <PlusIcon />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-bold text-stone-900">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-stone-400">
                              ₹{item.product.price.toLocaleString('en-IN')} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-24 self-start space-y-4">
              {savings > 0 && (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-3">
                  <p className="text-sm font-semibold text-green-700">
                    You save ₹{savings.toLocaleString('en-IN')} on this order!
                  </p>
                </div>
              )}

              {/* Coupon Section */}
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft">
                <h2 className="font-display text-lg font-bold text-stone-900 mb-4">Coupon Code</h2>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <span className="font-mono text-sm font-bold text-green-700">{appliedCoupon.code}</span>
                      <span className="text-xs text-green-600">
                        — {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% off` : `₹${appliedCoupon.discountValue} off`}
                      </span>
                    </div>
                    <button type="button" onClick={removeCoupon} className="text-xs font-semibold text-red-500 hover:underline">Remove</button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-3">
                      <input
                        type="text" value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponMsg(null); }}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                        placeholder="Enter coupon code" aria-label="Coupon code"
                        className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm font-mono uppercase tracking-wider text-stone-900 outline-none transition focus:border-brand-400 focus:bg-white placeholder:normal-case placeholder:tracking-normal placeholder:font-sans"
                      />
                      <button
                        type="button" onClick={handleApplyCoupon}
                        disabled={applying || !couponInput.trim()}
                        className="rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
                      >
                        {applying ? '…' : 'Apply'}
                      </button>
                    </div>
                    {couponMsg && (
                      <p className={`mt-2 text-xs font-medium ${couponMsg.ok ? 'text-green-600' : 'text-red-500'}`}>
                        {couponMsg.text}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft">
                <h2 className="font-display text-lg font-bold text-stone-900">Order Summary</h2>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal ({items.reduce((n, i) => n + i.quantity, 0)} items)</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping</span>
                    {shipping === 0 ? (
                      <span className="font-semibold text-green-600">Free</span>
                    ) : (
                      <span>₹{shipping}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span className="flex items-center gap-1">
                        Coupon
                        <span className="rounded bg-green-100 px-1.5 py-0.5 font-mono text-[10px]">{appliedCoupon?.code}</span>
                      </span>
                      <span>− ₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                {shipping > 0 && (
                  <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                    Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for free shipping
                  </p>
                )}

                <div className="my-4 border-t border-stone-100" />

                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">Total</span>
                  <div className="text-right">
                    {discount > 0 && (
                      <p className="text-xs text-stone-400 line-through">₹{(total + discount).toLocaleString('en-IN')}</p>
                    )}
                    <span className="font-display text-2xl font-bold text-stone-900">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-5 flex w-full items-center justify-center rounded-full bg-stone-900 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700 shadow-card"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/shop"
                  className="mt-3 flex w-full items-center justify-center rounded-full border border-stone-200 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Trust */}
              <div className="rounded-2xl border border-stone-200 bg-white px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">Secure checkout</p>
                <div className="space-y-2">
                  {['256-bit SSL encryption', 'Razorpay · UPI · Cards · COD', '7-day easy returns'].map((item) => (
                    <p key={item} className="flex items-center gap-2 text-xs text-stone-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
