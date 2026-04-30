import { z } from "zod";

export const createCenterSchema = z.object({
  nameAr: z.string().min(2, "اسم المركز يجب أن يكون حرفين على الأقل").max(200),
  nameEn: z.string().max(200).optional(),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط"),
  description: z.string().max(2000).optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#1E40AF"),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#F59E0B"),
  specializations: z.array(z.string()).default([]),
});

export const updateCenterSchema = createCenterSchema.partial();

export const createBranchSchema = z.object({
  nameAr: z.string().min(2).max(200),
  nameEn: z.string().max(200).optional(),
  address: z.string().max(500).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  phone: z.string().optional(),
  isMain: z.boolean().default(false),
  workingHours: z
    .record(
      z.enum(["sun", "mon", "tue", "wed", "thu", "fri", "sat"]),
      z.object({
        open: z.string().regex(/^\d{2}:\d{2}$/),
        close: z.string().regex(/^\d{2}:\d{2}$/),
      }),
    )
    .optional(),
});

export type CreateCenter = z.infer<typeof createCenterSchema>;
export type UpdateCenter = z.infer<typeof updateCenterSchema>;
export type CreateBranch = z.infer<typeof createBranchSchema>;
