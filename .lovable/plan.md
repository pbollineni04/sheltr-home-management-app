

# Fix Build - Restore Live Preview

## Problem
The preview shows HTTP ERROR 412, indicating the app build is failing. After investigation, I found two issues:

## Issue 1: Environment Variable Mismatch
The Supabase client (`src/integrations/supabase/client.ts`) reads `VITE_SUPABASE_ANON_KEY`, but the `.env` file defines `VITE_SUPABASE_PUBLISHABLE_KEY`. This causes `SUPABASE_PUBLISHABLE_KEY` to be `undefined`, which breaks the Supabase client initialization at runtime.

**Fix:** Update `client.ts` to use the correct env variable name:
```typescript
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
```

## Issue 2: Verify Build Completes
After fixing the env variable, confirm the build passes by checking for any remaining TypeScript errors. The `tsconfig.app.json` has already been cleaned up (the problematic strict settings were removed), so no further config changes should be needed.

## Changes
| File | Change |
|------|--------|
| `src/integrations/supabase/client.ts` | Fix env variable name from `VITE_SUPABASE_ANON_KEY` to `VITE_SUPABASE_PUBLISHABLE_KEY` |

## Expected Result
The app should build successfully and the landing page should load at `/`.

