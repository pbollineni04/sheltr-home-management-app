

# Fix Build Errors + Mobile Layout Issues

## 1. Fix Build Errors (TypeScript type mismatches)

The services hooks use local types (`Record<string, unknown>`, `unknown[]`) that are incompatible with the Supabase-generated `Json` type. The fix is to cast `metadata` and `attachments` fields to `any` before passing to Supabase insert/update calls.

**Files:**
- `src/features/services/hooks/useServiceProviders.ts` -- cast `metadata` as `Json` on lines 65 (update)
- `src/features/services/hooks/useServiceRecurrences.ts` -- cast `metadata` as `Json` on lines 42 (insert) and 66 (update)
- `src/features/services/hooks/useServices.ts` -- cast `attachments` as `Json` and `metadata` as `Json` on lines 73 (insert) and 103 (update)

Approach: Spread the data then override `metadata: insertData.metadata as any` and `attachments: insertData.attachments as any`.

## 2. Landing Page Mobile Fixes

Key issues at 390px viewport:
- **HeroDashboardMockup** has `min-h-[450px]` and `aspect-[4/3]` making it huge on mobile, pushing content way below the fold. The sidebar uses `hidden xs:flex` but `xs` isn't a default Tailwind breakpoint.
- **Hero grid** is `lg:grid-cols-2` which is fine, but the mockup is too tall on mobile.
- **FeaturesSection** mock UI cards may overflow on small screens.

Fixes:
- `HeroDashboardMockup.tsx`: Reduce `min-h-[450px]` to `min-h-[280px] sm:min-h-[450px]`, hide sidebar on mobile (`hidden sm:flex`), reduce padding on mobile.
- `HeroSection.tsx`: Reduce hero text sizes for mobile (`text-3xl sm:text-4xl lg:text-6xl`), reduce vertical padding.
- `HeroDashboardMockup.tsx`: Hide floating badges on mobile (already `hidden sm:flex` -- verify).

## 3. HomeWealth Mobile Fixes

Key issues:
- **Hero header** buttons stack poorly -- the `flex-row` with two buttons can overflow. Fix: make buttons `flex-col` on mobile.
- **Property Overview grid**: `grid-cols-2 md:grid-cols-3 lg:grid-cols-6` -- fine but items may be cramped at 390px. Reduce to `grid-cols-1 sm:grid-cols-2`.
- **Investment Scorecard**: `grid-cols-2 md:grid-cols-5` -- 5 items in 2 cols leaves orphan. Use `grid-cols-2 sm:grid-cols-3 md:grid-cols-5`.
- **Live Market Pulse**: `grid-cols-1 md:grid-cols-4` -- fine on mobile.
- **Comparable Sales table**: Already has `overflow-x-auto` -- fine.
- **Amortization table**: Already has `overflow-x-auto` -- fine.
- **ROI summary grid**: `grid-cols-1 md:grid-cols-4` can have tiny text. Use `grid-cols-2 md:grid-cols-4`.
- **Hero header text**: `text-3xl md:text-4xl` -- reduce to `text-2xl sm:text-3xl md:text-4xl`.

## Files to Change

| File | Changes |
|------|---------|
| `src/features/services/hooks/useServiceProviders.ts` | Cast metadata to `any` in update call |
| `src/features/services/hooks/useServiceRecurrences.ts` | Cast metadata to `any` in insert and update calls |
| `src/features/services/hooks/useServices.ts` | Cast attachments/metadata to `any` in insert and update calls |
| `src/components/landing/HeroDashboardMockup.tsx` | Reduce min-height on mobile, hide sidebar below `sm` |
| `src/components/landing/HeroSection.tsx` | Smaller heading sizes and padding on mobile |
| `src/features/homewealth/components/HomeWealth.tsx` | Fix grid breakpoints, button stacking, and text sizes for mobile |

