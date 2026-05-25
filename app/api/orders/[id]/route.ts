import { NextRequest, NextResponse } from 'next/server';
import type { OrderStatus } from '@/lib/orders';
import { connectDB } from '@/lib/mongodb';
import { OrderModel } from '@/lib/models/Order';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const order = await OrderModel.findOne({ id }).lean();
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;
    await connectDB();
    const order = await OrderModel.findOneAndUpdate(
      { id },
      { $set: updates },
      { new: true }
    ).lean();

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
