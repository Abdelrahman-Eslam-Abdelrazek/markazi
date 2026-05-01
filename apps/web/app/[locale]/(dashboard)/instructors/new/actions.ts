"use server";

import { createSupabaseServerClient, createSupabaseAdminClient } from "@markazi/db";

export async function addInstructor(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "يجب تسجيل الدخول أولاً" };

  const admin = await createSupabaseAdminClient();

  const { data: publicUser } = await admin
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .single();
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
  const phone = formData.get("phone") as string;
  if (!nameAr?.trim()) return { error: "اسم المدرس مطلوب" };
  if (!phone?.trim()) return { error: "رقم الهاتف مطلوب" };

  const { data: existingUser } = await admin
    .from("users")
    .select("id")
    .eq("phone", phone.trim())
    .limit(1)
    .single();

  let instructorUserId: string;

  if (existingUser) {
    instructorUserId = existingUser.id;

    const { data: existingMembership } = await admin
      .from("center_memberships")
      .select("id")
      .eq("user_id", instructorUserId)
      .eq("center_id", membership.center_id)
      .limit(1)
      .single();

    if (existingMembership) {
      return { error: "هذا الشخص مسجل بالفعل في المركز" };
    }
  } else {
    const { data: newUser, error: userError } = await admin
      .from("users")
      .insert({
        name_ar: nameAr.trim(),
        name_en: (formData.get("name_en") as string)?.trim() || null,
        phone: phone.trim(),
        email: (formData.get("email") as string)?.trim() || null,
        gender: (formData.get("gender") as string) || null,
        is_active: true,
      })
      .select("id")
      .single();

    if (userError) return { error: userError.message };
    instructorUserId = newUser.id;
  }

  const { error: memberError } = await admin
    .from("center_memberships")
    .insert({
      user_id: instructorUserId,
      center_id: membership.center_id,
      role: "INSTRUCTOR",
      is_active: true,
    });

  if (memberError) return { error: memberError.message };

  return { success: true };
}
