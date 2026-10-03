import { redirect } from "next/navigation";
import ReportActions from "@/modules/admin/components/ReportActions";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import {
  REPORT_REASONS,
  REPORT_REASON_LABELS,
  isAdmin,
  summarizeReasons,
} from "@/src/utils/reportHelper";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (!isAdmin(user)) {
    return (
      <section className="card text-center">
        <h1 className="text-2xl font-semibold text-danger">403 Forbidden</h1>
        <p className="mt-2 text-gray-400">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
      </section>
    );
  }

  const notes = await prisma.note.findMany({
    where: { reports: { some: { resolved: false } } },
    include: {
      author: { select: { name: true, email: true } },
      reports: {
        where: { resolved: false },
        select: { id: true, reason: true, detail: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  notes.sort((a, b) => b.reports.length - a.reports.length);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">รายงานปัญหาโน้ตย่อ</h1>
        <p className="text-sm text-gray-400">
          โน้ตที่ถูกรายงานเกิน 3 ครั้งจะถูกซ่อนจากการค้นหาอัตโนมัติ (Pending Review)
        </p>
      </header>

      {notes.length === 0 ? (
        <div className="card text-center text-gray-400">ไม่มีรายงานที่รอตรวจสอบ</div>
      ) : (
        notes.map((note) => {
          const summary = summarizeReasons(note.reports);
          return (
            <article key={note.id} className="card space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold">{note.title}</h2>
                  <p className="text-sm text-gray-400">
                    วิชา {note.courseCode} · โดย {note.author.name ?? note.author.email}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="rounded-full bg-warning/15 px-3 py-1 text-warning">
                    {note.reports.length} รายงาน
                  </span>
                  <span
                    className={
                      note.status === "PENDING_REVIEW"
                        ? "rounded-full bg-danger/15 px-3 py-1 text-danger"
                        : "rounded-full bg-success/15 px-3 py-1 text-success"
                    }
                  >
                    {note.status === "PENDING_REVIEW" ? "Pending Review (ซ่อนอยู่)" : "แสดงอยู่"}
                  </span>
                </div>
              </div>

              <ul className="flex flex-wrap gap-2 text-xs text-gray-300">
                {REPORT_REASONS.filter((reason) => summary[reason] > 0).map((reason) => (
                  <li key={reason} className="rounded-full border border-white/10 px-3 py-1">
                    {REPORT_REASON_LABELS[reason]} × {summary[reason]}
                  </li>
                ))}
              </ul>

              <ul className="space-y-1 text-sm text-gray-400">
                {note.reports
                  .filter((report) => report.detail)
                  .map((report) => (
                    <li key={report.id}>“{report.detail}”</li>
                  ))}
              </ul>

              <ReportActions noteId={note.id} />
            </article>
          );
        })
      )}
    </section>
  );
}
