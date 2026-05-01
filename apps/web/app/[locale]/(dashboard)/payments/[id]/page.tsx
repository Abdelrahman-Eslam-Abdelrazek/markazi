import { requireCenter } from "../../get-center";
import { notFound } from "next/navigation";
import { Link } from "../../../../../i18n/navigation";
import { PrintButton } from "./print-button";

const statusColors: Record<string, string> = {
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
  REFUNDED: "bg-gray-100 text-gray-600 border-gray-200",
};

const statusLabels: Record<string, string> = {
  COMPLETED: "مكتمل",
  PENDING: "معلق",
  FAILED: "فشل",
  REFUNDED: "مسترد",
};

const methodLabels: Record<string, string> = {
  CASH: "كاش",
  FAWRY: "فوري",
  VODAFONE_CASH: "فودافون كاش",
  INSTAPAY: "إنستاباي",
  VISA: "فيزا",
  MASTERCARD: "ماستركارد",
  BANK_TRANSFER: "تحويل بنكي",
};

export default async function PaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await requireCenter();
  if (!ctx) return null;

  const { data: payment } = await ctx.supabase
    .from("payments")
    .select("*, users(name_ar, name_en, phone, email), courses(name_ar, price)")
    .eq("id", id)
    .eq("center_id", ctx.centerId)
    .single();

  if (!payment) notFound();

  const user = Array.isArray(payment.users) ? payment.users[0] : payment.users;
  const course = Array.isArray(payment.courses) ? payment.courses[0] : payment.courses;

  const { data: center } = await ctx.supabase
    .from("centers")
    .select("name_ar, phone, email")
    .eq("id", ctx.centerId)
    .single();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/payments" className="text-gray-500 transition hover:text-gray-700">المدفوعات</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900">تفاصيل الدفعة</span>
      </div>

      {/* Receipt Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm print:border-none print:shadow-none">
        {/* Header */}
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{center?.name_ar || "مركزي"}</h1>
              <p className="mt-0.5 text-xs text-gray-500">
                {center?.phone && <span dir="ltr">{center.phone}</span>}
                {center?.phone && center?.email && <span> · </span>}
                {center?.email && <span dir="ltr">{center.email}</span>}
              </p>
            </div>
            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusColors[payment.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
              {statusLabels[payment.status] || payment.status}
            </span>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="space-y-6 p-6">
          {/* Amount */}
          <div className="text-center">
            <p className="text-sm text-gray-500">المبلغ</p>
            <p className="mt-1 text-4xl font-bold text-gray-900">
              {Number(payment.amount || 0).toLocaleString("ar-EG")}
              <span className="ms-1 text-lg font-medium text-gray-500">ج.م</span>
            </p>
          </div>

          {/* Details Grid */}
          <div className="divide-y divide-gray-100 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-500">الطالب</span>
              <span className="text-sm font-medium text-gray-900">{user?.name_ar || user?.name_en || "—"}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-500">الهاتف</span>
                <span className="text-sm font-medium text-gray-900" dir="ltr">{user.phone}</span>
              </div>
            )}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-500">الكورس</span>
              <span className="text-sm font-medium text-gray-900">{course?.name_ar || "—"}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-500">طريقة الدفع</span>
              <span className="text-sm font-medium text-gray-900">{methodLabels[payment.method] || payment.method || "—"}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-500">التاريخ</span>
              <span className="text-sm font-medium text-gray-900">
                {(payment.paid_at || payment.created_at)
                  ? new Date(payment.paid_at || payment.created_at).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </span>
            </div>
            {payment.is_manual && (
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-500">النوع</span>
                <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">تسجيل يدوي</span>
              </div>
            )}
            {payment.manual_notes && (
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-500">ملاحظات</span>
                <span className="text-sm text-gray-700">{payment.manual_notes}</span>
              </div>
            )}
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-500">رقم العملية</span>
              <span className="font-mono text-xs text-gray-500" dir="ltr">{payment.id.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 print:hidden">
          <div className="flex gap-3">
            <Link
              href="/payments"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              العودة
            </Link>
            <PrintButton />
          </div>
        </div>
      </div>
    </div>
  );
}
