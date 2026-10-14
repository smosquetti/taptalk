"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSound } from "@/components/SoundContext";
import { useLanguage } from "@/components/LanguageContext";
import { useState, useEffect } from 'react';
import { LANGUAGES, type Language } from "@/lib/vocabulary";

const NAV = [
  { href: "/", label: "Board" },
  { href: "/quiz", label: "Quiz" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const { on, toggle } = useSound();
  const { lang, setLang } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b-4 border-[#E5DCC8] bg-[#FDF8EF]/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-[#35302A]"
        >
          <img src="/images/taptalk128.png" alt="Logo" width="32" height="32" loading="lazy"/>
          <span className="hidden sm:inline">TapTalk</span>
        </Link>

        <nav
          className="flex items-center gap-2"
          aria-label="Main"
        >
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-2 text-base font-bold transition sm:px-4 ${
                  active
                    ? "bg-[#35302A] text-[#FDF8EF]"
                    : "text-[#35302A] hover:bg-[#EFE6D4]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <select
            value={mounted ? lang : undefined}
            onChange={(event) => setLang(event.target.value as Language)}
            aria-label="Choose language"
            className="h-11 cursor-pointer rounded-full border-2 border-[#E5DCC8] bg-white px-3 text-base font-bold text-[#35302A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#35302A]"
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                <span aria-hidden>{l.flag}</span> {l.id.toUpperCase()}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={toggle}
            aria-pressed={on}
            aria-label={on ? "Turn sound off" : "Turn sound on"}
            className={`ml-1 flex h-11 w-11 items-center justify-center rounded-full text-xl transition ${
              on ? "bg-white shadow" : "bg-[#E5DCC8] opacity-70"
            }`}
          >
            <span aria-hidden>{on ? "🔊" : "🔇"}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
