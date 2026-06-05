import { getItem, setItem } from "./storage";
import { Language } from "../navigation";

export type PhraseProgress = { id: string; box: number; due: number; seen: number; correct: number; lastSeen: number };
type DB = Record<string, PhraseProgress>;

const KEY = (lang: Language) => `ft_progress_v1_${lang}`;
const DAY = 24 * 60 * 60 * 1000;
const INTERVALS = [0, 1, 2, 4, 9, 18, 35];
const MAX_BOX = INTERVALS.length - 1;

const dbs: Record<Language, DB> = { tagalog: {}, cebuano: {} };
const loaded: Record<Language, boolean> = { tagalog: false, cebuano: false };

export async function initProgress(lang: Language): Promise<void> {
  if (loaded[lang]) return;
  try { const raw = await getItem(KEY(lang)); dbs[lang] = raw ? JSON.parse(raw) : {}; } catch { dbs[lang] = {}; }
  loaded[lang] = true;
}

async function persist(lang: Language) {
  try { await setItem(KEY(lang), JSON.stringify(dbs[lang])); } catch {}
}

export function newIds(lang: Language, allIds: string[]): string[] { return allIds.filter(id => !dbs[lang][id]); }
export function dueIds(lang: Language, allIds: string[], at = Date.now()): string[] {
  return allIds.filter(id => dbs[lang][id] && dbs[lang][id].due <= at).sort((a, b) => dbs[lang][a].due - dbs[lang][b].due);
}
export function learnedCount(lang: Language): number { return Object.keys(dbs[lang]).length; }
export function dueCount(lang: Language, allIds: string[], at = Date.now()): number { return dueIds(lang, allIds, at).length; }
export async function recordResult(lang: Language, id: string, correct: boolean): Promise<void> {
  const now = Date.now(); const prev = dbs[lang][id];
  const box = prev ? (correct ? Math.min(MAX_BOX, prev.box + 1) : Math.max(0, prev.box - 1)) : (correct ? 1 : 0);
  dbs[lang][id] = { id, box, due: now + INTERVALS[Math.max(0, Math.min(MAX_BOX, box))] * DAY, seen: (prev?.seen ?? 0) + 1, correct: (prev?.correct ?? 0) + (correct ? 1 : 0), lastSeen: now };
  await persist(lang);
}
export async function markLearned(lang: Language, id: string, correct = true): Promise<void> { await recordResult(lang, id, correct); }
export async function resetProgress(lang: Language): Promise<void> { dbs[lang] = {}; await persist(lang); }
