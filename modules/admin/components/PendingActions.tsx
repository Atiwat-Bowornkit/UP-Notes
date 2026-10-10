"use client";

import { useState, useTransition } from "react";
import {
  approvePendingNote,
  rejectPendingNote,
  type ActionState,
} from "@/modules/admin/actions";

export default function PendingActions({ noteId }: { noteId: string }) {
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
          className="btn-primary"
          disabled={pending}
          onClick={() => run(approvePendingNote)}
        >
          อนุมัติ (Approve)
        </button>
        <button
          type="button"
          className="btn bg-danger text-white hover:opacity-90"
          disabled={pending}
          onClick={() =>
            run(rejectPendingNote, "ปฏิเสธและลบโน้ตย่อนี้ถาวร (ทั้งไฟล์และข้อมูล) ใช่หรือไม่?")
          }
        >
          ปฏิเสธ (Reject)
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
