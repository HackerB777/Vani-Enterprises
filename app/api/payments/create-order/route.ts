import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { amount, receipt, orderId } = await request.json();

    if (!amount || Number(amount) < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, total, paymentMethod')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.paymentMethod !== 'razorpay') {
      return NextResponse.json({ error: 'Order is not configured for Razorpay payment' }, { status: 400 });
    }

    const roundedAmount = Math.round(Number(amount));
    if (roundedAmount !== order.total) {
      return NextResponse.json({ error: 'Amount mismatch with order total' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay credentials are not configured' }, { status: 500 });
    }

    const Razorpay = (await import('razorpay')).default;
    const rzp = new Razorpay({
      key_id:     keyId,
      key_secret: keySecret,
    });

    const rzpOrder = await rzp.orders.create({
      amount:   Math.round(roundedAmount * 100),
      currency: 'INR',
      receipt:  receipt ?? orderId,
    });

    return NextResponse.json({
      razorpayOrderId: rzpOrder.id,
      amount:          rzpOrder.amount,
      currency:        rzpOrder.currency,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create Razorpay order';
    console.error('POST /api/payments/create-order:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
