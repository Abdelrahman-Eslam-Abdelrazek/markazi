"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "../../../../../i18n/navigation";
import { createCourse } from "./actions";

const LEVELS = [
  { value: "PRIMARY", label: "ابتدائي" },
  { value: "PREPARATORY", label: "إعدادي" },
  { value: "SECONDARY", label: "ثانوي" },
  { value: "UNIVERSITY", label: "جامعي" },
  { value: "PROFESSIONAL", label: "تدريب مهني" },
];

export default function NewCoursePage() {
  const t = useTranslations("courses");
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createCourse(form);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/courses");
        router.refresh();
      }
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("create")}</h1>
        <p className="mt-1 text-sm text-gray-500">أضف كورس جديد لمركزك</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">المعلومات الأساسية</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name_ar" className="mb-1 block text-sm font-medium text-gray-700">
                {t("name")} (عربي) *
              </label>
              <input
                id="name_ar"
                name="name_ar"
                type="text"
                required
                placeholder="مثال: رياضيات - الصف الثالث الثانوي"
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label htmlFor="name_en" className="mb-1 block text-sm font-medium text-gray-700">
                {t("name")} (إنجليزي)
              </label>
              <input
                id="name_en"
                name="name_en"
                type="text"
                dir="ltr"
                placeholder="Mathematics - Grade 12"
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
                {t("description")}
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="وصف مختصر للكورس..."
                className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">التفاصيل</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="level" className="mb-1 block text-sm font-medium text-gray-700">
                {t("level")}
              </label>
              <select
                id="level"
                name="level"
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">اختر المستوى</option>
                {LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="subject" className="mb-1 block text-sm font-medium text-gray-700">
                {t("subject")}
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="مثال: رياضيات"
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label htmlFor="price" className="mb-1 block text-sm font-medium text-gray-700">
                {t("price")} (ج.م)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                dir="ltr"
                placeholder="0.00"
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <p className="mt-1 text-xs text-gray-400">اتركه فارغاً للكورسات المجانية</p>
            </div>
            <div>
              <label htmlFor="max_students" className="mb-1 block text-sm font-medium text-gray-700">
                {t("maxStudents")}
              </label>
              <input
                id="max_students"
                name="max_students"
                type="number"
                min="1"
                dir="ltr"
                placeholder="30"
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label htmlFor="start_date" className="mb-1 block text-sm font-medium text-gray-700">
                {t("startDate")}
              </label>
              <input
                id="start_date"
                name="start_date"
                type="date"
                dir="ltr"
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label htmlFor="end_date" className="mb-1 block text-sm font-medium text-gray-700">
                {t("endDate")}
              </label>
              <input
                id="end_date"
                name="end_date"
                type="date"
                dir="ltr"
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
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
            {isPending ? "جاري الإنشاء..." : t("create")}
          </button>
        </div>
      </form>
    </div>
  );
}
