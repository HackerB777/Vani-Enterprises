'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';

const STATES = ['Andhra Pradesh', 'Karnataka', 'Kerala', 'Maharashtra', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal', 'Delhi', 'Other'];

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
  const items     = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { setError('Your cart is empty.'); return; }
    const missing = (Object.keys(EMPTY) as (keyof Address)[]).find((k) => !addr[k].trim());
    if (missing) { setError('Please fill in all required fields.'); return; }

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

      // 2. COD — done
      if (payment === 'cod') {
        clearCart();
        router.push(`/orders/${order.id}`);
        return;
      }

      // 3. Razorpay — get order ID from our server
      const rzpRes = await fetch('/api/payments/create-order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ amount: total, receipt: order.id }),
      });
      const rzpData = await rzpRes.json();
      if (!rzpRes.ok) throw new Error(rzpData.error || 'Failed to initiate payment.');

      // 4. Load Razorpay JS and open modal
      await loadRazorpayScript();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay({
        key:      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
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
          if ((await v.json()).success) { clearCart(); router.push(`/orders/${order.id}`); }
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
          <h1 className="mt-1 font-display text-3xl font-bold text-stone-900">Checkout</h1>
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
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full Name"     value={addr.name}    onChange={set('name')}    placeholder="Priya Sharma" />
                    <Field label="Email Address" type="email" value={addr.email}   onChange={set('email')}   placeholder="priya@example.com" />
                    <Field label="Phone Number"  type="tel"  value={addr.phone}   onChange={set('phone')}   placeholder="9999999999" />
                    <Field label="Pincode"       value={addr.pincode} onChange={set('pincode')} placeholder="600001" />
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
                        {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </label>
                  </div>
                </div>

                {/* Payment */}
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft">
                  <h2 className="font-display text-lg font-bold text-stone-900 mb-5">Payment Method</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {([
                      { id: 'razorpay', label: 'Pay Online', sub: 'UPI · Cards · Wallets · Net Banking', icon: '🏦' },
                      { id: 'cod',      label: 'Cash on Delivery', sub: 'Pay when your order arrives', icon: '💵' },
                    ] as const).map((opt) => (
                      <button
                        key={opt.id} type="button" onClick={() => setPayment(opt.id)}
                        className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                          payment === opt.id ? 'border-brand-600 bg-brand-50' : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <div>
                          <p className="font-semibold text-stone-900">{opt.label}</p>
                          <p className="mt-0.5 text-xs text-stone-500">{opt.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

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
