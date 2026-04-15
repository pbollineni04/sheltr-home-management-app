-- Add onboarding columns to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS home_address TEXT,
  ADD COLUMN IF NOT EXISTS home_value DECIMAL(12,2);
