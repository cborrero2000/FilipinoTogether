/**
 * Speech module for Filipino Together.
 * TTS: uses fil-PH (Filipino) voice for both Tagalog and Cebuano.
 * STT: browser Web Speech API (web) or expo-speech-recognition (native).
 */
import { Platform } from "react-native";
import * as Speech from "expo-speech";

export type VoiceInfo = { id: string; name: string; lang: string; natural: boolean };
export type SpeakOpts = { rate?: number; voice?: "a" | "b"; voiceId?: string; onDone?: () => void; onStart?: () => void };
export type RecognitionHandle = { stop: () => void };

let webVoices: SpeechSynthesisVoice[] = [];
let bestVoiceId: string | null = null;
let userVoiceId: string | null = null;

const FIL_LANGS = /^(fil|tl|ceb)/i;
const NATURAL = /natural|neural|enhanced|premium|online/i;

function scoreVoice(v: SpeechSynthesisVoice): number {
  let s = 0;
  if (FIL_LANGS.test(v.lang)) s += 200;
  if (NATURAL.test(v.name)) s += 100;
  if (!v.localService) s += 50;
  if (/google/i.test(v.name)) s += 30;
  if (/^en/i.test(v.lang)) s += 5; // fallback to English
  return s;
}

export async function initSpeech(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      userVoiceId = (globalThis as any).localStorage?.getItem("ft_voice") || null;
      await loadWebVoices();
    }
  } catch {}
}

function loadWebVoices(): Promise<void> {
  return new Promise(resolve => {
    const synth = (globalThis as any).speechSynthesis as SpeechSynthesis | undefined;
    if (!synth) return resolve();
    const grab = () => {
      const vs = synth.getVoices();
      if (vs.length) { webVoices = vs; bestVoiceId = vs.slice().sort((a, b) => scoreVoice(b) - scoreVoice(a))[0]?.voiceURI ?? null; resolve(); }
    };
    const existing = synth.getVoices();
    if (existing.length) { webVoices = existing; bestVoiceId = existing.slice().sort((a, b) => scoreVoice(b) - scoreVoice(a))[0]?.voiceURI ?? null; return resolve(); }
    synth.onvoiceschanged = grab;
    setTimeout(grab, 1200);
  });
}

export function listVoices(): VoiceInfo[] {
  if (Platform.OS !== "web") return [];
  return webVoices.map(v => ({ id: v.voiceURI, name: v.name, lang: v.lang, natural: NATURAL.test(v.name) || !v.localService }))
    .sort((a, b) => Number(b.natural) - Number(a.natural) || a.name.localeCompare(b.name));
}

export function getPreferredVoiceId(): string | null { return userVoiceId; }
export function setPreferredVoiceId(id: string | null) {
  userVoiceId = id;
  try { if (Platform.OS === "web") { const ls = (globalThis as any).localStorage; id ? ls?.setItem("ft_voice", id) : ls?.removeItem("ft_voice"); } } catch {}
}
export function hasNaturalVoice(): boolean { return listVoices().some(v => v.natural); }

export function speak(text: string, opts?: SpeakOpts) {
  if (Platform.OS === "web") speakWeb(text, opts);
  else speakNative(text, opts);
}

function speakWeb(text: string, opts?: SpeakOpts) {
  const synth = (globalThis as any).speechSynthesis as SpeechSynthesis | undefined;
  if (!synth) return;
  synth.cancel();
  if (synth.paused) synth.resume();
  setTimeout(() => {
    const id = opts?.voiceId ?? userVoiceId ?? bestVoiceId;
    const v = id ? webVoices.find(x => x.voiceURI === id) : null;
    const u = new (globalThis as any).SpeechSynthesisUtterance(text) as SpeechSynthesisUtterance;
    if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = "fil-PH"; }
    u.rate = opts?.rate ?? 0.95;
    u.pitch = 1.0;
    if (opts?.onStart) u.onstart = opts.onStart;
    u.onend = () => opts?.onDone?.();
    u.onerror = () => opts?.onDone?.();
    synth.speak(u);
  }, 50);
}

function speakNative(text: string, opts?: SpeakOpts) {
  // Android TTS stop() is async — wait 100ms before speaking to let the engine fully reset.
  // Without this delay, subsequent presses of Play/Watch again produce no audio.
  Speech.stop();
  setTimeout(() => {
    Speech.speak(text, { language: "fil-PH", rate: opts?.rate ?? 0.95, pitch: 1.0, onStart: opts?.onStart, onDone: opts?.onDone, onStopped: opts?.onDone, onError: opts?.onDone });
  }, 100);
}

export function stopSpeaking() {
  if (Platform.OS === "web") {
    const synth = (globalThis as any).speechSynthesis;
    if (synth) { synth.cancel(); if (synth.paused) synth.resume(); }
  } else {
    Speech.stop();
  }
}

// STT
export function isRecognitionAvailable(): boolean {
  if (Platform.OS === "web") { const w = globalThis as any; return !!(w.SpeechRecognition || w.webkitSpeechRecognition); }
  try { return require("expo-speech-recognition") != null; } catch { return false; }
}

export function startRecognition(handlers: { onResult: (t: string, f: boolean) => void; onError?: (m: string) => void; onEnd?: () => void }): RecognitionHandle | null {
  if (Platform.OS !== "web") return startNativeRecognition(handlers);
  return startWebRecognition(handlers);
}

function startWebRecognition(handlers: { onResult: (t: string, f: boolean) => void; onError?: (m: string) => void; onEnd?: () => void }): RecognitionHandle | null {
  const w = globalThis as any;
  if (!(w.SpeechRecognition || w.webkitSpeechRecognition)) return null;
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  const rec = new Ctor();
  rec.lang = "fil-PH"; rec.interimResults = true; rec.continuous = false;
  rec.onresult = (event: any) => {
    let transcript = "", isFinal = false;
    for (let i = event.resultIndex; i < event.results.length; i++) { transcript += event.results[i][0].transcript; if (event.results[i].isFinal) isFinal = true; }
    handlers.onResult(transcript.trim(), isFinal);
  };
  rec.onerror = (e: any) => handlers.onError?.(e?.error || "Error");
  rec.onend = () => handlers.onEnd?.();
  try { rec.start(); } catch { return null; }
  return { stop: () => rec.stop() };
}

function startNativeRecognition(handlers: { onResult: (t: string, f: boolean) => void; onError?: (m: string) => void; onEnd?: () => void }): RecognitionHandle | null {
  try {
    const mod = require("expo-speech-recognition");
    const M = mod.ExpoSpeechRecognitionModule;
    const subs: { remove: () => void }[] = [];
    let stopped = false;
    const cleanup = () => { subs.forEach(s => s.remove()); subs.length = 0; };
    subs.push(M.addListener("result", (e: any) => { handlers.onResult((e?.results?.[0]?.transcript ?? "").trim(), !!e?.isFinal); }));
    subs.push(M.addListener("error", (e: any) => handlers.onError?.(e?.error || "Error")));
    subs.push(M.addListener("end", () => { cleanup(); handlers.onEnd?.(); }));
    M.requestPermissionsAsync().then((res: any) => {
      if (!res?.granted) { handlers.onError?.("Microphone permission not granted."); cleanup(); handlers.onEnd?.(); return; }
      if (!stopped) M.start({ lang: "fil-PH", interimResults: true, continuous: false, addsPunctuation: false });
    }).catch((err: any) => { handlers.onError?.(String(err?.message || err)); cleanup(); handlers.onEnd?.(); });
    return { stop: () => { stopped = true; try { M.stop(); } catch {} } };
  } catch { return null; }
}

// Scoring
function normalize(s: string): string { return s.toLowerCase().replace(/[.,!?;:"''""\-]/g, "").replace(/\s+/g, " ").trim(); }
function tokens(s: string): string[] { const n = normalize(s); return n ? n.split(" ") : []; }

export function matchScore(target: string, spoken: string): number {
  const t = tokens(target); const s = tokens(spoken);
  if (!t.length) return 0;
  let matched = 0, si = 0;
  for (const word of t) { const found = s.indexOf(word, si); if (found !== -1) { matched++; si = found + 1; } }
  return matched / t.length;
}
export function missingWords(target: string, spoken: string): string[] { const s = new Set(tokens(spoken)); return tokens(target).filter(w => !s.has(w)); }
export function isCloseEnough(target: string, spoken: string, threshold = 0.65): boolean { return matchScore(target, spoken) >= threshold; }
