import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, Pill, H2 } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { WordArrange } from "../components/WordArrange";
import { speak, stopSpeaking, isRecognitionAvailable, startRecognition, RecognitionHandle, matchScore } from "../speech/speech";
import { getPhrases, getDistractors } from "../data/index";
import { initProgress, dueIds, newIds, recordResult, learnedCount } from "../progress/store";
import { Language } from "../navigation";
import { md } from "../theme";
import { shuffle } from "../util";

const SESSION = 5;

export function RecallScreen({ language, onBack }: { language: Language; onBack: () => void }) {
  const [ready, setReady] = useState(false);
  const [queue, setQueue] = useState<string[]>([]);
  const [qi, setQi] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);

  useEffect(() => {
    initProgress(language).then(() => {
      const ids = getPhrases(language).map(p => p.id);
      setQueue(shuffle([...dueIds(language, ids), ...newIds(language, ids)]).slice(0, SESSION));
      setReady(true);
    });
    return () => stopSpeaking();
  }, [language]);

  if (!ready) return null;

  if (queue.length === 0) return (
    <Screen>
      <ActivityHeader title="Recall" onBack={onBack} />
      <Card style={{ marginTop: md.spacing.lg, alignItems: "center" }}>
        <Text style={{ fontSize: 56 }}>📚</Text>
        <H2 style={{ marginTop: md.spacing.sm }}>Start with Learn first!</H2>
        <Body style={{ color: md.colors.onSurfaceVariant, marginTop: md.spacing.xs, textAlign: "center" }}>Complete a Learn session to add phrases to your memory bank.</Body>
        <Button title="Back to menu" onPress={onBack} style={{ marginTop: md.spacing.lg, alignSelf: "stretch" }} />
      </Card>
    </Screen>
  );

  if (sessionDone) {
    const pct = Math.round((correct / queue.length) * 100);
    return (
      <Screen>
        <ActivityHeader title="Recall" onBack={onBack} />
        <Card style={{ marginTop: md.spacing.lg, alignItems: "center" }}>
          <Text style={{ fontSize: 56 }}>{pct >= 80 ? "🧠" : "💪"}</Text>
          <H2 style={{ marginTop: md.spacing.sm }}>{pct >= 80 ? "Napakahusay! Excellent memory!" : "Magpatuloy! Keep practising!"}</H2>
          <Text style={styles.score}>{correct}/{queue.length}</Text>
          <Body style={{ color: md.colors.onSurfaceVariant }}>{pct}% correct</Body>
          <Button title="Recall again" icon="🔁" onPress={() => { stopSpeaking(); initProgress(language).then(() => { const ids = getPhrases(language).map(p => p.id); setQueue(shuffle([...dueIds(language, ids), ...newIds(language, ids)]).slice(0, SESSION)); setQi(0); setCorrect(0); setSessionDone(false); }); }} style={{ marginTop: md.spacing.lg, alignSelf: "stretch" }} />
          <Button title="Back to menu" variant="neutral" onPress={onBack} style={{ marginTop: md.spacing.sm, alignSelf: "stretch" }} />
        </Card>
      </Screen>
    );
  }

  const phraseId = queue[qi];
  const phrase = getPhrases(language).find(p => p.id === phraseId);
  if (!phrase) { setQi(q => q + 1); return null; }

  async function handleResult(ok: boolean) {
    await recordResult(language, phraseId, ok);
    if (ok) setCorrect(c => c + 1);
    if (qi + 1 >= queue.length) setSessionDone(true);
    else setQi(q => q + 1);
  }

  return (
    <Screen>
      <ActivityHeader title="Recall" onBack={onBack} step={qi + 1} total={queue.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: md.spacing.xxxl }}>
        <Card style={{ marginTop: md.spacing.md }}>
          <Pill text={phrase.topic} />
          <H2 style={{ marginTop: md.spacing.sm }}>What is the Filipino phrase?</H2>
          <Body style={{ color: md.colors.onSurfaceVariant, marginTop: md.spacing.xs, fontSize: md.typescale.bodyLarge.fontSize + 2 }}>{phrase.english}</Body>
          <Button title="Hear a hint 🔊" variant="neutral" onPress={() => speak(phrase.filipino)} style={{ marginTop: md.spacing.md }} />
          <View style={{ marginTop: md.spacing.md }}>
            <WordArrange sentence={phrase.filipino} distractorWords={getDistractors(language)} onResult={ok => {}} onNext={() => handleResult(false)} nextLabel="Next phrase →" />
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  score: { fontSize: 48, fontWeight: "900", color: md.colors.primary, marginTop: md.spacing.md },
});
