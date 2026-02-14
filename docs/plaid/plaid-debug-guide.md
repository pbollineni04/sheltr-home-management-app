# Plaid Sync - Debugging "No Transactions Found"

## Issue: Sync completes but no transactions import

This usually means:
1. Plaid API returned 0 transactions
2. All transactions were pending (skipped)
3. Initial sync cursor issue
4. Sandbox account has no historical data

---

## Debug Steps

### 1. Check Function Logs

Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/functions

Click **`plaid-sync-transactions`** → **Logs** tab

Look for recent invocation and check:
- Did it call Plaid API successfully?
- How many transactions did Plaid return? (`added.length`)
- Were they all pending?
- Any errors?

### 2. Check Plaid Response

The function logs should show something like:
```
Sync response: { added: [], modified: [], removed: [], next_cursor: "..." }
```

If `added` is empty, Plaid has no transactions for this account.

### 3. Try Different Sync Mode

Plaid's `/transactions/sync` endpoint works incrementally. For **first-time sync**, you might need to use **historical fetch** instead.

---

## Solution: Use Initial Transaction Pull

The issue is that `transactionsSync` is designed for **incremental updates**, not initial historical fetch.

For **first sync**, we should use `/transactions/get` with date range.

Let me create a modified sync function that handles first-time sync differently.

---

## Quick Fix: Trigger Historical Fetch

Option 1: **Wait 24 hours** - Plaid sandbox sometimes needs time to populate transactions

Option 2: **Use a different sandbox institution**:
- Try "Tattersall Federal Credit Union" instead
- Username: `user_good`, Password: `pass_good`

Option 3: **Force historical fetch** (requires code update)

---

## Alternative: Test with Different Account

1. Disconnect current bank:
   - Go to Supabase → Table Editor
   - Delete from `plaid_items` (will cascade delete accounts/transactions)

2. Reconnect with different test bank:
   - Use "Tattersall Federal Credit Union"
   - Or "Platypus Federal Credit Union"

3. Try sync again

---

## Known Plaid Sandbox Behavior

Plaid sandbox accounts have **limited transaction history**:
- Some test accounts have 0 transactions
- Some have only pending transactions (which we skip)
- Some have 30-90 days of history

The sandbox is meant for testing the **flow**, not realistic data.
