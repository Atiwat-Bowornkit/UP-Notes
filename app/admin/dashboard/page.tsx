import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getDashboardData, type DashboardData } from "@/lib/dashboard";
import { isAdmin } from "@/src/utils/reportHelper";
import { formatBytes } from "@/src/utils/dashboardStats";
import { DailyBars, ShareBars, StatCard } from "@/components/DashboardCharts";
import {
  AlertIcon,
  ArrowRightIcon,
  BookIcon,
  DownloadIcon,
  FileIcon,
  HeartIcon,
  ShieldIcon,
  UserIcon,
} from "@/components/Icons";

export const metadata = { title: "แดชบอร์ดผู้ดูแล" };
export const dynamic = "force-dynamic";

const n = (value: number) => value.toLocaleString("th-TH");

const STATUS_BADGE: Record<string, string> = {
  PUBLISHED: "badge-success",
  PENDING_REVIEW: "badge-warning",
  HIDDEN: "badge-danger",
};

function NoteList({ title, notes, metric }: { title: string; notes: DashboardData["topDownloaded"]; metric: "downloads" | "likes" }) {
  return (
    <section className="card p-5" aria-label={title}>
      <h3 className="font-semibold text-white">{title}</h3>
      {notes.length === 0 ? (
        <p className="mt-4 text-sm text-gray-400">ยังไม่มีโน้ตที่เผยแพร่</p>
      ) : (
        <ol className="mt-4 space-y-3">
          {notes.map((note, i) => (
            <li key={note.id} className="flex items-center gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-xs text-gray-300">{i + 1}</span>
              <Link href={`/notes/${note.id}`} className="min-w-0 flex-1 truncate text-sm text-gray-200 hover:text-white">
                {note.title}
                <span className="ml-2 font-mono text-xs text-gray-500">{note.courseCode}</span>
              </Link>
              <span className="flex shrink-0 items-center gap-1.5 text-sm text-gray-300">
                {metric === "downloads" ? <DownloadIcon size={14} /> : <HeartIcon size={14} />}
                {n(metric === "downloads" ? note.downloadCount : note._count.likes)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin/dashboard");

  if (!isAdmin(user)) {
    return (
      <section className="card mx-auto max-w-md space-y-2 py-12 text-center">
        <p className="text-5xl font-bold text-danger/80">403</p>
        <h1 className="text-xl font-semibold text-white">ไม่มีสิทธิ์เข้าถึง</h1>
        <p className="text-sm text-gray-400">หน้านี้สำหรับผู้ดูแลระบบเท่านั้น</p>
      </section>
    );
  }

  const data = await getDashboardData();
  const { notes, users, engagement, reports } = data;

  return (
    <section className="space-y-8">
      <header className="page-header mb-0 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="page-eyebrow">ผู้ดูแลระบบ</p>
          <h1 className="page-title">แดชบอร์ด</h1>
          <p className="page-subtitle">ภาพรวมโน้ต ผู้ใช้ และการใช้งานของระบบทั้งหมด</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span>
            อัปเดต {data.generatedAt.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Bangkok" })}
          </span>
          <Link href="/admin/dashboard" className="btn-ghost btn-sm">รีเฟรช</Link>
        </div>
      </header>

      {(notes.pending > 0 || reports.open > 0) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {notes.pending > 0 && (
            <Link href="/admin/pending" className="alert-warning flex items-center justify-between gap-3 transition hover:brightness-110">
              <span><strong>{n(notes.pending)}</strong> โน้ตรอการอนุมัติ</span>
              <ArrowRightIcon size={16} />
            </Link>
          )}
          {reports.open > 0 && (
            <Link href="/admin/reports" className="alert-error flex items-center justify-between gap-3 transition hover:brightness-110">
              <span><strong>{n(reports.open)}</strong> รายงานปัญหาที่ยังไม่จัดการ</span>
              <ArrowRightIcon size={16} />
            </Link>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="โน้ตทั้งหมด"
          value={n(notes.total)}
          icon={<BookIcon size={22} />}
          hint={`เผยแพร่ ${n(notes.published)} · รอ ${n(notes.pending)} · ซ่อน ${n(notes.hidden)} · ใหม่ 7 วัน ${n(notes.new7d)}`}
        />
        <StatCard
          label="ผู้ใช้ทั้งหมด"
          value={n(users.total)}
          icon={<UserIcon size={22} />}
          tone="success"
          hint={`แอดมิน ${n(users.admins)} · สมัครใหม่ 7 วัน ${n(users.new7d)} · 30 วัน ${n(users.new30d)}`}
        />
        <StatCard
          label="เข้าสู่ระบบใน 24 ชม."
          value={users.signIns.available ? n(users.signIns.last24h) : "—"}
          icon={<ShieldIcon size={22} />}
          hint={
            users.signIns.available
              ? `7 วัน ${n(users.signIns.last7d)} จากบัญชีทั้งหมด ${n(users.signIns.total)}${users.signIns.partial ? "+ (ข้อมูลบางส่วน)" : ""}`
              : "ดึงข้อมูลจาก Supabase Auth ไม่ได้ในขณะนี้"
          }
        />
        <StatCard label="ถูกใจรวม" value={n(engagement.likes)} icon={<HeartIcon size={22} />} />
        <StatCard label="ดาวน์โหลดรวม" value={n(engagement.downloads)} icon={<DownloadIcon size={22} />} />
        <StatCard
          label="พื้นที่ไฟล์โน้ต"
          value={formatBytes(engagement.storageBytes)}
          icon={<FileIcon size={22} />}
          hint={`เฉลี่ย ${notes.total ? formatBytes(engagement.storageBytes / notes.total) : "0 B"} ต่อโน้ต`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DailyBars series={notes.perDay} title={`โน้ตที่อัปโหลดต่อวัน (${data.chartDays} วัน)`} />
        <DailyBars series={users.perDay} title={`ผู้ใช้สมัครใหม่ต่อวัน (${data.chartDays} วัน)`} tone="emerald" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ShareBars title="สถานะโน้ต" rows={notes.byStatus} />
        <ShareBars title="หมวดหมู่" rows={notes.byCategory} />
        <ShareBars title="คณะ (สูงสุด 8 อันดับ)" rows={notes.byFaculty} empty="ยังไม่มีโน้ตที่ระบุคณะ" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <NoteList title="ดาวน์โหลดมากที่สุด" notes={data.topDownloaded} metric="downloads" />
        <NoteList title="ถูกใจมากที่สุด" notes={data.topLiked} metric="likes" />
        <ShareBars title="รายงานที่ยังไม่จัดการ (ตามสาเหตุ)" rows={reports.openByReason} empty="ไม่มีรายงานค้าง" />
      </div>

      <section className="card p-5" aria-label="โน้ตล่าสุด">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-white">โน้ตที่อัปโหลดล่าสุด</h3>
          <Link href="/admin/pending" className="text-sm text-accent-soft hover:text-white">ไปหน้ารออนุมัติ</Link>
        </div>
        {data.recentNotes.length === 0 ? (
          <p className="mt-4 text-sm text-gray-400">ยังไม่มีโน้ต</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="text-xs text-gray-500">
                <tr>
                  <th className="pb-2 font-medium">โน้ต</th>
                  <th className="pb-2 font-medium">ผู้อัปโหลด</th>
                  <th className="pb-2 font-medium">สถานะ</th>
                  <th className="pb-2 text-right font-medium">วันที่</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.recentNotes.map((note) => (
                  <tr key={note.id}>
                    <td className="py-2.5 pr-3">
                      <Link href={`/notes/${note.id}`} className="text-gray-200 hover:text-white">{note.title}</Link>
                      <span className="ml-2 font-mono text-xs text-gray-500">{note.courseCode}</span>
                    </td>
                    <td className="py-2.5 pr-3 text-gray-400">{note.author.name ?? note.author.email.split("@")[0]}</td>
                    <td className="py-2.5 pr-3">
                      <span className={STATUS_BADGE[note.status] ?? "badge-neutral"}>{data.statusLabels[note.status] ?? note.status}</span>
                    </td>
                    <td className="py-2.5 text-right text-gray-400">
                      {note.createdAt.toLocaleDateString("th-TH", { dateStyle: "medium", timeZone: "Asia/Bangkok" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="flex items-start gap-2 text-xs text-gray-500">
        <AlertIcon size={14} className="mt-0.5 shrink-0" />
        <span>
          ระบบยังไม่ติดตามสถานะ “ออนไลน์ตอนนี้” ตัวเลข “เข้าสู่ระบบ” นับจากเวลาเข้าสู่ระบบครั้งล่าสุดของแต่ละบัญชีใน Supabase Auth
          (ผู้ที่ล็อกอินค้างไว้โดยไม่ได้เข้าสู่ระบบใหม่จะไม่ถูกนับ) · เวลาแสดงตามเขตเวลาประเทศไทย
        </span>
      </p>
    </section>
  );
}
