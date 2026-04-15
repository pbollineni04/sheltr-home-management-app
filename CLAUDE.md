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

## Design Context

### Users
Homeowners managing a significant financial asset. They check in periodically (weekly or after events like a repair, bill, or purchase) to stay on top of maintenance, spending, and property value. They are not power users or analysts — they want clarity without effort.

### Brand Personality
**Confident, Clean, Capable.** Sheltr speaks like a knowledgeable advisor, not a chatty assistant. Tone is direct and reassuring. Avoids jargon but doesn't dumb things down. Every screen should feel like it was built by someone who respects your time.

### Emotional Goals
- **Calm** — "Nothing is falling through the cracks." Reduce the anxiety of homeownership.
- **Confidence** — "I'm on top of my home." Clear data, clear actions, no guesswork.
- **Delight** — "This is actually nice to use." Polish in the details, smooth transitions, considered typography.

### Aesthetic Direction
- **Tone**: Premium fintech — think Wealthfront/Betterment. Data-rich but breathable. Purposeful whitespace.
- **Theme**: Light and dark mode supported. Primary blue (#3B82F6), warm neutrals, feature-specific accent colors (green=expenses, blue=tasks, purple=timeline, orange=documents, yellow=energy).
- **Typography**: Inter (300–700). Semantic scale: `.text-display-xl`, `.text-heading-xl`, `.text-body-luxury`, `.text-caption-refined`.
- **Motion**: Framer Motion with tokens from `src/lib/motion.ts`. Entrance animations (fade-up, stagger), micro-interactions (scale on hover/tap). Never bounce easing. Keep durations 0.15–0.35s.
- **Layout**: Centered container (max 1200px) for readability. Cards with `rounded-xl`, subtle borders, soft shadows that elevate on hover.
- **Anti-references**: Generic SaaS admin panels (gray tables, no personality). Overly playful/gamified apps (confetti, badges, cartoons). Data-heavy analyst dashboards (overwhelming, tiny text). Skeuomorphic/dated design (glossy, heavy drop shadows).

### Design Principles
1. **Clarity over density** — Show the most important information prominently. Progressive disclosure for details. Never overwhelm.
2. **Purposeful polish** — Every animation, shadow, and color choice should earn its place. No decoration for decoration's sake.
3. **Consistent tokens** — Use design tokens from `index.css` and motion tokens from `motion.ts`. Never hard-code colors, shadows, or transitions inline.
4. **Calm confidence** — The UI should feel quietly competent. Muted backgrounds, clear hierarchy, generous spacing. Let data breathe.
5. **Action-oriented** — Every screen should make the next step obvious. Empty states guide, dashboards surface what needs attention, CTAs are clear and singular.
