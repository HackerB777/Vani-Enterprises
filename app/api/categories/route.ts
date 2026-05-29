import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { categories as defaultCategories } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('settings')
      .select('categories')
      .eq('id', 'main')
      .maybeSingle();

    if (error) throw error;

    // Row exists — return whatever admin saved (including empty array)
    if (data !== null) {
      return NextResponse.json(Array.isArray(data.categories) ? data.categories : []);
    }

    // No row yet — admin hasn't set anything, return empty
    return NextResponse.json([]);
  } catch {
    // DB unreachable — fall back to defaults so site doesn't fully break
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

    const { error } = await supabase
      .from('settings')
      .upsert({ id: 'main', categories: cats }, { onConflict: 'id' });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /api/categories:', err);
    return NextResponse.json({ error: 'Failed to save categories' }, { status: 500 });
  }
}
