import { z } from "zod";

export const recordPaymentSchema = z.object({
  userId: z.string().cuid(),
  courseId: z.string().cuid().optional(),
  amount: z.coerce.number().positive("المبلغ يجب أن يكون أكبر من صفر"),
  method: z.enum([
    "FAWRY", "VODAFONE_CASH", "INSTAPAY", "ORANGE_CASH",
    "ETISALAT_CASH", "VISA", "MASTERCARD", "VALU",
    "BANK_TRANSFER", "CASH",
  ]),
  type: z.enum(["FULL", "INSTALLMENT", "SUBSCRIPTION", "PER_LECTURE", "ENROLLMENT_FEE"]),
  isManual: z.boolean().default(false),
  manualNotes: z.string().max(500).optional(),
});

export const createInstallmentPlanSchema = z.object({
  userId: z.string().cuid(),
  courseId: z.string().cuid(),
  totalAmount: z.coerce.number().positive(),
  numberOfInstallments: z.coerce.number().int().min(2).max(12),
  startDate: z.coerce.date(),
});

export type RecordPayment = z.infer<typeof recordPaymentSchema>;
export type CreateInstallmentPlan = z.infer<typeof createInstallmentPlanSchema>;
