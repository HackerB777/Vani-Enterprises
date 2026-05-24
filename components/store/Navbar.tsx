'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

function SearchIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

const navLinks = [
  { label: 'Shop',         href: '/shop' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Best Sellers', href: '/best-sellers' },
  { label: 'Offers',       href: '/offers' },
];

export function Navbar() {
  const cartCount     = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { data: session } = useSession();
  const userName = session?.user
    ? (session.user.name || session.user.email?.split('@')[0] || 'Account')
    : null;
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery]           = useState('');
  const [userMenu, setUserMenu]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else          document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-shadow duration-300 ${
          scrolled ? 'bg-white/95 shadow-card backdrop-blur-sm' : 'bg-white'
        }`}
      >
        {/* Promo bar */}
        <div className="bg-stone-900 py-2 text-center text-xs font-medium tracking-wide text-stone-300">
          Free shipping on orders above{' '}
          <span className="text-orange-400 font-semibold">₹999</span>
          &nbsp;·&nbsp; COD available across India
          &nbsp;·&nbsp; 7-day easy returns
        </div>

        <div className="border-b border-stone-100">
          <div className="container flex items-center justify-between gap-4 py-3.5">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0" aria-label="Vani Enterprises – Home">
              <div className="overflow-hidden rounded-xl bg-stone-900 transition-opacity hover:opacity-90">
                {/* mix-blend-mode:screen makes the black background invisible on the dark container */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpg"
                  alt="Vani Enterprises"
                  className="logo-screen h-12 w-auto"
                />
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-0.5 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-stone-600 transition-all hover:bg-stone-100 hover:text-stone-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-0.5">
              {/* Search */}
              <div className="relative hidden sm:block">
                {searchOpen ? (
                  <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 animate-fade-in">
                    <SearchIcon />
                    <input
                      autoFocus
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search products…"
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') { setSearchOpen(false); setQuery(''); }
                      }}
                      onBlur={() => { if (!query) setSearchOpen(false); }}
                      className="w-44 bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
                    />
                    <button
                      type="button"
                      onClick={() => { setSearchOpen(false); setQuery(''); }}
                      className="text-stone-400 hover:text-stone-600"
                      aria-label="Close search"
                    >
                      <XIcon />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    aria-label="Search"
                    className="rounded-full p-2.5 text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
                  >
                    <SearchIcon />
                  </button>
                )}
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                aria-label={`Wishlist (${wishlistCount} items)`}
                className="relative rounded-full p-2.5 text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
              >
                <HeartIcon />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[9px] font-bold text-white">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                aria-label={`Cart (${cartCount} items)`}
                className="relative rounded-full p-2.5 text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
              >
                <BagIcon />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[9px] font-bold text-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <div className="relative hidden sm:block">
                {userName ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setUserMenu(!userMenu)}
                      className="flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700"
                    >
                      <UserIcon />
                      <span className="max-w-[80px] truncate">{userName}</span>
                    </button>
                    {userMenu && (
                      <div className="absolute right-0 top-10 z-50 w-44 rounded-2xl border border-stone-100 bg-white py-1 shadow-xl">
                        <Link href="/orders" onClick={() => setUserMenu(false)} className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">My Orders</Link>
                        <Link href="/wishlist" onClick={() => setUserMenu(false)} className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">Wishlist</Link>
                        <div className="my-1 border-t border-stone-100" />
                        <button
                          type="button"
                          onClick={() => { signOut(); setUserMenu(false); }}
                          className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    aria-label="Account"
                    className="rounded-full p-2.5 text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 block"
                  >
                    <UserIcon />
                  </Link>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                className="rounded-full p-2.5 text-stone-600 transition hover:bg-stone-100 lg:hidden"
              >
                {menuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white shadow-xl2 animate-slide-in-right lg:hidden">
            <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
              <Link href="/" onClick={() => setMenuOpen(false)} aria-label="Vani Enterprises – Home">
                <div className="overflow-hidden rounded-xl bg-stone-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.jpg" alt="Vani Enterprises" className="logo-screen h-10 w-auto" />
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-full p-1.5 text-stone-500 hover:bg-stone-100"
                aria-label="Close menu"
              >
                <XIcon />
              </button>
            </div>

            <div className="px-5 py-4">
              {/* Mobile search */}
              <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2.5 mb-4">
                <SearchIcon />
                <input
                  type="search"
                  placeholder="Search products…"
                  className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
                />
              </div>

              <nav className="flex flex-col gap-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 hover:text-stone-900"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-2 border-t border-stone-100" />
                {userName ? (
                  <>
                    <p className="px-4 py-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">Hi, {userName}</p>
                    <Link href="/orders" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50">My Orders</Link>
                    <button
                      type="button"
                      onClick={() => { signOut(); setMenuOpen(false); }}
                      className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50">
                      Sign in
                    </Link>
                    <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50">
                      Create account
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
