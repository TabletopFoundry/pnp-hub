---
title: Quickstart
description: Get PnP Hub running locally in under five minutes.
---

# Quickstart

This page gets you from zero to a running marketplace in under five minutes. No external services, no API keys, no Docker.

## Prerequisites

- **Node.js ≥ 22** — check with `node --version`. If you use [nvm](https://github.com/nvm-sh/nvm), run `nvm use` in the project root.
- **npm ≥ 10** — ships with recent Node releases.
- **~300 MB free disk space** for `node_modules` and the seeded SQLite database.

## 1. Clone and install

```bash
git clone https://github.com/TabletopFoundry/pnp-hub.git
cd pnp-hub
npm install
```

The install step compiles `better-sqlite3` against your Node version, so the first install takes 30–60 seconds.

## 2. Start the dev server

```bash
npm run dev
```

Open **http://localhost:3000**. On first request, PnP Hub will:

1. Create the SQLite database at `data/pnp-hub.db`.
2. Enable WAL journaling and foreign keys.
3. Run the seed migration in a single transaction — 56 games, 12 designers, 100+ reviews, 24 gallery posts, 18 tutorials, and a 12-month craft-along schedule.

You'll see the marketplace home page populated immediately.

## 3. Explore the five surfaces

| Path | Surface |
|---|---|
| [`/`](http://localhost:3000/) | Landing page with featured games and craft-along spotlight |
| [`/marketplace`](http://localhost:3000/marketplace) | Searchable catalog with filters and sorting |
| [`/games/<slug>`](http://localhost:3000/marketplace) | Per-game detail, reviews, and print profile |
| [`/optimizer`](http://localhost:3000/optimizer) | Print optimizer — try switching paper size and color mode |
| [`/designer`](http://localhost:3000/designer) | Designer dashboard with revenue and geography analytics |
| [`/community`](http://localhost:3000/community) | Craft gallery, tutorials, and craft-along |

## 4. Validate your environment

Run the full validation pipeline before committing changes:

```bash
npm run validate
```

This runs ESLint, the TypeScript compiler (`tsc --noEmit`), and the full Vitest suite. Expect it to complete in under 30 seconds on a modern laptop.

## What's next?

- Read the [Project Tour](./project-tour) to learn where everything lives.
- Understand the [Architecture](../concepts/architecture) and [Data Model](../concepts/data-model).
- Try [Add a game](../guides/add-a-game) to extend the seed catalog with your own title.
