import Link from "next/link";

const links = [
  { href: "/", label: "หน้าหลัก" },
  { href: "/notes", label: "ค้นหาโน้ต" },
  { href: "/notes/upload", label: "อัปโหลด" },
  { href: "/my-notes", label: "โน้ตของฉัน" },
] as const;

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-panel/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-white">
          UP-<span className="text-accent">Notes</span>
        </Link>
        <ul className="flex items-center gap-4 text-sm text-gray-300">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/login" className="btn-primary">
          เข้าสู่ระบบ
        </Link>
      </nav>
    </header>
  );
}
