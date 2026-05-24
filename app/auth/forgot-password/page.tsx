'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('');
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-stone-50 py-12">
      <div className="w-full max-w-md px-4">
        <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-soft">
          <div className="mb-6 text-center">
            <Link href="/" className="inline-flex flex-col items-center leading-none">
              <span className="font-display text-2xl font-bold text-stone-900">Vani</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-stone-400">Enterprises</span>
            </Link>
            <h1 className="mt-4 font-display text-2xl font-bold text-stone-900">Reset password</h1>
            <p className="mt-1 text-sm text-stone-500">
              Enter your email and we&apos;ll send a reset link.
            </p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-green-600" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="mt-4 font-semibold text-stone-900">Check your inbox!</p>
              <p className="mt-2 text-sm text-stone-500">
                Reset link sent to <span className="font-medium text-stone-800">{email}</span>.
              </p>
              <Link href="/auth/login" className="mt-5 inline-flex rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-stone-700">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-brand-400 focus:bg-white"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-stone-900 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700 shadow-card disabled:opacity-60"
              >
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
              <p className="text-center text-sm text-stone-500">
                Remember your password?{' '}
                <Link href="/auth/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
