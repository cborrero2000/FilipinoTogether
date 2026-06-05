import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, Pill } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import { speak, stopSpeaking, isRecognitionAvailable, startRecognition, RecognitionHandle, matchScore, missingWords } from "../speech/speech";
import { getSpeaking } from "../data/index";
import { Language } from "../navigation";
import { md } from "../theme";
import { shuffle } from "../util";

const SESSION = 10;

export function SpeakingScreen({ language, onBack }: { language: Language; onBack: () => void }) {
  const [session] = useState(() => shuffle(getSpeaking(language)).slice(0, SESSION));
  const [i, setI] = useState(0);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [passes, setPasses] = useState(0);
  const [done, setDone] = useState(false);
  const recRef = useRef<RecognitionHandle | null>(null);
  const supported = isRecognitionAvailable();
  const item = session[i];

  function stopRec() { recRef.current?.stop(); recRef.current = null; setListening(false); }

  function startListen() {
    setHeard(""); setScore(null); setListening(true);
    const h = startRecognition({
      onResult: (t, f) => { setHeard(t); if (f) finish(t); },
      onError: () => setListening(false),
      onEnd: () => setListening(false),
    });
    if (!h) { setListening(false); return; }
    recRef.current = h;
  }

  function finish(t: string) {
    const s = matchScore(item.text, t);
    setScore(s);
    if (s >= 0.65) setPasses(p => p + 1);
    stopRec();
  }

  function next() {
    if (i + 1 >= session.length) setDone(true);
    else { setI(i + 1); setHeard(""); setScore(null); }
  }

  function restart() { stopSpeaking(); setI(0); setHeard(""); setScore(null); setPasses(0); setDone(false); }

  if (done) return <Screen><ActivityHeader title="Say It" onBack={onBack} /><DoneCard score={passes} total={session.length} onRestart={restart} onBack={onBack} /></Screen>;

  const passed = score != null && score >= 0.65;
  const missed = score != null && !passed ? missingWords(item.text, heard) : [];

  return (
    <Screen>
      <ActivityHeader title="Say It" onBack={onBack} step={i + 1} total={session.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: md.spacing.xxxl }}>
        <Card style={{ marginTop: md.spacing.md }}>
          <Body style={{ color: md.colors.onSurfaceVariant }}>Read this out loud:</Body>
          <Text style={styles.target} accessibilityLabel={`Say: ${item.text}`}>{item.text}</Text>
          <Text style={styles.translation}>{item.translation}</Text>
          <Button title="Hear it" icon="🔊" variant="neutral" onPress={() => speak(item.text)} accessibilityLabel="Hear the phrase" style={{ marginTop: md.spacing.md }} />
        </Card>
        {supported ? (
          <Button title={listening ? "Listening… tap to stop" : "🎤  Tap and speak"} variant={listening ? "accent" : "primary"}
            onPress={listening ? stopRec : startListen} accessibilityLabel={listening ? "Stop" : "Record your voice"}
            style={{ marginTop: md.spacing.lg }} />
        ) : (
          <Card style={{ marginTop: md.spacing.lg, backgroundColor: md.elevation.level2 }}>
            <Body style={{ fontWeight: "700" }}>🎤 Open in a computer browser to check your speaking.</Body>
          </Card>
        )}
        {heard !== "" && <Body style={{ fontStyle: "italic", marginTop: md.spacing.sm }}>I heard: "{heard}"</Body>}
        {score !== null && (
          <View style={{ marginTop: md.spacing.sm }}>
            <Pill tone={passed ? "good" : "bad"} text={passed ? "✓ Magaling! (Great!)" : "Subukan ulit. (Try again.)"} />
            {missed.length > 0 && <Body style={{ marginTop: md.spacing.xs }}>Focus on: <Text style={{ fontWeight: "800", color: md.colors.primary }}>{missed.join(", ")}</Text></Body>}
          </View>
        )}
        <Button title={i + 1 >= session.length ? "Finish" : passed ? "Next →" : "Practice this later →"}
          variant={passed ? "primary" : "neutral"}
          accessibilityLabel={passed ? "Next phrase" : "Skip this phrase"}
          onPress={next} style={{ marginTop: md.spacing.lg }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  target: { ...md.typescale.titleLarge, fontWeight: "800", color: md.colors.onSurface, marginTop: md.spacing.sm, lineHeight: 32 },
  translation: { ...md.typescale.bodyMedium, color: md.colors.onSurfaceVariant, fontStyle: "italic", marginTop: 4 },
});
