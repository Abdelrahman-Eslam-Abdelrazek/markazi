import { requireCenter } from "../../get-center";
import { Link } from "../../../../../i18n/navigation";
import { notFound } from "next/navigation";
import { AttendanceEditor } from "./attendance-editor";

export default async function AttendanceSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await requireCenter();
  if (!ctx) return null;

  const { data: session } = await ctx.supabase
    .from("attendance_sessions")
    .select("id, course_id, session_date, type, status, created_at, courses(name_ar)")
    .eq("id", id)
    .eq("center_id", ctx.centerId)
    .single();

  if (!session) notFound();

  const { data: records } = await ctx.supabase
    .from("attendance_records")
    .select("id, user_id, status, recorded_at, users(name_ar, name_en)")
    .eq("session_id", id);

  const recordList = (records || []).map((r: any) => {
    const u = Array.isArray(r.users) ? r.users[0] : r.users;
    return {
      id: r.id as string,
      userId: r.user_id as string,
      name: (u?.name_ar || u?.name_en || "—") as string,
      status: r.status as string,
      recordedAt: r.recorded_at as string,
    };
  });

  const courseName = Array.isArray(session.courses)
    ? session.courses[0]?.name_ar
    : (session as any).courses?.name_ar;

  const present = recordList.filter((r) => r.status === "PRESENT").length;
  const absent = recordList.filter((r) => r.status === "ABSENT").length;
  const late = recordList.filter((r) => r.status === "LATE").length;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Link
              href="/attendance"
              className="text-sm text-gray-500 transition hover:text-gray-700"
            >
              الحضور
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-gray-900">تفاصيل الجلسة</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{courseName || "—"}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {session.session_date
              ? new Date(session.session_date).toLocaleDateString("ar-EG", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "—"}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            session.status === "COMPLETED"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {session.status === "COMPLETED" ? "مكتمل" : "جاري"}
        </span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-emerald-50 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-700">{present}</p>
          <p className="text-xs font-medium text-emerald-600">حاضر</p>
        </div>
        <div className="rounded-xl bg-red-50 p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{absent}</p>
          <p className="text-xs font-medium text-red-600">غائب</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{late}</p>
          <p className="text-xs font-medium text-amber-600">متأخر</p>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
        <span>النوع: <strong className="text-gray-900">{session.type === "QR" ? "QR Code" : "يدوي"}</strong></span>
        <span className="text-gray-300">|</span>
        <span>الطلاب: <strong className="text-gray-900">{recordList.length}</strong></span>
        <span className="text-gray-300">|</span>
        <span>نسبة الحضور: <strong className="text-gray-900">{recordList.length > 0 ? Math.round(((present + late) / recordList.length) * 100) : 0}%</strong></span>
      </div>

      {/* Student Records */}
      <AttendanceEditor sessionId={id} records={recordList} />
    </div>
  );
}
