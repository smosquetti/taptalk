"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { stopSpeaking } from "@/lib/speech";
import type { Language } from "@/lib/vocabulary";

type LanguageState = {
  lang: Language;
  setLang: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageState>({
  lang: "en",
  setLang: () => {},
});

const STORAGE_KEY = "taptalk-language";

function readStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "de" ? "de" : "en";
  } catch {
    // localStorage unavailable (e.g. privacy mode) — keep default
    return "en";
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(readStoredLanguage);

  const setLang = (next: Language) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // non-fatal
    }
    stopSpeaking();
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
