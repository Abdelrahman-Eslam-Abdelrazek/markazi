# Markazi Project

## Overview
SaaS web platform for managing private education centers in Egypt.
Arabic-first (RTL), web-only, fully responsive.

## Tech Stack
- Next.js 15 (App Router) + TypeScript (strict)
- PostgreSQL 16 + Prisma 6 ORM
- Redis 7 (cache, sessions, job queue)
- Tailwind CSS 4 + shadcn/ui (RTL)
- NextAuth.js v5 + CASL.js (7 roles)
- BullMQ (background jobs)

## Structure
Turborepo monorepo with pnpm workspaces:
- `apps/web` — Next.js app
- `apps/worker` — BullMQ workers
- `packages/db` — Prisma schema & client
- `packages/auth` — Auth & permissions
- `packages/api` — Zod validators & errors
- `packages/ui` — Shared components
- `packages/payments` — Paymob integration
- `packages/notifications` — WhatsApp/SMS/Email
- `packages/media` — S3/video
- `packages/jobs` — Queue definitions

## Commands
- `pnpm dev` — Start all dev servers
- `pnpm build` — Build all packages
- `docker compose -f docker/docker-compose.yml up -d` — Start local services
- `pnpm db:generate` — Generate Prisma client
- `pnpm db:push` — Push schema to database
- `pnpm db:studio` — Open Prisma Studio

## Conventions
- All user-facing text in Arabic (i18n via next-intl)
- Use logical CSS properties (ps/pe/ms/me) not physical (pl/pr/ml/mr)
- Financial amounts always use Decimal(10,2)
- All tenant-scoped queries must include centerId
