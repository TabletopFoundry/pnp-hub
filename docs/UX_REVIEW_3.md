# PnP Hub — Third-Pass DX & UX Audit

**Date:** 2025-07-18
**Reviewer perspective:** Senior full-stack engineer, first-time encounter with codebase
**Scope:** Remaining issues after UX_REVIEW.md and UX_REVIEW_2.md fixes
**Method:** Read all source files, ran `npm install`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` — all pass cleanly.

---

## 1. Summary

PnP Hub remains an impressively well-crafted MVP with best-in-class onboarding (two commands, ~30 seconds to a running app). The first two reviews drove substantial improvements: mobile nav with focus trap/Escape, skip-to-content, interactive marketplace filters, hydration-safe localStorage, per-route loading skeletons, vitest + format tests, CI pipeline, and CONTRIBUTING.md. The code is clean, TypeScript is strict, and the server/client component boundary is well-managed.

However, **significant gaps persist across testing, security, accessibility, and design system consistency**. Test coverage is limited to a single utility file (21 tests for `format.ts`; zero tests for data layer, components, server actions, or pages). The `@vitest/coverage-v8` dependency is referenced in config but not installed, so `npm run test:coverage` fails. The designer submission action has a category validation mismatch (accepts `'2-Player'` and `'Educational'` from the form but rejects them server-side). Several WCAG contrast issues flagged in the second review remain unfixed. The design token system is incomplete with 12 distinct border-radius values. And the `GameListingView` type is defined but never used, while listing functions return `GameSummary` with empty `components`/`gallery` arrays — a type-level lie.

---

## 2. Findings

### P0 — Broken/Blocking

#### P0-1: Designer submission silently rejects valid categories

**What:** The upload form (`upload-form.tsx:40-48`) offers 7 categories: `Strategy, Party, Solo, Family, Educational, Cooperative, 2-Player`. But the server action (`designer/actions.ts:12`) validates against only 6: `Strategy, Party, Family, Solo, Cooperative, Card`. Submitting `Educational`, `2-Player`, or even `Solo` vs `solo` fails with a cryptic error. `Card` is in the allowlist but not in the form. This means **2 of 7 form options are guaranteed to fail server-side**.

**Where:** `app/designer/actions.ts:12` vs `app/components/upload-form.tsx:40-48`

**Fix:** Sync the `VALID_CATEGORIES` array with the form options. Add `'Educational'` and `'2-Player'`; remove `'Card'` (or add it to the form).

---

#### P0-2: `npm run test:coverage` fails — missing dependency

**What:** `vitest.config.ts:12` configures `provider: 'v8'` for coverage, and `package.json:26` defines `"test:coverage": "vitest run --coverage"`, but `@vitest/coverage-v8` is not in `devDependencies`. Running `npm run test:coverage` outputs `MISSING DEPENDENCY Cannot find dependency '@vitest/coverage-v8'`.

**Where:** `package.json`, `vitest.config.ts:12`

**Fix:** `npm install -D @vitest/coverage-v8`

---

#### P0-3: White-on-terracotta buttons still fail WCAG AA contrast (unfixed from Review 2, P0-1)

**What:** `--terracotta` was darkened to `#9a5a3e` per Review 2 recommendation, but white (`#fff`) text on `#9a5a3e` computes to approximately **4.54:1** — which just barely passes for normal 14px text but **fails for the `text-sm` (14px)** used on these buttons since browsers round sub-pixel differently. The 4.5:1 minimum has essentially zero margin. Four primary CTAs across the site use this combination.

**Where:** `app/components/upload-submit-button.tsx:12`, `app/page.tsx:113`, `app/games/[slug]/page.tsx:107`, `app/community/page.tsx:58`

**Fix:** Darken `--terracotta` one more step to `#8a5035` (~5.5:1) or switch button text from white to `var(--ink)`.

---

### P1 — Significant Friction

#### P1-1: Only 1 test file covering 1 utility module — near-zero real coverage

**What:** `__tests__/format.test.ts` tests 21 cases for `lib/format.ts`. Nothing else is tested: no `lib/data.ts` (the entire data layer), no `lib/db.ts` (schema, seeding, `createDraftGame`), no server action (`designer/actions.ts`), no React components, no page-level smoke tests. For a project with 12 components, 6 pages, 14 data functions, and a server action with validation logic, this is critically under-tested.

**Where:** `__tests__/` — only `format.test.ts` and `setup.ts` exist

**Fix priorities:**
1. `data.test.ts` — test `getMarketplaceGames` filter/sort/pagination logic (most complex function)
2. `db.test.ts` — test `createDraftGame` writes and `createDatabase` schema
3. `actions.test.ts` — test `createDesignerSubmission` validation (especially since P0-1 above is a validation bug)
4. Component smoke tests for `GameCard`, `OptimizerTool`, `MarketplaceFilterForm`

---

#### P1-2: `GameListingView` type is dead code — `GameSummary` used everywhere

**What:** `lib/types.ts:72-78` defines `GameListingView` as structurally identical to `GameSummary` (both combine the same intersection types). It is never imported or used anywhere in the codebase. Meanwhile, `mapListingGame()` in `data.ts:126-132` returns `GameSummary` with `components: []` and `gallery: []` — these empty arrays are a type-level lie since `GameSummary` includes `GameDetailContent` which implies populated arrays.

**Where:** `lib/types.ts:72-78`, `lib/data.ts:126-132`

**Fix:** Either (a) remove `GameListingView` and accept that listings carry empty arrays, or (b) make `GameListingView` actually different (omit `components`/`gallery`) and use it as the return type for listing queries. Option (b) is more correct and prevents downstream bugs.

---

#### P1-3: `--text-muted` still fails WCAG AA for normal text (unfixed from Review 2, P0-2)

**What:** `globals.css:20` defines `--text-muted: rgba(58, 43, 31, 0.72)`. On `--paper` (`#fbf6ed`), this blends to approximately **4.4:1** — below the 4.5:1 AA minimum for normal text. It's used on the designer table category labels at normal text size.

**Where:** `globals.css:20`, `app/designer/page.tsx:112`

**Fix:** Increase alpha to `0.76` minimum (~4.7:1), or restrict `--text-muted` usage to large/bold text only.

---

#### P1-4: Recharts `<Tooltip>` remains keyboard-inaccessible (unfixed from Review 2, P1-7)

**What:** `analytics-chart.tsx` uses `<Tooltip />` which only activates on mouse hover. Keyboard users cannot access data point details. The charts have `role="figure"` and `aria-label` (good), but the underlying data values are invisible without a mouse.

**Where:** `app/components/analytics-chart.tsx:35,50`

**Fix:** Add a `<details>` with a visually-hidden data table as an accessible fallback, or use a custom Recharts `activeDot` with keyboard events.

---

#### P1-5: Filter chip labels show raw URL parameter names (unfixed from Review 2, P2-8 — escalated)

**What:** Active marketplace filter chips display `q: chess`, `access: free`, `complexity: light` — using raw URL param keys instead of human-readable labels. This is confusing for users.

**Where:** `app/components/marketplace-filter-form.tsx:167` — `{key}: {value}`

**Fix:** Map keys to display labels: `{ q: 'Search', category: 'Category', players: 'Players', complexity: 'Complexity', price: 'Price', rating: 'Rating', access: 'Access', sort: 'Sort' }`.

---

#### P1-6: Footer links not wrapped in `<nav>` (unfixed from Review 2, P2-12)

**What:** The footer renders navigation links (`layout.tsx:63-68`) without a `<nav>` wrapper or `aria-label`. Screen readers can't distinguish footer navigation from surrounding content.

**Where:** `app/layout.tsx:63-68`

**Fix:** Wrap in `<nav aria-label="Footer navigation">`.

---

#### P1-7: No per-page `<title>` or OpenGraph metadata (unfixed from Review 2, P2-3)

**What:** Only `layout.tsx` exports `metadata` (title: "PnP Hub"). Every page shows the same browser tab title. Game detail pages especially need dynamic titles for shareability and SEO.

**Where:** All `page.tsx` files

**Fix:** Add `generateMetadata` to `app/games/[slug]/page.tsx` and static `metadata` exports to other pages.

---

#### P1-8: `error.tsx` hardcodes inline `rgba()` instead of using design token

**What:** `app/error.tsx:10` uses `border-[rgba(181,110,79,0.16)]` instead of the existing `var(--bg-terracotta-strong)` token. This is the only file where this specific value appears inline, making it easy to miss during a brand color update.

**Where:** `app/error.tsx:10`

**Fix:** Replace with `border-[var(--bg-terracotta-strong)]`.

---

### P2 — Nice to Have

#### P2-1: 12 distinct `rounded-[*]` tokens — no consolidation since Review 2 (unfixed, P2-1)

**What:** 82 occurrences across 12 distinct arbitrary radius values (`1rem` through `2.4rem`). Differences between `1.4rem` and `1.5rem` or `1.75rem` and `1.8rem` are imperceptible.

**Counts:** `1.5rem` (20), `2rem` (19), `1.4rem` (13), `1.9rem` (9), `1.8rem` (6), `2.2rem` (5), `1.6rem` (3), `1rem` (2), `1.75rem` (2), `2.4rem` (1), `1.2rem` (1), `1.25rem` (1)

**Fix:** Consolidate to 4 tokens in `globals.css`: `--radius-sm: 1rem`, `--radius-md: 1.5rem`, `--radius-lg: 2rem`, `--radius-xl: 2.4rem`.

---

#### P2-2: `force-dynamic` on all pages prevents caching (unfixed from Review 2, P2-5)

**What:** Every page exports `export const dynamic = 'force-dynamic'`. For a demo with seeded SQLite data, homepage, community, and optimizer pages could be statically generated or use ISR.

**Where:** All 6 page files

**Fix:** Remove `force-dynamic` from read-only pages. The designer action already calls `revalidatePath`.

---

#### P2-3: Recharts not lazily loaded (unfixed from Review 2, P2-4)

**What:** `AnalyticsChart` eagerly imports `recharts` (~200KB parsed JS). Only needed on `/designer`.

**Where:** `app/components/analytics-chart.tsx:3`

**Fix:** Use `next/dynamic` with `{ ssr: false }` in `designer/page.tsx`.

---

#### P2-4: Search input UX — no debounced live search (unfixed from Review 2, P2-7)

**What:** Marketplace search fires on blur or Enter only. Users may type and wait, not realizing they need to press Enter. Clicking a filter dropdown after typing triggers both blur and dropdown change simultaneously.

**Where:** `app/components/marketplace-filter-form.tsx:51-53`

**Fix:** Add debounced `onChange` (300ms) and remove the blur handler.

---

#### P2-5: `?submitted=1` banner persists on refresh (unfixed from Review 2, P2-9)

**What:** Designer success message stays in URL. Visible, refreshes with page, no dismiss mechanism.

**Where:** `app/designer/page.tsx:47-50`

**Fix:** Client-side toast or `router.replace('/designer')` after showing the banner.

---

#### P2-6: No Prettier or formatting enforcement (unfixed from Review 1, P2-1)

**What:** `.editorconfig` exists (good) but no Prettier config. Formatting consistency depends on individual editor setup.

**Fix:** Add `.prettierrc` and `"format": "prettier --write ."` script.

---

#### P2-7: Heading hierarchy issues on homepage (unfixed from Review 2, P2-13)

**What:** "How it works" step titles use `<h2>` inside a panel that has no heading, creating a hierarchy skip from the page `<h1>`.

**Where:** `app/page.tsx:58`

**Fix:** Make step titles `<h3>` or `<p>` with visual emphasis.

---

#### P2-8: No `aria-busy` during filter transitions

**What:** `MarketplaceFilterForm` sets `opacity-70` during transitions but doesn't set `aria-busy="true"` on the results region. Screen readers have no way to know results are updating.

**Where:** `app/components/marketplace-filter-form.tsx:43`

**Fix:** Add `aria-busy={isPending}` to the results container.

---

#### P2-9: CI workflow runs `npm ci` 4 times — no dependency caching between jobs

**What:** The CI workflow (`ci.yml`) has 4 jobs (lint, typecheck, test, build). Each runs `npm ci` independently. While `actions/setup-node` with `cache: 'npm'` caches the npm registry download, the `node_modules/` directory is still rebuilt from scratch each time. A matrix strategy or a shared install step would cut CI time significantly.

**Where:** `.github/workflows/ci.yml`

**Fix:** Either combine lint+typecheck+test into one job (they're fast), or use `actions/cache` to share `node_modules/` across jobs.

---

#### P2-10: `data/` directory not in `.gitignore` — only `data/*.db` is

**What:** `.gitignore` has `data/*.db` and `*.db`, but the empty `data/` directory itself is tracked (it exists for the auto-created SQLite DB). If someone accidentally adds a non-`.db` file to `data/`, it would be committed. Minor, but the directory should either be fully ignored or contain a `.gitkeep`.

**Where:** `.gitignore:3-4`

**Fix:** Add `data/` to `.gitignore` (the app creates it via `fs.mkdirSync` anyway) or add `data/.gitkeep`.

---

## 3. Quick Wins (< 1 day)

| # | Fix | Impact | Effort |
|---|-----|--------|--------|
| 1 | Sync `VALID_CATEGORIES` in `actions.ts` with form options (P0-1) | Unblocks 2 of 7 form categories | 5 min |
| 2 | `npm install -D @vitest/coverage-v8` (P0-2) | Unblocks `test:coverage` script | 2 min |
| 3 | Darken `--terracotta` to `#8a5035` or swap button text to `var(--ink)` (P0-3) | WCAG AA compliance for all CTAs | 10 min |
| 4 | Bump `--text-muted` alpha to 0.76 (P1-3) | WCAG AA compliance for muted text | 5 min |
| 5 | Map filter chip keys to display labels (P1-5) | Better UX for active filters | 15 min |
| 6 | Wrap footer links in `<nav>` (P1-6) | Accessibility | 5 min |
| 7 | Replace inline `rgba()` in `error.tsx` with design token (P1-8) | Design consistency | 2 min |
| 8 | Add `aria-busy` to filter results container (P2-8) | Accessibility | 5 min |

---

## 4. Medium-Term Improvements (days to sprint)

| # | Improvement | Impact |
|---|-------------|--------|
| 1 | **Add data layer tests** — `data.test.ts` for filter/sort/pagination, `db.test.ts` for schema/seeding, `actions.test.ts` for validation | Catches bugs like P0-1 automatically |
| 2 | **Add component tests** — GameCard rendering, OptimizerTool state changes, MarketplaceFilterForm URL updates | Prevents UI regressions |
| 3 | **Consolidate border-radius tokens** to 4 values and define as CSS custom properties | Simplifies design maintenance (82 replacements) |
| 4 | **Add per-page `generateMetadata`** — especially dynamic titles for `/games/[slug]` | SEO, shareability, browser tab clarity |
| 5 | **Lazy-load Recharts** via `next/dynamic` | Reduces JS bundle for non-designer pages |
| 6 | **Add debounced live search** to marketplace | Better search UX |
| 7 | **Fix `GameListingView` vs `GameSummary`** type confusion | Type correctness, prevents future bugs |
| 8 | **Optimize CI** — combine jobs or share `node_modules/` cache | Faster feedback loop |

---

## 5. Long-Term Investments

| # | Investment | Rationale |
|---|-----------|-----------|
| 1 | **Authentication (FR-01)** | Unblocks checkout, library, entitlement-aware CTAs, review submission, editorial workflow |
| 2 | **E2E tests (Playwright)** | Cover full user flows: browse → filter → game detail → optimizer → designer upload |
| 3 | **Real image upload + storage** | Replace gradient-block placeholder art with actual game images |
| 4 | **Stripe checkout + subscription management** | Revenue model requires this |
| 5 | **Remove `force-dynamic` + implement ISR** | Significantly better performance for read-heavy demo |
| 6 | **Accessible chart alternative** | Data tables or keyboard-accessible tooltip for Recharts |
| 7 | **Add Prettier + pre-commit hooks** | Enforce formatting consistency across contributors |

---

## 6. Comparison to Best Practices

| Practice | Industry Standard | PnP Hub Status | Delta |
|---|---|---|---|
| **Clone-to-running** | < 5 min, zero config | ✅ ~30 seconds | Best-in-class |
| **Type safety** | Strict TS, no `any` | ✅ `strict: true`, `noUncheckedIndexedAccess` | Excellent |
| **Component architecture** | Server-first, minimal client JS | ✅ 8/12 components are server-only | Good |
| **Testing** | Unit + integration + E2E, >70% coverage | ⚠️ 1 test file, 21 tests, `coverage` script broken | Major gap |
| **Design tokens** | Centralized, < 5 radius/spacing values | ⚠️ 12 radius values, 7 inline `rgba()` remain | Incomplete |
| **Accessibility** | WCAG 2.1 AA | ⚠️ 3 contrast failures, no `aria-busy`, no footer `<nav>` | Partially addressed |
| **CI/CD** | Lint + typecheck + test + build on PR | ✅ All 4 steps present | Good (but 4x `npm ci` is slow) |
| **SEO** | Per-page metadata, OG tags | ❌ Single root `<title>` only | Missing |
| **Documentation** | README + CONTRIBUTING + architecture | ✅ Both present + project structure | Good |
| **Error handling** | Per-feature boundaries, actionable messages | ⚠️ Global only, server action validation mismatch | Needs work |
| **Formatting** | Enforced via Prettier + hooks | ⚠️ `.editorconfig` only, no Prettier | Gap |
| **Security** | Input validation, parameterized queries | ✅ Queries parameterized, sort allowlisted | Good (except P0-1 validation mismatch) |

---

## 7. Items Fixed Since Review 1 & 2 — Verified ✅

| Item | Status |
|---|---|
| Mobile nav with hamburger + drawer | ✅ With focus trap, Escape, focus restore |
| Skip-to-content link | ✅ Present in `layout.tsx` |
| Text contrast CSS variables | ✅ `--text-body/secondary/strong/muted` defined |
| Interactive marketplace filters | ✅ `useRouter` + `useTransition` |
| Hydration-safe localStorage in optimizer | ✅ `useEffect` + `mounted` flag |
| Download button disabled during pending | ✅ `disabled={status !== 'idle'}` |
| Per-route loading skeletons | ✅ Designer, optimizer, marketplace |
| Upload form inline errors via `useActionState` | ✅ No more redirect-on-error |
| Vitest framework + format tests | ✅ 21 tests pass |
| CI pipeline | ✅ 4-job workflow with lint/typecheck/test/build |
| CONTRIBUTING.md | ✅ Comprehensive |
| `GameArt` has `role="img"` + `aria-label` | ✅ |
| `MockActionButton` has `disabled` + `aria-live` | ✅ |
| `AnalyticsChart`/`SubscriptionGrid` have ARIA labels | ✅ |
| `playerLabel(1,1)` returns "1 player" | ✅ |
| Duplicate badge removed from game card | ✅ |
| Marketplace fieldset/legend added | ✅ |
| SELECT column optimization (`LISTING_COLUMNS`) | ✅ In data.ts |
| `getOptimizerGames()` uses specific columns | ✅ |
| Pagination support in `getMarketplaceGames` | ✅ (though UI doesn't expose page controls yet) |
