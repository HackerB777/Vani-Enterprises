import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase';
import { errorMessage } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } =
      await request.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: 'Razorpay secret is not configured' }, { status: 500 });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json({ error: 'Missing payment fields or order ID' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, paymentMethod, total, paymentStatus')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.paymentMethod !== 'razorpay') {
      return NextResponse.json({ error: 'Order is not configured for Razorpay payment' }, { status: 400 });
    }

    if (order.paymentStatus === 'paid') {
      return NextResponse.json({ error: 'This order has already been paid' }, { status: 400 });
    }

    // Verify Razorpay HMAC-SHA256 signature
    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      console.warn(`Invalid signature for order ${orderId}: expected ${expected}, got ${razorpay_signature}`);
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    const { error: updateError, data: updatedOrder } = await supabase
      .from('orders')
      .update({
        paymentStatus:     'paid',
        status:            'confirmed',
        razorpayOrderId:   razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        updatedAt:         new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError || !updatedOrder) {
      console.error('verify: supabase update failed', updateError?.message);
      return NextResponse.json({ error: 'Failed to update order payment status' }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: unknown) {
    const msg = errorMessage(err, 'Payment verification failed');
    console.error('POST /api/payments/verify:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
