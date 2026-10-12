"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { deleteNoteAsAdmin, type ActionState } from "@/modules/admin/actions";

/**
 * "ลบ" button with an in-page confirmation (shows which note is about to be deleted).
 * The server action re-checks that the caller is an admin; this component is only the UI.
 */
export default function DeleteNoteButton({ noteId, title }: { noteId: string; title: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState | null>(null);

  // Escape closes the dialog (unless a delete is running)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !pending && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pending]);

  function confirmDelete() {
    startTransition(async () => {
      const outcome = await deleteNoteAsAdmin(noteId);
      setResult(outcome);
      if (outcome.ok) {
        setOpen(false);
        router.refresh(); // statistics and the table are re-read from the database
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setResult(null);
          setOpen(true);
        }}
        className="btn btn-sm border border-danger/30 bg-danger/10 text-red-300 hover:bg-danger/20"
        aria-label={`ลบโน้ต ${title}`}
      >
        ลบ
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={`delete-note-${noteId}`}
        >
          <div className="card w-full max-w-sm animate-pop-in p-6 text-center shadow-2xl">
            <h2 id={`delete-note-${noteId}`} className="text-lg font-semibold text-white">ลบโน้ตนี้ถาวร?</h2>
            <p className="mt-2 break-words text-sm text-gray-300">
              “{title}” และไฟล์ที่อัปโหลดจะถูกลบทันที รวมถึงยอดถูกใจและรายงานที่เกี่ยวข้อง ไม่สามารถกู้คืนได้
            </p>
            {result && !result.ok && (
              <p role="alert" className="alert-error mt-4 text-left">{result.message}</p>
            )}
            <div className="mt-6 flex justify-center gap-3">
              <button type="button" onClick={() => setOpen(false)} className="btn-ghost" disabled={pending} autoFocus>
                ยกเลิก
              </button>
              <button type="button" onClick={confirmDelete} className="btn-danger" disabled={pending}>
                {pending ? "กำลังลบ..." : "ลบโน้ต"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
