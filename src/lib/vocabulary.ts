export type Language = "en" | "de";

export type CategoryId =
  | "colors"
  | "shapes"
  | "numbers"
  | "animals"
  | "food"
  | "body"
  | "emotions"
  | "home";

export type WordCard = {
  id: string;
  category: CategoryId;
  word: string;
  description: string;
  image: string;
};

export type CategoryInfo = {
  id: CategoryId;
  label: string;
  emoji: string;
};

export const LANGUAGES: { id: Language; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "de", label: "Deutsch", flag: "🇩🇪" },
];

const CATEGORIES: Record<Language, CategoryInfo[]> = {
  en: [
    { id: "colors", label: "Colors", emoji: "🎨" },
    { id: "shapes", label: "Shapes", emoji: "⭐" },
    { id: "numbers", label: "Numbers", emoji: "🔢" },
    { id: "animals", label: "Animals", emoji: "🐶" },
    { id: "food", label: "Food", emoji: "🍎" },
    { id: "body", label: "My Body", emoji: "🖐️" },
    { id: "emotions", label: "Feelings", emoji: "😊" },
    { id: "home", label: "Home", emoji: "🏠" },
  ],
  de: [
    { id: "colors", label: "Farben", emoji: "🎨" },
    { id: "shapes", label: "Formen", emoji: "⭐" },
    { id: "numbers", label: "Zahlen", emoji: "🔢" },
    { id: "animals", label: "Tiere", emoji: "🐶" },
    { id: "food", label: "Essen", emoji: "🍎" },
    { id: "body", label: "Mein Körper", emoji: "🖐️" },
    { id: "emotions", label: "Gefühle", emoji: "😊" },
    { id: "home", label: "Zuhause", emoji: "🏠" },
  ],
};

export function getCategories(lang: Language): CategoryInfo[] {
  return CATEGORIES[lang];
}

const cache = new Map<Language, WordCard[]>();

/**
 * Loads the vocabulary list for a language from public/vocabulary-<lang>.json.
 * Kept client-side on purpose: the JSON stays editable without rebuilding.
 */
export async function loadVocabulary(
  lang: Language = "en",
): Promise<WordCard[]> {
  const hit = cache.get(lang);
  if (hit) return hit;
  const res = await fetch(`/vocabulary-${lang}.json`);
  if (!res.ok) {
    throw new Error(
      `Could not load vocabulary-${lang}.json (HTTP ${res.status})`,
    );
  }
  const data = (await res.json()) as WordCard[];
  cache.set(lang, data);
  return data;
}

export function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
