import { getTranslations } from "next-intl/server";

export default async function MessagesPage() {
  const t = await getTranslations("nav");

  const features = [
    { icon: "💬", title: "واتساب بيزنس", desc: "إرسال رسائل جماعية وتلقائية عبر واتساب" },
    { icon: "📱", title: "رسائل نصية SMS", desc: "تنبيهات فورية للطلاب وأولياء الأمور" },
    { icon: "📧", title: "بريد إلكتروني", desc: "إشعارات وتقارير عبر الإيميل" },
    { icon: "🔔", title: "إشعارات فورية", desc: "إشعارات داخل المنصة في الوقت الحقيقي" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("messages")}</h1>
        <p className="mt-1 text-sm text-gray-500">نظام الرسائل قيد التطوير</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
        <div className="mb-4 rounded-2xl bg-rose-50 p-4">
          <svg className="h-10 w-10 text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </div>
        <h3 className="mb-1 text-lg font-semibold text-gray-900">الرسائل قريبا</h3>
        <p className="mb-8 max-w-sm text-sm text-gray-500">
          نظام متعدد القنوات للتواصل مع الطلاب وأولياء الأمور.
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
