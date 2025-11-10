-- Drop unused dashboard materialized view infrastructure
-- The dashboard now uses live queries directly from tables for always-fresh data
-- This migration removes the materialized view, related views, functions, indexes, and cron job

-- Step 1: Drop the cron job if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.proname = 'unschedule' AND n.nspname = 'cron'
  ) THEN
    IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'refresh_dashboard_metrics_every_2min') THEN
      PERFORM cron.unschedule('refresh_dashboard_metrics_every_2min');
    END IF;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Ignore errors if cron extension not available
    NULL;
END $$;

-- Step 2: Drop the secure view (CASCADE will handle dependencies)
DROP VIEW IF EXISTS public.dashboard_metrics_secure CASCADE;

-- Step 3: Drop indexes on the materialized view
DROP INDEX IF EXISTS public.idx_dashboard_metrics_user_id;
DROP INDEX IF EXISTS public.dashboard_metrics_user_uidx;

-- Step 4: Drop the materialized view itself
DROP MATERIALIZED VIEW IF EXISTS public.dashboard_metrics CASCADE;

-- Step 5: Drop the refresh function
DROP FUNCTION IF EXISTS public.refresh_dashboard_metrics() CASCADE;

-- Verification: These objects should no longer exist
-- You can verify by running: SELECT * FROM pg_matviews WHERE schemaname = 'public' AND matviewname = 'dashboard_metrics';
-- Should return 0 rows

COMMENT ON SCHEMA public IS 'Dashboard now uses live queries for real-time accuracy. Materialized view removed.';
