import { redirect } from "next/navigation";
import { NoteStatus } from "@prisma/client";
import PendingActions from "@/modules/admin/components/PendingActions";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isAdmin } from "@/src/utils/reportHelper";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  GE: "GE",
  MAJOR_REQUIRED: "วิชาเอกบังคับ",
  ELECTIVE: "วิชาเลือก",
};

export default async function AdminPendingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin/pending");

  if (!isAdmin(user)) {
    return (
      <section className="card text-center">
        <h1 className="text-2xl font-semibold text-danger">403 Forbidden</h1>
        <p className="mt-2 text-gray-400">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
      </section>
    );
  }

  // Notes hidden because of reports are handled on /admin/reports, not here.
  const notes = await prisma.note.findMany({
    where: { status: NoteStatus.PENDING_REVIEW, reports: { none: { resolved: false } } },
    include: { author: { select: { name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">โน้ตย่อรออนุมัติ</h1>
        <p className="text-sm text-gray-400">
          โน้ตที่เพิ่งอัปโหลดจะยังไม่แสดงในหน้าค้นหาจนกว่าผู้ดูแลระบบจะอนุมัติ
        </p>
      </header>

      {notes.length === 0 ? (
        <div className="card text-center text-gray-400">ไม่มีโน้ตที่รออนุมัติ</div>
      ) : (
        notes.map((note) => (
          <article key={note.id} className="card space-y-4">
            <div>
              <h2 className="text-lg font-semibold">{note.title}</h2>
              <p className="text-sm text-gray-400">
                วิชา {note.courseCode} · {CATEGORY_LABELS[note.category] ?? note.category} · โดย{" "}
                {note.author.name ?? note.author.email}
              </p>
              {note.description && <p className="mt-2 text-sm text-gray-300">{note.description}</p>}
              <p className="mt-1 text-xs text-gray-500">
                ไฟล์ {note.fileName} ({(note.fileSizeBytes / 1024).toFixed(0)} KB) ·{" "}
                <a href={`/notes/${note.id}`} className="underline">
                  ดูตัวอย่าง
                </a>
              </p>
            </div>
            <PendingActions noteId={note.id} />
          </article>
        ))
      )}
    </section>
  );
}
