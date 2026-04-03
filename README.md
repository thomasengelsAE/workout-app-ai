# FitAI — AI-Powered Fitness Training Platform

A mobile web app (iOS-optimized) that delivers AI-driven workout personalization, injury-aware programming, hybrid periodization, progress photo analysis, and contextual nutrition guidance.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Actions)
- **Database**: PostgreSQL via Prisma ORM v7
- **Auth**: Keycloak via NextAuth v5
- **AI**: OpenAI GPT-4o (workout generation + photo analysis)
- **Storage**: Google Cloud Storage (GCS) · `fsouza/fake-gcs-server` for local dev
- **Testing**: Jest + React Testing Library (unit) · Playwright (e2e)
- **UI**: Tailwind CSS v4, dark-mode-first, iOS-optimized

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env vars and fill in values
cp .env.example .env

# 3. Start infrastructure (Postgres, fake-gcs-server, Keycloak)
docker compose up -d postgres fake-gcs-server fake-gcs-setup keycloak

# 4. Generate Prisma client & run migrations
npm run db:migrate

# 5. Start dev server
npm run dev
```

The `fake-gcs-server` emulator runs at `http://localhost:4443`. Set `STORAGE_EMULATOR_HOST=http://localhost:4443` in your `.env` to route GCS SDK calls to it automatically.

App runs at http://localhost:3001 (or 3000 if port is free).

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run Jest unit tests |
| `npm test -- --testPathPattern=onboarding` | Run a single test file |
| `npm run test:e2e` | Run Playwright e2e tests |
| `npm run test:e2e:ui` | Playwright interactive UI |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run lint` | Run ESLint |

## Architecture

```
src/
├── app/              # Next.js App Router pages & API routes
├── components/       # React UI components (grouped by feature)
├── actions/          # Server Actions (onboarding, goals, session, progress, nutrition)
├── lib/              # Shared utilities (auth, prisma, openai, gcs, validation, constraints)
└── __tests__/        # Jest unit tests

e2e/                  # Playwright end-to-end tests
prisma/               # Prisma schema & migrations
```

### Key Flows

1. **Onboarding** → `src/app/onboarding/page.tsx` → `src/actions/onboarding.ts`
2. **Goal Setting** → `src/app/goals/page.tsx` → `src/actions/goals.ts` → `src/lib/workoutGenerator.ts`
3. **In-Session** → `src/app/session/[sessionId]/page.tsx` → `src/actions/session.ts`
4. **Progress** → `src/app/progress/page.tsx` → `src/actions/progress.ts`
5. **Dashboard** → `src/app/dashboard/page.tsx` (aggregates nudge + photos + sessions)

### Session Constraints

- **Set deviation**: ±10% of proposed weight/reps enforced server-side in `src/lib/sessionConstraints.ts`
- **Rest extension**: Maximum 30% of original rest duration, also enforced server-side

## Environment Variables

See `.env.example` for all required variables. Key ones:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENAI_API_KEY` | GPT-4o for workout generation and photo analysis |
| `AUTH_KEYCLOAK_*` | Keycloak OAuth credentials |
| `GCS_BUCKET` | Google Cloud Storage bucket name |
| `GCS_KEY_FILE_PATH` | Path to GCP service account JSON key (omit on GCP to use Workload Identity) |
| `STORAGE_EMULATOR_HOST` | Set to `http://localhost:4443` for local dev with `fake-gcs-server` |

### GCP Authentication

| Environment | Recommended approach |
|---|---|
| Local dev | Set `STORAGE_EMULATOR_HOST` — no credentials needed (emulator is unauthenticated) |
| CI | Store service account JSON as a secret; write to a temp file and set `GCS_KEY_FILE_PATH` |
| GCP (Cloud Run / GKE) | Use **Workload Identity** — omit `GCS_KEY_FILE_PATH`; the SDK picks up ADC automatically |
