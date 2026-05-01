import { requireCenter } from "../../../get-center";
import { notFound } from "next/navigation";
import { EditStudentForm } from "./edit-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditStudentPage({ params }: Props) {
  const { id: membershipId } = await params;
  const ctx = await requireCenter();
  if (!ctx) return null;

  const { data: membership } = await ctx.supabase
    .from("center_memberships")
    .select("id, user_id, is_active, users(id, name_ar, name_en, phone, email, gender, education_level)")
    .eq("id", membershipId)
    .eq("center_id", ctx.centerId)
    .single();

  if (!membership) notFound();
  const student = (membership as any).users;
  if (!student) notFound();

  return (
    <EditStudentForm
      membershipId={membership.id as string}
      student={student}
    />
  );
}
