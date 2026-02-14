-- Utility API Integration: 4 new tables + ALTER utility_readings

-- 1. Utility Connections (like plaid_items)
CREATE TABLE IF NOT EXISTS public.utility_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'utilityapi',
  connection_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  utility_name TEXT,
  account_number TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Utility Accounts (like plaid_accounts)
CREATE TABLE IF NOT EXISTS public.utility_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_id UUID NOT NULL REFERENCES public.utility_connections(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL,
  utility_type public.utility_type NOT NULL,
  service_address TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Utility Bills Raw (like plaid_transactions_raw)
CREATE TABLE IF NOT EXISTS public.utility_bills_raw (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_id UUID NOT NULL REFERENCES public.utility_connections(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL,
  bill_id TEXT NOT NULL UNIQUE,
  statement_date DATE NOT NULL,
  usage_amount NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  cost NUMERIC,
  utility_type public.utility_type NOT NULL,
  json_raw JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Utility Sync State (like plaid_sync_state)
CREATE TABLE IF NOT EXISTS public.utility_sync_state (
  connection_id UUID PRIMARY KEY REFERENCES public.utility_connections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_synced_at TIMESTAMPTZ,
  cursor TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 5. ALTER utility_readings - add API integration fields
ALTER TABLE public.utility_readings
  ADD COLUMN IF NOT EXISTS auto_imported BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS needs_review BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS bill_id TEXT,
  ADD COLUMN IF NOT EXISTS confidence TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_utility_connections_user_id ON public.utility_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_utility_accounts_user_id ON public.utility_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_utility_accounts_connection_id ON public.utility_accounts(connection_id);
CREATE INDEX IF NOT EXISTS idx_utility_bills_raw_user_id ON public.utility_bills_raw(user_id);
CREATE INDEX IF NOT EXISTS idx_utility_bills_raw_statement_date ON public.utility_bills_raw(statement_date);
CREATE INDEX IF NOT EXISTS idx_utility_bills_raw_connection_id ON public.utility_bills_raw(connection_id);
CREATE INDEX IF NOT EXISTS idx_utility_readings_auto_imported ON public.utility_readings(auto_imported) WHERE auto_imported = true;
CREATE INDEX IF NOT EXISTS idx_utility_readings_needs_review ON public.utility_readings(needs_review) WHERE needs_review = true;

-- RLS Policies
ALTER TABLE public.utility_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utility_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utility_bills_raw ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utility_sync_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own utility connections" ON public.utility_connections
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own utility connections" ON public.utility_connections
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own utility connections" ON public.utility_connections
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own utility connections" ON public.utility_connections
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own utility accounts" ON public.utility_accounts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own utility accounts" ON public.utility_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own utility accounts" ON public.utility_accounts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own utility accounts" ON public.utility_accounts
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own utility bills" ON public.utility_bills_raw
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own utility bills" ON public.utility_bills_raw
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own utility sync state" ON public.utility_sync_state
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own utility sync state" ON public.utility_sync_state
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own utility sync state" ON public.utility_sync_state
  FOR UPDATE USING (auth.uid() = user_id);
