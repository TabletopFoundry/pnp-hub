# PnP Hub UX Audit — Coverage Report (Pass 3)

## Summary

Fresh third-pass UX audit of the current `pnp-hub` state after the prior audit remediations landed in the shell, game-detail, community, and designer flows. This pass re-checked the platform shell (`app/layout.tsx`), the marketplace discovery flow (`app/marketplace/page.tsx`, `app/components/marketplace-filter-form.tsx`, `app/components/game-card.tsx`), the game detail route (`app/games/[slug]/page.tsx`), and high-friction form surfaces (`app/components/upload-form.tsx`, `app/components/mobile-nav.tsx`, `app/error.tsx`). Baseline validation on the pre-change tree succeeded with `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.

The primary browse, detail, and designer journeys remain strong, but five fresh UX gaps remain: the debounced marketplace search remounts the active input, active-filter chips expose raw URL tokens instead of the labels users chose, marketplace updates are announced through redundant polite live regions, game reviews overstate trust by labelling every reviewer as verified, and the global banner still shows a stale catalog count that now contradicts the README and dynamic homepage stats.

---

## Phase 1 — Feature Inventory by journey

### Platform shell
- Global banner, skip link, sticky header, footer nav: `app/layout.tsx`
- Mobile drawer navigation and focus trap: `app/components/mobile-nav.tsx`
- Route-level recovery surfaces: `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`

### Marketplace discovery
- Marketplace hero, results summary, result grid, empty state, pagination: `app/marketplace/page.tsx`
- Search, filters, active chips, and filter status copy: `app/components/marketplace-filter-form.tsx`
- Result cards and browse-to-detail CTA: `app/components/game-card.tsx`

### Game detail and trust signals
- Breadcrumb, metadata chips, review list, related titles, acquisition panel: `app/games/[slug]/page.tsx`
- Review data contract and query surface: `lib/types.ts`, `lib/data.ts`, `lib/seed.ts`

### Designer and supporting forms
- Draft upload workflow and price entry affordances: `app/components/upload-form.tsx`
- Existing component and format coverage: `__tests__/components.test.tsx`, `__tests__/format.test.ts`

### Validation and product framing
- Project commands: `package.json`
- Public product framing and seeded dataset claims: `README.md`, `app/page.tsx`, `app/layout.tsx`

---

## Phase 2 — UI Coverage table

| Journey | Surface | Coverage | Paths | Notes |
|---|---|---|---|---|
| Platform shell | Global shell and route framing | Partial | `app/layout.tsx`, `README.md` | Layout structure is strong, but the banner copy still advertises `30+` titles even though the seeded catalog now exceeds that count. |
| Marketplace discovery | Search and facet controls | Partial | `app/components/marketplace-filter-form.tsx` | Filters exist and persist in the URL, but the debounced search field remounts on push and active chips mirror raw tokens instead of user-facing labels. |
| Marketplace discovery | Result updates and announcements | Partial | `app/marketplace/page.tsx`, `app/components/marketplace-filter-form.tsx` | Results summary is already polite, yet the page also announces the grid and filter status through additional polite regions. |
| Game detail | Reviews and trust cues | Partial | `app/games/[slug]/page.tsx`, `lib/types.ts`, `lib/data.ts` | Reviews render clearly, but every byline still claims "verified downloader" even when `review.verified` is false. |
| Platform framing | Catalog totals and seeded-copy consistency | Partial | `app/layout.tsx`, `app/page.tsx`, `README.md` | Homepage stats and README have moved on; the shell banner has not. |
| Validation | Automated regression coverage | Covered | `package.json`, `__tests__/components.test.tsx`, `__tests__/format.test.ts` | Lint, typecheck, test, and build commands all exist and pass on the baseline tree. |

---

## Phase 3 — UX Quality severities

### 1. Debounced marketplace search remounts the focused field — **Major**
- **Path:** `app/components/marketplace-filter-form.tsx`
- **What happens:** The search input is keyed by `searchParams.toString()` and uses `defaultValue`, so every debounced `router.push()` remounts the field.
- **Why it matters:** Users who pause while typing can lose focus and cursor position in the primary catalog search control.

### 2. Active-filter chips expose raw URL tokens instead of the labels users selected — **Major**
- **Path:** `app/components/marketplace-filter-form.tsx`
- **What happens:** Chip copy and `aria-label`s show values such as `heavy`, `under5`, `popular`, and `purchase` rather than `Crunchy`, `$5 or less`, `Most popular`, and `Purchase-only`.
- **Why it matters:** Users see implementation values instead of product language, and assistive technology announces the same raw tokens.

### 3. Marketplace updates are announced through three polite live regions — **Major**
- **Paths:** `app/marketplace/page.tsx`, `app/components/marketplace-filter-form.tsx`
- **What happens:** The results summary, the results section, and the filter-status paragraph all use polite live announcements for the same interaction.
- **Why it matters:** Screen-reader users receive duplicate or overly verbose updates whenever filters change.

### 4. Review bylines overstate trust by labelling every reviewer as verified — **Major**
- **Paths:** `app/games/[slug]/page.tsx`, `lib/types.ts`, `lib/data.ts`, `lib/seed.ts`
- **What happens:** The detail page prints `verified downloader` for every review, even though seeded review rows intentionally contain both `verified: true` and `verified: false`.
- **Why it matters:** The UI over-promises reviewer verification and weakens trust in the rating surface.

### 5. The global banner still claims `30+` titles — **Moderate**
- **Paths:** `app/layout.tsx`, `app/page.tsx`, `README.md`
- **What happens:** The shell banner says `SQLite seeded with 30+ print-and-play titles`, while `README.md` documents 56 published games and the homepage stat card now uses dynamic counts.
- **Why it matters:** Users see contradictory catalog totals before they even start browsing.

---

## Phase 4 — Remediation Plan with effort

| Remediation | Effort | Paths | Planned fix |
|---|---|---|---|
| Convert marketplace search to a controlled field | S | `app/components/marketplace-filter-form.tsx`, `__tests__/components.test.tsx` | Replace the keyed uncontrolled search input with local state synced from URL params and cover focus retention after debounced pushes. |
| Translate active-filter chips to product-language labels | S | `app/components/marketplace-filter-form.tsx`, `__tests__/components.test.tsx` | Centralize value-label maps for chips and chip `aria-label`s so they match the option labels users chose. |
| Consolidate marketplace result announcements into one polite region | S | `app/marketplace/page.tsx`, `app/components/marketplace-filter-form.tsx`, `__tests__/components.test.tsx` | Keep the results summary as the single polite announcement and remove redundant polite regions from the grid and filter status copy. |
| Respect the `review.verified` field in review bylines | S | `app/games/[slug]/page.tsx`, `lib/format.ts`, `__tests__/format.test.ts` | Gate the verified-downloader label on the actual boolean field and add a focused regression test. |
| Replace stale seeded-title count copy in the shell banner | S | `app/layout.tsx`, `lib/constants.ts`, `__tests__/constants.test.ts` | Swap the hard-coded numeric claim for stable product copy that does not drift from the live catalog. |

---

## Phase 5 — Priority Stack Rank

### Quick Wins — Top 5

| Rank | Item | Severity | Effort | Paths |
|---|---|---|---|---|
| 1 | Convert marketplace search to a controlled field | Major | S | `app/components/marketplace-filter-form.tsx` |
| 2 | Translate active-filter chips to product-language labels | Major | S | `app/components/marketplace-filter-form.tsx` |
| 3 | Consolidate marketplace result announcements into one polite region | Major | S | `app/marketplace/page.tsx`, `app/components/marketplace-filter-form.tsx` |
| 4 | Respect the `review.verified` field in review bylines | Major | S | `app/games/[slug]/page.tsx` |
| 5 | Replace stale seeded-title count copy in the shell banner | Moderate | S | `app/layout.tsx` |

### Full stack rank

| Rank | Issue | Why now |
|---|---|---|
| 1 | Debounced marketplace search remounts the focused field | It interferes with the highest-traffic control in the catalog. |
| 2 | Active-filter chips expose raw URL tokens | It makes the applied state feel technical instead of user-facing. |
| 3 | Marketplace updates are announced through three polite live regions | It creates unnecessary accessibility noise on every filter change. |
| 4 | Review bylines overstate verification | Trust copy should never exceed the data. |
| 5 | The global banner still claims `30+` titles | Contradictory catalog totals are visible on every route. |

---

## Implementation Status

| Remediation | Status | Implementation |
|---|---|---|
| Convert marketplace search to a controlled field | Implemented | `app/components/marketplace-filter-form.tsx` now keeps the query in local state synced from URL params, and `__tests__/components.test.tsx` covers focus/value retention after the debounced push. |
| Translate active-filter chips to product-language labels | Implemented | `app/components/marketplace-filter-form.tsx` now maps raw filter values to the same user-facing labels shown in the controls, and `__tests__/components.test.tsx` covers the rendered chip copy and `aria-label`s. |
| Consolidate marketplace result announcements into one polite region | Planned | Pending implementation in `app/marketplace/page.tsx`, `app/components/marketplace-filter-form.tsx`, and `__tests__/components.test.tsx`. |
| Respect the `review.verified` field in review bylines | Planned | Pending implementation in `app/games/[slug]/page.tsx`, `lib/format.ts`, and `__tests__/format.test.ts`. |
| Replace stale seeded-title count copy in the shell banner | Planned | Pending implementation in `app/layout.tsx`, `lib/constants.ts`, and `__tests__/constants.test.ts`. |

### Validation status

- Baseline validation passed before implementation: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
- Post-remediation validation: pending.
