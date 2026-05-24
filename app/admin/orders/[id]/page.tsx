'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { STATUS_LABELS, STATUS_FLOW, type OrderStatus, type Order } from '@/lib/orders';

const STATUS_COLORS: Record<string, string> = {
  placed:           'bg-blue-100 text-blue-700',
  confirmed:        'bg-indigo-100 text-indigo-700',
  processing:       'bg-amber-100 text-amber-700',
  shipped:          'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered:        'bg-green-100 text-green-700',
  cancelled:        'bg-red-100 text-red-700',
  returned:         'bg-stone-100 text-stone-700',
};

const ALL_STATUSES: OrderStatus[] = [
  'placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned',
];

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder]       = useState<Order | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState('');

  const [newStatus, setNewStatus]     = useState<OrderStatus>('placed');
  const [trackingId, setTrackingId]   = useState('');
  const [courier, setCourier]         = useState('');
  const [notes, setNotes]             = useState('');

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.order) {
          setOrder(data.order);
          setNewStatus(data.order.status);
          setTrackingId(data.order.trackingId ?? '');
          setCourier(data.order.courier ?? '');
          setNotes(data.order.notes ?? '');
        } else {
          setError('Order not found');
        }
        setLoading(false);
      })
      .catch(() => { setError('Failed to load order'); setLoading(false); });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res  = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, trackingId, courier, notes }),
      });
      const data = await res.json();
      if (data.order) {
        setOrder(data.order);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-stone-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8 text-center">
        <p className="text-stone-500">{error || 'Order not found'}</p>
        <Link href="/admin/orders" className="mt-4 inline-block text-sm text-brand-600 hover:underline">← Back to orders</Link>
      </div>
    );
  }

  const currentStep = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl">

      {/* Header */}
      <div className="flex items-start gap-3">
        <Link
          href="/admin/orders"
          className="mt-1 rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
          aria-label="Back"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Order Detail</p>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl font-bold text-stone-800 font-mono">{order.id}</h2>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status] ?? ''}`}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Placed {new Date(order.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-medium text-green-700">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Order updated successfully
        </div>
      )}

      {/* Progress tracker */}
      {currentStep >= 0 && (
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">Progress</p>
          <div className="relative">
            <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-stone-200" />
            <div
              className="absolute top-3.5 left-0 h-0.5 bg-brand-500 transition-all duration-700"
              style={{ width: `${(currentStep / (STATUS_FLOW.length - 1)) * 100}%` }}
            />
            <div className="relative flex justify-between">
              {STATUS_FLOW.map((s, i) => {
                const done   = i <= currentStep;
                const active = i === currentStep;
                return (
                  <div key={s} className="flex flex-col items-center gap-1.5">
                    <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all ${
                      done
                        ? 'border-brand-500 bg-brand-500'
                        : 'border-stone-200 bg-white'
                    } ${active ? 'ring-4 ring-brand-100' : ''}`}>
                      {done && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-[10px] font-medium text-center max-w-[56px] leading-tight ${done ? 'text-brand-600' : 'text-stone-400'}`}>
                      {STATUS_LABELS[s]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">

        {/* Update panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card space-y-4">
            <p className="font-semibold text-stone-700">Update Order</p>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-400"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">Tracking ID</label>
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="e.g. DTDC123456789"
                className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">Courier</label>
              <input
                type="text"
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                placeholder="e.g. DTDC, Delhivery"
                className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">Internal Notes</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes..."
                className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>

          {/* Payment info */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <p className="font-semibold text-stone-700 mb-3">Payment</p>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone-500">Method</dt>
                <dd className="font-medium text-stone-800 uppercase">{order.paymentMethod}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Status</dt>
                <dd className={`font-semibold capitalize ${
                  order.paymentStatus === 'paid' ? 'text-green-600' :
                  order.paymentStatus === 'pending' ? 'text-amber-600' :
                  order.paymentStatus === 'failed' ? 'text-red-600' : 'text-blue-600'
                }`}>{order.paymentStatus}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Order details */}
        <div className="lg:col-span-3 space-y-4">

          {/* Items */}
          <div className="rounded-2xl border border-stone-200 bg-white shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100">
              <p className="font-semibold text-stone-700">Items ({order.items.length})</p>
            </div>
            <div className="divide-y divide-stone-50">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center text-stone-400">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-800 truncate">{item.product.name}</p>
                    <p className="text-xs text-stone-400 capitalize">{item.product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-stone-800">₹{item.total.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-stone-400">× {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-100 px-6 py-4 bg-stone-50 space-y-1.5">
              <div className="flex justify-between text-sm text-stone-500">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-500">
                <span>Shipping</span>
                <span>{order.shippingCharge === 0 ? 'Free' : `₹${order.shippingCharge}`}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-500">
                <span>Tax (5%)</span>
                <span>₹{order.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-stone-800 border-t border-stone-200 pt-1.5">
                <span>Total</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <p className="font-semibold text-stone-700 mb-3">Shipping Address</p>
            <address className="not-italic space-y-0.5 text-sm text-stone-600">
              <p className="font-semibold text-stone-800">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
              <p className="mt-1 text-stone-400">{order.shippingAddress.phone}</p>
              <p className="text-stone-400">{order.shippingAddress.email}</p>
            </address>
          </div>

        </div>
      </div>
    </div>
  );
}
