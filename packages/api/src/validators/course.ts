import { z } from "zod";

export const createCourseSchema = z.object({
  nameAr: z.string().min(2, "اسم الكورس يجب أن يكون حرفين على الأقل").max(300),
  nameEn: z.string().max(300).optional(),
  description: z.string().max(5000).optional(),
  price: z.coerce.number().min(0).default(0),
  isFree: z.boolean().default(false),
  level: z.enum(["PRIMARY", "PREPARATORY", "SECONDARY", "UNIVERSITY", "POSTGRADUATE", "PROFESSIONAL"]).optional(),
  subject: z.string().max(100).optional(),
  maxStudents: z.coerce.number().int().min(1).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  dripMode: z.enum(["NONE", "SEQUENTIAL", "DATE_BASED"]).default("NONE"),
  autoCertificate: z.boolean().default(false),
});

export const updateCourseSchema = createCourseSchema.partial();

export const createUnitSchema = z.object({
  nameAr: z.string().min(1).max(300),
  nameEn: z.string().max(300).optional(),
  description: z.string().max(2000).optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  dripDate: z.coerce.date().optional(),
});

export const createLessonSchema = z.object({
  nameAr: z.string().min(1).max(300),
  nameEn: z.string().max(300).optional(),
  contentType: z.enum([
    "VIDEO_UPLOAD", "VIDEO_EXTERNAL", "PDF", "DOCUMENT",
    "RICH_TEXT", "IMAGE", "AUDIO", "EXTERNAL_LINK",
    "LIVE_SESSION", "ASSIGNMENT", "QUIZ",
  ]),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isFreePreview: z.boolean().default(false),
  isPaidOnly: z.boolean().default(true),
  duration: z.coerce.number().int().min(0).optional(),
  openAt: z.coerce.date().optional(),
  closeAt: z.coerce.date().optional(),
});

export type CreateCourse = z.infer<typeof createCourseSchema>;
export type UpdateCourse = z.infer<typeof updateCourseSchema>;
export type CreateUnit = z.infer<typeof createUnitSchema>;
export type CreateLesson = z.infer<typeof createLessonSchema>;
