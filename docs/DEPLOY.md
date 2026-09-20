# Manual Deployment Guide

This guide covers deploying Lumen SaaS to a production Linux server (Ubuntu 22.04+) with Docker.

## Prerequisites

- A server (2 GB RAM minimum, 1 vCPU)
- Docker + Docker Compose installed
- A domain pointed at the server's IP
- (Optional) A reverse proxy like Nginx or Caddy for HTTPS

## Steps

### 1. Clone the repo

```bash
git clone https://github.com/zhiyou007/lemonsaas.git
cd lemonsaas
```

### 2. Configure environment (optional)

`.env` is only needed if you want to pre-seed Stripe/Google credentials. Otherwise, configure everything in the admin UI after first boot.

```bash
cp .env.example .env
```

### 3. Start the stack

```bash
docker compose up -d --build
```

This starts two containers:
- `lumen-db` — PostgreSQL 16 (data persisted in `pgdata` volume)
- `lumen-app` — Nuxt 3 SSR app on port 3000

On first boot, `prisma db push` runs automatically to create tables.

### 4. Access the app

Open `http://your-server-ip:3000`. The first registered user becomes admin.

### 5. Configure services in admin panel

Go to `/dashboard/settings` and fill in:
- **Google OAuth** — Client ID / Secret (redirect URI: `https://your-domain/api/auth/callback/google`)
- **Stripe** — Secret key, publishable key, product ID (use live keys for production)
- **Brand** — name, logo, SEO
- **Plans** — sync from Stripe

### 6. (Optional) Put Nginx in front for HTTPS

Example `/etc/nginx/sites-available/lumen`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then run `certbot --nginx` to get HTTPS.

## Operations

```bash
docker compose logs -f app     # view app logs
docker compose restart app     # restart
docker compose down            # stop (keeps data)
docker compose down -v         # stop + wipe database
```

## Database

The SQL schema is exported at `prisma/schema.sql`. If you prefer to connect to your own PostgreSQL instead of the bundled container, set `DATABASE_URL` in `.env` and run:

```bash
psql $DATABASE_URL -f prisma/schema.sql
```

Then run `npx prisma db push` to sync any additions.
