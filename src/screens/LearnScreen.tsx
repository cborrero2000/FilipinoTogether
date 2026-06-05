import React, { useEffect, useRef, useState, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, ChoiceButton, H2, Pill } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { WordArrange } from "../components/WordArrange";
import { speak, stopSpeaking, isRecognitionAvailable, startRecognition, RecognitionHandle, matchScore, missingWords } from "../speech/speech";
import { getPhrases, getDistractors } from "../data/index";
import { Phrase } from "../data/types";
import { markLearned, initProgress } from "../progress/store";
import { Language } from "../navigation";
import { md } from "../theme";
import { shuffle } from "../util";

const BATCH = 5;
type Step = "listen" | "speak" | "read" | "write" | "done";

export function LearnScreen({ language, onBack }: { language: Language; onBack: () => void }) {
  const [ready, setReady] = useState(false);
  const [batch, setBatch] = useState<Phrase[]>([]);
  const [pi, setPi] = useState(0);
  const [step, setStep] = useState<Step>("listen");
  const [sessionDone, setSessionDone] = useState(false);

  useEffect(() => {
    initProgress(language).then(() => { setBatch(shuffle(getPhrases(language)).slice(0, BATCH)); setReady(true); });
    return () => stopSpeaking();
  }, [language]);

  if (!ready) return null;

  const phrase = batch[pi];
  const totalSteps = batch.length * 4;
  const currentStep = pi * 4 + ["listen","speak","read","write"].indexOf(step) + 1;

  async function advance(correct = true) {
    if (step === "write") {
      await markLearned(language, phrase.id, correct);
      if (pi + 1 >= batch.length) setSessionDone(true);
      else { setPi(pi + 1); setStep("listen"); }
    } else {
      const steps: Step[] = ["listen","speak","read","write"];
      setStep(steps[steps.indexOf(step) + 1]);
    }
  }

  function restart() { stopSpeaking(); setBatch(shuffle(getPhrases(language)).slice(0, BATCH)); setPi(0); setStep("listen"); setSessionDone(false); }

  if (sessionDone) return (
    <Screen>
      <ActivityHeader title="Learn" onBack={onBack} />
      <Card style={{ marginTop: md.spacing.lg, alignItems: "center" }}>
        <Text style={{ fontSize: 56 }}>🌟</Text>
        <H2 style={{ marginTop: md.spacing.sm, textAlign: "center" }}>Napakahusay! (Excellent!)</H2>
        <Body style={{ color: md.colors.onSurfaceVariant, marginTop: md.spacing.xs, textAlign: "center" }}>You practiced {batch.length} phrases. They are saved for Daily Review!</Body>
        <Button title="Learn more" onPress={restart} style={{ marginTop: md.spacing.lg, alignSelf: "stretch" }} />
        <Button title="Back to menu" variant="neutral" onPress={onBack} style={{ marginTop: md.spacing.sm, alignSelf: "stretch" }} />
      </Card>
    </Screen>
  );

  const pills = (
    <View style={styles.pills}>
      <Pill text={phrase.topic} />
      <Pill text={{ listen: "👂 Listen", speak: "🎤 Speak", read: "📖 Read", write: "✏️ Build", done: "Done" }[step]} />
    </View>
  );

  return (
    <Screen>
      <ActivityHeader title="Learn" onBack={onBack} step={currentStep} total={totalSteps} />
      <ScrollView contentContainerStyle={{ paddingBottom: md.spacing.xxxl }}>
        {pills}
        {step === "listen" && <ListenStep phrase={phrase} all={batch} onNext={() => advance()} />}
        {step === "speak"  && <SpeakStep  phrase={phrase} onNext={() => advance()} />}
        {step === "read"   && <ReadStep   phrase={phrase} all={batch} onNext={() => advance()} />}
        {step === "write"  && <WriteStep  phrase={phrase} language={language} onNext={ok => advance(ok)} />}
      </ScrollView>
    </Screen>
  );
}

function ListenStep({ phrase, all, onNext }: { phrase: Phrase; all: Phrase[]; onNext: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const options = useMemo(() => shuffle([phrase.filipino, ...shuffle(all.filter(p => p.id !== phrase.id)).slice(0, 2).map(p => p.filipino)]), [phrase.id]);
  useEffect(() => { const t = setTimeout(() => speak(phrase.filipino), 350); return () => { clearTimeout(t); stopSpeaking(); }; }, [phrase.id]);
  return (
    <Card style={{ marginTop: md.spacing.md }}>
      <H2>👂 Listen</H2>
      <Body style={{ color: md.colors.onSurfaceVariant }}>{phrase.english}</Body>
      <Button title="Play again" icon="🔊" variant="neutral" onPress={() => speak(phrase.filipino)} style={{ marginTop: md.spacing.md }} />
      <Button title="Slower" icon="🐢" variant="neutral" onPress={() => speak(phrase.filipino, { rate: 0.6 })} style={{ marginTop: md.spacing.sm }} />
      <View style={{ marginTop: md.spacing.md }}>
        {options.map(opt => {
          const correct = opt === phrase.filipino;
          let state: "idle"|"correct"|"wrong"|"dim" = "idle";
          if (picked) state = correct ? "correct" : opt === picked ? "wrong" : "dim";
          return <ChoiceButton key={opt} label={opt} state={state} disabled={!!picked} onPress={() => { if (!picked) setPicked(opt); }} />;
        })}
      </View>
      {picked && <Button title="Next →" onPress={onNext} style={{ marginTop: md.spacing.md }} />}
    </Card>
  );
}

function SpeakStep({ phrase, onNext }: { phrase: Phrase; onNext: () => void }) {
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const recRef = useRef<RecognitionHandle | null>(null);
  const supported = isRecognitionAvailable();
  useEffect(() => { const t = setTimeout(() => speak(phrase.filipino), 200); return () => { clearTimeout(t); stopSpeaking(); }; }, [phrase.id]);
  function startListen() {
    setHeard(""); setScore(null); setListening(true);
    const h = startRecognition({ onResult: (t, f) => { setHeard(t); if (f) { setScore(matchScore(phrase.filipino, t)); setListening(false); } }, onError: () => setListening(false), onEnd: () => setListening(false) });
    if (!h) setListening(false); else recRef.current = h;
  }
  const passed = score != null && score >= 0.65;
  const missed = score != null && !passed ? missingWords(phrase.filipino, heard) : [];
  return (
    <Card style={{ marginTop: md.spacing.md }}>
      <H2>🎤 Speak</H2>
      <Text style={styles.target}>{phrase.filipino}</Text>
      {phrase.pronunciation && <Text style={styles.pronunciation}>[{phrase.pronunciation}]</Text>}
      <Text style={styles.translation}>{phrase.english}</Text>
      <Button title="Hear it" icon="🔊" variant="neutral" onPress={() => speak(phrase.filipino)} style={{ marginTop: md.spacing.md }} />
      {supported
        ? <Button title={listening ? "Listening… tap to stop" : "🎤  Tap and say it"} variant={listening ? "accent" : "primary"} onPress={listening ? () => recRef.current?.stop() : startListen} style={{ marginTop: md.spacing.sm }} />
        : <Body style={{ color: md.colors.onSurfaceVariant, marginTop: md.spacing.sm }}>🎤 Open in a computer browser to check your speaking.</Body>}
      {heard !== "" && <Body style={{ fontStyle: "italic", marginTop: md.spacing.sm }}>I heard: "{heard}"</Body>}
      {score !== null && (
        <View style={{ marginTop: md.spacing.sm }}>
          <Pill tone={passed ? "good" : "bad"} text={passed ? "✓ Magaling! (Great!)" : "Subukan ulit. (Try again.)"} />
          {missed.length > 0 && <Body style={{ marginTop: md.spacing.xs }}>Focus on: <Text style={{ fontWeight: "800", color: md.colors.primary }}>{missed.join(", ")}</Text></Body>}
        </View>
      )}
      <Button title={passed ? "Next →" : "Skip to next step"} variant={passed ? "primary" : "neutral"} onPress={onNext} style={{ marginTop: md.spacing.md }} />
    </Card>
  );
}

function ReadStep({ phrase, all, onNext }: { phrase: Phrase; all: Phrase[]; onNext: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const options = useMemo(() => shuffle([phrase.english, ...shuffle(all.filter(p => p.id !== phrase.id)).slice(0, 2).map(p => p.english)]), [phrase.id]);
  useEffect(() => { const t = setTimeout(() => speak(phrase.filipino), 200); return () => { clearTimeout(t); stopSpeaking(); }; }, [phrase.id]);
  return (
    <Card style={{ marginTop: md.spacing.md }}>
      <H2>📖 Read</H2>
      <Text style={styles.target}>{phrase.filipino}</Text>
      {phrase.pronunciation && <Text style={styles.pronunciation}>[{phrase.pronunciation}]</Text>}
      <Button title="Hear it" icon="🔊" variant="neutral" onPress={() => speak(phrase.filipino)} style={{ marginTop: md.spacing.sm }} />
      <Body style={{ color: md.colors.onSurfaceVariant, marginTop: md.spacing.md }}>What does this mean in English?</Body>
      <View style={{ marginTop: md.spacing.sm }}>
        {options.map(opt => {
          const correct = opt === phrase.english;
          let state: "idle"|"correct"|"wrong"|"dim" = "idle";
          if (picked) state = correct ? "correct" : opt === picked ? "wrong" : "dim";
          return <ChoiceButton key={opt} label={opt} state={state} disabled={!!picked} onPress={() => { if (!picked) setPicked(opt); }} />;
        })}
      </View>
      {picked && <Button title="Next →" onPress={onNext} style={{ marginTop: md.spacing.md }} />}
    </Card>
  );
}

function WriteStep({ phrase, language, onNext }: { phrase: Phrase; language: Language; onNext: (ok: boolean) => void }) {
  const [result, setResult] = useState<boolean | null>(null);
  const distractors = getDistractors(language);
  useEffect(() => { const t = setTimeout(() => speak(phrase.filipino), 200); return () => { clearTimeout(t); stopSpeaking(); }; }, [phrase.id]);
  return (
    <Card style={{ marginTop: md.spacing.md }}>
      <H2>✏️ Build it</H2>
      <Body style={{ color: md.colors.onSurfaceVariant }}>Meaning: {phrase.english}</Body>
      <Button title="Hear it" icon="🔊" variant="neutral" onPress={() => speak(phrase.filipino)} style={{ marginTop: md.spacing.sm, marginBottom: md.spacing.md }} />
      <WordArrange sentence={phrase.filipino} distractorWords={distractors} onResult={ok => setResult(ok)} onNext={() => onNext(result ?? false)} nextLabel="Finish phrase →" />
    </Card>
  );
}

const styles = StyleSheet.create({
  pills: { flexDirection: "row", gap: md.spacing.sm, marginTop: md.spacing.md, flexWrap: "wrap", paddingRight: md.spacing.md },
  target: { ...md.typescale.titleLarge, fontWeight: "800", color: md.colors.onSurface, marginTop: md.spacing.sm },
  pronunciation: { ...md.typescale.bodySmall, color: md.colors.onSurfaceVariant, fontStyle: "italic", marginTop: 2 },
  translation: { ...md.typescale.bodyMedium, color: md.colors.onSurfaceVariant, marginTop: 4 },
});
