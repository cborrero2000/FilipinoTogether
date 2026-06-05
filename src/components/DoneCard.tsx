import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, H2, Body, Button } from "./UI";
import { md } from "../theme";

export function DoneCard({
  score,
  total,
  onRestart,
  onBack,
}: {
  score: number;
  total: number;
  onRestart: () => void;
  onBack: () => void;
}) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const great = pct >= 80;
  const ok = pct >= 50;
  const emoji = great ? "🎉" : ok ? "👍" : "💪";
  const msg = great
    ? "Wonderful work!"
    : ok
    ? "Good job — keep going!"
    : "Nice try. Practice makes perfect!";

  return (
    <Card style={{ marginTop: md.spacing.lg, alignItems: "center" }}>
      <Text style={{ fontSize: 56 }} accessibilityLabel={emoji}>
        {emoji}
      </Text>
      <H2 style={{ marginTop: md.spacing.sm, textAlign: "center" }}>{msg}</H2>
      <Text
        style={styles.score}
        accessibilityLabel={`Score: ${score} out of ${total}`}
      >
        {score} / {total}
      </Text>
      <Body style={{ color: md.colors.onSurfaceVariant }}>{pct}% correct</Body>
      <Button
        title="Try again"
        icon="🔁"
        onPress={onRestart}
        accessibilityLabel="Try this activity again"
        style={{ marginTop: md.spacing.lg, alignSelf: "stretch" }}
      />
      <Button
        title="Back to menu"
        variant="neutral"
        onPress={onBack}
        accessibilityLabel="Back to main menu"
        style={{ marginTop: md.spacing.sm, alignSelf: "stretch" }}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  score: {
    fontSize: 48,
    fontWeight: "900",
    color: md.colors.primary,
    marginTop: md.spacing.md,
    lineHeight: 56,
  },
});
