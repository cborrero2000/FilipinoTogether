export type ListenItem      = { say: string; translation: string; options: string[] };
export type SpeakItem       = { text: string; translation: string; hint?: string; pronunciation?: string };
export type DialogItem      = { title: string; lines: { speaker: string; text: string; translation: string }[]; question: string; options: string[]; answer: number };
export type TalkStep        = { prompt: string; promptTranslation: string; expect: string; accept: string[] };
export type TalkConversation = { title: string; steps: TalkStep[] };
export type SceneItem       = { title: string; situation: string; lines: { speaker: string; text: string; translation: string }[]; question: string; options: string[]; answer: number };
export type Phrase          = { id: string; filipino: string; english: string; pronunciation?: string; topic: string };
export type DistractorList  = string[];
