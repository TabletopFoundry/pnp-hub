---
title: npm scripts
description: Every script in package.json, what it does, and when to use it.
---

# npm scripts

Every script declared in `package.json`, with the canonical use case for each.

## Development

| Script | Command | When to use |
|---|---|---|
| `npm run dev` | `next dev` | Local development. Starts the dev server at http://localhost:3000 with hot reloading. |

## Production build

| Script | Command | When to use |
|---|---|---|
| `npm run build` | `next build` | Produces the optimized production bundle in `.next/`. |
| `npm run start` | `next start` | Serves the production bundle. Requires `npm run build` first. |

## Quality gates

| Script | Command | When to use |
|---|---|---|
| `npm run lint` | `eslint` | ESLint with the Next.js config. |
| `npm run typecheck` | `tsc --noEmit` | TypeScript validation. Strict mode is on. |
| `npm test` | `vitest run` | Run the test suite once and exit. |
| `npm run test:watch` | `vitest` | Interactive watch mode. |
| `npm run test:coverage` | `vitest run --coverage` | Generate V8 coverage in `coverage/`. |
| `npm run validate` | lint + typecheck + test | Run before opening a PR. |

## Suggested workflow

```bash
# Day-to-day
npm run dev

# Before committing
npm run validate

# Before deploying
npm run build
PNP_HUB_ALLOW_PRODUCTION_SEED=true npm run start
```

## CI checklist

A green CI run executes:

1. `npm ci` — clean dependency install.
2. `npm run lint` — fail on lint errors.
3. `npm run typecheck` — fail on type errors.
4. `npm test` — fail on any test regression.
5. `npm run build` — fail if the production build breaks.
