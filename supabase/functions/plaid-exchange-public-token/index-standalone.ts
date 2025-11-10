/**
 * Plaid Exchange Public Token Edge Function (Standalone Version for Dashboard Deployment)
 *
 * Exchanges a public token (from Plaid Link success) for a permanent access token.
 * Stores the access token and fetches/stores account information.
 *
 * Request body: { public_token: string, user_id: string }
 * Response: { item_id: string }
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Configuration, PlaidApi, PlaidEnvironments, CountryCode } from 'npm:plaid@24.0.0';
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
    const { public_token } = await req.json();

    if (!public_token) {
      return errorResponse('Missing required field: public_token');
    }

    // Get Plaid client
    const plaidClient = getPlaidClient();

    // Exchange public token for access token
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const { access_token, item_id } = exchangeResponse.data;

    // Get item details (institution info)
    const itemResponse = await plaidClient.itemGet({ access_token });
    const institutionId = itemResponse.data.item.institution_id;

    // Get institution name
    let institutionName = 'Unknown';
    if (institutionId) {
      try {
        const instResponse = await plaidClient.institutionsGetById({
          institution_id: institutionId,
          country_codes: [CountryCode.Us],
        });
        institutionName = instResponse.data.institution.name;
      } catch (e) {
        console.warn('Failed to fetch institution name:', e);
      }
    }

    // Get accounts for this item
    const accountsResponse = await plaidClient.accountsGet({ access_token });
    const accounts = accountsResponse.data.accounts;

    // Store in database
    const supabase = getSupabaseAdmin();

    // Insert item
    const { error: itemError } = await supabase
      .from('plaid_items')
      .insert({
        user_id: userId,
        item_id,
        access_token,
        institution_name: institutionName,
      });

    if (itemError) {
      throw new Error(`Failed to store item: ${itemError.message}`);
    }

    // Insert accounts
    const accountsData = accounts.map(acc => ({
      user_id: userId,
      item_id,
      account_id: acc.account_id,
      name: acc.name,
      mask: acc.mask,
      type: acc.type,
      subtype: acc.subtype,
    }));

    const { error: accountsError } = await supabase
      .from('plaid_accounts')
      .insert(accountsData);

    if (accountsError) {
      throw new Error(`Failed to store accounts: ${accountsError.message}`);
    }

    // Initialize sync state
    const { error: syncError } = await supabase
      .from('plaid_sync_state')
      .insert({
        item_id,
        user_id: userId,
        cursor: null,
        last_synced_at: null,
      });

    if (syncError) {
      // Ignore duplicate key errors (sync state already exists)
      if (!syncError.message.includes('duplicate')) {
        console.warn('Failed to initialize sync state:', syncError);
      }
    }

    return successResponse({ item_id });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to exchange public token',
      500
    );
  }
});
