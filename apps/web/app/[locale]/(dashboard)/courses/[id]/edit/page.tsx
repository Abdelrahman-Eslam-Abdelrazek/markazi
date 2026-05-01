import { requireCenter } from "../../../get-center";
import { notFound } from "next/navigation";
import { EditCourseForm } from "./edit-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditCoursePage({ params }: Props) {
  const { id } = await params;
  const ctx = await requireCenter();
  if (!ctx) return null;

  const { data: course } = await ctx.supabase
    .from("courses")
    .select("id, name_ar, name_en, description, price, is_free, level, subject, max_students, start_date, end_date")
    .eq("id", id)
    .eq("center_id", ctx.centerId)
    .is("deleted_at", null)
    .single();

  if (!course) notFound();

  return <EditCourseForm course={course} />;
}
