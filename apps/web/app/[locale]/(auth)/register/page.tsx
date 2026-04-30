"use client";

import { useTranslations } from "next-intl";
import { Link } from "../../../../i18n/navigation";
import { signUp } from "../actions";
import { useActionState } from "react";

export default function RegisterPage() {
  const t = useTranslations("auth");

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await signUp(formData);
      return result ?? null;
    },
    null,
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{t("createAccount")}</h2>
        <p className="mt-1 text-sm text-gray-500">{t("registerSubtitle")}</p>
      </div>

      {state?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
            {t("fullName")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder={t("fullNamePlaceholder")}
            className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            dir="ltr"
            placeholder="name@example.com"
            className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            {t("password")}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            dir="ltr"
            minLength={6}
            placeholder="••••••••"
            className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
          <p className="mt-1 text-xs text-gray-400">{t("passwordHint")}</p>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
        >
          {pending ? t("loading") : t("createAccount")}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        {t("hasAccount")}{" "}
        <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
          {t("login")}
        </Link>
      </p>
    </div>
  );
}
