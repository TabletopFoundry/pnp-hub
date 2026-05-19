---
title: Introduction
---

# PnP Hub

**A craft-inspired marketplace for print-and-play board games — built with Next.js 16, React 19, TypeScript, and SQLite.**

PnP Hub is a self-contained reference app that demonstrates how to build a full-featured tabletop marketplace without depending on any external service. Clone it, run `npm install && npm run dev`, and you have a working marketplace seeded with 56 games, 12 designer profiles, 100+ reviews, a print optimizer, and a designer revenue dashboard.

## Who is this for?

- **Indie designers** who want a transparent platform to publish print-and-play games and see real download/revenue data.
- **Tabletop hobbyists** who want a curated discovery experience and a print optimizer that actually estimates paper, ink, and assembly effort.
- **Engineers** looking for a realistic Next.js App Router + SQLite reference app that exercises server actions, dynamic routes, JSON-backed seed data, and revenue analytics.

## What you get out of the box

| Surface | What it does |
|---|---|
| **Marketplace** | Search, filter, sort, and browse the catalog with responsive cards and badges. |
| **Game Details** | Per-game pages with components, gallery, reviews, and a complete print profile. |
| **Print Optimizer** | Letter vs A4, color vs grayscale, duplex savings, cost estimation, cut difficulty. |
| **Designer Dashboard** | Downloads, revenue (75/25 split), geography breakdown, draft uploads. |
| **Community** | Craft gallery, tutorial library, monthly craft-along spotlight. |

## How to use these docs

- New here? Start with the [Quickstart](./getting-started/quickstart) — you'll have the app running locally in under five minutes.
- Want the big picture? Read [Architecture](./concepts/architecture) and [Data Model](./concepts/data-model).
- Building on top of PnP Hub? Jump to [Add a game](./guides/add-a-game) and the [Reference](./reference/configuration) section.
- Stuck? Check [Troubleshooting](./troubleshooting) or open a [GitHub issue](https://github.com/TabletopFoundry/pnp-hub/issues).

:::tip Why "craft-inspired"?
The UI leans on warm terracotta, paper-textured surfaces, and typography choices that evoke hand-printed game components — because that's what your players will actually be doing: cutting, folding, and sleeving cards on the kitchen table.
:::
