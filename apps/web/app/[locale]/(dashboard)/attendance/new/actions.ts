"use server";

import { createSupabaseServerClient } from "@markazi/db";

export async function getCourseStudents(courseId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { courses: [], students: [] };

  const { data: membership } = await supabase
    .from("center_memberships")
    .select("center_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!membership) return { courses: [], students: [] };

  const { data: courses } = await supabase
    .from("courses")
    .select("id, name_ar")
    .eq("center_id", membership.center_id)
    .is("deleted_at", null);

  if (!courseId) {
    return {
      courses: (courses || []).map((c: any) => ({ id: c.id, name: c.name_ar })),
      students: [],
    };
  }

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("user_id, users(name_ar, name_en)")
    .eq("course_id", courseId)
    .eq("center_id", membership.center_id);

  const students = (enrollments || []).map((e: any) => ({
    userId: e.user_id as string,
    name: (e.users?.name_ar || e.users?.name_en || "—") as string,
  }));

  return {
    courses: (courses || []).map((c: any) => ({ id: c.id, name: c.name_ar })),
    students,
  };
}

export async function submitAttendance(data: {
  courseId: string;
  records: { userId: string; status: string }[];
}) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "يجب تسجيل الدخول أولاً" };

  const { data: membership } = await supabase
    .from("center_memberships")
    .select("center_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!membership) return { error: "لا يوجد مركز مرتبط بحسابك" };

  const { data: session, error: sessionError } = await supabase
    .from("attendance_sessions")
    .insert({
      center_id: membership.center_id,
      course_id: data.courseId,
      session_date: new Date().toISOString().split("T")[0],
      type: "MANUAL",
      status: "COMPLETED",
      taken_by_id: user.id,
    })
    .select("id")
    .single();

  if (sessionError) return { error: sessionError.message };

  if (data.records.length > 0) {
    const records = data.records.map((r) => ({
      session_id: session.id,
      user_id: r.userId,
      center_id: membership.center_id,
      status: r.status,
      recorded_at: new Date().toISOString(),
    }));

    const { error: recordsError } = await supabase
      .from("attendance_records")
      .insert(records);

    if (recordsError) return { error: recordsError.message };
  }

  return { success: true };
}
