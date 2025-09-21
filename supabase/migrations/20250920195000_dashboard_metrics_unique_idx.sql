-- Add unique index required for CONCURRENT refresh of the dashboard materialized view
-- Safe to run multiple times
create unique index if not exists dashboard_metrics_user_uidx
  on public.dashboard_metrics (user_id);
