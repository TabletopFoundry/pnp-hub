# PnP Hub MVP

PnP Hub is a craft-inspired print-and-play marketplace MVP built with Next.js App Router, TypeScript, Tailwind CSS, Recharts, and SQLite via `better-sqlite3`.

## Features

- Landing page with hero, featured games, subscription tiers, and designer CTA
- Marketplace with 30+ seeded games, search, filters, sorting, badges, empty states, and responsive cards
- Game detail pages with previews, reviews, component lists, download mock, and print optimizer summary
- Interactive print optimizer with saved printer profile defaults, layout preview, cost estimates, and cutting guidance
- Designer dashboard with upload wizard, SQLite-backed draft persistence, analytics charts, geography breakdown, and 75/25 revenue split
- Community page with craft gallery, tutorial library, monthly craft-along spotlight, and subscription comparison

## Tech stack

- Next.js 16 App Router + React 19
- TypeScript
- Tailwind CSS 4
- SQLite (`better-sqlite3`)
- Recharts

## Getting started

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Data model notes

- The SQLite database lives at `data/pnp-hub.db`
- The database auto-seeds on first run with marketplace titles, reviews, tutorials, craft gallery entries, and designer analytics
- Designer uploads create draft game records in SQLite so submissions persist across refreshes

## Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — run the production server
- `npm run lint` — run ESLint
