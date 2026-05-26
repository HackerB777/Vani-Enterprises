'use client';

import { useEffect, useState } from 'react';
import type { ICoupon } from '@/lib/models/Coupon';

const EMPTY_FORM = {
  code:           '',
  discountType:   'percentage' as 'percentage' | 'flat',
  discountValue:  '',
  minOrderAmount: '',
  maxUses:        '',
  validFrom:      new Date().toISOString().slice(0, 16),
  validUntil:     new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  isActive:       true,
};

function Badge({ active, expired }: { active: boolean; expired: boolean }) {
  if (expired)  return <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-400">Expired</span>;
  if (!active)  return <span className="rounded-full bg-red-50   px-2 py-0.5 text-[11px] font-semibold text-red-500">Inactive</span>;
  return              <span className="rounded-full bg-green-50  px-2 py-0.5 text-[11px] font-semibold text-green-600">Active</span>;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
}

function daysLeft(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return null;
  const d = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return d === 1 ? '1 day left' : `${d} days left`;
}

export default function AdminCoupons() {
  const [coupons,  setCoupons]  = useState<ICoupon[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState<ICoupon | null>(null);
  const [form,     setForm]     = useState({ ...EMPTY_FORM });
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error,    setError]    = useState('');
  const [copied,   setCopied]   = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res  = await fetch('/api/coupons');
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setError('');
    setShowForm(true);
  }

  function openEdit(c: ICoupon) {
    setEditing(c);
    setForm({
      code:           c.code,
      discountType:   c.discountType,
      discountValue:  String(c.discountValue),
      minOrderAmount: String(c.minOrderAmount),
      maxUses:        c.maxUses !== null ? String(c.maxUses) : '',
      validFrom:      c.validFrom.slice(0, 16),
      validUntil:     c.validUntil.slice(0, 16),
      isActive:       c.isActive,
    });
    setError('');
    setShowForm(true);
  }

  function setValidity(days: number) {
    const from = new Date(form.validFrom);
    const until = new Date(from.getTime() + days * 24 * 60 * 60 * 1000);
    setForm((f) => ({ ...f, validUntil: until.toISOString().slice(0, 16) }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.code.trim())         return setError('Coupon code is required');
    if (!form.discountValue)       return setError('Discount value is required');
    if (Number(form.discountValue) <= 0) return setError('Discount value must be greater than 0');
    if (form.discountType === 'percentage' && Number(form.discountValue) > 100)
                                   return setError('Percentage discount cannot exceed 100');

    setSaving(true);
    try {
      const payload = {
        discountType:   form.discountType,
        discountValue:  Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount || 0),
        maxUses:        form.maxUses ? Number(form.maxUses) : null,
        validFrom:      new Date(form.validFrom).toISOString(),
        validUntil:     new Date(form.validUntil).toISOString(),
        isActive:       form.isActive,
      };

      let res: Response;
      if (editing) {
        res = await fetch(`/api/coupons/${editing.code}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else {
        res = await fetch('/api/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, code: form.code }) });
      }

      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to save'); return; }
      setShowForm(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(code: string) {
    if (!confirm(`Delete coupon "${code}"? This cannot be undone.`)) return;
    setDeleting(code);
    try {
      await fetch(`/api/coupons/${code}`, { method: 'DELETE' });
      setCoupons((prev) => prev.filter((c) => c.code !== code));
    } finally {
      setDeleting(null);
    }
  }

  async function toggleActive(c: ICoupon) {
    await fetch(`/api/coupons/${c.code}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !c.isActive }),
    });
    load();
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Coupon Codes</h1>
          <p className="mt-1 text-sm text-stone-500">{coupons.length} coupon{coupons.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-brand-700 active:scale-95"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Coupon
        </button>
      </div>

      {/* Stats */}
      {coupons.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total',    value: coupons.length,                                           color: 'text-stone-900' },
            { label: 'Active',   value: coupons.filter(c => c.isActive && new Date(c.validUntil) > new Date()).length, color: 'text-green-600' },
            { label: 'Expired',  value: coupons.filter(c => new Date(c.validUntil) <= new Date()).length,              color: 'text-stone-400' },
            { label: 'Uses',     value: coupons.reduce((a, c) => a + c.usedCount, 0),            color: 'text-blue-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border border-stone-100 bg-white p-4 shadow-sm">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="mt-0.5 text-xs text-stone-500">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-stone-100 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-stone-400">Loading coupons…</div>
        ) : coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-stone-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-stone-700">No coupons yet</p>
            <p className="text-xs text-stone-400">Create your first coupon to offer discounts</p>
            <button type="button" onClick={openCreate} className="mt-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
              Create Coupon
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Discount</th>
                  <th className="px-4 py-3">Min Order</th>
                  <th className="px-4 py-3">Validity</th>
                  <th className="px-4 py-3">Uses</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {coupons.map((c) => {
                  const expired = new Date(c.validUntil) < new Date();
                  const left    = daysLeft(c.validUntil);
                  return (
                    <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="rounded-lg bg-stone-900 px-2.5 py-1 font-mono text-xs font-bold text-white tracking-wider">
                            {c.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyCode(c.code)}
                            title="Copy code"
                            className="text-stone-300 hover:text-stone-600 transition"
                          >
                            {copied === c.code ? (
                              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="text-green-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-stone-900">
                        {c.discountType === 'percentage' ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                      </td>
                      <td className="px-4 py-3 text-stone-500">
                        {c.minOrderAmount > 0 ? `₹${c.minOrderAmount}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-stone-600">{fmtDate(c.validFrom)}</p>
                        <p className="text-xs text-stone-400">→ {fmtDate(c.validUntil)}</p>
                        {!expired && left && (
                          <span className="mt-0.5 inline-block rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600">{left}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {c.usedCount}{c.maxUses !== null ? ` / ${c.maxUses}` : ''}
                      </td>
                      <td className="px-4 py-3">
                        <Badge active={c.isActive} expired={expired} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {/* Toggle active */}
                          <button
                            type="button"
                            onClick={() => toggleActive(c)}
                            title={c.isActive ? 'Deactivate' : 'Activate'}
                            className={`rounded-lg p-1.5 text-xs transition ${c.isActive ? 'bg-green-50 text-green-600 hover:bg-red-50 hover:text-red-500' : 'bg-stone-100 text-stone-400 hover:bg-green-50 hover:text-green-600'}`}
                          >
                            {c.isActive ? (
                              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </button>
                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => openEdit(c)}
                            className="rounded-lg bg-stone-100 p-1.5 text-stone-500 transition hover:bg-brand-50 hover:text-brand-600"
                          >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(c.code)}
                            disabled={deleting === c.code}
                            className="rounded-lg bg-stone-100 p-1.5 text-stone-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                          >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
              <h2 className="text-base font-bold text-stone-900">
                {editing ? `Edit Coupon — ${editing.code}` : 'Create New Coupon'}
              </h2>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 px-6 py-5 max-h-[80vh] overflow-y-auto">

              {/* Coupon code */}
              {!editing && (
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g. VANI10, SAVE200"
                    className="w-full rounded-xl border border-stone-200 px-3 py-2 font-mono text-sm font-bold uppercase tracking-wider focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              )}

              {/* Discount type + value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Discount Type *</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value as 'percentage' | 'flat' }))}
                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    {form.discountType === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={form.discountType === 'percentage' ? 100 : undefined}
                    value={form.discountValue}
                    onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
                    placeholder={form.discountType === 'percentage' ? '10' : '200'}
                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              </div>

              {/* Min order + max uses */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Min Order Amount (₹)</label>
                  <input
                    type="number" min="0"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: e.target.value }))}
                    placeholder="0"
                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Max Uses (blank = unlimited)</label>
                  <input
                    type="number" min="1"
                    value={form.maxUses}
                    onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
                    placeholder="Unlimited"
                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              </div>

              {/* Validity */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2">Validity Period</label>
                {/* Quick presets */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {[1, 3, 7, 14, 30].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setValidity(d)}
                      className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-600 transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
                    >
                      {d}d
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">From</label>
                    <input
                      type="datetime-local"
                      value={form.validFrom}
                      onChange={(e) => setForm((f) => ({ ...f, validFrom: e.target.value }))}
                      className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">Until</label>
                    <input
                      type="datetime-local"
                      value={form.validUntil}
                      onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))}
                      className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                </div>
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-stone-700">Active</p>
                  <p className="text-xs text-stone-400">Users can apply this coupon at checkout</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${form.isActive ? 'bg-brand-600' : 'bg-stone-300'}`}
                >
                  <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">{error}</p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-brand-700 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
