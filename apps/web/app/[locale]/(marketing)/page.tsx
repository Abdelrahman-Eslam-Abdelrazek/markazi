import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("app");

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
            {t("name")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
            {t("description")}
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/register"
              className="rounded-xl bg-primary-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-primary-700"
            >
              ابدأ مجاناً
            </a>
            <a
              href="/features"
              className="rounded-xl border border-gray-300 px-8 py-3 text-lg font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              اكتشف المميزات
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            كل ما يحتاجه مركزك في منصة واحدة
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "إدارة المدفوعات", desc: "فوري، فودافون كاش، إنستاباي — كل طرق الدفع المصرية" },
              { title: "تسجيل الحضور", desc: "QR Code ذكي مع إشعار فوري لولي الأمر عند الغياب" },
              { title: "نظام الامتحانات", desc: "بنك أسئلة متكامل مع تصحيح تلقائي وتقارير مفصّلة" },
              { title: "الواجبات والتكليفات", desc: "6 أنواع واجبات مع متابعة التسليم والتصحيح" },
              { title: "إشعارات واتساب", desc: "تنبيهات تلقائية للطلاب وأولياء الأمور عبر واتساب" },
              { title: "موقع جاهز للمركز", desc: "موقع إلكتروني احترافي لمركزك بدون أي تكلفة إضافية" },
            ].map((feature, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 p-6 shadow-sm transition hover:shadow-md">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
