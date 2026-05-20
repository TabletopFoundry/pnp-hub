# PnP Hub UX Audit — Coverage Report

## Summary

Fresh second-pass audit of the current `pnp-hub` state, based on a file inventory sweep (`find . -type f` with standard junk ignored), `package.json`, App Router entry points, shared UI components, and the data/flag surface. The primary routes remain `/` (`app/page.tsx`), `/marketplace` (`app/marketplace/page.tsx`), `/games/[slug]` (`app/games/[slug]/page.tsx`), `/optimizer` (`app/optimizer/page.tsx`), `/designer` (`app/designer/page.tsx`), and `/community` (`app/community/page.tsx`). Shared shell and interaction layers live in `app/layout.tsx`, `app/components/mobile-nav.tsx`, `app/components/marketplace-filter-form.tsx`, `app/components/optimizer-tool.tsx`, `app/components/upload-form.tsx`, and `app/components/analytics-chart.tsx`.

There is no user-facing feature-flag system gating UI routes. The only environment gate found in this pass is `PNP_HUB_ALLOW_PRODUCTION_SEED` in `lib/db.ts`, which controls demo seeding rather than route exposure. The core discovery loop is covered, but five new actionable UX gaps remain: missing current-route cues in global navigation, no breadcrumb return context on game detail pages, incomplete discovery handoffs in community cards, a post-submit designer flow that still strands users above the inventory table, and a read-only “My games” table that does not help designers open or interpret tracked titles.

---

## Phase 1 — Feature Inventory by domain

### Platform shell
- Global shell, header/footer nav, skip link: `app/layout.tsx`
- Mobile drawer navigation: `app/components/mobile-nav.tsx`
- Global loading/error/not-found states: `app/loading.tsx`, `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`

### Catalog discovery
- Homepage hero, featured cards, category shortcuts, subscription teaser: `app/page.tsx`, `app/components/game-card.tsx`, `app/components/subscription-grid.tsx`
- Marketplace search, filters, chips, pagination, empty state: `app/marketplace/page.tsx`, `app/components/marketplace-filter-form.tsx`, `app/components/marketplace-pagination.tsx`, `app/components/state-panel.tsx`

### Game detail + print flow
- Detail hero, gallery, build requirements, reviews, related titles, acquisition panel: `app/games/[slug]/page.tsx`, `app/components/download-button.tsx`, `app/components/game-art.tsx`
- Optimizer controls, local printer-profile persistence, live print estimates: `app/optimizer/page.tsx`, `app/components/optimizer-tool.tsx`, `lib/constants.ts`

### Designer workspace
- KPI cards, upload wizard, submission feedback, revenue framing, charts, tracked titles table: `app/designer/page.tsx`, `app/components/upload-form.tsx`, `app/components/designer-flash.tsx`, `app/components/analytics-chart.tsx`

### Community + learning
- Craft gallery, monthly spotlight, tutorials, craft-along schedule, designer spotlights: `app/community/page.tsx`, `app/components/craft-along-calendar.tsx`, `app/components/designer-spotlights.tsx`
- Tutorial metadata and related-game hooks in the data model: `lib/types.ts`, `lib/data.ts`, `docs/PRD.md`

### Validation/tooling surface
- Project scripts: `package.json`
- Component tests: `__tests__/components.test.tsx`
- Data/db/format tests: `__tests__/data.test.ts`, `__tests__/db.test.ts`, `__tests__/format.test.ts`

---

## Phase 2 — UI Coverage table

| Domain | Feature | Coverage | Paths | Notes |
|---|---|---|---|---|
| Platform shell | Global shell, header/footer, skip link | Covered | `app/layout.tsx` | Strong base structure across all pages. |
| Platform shell | Current-route feedback in nav | Partial | `app/layout.tsx`, `app/components/mobile-nav.tsx` | Links exist, but the persistent nav does not expose a dependable current-page state. |
| Catalog discovery | Homepage browse/optimizer entry points | Covered | `app/page.tsx` | Clear top-level routes into browse and print workflows. |
| Catalog discovery | Marketplace filtering, chip removal, pagination | Covered | `app/marketplace/page.tsx`, `app/components/marketplace-filter-form.tsx`, `app/components/marketplace-pagination.tsx` | Current filter UX is solid. |
| Catalog discovery | Browse-to-detail return context | Partial | `app/games/[slug]/page.tsx` | Detail pages open without breadcrumb/back context near the top. |
| Game detail | Overview, gallery, reviews, related titles | Covered | `app/games/[slug]/page.tsx` | Good content density once a user lands on the page. |
| Optimizer | Printer controls and cost estimates | Covered | `app/optimizer/page.tsx`, `app/components/optimizer-tool.tsx` | Local profile persistence and cost math are already surfaced. |
| Designer workspace | Draft upload and success feedback | Partial | `app/components/upload-form.tsx`, `app/components/designer-flash.tsx`, `app/designer/page.tsx` | Save confirmation exists, but the handoff to the updated table is still weak. |
| Designer workspace | Tracked titles table | Partial | `app/designer/page.tsx` | Inventory is visible but effectively read-only. |
| Community | Tutorial library | Partial | `app/community/page.tsx`, `lib/types.ts`, `docs/PRD.md` | Tutorial cards show labels and summaries, but not the related-game links the data model supports. |
| Community | Designer spotlights | Partial | `app/components/designer-spotlights.tsx` | Cards show a featured game, but not a broader catalog-discovery path. |
| Validation | Lint/typecheck/test/build scripts | Covered | `package.json` | All validation commands are defined, but tests require current-environment verification. |

---

## Phase 3 — UX Quality severities

### 1. Global navigation lacks reliable “you are here” feedback — **Major**
- **Paths:** `app/layout.tsx`, `app/components/mobile-nav.tsx`
- **Why it matters:** The sticky shell is always visible, but desktop links render as neutral buttons and the mobile drawer does not expose a semantic current-page state. Users can move between `/marketplace`, `/designer`, `/community`, and deep detail pages without the shell confirming where they are.
- **Impact:** Orientation cost rises on every route change, especially once users leave the homepage.

### 2. Game detail pages have no breadcrumb/back-to-marketplace context — **Major**
- **Path:** `app/games/[slug]/page.tsx`
- **Why it matters:** Game cards in the homepage, marketplace, and community routes all funnel users into `/games/[slug]`, but the detail page opens directly into the hero grid with no breadcrumb or top-of-page return affordance.
- **Impact:** Browse → inspect is supported, but inspect → continue browsing is weaker than it should be.

### 3. Community cards stop short of the next discovery step — **Major**
- **Paths:** `app/community/page.tsx`, `app/components/designer-spotlights.tsx`, `lib/types.ts`, `lib/data.ts`, `docs/PRD.md`
- **Why it matters:** `Tutorial.linkedGameSlug` exists in `lib/types.ts`, tutorials are loaded with `linkedGameSlug` in `lib/data.ts`, and the PRD explicitly calls for “related game links” in the tutorial library (`docs/PRD.md`). The current tutorial cards show no related-game CTA, and designer spotlights only expose a single featured title despite displaying total game counts.
- **Impact:** High-value community surfaces feel inspirational but not actionable.

### 4. Designer submit flow still strands users above “My games” — **Major**
- **Paths:** `app/components/upload-form.tsx`, `app/components/designer-flash.tsx`, `app/designer/page.tsx`
- **Why it matters:** The upload flow routes to `/designer?submitted=1`, and the flash message tells users to scroll to “My games.” There is no anchored landing point or direct shortcut to the updated inventory section.
- **Impact:** The only write flow in the app confirms success, but the next step is manual and easy to miss.

### 5. The tracked-titles table is visible but not useful enough — **Moderate**
- **Path:** `app/designer/page.tsx`
- **Why it matters:** The “My games” table lists titles, files, and stats, but offers no direct live-listing link, no next-step guidance per row, and no caption explaining how to interpret published vs draft entries.
- **Impact:** Designers can see the data, but cannot pivot from analytics to action.

---

## Phase 4 — Remediation Plan with effort

| Remediation | Effort | Paths | Planned fix |
|---|---|---|---|
| Add current-route states to persistent navigation | S | `app/layout.tsx`, `app/components/mobile-nav.tsx` | Introduce shared route matching plus active styling/`aria-current` in desktop, footer, and mobile nav. |
| Add breadcrumb return context to game detail pages | S | `app/games/[slug]/page.tsx` | Add a breadcrumb trail that links back to Home and Marketplace before the detail hero. |
| Turn community cards into real discovery handoffs | S | `app/community/page.tsx`, `app/components/designer-spotlights.tsx`, `lib/types.ts`, `docs/PRD.md` | Surface related-game links on tutorials and add a browse-by-designer catalog path from spotlights. |
| Land designer submit success on the inventory section | S | `app/components/upload-form.tsx`, `app/components/designer-flash.tsx`, `app/designer/page.tsx` | Add a stable inventory anchor/hash flow plus a visible jump shortcut inside the success flash. |
| Make the tracked-titles table actionable | S | `app/designer/page.tsx` | Add caption/context and status-aware next-step links for published vs draft rows. |

---

## Phase 5 — Priority Stack Rank

### Quick Wins — Top 5

| Rank | Item | Severity | Effort | Paths |
|---|---|---|---|---|
| 1 | Add active-state + `aria-current` feedback to global nav | Major | S | `app/layout.tsx`, `app/components/mobile-nav.tsx` |
| 2 | Add breadcrumb return path on `/games/[slug]` | Major | S | `app/games/[slug]/page.tsx` |
| 3 | Surface tutorial related-game links and broader designer catalog handoffs | Major | S | `app/community/page.tsx`, `app/components/designer-spotlights.tsx` |
| 4 | Anchor post-submit success to `My games` | Major | S | `app/components/upload-form.tsx`, `app/components/designer-flash.tsx`, `app/designer/page.tsx` |
| 5 | Add row-level next steps and context to the tracked-titles table | Moderate | S | `app/designer/page.tsx` |

### Full stack rank

| Rank | Issue | Why now |
|---|---|---|
| 1 | Global navigation lacks reliable current-route feedback | It affects every route and every journey. |
| 2 | Game detail has no breadcrumb/back context | It breaks the browse → inspect → continue loop. |
| 3 | Community cards do not hand users into the catalog | The content already exists in data and PRD expectations. |
| 4 | Designer success flow does not land on the updated inventory | This is the only write flow and should feel finished. |
| 5 | The tracked-titles table is not actionable enough | Designers need clearer next steps once they reach the dashboard table. |

---

## Implementation Status

| Remediation | Status | Implementation |
|---|---|---|
| Add current-route states to persistent navigation | Implemented | Added shared route matching plus active-state/`aria-current` support in `app/components/site-nav-links.tsx`, wired through `app/layout.tsx`, and aligned mobile behavior in `app/components/mobile-nav.tsx`. |
| Add breadcrumb return context to game detail pages | Implemented | Added `app/components/page-breadcrumbs.tsx` and surfaced Home → Marketplace → Game breadcrumbs in `app/games/[slug]/page.tsx`. |
| Turn community cards into real discovery handoffs | Implemented | Added `app/components/tutorial-library.tsx` with related-game/subscription handoffs, updated `app/community/page.tsx`, and added browse-by-designer catalog links in `app/components/designer-spotlights.tsx`. |
| Land designer submit success on the inventory section | Implemented | Updated `app/components/upload-form.tsx` and `app/components/designer-flash.tsx` to use a stable `#my-games` handoff and visible jump shortcut, then anchored the inventory section from `app/designer/page.tsx`. |
| Make the tracked-titles table actionable | Implemented | Extracted `app/components/designer-games-table.tsx` with table caption, row-level next steps, and live-listing links for published games. |

### Test and validation updates

- Added component coverage for the new breadcrumb, nav, tutorial, designer-table, and success-flash behaviors in `__tests__/components.test.tsx`.
- Switched Vitest from the failing thread pool to the working fork pool in `vitest.config.ts` so `npm test` succeeds in the current environment.
- Validation completed with `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
