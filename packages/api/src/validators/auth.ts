import { z } from "zod";

export const egyptianPhoneRegex = /^(\+?20)?0?1[0125]\d{8}$/;

export const loginPhoneSchema = z.object({
  phone: z.string().regex(egyptianPhoneRegex, "رقم الهاتف غير صحيح"),
});

export const verifyOtpSchema = z.object({
  phone: z.string().regex(egyptianPhoneRegex),
  otp: z.string().length(6, "كود التحقق يجب أن يكون 6 أرقام"),
});

export const loginEmailSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
});

export const registerCenterOwnerSchema = z.object({
  phone: z.string().regex(egyptianPhoneRegex, "رقم الهاتف غير صحيح"),
  nameAr: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(100),
  nameEn: z.string().max(100).optional(),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional(),
  password: z.string().min(8).optional(),
});

export type LoginPhone = z.infer<typeof loginPhoneSchema>;
export type VerifyOtp = z.infer<typeof verifyOtpSchema>;
export type LoginEmail = z.infer<typeof loginEmailSchema>;
export type RegisterCenterOwner = z.infer<typeof registerCenterOwnerSchema>;
