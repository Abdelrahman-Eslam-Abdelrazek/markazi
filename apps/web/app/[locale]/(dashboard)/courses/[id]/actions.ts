"use server";

import { createSupabaseServerClient, createSupabaseAdminClient } from "@markazi/db";

async function getContext() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = await createSupabaseAdminClient();
  const { data: publicUser } = await admin.from("users").select("id").eq("auth_id", user.id).single();
  if (!publicUser) return null;

  const { data: membership } = await admin
    .from("center_memberships")
    .select("center_id")
    .eq("user_id", publicUser.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!membership) return null;
  return { admin, userId: publicUser.id, centerId: membership.center_id as string };
}

export async function enrollStudent(formData: FormData) {
  const ctx = await getContext();
  if (!ctx) return { error: "يجب تسجيل الدخول أولاً" };

  const courseId = formData.get("course_id") as string;
  const phone = (formData.get("phone") as string)?.trim();
  if (!courseId || !phone) return { error: "البيانات المطلوبة غير مكتملة" };

  const { data: student } = await ctx.admin
    .from("users")
    .select("id")
    .eq("phone", phone)
    .limit(1)
    .single();

  if (!student) return { error: "لا يوجد طالب بهذا الرقم. أضفه من صفحة الطلاب أولاً." };

  const { data: existing } = await ctx.admin
    .from("enrollments")
    .select("id")
    .eq("user_id", student.id)
    .eq("course_id", courseId)
    .limit(1)
    .single();

  if (existing) return { error: "هذا الطالب مسجل في الكورس بالفعل" };

  const { error } = await ctx.admin
    .from("enrollments")
    .insert({
      user_id: student.id,
      course_id: courseId,
      center_id: ctx.centerId,
      status: "ACTIVE",
      enrolled_at: new Date().toISOString(),
      completion_percent: 0,
    });

  if (error) return { error: error.message };
  return { success: true };
}

export async function addUnit(formData: FormData) {
  const ctx = await getContext();
  if (!ctx) return { error: "يجب تسجيل الدخول أولاً" };

  const courseId = formData.get("course_id") as string;
  const nameAr = (formData.get("name_ar") as string)?.trim();
  if (!courseId || !nameAr) return { error: "اسم الوحدة مطلوب" };

  const { data: course } = await ctx.admin
    .from("courses")
    .select("id")
    .eq("id", courseId)
    .eq("center_id", ctx.centerId)
    .single();

  if (!course) return { error: "الكورس غير موجود" };

  const { count } = await ctx.admin
    .from("units")
    .select("id", { count: "exact", head: true })
    .eq("course_id", courseId);

  const { error } = await ctx.admin
    .from("units")
    .insert({
      course_id: courseId,
      name_ar: nameAr,
      sort_order: (count || 0) + 1,
      is_published: false,
    });

  if (error) return { error: error.message };
  return { success: true };
}
