"use server";

import { createSupabaseServerClient } from "@markazi/db";
import { createClient } from "@supabase/supabase-js";

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

export async function addStudent(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "يجب تسجيل الدخول أولاً" };

  const { data: membership } = await supabase
    .from("center_memberships")
    .select("center_id, role")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!membership) return { error: "لا يوجد مركز مرتبط بحسابك" };

  const nameAr = formData.get("name_ar") as string;
  const phone = formData.get("phone") as string;
  if (!nameAr?.trim()) return { error: "اسم الطالب مطلوب" };
  if (!phone?.trim()) return { error: "رقم الهاتف مطلوب" };

  const admin = createAdminClient();

  const { data: existingUser } = await admin
    .from("users")
    .select("id")
    .eq("phone", phone.trim())
    .limit(1)
    .single();

  let studentUserId: string;

  if (existingUser) {
    studentUserId = existingUser.id;

    const { data: existingMembership } = await admin
      .from("center_memberships")
      .select("id")
      .eq("user_id", studentUserId)
      .eq("center_id", membership.center_id)
      .limit(1)
      .single();

    if (existingMembership) {
      return { error: "هذا الطالب مسجل بالفعل في المركز" };
    }
  } else {
    const email = (formData.get("email") as string)?.trim() || null;

    const { data: newUser, error: userError } = await admin
      .from("users")
      .insert({
        name_ar: nameAr.trim(),
        name_en: (formData.get("name_en") as string)?.trim() || null,
        phone: phone.trim(),
        email,
        gender: (formData.get("gender") as string) || null,
        education_level: (formData.get("level") as string) || null,
        is_active: true,
      })
      .select("id")
      .single();

    if (userError) return { error: userError.message };
    studentUserId = newUser.id;
  }

  const { error: memberError } = await admin
    .from("center_memberships")
    .insert({
      user_id: studentUserId,
      center_id: membership.center_id,
      role: "STUDENT",
      is_active: true,
    });

  if (memberError) return { error: memberError.message };

  return { success: true };
}
