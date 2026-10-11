import Link from "next/link";
import { redirect } from "next/navigation";
import { NoteStatus } from "@prisma/client";
import PendingActions from "@/modules/admin/components/PendingActions";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isAdmin } from "@/src/utils/reportHelper";
import authHelper from "@/src/utils/authHelper";
import CategoryBadge from "@/components/CategoryBadge";
import { CheckIcon, FileIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function AdminPendingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin/pending");

  if (!isAdmin(user)) {
    return (
      <section className="card mx-auto max-w-md space-y-2 py-12 text-center">
        <p className="text-5xl font-bold text-danger/80">403</p>
        <h1 className="text-xl font-semibold text-white">ไม่มีสิทธิ์เข้าถึง</h1>
        <p className="text-sm text-gray-400">หน้านี้สำหรับผู้ดูแลระบบเท่านั้น</p>
      </section>
    );
  }

  // Notes hidden because of reports (HIDDEN) are handled on /admin/reports, not here.
  const notes = await prisma.note.findMany({
    where: { status: NoteStatus.PENDING_REVIEW },
    include: { author: { select: { name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <section className="space-y-6">
      <header className="page-header mb-0 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="page-eyebrow">ผู้ดูแลระบบ</p>
          <h1 className="page-title">โน้ตย่อรออนุมัติ</h1>
          <p className="page-subtitle">
            โน้ตที่เพิ่งอัปโหลดจะยังไม่แสดงในหน้าค้นหาจนกว่าผู้ดูแลระบบจะอนุมัติ
          </p>
        </div>
        <span className="badge-warning text-sm">{notes.length} รายการรอตรวจ</span>
      </header>

      {notes.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-14 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-success/15 text-success">
            <CheckIcon size={24} />
          </span>
          <p className="font-medium text-white">ไม่มีโน้ตที่รออนุมัติ</p>
          <p className="text-sm text-gray-400">ตรวจครบทุกรายการแล้ว</p>
        </div>
      ) : (
        notes.map((note) => (
          <article key={note.id} className="card space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-accent font-mono">{note.courseCode}</span>
                  <CategoryBadge category={note.category} />
                </div>
                <h2 className="mt-3 text-lg font-semibold text-white">{note.title}</h2>
                <p className="mt-1 text-sm text-gray-400">
                  โดย {authHelper.displayName(note.author)} · {note.createdAt.toLocaleDateString("th-TH", { dateStyle: "medium" })}
                </p>
              </div>
              <Link href={`/notes/${note.id}`} className="btn-ghost btn-sm">
                ดูตัวอย่าง
              </Link>
            </div>
            {note.description && <p className="text-sm leading-relaxed text-gray-300">{note.description}</p>}
            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <FileIcon size={14} /> {note.fileName} ({(note.fileSizeBytes / 1024).toFixed(0)} KB)
            </p>
            <div className="border-t border-white/10 pt-4">
              <PendingActions noteId={note.id} />
            </div>
          </article>
        ))
      )}
    </section>
  );
}
