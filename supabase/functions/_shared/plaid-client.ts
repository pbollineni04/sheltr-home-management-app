/**
 * Shared Plaid client configuration for Supabase Edge Functions
 * Handles Plaid API initialization and common utilities
 */

import { Configuration, PlaidApi, PlaidEnvironments } from 'npm:plaid@24.0.0';

/**
 * Initialize Plaid client with environment variables
 */
export function getPlaidClient(): PlaidApi {
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
export function mapPlaidCategoryToExpenseCategory(
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

  // Default to uncategorized with low confidence (will trigger needs_review)
  return { category: 'uncategorized', confidence: 'low' };
}

/**
 * Calculate similarity between two strings (0-1 score)
 * Simple implementation using Jaccard similarity of word sets
 */
export function calculateStringSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.toLowerCase().split(/\s+/));
  const words2 = new Set(str2.toLowerCase().split(/\s+/));

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return union.size === 0 ? 0 : intersection.size / union.size;
}

/**
 * Error response helper
 */
export function errorResponse(message: string, status = 400) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Success response helper
 */
export function successResponse(data: unknown, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
