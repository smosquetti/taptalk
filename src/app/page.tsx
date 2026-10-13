"use client";

import { useEffect, useMemo, useState } from "react";
import type { CategoryId, WordCard } from "@/lib/vocabulary";
import { CATEGORIES, loadVocabulary } from "@/lib/vocabulary";
import { speak, stopSpeaking } from "@/lib/speech";
import Card from "@/components/Card";
import CategoryBar from "@/components/CategoryBar";
import DetailOverlay from "@/components/DetailOverlay";
import { useSound } from "@/components/SoundContext";

type BoardState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; cards: WordCard[] };

export default function BoardPage() {
  const { on: soundOn } = useSound();
  const [state, setState] = useState<BoardState>({ status: "loading" });
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [selected, setSelected] = useState<WordCard | null>(null);

  useEffect(() => {
    loadVocabulary()
      .then((cards) => setState({ status: "ready", cards }))
      .catch(
        (e) =>
          setState({
            status: "error",
            message:
              e instanceof Error ? e.message : "Could not load vocabulary.json",
          }),
      );
  }, []);

  const visible = useMemo(
    () =>
      state.status === "ready"
        ? state.cards.filter((c) => category === "all" || c.category === category)
        : [],
    [state, category],
  );

  function pick(card: WordCard) {
    setSelected(card);
    if (soundOn) speak(card.word);
  }

  function close() {
    stopSpeaking();
    setSelected(null);
  }

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
            Check that <code>public/vocabulary.json</code> is valid JSON.
          </p>
        </div>
      )}

      {state.status === "ready" && (
        <>
          <CategoryBar
            categories={CATEGORIES}
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

      {selected && (
        <DetailOverlay card={selected} soundOn={soundOn} onClose={close} />
      )}
    </div>
  );
}
