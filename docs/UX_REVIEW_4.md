# PnP Hub — Fourth-Pass DX & UX Audit

**Date:** 2025-07-19
**Reviewer perspective:** Senior full-stack engineer, first-time codebase encounter
**Scope:** Genuinely new P0/P1 issues not already documented in UX_REVIEW.md, UX_REVIEW_2.md, or UX_REVIEW_3.md
**Method:** Full source read, `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:coverage`, contrast ratio calculations

---

## 1. Summary

PnP Hub has improved substantially since the third review. Key fixes verified: `@vitest/coverage-v8` is now installed and `test:coverage` works; `VALID_CATEGORIES` in `actions.ts` now includes `Educational` and `2-Player`; `--terracotta` darkened to `#8a5035` (6.40:1 contrast — well above AA); `--text-muted` bumped to 0.76 alpha (6.03:1); `GameListingView` is now properly used as a distinct listing type; filter chip labels use human-readable names; footer navigation is wrapped in `<nav>`; and all pages export per-route `metadata` or `generateMetadata`.

However, this pass surfaces **three genuinely new issues** not flagged in any prior review — one P0 (structurally invalid HTML in the error boundary) and two P1s (a type-safety hole in `GameCategory` and ESLint scanning generated `coverage/` artifacts).

---

## 2. Items Fixed Since Review 3 — Verified ✅

| Review 3 Item | Status |
|---|---|
| P0-1: Category mismatch (Educational, 2-Player missing from server allowlist) | ✅ `actions.ts:12` now includes both |
| P0-2: `@vitest/coverage-v8` missing | ✅ Installed in devDependencies; `npm run test:coverage` produces full report |
| P0-3: Terracotta contrast (was ~4.54:1) | ✅ `--terracotta: #8a5035` → 6.40:1 white-on-terracotta |
| P1-2: `GameListingView` dead code | ✅ Now used in `data.ts:127`, `game-card.tsx:8`; structurally distinct from `GameSummary` |
| P1-3: `--text-muted` below 4.5:1 | ✅ Alpha 0.76 → blends to 6.03:1 on `--paper` |
| P1-5: Filter chips showing raw URL keys | ✅ `filterLabels` map in `marketplace-filter-form.tsx:42-51` |
| P1-6: Footer links not in `<nav>` | ✅ `layout.tsx:63` wraps in `<nav aria-label="Footer navigation">` |
| P1-7: No per-page metadata | ✅ All 5 pages export `metadata` or `generateMetadata` |

---

## 3. New Findings

### P0 — Broken / Structurally Invalid

#### P0-1: `error.tsx` produces invalid nested `<html><body>` tags

**What:** `app/error.tsx` exports a component named `GlobalError` that wraps its content in `<html lang="en"><body>…</body></html>`. This pattern is correct for Next.js's `global-error.tsx` (which replaces the root layout on error), but the file is named `error.tsx` — a **route-level** error boundary that renders **inside** the root layout's `<html><body>`.

The result is structurally invalid HTML:
```html
<html lang="en">          <!-- from layout.tsx -->
  <body>                   <!-- from layout.tsx -->
    <html lang="en">       <!-- from error.tsx ← INVALID -->
      <body>               <!-- from error.tsx ← INVALID -->
        …error content…
      </body>
    </html>
  </body>
</html>
```

Additionally, since no `global-error.tsx` exists, errors thrown in the root layout itself are **unhandled** — Next.js will show its default error UI, not the themed PnP Hub error page.

Previous reviews noted `P1-8: inline rgba() in error.tsx` but missed the structural HTML problem entirely.

**Where:** `app/error.tsx:7-21`

**Fix:** Rename `app/error.tsx` → `app/global-error.tsx` (this makes the `<html><body>` wrapper correct and catches root layout errors). Then create a new `app/error.tsx` without `<html><body>` wrapping for route-level errors:

```tsx
// app/global-error.tsx (rename existing file)
// keeps <html><body> — correct for global boundary

// app/error.tsx (new file — route-level boundary)
'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="section-shell py-16">
      <div className="paper-panel rounded-[2rem] border border-[var(--border-light)] p-8 text-center">
        …
      </div>
    </div>
  );
}
```

---

### P1 — Significant Friction

#### P1-1: `GameCategory` type union is structurally `string` — provides zero type narrowing

**What:** `lib/types.ts:3` defines:
```ts
export type GameCategory = 'Strategy' | 'Party' | 'Family' | 'Solo' | 'Cooperative' | 'Card' | string;
```

The trailing `| string` makes the entire union collapse to `string` — TypeScript will never narrow or autocomplete the literal members. The `VALID_CATEGORIES` array in `actions.ts:12` is typed as `GameCategory[]` and uses `.includes(category as GameCategory)`, but since `GameCategory` is just `string`, the cast and check provide no compile-time safety.

The type also omits `'Educational'` and `'2-Player'`, which exist in seed data (`seed.ts:16,20,23,32,34`), the upload form (`upload-form.tsx:41-47`), and the server-side allowlist (`actions.ts:12`).

**Where:** `lib/types.ts:3`

**Fix:** Remove `| string` and add the missing literals:
```ts
export type GameCategory = 'Strategy' | 'Party' | 'Family' | 'Solo' | 'Cooperative' | 'Card' | 'Educational' | '2-Player';
```

Then update `VALID_CATEGORIES` to use `satisfies GameCategory[]` for compile-time sync:
```ts
const VALID_CATEGORIES = ['Strategy', 'Party', 'Family', 'Solo', 'Cooperative', 'Card', 'Educational', '2-Player'] as const satisfies readonly GameCategory[];
```

---

#### P1-2: ESLint scans generated `coverage/` directory — produces lint warning

**What:** Running `npm run test:coverage` then `npm run lint` produces:

```
coverage/lcov-report/block-navigation.js
  1:1  warning  Unused eslint-disable directive
```

The `coverage/` directory is in `.gitignore` but not excluded from ESLint. This warning will also appear in CI if the test job runs coverage before lint (not current behavior, but fragile).

**Where:** `eslint.config.mjs` (no ignores configured), `.gitignore:25` (has `coverage/` but ESLint doesn't read `.gitignore`)

**Fix:** Add an ignores entry to the ESLint flat config:

```js
// eslint.config.mjs
const config = [
  { ignores: ['coverage/**', '.next/**'] },
  ...nextVitals,
  ...nextTypescript,
];
```

---

#### P1-3: Upload form price field is editable when access type is "free" or "included" — price silently discarded

**What:** The upload form (`upload-form.tsx:68-71`) always renders the "Price (USD)" input with a default value of `$7`, regardless of the selected access type. When a user selects "Free" or "Included" as the access model, they can still type a price — but the server action (`actions.ts:58`) silently sets `priceCents: 0` for non-purchase access types. The user gets no feedback that their price entry was ignored.

This creates a confusing UX: a designer selects "Free", enters a price of $12, submits, and finds the game saved at $0 with no explanation.

**Where:** `app/components/upload-form.tsx:60-71` (price input always enabled), `app/designer/actions.ts:58` (silently zeroes price)

**Fix:** Conditionally disable the price input when access type is not "purchase":

```tsx
// upload-form.tsx — convert to controlled state or use JS to toggle:
<input
  name="price"
  type="number"
  min="0"
  defaultValue="7"
  step="0.5"
  disabled={/* accessType !== 'purchase' */}
  className="… disabled:opacity-50 disabled:cursor-not-allowed"
/>
```

Since the form currently uses uncontrolled inputs, the simplest approach is to add a small client-side `onChange` handler on the access type select that toggles the price input's `disabled` attribute.

---

## 4. Items Still Open from Review 3 (Not Re-documented — Refer to UX_REVIEW_3.md)

These items remain unfixed but are already thoroughly documented:

| Review 3 ID | Issue | Still Open? |
|---|---|---|
| P1-1 | Only 1 test file (format.test.ts) — near-zero real coverage | ✅ Still open (coverage: 0% on all files except lib/format.ts) |
| P1-4 | Recharts `<Tooltip>` keyboard-inaccessible | ✅ Still open |
| P1-8 | `error.tsx` inline `rgba()` instead of design token | ✅ Still open (now subsumed by P0-1 above) |
| P2-1 | 12 distinct `rounded-[*]` tokens (82→82 occurrences) | ✅ Still open (12 values, 82 uses) |
| P2-2 | `force-dynamic` on all pages | ✅ Still open |
| P2-3 | Recharts not lazily loaded | ✅ Still open |
| P2-4 | No debounced live search | ✅ Still open |
| P2-5 | `?submitted=1` persists on refresh | ✅ Still open |
| P2-6 | No Prettier / formatting enforcement | ✅ Still open |
| P2-8 | No `aria-busy` during filter transitions | ✅ Still open |
| P2-9 | CI runs `npm ci` 4 times | ✅ Still open |

---

## 5. Quick Wins (< 1 day)

| # | Fix | Impact | Effort |
|---|-----|--------|--------|
| 1 | Rename `error.tsx` → `global-error.tsx`; create route-level `error.tsx` without `<html>` wrapper (P0-1) | Fixes invalid HTML; catches root layout errors | 15 min |
| 2 | Remove `\| string` from `GameCategory`; add `Educational`, `2-Player` (P1-1) | Restores TypeScript narrowing and autocomplete | 10 min |
| 3 | Add `{ ignores: ['coverage/**'] }` to `eslint.config.mjs` (P1-2) | Eliminates lint noise from generated files | 2 min |
| 4 | Disable price input when access type ≠ purchase (P1-3) | Prevents user confusion on upload form | 15 min |

---

## 6. Overall Assessment

The codebase is maturing well. 8 of 11 items flagged in Review 3 have been addressed, including all three P0s. The remaining unfixed items are predominantly P2 polish and the long-standing test coverage gap (P1-1). The three new issues found in this pass are straightforward to fix — the most impactful is the `error.tsx` → `global-error.tsx` rename, which is a 15-minute fix with high structural benefit.

**Priority order for new findings:**
1. P0-1 (error boundary HTML) — structural correctness
2. P1-1 (GameCategory type) — type safety
3. P1-3 (price field UX) — user confusion
4. P1-2 (ESLint coverage/) — developer friction
