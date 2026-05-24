'use client';

import { useState } from 'react';
import { orders } from '@/lib/orderStorage';

interface CustomerSummary {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: string;
}

function buildCustomers(): CustomerSummary[] {
  const map = new Map<string, CustomerSummary>();
  for (const order of orders) {
    const { email, name, phone, city, state } = order.shippingAddress;
    const existing = map.get(email);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += order.total;
      if (order.createdAt > existing.lastOrder) existing.lastOrder = order.createdAt;
    } else {
      map.set(email, { name, email, phone, city, state, orderCount: 1, totalSpent: order.total, lastOrder: order.createdAt });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}

export default function AdminCustomers() {
  const [search, setSearch] = useState('');
  const customers = buildCustomers();

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">CRM</p>
        <h2 className="font-display text-2xl font-bold text-stone-800">Customers</h2>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Total</p>
          <p className="mt-2 font-display text-3xl font-bold text-stone-800">{customers.length}</p>
          <p className="mt-1 text-xs text-stone-400">unique customers</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Repeat Buyers</p>
          <p className="mt-2 font-display text-3xl font-bold text-brand-600">
            {customers.filter((c) => c.orderCount > 1).length}
          </p>
          <p className="mt-1 text-xs text-stone-400">2+ orders</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Avg. Order Value</p>
          <p className="mt-2 font-display text-3xl font-bold text-stone-800">
            {customers.length > 0
              ? `₹${Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.reduce((s, c) => s + c.orderCount, 0)).toLocaleString('en-IN')}`
              : '₹0'}
          </p>
          <p className="mt-1 text-xs text-stone-400">per order</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, email, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white shadow-card overflow-hidden">
        {customers.length === 0 ? (
          <div className="py-20 text-center text-stone-400">
            <svg className="mx-auto mb-4 h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm font-medium">No customers yet</p>
            <p className="mt-1 text-xs">Customers appear here once they place an order</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50 text-left">
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Customer</th>
                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Location</th>
                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Orders</th>
                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Total Spent</th>
                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-stone-400">Last Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filtered.map((customer) => (
                    <tr key={customer.email} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-brand-700">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-stone-800">{customer.name}</p>
                            <p className="text-xs text-stone-400">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-stone-700">{customer.city}</p>
                        <p className="text-xs text-stone-400">{customer.state}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          customer.orderCount > 1 ? 'bg-brand-100 text-brand-700' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {customer.orderCount}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-semibold text-stone-800">
                        ₹{customer.totalSpent.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-4 text-xs text-stone-400">
                        {new Date(customer.lastOrder).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="py-10 text-center text-stone-400 border-t border-stone-100">
                <p className="text-sm">No customers match your search</p>
              </div>
            )}
            <div className="border-t border-stone-100 px-6 py-3 text-xs text-stone-400">
              {filtered.length} of {customers.length} customer{customers.length !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
