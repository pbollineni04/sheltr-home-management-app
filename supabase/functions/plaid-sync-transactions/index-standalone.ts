/**
 * Plaid Sync Transactions Edge Function (Standalone Version for Dashboard Deployment)
 *
 * Fetches new transactions from Plaid using cursor-based sync API.
 * Auto-creates expenses from transactions with intelligent category mapping.
 * Implements duplicate detection to prevent re-importing.
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
 * Returns { category, confidence } where confidence is 'high', 'medium', or 'low'
 */
function mapPlaidCategoryToExpenseCategory(
  plaidCategories: string[] | null | undefined,
  merchantName: string | null | undefined
): { category: string; confidence: 'high' | 'medium' | 'low' } {
  const categories = plaidCategories || [];
  const primary = categories[0] || '';
  const secondary = categories[1] || '';
  const merchant = (merchantName || '').toLowerCase();

  // High confidence mappings from primary category
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

  // Medium confidence mappings from secondary category
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

  // Merchant name keyword matching
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

  // Services category from primary if it contains "SERVICES"
  if (primary.includes('SERVICES') || primary.includes('SERVICE')) {
    return { category: 'services', confidence: 'medium' };
  }

  // Default to maintenance with low confidence (will trigger needs_review)
  return { category: 'maintenance', confidence: 'low' };
}

/**
 * Calculate similarity between two strings (0-1 score)
 * Simple implementation using Jaccard similarity of word sets
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.toLowerCase().split(/\s+/));
  const words2 = new Set(str2.toLowerCase().split(/\s+/));

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return union.size === 0 ? 0 : intersection.size / union.size;
}

/**
 * Get Supabase admin client with service role permissions
 */
function getSupabaseAdmin() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing required Supabase credentials');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * Verify user JWT and extract user ID
 */
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

/**
 * Error response helper
 */
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

/**
 * Success response helper
 */
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

/**
 * Check if a similar expense already exists (duplicate detection)
 */
async function checkForDuplicateExpense(
  supabase: any,
  userId: string,
  transactionId: string,
  amount: number,
  date: string,
  name: string
): Promise<boolean> {
  // Check exact match by plaid_transaction_id
  const { data: exactMatch } = await supabase
    .from('expenses')
    .select('id')
    .eq('user_id', userId)
    .eq('plaid_transaction_id', transactionId)
    .maybeSingle();

  if (exactMatch) {
    return true;
  }

  // Fuzzy match: same amount + date within ±2 days
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
    // Check description similarity
    for (const match of fuzzyMatches) {
      const similarity = calculateStringSimilarity(name, match.description);
      if (similarity > 0.7) {
        return true;
      }
    }
  }

  return false;
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

serve(async (req) => {
  // Handle CORS preflight requests
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
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    const userId = await verifyUserToken(authHeader);

    // Get request body
    const { item_id } = await req.json();

    if (!item_id) {
      return errorResponse('Missing required field: item_id');
    }

    const supabase = getSupabaseAdmin();

    // Get access token from database
    const { data: item, error: itemError } = await supabase
      .from('plaid_items')
      .select('access_token')
      .eq('item_id', item_id)
      .eq('user_id', userId)
      .single();

    if (itemError || !item) {
      return errorResponse('Item not found or access denied', 404);
    }

    // Get current sync cursor
    const { data: syncState } = await supabase
      .from('plaid_sync_state')
      .select('cursor')
      .eq('item_id', item_id)
      .maybeSingle();

    const cursor = syncState?.cursor || undefined;

    // Get Plaid client
    const plaidClient = getPlaidClient();

    // Fetch transactions from Plaid
    const syncResponse = await plaidClient.transactionsSync({
      access_token: item.access_token,
      cursor,
    });

    const { added, modified, removed, next_cursor } = syncResponse.data;

    let imported = 0;
    let skipped = 0;
    let updated = 0;

    // Process added transactions
    for (const tx of added) {
      try {
        // Skip pending transactions
        if (tx.pending) {
          skipped++;
          continue;
        }

        // Check if transaction already exists in plaid_transactions_raw
        const { data: existingRaw } = await supabase
          .from('plaid_transactions_raw')
          .select('id')
          .eq('transaction_id', tx.transaction_id)
          .eq('account_id', tx.account_id)
          .maybeSingle();

        if (existingRaw) {
          skipped++;
          continue;
        }

        // Store in plaid_transactions_raw
        const { error: rawError } = await supabase
          .from('plaid_transactions_raw')
          .insert({
            user_id: userId,
            item_id,
            account_id: tx.account_id,
            transaction_id: tx.transaction_id,
            amount: Math.abs(tx.amount), // Convert to positive for expense
            iso_date: tx.date,
            name: tx.name,
            merchant_name: tx.merchant_name,
            categories: tx.category,
            pending: tx.pending,
            json_raw: tx,
          });

        if (rawError) {
          console.error('Failed to insert raw transaction:', rawError);
          continue;
        }

        // Check for duplicate expense (fuzzy matching)
        const isDuplicate = await checkForDuplicateExpense(
          supabase,
          userId,
          tx.transaction_id,
          Math.abs(tx.amount),
          tx.date,
          tx.name
        );

        if (isDuplicate) {
          skipped++;
          continue;
        }

        // Map category
        const { category, confidence } = mapPlaidCategoryToExpenseCategory(
          tx.category,
          tx.merchant_name
        );

        // Create expense
        const { error: expenseError } = await supabase
          .from('expenses')
          .insert({
            user_id: userId,
            description: tx.merchant_name || tx.name,
            amount: Math.abs(tx.amount),
            category,
            date: tx.date,
            vendor: tx.merchant_name,
            plaid_transaction_id: tx.transaction_id,
            needs_review: confidence === 'low', // Flag low confidence for review
            auto_imported: true,
            metadata: {
              plaid_categories: tx.category,
              confidence,
              original_name: tx.name,
            },
          });

        if (expenseError) {
          console.error('Failed to create expense:', expenseError);
          continue;
        }

        imported++;
      } catch (error) {
        console.error('Error processing transaction:', error);
        continue;
      }
    }

    // Process modified transactions
    for (const tx of modified) {
      try {
        // Update plaid_transactions_raw
        await supabase
          .from('plaid_transactions_raw')
          .update({
            amount: Math.abs(tx.amount),
            iso_date: tx.date,
            name: tx.name,
            merchant_name: tx.merchant_name,
            categories: tx.category,
            pending: tx.pending,
            json_raw: tx,
          })
          .eq('transaction_id', tx.transaction_id)
          .eq('user_id', userId);

        // Update corresponding expense if exists
        const { error: updateError } = await supabase
          .from('expenses')
          .update({
            description: tx.merchant_name || tx.name,
            amount: Math.abs(tx.amount),
            date: tx.date,
            vendor: tx.merchant_name,
          })
          .eq('plaid_transaction_id', tx.transaction_id)
          .eq('user_id', userId);

        if (!updateError) {
          updated++;
        }
      } catch (error) {
        console.error('Error updating transaction:', error);
        continue;
      }
    }

    // Process removed transactions
    for (const removedTx of removed) {
      try {
        // Soft delete from plaid_transactions_raw
        await supabase
          .from('plaid_transactions_raw')
          .delete()
          .eq('transaction_id', removedTx.transaction_id)
          .eq('user_id', userId);

        // Soft delete corresponding expense
        await supabase
          .from('expenses')
          .update({ deleted_at: new Date().toISOString() })
          .eq('plaid_transaction_id', removedTx.transaction_id)
          .eq('user_id', userId);
      } catch (error) {
        console.error('Error removing transaction:', error);
        continue;
      }
    }

    // Update sync cursor
    await supabase
      .from('plaid_sync_state')
      .upsert({
        item_id,
        user_id: userId,
        cursor: next_cursor,
        last_synced_at: new Date().toISOString(),
      });

    return successResponse({
      imported,
      skipped,
      updated,
      removed: removed.length,
    });
  } catch (error) {
    console.error('Error syncing transactions:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to sync transactions',
      500
    );
  }
});
