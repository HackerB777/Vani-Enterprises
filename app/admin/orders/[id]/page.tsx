'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { STATUS_LABELS, STATUS_FLOW, type OrderStatus, type Order, type ParcelEvent, type Shipment } from '@/lib/orders';
import { ParcelTrackingTimeline } from '@/components/store/ParcelTrackingTimeline';

const EVENT_STATUS_PRESETS = [
  'Picked up from warehouse', 'In transit', 'Arrived at hub', 'Out for delivery', 'Delivered', 'Delivery attempt failed', 'Returned to sender',
];

function buildWhatsAppText(order: Order): string {
  const shortId = order.id.slice(-8).toUpperCase();
  const date    = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const items   = order.items.map((i) => `• ${i.product.name} × ${i.quantity} — ₹${i.total.toLocaleString('en-IN')}`).join('\n');
  const payment = order.paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery';
  const addr    = order.shippingAddress;
  return [
    `🛍️ *Vani Enterprises* — Order Update`,
    ``,
    `📦 *Order ID:* #${shortId}`,
    `📅 *Date:* ${date}`,
    `📌 *Status:* ${STATUS_LABELS[order.status] ?? order.status}`,
    ``,
    `*Items:*`,
    items,
    ``,
    `✅ *Total: ₹${order.total.toLocaleString('en-IN')}*`,
    `💳 Payment: ${payment} (${order.paymentStatus})`,
    ``,
    `📍 ${addr.name}, ${addr.addressLine1}, ${addr.city} — ${addr.pincode}`,
    `📞 ${addr.phone}`,
    order.trackingId ? `🚚 Tracking: ${order.courier ? order.courier + ' — ' : ''}${order.trackingId}` : '',
    ``,
    `🔗 vanienterprises.com/orders/${order.id}`,
  ].filter(Boolean).join('\n');
}

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

  const [parcelEvents, setParcelEvents] = useState<ParcelEvent[]>([]);
  const [shipment, setShipment]         = useState<Shipment | null>(null);
  const [eventStatus, setEventStatus]   = useState(EVENT_STATUS_PRESETS[0]);
  const [eventLocation, setEventLocation] = useState('');
  const [eventDesc, setEventDesc]         = useState('');
  const [addingEvent, setAddingEvent]     = useState(false);
  const [eventError, setEventError]       = useState('');

  function loadParcelData() {
    fetch(`/api/parcel-events?orderId=${id}`)
      .then((r) => r.ok ? r.json() : { events: [] })
      .then((data) => setParcelEvents(data.events ?? []))
      .catch(() => {});
    fetch(`/api/shipments?orderId=${id}`)
      .then((r) => r.ok ? r.json() : { shipments: [] })
      .then((data) => setShipment(data.shipments?.[0] ?? null))
      .catch(() => {});
  }

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    setAddingEvent(true); setEventError('');
    try {
      const res  = await fetch('/api/parcel-events', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ orderId: id, status: eventStatus, location: eventLocation || undefined, description: eventDesc || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add tracking update');
      setParcelEvents((prev) => [...prev, data.event]);
      setEventLocation(''); setEventDesc('');
    } catch (err: unknown) {
      setEventError(err instanceof Error ? err.message : 'Failed to add tracking update');
    } finally {
      setAddingEvent(false);
    }
  }

  useEffect(() => {
    loadParcelData();
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

    const initRealtime = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );

        const subscription = supabase
          .channel(`orders:${id}`)
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` }, (payload) => {
            const updatedOrder = payload.new as Order;
            setOrder(updatedOrder);
            setNewStatus(updatedOrder.status);
            setTrackingId(updatedOrder.trackingId ?? '');
            setCourier(updatedOrder.courier ?? '');
            setNotes(updatedOrder.notes ?? '');
          })
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Realtime subscription failed:', err);
      }
    };

    let unsubscribe: (() => void) | null = null;
    initRealtime().then((fn) => { unsubscribe = fn ?? null; });

    return () => {
      if (unsubscribe) unsubscribe();
    };
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
            <h2 className="font-mono text-2xl font-bold text-stone-800">{order.id}</h2>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status] ?? ''}`}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Placed {new Date(order.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.open(
            `https://wa.me/${order.shippingAddress.phone.replace(/\D/g, '')}?text=${encodeURIComponent(buildWhatsAppText(order))}`,
            '_blank'
          )}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#20bd5a]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp Customer
        </button>
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
              style={{ width: `${Math.round((currentStep / Math.max(STATUS_FLOW.length - 1, 1)) * 100)}%` }}
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
              <label htmlFor="order-status" className="block text-xs font-semibold text-stone-500 mb-1.5">Status</label>
              <select
                id="order-status"
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
              type="button"
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

          {/* Live parcel tracking */}
          <ParcelTrackingTimeline events={parcelEvents} shipment={shipment} />

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
            <p className="font-semibold text-stone-700 mb-3">Add Tracking Update</p>
            <form onSubmit={handleAddEvent} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="event-status" className="block text-xs font-semibold text-stone-500 mb-1.5">Status</label>
                  <select
                    id="event-status"
                    value={eventStatus}
                    onChange={(e) => setEventStatus(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-400"
                  >
                    {EVENT_STATUS_PRESETS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="event-location" className="block text-xs font-semibold text-stone-500 mb-1.5">Location</label>
                  <input
                    id="event-location" type="text" value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. Chennai Hub"
                    className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-400"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="event-desc" className="block text-xs font-semibold text-stone-500 mb-1.5">Note (optional)</label>
                <input
                  id="event-desc" type="text" value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="e.g. Package scanned at sorting facility"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-400"
                />
              </div>
              {eventError && <p className="text-sm font-medium text-red-600">{eventError}</p>}
              <button
                type="submit"
                disabled={addingEvent}
                className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
              >
                {addingEvent ? 'Adding…' : 'Add Update'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
