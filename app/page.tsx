import Link from "next/link";
import NoteCard from "@/components/NoteCard";
import { getPublishedNotes } from "@/modules/notes/browseService";
import {
  ArrowRightIcon,
  BookIcon,
  DownloadIcon,
  SearchIcon,
  ShieldIcon,
  UploadIcon,
} from "@/components/Icons";

const features = [
  {
    icon: SearchIcon,
    title: "ค้นหาได้ในไม่กี่วินาที",
    text: "พิมพ์รหัสวิชาหรือชื่อวิชา กรองตามหมวด GE / วิชาเอก / วิชาเลือก และเรียงตามความนิยมได้",
  },
  {
    icon: DownloadIcon,
    title: "พรีวิวก่อนดาวน์โหลด",
    text: "เปิดดูตัวอย่างไฟล์ PDF และรูปภาพได้ทันที ถูกใจโน้ตที่ชอบและดาวน์โหลดไปอ่านต่อ",
  },
  {
    icon: ShieldIcon,
    title: "ตรวจสอบก่อนเผยแพร่",
    text: "ทุกโน้ตผ่านการอนุมัติจากผู้ดูแล และรายงานเนื้อหาที่ไม่เหมาะสมได้ทุกเมื่อ",
  },
];

const steps = [
  { n: "1", title: "สมัครด้วยอีเมล @up.ac.th", text: "ใช้เวลาไม่ถึงหนึ่งนาที ไม่ต้องยืนยันอีเมล" },
  { n: "2", title: "อัปโหลดโน้ตของคุณ", text: "รองรับ PDF, PNG, JPG ขนาดไม่เกิน 10 MB" },
  { n: "3", title: "ผู้ดูแลอนุมัติ", text: "เมื่อผ่านแล้ว โน้ตจะแสดงในหน้าค้นหาให้เพื่อนๆ ใช้" },
];

export const dynamic = "force-dynamic";

async function getPopularNotes() {
  // The landing page must never fail because of the database: no notes simply hides the section.
  try {
    const result = await getPublishedNotes({ sortBy: "popular", pageSize: 3 });
    return result.success ? (result.data ?? []) : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const popularNotes = await getPopularNotes();

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-accent/20 via-panel to-panel px-6 py-16 text-center sm:px-12 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl"
        />
        <div className="relative mx-auto max-w-3xl">
          <span className="badge-accent">
            <BookIcon size={14} /> สำหรับนิสิต มหาวิทยาลัยพะเยา
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            แบ่งปันและค้นหา <span className="text-accent-soft">โน้ตสรุปบทเรียน</span>
            <br className="hidden sm:block" /> ได้ในที่เดียว
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-gray-300 sm:text-lg">
            คลังสรุปบทเรียนที่นิสิตช่วยกันสร้าง ค้นหาจากรหัสวิชา อ่านพรีวิว แล้วดาวน์โหลดไปทบทวนก่อนสอบ
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/notes" className="btn-primary btn-lg w-full sm:w-auto">
              <SearchIcon /> ค้นหาโน้ต
            </Link>
            <Link href="/notes/upload" className="btn-ghost btn-lg w-full sm:w-auto">
              <UploadIcon /> อัปโหลดโน้ตของคุณ
            </Link>
          </div>
        </div>
      </section>

      {/* Popular notes */}
      {popularNotes.length > 0 && (
        <section aria-labelledby="popular-heading" className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="page-eyebrow">ยอดนิยม</p>
              <h2 id="popular-heading" className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                โน้ตที่เพื่อนๆ ถูกใจมากที่สุด
              </h2>
            </div>
            <Link href="/notes?sort=popular" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-soft hover:text-white">
              ดูทั้งหมด <ArrowRightIcon size={16} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">จุดเด่นของ UP-Notes</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <article key={title} className="card card-hover">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent-soft">
                <Icon size={22} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="steps-heading" className="space-y-8">
        <div className="text-center">
          <p className="page-eyebrow">วิธีใช้งาน</p>
          <h2 id="steps-heading" className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            เริ่มแชร์โน้ตใน 3 ขั้นตอน
          </h2>
        </div>
        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="card flex gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-base font-bold text-white">
                {s.n}
              </span>
              <div>
                <h3 className="font-semibold text-white">{s.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="card flex flex-col items-center gap-4 bg-gradient-to-r from-panel to-panel-2 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h2 className="text-xl font-semibold text-white">พร้อมแล้วหรือยัง?</h2>
          <p className="mt-1 text-sm text-gray-400">สมัครสมาชิกเพื่ออัปโหลด ถูกใจ และดาวน์โหลดโน้ต</p>
        </div>
        <Link href="/register" className="btn-primary btn-lg shrink-0">
          สมัครสมาชิก <ArrowRightIcon />
        </Link>
      </section>
    </div>
  );
}
