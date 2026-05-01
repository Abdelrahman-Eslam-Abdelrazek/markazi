import { getTranslations } from "next-intl/server";
import { requireCenter } from "../get-center";
import { Link } from "../../../../i18n/navigation";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const ctx = await requireCenter();
  if (!ctx) return null;

  const today = new Date().toISOString().split("T")[0];

  const [students, coursesCount, payments, todayAttendance, recentCourses, recentStudents] = await Promise.all([
    ctx.supabase
      .from("center_memberships")
      .select("id", { count: "exact", head: true })
      .eq("center_id", ctx.centerId)
      .eq("role", "STUDENT"),
    ctx.supabase
      .from("courses")
      .select("id", { count: "exact", head: true })
      .eq("center_id", ctx.centerId)
      .is("deleted_at", null),
    ctx.supabase
      .from("payments")
      .select("amount")
      .eq("center_id", ctx.centerId)
      .eq("status", "COMPLETED"),
    ctx.supabase
      .from("attendance_sessions")
      .select("id, attendance_records(id, status)")
      .eq("center_id", ctx.centerId)
      .eq("session_date", today),
    ctx.supabase
      .from("courses")
      .select("id, name_ar, status, price, is_free, created_at")
      .eq("center_id", ctx.centerId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(5),
    ctx.supabase
      .from("center_memberships")
      .select("id, joined_at, users(name_ar, name_en, phone)")
      .eq("center_id", ctx.centerId)
      .eq("role", "STUDENT")
      .order("joined_at", { ascending: false })
      .limit(5),
  ]);

  const totalRevenue = (payments.data || []).reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);
  const todaySessions = todayAttendance.data || [];
  const todayPresent = todaySessions.reduce((sum: number, s: any) => {
    const records = s.attendance_records || [];
    return sum + records.filter((r: any) => r.status === "PRESENT").length;
  }, 0);
  const todayTotal = todaySessions.reduce((sum: number, s: any) => sum + ((s.attendance_records as any[])?.length || 0), 0);
  const courseList = recentCourses.data || [];
  const studentsList = recentStudents.data || [];

  const cards = [
    {
      label: t("totalStudents"),
      value: (students.count || 0).toString(),
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
      href: "/students",
    },
    {
      label: t("activeCourses"),
      value: (coursesCount.count || 0).toString(),
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      href: "/courses",
    },
    {
      label: t("todayRevenue"),
      value: `${totalRevenue.toLocaleString("ar-EG")} ج.م`,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      ),
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
      href: "/payments",
    },
    {
      label: t("todayAttendance"),
      value: todayTotal > 0 ? `${todayPresent}/${todayTotal}` : "—",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
      href: "/attendance",
    },
  ];

  const userName = ctx.user.user_metadata?.full_name || ctx.user.email?.split("@")[0] || "";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t("welcome")}، {userName}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{ctx.centerName}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <div className={`rounded-lg p-2 ${card.bg} ${card.iconColor}`}>{card.icon}</div>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{card.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">إجراءات سريعة</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "إضافة كورس", href: "/courses/new", icon: "📚" },
            { label: "إضافة طالب", href: "/students/new", icon: "👤" },
            { label: "تسجيل دفعة", href: "/payments/new", icon: "💳" },
            { label: "تسجيل حضور", href: "/attendance/new", icon: "📋" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-primary-200 hover:shadow-sm"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Data Panels */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Courses */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">{t("topCourses")}</h2>
            <Link href="/courses" className="text-xs font-medium text-primary-600 hover:text-primary-700">عرض الكل</Link>
          </div>
          {courseList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 rounded-xl bg-gray-100 p-3">
                <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500">لا توجد كورسات بعد</p>
              <p className="mt-1 text-xs text-gray-400">ابدأ بإنشاء أول كورس لمركزك</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {courseList.map((course: any) => (
                <Link key={course.id} href={`/courses/${course.id}`} className="flex items-center justify-between px-5 py-3 transition hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{course.name_ar}</p>
                    <p className="text-xs text-gray-400">
                      {course.status === "PUBLISHED" ? "منشور" : course.status === "DRAFT" ? "مسودة" : course.status}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {course.is_free ? "مجاني" : `${Number(course.price || 0).toLocaleString("ar-EG")} ج.م`}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Students */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">{t("recentStudents")}</h2>
            <Link href="/students" className="text-xs font-medium text-primary-600 hover:text-primary-700">عرض الكل</Link>
          </div>
          {studentsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 rounded-xl bg-gray-100 p-3">
                <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500">لا يوجد طلاب بعد</p>
              <p className="mt-1 text-xs text-gray-400">أضف أول طالب لبدء إدارة مركزك</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {studentsList.map((m: any) => {
                const s = m.users;
                return (
                  <Link key={m.id} href={`/students/${m.id}`} className="flex items-center gap-3 px-5 py-3 transition hover:bg-gray-50">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                      {(s?.name_ar || "?").charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{s?.name_ar || s?.name_en || "—"}</p>
                      <p className="text-xs text-gray-400" dir="ltr">{s?.phone || ""}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {m.joined_at ? new Date(m.joined_at).toLocaleDateString("ar-EG") : ""}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
