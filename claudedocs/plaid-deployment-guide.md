# Plaid Integration - Deployment Guide

## Quick Deployment (No CLI) - Via Supabase Dashboard

Since you've already completed steps 1-3 (Plaid API keys, environment variables, database migration), here's how to deploy the Edge Functions:

### Option A: Deploy via Dashboard (Easiest)

Unfortunately, Supabase Dashboard doesn't support uploading multiple files with shared dependencies easily. **I recommend using the CLI method below.**

---

## Recommended: Install Supabase CLI & Deploy

### Step 1: Fix Command Line Tools Issue

The Homebrew installation failed because your Command Line Tools are outdated. Run:

```bash
sudo rm -rf /Library/Developer/CommandLineTools
sudo xcode-select --install
```

Then follow the prompts to install Xcode Command Line Tools.

### Step 2: Install Supabase CLI

After fixing Command Line Tools, run:

```bash
brew install supabase/tap/supabase
```

### Step 3: Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate.

### Step 4: Link Your Project

```bash
cd /Users/pranav/sheltr-home-management-app
supabase link --project-ref YOUR_PROJECT_REF
```

**Find your project ref**:
- Go to https://supabase.com/dashboard/project/YOUR_PROJECT/settings/general
- Copy the "Reference ID"

### Step 5: Deploy All Functions

```bash
supabase functions deploy plaid-create-link-token
supabase functions deploy plaid-exchange-public-token
supabase functions deploy plaid-sync-transactions
```

### Step 6: Verify Deployment

```bash
supabase functions list
```

You should see all 3 functions listed as "deployed".

---

## Alternative: Manual CLI Installation (If Homebrew Fails)

### macOS (using direct binary):

```bash
# Download binary
curl -L https://github.com/supabase/cli/releases/latest/download/supabase_darwin_amd64.tar.gz -o supabase.tar.gz

# Extract
tar -xzf supabase.tar.gz

# Move to /usr/local/bin
sudo mv supabase /usr/local/bin/

# Verify
supabase --version
```

---

## Testing Deployment

Once functions are deployed, test them:

### Test 1: Create Link Token

```bash
curl -X POST \
  https://YOUR_PROJECT_REF.supabase.co/functions/v1/plaid-create-link-token \
  -H "Authorization: Bearer YOUR_USER_JWT" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected response**:
```json
{"link_token":"link-sandbox-abc123..."}
```

### Test 2: Check Function Logs

In Supabase Dashboard:
1. Go to Functions → Select function → Logs tab
2. Look for any errors or successful executions

---

## Common Issues & Solutions

### Issue 1: "Module not found: npm:plaid"

**Solution**: The function will auto-install dependencies on first invocation. If it fails:
- Check function logs in Dashboard
- Ensure you're using Deno import syntax: `npm:plaid@24.0.0`

### Issue 2: "Missing required Plaid credentials"

**Solution**: Verify environment variables are set:
- Dashboard → Settings → Edge Functions → Secrets
- Ensure `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV` are set

### Issue 3: "Invalid authentication token"

**Solution**:
- Ensure you're passing a valid JWT in `Authorization: Bearer TOKEN` header
- Get a fresh token by logging into your app and inspecting network requests

### Issue 4: Command Line Tools Error

**Solution**:
```bash
# Remove old tools
sudo rm -rf /Library/Developer/CommandLineTools

# Install new tools
sudo xcode-select --install

# Or download directly from Apple:
# https://developer.apple.com/download/all/
```

---

## What Happens When You Deploy?

1. **Supabase packages your function code** into a Deno runtime
2. **Dependencies are installed** (npm:plaid, jsr:@supabase/supabase-js)
3. **Function is deployed** to Supabase's edge network
4. **URL is generated**: `https://YOUR_PROJECT.supabase.co/functions/v1/FUNCTION_NAME`
5. **Environment variables** are injected at runtime

---

## After Successful Deployment

### Enable Functions in Your App

Your frontend code (`ExpensePlaidControls.tsx`) already calls the functions via `plaidService.ts`:

```typescript
// This will automatically use deployed functions
await createLinkToken();
await exchangePublicToken(publicToken);
await syncTransactions(itemId);
```

### Test the Full Flow

1. Open your app in browser
2. Go to Expenses tab
3. Click "Connect Bank"
4. Plaid Link modal should open
5. Select "First Platypus Bank" (sandbox)
6. Login: `user_good` / `pass_good`
7. Click "Sync Now"
8. Transactions should import!

### Monitor Function Usage

Dashboard → Functions → Usage tab:
- See invocation count
- Monitor response times
- Check error rates

---

## Next Steps After Deployment

1. **Test with Sandbox**: Use Plaid's test banks to verify flow
2. **Check Imported Transactions**: Query `expenses` table to see auto-created records
3. **Build Review UI**: Complete the transaction review modal (optional but recommended)
4. **Go to Production**: Switch `PLAID_ENV` from `sandbox` to `production` when ready

---

## Need Help?

**Common Commands**:
```bash
# View function logs
supabase functions logs plaid-sync-transactions

# Redeploy a function
supabase functions deploy plaid-sync-transactions

# Delete a function
supabase functions delete plaid-sync-transactions

# Test locally (optional)
supabase functions serve plaid-create-link-token
```

**Supabase Docs**: https://supabase.com/docs/guides/functions/deploy
**Plaid Docs**: https://plaid.com/docs/quickstart/
