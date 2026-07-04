import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CANCELLABLE_STATUSES } from '@/lib/orders';
import { getSupabaseAdmin } from '@/lib/supabase';
import { errorMessage } from '@/lib/errors';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });

    const { id } = await params;
    const supabase = getSupabaseAdmin();

    const { data: order, error } = await supabase.from('orders').select('*').eq('id', id).single();
    if (error || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const isAdmin = (session.user as { role?: string }).role === 'admin';
    const userId  = (session.user as { id?: string }).id;
    if (!isAdmin && order.userId !== userId) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      return NextResponse.json(
        { error: `This order can no longer be cancelled — it is already ${String(order.status).replace(/_/g, ' ')}.` },
        { status: 400 }
      );
    }

    let paymentStatus = order.paymentStatus;

    if (order.paymentMethod === 'razorpay' && order.paymentStatus === 'paid') {
      if (!order.razorpayPaymentId) {
        return NextResponse.json(
          { error: 'Unable to process a refund automatically. Please contact support to cancel this order.' },
          { status: 502 }
        );
      }

      const keyId     = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keyId || !keySecret) {
        return NextResponse.json(
          { error: 'Refunds are temporarily unavailable. Please contact support to cancel this order.' },
          { status: 502 }
        );
      }

      try {
        const Razorpay = (await import('razorpay')).default;
        const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
        await rzp.payments.refund(order.razorpayPaymentId, {
          amount: Math.round(order.total * 100),
          notes: { reason: 'Customer cancelled order', orderId: id },
        });
        paymentStatus = 'refunded';
      } catch (refundErr) {
        console.error('Refund during order cancel failed:', refundErr);
        return NextResponse.json(
          { error: 'Unable to process a refund automatically. Please contact support to cancel this order.' },
          { status: 502 }
        );
      }
    }

    const { data: updated, error: updateError } = await supabase
      .from('orders')
      .update({ status: 'cancelled', paymentStatus, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;
    return NextResponse.json({ order: updated });
  } catch (err: unknown) {
    const msg = errorMessage(err, 'Failed to cancel order');
    console.error('POST /api/orders/[id]/cancel:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
