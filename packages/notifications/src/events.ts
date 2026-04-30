export enum NotificationEventType {
  STUDENT_REGISTERED = "student_registered",
  INSTALLMENT_DUE_SOON = "installment_due_soon",
  PAYMENT_OVERDUE = "payment_overdue",
  STUDENT_ABSENT = "student_absent",
  EXAM_RESULT_AVAILABLE = "exam_result_available",
  NEW_LECTURE_AVAILABLE = "new_lecture_available",
  LIVE_SESSION_UPCOMING = "live_session_upcoming",
  COURSE_ENDING_SOON = "course_ending_soon",
  CERTIFICATE_ISSUED = "certificate_issued",
  ASSIGNMENT_POSTED = "assignment_posted",
  ASSIGNMENT_DUE_SOON = "assignment_due_soon",
  ASSIGNMENT_GRADED = "assignment_graded",
  STUDENT_NOT_SUBMITTED = "student_not_submitted",
  PAYMENT_RECEIVED = "payment_received",
}

export interface NotificationEvent {
  type: NotificationEventType;
  centerId: string;
  recipientIds: string[];
  data: Record<string, unknown>;
  channels?: ("whatsapp" | "sms" | "email" | "in_app")[];
}
