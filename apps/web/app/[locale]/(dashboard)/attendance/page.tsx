import { getTranslations } from "next-intl/server";
import { requireCenter } from "../get-center";
import { Link } from "../../../../i18n/navigation";

export default async function AttendancePage() {
  const t = await getTranslations("attendance");
  const ctx = await requireCenter();
  if (!ctx) return null;

  const today = new Date().toISOString().split("T")[0];

  const { data: sessions } = await ctx.supabase
    .from("attendance_sessions")
    .select("id, course_id, session_date, type, status, created_at, courses(name_ar)")
    .eq("center_id", ctx.centerId)
    .order("session_date", { ascending: false })
    .limit(20);

  const sessionList = sessions || [];

  const todaySessions = sessionList.filter((s: any) => s.session_date?.startsWith(today));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {todaySessions.length > 0
              ? `${todaySessions.length} جلسة اليوم`
              : "لا توجد جلسات مسجلة اليوم"}
          </p>
        </div>
        <Link
          href="/attendance/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {t("takeAttendance")}
        </Link>
      </div>

      {sessionList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <div className="mb-4 rounded-2xl bg-purple-50 p-4">
            <svg className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-semibold text-gray-900">لا توجد جلسات حضور بعد</h3>
          <p className="mb-6 max-w-sm text-sm text-gray-500">
            ابدأ بتسجيل حضور الطلاب يدوياً أو عبر QR Code.
          </p>
          <Link
            href="/attendance/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            {t("takeAttendance")}
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">الكورس</th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">التاريخ</th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">النوع</th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sessionList.map((session: any) => (
                  <tr key={session.id} className="transition hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {session.courses?.name_ar || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {session.session_date
                        ? new Date(session.session_date).toLocaleDateString("ar-EG")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {session.type === "QR" ? "QR Code" : session.type === "MANUAL" ? "يدوي" : session.type || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        session.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {session.status === "COMPLETED" ? "مكتمل" : "جاري"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
