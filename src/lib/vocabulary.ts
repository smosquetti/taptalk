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

export const CATEGORIES: CategoryInfo[] = [
  { id: "colors", label: "Colors", emoji: "🎨" },
  { id: "shapes", label: "Shapes", emoji: "⭐" },
  { id: "numbers", label: "Numbers", emoji: "🔢" },
  { id: "animals", label: "Animals", emoji: "🐶" },
  { id: "food", label: "Food", emoji: "🍎" },
  { id: "body", label: "My Body", emoji: "🖐️" },
  { id: "emotions", label: "Feelings", emoji: "😊" },
  { id: "home", label: "Home", emoji: "🏠" },
];

let cache: WordCard[] | null = null;

/**
 * Loads the vocabulary list from public/vocabulary.json.
 * Kept client-side on purpose: the JSON stays editable without rebuilding.
 */
export async function loadVocabulary(): Promise<WordCard[]> {
  if (cache) return cache;
  const res = await fetch("/vocabulary.json");
  if (!res.ok) {
    throw new Error(`Could not load vocabulary.json (HTTP ${res.status})`);
  }
  const data = (await res.json()) as WordCard[];
  cache = data;
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
