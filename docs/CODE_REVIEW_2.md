# Code Quality & Architecture Review — PnP Hub (Follow-up)

**Reviewed:** 2025-07-17
**Baseline:** `docs/CODE_REVIEW.md` (2025-07-14)
**Scope:** Delta review — only issues that are genuinely new or remain unfixed from the first review.
**Codebase:** Next.js 16 + React 19 + SQLite (better-sqlite3) + Tailwind 4 + TypeScript 6
**Total source files:** ~30 · ~2,700 LOC (excluding generated/config)

---

## Executive Summary

| Dimension | Rating | Δ from CODE_REVIEW |
|---|---|---|
| **Overall Quality** | **A−** | ↑ from B+ |
| **Architecture Health** | Good → Very Good | ↑ |
| **Maintainability Index** | High | → |
| **Technical Debt** | Low | ↓ from Low–Medium |

The team addressed **9 of 13** findings from the first review. All P0 items (SQL injection risk, input validation, unstable API) are resolved. Key structural improvements include type decomposition (`GameSummary` → 7 focused types), shared mapper extraction, pagination support, and `safeJsonParse`. The codebase is now meaningfully cleaner.

This follow-up focuses on **4 unfixed items that still matter** and **5 genuinely new findings** surfaced during deeper analysis.

---

## Status of Previous Findings

| ID | Title | Status | Notes |
|---|---|---|---|
| P0-1 | SQL injection vector in sort | ✅ **Fixed** | `resolveOrderBy` + `SORT_MAP` allowlist |
| P0-2 | No input validation on server action | ✅ **Fixed** | Length limits, category/accessType validation |
| P0-3 | `unstable_noStore` usage | ✅ **Fixed** | All calls removed |
| P1-1 | `GameSummary` god type | ✅ **Fixed** | Decomposed into 7 focused types |
| P1-2 | Duplicate mappers | ✅ **Fixed** | `mapCommonFields` extracted |
| P1-3 | DB singleton untestable | ✅ **Fixed** | `createDatabase()` + `resetDatabase()` |
| P1-6 | No pagination | ✅ **Fixed** | `PaginatedResult<T>` with count + offset |
| P1-7 | JSON.parse without safety | ✅ **Fixed** | `safeJsonParse<T>` utility |
| P2-8 | `file.size >= 0` always true | ✅ **Fixed** | Changed to `> 0` |
| P2-2 | Duplicate `slugify` | ❌ **Open** | Still in `seed.ts:64` and `db.ts:217-220` |
| P2-9 | No `<Suspense>` on filter form | ❌ **Open** | `MarketplaceFilterForm` still unwrapped |
| P2-4 | Long inline className strings | ❌ **Open** | No `clsx` adoption yet |
| P2-5 | Duplicate SubscriptionGrid sections | ❌ **Open** | Still duplicated across Home + Community |

---

## New Findings — P0 (Must Address)

### P0-N1: `redirect()` after `createDraftGame` throws inside `useActionState` without try/catch

**File:** `app/designer/actions.ts:63-64`, `app/components/upload-form.tsx:15-19`
**Severity:** Correctness bug

Next.js `redirect()` works by throwing a special `NEXT_REDIRECT` error. When called inside a server action that's wrapped by `useActionState`, the thrown redirect is caught by the action state handler and treated as an unhandled error rather than a navigation event. The `redirect()` on line 64 of `actions.ts` will either:

1. Work by accident (Next.js may detect the special error internally), or
2. Cause the form to show an unhandled error state instead of navigating.

This is a known Next.js footgun when combining `redirect()` with `useActionState`.

```ts
// Current — fragile
export async function createDesignerSubmission(formData: FormData): Promise<{ error: string } | null> {
  // ... validation ...
  createDraftGame({ ... });
  revalidatePath('/designer');
  redirect('/designer?submitted=1');  // throws NEXT_REDIRECT
}
```

**Fix:** Move `redirect()` outside the action return path, or restructure so the action returns a success signal and the client handles navigation:

```ts
// Option A: Return success, redirect on client
export async function createDesignerSubmission(formData: FormData): Promise<{ error?: string; success?: boolean } | null> {
  // ... validation ...
  createDraftGame({ ... });
  revalidatePath('/designer');
  return { success: true };
}

// In UploadForm: check state.success and call router.push('/designer?submitted=1')
```

```ts
// Option B: Keep redirect but call it after try/catch boundary
// Next.js 15+ handles this more gracefully, but explicit is safer
```

---

## New Findings — P1 (Should Address)

### P1-N1: `getMarketplaceGames` count query uses spread params without binding — potential mismatch

**File:** `lib/data.ts:237-238`
**Severity:** Correctness risk

The count query and the paginated query share the same `params` array via `...params`. The paginated query appends `pageSize, offset` to the spread. This works today, but the pattern is fragile: if a future filter adds a param conditionally between the count and paginated calls, or if the params array is mutated, the bindings silently shift.

```ts
const { total } = getDatabase().prepare(countSql).get(...params) as { total: number };
// ... later ...
const rows = getDatabase().prepare(sql).all(...params, pageSize, offset) as ListingGameRow[];
```

**Fix:** Clone the params for safety, or build a helper that returns `{ sql, params }` tuples for both queries from a single filter-building pass:

```ts
const filterParams = [...params]; // defensive copy
const { total } = getDatabase().prepare(countSql).get(...filterParams) as { total: number };
const rows = getDatabase().prepare(sql).all(...filterParams, pageSize, offset) as ListingGameRow[];
```

---

### P1-N2: `GameListingView` carries 25+ fields but card rendering uses only ~10

**File:** `lib/types.ts:72-77`, `app/components/game-card.tsx`
**Severity:** Unnecessary data transfer / ISP

`GameListingView` is a union of `GameCore & GamePlayInfo & GamePricing & GamePrintProfile & GameDesignerInfo & GameCatalogMeta` — roughly 30 fields. But `GameCard` only uses `slug`, `title`, `tagline`, `category`, `accessType`, `priceCents`, `playerMin`, `playerMax`, `playTime`, `complexity`, `rating`, `ratingCount`. The full `GamePrintProfile` (9 fields) and most of `GameDesignerInfo` are fetched from SQLite and mapped but never rendered in card views.

The `LISTING_COLUMNS` query already excludes the heaviest JSON columns, but it still selects all 34 non-JSON columns. For 36 games this is negligible, but the type contract implies consumers need print profiles, which they don't.

**Fix:** Introduce a `GameCardView` type for the card component prop:

```ts
export type GameCardView = GameCore &
  Pick<GamePlayInfo, 'playerMin' | 'playerMax' | 'playTime' | 'complexity'> &
  GamePricing &
  Pick<GameCatalogMeta, 'rating' | 'ratingCount'>;
```

Keep `GameListingView` for pages that genuinely need the full listing (designer dashboard table). This also narrows the SQL select for card-only use cases.

---

### P1-N3: `.gitignore` does not cover WAL/SHM files explicitly

**File:** `.gitignore:3-4`
**Severity:** Repository hygiene

The patterns `data/*.db` and `*.db` match the main database file but not the WAL journal (`pnp-hub.db-wal`) or shared memory file (`pnp-hub.db-shm`). While these don't appear to be tracked currently, a developer who creates the database and runs `git add .` will pick them up.

**Fix:** Add explicit patterns:

```gitignore
data/*.db
data/*.db-wal
data/*.db-shm
*.db
*.db-wal
*.db-shm
```

---

## New Findings — P2 (Nice to Have)

### P2-N1: Revenue split hardcoded as `0.75` magic number

**File:** `lib/data.ts:338`
**Severity:** Readability / Business logic buried in data layer

```ts
payoutShare: Math.round(totalRevenue * 0.75),
platformShare: totalRevenue - Math.round(totalRevenue * 0.75),
```

The 75/25 split is a core business rule mentioned in the UI, PRD, and home page. It appears as a magic number in the data layer with no named constant.

**Fix:**

```ts
const DESIGNER_REVENUE_SHARE = 0.75;
// ...
payoutShare: Math.round(totalRevenue * DESIGNER_REVENUE_SHARE),
platformShare: totalRevenue - Math.round(totalRevenue * DESIGNER_REVENUE_SHARE),
```

---

### P2-N2: `error.tsx` and `global-error.tsx` are near-identical

**Files:** `app/error.tsx` (16 lines), `app/global-error.tsx` (22 lines)
**Severity:** Minor duplication

Both files share the same heading, description pattern, and button. `global-error.tsx` adds the `<html>` and `<body>` wrappers (required by Next.js). The inner content panel is identical.

**Fix:** Extract an `ErrorContent` component:

```tsx
// app/components/error-content.tsx
export function ErrorContent({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="paper-panel rounded-[2rem] border border-[var(--border-light)] p-8 text-center">
      {/* shared content */}
    </div>
  );
}
```

---

## Previously Reported — Still Open (Reprioritized)

### P2-2 → P2 (unchanged): Duplicate `slugify`

**Files:** `lib/seed.ts:64-69`, `lib/db.ts:217-220`

The slug generation logic is still duplicated. `seed.ts` has a standalone `slugify()` function; `db.ts:createDraftGame` has inline regex. Both use the same `.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')` pipeline.

**Fix:** Extract to `lib/format.ts`:

```ts
export function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
```

Import from both `seed.ts` and `db.ts`.

---

### P2-9 → P2 (unchanged): No `<Suspense>` around `MarketplaceFilterForm`

**File:** `app/marketplace/page.tsx:53`

`MarketplaceFilterForm` calls `useSearchParams()` which requires a `<Suspense>` boundary in Next.js App Router. While the page is `force-dynamic`, this remains a correctness best practice and will become required if the page is ever made static.

---

## Refactoring Roadmap (New + Remaining)

### High Impact, Low Effort
1. **Add `.gitignore` patterns for WAL/SHM** (P1-N3) — 2 lines
2. **Extract `slugify` to `lib/format.ts`** (P2-2, still open) — move + deduplicate
3. **Extract `DESIGNER_REVENUE_SHARE` constant** (P2-N1) — 2 lines
4. **Add `<Suspense>` around `MarketplaceFilterForm`** (P2-9, still open) — 1 wrapper

### Medium Impact, Medium Effort
5. **Fix `redirect()` in `useActionState` flow** (P0-N1) — restructure action return type
6. **Defensive copy for count/paginated query params** (P1-N1) — 1 line
7. **Extract `ErrorContent` component** (P2-N2) — small refactor

### Lower Priority (Design Improvement)
8. **Introduce `GameCardView` type** (P1-N2) — narrow card prop contract
9. **Adopt `clsx` for long classNames** (P2-4, still open) — gradual

---

## Positive Observations (New)

| Pattern | Location | Why It's Good |
|---|---|---|
| **Type decomposition** | `lib/types.ts:5-69` | 7 focused types composed via intersection — textbook ISP |
| **`safeJsonParse` utility** | `lib/data.ts:19-25` | Generic, fallback-based, null-safe |
| **Sort allowlist with compile-time type** | `lib/data.ts:123-132` | `SortKey` type + `SORT_MAP` record — safe SQL interpolation |
| **`PaginatedResult<T>` generic** | `lib/data.ts:157-163` | Reusable pagination envelope |
| **`createDatabase` / `resetDatabase`** | `lib/db.ts:22-34, 256-261` | Testable factory + cleanup hook |
| **Comprehensive validation in server action** | `app/designer/actions.ts:9-52` | Length limits, enum validation, `satisfies` type check |
| **`DRY shared mapper`** | `lib/data.ts:72-104` | `mapCommonFields` eliminates 35 lines of duplication |

---

## Metrics Summary (Updated)

| Metric | Value | Status | Δ |
|---|---|---|---|
| Max file length | 344 lines (`lib/data.ts`) | ✅ Under 500 | ↑ 16 lines (pagination) |
| Max function length | ~60 lines (`getMarketplaceGames`) | ⚠️ Borderline | → |
| Max cyclomatic complexity | ~12 (`getMarketplaceGames`) | ⚠️ Moderate | → |
| Max nesting depth | 3 levels | ✅ Acceptable | → |
| Max parameter count | 3 (`getMarketplaceGames`) | ✅ Good | → |
| Test coverage | 1/5 modules (~20%) | ⚠️ Low | → |
| TypeScript strict mode | Enabled + `noUncheckedIndexedAccess` | ✅ Excellent | → |
| Previous P0 findings open | 0 | ✅ All resolved | ↓ from 3 |
| Previous P1 findings open | 0 (of original) | ✅ All resolved | ↓ from 7 |
| New findings | 1 P0 · 3 P1 · 2 P2 | — | — |
