'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
  product: { slug: string; name: string; price: number };
  quantity: number;
  total: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  shippingAddress: {
    name: string; email: string; phone: string;
    addressLine1: string; city: string; state: string; pincode: string;
  };
  createdAt: string;
}

const STATUS_STEPS = ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
const STEP_LABELS  = ['Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function OrderDetailPage() {
  const params  = useParams();
  const [order, setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    fetch(`/api/orders/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || 'Unable to load order');
        return res.json();
      })
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params]);

  if (loading) {
    return (
      <div className="container py-16">
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse-soft rounded-xl bg-stone-200" />
          <div className="h-40 animate-pulse-soft rounded-2xl bg-stone-200" />
          <div className="h-64 animate-pulse-soft rounded-2xl bg-stone-200" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-16 text-center">
        <p className="font-display text-xl font-bold text-stone-900">Order not found</p>
        <p className="mt-2 text-stone-500">{error || 'This order could not be loaded.'}</p>
        <Link href="/orders" className="mt-4 inline-flex rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition">
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled' || order.status === 'returned';
  const progressWidths: Record<number, string> = {
    0: 'w-0', 1: 'w-1/5', 2: 'w-2/5', 3: 'w-3/5', 4: 'w-4/5', 5: 'w-full',
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b border-stone-200 bg-white">
        <div className="container py-8">
          <nav className="flex items-center gap-2 text-xs text-stone-500 mb-3">
            <Link href="/orders" className="hover:text-stone-900 transition-colors">My Orders</Link>
            <span>/</span>
            <span className="text-stone-900">#{order.id.slice(-8).toUpperCase()}</span>
          </nav>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Order details</p>
              <h1 className="mt-1 font-display text-2xl font-bold text-stone-900">
                Order #{order.id.slice(-8).toUpperCase()}
              </h1>
              <p className="mt-1 text-xs text-stone-500">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <span className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize ${
              isCancelled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-6">
        {/* Status tracker */}
        {!isCancelled && (
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft">
            <h2 className="font-display font-bold text-stone-900 mb-6">Order Progress</h2>
            <div className="relative flex justify-between">
              <div className="absolute left-0 right-0 top-4 h-0.5 bg-stone-200">
                <div className={`h-full bg-brand-600 transition-all duration-500 ${progressWidths[currentStep] ?? 'w-0'}`} />
              </div>
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="relative flex flex-col items-center gap-2 z-10">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                    i <= currentStep
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-stone-300 bg-white text-stone-400'
                  }`}>
                    {i < currentStep ? (
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <span className="text-[10px] font-bold">{i + 1}</span>
                    )}
                  </div>
                  <p className={`hidden text-[10px] font-semibold text-center sm:block ${i <= currentStep ? 'text-brand-700' : 'text-stone-400'}`}>
                    {STEP_LABELS[i]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {/* Items */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft">
              <h2 className="font-display font-bold text-stone-900 mb-4">Items Ordered</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.product.slug} className="flex items-center gap-4 rounded-xl bg-stone-50 p-4">
                    <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-stone-200" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-stone-500">Qty: {item.quantity} × ₹{item.product.price.toLocaleString('en-IN')}</p>
                    </div>
                    <p className="font-bold text-stone-900 flex-shrink-0">₹{item.total.toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft">
              <h2 className="font-display font-bold text-stone-900 mb-4">Shipping Address</h2>
              <div className="text-sm text-stone-600 space-y-1">
                <p className="font-semibold text-stone-900">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
                <p className="mt-2">{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.email}</p>
              </div>
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft">
              <h2 className="font-display font-bold text-stone-900 mb-4">Order Summary</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  {order.shippingCharge === 0 ? <span className="font-semibold text-green-600">Free</span> : <span>₹{order.shippingCharge}</span>}
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Tax</span>
                  <span>₹{order.tax.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="my-4 border-t border-stone-100" />
              <div className="flex justify-between">
                <span className="font-bold text-stone-900">Total</span>
                <span className="font-display text-xl font-bold text-stone-900">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-soft">
              <h2 className="font-display font-bold text-stone-900 mb-3">Payment</h2>
              <div className="text-sm text-stone-600 space-y-1">
                <p>Method: <span className="font-medium text-stone-800">{order.paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}</span></p>
                <p>Status: <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-700' : 'text-amber-700'}`}>{order.paymentStatus}</span></p>
              </div>
            </div>

            <Link href="/shop" className="flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 shadow-soft">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
