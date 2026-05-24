'use client';

import { useState } from 'react';
import Link from 'next/link';
import { orders } from '@/lib/orderStorage';
import { STATUS_LABELS, type OrderStatus } from '@/lib/orders';

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

const PAYMENT_COLORS: Record<string, string> = {
  paid:     'text-green-600',
  pending:  'text-amber-600',
  failed:   'text-red-600',
  refunded: 'text-blue-600',
};

const STATUS_OPTIONS: OrderStatus[] = [
  'placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned',
];

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [search, setSearch] = useState('');
  const [sortDesc, setSortDesc] = useState(true);

  const filtered = orders
    .filter((o) => {
      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch = !q || o.id.toLowerCase().includes(q) ||
        o.shippingAddress.name.toLowerCase().includes(q) ||
        o.shippingAddress.email.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    })
    .sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return sortDesc ? tb - ta : ta - tb;
    });

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Management</p>
        <h2 className="font-display text-2xl font-bold text-stone-800">Orders</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by order ID, customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | OrderStatus)}
          aria-label="Filter by status"
          className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400"
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        <button
          onClick={() => setSortDesc(!sortDesc)}
          className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          </svg>
          {sortDesc ? 'Newest first' : 'Oldest first'}
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-stone-200 bg-white shadow-card overflow-hidden">
        {orders.length === 0 ? (
          <div className="py-20 text-center text-stone-400">
            <svg className="mx-auto mb-4 h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium">No orders yet</p>
            <p className="mt-1 text-xs">Place an order from the store to see it here</p>
            <Link href="/shop" className="mt-3 inline-block text-xs font-semibold text-brand-600 hover:underline">
              Visit store →
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50 text-left">
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Order ID</th>
                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Customer</th>
                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Items</th>
                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Total</th>
                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Payment</th>
                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Status</th>
                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Date</th>
                    <th className="px-4 py-3.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium text-stone-600">{order.id}</td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-stone-800">{order.shippingAddress.name}</p>
                        <p className="text-xs text-stone-400">{order.shippingAddress.email}</p>
                      </td>
                      <td className="px-4 py-4 text-stone-600">{order.items.length}</td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-stone-800">₹{order.total.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-stone-400 uppercase">{order.paymentMethod}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-semibold capitalize ${PAYMENT_COLORS[order.paymentStatus] ?? 'text-stone-600'}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status] ?? 'bg-stone-100 text-stone-600'}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-stone-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="rounded-lg border border-stone-200 px-3 py-1 text-xs font-semibold text-stone-600 transition hover:border-brand-300 hover:text-brand-600"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="py-12 text-center text-stone-400 border-t border-stone-100">
                <p className="text-sm">No orders match the current filters</p>
              </div>
            )}

            <div className="border-t border-stone-100 px-6 py-3 text-xs text-stone-400">
              Showing {filtered.length} of {orders.length} order{orders.length !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
