'use client';

export function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex w-full max-w-sm gap-2"
    >
      <input
        type="email"
        placeholder="Your email address"
        aria-label="Email address for newsletter"
        className="flex-1 rounded-full border border-stone-700 bg-stone-800 px-4 py-2.5 text-sm text-white placeholder:text-stone-500 outline-none transition focus:border-brand-500"
      />
      <button
        type="submit"
        className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Subscribe
      </button>
    </form>
  );
}
