---
title: Why PnP Hub
description: How PnP Hub compares to alternatives and when to pick it.
---

# Why PnP Hub

There are existing places to find print-and-play games. None of them are designed specifically for the home-printer experience. That's the gap PnP Hub fills.

## The landscape

| Option | What it is | Where it falls short |
|---|---|---|
| **BoardGameGeek (BGG) Files section** | The de facto repository for PnP files attached to game pages. | Discovery is opaque, files are inconsistent, no print profile, no estimated cost or cut difficulty. |
| **Itch.io (board games tag)** | A general indie game storefront with a tabletop tag. | Built for digital games — UX assumes you're downloading software, not paper. No print-aware tooling. |
| **Designer personal sites** | A designer publishes PnP downloads on their own site. | Great if you already know the designer. Terrible for discovery. |
| **PnP Arcade, Gametiles, etc.** | Niche PnP storefronts. | Limited optimizer features, opaque or absent designer revenue terms. |
| **PnP Hub (this project)** | Curated marketplace **plus** print optimizer **plus** transparent 75/25 split. | Self-hosted reference app today; needs forking + payment integration for commercial use. |

## Three things PnP Hub does differently

### 1. Print profile is a first-class field

Every game declares paper size, sheet count, ink expectations, cut difficulty, paper stock recommendation, and a cut guide. These aren't notes buried in a PDF — they're structured columns the marketplace, optimizer, and game detail page all read. You can filter and sort by them.

### 2. The optimizer treats the printer as part of the system

Choose Letter or A4, color or grayscale, duplex or single-sided, and get a real cost estimate. Your preferences persist across visits. Compare two games' total cost before downloading. Most PnP catalogs assume the printer is somebody else's problem.

### 3. A revenue model that's legible and edit-friendly

The 75/25 split is one constant in one file. Dashboard widgets, designer tooltips, and analytics all read from it. Fork the project and change it to 80/20, 70/30, or a tiered model in one line.

## When PnP Hub is the right choice

- You want a **reference implementation** of a tabletop marketplace.
- You need a **self-contained** demo that runs from a single clone — no Docker, no migrations, no external APIs.
- You're a designer or hobbyist who wants to **fork and customize** rather than rent SaaS.
- You're an engineer studying **Next.js 16 + SQLite + server actions** in a realistic codebase.

## When PnP Hub isn't (yet) the right choice

- You need **payments out of the box.** PnP Hub doesn't integrate Stripe. The schema supports it; the wiring is yours.
- You need **authentication.** The dashboard currently shows a single hardcoded "current designer". Add auth in your fork.
- You're operating at **catalog-of-millions scale.** SQLite is great into the hundreds-of-thousands. Beyond that, swap `lib/db.ts` to Postgres or Turso (the data layer translates cleanly).
- You need **multi-tenant SaaS.** This is a single-instance app by design.

## The honest summary

PnP Hub is a polished reference app, not a commercial platform. Its value is in the design choices: composable types, transparent revenue math, print-aware data, zero-dependency local runs. Take what you like, fork the rest.
