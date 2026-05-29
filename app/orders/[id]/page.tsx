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

function buildWhatsAppText(order: Order): string {
  const shortId = order.id.slice(-8).toUpperCase();
  const date    = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const items   = order.items.map((i) => `• ${i.product.name} × ${i.quantity} — ₹${i.total.toLocaleString('en-IN')}`).join('\n');
  const payment = order.paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery';
  const addr    = order.shippingAddress;
  return [
    `🛍️ *Vani Enterprises* — Order Confirmation`,
    ``,
    `📦 *Order ID:* #${shortId}`,
    `📅 *Date:* ${date}`,
    ``,
    `*Items Ordered:*`,
    items,
    ``,
    `💰 Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}`,
    `🚚 Shipping: ${order.shippingCharge === 0 ? 'Free' : '₹' + order.shippingCharge}`,
    `📊 Tax: ₹${order.tax.toLocaleString('en-IN')}`,
    `✅ *Total: ₹${order.total.toLocaleString('en-IN')}*`,
    ``,
    `💳 Payment: ${payment}`,
    `📍 Deliver to: ${addr.name}, ${addr.city}, ${addr.state} — ${addr.pincode}`,
    `📞 Phone: ${addr.phone}`,
    ``,
    `🔗 Track order: vanienterprises.com/orders/${order.id}`,
    ``,
    `Thank you for shopping with Vani Enterprises! 🙏`,
  ].join('\n');
}

function WhatsAppButton({ order }: { order: Order }) {
  return (
    <button
      type="button"
      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(buildWhatsAppText(order))}`, '_blank')}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#20bd5a]"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      Share on WhatsApp
    </button>
  );
}

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

            <WhatsAppButton order={order} />

            <Link href="/shop" className="flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 shadow-soft">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
