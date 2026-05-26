'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export function UserWelcomeBanner() {
  const { data: session, status } = useSession();

  if (status === 'loading') return null;

  /* ── Logged-in greeting ── */
  if (session?.user) {
    const name      = session.user.name ?? session.user.email ?? 'there';
    const firstName = name.split(' ')[0];

    return (
      <div className="bg-gradient-to-r from-brand-700 to-brand-600 text-white">
        <div className="container py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar circle */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 border border-white/30 text-sm font-bold text-white">
                {firstName[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-brand-200">Welcome back,</p>
                <p className="font-semibold text-sm leading-tight truncate">{firstName}!</p>
              </div>
            </div>

            {/* Quick action links */}
            <nav className="flex items-center gap-1 shrink-0">
              <Link
                href="/orders"
                className="flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="hidden sm:inline">My Orders</span>
                <span className="sm:hidden">Orders</span>
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="hidden sm:inline">Wishlist</span>
                <span className="sm:hidden">Saved</span>
              </Link>
              <Link
                href="/account"
                className="flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Account</span>
                <span className="sm:hidden">Me</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    );
  }

  /* ── Logged-out prompt ── */
  return (
    <div className="border-b border-stone-200 bg-stone-100">
      <div className="container py-2.5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-stone-600">
            <span className="font-semibold text-stone-800">Sign in</span> to track orders, save to wishlist & get exclusive offers
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/auth/login"
              className="rounded-full bg-brand-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-brand-700"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="rounded-full border border-stone-300 bg-white px-4 py-1.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
