# UX & DX Review 6 — PnP Hub

**Date:** 2025-07-25
**Reviewer perspective:** Senior engineer, fresh clone, delta audit against Reviews 1-5 + Code Reviews 1-2.
**Scope:** Only genuinely new P0/P1 findings not already flagged in any prior review document.

---

## Summary

PnP Hub has made significant strides since Review 5. All six P0/P1 issues from that review are resolved: the server action now has `try/catch`, timer cleanup uses `useRef`, `MarketplaceFilterForm` is wrapped in `<Suspense>`, component smoke tests exist (10 new specs via `components.test.tsx`), pagination UI is fully functional via a new `MarketplacePagination` component, and `GameCategory` is a proper closed union. The CI pipeline has been consolidated from 4 jobs to 2, halving `npm ci` runs. The upload form now correctly disables the price field when access type is not "purchase". Lint, typecheck, and all 56 tests pass cleanly. However, three new P1 issues surface in this pass: filter changes don't reset pagination (causing empty pages), the search input's controlled/uncontrolled mismatch creates stale UI on back-navigation, and the analytics chart tooltip displays raw cents without currency formatting.

---

## Items Fixed Since Review 5 — Verified ✅

| Review 5 Item | Status |
|---|---|
| P0-1: Server action `createDraftGame` no `try/catch` | ✅ `actions.ts:53-64` now wrapped in `try/catch`, returns `{ error: '...' }` |
| P0-2: `setTimeout` never cleaned up in DownloadButton/MockActionButton | ✅ Both use `useRef` + `useEffect` cleanup (`download-button.tsx:11-16`, `mock-action-button.tsx:13-18`) |
| P1-1: `MarketplaceFilterForm` not in `<Suspense>` | ✅ `marketplace/page.tsx:56-58` wraps in `<Suspense fallback={<FilterSkeleton />}>` |
| P1-2: Zero component/UI test coverage | ✅ `components.test.tsx` — 10 smoke-render tests covering DownloadButton, MockActionButton, GameCard, MobileNav |
| P1-3: Pagination UI missing despite server-side logic | ✅ New `MarketplacePagination` component with `aria-current`, ellipsis compression, Prev/Next controls. Used in `marketplace/page.tsx:69-72` |
| P1-4: `GameCore.category` typed as `string` instead of `GameCategory` | ✅ `types.ts:21` now `category: GameCategory` (closed union, no `\| string`) |
| P1-5: CI runs `npm ci` 4 times across 4 jobs | ✅ Consolidated to 2 jobs (`validate` + `build`). `npm ci` runs twice, not four times |
| P1-6: Optimizer page title double-suffixed | ✅ `optimizer/page.tsx:9` — `title: 'Print Optimizer'` (template handles suffix) |
| P2-4: Marketplace page drops `page` param | ✅ `marketplace/page.tsx:40` reads `page` from URL: `Math.max(1, Number(asString(resolved.page)) \|\| 1)` |

---

## New Findings

### P1 — Should fix (significant UX/DX friction)

#### P1-1: Filter changes don't reset pagination — users get empty results from non-first pages

**Files:** `app/components/marketplace-filter-form.tsx:12-25`, `app/marketplace/page.tsx:40`

When a user navigates to page 2+ of marketplace results (e.g., `?page=2`) and then changes a filter (e.g., selects category "Solo"), the `updateFilter` callback builds the new URL by copying all existing search params and updating only the changed filter key. It never deletes the `page` parameter. The resulting URL becomes `?page=2&category=Solo`.

If the filtered results have fewer than 2 pages, the user sees an empty grid with no results and no error message — the pagination component simply isn't rendered (because `totalPages > 1` is false), and `result.items` is empty because the offset exceeds the total count.

```ts
// marketplace-filter-form.tsx — page param is never cleared
const updateFilter = useCallback(
  (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // BUG: if params still contains page=3, the user lands on a non-existent page
    startTransition(() => {
      router.push(`/marketplace?${params.toString()}`);
    });
  },
  [router, searchParams, startTransition]
);
```

**Reproduction:**
1. Go to `/marketplace` — see 36 games across 2 pages
2. Click "Next" to go to page 2 (`?page=2`)
3. Select category "Solo" from the dropdown
4. URL becomes `?page=2&category=Solo` — only 4 Solo games exist, all on page 1
5. User sees empty grid, no pagination, no explanation

**Fix:** Delete the `page` param whenever any other filter changes:

```ts
const updateFilter = useCallback(
  (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.delete('page'); // reset to page 1
    startTransition(() => {
      router.push(`/marketplace?${params.toString()}`);
    });
  },
  [router, searchParams, startTransition]
);
```

---

#### P1-2: Search input uses `defaultValue` (uncontrolled) while all filter selects use `value` (controlled) — stale text on back-navigation

**File:** `app/components/marketplace-filter-form.tsx:60-62`

The search `<input>` uses `defaultValue={currentFilters.q}`, making it uncontrolled after initial render. All eight `<select>` elements use `value={currentFilters.*}`, making them controlled. When the user navigates with the browser's back/forward buttons (or clicks the "Reset" link), the URL search params change and the React component re-renders. The controlled selects update to reflect the new URL state, but the uncontrolled search input retains whatever text was last typed.

This creates a confusing split-brain UI: filters show one state while the search box shows another. The user may believe they're searching with old terms when they're not (or vice versa).

```tsx
// Uncontrolled — won't update on re-render from URL change
<input
  name="q"
  defaultValue={currentFilters.q}  // ← only sets initial value
  ...
/>

// Controlled — always reflects URL state
<select value={currentFilters.category} ...>  // ← updates on every render
```

**Fix:** Convert the search input to controlled with a local state buffer, or use a `key` prop tied to `searchParams.toString()` to force re-mount when URL changes:

```tsx
// Option A: key-based reset (simplest)
<input
  key={searchParams.toString()}
  name="q"
  defaultValue={currentFilters.q}
  ...
/>

// Option B: controlled with local state (enables debounce later)
const [searchText, setSearchText] = useState(currentFilters.q);
useEffect(() => { setSearchText(currentFilters.q); }, [currentFilters.q]);
<input value={searchText} onChange={(e) => setSearchText(e.target.value)} ... />
```

---

#### P1-3: AnalyticsChart tooltip displays raw integer values for revenue — misleading dashboard numbers

**File:** `app/components/analytics-chart.tsx:35, 50`

Both `<Tooltip />` instances in the AnalyticsChart are rendered without a custom `formatter` or `content` prop. The revenue data from `getDesignerDashboard()` is in raw integer cents (e.g., `84`, `95`, `106`), but the tooltip renders these as plain numbers (e.g., "revenue: 95"). Users expect formatted currency on a revenue dashboard. The downloads metric is also displayed as a raw number without any units label.

This is inconsistent with the rest of the designer page, where all revenue figures use `formatCurrency()` (e.g., the summary cards at `designer/page.tsx:42-51` and the revenue split panels).

```tsx
// Current — raw number tooltip
<Tooltip />

// Fixed — formatted tooltip
<Tooltip
  formatter={(value: number, name: string) =>
    name === 'revenue'
      ? [formatCurrency(value), 'Revenue']
      : [value.toLocaleString(), name.charAt(0).toUpperCase() + name.slice(1)]
  }
/>
```

**Impact:** Designers checking their dashboard see "revenue: 95" in the tooltip and may interpret it as $95 rather than $0.95 (95 cents). This erodes trust in the analytics.

---

## Previously Flagged Issues — Status Check

| Issue | First Flagged | Status |
|-------|--------------|--------|
| Nested `<html>` in error.tsx | Review 4 P0 | ✅ Fixed — `error.tsx` no longer wraps in `<html>`; `global-error.tsx` handles root errors |
| SQL injection in marketplace | Code Review 1 P0 | ✅ Fixed — sort allowlist in place |
| Missing skip-to-content | Review 1 P0 | ✅ Fixed — present in `layout.tsx:41` |
| `test:coverage` crashes | Review 3 P0 | ✅ Fixed — `@vitest/coverage-v8` installed |
| Silent category rejection | Review 3 P0 | ✅ Fixed — `GAME_CATEGORIES` includes all 8 |
| `GameCategory` type collapses to `string` | Review 4 P1 | ✅ Fixed — closed union in `types.ts:13` |
| Server action no `try/catch` | Review 5 P0 | ✅ Fixed — `actions.ts:53-64` |
| Timer cleanup in buttons | Review 5 P0 | ✅ Fixed — `useRef` in both components |
| Filter form not in `<Suspense>` | Review 5 P1 | ✅ Fixed — `marketplace/page.tsx:56` |
| Pagination UI missing | Review 1 P1 | ✅ Fixed — `MarketplacePagination` component |
| CI `npm ci` 4 times | Review 5 P1 | ⚠️ Improved — now 2 times (2 jobs), down from 4 |
| Upload form price field always enabled | Review 4 P1 | ✅ Fixed — `disabled={!isPurchase}` in `upload-form.tsx:80` |
| `force-dynamic` on all pages | Review 1 P2 | ⚠️ Still present on all 5 route pages |
| No Prettier | Review 3 P2 | ⚠️ Still absent |
| Recharts not lazily loaded | Review 1 P2 | ⚠️ Still present — no `React.lazy()` or dynamic import |
| Homepage + filter form missing `Card` category | Review 5 P2 | ⚠️ Still open — `app/page.tsx:16` and both forms hardcode 7 of 8 categories |
| `?submitted=1` persists on refresh | Review 3 P2 | ⚠️ Still present |
| Recharts `<Tooltip>` keyboard-inaccessible | Review 3 P1 | ⚠️ Still present |

---

## Quick Wins (< 1 day)

| # | Fix | Impact | Effort |
|---|-----|--------|--------|
| 1 | Add `params.delete('page')` in `updateFilter` when `key !== 'page'` (P1-1) | Eliminates empty-results bug on filter change | 2 min |
| 2 | Add `key={searchParams.toString()}` to search input (P1-2) | Fixes stale search text on back-navigation | 1 min |
| 3 | Add `formatter` prop to both `<Tooltip />` in AnalyticsChart (P1-3) | Fixes misleading revenue numbers in dashboard | 5 min |
| 4 | Import `GAME_CATEGORIES` in homepage and filter forms instead of hardcoding (Review 5 P2-3/6/7) | Single source of truth for all 8 categories | 10 min |

---

## DX Scorecard

| Area | Grade | Trend | Notes |
|------|-------|-------|-------|
| Clone → Running | **A** | → | `npm install && npm run dev` works in <60s. SQLite auto-seeds. |
| Documentation | **A-** | → | README thorough. CONTRIBUTING.md exists. |
| Code Organization | **A** | → | Clean separation: `lib/` for logic, `app/components/` for UI, `app/[route]/` for pages. |
| Type Safety | **A-** | ↑ | `GameCategory` is now a proper closed union. `category: GameCategory` in `GameCore`. |
| Testing | **B** | ↑ | 56 passing tests (46 data-layer + 10 component smoke). RTL used. Coverage still low on `app/`. |
| Error Handling | **A-** | ↑ | Server action has `try/catch`. `notFound()` in slug page. `global-error.tsx` catches root errors. |
| CI/CD | **B** | ↑ | 2 jobs (down from 4). All checks pass. Still no `node_modules` caching across jobs. |
| Accessibility | **B+** | → | Skip-to-content, focus-ring, ARIA labels on charts/gallery. Recharts tooltip still keyboard-inaccessible. |
| UX Consistency | **B-** | → | Controlled/uncontrolled mismatch in filters. Pagination doesn't reset on filter change. |

---

## Overall Assessment

The codebase is in strong shape for a demo MVP. All 8 P0/P1 items from Review 5 have been addressed — a 100% resolution rate. The remaining open issues from prior reviews are predominantly P2 polish items (Prettier, `force-dynamic`, lazy Recharts, hardcoded categories). The three new P1 findings in this pass are all quick fixes — the pagination reset is a 2-minute one-liner, the search input key is 1 minute, and the tooltip formatter is 5 minutes. Total remediation time for all new findings: under 10 minutes.

**Priority order for new findings:**
1. P1-1 (filter/pagination reset) — users hit empty results with no explanation
2. P1-2 (search input stale on back-nav) — UI shows inconsistent state
3. P1-3 (tooltip raw cents) — misleading dashboard analytics
