import { getTranslations } from "next-intl/server";
import { requireCenter } from "../../get-center";
import { Link } from "../../../../../i18n/navigation";
import { notFound } from "next/navigation";
import { EnrollStudentForm } from "./enroll-form";
import { AddUnitForm } from "./add-unit-form";

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

type Props = { params: Promise<{ id: string }> };

export default async function CourseDetailPage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations("courses");
  const ctx = await requireCenter();
  if (!ctx) return null;

  const { data: course } = await ctx.supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .eq("center_id", ctx.centerId)
    .is("deleted_at", null)
    .single();

  if (!course) notFound();

  const [unitsRes, enrollmentsRes] = await Promise.all([
    ctx.supabase
      .from("units")
      .select("id, name_ar, sort_order, is_published, lessons(id, name_ar, content_type, sort_order, status, duration)")
      .eq("course_id", id)
      .order("sort_order", { ascending: true }),
    ctx.supabase
      .from("enrollments")
      .select("id, user_id, status, enrolled_at, completion_percent, users(name_ar, name_en, email, phone)")
      .eq("course_id", id)
      .eq("center_id", ctx.centerId)
      .order("enrolled_at", { ascending: false }),
  ]);

  const units = unitsRes.data || [];
  const enrollments = enrollmentsRes.data || [];
  const lessonCount = units.reduce((sum: number, u: any) => sum + (u.lessons?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Link href="/courses" className="mt-1 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
            <svg className="h-5 w-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{course.name_ar}</h1>
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[course.status] || statusColors.DRAFT}`}>
                {statusLabels[course.status] || course.status}
              </span>
            </div>
            {course.name_en && (
              <p className="mt-0.5 text-sm text-gray-500">{course.name_en}</p>
            )}
            {course.description && (
              <p className="mt-1 text-sm text-gray-500">{course.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">{t("students")}</p>
          <p className="mt-1 text-xl font-bold text-gray-900">
            {enrollments.length}
            {course.max_students && <span className="text-sm font-normal text-gray-400"> / {course.max_students}</span>}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">{t("units")}</p>
          <p className="mt-1 text-xl font-bold text-gray-900">{units.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">{t("lessons")}</p>
          <p className="mt-1 text-xl font-bold text-gray-900">{lessonCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">{t("price")}</p>
          <p className="mt-1 text-xl font-bold text-gray-900">
            {course.is_free ? (
              <span className="text-emerald-600">{t("free")}</span>
            ) : (
              `${Number(course.price || 0).toLocaleString("ar-EG")} ج.م`
            )}
          </p>
        </div>
      </div>

      {/* Units & Lessons */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">المحتوى التعليمي</h2>
          <AddUnitForm courseId={id} />
        </div>

        {units.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 rounded-xl bg-gray-100 p-3">
              <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">لا توجد وحدات بعد</p>
            <p className="mt-1 text-xs text-gray-400">ابدأ بإنشاء أول وحدة تعليمية</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {units.map((unit: any, idx: number) => (
              <div key={unit.id} className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary-600">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{unit.name_ar}</p>
                      <p className="text-xs text-gray-400">
                        {unit.lessons?.length || 0} درس
                        {!unit.is_published && " · غير منشور"}
                      </p>
                    </div>
                  </div>
                </div>
                {unit.lessons?.length > 0 && (
                  <div className="ms-10 mt-3 space-y-1">
                    {(unit.lessons as any[])
                      .sort((a: any, b: any) => a.sort_order - b.sort_order)
                      .map((lesson: any) => (
                        <div key={lesson.id} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                          <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                          </svg>
                          <span>{lesson.name_ar}</span>
                          {lesson.duration && (
                            <span className="ms-auto text-xs text-gray-400">{lesson.duration} د</span>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enrolled Students */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">الطلاب المسجلون ({enrollments.length})</h2>
          <EnrollStudentForm courseId={id} />
        </div>

        {enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-medium text-gray-500">لا يوجد طلاب مسجلين</p>
            <p className="mt-1 text-xs text-gray-400">أضف طلاب لهذا الكورس</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {enrollments.map((enrollment: any) => {
              const student = enrollment.users;
              return (
                <div key={enrollment.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                      {(student?.name_ar || "?").charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student?.name_ar || student?.name_en || "—"}</p>
                      <p className="text-xs text-gray-400" dir="ltr">{student?.phone || student?.email || ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {enrollment.completion_percent > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-primary-500"
                            style={{ width: `${enrollment.completion_percent}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{enrollment.completion_percent}%</span>
                      </div>
                    )}
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      enrollment.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700"
                        : enrollment.status === "COMPLETED"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {enrollment.status === "ACTIVE" ? "نشط" : enrollment.status === "COMPLETED" ? "مكتمل" : enrollment.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
