import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { md } from "./src/theme";
import { Language, ScreenName } from "./src/navigation";
import { HomeScreen }         from "./src/screens/HomeScreen";
import { LanguageHomeScreen } from "./src/screens/LanguageHomeScreen";
import { LearnScreen }        from "./src/screens/LearnScreen";
import { RecallScreen }       from "./src/screens/RecallScreen";
import { ReviewScreen }       from "./src/screens/ReviewScreen";
import { ListeningScreen }    from "./src/screens/ListeningScreen";
import { SpeakingScreen }     from "./src/screens/SpeakingScreen";
import { DialogScreen }       from "./src/screens/DialogScreen";
import { TalkBackScreen }     from "./src/screens/TalkBackScreen";
import { SceneScreen }        from "./src/screens/SceneScreen";
import { BuildScreen } from "./src/screens/BuildScreen";
import { initSpeech, stopSpeaking, setSpeechLanguage } from "./src/speech/speech";

export default function App() {
  const [screen, setScreen] = useState<ScreenName>("home");
  const [language, setLanguage] = useState<Language>("tagalog");

  useEffect(() => { initSpeech(); }, []);

  function go(s: ScreenName, lang?: Language) {
    stopSpeaking();
    if (lang) { setLanguage(lang); setSpeechLanguage(lang); }
    setScreen(s);
  }

  const backToHome    = () => go("home");
  const backToLangHome = () => go("language-home");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={["top","left","right","bottom"]}>
        <StatusBar style="dark" />
        {screen === "home"          && <HomeScreen go={go} />}
        {screen === "language-home" && <LanguageHomeScreen language={language} go={go} onBack={backToHome} />}
        {screen === "learn"         && <LearnScreen     language={language} onBack={backToLangHome} />}
        {screen === "recall"        && <RecallScreen    language={language} onBack={backToLangHome} />}
        {screen === "review"        && <ReviewScreen    language={language} onBack={backToLangHome} />}
        {screen === "listening"     && <ListeningScreen language={language} onBack={backToLangHome} />}
        {screen === "speaking"      && <SpeakingScreen  language={language} onBack={backToLangHome} />}
        {screen === "build"         && <BuildScreen     language={language} onBack={backToLangHome} />}
        {screen === "dialog"        && <DialogScreen    language={language} onBack={backToLangHome} />}
        {screen === "talkback"      && <TalkBackScreen  language={language} onBack={backToLangHome} />}
        {screen === "scenes"        && <SceneScreen     language={language} onBack={backToLangHome} />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: md.colors.background },
});
