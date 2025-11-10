# Deploy Plaid Functions to Supabase Dashboard

## ✅ All 3 Standalone Files Ready

I've created standalone versions of all functions with shared code inlined:

1. `supabase/functions/plaid-create-link-token/index-standalone.ts`
2. `supabase/functions/plaid-exchange-public-token/index-standalone.ts`
3. `supabase/functions/plaid-sync-transactions/index-standalone.ts`

---

## Deployment Steps

### Function 1: plaid-create-link-token

1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/functions
2. Click "Create a new function"
3. Name: `plaid-create-link-token`
4. **Copy the ENTIRE contents** of:
   ```
   supabase/functions/plaid-create-link-token/index-standalone.ts
   ```
5. Paste into the Supabase Dashboard editor
6. Click "Deploy function"
7. Wait for success message ✅

### Function 2: plaid-exchange-public-token

1. Click "Create a new function"
2. Name: `plaid-exchange-public-token`
3. **Copy the ENTIRE contents** of:
   ```
   supabase/functions/plaid-exchange-public-token/index-standalone.ts
   ```
4. Paste into the Supabase Dashboard editor
5. Click "Deploy function"
6. Wait for success message ✅

### Function 3: plaid-sync-transactions

1. Click "Create a new function"
2. Name: `plaid-sync-transactions`
3. **Copy the ENTIRE contents** of:
   ```
   supabase/functions/plaid-sync-transactions/index-standalone.ts
   ```
4. Paste into the Supabase Dashboard editor
5. Click "Deploy function"
6. Wait for success message ✅

---

## ✅ Verification

After deploying all 3 functions, verify in Dashboard:
- Go to Functions tab
- You should see 3 functions with "deployed" status
- Click on each function to see deployment logs

---

## 🧪 Test Your Deployment

### Test in your app:

1. Open your Sheltr app (http://localhost:8081)
2. Navigate to Expenses tab
3. Click "Connect Bank"
4. Plaid Link modal should open
5. Select "First Platypus Bank"
6. Login: `user_good` / `pass_good`
7. Select accounts → Continue
8. Should see "Bank Connected!" ✅
9. Click "Sync Now"
10. Transactions should import! 🎉

### Check Database:

Go to Supabase Dashboard → Table Editor:

```sql
-- Check items
SELECT * FROM plaid_items;

-- Check accounts
SELECT * FROM plaid_accounts;

-- Check raw transactions
SELECT * FROM plaid_transactions_raw LIMIT 10;

-- Check auto-created expenses
SELECT description, amount, category, auto_imported, needs_review
FROM expenses
WHERE auto_imported = true
ORDER BY created_at DESC
LIMIT 10;
```

---

## 🐛 Troubleshooting

### If deployment fails:

**Error: "Module not found"**
- Make sure you copied the **index-standalone.ts** file (not index.ts)
- The standalone versions have all dependencies inlined

**Error: "Missing credentials"**
- Verify environment variables are set in:
  Dashboard → Settings → Edge Functions → Secrets
- Required: `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV`

**Error: "Invalid authentication"**
- Check that you're logged into your app
- Verify JWT token is being sent in requests

### View Function Logs:

Dashboard → Functions → Select function → Logs tab

Look for:
- ✅ Successful executions
- ❌ Error messages
- 📊 Response times

---

## 🎉 Success!

Once all 3 functions are deployed and working, you have:
- ✅ Bank connection via Plaid Link
- ✅ Automatic transaction sync
- ✅ Smart category mapping
- ✅ Duplicate detection
- ✅ Auto-expense creation

Your Plaid integration is **LIVE**! 🚀
