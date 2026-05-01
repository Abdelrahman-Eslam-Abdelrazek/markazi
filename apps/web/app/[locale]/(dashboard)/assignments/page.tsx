import { getTranslations } from "next-intl/server";

export default async function AssignmentsPage() {
  const t = await getTranslations("nav");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("assignments")}</h1>
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
        <div className="mb-4 rounded-2xl bg-cyan-50 p-4">
          <svg
            className="h-10 w-10 text-cyan-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </div>
        <h3 className="mb-1 text-lg font-semibold text-gray-900">
          الواجبات قريبًا
        </h3>
        <p className="max-w-sm text-sm text-gray-500">
          نعمل على تجهيز نظام الواجبات لإنشاء وتوزيع الواجبات على الطلاب ومتابعة
          تسليمها وتقييمها
        </p>
      </div>
    </div>
  );
}
