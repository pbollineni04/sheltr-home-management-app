# Plaid Bank Integration - Implementation Specification

## Executive Summary

Complete implementation of Plaid bank account connection with automatic transaction sync to the Expenses tab. This will enable users to link their bank accounts, automatically import transactions, and manage expenses with smart categorization.

---

## Current State Analysis

### ✅ Already Implemented
1. **Database Schema** (20250920160000_plaid_schema.sql)
   - `plaid_items`: Stores connected bank items (institution linkage)
   - `plaid_accounts`: Individual accounts per item
   - `plaid_transactions_raw`: Raw transaction data from Plaid
   - `plaid_sync_state`: Tracks sync cursor for incremental updates
   - Full RLS policies enabled for user data security

2. **Frontend Components**
   - `ExpensePlaidControls.tsx`: UI for Connect Bank / Sync Now buttons
   - `react-plaid-link`: NPM package already installed (v4.1.1)
   - `plaidService.ts`: Client-side service functions for Plaid operations

3. **Database Integration**
   - `expenses` table exists with categories, amounts, dates
   - User authentication via Supabase auth

### ❌ Missing Components
1. **Supabase Edge Functions** (Backend Logic)
   - `plaid-create-link-token`: Generate Plaid Link token
   - `plaid-exchange-public-token`: Exchange public token for access token
   - `plaid-sync-transactions`: Fetch and sync transactions
   - No functions directory found in `/supabase/functions/`

2. **Transaction-to-Expense Logic**
   - No automatic conversion from `plaid_transactions_raw` → `expenses`
   - No duplicate detection mechanism
   - No category mapping from Plaid categories → expense categories

3. **Environment Configuration**
   - Missing Plaid API keys (PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV)
   - Missing webhook configuration for real-time updates

4. **UI Enhancements**
   - No transaction confirmation/editing UI
   - No account management (view connected accounts, disconnect)
   - No transaction filtering/search

---

## Implementation Plan

### Phase 1: Backend Infrastructure (Supabase Edge Functions)

#### 1.1 Create Supabase Edge Functions Directory Structure
```
supabase/functions/
├── plaid-create-link-token/
│   └── index.ts
├── plaid-exchange-public-token/
│   └── index.ts
├── plaid-sync-transactions/
│   └── index.ts
└── _shared/
    ├── plaid-client.ts
    └── supabase-admin.ts
```

#### 1.2 Environment Variables Setup
Add to Supabase project settings (Dashboard → Settings → Secrets):
```env
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_sandbox_secret
PLAID_ENV=sandbox  # sandbox | development | production
```

#### 1.3 Edge Function: plaid-create-link-token
**Purpose**: Generate Plaid Link token for frontend to initialize Plaid Link flow

**Implementation**:
```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid'

const plaidClient = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments[Deno.env.get('PLAID_ENV') || 'sandbox'],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': Deno.env.get('PLAID_CLIENT_ID'),
        'PLAID-SECRET': Deno.env.get('PLAID_SECRET'),
      },
    },
  })
)

serve(async (req) => {
  const { user_id } = await req.json()

  const response = await plaidClient.linkTokenCreate({
    user: { client_user_id: user_id },
    client_name: 'Sheltr Home Management',
    products: [Products.Transactions],
    country_codes: [CountryCode.Us],
    language: 'en',
  })

  return new Response(JSON.stringify({ link_token: response.data.link_token }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

#### 1.4 Edge Function: plaid-exchange-public-token
**Purpose**: Exchange public token from Plaid Link for permanent access token

**Implementation**:
```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'
import { plaidClient } from '../_shared/plaid-client.ts'

serve(async (req) => {
  const { public_token, user_id } = await req.json()

  // Exchange public token
  const response = await plaidClient.itemPublicTokenExchange({ public_token })
  const { access_token, item_id } = response.data

  // Get institution info
  const itemResponse = await plaidClient.itemGet({ access_token })
  const institution_name = itemResponse.data.item.institution_id

  // Store in database
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  await supabase.from('plaid_items').insert({
    user_id,
    item_id,
    access_token,
    institution_name,
  })

  // Get accounts
  const accountsResponse = await plaidClient.accountsGet({ access_token })
  const accounts = accountsResponse.data.accounts.map(acc => ({
    user_id,
    item_id,
    account_id: acc.account_id,
    name: acc.name,
    mask: acc.mask,
    type: acc.type,
    subtype: acc.subtype,
  }))

  await supabase.from('plaid_accounts').insert(accounts)

  return new Response(JSON.stringify({ item_id }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

#### 1.5 Edge Function: plaid-sync-transactions
**Purpose**: Fetch transactions from Plaid and convert to expenses

**Implementation Strategy**:
1. Use Plaid Transactions Sync API (cursor-based incremental sync)
2. Fetch new transactions since last cursor
3. Store in `plaid_transactions_raw`
4. Auto-create entries in `expenses` table with:
   - Automatic category mapping from Plaid categories
   - User confirmation flag for review
5. Update sync cursor in `plaid_sync_state`

**Category Mapping Logic**:
```typescript
const categoryMap: Record<string, string> = {
  // Plaid category → Expense category
  'HOME_IMPROVEMENT': 'renovation',
  'GENERAL_SERVICES_OTHER_GENERAL_SERVICES': 'services',
  'GENERAL_MERCHANDISE_HARDWARE_STORE': 'renovation',
  'UTILITIES_GAS': 'utilities',
  'UTILITIES_ELECTRIC': 'utilities',
  'HOME_APPLIANCES': 'appliances',
  // ... comprehensive mapping
}
```

**Duplicate Prevention**:
- Check if `plaid_transactions_raw.transaction_id` already exists before insert
- Check if expense with same amount + date ± 2 days + similar description exists
- Flag potential duplicates for user confirmation

---

### Phase 2: Enhanced Database Schema

#### Current Expenses Table Structure (Confirmed from Schema)
```sql
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category expense_category NOT NULL,  -- ENUM: renovation, maintenance, appliances, services, utilities
  date DATE NOT NULL,
  vendor TEXT,
  room TEXT,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  receipt_url TEXT,
  metadata JSONB DEFAULT '{}',
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

#### 2.1 Add Plaid Integration Fields to Expenses Table
```sql
-- Migration: 20251106_add_plaid_fields_to_expenses.sql

-- Add Plaid integration fields
ALTER TABLE public.expenses
ADD COLUMN plaid_transaction_id TEXT,
ADD COLUMN needs_review BOOLEAN DEFAULT false,
ADD COLUMN auto_imported BOOLEAN DEFAULT false;

-- Add foreign key constraint to plaid_transactions_raw
-- Note: We don't use REFERENCES constraint because plaid_transactions_raw.transaction_id is not unique
-- (same transaction can appear multiple times due to updates/corrections from Plaid)
-- Instead we'll handle referential integrity in application logic

-- Create indexes for performance
CREATE INDEX idx_expenses_plaid_tx ON public.expenses(plaid_transaction_id) WHERE plaid_transaction_id IS NOT NULL;
CREATE INDEX idx_expenses_needs_review ON public.expenses(user_id, needs_review) WHERE needs_review = true;
CREATE INDEX idx_expenses_auto_imported ON public.expenses(user_id, auto_imported) WHERE auto_imported = true;

-- Add comment for documentation
COMMENT ON COLUMN public.expenses.plaid_transaction_id IS 'Links to plaid_transactions_raw.transaction_id if expense was auto-imported from Plaid';
COMMENT ON COLUMN public.expenses.needs_review IS 'True if auto-imported transaction needs user confirmation';
COMMENT ON COLUMN public.expenses.auto_imported IS 'True if expense was automatically imported from Plaid (vs manually entered)';
```

#### 2.2 Add Connected Accounts View
```sql
CREATE VIEW public.user_plaid_accounts AS
SELECT
  pa.id,
  pa.user_id,
  pa.account_id,
  pa.name,
  pa.mask,
  pa.type,
  pa.subtype,
  pi.institution_name,
  pi.item_id,
  ps.last_synced_at
FROM plaid_accounts pa
JOIN plaid_items pi ON pa.item_id = pi.item_id
LEFT JOIN plaid_sync_state ps ON pa.item_id = ps.item_id;
```

---

### Phase 3: Frontend Enhancements

#### 3.1 Update ExpensePlaidControls Component
**Add Features**:
- Auto-sync toggle (enable/disable automatic sync on interval)
- View connected accounts list
- Disconnect account button
- Last sync status with transaction count

#### 3.2 Create Transaction Review Modal
**Component**: `ExpenseTransactionReview.tsx`

**Features**:
- Shows newly imported transactions flagged with `needs_review: true`
- Allow user to:
  - Confirm transaction (clears review flag)
  - Edit category, description, amount
  - Delete (mark as duplicate or invalid)
  - Merge with existing manual expense

**UI Flow**:
```
1. User clicks "Sync Now"
2. Transactions import to plaid_transactions_raw
3. Auto-create expenses with needs_review=true
4. Show modal: "5 new transactions imported - Review now?"
5. User reviews each transaction
6. Confirmed transactions clear needs_review flag
```

#### 3.3 Enhance ExpenseRecentList Component
**Add Indicators**:
- Badge showing "Auto-imported" for Plaid transactions
- Icon indicator for transactions needing review
- Quick action to view original Plaid transaction details

#### 3.4 Add Account Management Section
**Component**: `ExpenseBankAccounts.tsx`

**Features**:
- List all connected accounts (from `user_plaid_accounts` view)
- Show account details: institution, mask, type, last sync
- Disconnect button (soft delete from plaid_items)
- Manual sync trigger per account

---

### Phase 4: Automation & Real-time Sync

#### 4.1 Scheduled Sync (Supabase Cron Job)
```sql
-- Run sync every 6 hours for all users with connected accounts
SELECT cron.schedule(
  'plaid-auto-sync',
  '0 */6 * * *',  -- Every 6 hours
  $$
    SELECT net.http_post(
      url := current_setting('app.supabase_functions_url') || '/plaid-sync-all-users',
      headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.service_role_key'))
    )
  $$
);
```

#### 4.2 Plaid Webhooks (Optional Enhancement)
**Setup**:
1. Create `plaid-webhook` edge function
2. Register webhook URL in Plaid Dashboard
3. Handle webhook events:
   - `TRANSACTIONS_REMOVED`: Delete from plaid_transactions_raw
   - `INITIAL_UPDATE`: Trigger full sync for new account
   - `DEFAULT_UPDATE`: New transactions available

---

### Phase 5: User Experience Polish

#### 5.1 Onboarding Flow
**When**: After user completes initial signup

**Flow**:
1. Welcome screen: "Connect your bank to automatically track expenses"
2. Click "Connect Bank" → Plaid Link modal
3. Select institution → Authenticate
4. Success: "Account connected! Syncing transactions..."
5. Show transaction review modal with first batch

#### 5.2 Empty State Design
**Expenses Tab Without Bank Connection**:
```
┌─────────────────────────────────────┐
│  📊 No expenses yet                 │
│                                     │
│  Connect your bank account to      │
│  automatically import transactions │
│                                     │
│  [Connect Bank Account]            │
│                                     │
│  Or add expenses manually below    │
└─────────────────────────────────────┘
```

#### 5.3 Loading States
- Skeleton loaders during sync
- Progress indicator showing "Importing 127 transactions..."
- Success toast: "Successfully imported 45 new transactions"

---

## Security Considerations

### 1. Access Token Storage
- ✅ Store in `plaid_items.access_token` (server-side only)
- ❌ NEVER expose access tokens to frontend
- Use RLS to prevent direct access from client

### 2. Webhook Validation
- Verify webhook signature using Plaid's verification method
- Validate webhook source IP addresses

### 3. User Data Isolation
- All Plaid data filtered by `user_id` via RLS
- Edge functions must validate user JWT before operations

### 4. Rate Limiting
- Implement rate limiting on sync operations (max 1 sync per minute per user)
- Prevent abuse of Plaid API quota

---

## Testing Strategy

### Unit Tests
- Category mapping logic
- Duplicate detection algorithm
- Date range calculations

### Integration Tests
- Plaid Link flow end-to-end
- Transaction sync with mock Plaid responses
- Expense creation from transactions

### Sandbox Testing
1. Use Plaid Sandbox environment (free)
2. Test institutions: "First Platypus Bank", "Tattersall Federal Credit Union"
3. Test credentials provided by Plaid sandbox

---

## Deployment Checklist

### Backend Setup
- [ ] Create Supabase Edge Functions
- [ ] Add environment variables to Supabase project
- [ ] Install Plaid SDK in edge functions: `npm i plaid`
- [ ] Deploy edge functions: `supabase functions deploy`
- [ ] Test edge functions with curl/Postman

### Database Migration
- [ ] Run migration to add expense linking columns
- [ ] Create user_plaid_accounts view
- [ ] Set up cron job for auto-sync (optional)

### Frontend Updates
- [ ] Implement transaction review modal
- [ ] Add account management UI
- [ ] Update ExpenseTracker to show auto-imported transactions
- [ ] Add loading states and error handling

### Production Readiness
- [ ] Obtain Plaid Production API keys
- [ ] Update `PLAID_ENV` to "production"
- [ ] Set up Plaid webhook endpoint
- [ ] Configure rate limiting
- [ ] Add monitoring and alerting

---

## Implementation Timeline

### Week 1: Backend Foundation
- Days 1-2: Set up Supabase Edge Functions directory and structure
- Days 3-4: Implement create-link-token and exchange-public-token
- Day 5: Implement sync-transactions with basic mapping

### Week 2: Database & Logic
- Days 1-2: Database migrations and category mapping
- Days 3-4: Duplicate detection and expense auto-creation
- Day 5: Testing and refinement

### Week 3: Frontend Integration
- Days 1-2: Transaction review modal
- Days 3-4: Account management UI
- Day 5: Polish and error handling

### Week 4: Automation & Testing
- Days 1-2: Scheduled sync and webhooks
- Days 3-4: End-to-end testing with Plaid Sandbox
- Day 5: Documentation and deployment

---

## Open Questions for User

1. **Category Mapping**: Should users be able to customize category mappings? (e.g., set "Home Depot" to always map to "renovation")

2. **Duplicate Handling**: When duplicate detected:
   - Auto-merge with existing expense?
   - Always prompt user?
   - Skip import silently?

3. **Transaction History**: How far back should initial sync go?
   - Last 30 days?
   - Last 90 days?
   - Full 2-year history?

4. **Multiple Accounts**: If user connects multiple bank accounts, should transactions from all be shown together or filtered by account?

5. **Auto-categorization Confidence**: Should low-confidence categorizations be flagged for review separately?

---

## Cost Considerations

### Plaid Pricing (as of 2024)
- **Development**: Free (sandbox environment)
- **Production**:
  - Transactions: $0.00075 per transaction
  - Link: Free for first 100 users, then tiered pricing
  - Expected cost for 1000 users with 50 transactions/month: ~$37.50/month

### Supabase Edge Functions
- Free tier: 500K invocations/month
- Expected usage: ~3000 invocations/month (1000 users × 3 syncs/month)
- Cost: $0 (well within free tier)

---

## Success Metrics

### Technical KPIs
- Transaction import success rate: >99%
- Category auto-mapping accuracy: >85%
- Sync completion time: <10 seconds for 100 transactions
- Duplicate detection accuracy: >95%

### User Experience KPIs
- Bank connection completion rate: >80%
- Time to first transaction import: <2 minutes
- User confirmation rate (transactions not deleted): >90%
- Daily active sync users: >60% of connected users

---

## Next Steps

1. **Immediate**: Get Plaid API keys (sign up at plaid.com/dashboard)
2. **Setup**: Create Supabase Edge Functions directory structure
3. **Implement**: Start with plaid-create-link-token function
4. **Test**: Use Plaid Sandbox to validate flow
5. **Iterate**: Build transaction review UI after backend works

**Ready to begin implementation?** Let me know if you want to:
- Start with backend edge functions
- Add database migrations first
- Begin with frontend UI enhancements
- Or all in parallel with task delegation
