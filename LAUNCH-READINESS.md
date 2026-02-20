# 🚀 Sheltr Launch Readiness Report

**Date**: February 19, 2026  
**Verdict**: **Ready for first users (soft launch).** A few security hardening items should be addressed before a wide public launch.

---

## Overall Status

| Area | Status | Notes |
|------|--------|-------|
| **Production Build** | ✅ Passes | Builds in ~8s, 433KB gzipped |
| **Database (RLS)** | ✅ All tables secured | 24 tables, all have RLS enabled |
| **Auth** | ⚠️ 2 hardening items | OTP expiry too long, no leaked password protection |
| **Feature Flags** | ✅ Clean | 8 features enabled, 3 disabled — intentional |
| **Edge Functions** | ✅ 9 deployed | Plaid, RentCast, Utility, Address, Property Value |
| **SEO / Meta Tags** | ✅ Good | OG tags, Twitter cards, proper title/description |

---

## ✅ What's Ready to Ship

Your enabled features are solid and production-ready:

| Feature | Tables | Data | Verdict |
|---------|--------|------|---------|
| Dashboard | ✓ materialized view | Real data | ✅ Ship it |
| Expense Tracker | `expenses` (320 rows) | Real data | ✅ Ship it |
| Task Manager | `tasks` (38 rows) | Real data | ✅ Ship it |
| Document Vault | `documents` | Ready | ✅ Ship it |
| Home Timeline | `timeline_events` (42 rows) | Real data | ✅ Ship it |
| Home Wealth | `properties`, `comparable_sales`, `property_value_history` | Real data | ✅ Ship it |
| Services | `services` (10), `service_providers` (12), `service_recurrences` (5) | Real data | ✅ Ship it |
| Energy Tracker | `utility_readings`, `utility_connections`, `utility_bills_raw` | Real data | ✅ Ship it |

---

## ⚠️ Security Items to Address Before Public Launch

### 1. Enable Leaked Password Protection (HIGH priority)
Supabase can check passwords against HaveIBeenPwned.org to prevent users from signing up with compromised passwords. This is currently **disabled**.

**Fix**: Go to [Supabase Dashboard → Auth → Settings](https://supabase.com/dashboard/project/rgdmyuuebueufenfluyn/auth/settings) → Enable "Leaked Password Protection"

### 2. Reduce OTP Expiry (MEDIUM priority)
Your email OTP (magic link, email confirmation) expiry is set to more than 1 hour, which is a security risk.

**Fix**: Go to [Supabase Dashboard → Auth → Settings](https://supabase.com/dashboard/project/rgdmyuuebueufenfluyn/auth/settings) → Set OTP expiry to **1 hour or less** (15-30 minutes recommended)

### 3. Fix Mutable Function Search Paths (LOW priority for launch)
Three database functions have mutable `search_path`, which could theoretically be exploited:
- `public.bump_updated_at`
- `public.handle_new_user`
- `public.create_timeline_event_for_completed_task`

**Fix**: I can apply a migration to set `search_path = ''` on these functions. This is a one-line fix per function.

---

## 🔧 Performance Optimizations (Post-Launch is Fine)

These are **not blocking launch** but will help as you scale:

### RLS Policy `initplan` Optimization
~70+ RLS policies use `auth.uid()` directly instead of `(select auth.uid())`. This means the auth function is re-evaluated for **every row** instead of once per query. At scale, this impacts performance.

**Impact**: Low for early users, significant at 1000+ users  
**Fix**: Single migration to update all policies — I can generate this for you when you're ready.

### Duplicate Policies on `timeline_events`
The `timeline_events` table has duplicate INSERT and SELECT policies (both "Users can create their own timeline events" and "Users can insert their own timeline events"). These should be consolidated.

### Missing Foreign Key Indexes
~10 foreign key columns don't have covering indexes. Not a problem at current scale but should be addressed for performance at growth.

---

## 📋 Pre-Launch Checklist

### Before First Users (Soft Launch)
- [ ] Enable Leaked Password Protection in Supabase dashboard
- [ ] Reduce OTP expiry to ≤ 1 hour
- [ ] Test the full sign-up flow (new user registers → confirms email → sees dashboard)
- [ ] Test the full sign-up flow on mobile (responsive check)
- [ ] Make sure your `.env.local` values are NOT committed to git (confirmed: `.gitignore` has `*.local` ✅)
- [ ] Verify your production deployment URL works (where are you deploying? Vercel? Netlify?)

### Before Public Launch
- [ ] Fix mutable function search paths (migration)
- [ ] OG image — currently using `/sheltr-logo.svg`, consider a proper social share image (1200×630px)
- [ ] Set up error tracking (e.g., Sentry) for production
- [ ] Set up basic analytics (e.g., PostHog, Plausible, or Google Analytics)
- [ ] Rate limiting on auth endpoints (Supabase has built-in rate limiting, verify it's configured)
- [ ] RLS `initplan` performance migration
- [ ] Consolidate duplicate `timeline_events` policies

### Nice-to-Have
- [ ] Custom 404 page
- [ ] Terms of Service / Privacy Policy page (important if collecting user data publicly)
- [ ] Cookie consent banner (if targeting EU users)
- [ ] Performance monitoring (Web Vitals)

---

## 🎯 Deployment Questions

Before I can help you deploy, I need to know:

1. **Where are you deploying the frontend?** (Vercel, Netlify, Cloudflare Pages, etc.)
2. **Do you have a custom domain?** (e.g., `sheltr.app` or similar)
3. **Is your Supabase project on the free plan or a paid plan?** The free plan has limits (50MB database, 1GB bandwidth, 50K auth MAU) that could be hit with real users.

---

## Bottom Line

**You're in great shape.** The architecture is solid, security fundamentals are in place (RLS everywhere, proper auth), and the codebase is clean. The two security items (leaked password protection + OTP expiry) are 5-minute fixes in the Supabase dashboard. After those, you can confidently give this to first users. 🎉
