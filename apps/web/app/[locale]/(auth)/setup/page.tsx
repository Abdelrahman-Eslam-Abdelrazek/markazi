"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "../../../../i18n/navigation";
import { createCenter, type SetupData } from "./actions";

const COLORS = [
  { label: "أزرق", value: "#2563EB" },
  { label: "بنفسجي", value: "#7C3AED" },
  { label: "أخضر", value: "#059669" },
  { label: "أحمر", value: "#DC2626" },
  { label: "برتقالي", value: "#EA580C" },
  { label: "وردي", value: "#DB2777" },
  { label: "نيلي", value: "#4338CA" },
  { label: "تركوازي", value: "#0891B2" },
];

export default function SetupPage() {
  const t = useTranslations("setup");
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const [data, setData] = useState<SetupData>({
    nameAr: "",
    nameEn: "",
    description: "",
    phone: "",
    whatsapp: "",
    email: "",
    primaryColor: "#2563EB",
    secondaryColor: "#F59E0B",
  });

  function update(field: keyof SetupData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function nextStep() {
    if (step === 1 && !data.nameAr.trim()) {
      setError(t("nameRequired"));
      return;
    }
    setError("");
    setStep((s) => Math.min(s + 1, 3));
  }

  function prevStep() {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit() {
    setError("");
    startTransition(async () => {
      const result = await createCenter(data);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-400">
          <span>{t("step")} {step} / 3</span>
          <span>{step === 1 ? t("stepInfo") : step === 2 ? t("stepContact") : t("stepBrand")}</span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? "bg-primary-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {/* Step 1: Center Info */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-xl">🏫</div>
            <h2 className="text-xl font-bold text-gray-900">{t("stepInfoTitle")}</h2>
            <p className="mt-1 text-sm text-gray-500">{t("stepInfoDesc")}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("nameAr")} *</label>
            <input
              type="text"
              value={data.nameAr}
              onChange={(e) => update("nameAr", e.target.value)}
              placeholder={t("nameArPlaceholder")}
              className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("nameEn")}</label>
            <input
              type="text"
              dir="ltr"
              value={data.nameEn}
              onChange={(e) => update("nameEn", e.target.value)}
              placeholder="Academy Name"
              className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("description")}</label>
            <textarea
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder={t("descriptionPlaceholder")}
              rows={3}
              className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>
      )}

      {/* Step 2: Contact */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-xl">📞</div>
            <h2 className="text-xl font-bold text-gray-900">{t("stepContactTitle")}</h2>
            <p className="mt-1 text-sm text-gray-500">{t("stepContactDesc")}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("phone")}</label>
            <input
              type="tel"
              dir="ltr"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="01xxxxxxxxx"
              className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("whatsapp")}</label>
            <input
              type="tel"
              dir="ltr"
              value={data.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value)}
              placeholder="01xxxxxxxxx"
              className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("centerEmail")}</label>
            <input
              type="email"
              dir="ltr"
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="info@academy.com"
              className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>
      )}

      {/* Step 3: Branding */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-xl">🎨</div>
            <h2 className="text-xl font-bold text-gray-900">{t("stepBrandTitle")}</h2>
            <p className="mt-1 text-sm text-gray-500">{t("stepBrandDesc")}</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">{t("primaryColor")}</label>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => update("primaryColor", c.value)}
                  className={`flex h-12 items-center justify-center rounded-lg border-2 text-xs font-medium text-white transition ${
                    data.primaryColor === c.value ? "border-gray-900 ring-2 ring-gray-900/20" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.value }}
                >
                  {data.primaryColor === c.value && "✓"}
                </button>
              ))}
            </div>
          </div>
          {/* Preview */}
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-3 text-xs font-medium text-gray-400">{t("preview")}</p>
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white"
                style={{ backgroundColor: data.primaryColor }}
              >
                {data.nameAr.charAt(0) || "م"}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{data.nameAr || "اسم المركز"}</p>
                <p className="text-xs text-gray-500">{data.nameEn || "Center Name"}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <span
                className="rounded-md px-3 py-1 text-xs font-medium text-white"
                style={{ backgroundColor: data.primaryColor }}
              >
                زر رئيسي
              </span>
              <span className="rounded-md border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                زر ثانوي
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {t("back")}
          </button>
        )}
        {step < 3 ? (
          <button
            type="button"
            onClick={nextStep}
            className="flex-1 rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            {t("next")}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
          >
            {isPending ? t("creating") : t("createCenter")}
          </button>
        )}
      </div>
    </div>
  );
}
