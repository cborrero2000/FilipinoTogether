import React, { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Screen, Card, Body, Button } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import { WordArrange } from "../components/WordArrange";
import { speak, stopSpeaking } from "../speech/speech";
import { getSpeaking, getDistractors } from "../data/index";
import { Language } from "../navigation";
import { md } from "../theme";
import { shuffle } from "../util";

const SESSION = 8;

export function BuildScreen({ language, onBack }: { language: Language; onBack: () => void }) {
  const [session] = useState(() => shuffle(getSpeaking(language)).slice(0, SESSION));
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);

  const item = session[i];

  function next() {
    if (lastCorrect) setScore(s => s + 1);
    if (i + 1 >= session.length) setDone(true);
    else { setI(i + 1); setLastCorrect(false); }
  }

  function restart() { stopSpeaking(); setI(0); setScore(0); setDone(false); setLastCorrect(false); }

  if (done) return <Screen><ActivityHeader title="Build It" onBack={onBack} /><DoneCard score={score} total={session.length} onRestart={restart} onBack={onBack} /></Screen>;

  return (
    <Screen>
      <ActivityHeader title="Build It" onBack={onBack} step={i + 1} total={session.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: md.spacing.xxxl }}>
        <Card style={{ marginTop: md.spacing.md }}>
          <Body style={{ color: md.colors.onSurfaceVariant }}>Build the sentence that means:</Body>
          <Text style={styles.translation}>{item.translation}</Text>
          {item.pronunciation && <Text style={styles.pronunciation}>[{item.pronunciation}]</Text>}
          <Button title="Hear it" icon="🔊" variant="neutral" onPress={() => speak(item.text)} accessibilityLabel="Hear the phrase" style={{ marginTop: md.spacing.md }} />
        </Card>
        <Card style={{ marginTop: md.spacing.md }}>
          <WordArrange
            key={i}
            sentence={item.text}
            distractorWords={getDistractors(language)}
            onResult={correct => setLastCorrect(correct)}
            onNext={next}
            nextLabel={i + 1 >= session.length ? "Finish" : "Next →"}
          />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  translation: { ...md.typescale.titleLarge, fontWeight: "800", color: md.colors.onSurface, marginTop: md.spacing.sm },
  pronunciation: { ...md.typescale.bodySmall, color: md.colors.onSurfaceVariant, fontStyle: "italic", marginTop: 2 },
});
