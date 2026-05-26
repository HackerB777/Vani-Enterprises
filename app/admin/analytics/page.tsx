import { supabase } from '@/lib/supabase';
import { STATUS_LABELS } from '@/lib/orders';

export const dynamic = 'force-dynamic';

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

async function getAnalyticsData() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [
    { count: totalOrderCount },
    { data: allRevData },
    { data: allStatusData },
    { data: last7Data },
    { data: allOrderItems },
    { count: productCount },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total'),
    supabase.from('orders').select('status'),
    supabase.from('orders').select('total, createdAt')
      .gte('createdAt', sevenDaysAgo.toISOString()),
    supabase.from('orders').select('items, total'),
    supabase.from('products').select('*', { count: 'exact', head: true }),
  ]);

  const totalRevenue = (allRevData ?? []).reduce((s: number, r: { total: number }) => s + (r.total ?? 0), 0);

  const statusBreakdown: Record<string, number> = {};
  for (const o of (allStatusData ?? [])) {
    statusBreakdown[o.status] = (statusBreakdown[o.status] ?? 0) + 1;
  }

  const revenue7: { label: string; revenue: number; orders: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key   = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
    const dayOrders = (last7Data ?? []).filter((o: { createdAt: string }) => o.createdAt?.startsWith(key));
    revenue7.push({
      label,
      revenue: dayOrders.reduce((s: number, o: { total: number }) => s + (o.total ?? 0), 0),
      orders:  dayOrders.length,
    });
  }

  // Aggregate top products and categories from JSONB items
  const prodMap = new Map<string, { name: string; revenue: number; qty: number }>();
  const catMap  = new Map<string, number>();

  for (const order of (allOrderItems ?? [])) {
    const items = Array.isArray(order.items) ? order.items : [];
    for (const item of items) {
      const slug = item.product?.slug ?? item.slug ?? 'unknown';
      const name = item.product?.name ?? item.name ?? slug;
      const cat  = item.product?.category ?? item.category ?? 'other';
      const qty  = item.quantity ?? 1;
      const rev  = item.total ?? ((item.product?.price ?? 0) * qty);
      const prev = prodMap.get(slug) ?? { name, revenue: 0, qty: 0 };
      prodMap.set(slug, { name, revenue: prev.revenue + rev, qty: prev.qty + qty });
      catMap.set(cat, (catMap.get(cat) ?? 0) + rev);
    }
  }

  const topProds = Array.from(prodMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const topCats: [string, number][] = Array.from(catMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return {
    totalOrderCount: totalOrderCount ?? 0,
    totalRevenue,
    statusBreakdown,
    revenue7,
    topProds,
    topCats,
    productCount: productCount ?? 0,
  };
}

export default async function AdminAnalytics() {
  const { totalOrderCount, totalRevenue, statusBreakdown, revenue7, topProds, topCats, productCount } = await getAnalyticsData();

  const maxRev    = Math.max(...revenue7.map((d) => d.revenue), 1);
  const maxOrd    = Math.max(...revenue7.map((d) => d.orders), 1);
  const maxCatRev = Math.max(...topCats.map(([, v]) => v), 1);

  const deliveryRate = totalOrderCount > 0
    ? Math.round(((statusBreakdown.delivered ?? 0) / totalOrderCount) * 100)
    : 0;

  const cancelRate = totalOrderCount > 0
    ? Math.round(((statusBreakdown.cancelled ?? 0) / totalOrderCount) * 100)
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
          { label: 'Total Revenue',   value: `₹${totalRevenue.toLocaleString('en-IN')}`, sub: `${totalOrderCount} orders`,        color: 'text-brand-600' },
          { label: 'Avg Order Value', value: totalOrderCount ? `₹${Math.round(totalRevenue / totalOrderCount).toLocaleString('en-IN')}` : '₹0', sub: 'per order', color: 'text-stone-800' },
          { label: 'Delivery Rate',   value: `${deliveryRate}%`,  sub: `${statusBreakdown.delivered ?? 0} delivered`,   color: 'text-green-600' },
          { label: 'Cancel Rate',     value: `${cancelRate}%`,    sub: `${statusBreakdown.cancelled ?? 0} cancelled`,   color: cancelRate > 10 ? 'text-red-600' : 'text-stone-800' },
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
          {totalOrderCount === 0 ? (
            <div className="h-40 flex items-center justify-center text-stone-300 text-sm">No orders yet</div>
          ) : (
            <div className="flex h-40 items-end gap-2">
              {revenue7.map((day) => {
                const h = maxRev > 0 ? (day.revenue / maxRev) * 136 : 0;
                return (
                  <div key={day.label} className="group flex flex-1 flex-col items-center gap-1.5">
                    <div className="relative w-full flex flex-col items-center">
                      <svg width="100%" height={Math.max(h, 4)} className="block overflow-visible" aria-hidden="true">
                        <rect x="0" y="0" width="100%" height={Math.max(h, 4)} rx="3" className="fill-brand-200 group-hover:fill-brand-500 transition-all duration-500" />
                      </svg>
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
          {totalOrderCount === 0 ? (
            <div className="h-40 flex items-center justify-center text-stone-300 text-sm">No orders yet</div>
          ) : (
            <div className="flex h-40 items-end gap-2">
              {revenue7.map((day) => {
                const h = maxOrd > 0 ? (day.orders / maxOrd) * 136 : 0;
                return (
                  <div key={day.label} className="group flex flex-1 flex-col items-center gap-1.5">
                    <div className="relative w-full flex flex-col items-center">
                      <svg width="100%" height={Math.max(h, 4)} className="block overflow-visible" aria-hidden="true">
                        <rect x="0" y="0" width="100%" height={Math.max(h, 4)} rx="3" className="fill-indigo-200 group-hover:fill-indigo-500 transition-all duration-500" />
                      </svg>
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
          {Object.keys(statusBreakdown).length === 0 ? (
            <div className="text-sm text-stone-300 text-center py-8">No orders yet</div>
          ) : (
            <div className="space-y-3">
              {Object.entries(statusBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([status, count]) => {
                  const pct = Math.round((count / totalOrderCount) * 100);
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${STATUS_COLORS_SWATCH[status] ?? 'bg-stone-400'}`} />
                          <span className="text-sm text-stone-700">{STATUS_LABELS[status as keyof typeof STATUS_LABELS] ?? status}</span>
                        </div>
                        <span className="text-xs font-semibold text-stone-500">{count} ({pct}%)</span>
                      </div>
                      <progress
                        value={pct}
                        max={100}
                        aria-label={`${STATUS_LABELS[status as keyof typeof STATUS_LABELS] ?? status}: ${pct}%`}
                        className="chart-bar h-1.5 w-full"
                      />
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
                    <progress
                      value={pct}
                      max={100}
                      aria-label={`${cat}: ${pct}%`}
                      className="chart-bar h-1.5 w-full"
                    />
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
            <p className="text-xs mt-1">{productCount} products in catalogue</p>
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
                          <progress
                            value={share}
                            max={100}
                            aria-label={`${p.name}: ${share}%`}
                            className="chart-bar h-1.5 w-20"
                          />
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
