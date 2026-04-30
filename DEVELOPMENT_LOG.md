# Markazi — Development Log

> This document tracks everything completed throughout the development process.
> Updated continuously as the project evolves.

---

## Project Overview

**Name:** Markazi (مركزي)
**Type:** SaaS Web Platform — Education Center Management
**Market:** Private education centers in Egypt
**Platform:** Web-only, fully responsive, PWA-ready
**Languages:** Arabic (primary, RTL) + English

---

## Tech Stack

| Layer | Technology | Version | Justification |
|-------|-----------|---------|---------------|
| **Runtime** | Node.js | 20 LTS | Unified JS/TS ecosystem |
| **Framework** | Next.js (App Router) | 15.x | SSR for SEO, Server Components, middleware for tenant routing |
| **Language** | TypeScript (strict) | 5.7+ | End-to-end type safety |
| **Database** | PostgreSQL | 16 | ACID transactions, JSONB, RLS for multi-tenancy |
| **ORM** | Prisma | 6.x | Type-safe queries, migrations, multi-file schema |
| **Cache** | Redis | 7 | Sessions, OTP, rate limiting, job queues, real-time |
| **Auth** | NextAuth.js v5 | 5.x beta | OTP, Google OAuth, Magic Link, credentials |
| **Authorization** | CASL.js | 6.x | Attribute-based access control for 7 roles |
| **CSS** | Tailwind CSS | 4.x | RTL support via logical properties |
| **Components** | shadcn/ui + Radix | - | Accessible, customizable primitives |
| **i18n** | next-intl | 4.x | Arabic/English with locale routing |
| **Fonts** | Cairo (Arabic) + Inter (English) | - | Clean, modern, eye-friendly |
| **Charts** | Recharts | 2.x | RTL-compatible dashboard charts |
| **Rich Text** | Tiptap | - | Arabic-aware rich text editor |
| **Payments** | Paymob | - | Fawry, Vodafone Cash, InstaPay, cards |
| **WhatsApp** | Meta Cloud API | - | Template messages + session messages |
| **SMS** | Infobip | - | OTP delivery + fallback |
| **Email** | Resend | - | Transactional emails |
| **Storage** | S3-compatible (MinIO dev / R2 prod) | - | Videos, PDFs, submissions |
| **Video** | Mux / Cloudflare Stream | - | Adaptive streaming, DRM |
| **Job Queue** | BullMQ | 5.x | Background jobs via Redis |
| **Monorepo** | Turborepo + pnpm | - | Caching, parallel builds |
| **Containers** | Docker + Docker Compose | - | Local dev + production |
| **CI/CD** | GitHub Actions | - | Automated testing + deployment |
| **Testing** | Vitest + Playwright | - | Unit/integration + E2E |

---

## Architecture Decisions

### Multi-Tenancy Strategy
- **Shared database, shared schema** with `centerId` column on all tenant-scoped tables
- Prisma middleware auto-injects `centerId` filters
- PostgreSQL Row-Level Security as defense-in-depth
- `CenterMembership` junction table maps users to centers with roles

### Subdomain Routing
- `markazi.com` → Marketing pages
- `app.markazi.com` → Dashboard
- `{slug}.markazi.com` → Center public website
- Custom domains via `custom_domains` table

### Payment Flow
1. Payment intent created → `Payment` record with status `PENDING`
2. Student redirected to Paymob hosted page
3. Webhook confirms → status updated, notifications dispatched
4. All amounts use `Decimal(10,2)` to avoid floating-point errors

### Content Access Control
- `Enrollment` requires `Payment` with status `COMPLETED`
- Instructors only see paid students
- `Lesson.isPaidOnly` + `isFreePreview` flags for granular control

---

## Database Schema Summary

| Domain | Models | Key Fields |
|--------|--------|-----------|
| **Auth** | User, Account, Session, VerificationToken, ParentStudent | 7 roles, phone-first, soft delete |
| **Tenant** | Center, Branch, CenterMembership, SubscriptionHistory | Multi-tenant, white-label, subscription |
| **Course** | Course, Unit, Lesson, LessonProgress, Enrollment, CourseInstructor | Drip content, progress tracking |
| **Exam** | QuestionBank, Question, Exam, ExamQuestion, ExamAttempt, ExamAnswer | 7 question types, auto-grading |
| **Assignment** | Assignment, AssignmentSubmission | 6 types, late penalty, grading |
| **Attendance** | AttendanceSession, AttendanceRecord | QR, manual, geolocation, auto-video |
| **Payment** | PaymentConfig, Payment, InstallmentPlan, Installment, Invoice | 10 methods, installments, invoices |
| **Notification** | NotificationConfig, NotificationTemplate, Notification | 5 channels, event-driven |
| **Messaging** | MessageThread, Message, MessageRecipient | DMs, discussions, announcements |
| **Website** | CenterWebsite, WebsitePage, CustomDomain | Auto-generated, SEO-ready |
| **Schedule** | ScheduleSlot, LiveSession | Calendar, Zoom integration |
| **Gamification** | Certificate, Badge, UserBadge, PointTransaction, Leaderboard | Points, badges, certificates |
| **Social** | CourseReview, DiscussionThread, DiscussionReply | Reviews, course forums |
| **System** | ReportSnapshot, AuditLog | Pre-computed reports, audit trail |

**Total: 38 models, 26 enums**

---

## Monorepo Structure

```
markazi/
├── apps/
│   ├── web/          # Next.js 15 — main application
│   └── worker/       # BullMQ background workers
├── packages/
│   ├── db/           # Prisma schema, client, middleware
│   ├── auth/         # NextAuth config, CASL permissions
│   ├── api/          # Zod validators, error classes
│   ├── ui/           # shadcn/ui components, theme
│   ├── payments/     # Paymob integration, invoices
│   ├── notifications/# WhatsApp, SMS, email, in-app
│   ├── media/        # S3 storage, video streaming
│   ├── jobs/         # BullMQ queue definitions
│   └── config/       # Shared Tailwind preset, TS configs
├── docker/           # Dockerfiles, docker-compose
├── tooling/          # Scripts, Postman collection
└── .github/          # CI/CD workflows
```

---

## Development Progress

### Phase 1 — MVP (Target: 4 months)

#### Sprint 0: Foundation (Current)
- [x] PRD analysis and architecture planning
- [x] Tech stack selection and justification
- [x] Monorepo setup (Turborepo + pnpm)
- [x] Root configuration (TypeScript, ESLint, Prettier, commitlint)
- [x] Database schema design (38 models, 26 enums)
- [x] Prisma schema implementation
- [x] Package structure (9 packages + 2 apps)
- [x] Auth package (NextAuth config, CASL roles/permissions)
- [x] API package (Zod validators, error codes with Arabic messages)
- [x] UI package (Button, Input, Card, Badge, StatCard, theme tokens)
- [x] Payments package (Paymob client, invoice generator, installment calculator)
- [x] Notifications package (event types, dispatcher skeleton)
- [x] Media package (S3 storage, video service skeleton)
- [x] Jobs package (BullMQ queue definitions)
- [x] Next.js app setup with RTL/Arabic support
- [x] i18n with Arabic and English message bundles
- [x] Middleware for locale + subdomain routing
- [x] App directory structure (marketing, auth, dashboard, center-website)
- [x] Dashboard layout with RTL sidebar
- [x] Landing page (Arabic)
- [x] Login page (Phone OTP + Google + Email)
- [x] Docker configuration (PostgreSQL, Redis, MinIO)
- [x] Dockerfiles for web and worker
- [x] PWA manifest
- [x] Environment variables template
- [x] Development tracking document (this file)

#### Sprint 1-2: Core Auth & Center Setup
- [ ] Implement OTP authentication flow (send/verify)
- [ ] Google OAuth integration
- [ ] Email + password login
- [ ] Center registration wizard
- [ ] Center profile settings (name, logo, colors)
- [ ] Branch management CRUD
- [ ] User invitation system
- [ ] Role-based dashboard routing

#### Sprint 3-4: Courses & Content
- [ ] Course CRUD with all settings
- [ ] Unit/Lesson builder (drag & drop ordering)
- [ ] Video upload with S3 + Mux integration
- [ ] PDF viewer (in-browser, protected)
- [ ] Rich text editor for lesson content
- [ ] Student enrollment flow
- [ ] Course progress tracking
- [ ] Drip content logic

#### Sprint 5-6: Exams & Assignments
- [ ] Question bank management
- [ ] Exam builder (7 question types)
- [ ] Exam-taking interface with timer + anti-cheat
- [ ] Auto-grading (MCQ, True/False)
- [ ] Manual grading interface (Essay, File)
- [ ] Assignment builder (6 types)
- [ ] Assignment submission flow
- [ ] Grading + feedback interface
- [ ] Grade reports

#### Sprint 7-8: Payments & Communications
- [ ] Paymob integration (Fawry + Card)
- [ ] Manual cash payment recording
- [ ] Installment plan creation
- [ ] Invoice generation (PDF)
- [ ] WhatsApp Business API integration
- [ ] SMS notifications (OTP + alerts)
- [ ] In-app notification system
- [ ] Attendance system (QR + manual)
- [ ] Center public website (subdomain)

### Phase 2 — Growth
- [ ] Advanced reports & analytics
- [ ] Full question bank
- [ ] Certificates system
- [ ] Gamification (points, badges, leaderboard)
- [ ] PWA with push notifications
- [ ] Vodafone Cash / InstaPay / Valu
- [ ] Zoom live sessions
- [ ] Public API

### Phase 3 — AI & Scale
- [ ] AI Student Assistant
- [ ] AI Exam Generator
- [ ] AI Essay Grading
- [ ] Early Warning System
- [ ] Course Marketplace
- [ ] Full White-label

---

## File Reference

| File | Purpose |
|------|---------|
| `packages/db/prisma/schema.prisma` | Complete database schema (38 models) |
| `packages/auth/src/permissions/abilities.ts` | CASL permission matrix for all 7 roles |
| `packages/auth/src/permissions/roles.ts` | Role hierarchy definition |
| `packages/api/src/validators/` | Zod validation schemas for all entities |
| `packages/api/src/errors/error-codes.ts` | Error codes with Arabic translations |
| `packages/ui/src/` | Reusable UI components with RTL support |
| `apps/web/middleware.ts` | Locale + subdomain + auth middleware |
| `apps/web/i18n/messages/ar/common.json` | Arabic translations |
| `apps/web/i18n/messages/en/common.json` | English translations |
| `docker/docker-compose.yml` | Local dev stack (PostgreSQL, Redis, MinIO) |
| `.env.example` | All environment variables documented |

---

_Last updated: April 30, 2026_
_Phase: Sprint 0 — Foundation (Complete)_
