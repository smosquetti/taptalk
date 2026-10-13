import type { Language } from "./vocabulary";

export function ttsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(lang: Language): SpeechSynthesisVoice | null {
  if (!ttsSupported()) return null;
  const prefix = lang === "de" ? "de" : "en";
  const voices = window.speechSynthesis.getVoices();
  const local = voices.find(
    (v) => v.lang?.toLowerCase().startsWith(prefix) && v.localService,
  );
  const any = voices.find((v) => v.lang?.toLowerCase().startsWith(prefix));
  return local ?? any ?? null;
}

/**
 * Speaks `text` out loud in `lang`, replacing any in-progress utterance.
 * No-op on browsers without the Web Speech API.
 */
export function speak(
  text: string,
  opts: { rate?: number; lang?: Language } = {},
): void {
  if (!ttsSupported()) return;
  const lang: Language = opts.lang ?? "en";
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === "de" ? "de-DE" : "en-US";
  utterance.rate = opts.rate ?? 0.95;
  utterance.pitch = 1.05;
  const voice = pickVoice(lang);
  if (voice) utterance.voice = voice;
  synth.speak(utterance);
}

export function stopSpeaking(): void {
  if (!ttsSupported()) return;
  window.speechSynthesis.cancel();
}
