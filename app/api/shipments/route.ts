import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
    }

    const url = new URL(request.url);
    const orderId = url.searchParams.get('orderId');

    const supabase = getSupabaseAdmin();
    let q = supabase.from('shipments').select('*');

    if (orderId) {
      q = q.eq('orderId', orderId);
    }

    const { data, error } = await q;
    if (error) throw error;

    return NextResponse.json({ shipments: data ?? [] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch shipments';
    console.error('GET /api/shipments:', msg);
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
    const { orderId, courier, shipmentId, trackingUrl, estimatedDeliveryDate } = body;

    if (!orderId || !courier) {
      return NextResponse.json({ error: 'Order ID and courier required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: existingShipment } = await supabase
      .from('shipments')
      .select('id')
      .eq('orderId', orderId)
      .single();

    let result;
    if (existingShipment) {
      const { data, error } = await supabase
        .from('shipments')
        .update({
          courier,
          shipmentId: shipmentId ?? null,
          trackingUrl: trackingUrl ?? null,
          estimatedDeliveryDate: estimatedDeliveryDate ?? null,
          status: 'shipped',
          lastSyncedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .eq('orderId', orderId)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('shipments')
        .insert({
          orderId,
          courier,
          shipmentId: shipmentId ?? null,
          trackingUrl: trackingUrl ?? null,
          estimatedDeliveryDate: estimatedDeliveryDate ?? null,
          status: 'shipped',
          lastSyncedAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    const { error: updateOrderError } = await supabase
      .from('orders')
      .update({
        status: 'shipped',
        courier: courier,
        trackingId: shipmentId ?? null,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateOrderError) {
      console.error('Failed to update order with shipment info:', updateOrderError.message);
    }

    return NextResponse.json({ shipment: result }, { status: existingShipment ? 200 : 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create shipment';
    console.error('POST /api/shipments:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
