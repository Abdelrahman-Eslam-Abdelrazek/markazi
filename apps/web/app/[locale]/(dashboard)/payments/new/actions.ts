"use server";

import { createSupabaseServerClient } from "@markazi/db";

export async function getStudentsAndCourses() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { students: [], courses: [] };

  const { data: membership } = await supabase
    .from("center_memberships")
    .select("center_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!membership) return { students: [], courses: [] };

  const [studentRes, courseRes] = await Promise.all([
    supabase
      .from("center_memberships")
      .select("user_id, users(name_ar, name_en)")
      .eq("center_id", membership.center_id)
      .eq("role", "STUDENT")
      .eq("is_active", true),
    supabase
      .from("courses")
      .select("id, name_ar, price")
      .eq("center_id", membership.center_id)
      .is("deleted_at", null),
  ]);

  const students = (studentRes.data || []).map((s: any) => ({
    id: s.user_id as string,
    name: (s.users?.name_ar || s.users?.name_en || "—") as string,
  }));

  const courses = (courseRes.data || []).map((c: any) => ({
    id: c.id as string,
    name: c.name_ar as string,
    price: Number(c.price || 0),
  }));

  return { students, courses };
}

export async function recordPayment(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "يجب تسجيل الدخول أولاً" };

  const { data: membership } = await supabase
    .from("center_memberships")
    .select("center_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!membership) return { error: "لا يوجد مركز مرتبط بحسابك" };

  const userId = formData.get("user_id") as string;
  const courseId = formData.get("course_id") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const method = formData.get("method") as string;
  const notes = (formData.get("notes") as string)?.trim() || null;

  if (!userId || !courseId || !amount || !method) {
    return { error: "جميع الحقول المطلوبة يجب ملؤها" };
  }

  const { error: insertError } = await supabase
    .from("payments")
    .insert({
      center_id: membership.center_id,
      user_id: userId,
      course_id: courseId,
      amount,
      currency: "EGP",
      method,
      status: "COMPLETED",
      type: "TUITION",
      is_manual: true,
      recorded_by_id: user.id,
      manual_notes: notes,
      paid_at: new Date().toISOString(),
    });

  if (insertError) return { error: insertError.message };

  return { success: true };
}
