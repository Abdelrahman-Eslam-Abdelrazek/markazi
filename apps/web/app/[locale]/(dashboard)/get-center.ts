import { createSupabaseServerClient } from "@markazi/db";

export async function requireCenter() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("center_memberships")
    .select("center_id, role, centers(id, name_ar, primary_color)")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!membership) return null;

  return {
    supabase,
    user,
    centerId: membership.center_id as string,
    role: membership.role as string,
    centerName: (membership as any).centers?.name_ar as string,
    color: (membership as any).centers?.primary_color as string || "#2563EB",
  };
}
