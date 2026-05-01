"use client";

import { useState } from "react";
import { Link } from "../../../../i18n/navigation";

type Student = {
  id: string;
  user_id: string;
  is_active: boolean;
  joined_at: string | null;
  users: {
    name_ar: string | null;
    name_en: string | null;
    phone: string | null;
    email: string | null;
    education_level: string | null;
  } | null;
  enrollmentCount: number;
};

type Props = {
  students: Student[];
  translations: {
    name: string;
    phone: string;
    email: string;
    level: string;
    status: string;
    active: string;
    inactive: string;
  };
};

export function StudentsTable({ students, translations: t }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const filtered = students.filter((m) => {
    const user = m.users;
    if (!user) return false;

    if (statusFilter === "active" && !m.is_active) return false;
    if (statusFilter === "inactive" && m.is_active) return false;

    if (search) {
      const q = search.toLowerCase();
      const matchName = (user.name_ar || "").toLowerCase().includes(q) || (user.name_en || "").toLowerCase().includes(q);
      const matchPhone = (user.phone || "").includes(q);
      const matchEmail = (user.email || "").toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchEmail) return false;
    }

    return true;
  });

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
            placeholder="بحث بالاسم أو الهاتف أو الإيميل..."
            className="h-10 w-full rounded-lg border border-gray-300 bg-white pe-3 ps-9 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
          {(["all", "active", "inactive"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                statusFilter === s
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {s === "all" ? "الكل" : s === "active" ? t.active : t.inactive}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {(search || statusFilter !== "all") && (
        <p className="text-xs text-gray-500">
          {filtered.length} نتيجة {search && `"${search}"`}
        </p>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t.name}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t.phone}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t.email}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t.level}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">الكورسات</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                    {search ? "لا توجد نتائج مطابقة" : "لا يوجد طلاب"}
                  </td>
                </tr>
              ) : (
                filtered.map((membership) => {
                  const user = membership.users;
                  if (!user) return null;
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
                        {membership.enrollmentCount > 0 ? `${membership.enrollmentCount} كورس` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          membership.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          {membership.is_active ? t.active : t.inactive}
                        </span>
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
