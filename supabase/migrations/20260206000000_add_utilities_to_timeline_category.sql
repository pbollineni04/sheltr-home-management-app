-- Add 'utilities' to the timeline_category enum
-- This allows utility readings to create timeline events

ALTER TYPE public.timeline_category ADD VALUE IF NOT EXISTS 'utilities';
