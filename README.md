# ⚡ TypeRush — Multiplayer Typing Race

A real-time multiplayer typing race game built with **Next.js 16**, **Socket.IO**, **Prisma + PostgreSQL**, and **Redis**.

---

## Architecture

```
Browser ──► Next.js app (Vercel / any Node host)
               │ REST/auth
               ▼
           PostgreSQL  (Neon / Supabase / Railway)
               │
Browser ──► Socket.IO server (Railway / Render / Fly.io)
               │ pub/sub
               ▼
             Redis  (Upstash / Redis Cloud)
```

---

## Local Development

### Prerequisites
- Node.js ≥ 20
- Docker & Docker Compose (for local Postgres + Redis)

### 1 — Clone & install

```bash
git clone https://github.com/YOUR_ORG/typing-race.git
cd typing-race
npm install
cd server && npm install && cd ..
```

### 2 — Environment variables

```bash
# Next.js app
cp .env.example .env.local
# Fill in the values (see comments in .env.example)

# Socket.IO server
cp server/.env.example server/.env
# Defaults work with docker-compose — no changes needed locally
```

### 3 — Start infrastructure

```bash
# .env for docker-compose only needs POSTGRES_PASSWORD
echo "POSTGRES_PASSWORD=localdev" >> .env

docker compose up -d   # starts Postgres on :5432 and Redis on :6379
```

### 4 — Migrate & seed the database

```bash
npm run db:migrate   # runs all pending Prisma migrations
npm run db:seed      # optional: seed passages
```

### 5 — Start both servers

```bash
# Terminal 1 — Next.js
npm run dev          # http://localhost:3000

# Terminal 2 — Socket.IO
cd server && npm run dev   # http://localhost:4000
```

---

## Production Deployment

### Environment variables required

#### Next.js app host (Vercel / Railway / etc.)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (with `?sslmode=require` for cloud DBs) |
| `NEXTAUTH_SECRET` | Random 32-char secret — run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Full public URL of this app, e.g. `https://typerush.com` |
| `GOOGLE_CLIENT_ID` | From [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `NEXT_PUBLIC_SOCKET_URL` | Public URL of the Socket.IO server, e.g. `https://socket.typerush.com` |

#### Socket.IO server host

| Variable | Description |
|---|---|
| `PORT` | Port to listen on (default `4000`) |
| `REDIS_URL` | Redis connection string, e.g. `rediss://default:TOKEN@host:PORT` |
| `CLIENT_URL` | Full public URL of the Next.js app (used for CORS + passage fetching) |

### Google OAuth setup

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add authorised redirect URI: `https://your-domain.com/api/auth/callback/google`
4. Copy Client ID and Secret into your environment variables

### Database migration (run once after deploy)

```bash
npm run db:migrate   # prisma migrate deploy — safe for production
```

> Do **not** run `db:push` in production — it may drop data.

### Deploying the Socket.IO server with Docker

```bash
cd server
docker build -t typerush-server .
docker run -d \
  -e PORT=4000 \
  -e REDIS_URL=rediss://... \
  -e CLIENT_URL=https://your-domain.com \
  -p 4000:4000 \
  typerush-server
```

---

## Security Notes

- `.env` and `.env.local` are in `.gitignore` and must **never** be committed.
- `.env.example` and `server/.env.example` contain only placeholder values — safe to version.
- SQL query logging is automatically disabled in `NODE_ENV=production`.
- The `NEXTAUTH_SECRET` must be a cryptographically random value unique per deployment.
- Use `sslmode=require` in `DATABASE_URL` for all cloud PostgreSQL providers.

---

## Scripts Reference

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js in development mode |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run db:migrate` | Apply pending migrations (production-safe) |
| `npm run db:push` | Push schema changes without migrations (dev only) |
| `npm run db:seed` | Seed the database with passages |
| `npm run lint` | Run ESLint |
