import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/lib/models/Product';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category     = searchParams.get('category');
    const isBestSeller = searchParams.get('isBestSeller');
    const isNewArrival = searchParams.get('isNewArrival');
    const isOnSale     = searchParams.get('isOnSale');
    const isFeatured   = searchParams.get('isFeatured');
    const search       = searchParams.get('search');
    const limit        = searchParams.get('limit');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (category)               query.category     = category;
    if (isBestSeller === 'true') query.isBestSeller = true;
    if (isNewArrival === 'true') query.isNewArrival = true;
    if (isOnSale     === 'true') query.isOnSale     = true;
    if (isFeatured   === 'true') query.isFeatured   = true;
    if (search) query.$or = [
      { name:        { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];

    let q = Product.find(query).sort({ createdAt: -1 });
    if (limit) q = q.limit(Number(limit));

    await connectDB();
    const products = await q.lean();
    return NextResponse.json(products);
  } catch (err) {
    console.error('GET /api/products:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const body = await request.json();
    const now  = new Date().toISOString();
    const product = await Product.create({ ...body, createdAt: now, updatedAt: now });
    return NextResponse.json(product.toObject(), { status: 201 });
  } catch (err: unknown) {
    console.error('POST /api/products:', err);
    const msg = err instanceof Error ? err.message : 'Failed to create product';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
