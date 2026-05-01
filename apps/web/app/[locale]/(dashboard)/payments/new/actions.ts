"use server";

import { createSupabaseServerClient, createSupabaseAdminClient } from "@markazi/db";

export async function getStudentsAndCourses() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { students: [], courses: [] };

  const admin = await createSupabaseAdminClient();
  const { data: publicUser } = await admin.from("users").select("id").eq("auth_id", user.id).single();
  if (!publicUser) return { students: [], courses: [] };

  const { data: membership } = await admin
    .from("center_memberships")
    .select("center_id")
    .eq("user_id", publicUser.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!membership) return { students: [], courses: [] };

  const [studentRes, courseRes] = await Promise.all([
    admin
      .from("center_memberships")
      .select("user_id, users(name_ar, name_en)")
      .eq("center_id", membership.center_id)
      .eq("role", "STUDENT")
      .eq("is_active", true),
    admin
      .from("courses")
      .select("id, name_ar, price")
      .eq("center_id", membership.center_id)
      .is("deleted_at", null),
  ]);

  const students = (studentRes.data || []).map((s: any) => {
    const u = Array.isArray(s.users) ? s.users[0] : s.users;
    return {
      id: s.user_id as string,
      name: (u?.name_ar || u?.name_en || "—") as string,
    };
  });

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

  const admin = await createSupabaseAdminClient();
  const { data: publicUser } = await admin.from("users").select("id").eq("auth_id", user.id).single();
  if (!publicUser) return { error: "يجب إنشاء حساب أولاً" };

  const { data: membership } = await admin
    .from("center_memberships")
    .select("center_id")
    .eq("user_id", publicUser.id)
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

  const { error: insertError } = await admin
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
      recorded_by_id: publicUser.id,
      manual_notes: notes,
      paid_at: new Date().toISOString(),
    });

  if (insertError) return { error: insertError.message };

  const { data: existingEnrollment } = await admin
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .eq("center_id", membership.center_id)
    .maybeSingle();

  if (!existingEnrollment) {
    await admin.from("enrollments").insert({
      user_id: userId,
      course_id: courseId,
      center_id: membership.center_id,
      status: "ACTIVE",
      enrolled_at: new Date().toISOString(),
    });
  }

  return { success: true };
}
