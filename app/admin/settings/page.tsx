'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
      <h2 className="mb-5 font-display text-lg font-bold text-stone-800">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-stone-600">{label}</span>
      {children}
    </label>
  );
}

const inputCls = 'w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-brand-400 focus:bg-white';

export default function AdminSettingsPage() {
  const [currentPw, setCurrentPw]   = useState('');
  const [newPw, setNewPw]           = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [pwStatus, setPwStatus]     = useState<{ ok: boolean; msg: string } | null>(null);
  const [pwLoading, setPwLoading]   = useState(false);

  const [adminMobile, setAdminMobile]         = useState('');
  const [developerMobile, setDeveloperMobile] = useState('');
  const [numStatus, setNumStatus]             = useState<{ ok: boolean; msg: string } | null>(null);
  const [numLoading, setNumLoading]           = useState(false);

  const [freeShippingEnabled, setFreeShippingEnabled] = useState(false);
  const [shippingCost, setShippingCost]               = useState('99');
  const [shipStatus, setShipStatus]                   = useState<{ ok: boolean; msg: string } | null>(null);
  const [shipLoading, setShipLoading]                 = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        setAdminMobile(data.adminMobile ?? '');
        setDeveloperMobile(data.developerMobile ?? '');
        setFreeShippingEnabled(data.freeShippingEnabled ?? false);
        setShippingCost(String(data.shippingCost ?? 99));
      })
      .catch(() => {});
  }, []);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwStatus(null);
    if (newPw !== confirmPw) {
      setPwStatus({ ok: false, msg: 'New passwords do not match.' });
      return;
    }
    if (newPw.length < 8) {
      setPwStatus({ ok: false, msg: 'Password must be at least 8 characters.' });
      return;
    }
    setPwLoading(true);
    try {
      const res  = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to update password.');
      setPwStatus({ ok: true, msg: 'Password updated successfully.' });
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (err: unknown) {
      setPwStatus({ ok: false, msg: err instanceof Error ? err.message : 'Failed to update password.' });
    } finally {
      setPwLoading(false);
    }
  }

  async function handleNumbersSave(e: React.FormEvent) {
    e.preventDefault();
    setNumStatus(null);
    setNumLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminMobile, developerMobile }),
      });
      if (!res.ok) throw new Error('Failed to save.');
      setNumStatus({ ok: true, msg: 'Contact numbers saved.' });
    } catch {
      setNumStatus({ ok: false, msg: 'Failed to save. Try again.' });
    } finally {
      setNumLoading(false);
    }
  }

  async function handleShippingSave(e: React.FormEvent) {
    e.preventDefault();
    setShipStatus(null);
    if (!freeShippingEnabled && (!shippingCost || Number(shippingCost) < 0)) {
      setShipStatus({ ok: false, msg: 'Enter a valid shipping cost.' });
      return;
    }
    setShipLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ freeShippingEnabled, shippingCost: Number(shippingCost) }),
      });
      if (!res.ok) throw new Error('Failed to save.');
      setShipStatus({ ok: true, msg: 'Shipping settings saved.' });
    } catch {
      setShipStatus({ ok: false, msg: 'Failed to save. Try again.' });
    } finally {
      setShipLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-6 lg:p-8 max-w-2xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Admin</p>
        <h1 className="font-display text-2xl font-bold text-stone-800">Settings</h1>
      </div>

      <Section title="Change Password">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Field label="Current Password">
            <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="Enter current password" required autoComplete="current-password" className={inputCls} />
          </Field>
          <Field label="New Password">
            <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)}
              placeholder="Min. 8 characters" required autoComplete="new-password" className={inputCls} />
          </Field>
          <Field label="Confirm New Password">
            <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Repeat new password" required autoComplete="new-password" className={inputCls} />
          </Field>

          {pwStatus && (
            <div className={`rounded-xl px-4 py-3 text-sm ${pwStatus.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {pwStatus.msg}
            </div>
          )}

          <button type="submit" disabled={pwLoading}
            className="rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60">
            {pwLoading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </Section>

      <Section title="Contact Numbers">
        <p className="mb-4 text-xs text-stone-500">These numbers are used for WhatsApp notifications and customer support.</p>
        <form onSubmit={handleNumbersSave} className="space-y-4">
          <Field label="Admin Mobile Number">
            <input type="tel" value={adminMobile} onChange={(e) => setAdminMobile(e.target.value)}
              placeholder="+91 98765 43210" className={inputCls} />
          </Field>
          <Field label="Developer Mobile Number">
            <input type="tel" value={developerMobile} onChange={(e) => setDeveloperMobile(e.target.value)}
              placeholder="+91 98765 43210" className={inputCls} />
          </Field>

          {numStatus && (
            <div className={`rounded-xl px-4 py-3 text-sm ${numStatus.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {numStatus.msg}
            </div>
          )}

          <button type="submit" disabled={numLoading}
            className="rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60">
            {numLoading ? 'Saving…' : 'Save Numbers'}
          </button>
        </form>
      </Section>

      <Section title="Shipping">
        <form onSubmit={handleShippingSave} className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-stone-700">Free Shipping</p>
              <p className="text-xs text-stone-400">When on, every order ships free regardless of cart total.</p>
            </div>
            <button
              type="button"
              onClick={() => setFreeShippingEnabled((v) => !v)}
              role="switch"
              aria-checked={freeShippingEnabled ? 'true' : 'false'}
              aria-label="Free shipping"
              className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${freeShippingEnabled ? 'bg-brand-600' : 'bg-stone-300'}`}
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${freeShippingEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <Field label="Shipping Cost (₹)">
            <input
              type="number" min="0" step="1"
              value={shippingCost}
              onChange={(e) => setShippingCost(e.target.value)}
              disabled={freeShippingEnabled}
              placeholder="99"
              className={`${inputCls} disabled:cursor-not-allowed disabled:opacity-50`}
            />
            <span className="mt-1 block text-[11px] text-stone-400">
              {freeShippingEnabled ? 'Ignored while free shipping is on.' : 'Charged on every order at checkout.'}
            </span>
          </Field>

          {shipStatus && (
            <div className={`rounded-xl px-4 py-3 text-sm ${shipStatus.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {shipStatus.msg}
            </div>
          )}

          <button type="submit" disabled={shipLoading}
            className="rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60">
            {shipLoading ? 'Saving…' : 'Save Shipping Settings'}
          </button>
        </form>
      </Section>
    </div>
  );
}
