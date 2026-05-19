---
title: Contributing
description: How to propose changes, file issues, and open pull requests.
---

# Contributing

Thanks for considering a contribution. PnP Hub welcomes bug fixes, new guides, additional seed games, and well-scoped features.

## Before you start

- Check the [issue tracker](https://github.com/TabletopFoundry/pnp-hub/issues) — your idea may already be in progress.
- For non-trivial changes, **open an issue first** to align on scope before writing code.
- Be aware of what's out of scope: see [Why PnP Hub](./why#when-pnp-hub-isnt-yet-the-right-choice).

## Development setup

```bash
git clone https://github.com/TabletopFoundry/pnp-hub.git
cd pnp-hub
npm install
npm run dev
```

See [Installation](./getting-started/installation) for details.

## Branch naming

Use a Conventional-Commits prefix:

```
feat/add-wishlist-feature
fix/marketplace-filter-reset
docs/clarify-revenue-split
refactor/extract-game-card
test/add-optimizer-edge-cases
```

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add wishlist button to game cards
fix: correct currency formatting for zero-cent prices
docs: clarify duplex savings rationale
refactor: extract optimizer math into pure helpers
test: cover JSON parse fallback in safeJsonParse
```

The first line is ≤ 72 characters, lowercase, imperative. Add a body if context helps reviewers.

## Code style

- **TypeScript strict mode** is on. No `any`. If you must, comment why.
- **Path aliases**: `import { X } from '@/lib/...'`, not `'../../lib/...'`.
- **Prices in cents** (integers). Never store currency as a float.
- **No new global state** in client components. URL state and `localStorage` cover everything we need so far.
- **Tailwind utility classes** for styling; CSS variables for craft palette colors (`var(--terracotta)`, `var(--ink)`).

## Before you open a PR

```bash
npm run validate
```

This runs lint + typecheck + tests. CI runs the same gate, so green locally usually means green in CI.

If you added a new constant or type, update the [Reference](./reference/configuration) pages in `website/docs/reference/`.

## Pull request checklist

- [ ] Linked issue (or scope explained in the description).
- [ ] `npm run validate` passes locally.
- [ ] New code has tests (or rationale for why not).
- [ ] Docs updated in `website/docs/` if behavior changed.
- [ ] PR title follows Conventional Commits.

## Adding a seeded game

If you'd like to contribute a game to the seed catalog, follow the [Add a game](./guides/add-a-game) guide and submit a PR. Please ensure:

- You hold the rights to the game (or it's in the public domain).
- All fields are filled with realistic values — empty taglines or `"TBD"` descriptions will be requested to be revised.
- The slug is unique.

## Code of Conduct

By participating, you agree to abide by the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Be kind, assume good intent, and prioritize clarity over cleverness in feedback.

## Maintainers

PRs are typically reviewed within a few days. If a week passes without a response, feel free to bump the thread or @ a maintainer.

Thank you for helping make print-and-play more accessible.
