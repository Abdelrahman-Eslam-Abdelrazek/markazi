import { getTranslations } from "next-intl/server";
import { requireCenter } from "../get-center";
import { Link } from "../../../../i18n/navigation";
import { PaymentsTable } from "./payments-table";

export default async function PaymentsPage() {
  const t = await getTranslations("payments");
  const ctx = await requireCenter();
  if (!ctx) return null;

  const { data: payments } = await ctx.supabase
    .from("payments")
    .select("id, user_id, course_id, amount, currency, status, method, is_manual, paid_at, created_at, users(name_ar, name_en), courses(name_ar)")
    .eq("center_id", ctx.centerId)
    .order("created_at", { ascending: false })
    .limit(50);

  const paymentList = payments || [];

  const totals = paymentList.reduce(
    (acc: any, p: any) => {
      if (p.status === "COMPLETED") acc.completed += Number(p.amount || 0);
      if (p.status === "PENDING") acc.pending += Number(p.amount || 0);
      return acc;
    },
    { completed: 0, pending: 0 },
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {paymentList.length > 0
              ? `${paymentList.length} عملية دفع`
              : "لا توجد مدفوعات بعد"}
          </p>
        </div>
        <Link
          href="/payments/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {t("record")}
        </Link>
      </div>

      {/* Summary Cards */}
      {paymentList.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">إجمالي المدفوعات</p>
            <p className="mt-1 text-xl font-bold text-gray-900">{totals.completed.toLocaleString("ar-EG")} ج.م</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">معلقة</p>
            <p className="mt-1 text-xl font-bold text-amber-600">{totals.pending.toLocaleString("ar-EG")} ج.م</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">عدد العمليات</p>
            <p className="mt-1 text-xl font-bold text-gray-900">{paymentList.length}</p>
          </div>
        </div>
      )}

      {paymentList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <div className="mb-4 rounded-2xl bg-amber-50 p-4">
            <svg className="h-10 w-10 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-semibold text-gray-900">لا توجد مدفوعات بعد</h3>
          <p className="mb-6 max-w-sm text-sm text-gray-500">
            سجّل أول دفعة يدوياً أو فعّل المدفوعات الإلكترونية.
          </p>
          <Link
            href="/payments/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            {t("record")}
          </Link>
        </div>
      ) : (
        <PaymentsTable
          payments={paymentList}
          translations={{
            amount: t("amount"),
            method: t("method"),
            status: t("status"),
            date: t("date"),
          }}
        />
      )}
    </div>
  );
}
