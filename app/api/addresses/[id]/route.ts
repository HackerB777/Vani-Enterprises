import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

function getUserId(session: Awaited<ReturnType<typeof getServerSession>>): string | null {
  return (session?.user as { id?: string })?.id ?? null;
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = getUserId(session);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { label, name, phone, addressLine1, city, state, pincode, isDefault } = body;

    const supabase = getSupabaseAdmin();

    // Ensure address belongs to this user
    const { data: existing } = await supabase
      .from('addresses').select('userId').eq('id', params.id).single();
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Clear existing default if promoting this one
    if (isDefault) {
      await supabase.from('addresses').update({ isDefault: false }).eq('userId', userId);
    }

    const { data, error } = await supabase
      .from('addresses')
      .update({ label, name, phone, addressLine1, city, state, pincode, isDefault: !!isDefault })
      .eq('id', params.id)
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

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = getUserId(session);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getSupabaseAdmin();

    // Ensure address belongs to this user before deleting
    const { data: existing } = await supabase
      .from('addresses').select('userId').eq('id', params.id).single();
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const { error } = await supabase.from('addresses').delete().eq('id', params.id);
    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete address';
    console.error('DELETE /api/addresses/[id]:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
