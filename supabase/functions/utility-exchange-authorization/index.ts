/**
 * Utility Exchange Authorization Edge Function
 *
 * After the user completes the UtilityAPI form, this function:
 * 1. Fetches the authorization (with meters) using the form UID as referral
 * 2. Stores the connection in utility_connections
 * 3. Creates utility_accounts for each meter
 * 4. Activates meters for historical data collection
 * 5. Initializes sync state
 *
 * Request body: { form_uid: string }
 * Response: { connection_id: string, accounts: number }
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { getAuthorizationByFormUid, getAuthorization, activateMeters, mapServiceClassToUtilityType } from '../_shared/utility-client.ts';
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

    const { form_uid } = await req.json();

    if (!form_uid) {
      return new Response(
        JSON.stringify({ error: 'form_uid is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Find the authorization created from this form
    console.log('Looking for authorization with form_uid:', form_uid);
    const auth = await getAuthorizationByFormUid(form_uid);
    console.log('Authorization found:', auth ? auth.uid : 'none');

    if (!auth) {
      return new Response(
        JSON.stringify({ error: 'Authorization not yet completed. Please complete the form and try again.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (auth.is_declined) {
      return new Response(
        JSON.stringify({ error: 'Authorization was declined by the user.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getSupabaseAdmin();

    // Extract meters from nested structure: auth.meters.meters
    const meters = auth.meters?.meters || [];
    console.log('Found meters:', meters.length);

    // Store the connection
    const firstMeter = meters[0];
    const utilityName = firstMeter?.base?.service_tariff || firstMeter?.base?.service_class || 'Unknown Utility';
    const { data: connection, error: connError } = await supabase
      .from('utility_connections')
      .insert({
        user_id: userId,
        provider: 'utilityapi',
        connection_id: auth.uid,
        access_token: '', // UtilityAPI uses a single API token, not per-connection tokens
        utility_name: utilityName,
        status: 'active',
      })
      .select('id')
      .single();

    if (connError) throw connError;

    // Create utility account entries for each meter
    const meterUids: string[] = [];
    const accountInserts = meters.map((meter: any) => {
      meterUids.push(meter.uid);
      return {
        user_id: userId,
        connection_id: connection.id,
        account_id: meter.uid,
        utility_type: mapServiceClassToUtilityType(meter.base?.service_class || ''),
        service_address: meter.base?.service_address || '',
        metadata: { billing_account: meter.base?.billing_account, bill_count: meter.bill_count },
      };
    });

    let totalAccounts = 0;
    if (accountInserts.length > 0) {
      const { error: accountError } = await supabase
        .from('utility_accounts')
        .insert(accountInserts);

      if (accountError) throw accountError;
      totalAccounts = accountInserts.length;
    }

    // Activate meters for historical data collection
    if (meterUids.length > 0) {
      try {
        await activateMeters(meterUids);
      } catch (err) {
        console.warn('Failed to activate meters (may already be active):', err);
      }
    }

    // Initialize sync state
    const { error: syncError } = await supabase
      .from('utility_sync_state')
      .insert({
        connection_id: connection.id,
        user_id: userId,
        last_synced_at: null,
        cursor: null,
      });

    if (syncError) throw syncError;

    return new Response(
      JSON.stringify({ connection_id: connection.id, accounts: totalAccounts }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error exchanging utility authorization:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to exchange authorization' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
