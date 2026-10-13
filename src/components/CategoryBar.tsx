"use client";

import type { CategoryId } from "@/lib/vocabulary";

type Props = {
  categories: { id: CategoryId; label: string; emoji: string }[];
  active: CategoryId | "all";
  onSelect: (id: CategoryId | "all") => void;
};

export default function CategoryBar({ categories, active, onSelect }: Props) {
  return (
    <nav
      aria-label="Categories"
      className="flex gap-2 overflow-x-auto pb-1 -mx-2 px-2"
    >
      <Chip
        label="All"
        emoji="🌈"
        active={active === "all"}
        onClick={() => onSelect("all")}
      />
      {categories.map((c) => (
        <Chip
          key={c.id}
          label={c.label}
          emoji={c.emoji}
          active={active === c.id}
          onClick={() => onSelect(c.id)}
        />
      ))}
    </nav>
  );
}

function Chip({
  label,
  emoji,
  active,
  onClick,
}: {
  label: string;
  emoji: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2 text-base font-bold transition ${
        active
          ? "border-[#35302A] bg-[#35302A] text-[#FDF8EF]"
          : "border-[#E5DCC8] bg-white text-[#35302A] hover:border-[#35302A]"
      }`}
    >
      <span aria-hidden>{emoji}</span>
      {label}
    </button>
  );
}
