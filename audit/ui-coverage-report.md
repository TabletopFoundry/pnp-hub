# PnP Hub UX Audit — Coverage Report (Pass 4)

## Summary

Fresh fourth-pass UX audit of the current `pnp-hub` state after the first three remediation waves landed across the shell, marketplace, detail, community, and designer flows. This pass re-checked the home funnel (`app/page.tsx`), marketplace discovery and pagination (`app/marketplace/page.tsx`, `app/components/marketplace-filter-form.tsx`, `app/components/marketplace-pagination.tsx`, `lib/data.ts`), game detail handoffs (`app/games/[slug]/page.tsx`), the designer upload funnel (`app/designer/page.tsx`, `app/components/upload-form.tsx`, `app/designer/actions.ts`), and the optimizer/share flow (`app/optimizer/page.tsx`, `app/components/optimizer-tool.tsx`). Baseline validation on the pre-change tree succeeded with `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.

No `AGENTS.md` or `CLAUDE.md` exists under `pnp-hub`, so this pass follows the repository’s current code and test conventions directly. The main UX gaps now cluster around misleading empty states, weak cross-surface handoffs, hidden pagination behavior, an error-prone draft category default, and optimizer setups that still cannot be restored or shared through the URL.

---

## Phase 1 — Feature Inventory by journey

### Home and shell framing
- Hero, featured catalog, monthly craft spotlight, and designer CTA: `app/page.tsx`
- Global shell, banner, primary navigation, and footer: `app/layout.tsx`

### Marketplace discovery
- Marketplace framing, result summary, grid, and empty state: `app/marketplace/page.tsx`
- Search, filters, active chips, and status copy: `app/components/marketplace-filter-form.tsx`
- Pagination controls and page links: `app/components/marketplace-pagination.tsx`
- Filtered catalog query and pagination logic: `lib/data.ts`

### Game detail and learning handoff
- Detail metadata, reviews, related games, optimizer CTA, and tutorial CTA: `app/games/[slug]/page.tsx`
- Community landing composition and tutorial section placement: `app/community/page.tsx`
- Tutorial card CTAs and section wrapper: `app/components/tutorial-library.tsx`

### Designer submission flow
- Designer dashboard framing and upload surface: `app/designer/page.tsx`
- Draft upload fields and pricing/category controls: `app/components/upload-form.tsx`
- Server-side submission validation and draft persistence: `app/designer/actions.ts`

### Optimizer and validation coverage
- Optimizer page query handoff: `app/optimizer/page.tsx`
- Client-side print profile persistence and layout preview: `app/components/optimizer-tool.tsx`
- Existing regression coverage: `__tests__/components.test.tsx`, `__tests__/data.test.ts`, `__tests__/format.test.ts`, `__tests__/constants.test.ts`, `package.json`

---

## Phase 2 — UI Coverage table

| Journey | Surface | Coverage | Paths | Notes |
|---|---|---|---|---|
| Home funnel | Hero, featured picks, monthly craft CTA | Covered | `app/page.tsx` | Primary entry paths are clear and already grounded in live catalog totals. |
| Marketplace discovery | Search, filters, and result announcements | Covered | `app/components/marketplace-filter-form.tsx`, `app/marketplace/page.tsx` | Prior passes resolved remounting, chip-label, and live-region issues. |
| Marketplace discovery | Pagination resilience | Partial | `app/marketplace/page.tsx`, `app/components/marketplace-pagination.tsx`, `lib/data.ts` | Invalid or stale `page` params can still land on an empty-state message even when catalog matches exist. |
| Game detail | Learning and support handoffs | Partial | `app/games/[slug]/page.tsx`, `app/community/page.tsx`, `app/components/tutorial-library.tsx` | The tutorial CTA sends users to the community top instead of the actual tutorial section. |
| Designer workflow | Draft submission accuracy | Partial | `app/components/upload-form.tsx`, `app/designer/actions.ts` | Category still defaults to the first option, making accidental misclassification too easy. |
| Marketplace discovery | Pagination state feedback | Partial | `app/components/marketplace-filter-form.tsx`, `app/components/marketplace-pagination.tsx` | Filter changes silently reset pagination, which can feel jarring on deeper result pages. |
| Optimizer | Restorable/shareable setup state | Partial | `app/optimizer/page.tsx`, `app/components/optimizer-tool.tsx` | Printer-profile choices live only in localStorage, so links cannot recreate a chosen setup. |
| Validation | Automated regression coverage | Covered | `package.json`, `__tests__/components.test.tsx`, `__tests__/data.test.ts` | Lint, typecheck, test, and build commands exist and passed on the baseline tree. |

---

## Phase 3 — UX Quality severities

### 1. Out-of-range marketplace pages can show a false empty state — **Major**
- **Paths:** `app/marketplace/page.tsx`, `lib/data.ts`
- **What happens:** Visiting a stale deep link such as `/marketplace?page=999` can return no items and trigger the empty-state panel even when matching catalog items still exist.
- **Why it matters:** Users can misread the marketplace as empty or broken instead of simply over-paginated.

### 2. The game-detail tutorial CTA drops users at the top of Community — **Major**
- **Paths:** `app/games/[slug]/page.tsx`, `app/community/page.tsx`, `app/components/tutorial-library.tsx`
- **What happens:** “Watch tutorials” routes to `/community`, forcing users to hunt for the relevant learning section after explicitly asking for help.
- **Why it matters:** Support intent is high-friction at the exact moment players want guided help.

### 3. The upload wizard silently assigns the first category by default — **Major**
- **Paths:** `app/components/upload-form.tsx`, `app/designer/actions.ts`
- **What happens:** New drafts start with the first category already selected, so rushed submissions can be misfiled without the designer noticing.
- **Why it matters:** Incorrect categories hurt discoverability and create unnecessary editorial cleanup work.

### 4. Filter changes reset pagination without telling the user — **Moderate**
- **Paths:** `app/components/marketplace-filter-form.tsx`, `app/components/marketplace-pagination.tsx`
- **What happens:** Non-page filter changes correctly remove `page`, but the UI does not explain why the result set suddenly jumps back to the first page.
- **Why it matters:** The catalog feels less predictable when users are browsing beyond page 1.

### 5. Optimizer setups cannot be reliably restored or shared — **Moderate**
- **Paths:** `app/optimizer/page.tsx`, `app/components/optimizer-tool.tsx`
- **What happens:** Paper size, color mode, duplex mode, and selected game persist only in localStorage, so bookmarks and shared links lose the chosen print setup.
- **Why it matters:** Users cannot return to or share a reproducible print configuration with confidence.

---

## Phase 4 — Remediation Plan with effort

| Remediation | Effort | Paths | Planned fix |
|---|---|---|---|
| Clamp marketplace pagination to the last valid page | S | `lib/data.ts`, `__tests__/data.test.ts` | Clamp requested pages against the computed `totalPages` so stale deep links still render live catalog results instead of a false empty state. |
| Anchor the tutorial CTA to the tutorial library | S | `app/games/[slug]/page.tsx`, `app/components/tutorial-library.tsx`, `__tests__/components.test.tsx` | Give the tutorial section a stable anchor and send the detail-page CTA straight to that section. |
| Require an explicit category choice for new drafts | S | `app/components/upload-form.tsx`, `app/designer/actions.ts`, `__tests__/components.test.tsx`, `__tests__/designer-actions.test.ts` | Add a blank placeholder option, mark the select required, and reject missing categories server-side. |
| Explain page resets after marketplace filter changes | S | `app/components/marketplace-filter-form.tsx`, `__tests__/components.test.tsx` | Surface a brief non-live status note when a filter change returns the catalog to page 1. |
| Sync optimizer setup state into the URL | M | `app/optimizer/page.tsx`, `app/components/optimizer-tool.tsx`, `__tests__/components.test.tsx` | Parse printer-profile query params on load and keep selected game/profile state mirrored in the URL for bookmarking and sharing. |

---

## Phase 5 — Priority Stack Rank

### Quick Wins — Top 5

| Rank | Item | Severity | Effort | Paths |
|---|---|---|---|---|
| 1 | Clamp marketplace pagination to the last valid page | Major | S | `lib/data.ts` |
| 2 | Anchor the tutorial CTA to the tutorial library | Major | S | `app/games/[slug]/page.tsx`, `app/components/tutorial-library.tsx` |
| 3 | Require an explicit category choice for new drafts | Major | S | `app/components/upload-form.tsx`, `app/designer/actions.ts` |
| 4 | Explain page resets after marketplace filter changes | Moderate | S | `app/components/marketplace-filter-form.tsx` |
| 5 | Sync optimizer setup state into the URL | Moderate | M | `app/optimizer/page.tsx`, `app/components/optimizer-tool.tsx` |

### Full stack rank

| Rank | Issue | Why now |
|---|---|---|
| 1 | Out-of-range marketplace pages can show a false empty state | It can make the catalog appear empty even when inventory is available. |
| 2 | The game-detail tutorial CTA drops users at the top of Community | It interrupts a high-intent help flow with unnecessary scrolling and searching. |
| 3 | The upload wizard silently assigns the first category by default | It risks avoidable metadata mistakes at the point of submission. |
| 4 | Filter changes reset pagination without telling the user | It creates avoidable confusion on deep result pages. |
| 5 | Optimizer setups cannot be reliably restored or shared | It limits repeatability for a tool whose value depends on reproducible settings. |

---

## Implementation Status

| Remediation | Status | Implementation |
|---|---|---|
| Clamp marketplace pagination to the last valid page | Pending | Planned in `lib/data.ts` with regression coverage in `__tests__/data.test.ts`. |
| Anchor the tutorial CTA to the tutorial library | Pending | Planned across `app/games/[slug]/page.tsx`, `app/components/tutorial-library.tsx`, and `__tests__/components.test.tsx`. |
| Require an explicit category choice for new drafts | Pending | Planned across `app/components/upload-form.tsx`, `app/designer/actions.ts`, `__tests__/components.test.tsx`, and `__tests__/designer-actions.test.ts`. |
| Explain page resets after marketplace filter changes | Pending | Planned in `app/components/marketplace-filter-form.tsx` with component coverage in `__tests__/components.test.tsx`. |
| Sync optimizer setup state into the URL | Pending | Planned across `app/optimizer/page.tsx`, `app/components/optimizer-tool.tsx`, and `__tests__/components.test.tsx`. |

### Validation status

- Baseline validation passed before implementation: `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
- Post-remediation validation: Pending.
