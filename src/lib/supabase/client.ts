import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

let supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null;

/**
 * Create a singleton Supabase client for browser/client-side operations.
 * Uses localStorage for session persistence.
 *
 * Environment variables required:
 * - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase public anon key
 */
export function createClient(): ReturnType<typeof createSupabaseClient<Database>> {
  if (supabaseClient) {
    return supabaseClient;
  }

  supabaseClient = createSupabaseClient<Database>(
    process.env['NEXT_PUBLIC_SUPABASE_URL'] || '',
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || ''
  );

  return supabaseClient;
}
