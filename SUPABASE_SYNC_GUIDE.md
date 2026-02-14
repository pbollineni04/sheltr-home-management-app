# Supabase Schema Sync Guide

## Migration to Apply

**File**: `20260206000000_add_utilities_to_timeline_category.sql`

**Purpose**: Add 'utilities' category to timeline_category enum for Energy Tracker feature

**SQL**:
```sql
ALTER TYPE public.timeline_category ADD VALUE IF NOT EXISTS 'utilities';
```

---

## Method 1: Supabase Dashboard (Recommended for Lovable Projects)

### Step 1: Access SQL Editor

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project: `rgdmyuuebueufenfluyn`
3. Click **SQL Editor** in the left sidebar
4. Click **New query**

### Step 2: Execute Migration

Copy and paste this SQL:

```sql
-- Add 'utilities' to the timeline_category enum
-- This allows utility readings to create timeline events

ALTER TYPE public.timeline_category ADD VALUE IF NOT EXISTS 'utilities';
```

Click **Run** (or press Ctrl+Enter)

### Step 3: Verify Success

Expected output:
```
Success. No rows returned
```

Run this verification query:
```sql
SELECT enumlabel
FROM pg_enum
WHERE enumtypid = 'timeline_category'::regtype
ORDER BY enumsortorder;
```

You should see:
- renovation
- maintenance
- purchase
- inspection
- utilities ✅

---

## Method 2: Supabase CLI (Alternative)

If you prefer using the CLI:

### Prerequisites
- Docker Desktop running
- Supabase CLI installed: `npm install -g supabase`

### Commands

```bash
# Step 1: Start local Supabase
npx supabase start

# Step 2: Apply migration locally
npx supabase db reset

# Step 3: Test locally
# (Run your app against local Supabase)

# Step 4: Push to remote
npx supabase db push
```

**Note**: This method requires Docker Desktop to be running.

---

## Method 3: Git Push + Lovable Auto-Deploy

Since this is a Lovable project:

1. **Commit the migration** (already done ✅):
   ```bash
   git add supabase/migrations/20260206000000_add_utilities_to_timeline_category.sql
   git commit -m "Add utilities to timeline_category enum"
   git push
   ```

2. **Deploy via Lovable**:
   - Go to: https://lovable.dev/projects/f75caad6-681e-42ff-8716-c9ee09b13c78
   - Click **Share** → **Publish**
   - Lovable will automatically apply migrations during deployment

---

## Current Schema State

### Before Migration
```typescript
timeline_category: "renovation" | "maintenance" | "purchase" | "inspection"
```

### After Migration
```typescript
timeline_category: "renovation" | "maintenance" | "purchase" | "inspection" | "utilities"
```

---

## TypeScript Types Status

✅ **Already Updated**

The TypeScript types in `/src/integrations/supabase/types.ts` have been manually updated to include 'utilities':

```typescript
// Line 580-585
timeline_category:
  | "renovation"
  | "maintenance"
  | "purchase"
  | "inspection"
  | "utilities"  // ✅ Added

// Line 763-768
timeline_category: [
  "renovation",
  "maintenance",
  "purchase",
  "inspection",
  "utilities",  // ✅ Added
],
```

---

## Validation Checklist

After applying the migration:

### 1. Database Verification
```sql
-- Check enum values
SELECT enumlabel
FROM pg_enum
WHERE enumtypid = 'timeline_category'::regtype
ORDER BY enumsortorder;
```

### 2. Test Timeline Creation
```sql
-- Test inserting a utilities timeline event
INSERT INTO timeline_events (
  user_id,
  title,
  description,
  date,
  category,
  cost
) VALUES (
  auth.uid(),
  'Test Utilities Entry',
  'Test description',
  CURRENT_DATE,
  'utilities',  -- Should work now
  100.00
);
```

### 3. Application Testing

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Test Energy Tracker**:
   - Navigate to Energy Tracker tab
   - Click "Add Reading"
   - Enter a reading with cost ≥ $200
   - Submit

3. **Verify Timeline Entry**:
   - Navigate to Home Timeline
   - Look for auto-created "High [Utility] Usage" entry
   - Verify category is "utilities"

---

## Rollback Procedure

If you need to rollback:

⚠️ **Warning**: You cannot remove enum values in PostgreSQL without recreating the enum.

### Workaround (if needed):

```sql
-- 1. Create new enum without 'utilities'
CREATE TYPE timeline_category_new AS ENUM (
  'renovation',
  'maintenance',
  'purchase',
  'inspection'
);

-- 2. Update column to use new enum
ALTER TABLE timeline_events
  ALTER COLUMN category TYPE timeline_category_new
  USING category::text::timeline_category_new;

-- 3. Drop old enum
DROP TYPE timeline_category;

-- 4. Rename new enum
ALTER TYPE timeline_category_new RENAME TO timeline_category;
```

**Note**: This will fail if any timeline_events have category='utilities'. Delete those first.

---

## Dependencies Check

✅ **All dependencies ready**:

- Migration file created: `20260206000000_add_utilities_to_timeline_category.sql`
- TypeScript types updated: `/src/integrations/supabase/types.ts`
- Service layer ready: `/src/features/energy/services/energyService.ts`
- Timeline integration implemented: Uses 'utilities' category

---

## Common Issues & Solutions

### Issue 1: "enumlabel already exists"
**Solution**: Migration is already applied. No action needed.

### Issue 2: Permission denied
**Solution**: Ensure you're logged into Supabase Dashboard with correct account.

### Issue 3: Type error in TypeScript
**Solution**: Types are already updated. Restart TypeScript server:
```bash
# In VS Code
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Issue 4: Migration not found in dashboard
**Solution**: Migrations are only visible via CLI. Use SQL Editor for manual execution.

---

## Post-Migration Tasks

After migration is applied:

1. ✅ Test adding utility readings
2. ✅ Verify timeline entries created with cost ≥ $200
3. ✅ Check all utility types (electricity, gas, water, internet)
4. ✅ Verify charts display correctly
5. ✅ Test period filtering (month/quarter/year)
6. ✅ Validate carbon footprint calculations
7. ✅ Confirm RLS policies work correctly

---

## Quick Start

**Fastest path to get running**:

1. Open Supabase Dashboard SQL Editor
2. Paste: `ALTER TYPE public.timeline_category ADD VALUE IF NOT EXISTS 'utilities';`
3. Click Run
4. Start your app: `npm run dev`
5. Test Energy Tracker

**That's it!** ✅

---

## Support

If you encounter issues:

1. Check Supabase Dashboard → Logs for errors
2. Verify enum with verification query above
3. Check browser console for TypeScript errors
4. Review `ENERGY_TRACKER_IMPLEMENTATION.md` for testing guide

---

**Status**: Ready to sync ✅
**Risk Level**: Low (non-destructive enum addition)
**Estimated Time**: < 2 minutes
