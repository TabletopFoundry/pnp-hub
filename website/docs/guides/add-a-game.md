---
title: Add a game
description: "Step-by-step: add a new title to the seeded catalog."
---

# Add a game

This guide walks through adding a brand-new game to the seeded catalog. By the end, your title will appear in the marketplace, on the optimizer's game picker, and (if you want) on the designer dashboard.

## 1. Pick a slug

Slugs are unique, URL-safe, and lowercase. Verify yours isn't taken:

```bash
grep -R "slug: 'your-slug'" lib/seed.ts
```

## 2. Add the game object

Open `lib/seed.ts` and add your game to the `seededGames` array. Every field is required (TypeScript will tell you if you miss one):

```ts
{
  slug: 'tide-of-tiles',
  title: 'Tide of Tiles',
  tagline: 'A solo puzzle of currents and constellations.',
  description: 'Tide of Tiles is a 20-minute solo logic puzzle…',
  category: 'Solo',
  status: 'published',
  playerMin: 1,
  playerMax: 1,
  playTime: '20 min',
  complexity: 2,
  ageRange: '10+',
  priceCents: 200,
  accessType: 'purchase',
  rating: 0,           // 0 + ratingCount: 0 → "no ratings yet" UI
  ratingCount: 0,
  designerName: 'Mara Holt',
  designerSlug: 'mara-holt',  // must match an existing designer slug
  publishedAt: '2025-01-15',
  popularity: 0,
  isFeatured: false,
  isMonthlyCraft: false,
  assemblyEffort: 'Light',
  paperRequirements: '4 sheets, any size',
  estimatedInk: 'Black-and-white friendly',
  sheetCount: 4,
  cutDifficulty: 'Easy straight cuts',
  paperStockRecommendation: '32 lb printer paper or heavier',
  cutGuide: 'Cut along the dashed grid using scissors or a guillotine.',
  previewLayout: 'Sheets 1–3: tiles. Sheet 4: rules + reference.',
  componentSummary: '54 tiles, 1 rulebook',
  components: ['54 tiles', '1 rulebook'],
  gallery: [],
}
```

### Field guide

| Field | Notes |
|---|---|
| `category` | Must be one of `GAME_CATEGORIES` in `lib/constants.ts`. |
| `accessType` | Must be one of `ACCESS_TYPES`. If `'free'`, set `priceCents: 0`. |
| `designerSlug` | Must exist in `seededDesignerProfiles`. Add a new designer if needed. |
| `complexity` | Integer 1–5 (1 = light, 5 = heavy). |
| `popularity` | 0–100. Used as the default sort key in the marketplace. |
| `gallery` | Relative URLs under `public/`. Empty array is fine. |

## 3. Add a designer (optional)

If your designer doesn't exist yet, add an entry to `seededDesignerProfiles`:

```ts
{
  slug: 'your-name',
  name: 'Your Name',
  bio: 'One-sentence bio that will appear on the designer page.',
  yearStarted: 2024,
  links: { website: 'https://example.com' },
}
```

## 4. Bump the seed version

Open `lib/seed.ts` and increment `SEED_VERSION`:

```ts
export const SEED_VERSION = 7; // was 6
```

This tells the seeder to re-run on the next database connection.

## 5. Validate

```bash
npm run validate
```

Lint, typecheck, and tests should all pass. The type system catches the most common mistakes (typo in `category`, missing required field, wrong `accessType`).

## 6. View it

```bash
npm run dev
```

- Marketplace: http://localhost:3000/marketplace?category=Solo
- Detail page: http://localhost:3000/games/tide-of-tiles
- Optimizer: http://localhost:3000/optimizer?game=tide-of-tiles

## Troubleshooting

**My game doesn't appear.** Did you set `status: 'published'`? Drafts are excluded from the marketplace.

**TypeScript errors after editing seed.ts.** Run `npm run typecheck` — the error will name the missing field. Every property of every seed object is required.

**Re-seed didn't run.** Did you bump `SEED_VERSION`? Otherwise the seeder treats the database as up-to-date.
