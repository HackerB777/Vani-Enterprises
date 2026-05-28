import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

function getUserId(session: { user?: { id?: string } } | null): string | null {
  return session?.user?.id ?? null;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = getUserId(session);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('userId', userId)
      .order('isDefault', { ascending: false })
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch addresses';
    console.error('GET /api/addresses:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = getUserId(session);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { label, name, phone, addressLine1, city, state, pincode, isDefault } = body;

    if (!name || !phone || !addressLine1 || !city || !state || !pincode) {
      return NextResponse.json({ error: 'Missing required address fields' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // If new address is default, clear existing default first
    if (isDefault) {
      await supabase.from('addresses').update({ isDefault: false }).eq('userId', userId);
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert({ userId, label: label ?? 'Home', name, phone, addressLine1, city, state, pincode, isDefault: !!isDefault })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create address';
    console.error('POST /api/addresses:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
