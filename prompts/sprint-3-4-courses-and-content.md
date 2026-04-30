# Sprint 3-4: Courses & Content Management

## Context

Sprint 1-2 (Auth & Center Setup) must be completed before this sprint.  
Do NOT change the Prisma schema — it is already fully defined.

**Relevant Prisma models for this sprint:**
- `Course` — has centerId, branchId, createdById, slug (unique per center), price (Decimal 10,2), status (DRAFT/PUBLISHED/ARCHIVED), dripMode, level, maxStudents, etc.
- `CourseInstructor` — pivot table (courseId, instructorId, isPrimary)
- `Unit` — belongs to Course, has sortOrder, isPublished, dripDate
- `Lesson` — belongs to Unit, has contentType (VIDEO_UPLOAD, PDF, RICH_TEXT, etc.), sortOrder, status, contentMeta (Json), richTextContent
- `Enrollment` — userId + courseId + centerId, status (ACTIVE/COMPLETED/DROPPED), completionPercent
- `LessonProgress` — userId + lessonId + enrollmentId, isCompleted, progressPercent, lastPosition

**Relevant validators already in `packages/api/src/validators/course.ts`:**
- `createCourseSchema`, `updateCourseSchema`, `createUnitSchema`, `createLessonSchema`

**Existing i18n keys in `ar/common.json`:** courses.*, students.*

---

## What Needs to Be Built in This Sprint

---

### 1. Courses List Page (Staff View)

**`apps/web/app/[locale]/(dashboard)/courses/page.tsx`** — Server Component:
- Load all courses for `session.user.primaryCenterId` from Prisma:
  ```ts
  prisma.course.findMany({
    where: { centerId, deletedAt: null },
    include: { _count: { select: { enrollments: true, units: true } }, instructors: { include: { instructor: true } } },
    orderBy: { createdAt: "desc" }
  })
  ```
- Show DataTable with columns: thumbnail, name (Arabic), status badge, price, students count, units count, instructors, actions (edit, duplicate, archive, delete)
- Status badge colors: DRAFT=gray, PUBLISHED=green, ARCHIVED=orange
- Filter bar: by status, by level (PRIMARY/PREP/SEC/UNI), by subject — all client-side
- "Create Course" button (top right) → links to `/courses/new`
- CASL guard: CENTER_OWNER, BRANCH_MANAGER, INSTRUCTOR (instructors see only their courses)

---

### 2. Create Course Page

**`apps/web/app/[locale]/(dashboard)/courses/new/page.tsx`** — Client Component (wizard-style form):

**Step 1 — Basic Info:**
- `nameAr` (required), `nameEn` (optional)
- Auto-generate `slug` from nameAr (use same transliteration helper from Sprint 1-2)
- `description` — Tiptap rich text editor (Arabic RTL) — install `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-text-direction`
- `level` — select from EducationLevel enum (show Arabic labels)
- `subject` — text input (e.g., "رياضيات", "فيزياء", "لغة عربية")
- `thumbnail` — image upload to S3 via `@markazi/media` (max 2MB, show preview)

**Step 2 — Pricing:**
- `isFree` toggle (default false)
- If not free: `price` (EGP, Decimal, min 0) — number input with "ج.م" suffix
- `paymentType` — FULL | INSTALLMENT | PER_LECTURE (radio buttons)
- `maxStudents` — optional, number input
- `startDate`, `endDate` — optional date pickers

**Step 3 — Content Settings:**
- `dripMode` — NONE | SEQUENTIAL | DATE_BASED (radio with Arabic descriptions)
- `autoCertificate` — toggle (generate certificate on completion)
- `contentAvailableAfterEnd` — toggle (students can still access after end date)

**Step 4 — Instructors:**
- Search users by name/phone within the center (search endpoint `/api/center/members?role=INSTRUCTOR&q=...`)
- Multi-select instructors, mark one as primary
- Show selected instructors as chips with remove button

**Server Action `createCourse`:**
- Validate with `createCourseSchema`
- Check center's `maxCourses` limit from subscription plan
- Create Course with `status: DRAFT`, `centerId`, `branchId: session.user.primaryBranchId`, `createdById`
- Create CourseInstructor entries for each selected instructor
- Redirect to `/courses/{courseId}/builder`

---

### 3. Course Builder (Content Editor)

**`apps/web/app/[locale]/(dashboard)/courses/[courseId]/builder/page.tsx`** — Client Component:

This is the core content editing page. Split into two panels:
- **Left panel (1/3):** Course outline — list of Units, each expandable to show Lessons
- **Right panel (2/3):** Selected item editor — shows form for editing selected unit or lesson

**Left Panel — Course Outline:**
- Display Units in `sortOrder` order
- Each Unit shows: name, lesson count, published/draft badge
- Each Lesson inside a Unit shows: content type icon, name, status
- **Drag-and-drop reorder** for both units and lessons within a unit — use `@dnd-kit/core` and `@dnd-kit/sortable`
  - On drop: update `sortOrder` via Server Action
- "Add Unit" button at the bottom → inline create (input field appears at bottom)
- Within each Unit: "Add Lesson" button → opens lesson editor on right panel
- Context menu per item (right-click or `...` button): Edit | Duplicate | Delete

**Right Panel — Item Editor:**

When a **Unit** is selected:
- Edit `nameAr`, `nameEn`, `description`
- `isPublished` toggle
- `dripDate` date picker (only shown if course `dripMode = DATE_BASED`)
- Save button → Server Action `updateUnit`

When a **Lesson** is selected:
- Edit `nameAr`, `nameEn`
- `contentType` selector — show icon + label for each type:
  - 🎬 فيديو مرفوع (VIDEO_UPLOAD)
  - 🔗 فيديو خارجي (VIDEO_EXTERNAL — YouTube/Vimeo URL)
  - 📄 ملف PDF (PDF)
  - 📝 محتوى نصي (RICH_TEXT)
  - 📁 ملف (DOCUMENT)
  - 🔴 بث مباشر (LIVE_SESSION)
- Based on `contentType`, show the appropriate content input (see section 4 below)
- `isFreePreview` toggle
- `isPaidOnly` toggle
- `duration` (minutes, number input)
- `status` selector: DRAFT | PUBLISHED | HIDDEN
- `openAt`, `closeAt` date pickers (optional)
- Save button → Server Action `updateLesson`

**Server Actions in `apps/web/app/actions/course.ts`:**
- `createUnit(courseId, centerId, data)` — uses `createUnitSchema`
- `updateUnit(unitId, courseId, centerId, data)`
- `deleteUnit(unitId, courseId, centerId)` — soft delete (also deletes child lessons)
- `reorderUnits(courseId, centerId, orderedIds: string[])` — bulk update sortOrder
- `createLesson(unitId, courseId, centerId, data)` — uses `createLessonSchema`
- `updateLesson(lessonId, unitId, courseId, centerId, data)`
- `deleteLesson(lessonId, unitId, courseId, centerId)`
- `reorderLessons(unitId, courseId, centerId, orderedIds: string[])`
- All actions: verify centerId ownership before writing

---

### 4. Lesson Content Types

**For VIDEO_UPLOAD:**
- File input (mp4, mov, max 2GB)
- Upload to S3 via `@markazi/media` → after S3 upload, create Mux upload (`packages/media/src/video/mux.ts`) → poll for processing
- Store in `contentMeta: { muxAssetId, muxPlaybackId, s3Key, duration }` as JSON
- Show upload progress bar
- After upload: show video player thumbnail with duration

**For VIDEO_EXTERNAL (YouTube/Vimeo):**
- URL input (validate YouTube or Vimeo URL)
- Parse video ID from URL
- Store in `contentMeta: { provider: "youtube" | "vimeo", videoId, url }`
- Show embedded preview (iframe)

**For PDF:**
- File input (pdf only, max 50MB)
- Upload to S3 via `@markazi/media`
- Store in `contentMeta: { s3Key, fileName, fileSize, pageCount }`
- Show PDF thumbnail (first page) — use `react-pdf` or just show filename with size

**For RICH_TEXT:**
- Tiptap editor with Arabic RTL support
- Toolbar: Bold, Italic, Underline, Heading (H2/H3), Bullet list, Numbered list, Link, Image (upload to S3), Table, Divider
- Enable `TextDirection` extension for mixed Arabic/English
- Store content in `richTextContent` field (HTML string)

**For DOCUMENT:**
- File input (pdf, doc, docx, xlsx, pptx, max 50MB)
- Upload to S3
- Store in `contentMeta: { s3Key, fileName, fileSize, mimeType }`

**For LIVE_SESSION:**
- `scheduledAt` datetime picker
- `durationMinutes` number input
- `meetingUrl` text input (Zoom/Google Meet link)
- `platform` select: Zoom | Google Meet | Microsoft Teams
- Store in `contentMeta: { scheduledAt, durationMinutes, meetingUrl, platform }`

---

### 5. Course Settings Page

**`apps/web/app/[locale]/(dashboard)/courses/[courseId]/settings/page.tsx`** — Server Component:
- Load course from Prisma with all relations
- Tabs: "الكورس" | "التسعير" | "المدرسين" | "الطلاب" | "الخطر"
- Tab forms mirror the create wizard (but can edit each field individually)
- **Danger tab:** archive course (sets status=ARCHIVED), permanently delete course (requires typing course name to confirm)
- Publish button: sets `status: PUBLISHED`, `publishedAt: now()`

---

### 6. Student Enrollment Flow

**`apps/web/app/[locale]/(dashboard)/students/page.tsx`** — Server Component:
- List all users with STUDENT membership in current center
- Columns: avatar, name, phone, education level, enrolled courses count, last active, actions
- "Add Student" button → dialog (search by phone, then enroll in a course, or add as student first)
- "Import" button → CSV upload (phone, nameAr, email, educationLevel) — create Users + CenterMemberships + Enrollments in bulk

**Manual Enrollment (for staff to enroll a student in a course):**

**`apps/web/app/[locale]/(dashboard)/students/[studentId]/enroll/page.tsx`** or Dialog:
- Select course (search dropdown from center's published courses)
- Select payment type: FULL | INSTALLMENT | FREE
- If FULL: amount (pre-filled from course price)
- If INSTALLMENT: use `InstallmentCalculator` from `@markazi/payments` — input total amount, number of installments
- If FREE: no payment fields
- Create Enrollment + Payment record in one transaction

**Server Action `enrollStudent`:**
- Validate student belongs to same center
- Check enrollment doesn't already exist (`@@unique([userId, courseId])`)
- Check `maxStudents` limit on course
- Create Enrollment with `status: ACTIVE`
- If payment: create Payment with `status: PENDING`, `paymentType`, `amount`
- If installment: create Installment records from calculator result
- Send WhatsApp notification to student: "تم تسجيلك في كورس {courseName}" using `NotificationDispatcher`

---

### 7. Student View — My Courses

**`apps/web/app/[locale]/(dashboard)/my-courses/page.tsx`** — Server Component (student role):
- Load enrollments for `session.user.id` where `centerId = session.user.primaryCenterId`
- Show course cards: thumbnail, name, progress bar (completionPercent), status
- Click card → goes to course content viewer

**`apps/web/app/[locale]/(dashboard)/my-courses/[courseId]/page.tsx`** — Course Content Viewer:
- Left panel: course outline (same unit/lesson tree, read-only)
  - Locked lessons (paid-only, not enrolled with payment): show lock icon
  - Completed lessons: show checkmark
  - Current lesson: highlighted
- Right panel: lesson content player/viewer
  - VIDEO: Mux Player (`@mux/mux-player-react`) — track progress at 25/50/75/100%
  - PDF: iframe or react-pdf viewer (allow print disable)
  - RICH_TEXT: render HTML content safely (DOMPurify)
  - LIVE_SESSION: show join button (link to meeting URL), countdown timer
- On lesson complete: call Server Action `markLessonComplete(lessonId, enrollmentId)`:
  - Update `LessonProgress.isCompleted = true`, `completedAt = now()`
  - Recalculate `Enrollment.completionPercent` (completed lessons / total lessons * 100)
  - If 100%: set `Enrollment.completedAt`, potentially generate certificate

---

### 8. Course Progress Tracking (Staff View)

**`apps/web/app/[locale]/(dashboard)/courses/[courseId]/students/page.tsx`**:
- List all enrolled students with columns: name, phone, enrolled date, completion %, last active, payment status
- Progress bar per student
- Click student → detail view showing which lessons completed/pending

---

### 9. Course Review / Rating (Student)

After course completion (completionPercent = 100):
- Prompt student to leave a review (show once via `localStorage` flag)
- Simple 1-5 star rating + optional text comment
- Server Action `createReview`: create `CourseReview` in Prisma
- Show average rating on course card (for staff)

---

## Technical Conventions

1. **RTL**: all layouts use logical CSS — `ps/pe/ms/me/border-s/border-e/start-/end-`
2. **File uploads**: always use `@markazi/media` S3 client — never upload directly from browser to S3 (use presigned URLs from the server)
3. **Video**: upload to S3 first, then create Mux upload from S3. Never stream from S3 directly
4. **Prices**: all price fields are `Decimal(10,2)` in Prisma — use `parseFloat()` for display, never do math on the raw Decimal object
5. **centerId guard**: every query must include `centerId: session.user.primaryCenterId`
6. **Drag-and-drop**: use `@dnd-kit/core` + `@dnd-kit/sortable` (already a common choice, install if not present)
7. **Rich text**: use Tiptap (`@tiptap/react`) — must enable RTL via `TextDirection` extension
8. **i18n**: add ALL new UI text to both `ar/common.json` and `en/common.json`
9. **Revalidation**: all Server Actions must call `revalidatePath` or `revalidateTag` after mutations

## New Dependencies to Install

```bash
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-text-direction @tiptap/extension-link @tiptap/extension-image @tiptap/extension-table --filter web
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities --filter web
pnpm add @mux/mux-player-react --filter web
pnpm add react-pdf --filter web
pnpm add dompurify @types/dompurify --filter web
```

## New Environment Variables

```
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
```

## Acceptance Criteria

- [ ] Staff can create a course with all fields (name, price, drip mode, instructors)
- [ ] Course builder loads with drag-and-drop unit/lesson reordering
- [ ] Can add VIDEO_UPLOAD lesson: file uploads to S3 → Mux processes it → player shows in student view
- [ ] Can add PDF lesson: file uploads to S3, student can view in-browser
- [ ] Can add RICH_TEXT lesson: Tiptap editor works in Arabic RTL
- [ ] Staff can enroll a student in a course (manually)
- [ ] Student sees their enrolled courses with progress bars
- [ ] Student can open a course and navigate through lessons
- [ ] Lesson completion updates progress percent
- [ ] No TypeScript errors, `pnpm build` passes
