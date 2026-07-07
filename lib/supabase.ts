import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function getUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
}

function anonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ''
  );
}

function serviceKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. The admin client cannot silently fall back to the ' +
        'anon key because RLS blocks anon writes/reads on these tables — set this env var in the ' +
        'deployment environment.',
    );
  }
  return key;
}

/* ── Public client (browser + server components) ─────────── */
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) _client = createClient(getUrl(), anonKey());
  return _client;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop: string) {
    return getClient()[prop as keyof SupabaseClient];
  },
});

/* ── Admin client (API routes only — bypasses RLS) ────────── */
let _admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  // Re-create if URL changes (e.g. env var not set during cold start)
  const url = getUrl();
  if (!_admin || !url) {
    _admin = createClient(url, serviceKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _admin;
}
