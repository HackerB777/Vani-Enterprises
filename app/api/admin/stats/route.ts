import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today    = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

    const [
      { count: totalOrders },
      { count: todayOrders },
      { count: pendingOrders },
      { count: deliveredOrders },
      { count: totalProducts },
      { count: lowStockCount },
      { data: revenueData },
      { data: todayRevData },
    ] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true })
        .gte('createdAt', today.toISOString()).lt('createdAt', tomorrow.toISOString()),
      supabase.from('orders').select('*', { count: 'exact', head: true })
        .in('status', ['placed', 'confirmed', 'processing']),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'delivered'),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).lt('stock', 10).gte('stock', 0),
      supabase.from('orders').select('total'),
      supabase.from('orders').select('total')
        .gte('createdAt', today.toISOString()).lt('createdAt', tomorrow.toISOString()),
    ]);

    const totalRevenue = (revenueData ?? []).reduce((s: number, r: { total: number }) => s + (r.total ?? 0), 0);
    const todayRevenue = (todayRevData ?? []).reduce((s: number, r: { total: number }) => s + (r.total ?? 0), 0);

    return NextResponse.json({
      totalOrders, todayOrders, pendingOrders, deliveredOrders,
      totalProducts, lowStockCount, totalRevenue, todayRevenue,
    });
  } catch (err) {
    console.error('GET /api/admin/stats:', err);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
