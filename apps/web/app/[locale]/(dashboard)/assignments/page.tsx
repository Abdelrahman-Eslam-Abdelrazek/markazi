import { getTranslations } from "next-intl/server";

export default async function AssignmentsPage() {
  const t = await getTranslations("nav");

  const features = [
    { icon: "📄", title: "6 أنواع واجبات", desc: "ملفات، نصوص، روابط، أكواد، عروض، وأكثر" },
    { icon: "📅", title: "مواعيد نهائية", desc: "تنبيهات تلقائية قبل الموعد ونظام تأخر" },
    { icon: "✅", title: "تقييم وملاحظات", desc: "درجات مع ملاحظات تفصيلية لكل طالب" },
    { icon: "📈", title: "متابعة التسليم", desc: "نسبة التسليم وتتبع المتأخرين" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("assignments")}</h1>
        <p className="mt-1 text-sm text-gray-500">نظام الواجبات قيد التطوير</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
        <div className="mb-4 rounded-2xl bg-cyan-50 p-4">
          <svg className="h-10 w-10 text-cyan-600" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </div>
        <h3 className="mb-1 text-lg font-semibold text-gray-900">الواجبات قريبا</h3>
        <p className="mb-8 max-w-sm text-sm text-gray-500">
          نظام متكامل لإنشاء وتوزيع الواجبات ومتابعة تسليمها وتقييمها.
        </p>

        <div className="mx-auto grid max-w-lg gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl bg-gray-50 p-4 text-start">
              <span className="text-xl">{f.icon}</span>
              <p className="mt-2 text-sm font-semibold text-gray-700">{f.title}</p>
              <p className="mt-0.5 text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
