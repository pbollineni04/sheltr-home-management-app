-- Add status column to tasks table for kanban board support
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'todo';

-- Backfill existing rows from completed boolean
UPDATE public.tasks SET status = 'completed' WHERE completed = true;
UPDATE public.tasks SET status = 'todo' WHERE completed = false;
