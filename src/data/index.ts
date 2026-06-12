import { Language } from "../navigation";
import { Phrase } from "./types";
import { tagalogListening } from "./tagalog/listening";
import { tagalogSpeaking } from "./tagalog/speaking";
import { tagalogDialogs } from "./tagalog/dialogs";
import { tagalogConversations } from "./tagalog/conversations";
import { tagalogScenes } from "./tagalog/scenes";
import { tagalogPhrases, tagalogDistractors } from "./tagalog/phrases";
import { cebuanoListening } from "./cebuano/listening";
import { cebuanoSpeaking } from "./cebuano/speaking";
import { cebuanoDialogs } from "./cebuano/dialogs";
import { cebuanoConversations } from "./cebuano/conversations";
import { cebuanoScenes } from "./cebuano/scenes";
import { cebuanoPhrases, cebuanoDistractors } from "./cebuano/phrases";

export const getListening = (lang: Language) => lang === "tagalog" ? tagalogListening : cebuanoListening;
export const getSpeaking  = (lang: Language) => lang === "tagalog" ? tagalogSpeaking  : cebuanoSpeaking;
export const getDialogs   = (lang: Language) => lang === "tagalog" ? tagalogDialogs   : cebuanoDialogs;
export const getConversations = (lang: Language) => lang === "tagalog" ? tagalogConversations : cebuanoConversations;
export const getScenes    = (lang: Language) => lang === "tagalog" ? tagalogScenes    : cebuanoScenes;
export const getPhrases   = (lang: Language) => lang === "tagalog" ? tagalogPhrases   : cebuanoPhrases;
export const getDistractors = (lang: Language) => lang === "tagalog" ? tagalogDistractors : cebuanoDistractors;

export const LANG_LABEL = (lang: Language) => lang === "tagalog" ? "Tagalog" : "Visayan (Cebuano)";
export const otherLanguage = (lang: Language): Language => lang === "tagalog" ? "cebuano" : "tagalog";

/**
 * The same concept expressed in the other language. tagalogPhrases and cebuanoPhrases
 * are kept index-aligned (same topics in the same order), so the phrase at the same
 * position in the other language's array is the natural translation pairing.
 */
export function getCompanionPhrase(lang: Language, id: string): Phrase | undefined {
  const here = getPhrases(lang);
  const idx = here.findIndex(p => p.id === id);
  if (idx === -1) return undefined;
  return getPhrases(otherLanguage(lang))[idx];
}
