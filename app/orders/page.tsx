'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrderSummary {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  itemCount?: number;
}

const STATUS_COLORS: Record<string, string> = {
  placed:           'bg-blue-100 text-blue-700',
  confirmed:        'bg-indigo-100 text-indigo-700',
  processing:       'bg-amber-100 text-amber-700',
  shipped:          'bg-orange-100 text-orange-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered:        'bg-green-100 text-green-700',
  cancelled:        'bg-red-100 text-red-700',
  returned:         'bg-stone-100 text-stone-600',
};

export default function OrdersPage() {
  const [orders, setOrders]   = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    fetch('/api/orders')
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || 'Unable to load orders');
        return res.json();
      })
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b border-stone-200 bg-white">
        <div className="container py-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Order history</p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-stone-900">My Orders</h1>
        </div>
      </div>

      <div className="container py-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 animate-pulse-soft rounded-2xl bg-stone-200" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-stone-400" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="mt-5 font-display text-2xl font-bold text-stone-900">No orders yet</p>
            <p className="mt-2 text-stone-500">Your order history will appear here after your first purchase.</p>
            <Link href="/shop" className="mt-6 rounded-full bg-stone-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusClass = STATUS_COLORS[order.status] ?? 'bg-stone-100 text-stone-600';
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-soft transition hover:border-stone-300 hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-stone-100">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="text-stone-500" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">Order #{order.id.slice(-8).toUpperCase()}</p>
                      <p className="mt-0.5 text-xs text-stone-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-stone-900">₹{order.total.toLocaleString('en-IN')}</p>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-stone-400 hidden sm:block" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
