'use client';

import { useState } from 'react';

const STORE_ADDRESS = 'Shop No 7, 5, East Coast Road, Lalitha Nagar, Thiruvanmiyur, Chennai, Tamil Nadu 600041';

function Field({
  label, type = 'text', value, onChange, placeholder, required = true,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-stone-700">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 outline-none transition focus:border-brand-400 focus:bg-white"
      />
    </label>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const set = (field: string) => (val: string) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="border-b border-stone-200 bg-white">
        <div className="container py-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">We&apos;re here to help</p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-stone-900">Contact Us</h1>
          <p className="mt-2 text-stone-500">Questions, feedback or bulk orders — we&apos;d love to hear from you.</p>
        </div>
      </div>

      {/* Map */}
      <div className="border-b border-stone-200 bg-white py-8">
        <div className="container">
          <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
            <h2 className="font-display text-xl font-bold text-stone-900">Visit Our Store</h2>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(STORE_ADDRESS)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-600 hover:underline"
            >
              Get Directions →
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-soft h-96 w-full">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(STORE_ADDRESS)}&output=embed`}
              className="w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Vani Enterprises Store Location"
            />
          </div>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* Form */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft lg:p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-green-600" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold text-stone-900">Message sent!</h2>
                <p className="mt-2 text-stone-500">We&apos;ll get back to you within 24 hours.</p>
                <button
                  type="button"
                  onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                  className="mt-6 rounded-full border border-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-display text-xl font-bold text-stone-900">Send us a message</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full Name"    value={form.name}  onChange={set('name')}  placeholder="Priya Sharma" />
                  <Field label="Email"        type="email" value={form.email} onChange={set('email')} placeholder="priya@example.com" />
                  <Field label="Phone"        type="tel"   value={form.phone} onChange={set('phone')} placeholder="9999999999" required={false} />
                  <Field label="Subject"      value={form.subject} onChange={set('subject')} placeholder="Order enquiry / Feedback…" />
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-stone-700">
                    Message<span className="ml-0.5 text-red-500">*</span>
                  </span>
                  <textarea
                    value={form.message}
                    onChange={(e) => set('message')(e.target.value)}
                    rows={5}
                    placeholder="Tell us how we can help…"
                    required
                    className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 outline-none transition focus:border-brand-400 focus:bg-white"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-full bg-stone-900 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700 shadow-card"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            {[
              {
                title: 'Visit Our Store',
                lines: ['shop no 7, 5, EastCoast Road, Lalitha Nagar, Thiruvanmiyur, Chennai, Greater Chennai, Tamil Nadu 600041', 'Mon–Sat: 10 AM – 8 PM'],
              },
              {
                title: 'Call Us',
                lines: ['+91 99999 99999', '+91 88888 88888', 'Mon–Sat, 9 AM – 7 PM IST'],
              },
              {
                title: 'Email Us',
                lines: ['support@vanienterprises.com', 'orders@vanienterprises.com'],
              },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-soft">
                <h3 className="font-display font-bold text-stone-900">{card.title}</h3>
                <div className="mt-3 space-y-1">
                  {card.lines.map((line) => (
                    <p key={line} className="text-sm text-stone-600">{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* WhatsApp */}
            <a
              href="https://wa.me/919999999999?text=Hi! I need help with"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-5 transition hover:bg-green-100"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-green-800">Chat on WhatsApp</p>
                <p className="text-xs text-green-600">Fastest response — usually within minutes</p>
              </div>
            </a>

            {/* FAQ */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-soft">
              <h3 className="font-display font-bold text-stone-900 mb-4">Common Questions</h3>
              <div className="space-y-3">
                {[
                  { q: 'How long does delivery take?', a: '3–7 business days across India.' },
                  { q: 'Do you accept bulk orders?', a: 'Yes! Contact us for wholesale pricing.' },
                  { q: 'What is your return policy?', a: '7-day hassle-free returns on all orders.' },
                ].map((faq) => (
                  <div key={faq.q} className="border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                    <p className="text-xs font-semibold text-stone-800">{faq.q}</p>
                    <p className="mt-1 text-xs text-stone-500">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
