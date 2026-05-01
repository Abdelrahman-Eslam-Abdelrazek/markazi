import { getTranslations } from "next-intl/server";
import { requireCenter } from "../get-center";
import { Link } from "../../../../i18n/navigation";
import { CoursesTable } from "./courses-table";

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

  const coursesWithCounts = courseList.map((c: any) => ({
    ...c,
    enrollmentCount: enrollmentCounts[c.id] || 0,
  }));

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
        <CoursesTable
          courses={coursesWithCounts}
          translations={{
            name: t("name"),
            status: t("status"),
            students: t("students"),
            price: t("price"),
            level: t("level"),
            startDate: t("startDate"),
            free: t("free"),
          }}
        />
      )}
    </div>
  );
}
