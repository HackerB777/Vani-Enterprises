import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createOrderPayload } from '@/lib/orders';
import type { IProduct } from '@/lib/models/Product';
import { getSupabaseAdmin } from '@/lib/supabase';
const supabase = getSupabaseAdmin();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Sign in to view orders' }, { status: 401 });
    }

    let q = supabase.from('orders').select('*').order('createdAt', { ascending: false });

    // Admin sees all orders; customers see only their own
    if ((session.user as { role?: string }).role !== 'admin') {
      q = q.eq('userId', (session.user as { id?: string }).id ?? '');
    }

    const { data, error } = await q;
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error('GET /api/orders:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { items, shippingAddress, paymentMethod, discount = 0 } = body;

    if (!items || !shippingAddress || !paymentMethod) {
      return NextResponse.json({ error: 'Missing order payload' }, { status: 400 });
    }

    const safeDiscount = Math.max(0, Number(discount) || 0);

    const orderItems = items.map((item: { product: IProduct; quantity: number }) => ({
      product:  item.product,
      quantity: item.quantity,
      total:    item.product.price * item.quantity,
    }));

    const orderData = {
      ...createOrderPayload(orderItems, shippingAddress, paymentMethod, safeDiscount),
      userId: (session?.user as { id?: string })?.id ?? null,
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    if (error) throw error;

    return NextResponse.json({ order: data }, { status: 201 });
  } catch (err) {
    console.error('POST /api/orders:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
