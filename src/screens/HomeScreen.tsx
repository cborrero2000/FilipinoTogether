import React, { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/UI";
import { md } from "../theme";
import { Language, ScreenName } from "../navigation";
import { getPhrases } from "../data/index";
import { initProgress, initStreak, dueCount, getStreak } from "../progress/store";

export function HomeScreen({ go }: { go: (s: ScreenName, lang: Language) => void }) {
  const [due, setDue] = useState<Record<Language, number>>({ tagalog: 0, cebuano: 0 });
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    Promise.all([
      initProgress("tagalog"),
      initProgress("cebuano"),
      initStreak(),
    ]).then(() => {
      setDue({
        tagalog: dueCount("tagalog", getPhrases("tagalog").map(p => p.id)),
        cebuano: dueCount("cebuano", getPhrases("cebuano").map(p => p.id)),
      });
      setStreak(getStreak());
    });
  }, []);

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.flag}>🇵🇭</Text>
          <Text style={styles.title}>Filipino Together</Text>
          <Text style={styles.sub}>Choose a language to start learning</Text>
          {streak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {streak}-day streak</Text>
            </View>
          )}
        </View>

        {/* Language buttons */}
        <View style={styles.cards}>
          <LanguageCard
            lang="tagalog"
            emoji="🗼"
            title="Tagalog"
            subtitle="National language · Manila"
            color={md.colors.tagalogPrimary}
            due={due.tagalog}
            onPress={() => go("language-home", "tagalog")}
          />
          <LanguageCard
            lang="cebuano"
            emoji="🌊"
            title="Visayan"
            subtitle="Cebuano (Bisaya) · Cebu · Davao"
            color={md.colors.cebuanoPrimary}
            due={due.cebuano}
            onPress={() => go("language-home", "cebuano")}
          />
        </View>

        <Text style={styles.tip}>
          💡 Each language saves your progress separately. Cebuano uses a dedicated voice when your device has one.
        </Text>
      </View>
    </Screen>
  );
}

function LanguageCard({ emoji, title, subtitle, color, due, onPress }: {
  lang: Language; emoji: string; title: string; subtitle: string; color: string; due: number; onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Learn ${title}. ${subtitle}${due > 0 ? `. ${due} reviews due` : ""}`}
      android_ripple={md.ripple(md.colors.onPrimary)}
      style={({ pressed }) => [
        styles.langCard, { backgroundColor: color },
        pressed && Platform.OS !== "android" && { opacity: 0.9 },
      ]}
    >
      <Text style={styles.langEmoji}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.langTitle}>{title}</Text>
        <Text style={styles.langSub}>{subtitle}</Text>
      </View>
      {due > 0 && (
        <View style={styles.dueBadge} accessibilityLabel={`${due} due`}>
          <Text style={styles.dueBadgeText}>{due} due</Text>
        </View>
      )}
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: md.spacing.lg },
  header: { alignItems: "center", marginBottom: md.spacing.xxxl },
  flag: { fontSize: 64, marginBottom: md.spacing.md },
  title: { ...md.typescale.headlineLarge, fontSize: 36, color: md.colors.primary, fontWeight: "900", textAlign: "center" },
  sub: { ...md.typescale.bodyLarge, color: md.colors.onSurfaceVariant, marginTop: md.spacing.sm, textAlign: "center" },
  streakBadge: { marginTop: md.spacing.md, backgroundColor: md.colors.tertiaryContainer, borderRadius: md.shape.full, paddingVertical: md.spacing.xs, paddingHorizontal: md.spacing.lg },
  streakText: { ...md.typescale.labelLarge, color: md.colors.onTertiaryContainer, fontWeight: "800" },
  cards: { gap: md.spacing.lg },
  langCard: {
    borderRadius: md.shape.extraLarge,
    padding: md.spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    minHeight: md.touchTarget.minHeight * 2,
    overflow: "hidden",
    elevation: 4,
  },
  langEmoji: { fontSize: 48, marginRight: md.spacing.lg },
  langTitle: { ...md.typescale.headlineMedium, color: "#FFFFFF", fontWeight: "900" },
  langSub: { ...md.typescale.bodyMedium, color: "rgba(255,255,255,0.85)", marginTop: 2 },
  dueBadge: { backgroundColor: "rgba(255,255,255,0.25)", borderRadius: md.shape.full, paddingVertical: md.spacing.xs, paddingHorizontal: md.spacing.sm, marginLeft: md.spacing.sm },
  dueBadgeText: { ...md.typescale.labelSmall, color: "#FFFFFF", fontWeight: "800" },
  arrow: { fontSize: 36, color: "rgba(255,255,255,0.8)", marginLeft: md.spacing.sm },
  tip: { ...md.typescale.bodySmall, color: md.colors.onSurfaceVariant, textAlign: "center", marginTop: md.spacing.xxl, paddingHorizontal: md.spacing.md },
});
