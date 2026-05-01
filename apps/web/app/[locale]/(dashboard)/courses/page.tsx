import { getTranslations } from "next-intl/server";
import { requireCenter } from "../get-center";
import { Link } from "../../../../i18n/navigation";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PUBLISHED: "bg-emerald-50 text-emerald-700",
  ARCHIVED: "bg-amber-50 text-amber-700",
};

const statusLabels: Record<string, string> = {
  DRAFT: "مسودة",
  PUBLISHED: "منشور",
  ARCHIVED: "مؤرشف",
};

export default async function CoursesPage() {
  const t = await getTranslations("courses");
  const ctx = await requireCenter();
  if (!ctx) return null;

  const { data: courses } = await ctx.supabase
    .from("courses")
    .select("id, name_ar, name_en, slug, price, is_free, status, level, subject, max_students, start_date, created_at")
    .eq("center_id", ctx.centerId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const courseList = courses || [];

  const enrollmentCounts: Record<string, number> = {};
  if (courseList.length > 0) {
    const { data: enrollments } = await ctx.supabase
      .from("enrollments")
      .select("course_id")
      .eq("center_id", ctx.centerId)
      .in("course_id", courseList.map((c: any) => c.id));

    (enrollments || []).forEach((e: any) => {
      enrollmentCounts[e.course_id] = (enrollmentCounts[e.course_id] || 0) + 1;
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {courseList.length > 0
              ? `${courseList.length} كورس`
              : "أنشئ أول كورس لمركزك"}
          </p>
        </div>
        <Link
          href="/courses/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {t("create")}
        </Link>
      </div>

      {courseList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <div className="mb-4 rounded-2xl bg-primary-50 p-4">
            <svg className="h-10 w-10 text-primary-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-semibold text-gray-900">لا توجد كورسات بعد</h3>
          <p className="mb-6 max-w-sm text-sm text-gray-500">
            ابدأ بإنشاء أول كورس. يمكنك إضافة الوحدات والدروس والطلاب بعد ذلك.
          </p>
          <Link
            href="/courses/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {t("create")}
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t("name")}</th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t("status")}</th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t("students")}</th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t("price")}</th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t("level")}</th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t("startDate")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courseList.map((course: any) => {
                  const enrolled = enrollmentCounts[course.id] || 0;
                  return (
                    <tr key={course.id} className="transition hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <Link href={`/courses/${course.id}`} className="group">
                          <p className="font-medium text-gray-900 group-hover:text-primary-600">{course.name_ar}</p>
                          {course.subject && (
                            <p className="mt-0.5 text-xs text-gray-400">{course.subject}</p>
                          )}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[course.status] || statusColors.DRAFT}`}>
                          {statusLabels[course.status] || course.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <span>{enrolled}</span>
                          {course.max_students && (
                            <span className="text-gray-400">/ {course.max_students}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {course.is_free ? (
                          <span className="text-emerald-600 font-medium">{t("free")}</span>
                        ) : (
                          <span>{Number(course.price || 0).toLocaleString("ar-EG")} ج.م</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{course.level || "—"}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {course.start_date
                          ? new Date(course.start_date).toLocaleDateString("ar-EG")
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
