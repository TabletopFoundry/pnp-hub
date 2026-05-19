---
title: Deploying
description: Deploy PnP Hub to Vercel, a VPS, or a container.
---

# Deploying

PnP Hub is a vanilla Next.js 16 app with one wrinkle: the SQLite database file. Wherever you deploy, the database has to live on **writable, persistent storage** that survives between requests.

## What you can and can't deploy to

| Target | Works? | Notes |
|---|---|---|
| **A VPS or bare-metal host** (DigitalOcean, Hetzner, Fly.io, Railway) | ✅ Best | Persistent disk, full Node runtime. |
| **Docker container with a mounted volume** | ✅ | Mount `/app/data` from a host or named volume. |
| **Vercel / Netlify (serverless)** | ⚠️ Read-only | Serverless functions get an ephemeral filesystem. You can deploy a read-only marketplace if you bake the seeded DB into the image, but designer uploads and reviews won't persist. |
| **Edge runtimes (Cloudflare Workers, etc.)** | ❌ | No native SQLite. Would require swapping `lib/db.ts` for a remote database (Turso, D1, Postgres). |

## Deploy to a VPS (recommended)

```bash
# On the server
git clone https://github.com/TabletopFoundry/pnp-hub.git
cd pnp-hub
npm ci
npm run build
PNP_HUB_ALLOW_PRODUCTION_SEED=true npm run start
```

For long-running production, use a process manager such as `pm2` or a systemd unit. The data directory `data/` must be writable by the Node process.

### Example systemd unit

```ini
# /etc/systemd/system/pnp-hub.service
[Unit]
Description=PnP Hub
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/pnp-hub
Environment=NODE_ENV=production
Environment=PNP_HUB_ALLOW_PRODUCTION_SEED=true
ExecStart=/usr/bin/npm run start
Restart=on-failure
User=www-data

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now pnp-hub
sudo systemctl status pnp-hub
```

## Deploy with Docker

PnP Hub doesn't ship a Dockerfile yet, but a minimal one looks like this:

```dockerfile
FROM node:22-bookworm-slim
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PNP_HUB_ALLOW_PRODUCTION_SEED=true
VOLUME /app/data
EXPOSE 3000

CMD ["npm", "run", "start"]
```

```bash
docker build -t pnp-hub .
docker run -d -p 3000:3000 -v pnp-hub-data:/app/data --name pnp-hub pnp-hub
```

## Vercel (read-only mode)

If you only need a public showcase:

1. Run the seed locally: `npm run dev` → visit any page → commit `data/pnp-hub.db` to a separate branch (or bake it into a CI step).
2. In `next.config.ts`, copy the database file into the build output.
3. Deploy. The marketplace renders fine but server actions that write (designer uploads, reviews) will throw on serverless.

For a fully writable deployment on Vercel, swap SQLite for a managed database — see "Swapping the persistence layer" below.

## Behind a reverse proxy

Standard Next.js advice applies:

```nginx
location / {
  proxy_pass http://127.0.0.1:3000;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Backups

The database is one file. A cron job is enough:

```bash
0 3 * * * sqlite3 /var/www/pnp-hub/data/pnp-hub.db ".backup '/backups/pnp-hub-$(date +\%F).db'"
```

`.backup` is safe to run on a live, WAL-enabled database.

## Swapping the persistence layer

If you outgrow SQLite, replace `lib/db.ts` with an adapter that exposes the same `getDatabase()` shape — a thin wrapper over Postgres, Turso, or SQLite-as-a-service is enough. The data layer (`lib/data.ts`) uses prepared statements that translate cleanly to Postgres parameter placeholders.
