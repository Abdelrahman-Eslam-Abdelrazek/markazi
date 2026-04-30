"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "../../../../i18n/navigation";
import { signIn } from "../actions";
import { useState, useTransition } from "react";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await signIn(formData);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{t("welcomeBack")}</h2>
        <p className="mt-1 text-sm text-gray-500">{t("loginWithEmail")}</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="••••••••"
            className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
        >
          {isPending ? t("loading") : t("login")}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-medium text-primary-600 hover:text-primary-700">
          {t("createAccount")}
        </Link>
      </p>
    </div>
  );
}
