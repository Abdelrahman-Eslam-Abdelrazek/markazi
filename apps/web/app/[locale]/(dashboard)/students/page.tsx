import { getTranslations } from "next-intl/server";
import { requireCenter } from "../get-center";
import { Link } from "../../../../i18n/navigation";
import { StudentsTable } from "./students-table";

export default async function StudentsPage() {
  const t = await getTranslations("students");
  const ctx = await requireCenter();
  if (!ctx) return null;

  const { data: memberships } = await ctx.supabase
    .from("center_memberships")
    .select("id, user_id, role, is_active, joined_at, users(id, name_ar, name_en, phone, email, avatar, education_level)")
    .eq("center_id", ctx.centerId)
    .eq("role", "STUDENT")
    .order("joined_at", { ascending: false });

  const studentList = memberships || [];

  const enrollmentCounts: Record<string, number> = {};
  if (studentList.length > 0) {
    const userIds = studentList.map((s: any) => s.user_id);
    const { data: enrollments } = await ctx.supabase
      .from("enrollments")
      .select("user_id")
      .eq("center_id", ctx.centerId)
      .in("user_id", userIds);

    (enrollments || []).forEach((e: any) => {
      enrollmentCounts[e.user_id] = (enrollmentCounts[e.user_id] || 0) + 1;
    });
  }

  const studentsWithCounts = studentList.map((m: any) => ({
    ...m,
    enrollmentCount: enrollmentCounts[m.user_id] || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {studentList.length > 0
              ? `${studentList.length} طالب مسجل`
              : "أضف أول طالب لمركزك"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/students/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {t("add")}
          </Link>
        </div>
      </div>

      {studentList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <div className="mb-4 rounded-2xl bg-blue-50 p-4">
            <svg className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-semibold text-gray-900">لا يوجد طلاب بعد</h3>
          <p className="mb-6 max-w-sm text-sm text-gray-500">
            أضف طلاب مركزك يدوياً أو استورد بياناتهم من ملف Excel.
          </p>
          <div className="flex gap-3">
            <Link
              href="/students/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {t("add")}
            </Link>
          </div>
        </div>
      ) : (
        <StudentsTable
          students={studentsWithCounts}
          translations={{
            name: t("name"),
            phone: t("phone"),
            email: t("email"),
            level: t("level"),
            status: t("status"),
            active: t("active"),
            inactive: t("inactive"),
          }}
        />
      )}
    </div>
  );
}
