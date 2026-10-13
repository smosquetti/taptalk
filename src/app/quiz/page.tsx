"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CategoryId, WordCard } from "@/lib/vocabulary";
import { CATEGORIES, loadVocabulary, shuffle } from "@/lib/vocabulary";
import { speak, stopSpeaking } from "@/lib/speech";
import { useSound } from "@/components/SoundContext";

type Phase = "ready" | "playing" | "done";

type Question = {
  target: WordCard;
  options: WordCard[];
};

const ROUNDS = 8;

export default function QuizPage() {
  const { on: soundOn } = useSound();
  const [phase, setPhase] = useState<Phase>("ready");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [round, setRound] = useState(0);
  const [firstTryHits, setFirstTryHits] = useState(0);
  const [hadMiss, setHadMiss] = useState(false);
  const [correctId, setCorrectId] = useState<string | null>(null);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      stopSpeaking();
    };
  }, []);

  function buildQuestion(allCards: WordCard[], target: WordCard): Question {
    const dummies = shuffle(
      allCards.filter((c) => c.id !== target.id),
    ).slice(0, 3);
    return { target, options: shuffle([target, ...dummies]) };
  }

  async function start(category: CategoryId | "all") {
    setLoading(true);
    setError(null);
    try {
      const all = await loadVocabulary();
      const source =
        category === "all" ? all : all.filter((c) => c.category === category);
      if (source.length < 4) {
        throw new Error("Need at least 4 pictures in this category to play.");
      }
      const qs: Question[] = shuffle(source)
        .slice(0, ROUNDS)
        .map((target) => buildQuestion(all, target));
      setQuestions(qs);
      setRound(0);
      setFirstTryHits(0);
      setHadMiss(false);
      setCorrectId(null);
      setWrongId(null);
      setPhase("playing");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not load vocabulary.json",
      );
    } finally {
      setLoading(false);
    }
  }

  // Speak the current round's word whenever it changes while playing.
  useEffect(() => {
    if (phase !== "playing") return;
    const q = questions[round];
    if (q && soundOn) speak(q.target.word);
  }, [phase, round, questions, soundOn]);

  const question: Question | undefined = questions[round];

  const answer = useCallback(
    (option: WordCard) => {
      if (!question || locked || correctId) return;
      if (option.id === question.target.id) {
        setCorrectId(option.id);
        setLocked(true);
        if (soundOn) speak(`Yes! ${question.target.word}.`);
        if (!hadMiss) setFirstTryHits((h) => h + 1);
        timerRef.current = setTimeout(() => {
          setCorrectId(null);
          setWrongId(null);
          setLocked(false);
          if (round + 1 >= questions.length) {
            setPhase("done");
          } else {
            setRound((r) => r + 1);
            setHadMiss(false);
            setCorrectId(null);
            setWrongId(null);
          }
        }, 1400);
      } else {
        setHadMiss(true);
        setWrongId(option.id);
        if (soundOn) speak(question.target.word);
        timerRef.current = setTimeout(() => setWrongId(null), 450);
      }
    },
    [question, locked, correctId, hadMiss, round, questions.length, soundOn],
  );

  if (phase === "ready") {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-lg">
          <div className="text-6xl" aria-hidden>
            🎧
          </div>
          <h1 className="mt-3 text-3xl font-extrabold">Listening Quiz</h1>
          <p className="mt-2 text-base text-[#8a7f6f]">
            Hear the word, then tap the matching picture.
          </p>

          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => start("all")}
              className="rounded-full bg-[#2F6FE4] px-6 py-4 text-xl font-extrabold text-white transition hover:bg-[#2558b8] active:scale-[0.98]"
            >
              Play — all pictures
            </button>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => start(c.id)}
                  disabled={loading}
                  className="rounded-full bg-[#FDF8EF] px-4 py-3 text-base font-bold text-[#35302A] ring-2 ring-[#E5DCC8] transition hover:bg-[#EFE6D4] active:scale-[0.98]"
                >
                  <span aria-hidden>{c.emoji}</span> {c.label}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <p className="mt-6 text-lg font-bold text-[#8a7f6f]">
              Getting ready…
            </p>
          )}
          {error && (
            <p className="mt-6 font-bold text-[#E23B32]">{error}</p>
          )}
        </div>
      </div>
    );
  }

  if (phase === "done") {
    const pct = firstTryHits / questions.length;
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-lg">
          <div className="text-6xl" aria-hidden>
            {pct >= 0.8 ? "🌟" : "🎉"}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold">You did it!</h1>
          <p className="mt-2 text-xl font-bold text-[#2F6FE4]">
            {firstTryHits} out of {questions.length} on the first tap
          </p>
          <div className="mt-4 text-3xl" aria-hidden>
            {"⭐".repeat(Math.max(1, Math.round(pct * 5)))}
            {"☆".repeat(Math.max(0, 5 - Math.round(pct * 5)))}
          </div>
          <button
            type="button"
            onClick={() => setPhase("ready")}
            className="mt-6 w-full rounded-full bg-[#2F6FE4] px-6 py-4 text-xl font-extrabold text-white transition hover:bg-[#2558b8] active:scale-[0.98]"
          >
            Play again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-[#8a7f6f]">
          Round {round + 1} / {questions.length}
        </p>
        <button
          type="button"
          onClick={() => {
            if (soundOn && question) speak(question.target.word);
          }}
          aria-label="Hear the word again"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow transition active:scale-95"
        >
          <span aria-hidden>🔊</span>
        </button>
      </div>

      {question && (
        <>
          <div className="rounded-[2rem] bg-white p-6 text-center shadow">
            <p className="text-sm font-bold uppercase tracking-wide text-[#8a7f6f]">
              Tap:
            </p>
            <p className="text-4xl font-extrabold">{question.target.word}</p>
            <p className="mt-1 text-base text-[#8a7f6f]">
              {question.target.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {question.options.map((option) => {
              const isCorrect = correctId === option.id;
              const isWrong = wrongId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => answer(option)}
                  disabled={locked || correctId !== null}
                  aria-label="Pick this picture"
                  className={`relative aspect-square w-full overflow-hidden rounded-3xl bg-white shadow-md transition ${
                    isCorrect
                      ? "ring-4 ring-[#3FA34D] animate-pop"
                      : isWrong
                        ? "ring-4 ring-[#E23B32] animate-shake"
                        : "ring-4 ring-transparent"
                  } ${locked || correctId ? "opacity-90" : "active:scale-[0.97]"}`}
                >
                  <Image
                    src={option.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover"
                  />
                  {isCorrect && (
                    <span className="absolute inset-0 flex items-center justify-center bg-[#3FA34D]/25 text-5xl">
                      <span aria-hidden>✅</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
