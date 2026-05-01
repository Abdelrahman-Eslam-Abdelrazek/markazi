"use client";

import { useState, useTransition } from "react";
import { updateAttendanceRecord } from "./actions";

type AttendanceRecord = {
  id: string;
  userId: string;
  name: string;
  status: string;
  recordedAt: string;
};

const statusConfig: Record<string, { label: string; bg: string; dot: string }> = {
  PRESENT: { label: "حاضر", bg: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500" },
  ABSENT: { label: "غائب", bg: "bg-red-100 text-red-800", dot: "bg-red-500" },
  LATE: { label: "متأخر", bg: "bg-amber-100 text-amber-800", dot: "bg-amber-500" },
};

export function AttendanceEditor({
  sessionId,
  records: initialRecords,
}: {
  sessionId: string;
  records: AttendanceRecord[];
}) {
  const [records, setRecords] = useState(initialRecords);
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  function cycleStatus(recordId: string, currentStatus: string) {
    const next =
      currentStatus === "PRESENT"
        ? "ABSENT"
        : currentStatus === "ABSENT"
          ? "LATE"
          : "PRESENT";

    setRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, status: next } : r)),
    );
    setUpdatingId(recordId);

    startTransition(async () => {
      const result = await updateAttendanceRecord(recordId, next);
      if (result.error) {
        setRecords((prev) =>
          prev.map((r) =>
            r.id === recordId ? { ...r, status: currentStatus } : r,
          ),
        );
      }
      setUpdatingId(null);
    });
  }

  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center">
        <p className="text-sm text-gray-500">لا توجد سجلات حضور في هذه الجلسة</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white shadow-sm">
      {records.map((record) => {
        const config = statusConfig[record.status] ?? { label: "غائب", bg: "bg-red-100 text-red-800", dot: "bg-red-500" };
        return (
          <button
            key={record.id}
            type="button"
            onClick={() => cycleStatus(record.id, record.status)}
            disabled={isPending && updatingId === record.id}
            className="flex w-full items-center justify-between px-4 py-3 text-start transition hover:bg-gray-50 disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                {record.name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-900">{record.name}</span>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
              {config.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
