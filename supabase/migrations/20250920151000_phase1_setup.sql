-- Phase 1 setup: Realtime, RLS, indexes, optional dashboard metrics

-- 1) Realtime: ensure tasks, documents, expenses are in publication
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'tasks'
  ) then
    execute 'alter publication supabase_realtime add table public.tasks';
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'documents'
  ) then
    execute 'alter publication supabase_realtime add table public.documents';
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'expenses'
  ) then
    execute 'alter publication supabase_realtime add table public.expenses';
  end if;
end $$;

-- 2) RLS: enable if not already
alter table if exists public.tasks enable row level security;
alter table if exists public.documents enable row level security;
alter table if exists public.expenses enable row level security;

-- 2a) RLS policies for tasks
create policy if not exists tasks_select_own
on public.tasks for select to authenticated
using (user_id = auth.uid());

create policy if not exists tasks_insert_own
on public.tasks for insert to authenticated
with check (user_id = auth.uid());

create policy if not exists tasks_update_own
on public.tasks for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy if not exists tasks_delete_own
on public.tasks for delete to authenticated
using (user_id = auth.uid());

-- 2b) RLS policies for documents
create policy if not exists documents_select_own
on public.documents for select to authenticated
using (user_id = auth.uid());

create policy if not exists documents_insert_own
on public.documents for insert to authenticated
with check (user_id = auth.uid());

create policy if not exists documents_update_own
on public.documents for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy if not exists documents_delete_own
on public.documents for delete to authenticated
using (user_id = auth.uid());

-- 2c) RLS policies for expenses
create policy if not exists expenses_select_own
on public.expenses for select to authenticated
using (user_id = auth.uid());

create policy if not exists expenses_insert_own
on public.expenses for insert to authenticated
with check (user_id = auth.uid());

create policy if not exists expenses_update_own
on public.expenses for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy if not exists expenses_delete_own
on public.expenses for delete to authenticated
using (user_id = auth.uid());

-- 3) Indexes for performance
create index if not exists idx_expenses_user_date on public.expenses(user_id, date desc);
create index if not exists idx_tasks_user_due on public.tasks(user_id, due_date);
create index if not exists idx_documents_user on public.documents(user_id);

-- 4) Optional: Materialized view for dashboard metrics
-- This version does not depend on auth.users; it aggregates by any user_id appearing in base tables.
create materialized view if not exists public.dashboard_metrics as
with user_ids as (
  select user_id from public.tasks
  union
  select user_id from public.documents
  union
  select user_id from public.expenses
),
agg as (
  select
    u.user_id,
    coalesce(sum(case when t.completed = false then 1 else 0 end), 0) as pending_tasks,
    coalesce(sum(case when t.completed = false and t.due_date is not null and t.due_date::timestamptz < now() then 1 else 0 end), 0) as overdue_tasks,
    coalesce(count(distinct d.id), 0) as total_documents,
    coalesce(sum(case when e.date >= date_trunc('month', now()) then e.amount else 0 end), 0)::numeric as monthly_expenses,
    greatest(
      coalesce(max(t.updated_at), to_timestamp(0)),
      coalesce(max(d.created_at), to_timestamp(0)),
      coalesce(max(e.created_at), to_timestamp(0))
    ) as last_activity
  from user_ids u
  left join public.tasks t on t.user_id = u.user_id
  left join public.documents d on d.user_id = u.user_id
  left join public.expenses e on e.user_id = u.user_id
  group by u.user_id
)
select * from agg;

create index if not exists idx_dashboard_metrics_user_id on public.dashboard_metrics(user_id);

-- Helper function to refresh the materialized view concurrently
create or replace function public.refresh_dashboard_metrics()
returns trigger as $$
begin
  refresh materialized view concurrently public.dashboard_metrics;
  return null;
end; $$ language plpgsql;

-- Optional: Secure view to enforce row-level filtering by current user
-- Revoke default selects on the materialized view from authenticated users
revoke select on public.dashboard_metrics from authenticated;
revoke select on public.dashboard_metrics from anon;

-- Create a SECURITY INVOKER view that filters by auth.uid()
drop view if exists public.dashboard_metrics_secure cascade;
create view public.dashboard_metrics_secure as
  select * from public.dashboard_metrics
  where user_id = auth.uid();

grant select on public.dashboard_metrics_secure to authenticated;

-- Optional triggers: refresh on changes to source tables (debounced externally if needed)
-- Note: Frequent concurrent refreshes can lock; consider scheduling instead for production.
-- create trigger refresh_dashboard_metrics_on_tasks
-- after insert or update or delete on public.tasks
-- for each statement execute function public.refresh_dashboard_metrics();

-- create trigger refresh_dashboard_metrics_on_documents
-- after insert or update or delete on public.documents
-- for each statement execute function public.refresh_dashboard_metrics();

-- create trigger refresh_dashboard_metrics_on_expenses
-- after insert or update or delete on public.expenses
-- for each statement execute function public.refresh_dashboard_metrics();
