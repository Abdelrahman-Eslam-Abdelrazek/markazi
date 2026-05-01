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

  const rawCenters = (membership as any).centers;
  const center = Array.isArray(rawCenters) ? rawCenters[0] : rawCenters;

  return {
    supabase: admin,
    user,
    centerId: membership.center_id as string,
    role: membership.role as string,
    centerName: center?.name_ar as string,
    color: (center?.primary_color as string) || "#2563EB",
  };
}
