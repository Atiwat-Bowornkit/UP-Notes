"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitReport, type ActionState } from "@/modules/admin/actions";
import { REPORT_REASONS, REPORT_REASON_LABELS } from "@/src/utils/reportHelper";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? "กำลังส่ง..." : "ส่งรายงาน"}
    </button>
  );
}

/** Drop this on the note detail page: <ReportNoteForm noteId={note.id} /> */
export default function ReportNoteForm({ noteId }: { noteId: string }) {
  const [state, formAction] = useFormState<ActionState | null, FormData>(
    submitReport.bind(null, noteId),
    null,
  );

  if (state?.ok) {
    return <p className="text-sm text-success">{state.message}</p>;
  }

  return (
    <form action={formAction} className="card space-y-3">
      <h3 className="font-semibold">รายงานปัญหา</h3>

      <label className="block text-sm">
        สาเหตุ
        <select
          name="reason"
          defaultValue=""
          className="mt-1 w-full rounded-lg border border-white/10 bg-bg px-3 py-2"
        >
          <option value="" disabled>
            -- เลือกสาเหตุ --
          </option>
          {REPORT_REASONS.map((reason) => (
            <option key={reason} value={reason}>
              {REPORT_REASON_LABELS[reason]}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        รายละเอียดเพิ่มเติม (ไม่บังคับ)
        <textarea
          name="detail"
          rows={3}
          maxLength={500}
          className="mt-1 w-full rounded-lg border border-white/10 bg-bg px-3 py-2"
        />
      </label>

      {state && !state.ok && (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
