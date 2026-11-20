/**
 * NutriBite AI Mobile - Color Palette & Theme Tokens
 * Direct alignment with shared/design-system/tokens.json
 */

export const colors = {
  // Brand Foundation
  primary: "#234B35",        // Deep Forest Green
  primaryLight: "#2e6044",
  primaryDark: "#183525",

  secondary: "#9CAF88",      // Sage Green
  secondaryLight: "#eef2ec",
  secondaryDark: "#7c8e6a",

  cream: "#FAF8F2",          // Warm Culinary Cream (Background)
  creamCard: "#FFFFFF",      // Clean Card White
  creamBorder: "#E9E5DB",

  accent: "#F2A65A",         // Warm Apricot Accent
  accentOrange: "#E28B36",

  charcoal: "#252A25",       // Deep Slate Typography
  charcoalMuted: "#667066",
  charcoalSubtle: "#9CA39C",

  // Nutritional Macro Badges
  macros: {
    calories: "#E28B36",
    protein: "#234B35",
    carbs: "#D97706",
    fat: "#9CAF88",
    fiber: "#059669",
    water: "#0284C7"
  },

  // Subscription Tier Badges
  tiers: {
    free: "#64748B",
    plus: "#4338CA",
    plusBg: "#EEF2FF",
    pro: "#92400E",
    proBg: "#FEF3C7"
  },

  // UI Semantics
  success: "#16A34A",
  warning: "#F59E0B",
  error: "#DC2626",
  card: "#FFFFFF",
  border: "#E9E5DB"
} as const;

export type ColorTheme = typeof colors;
