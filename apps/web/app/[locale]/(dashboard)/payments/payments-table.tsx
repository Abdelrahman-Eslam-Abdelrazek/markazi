"use client";

import { useState } from "react";
import { Link } from "../../../../i18n/navigation";

const statusColors: Record<string, string> = {
  COMPLETED: "bg-emerald-50 text-emerald-700",
  PENDING: "bg-amber-50 text-amber-700",
  FAILED: "bg-red-50 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-600",
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

type Payment = {
  id: string;
  amount: number;
  status: string;
  method: string | null;
  paid_at: string | null;
  created_at: string;
  users: { name_ar: string | null; name_en: string | null }[] | { name_ar: string | null; name_en: string | null } | null;
  courses: { name_ar: string | null }[] | { name_ar: string | null } | null;
};

type Props = {
  payments: Payment[];
  translations: {
    amount: string;
    method: string;
    status: string;
    date: string;
  };
};

export function PaymentsTable({ payments, translations: t }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");

  const getUser = (p: Payment) => Array.isArray(p.users) ? p.users[0] : p.users;
  const getCourse = (p: Payment) => Array.isArray(p.courses) ? p.courses[0] : p.courses;

  const filtered = payments.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (methodFilter !== "all" && p.method !== methodFilter) return false;

    if (search) {
      const q = search.toLowerCase();
      const user = getUser(p);
      const course = getCourse(p);
      const matchStudent = (user?.name_ar || "").toLowerCase().includes(q) || (user?.name_en || "").toLowerCase().includes(q);
      const matchCourse = (course?.name_ar || "").toLowerCase().includes(q);
      if (!matchStudent && !matchCourse) return false;
    }

    return true;
  });

  const filteredTotal = filtered
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const methods = [...new Set(payments.map((p) => p.method).filter(Boolean))];

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو الكورس..."
            className="h-10 w-full rounded-lg border border-gray-300 bg-white pe-3 ps-9 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs font-medium text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="all">كل الحالات</option>
            <option value="COMPLETED">مكتمل</option>
            <option value="PENDING">معلق</option>
            <option value="FAILED">فشل</option>
            <option value="REFUNDED">مسترد</option>
          </select>
          {methods.length > 1 && (
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs font-medium text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">كل الطرق</option>
              {methods.map((m) => (
                <option key={m} value={m!}>{methodLabels[m!] || m}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Results */}
      {(search || statusFilter !== "all" || methodFilter !== "all") && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{filtered.length} نتيجة {search && `"${search}"`}</span>
          {filtered.length > 0 && (
            <span>إجمالي المكتمل: {filteredTotal.toLocaleString("ar-EG")} ج.م</span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">الطالب</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">الكورس</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t.amount}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t.method}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t.status}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t.date}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                    {search ? "لا توجد نتائج مطابقة" : "لا توجد مدفوعات"}
                  </td>
                </tr>
              ) : (
                filtered.map((payment) => {
                  const user = getUser(payment);
                  const course = getCourse(payment);
                  return (
                  <tr key={payment.id} className="transition hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {user?.name_ar || user?.name_en || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {course?.name_ar || "—"}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <Link href={`/payments/${payment.id}`} className="transition hover:text-primary-600">
                        {Number(payment.amount || 0).toLocaleString("ar-EG")} ج.م
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {methodLabels[payment.method || ""] || payment.method || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[payment.status] || "bg-gray-100 text-gray-600"}`}>
                        {statusLabels[payment.status] || payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {payment.paid_at
                        ? new Date(payment.paid_at).toLocaleDateString("ar-EG")
                        : new Date(payment.created_at).toLocaleDateString("ar-EG")}
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
