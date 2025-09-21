-- Plaid integration schema: items, accounts, raw transactions, sync state
-- RLS-enforced by user_id; indexes for common queries

-- Enable useful extensions
create extension if not exists pgcrypto;

-- 1) Items (one per Plaid item per user)
create table if not exists public.plaid_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  item_id text unique not null,
  access_token text not null, -- stored server-side; never sent to client
  institution_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_plaid_items_user on public.plaid_items(user_id);

-- 2) Accounts (denormalized for convenience)
create table if not exists public.plaid_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  item_id text not null references public.plaid_items(item_id) on delete cascade,
  account_id text not null,
  name text,
  mask text,
  type text,
  subtype text,
  created_at timestamptz not null default now()
);

create unique index if not exists u_plaid_accounts_account on public.plaid_accounts(account_id);
create index if not exists idx_plaid_accounts_user on public.plaid_accounts(user_id);
create index if not exists idx_plaid_accounts_item on public.plaid_accounts(item_id);

-- 3) Raw transactions (landing table)
create table if not exists public.plaid_transactions_raw (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  item_id text not null,
  account_id text not null,
  transaction_id text not null,
  amount numeric(14,2) not null,
  iso_date date not null,
  name text,
  merchant_name text,
  categories text[],
  pending boolean default false,
  json_raw jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists u_plaid_transactions_raw_tx on public.plaid_transactions_raw(transaction_id, account_id);
create index if not exists idx_plaid_tx_user_date on public.plaid_transactions_raw(user_id, iso_date desc);
create index if not exists idx_plaid_tx_item on public.plaid_transactions_raw(item_id);
create index if not exists idx_plaid_tx_categories on public.plaid_transactions_raw using gin(categories);

-- 4) Sync state (cursor per item)
create table if not exists public.plaid_sync_state (
  item_id text primary key,
  user_id uuid not null,
  cursor text,
  last_synced_at timestamptz
);

create index if not exists idx_plaid_sync_user on public.plaid_sync_state(user_id);

-- RLS
alter table public.plaid_items enable row level security;
alter table public.plaid_accounts enable row level security;
alter table public.plaid_transactions_raw enable row level security;
alter table public.plaid_sync_state enable row level security;

-- Policies: user can only access their rows (use DO blocks for idempotence)
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'plaid_items' and policyname = 'plaid_items_select_own'
  ) then
    execute 'create policy plaid_items_select_own on public.plaid_items for select to authenticated using (user_id = auth.uid())';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'plaid_items' and policyname = 'plaid_items_insert_own'
  ) then
    execute 'create policy plaid_items_insert_own on public.plaid_items for insert to authenticated with check (user_id = auth.uid())';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'plaid_items' and policyname = 'plaid_items_update_own'
  ) then
    execute 'create policy plaid_items_update_own on public.plaid_items for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'plaid_items' and policyname = 'plaid_items_delete_own'
  ) then
    execute 'create policy plaid_items_delete_own on public.plaid_items for delete to authenticated using (user_id = auth.uid())';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'plaid_accounts' and policyname = 'plaid_accounts_select_own'
  ) then
    execute 'create policy plaid_accounts_select_own on public.plaid_accounts for select to authenticated using (user_id = auth.uid())';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'plaid_accounts' and policyname = 'plaid_accounts_insert_own'
  ) then
    execute 'create policy plaid_accounts_insert_own on public.plaid_accounts for insert to authenticated with check (user_id = auth.uid())';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'plaid_accounts' and policyname = 'plaid_accounts_update_own'
  ) then
    execute 'create policy plaid_accounts_update_own on public.plaid_accounts for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'plaid_accounts' and policyname = 'plaid_accounts_delete_own'
  ) then
    execute 'create policy plaid_accounts_delete_own on public.plaid_accounts for delete to authenticated using (user_id = auth.uid())';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'plaid_transactions_raw' and policyname = 'plaid_tx_select_own'
  ) then
    execute 'create policy plaid_tx_select_own on public.plaid_transactions_raw for select to authenticated using (user_id = auth.uid())';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'plaid_transactions_raw' and policyname = 'plaid_tx_insert_own'
  ) then
    execute 'create policy plaid_tx_insert_own on public.plaid_transactions_raw for insert to authenticated with check (user_id = auth.uid())';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'plaid_transactions_raw' and policyname = 'plaid_tx_update_own'
  ) then
    execute 'create policy plaid_tx_update_own on public.plaid_transactions_raw for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'plaid_transactions_raw' and policyname = 'plaid_tx_delete_own'
  ) then
    execute 'create policy plaid_tx_delete_own on public.plaid_transactions_raw for delete to authenticated using (user_id = auth.uid())';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'plaid_sync_state' and policyname = 'plaid_sync_select_own'
  ) then
    execute 'create policy plaid_sync_select_own on public.plaid_sync_state for select to authenticated using (user_id = auth.uid())';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'plaid_sync_state' and policyname = 'plaid_sync_insert_own'
  ) then
    execute 'create policy plaid_sync_insert_own on public.plaid_sync_state for insert to authenticated with check (user_id = auth.uid())';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'plaid_sync_state' and policyname = 'plaid_sync_update_own'
  ) then
    execute 'create policy plaid_sync_update_own on public.plaid_sync_state for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'plaid_sync_state' and policyname = 'plaid_sync_delete_own'
  ) then
    execute 'create policy plaid_sync_delete_own on public.plaid_sync_state for delete to authenticated using (user_id = auth.uid())';
  end if;
end $$;
