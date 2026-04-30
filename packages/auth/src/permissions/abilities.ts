import { AbilityBuilder, PureAbility } from "@casl/ability";
import { UserRole } from "./roles";

type Actions = "create" | "read" | "update" | "delete" | "manage";
type Subjects =
  | "Center"
  | "Branch"
  | "Course"
  | "Lesson"
  | "Student"
  | "Instructor"
  | "Enrollment"
  | "Payment"
  | "Invoice"
  | "Exam"
  | "ExamAttempt"
  | "Assignment"
  | "Submission"
  | "Attendance"
  | "Notification"
  | "Message"
  | "Report"
  | "Certificate"
  | "Website"
  | "QuestionBank"
  | "all";

export type AppAbility = PureAbility<[Actions, Subjects]>;

export function defineAbilitiesFor(role: UserRole, context?: { centerId?: string; userId?: string }) {
  const { can, build } = new AbilityBuilder<AppAbility>(PureAbility);

  switch (role) {
    case UserRole.SUPER_ADMIN:
      can("manage", "all");
      break;

    case UserRole.CENTER_OWNER:
      can("manage", "Center");
      can("manage", "Branch");
      can("manage", "Course");
      can("manage", "Lesson");
      can("manage", "Student");
      can("manage", "Instructor");
      can("manage", "Enrollment");
      can("manage", "Payment");
      can("manage", "Invoice");
      can("manage", "Exam");
      can("manage", "Assignment");
      can("manage", "Attendance");
      can("manage", "Notification");
      can("manage", "Message");
      can("manage", "Report");
      can("manage", "Certificate");
      can("manage", "Website");
      can("manage", "QuestionBank");
      break;

    case UserRole.BRANCH_MANAGER:
      can("read", "Center");
      can("manage", "Branch");
      can("manage", "Course");
      can("manage", "Lesson");
      can("manage", "Student");
      can("manage", "Instructor");
      can("manage", "Enrollment");
      can("manage", "Payment");
      can("manage", "Invoice");
      can("manage", "Exam");
      can("manage", "Assignment");
      can("manage", "Attendance");
      can("manage", "Notification");
      can("manage", "Message");
      can("read", "Report");
      can("manage", "Certificate");
      can("manage", "QuestionBank");
      break;

    case UserRole.INSTRUCTOR:
      can("read", "Course");
      can("manage", "Lesson");
      can("read", "Student");
      can("read", "Enrollment");
      can("manage", "Exam");
      can("manage", "ExamAttempt");
      can("manage", "Assignment");
      can("read", "Submission");
      can("update", "Submission");
      can("manage", "Attendance");
      can("create", "Notification");
      can("manage", "Message");
      can("read", "Report");
      can("manage", "QuestionBank");
      break;

    case UserRole.STUDENT:
      can("read", "Course");
      can("read", "Lesson");
      can("read", "Enrollment");
      can("read", "Payment");
      can("create", "Payment");
      can("read", "Exam");
      can("create", "ExamAttempt");
      can("read", "Assignment");
      can("create", "Submission");
      can("read", "Submission");
      can("read", "Attendance");
      can("read", "Notification");
      can("read", "Message");
      can("create", "Message");
      can("read", "Certificate");
      break;

    case UserRole.PARENT:
      can("read", "Enrollment");
      can("read", "Attendance");
      can("read", "Payment");
      can("read", "ExamAttempt");
      can("read", "Submission");
      can("read", "Notification");
      can("read", "Message");
      can("create", "Message");
      break;

    case UserRole.ACCOUNTANT:
      can("read", "Payment");
      can("read", "Invoice");
      can("read", "Report");
      can("read", "Enrollment");
      break;
  }

  return build();
}
