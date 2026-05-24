import { NextRequest, NextResponse } from 'next/server';
import { createOrderPayload } from '@/lib/orders';
import type { Product } from '@/lib/products';

/* ── choose storage: Firestore when env vars present, else in-memory ── */
async function getStorage() {
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    const { getFirestoreOrders, createFirestoreOrder } = await import('@/lib/firestoreOrders');
    return { getOrders: getFirestoreOrders, createOrder: createFirestoreOrder };
  }
  const { orders } = await import('@/lib/orderStorage');
  return {
    getOrders: async () => orders,
    createOrder: async (order: ReturnType<typeof createOrderPayload>) => {
      orders.push(order);
      return order;
    },
  };
}

export async function GET() {
  try {
    const { getOrders } = await getStorage();
    const all = await getOrders();
    return NextResponse.json(all);
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
    const { createOrder } = await getStorage();
    const order = await createOrder(orderData);

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error('POST /api/orders:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
