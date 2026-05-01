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

export async function updateStudent(membershipId: string, formData: FormData) {
  const ctx = await getContext();
  if (!ctx) return { error: "يجب تسجيل الدخول أولاً" };

  const { data: membership } = await ctx.admin
    .from("center_memberships")
    .select("user_id")
    .eq("id", membershipId)
    .eq("center_id", ctx.centerId)
    .single();

  if (!membership) return { error: "الطالب غير موجود" };

  const nameAr = formData.get("name_ar") as string;
  if (!nameAr?.trim()) return { error: "اسم الطالب مطلوب" };

  const { error } = await ctx.admin
    .from("users")
    .update({
      name_ar: nameAr.trim(),
      name_en: (formData.get("name_en") as string)?.trim() || null,
      phone: (formData.get("phone") as string)?.trim() || null,
      email: (formData.get("email") as string)?.trim() || null,
      gender: (formData.get("gender") as string) || null,
      education_level: (formData.get("level") as string) || null,
    })
    .eq("id", membership.user_id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function toggleStudentStatus(membershipId: string) {
  const ctx = await getContext();
  if (!ctx) return { error: "يجب تسجيل الدخول أولاً" };

  const { data: membership } = await ctx.admin
    .from("center_memberships")
    .select("id, is_active")
    .eq("id", membershipId)
    .eq("center_id", ctx.centerId)
    .single();

  if (!membership) return { error: "الطالب غير موجود" };

  const { error } = await ctx.admin
    .from("center_memberships")
    .update({ is_active: !membership.is_active })
    .eq("id", membershipId);

  if (error) return { error: error.message };
  return { success: true, isActive: !membership.is_active };
}

export async function removeStudent(membershipId: string) {
  const ctx = await getContext();
  if (!ctx) return { error: "يجب تسجيل الدخول أولاً" };

  const { data: membership } = await ctx.admin
    .from("center_memberships")
    .select("id")
    .eq("id", membershipId)
    .eq("center_id", ctx.centerId)
    .single();

  if (!membership) return { error: "الطالب غير موجود" };

  const { error } = await ctx.admin
    .from("center_memberships")
    .delete()
    .eq("id", membershipId);

  if (error) return { error: error.message };
  return { success: true };
}
