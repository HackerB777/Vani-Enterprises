import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { OrderStatus } from '@/lib/orders';
import { supabase } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Sign in to view this order' }, { status: 401 });
    }

    const { id } = await params;
    const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
    if (error || !data) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // Non-admin users can only view their own orders
    const isAdmin = (session.user as { role?: string }).role === 'admin';
    const userId  = (session.user as { id?: string }).id;
    if (!isAdmin && data.userId !== userId) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order: data });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, trackingId, courier, notes, paymentStatus } = body as {
      status?: OrderStatus; trackingId?: string; courier?: string;
      notes?: string; paymentStatus?: string;
    };

    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (status        !== undefined) updates.status        = status;
    if (trackingId    !== undefined) updates.trackingId    = trackingId;
    if (courier       !== undefined) updates.courier       = courier;
    if (notes         !== undefined) updates.notes         = notes;
    if (paymentStatus !== undefined) updates.paymentStatus = paymentStatus;

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error || !data) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ order: data });
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
