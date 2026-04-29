# UX & DX Review 7 — PnP Hub

**Date:** 2025-07-25
**Reviewer perspective:** Senior engineer, fresh clone, delta audit against Reviews 1-6 + Code Reviews 1-3.
**Scope:** Only genuinely new P0/P1 findings not already flagged in any prior review document.

---

## Summary

PnP Hub continues to trend upward. All three P1 issues from Review 6 are resolved: filter changes now reset pagination (`params.delete('page')`), the search input uses `key={searchParams.toString()}` to stay in sync on back-navigation, and the `AnalyticsChart` tooltip formats revenue via `formatCurrency()`. The homepage and filter forms now import `GAME_CATEGORIES` from `lib/constants.ts` instead of hardcoding partial arrays, and the upload form also uses the shared constant. Lint, typecheck, and all 71 tests (30 data, 26 format, 5 constants, 10 component) pass cleanly. Three new P1 issues surface in this pass: the homepage stat card still says "7 categories" despite `GAME_CATEGORIES` now having 8 entries, the `MarketplaceFilters` type definition defeats the type safety established by closing `GameCategory` by appending `| string` to every field, and user-typed LIKE wildcards (`%`, `_`) are passed unescaped to SQLite search queries, producing unexpected results.

---

## Items Fixed Since Review 6 — Verified ✅

| Review 6 Item | Status |
|---|---|
| P1-1: Filter changes don't reset pagination | ✅ `marketplace-filter-form.tsx:22` — `if (key !== 'page') params.delete('page');` |
| P1-2: Search input stale on back-navigation | ✅ `marketplace-filter-form.tsx:63` — `key={searchParams.toString()}` forces re-mount |
| P1-3: AnalyticsChart tooltip displays raw cents | ✅ `analytics-chart.tsx:37-43,60-66` — both `<Tooltip>` use `formatter` with `formatCurrency()` |
| Quick-win: Import GAME_CATEGORIES in homepage | ✅ `app/page.tsx:7,17` — `const categories = GAME_CATEGORIES;` |
| Quick-win: Import GAME_CATEGORIES in upload form | ✅ `upload-form.tsx:9,51-54` — uses `GAME_CATEGORIES.map()` |
| Quick-win: Import GAME_CATEGORIES in filter form | ✅ `marketplace-filter-form.tsx:7,82-84` — uses `GAME_CATEGORIES.map()` |

---

## New Findings

### P1 — Should fix (significant UX/DX friction)

#### P1-1: Homepage stat card hardcodes "7" categories — now wrong after `Card` was added

**File:** `app/page.tsx:43`

The category fix from Review 5/6 added `'Card'` to `GAME_CATEGORIES` (making it 8 entries) and updated the homepage to import the constant. The category links section (line 75-78) now correctly renders all 8 categories. However, the stat card in the hero section was not updated:

```tsx
// app/page.tsx:41-44
{[
  ['30+', 'Seeded PnP games'],
  ['7', 'Curated marketplace categories'],   // ← should be '8'
  ['75/25', 'Designer revenue split'],
].map(([value, label]) => (
```

Users see "7 Curated marketplace categories" in the hero while counting 8 visible category links directly below it. This is a factual display error introduced when the `Card` category was added.

**Fix:** Change `'7'` to `String(GAME_CATEGORIES.length)` or simply `'8'` — but the dynamic approach is more resilient:

```tsx
[String(GAME_CATEGORIES.length), 'Curated marketplace categories'],
```

---

#### P1-2: `MarketplaceFilters` type defeats `GameCategory` union with `| string` on every field

**File:** `lib/types.ts:142-151`

Review 5 P1-4 fixed `GameCore.category` from `string` to `GameCategory` (closed union). But the `MarketplaceFilters` type still collapses every typed field:

```ts
export type MarketplaceFilters = {
  query?: string;
  category?: GameCategory | string;      // ← `| string` absorbs GameCategory
  players?: string;
  complexity?: ComplexityFilter | string; // ← `| string` absorbs ComplexityFilter
  price?: PriceFilter | string;          // ← `| string` absorbs PriceFilter
  rating?: string;
  sort?: SortKey | string;               // ← `| string` absorbs SortKey
  access?: AccessType | string;          // ← `| string` absorbs AccessType
};
```

In TypeScript, `'Strategy' | 'Party' | ... | string` simplifies to `string` — the union members are swallowed. This means:
- A typo like `filters.sort = 'newst'` compiles without error
- The type provides zero IntelliSense narrowing for valid values
- Runtime validation in `data.ts` catches invalid values, but compile-time safety is absent

This is distinct from the `GameCore.category` fix (Review 5 P1-4) because it's a different type definition and affects filter validation, not data modeling.

**Fix:** Remove the `| string` suffix on fields that have union types. Use the unions directly and cast from `searchParams` at the boundary:

```ts
export type MarketplaceFilters = {
  query?: string;
  category?: GameCategory;
  players?: string;
  complexity?: ComplexityFilter;
  price?: PriceFilter;
  rating?: string;
  sort?: SortKey;
  access?: AccessType;
};
```

Then in `marketplace/page.tsx`, cast from the raw string at the ingestion point where validation occurs.

---

#### P1-3: LIKE wildcards (`%`, `_`) in search input are not escaped — search produces unexpected results

**File:** `lib/data.ts:207-209`

The marketplace text search constructs a LIKE pattern by wrapping user input with `%`:

```ts
if (filters.query) {
  conditions.push(`(title LIKE ? OR tagline LIKE ? OR designer_name LIKE ?)`);
  const match = `%${filters.query.trim()}%`;
  params.push(match, match, match);
}
```

SQLite's `LIKE` operator treats `%` as "match any sequence" and `_` as "match any single character". These characters are **not** escaped before being embedded in the pattern. If a user types `_` in the search box, every game title with at least one character at that position matches. Searching for `%` returns all games.

**Reproduction:**
1. Go to `/marketplace`
2. Type `_` in the search box and press Enter
3. All 36 games appear — the `_` matches every single-character position
4. Type `%` — all 36 games appear

This is a search correctness bug, not a security issue (queries are parameterized). The fix is a 1-line escape:

```ts
if (filters.query) {
  conditions.push(`(title LIKE ? ESCAPE '\\' OR tagline LIKE ? ESCAPE '\\' OR designer_name LIKE ? ESCAPE '\\')`);
  const escaped = filters.query.trim().replace(/[%_\\]/g, '\\$&');
  const match = `%${escaped}%`;
  params.push(match, match, match);
}
```

---

## Previously Flagged Issues — Status Check

| Issue | First Flagged | Status |
|-------|--------------|--------|
| Filter/pagination reset | Review 6 P1-1 | ✅ Fixed — `marketplace-filter-form.tsx:22` |
| Search input stale on back-nav | Review 6 P1-2 | ✅ Fixed — `key={searchParams.toString()}` |
| Tooltip raw cents | Review 6 P1-3 | ✅ Fixed — `formatter` in both `<Tooltip>` |
| Homepage/forms missing Card category | Review 5 P2-3/6/7 | ✅ Fixed — all import `GAME_CATEGORIES` |
| `force-dynamic` on all pages | Review 1 P2 | ⚠️ Still present on all 5 route pages |
| No Prettier | Review 3 P2 | ⚠️ Still absent |
| Recharts not lazily loaded | Review 1 P2 | ⚠️ Still present — no `React.lazy()` |
| `?submitted=1` persists on refresh | Review 3 P2 | ⚠️ Still present |
| Recharts `<Tooltip>` keyboard-inaccessible | Review 3 P1 | ⚠️ Still present — upstream Recharts limitation |
| CI runs `npm ci` 2 times across 2 jobs | Review 5 P1 | ⚠️ Improved (down from 4), still no `node_modules` cache sharing |

---

## Quick Wins (< 1 day)

| # | Fix | Impact | Effort |
|---|-----|--------|--------|
| 1 | Change `'7'` → `String(GAME_CATEGORIES.length)` in `app/page.tsx:43` (P1-1) | Fixes factual display error in hero section | 1 min |
| 2 | Remove `\| string` from union fields in `MarketplaceFilters` type (P1-2) | Restores compile-time filter validation | 5 min |
| 3 | Escape `%`, `_`, `\` in search query before LIKE pattern + add `ESCAPE '\\'` clause (P1-3) | Fixes search correctness for special characters | 5 min |

---

## DX Scorecard

| Area | Grade | Trend | Notes |
|------|-------|-------|-------|
| Clone → Running | **A** | → | `npm install && npm run dev` works in <60s. SQLite auto-seeds. |
| Documentation | **A-** | → | README thorough. CONTRIBUTING.md exists. CI badge placeholder still `your-username`. |
| Code Organization | **A** | → | Clean separation: `lib/` for logic, `app/components/` for UI, `app/[route]/` for pages. |
| Type Safety | **A-** | → | `GameCore.category` is proper union. `MarketplaceFilters` still leaks via `\| string`. |
| Testing | **B+** | ↑ | 71 passing tests (30 data + 26 format + 5 constants + 10 component). `app/` page coverage still 0%. |
| Error Handling | **A** | → | Server action `try/catch`. `notFound()` in slug page. `global-error.tsx` at root. Timer cleanup via `useRef`. |
| CI/CD | **B** | → | 2 jobs. All checks pass. Still no `node_modules` caching across jobs. |
| Accessibility | **B+** | → | Skip-to-content, focus-ring, ARIA labels, focus trap in mobile nav, `aria-current` on pagination. |
| UX Consistency | **B+** | ↑ | Filter/pagination/search input all consistent now. Stat card "7" is the remaining inconsistency. |

---

## Overall Assessment

The codebase resolution rate remains excellent — all 3 Review 6 P1s are fixed, maintaining the 100% resolution streak from Review 5. The three new P1 findings are all quick fixes totaling under 15 minutes of work: the stat card is a 1-minute string change, the type union collapse is a 5-minute edit, and the LIKE escape is a 5-minute addition. No new P0 issues were found — the codebase has been P0-free since Review 6.

**Priority order for new findings:**
1. P1-1 (stat card "7" → "8") — visible factual error in the hero section
2. P1-3 (LIKE wildcard escape) — search returns wrong results for `%` and `_` input
3. P1-2 (MarketplaceFilters `| string`) — type safety gap, no user-visible impact but affects DX
