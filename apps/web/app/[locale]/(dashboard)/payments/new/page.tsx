"use client";

import { useState, useTransition, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "../../../../../i18n/navigation";
import { recordPayment, getStudentsAndCourses } from "./actions";

const METHODS = [
  { value: "CASH", label: "كاش" },
  { value: "FAWRY", label: "فوري" },
  { value: "VODAFONE_CASH", label: "فودافون كاش" },
  { value: "INSTAPAY", label: "إنستاباي" },
  { value: "BANK_TRANSFER", label: "تحويل بنكي" },
];

type StudentOption = { id: string; name: string };
type CourseOption = { id: string; name: string; price: number };

export default function NewPaymentPage() {
  const t = useTranslations("payments");
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    getStudentsAndCourses().then((data) => {
      if (data.students) setStudents(data.students);
      if (data.courses) setCourses(data.courses);
    });
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await recordPayment(form);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/payments");
        router.refresh();
      }
    });
  }

  const coursePrice = courses.find((c) => c.id === selectedCourse)?.price || 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("record")}</h1>
        <p className="mt-1 text-sm text-gray-500">سجّل دفعة جديدة لطالب</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">بيانات الدفعة</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="user_id" className="mb-1 block text-sm font-medium text-gray-700">
                الطالب *
              </label>
              <select
                id="user_id"
                name="user_id"
                required
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">اختر الطالب</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="course_id" className="mb-1 block text-sm font-medium text-gray-700">
                الكورس *
              </label>
              <select
                id="course_id"
                name="course_id"
                required
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">اختر الكورس</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.price > 0 ? `(${c.price} ج.م)` : "(مجاني)"}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="amount" className="mb-1 block text-sm font-medium text-gray-700">
                  {t("amount")} (ج.م) *
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  dir="ltr"
                  defaultValue={coursePrice > 0 ? coursePrice : ""}
                  placeholder="0.00"
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div>
                <label htmlFor="method" className="mb-1 block text-sm font-medium text-gray-700">
                  {t("method")} *
                </label>
                <select
                  id="method"
                  name="method"
                  required
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  {METHODS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">
                ملاحظات
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                placeholder="أي ملاحظات إضافية..."
                className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
          >
            {isPending ? "جاري التسجيل..." : t("record")}
          </button>
        </div>
      </form>
    </div>
  );
}
