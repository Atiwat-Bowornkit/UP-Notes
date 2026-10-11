import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/session";

const links = [
  { href: "/", label: "หน้าหลัก" },
  { href: "/notes", label: "ค้นหาโน้ต" },
  { href: "/notes/upload", label: "อัปโหลด" },
  { href: "/my-notes", label: "โน้ตของฉัน" },
] as const;

const adminLinks = [
  { href: "/admin/pending", label: "รออนุมัติ" },
  { href: "/admin/reports", label: "รายงานปัญหา" },
] as const;

export default async function Navbar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const displayName = user?.user_metadata?.name || user?.email;

  // A failed role lookup (e.g. DB down) must never break the whole layout.
  const appUser = user ? await getCurrentUser().catch(() => null) : null;
  const visibleLinks = appUser?.role === "ADMIN" ? [...links, ...adminLinks] : links;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-panel/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-white">
          UP-<span className="text-accent">Notes</span>
        </Link>
        <ul className="flex items-center gap-4 text-sm text-gray-300">
          {visibleLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-white">{link.label}</Link>
            </li>
          ))}
        </ul>
        {user ? (
          <div className="flex items-center gap-3">
            <span>{displayName}</span>
            <form action="/api/auth/logout" method="post">
              <button className="btn-primary" type="submit">ออกจากระบบ</button>
            </form>
          </div>
        ) : (
          <Link href="/login" className="btn-primary">เข้าสู่ระบบ</Link>
        )}
      </nav>
    </header>
  );
}
