/**
 * Sheltr Motion Design System
 * ──────────────────────────────────────────────────────────────
 * Extracted from reference: https://github.com/pbollineni04/home-hub-central
 *
 * Easing / Timing / Stagger values are the exact values from the reference repo.
 * Every page, card, list, and interactive element should use these tokens so the
 * entire application feels cohesive.
 *
 * Performance notes:
 *  - All transforms use will-change-optimized properties (opacity, transform)
 *  - No layout-triggering properties (width, height, top, left) in animations
 *  - Stagger delays are kept short (0.04–0.08s) to avoid jank
 */

import type { Variants, Transition } from "framer-motion";

/* ────────────────────────────
   Base Transition Curves
   ──────────────────────────── */

/** Default spring-like ease used throughout the reference repo */
export const easeDefault: Transition = {
    type: "tween",
    ease: [0.25, 0.46, 0.45, 0.94],   // CSS ease-out equivalent used implicitly by framer
    duration: 0.35,
};

/** Snappy ease for micro-interactions (buttons, toggles) */
export const easeSnap: Transition = {
    type: "tween",
    ease: [0.4, 0, 0.2, 1],
    duration: 0.15,
};

/* ────────────────────────────
   Page-Level Animations
   ──────────────────────────── */

/** Page header: slide down from above  (Index, all pages) */
export const pageHeader = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
};

/** Generic page enter for full page wrappers */
export const pageEnter = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
};

/* ────────────────────────────
   Container / Stagger Variants
   ──────────────────────────── */

/** Parent container: stagger children on mount (Index stats grid, quick links) */
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.07 },
    },
};

/** Parent container: fast stagger for lists (Expenses, Tasks, Documents) */
export const staggerContainerFast: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.04 },
    },
};

/** Parent container: medium stagger for cards (Utilities, Timeline) */
export const staggerContainerMedium: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

/* ────────────────────────────
   Child Item Variants
   ──────────────────────────── */

/** Standard fade + slide up – used for stat cards, grid items (y: 16px) */
export const fadeUpItem: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
};

/** Compact fade + slide up – used for list rows (y: 10px) */
export const fadeUpItemCompact: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
};

/** Slide-in from left – used for timeline entries (x: -20px) */
export const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
};

/* ────────────────────────────
   Individual Item Animations
   (for non-variant usage with `initial` / `animate`)
   ──────────────────────────── */

/**
 * Staggered list item — pass index `i` to get the correct delay.
 * Used in Tasks (0.04), Expenses (0.04), Documents (0.04).
 */
export const listItemAnim = (i: number, baseDelay = 0.04) => ({
    initial: { opacity: 0, y: 10 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { delay: i * baseDelay } as Transition,
});

/**
 * Staggered card item — pass index `i` to get the correct delay.
 * Used in Utilities (0.08), Timeline (0.08).
 */
export const cardItemAnim = (i: number) => ({
    initial: { opacity: 0, y: 16 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { delay: i * 0.08 } as Transition,
});

/**
 * Timeline entry — slides in from left with stagger.
 */
export const timelineItemAnim = (i: number) => ({
    initial: { opacity: 0, x: -20 } as const,
    animate: { opacity: 1, x: 0 } as const,
    transition: { delay: i * 0.08 } as Transition,
});

/* ────────────────────────────
   Hover / Interactive Tokens
   ──────────────────────────── */

/** Card hover: raise shadow + subtle border highlight */
export const hoverCard = {
    whileHover: { scale: 1.01 },
    transition: easeSnap,
};

/** Button press feedback */
export const tapShrink = {
    whileTap: { scale: 0.97 },
};
