import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { amount, receipt } = await request.json();

    if (!amount || Number(amount) < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const Razorpay = (await import('razorpay')).default;
    const rzp = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await rzp.orders.create({
      amount:   Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt:  receipt ?? `VE-${Date.now()}`,
    });

    return NextResponse.json({
      razorpayOrderId: order.id,
      amount:          order.amount,
      currency:        order.currency,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create Razorpay order';
    console.error('POST /api/payments/create-order:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
