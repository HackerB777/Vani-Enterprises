import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { categories as defaultCategories } from '@/lib/products';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    // Try key-based lookup first, then fall back to id='main' row
    const { data: keyRow } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'categories')
      .maybeSingle();

    if (keyRow?.value && Array.isArray(keyRow.value)) {
      return NextResponse.json(keyRow.value);
    }

    // Fall back to id='main' row where categories may be stored as a field
    const { data: mainRow } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'main')
      .maybeSingle();

    if (mainRow?.categories && Array.isArray(mainRow.categories)) {
      return NextResponse.json(mainRow.categories);
    }

    return NextResponse.json(defaultCategories);
  } catch {
    return NextResponse.json(defaultCategories);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const supabase = getSupabaseAdmin();
    const cats = await request.json();
    if (!Array.isArray(cats)) {
      return NextResponse.json({ error: 'Expected array' }, { status: 400 });
    }

    // Try key-based upsert first
    const { error: keyErr } = await supabase
      .from('settings')
      .upsert(
        { key: 'categories', value: cats, updatedAt: new Date().toISOString() },
        { onConflict: 'key' }
      );

    if (!keyErr) return NextResponse.json({ success: true });

    // Fall back: store in id='main' row as a 'categories' field
    const { data: existing } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'main')
      .maybeSingle();

    const merged = { ...(existing ?? {}), id: 'main', categories: cats };
    const { error: mainErr } = await supabase
      .from('settings')
      .upsert(merged, { onConflict: 'id' });

    if (mainErr) throw mainErr;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /api/categories:', err);
    return NextResponse.json({ error: 'Failed to save categories' }, { status: 500 });
  }
}
