export function ttsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickEnglishVoice(): SpeechSynthesisVoice | null {
  if (!ttsSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  const localUs = voices.find((v) => v.lang === "en-US" && v.localService);
  const us = voices.find((v) => v.lang === "en-US");
  const anyEnglish = voices.find((v) => v.lang?.toLowerCase().startsWith("en"));
  return localUs ?? us ?? anyEnglish ?? null;
}

/**
 * Speaks `text` out loud, replacing any in-progress utterance.
 * No-op on browsers without the Web Speech API.
 */
export function speak(text: string, opts: { rate?: number } = {}): void {
  if (!ttsSupported()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = opts.rate ?? 0.95;
  utterance.pitch = 1.05;
  const voice = pickEnglishVoice();
  if (voice) utterance.voice = voice;
  synth.speak(utterance);
}

export function stopSpeaking(): void {
  if (!ttsSupported()) return;
  window.speechSynthesis.cancel();
}
