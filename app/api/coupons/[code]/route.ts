import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
const supabase = getSupabaseAdmin();

function isAdmin(session: { user?: { role?: string } } | null) {
  return session?.user?.role === 'admin';
}

// Public — validate a coupon code at checkout
export async function GET(_req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .single();

  if (error || !data) return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });

  const now = new Date();
  if (!data.isActive)                           return NextResponse.json({ error: 'This coupon is no longer active' }, { status: 400 });
  if (new Date(data.validFrom)  > now)          return NextResponse.json({ error: 'This coupon is not valid yet' }, { status: 400 });
  if (new Date(data.validUntil) < now)          return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 });
  if (data.maxUses !== null && data.usedCount >= data.maxUses)
                                                return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 400 });

  return NextResponse.json({
    code:           data.code,
    discountType:   data.discountType,
    discountValue:  data.discountValue,
    minOrderAmount: data.minOrderAmount,
  });
}

// Admin — update a coupon
export async function PUT(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

  const { code } = await params;
  const body = await req.json();
  const { discountType, discountValue, minOrderAmount, maxUses, validFrom, validUntil, isActive } = body;

  const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (discountType    !== undefined) updates.discountType    = discountType;
  if (discountValue   !== undefined) updates.discountValue   = Number(discountValue);
  if (minOrderAmount  !== undefined) updates.minOrderAmount  = Number(minOrderAmount);
  if (maxUses         !== undefined) updates.maxUses         = maxUses ? Number(maxUses) : null;
  if (validFrom       !== undefined) updates.validFrom       = validFrom;
  if (validUntil      !== undefined) updates.validUntil      = validUntil;
  if (isActive        !== undefined) updates.isActive        = isActive;

  const { data, error } = await supabase
    .from('coupons')
    .update(updates)
    .eq('code', code.toUpperCase().trim())
    .select()
    .single();

  if (error || !data) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
  return NextResponse.json({ coupon: data });
}

// Admin — delete a coupon
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

  const { code } = await params;
  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('code', code.toUpperCase().trim());

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
