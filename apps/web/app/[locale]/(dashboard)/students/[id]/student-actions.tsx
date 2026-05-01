"use client";

import { useState, useTransition } from "react";
import { useRouter } from "../../../../../i18n/navigation";
import { toggleStudentStatus, removeStudent } from "./actions";

export function StudentStatusToggle({ membershipId, isActive }: { membershipId: string; isActive: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleStudentStatus(membershipId);
      if (!result.error) router.refresh();
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition disabled:opacity-50 ${
        isActive
          ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
          : "bg-emerald-600 text-white hover:bg-emerald-700"
      }`}
    >
      {isActive ? (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          {isPending ? "..." : "تعطيل"}
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {isPending ? "..." : "تفعيل"}
        </>
      )}
    </button>
  );
}

export function RemoveStudentButton({ membershipId }: { membershipId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function handleRemove() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      const result = await removeStudent(membershipId);
      if (!result.error) {
        router.push("/students");
        router.refresh();
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      {confirming && (
        <button
          onClick={() => setConfirming(false)}
          className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100"
        >
          إلغاء
        </button>
      )}
      <button
        onClick={handleRemove}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition disabled:opacity-50 ${
          confirming
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-red-50 text-red-600 hover:bg-red-100"
        }`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766z" />
        </svg>
        {isPending ? "..." : confirming ? "تأكيد الإزالة" : "إزالة"}
      </button>
    </div>
  );
}
