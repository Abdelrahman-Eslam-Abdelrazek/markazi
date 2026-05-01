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
    .select("center_id, role")
    .eq("user_id", publicUser.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!membership) return null;
  return { admin, centerId: membership.center_id as string, role: membership.role as string };
}

export async function updateCenter(formData: FormData) {
  const ctx = await getContext();
  if (!ctx) return { error: "يجب تسجيل الدخول أولاً" };

  if (ctx.role !== "CENTER_OWNER") {
    return { error: "ليس لديك صلاحية لتعديل بيانات المركز" };
  }

  const nameAr = formData.get("name_ar") as string;
  if (!nameAr?.trim()) return { error: "اسم المركز مطلوب" };

  const { error } = await ctx.admin
    .from("centers")
    .update({
      name_ar: nameAr.trim(),
      name_en: (formData.get("name_en") as string)?.trim() || null,
      description: (formData.get("description") as string)?.trim() || null,
      phone: (formData.get("phone") as string)?.trim() || null,
      whatsapp: (formData.get("whatsapp") as string)?.trim() || null,
      email: (formData.get("email") as string)?.trim() || null,
      primary_color: (formData.get("primary_color") as string)?.trim() || "#2563EB",
    })
    .eq("id", ctx.centerId);

  if (error) return { error: error.message };
  return { success: true };
}
