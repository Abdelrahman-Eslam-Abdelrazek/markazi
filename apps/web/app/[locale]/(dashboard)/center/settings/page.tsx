import { requireCenter } from "../../get-center";
import { EditCenterForm } from "./edit-form";

export default async function CenterSettingsPage() {
  const ctx = await requireCenter();
  if (!ctx) return null;

  const { data: center } = await ctx.supabase
    .from("centers")
    .select("name_ar, name_en, description, slug, phone, whatsapp, email, primary_color, secondary_color, subscription_plan, subscription_status, status, trial_ends_at, max_students, max_courses")
    .eq("id", ctx.centerId)
    .single();

  if (!center) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المركز</h1>
          <p className="mt-1 text-sm text-gray-500">إعدادات ومعلومات المركز التفصيلية</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            center.status === "ACTIVE"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-100 text-gray-600"
          }`}>
            {center.status === "ACTIVE" ? "نشط" : center.status}
          </span>
          <span className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
            {center.subscription_plan === "STARTER" ? "Starter (مجاني)" : center.subscription_plan}
          </span>
        </div>
      </div>

      {/* Subscription Info */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white"
              style={{ backgroundColor: center.primary_color || "#2563EB" }}
            >
              {center.name_ar?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{center.name_ar}</p>
              <p className="text-xs text-gray-500" dir="ltr">{center.slug}</p>
            </div>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-lg font-bold text-gray-900">{center.max_students || "∞"}</p>
              <p className="text-xs text-gray-500">أقصى طلاب</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{center.max_courses || "∞"}</p>
              <p className="text-xs text-gray-500">أقصى كورسات</p>
            </div>
            {center.trial_ends_at && (
              <div>
                <p className="text-lg font-bold text-amber-600">
                  {new Date(center.trial_ends_at).toLocaleDateString("ar-EG", { month: "short", day: "numeric" })}
                </p>
                <p className="text-xs text-gray-500">نهاية التجربة</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editable Form */}
      <EditCenterForm
        center={{
          name_ar: center.name_ar,
          name_en: center.name_en,
          description: center.description,
          phone: center.phone,
          whatsapp: center.whatsapp,
          email: center.email,
          primary_color: center.primary_color,
        }}
      />
    </div>
  );
}
