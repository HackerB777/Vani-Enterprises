'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cartStore';
import { useBuyNowStore } from '@/store/buyNowStore';
import type { AddressRecord } from '@/lib/addresses';
import { INDIAN_STATES } from '@/lib/states';
import { lookupPincode } from '@/lib/pincode';

interface Address {
  name: string; email: string; phone: string;
  addressLine1: string; city: string; state: string; pincode: string;
}

const EMPTY: Address = { name: '', email: '', phone: '', addressLine1: '', city: '', state: '', pincode: '' };

function Field({ label, type = 'text', value, onChange, placeholder, required = true }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-stone-700">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 outline-none transition focus:border-brand-400 focus:bg-white"
      />
    </label>
  );
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById('razorpay-script')) { resolve(); return; }
    const s = document.createElement('script');
    s.id = 'razorpay-script';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(s);
  });
}

export default function CheckoutPage() {
  const router    = useRouter();
  const { data: session, status } = useSession();
  const cartItems  = useCartStore((s) => s.items);
  const clearCart  = useCartStore((s) => s.clearCart);
  const buyNowItem = useBuyNowStore((s) => s.item);
  const clearBuyNow = useBuyNowStore((s) => s.clearBuyNow);
  const items = useMemo(() => (buyNowItem ? [buyNowItem] : cartItems), [buyNowItem, cartItems]);
  const [addr, setAddr]               = useState<Address>(EMPTY);
  const [payment, setPayment]         = useState<'razorpay' | 'cod'>('razorpay');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string; discountType: 'percentage' | 'flat'; discountValue: number; minOrderAmount: number;
  } | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [applying, setApplying]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const [savedAddresses, setSavedAddresses]   = useState<AddressRecord[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress]     = useState(false);
  const [saveNewAddress, setSaveNewAddress]   = useState(true);
  const [pincodeLoading, setPincodeLoading]   = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (status !== 'authenticated') { setAddressesLoading(false); setUseNewAddress(true); return; }

    if (session?.user?.email) {
      setAddr((a) => (a.email ? a : { ...a, email: session.user!.email! }));
    }

    fetch('/api/addresses')
      .then((r) => r.json())
      .then((data: AddressRecord[]) => {
        const list = Array.isArray(data) ? data : [];
        setSavedAddresses(list);
        if (list.length > 0) {
          const def = list[0];
          setSelectedAddressId(def.id);
          setAddr((a) => ({
            ...a,
            name: def.name, phone: def.phone, addressLine1: def.addressLine1,
            city: def.city, state: def.state, pincode: def.pincode,
          }));
        } else {
          setUseNewAddress(true);
        }
      })
      .catch(() => setUseNewAddress(true))
      .finally(() => setAddressesLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  /* Clear the one-shot Buy Now selection whenever checkout is left, so a
     later visit to /checkout falls back to the real cart instead of
     re-showing a stale single-item order. */
  useEffect(() => {
    return () => clearBuyNow();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.product.price * i.quantity, 0), [items]);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const tax      = Math.round(subtotal * 0.05);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'percentage')
      return Math.round(subtotal * appliedCoupon.discountValue / 100);
    return Math.min(appliedCoupon.discountValue, subtotal);
  }, [appliedCoupon, subtotal]);

  const total = subtotal + shipping + tax - discount;
  const codAllowed = items.every((item) => item.product.isCodAvailable !== false);

  async function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setApplying(true); setCouponMsg(null); setAppliedCoupon(null);
    try {
      const res  = await fetch(`/api/coupons/${code}`);
      const data = await res.json();
      if (!res.ok) { setCouponMsg({ text: data.error ?? 'Invalid coupon', ok: false }); return; }
      if (subtotal < data.minOrderAmount) {
        setCouponMsg({ text: `Minimum order ₹${data.minOrderAmount} required for this coupon`, ok: false }); return;
      }
      setAppliedCoupon(data);
      const saving = data.discountType === 'percentage' ? `${data.discountValue}% off` : `₹${data.discountValue} off`;
      setCouponMsg({ text: `Coupon applied! You save ${saving}`, ok: true });
    } finally {
      setApplying(false);
    }
  }

  function removeCoupon() { setAppliedCoupon(null); setCouponInput(''); setCouponMsg(null); }

  const set = (field: keyof Address) => (val: string) => setAddr((a) => ({ ...a, [field]: val }));

  function selectAddress(record: AddressRecord) {
    setSelectedAddressId(record.id);
    setUseNewAddress(false);
    setAddr((a) => ({
      ...a,
      name: record.name, phone: record.phone, addressLine1: record.addressLine1,
      city: record.city, state: record.state, pincode: record.pincode,
    }));
  }

  function startNewAddress() {
    setUseNewAddress(true);
    setSelectedAddressId(null);
    setAddr((a) => ({ ...EMPTY, email: a.email }));
  }

  async function handlePincodeChange(value: string) {
    const digits = value.replace(/\D/g, '');
    set('pincode')(digits);
    if (/^\d{6}$/.test(digits)) {
      setPincodeLoading(true);
      const result = await lookupPincode(digits);
      if (result) setAddr((a) => ({ ...a, city: result.city, state: result.state }));
      setPincodeLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { setError('Your cart is empty.'); return; }
    const missing = (Object.keys(EMPTY) as (keyof Address)[]).find((k) => !addr[k].trim());
    if (missing) { setError('Please fill in all required fields.'); return; }

    if (status === 'authenticated' && useNewAddress && saveNewAddress) {
      fetch('/api/addresses', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          label: 'Home', name: addr.name, phone: addr.phone, addressLine1: addr.addressLine1,
          city: addr.city, state: addr.state, pincode: addr.pincode,
          isDefault: savedAddresses.length === 0,
        }),
      }).catch(() => {});
    }

    setLoading(true); setError('');
    try {
      // 1. Create order record in DB
      const res = await fetch('/api/orders', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          items:           items.map((i) => ({ product: i.product, quantity: i.quantity })),
          shippingAddress: addr,
          paymentMethod:   payment,
          couponCode:      appliedCoupon?.code ?? null,
          discount,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to place order.');
      const order = data.order;

      if (payment === 'cod' && !codAllowed) {
        throw new Error('Cash on Delivery is unavailable for one or more items in your cart.');
      }

      // 2. COD — done
      if (payment === 'cod') {
        if (buyNowItem) clearBuyNow(); else clearCart();
        router.push(`/orders/${order.id}`);
        return;
      }

      // 3. Razorpay — get order ID from our server
      const rzpRes = await fetch('/api/payments/create-order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ amount: total, receipt: order.id, orderId: order.id }),
      });
      const rzpData = await rzpRes.json();
      if (!rzpRes.ok) throw new Error(rzpData.error || 'Failed to initiate payment.');

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) throw new Error('Payment provider is not configured.');

      // 4. Load Razorpay JS and open modal
      await loadRazorpayScript();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay({
        key:      razorpayKey,
        amount:   rzpData.amount,
        currency: rzpData.currency,
        order_id: rzpData.razorpayOrderId,
        name:     'Vani Enterprises',
        description: `Order ${order.id}`,
        prefill: { name: addr.name, email: addr.email, contact: addr.phone },
        theme:   { color: '#44403c' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const v = await fetch('/api/payments/verify', {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body:    JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                orderId:             order.id,
              }),
            });
            const verifyData = await v.json();
            if (!v.ok || !verifyData.success) {
              setError(verifyData.error || 'Payment verification failed.');
              return;
            }
            if (buyNowItem) clearBuyNow(); else clearCart();
            router.push(`/orders/${order.id}`);
          } catch (verifyError: unknown) {
            setError(verifyError instanceof Error ? verifyError.message : 'Payment verification failed.');
          }
        },
        modal: {
          ondismiss: () => {
            setError('Payment was cancelled. Please try again.');
          },
        },
      });
      rzp.open();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b border-stone-200 bg-white">
        <div className="container py-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Final step</p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-stone-900">Checkout</h1>
        </div>
      </div>

      <div className="container py-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white py-24 text-center">
            <p className="font-display text-xl font-bold text-stone-900">Your cart is empty</p>
            <Link href="/shop" className="mt-4 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition">
              Shop Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              {/* Left */}
              <div className="space-y-6">
                {/* Shipping */}
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft">
                  <h2 className="font-display text-lg font-bold text-stone-900 mb-5">Shipping Details</h2>

                  {addressesLoading ? (
                    <div className="space-y-3">
                      {[1, 2].map((n) => <div key={n} className="h-16 animate-pulse rounded-xl bg-stone-100" />)}
                    </div>
                  ) : !useNewAddress && savedAddresses.length > 0 ? (
                    <div className="space-y-3">
                      {savedAddresses.map((a) => (
                        <label
                          key={a.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all ${
                            selectedAddressId === a.id ? 'border-brand-600 bg-brand-50' : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <input
                            type="radio" name="saved-address" className="mt-1 accent-brand-600"
                            checked={selectedAddressId === a.id} onChange={() => selectAddress(a)}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-stone-500">{a.label}</span>
                              {a.isDefault && <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-700">Default</span>}
                            </div>
                            <p className="mt-1 font-semibold text-stone-900 text-sm">{a.name}</p>
                            <p className="text-sm text-stone-600">{a.addressLine1}, {a.city}, {a.state} – {a.pincode}</p>
                            <p className="text-xs text-stone-400 mt-0.5">📞 {a.phone}</p>
                          </div>
                        </label>
                      ))}
                      <button type="button" onClick={startNewAddress} className="text-sm font-semibold text-brand-600 hover:underline">
                        + Use a different address
                      </button>
                      <div className="pt-2">
                        <Field label="Email Address" type="email" value={addr.email} onChange={set('email')} placeholder="priya@example.com" />
                      </div>
                    </div>
                  ) : (
                    <>
                      {savedAddresses.length > 0 && (
                        <button type="button" onClick={() => setUseNewAddress(false)} className="mb-4 text-sm font-semibold text-brand-600 hover:underline">
                          ← Use a saved address
                        </button>
                      )}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Full Name"     value={addr.name}    onChange={set('name')}    placeholder="Priya Sharma" />
                        <Field label="Email Address" type="email" value={addr.email}   onChange={set('email')}   placeholder="priya@example.com" />
                        <Field label="Phone Number"  type="tel"  value={addr.phone}   onChange={set('phone')}   placeholder="9999999999" />
                        <div>
                          <Field label="Pincode" value={addr.pincode} onChange={handlePincodeChange} placeholder="600001" />
                          {pincodeLoading && <span className="mt-1 block text-[11px] text-stone-400">Looking up city &amp; state…</span>}
                        </div>
                      </div>
                      <div className="mt-4">
                        <Field label="Address Line 1" value={addr.addressLine1} onChange={set('addressLine1')} placeholder="Flat 4B, ABC Apartments, MG Road" />
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <Field label="City" value={addr.city} onChange={set('city')} placeholder="Chennai" />
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-semibold text-stone-700">State<span className="ml-0.5 text-red-500">*</span></span>
                          <select
                            aria-label="Select state"
                            value={addr.state}
                            onChange={(e) => set('state')(e.target.value)}
                            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 outline-none transition focus:border-brand-400 focus:bg-white"
                            required
                          >
                            <option value="">Select state</option>
                            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </label>
                      </div>
                      {status === 'authenticated' && (
                        <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-sm text-stone-700">
                          <input
                            type="checkbox" checked={saveNewAddress}
                            onChange={(e) => setSaveNewAddress(e.target.checked)}
                            className="h-4 w-4 rounded border-stone-300 accent-brand-600"
                          />
                          Save this address to my account for faster checkout next time
                        </label>
                      )}
                    </>
                  )}
                </div>

                {/* Payment */}
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft">
                  <h2 className="font-display text-lg font-bold text-stone-900 mb-5">Payment Method</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {([
                      { id: 'razorpay', label: 'Pay Online', sub: 'UPI · Cards · Wallets · Net Banking', icon: '🏦' },
                      { id: 'cod',      label: 'Cash on Delivery', sub: 'Pay when your order arrives', icon: '💵' },
                    ] as const).map((opt) => {
                      const disabled = opt.id === 'cod' && !codAllowed;
                      return (
                        <button
                          key={opt.id} type="button" onClick={() => !disabled && setPayment(opt.id)}
                          disabled={disabled}
                          className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                            disabled ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed' : payment === opt.id ? 'border-brand-600 bg-brand-50' : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <span className="text-2xl">{opt.icon}</span>
                          <div>
                            <p className="font-semibold text-stone-900">{opt.label}</p>
                            <p className={`mt-0.5 text-xs ${disabled ? 'text-stone-400' : 'text-stone-500'}`}>{opt.sub}</p>
                          </div>
                        </button>
                      );
                    })}
</div>
                </div>
                {!codAllowed && (
                  <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Cash on Delivery is unavailable for one or more items in your cart.
                  </p>
                )}

                {/* Coupon */}
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

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                )}
              </div>

              {/* Order summary sidebar */}
              <div className="space-y-4 lg:sticky lg:top-24 self-start">
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft">
                  <h2 className="font-display text-lg font-bold text-stone-900 mb-4">Order Summary</h2>

                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.product.slug} className="flex items-center gap-3 text-sm">
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
                          {item.product.images?.[0] && (
                            <Image src={item.product.images[0]} alt={item.product.name} fill className="object-contain p-0.5" sizes="40px" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-stone-900 truncate">{item.product.name}</p>
                          <p className="text-stone-500">Qty {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-stone-900 flex-shrink-0">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="my-4 border-t border-stone-100" />

                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-stone-600">
                      <span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Shipping</span>
                      {shipping === 0 ? <span className="font-semibold text-green-600">Free</span> : <span>₹{shipping}</span>}
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Tax (5%)</span><span>₹{tax.toLocaleString('en-IN')}</span>
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

                  <div className="my-4 border-t border-stone-100" />

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">Total</span>
                    <div className="text-right">
                      {discount > 0 && (
                        <p className="text-xs text-stone-400 line-through">₹{(total + discount).toLocaleString('en-IN')}</p>
                      )}
                      <span className="font-display text-2xl font-bold text-stone-900">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className="mt-5 w-full rounded-full bg-stone-900 py-3.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? (payment === 'razorpay' ? 'Opening Payment…' : 'Placing Order…')
                      : (payment === 'razorpay'
                          ? `Pay ₹${total.toLocaleString('en-IN')} with Razorpay`
                          : `Place Order · ₹${total.toLocaleString('en-IN')}`)}
                  </button>

                  <p className="mt-3 text-center text-xs text-stone-400">
                    By placing your order you agree to our{' '}
                    <Link href="/contact" className="text-brand-600 hover:underline">terms & conditions</Link>.
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white px-5 py-4">
                  <div className="space-y-2">
                    {['Secure 256-bit SSL payment', 'Razorpay PCI-DSS compliant', 'Data never stored on our servers'].map((item) => (
                      <p key={item} className="flex items-center gap-2 text-xs text-stone-500">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="text-green-500" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
