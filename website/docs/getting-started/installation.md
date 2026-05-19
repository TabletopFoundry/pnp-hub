---
title: Installation
description: Detailed installation, environment variables, and runtime configuration.
---

# Installation

This page covers installation in more detail than the [Quickstart](./quickstart), including environment variables, the production seed guard, and platform-specific notes.

## System requirements

| Requirement | Minimum | Notes |
|---|---|---|
| Node.js | 22.0.0 | Pinned via `engines` in `package.json` and `.nvmrc`. |
| npm | 10 | Bundled with Node 22. |
| RAM | 1 GB | SQLite is cheap; Next.js dev server is the heavier process. |
| Disk | ~300 MB | `node_modules` (~250 MB) + database (`data/pnp-hub.db`, ~2 MB). |

`better-sqlite3` ships native binaries for macOS, Linux, and Windows on x64 and arm64. If your platform isn't supported, `npm install` will compile from source — you'll need a C++ toolchain (`build-essential`, Xcode CLT, or MSVC build tools).

## Install

```bash
git clone https://github.com/TabletopFoundry/pnp-hub.git
cd pnp-hub
npm install
```

## Environment variables

PnP Hub runs zero-config in development. The only environment variable that affects behaviour is the production seed guard:

| Variable | Default | Purpose |
|---|---|---|
| `PNP_HUB_ALLOW_PRODUCTION_SEED` | unset | When set to `true`, allows the auto-seeder to run in `NODE_ENV=production`. Off by default to prevent accidental demo data in real deployments. |
| `NODE_ENV` | `development` | Standard Node convention. Set to `production` when running `npm run start`. |

To opt into seeding a production build:

```bash
PNP_HUB_ALLOW_PRODUCTION_SEED=true npm run start
```

## Run modes

| Command | Purpose |
|---|---|
| `npm run dev` | Hot-reloading dev server on port 3000. Auto-seeds on first request. |
| `npm run build` | Produce an optimized production bundle in `.next/`. |
| `npm run start` | Serve the production bundle. Requires `npm run build` first. |
| `npm run lint` | ESLint with the Next.js config. |
| `npm run typecheck` | `tsc --noEmit` — strict mode is on. |
| `npm test` | Vitest in single-run mode. |
| `npm run test:watch` | Vitest in watch mode. |
| `npm run test:coverage` | Vitest with V8 coverage instrumentation. |
| `npm run validate` | Lint + typecheck + tests. Run this before opening a PR. |

## First-run database setup

The database file is created at `data/pnp-hub.db` on first connect. PnP Hub:

1. Calls `fs.mkdirSync('data', { recursive: true })` so the directory always exists.
2. Sets `journal_mode = WAL` for better concurrent read performance.
3. Sets `foreign_keys = ON` for referential integrity.
4. Runs `initSchema(db)` — idempotent `CREATE TABLE IF NOT EXISTS` statements.
5. Checks the catalog version key. If the seed version is newer than what's stored, runs the seed transaction.

Seeding is transactional and idempotent — re-running it updates seeded rows in place. Designer draft uploads are never touched.

## Resetting the database

If you want to start fresh:

```bash
rm data/pnp-hub.db data/pnp-hub.db-wal data/pnp-hub.db-shm
npm run dev
```

The seed will re-run on the next request.

## Platform notes

- **macOS (Apple Silicon):** native arm64 binary is downloaded automatically.
- **Windows:** use PowerShell or WSL. Native Windows works, but file watching in WSL is faster.
- **Docker/CI:** install `build-essential python3` in your image so `better-sqlite3` can fall back to source builds.

## Verifying the install

```bash
npm run validate
```

A green run means ESLint, TypeScript, and 100% of the Vitest suite pass. If any step fails, see [Troubleshooting](../troubleshooting).
