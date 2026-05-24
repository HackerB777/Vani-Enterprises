import { orders } from './orderStorage';
import { products } from './products';

export function getDashboardStats() {
  const today = new Date().toDateString();
  const todayOrders    = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const pendingOrders  = orders.filter((o) => ['placed', 'confirmed', 'processing'].includes(o.status));
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');

  const totalRevenue   = orders.reduce((sum, o) => sum + o.total, 0);
  const todayRevenue   = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const lowStockCount  = products.filter((p) => (p.stock ?? 999) < 10).length;

  return {
    totalOrders:    orders.length,
    todayOrders:    todayOrders.length,
    todayRevenue,
    totalRevenue,
    pendingOrders:  pendingOrders.length,
    deliveredOrders: deliveredOrders.length,
    lowStockCount,
    totalProducts:  products.length,
  };
}

export function getRecentOrders(limit = 8) {
  return [...orders].reverse().slice(0, limit);
}

export function getLast7DaysRevenue() {
  const days: { label: string; revenue: number; orders: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label   = d.toLocaleDateString('en-IN', { weekday: 'short' });
    const dayStr  = d.toDateString();
    const dayOrds = orders.filter((o) => new Date(o.createdAt).toDateString() === dayStr);
    days.push({
      label,
      revenue: dayOrds.reduce((s, o) => s + o.total, 0),
      orders:  dayOrds.length,
    });
  }
  return days;
}

export function getStatusBreakdown() {
  const counts: Record<string, number> = {};
  for (const o of orders) {
    counts[o.status] = (counts[o.status] ?? 0) + 1;
  }
  return counts;
}
