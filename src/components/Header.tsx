"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSound } from "@/components/SoundContext";
import { useLanguage } from "@/components/LanguageContext";
import { useState, useEffect } from 'react';
import { LANGUAGES } from "@/lib/vocabulary";
import Image from 'next/image'

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
          <div aria-hidden>
            <Image 
              src="/taptalk128.png"
              alt="Logo"
              width={32}
              height={32}/>
          </div>
          TapTalk
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
                className={`rounded-full px-4 py-2 text-base font-bold transition ${
                  active
                    ? "bg-[#35302A] text-[#FDF8EF]"
                    : "text-[#35302A] hover:bg-[#EFE6D4]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div
            className="ml-1 flex items-center gap-1"
            role="group"
            aria-label="Language"
          >
            {LANGUAGES.map((l) => {
              const isActive = mounted ? lang === l.id : false;

              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLang(l.id)}
                  aria-pressed={isActive}
                  aria-label={`Learn in ${l.label}`}
                  className={`flex h-11 items-center gap-1 rounded-full px-4 text-base font-bold transition ${
                    isActive
                      ? "bg-[#35302A] text-[#FDF8EF]"
                      : "bg-[#E5DCC8]/60 text-[#35302A] hover:bg-[#E5DCC8]"
                  }`}
                >
                  <span aria-hidden>{l.flag}</span>
                  {l.id.toUpperCase()}
                </button>
              );
            })}
          </div>

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
