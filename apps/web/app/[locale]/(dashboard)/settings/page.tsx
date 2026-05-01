import { requireCenter } from "../get-center";
import { Link } from "../../../../i18n/navigation";

export default async function SettingsPage() {
  const ctx = await requireCenter();
  if (!ctx) return null;

  const { data: center } = await ctx.supabase
    .from("centers")
    .select("name_ar, name_en, slug, phone, email, primary_color, subscription_plan, subscription_status, status")
    .eq("id", ctx.centerId)
    .single();

  if (!center) return null;

  const sections = [
    {
      title: "إدارة المركز",
      description: "تعديل بيانات المركز والتواصل والهوية البصرية",
      href: "/center/settings",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5M3.75 3v18m16.5-18v18M5.25 3h13.5M5.25 21h13.5M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      ),
      color: "bg-primary-50 text-primary-600",
    },
    {
      title: "الاشتراك والفوترة",
      description: `الخطة الحالية: ${center.subscription_plan === "STARTER" ? "Starter (مجاني)" : center.subscription_plan}`,
      href: "/center/settings",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      ),
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "الفريق والصلاحيات",
      description: "إدارة المدرسين والمشرفين وصلاحياتهم",
      href: "/instructors",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "الإشعارات",
      description: "تفضيلات الإشعارات ورسائل التنبيه",
      href: "/messages",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      ),
      color: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
        <p className="mt-1 text-sm text-gray-500">إدارة إعدادات المركز والحساب</p>
      </div>

      {/* Center Quick Info */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white"
            style={{ backgroundColor: center.primary_color || "#2563EB" }}
          >
            {center.name_ar?.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-gray-900">{center.name_ar}</p>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-xs text-gray-500" dir="ltr">{center.slug}</span>
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                center.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
              }`}>
                {center.status === "ACTIVE" ? "نشط" : center.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className={`rounded-xl p-2.5 ${section.color}`}>
                {section.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">{section.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{section.description}</p>
              </div>
              <svg className="h-5 w-5 shrink-0 text-gray-400 rtl:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
