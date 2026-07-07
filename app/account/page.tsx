'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import type { IProduct } from '@/lib/models/Product';
import type { AddressRecord } from '@/lib/addresses';
import { INDIAN_STATES } from '@/lib/states';
import { lookupPincode } from '@/lib/pincode';

/* ── Types ──────────────────────────────────────────────── */
interface UserProfile { id: string; name: string; email: string; phone: string; role: string; createdAt: string; }
interface OrderSummary { id: string; total: number; status: string; createdAt: string; items?: { product: { name: string } }[]; }

type Tab = 'overview' | 'orders' | 'addresses' | 'wishlist' | 'profile' | 'security';

const EMPTY_ADDR = { label: 'Home', name: '', phone: '', addressLine1: '', city: '', state: '', pincode: '', isDefault: false };

/* ── Helpers ─────────────────────────────────────────────── */
const STATUS_COLORS: Record<string, string> = {
  placed:           'bg-blue-100 text-blue-700',
  confirmed:        'bg-indigo-100 text-indigo-700',
  processing:       'bg-amber-100 text-amber-700',
  shipped:          'bg-orange-100 text-orange-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered:        'bg-green-100 text-green-700',
  cancelled:        'bg-red-100 text-red-700',
  returned:         'bg-stone-100 text-stone-600',
};

function Avatar({ name, size = 'lg' }: { name: string; size?: 'sm' | 'lg' }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className={`${size === 'lg' ? 'h-16 w-16 text-xl' : 'h-9 w-9 text-sm'} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-800 font-bold text-white shadow-inner`}>
      {initials}
    </div>
  );
}

/* ── Nav items ───────────────────────────────────────────── */
const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'overview', label: 'Overview',
    icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    id: 'orders', label: 'My Orders',
    icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  },
  {
    id: 'addresses', label: 'Addresses',
    icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
  {
    id: 'wishlist', label: 'Wishlist',
    icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  },
  {
    id: 'profile', label: 'Edit Profile',
    icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
  {
    id: 'security', label: 'Security',
    icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  },
];

/* ═══════════════════════════════════════════════════════════ */
export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab]     = useState<Tab>('overview');
  const [profile, setProfile]         = useState<UserProfile | null>(null);
  const [profileLoad, setProfileLoad] = useState(true);

  /* orders */
  const [orders, setOrders]         = useState<OrderSummary[]>([]);
  const [ordersLoad, setOrdersLoad] = useState(false);
  const [ordersErr, setOrdersErr]   = useState('');

  /* addresses */
  const [addresses, setAddresses]       = useState<AddressRecord[]>([]);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingAddr, setEditingAddr]   = useState<AddressRecord | null>(null);
  const [addrForm, setAddrForm]         = useState(EMPTY_ADDR);
  const [addrSaving, setAddrSaving]     = useState(false);
  const [addrErr, setAddrErr]           = useState('');
  const [pincodeLoading, setPincodeLoading] = useState(false);

  /* wishlist */
  const wishlistItems  = useWishlistStore((s) => s.items);
  const removeWishlist = useWishlistStore((s) => s.removeItem);
  const addToCart      = useCartStore((s) => s.addItem);

  /* profile edit */
  const [pName, setPName]     = useState('');
  const [pPhone, setPPhone]   = useState('');
  const [pSaving, setPSaving] = useState(false);
  const [pMsg, setPMsg]       = useState<{ ok: boolean; text: string } | null>(null);

  /* password */
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew]         = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwSaving, setPwSaving]   = useState(false);
  const [pwMsg, setPwMsg]         = useState<{ ok: boolean; text: string } | null>(null);
  const [showPw, setShowPw]       = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login?callbackUrl=/account');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/profile')
      .then((r) => r.json())
      .then((d) => { setProfile(d); setPName(d.name ?? ''); setPPhone(d.phone ?? ''); })
      .finally(() => setProfileLoad(false));
    loadAddresses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchOrders = useCallback(() => {
    setOrdersLoad(true); setOrdersErr('');
    fetch('/api/orders')
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error || 'Failed to load orders');
        return r.json();
      })
      .then(setOrders)
      .catch((e) => setOrdersErr(e.message))
      .finally(() => setOrdersLoad(false));
  }, []);

  useEffect(() => {
    if (status === 'authenticated') fetchOrders();
  }, [status, fetchOrders]);

  function loadAddresses() {
    fetch('/api/addresses')
      .then((r) => r.json())
      .then((d) => setAddresses(Array.isArray(d) ? d : []));
  }

  function openAddForm() {
    setEditingAddr(null);
    setAddrForm(EMPTY_ADDR);
    setAddrErr('');
    setShowAddrForm(true);
  }

  function openEditForm(addr: AddressRecord) {
    setEditingAddr(addr);
    setAddrForm({ label: addr.label, name: addr.name, phone: addr.phone, addressLine1: addr.addressLine1, city: addr.city, state: addr.state, pincode: addr.pincode, isDefault: addr.isDefault });
    setAddrErr('');
    setShowAddrForm(true);
  }

  async function handlePincodeChange(value: string) {
    setAddrForm((f) => ({ ...f, pincode: value }));
    if (/^\d{6}$/.test(value)) {
      setPincodeLoading(true);
      const result = await lookupPincode(value);
      if (result) setAddrForm((f) => ({ ...f, city: result.city, state: result.state }));
      setPincodeLoading(false);
    }
  }

  async function saveAddress(e: React.FormEvent) {
    e.preventDefault();
    setAddrSaving(true); setAddrErr('');
    try {
      const url    = editingAddr ? `/api/addresses/${editingAddr.id}` : '/api/addresses';
      const method = editingAddr ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(addrForm) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to save address'); }
      loadAddresses();
      setShowAddrForm(false);
    } catch (err: unknown) {
      setAddrErr(err instanceof Error ? err.message : 'Failed to save address');
    } finally {
      setAddrSaving(false);
    }
  }

  async function deleteAddress(id: string) {
    if (!window.confirm('Delete this address?')) return;
    await fetch(`/api/addresses/${id}`, { method: 'DELETE' });
    loadAddresses();
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setPSaving(true); setPMsg(null);
    const res  = await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: pName, phone: pPhone }) });
    const data = await res.json();
    if (res.ok) {
      setProfile((prev) => prev ? { ...prev, name: pName, phone: pPhone } : prev);
      setPMsg({ ok: true, text: 'Profile updated successfully!' });
    } else {
      setPMsg({ ok: false, text: data.error || 'Update failed.' });
    }
    setPSaving(false);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwNew !== pwConfirm) { setPwMsg({ ok: false, text: 'New passwords do not match.' }); return; }
    if (pwNew.length < 8)    { setPwMsg({ ok: false, text: 'Password must be at least 8 characters.' }); return; }
    setPwSaving(true); setPwMsg(null);
    const res  = await fetch('/api/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew }) });
    const data = await res.json();
    if (res.ok) {
      setPwMsg({ ok: true, text: 'Password changed successfully!' });
      setPwCurrent(''); setPwNew(''); setPwConfirm('');
    } else {
      setPwMsg({ ok: false, text: data.error || 'Failed to change password.' });
    }
    setPwSaving(false);
  }

  if (status === 'loading' || profileLoad) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="container py-10">
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <div className="h-64 animate-pulse rounded-2xl bg-stone-200" />
            <div className="h-96 animate-pulse rounded-2xl bg-stone-200" />
          </div>
        </div>
      </div>
    );
  }
  if (!session) return null;

  const user        = session.user;
  const displayName = profile?.name ?? user?.name ?? 'User';

  /* ── Tab content renderer ─────────────────────────────── */
  function renderTab() {
    switch (activeTab) {

      /* ── OVERVIEW ── */
      case 'overview':
        return (
          <div className="space-y-5">
            <div className="rounded-2xl bg-gradient-to-r from-brand-700 to-brand-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <Avatar name={displayName} />
                <div>
                  <p className="text-sm text-brand-200">Welcome back,</p>
                  <h2 className="font-display text-2xl font-bold text-white">{displayName}</h2>
                  <p className="text-sm text-brand-200 mt-0.5">{user?.email}</p>
                </div>
              </div>
              {profile?.createdAt && (
                <p className="mt-4 text-xs text-brand-300">
                  Member since {new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Orders',  value: orders.length || '—', icon: '📦', tab: 'orders'    as Tab, color: 'bg-blue-50 text-blue-600' },
                { label: 'Wishlist Items',value: wishlistItems.length, icon: '❤️', tab: 'wishlist'  as Tab, color: 'bg-rose-50 text-rose-600' },
                { label: 'Total Spent',   value: orders.length ? `₹${orders.reduce((s, o) => s + o.total, 0).toLocaleString('en-IN')}` : '—', icon: '💰', tab: 'orders' as Tab, color: 'bg-green-50 text-green-600' },
              ].map((stat) => (
                <button
                  key={stat.label} type="button" onClick={() => setActiveTab(stat.tab)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 text-center"
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.color} text-xl`}>{stat.icon}</span>
                  <p className="font-display text-xl font-bold text-stone-900">{stat.value}</p>
                  <p className="text-xs text-stone-500">{stat.label}</p>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-semibold text-stone-800">Quick Actions</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Browse All Products', href: '/shop',         emoji: '🛍️' },
                  { label: 'View New Arrivals',   href: '/new-arrivals', emoji: '✨' },
                  { label: 'Best Sellers',        href: '/best-sellers', emoji: '🔥' },
                  { label: 'Current Offers',      href: '/offers',       emoji: '🏷️' },
                ].map((a) => (
                  <Link key={a.href} href={a.href}
                    className="flex items-center gap-3 rounded-xl border border-stone-100 p-4 text-sm font-medium text-stone-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                  >
                    <span className="text-xl">{a.emoji}</span>
                    {a.label}
                    <svg className="ml-auto text-stone-300" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );

      /* ── ORDERS ── */
      case 'orders':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-stone-900">Order History</h2>
              <button type="button" onClick={fetchOrders} className="text-xs text-brand-600 font-semibold hover:underline">Refresh</button>
            </div>

            {ordersLoad ? (
              <div className="space-y-3">{[1,2,3].map((n) => <div key={n} className="h-20 animate-pulse rounded-xl bg-stone-200" />)}</div>
            ) : ordersErr ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{ordersErr}</div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center">
                <span className="text-5xl mb-3" aria-hidden="true">📦</span>
                <p className="font-semibold text-stone-900">No orders yet</p>
                <p className="mt-1 text-sm text-stone-500">Your orders will appear here after your first purchase.</p>
                <Link href="/shop" className="mt-4 rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition">Start Shopping</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const sc = STATUS_COLORS[order.status] ?? 'bg-stone-100 text-stone-600';
                  return (
                    <Link key={order.id} href={`/orders/${order.id}`}
                      className="flex items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-brand-200 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500">
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-900 text-sm">Order #{order.id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-stone-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <p className="font-bold text-stone-900 text-sm">₹{order.total.toLocaleString('en-IN')}</p>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${sc}`}>{order.status.replace(/_/g, ' ')}</span>
                        <svg className="text-stone-300" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );

      /* ── ADDRESSES ── */
      case 'addresses':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-stone-900">Saved Addresses</h2>
              {!showAddrForm && (
                <button
                  type="button" onClick={openAddForm}
                  className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-700"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Add Address
                </button>
              )}
            </div>

            {/* Inline add/edit form */}
            {showAddrForm && (
              <form onSubmit={saveAddress} className="rounded-2xl border border-brand-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-stone-900">{editingAddr ? 'Edit Address' : 'New Address'}</h3>
                  <button type="button" onClick={() => setShowAddrForm(false)} aria-label="Close" className="text-stone-400 hover:text-stone-700">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Label */}
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-stone-600">Label</span>
                    <select
                      value={addrForm.label}
                      onChange={(e) => setAddrForm((f) => ({ ...f, label: e.target.value }))}
                      aria-label="Address label"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400"
                    >
                      {['Home', 'Work', 'Other'].map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </label>

                  {/* Name */}
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-stone-600">Full Name *</span>
                    <input required type="text" value={addrForm.name} onChange={(e) => setAddrForm((f) => ({ ...f, name: e.target.value }))} placeholder="Priya Sharma"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400" />
                  </label>

                  {/* Phone */}
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-stone-600">Phone *</span>
                    <input required type="tel" value={addrForm.phone} onChange={(e) => setAddrForm((f) => ({ ...f, phone: e.target.value }))} placeholder="9999999999"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400" />
                  </label>

                  {/* Pincode */}
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-stone-600">Pincode *</span>
                    <input required type="text" inputMode="numeric" maxLength={6} value={addrForm.pincode} onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, ''))} placeholder="600001"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400" />
                    {pincodeLoading && <span className="mt-1 block text-[11px] text-stone-400">Looking up city &amp; state…</span>}
                  </label>
                </div>

                {/* Address Line 1 */}
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-stone-600">Address Line 1 *</span>
                  <input required type="text" value={addrForm.addressLine1} onChange={(e) => setAddrForm((f) => ({ ...f, addressLine1: e.target.value }))} placeholder="Flat 4B, ABC Apartments, MG Road"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400" />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* City */}
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-stone-600">City *</span>
                    <input required type="text" value={addrForm.city} onChange={(e) => setAddrForm((f) => ({ ...f, city: e.target.value }))} placeholder="Chennai"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400" />
                  </label>

                  {/* State */}
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-stone-600">State *</span>
                    <select required value={addrForm.state} onChange={(e) => setAddrForm((f) => ({ ...f, state: e.target.value }))} aria-label="State"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400">
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </label>
                </div>

                {/* Default checkbox */}
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-stone-700">
                  <input type="checkbox" checked={addrForm.isDefault} onChange={(e) => setAddrForm((f) => ({ ...f, isDefault: e.target.checked }))}
                    className="h-4 w-4 rounded border-stone-300 accent-brand-600" />
                  Set as default address
                </label>

                {addrErr && <p className="text-sm font-medium text-red-600">{addrErr}</p>}

                <div className="flex gap-3">
                  <button type="submit" disabled={addrSaving}
                    className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60">
                    {addrSaving ? 'Saving…' : (editingAddr ? 'Update Address' : 'Save Address')}
                  </button>
                  <button type="button" onClick={() => setShowAddrForm(false)}
                    className="rounded-xl border border-stone-200 px-6 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-50">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Address cards */}
            {addresses.length === 0 && !showAddrForm ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center">
                <svg className="mb-3 h-12 w-12 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <p className="font-semibold text-stone-900">No saved addresses</p>
                <p className="mt-1 text-sm text-stone-500">Add an address to speed up checkout.</p>
                <button type="button" onClick={openAddForm} className="mt-4 rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition">
                  Add Your First Address
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {addresses.map((addr) => (
                  <div key={addr.id} className={`relative rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${addr.isDefault ? 'border-brand-300' : 'border-stone-200'}`}>
                    {addr.isDefault && (
                      <span className="absolute right-3 top-3 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-700">
                        Default
                      </span>
                    )}

                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{addr.label}</p>
                        <p className="font-semibold text-stone-900">{addr.name}</p>
                      </div>
                    </div>

                    <div className="space-y-0.5 text-sm text-stone-600 pl-11">
                      <p>{addr.addressLine1}</p>
                      <p>{addr.city}, {addr.state} – {addr.pincode}</p>
                      <p className="text-stone-400 text-xs">📞 {addr.phone}</p>
                    </div>

                    <div className="mt-4 flex gap-2 pl-11">
                      <button type="button" onClick={() => openEditForm(addr)}
                        className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:border-brand-300 hover:text-brand-600">
                        Edit
                      </button>
                      <button type="button" onClick={() => deleteAddress(addr.id)}
                        className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-400 transition hover:border-red-200 hover:text-red-500">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      /* ── WISHLIST ── */
      case 'wishlist':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-stone-900">
                My Wishlist
                {wishlistItems.length > 0 && <span className="ml-2 text-sm font-normal text-stone-400">({wishlistItems.length} items)</span>}
              </h2>
            </div>

            {wishlistItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center">
                <span className="text-5xl mb-3" aria-hidden="true">❤️</span>
                <p className="font-semibold text-stone-900">Your wishlist is empty</p>
                <p className="mt-1 text-sm text-stone-500">Save products you love and buy them later.</p>
                <Link href="/shop" className="mt-4 rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition">Browse Products</Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {wishlistItems.map((product) => (
                  <WishlistCard key={product.slug} product={product} onRemove={() => removeWishlist(product.slug)} onAddToCart={() => addToCart(product)} />
                ))}
              </div>
            )}
          </div>
        );

      /* ── PROFILE ── */
      case 'profile':
        return (
          <div className="max-w-lg space-y-5">
            <h2 className="font-display text-lg font-bold text-stone-900">Edit Profile</h2>

            <form onSubmit={saveProfile} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-4 pb-4 border-b border-stone-100">
                <Avatar name={pName || displayName} size="lg" />
                <div>
                  <p className="font-semibold text-stone-900">{pName || displayName}</p>
                  <p className="text-xs text-stone-400">{user?.email}</p>
                </div>
              </div>

              <div>
                <label htmlFor="acc-name" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-stone-500">Full Name *</label>
                <input id="acc-name" type="text" value={pName} onChange={(e) => setPName(e.target.value)} placeholder="Your full name" required
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-brand-400 focus:bg-white" />
              </div>

              <div>
                <label htmlFor="acc-email" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-stone-500">Email Address</label>
                <input id="acc-email" type="email" value={user?.email ?? ''} readOnly
                  className="w-full rounded-xl border border-stone-100 bg-stone-100 px-4 py-3 text-sm text-stone-500 cursor-not-allowed" />
                <p className="mt-1 text-[11px] text-stone-400">Email cannot be changed as it is your login credential.</p>
              </div>

              <div>
                <label htmlFor="acc-phone" className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-stone-500">Mobile Number</label>
                <div className="flex rounded-xl border border-stone-200 bg-stone-50 overflow-hidden focus-within:border-brand-400 focus-within:bg-white transition">
                  <span className="flex items-center px-3 text-sm text-stone-500 border-r border-stone-200 bg-stone-100">+91</span>
                  <input id="acc-phone" type="tel" value={pPhone} onChange={(e) => setPPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" maxLength={10}
                    className="flex-1 px-4 py-3 text-sm text-stone-900 outline-none bg-transparent" />
                </div>
              </div>

              {pMsg && (
                <div className={`rounded-lg px-4 py-3 text-sm font-medium ${pMsg.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {pMsg.ok ? '✓ ' : '✗ '}{pMsg.text}
                </div>
              )}

              <button type="submit" disabled={pSaving} className="w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed">
                {pSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </div>
        );

      /* ── SECURITY ── */
      case 'security':
        return (
          <div className="max-w-lg space-y-5">
            <h2 className="font-display text-lg font-bold text-stone-900">Security Settings</h2>

            <form onSubmit={changePassword} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <div>
                  <p className="font-semibold text-stone-900">Change Password</p>
                  <p className="text-xs text-stone-400">Use a strong password you don&apos;t use elsewhere</p>
                </div>
              </div>

              {(['Current Password', 'New Password', 'Confirm New Password'] as const).map((label, i) => {
                const val    = [pwCurrent, pwNew, pwConfirm][i];
                const setVal = [setPwCurrent, setPwNew, setPwConfirm][i];
                const id     = ['pw-current', 'pw-new', 'pw-confirm'][i];
                return (
                  <div key={id}>
                    <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-stone-500">{label}</label>
                    <div className="flex rounded-xl border border-stone-200 bg-stone-50 overflow-hidden focus-within:border-brand-400 focus-within:bg-white transition">
                      <input id={id} type={showPw ? 'text' : 'password'} value={val} onChange={(e) => setVal(e.target.value)} required placeholder={label}
                        className="flex-1 px-4 py-3 text-sm text-stone-900 outline-none bg-transparent" />
                      {i === 0 && (
                        <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? 'Hide passwords' : 'Show passwords'} className="px-3 text-stone-400 hover:text-stone-600">
                          {showPw
                            ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                            : <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          }
                        </button>
                      )}
                    </div>
                    {i === 1 && pwNew && (
                      <ul className="mt-2 space-y-1">
                        {[
                          { pass: pwNew.length >= 8, label: 'At least 8 characters' },
                          { pass: /[A-Z]/.test(pwNew), label: 'One uppercase letter' },
                          { pass: /[0-9]/.test(pwNew), label: 'One number' },
                        ].map((r) => (
                          <li key={r.label} className={`flex items-center gap-1.5 text-[11px] ${r.pass ? 'text-green-600' : 'text-stone-400'}`}>
                            {r.pass ? '✓' : '○'} {r.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}

              {pwMsg && (
                <div className={`rounded-lg px-4 py-3 text-sm font-medium ${pwMsg.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {pwMsg.ok ? '✓ ' : '✗ '}{pwMsg.text}
                </div>
              )}

              <button type="submit" disabled={pwSaving} className="w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60">
                {pwSaving ? 'Updating…' : 'Update Password'}
              </button>
            </form>

            <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </div>
                <div>
                  <p className="font-semibold text-stone-900">Sign Out</p>
                  <p className="text-xs text-stone-400">Sign out from all devices</p>
                </div>
              </div>
              <button type="button" onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                Sign Out of My Account
              </button>
            </div>
          </div>
        );
    }
  }

  /* ── Render ───────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-stone-900 text-white">
        <div className="container py-5">
          <nav className="flex items-center gap-2 text-xs text-stone-400 mb-1" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-200">My Account</span>
          </nav>
          <h1 className="font-display text-2xl font-bold text-white">My Account</h1>
        </div>
      </div>

      <div className="lg:hidden bg-white border-b border-stone-100 shadow-sm">
        <div className="flex overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => (
            <button key={item.id} type="button" onClick={() => setActiveTab(item.id)}
              className={`flex shrink-0 flex-col items-center gap-1 px-4 py-3 text-[10px] font-semibold transition-colors border-b-2 ${
                activeTab === item.id ? 'border-brand-600 text-brand-700' : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <span className={activeTab === item.id ? 'text-brand-600' : 'text-stone-400'}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container py-6">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">

          <aside className="hidden lg:block lg:self-start lg:sticky lg:top-20 space-y-4">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col items-center text-center gap-3">
                <Avatar name={displayName} />
                <div>
                  <p className="font-semibold text-stone-900">{displayName}</p>
                  <p className="text-xs text-stone-400 truncate max-w-[180px]">{user?.email}</p>
                  {profile?.role === 'admin' && (
                    <span className="mt-1 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-700">Admin</span>
                  )}
                </div>
                {profile?.createdAt && (
                  <p className="text-[11px] text-stone-400">
                    Member since {new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
            </div>

            <nav className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden" aria-label="Account navigation">
              <ul>
                {NAV_ITEMS.map((item) => (
                  <li key={item.id}>
                    <button type="button" onClick={() => setActiveTab(item.id)}
                      className={`flex w-full items-center gap-3 px-5 py-3.5 text-sm transition-colors text-left ${
                        activeTab === item.id ? 'bg-brand-50 text-brand-700 font-semibold border-r-2 border-brand-600' : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span className={activeTab === item.id ? 'text-brand-600' : 'text-stone-400'}>{item.icon}</span>
                      {item.label}
                      {item.id === 'wishlist' && wishlistItems.length > 0 && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-[10px] font-bold text-rose-600">
                          {wishlistItems.length}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t border-stone-100 p-3">
                <button type="button" onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-red-500 transition hover:bg-red-50 font-medium">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Sign Out
                </button>
              </div>
            </nav>

            {profile?.role === 'admin' && (
              <Link href="/admin"
                className="flex items-center gap-2 justify-center w-full rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Admin Dashboard
              </Link>
            )}
          </aside>

          <main>{renderTab()}</main>
        </div>
      </div>
    </div>
  );
}

/* ── Wishlist card subcomponent ─────────────────────────── */
function WishlistCard({ product, onRemove, onAddToCart }: { product: IProduct; onRemove: () => void; onAddToCart: () => void; }) {
  const [added, setAdded] = useState(false);

  function handleAdd() { onAddToCart(); setAdded(true); setTimeout(() => setAdded(false), 1800); }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/product/${product.slug}`} className="relative block">
        <div className="h-44 w-full bg-stone-50 overflow-hidden">
          {product.images?.[0] ? (
            <Image src={product.images[0]} alt={product.name} fill className="object-contain p-3" sizes="(max-width: 640px) 100vw, 33vw" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-4xl text-stone-300">🛍️</div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3 gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{product.subcategory ?? product.category}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-stone-800 line-clamp-2 leading-snug hover:text-brand-700 transition-colors">{product.name}</h3>
        </Link>
        {product.rating && (
          <span className="inline-flex w-fit items-center gap-0.5 rounded bg-green-600 px-1.5 py-0.5 text-[11px] font-bold text-white">{product.rating} ★</span>
        )}
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-stone-900">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice && <span className="text-xs text-stone-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>}
        </div>
        <div className="mt-auto flex gap-2 pt-1">
          <button type="button" onClick={handleAdd}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${added ? 'bg-green-600 text-white' : 'bg-brand-600 text-white hover:bg-brand-700'}`}>
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
          <button type="button" onClick={onRemove} aria-label="Remove from wishlist"
            className="rounded-lg border border-stone-200 px-2.5 py-2 text-xs text-stone-400 transition hover:border-red-200 hover:text-red-500">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
