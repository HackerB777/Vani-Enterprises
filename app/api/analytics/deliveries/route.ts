import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

interface DeliveryMetrics {
  totalOrders: number;
  deliveredOrders: number;
  deliveryRate: number;
  averageDeliveryDays: number;
  ordersInTransit: number;
  delayedOrders: number;
  cancelledOrders: number;
  ordersByStatus: Record<string, number>;
  ordersByCourier: Record<string, number>;
  ordersByPaymentMethod: Record<string, number>;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
    }

    const isAdmin = (session.user as { role?: string }).role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') ?? '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const supabase = getSupabaseAdmin();

    const { data: allOrders, error: ordersError } = await supabase
      .from('orders')
      .select('id, status, paymentMethod, createdAt, updatedAt, courier')
      .gte('createdAt', startDate.toISOString())
      .order('createdAt', { ascending: false });

    if (ordersError) throw ordersError;

    const orders = allOrders ?? [];
    const now = new Date();

    const metrics: DeliveryMetrics = {
      totalOrders: orders.length,
      deliveredOrders: 0,
      deliveryRate: 0,
      averageDeliveryDays: 0,
      ordersInTransit: 0,
      delayedOrders: 0,
      cancelledOrders: 0,
      ordersByStatus: {},
      ordersByCourier: {},
      ordersByPaymentMethod: {},
    };

    let totalDeliveryDays = 0;
    let deliveryCount = 0;

    for (const order of orders) {
      const status = order.status as string;
      metrics.ordersByStatus[status] = (metrics.ordersByStatus[status] ?? 0) + 1;
      metrics.ordersByPaymentMethod[order.paymentMethod] = (metrics.ordersByPaymentMethod[order.paymentMethod] ?? 0) + 1;

      if (order.courier) {
        metrics.ordersByCourier[order.courier] = (metrics.ordersByCourier[order.courier] ?? 0) + 1;
      }

      if (status === 'delivered') {
        metrics.deliveredOrders++;
        const created = new Date(order.createdAt);
        const updated = new Date(order.updatedAt ?? order.createdAt);
        const days = Math.floor((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        totalDeliveryDays += days;
        deliveryCount++;
      } else if (status === 'cancelled') {
        metrics.cancelledOrders++;
      } else if (['shipped', 'out_for_delivery'].includes(status)) {
        metrics.ordersInTransit++;
        const created = new Date(order.createdAt);
        const daysSinceOrder = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceOrder > 7) {
          metrics.delayedOrders++;
        }
      }
    }

    if (deliveryCount > 0) {
      metrics.averageDeliveryDays = Math.round(totalDeliveryDays / deliveryCount);
      metrics.deliveryRate = Math.round((metrics.deliveredOrders / metrics.totalOrders) * 100);
    }

    return NextResponse.json({ metrics });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch delivery analytics';
    console.error('GET /api/analytics/deliveries:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
