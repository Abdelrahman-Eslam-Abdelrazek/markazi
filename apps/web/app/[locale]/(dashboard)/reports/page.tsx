import { requireCenter } from "../get-center";

export default async function ReportsPage() {
  const ctx = await requireCenter();
  if (!ctx) return null;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

  const [
    studentsRes,
    coursesRes,
    paymentsThisMonth,
    paymentsLastMonth,
    enrollmentsRes,
    attendanceRes,
    recentPayments,
  ] = await Promise.all([
    ctx.supabase
      .from("center_memberships")
      .select("id, is_active, joined_at", { count: "exact" })
      .eq("center_id", ctx.centerId)
      .eq("role", "STUDENT"),
    ctx.supabase
      .from("courses")
      .select("id, status")
      .eq("center_id", ctx.centerId)
      .is("deleted_at", null),
    ctx.supabase
      .from("payments")
      .select("amount, status")
      .eq("center_id", ctx.centerId)
      .eq("status", "COMPLETED")
      .gte("paid_at", startOfMonth),
    ctx.supabase
      .from("payments")
      .select("amount")
      .eq("center_id", ctx.centerId)
      .eq("status", "COMPLETED")
      .gte("paid_at", startOfLastMonth)
      .lt("paid_at", endOfLastMonth),
    ctx.supabase
      .from("enrollments")
      .select("id, status")
      .eq("center_id", ctx.centerId),
    ctx.supabase
      .from("attendance_sessions")
      .select("id, attendance_records(id, status)")
      .eq("center_id", ctx.centerId)
      .gte("session_date", startOfMonth),
    ctx.supabase
      .from("payments")
      .select("amount, paid_at")
      .eq("center_id", ctx.centerId)
      .eq("status", "COMPLETED")
      .order("paid_at", { ascending: false })
      .limit(30),
  ]);

  const students = studentsRes.data || [];
  const totalStudents = students.length;
  const activeStudents = students.filter((s: any) => s.is_active).length;
  const newStudentsThisMonth = students.filter((s: any) =>
    s.joined_at && new Date(s.joined_at) >= new Date(startOfMonth)
  ).length;

  const courses = coursesRes.data || [];
  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c: any) => c.status === "PUBLISHED").length;

  const revenueThisMonth = (paymentsThisMonth.data || []).reduce(
    (sum: number, p: any) => sum + Number(p.amount || 0), 0
  );
  const revenueLastMonth = (paymentsLastMonth.data || []).reduce(
    (sum: number, p: any) => sum + Number(p.amount || 0), 0
  );
  const revenueGrowth = revenueLastMonth > 0
    ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100)
    : 0;

  const enrollments = enrollmentsRes.data || [];
  const activeEnrollments = enrollments.filter((e: any) => e.status === "ACTIVE").length;

  const sessions = attendanceRes.data || [];
  let totalRecords = 0;
  let presentRecords = 0;
  sessions.forEach((s: any) => {
    const records = s.attendance_records || [];
    totalRecords += records.length;
    presentRecords += records.filter((r: any) => r.status === "PRESENT").length;
  });
  const attendanceRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

  const dailyRevenue: Record<string, number> = {};
  (recentPayments.data || []).forEach((p: any) => {
    if (p.paid_at) {
      const day = new Date(p.paid_at).toLocaleDateString("ar-EG", { month: "short", day: "numeric" });
      dailyRevenue[day] = (dailyRevenue[day] || 0) + Number(p.amount || 0);
    }
  });
  const revenueChart = Object.entries(dailyRevenue).reverse().slice(0, 14);

  const maxRevenue = Math.max(...revenueChart.map(([, v]) => v), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">التقارير</h1>
        <p className="mt-1 text-sm text-gray-500">نظرة عامة على أداء المركز</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">إجمالي الطلاب</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{totalStudents}</p>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="text-emerald-600">{activeStudents} نشط</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500">+{newStudentsThisMonth} هذا الشهر</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">الإيرادات (الشهر)</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{revenueThisMonth.toLocaleString("ar-EG")} ج.م</p>
          <div className="mt-1 text-xs">
            {revenueGrowth !== 0 && (
              <span className={revenueGrowth > 0 ? "text-emerald-600" : "text-red-600"}>
                {revenueGrowth > 0 ? "+" : ""}{revenueGrowth}% عن الشهر السابق
              </span>
            )}
            {revenueGrowth === 0 && revenueLastMonth === 0 && (
              <span className="text-gray-400">لا توجد بيانات سابقة</span>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">الكورسات</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{totalCourses}</p>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="text-emerald-600">{publishedCourses} منشور</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500">{activeEnrollments} تسجيل نشط</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">نسبة الحضور (الشهر)</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{attendanceRate}%</p>
          <div className="mt-1 text-xs text-gray-500">
            {presentRecords}/{totalRecords} حضور من {sessions.length} جلسة
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-base font-semibold text-gray-900">الإيرادات اليومية</h2>
        {revenueChart.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-sm text-gray-400">
            لا توجد بيانات إيرادات بعد
          </div>
        ) : (
          <div className="flex items-end gap-2" style={{ height: 200 }}>
            {revenueChart.map(([day, amount]) => {
              const height = Math.max((amount / maxRevenue) * 180, 4);
              return (
                <div key={day} className="group flex flex-1 flex-col items-center gap-1">
                  <div className="relative w-full">
                    <div className="invisible absolute -top-8 start-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:visible">
                      {amount.toLocaleString("ar-EG")} ج.م
                    </div>
                    <div
                      className="w-full rounded-t bg-primary-500 transition-all group-hover:bg-primary-600"
                      style={{ height }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400">{day}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Student Activity */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">حالة الطلاب</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">نشطون</span>
              <div className="flex items-center gap-3">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${totalStudents > 0 ? (activeStudents / totalStudents) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-10 text-end text-sm font-medium text-gray-900">{activeStudents}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">غير نشطون</span>
              <div className="flex items-center gap-3">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gray-400"
                    style={{ width: `${totalStudents > 0 ? ((totalStudents - activeStudents) / totalStudents) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-10 text-end text-sm font-medium text-gray-900">{totalStudents - activeStudents}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">جدد هذا الشهر</span>
              <div className="flex items-center gap-3">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${totalStudents > 0 ? (newStudentsThisMonth / totalStudents) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-10 text-end text-sm font-medium text-gray-900">{newStudentsThisMonth}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Status */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">حالة الكورسات</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">منشورة</span>
              <div className="flex items-center gap-3">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${totalCourses > 0 ? (publishedCourses / totalCourses) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-10 text-end text-sm font-medium text-gray-900">{publishedCourses}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">مسودة</span>
              <div className="flex items-center gap-3">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gray-400"
                    style={{ width: `${totalCourses > 0 ? ((totalCourses - publishedCourses) / totalCourses) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-10 text-end text-sm font-medium text-gray-900">{totalCourses - publishedCourses}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">تسجيلات نشطة</span>
              <div className="flex items-center gap-3">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: "100%" }} />
                </div>
                <span className="w-10 text-end text-sm font-medium text-gray-900">{activeEnrollments}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
