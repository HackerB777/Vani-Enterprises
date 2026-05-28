'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

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
  const router = useRouter();

  const userName = session?.user
    ? (session.user.name || session.user.email?.split('@')[0] || 'Account')
    : null;

  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [query,      setQuery]      = useState('');
  const [mobileQuery, setMobileQuery] = useState('');
  const [userMenu,   setUserMenu]   = useState(false);
  const userMenuRef   = useRef<HTMLDivElement>(null);
  const hamburgerRef  = useRef<HTMLButtonElement>(null);

  /* scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* lock body when mobile drawer open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  /* close user dropdown on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
    setTimeout(() => hamburgerRef.current?.focus(), 0);
  }

  function goSearch(q: string) {
    const term = q.trim();
    if (!term) return;
    router.push(`/shop?search=${encodeURIComponent(term)}`);
  }

  function handleSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { goSearch(query); setQuery(''); }
  }
  function handleMobileSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { goSearch(mobileQuery); setMobileQuery(''); setMenuOpen(false); }
  }

  return (
    <>
      {/* ── Top promo bar ── */}
      <div className="bg-stone-900 py-1.5 text-center text-[11px] font-medium tracking-wide text-stone-400">
        Free shipping above{' '}
        <span className="font-semibold text-orange-400">₹999</span>
        &nbsp;·&nbsp;COD available pan India&nbsp;·&nbsp;7-day easy returns
      </div>

      {/* ── Main header ── */}
      <header className={`sticky top-0 z-50 w-full bg-stone-900 transition-shadow duration-300 ${scrolled ? 'shadow-[0_2px_12px_rgba(0,0,0,0.35)]' : ''}`}>
        <div className="flex w-full items-center gap-2 py-3 lg:gap-4 lg:py-4">

          {/* Logo */}
          <Link href="/" aria-label="Vani Enterprises – Home" className="flex-shrink-0">
            <div className="flex h-10 w-14 items-center justify-center overflow-hidden rounded-lg bg-white border border-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="Vani Enterprises" loading="lazy" className="h-full w-auto object-contain" />
            </div>
          </Link>

          {/* Brand name (desktop) */}
          <div className="hidden lg:block flex-shrink-0">
            <p className="text-sm font-bold text-white leading-tight">Vani Enterprises</p>
            <p className="text-[10px] text-stone-400 font-medium italic">Chennai's Favourite Store</p>
          </div>

          {/* ── Search bar — prominent, like Flipkart ── */}
          <div className="flex flex-1 items-center overflow-hidden rounded-lg bg-white shadow-md min-w-0">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchKey}
              placeholder="Search for products, brands and categories…"
              className="flex-1 min-w-0 px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={() => goSearch(query)}
              aria-label="Search"
              className="flex h-full items-center gap-1.5 bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 flex-shrink-0"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          {/* ── Right icons ── */}
          <div className="flex items-center gap-1 flex-shrink-0">

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label={`Wishlist (${wishlistCount} items)`}
              className="relative flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-stone-300 transition hover:bg-stone-800 hover:text-white"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="hidden text-[10px] font-medium lg:block">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[9px] font-bold text-white">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label={`Cart (${cartCount} items)`}
              className="relative flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-stone-300 transition hover:bg-stone-800 hover:text-white"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="hidden text-[10px] font-medium lg:block">Cart</span>
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[9px] font-bold text-white">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <div className="relative" ref={userMenuRef}>
              {userName ? (
                <>
                  <button
                    type="button"
                    onClick={() => setUserMenu(!userMenu)}
                    className="flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-stone-300 transition hover:bg-stone-800 hover:text-white"
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="hidden max-w-[72px] truncate text-[10px] font-medium lg:block">{userName}</span>
                  </button>
                  {userMenu && (
                    <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-stone-100 bg-white py-1.5 shadow-xl">
                      <div className="border-b border-stone-100 px-4 py-2.5">
                        <p className="text-xs font-semibold text-stone-900 truncate">{userName}</p>
                        <p className="text-[10px] text-stone-400 truncate">{session?.user?.email}</p>
                      </div>
                      <Link href="/account" onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        My Account
                      </Link>
                      <Link href="/orders" onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        My Orders
                      </Link>
                      <Link href="/wishlist" onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        Wishlist
                      </Link>
                      <div className="my-1 border-t border-stone-100" />
                      <button type="button" onClick={() => { signOut(); setUserMenu(false); }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/auth/login"
                  className="flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-stone-300 transition hover:bg-stone-800 hover:text-white"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden text-[10px] font-medium lg:block">Login</span>
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button type="button" ref={hamburgerRef} onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen ? 'true' : 'false'}
              className="rounded-lg p-3 text-stone-300 transition hover:bg-stone-800 lg:hidden"
            >
              {menuOpen ? (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* ── Desktop category nav strip ── */}
        <div className="hidden border-t border-stone-800 lg:block">
          <div className="container flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2.5 text-sm font-medium text-stone-400 transition hover:text-white hover:bg-stone-800 rounded-sm"
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-auto flex items-center gap-4 py-2 text-[11px] text-stone-500">
              <Link href="/orders" className="hover:text-stone-300 transition">Track Order</Link>
              <Link href="/about" className="hover:text-stone-300 transition">About Us</Link>
              <Link href="/contact" className="hover:text-stone-300 transition">Help</Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={closeMenu} />
          <div className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-2xl animate-slide-in-right lg:hidden">

            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-stone-100 bg-stone-900 px-5 py-4">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                <div className="flex h-9 w-12 items-center justify-center overflow-hidden rounded-lg bg-white border border-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.jpg" alt="Vani Enterprises" loading="lazy" className="h-full w-auto object-contain" />
                </div>
              </Link>
              <button type="button" onClick={closeMenu} aria-label="Close menu"
                className="rounded-full p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
              {/* Mobile search */}
              <div className="hidden min-w-0 flex-1 overflow-hidden rounded-xl bg-white shadow-md sm:flex">
                <input
                  type="search"
                  value={mobileQuery}
                  onChange={(e) => setMobileQuery(e.target.value)}
                  onKeyDown={handleMobileSearchKey}
                  placeholder="Search products…"
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm text-stone-800 outline-none placeholder:text-stone-400"
                />
                <button type="button" aria-label="Search" onClick={() => { goSearch(mobileQuery); setMobileQuery(''); setMenuOpen(false); }}
                  className="bg-brand-600 px-4 text-white hover:bg-brand-700 transition">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              </div>

              {/* Auth */}
              {userName ? (
                <Link href="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl bg-brand-50 border border-brand-200 px-4 py-3 transition hover:bg-brand-100">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {userName[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-stone-900 truncate">Hi, {userName}</p>
                    <p className="text-[10px] text-stone-400 truncate">{session?.user?.email}</p>
                  </div>
                  <svg className="ml-auto text-brand-400 shrink-0" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)}
                    className="rounded-xl border border-brand-600 py-2.5 text-center text-sm font-semibold text-brand-600 hover:bg-brand-50 transition">
                    Sign In
                  </Link>
                  <Link href="/auth/register" onClick={() => setMenuOpen(false)}
                    className="rounded-xl bg-brand-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-700 transition">
                    Register
                  </Link>
                </div>
              )}

              {/* Nav links */}
              <nav>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">Browse</p>
                <div className="space-y-0.5">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                      className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 hover:text-stone-900">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* More links */}
              <div className="border-t border-stone-100 pt-4 space-y-0.5">
                {userName && (
                  <Link href="/account" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm text-stone-600 hover:bg-stone-50 transition">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    My Account
                  </Link>
                )}
                <Link href="/orders" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm text-stone-600 hover:bg-stone-50 transition">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  Track Order
                </Link>
                {userName && (
                  <button type="button" onClick={() => { signOut(); setMenuOpen(false); }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
