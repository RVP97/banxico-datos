# Banxico Datos

A Bloomberg-style financial terminal for Mexican economic data, powered by the Banco de México (Banxico) SIE API. Built for financial analysts and economists who need real-time access to Mexico's key economic indicators.

## What it does

Banxico Datos continuously ingests, stores, and visualizes 65+ economic time series from the Banco de México, organized across 16 dashboard sections:


| Section                  | Indicators                                          |
| ------------------------ | --------------------------------------------------- |
| Resumen                  | Overview KPIs across all domains                    |
| Tipo de Cambio           | USD/MXN FIX, liquidación, EUR, JPY, GBP, CAD, CNY   |
| Tasas de Interés         | Tasa objetivo, TIIE 28/91d, Cetes yield curve       |
| Mercado de Dinero        | TIIE Fondeo compuesta 28/91d                        |
| Inflación                | INPC general/subyacente, inflation rates            |
| Actividad Económica      | IGAE (GDP proxy), industrial production             |
| Mercado Laboral          | Desocupación, subocupación                          |
| Comercio Exterior        | Exports/imports, trade balance, petroleum split     |
| Remesas                  | Monthly family remittance flows                     |
| Expectativas             | Private sector survey: GDP, inflation, unemployment |
| Reservas Internacionales | Weekly international reserves                       |
| UDIS                     | Daily inflation-indexed unit values                 |
| Banco Central            | Monetary base, government securities outstanding    |
| Agregados Monetarios     | M1, M2, M4 money supply                             |
| Finanzas Públicas        | Federal revenue, spending, budget & primary balance |
| Balanza de Pagos         | FDI, external debt, tourism                         |


Every section includes sortable data grids with CSV export, interactive charts with period selectors, and collapsible interpretation guides for analysts.

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│ Banxico SIE  │────▶│  BullMQ Jobs │────▶│ PostgreSQL │
│   REST API   │     │  (in-process)│     │            │
└─────────────┘     └──────────────┘     └─────┬──────┘
                           │                    │
                     ┌─────▼──────┐        ┌────▼─────┐
                     │   Redis    │◀───────│ Next.js  │
                     │  (cache)   │        │  Server  │
                     └────────────┘        └────┬─────┘
                                                │
                                           ┌────▼─────┐
                                           │ Browser  │
                                           │   UI     │
                                           └──────────┘
```

### Data ingestion pipeline

1. **Scheduled jobs** run inside the Next.js process via `instrumentation.ts`:
  - **Latest sync** — every 30 minutes, fetches the most recent value for all series
  - **Historical sync** — every 24 hours, backfills up to 25 years of data
2. **Rate limit management** — rotates across up to 6 Banxico API tokens with separate buckets for timely (80 req/min) and historical (200 req/5min) endpoints
3. **Upsert into PostgreSQL** — chunked inserts (500 rows) with conflict resolution on `(series_id, date)`
4. **Cache invalidation** — busts all `banxico:`* keys in Redis after each sync

### Data serving

1. **Server actions** query PostgreSQL via Drizzle ORM
2. **Redis cache-aside** with tiered TTLs: 5 min (latest), 1 hour (range queries), 24 hours (full history)
3. **React Server Components** render charts and grids; client components handle sorting, CSV export, and animations

### Diagnostic endpoint

`GET /api/diag` (protected by `x-sync-secret` header) reports per-series health: row counts, latest values, and optional live comparison against the Banxico API (`?live=true`).

## Tech stack

- **Framework**: Next.js 16 (App Router, React 19, React Compiler)
- **Language**: TypeScript (strict)
- **Database**: PostgreSQL + Drizzle ORM
- **Cache / Queue**: Redis + BullMQ (ioredis)
- **UI**: Tailwind CSS 4, shadcn/ui, Recharts
- **Lint/Format**: Biome
- **Runtime**: Bun (dev) / Node.js (production)
- **Deploy**: Multi-stage Docker image (standalone Next.js output)

## Getting started

### Prerequisites

- [Bun](https://bun.sh/) (or Node.js 20+)
- PostgreSQL 15+
- Redis 7+
- At least one [Banxico SIE API token](https://www.banxico.org.mx/SieAPIRest/service/v1/token)

### Environment variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/banxico
REDIS_URL=redis://localhost:6379
BMX_TOKEN=your_primary_banxico_token
BMX_TOKEN_2=optional_second_token
BMX_TOKEN_3=optional_third_token
SYNC_SECRET=a_random_secret_for_api_protection
```

### Setup

```bash
# Install dependencies
bun install

# Push schema to database
bun db:push

# Seed historical data (25 years)
bun db:seed

# Start development server
bun dev
```

The app starts at [http://localhost:3000](http://localhost:3000). Background sync jobs begin automatically via `instrumentation.ts`.

### Scripts


| Script            | Description                           |
| ----------------- | ------------------------------------- |
| `bun dev`         | Start dev server with Turbopack       |
| `bun run build`   | Production build                      |
| `bun start`       | Start production server               |
| `bun lint`        | Run Biome linter                      |
| `bun format`      | Format code with Biome                |
| `bun db:push`     | Push schema changes to database       |
| `bun db:generate` | Generate Drizzle migrations           |
| `bun db:studio`   | Open Drizzle Studio GUI               |
| `bun db:seed`     | Seed historical data from Banxico API |


### Docker

```bash
docker build -t banxico-datos .
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_URL=redis://... \
  -e BMX_TOKEN=... \
  -e SYNC_SECRET=... \
  banxico-datos
```

The container runs `drizzle-kit migrate` on startup before launching the server.

## Database schema

`**series**` — Metadata for each Banxico time series


| Column           | Type      | Description                                |
| ---------------- | --------- | ------------------------------------------ |
| `id`             | text (PK) | Banxico series identifier (e.g. `SF43718`) |
| `title`          | text      | Full series name                           |
| `frequency`      | text      | daily, weekly, monthly, quarterly          |
| `unit`           | text      | MXN, %, MDP, MDD, Índice                   |
| `last_synced_at` | timestamp | Last successful sync                       |


`**data_points**` — Time series observations


| Column       | Type          | Description            |
| ------------ | ------------- | ---------------------- |
| `id`         | serial        | Auto-increment PK      |
| `series_id`  | text (FK)     | References `series.id` |
| `date`       | date          | Observation date       |
| `value`      | numeric(20,6) | Observation value      |
| `created_at` | timestamp     | Row creation time      |


Unique index on `(series_id, date)` prevents duplicate observations and enables upsert-on-conflict during sync.

## License

MIT