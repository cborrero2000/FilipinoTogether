import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, ChoiceButton, H2, Pill } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { speak, stopSpeaking } from "../speech/speech";
import { getPhrases, getCompanionPhrase, LANG_LABEL, otherLanguage } from "../data/index";
import { Phrase } from "../data/types";
import { initProgress, dueIds, recordResult, learnedCount } from "../progress/store";
import { Language } from "../navigation";
import { md } from "../theme";
import { shuffle } from "../util";

const SESSION = 8;
type CardState = "listening" | "reveal" | "question" | "feedback";

export function ReviewScreen({ language, onBack }: { language: Language; onBack: () => void }) {
  const [ready, setReady] = useState(false);
  const [queue, setQueue] = useState<Phrase[]>([]);
  const [qi, setQi] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);

  useEffect(() => {
    initProgress(language).then(() => {
      const phrases = getPhrases(language);
      const ids = phrases.map(p => p.id);
      const due = dueIds(language, ids);
      setQueue(shuffle(due.map(id => phrases.find(p => p.id === id)!).filter(Boolean)).slice(0, SESSION));
      setReady(true);
    });
    return () => stopSpeaking();
  }, [language]);

  if (!ready) return null;
  const totalLearned = learnedCount(language);

  if (queue.length === 0) return (
    <Screen>
      <ActivityHeader title="Daily Review" onBack={onBack} />
      <Card style={{ marginTop: md.spacing.lg, alignItems: "center" }}>
        <Text style={{ fontSize: 56 }}>{totalLearned === 0 ? "📖" : "✅"}</Text>
        <H2 style={{ marginTop: md.spacing.sm }}>{totalLearned === 0 ? "Start with Learn first!" : "Natapos na! All caught up!"}</H2>
        <Body style={{ color: md.colors.onSurfaceVariant, marginTop: md.spacing.xs, textAlign: "center" }}>
          {totalLearned === 0 ? "Complete a Learn session and phrases will appear here for daily review." : `You have learned ${totalLearned} phrases. No reviews due right now — check back tomorrow!`}
        </Body>
        <Button title="Back to menu" onPress={onBack} style={{ marginTop: md.spacing.lg, alignSelf: "stretch" }} />
      </Card>
    </Screen>
  );

  if (sessionDone) {
    const pct = Math.round((correct / queue.length) * 100);
    return (
      <Screen>
        <ActivityHeader title="Daily Review" onBack={onBack} />
        <Card style={{ marginTop: md.spacing.lg, alignItems: "center" }}>
          <Text style={{ fontSize: 56 }}>☀️</Text>
          <H2 style={{ marginTop: md.spacing.sm }}>Review tapos na! (Review done!)</H2>
          <Text style={styles.score}>{correct}/{queue.length}</Text>
          <Body style={{ color: md.colors.onSurfaceVariant }}>{pct}% remembered</Body>
          <Button title="Back to menu" onPress={onBack} style={{ marginTop: md.spacing.lg, alignSelf: "stretch" }} />
        </Card>
      </Screen>
    );
  }

  const phrase = queue[qi];
  async function handleResult(ok: boolean) {
    await recordResult(language, phrase.id, ok);
    if (ok) setCorrect(c => c + 1);
    if (qi + 1 >= queue.length) setSessionDone(true);
    else setQi(q => q + 1);
  }

  return (
    <Screen>
      <ActivityHeader title="Daily Review" onBack={onBack} step={qi + 1} total={queue.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: md.spacing.xxxl }}>
        <ReviewCard phrase={phrase} allPhrases={getPhrases(language)} language={language} onResult={handleResult} />
      </ScrollView>
    </Screen>
  );
}

function ReviewCard({ phrase, allPhrases, language, onResult }: { phrase: Phrase; allPhrases: Phrase[]; language: Language; onResult: (ok: boolean) => void }) {
  const [cardState, setCardState] = useState<CardState>("listening");
  const [picked, setPicked] = useState<string | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [options] = useState(() => shuffle([phrase.english, ...shuffle(allPhrases.filter(p => p.id !== phrase.id)).slice(0, 2).map(p => p.english)]));
  const companion = getCompanionPhrase(language, phrase.id);

  useEffect(() => {
    const t = setTimeout(() => speak(phrase.filipino, { onDone: () => setCardState("reveal") }), 300);
    return () => { clearTimeout(t); stopSpeaking(); };
  }, [phrase.id]);

  const isCorrect = picked === phrase.english;

  return (
    <Card style={{ marginTop: md.spacing.md }}>
      <Pill text={phrase.topic} />
      {cardState === "listening" && <View style={styles.listeningBox}><Text style={styles.wave}>🔊</Text><Body style={{ color: md.colors.onSurfaceVariant, textAlign: "center", marginTop: md.spacing.sm }}>Pakikinig… (Listening…)</Body></View>}
      {(cardState === "reveal" || cardState === "question" || cardState === "feedback") && (
        <>
          <Text style={styles.phrase}>{phrase.filipino}</Text>
          {phrase.pronunciation && <Text style={styles.pronunciation}>[{phrase.pronunciation}]</Text>}
          <Button title="Play again" icon="🔊" variant="neutral" onPress={() => speak(phrase.filipino)} style={{ marginTop: md.spacing.sm }} />
          {companion && (
            <Button
              title={showCompare ? "Hide comparison" : `Compare to ${LANG_LABEL(otherLanguage(language))}`}
              icon="🔄"
              variant="ghost"
              onPress={() => setShowCompare(s => !s)}
              style={{ marginTop: md.spacing.sm }}
            />
          )}
          {companion && showCompare && (
            <View style={styles.compareBox}>
              <Text style={styles.compareLabel}>{LANG_LABEL(otherLanguage(language))}</Text>
              <Text style={styles.comparePhrase}>{companion.filipino}</Text>
              {companion.pronunciation && <Text style={styles.pronunciation}>[{companion.pronunciation}]</Text>}
            </View>
          )}
        </>
      )}
      {cardState === "reveal" && <Button title="I remember — what does it mean?" onPress={() => setCardState("question")} style={{ marginTop: md.spacing.md }} />}
      {(cardState === "question" || cardState === "feedback") && (
        <View style={{ marginTop: md.spacing.md }}>
          <Body style={{ color: md.colors.onSurfaceVariant }}>What does this mean in English?</Body>
          {options.map(opt => {
            let state: "idle"|"correct"|"wrong"|"dim" = "idle";
            if (picked) state = opt === phrase.english ? "correct" : opt === picked ? "wrong" : "dim";
            return <ChoiceButton key={opt} label={opt} state={state} disabled={!!picked} onPress={() => { if (!picked) { setPicked(opt); setCardState("feedback"); } }} />;
          })}
        </View>
      )}
      {cardState === "feedback" && (
        <View style={{ marginTop: md.spacing.md }}>
          <Body style={{ color: isCorrect ? md.colors.success : md.colors.error, fontWeight: "800" }}>
            {isCorrect ? "✓ Tama! (Correct!)" : "Hindi tama — review it and try again tomorrow."}
          </Body>
          <Button title="Next →" onPress={() => onResult(isCorrect)} style={{ marginTop: md.spacing.sm }} />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  listeningBox: { alignItems: "center", paddingVertical: md.spacing.lg },
  wave: { fontSize: 56 },
  phrase: { ...md.typescale.titleLarge, fontWeight: "800", color: md.colors.onSurface, marginTop: md.spacing.md },
  pronunciation: { ...md.typescale.bodySmall, color: md.colors.onSurfaceVariant, fontStyle: "italic", marginTop: 2 },
  score: { fontSize: 48, fontWeight: "900", color: md.colors.primary, marginTop: md.spacing.md },
  compareBox: { marginTop: md.spacing.sm, padding: md.spacing.md, borderRadius: md.shape.medium, backgroundColor: md.elevation.level2, borderWidth: 1, borderColor: md.colors.outlineVariant },
  compareLabel: { ...md.typescale.labelSmall, fontWeight: "800", color: md.colors.onSurfaceVariant, letterSpacing: 1 },
  comparePhrase: { ...md.typescale.titleMedium, fontWeight: "800", color: md.colors.onSurface, marginTop: 2 },
});
