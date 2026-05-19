---
title: Troubleshooting & FAQ
description: Common issues and their fixes.
---

# Troubleshooting & FAQ

## Install issues

### `better-sqlite3` fails to install

```
npm ERR! gyp ERR! build error
```

`better-sqlite3` ships prebuilt binaries for Node 22 on macOS, Linux, and Windows on x64/arm64. If your platform isn't covered, it falls back to compiling from source — you'll need:

- **macOS:** `xcode-select --install`
- **Debian/Ubuntu:** `sudo apt install build-essential python3`
- **Windows:** `npm install -g windows-build-tools` (PowerShell as admin)

Then `rm -rf node_modules package-lock.json && npm install`.

### `Error: The engine "node" is incompatible`

PnP Hub requires Node 22. Check with `node --version` and install via [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install 22
nvm use 22
```

The repo includes an `.nvmrc` so `nvm use` works without arguments.

## Runtime issues

### "Database is locked"

Multiple processes are writing to the database. Stop all running dev servers (`Ctrl+C` in every terminal) and start exactly one with `npm run dev`. WAL mode is on, so concurrent **reads** are fine — only concurrent writers across processes hit the lock.

### Empty marketplace / no games appear

The seed didn't run. Diagnose:

```bash
ls -lh data/pnp-hub.db        # should be ~2 MB after seeding
sqlite3 data/pnp-hub.db "SELECT COUNT(*) FROM games;"
```

If count is 0, delete the database and re-run:

```bash
rm -f data/pnp-hub.db data/pnp-hub.db-wal data/pnp-hub.db-shm
npm run dev
```

Then visit any route to trigger the seed.

### Auto-seed not running in production

This is intentional. Set:

```bash
PNP_HUB_ALLOW_PRODUCTION_SEED=true npm run start
```

See [Installation](./getting-started/installation#environment-variables).

### Port 3000 in use

```bash
PORT=3001 npm run dev
```

Or kill whatever's on 3000:

```bash
lsof -i :3000        # find the PID
kill <pid>
```

## Build & deploy issues

### `npm run build` fails with type errors

Run `npm run typecheck` first — same compiler, friendlier output. Strict mode is on, so `any` and implicit `any` are errors.

### Designer uploads disappear on Vercel

Vercel's filesystem is ephemeral. SQLite writes don't persist between requests. Deploy to a VPS, container, or swap the persistence layer. See [Deploying](./guides/deploying).

### Mermaid diagrams don't render in the docs site

`@docusaurus/theme-mermaid` is configured in `website/docusaurus.config.ts` and `markdown: { mermaid: true }` is on. If a diagram fails to render, check the fenced block opens with `` ```mermaid `` exactly.

## Testing issues

### Tests pass locally but fail in CI

The most common cause: a test depends on the dev database file. Tests should always create an in-memory database:

```ts
const db = createDatabase(':memory:');
```

Search for any test that opens `data/pnp-hub.db` directly — that's the bug.

### `vitest` hangs

Some legacy environments have issues with the `jsdom` worker pool. Try:

```bash
npx vitest run --pool=forks
```

If that fixes it, add the flag to `vitest.config.ts`.

## FAQ

### Can I use PnP Hub commercially?

It's MIT-licensed, so yes. You'll need to add payments, authentication, file storage, and a moderation pipeline — none of which ship in this reference app.

### Does PnP Hub support multiple languages?

Not yet. All UI strings are inline in components. Internationalization (next-intl or React Aria's i18n) is a reasonable starter contribution.

### Why SQLite and not Postgres?

For a reference app, SQLite means zero ops. The data layer in `lib/data.ts` uses parameterized queries that translate cleanly if you swap the persistence layer. See [Deploying](./guides/deploying#swapping-the-persistence-layer).

### Where's the API?

There isn't a public HTTP API. Server components and server actions call `lib/data.ts` directly. If you need a REST or GraphQL API, add route handlers under `app/api/`.

### Can I run PnP Hub offline?

Yes, once you've cloned and `npm install`-ed. No runtime calls leave your machine.
