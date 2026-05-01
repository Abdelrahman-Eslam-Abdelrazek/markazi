import { getTranslations } from "next-intl/server";
import { requireCenter } from "../get-center";
import { Link } from "../../../../i18n/navigation";

const roleLabels: Record<string, string> = {
  STUDENT: "طالب",
  PARENT: "ولي أمر",
  INSTRUCTOR: "مُحاضر",
};

export default async function StudentsPage() {
  const t = await getTranslations("students");
  const ctx = await requireCenter();
  if (!ctx) return null;

  const { data: memberships } = await ctx.supabase
    .from("center_memberships")
    .select("id, user_id, role, is_active, joined_at, users(id, name_ar, name_en, phone, email, avatar, education_level)")
    .eq("center_id", ctx.centerId)
    .eq("role", "STUDENT")
    .order("joined_at", { ascending: false });

  const studentList = memberships || [];

  const enrollmentCounts: Record<string, number> = {};
  if (studentList.length > 0) {
    const userIds = studentList.map((s: any) => s.user_id);
    const { data: enrollments } = await ctx.supabase
      .from("enrollments")
      .select("user_id")
      .eq("center_id", ctx.centerId)
      .in("user_id", userIds);

    (enrollments || []).forEach((e: any) => {
      enrollmentCounts[e.user_id] = (enrollmentCounts[e.user_id] || 0) + 1;
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {studentList.length > 0
              ? `${studentList.length} طالب مسجل`
              : "أضف أول طالب لمركزك"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/students/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {t("add")}
          </Link>
        </div>
      </div>

      {studentList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <div className="mb-4 rounded-2xl bg-blue-50 p-4">
            <svg className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-semibold text-gray-900">لا يوجد طلاب بعد</h3>
          <p className="mb-6 max-w-sm text-sm text-gray-500">
            أضف طلاب مركزك يدوياً أو استورد بياناتهم من ملف Excel.
          </p>
          <div className="flex gap-3">
            <Link
              href="/students/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {t("add")}
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t("name")}</th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t("phone")}</th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t("email")}</th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t("level")}</th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">الكورسات</th>
                  <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t("status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {studentList.map((membership: any) => {
                  const user = membership.users;
                  if (!user) return null;
                  const courses = enrollmentCounts[membership.user_id] || 0;
                  return (
                    <tr key={membership.id} className="transition hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <Link href={`/students/${membership.id}`} className="group flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                            {(user.name_ar || user.name_en || "?").charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 group-hover:text-primary-600">{user.name_ar || user.name_en || "—"}</p>
                            {user.name_en && user.name_ar && (
                              <p className="text-xs text-gray-400">{user.name_en}</p>
                            )}
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-600" dir="ltr">
                        {user.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600" dir="ltr">
                        {user.email || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {user.education_level || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {courses > 0 ? `${courses} كورس` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          membership.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          {membership.is_active ? t("active") : t("inactive")}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
