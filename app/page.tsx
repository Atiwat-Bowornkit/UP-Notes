import Link from "next/link";

export default function HomePage() {
  return (
    <section className="card text-center">
      <h1 className="text-3xl font-semibold">UP-Notes</h1>
      <p className="mt-2 text-gray-400">
        คลังปันสรุปบทเรียนและโน้ตย่อสำหรับนิสิต มหาวิทยาลัยพะเยา
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/notes" className="btn-primary">
          ค้นหาโน้ต
        </Link>
        <Link href="/notes/upload" className="btn-ghost">
          อัปโหลดโน้ต
        </Link>
      </div>
    </section>
  );
}
