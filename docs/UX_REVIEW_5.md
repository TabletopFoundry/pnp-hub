# UX & DX Review 5 — PnP Hub

**Date:** 2025-07-24
**Reviewer perspective:** Senior engineer, fresh clone, full audit of UX + DX.
**Scope:** Only genuinely new findings not already flagged in UX_REVIEW 1-4, CODE_REVIEW 1-2, or IMPROVEMENTS.md.

---

## Summary

PnP Hub has improved significantly since the first review cycle. The previous P0 issues (nested `<html>` in `error.tsx`, SQL injection, missing skip-to-content, broken coverage command, silent category rejection) have all been resolved. Lint, typecheck, and tests (46 specs across 3 files) all pass cleanly. The data layer is well-structured with safe JSON parsing, sort allowlists, pagination, and parameterized queries. However, fresh friction remains in several areas: uncleaned timers risk state-update-after-unmount warnings, the server action lacks `try/catch` around the database write, `MarketplaceFilterForm` is not wrapped in `<Suspense>` (causing the entire marketplace page to become client-rendered), and the test suite has zero component/UI coverage despite React Testing Library being installed. The DX is solid for a demo MVP — a new engineer can `npm install && npm run dev` and be running in under 60 seconds — but the CI pipeline runs `npm ci` four times and a Prettier config is still absent.

---

## New Findings

### P0 — Must fix (correctness, data loss, or crash risk)

#### P0-1: Server action `createDesignerSubmission` has no `try/catch` around `createDraftGame()`

**File:** `app/designer/actions.ts:53-63`

The function validates inputs thoroughly (lines 25-51) but then calls `createDraftGame()` with no error handling. If the SQLite write fails (disk full, schema mismatch, unique constraint on slug collision), the unhandled exception will crash the server action and Next.js will surface an opaque "An error occurred in the Server Components render" to the user, with no actionable recovery.

```ts
// Current — no try/catch
createDraftGame({ ... });
revalidatePath('/designer');
return { success: true };
```

**Fix:** Wrap in `try/catch` and return `{ error: '...' }` on failure, matching the existing `SubmissionResult` shape.

---

#### P0-2: `setTimeout` callbacks in `DownloadButton` and `MockActionButton` are never cleaned up

**Files:** `app/components/download-button.tsx:17-19`, `app/components/mock-action-button.tsx:19-20`

Both components fire `window.setTimeout(() => setState(...), delay)` inside click handlers without storing or clearing the timer ID. If the component unmounts before the timer fires (e.g., user navigates away mid-download), React will log a state-update-on-unmounted-component warning and the callback targets stale state. With `StrictMode` + concurrent features in React 19 this can manifest as visible glitches.

```tsx
// download-button.tsx — two orphaned timers per click
onClick={() => {
  setStatus('pending');
  window.setTimeout(() => setStatus('done'), 1400);   // never cleared
  window.setTimeout(() => setStatus('idle'), 2800);    // never cleared
}}
```

**Fix:** Store timer IDs in a `useRef` and clear them in a `useEffect` cleanup or on the next click.

---

### P1 — Should fix (significant UX/DX friction)

#### P1-1: `MarketplaceFilterForm` is a client component using `useSearchParams()` — but it is not wrapped in `<Suspense>`

**File:** `app/marketplace/page.tsx:53`

`MarketplaceFilterForm` calls `useSearchParams()` (line 9 of `marketplace-filter-form.tsx`). Per the Next.js 14+ docs, any component using `useSearchParams()` must be wrapped in a `<Suspense>` boundary. Without it, the entire route falls back to client-side rendering during the initial load, defeating SSR and hurting LCP. This was flagged as a P2 in CODE_REVIEW but is more impactful than acknowledged — it means the marketplace page can never be partially static-rendered even if `force-dynamic` were removed later.

**Fix:** Wrap `<MarketplaceFilterForm />` in `<Suspense fallback={<FilterSkeleton />}>`.

---

#### P1-2: Zero component/UI test coverage despite React Testing Library being a devDependency

**Files:** `__tests__/*.test.ts`, `package.json:39`

All 46 tests are data-layer integration tests (`data.test.ts`, `format.test.ts`, `constants.test.ts`). `@testing-library/react` and `jsdom` are installed but unused — no component renders are tested anywhere. This means regressions in GameCard, UploadForm, OptimizerTool, or MobileNav will only be caught visually. The existing test coverage claim is misleading because the `app/` directory has 0% coverage.

**Fix:** Add at least one smoke-render test per shared component (`GameCard`, `UploadForm`, `OptimizerTool`, `MobileNav`, `DownloadButton`) to validate they mount without errors.

---

#### P1-3: Marketplace pagination UI is missing — pagination logic exists server-side but the page never renders page controls

**Files:** `lib/data.ts:182-188` (returns `PaginatedResult` with `page`, `totalPages`), `app/marketplace/page.tsx:38-76`

`getMarketplaceGames()` returns `{ items, total, page, pageSize, totalPages }`, but the marketplace page only renders `result.items` — there are no next/prev links, no page number display, and no way for users to navigate beyond the first page. With `DEFAULT_PAGE_SIZE = 24` and 30+ seeded games, games beyond position 24 are silently inaccessible. The pagination data is computed (including offset queries) but never surfaced in the UI.

**Fix:** Add a pagination component below the game grid that reads `result.page` / `result.totalPages` and generates `?page=N` links.

---

#### P1-4: `GameCore.category` is typed as `string` instead of `GameCategory` union

**File:** `lib/types.ts:21`

The `GameCategory` union type exists (`'Strategy' | 'Party' | 'Family' | ...`) and is used in `constants.ts` and `actions.ts` for validation, but `GameCore.category` is declared as plain `string`. This allows any arbitrary string to flow through the type system unchecked. Components like `GameArt` use `categoryColors[category]` which falls back silently, and filter logic in `getMarketplaceGames` accepts unvalidated category params. Previous review 4 flagged "union collapses to string" but the actual type definition in `GameCore` — the root cause — was not identified.

**Fix:** Change `category: string` to `category: GameCategory` in `GameCore`, and adjust mappers to cast from DB row strings.

---

#### P1-5: CI runs `npm ci` 4 times across 4 jobs — no dependency caching between jobs

**File:** `.github/workflows/ci.yml:23,35,47,59`

Each of the four CI jobs (lint, typecheck, test, build) runs `npm ci` independently. While `actions/setup-node` with `cache: 'npm'` caches the npm download cache, it does not share the installed `node_modules` across jobs. This means `better-sqlite3` native compilation (the most expensive step) happens 4 times per CI run.

**Fix:** Either consolidate lint + typecheck + test into a single job (they're fast), or use a shared `actions/cache` step on `node_modules` with a `package-lock.json` hash key.

---

#### P1-6: Optimizer page title uses template string instead of template metadata

**File:** `app/optimizer/page.tsx:9`

```ts
title: 'Print Optimizer — PnP Hub',
```

The root layout defines `title: { template: '%s — PnP Hub' }` (layout.tsx:10-11). But the optimizer page hardcodes the full title including the suffix, resulting in a double-suffixed `<title>` of "Print Optimizer — PnP Hub — PnP Hub" at render time.

**Fix:** Change to `title: 'Print Optimizer'` and let the template handle the suffix.

---

### P2 — Nice to have (polish, consistency, minor DX)

#### P2-1: No `<Suspense>` boundary around `AnalyticsChart` (Recharts)

**File:** `app/designer/page.tsx:90`

Recharts is a heavy client-side library (~300KB parsed). `AnalyticsChart` is rendered inline on the designer page without a `<Suspense>` boundary. This means the entire Recharts bundle must be loaded before the page becomes interactive. A `<Suspense>` + `React.lazy()` wrapper would let the rest of the dashboard hydrate first.

---

#### P2-2: `UploadForm` navigates after success via `router.push` inside `useEffect` — race condition risk

**File:** `app/components/upload-form.tsx:22-26`

```ts
useEffect(() => {
  if (state?.success) {
    router.push('/designer?submitted=1');
  }
}, [state, router]);
```

If the server action completes and then the component re-renders before `router.push` executes, the effect may fire twice under StrictMode. Additionally, the navigation happens client-side rather than server-side (`redirect()`), which was intentionally avoided per a prior review — but the current `useEffect` approach introduces a flash of the success-less page before redirecting.

---

#### P2-3: `categories` array duplicated in two files with different order and completeness

**Files:** `app/page.tsx:16`, `app/components/marketplace-filter-form.tsx:77-84`

The homepage defines `categories` as a JS array (missing `'Card'`), while `MarketplaceFilterForm` hardcodes category `<option>` elements inline (also missing `'Card'`). Meanwhile `GAME_CATEGORIES` in `lib/constants.ts:74-83` includes `'Card'`. All three should reference the single source of truth.

**Fix:** Import `GAME_CATEGORIES` from `lib/constants.ts` in both files.

---

#### P2-4: Marketplace page drops `page` param from search params — pagination is silently broken even if UI were added

**File:** `app/marketplace/page.tsx:27-36`

The `MarketplaceFilters` type and the `filters` object constructed from search params have no `page` field. Even though `getMarketplaceGames` accepts `page` as a second argument, it's never read from the URL. Adding pagination UI would require also reading `resolved.page` and passing it through.

---

#### P2-5: No Prettier or formatting enforcement — relied on developer discipline alone

**Files:** Project root (no `.prettierrc`, no `prettier` in `package.json`)

ESLint handles linting but there's no autoformatter. Inconsistent formatting can creep in across contributors. This was flagged in review 3 but remains open and is worth reiterating as it affects every new contribution.

---

#### P2-6: `home` page `categories` array is missing the `'Card'` category

**File:** `app/page.tsx:16`

```ts
const categories = ['Strategy', 'Party', 'Solo', 'Family', 'Educational', 'Cooperative', '2-Player'];
```

The `'Card'` category exists in `GAME_CATEGORIES` and in seeded data, but it's not shown in the homepage category links. Users browsing from the homepage can't discover Card games.

---

#### P2-7: `UploadForm` category dropdown is missing the `'Card'` option

**File:** `app/components/upload-form.tsx:50-58`

The `<select>` hardcodes 7 options but omits `'Card'`. A designer trying to upload a card game would have to pick an incorrect category. This is distinct from the previous P0 about rejected categories (which was fixed in actions.ts validation), but the form UI still doesn't offer all valid options.

---

## Previously Flagged Issues — Status Check

| Issue | First Flagged | Status |
|-------|--------------|--------|
| Nested `<html>` in error.tsx | Review 4 P0 | ✅ Fixed — `error.tsx` no longer wraps in `<html>` |
| SQL injection in marketplace | Code Review 1 P0 | ✅ Fixed — sort allowlist in place |
| Missing skip-to-content | Review 1 P0 | ✅ Fixed — present in layout.tsx:41 |
| `test:coverage` crashes | Review 3 P0 | ✅ Fixed — `@vitest/coverage-v8` is installed |
| Silent category rejection | Review 3 P0 | ✅ Fixed — `GAME_CATEGORIES` includes all 8 |
| `JSON.parse` without error handling | Review 1 P1 | ✅ Fixed — `safeJsonParse` helper in data.ts |
| Duplicate mapper functions | Review 1 P1 | ✅ Fixed — shared `mapCommonFields` |
| `SELECT *` queries | Review 2 P1 | ✅ Fixed — explicit `LISTING_COLUMNS` |
| No pagination support | Review 1 P1 | ⚠️ Partial — server logic exists, UI missing (P1-3 above) |
| `force-dynamic` on all pages | Review 1 P2 | ⚠️ Still present on all 5 route pages |
| No Prettier | Review 3 P2 | ⚠️ Still absent |
| CI runs npm ci 4 times | Review 3 P2 | ⚠️ Still present |
| Recharts not lazily loaded | Review 1 P2 | ⚠️ Still present |
| `--text-muted` WCAG AA contrast | Review 2 P0 | ⚠️ Value is `rgba(58,43,31,0.76)` — still borderline |

---

## DX Scorecard

| Area | Grade | Notes |
|------|-------|-------|
| Clone → Running | **A** | `npm install && npm run dev` works in <60s. SQLite auto-seeds. |
| Documentation | **A-** | README is thorough. CONTRIBUTING.md exists. CI badge placeholder. |
| Code Organization | **A** | Clean separation: `lib/` for logic, `app/components/` for UI, `app/[route]/` for pages. |
| Type Safety | **B+** | Good overall, but `category: string` leak and loose `searchParams` typing. |
| Testing | **C+** | 46 passing data-layer tests. Zero component tests. RTL installed but unused. |
| Error Handling | **B-** | Good validation in actions, `notFound()` in slug page. Server action DB write unprotected. |
| CI/CD | **B-** | All checks pass. Redundant `npm ci` ×4. No caching. No Prettier. |
| Accessibility | **B** | Skip-to-content, focus-ring, ARIA labels on charts/gallery. Some contrast concerns remain. |
