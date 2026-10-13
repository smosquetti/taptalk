"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { WordCard } from "@/lib/vocabulary";
import { speak } from "@/lib/speech";
import { useLanguage } from "@/components/LanguageContext";

type Props = {
  card: WordCard;
  soundOn: boolean;
  onClose: () => void;
};

export default function DetailOverlay({ card, soundOn, onClose }: Props) {
  const { lang } = useLanguage();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={card.word}
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#35302A]/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#35302A] shadow-lg"
      >
        ✕
      </button>

      <div className="w-full max-w-md rounded-[2rem] bg-white p-5 shadow-2xl sm:p-6">
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl">
          <Image
            src={card.image}
            alt={card.word}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <h2 className="mt-5 text-center text-5xl font-extrabold tracking-tight text-[#35302A]">
          {card.word}
        </h2>
        <p className="mt-1 text-center text-lg text-[#8a7f6f]">{card.description}</p>

        <button
          type="button"
          onClick={() => {
            if (soundOn) speak(card.word, { lang });
          }}
          className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-[#2F6FE4] px-6 py-4 text-xl font-extrabold text-white transition hover:bg-[#2558b8] active:scale-[0.98]"
        >
          <span aria-hidden>🔊</span> Hear it again
        </button>
      </div>
    </div>
  );
}
