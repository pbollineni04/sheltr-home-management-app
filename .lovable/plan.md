

# Landing Page Redesign

## Current Issues

1. **Hero is text-heavy** -- The stats callout box in the hero competes with the headline. Too much to read before the CTA.
2. **Empty screenshot placeholders** -- The Features section shows "Expense Tracking Screenshot" placeholders instead of real content. Looks unfinished and hurts credibility.
3. **Redundant visuals in How It Works** -- Each step has both a numbered circle AND an icon circle, making the cards feel cluttered.
4. **No scroll animations** -- Content appears all at once with no entrance effects, making the page feel flat (framer-motion is already installed but unused on the landing page).
5. **Header uses generic icon** -- The custom Sheltr SVG logo exists at `public/sheltr-logo.svg` but the header uses a generic Lucide `Home` icon instead.
6. **"See How It Works" button misleads** -- It navigates to `/auth?mode=signup` instead of scrolling to the How It Works section.
7. **No pricing section** -- The Final CTA mentions pricing ($4.99/mo early adopter) but there is no dedicated pricing comparison to help users decide.

## Proposed Changes

### 1. Simplify the Hero Section
- Remove the stats callout box from the hero (it duplicates the Problem Section below).
- Keep the headline, subtitle, CTAs, and trust signals.
- Make "See How It Works" scroll to the `#how-it-works` section instead of navigating to auth.
- Add subtle framer-motion fade-in animations.

### 2. Use the Custom Logo
- Replace the Lucide `Home` icon with the `sheltr-logo.svg` in both the header and footer.

### 3. Replace Feature Screenshot Placeholders
- Instead of empty grey boxes, show styled mock UI cards with icon + key metrics that visually represent each feature (e.g., a mini expense chart, a task checklist, a timeline entry, a document grid). Pure CSS/JSX -- no images needed.

### 4. Clean Up How It Works
- Remove the redundant step number circle. Use the icon circle with the step number as a small badge on top instead.
- Add a connecting line/arrow between steps on desktop.

### 5. Add Scroll Animations
- Wrap each section in framer-motion `motion.div` with `whileInView` fade-up animations for a polished feel.

### 6. Add a Simple Pricing Section
- Add a new `PricingSection` component between FAQ and Final CTA showing Free vs Pro tiers so users can compare before signing up.

### 7. Minor Polish
- Add smooth scroll behavior to section anchor links.
- Add `id` attributes to sections for in-page navigation.

## Files to Change

| File | Action | What |
|------|--------|------|
| `src/components/landing/LandingHeader.tsx` | Modify | Use SVG logo |
| `src/components/landing/LandingFooter.tsx` | Modify | Use SVG logo |
| `src/components/landing/HeroSection.tsx` | Modify | Remove stats box, fix "See How It Works" to scroll, add motion |
| `src/components/landing/FeaturesSection.tsx` | Modify | Replace screenshot placeholders with styled mock UI cards |
| `src/components/landing/HowItWorksSection.tsx` | Modify | Clean up redundant circles, add step badge |
| `src/components/landing/ProblemSection.tsx` | Modify | Add `whileInView` scroll animation |
| `src/components/landing/FAQSection.tsx` | Modify | Add `whileInView` scroll animation |
| `src/components/landing/FinalCTA.tsx` | Modify | Add `whileInView` scroll animation |
| `src/components/landing/PricingSection.tsx` | Create | Free vs Pro pricing cards |
| `src/pages/Landing.tsx` | Modify | Add PricingSection to page layout |

