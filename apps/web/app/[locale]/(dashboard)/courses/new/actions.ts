"use server";

import { createSupabaseServerClient, createSupabaseAdminClient } from "@markazi/db";

export async function createCourse(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "يجب تسجيل الدخول أولاً" };

  const admin = await createSupabaseAdminClient();
  const { data: publicUser } = await admin.from("users").select("id").eq("auth_id", user.id).single();
  if (!publicUser) return { error: "يجب إنشاء حساب أولاً" };

  const { data: membership } = await admin
    .from("center_memberships")
    .select("center_id, role")
    .eq("user_id", publicUser.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!membership) return { error: "لا يوجد مركز مرتبط بحسابك" };

  const nameAr = formData.get("name_ar") as string;
  if (!nameAr?.trim()) return { error: "اسم الكورس مطلوب" };

  const slug = nameAr
    .toLowerCase()
    .replace(/[^ء-يa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 60) || "course";

  const price = parseFloat(formData.get("price") as string) || 0;
  const maxStudents = parseInt(formData.get("max_students") as string) || null;

  const { data: branch } = await admin
    .from("branches")
    .select("id")
    .eq("center_id", membership.center_id)
    .eq("is_main", true)
    .limit(1)
    .single();

  const { error: insertError } = await admin
    .from("courses")
    .insert({
      center_id: membership.center_id,
      branch_id: branch?.id || null,
      created_by_id: user.id,
      name_ar: nameAr.trim(),
      name_en: (formData.get("name_en") as string)?.trim() || null,
      slug,
      description: (formData.get("description") as string)?.trim() || null,
      price,
      currency: "EGP",
      is_free: price === 0,
      status: "DRAFT",
      level: (formData.get("level") as string) || null,
      subject: (formData.get("subject") as string)?.trim() || null,
      max_students: maxStudents,
      start_date: (formData.get("start_date") as string) || null,
      end_date: (formData.get("end_date") as string) || null,
    });

  if (insertError) return { error: insertError.message };

  return { success: true };
}
