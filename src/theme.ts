/**
 * Filipino Together — Material Design 3 tokens.
 * Seed: Philippine flag blue #0038A8, red #CE1126, yellow #FCD116.
 * Change these three values to re-theme the entire app.
 */
import { Dimensions, Platform } from "react-native";

export const mdColors = {
  // Primary — Philippine Blue
  primary:            "#0038A8",
  onPrimary:          "#FFFFFF",
  primaryContainer:   "#D8E2FF",
  onPrimaryContainer: "#001257",

  // Secondary — Philippine Red
  secondary:            "#CE1126",
  onSecondary:          "#FFFFFF",
  secondaryContainer:   "#FFDAD8",
  onSecondaryContainer: "#410004",

  // Tertiary — Philippine Yellow / Sun
  tertiary:            "#8E6C00",
  onTertiary:          "#FFFFFF",
  tertiaryContainer:   "#FDEEB0",
  onTertiaryContainer: "#2C1F00",

  // Error
  error:            "#BA1A1A",
  onError:          "#FFFFFF",
  errorContainer:   "#FFDAD6",
  onErrorContainer: "#410002",

  // Success
  success:            "#1F8A4C",
  onSuccess:          "#FFFFFF",
  successContainer:   "#B8F0CD",
  onSuccessContainer: "#00210F",

  // Surfaces
  background:       "#FAFBFF",
  onBackground:     "#1A1B21",
  surface:          "#FFFFFF",
  onSurface:        "#1A1B21",
  surfaceVariant:   "#E1E2EC",
  onSurfaceVariant: "#44464F",
  surfaceTint:      "#0038A8",

  // Outlines
  outline:        "#757780",
  outlineVariant: "#C5C6D0",

  // Inverse
  inverseSurface:   "#2F3036",
  inverseOnSurface: "#F1F0F7",
  inversePrimary:   "#ADC6FF",

  scrim: "rgba(0,0,0,0.32)",

  // Language brand colors
  tagalogPrimary:  "#0038A8",  // blue
  cebuanoPrimary:  "#CE1126",  // red
  sunYellow:       "#FCD116",  // Philippine sun
};

export const mdTypescale = {
  displayLarge:   { fontSize: scaled(57), lineHeight: scaled(64), fontWeight: "400" as const },
  displayMedium:  { fontSize: scaled(45), lineHeight: scaled(52), fontWeight: "400" as const },
  headlineLarge:  { fontSize: scaled(32), lineHeight: scaled(40), fontWeight: "700" as const },
  headlineMedium: { fontSize: scaled(28), lineHeight: scaled(36), fontWeight: "700" as const },
  headlineSmall:  { fontSize: scaled(24), lineHeight: scaled(32), fontWeight: "700" as const },
  titleLarge:     { fontSize: scaled(22), lineHeight: scaled(28), fontWeight: "700" as const },
  titleMedium:    { fontSize: scaled(16), lineHeight: scaled(24), fontWeight: "600" as const },
  titleSmall:     { fontSize: scaled(14), lineHeight: scaled(20), fontWeight: "600" as const },
  bodyLarge:      { fontSize: scaled(16), lineHeight: scaled(24), fontWeight: "400" as const },
  bodyMedium:     { fontSize: scaled(14), lineHeight: scaled(20), fontWeight: "400" as const },
  bodySmall:      { fontSize: scaled(12), lineHeight: scaled(16), fontWeight: "400" as const },
  labelLarge:     { fontSize: scaled(14), lineHeight: scaled(20), fontWeight: "600" as const },
  labelMedium:    { fontSize: scaled(12), lineHeight: scaled(16), fontWeight: "600" as const },
  labelSmall:     { fontSize: scaled(11), lineHeight: scaled(16), fontWeight: "600" as const },
};

export const mdShape = { none: 0, extraSmall: 4, small: 8, medium: 12, large: 16, extraLarge: 28, full: 9999 };
export const mdSpacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 };
export const mdElevation = {
  level0: mdColors.surface,
  level1: "#EEF1FF",
  level2: "#E5EBFF",
  level3: "#D9E2FF",
};
export const mdTouchTarget = { minHeight: 48, minWidth: 48 };

export function mdRipple(color: string = mdColors.onSurface) {
  return Platform.OS === "android" ? { color: color + "28", borderless: false } : undefined;
}

export const md = {
  colors: mdColors,
  typescale: mdTypescale,
  shape: mdShape,
  spacing: mdSpacing,
  elevation: mdElevation,
  touchTarget: mdTouchTarget,
  ripple: mdRipple,
};

export function isLargeScreen() { return Dimensions.get("window").width >= 700; }
function scaled(base: number) { return isLargeScreen() ? Math.round(base * 1.15) : base; }

// Legacy aliases
export const colors = {
  bg: mdColors.background, card: mdColors.surface,
  primary: mdColors.primary, accent: mdColors.tertiary,
  text: mdColors.onBackground, textSoft: mdColors.onSurfaceVariant,
  border: mdColors.outlineVariant, correct: mdColors.success,
  correctBg: mdColors.successContainer, wrong: mdColors.error,
  wrongBg: mdColors.errorContainer, neutralBtn: mdColors.surfaceVariant, white: "#FFFFFF",
};
export const radius = { sm: mdShape.small, md: mdShape.medium, lg: mdShape.large, pill: mdShape.full };
export const spacing = { xs: mdSpacing.xs, sm: mdSpacing.sm, md: mdSpacing.lg, lg: mdSpacing.xl, xl: mdSpacing.xxxl };
export const font = {
  get title()   { return mdTypescale.headlineLarge.fontSize; },
  get heading() { return mdTypescale.headlineSmall.fontSize; },
  get body()    { return mdTypescale.bodyLarge.fontSize; },
  get big()     { return mdTypescale.titleLarge.fontSize; },
  get label()   { return mdTypescale.labelLarge.fontSize; },
};
