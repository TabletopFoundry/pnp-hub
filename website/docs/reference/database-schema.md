---
title: Database schema
description: Tables, columns, and indexes used by PnP Hub.
---

# Database Schema

The schema is defined in [`lib/db.ts`](https://github.com/TabletopFoundry/pnp-hub/blob/main/lib/db.ts) inside `initSchema()`. All tables use `CREATE TABLE IF NOT EXISTS`, so the function is idempotent.

## `games`

The catalog. One row per published or draft game.

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `slug` | TEXT UNIQUE NOT NULL | URL identifier. |
| `title` | TEXT NOT NULL | Max length enforced by `MAX_TITLE_LENGTH`. |
| `tagline` | TEXT NOT NULL | One-line hook for cards. |
| `description` | TEXT NOT NULL | Long-form. Max `MAX_DESCRIPTION_LENGTH`. |
| `category` | TEXT NOT NULL | One of `GAME_CATEGORIES`. |
| `player_min`, `player_max` | INTEGER NOT NULL | |
| `play_time` | TEXT NOT NULL | Free-form (e.g. "45–60 min"). |
| `complexity` | INTEGER NOT NULL | 1–5. |
| `price_cents` | INTEGER NOT NULL | Always integer cents. |
| `access_type` | TEXT NOT NULL | One of `ACCESS_TYPES`. |
| `rating`, `rating_count` | REAL, INTEGER | 0 + 0 = "no ratings". |
| `designer_name`, `designer_slug` | TEXT NOT NULL | Denormalized for display. |
| `published_at` | TEXT NOT NULL | ISO 8601 date. |
| `popularity` | INTEGER NOT NULL | 0–100. Default marketplace sort. |
| `is_featured`, `is_monthly_craft` | INTEGER (boolean) | 0 or 1. |
| `age_range` | TEXT NOT NULL | e.g. "12+". |
| `assembly_effort` | TEXT NOT NULL | e.g. "Medium". |
| `paper_requirements` | TEXT NOT NULL | |
| `estimated_ink` | TEXT NOT NULL | |
| `sheet_count` | INTEGER NOT NULL | |
| `cut_difficulty` | TEXT NOT NULL | |
| `paper_stock_recommendation` | TEXT NOT NULL | |
| `cut_guide` | TEXT NOT NULL | |
| `preview_layout` | TEXT NOT NULL | |
| `component_summary` | TEXT NOT NULL | One-line summary. |
| `components_json` | TEXT NOT NULL | JSON array of component strings. |
| `gallery_json` | TEXT NOT NULL | JSON array of image URLs. |
| `revenue_cents` | INTEGER NOT NULL DEFAULT 0 | Designer's share already applied. |
| `download_count` | INTEGER NOT NULL DEFAULT 0 | |
| `status` | TEXT NOT NULL DEFAULT 'published' | One of `GameStatus`. |
| `uploaded_files_json` | TEXT NOT NULL DEFAULT '[]' | For draft uploads. |

## `reviews`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK AUTOINCREMENT | |
| `game_id` | INTEGER NOT NULL | FK → `games(id)`. |
| `author` | TEXT NOT NULL | |
| `title`, `body` | TEXT NOT NULL | |
| `rating` | INTEGER NOT NULL | 1–5. |
| `created_at` | TEXT NOT NULL | ISO 8601. |
| `verified` | INTEGER NOT NULL DEFAULT 1 | Boolean. |

## `tutorials`

| Column | Type | Notes |
|---|---|---|
| `id` | INTEGER PK | |
| `slug` | TEXT UNIQUE NOT NULL | |
| `title`, `summary`, `body` | TEXT NOT NULL | |
| `linked_game_slug` | TEXT NULL | Optional FK-by-slug to `games`. |
| `difficulty` | TEXT NOT NULL | "Beginner" / "Intermediate" / "Advanced". |
| `read_minutes` | INTEGER NOT NULL | |
| `published_at` | TEXT NOT NULL | |

## `craft_gallery`, `craft_along`, `designer_profiles`, `designer_geography`, `designer_metrics`

These follow the same patterns — see `lib/db.ts` for the canonical definitions. Key points:

- All FKs are by **slug**, not numeric id, to keep the seed file readable.
- All timestamps are ISO 8601 strings, not Unix epochs.
- All arrays are stored as JSON text columns named `<thing>_json`.

## `metadata`

A tiny key-value table:

```sql
CREATE TABLE IF NOT EXISTS metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

Currently used for one key: `catalog-version`. The seeder reads this on startup and compares against `SEED_VERSION` in `lib/seed.ts`.

## Pragmas

Set on every connection in `lib/db.ts`:

```sql
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
```

## Why no migrations framework?

The schema is small and stable. `CREATE TABLE IF NOT EXISTS` is sufficient for additive changes. If you ever need destructive migrations (rename column, change type), bump `SEED_VERSION` and write the migration as an `ALTER TABLE` in `initSchema()` guarded by a presence check on the older column.
