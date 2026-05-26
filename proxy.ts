import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin login page — always public
  if (pathname === '/admin/login') return NextResponse.next();

  // All /admin/* routes — require admin session
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== 'admin') {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // Everything else (store, /auth/*, /api/*) — fully public
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
