---
title: Print Optimizer
description: How the optimizer estimates sheets, ink, and cost.
---

# Print Optimizer

The print optimizer is PnP Hub's signature feature: a calculator that takes a game's print profile and produces realistic estimates for paper, ink, and cost across two paper sizes and two color modes.

## What it produces

For any game and any combination of inputs, the optimizer returns:

- **Sheet count** — adjusted for paper size and duplex savings.
- **Estimated cost** — base sheet cost + ink cost, with duplex savings applied.
- **Paper stock recommendation** — passed through from the game's print profile.
- **Cut difficulty** + **cutting guide** — qualitative guidance from the designer.
- **Layout preview text** — what the printed sheet will look like.

## Inputs

| Input | Values | Default |
|---|---|---|
| Game | Any seeded title | URL parameter `?game=<slug>`, else first listed |
| Paper size | `Letter` (8.5" × 11") or `A4` (210 × 297 mm) | `Letter` |
| Color mode | `color` or `bw` | `color` |
| Duplex | `true` or `false` | `false` |
| Quality | `draft` or `standard` | `standard` |

Printer profile (paper size + duplex + quality) is persisted to `localStorage` under the key `pnp-hub-printer-profile`. The next visit pre-fills the form.

## How the math works

All constants live in `lib/constants.ts` and are tested in `__tests__/lib/`.

### Sheet count

```ts
let sheets = profile.sheetCount;
if (paperSize === 'A4') sheets *= A4_PAPER_MULTIPLIER;  // 1.05
if (duplex)             sheets *= DUPLEX_SHEET_SAVINGS; // 0.88
sheets = Math.ceil(sheets);
```

A4 is slightly larger than US Letter, but most PnP layouts have margin headroom, so the multiplier (`1.05`) reflects empirically observed waste rather than the raw area ratio.

Duplex (double-sided) printing saves close to 50% on physical sheets but real layouts rarely pair perfectly, so the modelled savings factor is **0.88** — a realistic number, not an ideal one.

### Cost

```ts
const sheetCost = sheets * BASE_SHEET_COST;          // $0.16/sheet
const inkCost   = sheets * (color === 'color'
  ? COLOR_INK_COST                                   // $0.18/sheet
  : BW_INK_COST);                                    // $0.08/sheet
let total = sheetCost + inkCost;
if (duplex) total *= DUPLEX_COST_SAVINGS;            // 0.86
```

Duplex saves slightly more on cost than on sheets because doubling up reduces per-job ink prime and warm-up waste.

### Why these numbers?

The constants are calibrated against typical inkjet cost-per-page surveys (2023). They're intentionally conservative — players consistently report that real costs come in **at or below** the optimizer's estimate. Better to surprise on the upside than to under-promise.

## Where it lives in code

| File | Responsibility |
|---|---|
| `app/optimizer/page.tsx` | Server component, reads `?game=<slug>` |
| `app/components/optimizer-tool.tsx` | Client component, holds form state |
| `lib/data.ts` → `getOptimizerGames()` | Returns lightweight game info for the picker |
| `lib/constants.ts` | All paper/ink/duplex constants |
| `__tests__/lib/format.test.ts` and friends | Math tests |

## Customizing for your printer

The constants are intentionally exposed and edit-friendly. If your home printer is cheaper or more expensive than the defaults, change `BASE_SHEET_COST`, `COLOR_INK_COST`, and `BW_INK_COST` in `lib/constants.ts`. The optimizer recalculates everywhere.

A future feature could expose these as user settings via the existing `pnp-hub-printer-profile` localStorage entry. PRs welcome.
