# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (port 8080, runs env check first)
npm run build        # Production build (runs env check first)
npm run lint         # ESLint
npx playwright test  # Run Playwright tests
```

Edge function deployment (requires Supabase access token):
```bash
SUPABASE_ACCESS_TOKEN=<token> npx supabase functions deploy <function-name> --project-ref rgdmyuuebueufenfluyn
```

## Architecture

React 18 + TypeScript SPA built with Vite (SWC). Uses Supabase for auth, database, and edge functions. Styling via Tailwind CSS + shadcn/ui (Radix primitives). Originally scaffolded with Lovable.dev.

### Routing

Single-page app with tab-based navigation. `App.tsx` has three routes: `/` (landing), `/auth`, `/dashboard` (protected). The dashboard (`pages/Index.tsx`) renders a tabbed interface where each tab maps to a feature module.

### Feature Module Pattern

Each feature is self-contained under `src/features/<name>/`:
```
components/   - Feature UI components
hooks/        - Feature hooks (e.g., useUtilityReadings)
services/     - Data access layer (static class methods, always verify auth)
types/        - TypeScript types
utils/        - Helpers
```

Features export via barrel files (`index.ts`). Active features: dashboard, energy, expenses, timeline, tasks, documents. Disabled: alerts, helper, move (controlled by `src/lib/featureFlags.ts`).

### Service Layer

Services use static class methods that always call `supabase.auth.getUser()` before queries. They throw errors for callers to handle. Example: `EnergyService.getReadingsByPeriod(period)`.

### Integration Pattern (Plaid & UtilityAPI)

Both follow the same architecture:
1. **Frontend service** (`src/integrations/<name>/`) calls Supabase edge functions
2. **Edge functions** (`supabase/functions/<name>-*/`) use shared clients
3. **Shared clients** (`supabase/functions/_shared/`) handle API authentication and helpers
4. Access tokens are stored server-side only

Flow: Create link/form → User authorizes → Exchange token → Store connection → Sync data

Edge functions must: handle CORS preflight (`OPTIONS`), verify JWT via `verifyUserToken()` from `_shared/supabase-admin.ts`, and return responses with `corsHeaders`.

### Database

Supabase (PostgreSQL), project `rgdmyuuebueufenfluyn`. Migrations in `supabase/migrations/`. All tables use RLS policies scoped to `auth.uid() = user_id`.

Key table groups:
- **Plaid**: `plaid_items`, `plaid_accounts`, `plaid_transactions_raw`, `plaid_sync_state`
- **Utility**: `utility_connections`, `utility_accounts`, `utility_bills_raw`, `utility_sync_state`, `utility_readings`
- **Core**: `expenses`, `timeline_events`, `tasks`, `documents`

### Auth

`AuthContext.tsx` wraps the app with Supabase auth (email/password). `ProtectedRoute` and `PublicRoute` handle redirects.

### Path Aliases

- `@/*` → `src/`
- `@features/*` → `src/features/`
- `@shared/*` → `src/components/`
- `@hooks/*` → `src/hooks/`

## Environment

Required in `.env.local`:
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Edge function secrets (set in Supabase Dashboard):
```
PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV
UTILITYAPI_CLIENT_SECRET, UTILITYAPI_ENVIRONMENT
```
