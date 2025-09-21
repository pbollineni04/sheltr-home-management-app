import { supabase } from '@/integrations/supabase/client';

export type CreateLinkTokenResponse = { link_token: string };

export async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.id) throw new Error('Not authenticated');
  return data.user.id;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const jwt = data.session?.access_token;
  if (jwt) return { Authorization: `Bearer ${jwt}` };
  // Dev-only fallback to anon key if no session (useful before onboarding is wired)
  // Remove this once auth is always present.
  const anon = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;
  return anon ? { Authorization: `Bearer ${anon}` } : {};
}

export async function createLinkToken(userId?: string): Promise<string> {
  const uid = userId ?? await getCurrentUserId();
  const headers = await getAuthHeader();
  const { data, error } = await supabase.functions.invoke<CreateLinkTokenResponse>('plaid-create-link-token', {
    method: 'POST',
    headers,
    body: { user_id: uid },
  });
  if (error) throw error;
  if (!data?.link_token) throw new Error('Failed to create link token');
  return data.link_token;
}

export async function exchangePublicToken(publicToken: string, userId?: string): Promise<{ item_id: string }>{
  const uid = userId ?? await getCurrentUserId();
  const headers = await getAuthHeader();
  const { data, error } = await supabase.functions.invoke<{ item_id: string }>('plaid-exchange-public-token', {
    method: 'POST',
    headers,
    body: { public_token: publicToken, user_id: uid },
  });
  if (error) throw error;
  if (!data?.item_id) throw new Error('Failed to exchange public token');
  return data;
}

export async function syncTransactions(itemId: string, userId?: string): Promise<{ imported: number }>{
  const uid = userId ?? await getCurrentUserId();
  const headers = await getAuthHeader();
  const { data, error } = await supabase.functions.invoke<{ imported: number }>('plaid-sync-transactions', {
    method: 'POST',
    headers,
    body: { item_id: itemId, user_id: uid },
  });
  if (error) throw error;
  return data ?? { imported: 0 };
}

export async function getLatestItemId(userId?: string): Promise<string | null> {
  const uid = userId ?? await getCurrentUserId();
  const { data, error } = await (supabase as any)
    .from('plaid_items')
    .select('item_id, created_at')
    .eq('user_id', uid)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data?.item_id ?? null;
}

export async function getSyncState(itemId: string): Promise<{ last_synced_at: string | null } | null> {
  const { data, error } = await (supabase as any)
    .from('plaid_sync_state')
    .select('last_synced_at')
    .eq('item_id', itemId)
    .maybeSingle();
  if (error) throw error;
  return data as any;
}
