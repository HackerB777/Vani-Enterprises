import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const supabase = getSupabaseAdmin();
  try {
    const { searchParams } = new URL(request.url);
    const category     = searchParams.get('category');
    const isBestSeller = searchParams.get('isBestSeller');
    const isNewArrival = searchParams.get('isNewArrival');
    const isOnSale     = searchParams.get('isOnSale');
    const isFeatured   = searchParams.get('isFeatured');
    const search       = searchParams.get('search');
    const limit        = searchParams.get('limit');

    let q = supabase.from('products').select('*').order('createdAt', { ascending: false });

    if (category)               q = q.eq('category', category);
    if (isBestSeller === 'true') q = q.eq('isBestSeller', true);
    if (isNewArrival === 'true') q = q.eq('isNewArrival', true);
    if (isOnSale     === 'true') q = q.eq('isOnSale', true);
    if (isFeatured   === 'true') q = q.eq('isFeatured', true);
    if (search) {
      // Strip chars that PostgREST uses as filter operators to prevent filter injection
      const safe = search.replace(/[%_(),.|*^]/g, ' ').trim().slice(0, 100);
      if (safe) q = q.or(`name.ilike.%${safe}%,description.ilike.%${safe}%`);
    }
    if (limit)                   q = q.limit(Number(limit));

    const { data, error } = await q;
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error('GET /api/products:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseAdmin();
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { data, error } = await supabase
      .from('products')
      .insert({ ...body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create product';
    console.error('POST /api/products:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
