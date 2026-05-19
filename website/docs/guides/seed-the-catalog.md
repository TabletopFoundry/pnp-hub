---
title: Seeding the catalog
description: Reset, re-seed, and customize the demo data.
---

# Seeding the Catalog

PnP Hub ships with a rich seed dataset designed for layout stress testing and realistic-looking demos. This guide shows how to reset the catalog, bump the seed version, and add your own titles.

## When seeding runs

The seeder runs on the first database connection and on subsequent connections only if `SEED_VERSION` (declared in `lib/seed.ts`) is newer than the `catalog-version` stored in the `metadata` table.

In production, seeding is **blocked by default**. To opt in:

```bash
PNP_HUB_ALLOW_PRODUCTION_SEED=true npm run start
```

## Reset to a clean database

```bash
rm -f data/pnp-hub.db data/pnp-hub.db-wal data/pnp-hub.db-shm
npm run dev
```

The seeder runs on the next request to any route.

## Force a re-seed without deleting the file

Bump `SEED_VERSION` in `lib/seed.ts`:

```ts
// lib/seed.ts
export const SEED_VERSION = 7; // was 6
```

Restart the dev server. The seeder detects the bump, runs in a single transaction, updates seeded rows in place, and leaves designer drafts untouched.

## What gets seeded

| Dataset | Count |
|---|---|
| Published games | 56 |
| Designer profiles | 12 |
| Reviews | 100+ |
| Craft gallery entries | 24 |
| Tutorials | 18 |
| Craft-along schedule | 12 months |
| Designer geography rows | 90+ (country/month) |
| Designer metrics rows | 36 (3 designers × 12 months) |

The data is intentionally varied:

- Titles with **zero ratings** to stress empty-state UI.
- Designers with a **single game** vs. designers with many.
- **Long-form descriptions** to test layout overflow.
- A range of `accessType` and `category` values so filters always have results.

## Anatomy of a seeded game

Each seeded game is a plain TypeScript object in `lib/seed.ts`:

```ts
{
  slug: 'paper-arena',
  title: 'Paper Arena',
  tagline: 'Folded gladiators, kitchen-table battles.',
  description: '…',
  category: 'Strategy',
  status: 'published',
  playerMin: 2,
  playerMax: 4,
  playTime: '45–60 min',
  complexity: 3,
  ageRange: '12+',
  priceCents: 450,
  accessType: 'purchase',
  rating: 4.6,
  ratingCount: 87,
  designerName: 'Mara Holt',
  designerSlug: 'mara-holt',
  publishedAt: '2024-04-12',
  popularity: 92,
  isFeatured: true,
  isMonthlyCraft: false,
  assemblyEffort: 'Medium',
  paperRequirements: '12 sheets, US Letter or A4',
  estimatedInk: 'Color recommended',
  sheetCount: 12,
  cutDifficulty: 'Straight cuts only',
  paperStockRecommendation: '60-80 lb cover stock',
  cutGuide: 'Use a metal ruler and a fresh blade…',
  previewLayout: 'Standees + tokens on first 4 sheets…',
  componentSummary: '24 folded standees, 60 tokens, 4 player boards',
  components: ['24 standees', '60 tokens', '4 player boards', '1 rulebook'],
  gallery: ['/games/paper-arena/cover.png', '/games/paper-arena/board.png'],
}
```

## Adding your own game to the seed

See the dedicated [Add a game](./add-a-game) guide for a complete walkthrough.

## Inspecting the seeded database

`better-sqlite3` is also a command-line tool:

```bash
npx better-sqlite3 data/pnp-hub.db
sqlite> SELECT title, category, price_cents FROM games WHERE category = 'Strategy' LIMIT 5;
```

Or use any SQLite GUI (DB Browser for SQLite, TablePlus, DataGrip). The schema is small enough to browse end-to-end in a few minutes.
