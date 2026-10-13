"use client";

import Image from "next/image";
import type { WordCard } from "@/lib/vocabulary";

type Props = {
  card: WordCard;
  onPick: (card: WordCard) => void;
};

export default function Card({ card, onPick }: Props) {
  return (
    <button
      type="button"
      onClick={() => onPick(card)}
      aria-label={`${card.word} — tap to hear the word`}
      className="group relative aspect-square w-full overflow-hidden rounded-3xl bg-white shadow-md ring-4 ring-transparent transition duration-150 hover:shadow-lg focus-visible:ring-sky-400 active:scale-[0.97]"
    >
      <Image
        src={card.image}
        alt=""
        fill
        sizes="(max-width: 640px) 50vw, 33vw"
        className="object-cover transition-transform duration-150 group-hover:scale-[1.03]"
      />
    </button>
  );
}
