"use client";

import { useEffect, useMemo, useState } from "react";
import type { CategoryId, Language, WordCard } from "@/lib/vocabulary";
import { getCategories, loadVocabulary } from "@/lib/vocabulary";
import { speak, stopSpeaking } from "@/lib/speech";
import Card from "@/components/Card";
import CategoryBar from "@/components/CategoryBar";
import DetailOverlay from "@/components/DetailOverlay";
import { useSound } from "@/components/SoundContext";
import { useLanguage } from "@/components/LanguageContext";

type BoardState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; cards: WordCard[]; lang: Language };

export default function BoardPage() {
  const { on: soundOn } = useSound();
  const { lang } = useLanguage();
  const [state, setState] = useState<BoardState>({ status: "loading" });
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [selected, setSelected] = useState<WordCard | null>(null);

  useEffect(() => {
    let active = true;
    loadVocabulary(lang)
      .then((cards) => {
        if (active) setState({ status: "ready", cards, lang });
      })
      .catch((e) => {
        if (active)
          setState({
            status: "error",
            message:
              e instanceof Error
                ? e.message
                : `Could not load vocabulary-${lang}.json`,
          });
      });
    return () => {
      active = false;
    };
  }, [lang]);

  const visible = useMemo(
    () =>
      state.status === "ready"
        ? state.cards.filter((c) => category === "all" || c.category === category)
        : [],
    [state, category],
  );

  function pick(card: WordCard) {
    setSelected(card);
    if (soundOn) speak(card.word, { lang });
  }

  function close() {
    stopSpeaking();
    setSelected(null);
  }

  // The overlay only shows a card from the currently loaded vocabulary,
  // so switching languages closes a card opened in the other language.
  const overlayCard =
    selected && state.status === "ready" && state.lang === lang
      ? selected
      : null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">Picture Board</h1>
        <p className="mt-1 text-base text-[#8a7f6f]">
          Tap a picture to see and hear its word.
        </p>
      </div>

      {state.status === "loading" && (
        <p className="py-20 text-center text-xl font-bold text-[#8a7f6f]">
          Loading pictures…
        </p>
      )}

      {state.status === "error" && (
        <div className="rounded-3xl bg-white p-8 text-center shadow">
          <p className="text-lg font-bold text-[#E23B32]">
            Oh no — {state.message}
          </p>
          <p className="mt-2 text-[#8a7f6f]">
            Check that <code>public/vocabulary-{lang}.json</code> is valid JSON.
          </p>
        </div>
      )}

      {state.status === "ready" && (
        <>
          <CategoryBar
            categories={getCategories(lang)}
            active={category}
            onSelect={setCategory}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {visible.map((card) => (
              <Card key={card.id} card={card} onPick={pick} />
            ))}
          </div>
        </>
      )}

      {overlayCard && (
        <DetailOverlay card={overlayCard} soundOn={soundOn} onClose={close} />
      )}
    </div>
  );
}
