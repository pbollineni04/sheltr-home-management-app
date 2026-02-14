/**
 * Utility Create Link Token Edge Function
 *
 * Creates a UtilityAPI authorization form URL.
 * The user fills out this form to authorize access to their utility data.
 *
 * Request body: {} (user identified via JWT)
 * Response: { url: string, uid: string }
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createForm } from '../_shared/utility-client.ts';
import { verifyUserToken } from '../_shared/supabase-admin.ts';

serve(async (req) => {
  // Handle CORS preflight
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
    await verifyUserToken(authHeader);

    const { url, uid } = await createForm();

    return new Response(
      JSON.stringify({ url, uid }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating utility link token:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to create link token' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
