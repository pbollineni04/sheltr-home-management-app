/**
 * Plaid Create Link Token Edge Function
 *
 * Generates a Plaid Link token for the frontend to initialize the Plaid Link flow.
 * This token is used to open the Plaid Link modal where users select their bank.
 *
 * Request body: { user_id: string }
 * Response: { link_token: string }
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Products, CountryCode } from 'npm:plaid@24.0.0';
import { getPlaidClient, errorResponse, successResponse } from '../_shared/plaid-client.ts';
import { verifyUserToken } from '../_shared/supabase-admin.ts';

serve(async (req) => {
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
