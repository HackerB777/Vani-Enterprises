'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) {
        setError('Invalid email or password.');
      } else {
        router.replace('/');
      }
    } catch {
      setError('Sign in failed. Please try again.');
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
            <h1 className="mt-4 font-display text-2xl font-bold text-stone-900">Welcome back</h1>
            <p className="mt-1 text-sm text-stone-500">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-stone-700">Email address</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required autoComplete="email"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-brand-400 focus:bg-white" />
            </label>

            <label className="block">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-700">Password</span>
                <Link href="/auth/forgot-password" className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"
                  required autoComplete="current-password"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 pr-12 text-sm text-stone-900 outline-none transition focus:border-brand-400 focus:bg-white" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-500 hover:text-stone-700 transition-colors">
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <button type="submit" disabled={loading}
              className="w-full rounded-full bg-stone-900 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700 shadow-card disabled:opacity-60">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
