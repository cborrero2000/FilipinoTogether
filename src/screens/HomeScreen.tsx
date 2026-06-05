import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/UI";
import { md } from "../theme";
import { Language, ScreenName } from "../navigation";

export function HomeScreen({ go }: { go: (s: ScreenName, lang: Language) => void }) {
  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.flag}>🇵🇭</Text>
          <Text style={styles.title}>Filipino Together</Text>
          <Text style={styles.sub}>Choose a language to start learning</Text>
        </View>

        {/* Language buttons */}
        <View style={styles.cards}>
          <LanguageCard
            lang="tagalog"
            emoji="🗼"
            title="Tagalog"
            subtitle="National language · Manila"
            color={md.colors.tagalogPrimary}
            onPress={() => go("language-home", "tagalog")}
          />
          <LanguageCard
            lang="cebuano"
            emoji="🌊"
            title="Visayan"
            subtitle="Cebuano (Bisaya) · Cebu · Davao"
            color={md.colors.cebuanoPrimary}
            onPress={() => go("language-home", "cebuano")}
          />
        </View>

        <Text style={styles.tip}>
          💡 Both languages use the same Filipino voice. Each language saves your progress separately.
        </Text>
      </View>
    </Screen>
  );
}

function LanguageCard({ emoji, title, subtitle, color, onPress }: {
  lang: Language; emoji: string; title: string; subtitle: string; color: string; onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Learn ${title}. ${subtitle}`}
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
  arrow: { fontSize: 36, color: "rgba(255,255,255,0.8)", marginLeft: md.spacing.sm },
  tip: { ...md.typescale.bodySmall, color: md.colors.onSurfaceVariant, textAlign: "center", marginTop: md.spacing.xxl, paddingHorizontal: md.spacing.md },
});
