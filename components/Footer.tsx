import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-gray-400 sm:flex-row">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} UP-Notes · คลังสรุปบทเรียนสำหรับนิสิต มหาวิทยาลัยพะเยา
          <br />
          <span className="text-gray-500">
            ทำโดยทีม CS-Sheet-67 · รายวิชาแนวคิดวิศวกรรมซอฟต์แวร์ (Software Engineering) · มหาวิทยาลัยพะเยา
          </span>
        </p>
        <nav aria-label="ลิงก์ท้ายเว็บ" className="flex gap-4">
          <Link href="/notes" className="hover:text-white">ค้นหาโน้ต</Link>
          <Link href="/notes/upload" className="hover:text-white">แบ่งปันโน้ต</Link>
        </nav>
      </div>
    </footer>
  );
}
