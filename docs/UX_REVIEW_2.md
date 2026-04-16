# PnP Hub — Second-Pass UX & DX Audit

**Date:** 2025-07-17
**Scope:** Remaining issues after first review fixes. Focus on accessibility regressions, visual polish gaps, responsive edge cases, error handling, and unfixed items from UX_REVIEW.md.
**Baseline:** UX_REVIEW.md (2025-07-16) — fixes verified include: mobile nav added, skip-to-content link added, text contrast variables created (`--text-body`/`--text-secondary`/`--text-strong`/`--text-muted`), `playerLabel(1,1)` pluralization fixed, duplicate `premiumBadge` removed from game card, star ratings given `aria-label`/`aria-hidden`, `GameArt` given `role="img"` + `aria-label`, optimizer hydration fixed (useEffect for localStorage), download button `disabled` during pending state, route-specific loading skeletons for designer + optimizer, marketplace filters made interactive via `useRouter`/`useTransition`, upload form uses `useActionState` for inline errors, `AnalyticsChart` and `SubscriptionGrid` given ARIA labels, test framework added with vitest + format tests.

---

## Summary

The first-pass fixes addressed the highest-severity blockers well — mobile nav, skip-link, interactive filtering, hydration safety, and several accessibility gaps. The codebase is meaningfully improved. However, a closer inspection reveals **new contrast failures** introduced by the fix itself, an **inaccessible mobile nav drawer** (no focus trap or Escape key handling), **several remaining WCAG violations**, unresolved responsive layout issues on the designer table, and a handful of error handling gaps. The visual polish is strong overall, but 12 distinct `rounded-[*]` tokens and residual inline `rgba()` values in chart components show the design token system is still incomplete.

---

## Findings

### P0 — Critical

#### P0-1: White-on-terracotta buttons fail WCAG AA contrast

**What:** White text (`#ffffff`) on `bg-[var(--terracotta)]` (`#b56e4f`) computes to **3.96:1**, which fails the 4.5:1 AA minimum for normal text. These buttons are primary CTAs used for key actions.

**Where:**
- `app/components/upload-submit-button.tsx:12` — "Submit mock upload" button
- `app/page.tsx:113` — "Join the community build" link
- `app/games/[slug]/page.tsx:107` — "Open full optimizer" link
- `app/community/page.tsx:58` — "View the spotlight game" link

**Fix:** Darken `--terracotta` to `#9a5a3e` (≈5.2:1) or use a darker text color like `var(--ink)` instead of white.

---

#### P0-2: `--text-muted` fails WCAG AA for normal text

**What:** `--text-muted: rgba(58, 43, 31, 0.64)` blended on `--paper` (#fbf6ed) produces a contrast ratio of **4.24:1**, which passes AA-large (≥3:1 for 18px+ bold or 24px+ normal) but **fails AA for normal text** (≥4.5:1).

**Where:** Used in the designer table for category labels:
- `app/designer/page.tsx:112` — `text-[var(--text-muted)]` on category sublabel

**Fix:** Increase alpha to at least `0.70` (`rgba(58,43,31,0.70)` → ≈4.8:1) or restrict `--text-muted` to large/bold text only.

---

#### P0-3: Terracotta-on-terracotta-tint badges fail WCAG AA

**What:** `text-[var(--terracotta)]` (#b56e4f) on `bg-[var(--bg-terracotta-tint)]` (rgba(181,110,79,0.12) blended on paper) produces **3.20:1** — fails both AA and AA-large for the small (12px) uppercase badge text.

**Where:**
- `app/games/[slug]/page.tsx:34` — price badge on game detail
- Potentially any future use of terracotta text on terracotta-tint bg

**Fix:** Darken the text to `var(--ink)` on terracotta-tint backgrounds, or darken `--terracotta` globally.

---

#### P0-4: Mobile nav drawer has no focus trap or Escape key handling

**What:** The `MobileNav` component (`app/components/mobile-nav.tsx`) opens a slide-over drawer but:
1. **No focus trap** — keyboard users can Tab past the drawer into the page behind the backdrop.
2. **No Escape key** handler — pressing Escape does nothing; only clicking the X or backdrop closes it.
3. **No focus restoration** — after closing, focus is not returned to the hamburger button.

This is a significant accessibility regression: the mobile nav was added to fix P0-1 from the first review, but the implementation misses critical modal accessibility patterns per [WAI-ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

**Where:** `app/components/mobile-nav.tsx:50-83`

**Fix:** Add `useEffect` for Escape key listener, implement focus trap (either manually or via a library like `@headlessui/react` or `react-focus-lock`), and restore focus to trigger on close.

---

### P1 — High

#### P1-1: `GameArt` uses semi-transparent white text with unpredictable contrast

**What:** `game-art.tsx:26` uses `text-white/85` and line 28 uses `text-white/88` on dynamically generated gradient backgrounds from `categoryColors`. The contrast ratio depends entirely on the category color — lighter categories (e.g., gold, light green) will fail AA, while darker ones (forest, terracotta) may pass.

**Where:** `app/components/game-art.tsx:26,28`

**Fix:** Add a dark overlay (`bg-black/20`) behind the text area, or use a text-shadow, or clamp category colors to ensure minimum darkness.

---

#### P1-2: Craft gallery placeholder images have no `alt`/`role="img"` equivalent

**What:** The gallery `div` in `app/community/page.tsx:37` renders a colored gradient as a placeholder image but has no `role="img"` or `aria-label`. Screen readers see an empty `div`.

**Where:** `app/community/page.tsx:37` — `<div className="aspect-[4/3] rounded-[1.2rem]" style={{ background: ... }} />`

Similarly, game detail gallery placeholders at `app/games/[slug]/page.tsx:64` lack accessible labeling.

**Fix:** Add `role="img" aria-label="Preview image for {title}"` to both elements.

---

#### P1-3: Forms lack `<fieldset>`/`<legend>` grouping

**What:** The marketplace filter form, upload form, and optimizer tool all render multiple related form controls with individual `<label>` elements but no semantic grouping via `<fieldset>` and `<legend>`. Screen reader users lose the group context.

**Where:**
- `app/components/marketplace-filter-form.tsx:44-161` — 8 filter controls
- `app/components/upload-form.tsx:32-75` — 6 form fields
- `app/components/optimizer-tool.tsx:76-129` — 4 printer settings

**Fix:** Wrap related controls in `<fieldset>` with a `<legend>` (can be visually hidden with `sr-only` class).

---

#### P1-4: Designer table lacks responsive treatment for narrow viewports

**What:** The designer table (`app/designer/page.tsx:96-126`) uses `overflow-x-auto` but individual cells have no `min-width`. On tablet/phone viewports (~375–768px), the 6-column table compresses columns to unreadable widths before triggering horizontal scroll. The "Files" column with comma-separated filenames wraps awkwardly.

**Where:** `app/designer/page.tsx:96-126`

**Fix:** Add `min-w-[640px]` to the `<table>` element so it scrolls horizontally at a readable width, or convert to a card layout on mobile using `@media` or Tailwind responsive classes.

---

#### P1-5: `MockActionButton` doesn't prevent rapid re-clicks

**What:** Unlike `DownloadButton` (which was fixed to `disabled` during pending state), `MockActionButton` has no guard against repeated clicks. Each click restarts the 1.6s timeout, but stacked `setTimeout` callbacks accumulate if clicked rapidly.

**Where:** `app/components/mock-action-button.tsx:17-19`

**Fix:** Add `disabled={active}` and corresponding disabled styles.

---

#### P1-6: Error boundary (`error.tsx`) doesn't import global CSS

**What:** `app/error.tsx` renders its own `<html><body>` shell (as required for global error boundaries in Next.js) but doesn't import `globals.css`. CSS custom properties like `var(--terracotta)`, `var(--ink)`, `var(--text-body)`, `var(--forest)` will be `undefined`, rendering all text in default browser colors. The branded error experience is completely broken.

**Where:** `app/error.tsx:3-19`

**Fix:** Add `import './globals.css'` at the top of `error.tsx`, or inline the critical custom properties as inline styles.

---

#### P1-7: Recharts `<Tooltip>` is mouse-only with no keyboard access

**What:** The Recharts `<Tooltip />` in `analytics-chart.tsx` activates on mouse hover only. Keyboard users cannot access tooltip data for individual chart points. The charts have `role="figure"` and `aria-label` (good), but the underlying data is invisible to keyboard-only users.

**Where:** `app/components/analytics-chart.tsx:35,50`

**Fix:** Add a visually-hidden data table as an accessible alternative, or use Recharts' `activeDot` with keyboard events. A `<details>` element with a summary like "View raw data" and a table inside is a pragmatic MVP approach.

---

#### P1-8: `SELECT *` still used in 9 queries — wasteful for listing pages

**What:** The first review flagged this (P2-8), and `getOptimizerGames()` was added as a model fix. However, `getFeaturedGames`, `getRelatedGames`, `getMarketplaceGames`, `getGameBySlug`, `getMonthlyCraftGame`, `getReviewsForGame`, `getTutorials`, `getCraftGallery`, and `getDesignerDashboard` all still use `SELECT *`. Listing pages deserialize `components_json` and `gallery_json` via `JSON.parse` for every game even though these fields are never displayed on cards.

**Where:** `lib/data.ts:99,107,114,175,183,189,194,199,244`

**Fix:** Create a `mapGameSummary()` that uses a column-specific SELECT for listing queries, reserving `mapGame()` with full columns for detail pages.

---

### P2 — Medium

#### P2-1: 12 distinct `rounded-[*]` tokens — design system gap persists

**What:** The first review noted 6-7 arbitrary radius values. After fixes, the codebase now uses **12 distinct values**: `1rem`, `1.2rem`, `1.25rem`, `1.4rem`, `1.5rem`, `1.6rem`, `1.75rem`, `1.8rem`, `1.9rem`, `2rem`, `2.2rem`, `2.4rem`. The differences between `1.4rem` and `1.5rem`, or `1.75rem` and `1.8rem`, are imperceptible and add maintenance burden.

**Where:** 81 occurrences across all component and page files.

**Fix:** Consolidate to 4 tokens: `--radius-sm: 1rem`, `--radius-md: 1.5rem`, `--radius-lg: 2rem`, `--radius-xl: 2.4rem`. Define in `globals.css` and use consistently.

---

#### P2-2: Inline `rgba()` values remain in chart and art components

**What:** While the first review's fix extracted most colors to CSS custom properties, several inline `rgba()` values persist:
- `app/components/analytics-chart.tsx:32,47` — `stroke="rgba(58,43,31,0.08)"` (should use `var(--border-light)`)
- `app/error.tsx:8` — `border-[rgba(181,110,79,0.16)]` (should use `var(--bg-terracotta-strong)`)
- `app/components/game-art.tsx:22` — inline rgba in gradient
- `app/components/optimizer-tool.tsx:151` — inline rgba in gradient bg

**Where:** Listed above.

**Fix:** Replace with CSS custom property references where possible. For gradient stops that need unique values, add named properties to `:root`.

---

#### P2-3: No per-page `<title>` or OpenGraph metadata

**What:** Only the root `layout.tsx` exports `metadata` (title: "PnP Hub"). Individual pages like `/marketplace`, `/games/[slug]`, `/optimizer`, `/designer`, and `/community` have no `export const metadata` or `generateMetadata`. Every page shows "PnP Hub" in the browser tab. Game detail pages especially need dynamic titles for SEO and link sharing.

**Where:** All `page.tsx` files under `app/`.

**Fix:** Add `generateMetadata` to `app/games/[slug]/page.tsx` (dynamic, using game title) and static `metadata` exports to other pages.

---

#### P2-4: Recharts not lazily loaded

**What:** The `AnalyticsChart` component imports `recharts` (≈200KB parsed JS) eagerly. This bundle is only needed on the `/designer` page but ships in the client bundle for any page that references it.

**Where:** `app/components/analytics-chart.tsx:3`

**Fix:** Wrap with `next/dynamic`: `const AnalyticsChart = dynamic(() => import('./analytics-chart'), { ssr: false, loading: () => <ChartSkeleton /> })` in `app/designer/page.tsx`.

---

#### P2-5: `force-dynamic` on all pages prevents caching

**What:** Every page exports `export const dynamic = 'force-dynamic'`, disabling static generation and ISR. For a demo with seeded SQLite data that rarely changes, most pages could be statically rendered or use ISR with `revalidate`.

**Where:** `app/page.tsx:8`, `app/marketplace/page.tsx:9`, `app/optimizer/page.tsx:4`, `app/designer/page.tsx:7`, `app/community/page.tsx:7`, `app/games/[slug]/page.tsx:10`

**Fix:** Remove `force-dynamic` from read-only pages. Use `revalidatePath` in the designer action (already done) to refresh on writes.

---

#### P2-6: `noStore()` calls are redundant with `force-dynamic`

**What:** Every function in `lib/data.ts` calls `unstable_noStore()`, but `force-dynamic` is already set on every page that calls them. If `force-dynamic` is removed per P2-5, the `noStore()` calls become the correct mechanism. Currently both exist simultaneously, creating confusion about which controls caching.

**Where:** `lib/data.ts:97,106,112,120,181,188,193,198,206,215,242`

**Fix:** Remove `force-dynamic` from pages (per P2-5) and keep `noStore()` in data functions as the single caching control point. Or remove `noStore()` and keep `force-dynamic` — pick one strategy.

---

#### P2-7: Search input only triggers on blur or Enter — no debounced live search

**What:** The marketplace search input (`marketplace-filter-form.tsx:51-52`) fires `updateFilter` on `onBlur` and `onKeyDown` (Enter). This means:
1. Typing a query and clicking a filter dropdown triggers both blur (search update) and the dropdown change simultaneously, causing a potential race condition.
2. There's no feedback that the search will apply. Users may type and wait, not realizing they need to press Enter or click away.

**Where:** `app/components/marketplace-filter-form.tsx:51-53`

**Fix:** Add debounced `onChange` handler (300ms) for live search, and remove the blur handler to avoid the race condition. Use a "Searching…" indicator during the transition.

---

#### P2-8: Filter chip labels are raw key names

**What:** Active filter chips display raw parameter keys like `q: chess` or `access: free` instead of human-readable labels. The `key` values (`q`, `access`, `players`) are URL parameter names, not display names.

**Where:** `app/components/marketplace-filter-form.tsx:166` — `{key}: {value}`

**Fix:** Map keys to labels: `{ q: 'Search', category: 'Category', players: 'Players', ... }`.

---

#### P2-9: `?submitted=1` success banner persists on page refresh

**What:** The designer submission success message is driven by `?submitted=1` in the URL. It persists through manual refreshes and is visible in the browser address bar. There's no mechanism to dismiss it or auto-clear it.

**Where:** `app/designer/page.tsx:47-50`

**Fix:** Use a client-side toast/notification component, or use `useEffect` to call `router.replace('/designer', { scroll: false })` after displaying the banner to clear the URL.

---

#### P2-10: No visible loading indicator during filter transitions

**What:** The `MarketplaceFilterForm` applies `opacity-70` during transitions (`isPending`), which is a subtle visual cue. There's no spinner, skeleton, or explicit "Loading…" text. The opacity change alone may not be noticed, especially by users with visual impairments.

**Where:** `app/components/marketplace-filter-form.tsx:43`

**Fix:** Add a spinner or "Updating results…" text, and an `aria-busy="true"` on the results container during transitions.

---

#### P2-11: Community gallery images are purely decorative gradients with no distinction

**What:** Gallery items in `app/community/page.tsx:37` render `linear-gradient(135deg, ${item.color}, rgba(255,255,255,0.85))` using a per-item `color` field. While each gradient is different, they all look like abstract color swatches with no visual connection to the described build. The game detail gallery (`app/games/[slug]/page.tsx:64`) uses a single shared gradient for all preview slots.

**Where:** `app/community/page.tsx:37`, `app/games/[slug]/page.tsx:64`

**Fix:** Add text overlays (game title or build description) inside the gradient to differentiate them visually. Or use distinct geometric patterns per item.

---

#### P2-12: Footer navigation has no `aria-label` and no active state

**What:** The footer renders the same nav links as the header but without `<nav>` wrapping or `aria-label`. Screen readers can't distinguish it from surrounding content. Unlike the header nav (which gets active styling in mobile via `pathname`), footer links have no active state indication.

**Where:** `app/layout.tsx:63-68`

**Fix:** Wrap footer links in `<nav aria-label="Footer navigation">`.

---

#### P2-13: Homepage "How it works" steps use `<h2>` — heading hierarchy skip

**What:** Inside the "How it works" panel, step titles ("Discover", "Optimize", "Craft") use `<h2>` (`app/page.tsx:58`), but they're semantically sub-items of the panel (which has no heading). This creates an `<h1>` → `<h2>` jump without a parent heading for the panel.

Meanwhile, the `<h1>` is the hero title. The "How it works" eyebrow text is a `<p>`, not a heading, so the `<h2>` steps appear to be direct children of the page's `<h1>`.

**Where:** `app/page.tsx:58`

**Fix:** Either make "How it works" a `<h2>` and the steps `<h3>`, or keep steps as `<p>` elements with `font-semibold` styling since they're not standalone sections.

---

### Long-Term (unchanged from first review, not yet addressed)

| # | Item | Status |
|---|---|---|
| LT-1 | Authentication (FR-01) | Not started |
| LT-2 | User library (FR-05) | Not started |
| LT-3 | Stripe checkout (FR-04) | Not started |
| LT-4 | Editorial review queue (FR-08) | Not started |
| LT-5 | Real image upload/display | Not started |
| LT-6 | E2E tests (Playwright) | Not started |
| LT-7 | CI/CD pipeline | Not started |

---

## First-Review Fix Verification

| First Review Item | Status | Notes |
|---|---|---|
| P0-1 Mobile nav | ✅ Fixed | Hamburger + drawer added via `MobileNav` component. **But** missing focus trap/Escape — see P0-4 above. |
| P0-2 Text contrast | ✅ Partially fixed | CSS variables created and applied. **But** `--text-muted` fails AA for normal text (P0-2) and terracotta combos fail (P0-1, P0-3). |
| P0-3 Skip-to-content | ✅ Fixed | Skip link added with proper styling in `globals.css:127-141`. |
| P0-4 "1 players" bug | ✅ Fixed | `playerLabel(1,1)` returns "1 player". Test added. |
| P1-1 Hardcoded colors | ✅ Mostly fixed | 14 CSS custom properties added. 7 inline `rgba()` remain in charts/gradients. |
| P1-2 Duplicate badge | ✅ Fixed | `premiumBadge` removed from game card. |
| P1-3 Optimizer data query | ✅ Fixed | `getOptimizerGames()` added with column-specific SELECT. |
| P1-4 ARIA labels | ✅ Fixed | Game art, star ratings, charts, and subscription cards all have ARIA labels. |
| P1-5 Interactive filters | ✅ Fixed | `MarketplaceFilterForm` uses `useRouter` + `useTransition`. |
| P1-6 Route-specific skeletons | ✅ Fixed | Designer and optimizer have dedicated loading skeletons. |
| P1-7 Download button double-click | ✅ Fixed | `disabled={status !== 'idle'}` added. |
| P1-8 Optimizer hydration | ✅ Fixed | `useEffect` pattern for localStorage. |
| P1-9 Test framework | ✅ Fixed | Vitest + React Testing Library configured. Format tests added. |
| P1-10 Form state preservation | ✅ Fixed | `useActionState` with inline error display. |
| P2-1 Prettier | ❌ Not done | No `.prettierrc` or format script. |
| P2-2 Radius tokens | ❌ Not done | Actually worse: 12 distinct values now vs ~7 before. |
| P2-3 Pagination | ❌ Not done | |
| P2-4 Recharts lazy-load | ❌ Not done | |
| P2-5 Per-page SEO metadata | ❌ Not done | |
| P2-6 Remove `force-dynamic` | ❌ Not done | |
| P2-9 Icons | ❌ Not done | |

---

## Priority Summary

| Priority | Count | Theme |
|---|---|---|
| **P0** | 4 | Contrast failures (3), focus trap missing (1) |
| **P1** | 8 | ARIA gaps, responsive table, error boundary CSS, SELECT *, mock button guard |
| **P2** | 13 | Design tokens, SEO, caching, filter UX polish, heading hierarchy |

**Top 3 remaining friction points:**
1. **Contrast failures** — terracotta buttons, muted text, and terracotta-on-tint badges fail WCAG AA. The contrast fix from review 1 improved body text but introduced/missed these combos.
2. **Mobile nav accessibility** — the drawer works visually but is not keyboard-accessible (no focus trap, no Escape, no focus restoration).
3. **Error boundary is unstyled** — the global error page renders without CSS custom properties, showing raw unstyled HTML on any unhandled error.
