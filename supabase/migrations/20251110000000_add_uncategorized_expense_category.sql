-- Add 'uncategorized' to expense_category enum
ALTER TYPE public.expense_category ADD VALUE IF NOT EXISTS 'uncategorized';
