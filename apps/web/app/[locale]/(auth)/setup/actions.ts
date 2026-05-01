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

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^ء-يa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 40) || "center";
}

export type SetupData = {
  nameAr: string;
  nameEn: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  primaryColor: string;
  secondaryColor: string;
};

export async function createCenter(data: SetupData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "يجب تسجيل الدخول أولاً" };
  }

  const admin = createAdminClient();
  const baseSlug = generateSlug(data.nameEn || data.nameAr);

  let slug = baseSlug;
  let attempt = 0;
  while (attempt < 5) {
    const { data: existing } = await admin.from("centers").select("id").eq("slug", slug).single();
    if (!existing) break;
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }

  const { data: center, error: centerError } = await admin
    .from("centers")
    .insert({
      name_ar: data.nameAr,
      name_en: data.nameEn || null,
      slug,
      description: data.description || null,
      phone: data.phone || null,
      whatsapp: data.whatsapp || null,
      email: data.email || null,
      primary_color: data.primaryColor || "#2563EB",
      secondary_color: data.secondaryColor || "#F59E0B",
      status: "ACTIVE",
      timezone: "Africa/Cairo",
      currency: "EGP",
      subscription_plan: "STARTER",
      subscription_status: "TRIALING",
      trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      max_students: 50,
      max_courses: 10,
    })
    .select("id")
    .single();

  if (centerError) {
    return { error: centerError.message };
  }

  const { error: branchError } = await admin.from("branches").insert({
    center_id: center.id,
    name_ar: "الفرع الرئيسي",
    name_en: "Main Branch",
    is_main: true,
    is_active: true,
  });

  if (branchError) {
    await admin.from("centers").delete().eq("id", center.id);
    return { error: branchError.message };
  }

  // Get or create the public.users row linked to this auth user
  // (center_memberships.user_id references public.users.id, not auth.users.id)
  const { data: existingPublicUser } = await admin
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  let publicUserId: string;

  if (existingPublicUser) {
    publicUserId = existingPublicUser.id;
  } else {
    const { data: newPublicUser, error: userCreateError } = await admin
      .from("users")
      .insert({
        auth_id: user.id,
        email: user.email,
        name_ar: user.user_metadata?.full_name || user.email?.split("@")[0] || "مستخدم",
      })
      .select("id")
      .single();

    if (userCreateError) {
      await admin.from("branches").delete().eq("center_id", center.id);
      await admin.from("centers").delete().eq("id", center.id);
      return { error: userCreateError.message };
    }
    publicUserId = newPublicUser.id;
  }

  const { error: memberError } = await admin.from("center_memberships").insert({
    user_id: publicUserId,
    center_id: center.id,
    role: "CENTER_OWNER",
    is_active: true,
  });

  if (memberError) {
    await admin.from("branches").delete().eq("center_id", center.id);
    await admin.from("centers").delete().eq("id", center.id);
    return { error: memberError.message };
  }

  return { success: true, centerId: center.id, slug };
}
