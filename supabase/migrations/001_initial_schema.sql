-- =================================================================
-- Markazi — Initial Database Schema
-- Education Center Management Platform for the Egyptian Market
-- =================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =================================================================
-- ENUMS
-- =================================================================

CREATE TYPE user_role AS ENUM (
  'SUPER_ADMIN', 'CENTER_OWNER', 'BRANCH_MANAGER',
  'INSTRUCTOR', 'STUDENT', 'PARENT', 'ACCOUNTANT'
);

CREATE TYPE auth_provider AS ENUM (
  'PHONE_OTP', 'EMAIL_PASSWORD', 'GOOGLE', 'MAGIC_LINK'
);

CREATE TYPE gender AS ENUM ('MALE', 'FEMALE');

CREATE TYPE education_level AS ENUM (
  'PRIMARY', 'PREPARATORY', 'SECONDARY',
  'UNIVERSITY', 'POSTGRADUATE', 'PROFESSIONAL'
);

CREATE TYPE center_status AS ENUM (
  'ACTIVE', 'SUSPENDED', 'PENDING_SETUP', 'DEACTIVATED'
);

CREATE TYPE subscription_plan AS ENUM (
  'STARTER', 'GROWTH', 'PRO', 'ENTERPRISE'
);

CREATE TYPE subscription_status AS ENUM (
  'ACTIVE', 'PAST_DUE', 'CANCELLED', 'TRIALING'
);

CREATE TYPE course_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

CREATE TYPE content_type AS ENUM (
  'VIDEO_UPLOAD', 'VIDEO_EXTERNAL', 'PDF', 'DOCUMENT',
  'RICH_TEXT', 'IMAGE', 'AUDIO', 'EXTERNAL_LINK',
  'LIVE_SESSION', 'ASSIGNMENT', 'QUIZ'
);

CREATE TYPE drip_mode AS ENUM ('NONE', 'SEQUENTIAL', 'DATE_BASED');

CREATE TYPE lesson_status AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN');

CREATE TYPE enrollment_status AS ENUM (
  'ACTIVE', 'COMPLETED', 'DROPPED', 'SUSPENDED'
);

CREATE TYPE payment_status AS ENUM (
  'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'
);

CREATE TYPE payment_method AS ENUM (
  'FAWRY', 'VODAFONE_CASH', 'INSTAPAY', 'ORANGE_CASH',
  'ETISALAT_CASH', 'VISA', 'MASTERCARD', 'VALU',
  'BANK_TRANSFER', 'CASH'
);

CREATE TYPE payment_type AS ENUM (
  'FULL', 'INSTALLMENT', 'SUBSCRIPTION', 'PER_LECTURE', 'ENROLLMENT_FEE'
);

CREATE TYPE installment_status AS ENUM (
  'UPCOMING', 'DUE', 'OVERDUE', 'PAID', 'PARTIALLY_PAID'
);

CREATE TYPE invoice_status AS ENUM (
  'DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'CANCELLED'
);

CREATE TYPE attendance_method AS ENUM (
  'QR_CODE', 'MANUAL_INSTRUCTOR', 'MANUAL_ADMIN', 'AUTO_VIDEO', 'GEOLOCATION'
);

CREATE TYPE attendance_status AS ENUM (
  'PRESENT', 'ABSENT', 'LATE', 'EXCUSED'
);

CREATE TYPE question_type AS ENUM (
  'MCQ', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY',
  'FILL_BLANK', 'FILE_UPLOAD', 'MATCHING'
);

CREATE TYPE difficulty_level AS ENUM ('EASY', 'MEDIUM', 'HARD');

CREATE TYPE exam_status AS ENUM (
  'DRAFT', 'SCHEDULED', 'ACTIVE', 'CLOSED', 'GRADED'
);

CREATE TYPE exam_attempt_status AS ENUM (
  'IN_PROGRESS', 'SUBMITTED', 'GRADED', 'TIMED_OUT'
);

CREATE TYPE assignment_type AS ENUM (
  'WRITTEN', 'FILE_UPLOAD', 'VIDEO_UPLOAD',
  'MULTI_PART', 'WORKSHEET', 'RESEARCH'
);

CREATE TYPE submission_status AS ENUM (
  'PENDING', 'SUBMITTED', 'LATE_SUBMITTED', 'GRADED', 'RETURNED'
);

CREATE TYPE notification_channel AS ENUM (
  'WHATSAPP', 'SMS', 'EMAIL', 'IN_APP', 'PUSH'
);

CREATE TYPE notification_status AS ENUM (
  'PENDING', 'SENT', 'DELIVERED', 'FAILED', 'READ'
);

CREATE TYPE message_thread_type AS ENUM (
  'DIRECT', 'COURSE_DISCUSSION', 'ANNOUNCEMENT', 'SUPPORT'
);

CREATE TYPE live_session_status AS ENUM (
  'SCHEDULED', 'LIVE', 'ENDED', 'CANCELLED'
);

CREATE TYPE certificate_status AS ENUM ('GENERATED', 'REVOKED');

CREATE TYPE audit_action AS ENUM (
  'CREATE', 'UPDATE', 'DELETE', 'LOGIN',
  'LOGOUT', 'PAYMENT', 'ENROLLMENT', 'GRADE'
);

CREATE TYPE website_page_type AS ENUM (
  'HOME', 'ABOUT', 'CONTACT', 'COURSES', 'CUSTOM'
);

-- =================================================================
-- USERS & AUTH
-- =================================================================

CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  phone TEXT UNIQUE,
  phone_verified BOOLEAN NOT NULL DEFAULT false,
  email TEXT UNIQUE,
  email_verified TIMESTAMPTZ,
  password_hash TEXT,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  avatar TEXT,
  gender gender,
  date_of_birth DATE,
  education_level education_level,
  locale TEXT NOT NULL DEFAULT 'ar',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

CREATE TABLE accounts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider auth_provider NOT NULL,
  provider_account_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(provider, provider_account_id)
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);

CREATE TABLE verification_tokens (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  type TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(identifier, token)
);

CREATE INDEX idx_verification_tokens_identifier ON verification_tokens(identifier);
CREATE INDEX idx_verification_tokens_expires ON verification_tokens(expires);

CREATE TABLE parent_students (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  parent_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  relation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(parent_id, student_id)
);

CREATE INDEX idx_parent_students_parent_id ON parent_students(parent_id);
CREATE INDEX idx_parent_students_student_id ON parent_students(student_id);

-- =================================================================
-- CENTERS & BRANCHES (MULTI-TENANT)
-- =================================================================

CREATE TABLE centers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  logo TEXT,
  cover_image TEXT,
  primary_color TEXT NOT NULL DEFAULT '#1E40AF',
  secondary_color TEXT NOT NULL DEFAULT '#F59E0B',
  description TEXT,
  specializations TEXT[] DEFAULT '{}',
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  status center_status NOT NULL DEFAULT 'PENDING_SETUP',
  timezone TEXT NOT NULL DEFAULT 'Africa/Cairo',
  currency TEXT NOT NULL DEFAULT 'EGP',
  tax_id TEXT,
  subscription_plan subscription_plan NOT NULL DEFAULT 'STARTER',
  subscription_status subscription_status NOT NULL DEFAULT 'TRIALING',
  subscription_start_at TIMESTAMPTZ,
  subscription_end_at TIMESTAMPTZ,
  max_students INT NOT NULL DEFAULT 50,
  max_courses INT NOT NULL DEFAULT 1,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_centers_slug ON centers(slug);
CREATE INDEX idx_centers_status ON centers(status);
CREATE INDEX idx_centers_deleted_at ON centers(deleted_at);

CREATE TABLE branches (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  phone TEXT,
  is_main BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  working_hours JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_branches_center_id ON branches(center_id);

CREATE TABLE center_memberships (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
  branch_id TEXT REFERENCES branches(id) ON DELETE SET NULL,
  role user_role NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, center_id, role)
);

CREATE INDEX idx_center_memberships_user_id ON center_memberships(user_id);
CREATE INDEX idx_center_memberships_center_id ON center_memberships(center_id);
CREATE INDEX idx_center_memberships_branch_id ON center_memberships(branch_id);
CREATE INDEX idx_center_memberships_role ON center_memberships(role);

CREATE TABLE subscription_history (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL,
  status subscription_status NOT NULL,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  amount DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscription_history_center_id ON subscription_history(center_id);

-- =================================================================
-- COURSES, UNITS, LESSONS
-- =================================================================

CREATE TABLE courses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
  branch_id TEXT REFERENCES branches(id) ON DELETE SET NULL,
  created_by_id TEXT NOT NULL REFERENCES users(id),
  name_ar TEXT NOT NULL,
  name_en TEXT,
  slug TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EGP',
  is_free BOOLEAN NOT NULL DEFAULT false,
  status course_status NOT NULL DEFAULT 'DRAFT',
  level education_level,
  subject TEXT,
  drip_mode drip_mode NOT NULL DEFAULT 'NONE',
  max_students INT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  content_available_after_end BOOLEAN NOT NULL DEFAULT true,
  auto_certificate BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(center_id, slug)
);

CREATE INDEX idx_courses_center_id ON courses(center_id);
CREATE INDEX idx_courses_branch_id ON courses(branch_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_deleted_at ON courses(deleted_at);

CREATE TABLE course_instructors (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(course_id, instructor_id)
);

CREATE INDEX idx_course_instructors_instructor_id ON course_instructors(instructor_id);

CREATE TABLE units (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  drip_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_units_course_id ON units(course_id);
CREATE INDEX idx_units_sort_order ON units(sort_order);

CREATE TABLE lessons (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  unit_id TEXT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  content_type content_type NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  status lesson_status NOT NULL DEFAULT 'DRAFT',
  is_free_preview BOOLEAN NOT NULL DEFAULT false,
  is_paid_only BOOLEAN NOT NULL DEFAULT true,
  duration INT,
  open_at TIMESTAMPTZ,
  close_at TIMESTAMPTZ,
  content_meta JSONB,
  rich_text_content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lessons_unit_id ON lessons(unit_id);
CREATE INDEX idx_lessons_sort_order ON lessons(sort_order);
CREATE INDEX idx_lessons_status ON lessons(status);

CREATE TABLE enrollments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  center_id TEXT NOT NULL,
  status enrollment_status NOT NULL DEFAULT 'ACTIVE',
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  completion_percent INT NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  certificate_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_center_id ON enrollments(center_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

CREATE TABLE lesson_progress (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  enrollment_id TEXT NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  progress_percent INT NOT NULL DEFAULT 0,
  last_position INT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(lesson_id, user_id)
);

CREATE INDEX idx_lesson_progress_enrollment_id ON lesson_progress(enrollment_id);
CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);

-- =================================================================
-- EXAMS & QUESTION BANK
-- =================================================================

CREATE TABLE question_banks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  center_id TEXT NOT NULL,
  course_id TEXT,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_question_banks_center_id ON question_banks(center_id);
CREATE INDEX idx_question_banks_course_id ON question_banks(course_id);

CREATE TABLE questions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  question_bank_id TEXT REFERENCES question_banks(id) ON DELETE SET NULL,
  created_by_id TEXT NOT NULL,
  type question_type NOT NULL,
  difficulty difficulty_level NOT NULL DEFAULT 'MEDIUM',
  topic TEXT,
  text_ar TEXT NOT NULL,
  text_en TEXT,
  points DECIMAL(5,2) NOT NULL DEFAULT 1,
  options JSONB,
  explanation TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_questions_question_bank_id ON questions(question_bank_id);
CREATE INDEX idx_questions_type ON questions(type);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_topic ON questions(topic);

CREATE TABLE exams (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_by_id TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  status exam_status NOT NULL DEFAULT 'DRAFT',
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  time_limit_minutes INT,
  total_marks DECIMAL(6,2) NOT NULL,
  passing_marks DECIMAL(6,2) NOT NULL,
  max_attempts INT NOT NULL DEFAULT 1,
  shuffle_questions BOOLEAN NOT NULL DEFAULT false,
  shuffle_options BOOLEAN NOT NULL DEFAULT false,
  show_correct_answers BOOLEAN NOT NULL DEFAULT false,
  show_correct_after TIMESTAMPTZ,
  paid_students_only BOOLEAN NOT NULL DEFAULT true,
  is_anti_cheat BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_exams_course_id ON exams(course_id);
CREATE INDEX idx_exams_status ON exams(status);
CREATE INDEX idx_exams_start_end ON exams(start_at, end_at);

CREATE TABLE exam_questions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  exam_id TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  points DECIMAL(5,2) NOT NULL,
  UNIQUE(exam_id, question_id)
);

CREATE INDEX idx_exam_questions_exam_id ON exam_questions(exam_id);

CREATE TABLE exam_attempts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  exam_id TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  attempt_number INT NOT NULL,
  status exam_attempt_status NOT NULL DEFAULT 'IN_PROGRESS',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  total_score DECIMAL(6,2),
  percentage DECIMAL(5,2),
  is_passed BOOLEAN,
  graded_at TIMESTAMPTZ,
  graded_by_id TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(exam_id, user_id, attempt_number)
);

CREATE INDEX idx_exam_attempts_exam_id ON exam_attempts(exam_id);
CREATE INDEX idx_exam_attempts_user_id ON exam_attempts(user_id);
CREATE INDEX idx_exam_attempts_status ON exam_attempts(status);

CREATE TABLE exam_answers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  attempt_id TEXT NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
  exam_question_id TEXT NOT NULL REFERENCES exam_questions(id) ON DELETE CASCADE,
  answer_data JSONB NOT NULL,
  is_correct BOOLEAN,
  score DECIMAL(5,2),
  feedback TEXT,
  graded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(attempt_id, exam_question_id)
);

CREATE INDEX idx_exam_answers_attempt_id ON exam_answers(attempt_id);

-- =================================================================
-- ASSIGNMENTS
-- =================================================================

CREATE TABLE assignments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  unit_id TEXT,
  created_by_id TEXT NOT NULL,
  type assignment_type NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  instructions TEXT,
  total_marks DECIMAL(6,2) NOT NULL,
  deadline TIMESTAMPTZ NOT NULL,
  allow_late_submission BOOLEAN NOT NULL DEFAULT false,
  late_penalty_percent INT,
  hide_submissions BOOLEAN NOT NULL DEFAULT true,
  paid_students_only BOOLEAN NOT NULL DEFAULT true,
  worksheet_file_url TEXT,
  parts JSONB,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_assignments_course_id ON assignments(course_id);
CREATE INDEX idx_assignments_unit_id ON assignments(unit_id);
CREATE INDEX idx_assignments_deadline ON assignments(deadline);

CREATE TABLE assignment_submissions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  assignment_id TEXT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status submission_status NOT NULL DEFAULT 'PENDING',
  submitted_at TIMESTAMPTZ,
  submission_data JSONB,
  is_late BOOLEAN NOT NULL DEFAULT false,
  score DECIMAL(6,2),
  max_score DECIMAL(6,2),
  feedback TEXT,
  graded_at TIMESTAMPTZ,
  graded_by_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(assignment_id, user_id)
);

CREATE INDEX idx_assignment_submissions_assignment_id ON assignment_submissions(assignment_id);
CREATE INDEX idx_assignment_submissions_user_id ON assignment_submissions(user_id);
CREATE INDEX idx_assignment_submissions_status ON assignment_submissions(status);

-- =================================================================
-- ATTENDANCE
-- =================================================================

CREATE TABLE attendance_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  branch_id TEXT REFERENCES branches(id) ON DELETE SET NULL,
  created_by_id TEXT NOT NULL,
  title TEXT,
  session_date DATE NOT NULL,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  method attendance_method NOT NULL,
  qr_code TEXT UNIQUE,
  qr_expires_at TIMESTAMPTZ,
  geofence_latitude DOUBLE PRECISION,
  geofence_longitude DOUBLE PRECISION,
  geofence_radius_m INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_attendance_sessions_course_id ON attendance_sessions(course_id);
CREATE INDEX idx_attendance_sessions_session_date ON attendance_sessions(session_date);
CREATE INDEX idx_attendance_sessions_qr_code ON attendance_sessions(qr_code);

CREATE TABLE attendance_records (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  attendance_session_id TEXT NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  enrollment_id TEXT NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  status attendance_status NOT NULL DEFAULT 'ABSENT',
  method attendance_method NOT NULL,
  checked_in_at TIMESTAMPTZ,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  notes TEXT,
  marked_by_id TEXT,
  parent_notified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(attendance_session_id, user_id)
);

CREATE INDEX idx_attendance_records_user_id ON attendance_records(user_id);
CREATE INDEX idx_attendance_records_enrollment_id ON attendance_records(enrollment_id);
CREATE INDEX idx_attendance_records_status ON attendance_records(status);

-- =================================================================
-- PAYMENTS & FINANCIAL
-- =================================================================

CREATE TABLE payment_configs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
  method payment_method NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  credentials JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(center_id, method)
);

CREATE TABLE installment_plans (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  center_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  number_of_installments INT NOT NULL,
  created_by_id TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_installment_plans_center_id ON installment_plans(center_id);
CREATE INDEX idx_installment_plans_user_id ON installment_plans(user_id);
CREATE INDEX idx_installment_plans_course_id ON installment_plans(course_id);

CREATE TABLE installments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  installment_plan_id TEXT NOT NULL REFERENCES installment_plans(id) ON DELETE CASCADE,
  installment_number INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status installment_status NOT NULL DEFAULT 'UPCOMING',
  paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  paid_at TIMESTAMPTZ,
  reminder_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(installment_plan_id, installment_number)
);

CREATE INDEX idx_installments_due_date ON installments(due_date);
CREATE INDEX idx_installments_status ON installments(status);

CREATE TABLE invoices (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  status invoice_status NOT NULL DEFAULT 'DRAFT',
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EGP',
  due_date DATE,
  issued_at TIMESTAMPTZ,
  pdf_url TEXT,
  notes TEXT,
  line_items JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invoices_center_id ON invoices(center_id);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status);

CREATE TABLE payments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id TEXT,
  installment_id TEXT REFERENCES installments(id) ON DELETE SET NULL,
  invoice_id TEXT REFERENCES invoices(id) ON DELETE SET NULL,
  type payment_type NOT NULL,
  method payment_method NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EGP',
  status payment_status NOT NULL DEFAULT 'PENDING',
  gateway_provider TEXT,
  gateway_transaction_id TEXT UNIQUE,
  gateway_order_id TEXT,
  gateway_response JSONB,
  is_manual BOOLEAN NOT NULL DEFAULT false,
  recorded_by_id TEXT,
  manual_notes TEXT,
  reference_number TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  refund_amount DECIMAL(10,2),
  platform_fee DECIMAL(10,2),
  platform_fee_percent DECIMAL(4,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_center_id ON payments(center_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_course_id ON payments(course_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_method ON payments(method);
CREATE INDEX idx_payments_paid_at ON payments(paid_at);
CREATE INDEX idx_payments_reference_number ON payments(reference_number);

-- =================================================================
-- NOTIFICATIONS & MESSAGING
-- =================================================================

CREATE TABLE notification_configs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  center_id TEXT NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
  channel notification_channel NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  credentials JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(center_id, channel)
);

CREATE TABLE notification_templates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  event_type TEXT NOT NULL,
  channel notification_channel NOT NULL,
  locale TEXT NOT NULL DEFAULT 'ar',
  subject TEXT,
  body_template TEXT NOT NULL,
  is_system BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_type, channel, locale)
);

CREATE TABLE notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  center_id TEXT,
  channel notification_channel NOT NULL,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  status notification_status NOT NULL DEFAULT 'PENDING',
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  fail_reason TEXT,
  external_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_center_id ON notifications(center_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_event_type ON notifications(event_type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE TABLE message_threads (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  center_id TEXT NOT NULL,
  course_id TEXT,
  type message_thread_type NOT NULL,
  subject TEXT,
  created_by_id TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_message_threads_center_id ON message_threads(center_id);
CREATE INDEX idx_message_threads_course_id ON message_threads(course_id);
CREATE INDEX idx_message_threads_type ON message_threads(type);

CREATE TABLE messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  thread_id TEXT NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  attachments JSONB,
  is_edited BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_thread_id ON messages(thread_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

CREATE TABLE message_recipients (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  thread_id TEXT NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(thread_id, user_id)
);

CREATE INDEX idx_message_recipients_user_id ON message_recipients(user_id);

-- =================================================================
-- CENTER WEBSITE
-- =================================================================

CREATE TABLE center_websites (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  center_id TEXT UNIQUE NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
  is_published BOOLEAN NOT NULL DEFAULT false,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_image_url TEXT,
  about_text TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_address TEXT,
  google_maps_embed TEXT,
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  youtube_url TEXT,
  theme_overrides JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE website_pages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  website_id TEXT NOT NULL REFERENCES center_websites(id) ON DELETE CASCADE,
  type website_page_type NOT NULL,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  slug TEXT NOT NULL,
  content TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(website_id, slug)
);

CREATE INDEX idx_website_pages_website_id ON website_pages(website_id);

CREATE TABLE custom_domains (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  center_id TEXT UNIQUE NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
  domain TEXT UNIQUE NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verification_token TEXT,
  ssl_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_custom_domains_domain ON custom_domains(domain);

-- =================================================================
-- SCHEDULE & LIVE SESSIONS
-- =================================================================

CREATE TABLE schedule_slots (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  center_id TEXT NOT NULL,
  course_id TEXT REFERENCES courses(id) ON DELETE SET NULL,
  branch_id TEXT REFERENCES branches(id) ON DELETE SET NULL,
  instructor_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurrence_rule JSONB,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_schedule_slots_center_id ON schedule_slots(center_id);
CREATE INDEX idx_schedule_slots_course_id ON schedule_slots(course_id);
CREATE INDEX idx_schedule_slots_start_end ON schedule_slots(start_at, end_at);

CREATE TABLE live_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  course_id TEXT NOT NULL,
  created_by_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status live_session_status NOT NULL DEFAULT 'SCHEDULED',
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration INT,
  meeting_url TEXT,
  meeting_id TEXT,
  meeting_password TEXT,
  recording_url TEXT,
  recording_s3_key TEXT,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_live_sessions_course_id ON live_sessions(course_id);
CREATE INDEX idx_live_sessions_scheduled_at ON live_sessions(scheduled_at);
CREATE INDEX idx_live_sessions_status ON live_sessions(status);

-- =================================================================
-- GAMIFICATION & CERTIFICATES
-- =================================================================

CREATE TABLE certificates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  center_id TEXT NOT NULL,
  certificate_number TEXT UNIQUE NOT NULL,
  verification_code TEXT UNIQUE NOT NULL,
  status certificate_status NOT NULL DEFAULT 'GENERATED',
  pdf_url TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_certificates_center_id ON certificates(center_id);
CREATE INDEX idx_certificates_verification_code ON certificates(verification_code);

CREATE TABLE badges (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  icon_url TEXT NOT NULL,
  criteria TEXT NOT NULL,
  points_value INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_badges (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  center_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id, center_id)
);

CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);

CREATE TABLE point_transactions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  center_id TEXT NOT NULL,
  points INT NOT NULL,
  reason TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_point_transactions_user_center ON point_transactions(user_id, center_id);
CREATE INDEX idx_point_transactions_created_at ON point_transactions(created_at);

CREATE TABLE leaderboards (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  center_id TEXT NOT NULL,
  course_id TEXT,
  user_id TEXT NOT NULL,
  total_points INT NOT NULL DEFAULT 0,
  rank INT,
  period TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(center_id, course_id, user_id, period)
);

CREATE INDEX idx_leaderboards_ranking ON leaderboards(center_id, period, total_points DESC);

-- =================================================================
-- REVIEWS & DISCUSSIONS
-- =================================================================

CREATE TABLE course_reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(course_id, user_id)
);

CREATE INDEX idx_course_reviews_course_id ON course_reviews(course_id);
CREATE INDEX idx_course_reviews_rating ON course_reviews(rating);

CREATE TABLE discussion_threads (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  reply_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_discussion_threads_course_id ON discussion_threads(course_id);
CREATE INDEX idx_discussion_threads_created_at ON discussion_threads(created_at);

CREATE TABLE discussion_replies (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  thread_id TEXT NOT NULL REFERENCES discussion_threads(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL,
  body TEXT NOT NULL,
  parent_id TEXT REFERENCES discussion_replies(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_discussion_replies_thread_id ON discussion_replies(thread_id);
CREATE INDEX idx_discussion_replies_parent_id ON discussion_replies(parent_id);

-- =================================================================
-- REPORTS & AUDIT
-- =================================================================

CREATE TABLE report_snapshots (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  center_id TEXT NOT NULL,
  report_type TEXT NOT NULL,
  period TEXT NOT NULL,
  data JSONB NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(center_id, report_type, period)
);

CREATE INDEX idx_report_snapshots_center_type ON report_snapshots(center_id, report_type);

CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  center_id TEXT,
  user_id TEXT,
  action audit_action NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_center_id ON audit_logs(center_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- =================================================================
-- AUTO-UPDATE TIMESTAMPS TRIGGER
-- =================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.columns
    WHERE column_name = 'updated_at'
    AND table_schema = 'public'
    AND table_name != 'notifications'
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
      t, t
    );
  END LOOP;
END;
$$;

-- =================================================================
-- ROW LEVEL SECURITY (RLS)
-- =================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE center_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS
-- Users can read their own data
CREATE POLICY users_own_data ON users FOR SELECT
  USING (auth.uid()::text = auth_id::text);

CREATE POLICY users_update_own ON users FOR UPDATE
  USING (auth.uid()::text = auth_id::text);

-- Center members can read center data
CREATE POLICY center_member_read ON centers FOR SELECT
  USING (
    id IN (
      SELECT center_id FROM center_memberships
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
      AND is_active = true
    )
    OR deleted_at IS NULL
  );

-- Notifications: users see their own
CREATE POLICY notifications_own ON notifications FOR SELECT
  USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Payments: users see their own payments
CREATE POLICY payments_own ON payments FOR SELECT
  USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Enrollments: users see their own
CREATE POLICY enrollments_own ON enrollments FOR SELECT
  USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );
