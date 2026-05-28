import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

function getUserId(session: { user?: { id?: string } } | null): string | null {
  return session?.user?.id ?? null;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userId = getUserId(session);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { label, name, phone, addressLine1, city, state, pincode, isDefault } = body;

    const supabase = getSupabaseAdmin();

    const { data: existing } = await supabase
      .from('addresses').select('userId').eq('id', id).single();
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (isDefault) {
      await supabase.from('addresses').update({ isDefault: false }).eq('userId', userId);
    }

    const { data, error } = await supabase
      .from('addresses')
      .update({ label, name, phone, addressLine1, city, state, pincode, isDefault: !!isDefault })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update address';
    console.error('PUT /api/addresses/[id]:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userId = getUserId(session);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabaseAdmin();

    const { data: existing } = await supabase
      .from('addresses').select('userId').eq('id', id).single();
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const { error } = await supabase.from('addresses').delete().eq('id', id);
    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete address';
    console.error('DELETE /api/addresses/[id]:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
