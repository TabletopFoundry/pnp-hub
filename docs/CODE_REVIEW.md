# Code Quality & Architecture Review — PnP Hub

**Reviewed:** 2025-07-14
**Codebase:** Next.js 16 + React 19 + SQLite (better-sqlite3) + Tailwind 4 + TypeScript 6
**Total source files:** ~30 · ~3,200 LOC (excluding generated/config)

---

## Executive Summary

| Dimension | Rating |
|---|---|
| **Overall Quality** | **B+** |
| **Architecture Health** | Good |
| **Maintainability Index** | High |
| **Technical Debt** | Low–Medium |

The PnP Hub MVP is a well-structured, idiomatic Next.js App Router project. It demonstrates strong fundamentals: strict TypeScript, clear server/client separation, proper use of `loading.tsx` skeletons, good accessibility patterns (skip-to-content, ARIA labels, focus traps), and clean data-layer isolation. The issues identified are proportional to MVP scope and can be addressed incrementally.

---

## Critical Findings (P0 — Must Address)

### P0-1: SQL Injection vector in `getMarketplaceGames`
**File:** `lib/data.ts:228`
**Severity:** Security
**Description:** The `LISTING_COLUMNS` constant and `orderBy` value are interpolated directly into the SQL string. While `LISTING_COLUMNS` is a hardcoded constant (safe today), `orderBy` is derived from a user-controlled `filters.sort` value that goes through a lookup map with a fallback. The pattern itself is fragile: if anyone adds a sort option whose value passes through without the map, it becomes injectable. More importantly, the `conditions` array entries are string-interpolated into the query, and while parameterized values are used for user data, the query-building pattern mixes safe and unsafe interpolation in a way that invites future mistakes.

```ts
// Current pattern — safe today but fragile
const sql = `SELECT ${LISTING_COLUMNS} FROM games WHERE ${conditions.join(' AND ')} ORDER BY ${orderBy}`;
```

**Fix:** Validate `orderBy` against an explicit allowlist with a compile-time type, or use a query builder. Add a defensive assertion:
```ts
const ALLOWED_SORTS = ['published_at DESC', 'popularity DESC', 'rating DESC, rating_count DESC', 'price_cents ASC, title ASC'] as const;
// assert orderBy is in ALLOWED_SORTS before interpolation
```

---

### P0-2: No input sanitization or length limits on server action
**File:** `app/designer/actions.ts:9-21`
**Severity:** Security / Data Integrity
**Description:** `createDesignerSubmission` trims `title` and `description` but performs no length validation, character filtering, or content sanitization. A malicious or errant client can insert arbitrarily long strings, potentially causing database bloat or downstream rendering issues.

**Fix:**
```ts
const MAX_TITLE = 200;
const MAX_DESCRIPTION = 5000;
if (title.length > MAX_TITLE) return { error: `Title must be under ${MAX_TITLE} characters.` };
if (description.length > MAX_DESCRIPTION) return { error: `Description must be under ${MAX_DESCRIPTION} characters.` };
```
Also validate `category` and `accessType` against the known union types from `lib/types.ts`.

---

### P0-3: `unstable_noStore` is imported from a deprecated/unstable API
**File:** `lib/data.ts:1`
**Severity:** Correctness / Upgrade Risk
**Description:** `unstable_noStore` is called at the top of every data-fetching function. This API is marked unstable in Next.js and may be removed. All pages already use `export const dynamic = 'force-dynamic'` which achieves the same effect, making the `noStore()` calls redundant.

**Fix:** Remove all `noStore()` calls from `lib/data.ts`. The `force-dynamic` export on each page already opts out of static rendering. If per-function opt-out is needed in the future, use the stable `cache: 'no-store'` fetch option or Next.js `unstable_cache` with revalidation.

---

## Architectural Concerns (P1)

### P1-1: `GameSummary` is a God Type — 35+ fields, mixed concerns
**File:** `lib/types.ts:4-41`
**Severity:** Maintainability
**Description:** `GameSummary` carries catalog metadata, print-optimization fields, designer analytics fields, gallery data, file uploads, and status in a single 35-field type. It is used for card listings (where most fields are unused), detail pages, optimizer views, and designer dashboards — violating Interface Segregation.

**Fix:** Decompose into focused types composed together:
```ts
type GameCore = { id, slug, title, tagline, description, category, status };
type GamePlayInfo = { playerMin, playerMax, playTime, complexity, ageRange };
type GamePricing = { priceCents, accessType };
type GamePrintProfile = { sheetCount, estimatedInk, cutDifficulty, ... };
type GameSummary = GameCore & GamePlayInfo & GamePricing & GamePrintProfile & { ... };
type GameListingView = GameCore & GamePlayInfo & GamePricing & { rating, ratingCount, designerName };
```

---

### P1-2: Near-identical mapping functions (`mapGame` / `mapListingGame`)
**File:** `lib/data.ts:55-144`
**Severity:** Duplication (DRY violation)
**Description:** `mapGame` (lines 55-94) and `mapListingGame` (lines 105-144) share ~35 identical field mappings. Only 3 lines differ (JSON parsing of `components`, `gallery`, and the presence of `components_json`/`gallery_json`). This is a copy-paste smell that will cause drift.

**Fix:** Extract a shared `mapCommonFields(row)` function and compose:
```ts
function mapCommonFields(row: ListingGameRow): Omit<GameSummary, 'components' | 'gallery'> { ... }
function mapGame(row: GameRow): GameSummary {
  return { ...mapCommonFields(row), components: JSON.parse(row.components_json), gallery: JSON.parse(row.gallery_json) };
}
function mapListingGame(row: ListingGameRow): GameSummary {
  return { ...mapCommonFields(row), components: [], gallery: [] };
}
```

---

### P1-3: Database singleton via mutable module-level variable
**File:** `lib/db.ts:16-18`
**Severity:** Testability / Reliability
**Description:** The database is stored in a module-scoped `let database` variable with lazy initialization. This makes testing difficult (no way to inject a test database), prevents proper cleanup, and relies on Node.js module caching behavior that differs between environments (edge, serverless).

**Fix:**
1. Expose a `resetDatabase()` for tests.
2. Consider wrapping in a class or using a factory pattern that accepts a config:
```ts
export function createDatabase(dbPath?: string): Database.Database { ... }
```

---

### P1-4: Hardcoded designer identity — no authentication model
**File:** `lib/seed.ts:11-12`, `lib/db.ts:182-183`
**Severity:** Architecture
**Description:** `CURRENT_DESIGNER_SLUG` and `CURRENT_DESIGNER_NAME` are exported constants used throughout the data layer. The designer dashboard, upload wizard, and analytics all assume a single hardcoded user. This is acceptable for an MVP demo but should be called out as a known architectural shortcut.

**Fix:** Document this as a known limitation. When auth is added, replace with a `getCurrentDesigner()` function that reads from the session/auth context, injected via a React Server Component context or middleware.

---

### P1-5: `seed.ts` is ~306 lines of inline data generation
**File:** `lib/seed.ts`
**Severity:** Maintainability / SRP Violation
**Description:** This file mixes data generation logic (slug creation, component building, description templating) with static seed data (blueprint rows, reviewer names, tutorial content, craft gallery entries). It's the second-largest source file and contains 7 builder functions.

**Fix:** Split into:
- `lib/seed-data.ts` — static data arrays (blueprints, tutorials, gallery items, reviewer names)
- `lib/seed-builders.ts` — builder functions (`buildComponents`, `buildDescription`, etc.)
- `lib/seed.ts` — re-exports the composed result (thin orchestrator)

---

### P1-6: No pagination on marketplace or designer game lists
**File:** `lib/data.ts:228-230`, `app/marketplace/page.tsx`
**Severity:** Scalability
**Description:** `getMarketplaceGames` returns all matching games with no `LIMIT` or `OFFSET`. With 36 seeded games this is fine, but the query pattern will cause performance issues at scale. The designer dashboard similarly fetches all games for a designer.

**Fix:** Add `page` and `pageSize` parameters to `getMarketplaceGames` and return `{ games, total }`. Add pagination UI in the marketplace page.

---

### P1-7: `JSON.parse` on database columns without error handling
**File:** `lib/data.ts:87-88, 92, 142`
**Severity:** Robustness
**Description:** `JSON.parse(row.components_json)` and `JSON.parse(row.gallery_json)` are called without try/catch. If the database contains malformed JSON (from a manual edit, migration error, or corruption), the entire page crashes.

**Fix:**
```ts
function safeJsonParse<T>(json: string, fallback: T): T {
  try { return JSON.parse(json) as T; } catch { return fallback; }
}
```

---

## Code Smell Inventory (P2)

### P2-1: Magic numbers in optimizer cost calculation
**File:** `app/components/optimizer-tool.tsx:56-60`
**Severity:** Readability
```ts
const paperMultiplier = paperSize === 'A4' ? 1.05 : 1;
const colorMultiplier = colorMode === 'Color' ? 0.18 : 0.08;
const duplexSavings = duplex === 'Duplex' ? 0.86 : 1;
const estimatedCost = Math.round(selectedGame.sheetCount * paperMultiplier * (0.16 + colorMultiplier) * duplexSavings * 100);
```

**Fix:** Extract named constants:
```ts
const A4_PAPER_MULTIPLIER = 1.05;
const COLOR_INK_COST_PER_SHEET = 0.18;
const BW_INK_COST_PER_SHEET = 0.08;
const BASE_PAPER_COST_PER_SHEET = 0.16;
const DUPLEX_SAVINGS_FACTOR = 0.86;
const DUPLEX_SHEET_FACTOR = 0.88;
```

---

### P2-2: Duplicate `slugify` implementation
**File:** `lib/seed.ts:64-69`, `lib/db.ts:203-207`
**Severity:** DRY Violation
**Description:** The slug generation logic is duplicated between `seed.ts` and `createDraftGame` in `db.ts`. The implementations are nearly identical regex pipelines.

**Fix:** Extract to `lib/format.ts` as `export function slugify(value: string): string`.

---

### P2-3: `GameRow` type duplicates the schema definition
**File:** `lib/data.ts:16-53`
**Severity:** Maintenance burden
**Description:** The `GameRow` type manually mirrors every column from the `CREATE TABLE` in `db.ts`. Any schema change requires updating both. There's no compile-time enforcement that they stay in sync.

**Fix:** Consider deriving types from a shared schema definition. At minimum, add a comment linking to the schema. For a more robust approach, use a library like `drizzle-orm` or `kysely` that generates types from the schema.

---

### P2-4: Inline CSS class strings are extremely long
**File:** Throughout (e.g., `app/layout.tsx:37`, `app/components/mobile-nav.tsx:133`)
**Severity:** Readability
**Description:** Many JSX elements have 100+ character `className` strings that mix structural, spacing, color, and interactive styles. While Tailwind makes this common, the longest strings hurt readability.

**Fix:** Use `clsx` (already a dependency!) to break long strings across lines:
```ts
className={clsx(
  'focus-ring rounded-full px-4 py-2',
  'text-sm font-medium transition',
  'hover:bg-white/70',
  pathname === item.href && 'bg-[var(--bg-forest-tint)] text-[var(--forest)]'
)}
```

---

### P2-5: `SubscriptionGrid` is rendered on both Home and Community pages
**File:** `app/page.tsx:124-130`, `app/community/page.tsx:90-96`
**Severity:** Minor Duplication
**Description:** The subscription grid with its surrounding heading/eyebrow markup is duplicated between pages. If pricing tiers change, both must be updated.

**Fix:** Extract a `<SubscriptionSection />` component that includes the heading + grid.

---

### P2-6: `createDraftGame` silently hardcodes default values
**File:** `lib/db.ts:209-238`
**Severity:** Hidden Logic
**Description:** The function hardcodes `player_min=1, player_max=4, play_time='30-45 min', complexity=2` and many placeholder strings. These defaults are invisible to the caller and not documented.

**Fix:** Either accept these as optional parameters with documented defaults, or extract a `DRAFT_DEFAULTS` constant object.

---

### P2-7: Test coverage is limited to utility functions only
**File:** `__tests__/format.test.ts`
**Severity:** Quality Risk
**Description:** Only `lib/format.ts` has tests (21 tests, all passing). The data layer (`lib/data.ts`, `lib/db.ts`), server actions (`app/designer/actions.ts`), and all components have zero test coverage. The most complex logic (marketplace filtering, draft creation, optimizer calculations) is untested.

**Fix (prioritized):**
1. **Data layer tests** — Test `getMarketplaceGames` filter combinations with an in-memory SQLite database
2. **Server action tests** — Test `createDesignerSubmission` validation edge cases
3. **Component tests** — Test `OptimizerTool` cost calculations (extract pure functions first)

---

### P2-8: `file.size >= 0` check always passes
**File:** `app/designer/actions.ts:16`
```ts
.filter((value): value is File => value instanceof File && value.size >= 0 && value.name.length > 0)
```
**Severity:** Logic Bug (Minor)
**Description:** `file.size >= 0` is always true for any `File` object (size is a non-negative integer). This likely intended to filter out empty files (`value.size > 0`).

**Fix:** Change to `value.size > 0` if the intent is to filter empty files, or remove the check entirely if any file reference is valid.

---

### P2-9: No `<Suspense>` boundary around `MarketplaceFilterForm`
**File:** `app/marketplace/page.tsx:47`
**Severity:** Framework Best Practice
**Description:** `MarketplaceFilterForm` uses `useSearchParams()` which in Next.js App Router requires a `<Suspense>` boundary to avoid the entire page from opting into client-side rendering during static generation. While the page is already `force-dynamic`, wrapping it is still a best practice for correctness.

**Fix:**
```tsx
<Suspense fallback={<div className="h-16 animate-pulse" />}>
  <MarketplaceFilterForm />
</Suspense>
```

---

### P2-10: Database files committed to repository
**File:** `.gitignore:3-4`, `data/pnp-hub.db*`
**Severity:** Repository Hygiene
**Description:** The `.gitignore` has `data/*.db` and `*.db` patterns, but the `data/pnp-hub.db`, `data/pnp-hub.db-shm`, and `data/pnp-hub.db-wal` files appear to be in the working tree. WAL/SHM files should never be committed.

**Fix:** Run `git rm --cached data/pnp-hub.db data/pnp-hub.db-shm data/pnp-hub.db-wal` and ensure the `.gitignore` patterns are correct. Add `data/*.db-shm` and `data/*.db-wal` patterns explicitly.

---

## SOLID Violations Summary

| Principle | Status | Details |
|---|---|---|
| **SRP** | ⚠️ Minor | `seed.ts` mixes data + logic; `db.ts` mixes schema + seeding + CRUD |
| **OCP** | ✅ Good | Filter system uses data-driven conditions; components are composable |
| **LSP** | ✅ Good | No inheritance hierarchies to violate |
| **ISP** | ⚠️ Moderate | `GameSummary` is used everywhere despite clients needing few fields (P1-1) |
| **DIP** | ⚠️ Minor | Data functions directly import database singleton; no injection seam (P1-3) |

---

## Refactoring Roadmap

### High Impact, Low Effort
1. **Remove `unstable_noStore` calls** (P0-3) — Delete 12 lines, zero risk
2. **Add input validation to server action** (P0-2) — ~15 lines
3. **Extract shared `mapCommonFields`** (P1-2) — Eliminate 35 lines of duplication
4. **Extract `slugify` to `lib/format.ts`** (P2-2) — Move + deduplicate
5. **Add named constants for optimizer math** (P2-1) — Readability win
6. **Fix `file.size >= 0` check** (P2-8) — One character change

### High Impact, Medium Effort
7. **Decompose `GameSummary` type** (P1-1) — Requires updating consumers
8. **Add data layer tests** (P2-7) — Test marketplace filtering logic
9. **Add pagination to marketplace** (P1-6) — DB + UI changes
10. **Add JSON parse safety** (P1-7) — Utility function + apply to all parse sites

### Medium Impact, Low Effort
11. **Split `seed.ts`** (P1-5) — File reorganization
12. **Use `clsx` for long classNames** (P2-4) — Gradual adoption
13. **Extract `SubscriptionSection` component** (P2-5) — Small refactor
14. **Add `<Suspense>` to filter form** (P2-9) — One wrapper element

### Foundational (for scaling beyond MVP)
15. **Replace module-level DB singleton with injectable factory** (P1-3)
16. **Introduce authentication model** (P1-4)
17. **Consider type-safe query builder** (P2-3) — Drizzle, Kysely, or similar

---

## Positive Observations

These patterns should be **preserved and extended**:

| Pattern | Location | Why It's Good |
|---|---|---|
| **Skip-to-content link** | `app/layout.tsx:25` | Accessibility best practice |
| **ARIA labels on decorative art** | `app/components/game-art.tsx:16` | Meaningful `role="img"` with descriptive labels |
| **Focus trap in mobile nav** | `app/components/mobile-nav.tsx:53-72` | Proper keyboard trap with Escape handler |
| **`loading.tsx` skeletons** | All route segments | Every page has a skeleton that matches layout structure |
| **Shared skeleton re-export** | `app/games/[slug]/loading.tsx` | `export { default } from '@/app/loading'` avoids duplication |
| **WAL mode for SQLite** | `lib/db.ts:26` | Correct pragma for concurrent reads |
| **Transactional seeding** | `lib/db.ts:167-186` | All seed data inserted atomically |
| **Server actions with `useActionState`** | `app/components/upload-form.tsx` | Modern React 19 pattern, progressive enhancement ready |
| **`useFormStatus` for pending UI** | `app/components/upload-submit-button.tsx` | Clean loading state without external state management |
| **Prepared statements** | `lib/db.ts` | All queries use parameterized prepared statements |
| **Custom CSS design tokens** | `app/globals.css` | Comprehensive token system with WCAG AA color notes |
| **`LISTING_COLUMNS` optimization** | `lib/data.ts:97-101` | Avoids fetching heavy JSON columns for list views |
| **Marketplace filter chips** | `app/components/marketplace-filter-form.tsx:164-172` | Active filters displayed as removable badges |
| **Printer profile persistence** | `app/components/optimizer-tool.tsx:27-42` | localStorage with hydration-safe mounting pattern |
| **`clsx` available as dependency** | `package.json:15` | Ready to use, just underutilized |

---

## Detailed Findings by File

### `lib/db.ts` (239 lines)
- **Lines 16-18:** Module-level singleton — testability concern (P1-3)
- **Lines 120-187:** `seedDatabase` is 67 lines with 6 prepared statements — consider extracting to a dedicated seeder module
- **Lines 193-238:** `createDraftGame` has 17 hardcoded placeholder strings — extract to constants (P2-6)
- **Lines 203-207:** Duplicated slug logic (P2-2)

### `lib/data.ts` (328 lines)
- **Line 1:** Unstable import (P0-3)
- **Lines 16-53:** `GameRow` type mirrors schema manually (P2-3)
- **Lines 55-94 / 105-144:** Near-identical mappers (P1-2)
- **Lines 172-231:** `getMarketplaceGames` is 59 lines — acceptable for query building but would benefit from extracted filter-condition builders
- **Line 228:** SQL string interpolation pattern (P0-1)

### `lib/seed.ts` (306 lines)
- **Lines 14-51:** 36-row `blueprintRows` array — fine as data, but file does too many things (P1-5)
- **Lines 64-69:** Duplicated `slugify` (P2-2)
- **Lines 109-164:** `buildSeedGames` is 55 lines with index-based math for deterministic variety — acceptable but document the patterns

### `app/designer/actions.ts` (34 lines)
- **Lines 9-21:** No length/type validation (P0-2)
- **Line 16:** `file.size >= 0` always true (P2-8)

### `app/components/optimizer-tool.tsx` (182 lines)
- **Lines 56-60:** Magic numbers (P2-1)
- Overall well-structured with clear state management and memoization

### `app/components/mobile-nav.tsx` (143 lines)
- Excellent accessibility implementation with 5 separate `useEffect` hooks for different behaviors
- Consider consolidating the escape and focus-trap handlers into a single event listener

### `app/games/[slug]/page.tsx` (169 lines)
- Largest page component but well-organized with clear sections
- Good use of `notFound()` for missing games

### `app/marketplace/page.tsx` (72 lines)
- Clean and focused
- Missing `<Suspense>` around `MarketplaceFilterForm` (P2-9)

---

## Metrics Summary

| Metric | Value | Status |
|---|---|---|
| Max file length | 328 lines (`lib/data.ts`) | ✅ Under 500 |
| Max function length | 67 lines (`seedDatabase`) | ⚠️ Borderline |
| Max cyclomatic complexity | ~12 (`getMarketplaceGames`) | ⚠️ Moderate |
| Max nesting depth | 3 levels | ✅ Acceptable |
| Max parameter count | 3 (`OptimizerToolProps`) | ✅ Good |
| Test coverage | 1/5 modules (~20%) | ⚠️ Low |
| TypeScript strict mode | Enabled | ✅ |
| ESLint config | Next.js recommended + TypeScript | ✅ |
| Dead code | None detected | ✅ |
| Circular dependencies | None detected | ✅ |
