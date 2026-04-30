import { getTranslations } from "next-intl/server";
import { createSupabaseServerClient } from "@markazi/db";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";

  const stats = [
    { key: "todayRevenue", value: "٠ ج.م", icon: "💰" },
    { key: "totalStudents", value: "٠", icon: "👥" },
    { key: "activeCourses", value: "٠", icon: "📚" },
    { key: "todayAttendance", value: "—", icon: "✅" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500">{t("welcome")}، {name}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{t(stat.key)}</p>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("topCourses")}</h2>
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <svg className="mb-2 h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <p className="text-sm">لا توجد كورسات بعد</p>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("recentStudents")}</h2>
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <svg className="mb-2 h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <p className="text-sm">لا يوجد طلاب بعد</p>
          </div>
        </div>
      </div>
    </div>
  );
}
