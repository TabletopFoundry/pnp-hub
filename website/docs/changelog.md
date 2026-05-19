---
title: Changelog
description: Notable changes to PnP Hub.
---

# Changelog

All notable changes to PnP Hub are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

- Documentation site (this site) published with Docusaurus.

## [1.0.0]

### Added

- Marketplace with search, category filters, sort options, and responsive cards.
- Per-game detail page with components list, gallery, reviews, and full print profile.
- Print optimizer with paper size (Letter/A4), color mode (color/B&W), duplex savings, and cost estimation. Printer profile persists in `localStorage`.
- Designer dashboard with 75/25 revenue split, downloads, geography breakdown, and draft uploads.
- Community hub: 24-entry craft gallery, 18 tutorials, monthly craft-along schedule.
- 56 seeded games, 12 designer profiles, 100+ reviews, all idempotently re-seedable.
- WAL mode + foreign keys on SQLite for safe concurrent reads.
- Production seed guard via `PNP_HUB_ALLOW_PRODUCTION_SEED`.
- Composable TypeScript types (`GameCore`, `GamePricing`, etc.) and render-specific views (`GameSummary`, `GameListingView`, `GameCardView`).
- Vitest + React Testing Library setup with in-memory database pattern.
- ESLint + TypeScript strict mode + `npm run validate` gate.

### Technical

- Next.js 16 (App Router) + React 19.
- Tailwind CSS 4 with PostCSS plugin.
- `better-sqlite3` 12 for synchronous, in-process SQLite.
- Recharts for the designer dashboard.

## [0.x]

Pre-1.0 development was tracked in internal review documents under `docs/`. Highlights:

- Multiple UX review iterations refined the craft-inspired visual language.
- Multiple code review iterations established the composable type pattern, the seed-versioning protocol, and safe JSON parsing.

---

For the full commit history, see the [GitHub releases page](https://github.com/TabletopFoundry/pnp-hub/releases).
