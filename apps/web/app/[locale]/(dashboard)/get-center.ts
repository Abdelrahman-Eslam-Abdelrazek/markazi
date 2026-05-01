import { createSupabaseServerClient, createSupabaseAdminClient } from "@markazi/db";

export async function requireCenter() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Use admin client to bypass RLS on center_memberships (no SELECT policy exists)
  const admin = await createSupabaseAdminClient();

  const { data: publicUser } = await admin
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!publicUser) return null;

  const { data: membership } = await admin
    .from("center_memberships")
    .select("center_id, role, centers(id, name_ar, primary_color)")
    .eq("user_id", publicUser.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!membership) return null;

  return {
    supabase: admin,
    user,
    centerId: membership.center_id as string,
    role: membership.role as string,
    centerName: (membership as any).centers?.name_ar as string,
    color: (membership as any).centers?.primary_color as string || "#2563EB",
  };
}
