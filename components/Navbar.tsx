import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/session";
import NavLinks, { type NavItem } from "@/components/NavLinks";
import { BookIcon } from "@/components/Icons";

const links: NavItem[] = [
  { href: "/", label: "หน้าหลัก" },
  { href: "/notes", label: "ค้นหาโน้ต" },
  { href: "/notes/upload", label: "อัปโหลด" },
  { href: "/my-notes", label: "โน้ตของฉัน" },
];

const adminLinks: NavItem[] = [
  { href: "/admin/pending", label: "รออนุมัติ", admin: true },
  { href: "/admin/reports", label: "รายงานปัญหา", admin: true },
];

export default async function Navbar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const displayName: string = user?.user_metadata?.name || user?.email || "";

  // A failed role lookup (e.g. DB down) must never break the whole layout.
  const appUser = user ? await getCurrentUser().catch(() => null) : null;
  const items = appUser?.role === "ADMIN" ? [...links, ...adminLinks] : links;

  const account = user ? (
    <>
      <span className="flex items-center gap-2 text-sm text-gray-200">
        <span
          aria-hidden="true"
          className="grid h-8 w-8 place-items-center rounded-full bg-accent/20 text-sm font-semibold text-accent-soft"
        >
          {displayName.trim().charAt(0).toUpperCase() || "?"}
        </span>
        <span className="max-w-[10rem] truncate xl:max-w-[14rem]">{displayName}</span>
      </span>
      <form action="/api/auth/logout" method="post">
        <button className="btn-ghost btn-sm whitespace-nowrap" type="submit">ออกจากระบบ</button>
      </form>
    </>
  ) : (
    <>
      <Link href="/register" className="btn-ghost btn-sm">สมัครสมาชิก</Link>
      <Link href="/login" className="btn-primary btn-sm">เข้าสู่ระบบ</Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-bg/75 backdrop-blur-xl">
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-white shadow-lg shadow-accent/30">
            <BookIcon size={18} />
          </span>
          <span>
            UP-<span className="text-accent-soft">Notes</span>
          </span>
        </Link>
        <NavLinks items={items} account={account} />
      </nav>
    </header>
  );
}
