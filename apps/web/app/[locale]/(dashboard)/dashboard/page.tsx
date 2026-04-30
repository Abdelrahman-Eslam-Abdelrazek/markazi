import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  const stats = [
    { key: "todayRevenue", value: "٣,٢٥٠ ج.م", trend: "+12%" },
    { key: "totalStudents", value: "٢٤٧", trend: "+5" },
    { key: "activeCourses", value: "١٢", trend: "" },
    { key: "todayAttendance", value: "٨٧%", trend: "-2%" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-500">{t("welcome")}، أحمد</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">
              {t(stat.key)}
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{stat.value}</p>
            {stat.trend && (
              <p className="mt-1 text-xs font-medium text-emerald-600">{stat.trend}</p>
            )}
          </div>
        ))}
      </div>

      {/* Placeholder sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("topCourses")}</h2>
          <p className="text-sm text-gray-400">سيتم عرض البيانات هنا</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("recentStudents")}</h2>
          <p className="text-sm text-gray-400">سيتم عرض البيانات هنا</p>
        </div>
      </div>
    </div>
  );
}
