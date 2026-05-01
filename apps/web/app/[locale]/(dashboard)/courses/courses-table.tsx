"use client";

import { useState } from "react";
import { Link } from "../../../../i18n/navigation";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PUBLISHED: "bg-emerald-50 text-emerald-700",
  ARCHIVED: "bg-amber-50 text-amber-700",
};

const statusLabels: Record<string, string> = {
  DRAFT: "مسودة",
  PUBLISHED: "منشور",
  ARCHIVED: "مؤرشف",
};

type Course = {
  id: string;
  name_ar: string;
  name_en: string | null;
  price: number | null;
  is_free: boolean;
  status: string;
  level: string | null;
  subject: string | null;
  max_students: number | null;
  start_date: string | null;
  enrollmentCount: number;
};

type Props = {
  courses: Course[];
  translations: {
    name: string;
    status: string;
    students: string;
    price: string;
    level: string;
    startDate: string;
    free: string;
  };
};

export function CoursesTable({ courses, translations: t }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "DRAFT" | "PUBLISHED" | "ARCHIVED">("all");

  const filtered = courses.filter((course) => {
    if (statusFilter !== "all" && course.status !== statusFilter) return false;

    if (search) {
      const q = search.toLowerCase();
      const matchName = course.name_ar.toLowerCase().includes(q) || (course.name_en || "").toLowerCase().includes(q);
      const matchSubject = (course.subject || "").toLowerCase().includes(q);
      if (!matchName && !matchSubject) return false;
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
            placeholder="بحث بالاسم أو المادة..."
            className="h-10 w-full rounded-lg border border-gray-300 bg-white pe-3 ps-9 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
          {(["all", "PUBLISHED", "DRAFT", "ARCHIVED"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                statusFilter === s
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {s === "all" ? "الكل" : statusLabels[s]}
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
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t.status}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t.students}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t.price}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t.level}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-gray-500">{t.startDate}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                    {search ? "لا توجد نتائج مطابقة" : "لا توجد كورسات"}
                  </td>
                </tr>
              ) : (
                filtered.map((course) => (
                  <tr key={course.id} className="transition hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <Link href={`/courses/${course.id}`} className="group">
                        <p className="font-medium text-gray-900 group-hover:text-primary-600">{course.name_ar}</p>
                        {course.subject && (
                          <p className="mt-0.5 text-xs text-gray-400">{course.subject}</p>
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[course.status] || statusColors.DRAFT}`}>
                        {statusLabels[course.status] || course.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span>{course.enrollmentCount}</span>
                        {course.max_students && (
                          <span className="text-gray-400">/ {course.max_students}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {course.is_free ? (
                        <span className="font-medium text-emerald-600">{t.free}</span>
                      ) : (
                        <span>{Number(course.price || 0).toLocaleString("ar-EG")} ج.م</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{course.level || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {course.start_date
                        ? new Date(course.start_date).toLocaleDateString("ar-EG")
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
