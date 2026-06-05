import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, ChoiceButton, H2 } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import { speak, stopSpeaking } from "../speech/speech";
import { getListening } from "../data/index";
import { Language } from "../navigation";
import { md } from "../theme";
import { shuffle } from "../util";

const SESSION = 8;

export function ListeningScreen({ language, onBack }: { language: Language; onBack: () => void }) {
  const [session] = useState(() => shuffle(getListening(language)).slice(0, SESSION));
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const item = session[i];
  const options = useMemo(() => shuffle(item.options), [i]);
  const answerIndex = options.indexOf(item.say);

  useEffect(() => {
    const t = setTimeout(() => speak(item.say), 350);
    return () => { clearTimeout(t); stopSpeaking(); };
  }, [i]);

  function choose(idx: number) {
    if (picked != null) return;
    setPicked(idx);
    if (idx === answerIndex) setScore(s => s + 1);
  }

  function next() {
    if (i + 1 >= session.length) setDone(true);
    else { setI(i + 1); setPicked(null); }
  }

  function restart() { stopSpeaking(); setI(0); setPicked(null); setScore(0); setDone(false); }

  if (done) return <Screen><ActivityHeader title="Listen & Choose" onBack={onBack} /><DoneCard score={score} total={session.length} onRestart={restart} onBack={onBack} /></Screen>;

  return (
    <Screen>
      <ActivityHeader title="Listen & Choose" onBack={onBack} step={i + 1} total={session.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: md.spacing.xxxl }}>
        <Card style={{ marginTop: md.spacing.md }}>
          <Body style={{ color: md.colors.onSurfaceVariant, textAlign: "center" }}>Listen, then choose the phrase you heard.</Body>
          <Text style={styles.translation}>{item.translation}</Text>
          <Button title="Play again" icon="🔊" onPress={() => speak(item.say)} accessibilityLabel="Play the phrase again" style={{ marginTop: md.spacing.md }} />
          <Button title="Slower" icon="🐢" variant="neutral" onPress={() => speak(item.say, { rate: 0.6 })} accessibilityLabel="Play slower" style={{ marginTop: md.spacing.sm }} />
        </Card>
        <H2 style={{ marginTop: md.spacing.lg, marginBottom: md.spacing.xs }}>Which did you hear?</H2>
        {options.map((opt, idx) => {
          let state: "idle"|"correct"|"wrong"|"dim" = "idle";
          if (picked != null) state = idx === answerIndex ? "correct" : idx === picked ? "wrong" : "dim";
          return <ChoiceButton key={idx} label={opt} state={state} disabled={picked != null} onPress={() => choose(idx)} />;
        })}
        {picked != null && (
          <View style={{ marginTop: md.spacing.md }}>
            <Body style={{ color: picked === answerIndex ? md.colors.success : md.colors.error, fontWeight: "700" }}>
              {picked === answerIndex ? "✓ Tama! (Correct!)" : "Hindi tama — tingnan ang tamang sagot. (Not quite — see the correct answer.)"}
            </Body>
            <Button title={i + 1 >= session.length ? "See results" : "Next"} onPress={next} style={{ marginTop: md.spacing.md }} />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  translation: { ...md.typescale.bodyMedium, color: md.colors.onSurfaceVariant, fontStyle: "italic", textAlign: "center", marginTop: md.spacing.xs },
});
