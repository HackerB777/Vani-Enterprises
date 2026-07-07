import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const DEFAULTS = { freeShippingEnabled: false, shippingCost: 99 };

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('settings')
      .select('freeShippingEnabled, shippingCost')
      .eq('id', 'main')
      .maybeSingle();

    if (error || !data) return NextResponse.json(DEFAULTS);

    return NextResponse.json({
      freeShippingEnabled: data.freeShippingEnabled ?? DEFAULTS.freeShippingEnabled,
      shippingCost:        data.shippingCost        ?? DEFAULTS.shippingCost,
    });
  } catch {
    return NextResponse.json(DEFAULTS);
  }
}
