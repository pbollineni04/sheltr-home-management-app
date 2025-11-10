-- Add Plaid integration fields to expenses table
-- This enables linking auto-imported Plaid transactions to expenses

-- Add new columns for Plaid integration
ALTER TABLE public.expenses
ADD COLUMN IF NOT EXISTS plaid_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS needs_review BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_imported BOOLEAN DEFAULT false;

-- Create indexes for performance
-- Index for looking up expenses by Plaid transaction ID
CREATE INDEX IF NOT EXISTS idx_expenses_plaid_tx
ON public.expenses(plaid_transaction_id)
WHERE plaid_transaction_id IS NOT NULL;

-- Index for fetching transactions needing user review
CREATE INDEX IF NOT EXISTS idx_expenses_needs_review
ON public.expenses(user_id, needs_review)
WHERE needs_review = true;

-- Index for filtering auto-imported vs manual expenses
CREATE INDEX IF NOT EXISTS idx_expenses_auto_imported
ON public.expenses(user_id, auto_imported)
WHERE auto_imported = true;

-- Add column documentation
COMMENT ON COLUMN public.expenses.plaid_transaction_id IS
  'Links to plaid_transactions_raw.transaction_id if expense was auto-imported from Plaid';

COMMENT ON COLUMN public.expenses.needs_review IS
  'True if auto-imported transaction needs user confirmation before being fully trusted';

COMMENT ON COLUMN public.expenses.auto_imported IS
  'True if expense was automatically imported from Plaid (vs manually entered by user)';

-- Create view for easy access to Plaid-linked expenses with transaction details
CREATE OR REPLACE VIEW public.expenses_with_plaid_details AS
SELECT
  e.*,
  ptr.merchant_name AS plaid_merchant,
  ptr.categories AS plaid_categories,
  ptr.pending AS plaid_pending,
  pa.name AS account_name,
  pa.mask AS account_mask,
  pi.institution_name
FROM public.expenses e
LEFT JOIN public.plaid_transactions_raw ptr
  ON e.plaid_transaction_id = ptr.transaction_id
LEFT JOIN public.plaid_accounts pa
  ON ptr.account_id = pa.account_id
LEFT JOIN public.plaid_items pi
  ON ptr.item_id = pi.item_id;

-- Grant access to the view (follows same RLS as expenses table)
GRANT SELECT ON public.expenses_with_plaid_details TO authenticated;

-- Add RLS policy for the view
ALTER VIEW public.expenses_with_plaid_details SET (security_invoker = true);
