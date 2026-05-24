import { NextResponse } from 'next/server';
import type { OrderStatus } from '@/lib/orders';

async function getStorage() {
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    const { getFirestoreOrder, updateFirestoreOrder } = await import('@/lib/firestoreOrders');
    return { getOrder: getFirestoreOrder, updateOrder: updateFirestoreOrder };
  }
  const { orders } = await import('@/lib/orderStorage');
  return {
    getOrder: async (id: string) => orders.find((o) => o.id === id) ?? null,
    updateOrder: async (id: string, updates: Record<string, unknown>) => {
      const idx = orders.findIndex((o) => o.id === id);
      if (idx !== -1) Object.assign(orders[idx], updates);
    },
  };
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { getOrder } = await getStorage();
    const order = await getOrder(params.id);
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { status, trackingId, courier, notes, paymentStatus } = body as {
      status?: OrderStatus; trackingId?: string; courier?: string;
      notes?: string; paymentStatus?: string;
    };

    const updates: Record<string, unknown> = {};
    if (status        !== undefined) updates.status        = status;
    if (trackingId    !== undefined) updates.trackingId    = trackingId;
    if (courier       !== undefined) updates.courier       = courier;
    if (notes         !== undefined) updates.notes         = notes;
    if (paymentStatus !== undefined) updates.paymentStatus = paymentStatus;

    const { getOrder, updateOrder } = await getStorage();
    const existing = await getOrder(params.id);
    if (!existing) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    await updateOrder(params.id, updates);
    return NextResponse.json({ order: { ...existing, ...updates } });
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
