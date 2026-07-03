'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

/* ── Icons ─────────────────────────────────────────────── */
const icons: Record<string, React.ReactNode> = {
  dashboard: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  products:  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  orders:    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  categories:<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
  customers: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  inventory: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  coupons:   <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>,
  analytics: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  settings:  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  menu:      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>,
  logout:    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
};

const navItems = [
  { label: 'Dashboard',  href: '/admin',            icon: 'dashboard'  },
  { label: 'Products',   href: '/admin/products',   icon: 'products'   },
  { label: 'Orders',     href: '/admin/orders',     icon: 'orders'     },
  { label: 'Categories', href: '/admin/categories', icon: 'categories' },
  { label: 'Customers',  href: '/admin/customers',  icon: 'customers'  },
  { label: 'Inventory',  href: '/admin/inventory',  icon: 'inventory'  },
  { label: 'Coupons',    href: '/admin/coupons',    icon: 'coupons'    },
  { label: 'Analytics',  href: '/admin/analytics',  icon: 'analytics'  },
  { label: 'Settings',   href: '/admin/settings',   icon: 'settings'   },
];

function Sidebar({
  collapsed,
  onClose,
  userEmail,
  onLogout,
}: {
  collapsed: boolean;
  onClose?: () => void;
  userEmail: string;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <aside className={`admin-sidebar flex h-full flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
      <div className="flex h-16 items-center border-b border-stone-800 px-3">
        {collapsed ? (
          <div className="transform-gpu mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Vani Enterprises" className="h-full w-full rounded-full object-cover object-top" />
          </div>
        ) : (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="transform-gpu flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Vani Enterprises" className="h-full w-full rounded-full object-cover object-top" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white leading-tight truncate">Vani</p>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-stone-500">Admin Panel</p>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active ? 'bg-brand-600/20 text-brand-400' : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
              }`}
            >
              <span className="flex-shrink-0">{icons[item.icon]}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-stone-800 p-3 space-y-1">
        <Link href="/" onClick={onClose} title={collapsed ? 'Visit Store' : undefined}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-stone-500 hover:bg-stone-800 hover:text-stone-300 transition-all">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {!collapsed && <span>Visit Store</span>}
        </Link>

        <button type="button" onClick={onLogout} title={collapsed ? 'Logout' : undefined}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-red-500 hover:bg-red-950 hover:text-red-300 transition-all">
          <span className="flex-shrink-0">{icons.logout}</span>
          {!collapsed && <span>Logout</span>}
        </button>

        {!collapsed && userEmail && (
          <div className="rounded-xl bg-stone-900 px-3 py-2">
            <p className="text-xs font-semibold text-stone-300">Admin</p>
            <p className="text-[10px] text-stone-600 truncate">{userEmail}</p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { data: session, status } = useSession();
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;
    if (status === 'unauthenticated') router.replace('/admin/login');
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.replace('/admin/login');
    }
  }, [status, session, isLoginPage, router]);

  async function handleLogout() {
    await signOut({ redirect: false });
    router.replace('/admin/login');
  }

  if (isLoginPage) return <>{children}</>;

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-stone-950">
        <div className="text-sm text-stone-500">Loading…</div>
      </div>
    );
  }

  if (status !== 'authenticated' || session?.user?.role !== 'admin') return null;

  const userEmail = session.user.email ?? '';

  const pageTitle =
    navItems.find((n) =>
      n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href)
    )?.label ?? 'Admin';

  return (
    <div className="fixed inset-0 z-[200] flex overflow-hidden bg-stone-950 font-sans">
      <div className="hidden md:flex flex-col h-full">
        <Sidebar collapsed={collapsed} userEmail={userEmail} onLogout={handleLogout} />
      </div>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-10 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-20 md:hidden flex flex-col h-full animate-slide-in-right">
            <Sidebar collapsed={false} onClose={() => setMobileOpen(false)} userEmail={userEmail} onLogout={handleLogout} />
          </div>
        </>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-stone-800 bg-stone-900 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 md:hidden" aria-label="Toggle sidebar">
              {icons.menu}
            </button>
            <button type="button" onClick={() => setCollapsed(!collapsed)}
              className="hidden rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 md:block" aria-label="Collapse sidebar">
              {icons.menu}
            </button>
            <h1 className="font-display text-lg font-bold text-white">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/"
              className="hidden rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs font-semibold text-stone-300 transition hover:bg-stone-700 sm:inline-flex items-center gap-1.5">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Store
            </Link>
            <button type="button" onClick={handleLogout} title="Logout"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white hover:bg-brand-700 transition">
              A
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-stone-50">{children}</main>
      </div>
    </div>
  );
}
