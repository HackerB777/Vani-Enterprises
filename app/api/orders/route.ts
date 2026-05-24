import { NextRequest, NextResponse } from 'next/server';
import { createOrderPayload } from '@/lib/orders';
import type { Product } from '@/lib/products';
import { connectDB } from '@/lib/mongodb';
import { OrderModel } from '@/lib/models/Order';

export async function GET() {
  try {
    await connectDB();
    const orders = await OrderModel.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders);
  } catch (err) {
    console.error('GET /api/orders:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shippingAddress, paymentMethod } = body;

    if (!items || !shippingAddress || !paymentMethod) {
      return NextResponse.json({ error: 'Missing order payload' }, { status: 400 });
    }

    const orderItems = items.map((item: { product: Product; quantity: number }) => ({
      product:  item.product,
      quantity: item.quantity,
      total:    item.product.price * item.quantity,
    }));

    const orderData = createOrderPayload(orderItems, shippingAddress, paymentMethod);

    await connectDB();
    const order = await OrderModel.create(orderData);

    return NextResponse.json({ order: order.toObject() }, { status: 201 });
  } catch (err) {
    console.error('POST /api/orders:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
