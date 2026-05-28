import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const supabase = getSupabaseAdmin();
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, phone, role, createdAt')
      .eq('email', session.user.email.toLowerCase())
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id:        data.id,
      name:      data.name,
      email:     data.email,
      phone:     data.phone ?? '',
      role:      data.role,
      createdAt: data.createdAt,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = getSupabaseAdmin();
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { name, phone } = await request.json();

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters.' }, { status: 400 });
    }
    if (phone && !/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json({ error: 'Enter a valid 10-digit Indian mobile number.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ name: name.trim(), phone: phone?.trim() ?? null })
      .eq('email', session.user.email.toLowerCase())
      .select('id, name, email, phone')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, user: data });
  } catch {
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
  }
}
