"use client";

import { useState, useTransition } from "react";
import { useRouter } from "../../../../../i18n/navigation";
import { unenrollStudent } from "./actions";

export function UnenrollButton({ enrollmentId }: { enrollmentId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function handleUnenroll() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      const result = await unenrollStudent(enrollmentId);
      if (!result.error) router.refresh();
      setConfirming(false);
    });
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => setConfirming(false)}
          className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
        >
          إلغاء
        </button>
        <button
          onClick={handleUnenroll}
          disabled={isPending}
          className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {isPending ? "..." : "تأكيد"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleUnenroll}
      className="rounded p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
      title="إلغاء التسجيل"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}
