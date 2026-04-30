export enum ErrorCode {
  // Auth
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  INVALID_OTP = "INVALID_OTP",
  OTP_EXPIRED = "OTP_EXPIRED",
  ACCOUNT_DISABLED = "ACCOUNT_DISABLED",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",

  // Center
  CENTER_NOT_FOUND = "CENTER_NOT_FOUND",
  SLUG_TAKEN = "SLUG_TAKEN",
  MAX_STUDENTS_REACHED = "MAX_STUDENTS_REACHED",
  MAX_COURSES_REACHED = "MAX_COURSES_REACHED",
  SUBSCRIPTION_EXPIRED = "SUBSCRIPTION_EXPIRED",

  // Course
  COURSE_NOT_FOUND = "COURSE_NOT_FOUND",
  COURSE_FULL = "COURSE_FULL",
  COURSE_NOT_PUBLISHED = "COURSE_NOT_PUBLISHED",
  ALREADY_ENROLLED = "ALREADY_ENROLLED",

  // Payment
  PAYMENT_FAILED = "PAYMENT_FAILED",
  PAYMENT_NOT_FOUND = "PAYMENT_NOT_FOUND",
  INVALID_AMOUNT = "INVALID_AMOUNT",
  PAYMENT_ALREADY_PROCESSED = "PAYMENT_ALREADY_PROCESSED",
  WEBHOOK_VERIFICATION_FAILED = "WEBHOOK_VERIFICATION_FAILED",

  // Exam
  EXAM_NOT_FOUND = "EXAM_NOT_FOUND",
  EXAM_NOT_ACTIVE = "EXAM_NOT_ACTIVE",
  MAX_ATTEMPTS_REACHED = "MAX_ATTEMPTS_REACHED",
  EXAM_TIME_EXPIRED = "EXAM_TIME_EXPIRED",

  // General
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  RATE_LIMITED = "RATE_LIMITED",
}

export const ERROR_MESSAGES_AR: Record<ErrorCode, string> = {
  [ErrorCode.INVALID_CREDENTIALS]: "بيانات الدخول غير صحيحة",
  [ErrorCode.INVALID_OTP]: "كود التحقق غير صحيح",
  [ErrorCode.OTP_EXPIRED]: "كود التحقق منتهي الصلاحية",
  [ErrorCode.ACCOUNT_DISABLED]: "الحساب معطّل",
  [ErrorCode.UNAUTHORIZED]: "يجب تسجيل الدخول أولاً",
  [ErrorCode.FORBIDDEN]: "ليس لديك صلاحية لهذا الإجراء",
  [ErrorCode.CENTER_NOT_FOUND]: "المركز غير موجود",
  [ErrorCode.SLUG_TAKEN]: "هذا الرابط مستخدم بالفعل",
  [ErrorCode.MAX_STUDENTS_REACHED]: "تم الوصول للحد الأقصى من الطلاب",
  [ErrorCode.MAX_COURSES_REACHED]: "تم الوصول للحد الأقصى من الكورسات",
  [ErrorCode.SUBSCRIPTION_EXPIRED]: "الاشتراك منتهي الصلاحية",
  [ErrorCode.COURSE_NOT_FOUND]: "الكورس غير موجود",
  [ErrorCode.COURSE_FULL]: "الكورس ممتلئ",
  [ErrorCode.COURSE_NOT_PUBLISHED]: "الكورس غير منشور",
  [ErrorCode.ALREADY_ENROLLED]: "أنت مسجّل بالفعل في هذا الكورس",
  [ErrorCode.PAYMENT_FAILED]: "فشلت عملية الدفع",
  [ErrorCode.PAYMENT_NOT_FOUND]: "عملية الدفع غير موجودة",
  [ErrorCode.INVALID_AMOUNT]: "المبلغ غير صحيح",
  [ErrorCode.PAYMENT_ALREADY_PROCESSED]: "تمت معالجة عملية الدفع بالفعل",
  [ErrorCode.WEBHOOK_VERIFICATION_FAILED]: "فشل التحقق من الإشعار",
  [ErrorCode.EXAM_NOT_FOUND]: "الامتحان غير موجود",
  [ErrorCode.EXAM_NOT_ACTIVE]: "الامتحان غير متاح حالياً",
  [ErrorCode.MAX_ATTEMPTS_REACHED]: "تم الوصول للحد الأقصى من المحاولات",
  [ErrorCode.EXAM_TIME_EXPIRED]: "انتهى وقت الامتحان",
  [ErrorCode.NOT_FOUND]: "العنصر غير موجود",
  [ErrorCode.VALIDATION_ERROR]: "البيانات المدخلة غير صحيحة",
  [ErrorCode.INTERNAL_ERROR]: "حدث خطأ داخلي",
  [ErrorCode.RATE_LIMITED]: "عدد الطلبات كثير جداً، حاول بعد قليل",
};
