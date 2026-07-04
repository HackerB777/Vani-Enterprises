import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { errorMessage } from '@/lib/errors';

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

    const { orderId, amount, reason } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, paymentMethod, paymentStatus, total, razorpayPaymentId')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.paymentMethod !== 'razorpay' || order.paymentStatus !== 'paid') {
      return NextResponse.json({ error: 'Order payment cannot be refunded' }, { status: 400 });
    }

    if (!order.razorpayPaymentId) {
      return NextResponse.json({ error: 'No Razorpay payment ID found for this order' }, { status: 400 });
    }

    const refundAmount = amount ? Math.round(Number(amount)) : order.total;
    if (refundAmount <= 0 || refundAmount > order.total) {
      return NextResponse.json({ error: 'Invalid refund amount' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay credentials not configured' }, { status: 500 });
    }

    const Razorpay = (await import('razorpay')).default;
    const rzp = new Razorpay({
      key_id:     keyId,
      key_secret: keySecret,
    });

    try {
      const refund = await rzp.payments.refund(order.razorpayPaymentId, {
        amount: Math.round(refundAmount * 100),
        notes: { reason: reason ?? 'Admin initiated refund', orderId },
      });

      const newPaymentStatus = refundAmount === order.total ? 'refunded' : 'partial_refund';
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          paymentStatus: newPaymentStatus,
          status: refundAmount === order.total ? 'cancelled' : 'processing',
          updatedAt: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Failed to update order refund status:', updateError.message);
        return NextResponse.json({ error: 'Refund processed but failed to update order' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        refund: {
          id: refund.id,
          amount: refund.amount ? refund.amount / 100 : 0,
          status: refund.status,
          orderId,
        },
      });
    } catch (razorpayErr: unknown) {
      const msg = razorpayErr instanceof Error ? razorpayErr.message : 'Razorpay refund failed';
      console.error('Razorpay refund error:', msg);
      return NextResponse.json({ error: `Refund failed: ${msg}` }, { status: 500 });
    }
  } catch (err: unknown) {
    const msg = errorMessage(err, 'Refund processing failed');
    console.error('POST /api/payments/refund:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
