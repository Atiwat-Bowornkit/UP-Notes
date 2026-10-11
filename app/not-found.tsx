import Link from "next/link";
import { SearchIcon } from "@/components/Icons";

export default function NotFound() {
  return (
    <section className="card mx-auto flex max-w-lg flex-col items-center gap-3 py-16 text-center">
      <p className="text-6xl font-bold text-accent-soft/80">404</p>
      <h1 className="text-xl font-semibold text-white">ไม่พบหน้าที่ต้องการ</h1>
      <p className="max-w-sm text-sm text-gray-400">
        ลิงก์อาจผิด หรือโน้ตนี้ถูกลบ/ยังไม่ได้รับการอนุมัติ ลองค้นหาโน้ตที่ต้องการอีกครั้ง
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-3">
        <Link href="/notes" className="btn-primary">
          <SearchIcon size={16} /> ค้นหาโน้ต
        </Link>
        <Link href="/" className="btn-ghost">กลับหน้าแรก</Link>
      </div>
    </section>
  );
}
