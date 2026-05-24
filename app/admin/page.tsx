'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getDashboardStats, getRecentOrders, getLast7DaysRevenue, getStatusBreakdown } from '@/lib/adminStats';
import { STATUS_LABELS } from '@/lib/orders';

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

function KpiCard({ title, value, sub, color }: { title: string; value: string; sub: string; color: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">{title}</p>
      <p className={`mt-2 font-display text-3xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-xs text-stone-500">{sub}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const stats   = getDashboardStats();
  const recent  = getRecentOrders(8);
  const revenue = getLast7DaysRevenue();
  const statusBreakdown = getStatusBreakdown();

  const maxRev = Math.max(...revenue.map((d) => d.revenue), 1);

  return (
    <div className="space-y-8 p-6 lg:p-8">

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Today's Revenue"
          value={`₹${stats.todayRevenue.toLocaleString('en-IN')}`}
          sub={`${stats.todayOrders} order${stats.todayOrders !== 1 ? 's' : ''} today`}
          color="text-brand-600"
        />
        <KpiCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
          sub={`${stats.totalOrders} orders all time`}
          color="text-stone-800"
        />
        <KpiCard
          title="Pending Orders"
          value={String(stats.pendingOrders)}
          sub="placed / confirmed / processing"
          color="text-amber-600"
        />
        <KpiCard
          title="Low Stock"
          value={String(stats.lowStockCount)}
          sub={`of ${stats.totalProducts} products`}
          color={stats.lowStockCount > 0 ? 'text-red-600' : 'text-green-600'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Revenue bar chart */}
        <div className="lg:col-span-2 rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Revenue</p>
              <p className="mt-0.5 font-display text-lg font-bold text-stone-800">Last 7 Days</p>
            </div>
          </div>
          <div className="flex h-40 items-end gap-2">
            {revenue.map((day) => {
              const heightPct = maxRev > 0 ? (day.revenue / maxRev) * 100 : 0;
              return (
                <div key={day.label} className="group flex flex-1 flex-col items-center gap-1">
                  <div className="relative w-full">
                    <div
                      className="w-full rounded-t-md bg-brand-200 transition-all duration-500 group-hover:bg-brand-500"
                      style={{ height: `${Math.max(heightPct * 1.4, 4)}px` }}
                    />
                    <div className="absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded bg-stone-800 px-1.5 py-0.5 text-[10px] text-white group-hover:block whitespace-nowrap">
                      ₹{day.revenue.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-stone-400">{day.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Orders</p>
          <p className="mt-0.5 mb-4 font-display text-lg font-bold text-stone-800">By Status</p>
          <div className="space-y-2.5">
            {Object.entries(statusBreakdown).length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-6">No orders yet</p>
            ) : (
              Object.entries(statusBreakdown).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status] ?? 'bg-stone-100 text-stone-600'}`}>
                    {STATUS_LABELS[status as keyof typeof STATUS_LABELS] ?? status}
                  </span>
                  <span className="text-sm font-semibold text-stone-700">{count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-stone-200 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Orders</p>
            <p className="font-display text-lg font-bold text-stone-800">Recent</p>
          </div>
          <Link
            href="/admin/orders"
            className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:bg-stone-50"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="py-16 text-center text-stone-400">
            <svg className="mx-auto mb-3 h-10 w-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium">No orders yet</p>
            <p className="text-xs mt-1">Orders placed by customers will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-left">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-stone-400">Order ID</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-400">Customer</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-400">Items</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-400">Total</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-400">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-stone-400">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {recent.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-3 font-mono text-xs font-medium text-stone-600">{order.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-800">{order.shippingAddress.name}</p>
                      <p className="text-xs text-stone-400">{order.shippingAddress.city}</p>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{order.items.length}</td>
                    <td className="px-4 py-3 font-semibold text-stone-800">₹{order.total.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status] ?? 'bg-stone-100 text-stone-600'}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs font-semibold text-brand-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
