# PnP Hub UI Coverage Report

## Summary

PnP Hub already covers the core discovery journey end-to-end: home → marketplace → game detail → optimizer, plus separate designer and community surfaces. The project is a Next.js App Router app with primary UI entry points at `/` (`app/page.tsx`), `/marketplace` (`app/marketplace/page.tsx`), `/games/[slug]` (`app/games/[slug]/page.tsx`), `/optimizer` (`app/optimizer/page.tsx`), `/designer` (`app/designer/page.tsx`), and `/community` (`app/community/page.tsx`). Shared shell and interaction entry points live in `app/layout.tsx`, `app/components/mobile-nav.tsx`, `app/components/marketplace-filter-form.tsx`, `app/components/optimizer-tool.tsx`, and `app/components/upload-form.tsx`.

No runtime UI feature-flag system is wired into the product surface. The only environment gate found during setup is the production seeding guard `PNP_HUB_ALLOW_PRODUCTION_SEED` in `lib/db.ts`, which affects demo data availability rather than route-level UI exposure.

The biggest coverage gaps are not the headline routes; they are trust and discoverability gaps inside otherwise polished flows. The two most visible problems are fake CTA affordances (`app/page.tsx`, `app/components/subscription-grid.tsx`, `app/components/mock-action-button.tsx`) and partially-hidden secondary data that exists in `lib/data.ts` but never reaches the UI (`getCraftAlongSchedule`, `getDesignerProfiles`). Marketplace filtering and designer submission feedback also work, but both hide important state transitions behind stale UI or URL-driven messages.

---

## Phase 1 — Feature Inventory

### Platform Shell
1. Global navigation shell — sticky header, footer navigation, and skip-link wrapper across every route (`app/layout.tsx`).
2. Mobile navigation drawer — small-screen dialog navigation with focus trap and Escape handling (`app/components/mobile-nav.tsx`).
3. Global loading, error, and not-found states — route/global loading, route error, global error, and not-found experiences (`app/loading.tsx`, `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`).
4. Homepage hero entry points — top-level value proposition with primary links into browsing and optimization (`app/page.tsx`).
5. Featured game rail — curated game cards pulled from seeded marketplace data (`app/page.tsx`, `app/components/game-card.tsx`).
6. Category quick links — direct category shortcuts generated from `GAME_CATEGORIES` (`app/page.tsx`, `lib/constants.ts`).
7. Subscription tier comparison teaser — three subscription cards reused on home/community (`app/components/subscription-grid.tsx`).
8. Designer onboarding CTA cluster — creator-focused callouts on the homepage hero/footer section (`app/page.tsx`).

### Marketplace
9. Query search — title/tagline/designer search powered by query params and SQLite LIKE matching (`app/components/marketplace-filter-form.tsx`, `lib/data.ts`).
10. Faceted filters — category, players, complexity, price, rating, and access controls (`app/components/marketplace-filter-form.tsx`).
11. Sort controls — newest, popular, rated, and price sorting (`app/components/marketplace-filter-form.tsx`, `lib/data.ts`).
12. Active filter summary — visible summary chips for the current filter state (`app/components/marketplace-filter-form.tsx`).
13. Results grid — card-based marketplace browse surface (`app/marketplace/page.tsx`, `app/components/game-card.tsx`).
14. Pagination — previous/next plus compact page-number navigation (`app/components/marketplace-pagination.tsx`).
15. Empty-results recovery — resettable empty-state panel when filters return zero titles (`app/marketplace/page.tsx`, `app/components/state-panel.tsx`).

### Game Detail
16. SEO-aware detail route — dynamic metadata per slug (`app/games/[slug]/page.tsx`).
17. Game overview hero — art, badges, description, and key stats (`app/games/[slug]/page.tsx`, `app/components/game-art.tsx`).
18. Preview gallery — captioned visual placeholders for game previews (`app/games/[slug]/page.tsx`).
19. Build requirements — component summary and part list (`app/games/[slug]/page.tsx`).
20. Print guidance snapshot — paper, ink, cutting, and stock recommendations (`app/games/[slug]/page.tsx`).
21. Reviews and ratings — average badge plus review feed/fallback (`app/games/[slug]/page.tsx`).
22. Acquisition panel — pricing, download CTA, and tutorial handoff (`app/games/[slug]/page.tsx`, `app/components/download-button.tsx`).
23. Related games rail — similar-title recommendations (`app/games/[slug]/page.tsx`).

### Print Optimizer
24. Game picker — choose a seeded title or deep-link from detail view (`app/components/optimizer-tool.tsx`, `app/optimizer/page.tsx`).
25. Printer profile controls — paper size, color mode, and duplex settings persisted in localStorage (`app/components/optimizer-tool.tsx`, `lib/constants.ts`).
26. Cost/sheet estimate cards — live calculated print metrics (`app/components/optimizer-tool.tsx`).
27. Layout preview grid — generated preview-sheet tiles (`app/components/optimizer-tool.tsx`).
28. Print prep guidance — stock, cutting guidance, and persistence note (`app/components/optimizer-tool.tsx`).

### Designer Workspace
29. Dashboard summary KPIs — downloads, revenue, rating, and published count cards (`app/designer/page.tsx`).
30. Upload wizard — form-backed draft submission persisted into SQLite (`app/components/upload-form.tsx`, `app/designer/actions.ts`, `lib/db.ts`).
31. Submission feedback — success and error messaging after upload (`app/designer/page.tsx`, `app/components/upload-form.tsx`).
32. Revenue split explainer — designer/platform payout framing (`app/designer/page.tsx`).
33. Analytics charts — 14-day downloads and geography visuals (`app/designer/page.tsx`, `app/components/analytics-chart.tsx`).
34. My games manager — current catalog + draft inventory table (`app/designer/page.tsx`).

### Community
35. Craft gallery — maker showcase cards (`app/community/page.tsx`).
36. Monthly craft-along spotlight — current featured build with game link (`app/community/page.tsx`).
37. Tutorial library — seeded tutorial cards with free/subscriber labels (`app/community/page.tsx`).
38. Full craft-along schedule — full-year schedule exists in the data layer but is not surfaced (`lib/data.ts`).
39. Designer profiles spotlight/directory — designer profile data exists in the data layer but is not surfaced (`lib/data.ts`).

### Membership / Monetization
40. Subscription plan enrollment / upgrade path — complete a plan choice from the subscription cards or creator CTA cluster (`app/components/subscription-grid.tsx`, `app/page.tsx`).

---

## Phase 2 — UI Coverage Mapping

| # | Feature | Domain | UI Status | Notes |
|---|---|---|---|---|
| 1 | Global navigation shell | Platform Shell | [COVERED] | Persistent header/footer plus skip-link in `app/layout.tsx`. |
| 2 | Mobile navigation drawer | Platform Shell | [COVERED] | Accessible drawer in `app/components/mobile-nav.tsx`. |
| 3 | Global loading, error, and not-found states | Platform Shell | [COVERED] | Loading/error/not-found screens exist at route and root levels. |
| 4 | Homepage hero entry points | Platform Shell | [COVERED] | Primary links to `/marketplace` and `/optimizer` in `app/page.tsx`. |
| 5 | Featured game rail | Platform Shell | [COVERED] | Featured cards rendered from `getFeaturedGames()` on `/`. |
| 6 | Category quick links | Platform Shell | [COVERED] | Category chips link into `/marketplace?category=...`. |
| 7 | Subscription tier comparison teaser | Platform Shell | [PARTIAL] | The comparison content is visible, but plan CTAs use `MockActionButton` and do not advance users to a real next step (`app/components/subscription-grid.tsx`). |
| 8 | Designer onboarding CTA cluster | Platform Shell | [PARTIAL] | One CTA works (`/designer`), but `Preview creator onboarding` is a mock interaction in `app/page.tsx`. |
| 9 | Query search | Marketplace | [PARTIAL] | Search works after blur/submit, but typed text can sit stale with no live feedback in `app/components/marketplace-filter-form.tsx`. |
| 10 | Faceted filters | Marketplace | [COVERED] | Full filter set is present and wired to query params. |
| 11 | Sort controls | Marketplace | [COVERED] | Sort select is available and backed by allowlisted SQL sort keys. |
| 12 | Active filter summary | Marketplace | [PARTIAL] | Chips are visible but inert; removing one filter requires resetting the whole form. |
| 13 | Results grid | Marketplace | [COVERED] | Card grid renders paginated marketplace results. |
| 14 | Pagination | Marketplace | [COVERED] | Previous/next and compact page list preserve current filters. |
| 15 | Empty-results recovery | Marketplace | [COVERED] | Clear path back to `/marketplace` via `StatePanel`. |
| 16 | SEO-aware detail route | Game Detail | [COVERED] | `generateMetadata()` maps title/description per slug. |
| 17 | Game overview hero | Game Detail | [COVERED] | Hero summary, badges, and stats are present. |
| 18 | Preview gallery | Game Detail | [COVERED] | Gallery placeholders/captions are rendered in `app/games/[slug]/page.tsx`. |
| 19 | Build requirements | Game Detail | [COVERED] | Component summary and bullet list are surfaced. |
| 20 | Print guidance snapshot | Game Detail | [COVERED] | Guidance links cleanly into `/optimizer?game=...`. |
| 21 | Reviews and ratings | Game Detail | [COVERED] | Review list and no-review fallback are present. |
| 22 | Acquisition panel | Game Detail | [COVERED] | Pricing and tutorial handoff are visible; CTA is intentionally demo-style in `app/components/download-button.tsx`. |
| 23 | Related games rail | Game Detail | [COVERED] | Related titles are displayed in the sidebar. |
| 24 | Game picker | Print Optimizer | [COVERED] | Game selection supports deep-linked initialization. |
| 25 | Printer profile controls | Print Optimizer | [COVERED] | Profile state persists in localStorage. |
| 26 | Cost/sheet estimate cards | Print Optimizer | [COVERED] | Cost, sheets, and ink update live. |
| 27 | Layout preview grid | Print Optimizer | [COVERED] | Preview tiles scale with estimated sheet count. |
| 28 | Print prep guidance | Print Optimizer | [COVERED] | Stock, cutting, and persistence notes are exposed. |
| 29 | Dashboard summary KPIs | Designer Workspace | [COVERED] | Summary cards render from `getDesignerDashboard()`. |
| 30 | Upload wizard | Designer Workspace | [COVERED] | Draft creation flow is wired through server actions into SQLite. |
| 31 | Submission feedback | Designer Workspace | [PARTIAL] | Success relies on `?submitted=1` and persists on refresh; the price field also keeps a stale-looking default when disabled (`app/designer/page.tsx`, `app/components/upload-form.tsx`). |
| 32 | Revenue split explainer | Designer Workspace | [COVERED] | Revenue share cards are clear and present. |
| 33 | Analytics charts | Designer Workspace | [PARTIAL] | Visuals exist, but detailed values are effectively hover-first in `app/components/analytics-chart.tsx`. |
| 34 | My games manager | Designer Workspace | [COVERED] | Catalog/draft inventory is present in a tabular view. |
| 35 | Craft gallery | Community | [COVERED] | Gallery cards are visible with count badge. |
| 36 | Monthly craft-along spotlight | Community | [COVERED] | Current spotlight game is visible and linked. |
| 37 | Tutorial library | Community | [COVERED] | Tutorial cards with access labels are visible. |
| 38 | Full craft-along schedule | Community | [HIDDEN] | `getCraftAlongSchedule()` exists in `lib/data.ts` but nothing on `/community` exposes it. |
| 39 | Designer profiles spotlight/directory | Community | [HIDDEN] | `getDesignerProfiles()` exists in `lib/data.ts` but no page uses it. |
| 40 | Subscription plan enrollment / upgrade path | Membership / Monetization | [MISSING] | Marketing copy implies choosing a plan, but there is no actual next-step flow from the subscription cards or the home creator-preview CTA. |

---

## Phase 3 — UX Quality Assessment

**#7 — Subscription tier comparison teaser** `[CRITICAL]`  
- Criterion: Feedback / Consistency  
- Problem: The primary-looking `Choose ...` controls in `app/components/subscription-grid.tsx` are wired to `app/components/mock-action-button.tsx`, so they briefly change label and then reset without navigation, persistence, or an honest explanation of what happens next.  
- Location: `app/components/subscription-grid.tsx`, route sections on `/` and `/community`.

**#8 — Designer onboarding CTA cluster** `[CRITICAL]`  
- Criterion: Discoverability / Feedback  
- Problem: The homepage action pair in `app/page.tsx` mixes one real route (`/designer`) with one fake preview action, which makes the second CTA feel broken even though the section otherwise presents a real creator workflow.  
- Location: `app/page.tsx`, designer CTA section on `/`.

**#9 — Query search** `[MAJOR]`  
- Criterion: Discoverability / Feedback  
- Problem: Search text is only applied on blur or submit in `app/components/marketplace-filter-form.tsx`, so the query box can visually diverge from the actual results/count shown in `app/marketplace/page.tsx`.  
- Location: `/marketplace`, `app/components/marketplace-filter-form.tsx`.

**#12 — Active filter summary** `[MAJOR]`  
- Criterion: Edge cases / Consistency  
- Problem: Active chips are passive labels instead of controls, so users cannot remove one constraint at a time when debugging a zero-results state; the only recovery shortcut is a full reset link.  
- Location: `/marketplace`, `app/components/marketplace-filter-form.tsx`.

**#31 — Submission feedback** `[MAJOR]`  
- Criterion: Feedback / Accessibility  
- Problem: Success feedback on `/designer` is driven by `?submitted=1`, which survives refreshes and never takes focus. The disabled price field in `app/components/upload-form.tsx` also keeps a default-looking value without clarifying how free/included titles are saved.  
- Location: `app/designer/page.tsx`, `app/components/upload-form.tsx`.

**#33 — Analytics charts** `[MAJOR]`  
- Criterion: Accessibility / Edge cases  
- Problem: `app/components/analytics-chart.tsx` presents the most detailed values through hover-oriented Recharts tooltips; the fallback tables are screen-reader-only, so sighted keyboard users do not get a visible data path.  
- Location: `/designer`, `app/components/analytics-chart.tsx`.

---

## Phase 4 — Remediation Plan

**Remediation #1** `[S]`  
- Description: Replace fake subscription/onboarding buttons with honest route-based CTAs that take users to real next-step surfaces instead of transient mock states.  
- Target: `app/page.tsx`, `app/components/subscription-grid.tsx`, `/`, `/community`.  
- UI pattern: Contextual deep-link CTA pattern (real navigation, role-accurate labels, no fake confirmation state).

**Remediation #2** `[S]`  
- Description: Refactor marketplace search/filter feedback so queries update live, active chips can be removed individually, and users receive explicit “results updating/current filters” cues.  
- Target: `app/components/marketplace-filter-form.tsx`, `app/marketplace/page.tsx`, `/marketplace`.  
- UI pattern: Live filter form with removable chips, debounced query updates, and status messaging.

**Remediation #3** `[S]`  
- Description: Replace URL-bound designer success banners with an accessible flash pattern that clears stale query params, takes focus, and explains how pricing behaves when access is free or included.  
- Target: `app/designer/page.tsx`, `app/components/upload-form.tsx`, `/designer`.  
- UI pattern: Dismissible status banner / toast with field-level helper text.

**Remediation #4** `[S]`  
- Description: Surface hidden community data by adding a visible craft-along calendar and designer spotlight section so seeded content in `lib/data.ts` is reachable through the UI.  
- Target: `app/community/page.tsx`, `/community`, `lib/data.ts` consumers.  
- UI pattern: Secondary content rails/cards for hidden inventory.

**Remediation #5** `[S]`  
- Description: Add visible analytics data disclosures so chart values remain available without hover and empty-data cases still communicate what the panel represents.  
- Target: `app/components/analytics-chart.tsx`, `/designer`.  
- UI pattern: Collapsible supporting data tables beneath charts.

---

## Phase 5 — Priority Stack Rank

### Quick Wins

| Rank | Feature / Gap | Severity | Current Status | Effort | Target |
|---|---|---|---|---|---|
| 1 | Subscription plan enrollment / fake choose-plan affordances (#7, #8, #40) | [CRITICAL] | [MISSING]/[PARTIAL] | [S] | `app/components/subscription-grid.tsx`, `app/page.tsx` |
| 2 | Marketplace search and filter feedback (#9, #12) | [MAJOR] | [PARTIAL] | [S] | `app/components/marketplace-filter-form.tsx`, `app/marketplace/page.tsx` |
| 3 | Designer submission feedback loop (#31) | [MAJOR] | [PARTIAL] | [S] | `app/designer/page.tsx`, `app/components/upload-form.tsx` |
| 4 | Hidden community schedule and designer content (#38, #39) | [MAJOR] | [HIDDEN] | [S] | `app/community/page.tsx` |
| 5 | Analytics data access beyond hover (#33) | [MAJOR] | [PARTIAL] | [S] | `app/components/analytics-chart.tsx` |

### Full Stack Rank

| Rank | Feature / Gap | Domain | Severity | UI Status | Impact | Effort | Recommended Fix |
|---|---|---|---|---|---|---|---|
| 1 | Subscription plan enrollment / fake choose-plan affordances (#7, #8, #40) | Membership / Platform Shell | [CRITICAL] | [MISSING]/[PARTIAL] | High trust risk on primary CTAs | [S] | Remediation #1 |
| 2 | Marketplace search and filter feedback (#9, #12) | Marketplace | [MAJOR] | [PARTIAL] | High browse friction on the catalog’s core control surface | [S] | Remediation #2 |
| 3 | Designer submission feedback loop (#31) | Designer Workspace | [MAJOR] | [PARTIAL] | High post-submit confusion in the only write flow | [S] | Remediation #3 |
| 4 | Hidden community schedule and designer content (#38, #39) | Community | [MAJOR] | [HIDDEN] | Medium-high discoverability loss for already-seeded content | [S] | Remediation #4 |
| 5 | Analytics data access beyond hover (#33) | Designer Workspace | [MAJOR] | [PARTIAL] | Medium accessibility gap on decision-support data | [S] | Remediation #5 |
