---
title: Configuration
description: Environment variables, runtime flags, and Next.js config.
---

# Configuration

PnP Hub is intentionally configuration-light. Almost everything you'd want to tune lives in `lib/constants.ts` and is reviewed in [Constants](./constants).

This page covers the small set of true configuration knobs — environment variables, Next.js config, and editor/tooling files.

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `NODE_ENV` | `development` | Standard Node convention. Set by `npm run dev` (`development`), `npm run build` and `npm run start` (`production`), and Vitest (`test`). |
| `PNP_HUB_ALLOW_PRODUCTION_SEED` | unset | When `true`, allows auto-seeding even when `NODE_ENV=production`. Off by default to prevent accidental demo data in real deployments. |
| `PORT` | `3000` | Standard Next.js. Set to override the dev/start server port. |

There are no API keys, no secrets, and no third-party service URLs. If you fork the app and add auth or payments, document new vars here.

## Next.js config

`next.config.ts` ships minimal:

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // App Router is enabled by default in Next.js 16.
  // Add image domains, redirects, etc. here as needed.
};

export default nextConfig;
```

The codebase relies on Next.js defaults: App Router, React Server Components, SWC compilation. If you add image hosts or rewrites, this is where they go.

## TypeScript config

`tsconfig.json` runs in strict mode with path aliases:

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": { "@/*": ["./*"] }
  }
}
```

Imports throughout the codebase use `@/lib/...` and `@/app/...` — keep using the alias rather than relative paths.

## ESLint

`eslint.config.mjs` extends `eslint-config-next`. Run:

```bash
npm run lint
```

Warnings are treated as warnings, not errors. Fix them before opening a PR.

## Tailwind

`tailwind.config.js` is the standard Next.js + Tailwind setup. The project uses Tailwind 4 with the new PostCSS plugin (`@tailwindcss/postcss`). Custom CSS variables for the craft palette (`--terracotta`, `--ink`, `--text-body`) are declared in `app/globals.css` and referenced throughout the component layer.

## Vitest

`vitest.config.ts` configures jsdom, the React plugin, and V8 coverage. No changes are usually needed — the config is small and stable.

## .nvmrc

Pins Node 22 for [nvm](https://github.com/nvm-sh/nvm) users:

```
22
```

Run `nvm use` in the project root to switch.
