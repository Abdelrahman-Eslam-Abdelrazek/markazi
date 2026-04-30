# Markazi — Product Requirements Document (PRD)

### Education Center Management Platform — Egyptian Market

**Version:** 1.1
**Created:** April 30, 2026
**Last Updated:** April 30, 2026
**Status:** Approved Draft
**Platform:** Web-only — Fully Responsive on all devices

---

## 1. Product Overview

### 1.1 What is Markazi?

Markazi is a fully integrated web-based SaaS platform built specifically for managing private education centers and tutoring institutes in Egypt. The platform is **100% web-based** — it runs on any device (desktop, tablet, mobile) directly through the browser with no app download required.

Markazi's core mission is to **fully digitize the education center from A to Z**: from the moment a student registers and pays their fees, through scheduling lectures, tracking attendance, managing assignments and exams, all the way to end-of-term reports visible to the instructor, parent, and administration simultaneously.

**Markazi is designed to be presented to any education center manager in Egypt and win them over immediately.**

### 1.2 The Problem Markazi Solves

Private education centers in Egypt face real, daily operational challenges:

#### Financial Management Problems

- **No payment tracking:** Center managers record payments on paper or Excel — easily lost.
- **No way to know who paid and who hasn't:** They have to ask each student manually.
- **Revenue and expenses are unclear:** No real financial report at month-end.
- **Cash payments with no official receipt:** No protection for the student or the center.

#### Attendance Problems

- **Paper attendance sheets:** Lost or filled out incorrectly.
- **Parents don't know if their child showed up:** They have to call the center.
- **Students mark attendance for friends:** Proxy attendance is extremely common.
- **No historical attendance record:** Impossible to calculate a student's attendance rate.

#### Instructor Problems

- **Instructors don't know which students have paid:** They teach students who haven't paid.
- **No organized way to share materials:** Content gets scattered across Telegram and Google Drive.
- **No exam system:** Exams are paper-based and disconnected from grading.
- **Instructors have no visibility into student performance:** No stats or reports.

#### Student Problems

- **Can't find their materials in one place:** Content is spread across WhatsApp, Telegram, and Google Drive.
- **Don't know exam schedules:** They find out by accident or from a friend.
- **Can't see their grades:** They have to ask the instructor personally.
- **No reminders for deadlines or payments.**
- **No structured way to communicate with instructors.**

#### Egyptian Market-Specific Problems

- **No support for local payment methods:** Fawry, Vodafone Cash, InstaPay, Valu.
- **Fully English interfaces:** Moodle and similar platforms don't speak Arabic properly.
- **Not optimized for mobile:** Most students use smartphones.
- **No WhatsApp integration** — the primary communication channel in Egypt.

---

## 2. Target Audience

### 2.1 Center Owners (Primary User)

- Private tutoring centers (primary / preparatory / secondary).
- Language and computer skills centers.
- Music or arts academies.
- Coach/Trainer running an online course.
- Doctor or teacher running a center from home.
- Vocational training centers (accounting, programming, design).

### 2.2 Instructors / Lecturers (Secondary User)

- Instructors working across multiple centers.
- University professors offering private courses.
- Full-time online tutors.

### 2.3 Students (End User)

- Secondary school students (highest consumption segment).
- University students.
- Adults in professional training courses.
- Parents of younger students.

---

## 3. Competitive Analysis & Gap

| Platform                       | Strengths                       | Weaknesses for the Egyptian Market                                |
| ------------------------------ | ------------------------------- | ----------------------------------------------------------------- |
| Moodle                         | Free, open-source, feature-rich | Too complex, requires a server, outdated UI, no Fawry/InstaPay    |
| Google Classroom               | Free and simple                 | No payment management, no advanced exams, no reporting            |
| Teachable / Thinkific          | Professional, easy to use       | USD pricing, no full Arabic support, no Fawry, unsuitable pricing |
| Zoom + WhatsApp + Google Drive | Familiar to everyone            | Fragmented, no management, no attendance/payments                 |
| Coursat / Nafham               | Local Arabic                    | Content-focused, not center management                            |

### The Competitive Gap:

No single platform in the Egyptian market combines:
✅ Payment management with local Egyptian payment methods (Fawry, InstaPay, Vodafone Cash)
✅ Smart attendance tracking with instant parent notifications
✅ Full assignments system with grading and feedback
✅ Professional exam system with a question bank
✅ Native Arabic responsive UI across all devices
✅ WhatsApp integration for notifications and communication
✅ Ready-made website for the center at no extra cost
✅ Reports for the manager, parent, and instructor simultaneously
✅ Complete financial system with official receipts and invoices

---

## 4. Core Features

---

### 4.1 User Management & Permissions

#### System Roles:

- **Super Admin:** Platform owner (Markazi team).
- **Center Owner:** Manages their center entirely.
- **Center Manager (Branch Manager):** Manages a specific branch.
- **Instructor:** Manages their courses, exams, and students.
- **Student:** Follows their courses and results.
- **Parent:** Monitors their child's performance only.
- **Accountant:** Views financial reports only.

#### Login Methods:

- Mobile number + OTP code (primary for the Egyptian market).
- Email + password (optional).
- Google Login.
- Magic Link for quick student access.

---

### 4.1.b What Can Each User Do? — Full Permissions Matrix

#### Center Owner / Branch Manager can:

- Manage all center data (name, logo, colors, address, contact links).
- Add / edit / delete instructors and define their permissions.
- Add / edit / delete students and assign them to specific courses.
- Create courses and assign an instructor to each.
- Record and track each student's payments (manual or electronic).
- Set installment plans and custom payment schedules per student.
- Issue official receipts and invoices with the center's branding.
- View comprehensive financial reports (daily / monthly / annual).
- View attendance and absence reports for all students.
- View results from all exams and assignments.
- Send bulk messages via WhatsApp / SMS to selected students.
- Set up the center's ready-made website.
- Manage multiple branches from the same account.

#### Instructor / Doctor can:

- Create and organize course content (video, PDF, text, live sessions).
- Upload videos, files, images, and written explanations.
- Schedule live sessions and direct lectures.
- Create full exams with multiple question types.
- Create assignments and homework with submission deadlines.
- Upload PDF worksheets for students.
- View only their **paid students** (cannot deliver lectures to unpaid students).
- Record attendance manually or via QR Code.
- Grade essay answers and assignments with score and written feedback.
- View student performance reports (grades, attendance, activity).
- Post announcements to course students inside the platform.
- Communicate with students via internal messaging.
- View exam question analytics (which question most students got wrong).

#### Student can:

- View all content from their enrolled courses.
- Watch videos with Adaptive Streaming based on internet speed.
- Read and view PDFs inside the browser.
- Join live sessions and watch recordings afterward.
- Solve quizzes and receive results instantly.
- Take exams within the scheduled windows.
- Submit assignments (file, text, image, or video).
- View instructor feedback and grades on their submissions.
- Track all grades and results in one page.
- View course completion percentage.
- See their schedule and upcoming exams.
- Receive notifications via WhatsApp / SMS / In-App.
- See the amount owed and the due date.
- Pay electronically directly (Fawry, InstaPay...).
- Communicate with the instructor via internal messaging.
- Participate in course discussion forums.
- Download completion certificate after finishing the course.

#### Parent can:

- View their child's attendance in every lecture.
- View their child's grades and results for exams and assignments.
- Track their child's progress in the course (completion percentage).
- Receive an instant notification when their child is absent.
- Receive a notification with the assignment or exam grade.
- View required and settled payments.
- Receive installment due date reminders.
- Communicate with center management via messages.
- **Cannot see** other students' data.

---

### 4.2 Center Management

#### Initial Center Setup:

- Center name in Arabic and English.
- Logo and primary brand colors (White-label).
- Address and map (Google Maps integration).
- Contact details (mobile, WhatsApp, Facebook).
- Center description and specializations.
- Working hours setup.

#### Branch Management:

- Add multiple branches under the same account.
- Each branch has its own manager, students, and instructors.
- Unified reports across all branches.

#### Ready-Made Website for the Center:

- Each center gets a subdomain: `center-name.Markazi.com`.
- Or connect a custom domain: `www.your-center.com`.
- The website auto-generates from the center's data.
- Homepage + course pages + contact page.
- SEO-ready in Arabic.
- Fully mobile-responsive.

---

### 4.3 Course & Content Management

#### Course Structure:

```
Course (e.g.: Math — Secondary Year 3 — Term 1)
├── Unit 1 — Algebra & Equations
│   ├── Lesson 1 — Explanation Video
│   ├── Lesson 2 — PDF Worksheet
│   ├── Lesson 3 — Live Session
│   ├── Assignment — Problem Set
│   └── Quiz
├── Unit 2 — Calculus & Derivatives
│   ├── ...
└── Monthly Final Exam
```

#### Supported Content Types (Complete):

| Content Type                   | Details                                                              |
| ------------------------------ | -------------------------------------------------------------------- |
| **Uploaded Video**             | Direct upload in HD quality, adaptive streaming, download protection |
| **External Video**             | YouTube or Vimeo embed (protected from direct access)                |
| **PDF**                        | Built-in viewer, cannot be downloaded without permission             |
| **Word / PowerPoint Document** | Displayed directly inside the platform                               |
| **Formatted Text Explanation** | Rich Text editor in Arabic, images, headings, tables                 |
| **Images & Infographics**      | With zoom and captions                                               |
| **Audio Files**                | Audio-only lectures without video                                    |
| **External Link**              | References and resource links                                        |
| **Live Session (Zoom)**        | Schedule + direct link + automatic recording after session ends      |
| **Assignment**                 | See Section 4.8                                                      |
| **Quick Quiz**                 | See Section 4.7                                                      |

#### Content Options:

- Set open and close times for each lesson.
- Drip Content: content unlocks sequentially (e.g., Unit 2 unlocks after completing Unit 1).
- Hide content from specific students while visible to others.
- Show content to paid students only.
- Set content as "free preview" for marketing.
- Track each student's progress within each unit.

#### Course Settings:

- Course price (or free).
- Available as standalone purchase or part of a subscription.
- Course start and end dates.
- Maximum student capacity.
- Study level (primary / preparatory / secondary / university / professional training).
- Drip mode (content unlocks progressively by date).
- Content availability after course ends.
- Automatic completion certificate.

---

### 4.4 Student Management

#### Student Profile:

- Full name (Arabic and English).
- Mobile number and WhatsApp number.
- Email address.
- Date of birth.
- Education level (primary / preparatory / secondary / university / graduate).
- Subject or specialization.
- Parent name and phone number.
- Profile photo.
- Enrolled courses.
- Payment history.
- Attendance and absence records.
- Exam results.

#### Student Registration:

- Manual registration by administration.
- Self-enrollment link with acceptance code.
- Import student data from Excel/CSV.
- Export student data.

#### Student Segments:

- Active / inactive students.
- Paid / unpaid students.
- At-risk students (High Absence, Low Grades).
- Students by course or instructor.

---

### 4.5 Payment Management

> **This is the most critical section of the platform — it solves the biggest problem in the Egyptian market.**

#### Payment Types:

- **Full course payment in one installment.**
- **Installment payment:** e.g., 3 monthly installments.
- **Monthly / per-term subscription.**
- **Per-lecture payment.**
- **Enrollment fee.**

#### Supported Payment Methods (Egyptian Market):

- **Fawry** (most widely used).
- **Vodafone Cash.**
- **InstaPay.**
- **Orange Cash / Etisalat Cash.**
- **Visa / Mastercard** (Paymob / Stripe).
- **Cash (manual):** Admin records the cash payment in the system.
- **Valu** (installment financing).
- **Bank transfer.**

#### Payment Management Dashboard:

- Full student list with payment status: ✅ Paid | ⏳ Partially Paid | ❌ Not Paid.
- Expected revenue vs. collected revenue.
- Subscriptions expiring within 7 days.
- Students with overdue installments.
- Daily / weekly / monthly reports.
- Export financial reports to PDF and Excel.

#### Receipts & Invoices:

- Automatic digital receipt sent to the student via WhatsApp and email.
- Official invoice with the center's logo.
- Unique reference number for each transaction.

#### Payment Reminders:

- Automatic reminder to the student 3 days and 1 day before installment due date.
- Alert to the manager for every overdue student.
- Alert to the parent.

---

### 4.6 Attendance Management

#### Attendance Recording Methods:

1. **QR Code:** Instructor displays a QR, student scans with mobile — attendance registered instantly.
2. **Manual by Instructor:** Instructor marks attendance on tablet or mobile.
3. **Manual by Administration:** From the dashboard.
4. **Automatic after video view:** (for online courses) — if the student watched more than 80% of the video, attendance is marked.
5. **Geolocation (optional):** Confirms the student is at the center's location.

#### Attendance Reports:

- Attendance percentage per student per course.
- Automatic warning if attendance drops below 75%.
- Instant alert to parent when student is absent.
- Daily attendance sheet per lecture.
- Attendance comparison across students.

---

### 4.7 Exam System

> **Instructors can create an exam and control every detail.**

#### Question Types:

- **Multiple Choice (MCQ).**
- **True/False.**
- **Short Answer.**
- **Essay.**
- **Fill in the Blank.**
- **File Upload:** For project submissions.
- **Matching.**

#### Exam Settings:

- Exam name and linked course.
- Start and end date/time.
- Time limit (Timer).
- Total marks and passing score.
- Number of allowed attempts.
- Shuffle questions.
- Shuffle answer choices.
- Show correct answers after completion or not.
- Restrict exam to paid students only.
- Prevent answers outside the exam window (Anti-cheat).

#### Question Bank:

- Instructors save questions in a bank.
- Can automatically generate an exam from the question bank (random selection).
- Questions categorized by topic and difficulty level.

#### Grading & Evaluation:

- MCQ and True/False graded automatically.
- Essay and File Upload graded manually by the instructor.
- Student notified of results as soon as graded.
- Grades automatically added to the student's record.

#### Exam Reports:

- Class average score.
- Highest and lowest performing students.
- Hardest questions (most-missed questions).
- Student comparison to class average.

---

### 4.8 Assignments System

> **One of Markazi's key differentiators from global platforms — assignments that work like real school homework, familiar and intuitive for students and parents.**

#### Assignment Types:

| Type                      | Description                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| **Written Assignment**    | Written questions the student answers directly inside the platform                             |
| **File Upload**           | Student uploads a PDF or image of their work                                                   |
| **Video Upload**          | Student records and uploads a video (for presentations and practical exercises)                |
| **Multi-Part Assignment** | Assignment broken into multiple sections                                                       |
| **Worksheet**             | Instructor uploads a PDF with questions, student uploads a photo of their handwritten solution |
| **Research / Report**     | Academic research assignment with a set submission deadline                                    |

#### Assignment Settings:

- Assignment title and description.
- Submission deadline (date and time) with automatic student reminder.
- Late submission allowed with grade penalty option.
- Full marks value.
- Linked to a specific unit or course.
- Peer submissions hidden (to prevent copying).

#### Grading Assignments:

- Instructor views each student's submission.
- Adds a score and written feedback for each submission.
- Student receives feedback and grade immediately upon grading.
- Grade automatically added to the student's record.
- Parent notified of their child's grade via WhatsApp.

#### Assignment Tracking Dashboard for Instructors:

- Number of submissions vs. total students.
- List of students who haven't submitted yet, with option to send a group reminder.
- Class average assignment grade.
- Assignments pending grading.

---

### 4.9 Notifications & Messaging

#### Notification Channels:

- **WhatsApp Business API:** Most important in Egypt — automatic alerts + manual messages.
- **SMS:** Via providers like Vodafone SMS API or Infobip.
- **Email:** For detailed messages and receipts.
- **In-App:** Notification bell in the dashboard.
- _(Push Notifications via PWA — Phase 2)_

#### Events That Trigger Automatic Notifications:

| Event                                | Sent To                    |
| ------------------------------------ | -------------------------- |
| New student registered               | Student + Center Owner     |
| Installment due in 3 days            | Student + Parent           |
| Late payment                         | Student + Parent + Manager |
| Student absent                       | Parent                     |
| Exam result available                | Student                    |
| New lecture available                | Course students            |
| Upcoming live session                | Course students            |
| Course ending soon                   | Student                    |
| Completion certificate issued        | Student                    |
| New assignment posted                | Course students            |
| Assignment due in 24 hours           | Student + Parent           |
| Assignment graded                    | Student + Parent           |
| Student has not submitted assignment | Instructor                 |

#### Manual Notifications:

- Center Owner / Instructor can send a message to:
  - All students in a specific course.
  - Paid students only.
  - Unpaid students only.
  - A specific student.
  - All students.

#### In-Platform Messaging:

- Direct chat between student and instructor (One-to-One).
- Chat between parent and center management.
- Discussion forum per course.
- Instructor can post announcements to all course students.
- WhatsApp button on every page for direct center contact.

---

### 4.10 Dashboards

#### Center Owner Dashboard:

- **Today's financial summary:** Total collected, overdue students.
- **Total students:** Active, new this month.
- **Active courses.**
- **Today's attendance:** Attendance rate and absent count.
- **Exams in the next 7 days.**
- **Assignments pending grading.**
- **Top 5 courses by revenue.**
- **Unread messages.**
- **Revenue trend chart — monthly.**
- **Last 5 registered students.**
- **At-risk student alerts (absence + low grades).**

#### Instructor Dashboard:

- My paid / unpaid students per course.
- Attendance in last lecture.
- Exams needing manual grading.
- Submitted assignments awaiting grading.
- Recent student activity.
- Messages from students.

#### Student Dashboard:

- Enrolled courses.
- Completion percentage per course.
- Upcoming exams.
- Pending assignments and deadlines.
- Latest grades.
- Outstanding payments.
- Messages from instructor.
- Notifications.

#### Parent Dashboard:

- Child's attendance this week.
- Latest exam and assignment grades.
- Assignments the child hasn't submitted yet.
- Outstanding payments.
- Messages from center management.

---

### 4.11 Reports & Analytics

#### Financial Reports:

- Revenue: daily / weekly / monthly / annual.
- Payments by course / instructor / branch.
- Overdue list and outstanding debts.
- Projected future revenue (based on scheduled installments).
- Month-over-month performance comparison.

#### Student Reports:

- Student performance over time.
- At-risk students (High Risk): high absence + low grades.
- Retention Rate.
- Student churn (students who left).

#### Academy Reports:

- Top-selling courses.
- Most active instructors.
- Average course rating.
- Course completion rate.

---

### 4.12 Schedule & Calendar

- **Full calendar** for all lectures, live sessions, and exams.
- **Instructor schedule:** All appointments across courses.
- **Student schedule:** Upcoming lectures and exams.
- **Google Calendar** integration.
- Automatic reminders 24 hours and 30 minutes before a lecture.

---

### 4.13 Rating & Reviews

- Students rate a course 1–5 stars + written comment.
- Ratings appear on the course page on the center's website.
- Center Owner can respond to ratings.
- Filter ratings for internal reporting.

---

### 4.14 Gamification & Certificates

#### Completion Certificate:

- Auto-generated when a student finishes a course.
- Customizable with the center's logo and colors.
- Includes: student name, course name, instructor name, date.
- QR code for certificate verification.
- Shareable on LinkedIn and Facebook.

#### Points & Badges:

- Points earned for: completing a lesson, solving a quiz, regular attendance.
- Leaderboard showing top students in the course.
- Achievement badges displayed on the student's profile.

---

## 5. Future Features (Planned — Not in v1)

### 5.1 Artificial Intelligence (AI Layer) — Phase 2

> **AI in Markazi is an integrated layer built on top of the core system, not a replacement for it. Each capability below solves a real, specific problem in the educational process.**

#### 5.1.a Student AI Assistant

**Problem:** Students get confused and need to ask questions but don't want to wait for the instructor.

- **Solution:** A chatbot trained exclusively on the course content — answers student questions based only on the uploaded videos and documents.
- Points students to the exact moment in the lecture that contains the answer.
- Works fully in Arabic.

#### 5.1.b AI Exam Generator

**Problem:** Instructors spend a lot of time writing exam questions.

- **Solution:** The instructor defines units, number of questions, and difficulty level — the system generates a ready exam in seconds.
- Generates MCQ + True/False + Short Answer automatically.
- Instructor reviews, removes, and adds before publishing.
- Works on PDFs, documents, and written text.

#### 5.1.c AI Essay Grading

**Problem:** Grading essay answers takes an enormous amount of the instructor's time.

- **Solution:** The system reads the student's answer, suggests a preliminary grade and automatic feedback — leaving the final grading decision to the instructor.
- Applies Bloom's Taxonomy in answer evaluation.
- Flags potential academic dishonesty (early Plagiarism Detection).

#### 5.1.d Auto-Summary of Lectures

**Problem:** Students struggle to remember and review lectures.

- **Solution:** A structured text summary is auto-generated for every video and displayed alongside it.
- Works on video transcripts and written lecture notes.
- Displays 3–5 key takeaways at the start of each lesson.

#### 5.1.e Adaptive Learning Recommendations

**Problem:** All students follow the same learning path despite different performance levels.

- **Solution:** The system analyzes the student's performance and recommends content to specifically strengthen weak areas.
- Suggests: "You struggled with questions 3, 7, and 12 — revisit those."

#### 5.1.f Predictive Early Warning System

**Problem:** Students fail or drop out before anyone notices.

- **Solution:** The system monitors signals: repeated absences + low grades + not opening content.
- Sends an alert to the instructor and parent: "Mohamed is showing signs of decline — absent 3 lectures, last exam score 55%."

#### 5.1.g Center Owner Copilot

**Problem:** Center owners spend too much time analyzing reports.

- **Solution:** An AI chatbot for the manager — they can ask: "Which course performed best this month?" or "How many students are behind on payments?"
- Responds with a direct answer and number pulled from the center's own data.

#### 5.1.h Auto-Enrollment via Photo / WhatsApp

**Problem:** Registering new student data is time-consuming.

- **Solution:** The student sends a photo of their national ID / basic details — the system uses OCR to extract data and auto-creates the account.

#### 5.1.i Monthly Parent Report Generator

**Problem:** Parents need to understand their child's performance clearly.

- **Solution:** A simple Arabic PDF monthly report is auto-generated including: attendance, grades, assignments, support recommendation — sent to the parent via WhatsApp every month.

---

### AI Contribution Summary per Role

| Who Benefits | Feature                  | Problem It Solves                         |
| ------------ | ------------------------ | ----------------------------------------- |
| Student      | AI Question Assistant    | Needs help, no one to ask                 |
| Student      | Lecture Summary          | Forgets content, needs review             |
| Student      | Learning Recommendations | Doesn't know where to focus               |
| Instructor   | Question Generation      | Spends too long writing exam questions    |
| Instructor   | AI Pre-Grading           | Wastes hours on manual grading            |
| Manager      | AI Copilot               | Drowning in numbers, slow to get insights |
| Parent       | Monthly Report           | No visibility into child's performance    |
| Everyone     | Early Warning Detection  | Shocked when a student fails              |

### 5.2 Course Marketplace — Phase 3

- Instructors list their courses on the Markazi Marketplace.
- Students purchase courses directly.
- Markazi takes a commission.

### 5.3 Other Advanced Features:

- **Integrated live streaming** (without needing Zoom).
- **Room Scheduling:** Book center classrooms online.
- **Referral system:** Student brings a friend and earns a discount.
- **Dynamic pricing:** Course price auto-increases as capacity fills.

---

## 6. Technical Requirements

### 6.1 Platform & Delivery:

| Channel           | Details                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| Web App           | Works on Chrome, Firefox, Safari, Edge                                  |
| Responsive Design | Fully adaptive on mobile and tablet                                     |
| PWA               | Can be "installed" on mobile home screen from the browser, no App Store |
| Admin Panel       | Web — for platform administration only                                  |

### 6.2 Performance & Speed:

- Page load under 2 seconds on Egyptian 4G.
- Video: Adaptive Streaming (adjusts to internet speed).
- Supports 10,000 concurrent users on the platform.

### 6.3 Security:

- All data encrypted (HTTPS/TLS).
- Password encryption (bcrypt).
- Video download protection (DRM).
- Daily data backups.
- Protection against SQL Injection, XSS, and CSRF attacks.
- Compliance with Egyptian Data Protection Law.

### 6.4 Language:

- Full Arabic interface (RTL).
- English language support.
- Toggle between languages.

---

## 7. Markazi Pricing Model

| Plan           | Monthly Price | Details                                                             |
| -------------- | ------------- | ------------------------------------------------------------------- |
| **Starter**    | Free          | Up to 50 students, 1 course, no White-label                         |
| **Growth**     | 299 EGP/month | Up to 300 students, 10 courses, ready-made website                  |
| **Pro**        | 699 EGP/month | Up to 1,000 students, unlimited courses, WhatsApp, advanced reports |
| **Enterprise** | Negotiated    | 1,000+ students, full White-label, API, priority support            |

**Note:** 2% commission on every electronic payment processed through the platform (Starter plan only).

---

## 8. User Journeys

### 8.1 New Center Owner Journey:

```
1. Visit Markazi website
2. Register with mobile number
3. Enter center data (name, logo, colors)
4. Add instructors and define their permissions
5. Create first course
6. Add students (manual or via link)
7. Set prices and payment methods
8. Share center link via WhatsApp
9. Monitor reports and payments from the dashboard
```

### 8.2 Student Journey:

```
1. Receive registration link from center (WhatsApp/SMS)
2. Register with mobile number + OTP
3. Pay course fees (Fawry or cash or direct)
4. Access dashboard (mobile browser)
5. Watch lectures and read materials
6. Submit assignments and homework
7. Take exams and track grades
8. Receive completion certificate
```

### 8.3 Instructor Journey:

```
1. Center Owner adds them by mobile number
2. Instructor receives login link
3. Builds their course and uploads lectures
4. Creates assignments and sets submission deadlines
5. Creates exam and sets schedule
6. Views paid students only
7. Records attendance or displays QR
8. Grades assignments and exams, reviews reports
```

### 8.4 Parent Journey:

```
1. Receives WhatsApp message with child's login credentials
2. Accesses their dedicated page
3. Monitors child's attendance and absences
4. Views child's grades and assignments
5. Receives instant WhatsApp alert when child is absent
6. Receives installment reminders
7. Pays electronically (Fawry)
```

---

## 9. Success Metrics (KPIs)

### Growth Metrics:

- Number of centers registered on the platform.
- Monthly Active Users — students (MAU).
- Total payment volume processed through the platform (GMV).

### Quality Metrics:

- Center Retention Rate — target: above 80%.
- Student course completion rate — target: above 60%.
- User satisfaction score (NPS) — target: above 50.
- Support response time — target: under 4 hours.

---

## 10. Open Questions & Pending Decisions

| Question                                          | Priority | Status                                                                         |
| ------------------------------------------------- | -------- | ------------------------------------------------------------------------------ |
| Build a native mobile app from the start?         | Closed   | **No** — Web-only in v1. PWA is sufficient and can be installed on home screen |
| Support Fawry from day one?                       | High     | Open                                                                           |
| Allow multi-center under one account (Franchise)? | Medium   | Open                                                                           |
| What is the refund policy?                        | Medium   | Open                                                                           |
| Support USD payments for Egyptians abroad?        | Low      | Open                                                                           |
| Will there be a Content Moderator role?           | Medium   | Open                                                                           |

---

## 11. Risks & Mitigation

| Risk                                                 | Probability   | Impact    | Mitigation Plan                                                 |
| ---------------------------------------------------- | ------------- | --------- | --------------------------------------------------------------- |
| Preference for cash over electronic payment          | High          | High      | Support manual cash logging in the system                       |
| Instructor resistance to technology                  | Medium        | High      | Very simple design + technical support + training               |
| Student data breach                                  | Low           | Very High | Encryption + periodic Penetration Testing                       |
| Competition from global platforms (Teachable/Google) | Medium        | Medium    | Focus on Egyptian-specific advantages (Fawry, WhatsApp, Arabic) |
| Internet outages during exams                        | High in Egypt | High      | Auto-save answers every minute offline                          |

---

## 12. Product Roadmap

### Phase 1 — MVP (Months 1–4):

- [ ] User registration and management system (7 roles).
- [ ] Course creation and content upload (video + PDF + written text + audio).
- [ ] Full Assignments system with all 5 types.
- [ ] Exam system (MCQ + True/False + Short Answer + Essay).
- [ ] Student management and payments (cash + Fawry).
- [ ] Attendance tracking (manual + QR Code).
- [ ] Dashboards for Center Owner + Instructor + Student + Parent.
- [ ] WhatsApp and SMS notifications.
- [ ] Ready-made center website (Subdomain).
- [ ] Parent page with full permissions.

### Phase 2 — Growth (Months 5–8):

- [ ] Advanced reports and analytics.
- [ ] Question Bank.
- [ ] Certificates system.
- [ ] Points and badges (Gamification).
- [ ] Drip Content and advanced course settings.
- [ ] PWA (installable on mobile).
- [ ] Subscription plan support.
- [ ] Vodafone Cash / InstaPay / Valu support.
- [ ] Live sessions (Zoom integration).
- [ ] Public API for integrations.

### Phase 3 — AI & Scale (Months 9–14):

- [ ] AI — Student AI Assistant.
- [ ] AI — Exam question generation and essay grading.
- [ ] AI — Early warning detection and monthly parent report.
- [ ] Full White-label.
- [ ] Course Marketplace.
- [ ] Integrated live streaming.

---

## 13. Glossary

| Term               | Definition                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------- |
| SaaS               | Software as a Service — user pays a subscription and accesses via the internet                |
| Web-only           | Platform is fully browser-based, no standalone mobile app                                     |
| White-label        | Running the platform under the center's own brand identity                                    |
| Responsive Design  | Design that adapts to any screen size (mobile / tablet / desktop)                             |
| PWA                | Progressive Web App — installed on mobile home screen from the browser, no App Store required |
| Drip Content       | Content unlocks progressively by date, not all at once                                        |
| Assignment         | Homework or task given by the instructor with a submission deadline                           |
| Worksheet          | PDF with questions; student solves and uploads a photo of their handwritten answers           |
| QR Attendance      | Attendance recorded by scanning a QR code with a mobile phone                                 |
| Question Bank      | Saved pool of questions an instructor uses to build exams                                     |
| Anti-Cheat         | Tools to prevent cheating in online exams                                                     |
| DRM                | Digital Rights Management — protects video from unauthorized download                         |
| Adaptive Streaming | Video quality adjusts dynamically based on internet speed                                     |
| GMV                | Gross Merchandise Value — total financial transactions processed through the platform         |
| MAU                | Monthly Active Users                                                                          |
| NPS                | Net Promoter Score — measures user satisfaction and likelihood to recommend                   |
| Early Warning      | Early detection of at-risk students (absence + academic underperformance)                     |
| Predictive AI      | AI that forecasts problems before they occur                                                  |

---

_Markazi — The All-in-One Management Platform for Private Education Centers in Egypt_
_Web-only. Native Arabic. Built for Egypt._
_Living document — updated as the product evolves._
