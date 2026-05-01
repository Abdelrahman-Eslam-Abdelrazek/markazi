"use client";

import { useState, useTransition } from "react";
import { useRouter } from "../../../../../i18n/navigation";
import { updateCenter } from "./actions";

const COLORS = [
  "#2563EB", "#7C3AED", "#059669", "#DC2626",
  "#D97706", "#0891B2", "#DB2777", "#4F46E5",
];

type Center = {
  name_ar: string;
  name_en: string | null;
  description: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  primary_color: string | null;
};

export function EditCenterForm({ center }: { center: Center }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [color, setColor] = useState(center.primary_color || "#2563EB");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const form = new FormData(e.currentTarget);
    form.set("primary_color", color);

    startTransition(async () => {
      const result = await updateCenter(form);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">تم الحفظ بنجاح</div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-gray-900">المعلومات الأساسية</h3>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name_ar" className="mb-1 block text-sm font-medium text-gray-700">
                اسم المركز (عربي) *
              </label>
              <input
                id="name_ar"
                name="name_ar"
                type="text"
                required
                defaultValue={center.name_ar}
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label htmlFor="name_en" className="mb-1 block text-sm font-medium text-gray-700">
                اسم المركز (إنجليزي)
              </label>
              <input
                id="name_en"
                name="name_en"
                type="text"
                dir="ltr"
                defaultValue={center.name_en || ""}
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
              الوصف
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={center.description || ""}
              className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-gray-900">بيانات التواصل</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
              الهاتف
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              dir="ltr"
              defaultValue={center.phone || ""}
              className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label htmlFor="whatsapp" className="mb-1 block text-sm font-medium text-gray-700">
              واتساب
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              dir="ltr"
              defaultValue={center.whatsapp || ""}
              className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              name="email"
              type="email"
              dir="ltr"
              defaultValue={center.email || ""}
              className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-gray-900">الهوية البصرية</h3>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">اللون الرئيسي</label>
          <div className="flex flex-wrap gap-3">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-10 w-10 rounded-xl border-2 transition ${
                  color === c ? "border-gray-900 ring-2 ring-gray-900/20" : "border-transparent hover:scale-110"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-lg border border-gray-300"
              />
              <span className="text-xs text-gray-500" dir="ltr">{color}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-gray-500">معاينة:</span>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: color }}
            >
              {center.name_ar.charAt(0)}
            </div>
            <button
              type="button"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: color }}
            >
              زر تجريبي
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
        >
          {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
      </div>
    </form>
  );
}
