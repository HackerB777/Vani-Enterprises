'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function AdminLoginPage() {
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
        setError('Invalid email or password. Please try again.');
      } else {
        router.replace('/admin');
      }
    } catch {
      setError('Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-stone-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="Vani Enterprises" className="mx-auto h-14 w-auto rounded-xl" />
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.35em] text-stone-500">Admin Panel</p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-8 shadow-2xl">
          <h1 className="mb-6 font-display text-xl font-bold text-white">Sign in to Admin</h1>

          {error && (
            <div className="mb-4 rounded-xl border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-stone-400">Email address</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vanienterprises.com" required autoComplete="email"
                className="w-full rounded-xl border border-stone-700 bg-stone-800 px-4 py-3 text-sm text-white placeholder-stone-600 outline-none transition focus:border-brand-500" />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-stone-400">Password</span>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"
                  required autoComplete="current-password"
                  className="w-full rounded-xl border border-stone-700 bg-stone-800 px-4 py-3 pr-14 text-sm text-white placeholder-stone-600 outline-none transition focus:border-brand-500" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-500 hover:text-stone-300 transition-colors">
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <button type="submit" disabled={loading}
              className="w-full rounded-full bg-brand-600 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-stone-600">
          Vani Enterprises &mdash; Admin access only
        </p>
      </div>
    </div>
  );
}
