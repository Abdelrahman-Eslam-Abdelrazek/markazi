import { requireCenter } from "../../get-center";
import { notFound } from "next/navigation";
import { Link } from "../../../../../i18n/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function StudentDetailPage({ params }: Props) {
  const { id: membershipId } = await params;
  const ctx = await requireCenter();
  if (!ctx) return null;

  const { data: membership } = await ctx.supabase
    .from("center_memberships")
    .select("id, user_id, role, is_active, joined_at, users(id, name_ar, name_en, phone, email, gender, education_level, avatar, created_at)")
    .eq("id", membershipId)
    .eq("center_id", ctx.centerId)
    .single();

  if (!membership) notFound();
  const student = (membership as any).users;
  if (!student) notFound();

  const [enrollmentsRes, paymentsRes, attendanceRes] = await Promise.all([
    ctx.supabase
      .from("enrollments")
      .select("id, status, enrolled_at, completion_percent, courses(name_ar, price, is_free)")
      .eq("user_id", membership.user_id)
      .eq("center_id", ctx.centerId)
      .order("enrolled_at", { ascending: false }),
    ctx.supabase
      .from("payments")
      .select("id, amount, method, status, paid_at, courses(name_ar)")
      .eq("user_id", membership.user_id)
      .eq("center_id", ctx.centerId)
      .order("paid_at", { ascending: false })
      .limit(10),
    ctx.supabase
      .from("attendance_records")
      .select("id, status, recorded_at, attendance_sessions(session_date, courses(name_ar))")
      .eq("user_id", membership.user_id)
      .eq("center_id", ctx.centerId)
      .order("recorded_at", { ascending: false })
      .limit(10),
  ]);

  const enrollments = enrollmentsRes.data || [];
  const payments = paymentsRes.data || [];
  const attendance = attendanceRes.data || [];

  const totalPaid = payments
    .filter((p: any) => p.status === "COMPLETED")
    .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

  const presentCount = attendance.filter((a: any) => a.status === "PRESENT").length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;

  const levelLabels: Record<string, string> = {
    PRIMARY: "ابتدائي",
    PREPARATORY: "إعدادي",
    SECONDARY: "ثانوي",
    UNIVERSITY: "جامعي",
  };

  const methodLabels: Record<string, string> = {
    CASH: "كاش",
    FAWRY: "فوري",
    VODAFONE_CASH: "فودافون كاش",
    INSTAPAY: "إنستاباي",
    BANK_TRANSFER: "تحويل بنكي",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/students" className="mt-1 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
          <svg className="h-5 w-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-xl font-bold text-primary-700">
            {(student.name_ar || "?").charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{student.name_ar || student.name_en || "—"}</h1>
            <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
              {student.phone && <span dir="ltr">{student.phone}</span>}
              {student.phone && student.email && <span>·</span>}
              {student.email && <span dir="ltr">{student.email}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">الكورسات</p>
          <p className="mt-1 text-xl font-bold text-gray-900">{enrollments.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">إجمالي المدفوعات</p>
          <p className="mt-1 text-xl font-bold text-gray-900">{totalPaid.toLocaleString("ar-EG")} ج.م</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">نسبة الحضور</p>
          <p className="mt-1 text-xl font-bold text-gray-900">{attendanceRate}%</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">المرحلة</p>
          <p className="mt-1 text-xl font-bold text-gray-900">{levelLabels[student.education_level] || "—"}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Enrollments */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">الكورسات المسجلة</h2>
          </div>
          {enrollments.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">لا توجد تسجيلات</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {enrollments.map((e: any) => (
                <div key={e.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{e.courses?.name_ar || "—"}</p>
                    <p className="text-xs text-gray-400">
                      {e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString("ar-EG") : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {e.completion_percent > 0 && (
                      <span className="text-xs text-gray-500">{e.completion_percent}%</span>
                    )}
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      e.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {e.status === "ACTIVE" ? "نشط" : e.status === "COMPLETED" ? "مكتمل" : e.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payments */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">المدفوعات</h2>
          </div>
          {payments.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">لا توجد مدفوعات</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {payments.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {Number(p.amount || 0).toLocaleString("ar-EG")} ج.م
                    </p>
                    <p className="text-xs text-gray-400">
                      {p.courses?.name_ar || "—"} · {methodLabels[p.method] || p.method}
                    </p>
                  </div>
                  <div className="text-end">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {p.status === "COMPLETED" ? "مكتمل" : "معلق"}
                    </span>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {p.paid_at ? new Date(p.paid_at).toLocaleDateString("ar-EG") : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
