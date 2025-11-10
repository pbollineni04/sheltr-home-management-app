/**
 * Plaid Sync Transactions Edge Function (Standalone Version for Dashboard Deployment)
 * V2: Handles first-time sync with historical transaction fetch
 *
 * Fetches transactions from Plaid using appropriate method:
 * - First sync: Uses /transactions/get for historical data (last 30 days)
 * - Subsequent syncs: Uses /transactions/sync for incremental updates
 *
 * Request body: { item_id: string, user_id: string }
 * Response: { imported: number, skipped: number, updated: number }
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Configuration, PlaidApi, PlaidEnvironments } from 'npm:plaid@24.0.0';
import { createClient } from 'jsr:@supabase/supabase-js@2';

// ============================================================================
// SHARED UTILITIES (Inlined)
// ============================================================================

/**
 * Initialize Plaid client with environment variables
 */
function getPlaidClient(): PlaidApi {
  const clientId = Deno.env.get('PLAID_CLIENT_ID');
  const secret = Deno.env.get('PLAID_SECRET');
  const env = Deno.env.get('PLAID_ENV') || 'sandbox';

  if (!clientId || !secret) {
    throw new Error('Missing required Plaid credentials: PLAID_CLIENT_ID and PLAID_SECRET must be set');
  }

  const configuration = new Configuration({
    basePath: PlaidEnvironments[env as keyof typeof PlaidEnvironments],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': clientId,
        'PLAID-SECRET': secret,
      },
    },
  });

  return new PlaidApi(configuration);
}

/**
 * Map Plaid categories to our expense categories
 */
function mapPlaidCategoryToExpenseCategory(
  plaidCategories: string[] | null | undefined,
  merchantName: string | null | undefined
): { category: string; confidence: 'high' | 'medium' | 'low' } {
  const categories = plaidCategories || [];
  const primary = categories[0] || '';
  const secondary = categories[1] || '';
  const merchant = (merchantName || '').toLowerCase();

  const highConfidenceMap: Record<string, string> = {
    'HOME_IMPROVEMENT': 'renovation',
    'HOME_APPLIANCES': 'appliances',
    'UTILITIES_GAS': 'utilities',
    'UTILITIES_ELECTRIC': 'utilities',
    'UTILITIES_WATER': 'utilities',
    'UTILITIES_INTERNET': 'utilities',
    'UTILITIES_TELEPHONE': 'utilities',
  };

  if (highConfidenceMap[primary]) {
    return { category: highConfidenceMap[primary], confidence: 'high' };
  }

  const mediumConfidenceMap: Record<string, string> = {
    'HARDWARE_STORES': 'renovation',
    'GENERAL_CONTRACTORS': 'renovation',
    'PLUMBING': 'services',
    'ELECTRICIAN': 'services',
    'HVAC': 'services',
    'APPLIANCES': 'appliances',
  };

  if (mediumConfidenceMap[secondary]) {
    return { category: mediumConfidenceMap[secondary], confidence: 'medium' };
  }

  const merchantKeywords: Record<string, string> = {
    'home depot': 'renovation',
    'lowes': 'renovation',
    "lowe's": 'renovation',
    'menards': 'renovation',
    'ace hardware': 'renovation',
    'hvac': 'services',
    'plumber': 'services',
    'plumbing': 'services',
    'electrician': 'services',
    'electric': 'services',
    'appliance': 'appliances',
  };

  for (const [keyword, cat] of Object.entries(merchantKeywords)) {
    if (merchant.includes(keyword)) {
      return { category: cat, confidence: 'medium' };
    }
  }

  if (primary.includes('SERVICES') || primary.includes('SERVICE')) {
    return { category: 'services', confidence: 'medium' };
  }

  return { category: 'maintenance', confidence: 'low' };
}

function calculateStringSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.toLowerCase().split(/\s+/));
  const words2 = new Set(str2.toLowerCase().split(/\s+/));
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

function getSupabaseAdmin() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing required Supabase credentials');
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

async function verifyUserToken(authHeader: string | null): Promise<string> {
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

function errorResponse(message: string, status = 400) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    }
  );
}

function successResponse(data: unknown, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    }
  );
}

async function checkForDuplicateExpense(
  supabase: any,
  userId: string,
  transactionId: string,
  amount: number,
  date: string,
  name: string
): Promise<boolean> {
  const { data: exactMatch } = await supabase
    .from('expenses')
    .select('id')
    .eq('user_id', userId)
    .eq('plaid_transaction_id', transactionId)
    .maybeSingle();

  if (exactMatch) return true;

  const dateObj = new Date(date);
  const dateFrom = new Date(dateObj);
  dateFrom.setDate(dateFrom.getDate() - 2);
  const dateTo = new Date(dateObj);
  dateTo.setDate(dateTo.getDate() + 2);

  const { data: fuzzyMatches } = await supabase
    .from('expenses')
    .select('description')
    .eq('user_id', userId)
    .eq('amount', amount)
    .gte('date', dateFrom.toISOString().split('T')[0])
    .lte('date', dateTo.toISOString().split('T')[0])
    .limit(5);

  if (fuzzyMatches && fuzzyMatches.length > 0) {
    for (const match of fuzzyMatches) {
      const similarity = calculateStringSimilarity(name, match.description);
      if (similarity > 0.7) return true;
    }
  }

  return false;
}

async function processTransaction(
  supabase: any,
  userId: string,
  itemId: string,
  tx: any
): Promise<'imported' | 'skipped'> {
  // Skip pending transactions
  if (tx.pending) return 'skipped';

  // Check if already exists
  const { data: existingRaw } = await supabase
    .from('plaid_transactions_raw')
    .select('id')
    .eq('transaction_id', tx.transaction_id)
    .eq('account_id', tx.account_id)
    .maybeSingle();

  if (existingRaw) return 'skipped';

  // Store raw transaction
  await supabase.from('plaid_transactions_raw').insert({
    user_id: userId,
    item_id: itemId,
    account_id: tx.account_id,
    transaction_id: tx.transaction_id,
    amount: Math.abs(tx.amount),
    iso_date: tx.date,
    name: tx.name,
    merchant_name: tx.merchant_name,
    categories: tx.category,
    pending: tx.pending,
    json_raw: tx,
  });

  // Check for duplicate expense
  const isDuplicate = await checkForDuplicateExpense(
    supabase,
    userId,
    tx.transaction_id,
    Math.abs(tx.amount),
    tx.date,
    tx.name
  );

  if (isDuplicate) return 'skipped';

  // Map category
  const { category, confidence } = mapPlaidCategoryToExpenseCategory(
    tx.category,
    tx.merchant_name
  );

  // Create expense
  await supabase.from('expenses').insert({
    user_id: userId,
    description: tx.merchant_name || tx.name,
    amount: Math.abs(tx.amount),
    category,
    date: tx.date,
    vendor: tx.merchant_name,
    plaid_transaction_id: tx.transaction_id,
    needs_review: confidence === 'low',
    auto_imported: true,
    metadata: {
      plaid_categories: tx.category,
      confidence,
      original_name: tx.name,
    },
  });

  return 'imported';
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const userId = await verifyUserToken(authHeader);
    const { item_id } = await req.json();

    if (!item_id) {
      return errorResponse('Missing required field: item_id');
    }

    const supabase = getSupabaseAdmin();

    // Get access token
    const { data: item, error: itemError } = await supabase
      .from('plaid_items')
      .select('access_token')
      .eq('item_id', item_id)
      .eq('user_id', userId)
      .single();

    if (itemError || !item) {
      return errorResponse('Item not found or access denied', 404);
    }

    // Get sync state
    const { data: syncState } = await supabase
      .from('plaid_sync_state')
      .select('cursor, last_synced_at')
      .eq('item_id', item_id)
      .maybeSingle();

    const plaidClient = getPlaidClient();
    let imported = 0;
    let skipped = 0;

    // If no previous sync (first time), use historical fetch
    if (!syncState?.cursor && !syncState?.last_synced_at) {
      console.log('First sync - using historical fetch');

      // Get last 30 days of transactions
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const txResponse = await plaidClient.transactionsGet({
        access_token: item.access_token,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      });

      console.log(`Historical fetch returned ${txResponse.data.transactions.length} transactions`);

      for (const tx of txResponse.data.transactions) {
        const result = await processTransaction(supabase, userId, item_id, tx);
        if (result === 'imported') imported++;
        else skipped++;
      }

      // Update sync state to use sync endpoint next time
      await supabase.from('plaid_sync_state').upsert({
        item_id,
        user_id: userId,
        cursor: null, // Will get cursor on next incremental sync
        last_synced_at: new Date().toISOString(),
      });

    } else {
      // Use incremental sync
      console.log('Incremental sync');

      const syncResponse = await plaidClient.transactionsSync({
        access_token: item.access_token,
        cursor: syncState?.cursor || undefined,
      });

      const { added, modified, removed, next_cursor } = syncResponse.data;
      console.log(`Sync returned: added=${added.length}, modified=${modified.length}, removed=${removed.length}`);

      for (const tx of added) {
        const result = await processTransaction(supabase, userId, item_id, tx);
        if (result === 'imported') imported++;
        else skipped++;
      }

      // Update sync cursor
      await supabase.from('plaid_sync_state').upsert({
        item_id,
        user_id: userId,
        cursor: next_cursor,
        last_synced_at: new Date().toISOString(),
      });
    }

    console.log(`Sync complete: imported=${imported}, skipped=${skipped}`);

    return successResponse({
      imported,
      skipped,
      updated: 0,
      removed: 0,
    });
  } catch (error) {
    console.error('Error syncing transactions:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to sync transactions',
      500
    );
  }
});
