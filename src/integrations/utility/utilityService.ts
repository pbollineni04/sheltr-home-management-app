import { supabase } from '@/integrations/supabase/client';

async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.id) throw new Error('Not authenticated');
  return data.user.id;
}

export async function createLinkToken(): Promise<{ url: string; uid: string }> {
  const headers = await getAuthHeaders();
  const { data, error } = await supabase.functions.invoke('utility-create-link-token', {
    body: {},
    headers,
  });
  if (error) throw error;
  if (!data?.url) throw new Error('Failed to create link token');
  return data;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.access_token) {
    throw new Error('You must be logged in');
  }
  return { Authorization: `Bearer ${sessionData.session.access_token}` };
}

export async function exchangeAuthorization(
  formUid: string
): Promise<{ connection_id: string; accounts: number }> {
  const headers = await getAuthHeaders();
  const { data, error } = await supabase.functions.invoke('utility-exchange-authorization', {
    body: { form_uid: formUid },
    headers,
  });
  if (error) throw error;
  if (!data?.connection_id) throw new Error('Failed to exchange authorization');
  return data;
}

export async function syncBills(
  connectionId: string
): Promise<{ imported: number; skipped: number; flagged: number }> {
  const headers = await getAuthHeaders();
  const { data, error } = await supabase.functions.invoke('utility-sync-bills', {
    body: { connection_id: connectionId },
    headers,
  });
  if (error) throw error;
  return data ?? { imported: 0, skipped: 0, flagged: 0 };
}

export async function getConnections() {
  const userId = await getCurrentUserId();
  const { data, error } = await (supabase as any)
    .from('utility_connections')
    .select('*, utility_sync_state(last_synced_at)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function disconnectUtility(connectionId: string): Promise<void> {
  const userId = await getCurrentUserId();
  const { error } = await (supabase as any)
    .from('utility_connections')
    .delete()
    .eq('id', connectionId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function getPendingReviews() {
  const userId = await getCurrentUserId();
  const { data, error } = await (supabase as any)
    .from('utility_readings')
    .select('*')
    .eq('user_id', userId)
    .eq('needs_review', true)
    .order('reading_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function resolveReview(
  readingId: string,
  action: 'approve' | 'reject',
  updates?: { usage_amount?: number; cost?: number; unit?: string }
): Promise<void> {
  const userId = await getCurrentUserId();

  if (action === 'reject') {
    const { error } = await (supabase as any)
      .from('utility_readings')
      .delete()
      .eq('id', readingId)
      .eq('user_id', userId);
    if (error) throw error;
  } else {
    const updateData: Record<string, unknown> = {
      needs_review: false,
      ...(updates || {}),
    };
    const { error } = await (supabase as any)
      .from('utility_readings')
      .update(updateData)
      .eq('id', readingId)
      .eq('user_id', userId);
    if (error) throw error;
  }
}
