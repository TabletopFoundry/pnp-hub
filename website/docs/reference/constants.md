---
title: Constants
description: Every tunable number in PnP Hub, with provenance and effect.
---

# Constants

All tunables live in [`lib/constants.ts`](https://github.com/TabletopFoundry/pnp-hub/blob/main/lib/constants.ts). This page is the human-readable index.

## Revenue split

| Constant | Default | Effect |
|---|---|---|
| `DESIGNER_REVENUE_SHARE` | `0.75` | Fraction of gross revenue paid to designers. |
| `PLATFORM_REVENUE_SHARE` | derived | `1 - DESIGNER_REVENUE_SHARE`. |

See [Revenue Split](../concepts/revenue-split).

## Validation limits

| Constant | Default | Effect |
|---|---|---|
| `MAX_TITLE_LENGTH` | `200` | Hard cap on game title length. |
| `MAX_DESCRIPTION_LENGTH` | `5000` | Hard cap on game description length. |

Both are enforced in the upload server action and surface as inline form errors.

## Pagination

| Constant | Default | Effect |
|---|---|---|
| `DEFAULT_PAGE_SIZE` | `24` | Marketplace items per page. |
| `MAX_REVIEWS_PER_GAME` | `6` | Reviews shown on the game detail page (with "see more"). |
| `DEFAULT_FEATURED_LIMIT` | `6` | Featured games on the home page. |
| `MAX_RELATED_GAMES` | `3` | "You might also like" count on game detail. |

## Print optimizer

| Constant | Default | Effect |
|---|---|---|
| `PRINTER_PROFILE_STORAGE_KEY` | `'pnp-hub-printer-profile'` | localStorage key for printer prefs. |
| `A4_PAPER_MULTIPLIER` | `1.05` | Sheet count multiplier when switching from Letter to A4. |
| `BASE_SHEET_COST` | `0.16` | USD per sheet (paper only). |
| `COLOR_INK_COST` | `0.18` | Additional USD per sheet for color. |
| `BW_INK_COST` | `0.08` | Additional USD per sheet for black-and-white. |
| `DUPLEX_COST_SAVINGS` | `0.86` | Total cost multiplier when duplex is enabled. |
| `DUPLEX_SHEET_SAVINGS` | `0.88` | Sheet count multiplier when duplex is enabled. |

See [Print Optimizer](../concepts/print-optimizer) for the math.

## Enums

| Constant | Members |
|---|---|
| `GAME_CATEGORIES` | `Strategy`, `Party`, `Family`, `Solo`, `Cooperative`, `Card`, `Educational`, `2-Player` |
| `ACCESS_TYPES` | `free`, `included`, `purchase` |

Both are declared `as const` and are the single source of truth for the corresponding string-literal types in `lib/types.ts`. Use them for runtime validation in forms and filters — never duplicate the literals.

## Adding a new constant

1. Add it to `lib/constants.ts` with a JSDoc comment.
2. Import it (`import { YOUR_CONSTANT } from '@/lib/constants'`) — don't inline the number.
3. Add a test in `__tests__/lib/` if the constant affects user-visible math.
4. Document it on this page.
