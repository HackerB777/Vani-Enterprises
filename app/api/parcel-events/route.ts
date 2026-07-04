import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { errorMessage } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
    }

    const url = new URL(request.url);
    const orderId = url.searchParams.get('orderId');
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const isAdmin = (session.user as { role?: string }).role === 'admin';
    if (!isAdmin) {
      const { data: order } = await supabase.from('orders').select('userId').eq('id', orderId).single();
      const userId = (session.user as { id?: string }).id;
      if (!order || order.userId !== userId) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
    }

    const { data, error } = await supabase
      .from('parcel_events')
      .select('*')
      .eq('orderId', orderId)
      .order('eventTimestamp', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ events: data ?? [] });
  } catch (err: unknown) {
    const msg = errorMessage(err, 'Failed to fetch parcel events');
    console.error('GET /api/parcel-events:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
    }

    const isAdmin = (session.user as { role?: string }).role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { orderId, status, location, description, eventTimestamp, metadata } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('parcel_events')
      .insert({
        orderId,
        status,
        location: location ?? null,
        description: description ?? null,
        eventTimestamp: eventTimestamp ?? new Date().toISOString(),
        metadata: metadata ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ event: data }, { status: 201 });
  } catch (err: unknown) {
    const msg = errorMessage(err, 'Failed to create parcel event');
    console.error('POST /api/parcel-events:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
