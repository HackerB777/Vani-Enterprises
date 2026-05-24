import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    await connectDB();

    const exists = await User.findOne({ email: email.toLowerCase() }).lean();
    if (exists) {
      return NextResponse.json({ error: 'This email is already registered. Please sign in.' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await User.create({ name, email: email.toLowerCase(), password: hashed, phone, role: 'user' });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('POST /api/register:', err);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
