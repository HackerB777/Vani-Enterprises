import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/lib/models/Product';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
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
