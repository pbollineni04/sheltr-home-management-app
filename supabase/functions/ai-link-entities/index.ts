/**
 * AI Entity Linking Edge Function
 *
 * Uses Claude Haiku to determine if two home management items are related.
 * Called as a fallback for medium-confidence rule-based matches.
 *
 * Request body: { itemA: EntityContext, itemB: EntityContext }
 * Response: { related: boolean, confidence: "high"|"medium"|"low", reason: string }
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { verifyUserToken } from '../_shared/supabase-admin.ts';

interface EntityContext {
  type: string;
  title: string;
  description?: string;
  date: string;
  amount?: number;
  category?: string;
  room?: string;
}

interface LinkResponse {
  related: boolean;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

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
    await verifyUserToken(authHeader);

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const { itemA, itemB } = await req.json() as { itemA: EntityContext; itemB: EntityContext };

    if (!itemA || !itemB) {
      return new Response(
        JSON.stringify({ error: 'Both itemA and itemB are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const formatItem = (item: EntityContext, label: string) => {
      const parts = [`Type: ${item.type}`, `Title: ${item.title}`];
      if (item.description) parts.push(`Description: ${item.description}`);
      parts.push(`Date: ${item.date}`);
      if (item.amount) parts.push(`Amount: $${item.amount}`);
      if (item.category) parts.push(`Category: ${item.category}`);
      if (item.room) parts.push(`Room: ${item.room}`);
      return `${label}:\n${parts.join('\n')}`;
    };

    const prompt = `You are analyzing two items from a home management app to determine if they are related.

${formatItem(itemA, 'Item A')}

${formatItem(itemB, 'Item B')}

Are these two items related? Consider:
- Could one be a receipt/document for the other?
- Are they about the same home repair, purchase, or project?
- Do they reference the same service, appliance, or area of the home?

Respond with ONLY valid JSON (no markdown):
{"related": true/false, "confidence": "high"/"medium"/"low", "reason": "brief explanation"}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Anthropic API error: ${response.status} ${errText}`);
    }

    const result = await response.json();
    const text = result.content?.[0]?.text || '';

    let linkResponse: LinkResponse;
    try {
      linkResponse = JSON.parse(text);
    } catch {
      linkResponse = { related: false, confidence: 'low', reason: 'Failed to parse AI response' };
    }

    return new Response(
      JSON.stringify(linkResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
