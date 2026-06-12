import React, { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, H1, Body } from "../components/UI";
import { md, isLargeScreen } from "../theme";
import { Language, ScreenName } from "../navigation";
import { initProgress, learnedCount, dueCount } from "../progress/store";
import { tagalogPhrases } from "../data/tagalog/phrases";
import { cebuanoPhrases } from "../data/cebuano/phrases";

type TileConfig = { key: ScreenName; icon: string; title: string; desc: string; accentColor?: string };

const STUDY: TileConfig[] = [
  { key: "learn",   icon: "🌱", title: "Learn",        desc: "Listen → Speak → Read → Build. The full lesson.", accentColor: "#1B5E20" },
  { key: "recall",  icon: "🧠", title: "Recall",       desc: "Reconstruct phrases from their meaning.", accentColor: "#6A1B9A" },
  { key: "review",  icon: "☀️", title: "Daily Review", desc: "Keep phrases fresh. Review what you've learned.", accentColor: "#E65100" },
];

const PRACTICE: TileConfig[] = [
  { key: "listening", icon: "👂", title: "Listen & Choose",   desc: "Hear a phrase, pick the one you heard." },
  { key: "speaking",  icon: "🎤", title: "Say It",            desc: "Read it out loud and check your speaking." },
  { key: "build",     icon: "🧩", title: "Build It",          desc: "Tap word tiles to assemble the sentence." },
  { key: "dialog",    icon: "💬", title: "Dialog & Question", desc: "Hear a short talk, then answer a question." },
  { key: "talkback",  icon: "🔁", title: "Talk Back",         desc: "Have a real conversation. Answer out loud." },
  { key: "scenes",    icon: "🎬", title: "Watch & Decide",    desc: "Watch a scene, choose the best reply." },
];

const LANG_CONFIG = {
  tagalog: { name: "Tagalog", flag: "🇵🇭", color: md.colors.tagalogPrimary, phrases: tagalogPhrases },
  cebuano: { name: "Visayan (Cebuano)", flag: "🌊", color: md.colors.cebuanoPrimary, phrases: cebuanoPhrases },
};

export function LanguageHomeScreen({ language, go, onBack }: {
  language: Language;
  go: (s: ScreenName, lang: Language) => void;
  onBack: () => void;
}) {
  const cfg = LANG_CONFIG[language];
  const [learned, setLearned] = useState(0);
  const [due, setDue] = useState(0);

  useEffect(() => {
    initProgress(language).then(() => {
      const ids = cfg.phrases.map(p => p.id);
      setLearned(learnedCount(language));
      setDue(dueCount(language, ids));
    });
  }, [language]);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: md.spacing.xxxl }}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Back to language selection"
            android_ripple={md.ripple()} style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}>
            <Text style={styles.backText}>← Languages</Text>
          </Pressable>
          <View style={[styles.langBadge, { backgroundColor: cfg.color }]}>
            <Text style={styles.langBadgeText}>{cfg.flag} {cfg.name}</Text>
          </View>
        </View>

        {/* Progress stats */}
        {learned > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statNum, { color: cfg.color }]}>{learned}</Text>
              <Text style={styles.statLabel}>learned</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statNum, due > 0 && { color: md.colors.secondary }]}>{due}</Text>
              <Text style={styles.statLabel}>due today</Text>
            </View>
            {due > 0 && (
              <Pressable onPress={() => go("review", language)} android_ripple={md.ripple(md.colors.onSecondary)}
                style={styles.reviewBtn} accessibilityLabel="Start daily review">
                <Text style={styles.reviewBtnText}>Review now ›</Text>
              </Pressable>
            )}
          </View>
        )}

        <Text style={styles.sectionLabel}>STUDY</Text>
        <View style={[styles.grid, isLargeScreen() && styles.gridWide]}>
          {STUDY.map(t => <Tile key={t.key} config={t} onPress={() => go(t.key, language)} primaryColor={cfg.color} />)}
        </View>

        <Text style={styles.sectionLabel}>PRACTICE</Text>
        <View style={[styles.grid, isLargeScreen() && styles.gridWide]}>
          {PRACTICE.map(t => <Tile key={t.key} config={t} onPress={() => go(t.key, language)} primaryColor={cfg.color} />)}
        </View>
      </ScrollView>
    </Screen>
  );
}

function Tile({ config: t, onPress, primaryColor }: { config: TileConfig; onPress: () => void; primaryColor: string }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${t.title}. ${t.desc}`}
      android_ripple={md.ripple(md.colors.onSurface)}
      style={({ pressed }) => [styles.tile, isLargeScreen() && styles.tileWide, pressed && Platform.OS !== "android" && { opacity: 0.88 }]}>
      {t.accentColor && <View style={[styles.accentBar, { backgroundColor: t.accentColor }]} />}
      <Text style={styles.tileIcon}>{t.icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.tileTitle}>{t.title}</Text>
        <Text style={styles.tileDesc}>{t.desc}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: md.spacing.md, paddingBottom: md.spacing.sm, flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: md.spacing.sm },
  backBtn: { paddingVertical: md.spacing.sm, paddingRight: md.spacing.md, paddingLeft: md.spacing.xs, borderRadius: md.shape.full, overflow: "hidden", minHeight: md.touchTarget.minHeight, justifyContent: "center" },
  backText: { ...md.typescale.labelLarge, color: md.colors.onBackground, fontWeight: "700" },
  langBadge: { paddingVertical: md.spacing.sm, paddingHorizontal: md.spacing.lg, borderRadius: md.shape.full, overflow: "hidden" },
  langBadgeText: { ...md.typescale.titleSmall, color: "#FFFFFF", fontWeight: "800" },
  statsRow: { flexDirection: "row", alignItems: "center", backgroundColor: md.elevation.level1, borderRadius: md.shape.large, borderWidth: 1, borderColor: md.colors.outlineVariant, padding: md.spacing.md, marginBottom: md.spacing.md },
  stat: { alignItems: "center", minWidth: 64 },
  statNum: { ...md.typescale.headlineSmall, fontWeight: "900" },
  statLabel: { ...md.typescale.labelSmall, color: md.colors.onSurfaceVariant, marginTop: 2 },
  statDivider: { width: 1, height: 36, backgroundColor: md.colors.outlineVariant, marginHorizontal: md.spacing.md },
  reviewBtn: { marginLeft: "auto", backgroundColor: md.colors.secondary, paddingVertical: md.spacing.sm, paddingHorizontal: md.spacing.md, borderRadius: md.shape.full, minHeight: md.touchTarget.minHeight, justifyContent: "center", overflow: "hidden" },
  reviewBtnText: { ...md.typescale.labelLarge, color: md.colors.onSecondary, fontWeight: "800" },
  sectionLabel: { ...md.typescale.labelSmall, fontWeight: "800", color: md.colors.onSurfaceVariant, letterSpacing: 1.4, marginTop: md.spacing.md, marginBottom: md.spacing.sm },
  grid: {}, gridWide: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  tile: { backgroundColor: md.elevation.level1, borderRadius: md.shape.large, borderWidth: 1, borderColor: md.colors.outlineVariant, padding: md.spacing.lg, paddingLeft: md.spacing.xl, flexDirection: "row", alignItems: "center", marginBottom: md.spacing.md, overflow: "hidden", minHeight: md.touchTarget.minHeight },
  tileWide: { width: "48.5%" },
  accentBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 5 },
  tileIcon: { fontSize: 36, marginRight: md.spacing.md },
  tileTitle: { ...md.typescale.titleLarge, color: md.colors.onSurface },
  tileDesc: { ...md.typescale.bodySmall, color: md.colors.onSurfaceVariant, marginTop: 2 },
  chevron: { fontSize: 28, color: md.colors.onSurfaceVariant, marginLeft: md.spacing.sm },
});
