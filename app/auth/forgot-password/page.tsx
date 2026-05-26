import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-stone-50 py-12">
      <div className="w-full max-w-md px-4">
        <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-soft text-center">
          <Link href="/" className="inline-flex flex-col items-center leading-none mb-6">
            <span className="font-display text-2xl font-bold text-stone-900">Vani</span>
            <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-stone-400">Enterprises</span>
          </Link>

          <svg className="mx-auto mb-4 h-12 w-12 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>

          <h1 className="font-display text-2xl font-bold text-stone-900 mb-2">Forgot Password?</h1>
          <p className="text-sm text-stone-500 mb-6">
            To reset your password, please contact our support team via WhatsApp or email and we will help you regain access to your account.
          </p>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.524 5.84L0 24l6.343-1.498A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.213-3.727.88.932-3.618-.234-.372A9.818 9.818 0 1112 21.818z"/>
            </svg>
            Contact on WhatsApp
          </a>

          <p className="mt-6 text-center text-sm text-stone-500">
            Remember your password?{' '}
            <Link href="/auth/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
