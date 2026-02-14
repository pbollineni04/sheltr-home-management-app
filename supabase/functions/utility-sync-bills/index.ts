/**
 * Utility Sync Bills Edge Function
 *
 * Fetches bills from UtilityAPI for a given connection,
 * stores raw data, and creates utility_readings entries.
 *
 * Request body: { connection_id: string }
 * Response: { imported: number, skipped: number, flagged: number }
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getBills, normalizeUnit, calculateConfidence, mapServiceClassToUtilityType } from '../_shared/utility-client.ts';
import { verifyUserToken, getSupabaseAdmin } from '../_shared/supabase-admin.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const userId = await verifyUserToken(authHeader);

    const { connection_id } = await req.json();

    if (!connection_id) {
      return new Response(
        JSON.stringify({ error: 'connection_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getSupabaseAdmin();

    // Verify ownership of connection
    const { data: connection, error: connError } = await supabase
      .from('utility_connections')
      .select('id, status')
      .eq('id', connection_id)
      .eq('user_id', userId)
      .single();

    if (connError || !connection) {
      return new Response(
        JSON.stringify({ error: 'Connection not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (connection.status !== 'active') {
      return new Response(
        JSON.stringify({ error: 'Connection is not active' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get accounts for this connection
    console.log('Looking up accounts for connection_id:', connection_id, 'user_id:', userId);
    const { data: accounts, error: accountError } = await supabase
      .from('utility_accounts')
      .select('account_id, utility_type')
      .eq('connection_id', connection_id)
      .eq('user_id', userId);

    if (accountError) {
      console.error('Error fetching accounts:', accountError);
      throw accountError;
    }
    console.log('Found accounts:', JSON.stringify(accounts));

    let imported = 0;
    let skipped = 0;
    let flagged = 0;

    // Sync bills for each account (meter)
    for (const account of (accounts || [])) {
      console.log('Fetching bills for meter:', account.account_id, 'type:', account.utility_type);
      const { bills } = await getBills(account.account_id);
      console.log('Got bills:', bills.length);

      for (const bill of bills) {
        // Check for duplicate via bill_id
        const { data: existing } = await supabase
          .from('utility_bills_raw')
          .select('id')
          .eq('bill_id', bill.uid)
          .maybeSingle();

        if (existing) {
          skipped++;
          continue;
        }

        // Normalize statement date to YYYY-MM-DD
        const statementDate = bill.statement_date.split('T')[0];

        // Store raw bill data
        const { error: rawError } = await supabase
          .from('utility_bills_raw')
          .insert({
            user_id: userId,
            connection_id,
            account_id: account.account_id,
            bill_id: bill.uid,
            statement_date: statementDate,
            usage_amount: bill.total_usage,
            unit: bill.total_unit,
            cost: bill.total_cost,
            utility_type: account.utility_type,
            json_raw: bill.raw,
          });

        if (rawError) {
          console.error('Error storing raw bill:', rawError);
          continue;
        }

        // Normalize units
        const normalized = normalizeUnit(
          bill.total_usage,
          bill.total_unit,
          account.utility_type
        );

        // Calculate confidence
        const confidence = calculateConfidence(bill);
        const needsReview = confidence === 'low';

        // Create utility reading
        const { error: readingError } = await supabase
          .from('utility_readings')
          .insert({
            user_id: userId,
            utility_type: account.utility_type,
            usage_amount: normalized.amount,
            unit: normalized.unit,
            cost: bill.total_cost,
            reading_date: statementDate,
            auto_imported: true,
            needs_review: needsReview,
            bill_id: bill.uid,
            confidence,
          });

        if (readingError) {
          console.error('Error creating reading:', readingError);
          continue;
        }

        imported++;
        if (needsReview) flagged++;
      }
    }

    // Update sync state
    console.log('Updating sync state for connection:', connection_id);
    const { error: upsertError } = await supabase
      .from('utility_sync_state')
      .upsert({
        connection_id,
        user_id: userId,
        last_synced_at: new Date().toISOString(),
        cursor: null,
      });

    if (upsertError) {
      console.error('Error updating sync state:', upsertError);
    }

    return new Response(
      JSON.stringify({ imported, skipped, flagged }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error syncing utility bills:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to sync bills' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
