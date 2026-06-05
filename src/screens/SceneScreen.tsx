import React, { useEffect, useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, ChoiceButton, H2 } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import { speak, stopSpeaking } from "../speech/speech";
import { getScenes } from "../data/index";
import { Language } from "../navigation";
import { md } from "../theme";
import { shuffle } from "../util";

const SESSION = 5;
const AVATARS = ["🧑‍🤝‍🧑", "👩", "👨", "🧓", "👱‍♀️", "👨‍🦰", "🙋", "🙋‍♂️"];

export function SceneScreen({ language, onBack }: { language: Language; onBack: () => void }) {
  const [session] = useState(() => shuffle(getScenes(language)).slice(0, SESSION));
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [activeLine, setActiveLine] = useState(-1);
  const [played, setPlayed] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;

  const item = session[i];

  useEffect(() => { const t = setTimeout(playScene, 400); return () => { clearTimeout(t); stopSpeaking(); }; }, [i]);

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;
    if (playing) { loop = Animated.loop(Animated.sequence([Animated.timing(pulse, { toValue: 1.12, duration: 280, useNativeDriver: true }), Animated.timing(pulse, { toValue: 1, duration: 280, useNativeDriver: true })])); loop.start(); }
    else pulse.setValue(1);
    return () => loop?.stop();
  }, [playing]);

  function playScene() {
    stopSpeaking(); setPlaying(true); let idx = 0;
    const next = () => {
      if (idx >= item.lines.length) { setPlaying(false); setActiveLine(-1); setPlayed(true); return; }
      setActiveLine(idx);
      speak(item.lines[idx].text, { onDone: () => setTimeout(next, 400) });
      idx++;
    };
    next();
  }

  function choose(idx: number) { if (picked != null) return; setPicked(idx); if (idx === item.answer) setScore(s => s + 1); }
  function next() { if (i + 1 >= session.length) setDone(true); else { setI(i + 1); setPicked(null); setPlayed(false); setActiveLine(-1); } }
  function restart() { stopSpeaking(); setI(0); setPicked(null); setPlayed(false); setScore(0); setDone(false); }

  if (done) return <Screen><ActivityHeader title="Watch & Decide" onBack={onBack} /><DoneCard score={score} total={session.length} onRestart={restart} onBack={onBack} /></Screen>;

  const subtitle = activeLine >= 0 ? item.lines[activeLine] : null;

  return (
    <Screen>
      <ActivityHeader title="Watch & Decide" onBack={onBack} step={i + 1} total={session.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: md.spacing.xxxl }}>
        <H2 style={{ marginTop: md.spacing.md }}>{item.title}</H2>
        <Body style={{ color: md.colors.onSurfaceVariant, marginTop: md.spacing.xs }}>{item.situation}</Body>
        <View style={styles.stage}>
          <Animated.Text style={[styles.avatar, { transform: [{ scale: pulse }] }]}>{AVATARS[i % AVATARS.length]}</Animated.Text>
          <View style={styles.subtitleBox}>
            {subtitle ? (
              <><Text style={styles.subSpeaker}>{subtitle.speaker}</Text><Text style={styles.subText}>{subtitle.text}</Text><Text style={styles.subTrans}>{subtitle.translation}</Text></>
            ) : (
              <Text style={styles.subHint}>{played ? "Now answer the question below." : "▶ Press play to watch the scene."}</Text>
            )}
          </View>
        </View>
        <Button title={playing ? "Playing…" : played ? "Watch again" : "Play scene"} icon="🎬" variant="neutral" disabled={playing} onPress={playScene} />
        <H2 style={{ marginTop: md.spacing.lg, marginBottom: md.spacing.xs }}>{item.question}</H2>
        {item.options.map((opt, idx) => {
          let state: "idle"|"correct"|"wrong"|"dim" = "idle";
          if (picked != null) state = idx === item.answer ? "correct" : idx === picked ? "wrong" : "dim";
          return <ChoiceButton key={idx} label={opt} state={state} disabled={picked != null} onPress={() => choose(idx)} />;
        })}
        {picked != null && (
          <View style={{ marginTop: md.spacing.md }}>
            <Body style={{ color: picked === item.answer ? md.colors.success : md.colors.error, fontWeight: "700" }}>
              {picked === item.answer ? "✓ Mahusay! (Great choice!)" : "Hindi tama — tingnan ang tamang sagot."}
            </Body>
            <Button title={i + 1 >= session.length ? "See results" : "Next"} onPress={next} style={{ marginTop: md.spacing.md }} />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stage: { backgroundColor: "#1A237E", borderRadius: md.shape.large, padding: md.spacing.lg, alignItems: "center", marginVertical: md.spacing.md, minHeight: 200, justifyContent: "center" },
  avatar: { fontSize: 80 },
  subtitleBox: { marginTop: md.spacing.md, minHeight: 60, width: "100%", backgroundColor: "rgba(0,0,0,0.4)", borderRadius: md.shape.medium, padding: md.spacing.md, justifyContent: "center" },
  subSpeaker: { ...md.typescale.labelLarge, color: md.colors.sunYellow, fontWeight: "800" },
  subText: { color: "#FFFFFF", ...md.typescale.bodyLarge, marginTop: 2 },
  subTrans: { color: "rgba(255,255,255,0.7)", ...md.typescale.bodySmall, fontStyle: "italic", marginTop: 2 },
  subHint: { color: "#90CAF9", ...md.typescale.bodyLarge, textAlign: "center" },
});
