'use client';

import { getLast7DaysRevenue, getDashboardStats, getStatusBreakdown } from '@/lib/adminStats';
import { orders } from '@/lib/orderStorage';
import { STATUS_LABELS } from '@/lib/orders';
import { products } from '@/lib/products';

const STATUS_COLORS_SWATCH: Record<string, string> = {
  placed:           'bg-blue-400',
  confirmed:        'bg-indigo-400',
  processing:       'bg-amber-400',
  shipped:          'bg-purple-400',
  out_for_delivery: 'bg-orange-400',
  delivered:        'bg-green-400',
  cancelled:        'bg-red-400',
  returned:         'bg-stone-400',
};

function getTopProducts(limit = 5) {
  const counts: Record<string, { name: string; revenue: number; qty: number }> = {};
  for (const order of orders) {
    for (const item of order.items) {
      const slug = item.product.slug;
      if (!counts[slug]) counts[slug] = { name: item.product.name, revenue: 0, qty: 0 };
      counts[slug].revenue += item.total;
      counts[slug].qty     += item.quantity;
    }
  }
  return Object.values(counts)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

function getTopCategories() {
  const counts: Record<string, number> = {};
  for (const order of orders) {
    for (const item of order.items) {
      const cat = item.product.category;
      counts[cat] = (counts[cat] ?? 0) + item.total;
    }
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
}

export default function AdminAnalytics() {
  const stats      = getDashboardStats();
  const revenue7   = getLast7DaysRevenue();
  const breakdown  = getStatusBreakdown();
  const topProds   = getTopProducts();
  const topCats    = getTopCategories();

  const maxRev     = Math.max(...revenue7.map((d) => d.revenue), 1);
  const maxOrd     = Math.max(...revenue7.map((d) => d.orders), 1);
  const totalRevenue = stats.totalRevenue;
  const maxCatRev  = Math.max(...topCats.map(([, v]) => v), 1);

  const deliveryRate = orders.length > 0
    ? Math.round(((breakdown.delivered ?? 0) / orders.length) * 100)
    : 0;

  const cancelRate = orders.length > 0
    ? Math.round(((breakdown.cancelled ?? 0) / orders.length) * 100)
    : 0;

  return (
    <div className="p-6 lg:p-8 space-y-8">

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Reports</p>
        <h2 className="font-display text-2xl font-bold text-stone-800">Analytics</h2>
      </div>

      {/* Summary KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Revenue',   value: `₹${totalRevenue.toLocaleString('en-IN')}`, sub: `${orders.length} orders`,        color: 'text-brand-600' },
          { label: 'Avg Order Value', value: orders.length ? `₹${Math.round(totalRevenue / orders.length).toLocaleString('en-IN')}` : '₹0', sub: 'per order', color: 'text-stone-800' },
          { label: 'Delivery Rate',   value: `${deliveryRate}%`,  sub: `${breakdown.delivered ?? 0} delivered`,   color: 'text-green-600' },
          { label: 'Cancel Rate',     value: `${cancelRate}%`,    sub: `${breakdown.cancelled ?? 0} cancelled`,   color: cancelRate > 10 ? 'text-red-600' : 'text-stone-800' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">{label}</p>
            <p className={`mt-2 font-display text-3xl font-bold ${color}`}>{value}</p>
            <p className="mt-1 text-xs text-stone-500">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Revenue chart */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-0.5">Revenue</p>
          <p className="font-display text-lg font-bold text-stone-800 mb-5">Last 7 Days</p>
          {orders.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-stone-300 text-sm">No orders yet</div>
          ) : (
            <div className="flex h-40 items-end gap-2">
              {revenue7.map((day) => {
                const h = maxRev > 0 ? (day.revenue / maxRev) * 136 : 0;
                return (
                  <div key={day.label} className="group flex flex-1 flex-col items-center gap-1.5">
                    <div className="relative w-full flex flex-col items-center">
                      <div
                        className="w-full rounded-t-md bg-brand-200 group-hover:bg-brand-500 transition-all duration-500"
                        style={{ height: `${Math.max(h, 4)}px` }}
                      />
                      {day.revenue > 0 && (
                        <div className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded bg-stone-800 px-1.5 py-0.5 text-[10px] text-white group-hover:block whitespace-nowrap z-10">
                          ₹{day.revenue.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-stone-400">{day.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Orders chart */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-0.5">Orders</p>
          <p className="font-display text-lg font-bold text-stone-800 mb-5">Last 7 Days</p>
          {orders.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-stone-300 text-sm">No orders yet</div>
          ) : (
            <div className="flex h-40 items-end gap-2">
              {revenue7.map((day) => {
                const h = maxOrd > 0 ? (day.orders / maxOrd) * 136 : 0;
                return (
                  <div key={day.label} className="group flex flex-1 flex-col items-center gap-1.5">
                    <div className="relative w-full flex flex-col items-center">
                      <div
                        className="w-full rounded-t-md bg-indigo-200 group-hover:bg-indigo-500 transition-all duration-500"
                        style={{ height: `${Math.max(h, 4)}px` }}
                      />
                      {day.orders > 0 && (
                        <div className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded bg-stone-800 px-1.5 py-0.5 text-[10px] text-white group-hover:block whitespace-nowrap z-10">
                          {day.orders} order{day.orders !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-stone-400">{day.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Status breakdown */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-0.5">Distribution</p>
          <p className="font-display text-lg font-bold text-stone-800 mb-5">Order Statuses</p>
          {Object.keys(breakdown).length === 0 ? (
            <div className="text-sm text-stone-300 text-center py-8">No orders yet</div>
          ) : (
            <div className="space-y-3">
              {Object.entries(breakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([status, count]) => {
                  const pct = Math.round((count / orders.length) * 100);
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${STATUS_COLORS_SWATCH[status] ?? 'bg-stone-400'}`} />
                          <span className="text-sm text-stone-700">{STATUS_LABELS[status as keyof typeof STATUS_LABELS] ?? status}</span>
                        </div>
                        <span className="text-xs font-semibold text-stone-500">{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${STATUS_COLORS_SWATCH[status] ?? 'bg-stone-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Top categories */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-0.5">Revenue</p>
          <p className="font-display text-lg font-bold text-stone-800 mb-5">By Category</p>
          {topCats.length === 0 ? (
            <div className="text-sm text-stone-300 text-center py-8">No orders yet</div>
          ) : (
            <div className="space-y-3">
              {topCats.map(([cat, rev]) => {
                const pct = Math.round((rev / maxCatRev) * 100);
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-stone-700 capitalize">{cat}</span>
                      <span className="text-xs font-semibold text-stone-500">₹{rev.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-400 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Top products table */}
      <div className="rounded-2xl border border-stone-200 bg-white shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Catalogue</p>
          <p className="font-display text-lg font-bold text-stone-800">
            {topProds.length > 0 ? 'Top Products by Revenue' : 'Products'}
          </p>
        </div>
        {topProds.length === 0 ? (
          <div className="py-14 text-center text-stone-400">
            <p className="text-sm font-medium">No sales data yet</p>
            <p className="text-xs mt-1">{products.length} products in catalogue</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50 text-left">
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">#</th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Product</th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Qty Sold</th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Revenue</th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {topProds.map((p, i) => {
                  const share = totalRevenue > 0 ? Math.round((p.revenue / totalRevenue) * 100) : 0;
                  return (
                    <tr key={p.name} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-500">
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-medium text-stone-800">{p.name}</td>
                      <td className="px-4 py-4 text-stone-600">{p.qty}</td>
                      <td className="px-4 py-4 font-semibold text-stone-800">₹{p.revenue.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                            <div className="h-full rounded-full bg-brand-400" style={{ width: `${share}%` }} />
                          </div>
                          <span className="text-xs text-stone-400">{share}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
