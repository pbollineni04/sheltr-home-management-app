import { useState, useEffect, useCallback } from "react";

/**
 * Resolves a CSS custom property (HSL format) to an rgb/hex-compatible string.
 * Our CSS vars are stored as "H S% L%" without the hsl() wrapper.
 */
function resolveHSL(varName: string): string {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return raw ? `hsl(${raw})` : "";
}

export interface ChartTheme {
  grid: string;
  axis: string;
  tooltipBg: string;
  tooltipBorder: string;
}

/**
 * Returns resolved chart colors that update when the theme toggles.
 * Uses a MutationObserver on <html> class changes to detect dark/light switch.
 */
export function useChartTheme(): ChartTheme {
  const resolve = useCallback(
    (): ChartTheme => ({
      grid: resolveHSL("--border"),
      axis: resolveHSL("--muted-foreground"),
      tooltipBg: resolveHSL("--card"),
      tooltipBorder: resolveHSL("--border"),
    }),
    [],
  );

  const [theme, setTheme] = useState<ChartTheme>(resolve);

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(resolve()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [resolve]);

  return theme;
}

/** Utility-type accent colors — static, work in both themes */
export const UTILITY_COLORS = {
  electricity: "hsl(48, 96%, 53%)",  // yellow-500
  gas: "hsl(25, 95%, 53%)",          // orange-500
  water: "hsl(217, 91%, 60%)",       // blue-500
  internet: "hsl(271, 91%, 65%)",    // purple-500
} as const;

/** Status colors resolved from CSS variables */
export const STATUS_COLORS = {
  success: "hsl(142, 71%, 45%)",     // --success
  warning: "hsl(38, 92%, 50%)",      // --warning
  error: "hsl(0, 72%, 51%)",         // --error
} as const;
