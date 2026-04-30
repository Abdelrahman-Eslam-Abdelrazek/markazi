import { getTranslations } from "next-intl/server";
import { Link } from "../../../i18n/navigation";

export default async function HomePage() {
  const t = await getTranslations("app");

  const features = [
    { icon: "💳", title: "إدارة المدفوعات", desc: "فوري، فودافون كاش، إنستاباي — كل طرق الدفع المصرية" },
    { icon: "📋", title: "تسجيل الحضور", desc: "QR Code ذكي مع إشعار فوري لولي الأمر" },
    { icon: "📝", title: "نظام الامتحانات", desc: "بنك أسئلة متكامل مع تصحيح تلقائي" },
    { icon: "📖", title: "الواجبات والتكليفات", desc: "٦ أنواع واجبات مع متابعة التسليم" },
    { icon: "📱", title: "إشعارات واتساب", desc: "تنبيهات تلقائية للطلاب وأولياء الأمور" },
    { icon: "🌐", title: "موقع جاهز للمركز", desc: "موقع إلكتروني احترافي بدون تكلفة إضافية" },
  ];

  return (
    <main className="flex min-h-screen flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4">
        <span className="text-2xl font-bold text-primary-600">مركزي</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
            تسجيل الدخول
          </Link>
          <Link href="/register" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700">
            ابدأ مجاناً
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-24 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-3xl">
            🎓
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            أدِر مركزك التعليمي
            <br />
            <span className="text-primary-600">بكل سهولة</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-gray-500">
            {t("description")}
          </p>
          <div className="flex flex-col items-center gap-3 pt-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="rounded-xl bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-700 hover:shadow-primary-600/40"
            >
              ابدأ مجاناً
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-gray-200 px-8 py-3.5 text-base font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              اكتشف المميزات
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-gray-100 bg-white px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">
            كل ما يحتاجه مركزك في منصة واحدة
          </h2>
          <p className="mx-auto mb-16 max-w-xl text-center text-gray-500">
            من المدفوعات للحضور للامتحانات — كل حاجة في مكان واحد
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 transition hover:border-primary-200 hover:bg-primary-50/30">
                <span className="mb-3 block text-3xl">{feature.icon}</span>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 px-4 py-20 text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">جاهز تبدأ؟</h2>
        <p className="mb-8 text-gray-500">سجّل مركزك في أقل من دقيقة</p>
        <Link
          href="/register"
          className="inline-block rounded-xl bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-700"
        >
          إنشاء حساب مجاني
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} مركزي. جميع الحقوق محفوظة.
      </footer>
    </main>
  );
}
