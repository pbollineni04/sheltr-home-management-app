/**
 * Shared Supabase admin client for Edge Functions
 * Uses service role key for privileged operations
 */

import { createClient } from 'jsr:@supabase/supabase-js@2';

/**
 * Get Supabase admin client with service role permissions
 * Used for operations that require bypassing RLS
 */
export function getSupabaseAdmin() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing required Supabase credentials');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * Verify user JWT and extract user ID
 * Returns user ID if valid, throws error otherwise
 */
export async function verifyUserToken(authHeader: string | null): Promise<string> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  const supabase = getSupabaseAdmin();

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error('Invalid authentication token');
  }

  return user.id;
}
