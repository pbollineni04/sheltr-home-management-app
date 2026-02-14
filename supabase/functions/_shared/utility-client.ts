/**
 * Shared UtilityAPI client configuration for Supabase Edge Functions
 * Handles UtilityAPI HTTP calls and common utilities
 *
 * UtilityAPI docs: https://utilityapi.com/docs/quickstart
 * Flow: Create Form → User authorizes → Get authorizations → Activate meters → Get bills
 */

const UTILITYAPI_BASE_URL = 'https://utilityapi.com/api/v2';

function getToken(): string {
  const token = Deno.env.get('UTILITYAPI_CLIENT_SECRET');
  if (!token) {
    throw new Error('Missing required UTILITYAPI_CLIENT_SECRET environment variable');
  }
  return token;
}

async function apiRequest<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const response = await fetch(`${UTILITYAPI_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`UtilityAPI error (${response.status}): ${errorBody}`);
  }

  return response.json() as Promise<T>;
}

// ============================================================================
// Form / Authorization Flow
// ============================================================================

interface FormResponse {
  uid: string;
  url: string;
  created: string;
}

/**
 * Create an authorization form URL for the user to connect their utility account.
 * POST /forms → returns { uid, url } where url is the form the user fills out.
 */
export async function createForm(): Promise<{ url: string; uid: string }> {
  const data = await apiRequest<FormResponse>('/forms', {
    method: 'POST',
    body: JSON.stringify({}),
  });

  return { url: data.url, uid: data.uid };
}

interface MeterBase {
  service_class: string;
  service_address: string;
  billing_account: string;
  service_identifier: string;
}

interface MeterResponse {
  uid: string;
  authorization_uid: string;
  base: MeterBase;
  bill_count: number;
  created: string;
  status: string;
}

interface AuthorizationResponse {
  uid: string;
  form_uid: string;
  created: string;
  is_declined: boolean;
  is_archived: boolean;
  meters: {
    meters: MeterResponse[];
  };
  [key: string]: unknown;
}

interface AuthorizationsListResponse {
  authorizations: AuthorizationResponse[];
  next: string | null;
}

/**
 * Find the authorization created from a given form.
 * Lists all authorizations and filters by form_uid.
 * GET /authorizations
 */
export async function getAuthorizationByFormUid(formUid: string): Promise<AuthorizationResponse | null> {
  const data = await apiRequest<AuthorizationsListResponse>('/authorizations');
  const authorizations = data.authorizations || [];
  // Find the authorization that matches our form_uid
  const match = authorizations.find((auth: any) => auth.form_uid === formUid);
  if (!match) return null;
  // Fetch the full authorization with meter details included
  return getAuthorization(match.uid);
}

/**
 * Get a specific authorization with meter details.
 * GET /authorizations/AUTH_UID?include=meters
 */
export async function getAuthorization(authUid: string): Promise<AuthorizationResponse> {
  return apiRequest(`/authorizations/${encodeURIComponent(authUid)}?include=meters`);
}

/**
 * Activate meters for historical data collection.
 * POST /meters/historical-collection
 */
export async function activateMeters(meterUids: string[]): Promise<void> {
  await apiRequest('/meters/historical-collection', {
    method: 'POST',
    body: JSON.stringify({
      meters: meterUids,
    }),
  });
}

// ============================================================================
// Bills
// ============================================================================

interface BillBase {
  bill_statement_date: string;
  bill_total_volume: number;
  bill_total_unit: string;
  bill_total_cost: number;
}

interface BillResponse {
  uid: string;
  meter_uid: string;
  created: string;
  base: BillBase;
}

interface BillsListResponse {
  bills: BillResponse[];
  next: string | null;
}

/**
 * Fetch bills for a given meter.
 * GET /bills?meters=METER_UID
 */
export async function getBills(meterUid: string): Promise<{
  bills: Array<{
    uid: string;
    meter_uid: string;
    statement_date: string;
    total_usage: number;
    total_unit: string;
    total_cost: number;
    raw: BillResponse;
  }>;
}> {
  const data = await apiRequest<BillsListResponse>(
    `/bills?meters=${encodeURIComponent(meterUid)}`
  );

  const bills = (data.bills || []).map((bill) => ({
    uid: bill.uid,
    meter_uid: bill.meter_uid,
    statement_date: bill.base.bill_statement_date,
    total_usage: bill.base.bill_total_volume,
    total_unit: bill.base.bill_total_unit,
    total_cost: bill.base.bill_total_cost,
    raw: bill,
  }));

  return { bills };
}

/**
 * Check meter status (polling for when bills are ready).
 * GET /meters/METER_UID
 */
export async function getMeterStatus(meterUid: string): Promise<{
  uid: string;
  status: string;
  bill_count: number;
  service_class: string;
  service_address: string;
  utility: string;
}> {
  return apiRequest(`/meters/${encodeURIComponent(meterUid)}`);
}

// ============================================================================
// Utility Helpers
// ============================================================================

/**
 * Map UtilityAPI service class to our utility_type enum
 */
export function mapServiceClassToUtilityType(serviceClass: string): string {
  const normalized = (serviceClass || '').toLowerCase();
  if (normalized.includes('electric')) return 'electricity';
  if (normalized.includes('gas')) return 'gas';
  if (normalized.includes('water') || normalized.includes('sewer')) return 'water';
  if (normalized.includes('internet') || normalized.includes('telecom')) return 'internet';
  return 'electricity'; // Default
}

/**
 * Convert units to standard units for storage
 */
export function normalizeUnit(value: number, fromUnit: string, utilityType: string): { amount: number; unit: string } {
  const normalized = (fromUnit || '').toLowerCase();

  switch (utilityType) {
    case 'gas':
      if (normalized === 'ccf' || normalized === 'hundred cubic feet') {
        return { amount: value * 1.037, unit: 'therms' };
      }
      if (normalized === 'cubic feet' || normalized === 'cf') {
        return { amount: (value / 100) * 1.037, unit: 'therms' };
      }
      return { amount: value, unit: 'therms' };

    case 'water':
      if (normalized === 'cubic feet' || normalized === 'cf') {
        return { amount: value * 7.48, unit: 'gallons' };
      }
      if (normalized === 'ccf' || normalized === 'hundred cubic feet') {
        return { amount: value * 748, unit: 'gallons' };
      }
      return { amount: value, unit: 'gallons' };

    case 'electricity':
      return { amount: value, unit: 'kWh' };

    case 'internet':
      if (normalized === 'tb') {
        return { amount: value * 1024, unit: 'GB' };
      }
      return { amount: value, unit: 'GB' };

    default:
      return { amount: value, unit: fromUnit };
  }
}

/**
 * Determine confidence level based on data completeness
 */
export function calculateConfidence(bill: {
  total_usage: number;
  total_cost: number;
  statement_date: string;
}): 'high' | 'medium' | 'low' {
  let score = 0;
  if (bill.total_usage > 0) score++;
  if (bill.total_cost > 0) score++;
  if (bill.statement_date) score++;

  if (score === 3) return 'high';
  if (score >= 2) return 'medium';
  return 'low';
}
