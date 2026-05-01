"use server";

import { createSupabaseServerClient, createSupabaseAdminClient } from "@markazi/db";

export async function updateAttendanceRecord(recordId: string, newStatus: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "يجب تسجيل الدخول أولاً" };

  if (!["PRESENT", "ABSENT", "LATE"].includes(newStatus)) {
    return { error: "حالة غير صالحة" };
  }

  const admin = await createSupabaseAdminClient();

  const { error } = await admin
    .from("attendance_records")
    .update({ status: newStatus, recorded_at: new Date().toISOString() })
    .eq("id", recordId);

  if (error) return { error: error.message };
  return { success: true };
}
