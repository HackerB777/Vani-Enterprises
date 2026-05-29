import { getSupabaseAdmin } from './supabase';
import type { Category } from './products';

/**
 * Server-side helper — returns categories from the settings table.
 * Returns [] if the DB has nothing or errors (never falls back to hardcoded defaults).
 * Only the /api/categories GET handler falls back to defaults on a critical DB failure
 * so the public API stays useful; the homepage intentionally shows nothing until
 * the admin creates categories.
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('settings')
      .select('categories')
      .eq('id', 'main')
      .maybeSingle();

    if (error) return [];
    if (data === null) return [];
    return Array.isArray(data.categories) ? (data.categories as Category[]) : [];
  } catch {
    return [];
  }
}
