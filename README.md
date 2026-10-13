# TapTalk — AAC English Vocabulary Board

TapTalk is an English language learning web application built on
Augmentative and Alternative Communication (AAC) principles: tap a
picture, and the app shows the word as text and speaks it aloud with
browser text-to-speech. This reduces verbal pressure while building
both receptive skills (understanding) and expressive skills
(producing) — useful for non-verbal or minimally verbal children,
especially children on the autism spectrum who process visual
information strongly.

Built with **Next.js (App Router) + React + TypeScript + Tailwind CSS**.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Production build & serve:

```bash
npm run build
npm start
```

## How it works

### Picture board (`/`)

- A grid of large picture cards, grouped into categories
  (colors, shapes, numbers, animals, food, body, feelings, home).
- Tapping a card opens a detail panel with the word in large text,
  a short description, and a "Hear it again" button — and immediately
  speaks the word with text-to-speech.
- The sound toggle in the header turns audio off/on (text stays
  available either way). The preference is saved in the browser.

### Listening quiz (`/quiz`)

Receptive practice: the app speaks a word, the child taps the
matching picture out of four. Correct answers get a green pulse and
a "Yes!"; wrong answers just shake gently and replay the word — no
penalty, low pressure. A short score summary shows how many rounds
were solved on the first tap.

### Audio

Audio is the browser's built-in Web Speech API
(`speechSynthesis`) — no API keys, no network calls, works offline in
any modern browser. The app prefers an `en-US` voice when one is
available. Voice quality depends on the device (e.g. Chrome/Edge on
Windows ship good English voices; Linux may need installed voices).

## Vocabulary data (how to add words)

All vocabulary lives in **`public/vocabulary.json`** — a JSON array of
objects:

```json
[
  {
    "id": "food-apple",
    "category": "food",
    "word": "Apple",
    "description": "A red fruit you can eat",
    "image": "/images/food/apple.svg"
  }
]
```

- `image` is the path of the picture **inside `public/`**.
- `word` is spoken by text-to-speech and shown in large text.
- `description` is shown under the word.
- `category` must be one of: `colors`, `shapes`, `numbers`, `animals`,
  `food`, `body`, `emotions`, `home`.

To add a new word:

1. Put the image in `public/images/<category>/` (e.g. `duck.svg`).
2. Add an entry to `public/vocabulary.json`.
3. Done — the JSON is fetched at runtime, so no rebuild is needed.

For a whole new category, also add it to `CATEGORIES` and `CategoryId`
in `src/lib/vocabulary.ts`.

## Project structure

```
public/
  vocabulary.json          # the word list (link + word + description)
  images/<category>/*.svg # picture assets
src/
  app/
    layout.tsx             # shell: header, sound provider, footer
    page.tsx               # picture board
    quiz/page.tsx          # listening quiz
    globals.css            # theme + animations
  components/
    Card.tsx               # tappable picture card
    CategoryBar.tsx        # category filter chips
    DetailOverlay.tsx      # word + description + speak button
    Header.tsx             # nav + sound toggle
    SoundContext.tsx       # sound on/off, persisted
  lib/
    speech.ts              # Web Speech API helpers (en-US preferred)
    vocabulary.ts          # types, category list, JSON loader
```

## Design notes

- Big touch targets, calm palette, high-contrast outlines — visual
  first, not over-stimulating.
- Audio only plays on tap (never on load), and can be switched off.
- Animations respect `prefers-reduced-motion`.
- Keyboard accessible: cards are buttons, Escape closes the detail
  panel.
# taptalk
