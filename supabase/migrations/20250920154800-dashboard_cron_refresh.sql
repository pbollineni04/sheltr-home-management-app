-- Schedule periodic refresh of dashboard_metrics using pg_cron
-- Chooses a 2-minute interval to keep staleness low while avoiding excessive locking

-- Ensure pg_cron extension is available (Supabase typically keeps extensions in the "extensions" schema)
create extension if not exists pg_cron with schema extensions;

-- Create or update a cron job named 'refresh_dashboard_metrics_every_2min'
-- If the job already exists, alter its schedule/command; otherwise, create it
DO $$
BEGIN
  -- Check that the pg_cron functions exist (some environments may restrict)
  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.proname = 'schedule' AND n.nspname = 'cron'
  ) THEN
    -- If a job with this name exists, alter it; else schedule a new one
    IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'refresh_dashboard_metrics_every_2min') THEN
      PERFORM cron.alter_job(
        (SELECT jobid FROM cron.job WHERE jobname = 'refresh_dashboard_metrics_every_2min'),
        schedule => '*/2 * * * *',
        command  => 'refresh materialized view concurrently public.dashboard_metrics;'
      );
    ELSE
      PERFORM cron.schedule(
        'refresh_dashboard_metrics_every_2min',
        '*/2 * * * *',
        'refresh materialized view concurrently public.dashboard_metrics;'
      );
    END IF;
  END IF;
END $$;
