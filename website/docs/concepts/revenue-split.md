---
title: Revenue Split
description: How PnP Hub models the 75/25 revenue share between designers and the platform.
---

# Revenue Split

PnP Hub uses a **75/25 designer-favoured split**: designers keep 75% of gross revenue, the platform retains 25% to cover infrastructure, editorial review, and payment processing.

## The single source of truth

Two constants in `lib/constants.ts` define the split — everything else derives from them:

```ts
export const DESIGNER_REVENUE_SHARE = 0.75;
export const PLATFORM_REVENUE_SHARE = 1 - DESIGNER_REVENUE_SHARE;
```

This is intentional. If you ever change the split (say, to a 70/30 or a tiered model), edit `DESIGNER_REVENUE_SHARE` and every dashboard, report, and tooltip updates in lock-step.

## How it appears in the data

The `games` table stores `revenue_cents` per game — this is the **designer's share already**, not gross. The seed data populates it with realistic numbers consistent with download counts and prices:

```text
revenue_cents ≈ download_count × price_cents × DESIGNER_REVENUE_SHARE
```

If you re-seed with different prices, the calculator stays internally consistent.

## How it's displayed

The designer dashboard (`/designer`) shows:

| Metric | Computed as |
|---|---|
| Lifetime revenue | Sum of `revenue_cents` across the designer's games |
| Estimated gross | `lifetime revenue / DESIGNER_REVENUE_SHARE` |
| Platform fee | `lifetime revenue × PLATFORM_REVENUE_SHARE / DESIGNER_REVENUE_SHARE` |

All computed in `lib/data.ts` using the same constants.

## Why 75/25?

It's a deliberate competitive positioning choice. Common comparables:

| Platform | Designer share |
|---|---|
| App store / large marketplaces | 70% |
| Music streaming royalties | ~58% |
| **PnP Hub (this project)** | **75%** |
| Direct-to-fan platforms | 90%+ (but the fan does the marketing) |

The model says: as a curated marketplace with editorial review and a print optimizer, the platform earns more than a pure file host but less than a generic app store.

## Want to change it?

Open `lib/constants.ts`, change the share, and run `npm run validate`. Tests use the same constant rather than hardcoded `0.75`, so they'll still pass. The dashboard label "75/25 split" lives in one place — `app/designer/page.tsx` — search and replace.
