/**
 * Property Value Edge Function
 *
 * Proxies to Rentcast AVM (Automated Valuation Model) endpoint.
 * Returns estimated property value and price range for a given address.
 *
 * Request body: { address: string }
 * Response: { price: number, priceRangeLow: number, priceRangeHigh: number }
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
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

    const { address } = await req.json();

    if (!address) {
      return new Response(
        JSON.stringify({ error: 'Address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('RENTCAST_API_KEY');
    if (!apiKey) {
      throw new Error('RENTCAST_API_KEY is not configured');
    }

    const url = `https://api.rentcast.io/v1/avm/value?address=${encodeURIComponent(address)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Rentcast API error:', errorText);
      throw new Error('Failed to fetch property value');
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({
        price: data.price ?? null,
        priceRangeLow: data.priceRangeLow ?? null,
        priceRangeHigh: data.priceRangeHigh ?? null,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in property-value:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to fetch property value' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
