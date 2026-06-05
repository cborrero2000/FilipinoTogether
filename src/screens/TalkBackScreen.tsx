import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen, Card, Body, Button, H2, Pill } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { speak, stopSpeaking, isRecognitionAvailable, startRecognition, RecognitionHandle } from "../speech/speech";
import { getConversations } from "../data/index";
import { Language } from "../navigation";
import { md } from "../theme";
import { shuffle } from "../util";

const SESSION = 3;
type Status = "idle" | "listening" | "good" | "retry";

function norm(s: string) { return s.toLowerCase().replace(/[.,!?;:"'']/g, "").replace(/\s+/g, " ").trim(); }
function isOk(accept: string[], said: string) { const n = norm(said); return accept.some(a => n.includes(norm(a))); }

export function TalkBackScreen({ language, onBack }: { language: Language; onBack: () => void }) {
  const [session] = useState(() => shuffle(getConversations(language)).slice(0, SESSION));
  const [ci, setCi] = useState(0);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [heard, setHeard] = useState("");
  const [typed, setTyped] = useState("");
  const [finished, setFinished] = useState(false);
  const recRef = useRef<RecognitionHandle | null>(null);
  const supported = isRecognitionAvailable();
  const convo = session[ci];
  const current = convo.steps[step];

  useEffect(() => {
    setStatus("idle"); setHeard(""); setTyped("");
    const t = setTimeout(() => speak(current.prompt), 350);
    return () => { clearTimeout(t); stopSpeaking(); };
  }, [ci, step]);

  useEffect(() => () => recRef.current?.stop(), []);

  function listen() {
    setHeard(""); setStatus("listening");
    const h = startRecognition({
      onResult: (t, f) => { setHeard(t); if (f) evaluate(t); },
      onError: () => setStatus("idle"),
      onEnd: () => setStatus(s => s === "listening" ? "idle" : s),
    });
    if (!h) { setStatus("idle"); return; }
    recRef.current = h;
  }

  function evaluate(said: string) {
    recRef.current?.stop(); recRef.current = null;
    if (isOk(current.accept, said)) {
      setStatus("good");
      speak("Tama! Magaling!", { onDone: () => setTimeout(advance, 300) });
    } else {
      setStatus("retry");
      speak("Pasensya na, hindi ko naintindihan. Ulitin mo?");
    }
  }

  function submitTyped() { if (!typed.trim()) return; setHeard(typed); evaluate(typed); }

  function advance() {
    if (step + 1 >= convo.steps.length) {
      setFinished(true);
      speak("Napakahusay! Natapos mo ang usapan!");
    } else setStep(s => s + 1);
  }

  function nextConvo() {
    stopSpeaking();
    if (ci + 1 >= session.length) onBack();
    else { setCi(c => c + 1); setStep(0); setFinished(false); }
  }

  function restart() { stopSpeaking(); setStep(0); setFinished(false); setStatus("idle"); }

  if (finished) return (
    <Screen>
      <ActivityHeader title="Talk Back" onBack={onBack} />
      <Card style={{ marginTop: md.spacing.lg, alignItems: "center" }}>
        <Text style={{ fontSize: 56 }}>🎉</Text>
        <H2 style={{ marginTop: md.spacing.sm, textAlign: "center" }}>Napakahusay! You finished "{convo.title}"!</H2>
        <Body style={{ color: md.colors.onSurfaceVariant, marginTop: md.spacing.xs, textAlign: "center" }}>You had a whole conversation in Filipino. Wonderful!</Body>
        {ci + 1 < session.length
          ? <Button title="Next conversation" onPress={nextConvo} style={{ marginTop: md.spacing.lg, alignSelf: "stretch" }} />
          : <Button title="Back to menu" onPress={onBack} style={{ marginTop: md.spacing.lg, alignSelf: "stretch" }} />}
        <Button title="Repeat this one" variant="neutral" onPress={restart} style={{ marginTop: md.spacing.sm, alignSelf: "stretch" }} />
      </Card>
    </Screen>
  );

  return (
    <Screen>
      <ActivityHeader title={`Talk Back — ${convo.title}`} onBack={onBack} step={step + 1} total={convo.steps.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: md.spacing.xxxl }}>
        <Card style={{ marginTop: md.spacing.md }}>
          <Text style={styles.speaker}>The other person says:</Text>
          <Text style={styles.prompt}>{current.prompt}</Text>
          <Text style={styles.promptTrans}>{current.promptTranslation}</Text>
          <Button title="Hear it again" icon="🔊" variant="neutral" onPress={() => speak(current.prompt)} style={{ marginTop: md.spacing.md }} />
        </Card>
        <Card style={{ marginTop: md.spacing.md, backgroundColor: md.colors.background }}>
          <Text style={styles.hintLabel}>You could say:</Text>
          <Text style={styles.hint}>"{current.expect}"</Text>
        </Card>
        {supported ? (
          <Button title={status === "listening" ? "Listening… speak now" : "🎤 Tap and answer"}
            variant={status === "listening" ? "accent" : "primary"}
            onPress={status === "listening" ? () => recRef.current?.stop() : listen}
            style={{ marginTop: md.spacing.lg }} />
        ) : (
          <View style={{ marginTop: md.spacing.lg }}>
            <Body style={{ color: md.colors.onSurfaceVariant, marginBottom: md.spacing.xs }}>Type your reply to practice:</Body>
            <TextInput value={typed} onChangeText={setTyped} placeholder="Type your answer…" placeholderTextColor={md.colors.onSurfaceVariant}
              style={styles.input} onSubmitEditing={submitTyped} />
            <Button title="Check my answer" onPress={submitTyped} style={{ marginTop: md.spacing.sm }} />
          </View>
        )}
        {heard !== "" && <Body style={{ marginTop: md.spacing.md, fontStyle: "italic" }}>You said: "{heard}"</Body>}
        {status === "good" && <View style={{ marginTop: md.spacing.md }}><Pill tone="good" text="✓ Tama! Magaling! (Correct! Great!)" /></View>}
        {status === "retry" && (
          <Card style={{ marginTop: md.spacing.md, backgroundColor: md.colors.errorContainer, borderColor: md.colors.error }}>
            <Text style={{ ...md.typescale.bodyLarge, fontWeight: "700", color: md.colors.error }}>"Pasensya na, hindi ko naintindihan. Ulitin mo?"</Text>
            <Body style={{ color: md.colors.onErrorContainer, marginTop: md.spacing.xs }}>Try again. Listen to the example above, then answer.</Body>
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  speaker: { ...md.typescale.labelLarge, fontWeight: "800", color: md.colors.primary },
  prompt: { ...md.typescale.titleLarge, fontWeight: "800", color: md.colors.onSurface, marginTop: md.spacing.xs },
  promptTrans: { ...md.typescale.bodyMedium, color: md.colors.onSurfaceVariant, fontStyle: "italic", marginTop: 2 },
  hintLabel: { ...md.typescale.labelLarge, fontWeight: "700", color: md.colors.onSurfaceVariant },
  hint: { ...md.typescale.bodyLarge, color: md.colors.onSurface, fontStyle: "italic", marginTop: 4 },
  input: { borderWidth: 2, borderColor: md.colors.outlineVariant, borderRadius: md.shape.medium, padding: md.spacing.md, ...md.typescale.bodyLarge, color: md.colors.onSurface, backgroundColor: md.colors.surface },
});
