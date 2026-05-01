"use client";

import { useState, useTransition } from "react";
import { useRouter } from "../../../../../i18n/navigation";
import { enrollStudent } from "./actions";

export function EnrollStudentForm({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    form.set("course_id", courseId);

    startTransition(async () => {
      const result = await enrollStudent(form);
      if (result.error) {
        setError(result.error);
      } else {
        setOpen(false);
        router.refresh();
      }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 transition hover:bg-primary-100"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        تسجيل طالب
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      {error && <span className="text-xs text-red-600">{error}</span>}
      <input
        name="phone"
        type="tel"
        required
        dir="ltr"
        placeholder="رقم هاتف الطالب"
        className="h-8 w-40 rounded-lg border border-gray-300 bg-white px-2 text-xs placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/20"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
      >
        {isPending ? "..." : "تسجيل"}
      </button>
      <button
        type="button"
        onClick={() => { setOpen(false); setError(""); }}
        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </form>
  );
}
