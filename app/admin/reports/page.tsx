import Link from "next/link";
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
import authHelper from "@/src/utils/authHelper";
import { CheckIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (!isAdmin(user)) {
    return (
      <section className="card mx-auto max-w-md space-y-2 py-12 text-center">
        <p className="text-5xl font-bold text-danger/80">403</p>
        <h1 className="text-xl font-semibold text-white">ไม่มีสิทธิ์เข้าถึง</h1>
        <p className="text-sm text-gray-400">หน้านี้สำหรับผู้ดูแลระบบเท่านั้น</p>
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
      <header className="page-header mb-0 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="page-eyebrow">ผู้ดูแลระบบ</p>
          <h1 className="page-title">รายงานปัญหาโน้ตย่อ</h1>
          <p className="page-subtitle">
            โน้ตที่ถูกรายงานเกิน 3 ครั้งจะถูกซ่อนจากการค้นหาอัตโนมัติ (Hidden)
          </p>
        </div>
        <span className="badge-danger text-sm">{notes.length} โน้ตถูกรายงาน</span>
      </header>

      {notes.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-14 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-success/15 text-success">
            <CheckIcon size={24} />
          </span>
          <p className="font-medium text-white">ไม่มีรายงานที่รอตรวจสอบ</p>
          <p className="text-sm text-gray-400">ทุกอย่างเรียบร้อยดี</p>
        </div>
      ) : (
        notes.map((note) => {
          const summary = summarizeReasons(note.reports);
          return (
            <article key={note.id} className="card space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-white">{note.title}</h2>
                  <p className="mt-1 text-sm text-gray-400">
                    วิชา {note.courseCode} · โดย {authHelper.displayName(note.author)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-warning">{note.reports.length} รายงาน</span>
                  <span
                    className={
                      note.status === "PUBLISHED"
                        ? "badge-success"
                        : note.status === "HIDDEN"
                          ? "badge-danger"
                          : "badge-warning"
                    }
                  >
                    {note.status === "HIDDEN"
                      ? "ซ่อนอยู่"
                      : note.status === "PENDING_REVIEW"
                        ? "รออนุมัติ"
                        : "แสดงอยู่"}
                  </span>
                  <Link href={`/notes/${note.id}`} className="btn-ghost btn-sm">ดูโน้ต</Link>
                </div>
              </div>

              <ul className="flex flex-wrap gap-2">
                {REPORT_REASONS.filter((reason) => summary[reason] > 0).map((reason) => (
                  <li key={reason} className="badge-neutral">
                    {REPORT_REASON_LABELS[reason]} × {summary[reason]}
                  </li>
                ))}
              </ul>

              {note.reports.some((report) => report.detail) && (
                <ul className="space-y-1.5 rounded-xl bg-white/[0.03] p-3 text-sm text-gray-300">
                  {note.reports
                    .filter((report) => report.detail)
                    .map((report) => (
                      <li key={report.id}>“{report.detail}”</li>
                    ))}
                </ul>
              )}

              <div className="border-t border-white/10 pt-4">
                <ReportActions noteId={note.id} />
              </div>
            </article>
          );
        })
      )}
    </section>
  );
}
