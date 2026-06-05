import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, ChoiceButton, H2 } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import { speak, stopSpeaking } from "../speech/speech";
import { getDialogs } from "../data/index";
import { Language } from "../navigation";
import { md } from "../theme";
import { shuffle } from "../util";

const SESSION = 4;

export function DialogScreen({ language, onBack }: { language: Language; onBack: () => void }) {
  const [session] = useState(() => shuffle(getDialogs(language)).slice(0, SESSION));
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [activeLine, setActiveLine] = useState(-1);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const item = session[i];

  useEffect(() => {
    const t = setTimeout(playDialog, 400);
    return () => { clearTimeout(t); stopSpeaking(); };
  }, [i]);

  function playDialog() {
    stopSpeaking(); setPlaying(true); let idx = 0;
    const playNext = () => {
      if (idx >= item.lines.length) { setPlaying(false); setActiveLine(-1); return; }
      setActiveLine(idx);
      speak(item.lines[idx].text, { onDone: () => setTimeout(playNext, 450) });
      idx++;
    };
    playNext();
  }

  function choose(idx: number) {
    if (picked != null) return;
    setPicked(idx);
    if (idx === item.answer) setScore(s => s + 1);
  }

  function next() {
    if (i + 1 >= session.length) setDone(true);
    else { setI(i + 1); setPicked(null); setActiveLine(-1); }
  }

  function restart() { stopSpeaking(); setI(0); setPicked(null); setScore(0); setDone(false); }

  if (done) return <Screen><ActivityHeader title="Dialog & Question" onBack={onBack} /><DoneCard score={score} total={session.length} onRestart={restart} onBack={onBack} /></Screen>;

  return (
    <Screen>
      <ActivityHeader title="Dialog & Question" onBack={onBack} step={i + 1} total={session.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: md.spacing.xxxl }}>
        <H2 style={{ marginTop: md.spacing.md }}>{item.title}</H2>
        <Card style={{ marginTop: md.spacing.sm }}>
          {item.lines.map((ln, idx) => (
            <View key={idx} style={[styles.bubble, activeLine === idx && styles.bubbleActive]}>
              <Text style={styles.speaker}>{ln.speaker}</Text>
              <Text style={styles.line}>{ln.text}</Text>
              <Text style={styles.lineTranslation}>{ln.translation}</Text>
            </View>
          ))}
          <Button title={playing ? "Playing…" : "Play the conversation"} icon="🔊" variant="neutral" disabled={playing} onPress={playDialog} style={{ marginTop: md.spacing.md }} />
        </Card>
        <H2 style={{ marginTop: md.spacing.lg, marginBottom: md.spacing.xs }}>{item.question}</H2>
        {item.options.map((opt, idx) => {
          let state: "idle"|"correct"|"wrong"|"dim" = "idle";
          if (picked != null) state = idx === item.answer ? "correct" : idx === picked ? "wrong" : "dim";
          return <ChoiceButton key={idx} label={opt} state={state} disabled={picked != null} onPress={() => choose(idx)} />;
        })}
        {picked != null && (
          <View style={{ marginTop: md.spacing.md }}>
            <Body style={{ color: picked === item.answer ? md.colors.success : md.colors.error, fontWeight: "700" }}>
              {picked === item.answer ? "✓ Tama! (Correct!)" : "Hindi tama — tingnan ang tamang sagot."}
            </Body>
            <Button title={i + 1 >= session.length ? "See results" : "Next"} onPress={next} style={{ marginTop: md.spacing.md }} />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bubble: { backgroundColor: md.colors.background, borderRadius: md.shape.medium, padding: md.spacing.md, marginBottom: md.spacing.sm, borderWidth: 2, borderColor: "transparent" },
  bubbleActive: { borderColor: md.colors.primary, backgroundColor: md.colors.primaryContainer },
  speaker: { ...md.typescale.labelLarge, color: md.colors.primary, fontWeight: "800", marginBottom: 2 },
  line: { ...md.typescale.bodyLarge, color: md.colors.onSurface, fontWeight: "600" },
  lineTranslation: { ...md.typescale.bodySmall, color: md.colors.onSurfaceVariant, fontStyle: "italic", marginTop: 2 },
});
