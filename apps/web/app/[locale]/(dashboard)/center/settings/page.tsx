import { requireCenter } from "../../get-center";

export default async function CenterSettingsPage() {
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
        <h1 className="text-2xl font-bold text-gray-900">إدارة المركز</h1>
        <p className="mt-1 text-sm text-gray-500">إعدادات ومعلومات المركز التفصيلية</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Center Profile Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white"
              style={{ backgroundColor: center.primary_color || "#2563EB" }}
            >
              {center.name_ar?.charAt(0)}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{center.name_ar}</h2>
            {center.name_en && (
              <p className="mt-0.5 text-sm text-gray-500">{center.name_en}</p>
            )}
            <div className="mt-3 flex items-center gap-2">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                center.status === "ACTIVE"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {center.status === "ACTIVE" ? "نشط" : center.status}
              </span>
              <span className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                {center.subscription_plan === "FREE" ? "مجاني" : center.subscription_plan}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-gray-900">المعلومات الأساسية</h3>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-gray-500">الرابط المختصر</dt>
                <dd className="mt-1 text-sm text-gray-900" dir="ltr">{center.slug}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">المنطقة الزمنية</dt>
                <dd className="mt-1 text-sm text-gray-900">{center.timezone || "Africa/Cairo"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">العملة</dt>
                <dd className="mt-1 text-sm text-gray-900">{center.currency || "EGP"}</dd>
              </div>
              {center.description && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-gray-500">الوصف</dt>
                  <dd className="mt-1 text-sm text-gray-600">{center.description}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-gray-900">بيانات التواصل</h3>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-gray-500">الهاتف</dt>
                <dd className="mt-1 text-sm text-gray-900" dir="ltr">{center.phone || "غير محدد"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">واتساب</dt>
                <dd className="mt-1 text-sm text-gray-900" dir="ltr">{center.whatsapp || "غير محدد"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">البريد الإلكتروني</dt>
                <dd className="mt-1 text-sm text-gray-900" dir="ltr">{center.email || "غير محدد"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
