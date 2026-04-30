# Sprint 5-6: Exams & Assignments

## Context

Sprints 1-4 must be completed before this sprint.  
Do NOT change the Prisma schema.

**Relevant Prisma models:**
- `QuestionBank` — centerId, courseId (optional), name
- `Question` — type (MCQ/TRUE_FALSE/SHORT_ANSWER/ESSAY/FILL_BLANK/FILE_UPLOAD/MATCHING), options (Json), points (Decimal 5,2), difficulty, topic
- `Exam` — courseId, status (DRAFT/SCHEDULED/ACTIVE/CLOSED/GRADED), timeLimitMinutes, totalMarks, passingMarks, maxAttempts, shuffleQuestions, isAntiCheat
- `ExamQuestion` — pivot (examId, questionId, sortOrder, points)
- `ExamAttempt` — userId, examId, status (IN_PROGRESS/SUBMITTED/GRADED/TIMED_OUT), totalScore, isPassed
- `ExamAnswer` — attemptId, examQuestionId, answerData (Json), isCorrect, score, feedback
- `Assignment` — courseId, type (WRITTEN/FILE_UPLOAD/VIDEO_UPLOAD/MULTI_PART/WORKSHEET/RESEARCH), totalMarks, deadline, allowLateSubmission, worksheetFileUrl, parts (Json)
- `AssignmentSubmission` — userId, assignmentId, status (PENDING/SUBMITTED/LATE_SUBMITTED/GRADED/RETURNED), submittedAt, totalScore, feedback

---

## What Needs to Be Built in This Sprint

---

### 1. Question Bank Management

**`apps/web/app/[locale]/(dashboard)/exams/question-bank/page.tsx`** — Server Component:
- List all QuestionBanks for the center
- Show per bank: name, question count, linked course (if any)
- "Create Bank" button → dialog with nameAr, nameEn, optional courseId

**`apps/web/app/[locale]/(dashboard)/exams/question-bank/[bankId]/page.tsx`** — Question list:
- Table of all questions in this bank
- Columns: type icon, topic, difficulty badge, points, actions
- Filter by type, difficulty, topic
- "Add Question" button → opens question editor (see section 2)
- Bulk import from CSV (phone/answer format — for MCQ only)

---

### 2. Question Editor (All 7 Types)

**`apps/web/app/[locale]/(dashboard)/exams/question-bank/[bankId]/question/new/page.tsx`** (also used for edit):
- Client Component with dynamic form per question type

**`type` selector** — large radio cards at top:
| Type | Arabic Label | Icon |
|------|-------------|------|
| MCQ | اختيار من متعدد | ◉ |
| TRUE_FALSE | صح وخطأ | ✓✗ |
| SHORT_ANSWER | إجابة قصيرة | ✏️ |
| ESSAY | مقالي | 📄 |
| FILL_BLANK | أكمل الفراغ | ___ |
| FILE_UPLOAD | رفع ملف | 📎 |
| MATCHING | توصيل | ↔️ |

**Common fields for all types:**
- `textAr` — Tiptap editor (Arabic, RTL) — the question stem
- `textEn` — optional English version
- `difficulty` — EASY | MEDIUM | HARD (select)
- `topic` — text input (e.g., "الباب الأول", "التفاضل")
- `points` — Decimal, default 1
- `imageUrl` — optional image upload to S3
- `explanation` — optional Tiptap editor (shown after answer)

**Type-specific fields:**

**MCQ:**
- Options: add up to 8 choices (each is text + optional image)
- Mark one or more correct answers (single-correct vs multi-correct toggle)
- `options` JSON structure: `{ choices: [{id, textAr, textEn?, imageUrl?}], correctIds: [id] }`

**TRUE_FALSE:**
- `options` JSON: `{ correctAnswer: "TRUE" | "FALSE" }`

**SHORT_ANSWER:**
- `options` JSON: `{ acceptedAnswers: string[], caseSensitive: boolean }` — staff provides accepted answers for auto-grading

**ESSAY:**
- `options` JSON: `{ rubric?: string, wordLimit?: number }` — manual grading, no auto-grade
- Optional rubric textarea (Arabic)

**FILL_BLANK:**
- Question text uses `___` as placeholder for blanks
- UI: parse `___` from text, show input per blank
- `options` JSON: `{ blanks: [{ id, acceptedAnswers: string[] }] }`

**FILE_UPLOAD:**
- `options` JSON: `{ allowedTypes: string[], maxSizeMB: number }`
- Manual grading only

**MATCHING:**
- Two columns: left items and right items (drag to match)
- `options` JSON: `{ leftItems: [{id, textAr}], rightItems: [{id, textAr}], correctPairs: [[leftId, rightId]] }`
- Add up to 10 pairs

**Server Action `saveQuestion`:** create or update Question, re-use across exam builder and question bank.

---

### 3. Exam Builder

**`apps/web/app/[locale]/(dashboard)/exams/page.tsx`** — Exam list per course:
- Filter by course (dropdown) or show all center exams
- Columns: name, course, status, start/end, total marks, attempt count, actions

**`apps/web/app/[locale]/(dashboard)/exams/new/page.tsx`** — Create Exam wizard:

**Step 1 — Exam Settings:**
- `nameAr`, `nameEn`
- `courseId` — select from center's published courses
- `timeLimitMinutes` — optional (no limit if empty)
- `startAt`, `endAt` — optional (open window)
- `maxAttempts` — default 1
- `passingMarks` — Decimal
- `shuffleQuestions` toggle
- `shuffleOptions` toggle (for MCQ)
- `showCorrectAnswers` toggle + `showCorrectAfter` date (optional)
- `isAntiCheat` toggle (fullscreen lock, tab-switch detection)
- `paidStudentsOnly` toggle

**Step 2 — Add Questions:**
Two modes (tabs):
- **From Question Bank:** browse questions from center's banks, filter by type/difficulty/topic, select and add
- **Create New:** inline question editor (same as section 2 above, saves to default question bank)
- After adding: show question list with drag handles (sortOrder), points override per ExamQuestion
- Show running total marks (sum of all ExamQuestion.points)

**Server Action `createExam`:**
- Create Exam with `status: DRAFT`
- Create ExamQuestion entries
- Auto-set `totalMarks` from sum of question points
- Validate `passingMarks <= totalMarks`

**`apps/web/app/[locale]/(dashboard)/exams/[examId]/page.tsx`** — Exam detail (for staff):
- Tabs: "الأسئلة" | "المحاولات" | "الإعدادات"
- Publish button: set `status: ACTIVE` (if startAt is in future → SCHEDULED)
- Attempts tab: list all student attempts with score, pass/fail, grade button

---

### 4. Exam-Taking Interface (Student View)

**`apps/web/app/[locale]/(dashboard)/my-courses/[courseId]/exams/[examId]/page.tsx`**:

**Pre-exam screen:**
- Show exam name, instructions, time limit, number of questions, attempts remaining
- "Start Exam" button

**Server Action `startExam`:**
- Validate enrollment + payment (if `paidStudentsOnly`)
- Check `maxAttempts` not exceeded
- Create ExamAttempt with `status: IN_PROGRESS`, `startedAt: now()`
- Return attempt ID + shuffled question list (if `shuffleQuestions`) + shuffled options (if `shuffleOptions`)

**Exam interface (Client Component, fullscreen if `isAntiCheat`):**
- Top bar: exam name, countdown timer (uses `Date.now() - startedAt + timeLimitMinutes * 60 * 1000`)
- Progress: "السؤال 3 من 15"
- Question navigator (grid of numbered buttons, green=answered, white=skipped)
- Current question renderer (per type — see section 5)
- "Next" / "Previous" navigation
- "Save Answer" — auto-save on answer change (POST to `/api/exams/[attemptId]/answer`)
- "Submit Exam" button — confirmation dialog
- If `isAntiCheat`: detect tab switch/window blur → show warning, record violation in `contentMeta`, after 3 violations auto-submit

**Timer behavior:**
- Count down in client
- At 0: auto-submit
- On page refresh: resume from remaining time (calculate server-side on load)

**Server Action `submitExam`:**
- Set `ExamAttempt.status: SUBMITTED`, `submittedAt: now()`
- Auto-grade: MCQ, TRUE_FALSE, SHORT_ANSWER (if acceptedAnswers set), FILL_BLANK, MATCHING
  - For each ExamAnswer: compare `answerData` against Question `options.correctIds` / `options.correctAnswer`
  - Set `ExamAnswer.isCorrect` and `ExamAnswer.score`
- Sum scores → set `ExamAttempt.totalScore`, `percentage`, `isPassed` (>= passingMarks)
- For ESSAY and FILE_UPLOAD: leave `isCorrect = null`, `score = null` (needs manual grading)
- If any ungraded questions: keep `ExamAttempt.status = SUBMITTED` (not GRADED)
- If all auto-graded: set `status = GRADED`, `gradedAt = now()`
- Send WhatsApp/SMS if fully auto-graded: "نتيجة امتحانك: X/Y — {ناجح/راسب}"

---

### 5. Question Renderers (Student View)

Create reusable components in `apps/web/components/exam/`:

**`QuestionRenderer.tsx`** — routes to type-specific component:
```tsx
switch (question.type) {
  case "MCQ": return <McqQuestion />
  case "TRUE_FALSE": return <TrueFalseQuestion />
  case "SHORT_ANSWER": return <ShortAnswerQuestion />
  case "ESSAY": return <EssayQuestion />
  case "FILL_BLANK": return <FillBlankQuestion />
  case "FILE_UPLOAD": return <FileUploadQuestion />
  case "MATCHING": return <MatchingQuestion />
}
```

**McqQuestion:** radio buttons (single correct) or checkboxes (multi-correct). Large tap targets for touch. Images if present.

**TrueFalseQuestion:** two large buttons "صح ✓" and "خطأ ✗".

**ShortAnswerQuestion:** single text input, RTL.

**EssayQuestion:** Textarea with word count. Character limit warning.

**FillBlankQuestion:** Parse question text, render inline inputs at `___` positions.

**FileUploadQuestion:** File input, upload to S3, store URL in answerData. Show filename after upload.

**MatchingQuestion:** Two columns with drag-and-drop lines between them (or dropdowns on mobile). Use `@dnd-kit` or simple select dropdowns.

---

### 6. Manual Grading Interface (Staff)

**`apps/web/app/[locale]/(dashboard)/exams/[examId]/grade/[attemptId]/page.tsx`**:
- Show each question and student's answer
- Auto-graded questions: show as read-only with score
- ESSAY/FILE_UPLOAD questions: score input (Decimal), feedback Tiptap editor
- "Save Grade" button per question → Server Action `gradeAnswer`
- After all graded: "Finalize Grades" → sets `ExamAttempt.status: GRADED`, sends notification

---

### 7. Assignment Builder

**`apps/web/app/[locale]/(dashboard)/courses/[courseId]/assignments/new/page.tsx`**:

**`type` selector:**
| Type | Arabic Label |
|------|-------------|
| WRITTEN | كتابي |
| FILE_UPLOAD | رفع ملف |
| VIDEO_UPLOAD | رفع فيديو |
| WORKSHEET | ورقة عمل |
| MULTI_PART | متعدد الأجزاء |
| RESEARCH | بحث |

**Common fields:**
- `nameAr`, `nameEn`
- `description` + `instructions` — Tiptap editors
- `totalMarks` — Decimal
- `deadline` — datetime picker (Cairo timezone)
- `allowLateSubmission` toggle + `latePenaltyPercent` (shown if allowed)
- `paidStudentsOnly` toggle
- `hideSubmissions` toggle (students can't see each other's work)

**Type-specific fields:**
- **WORKSHEET:** upload a PDF worksheet (`worksheetFileUrl`) — students download, fill, and upload back
- **MULTI_PART:** `parts` JSON — add up to 10 parts each with name, description, marks
- **RESEARCH:** research guidelines + `parts` for submission requirements

**Server Action `createAssignment`:**
- Create Assignment with `publishedAt: null` (draft)
- Publish button: set `publishedAt: now()`
- Send notification to all enrolled students when published

---

### 8. Assignment Submission Flow (Student)

**`apps/web/app/[locale]/(dashboard)/my-courses/[courseId]/assignments/[assignmentId]/page.tsx`**:

**Pre-submission view:**
- Show assignment name, instructions, deadline (with countdown: "تبقى 2 يوم، 14 ساعة")
- Download worksheet button (for WORKSHEET type)
- If past deadline and `allowLateSubmission = false`: show "انتهى وقت التسليم" and disable submit

**Submission interface (per type):**
- **WRITTEN:** Tiptap editor (student writes directly)
- **FILE_UPLOAD:** file input (pdf, doc, max 20MB)
- **VIDEO_UPLOAD:** video file input (mp4, mov, max 500MB) → upload to S3
- **WORKSHEET:** file upload (student uploads filled worksheet)
- **MULTI_PART:** one input per part (file or text)
- **RESEARCH:** file upload + optional URL

**Server Action `submitAssignment`:**
- Validate enrollment
- If past deadline:
  - If `allowLateSubmission = false`: reject
  - If allowed: create submission with `status: LATE_SUBMITTED`
- Else: create `AssignmentSubmission` with `status: SUBMITTED`, `submittedAt: now()`
- Store answer data in `submissionData` Json field
- Notify instructors via `NotificationDispatcher`: "طالب جديد سلّم الواجب {assignmentName}"

---

### 9. Assignment Grading Interface (Staff)

**`apps/web/app/[locale]/(dashboard)/courses/[courseId]/assignments/[assignmentId]/submissions/page.tsx`**:
- List all submissions: student name, submitted at, status badge, score
- "Grade" button per row → opens grading view

**Grading view:**
- Show student's submission (render based on type: text content, PDF viewer/download link, video player)
- Score input (out of totalMarks, Decimal)
- Feedback Tiptap editor (Arabic)
- "Save & Return to Student" button → Server Action `gradeSubmission`:
  - Set `totalScore`, `percentage`, `status: RETURNED`, `gradedAt`
  - Send WhatsApp to student: "تم تصحيح واجبك {assignmentName} — درجتك: {score}/{totalMarks}"
- "Save Draft" button → `status: GRADED` (not yet returned)

---

### 10. Grade Reports

**`apps/web/app/[locale]/(dashboard)/reports/grades/page.tsx`** — Server Component:
- Filter by: course, student, date range
- Table: student, course, exam avg, assignment avg, overall grade
- Export to CSV button

**Student grade view:**
**`apps/web/app/[locale]/(dashboard)/my-grades/page.tsx`** — Server Component (student role):
- List all exams and assignments with scores
- Show pass/fail badges
- Progress toward course completion

---

## Technical Conventions

1. **Timer accuracy:** store exam start time on server (`ExamAttempt.startedAt`), calculate remaining time server-side on every page load to prevent client-side manipulation
2. **Anti-cheat:** fullscreen API + `visibilitychange` event listener. Store violations count in `ExamAttempt` (add a `violations` Int field to the schema if needed, or use `contentMeta` Json)
3. **Auto-grading:** run synchronously on submission for speed (it's fast). Do NOT use background jobs for grading — only use jobs for notifications
4. **File uploads in exams:** use presigned S3 URLs (upload from client directly to S3 with a short-lived presigned URL from server)
5. **Answer data format:**
   - MCQ: `{ selectedIds: ["option-id-1"] }`
   - TRUE_FALSE: `{ answer: "TRUE" | "FALSE" }`
   - SHORT_ANSWER: `{ text: "student answer" }`
   - ESSAY: `{ html: "<p>...</p>" }`
   - FILL_BLANK: `{ answers: { "blank-id-1": "text", "blank-id-2": "text" } }`
   - FILE_UPLOAD: `{ s3Key: "...", fileName: "...", fileUrl: "..." }`
   - MATCHING: `{ pairs: [["left-id-1", "right-id-2"], ...] }`
6. **All monetary values** (scores are not monetary but `Decimal` in schema — treat consistently)
7. **Timezone:** all datetime display uses `Africa/Cairo` timezone. Use `Intl.DateTimeFormat` with `timeZone: "Africa/Cairo"`
8. **RTL:** all layouts use logical CSS

## New Dependencies to Install

```bash
pnpm add nanoid --filter web
```

(Tiptap and dnd-kit should already be installed from Sprint 3-4)

## Acceptance Criteria

- [ ] Staff can create a question bank with MCQ, Essay, and Matching questions
- [ ] Staff can build an exam from question bank questions
- [ ] Student can start an exam, answer all question types, and submit
- [ ] Auto-grading works for MCQ and True/False immediately on submit
- [ ] Staff sees exam attempts list with scores
- [ ] Staff can manually grade Essay questions with feedback
- [ ] Anti-cheat tab-switch detection works when enabled
- [ ] Staff can create a Worksheet assignment (upload PDF, students download+upload)
- [ ] Students can submit assignments before the deadline
- [ ] Staff can grade submitted assignments and return them to students
- [ ] Student sees their grades in "درجاتي" page
- [ ] No TypeScript errors, `pnpm build` passes
