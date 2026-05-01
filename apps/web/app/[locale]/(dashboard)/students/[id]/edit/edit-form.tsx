"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "../../../../../../i18n/navigation";
import { updateStudent } from "../actions";

const LEVELS = [
  { value: "PRIMARY", label: "ابتدائي" },
  { value: "PREPARATORY", label: "إعدادي" },
  { value: "SECONDARY", label: "ثانوي" },
  { value: "UNIVERSITY", label: "جامعي" },
];

type Student = {
  id: string;
  name_ar: string | null;
  name_en: string | null;
  phone: string | null;
  email: string | null;
  gender: string | null;
  education_level: string | null;
};

export function EditStudentForm({ membershipId, student }: { membershipId: string; student: Student }) {
  const t = useTranslations("students");
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateStudent(membershipId, form);
      if (result.error) {
        setError(result.error);
      } else {
        router.push(`/students/${membershipId}`);
        router.refresh();
      }
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">تعديل بيانات الطالب</h1>
        <p className="mt-1 text-sm text-gray-500">{student.name_ar || student.name_en}</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">بيانات الطالب</h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name_ar" className="mb-1 block text-sm font-medium text-gray-700">
                  الاسم (عربي) *
                </label>
                <input
                  id="name_ar"
                  name="name_ar"
                  type="text"
                  required
                  defaultValue={student.name_ar || ""}
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div>
                <label htmlFor="name_en" className="mb-1 block text-sm font-medium text-gray-700">
                  الاسم (إنجليزي)
                </label>
                <input
                  id="name_en"
                  name="name_en"
                  type="text"
                  dir="ltr"
                  defaultValue={student.name_en || ""}
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
                  رقم الهاتف
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  dir="ltr"
                  defaultValue={student.phone || ""}
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  dir="ltr"
                  defaultValue={student.email || ""}
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="level" className="mb-1 block text-sm font-medium text-gray-700">
                  المرحلة الدراسية
                </label>
                <select
                  id="level"
                  name="level"
                  defaultValue={student.education_level || ""}
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">اختر المرحلة</option>
                  {LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="gender" className="mb-1 block text-sm font-medium text-gray-700">
                  النوع
                </label>
                <select
                  id="gender"
                  name="gender"
                  defaultValue={student.gender || ""}
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">—</option>
                  <option value="MALE">ذكر</option>
                  <option value="FEMALE">أنثى</option>
                </select>
              </div>
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
            {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>
        </div>
      </form>
    </div>
  );
}
