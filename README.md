# 🎲 PnP Hub

> A craft-inspired print-and-play board game marketplace — discover, optimize, and print tabletop games at home.

[![CI](https://github.com/your-username/pnp-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/pnp-hub/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)

---

## ✨ Features

| Surface | What it does |
|---------|-------------|
| **Marketplace** | Browse 50+ seeded games with search, filters, sorting, badges, and responsive cards |
| **Game Details** | Preview art, read reviews, view component lists, and check print profiles |
| **Print Optimizer** | Choose paper size, color mode, preview layouts, estimate costs, and get cutting guidance |
| **Designer Dashboard** | Upload games, track downloads/revenue, view geography analytics (75/25 split) |
| **Community** | Craft gallery, tutorial library, monthly craft-along spotlight |

## 🚀 Quick Start

**Prerequisites:** [Node.js](https://nodejs.org/) ≥ 22

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open **http://localhost:3000** — the SQLite database auto-seeds with 50+ games on first run.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) (strict mode) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Database | [SQLite](https://www.sqlite.org/) via [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) |
| Charts | [Recharts](https://recharts.org/) |
| Testing | [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) |

## 📁 Project Structure

```
app/                      # Next.js App Router
├── components/           # Shared UI components
├── community/            # Community hub page
├── designer/             # Designer dashboard + server actions
├── games/[slug]/         # Dynamic game detail pages
├── marketplace/          # Marketplace browse with filters
├── optimizer/            # Print optimizer tool
├── layout.tsx            # Root layout with nav + footer
└── page.tsx              # Landing page
lib/                      # Core business logic
├── constants.ts          # Shared application constants
├── data.ts               # Database query helpers
├── db.ts                 # SQLite connection, schema, seeding
├── format.ts             # Display formatting utilities
├── seed.ts               # Demo catalog seed data
└── types.ts              # TypeScript type definitions
docs/                     # Project documentation
__tests__/                # Test files
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run validate` | Run lint + typecheck + tests |

## 💾 Seed Data

- The SQLite database lives at `data/pnp-hub.db` and auto-seeds on first run in development/test environments
- Auto-seeding is **guarded in production**; set `PNP_HUB_ALLOW_PRODUCTION_SEED=true` only when you intentionally want to load demo data
- Seeding is **transactional** and **idempotent**: rerunning it updates the seeded catalog without duplicating rows, while draft uploads remain untouched
- The dataset includes 56 published games, 12 designer profiles, 100+ reviews, 24 craft gallery entries, 18 tutorials, a 12-month craft-along schedule, and richer download/revenue analytics
- Edge cases are intentionally present: titles with zero ratings, designers with a single game, and long-form descriptions for layout stress testing
- Designer uploads create draft game records in SQLite, persisting across refreshes
- Database uses WAL journal mode for better concurrent read performance

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## 📄 License

[MIT](LICENSE) © PnP Hub Contributors
