"use client";

import { useState, useTransition } from "react";
import { useRouter } from "../../../../../i18n/navigation";
import { addInstructor } from "./actions";

export default function NewInstructorPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await addInstructor(form);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/instructors");
        router.refresh();
      }
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">إضافة مدرس</h1>
        <p className="mt-1 text-sm text-gray-500">أضف مدرس جديد لمركزك</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">بيانات المدرس</h2>
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
                  placeholder="أ/ محمد أحمد"
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
                  placeholder="Mohamed Ahmed"
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
                  رقم الهاتف *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="01xxxxxxxxx"
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
                  placeholder="instructor@email.com"
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
            <div>
              <label htmlFor="gender" className="mb-1 block text-sm font-medium text-gray-700">
                النوع
              </label>
              <select
                id="gender"
                name="gender"
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">—</option>
                <option value="MALE">ذكر</option>
                <option value="FEMALE">أنثى</option>
              </select>
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
            {isPending ? "جاري الإضافة..." : "إضافة مدرس"}
          </button>
        </div>
      </form>
    </div>
  );
}
