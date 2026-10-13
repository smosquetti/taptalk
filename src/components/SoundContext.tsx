"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { stopSpeaking } from "@/lib/speech";

type SoundState = {
  on: boolean;
  toggle: () => void;
};

const SoundContext = createContext<SoundState>({
  on: true,
  toggle: () => {},
});

const STORAGE_KEY = "taptalk-sound";

function readStoredSound(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === null || stored === "on";
  } catch {
    // localStorage unavailable (e.g. privacy mode) — keep default on
    return true;
  }
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState<boolean>(readStoredSound);

  const toggle = () => {
    setOn((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch {
        // non-fatal
      }
      if (!next) stopSpeaking();
      return next;
    });
  };

  return <SoundContext.Provider value={{ on, toggle }}>{children}</SoundContext.Provider>;
}

export function useSound() {
  return useContext(SoundContext);
}
