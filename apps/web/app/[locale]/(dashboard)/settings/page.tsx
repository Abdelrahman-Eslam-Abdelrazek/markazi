import { getTranslations } from "next-intl/server";
import { requireCenter } from "../get-center";

export default async function SettingsPage() {
  const t = await getTranslations("common");
  const ctx = await requireCenter();
  if (!ctx) return null;

  const { data: center } = await ctx.supabase
    .from("centers")
    .select("*")
    .eq("id", ctx.centerId)
    .single();

  if (!center) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
        <p className="mt-1 text-sm text-gray-500">إدارة إعدادات المركز والحساب</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Center Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">معلومات المركز</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">الاسم (عربي)</label>
              <p className="text-sm font-medium text-gray-900">{center.name_ar}</p>
            </div>
            {center.name_en && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">الاسم (إنجليزي)</label>
                <p className="text-sm font-medium text-gray-900">{center.name_en}</p>
              </div>
            )}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">الرابط</label>
              <p className="text-sm text-gray-600" dir="ltr">{center.slug}</p>
            </div>
            {center.description && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">الوصف</label>
                <p className="text-sm text-gray-600">{center.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">بيانات التواصل</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">الهاتف</label>
              <p className="text-sm text-gray-600" dir="ltr">{center.phone || "—"}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">واتساب</label>
              <p className="text-sm text-gray-600" dir="ltr">{center.whatsapp || "—"}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">البريد الإلكتروني</label>
              <p className="text-sm text-gray-600" dir="ltr">{center.email || "—"}</p>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">الاشتراك</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">الخطة</label>
              <span className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                {center.subscription_plan === "FREE" ? "مجاني" : center.subscription_plan}
              </span>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">الحالة</label>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                center.subscription_status === "TRIALING"
                  ? "bg-amber-50 text-amber-700"
                  : center.subscription_status === "ACTIVE"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {center.subscription_status === "TRIALING" ? "فترة تجريبية" : center.subscription_status === "ACTIVE" ? "نشط" : center.subscription_status}
              </span>
            </div>
            {center.trial_ends_at && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">تنتهي التجربة</label>
                <p className="text-sm text-gray-600">
                  {new Date(center.trial_ends_at).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">أقصى عدد طلاب</label>
                <p className="text-sm font-medium text-gray-900">{center.max_students || "∞"}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">أقصى عدد كورسات</label>
                <p className="text-sm font-medium text-gray-900">{center.max_courses || "∞"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">الهوية البصرية</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-500">اللون الرئيسي</label>
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded-lg border border-gray-200"
                  style={{ backgroundColor: center.primary_color || "#2563EB" }}
                />
                <span className="text-sm text-gray-600" dir="ltr">{center.primary_color || "#2563EB"}</span>
              </div>
            </div>
            {center.secondary_color && (
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-500">اللون الثانوي</label>
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-lg border border-gray-200"
                    style={{ backgroundColor: center.secondary_color }}
                  />
                  <span className="text-sm text-gray-600" dir="ltr">{center.secondary_color}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
