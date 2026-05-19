---
title: Customize pricing
description: Change prices, currency display, and the revenue split.
---

# Customize Pricing

Prices in PnP Hub are stored as **integer cents** in the `priceCents` column. There is no floating-point currency anywhere in the codebase. This guide shows the safe ways to customize pricing.

## Change a single game's price

Edit the game's seed entry in `lib/seed.ts`:

```ts
{
  slug: 'paper-arena',
  // …
  priceCents: 599,  // $5.99
}
```

Bump `SEED_VERSION` and restart the dev server. The new price flows through:

- Marketplace card
- Game detail page
- Optimizer cost estimate (independent — uses your printer profile, not the game price)
- Designer revenue calculations (use `revenue_cents`, which you should update consistently)

## Change the global revenue split

Open `lib/constants.ts`:

```ts
export const DESIGNER_REVENUE_SHARE = 0.80;  // was 0.75
export const PLATFORM_REVENUE_SHARE = 1 - DESIGNER_REVENUE_SHARE;
```

That's it. Every dashboard widget, tooltip, and report reads from these constants. See [Revenue Split](../concepts/revenue-split).

## Change currency display

Currency formatting is centralized in `lib/format.ts`:

```ts
export function formatPrice(cents: number): string {
  if (cents === 0) return 'Free';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}
```

To switch to euros:

```ts
return new Intl.NumberFormat('en-EU', {
  style: 'currency',
  currency: 'EUR',
}).format(cents / 100);
```

The function is used everywhere prices are rendered. Tests in `__tests__/lib/format.test.ts` will need their expected strings updated.

## Add a new access type

Adding a fourth access type (say `'preorder'`) is intentional friction — it touches multiple files. Here's the checklist:

1. **`lib/types.ts`** — extend the `AccessType` union.
2. **`lib/constants.ts`** — add the literal to `ACCESS_TYPES`.
3. **`lib/format.ts`** — update `formatPrice` and any access-type-aware helpers.
4. **`app/components/game-card.tsx`** — update the badge logic.
5. **`__tests__/lib/format.test.ts`** — add tests for the new case.

If the type system doesn't complain after step 1, you missed a switch statement somewhere.

## Customizing print cost defaults

The optimizer's cost math is also in `lib/constants.ts`:

```ts
export const BASE_SHEET_COST = 0.16;   // dollars/sheet
export const COLOR_INK_COST = 0.18;    // additional/sheet for color
export const BW_INK_COST = 0.08;       // additional/sheet for B&W
export const DUPLEX_COST_SAVINGS = 0.86;
export const DUPLEX_SHEET_SAVINGS = 0.88;
export const A4_PAPER_MULTIPLIER = 1.05;
```

Change these and the optimizer recalculates everywhere. See [Print Optimizer](../concepts/print-optimizer).
