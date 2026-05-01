"use client";

import { useState, useTransition, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "../../../../../i18n/navigation";
import { getCourseStudents, submitAttendance } from "./actions";

type CourseOption = { id: string; name: string };
type StudentRow = { userId: string; name: string; status: "PRESENT" | "ABSENT" | "LATE" };

export default function NewAttendancePage() {
  const t = useTranslations("attendance");
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    getCourseStudents("").then((data) => {
      if (data.courses) setCourses(data.courses);
    });
  }, []);

  async function loadStudents(courseId: string) {
    setSelectedCourse(courseId);
    if (!courseId) {
      setStudents([]);
      return;
    }
    setLoadingStudents(true);
    const data = await getCourseStudents(courseId);
    setStudents(
      (data.students || []).map((s: any) => ({
        userId: s.userId,
        name: s.name,
        status: "PRESENT" as const,
      })),
    );
    setLoadingStudents(false);
  }

  function toggleStatus(userId: string) {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.userId !== userId) return s;
        const next = s.status === "PRESENT" ? "ABSENT" : s.status === "ABSENT" ? "LATE" : "PRESENT";
        return { ...s, status: next };
      }),
    );
  }

  function markAll(status: "PRESENT" | "ABSENT") {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  }

  function handleSubmit() {
    if (!selectedCourse) {
      setError("اختر الكورس أولاً");
      return;
    }
    setError("");
    startTransition(async () => {
      const result = await submitAttendance({
        courseId: selectedCourse,
        records: students.map((s) => ({ userId: s.userId, status: s.status })),
      });
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/attendance");
        router.refresh();
      }
    });
  }

  const statusConfig = {
    PRESENT: { label: t("present"), bg: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500" },
    ABSENT: { label: t("absent"), bg: "bg-red-100 text-red-800", dot: "bg-red-500" },
    LATE: { label: t("late"), bg: "bg-amber-100 text-amber-800", dot: "bg-amber-500" },
  };

  const presentCount = students.filter((s) => s.status === "PRESENT").length;
  const absentCount = students.filter((s) => s.status === "ABSENT").length;
  const lateCount = students.filter((s) => s.status === "LATE").length;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("takeAttendance")}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {new Date().toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <label htmlFor="course" className="mb-1 block text-sm font-medium text-gray-700">
          الكورس *
        </label>
        <select
          id="course"
          value={selectedCourse}
          onChange={(e) => loadStudents(e.target.value)}
          className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">اختر الكورس</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loadingStudents && (
        <div className="py-8 text-center text-sm text-gray-500">جاري التحميل...</div>
      )}

      {students.length > 0 && (
        <>
          {/* Summary */}
          <div className="flex gap-3">
            <div className="flex-1 rounded-lg bg-emerald-50 p-3 text-center">
              <p className="text-lg font-bold text-emerald-700">{presentCount}</p>
              <p className="text-xs text-emerald-600">{t("present")}</p>
            </div>
            <div className="flex-1 rounded-lg bg-red-50 p-3 text-center">
              <p className="text-lg font-bold text-red-700">{absentCount}</p>
              <p className="text-xs text-red-600">{t("absent")}</p>
            </div>
            <div className="flex-1 rounded-lg bg-amber-50 p-3 text-center">
              <p className="text-lg font-bold text-amber-700">{lateCount}</p>
              <p className="text-xs text-amber-600">{t("late")}</p>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => markAll("PRESENT")}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
            >
              تحضير الكل
            </button>
            <button
              type="button"
              onClick={() => markAll("ABSENT")}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
            >
              تغيب الكل
            </button>
          </div>

          {/* Student List */}
          <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white shadow-sm">
            {students.map((student) => {
              const config = statusConfig[student.status];
              return (
                <button
                  key={student.userId}
                  type="button"
                  onClick={() => toggleStatus(student.userId)}
                  className="flex w-full items-center justify-between px-4 py-3 text-start transition hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                      {student.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{student.name}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                    {config.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="flex-1 rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
            >
              {isPending ? "جاري الحفظ..." : "حفظ الحضور"}
            </button>
          </div>
        </>
      )}

      {selectedCourse && !loadingStudents && students.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center">
          <p className="text-sm font-medium text-gray-500">لا يوجد طلاب مسجلين في هذا الكورس</p>
          <p className="mt-1 text-xs text-gray-400">أضف طلاب للكورس أولاً</p>
        </div>
      )}
    </div>
  );
}
