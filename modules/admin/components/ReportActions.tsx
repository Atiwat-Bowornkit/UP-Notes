"use client";

import { useState, useTransition } from "react";
import {
  deleteReportedNote,
  dismissReports,
  type ActionState,
} from "@/modules/admin/actions";

export default function ReportActions({ noteId }: { noteId: string }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState | null>(null);

  function run(action: (id: string) => Promise<ActionState>, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    startTransition(async () => {
      setResult(await action(noteId));
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          type="button"
          className="btn-ghost"
          disabled={pending}
          onClick={() => run(dismissReports)}
        >
          ยกเลิกการรายงาน (Dismiss)
        </button>
        <button
          type="button"
          className="btn bg-danger text-white hover:opacity-90"
          disabled={pending}
          onClick={() =>
            run(deleteReportedNote, "ลบโน้ตย่อนี้ถาวร (ทั้งไฟล์และข้อมูล) ใช่หรือไม่?")
          }
        >
          ลบโน้ตย่อ (Delete Note)
        </button>
      </div>
      {result && (
        <p role="status" className={result.ok ? "text-sm text-success" : "text-sm text-danger"}>
          {result.message}
        </p>
      )}
    </div>
  );
}
