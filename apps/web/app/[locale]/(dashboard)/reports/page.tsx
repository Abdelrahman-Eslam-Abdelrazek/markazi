import { getTranslations } from "next-intl/server";

export default async function ReportsPage() {
  const t = await getTranslations("nav");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("reports")}</h1>
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
        <div className="mb-4 rounded-2xl bg-indigo-50 p-4">
          <svg
            className="h-10 w-10 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
            />
          </svg>
        </div>
        <h3 className="mb-1 text-lg font-semibold text-gray-900">
          التقارير قريبًا
        </h3>
        <p className="max-w-sm text-sm text-gray-500">
          نعمل على تجهيز نظام التقارير لعرض إحصائيات المركز والأداء المالي
          وتقارير الطلاب والحضور
        </p>
      </div>
    </div>
  );
}
