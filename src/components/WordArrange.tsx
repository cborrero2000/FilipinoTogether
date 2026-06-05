import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Body, Button } from "./UI";
import { md } from "../theme";
import { shuffle } from "../util";
// distractorWords injected via prop

function clean(w: string): string {
  return w.toLowerCase().replace(/[.,!?;:"'’“”]/g, "").trim();
}

type Tile = { key: string; word: string };

/**
 * "Write by selecting": the learner taps word tiles to build the sentence in
 * the right order. Reports whether they got it right.
 */
export function WordArrange({
  sentence,
  onResult,
  onNext,
  nextLabel = "Next",
  distractorWords = [],
}: {
  sentence: string;
  onResult?: (correct: boolean) => void;
  distractorWords?: string[];
  onNext?: () => void;
  nextLabel?: string;
}) {
  const targetWords = sentence.split(/\s+/).filter(Boolean);
  const targetNorm = targetWords.map(clean);

  // Build the tile pool once: the real words + a couple of distractors.
  const pool = useMemo<Tile[]>(() => {
    const real: Tile[] = targetWords.map((w, i) => ({ key: `r${i}`, word: w }));
    const extras = shuffle(distractorWords.filter((d) => !targetNorm.includes(clean(d)))).slice(0, 3);
    const dist: Tile[] = extras.map((w, i) => ({ key: `d${i}`, word: w }));
    return shuffle([...real, ...dist]);
  }, [sentence]);

  const [picked, setPicked] = useState<Tile[]>([]);
  const [checked, setChecked] = useState<null | boolean>(null);

  const usedKeys = new Set(picked.map((t) => t.key));

  function tapPool(t: Tile) {
    if (checked != null) return;
    setPicked((p) => [...p, t]);
  }
  function tapPicked(idx: number) {
    if (checked != null) return;
    setPicked((p) => p.filter((_, i) => i !== idx));
  }
  function reset() {
    setPicked([]);
    setChecked(null);
  }
  function check() {
    const got = picked.map((t) => clean(t.word)).join(" ");
    const want = targetNorm.join(" ");
    const correct = got === want;
    setChecked(correct);
    onResult?.(correct);
  }

  return (
    <View>
      <Body style={{ color: md.colors.onSurfaceVariant, marginBottom: md.spacing.sm }}>
        Tap the words in the right order:
      </Body>

      {/* Answer area */}
      <View style={[styles.answer, checked === true && styles.answerOk, checked === false && styles.answerBad]}
        accessibilityLabel="Your answer" accessibilityRole="text">
        {picked.length === 0 ? (
          <Text style={styles.placeholder}>Your sentence appears here…</Text>
        ) : (
          picked.map((t, idx) => (
            <Pressable key={t.key + idx} onPress={() => tapPicked(idx)}
              accessibilityRole="button" accessibilityLabel={`Remove word: ${t.word}`}
              android_ripple={md.ripple(md.colors.onPrimary)}
              style={styles.pickedTile}>
              <Text style={styles.pickedText}>{t.word}</Text>
            </Pressable>
          ))
        )}
      </View>

      {/* Word bank */}
      <View style={styles.bank}>
        {pool.map((t) => {
          const used = usedKeys.has(t.key);
          return (
            <Pressable
              key={t.key}
              onPress={() => tapPool(t)}
              disabled={used || checked != null}
              accessibilityRole="button"
              accessibilityLabel={used ? `${t.word}, already used` : `Add word: ${t.word}`}
              accessibilityState={{ disabled: used || checked != null }}
              android_ripple={md.ripple(md.colors.onSurface)}
              style={[styles.tile, used && styles.tileUsed]}
            >
              <Text style={[styles.tileText, used && styles.tileTextUsed]}>{t.word}</Text>
            </Pressable>
          );
        })}
      </View>

      {checked == null ? (
        <View style={{ flexDirection: "row", gap: md.spacing.sm, marginTop: md.spacing.md }}>
          <Button title="Clear" variant="neutral" onPress={reset} style={{ flex: 1 }} accessibilityLabel="Clear all word tiles" />
          <Button title="Check" onPress={check} disabled={picked.length === 0} style={{ flex: 2 }} accessibilityLabel="Check my answer" />
        </View>
      ) : checked ? (
        <View style={{ marginTop: md.spacing.md }}>
          <Body style={{ color: md.colors.success, fontWeight: "800" }}>✓ Perfect — that's correct!</Body>
          {onNext && <Button title={nextLabel} onPress={onNext} style={{ marginTop: md.spacing.sm }} />}
        </View>
      ) : (
        <View style={{ marginTop: md.spacing.md }}>
          <Body style={{ color: md.colors.error, fontWeight: "800" }}>Not quite. The correct sentence is:</Body>
          <Text style={styles.reveal}>{sentence}</Text>
          <View style={{ flexDirection: "row", gap: md.spacing.sm, marginTop: md.spacing.sm }}>
            <Button title="Try again" variant="neutral" onPress={reset} style={{ flex: 1 }} />
            {onNext && <Button title={nextLabel} onPress={onNext} style={{ flex: 1 }} />}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  answer: {
    minHeight: 72,
    borderRadius: md.shape.medium,
    borderWidth: 2,
    borderColor: md.colors.outlineVariant,
    backgroundColor: md.colors.surface,
    padding: md.spacing.sm,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  answerOk: { borderColor: md.colors.success, backgroundColor: md.colors.successContainer },
  answerBad: { borderColor: md.colors.error, backgroundColor: md.colors.errorContainer },
  placeholder: {
    color: md.colors.onSurfaceVariant,
    ...md.typescale.bodyMedium,
    fontStyle: "italic",
  },
  pickedTile: {
    backgroundColor: md.colors.primary,
    borderRadius: md.shape.small,
    paddingVertical: md.spacing.xs,
    paddingHorizontal: md.spacing.md,
    overflow: "hidden",
  },
  pickedText: { color: md.colors.onPrimary, ...md.typescale.bodyLarge, fontWeight: "700" },
  bank: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: md.spacing.md },
  tile: {
    backgroundColor: md.colors.surfaceVariant,
    borderRadius: md.shape.small,
    paddingVertical: md.spacing.sm,
    paddingHorizontal: md.spacing.md,
    borderWidth: 1,
    borderColor: md.colors.outlineVariant,
    minHeight: md.touchTarget.minHeight,
    justifyContent: "center",
    overflow: "hidden",
  },
  tileUsed: { opacity: 0.35 },
  tileText: { ...md.typescale.bodyLarge, fontWeight: "700", color: md.colors.onSurface },
  tileTextUsed: { color: md.colors.onSurfaceVariant },
  reveal: { ...md.typescale.titleLarge, fontWeight: "800", color: md.colors.onSurface, marginTop: md.spacing.xs },
});
