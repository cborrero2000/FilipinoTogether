import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { md, colors, font, radius, spacing, isLargeScreen } from "../theme";

/** Centered, max-width content column so the app looks good on wide screens. */
export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.screenOuter}>
      <View style={[styles.screenInner, isLargeScreen() && styles.screenInnerWide]}>
        {children}
      </View>
    </View>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function H1({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.h1, style]}>{children}</Text>;
}

export function H2({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.h2, style]}>{children}</Text>;
}

export function Body({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

type BtnVariant = "primary" | "neutral" | "accent" | "ghost";

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled,
  loading,
  icon,
  style,
  accessibilityLabel,
}: {
  title: string;
  onPress: () => void;
  variant?: BtnVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
}) {
  const bg =
    variant === "primary"
      ? md.colors.primary
      : variant === "accent"
      ? md.colors.tertiary
      : variant === "ghost"
      ? "transparent"
      : md.colors.surfaceVariant;
  const fg =
    variant === "primary" || variant === "accent"
      ? md.colors.onPrimary
      : md.colors.onSurface;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: disabled || loading }}
      android_ripple={md.ripple(fg)}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: disabled ? 0.38 : pressed && Platform.OS !== "android" ? 0.85 : 1 },
        variant === "ghost" && styles.btnGhost,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[styles.btnText, { color: fg }]}>
          {icon ? icon + "  " : ""}
          {title}
        </Text>
      )}
    </Pressable>
  );
}

/** Large answer-choice button with optional correct/wrong state coloring. */
export function ChoiceButton({
  label,
  onPress,
  state = "idle",
  disabled,
}: {
  label: string;
  onPress: () => void;
  state?: "idle" | "correct" | "wrong" | "dim";
  disabled?: boolean;
}) {
  const bg =
    state === "correct"
      ? md.colors.successContainer
      : state === "wrong"
      ? md.colors.errorContainer
      : md.colors.surface;
  const borderColor =
    state === "correct"
      ? md.colors.success
      : state === "wrong"
      ? md.colors.error
      : md.colors.outlineVariant;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, selected: state === "correct" }}
      android_ripple={md.ripple(md.colors.onSurface)}
      style={({ pressed }) => [
        styles.choice,
        {
          backgroundColor: bg,
          borderColor,
          opacity: state === "dim" ? 0.45 : pressed && Platform.OS !== "android" ? 0.88 : 1,
        },
      ]}
    >
      <Text style={styles.choiceText}>{label}</Text>
      {state === "correct" && (
        <Text style={styles.markCorrect} accessibilityLabel="Correct">
          ✓
        </Text>
      )}
      {state === "wrong" && (
        <Text style={styles.markWrong} accessibilityLabel="Wrong">
          ✕
        </Text>
      )}
    </Pressable>
  );
}

export function Pill({
  text,
  tone = "neutral",
}: {
  text: string;
  tone?: "neutral" | "good" | "bad";
}) {
  const bg =
    tone === "good"
      ? md.colors.successContainer
      : tone === "bad"
      ? md.colors.errorContainer
      : md.colors.surfaceVariant;
  const fg =
    tone === "good"
      ? md.colors.success
      : tone === "bad"
      ? md.colors.error
      : md.colors.onSurfaceVariant;
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillText, { color: fg }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenOuter: {
    flex: 1,
    backgroundColor: md.colors.background,
    alignItems: "center",
  },
  screenInner: {
    flex: 1,
    width: "100%",
    paddingHorizontal: md.spacing.lg,
  },
  screenInnerWide: { maxWidth: 760 },

  /* MD3 elevation level 1 — surface + 5% primary tint */
  card: {
    backgroundColor: md.elevation.level1,
    borderRadius: md.shape.large,
    padding: md.spacing.xl,
    borderWidth: 1,
    borderColor: md.colors.outlineVariant,
  },

  h1: {
    ...md.typescale.headlineLarge,
    color: md.colors.onBackground,
  },
  h2: {
    ...md.typescale.headlineSmall,
    color: md.colors.onBackground,
  },
  body: {
    ...md.typescale.bodyLarge,
    color: md.colors.onBackground,
  },

  btn: {
    minHeight: md.touchTarget.minHeight + 8,
    borderRadius: md.shape.full,
    paddingHorizontal: md.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    overflow: "hidden", // required for ripple to be clipped to shape
  },
  btnGhost: {
    borderWidth: 1,
    borderColor: md.colors.outline,
  },
  btnText: {
    ...md.typescale.headlineSmall,
    fontWeight: "800",
    width: "100%",
    textAlign: "center",
  },

  choice: {
    minHeight: 64,
    borderRadius: md.shape.medium,
    borderWidth: 1.5,
    paddingHorizontal: md.spacing.lg,
    paddingVertical: md.spacing.md,
    marginVertical: md.spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  choiceText: {
    ...md.typescale.bodyLarge,
    color: md.colors.onSurface,
    fontWeight: "600",
    flex: 1,
  },
  markCorrect: {
    fontSize: font.heading,
    color: md.colors.success,
    fontWeight: "900",
    marginLeft: md.spacing.sm,
  },
  markWrong: {
    fontSize: font.heading,
    color: md.colors.error,
    fontWeight: "900",
    marginLeft: md.spacing.sm,
  },

  pill: {
    paddingHorizontal: md.spacing.md,
    paddingVertical: md.spacing.xs,
    borderRadius: md.shape.full,
    alignSelf: "flex-start",
  },
  pillText: {
    ...md.typescale.labelMedium,
    fontWeight: "700",
  },
});
