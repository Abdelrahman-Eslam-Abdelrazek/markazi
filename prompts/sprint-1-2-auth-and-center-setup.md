# Sprint 1-2: Core Auth & Center Setup

## Context

Sprint 0 (Foundation) is fully complete. The following are already built and must NOT be changed structurally:
- `packages/db/prisma/schema.prisma` — 38 Prisma models (User, Account, Session, VerificationToken, Center, Branch, CenterMembership, etc.)
- `packages/auth/src/permissions/` — CASL abilities, guards, and UserRole enum
- `packages/api/src/validators/auth.ts` — `loginPhoneSchema`, `verifyOtpSchema`, `loginEmailSchema`, `registerCenterOwnerSchema`
- `packages/api/src/validators/center.ts` — `createCenterSchema`, `updateCenterSchema`, `createBranchSchema`
- `packages/notifications/src/dispatcher.ts` — NotificationDispatcher (stub, has TODO comments)
- `apps/web/app/[locale]/(auth)/login/page.tsx` — UI shell (forms exist but submit nothing)
- `apps/web/app/[locale]/(dashboard)/layout.tsx` — Sidebar + header UI shell
- `apps/web/app/[locale]/(dashboard)/dashboard/page.tsx` — Static stats UI shell
- `apps/web/i18n/messages/ar/common.json` and `en/common.json` — Arabic + English translations

## What Needs to Be Built in This Sprint

---

### 1. OTP Authentication Flow

**Goal:** Wire the phone login form to actually send and verify OTPs.

**Files to create/modify:**

**`apps/web/app/api/auth/send-otp/route.ts`** — POST handler:
- Parse `{ phone }` from request body, validate with `loginPhoneSchema` from `@markazi/api`
- Normalize phone to `+20XXXXXXXXXX` format
- Generate a cryptographically random 6-digit OTP (use `crypto.randomInt(100000, 999999)`)
- Store in Redis with key `otp:${normalizedPhone}` as JSON `{ code, attempts: 0, createdAt }`, TTL = 300 seconds (5 minutes)
- Send OTP via SMS using Infobip HTTP API (`INFOBIP_API_KEY`, `INFOBIP_BASE_URL` env vars)
  - Message text (Arabic): `كود التحقق الخاص بك على مركزي: ${otp}. صالح لمدة 5 دقائق.`
  - If `INFOBIP_API_KEY` is not set in env, log the OTP to console (dev mode only)
- Rate limit: if a valid OTP already exists for this phone (key exists in Redis), return 429 with error `TOO_MANY_REQUESTS`
- Return `{ success: true, expiresIn: 300 }`

**`apps/web/app/api/auth/verify-otp/route.ts`** — POST handler:
- Parse `{ phone, otp }` from body, validate with `verifyOtpSchema` from `@markazi/api`
- Normalize phone
- Fetch from Redis key `otp:${normalizedPhone}`, return 400 if not found (expired or not sent)
- Increment `attempts` field; if `attempts >= 3`, delete key and return 429 `MAX_ATTEMPTS_EXCEEDED`
- Compare provided OTP with stored code; if mismatch, update Redis with incremented attempts, return 400
- On match: delete Redis key, then:
  - `upsert` a User in Prisma by `phone`, setting `phoneVerified: true`, `lastLoginAt: now()`
  - `upsert` an Account linked to this user with `provider: 'PHONE_OTP'`, `providerAccountId: normalizedPhone`
  - Sign in the user using NextAuth `signIn` with Credentials (or create a session manually)
  - Return `{ success: true, userId }` with a Set-Cookie header for the session

**`apps/web/app/[locale]/(auth)/verify-otp/page.tsx`** — UI:
- Receive `phone` as a URL search param (e.g., `/verify-otp?phone=01xxxxxxxxx`)
- Show the last 4 digits of the phone number masked: `01xx xxxx xxXX`
- 6-digit OTP input: individual digit boxes (React controlled, auto-advance on each digit, backspace goes back)
- On fill: auto-submit to `/api/auth/verify-otp`
- On success: redirect to `/[locale]/dashboard` (or `/[locale]/center/new` if no center — see section 5)
- Resend button with 60-second countdown timer; calls `/api/auth/send-otp`
- All text from `useTranslations("auth")`, RTL layout

**Modify `apps/web/app/[locale]/(auth)/login/page.tsx`**:
- Phone form: on submit, POST to `/api/auth/send-otp`, then `router.push('/verify-otp?phone=...')`
- Show loading state and error handling
- Keep the Google and email buttons as-is (they'll be wired in sections 2 and 3)

---

### 2. Google OAuth

**`packages/auth/src/providers/google.ts`** — create file:
```
export { default as GoogleProvider } from "next-auth/providers/google"
```

**Modify `packages/auth/src/config.ts`**:
- Import GoogleProvider and add it to the `providers` array
- In the `jwt` callback: if `account.provider === "google"`, upsert User in Prisma from `profile` (nameAr = display name, email, avatar = picture)
- Upsert Account in Prisma with `provider: 'GOOGLE'`, `providerAccountId: account.providerAccountId`
- Attach `centerId` and `role` to the JWT token (query CenterMembership from Prisma)

**Required env vars** (document in `.env.example` if not already there):
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

---

### 3. Email + Password Login

**Modify `packages/auth/src/config.ts`**:
- Add Credentials provider
- In `authorize`: validate `loginEmailSchema`, find User by email in Prisma, compare password hash using `bcryptjs`
- Return `null` if invalid

**`apps/web/app/[locale]/(auth)/login/page.tsx`** — email tab:
- Wire the email form to call `signIn("credentials", { email, password })` from `next-auth/react`
- Show Arabic error messages from the response

---

### 4. Register Page (New Center Owner Onboarding)

**`apps/web/app/[locale]/(auth)/register/page.tsx`** — UI:
- Form fields: `nameAr` (required), phone (required), email (optional), password (optional, show only if they want email login)
- Validate with `registerCenterOwnerSchema` from `@markazi/api`
- On submit: POST to `/api/auth/register`
- After registration: redirect to `/[locale]/(auth)/verify-otp?phone=...`

**`apps/web/app/api/auth/register/route.ts`** — POST handler:
- Validate with `registerCenterOwnerSchema`
- Check if phone already exists in Prisma (`User.phone`) → return 409 if duplicate
- Create User with `nameAr`, `phone`, and optional `email`
- If password provided: hash with `bcryptjs` (salt rounds: 12), save in `passwordHash`
- Trigger OTP send (call the same logic as `/api/auth/send-otp`)
- Return `{ success: true }`

---

### 5. After-Login Redirect Logic

**Modify `packages/auth/src/config.ts`** — in the `session` callback:
- Query `CenterMembership` from Prisma where `userId = token.id` and `isActive = true`
- Attach to session: `session.user.memberships = [{ centerId, role, branchId }]`
- Attach `session.user.primaryRole` = the highest-priority role from `ROLE_HIERARCHY`
- Attach `session.user.primaryCenterId` = the first active membership's `centerId`

**`apps/web/app/api/auth/redirect/route.ts`** — GET handler called after login:
- Read session, check memberships
- No active membership → redirect to `/[locale]/center/new`
- Role is `STUDENT` or `PARENT` → redirect to `/[locale]/my-courses`
- Any other role → redirect to `/[locale]/dashboard`

Update the `signIn` success redirect in login/verify-otp pages to hit this endpoint.

---

### 6. Center Registration Wizard

**`apps/web/app/[locale]/(dashboard)/center/new/page.tsx`** — 3-step wizard (Client Component):

This page is only reachable when the user has no center. The wizard must NOT be shown if they already have a center.

**Step 1 — Center Info:**
- `nameAr` (Arabic name, required) — auto-generates `slug` from nameAr transliteration
- `nameEn` (English name, optional)
- `slug` (editable, shows preview URL: `{slug}.markazi.com`, validates uniqueness via `/api/center/check-slug?slug=...`)
- `description` (optional, textarea)

**Step 2 — Contact Info:**
- `phone` (Egyptian phone)
- `whatsapp` (Egyptian phone, optional, defaults to same as phone)
- `email` (optional)
- `facebookUrl` (optional)
- `instagramUrl` (optional)

**Step 3 — Branding:**
- Logo upload (image, max 2MB) — upload to S3 via `@markazi/media`
- `primaryColor` (color picker, default `#1E40AF`)
- `secondaryColor` (color picker, default `#F59E0B`)
- Preview box showing logo + colors live

**On wizard completion — Server Action `createCenter`:**
- Validate all fields with `createCenterSchema` from `@markazi/api`
- Create Center in Prisma with `status: PENDING_SETUP`
- Create CenterMembership with `role: CENTER_OWNER`, `userId = session.user.id`
- Create one Branch with `isMain: true`, `nameAr: "الفرع الرئيسي"`, copy center phone
- Update Center status to `ACTIVE`
- Revalidate session (update JWT with new `primaryCenterId`)
- Redirect to `/[locale]/dashboard`

**`apps/web/app/api/center/check-slug/route.ts`** — GET:
- Query Prisma `Center.findFirst({ where: { slug } })`
- Return `{ available: boolean }`

**Slug auto-generation helper:**
- Arabic to Latin transliteration map for common letters (ا→a, ب→b, ت→t, ث→th, ج→g, ح→h, خ→kh, د→d, ذ→z, ر→r, ز→z, س→s, ش→sh, ص→s, ض→d, ط→t, ظ→z, ع→a, غ→gh, ف→f, ق→q, ك→k, ل→l, م→m, ن→n, ه→h, و→w, ي→y, ة→a)
- Replace spaces with `-`, remove non-alphanumeric, lowercase, max 50 chars
- If result is empty, fall back to `center-${Date.now()}`

---

### 7. Center Settings Page

**`apps/web/app/[locale]/(dashboard)/center/settings/page.tsx`**:
- Server Component: load center from Prisma using `session.user.primaryCenterId`
- Show tabs: "معلومات المركز" | "الهوية البصرية" | "التواصل الاجتماعي" | "الاشتراك"
- Tab 1 (Center Info): form with nameAr, nameEn, description — uses `updateCenterSchema`
- Tab 2 (Branding): logo upload + color pickers (same as wizard step 3)
- Tab 3 (Social): facebook, instagram URLs
- Tab 4 (Subscription): read-only display of current plan, status, limits
- Each tab has its own Server Action for saving
- Guard with CASL: only `CENTER_OWNER` and `BRANCH_MANAGER` can access

---

### 8. Branch Management

**`apps/web/app/[locale]/(dashboard)/center/branches/page.tsx`**:
- Server Component: list all branches for `primaryCenterId`, ordered by `isMain desc, createdAt asc`
- Show card per branch: name, address, phone, active/inactive badge
- "Main branch" badge on `isMain = true`
- "Add Branch" button → opens `Dialog`

**Add/Edit Branch Dialog (Client Component):**
- Fields: `nameAr`, `nameEn`, `address`, `phone`, `isMain`, working hours (optional)
- Uses `createBranchSchema` from `@markazi/api`
- Server Action: create/update Branch
- Cannot delete the main branch (disable delete button + tooltip)

**Server Actions in `apps/web/app/actions/branch.ts`:**
- `createBranch(centerId, data)` — guard: role must be CENTER_OWNER or BRANCH_MANAGER
- `updateBranch(branchId, centerId, data)` — same guard
- `deleteBranch(branchId, centerId)` — same guard, cannot delete if `isMain = true`
- All actions call `revalidatePath`

---

### 9. User Invitation System

**`apps/web/app/[locale]/(dashboard)/settings/team/page.tsx`**:
- List all CenterMemberships for current center (users with their roles)
- Show avatar, name, phone, role badge, active/inactive status
- "Invite Member" button → opens invite dialog

**Invite Dialog:**
- Input: phone (Egyptian) OR email
- Role selector: BRANCH_MANAGER | INSTRUCTOR | ACCOUNTANT (not STUDENT — that's done through enrollment)
- Branch selector (optional, for branch-specific roles)
- Server Action `inviteUser`:
  - Create VerificationToken: `{ identifier: phone/email, type: "INVITE", token: nanoid(32) }`, expires in 7 days
  - Send WhatsApp (if phone) or Email (if email) with link: `https://app.markazi.com/[locale]/accept-invite?token=...`
  - Use `NotificationDispatcher` from `@markazi/notifications`

**`apps/web/app/[locale]/(auth)/accept-invite/page.tsx`**:
- Read `token` from search params
- Verify VerificationToken in Prisma (exists, not used, not expired)
- Show center name (load from token → CenterMembership)
- If user already exists (by phone/email in token identifier) → show login form
- If new user → show registration form (nameAr, password)
- On complete: mark token as used, create/update User, create CenterMembership, redirect to dashboard

---

### 10. Role-Based Dashboard Sidebar

**Modify `apps/web/app/[locale]/(dashboard)/layout.tsx`**:
- Make it a Server Component that reads the session
- Define sidebar items per role (use a config object, not hardcoded JSX):

```ts
const ROLE_MENU: Record<UserRole, SidebarItem[]> = {
  CENTER_OWNER:   [dashboard, courses, students, instructors, payments, attendance, exams, assignments, messages, reports, schedule, certificates, center, settings],
  BRANCH_MANAGER: [dashboard, courses, students, instructors, payments, attendance, exams, assignments, messages, reports, schedule],
  INSTRUCTOR:     [dashboard, my-courses (as courses), students, attendance, exams, assignments, messages, schedule],
  ACCOUNTANT:     [dashboard, payments, students, reports],
  STUDENT:        [my-courses, my-grades, my-payments, schedule, messages],
  PARENT:         [my-children, my-payments, messages, schedule],
  SUPER_ADMIN:    [all items + admin panel link],
}
```
- Active state: highlight current route using `usePathname()`
- All hrefs must include locale prefix: use `useLocale()` from next-intl

---

### 11. Forgot Password / Reset Password

**`apps/web/app/[locale]/(auth)/forgot-password/page.tsx`**:
- Input: phone OR email
- POST to `/api/auth/forgot-password`:
  - If phone: send OTP via same flow as login
  - If email: create VerificationToken type=PASSWORD_RESET, send email via Resend (`RESEND_API_KEY` env var)
- After submission: show confirmation message

**Reset password page:**
- If via OTP (phone): go through verify-otp then show new password form
- If via email: `/forgot-password/reset?token=...` — verify token, show new password form
- Server action: hash new password with bcryptjs, update `User.passwordHash`

---

## Technical Conventions (MUST follow)

1. **RTL**: use logical CSS only — `ps`, `pe`, `ms`, `me`, `border-s`, `border-e`, `start-0`, `end-0`. Never `pl`, `pr`, `ml`, `mr`, `left-`, `right-`
2. **Imports**: `import { prisma } from "@markazi/db"`, `import { ... } from "@markazi/api"`, `import { Button, Input, Card } from "@markazi/ui"`
3. **Money**: all monetary amounts use `Decimal` type in Prisma; display with `new Intl.NumberFormat('ar-EG')` 
4. **centerId guard**: every Prisma query on tenant models MUST include `centerId: session.user.primaryCenterId` — the tenant-scope middleware also enforces this, but be explicit
5. **Server Actions**: prefer `"use server"` actions over API routes where possible (mutations). Use API routes only for OAuth callbacks and webhook endpoints
6. **i18n**: all user-visible text via `useTranslations` / `getTranslations`. Add missing keys to BOTH `ar/common.json` and `en/common.json`
7. **Error handling**: use `AppError` from `@markazi/api` for server-side errors. Return structured `{ error: { code, message } }` JSON
8. **Passwords**: always hash with `bcryptjs`, never store plaintext. Salt rounds = 12
9. **Redis key naming convention**: `otp:{phone}`, `session:{sessionId}`, `rate:{ip}:{endpoint}`
10. **TypeScript**: strict mode, no `any`, use proper types from Prisma client

## Environment Variables Needed

Add these to `.env.example` (and document in DEVELOPMENT_LOG.md):
```
# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# SMS / OTP
INFOBIP_API_KEY=
INFOBIP_BASE_URL=https://XXXXX.api.infobip.com
INFOBIP_SENDER_NAME=Markazi

# Email (invites + password reset)
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@markazi.com

# Redis (already in docker-compose)
REDIS_URL=redis://localhost:6379
```

## Acceptance Criteria

- [ ] User can enter Egyptian phone, receive 6-digit OTP via SMS, enter it, and land on dashboard
- [ ] First-time user (no center) is redirected to center creation wizard
- [ ] Center creation wizard completes and creates Center + CenterMembership + Branch in DB
- [ ] Google OAuth login works end-to-end
- [ ] Email + password login works
- [ ] Center owner can invite an instructor via phone; instructor receives WhatsApp message and can register
- [ ] Sidebar shows different items based on the logged-in user's role
- [ ] All text is in Arabic (RTL), English translation keys are also added
- [ ] No TypeScript errors (`pnpm build` passes)
