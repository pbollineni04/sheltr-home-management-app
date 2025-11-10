/**
 * Plaid Create Link Token Edge Function (Standalone Version for Dashboard Deployment)
 *
 * Generates a Plaid Link token for the frontend to initialize the Plaid Link flow.
 * This token is used to open the Plaid Link modal where users select their bank.
 *
 * Request body: { user_id: string }
 * Response: { link_token: string }
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'npm:plaid@24.0.0';
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

  // Only allow POST requests
  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    const userId = await verifyUserToken(authHeader);

    // Get Plaid client
    const plaidClient = getPlaidClient();

    // Create link token
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: userId,
      },
      client_name: 'Sheltr Home Management',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
      webhook: Deno.env.get('PLAID_WEBHOOK_URL'), // Optional: webhook for real-time updates
    });

    return successResponse({
      link_token: response.data.link_token,
    });
  } catch (error) {
    console.error('Error creating link token:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Failed to create link token',
      500
    );
  }
});
