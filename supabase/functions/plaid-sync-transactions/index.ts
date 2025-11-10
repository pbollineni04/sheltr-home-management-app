/**
 * Plaid Sync Transactions Edge Function
 *
 * Fetches new transactions from Plaid using cursor-based sync API.
 * Auto-creates expenses from transactions with intelligent category mapping.
 * Implements duplicate detection to prevent re-importing.
 *
 * Request body: { item_id: string, user_id: string }
 * Response: { imported: number, skipped: number, updated: number }
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import {
  getPlaidClient,
  mapPlaidCategoryToExpenseCategory,
  calculateStringSimilarity,
  errorResponse,
  successResponse,
} from '../_shared/plaid-client.ts';
import { getSupabaseAdmin, verifyUserToken } from '../_shared/supabase-admin.ts';

serve(async (req) => {
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
