"use client";

import { useFormState, useFormStatus } from "react-dom";
import { AlertIcon } from "@/components/Icons";
import { submitReport, type ActionState } from "@/modules/admin/actions";
import { REPORT_REASONS, REPORT_REASON_LABELS } from "@/src/utils/reportHelper";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-ghost" disabled={pending}>
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
    return (
      <p role="status" className="alert-success">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="card space-y-4">
      <div>
        <h3 className="flex items-center gap-2 font-semibold text-white">
          <AlertIcon size={18} className="text-amber-300" /> รายงานปัญหา
        </h3>
        <p className="mt-1 text-sm text-gray-400">พบเนื้อหาไม่เหมาะสมหรือละเมิดลิขสิทธิ์ แจ้งให้ผู้ดูแลทราบได้ที่นี่</p>
      </div>

      <div>
        <label htmlFor="report-reason" className="label">สาเหตุ</label>
        <select id="report-reason" name="reason" defaultValue="" className="input">
          <option value="" disabled>
            -- เลือกสาเหตุ --
          </option>
          {REPORT_REASONS.map((reason) => (
            <option key={reason} value={reason}>
              {REPORT_REASON_LABELS[reason]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="report-detail" className="label">รายละเอียดเพิ่มเติม (ไม่บังคับ)</label>
        <textarea id="report-detail" name="detail" rows={3} maxLength={500} className="input resize-y" />
      </div>

      {state && !state.ok && (
        <p role="alert" className="alert-error">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
