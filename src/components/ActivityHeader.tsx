import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { md } from "../theme";

/**
 * MD3-style TopAppBar for every activity screen.
 * Back arrow on the left, title, optional progress bar + counter.
 */
export function ActivityHeader({
  title,
  onBack,
  step,
  total,
}: {
  title: string;
  onBack: () => void;
  step?: number;
  total?: number;
}) {
  const pct = step != null && total != null ? (step / total) * 100 : 0;

  return (
    <View accessibilityRole="header">
      {/* Top row: back button + step counter */}
      <View style={styles.row}>
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Back to menu"
          android_ripple={md.ripple(md.colors.onSurface)}
          style={({ pressed }) => [
            styles.backBtn,
            pressed && Platform.OS !== "android" && { opacity: 0.7 },
          ]}
        >
          <Text style={styles.backArrow}>◀</Text>
          <Text style={styles.backLabel}>Menu</Text>
        </Pressable>

        {step != null && total != null && (
          <Text style={styles.counter} accessibilityLabel={`Step ${step} of ${total}`}>
            {step} / {total}
          </Text>
        )}
      </View>

      {/* Screen title */}
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>

      {/* Progress bar — only shown when step/total are provided */}
      {step != null && total != null && (
        <View style={styles.barTrack} accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: Math.round(pct) }}>
          <View style={[styles.barFill, { width: `${pct}%` }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: md.spacing.sm,
    minHeight: md.touchTarget.minHeight,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: md.spacing.sm,
    paddingRight: md.spacing.md,
    paddingLeft: md.spacing.xs,
    borderRadius: md.shape.full,
    overflow: "hidden",
    minWidth: md.touchTarget.minWidth,
    minHeight: md.touchTarget.minHeight,
  },
  backArrow: {
    fontSize: 26,
    fontWeight: "800",
    color: md.colors.primary,
    marginRight: md.spacing.xs,
    lineHeight: 30,
  },
  backLabel: {
    ...md.typescale.labelLarge,
    color: md.colors.onBackground,
    fontWeight: "700",
  },
  counter: {
    ...md.typescale.labelLarge,
    color: md.colors.onSurfaceVariant,
    fontWeight: "700",
  },
  title: {
    ...md.typescale.headlineLarge,
    color: md.colors.onBackground,
    marginTop: md.spacing.sm,
  },
  barTrack: {
    height: 6,
    backgroundColor: md.colors.surfaceVariant,
    borderRadius: md.shape.full,
    marginTop: md.spacing.sm,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: md.colors.primary,
    borderRadius: md.shape.full,
  },
});
