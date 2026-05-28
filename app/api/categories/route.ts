import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { categories as defaultCategories } from '@/lib/products';

const KEY = 'categories';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', KEY)
      .single();

    const cats = data?.value ?? defaultCategories;
    return NextResponse.json(Array.isArray(cats) ? cats : defaultCategories);
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
    const { error } = await supabase
      .from('settings')
      .upsert({ key: KEY, value: cats, updatedAt: new Date().toISOString() }, { onConflict: 'key' });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save categories' }, { status: 500 });
  }
}
