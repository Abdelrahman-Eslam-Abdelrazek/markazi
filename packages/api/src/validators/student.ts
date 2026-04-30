import { z } from "zod";
import { egyptianPhoneRegex } from "./auth";

export const createStudentSchema = z.object({
  nameAr: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(200),
  nameEn: z.string().max(200).optional(),
  phone: z.string().regex(egyptianPhoneRegex, "رقم الهاتف غير صحيح"),
  whatsapp: z.string().optional(),
  email: z.string().email().optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  educationLevel: z
    .enum(["PRIMARY", "PREPARATORY", "SECONDARY", "UNIVERSITY", "POSTGRADUATE", "PROFESSIONAL"])
    .optional(),
  parentName: z.string().max(200).optional(),
  parentPhone: z.string().regex(egyptianPhoneRegex).optional(),
});

export const updateStudentSchema = createStudentSchema.partial();

export const importStudentsSchema = z.object({
  courseId: z.string().cuid().optional(),
  students: z.array(
    z.object({
      nameAr: z.string().min(2),
      phone: z.string().regex(egyptianPhoneRegex),
      email: z.string().email().optional(),
      parentPhone: z.string().optional(),
    }),
  ),
});

export type CreateStudent = z.infer<typeof createStudentSchema>;
export type UpdateStudent = z.infer<typeof updateStudentSchema>;
export type ImportStudents = z.infer<typeof importStudentsSchema>;
