import { getTranslations } from "next-intl/server";
import { requireCenter } from "../get-center";
import { Link } from "../../../../i18n/navigation";

export default async function InstructorsPage() {
  const t = await getTranslations("nav");
  const ctx = await requireCenter();
  if (!ctx) return null;

  const { data: memberships } = await ctx.supabase
    .from("center_memberships")
    .select("id, user_id, role, is_active, joined_at, users(id, name_ar, name_en, phone, email, avatar)")
    .eq("center_id", ctx.centerId)
    .eq("role", "INSTRUCTOR")
    .order("joined_at", { ascending: false });

  const instructorList = memberships || [];

  const courseCounts: Record<string, number> = {};
  if (instructorList.length > 0) {
    const userIds = instructorList.map((m: any) => m.user_id);
    const { data: courses } = await ctx.supabase
      .from("courses")
      .select("created_by_id")
      .eq("center_id", ctx.centerId)
      .is("deleted_at", null)
      .in("created_by_id", userIds);

    (courses || []).forEach((c: any) => {
      courseCounts[c.created_by_id] = (courseCounts[c.created_by_id] || 0) + 1;
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("instructors")}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {instructorList.length > 0
              ? `${instructorList.length} مدرس في المركز`
              : "أضف أول مدرس لمركزك"}
          </p>
        </div>
        <Link
          href="/instructors/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          إضافة مدرس
        </Link>
      </div>

      {instructorList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <div className="mb-4 rounded-2xl bg-emerald-50 p-4">
            <svg className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-semibold text-gray-900">لا يوجد مدرسين بعد</h3>
          <p className="mb-6 max-w-sm text-sm text-gray-500">
            أضف مدرسين لمركزك ليتمكنوا من إدارة الكورسات والحضور.
          </p>
          <Link
            href="/instructors/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            إضافة مدرس
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {instructorList.map((membership: any) => {
            const user = membership.users;
            if (!user) return null;
            const courses = courseCounts[membership.user_id] || 0;
            return (
              <div
                key={membership.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-lg font-bold text-emerald-700">
                    {(user.name_ar || user.name_en || "?").charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-900">{user.name_ar || user.name_en || "—"}</p>
                    {user.name_en && user.name_ar && (
                      <p className="truncate text-xs text-gray-400">{user.name_en}</p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      {user.phone && <span dir="ltr">{user.phone}</span>}
                      {user.email && <span dir="ltr" className="truncate">{user.email}</span>}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{courses} كورس</span>
                    <span className={`inline-flex rounded-full px-2 py-0.5 font-medium ${
                      membership.is_active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {membership.is_active ? "نشط" : "غير نشط"}
                    </span>
                  </div>
                  {membership.joined_at && (
                    <span className="text-xs text-gray-400">
                      {new Date(membership.joined_at).toLocaleDateString("ar-EG")}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
