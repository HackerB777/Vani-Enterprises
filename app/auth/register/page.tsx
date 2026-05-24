'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm]   = useState({ name: '', email: '', phone: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-stone-50 py-12">
      <div className="w-full max-w-md px-4">
        <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-soft">
          <div className="mb-6 text-center">
            <Link href="/" className="inline-flex flex-col items-center leading-none">
              <span className="font-display text-2xl font-bold text-stone-900">Vani</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-stone-400">Enterprises</span>
            </Link>
            <h1 className="mt-4 font-display text-2xl font-bold text-stone-900">Create your account</h1>
            <p className="mt-1 text-sm text-stone-500">Join thousands of happy customers</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-stone-700">Full Name</span>
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder="Priya Sharma"
                required
                autoComplete="name"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-brand-400 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-stone-700">Email Address</span>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-brand-400 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-stone-700">Phone Number</span>
              <input
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                placeholder="9999999999"
                autoComplete="tel"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-brand-400 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-stone-700">Password</span>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Create a strong password"
                  required
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 pr-12 text-sm text-stone-900 outline-none transition focus:border-brand-400 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-500 hover:text-stone-700 transition-colors"
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <button
              type="submit"
              className="w-full rounded-full bg-stone-900 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700 shadow-card"
            >
              Create Account
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-stone-400">
            By creating an account you agree to our{' '}
            <Link href="/contact" className="text-brand-600 hover:underline">Terms of Service</Link>
            {' '}&amp;{' '}
            <Link href="/contact" className="text-brand-600 hover:underline">Privacy Policy</Link>.
          </p>

          <p className="mt-4 text-center text-sm text-stone-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
