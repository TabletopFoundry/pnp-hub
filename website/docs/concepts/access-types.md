---
title: Access Types
description: Free, included, and purchase — the three catalog access modes.
---

# Access Types

Every game in PnP Hub has an `accessType` that controls how players can obtain it. There are exactly three values, and the choice is deliberate: it's the single most important decision a designer makes when publishing.

## The three modes

| Access Type | Price | Who can download | Use it when… |
|---|---|---|---|
| `free` | 0 | Anyone (rate-limited to 2 per month for unregistered users) | You want maximum reach — promo content, demos, community gifts. |
| `included` | Set, but not charged at download | Subscribers only | You want recurring revenue and benefit from being in a curated bundle. |
| `purchase` | Set, charged at download | Anyone who buys | You want one-time revenue and full margin per download. |

## How it's used in code

The type is defined in `lib/types.ts`:

```ts
export type AccessType = 'free' | 'included' | 'purchase';
```

And the full list of valid values lives in `lib/constants.ts`:

```ts
export const ACCESS_TYPES = ['free', 'included', 'purchase'] as const;
```

Use `ACCESS_TYPES` for runtime validation in upload forms and filter UIs — never duplicate the literal.

## Display rules

The marketplace card and game detail page render access type with three different visual treatments:

| Access Type | Badge | Price display |
|---|---|---|
| `free` | "Free" pill | "Free" |
| `included` | "Included" pill | Crossed-out price + "Included with subscription" |
| `purchase` | No badge | Formatted price (e.g. `$4.50`) |

Implementation lives in `lib/format.ts` (`formatPrice`) and the `GameCard` component.

## Validation in upload forms

When a designer creates or edits a game, the server action validates `accessType` against `ACCESS_TYPES`:

```ts
if (!ACCESS_TYPES.includes(payload.accessType)) {
  return { error: 'Invalid access type' };
}
```

The same check applies to `category`, which uses `GAME_CATEGORIES`.

## Pricing rules

- `free`: `priceCents` **must** be 0. Enforced at the form level.
- `included`: `priceCents` is the "list price" — used for crossed-out display and revenue accounting if a subscriber's tier includes the title.
- `purchase`: `priceCents` is the actual charge in cents.

All prices are stored as integer cents to avoid floating-point rounding errors. Use `formatPrice(priceCents)` from `lib/format.ts` to render currency.

## Designer revenue by access type

| Access Type | Revenue recorded per download |
|---|---|
| `free` | 0 |
| `included` | Pro-rata share of subscription revenue (modelled in seed data, not collected live in this reference app) |
| `purchase` | 75% of `priceCents`, recorded in `revenue_cents` |

See [Revenue Split](./revenue-split) for how the 75/25 share is calculated.
