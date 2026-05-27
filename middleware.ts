import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role as string | undefined;

    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      if (role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (pathname === '/admin/login') return true;
        if (pathname.startsWith('/admin')) return !!token;
        if (
          pathname.startsWith('/checkout') ||
          pathname.startsWith('/orders') ||
          pathname.startsWith('/account')
        ) return !!token;
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/checkout/:path*', '/orders/:path*', '/account/:path*'],
};
