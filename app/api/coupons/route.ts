import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
const supabase = getSupabaseAdmin();

function isAdmin(session: { user?: { role?: string } } | null) {
  return session?.user?.role === 'admin';
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('createdAt', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

  const body = await req.json();
  const { code, discountType, discountValue, minOrderAmount, maxUses, validFrom, validUntil, isActive } = body;

  if (!code || !discountType || !discountValue) {
    return NextResponse.json({ error: 'code, discountType and discountValue are required' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const defaultFrom  = validFrom  ?? now;
  const defaultUntil = validUntil ?? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('coupons')
    .insert({
      code:            code.toUpperCase().trim(),
      discountType,
      discountValue:   Number(discountValue),
      minOrderAmount:  Number(minOrderAmount ?? 0),
      maxUses:         maxUses ? Number(maxUses) : null,
      usedCount:       0,
      validFrom:       defaultFrom,
      validUntil:      defaultUntil,
      isActive:        isActive ?? true,
      createdAt:       now,
      updatedAt:       now,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'Coupon code already exists' }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ coupon: data }, { status: 201 });
}
