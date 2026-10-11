"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { CloseIcon, MenuIcon } from "@/components/Icons";

export type NavItem = { href: string; label: string; admin?: boolean };

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  // /notes must not stay highlighted on /notes/upload (its own item)
  if (href === "/notes") return pathname === "/notes" || /^\/notes\/(?!upload)/.test(pathname);
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop links + mobile menu. `account` is the server-rendered login/logout area. */
export default function NavLinks({ items, account }: { items: NavItem[]; account: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const linkClass = (item: NavItem) => {
    const active = isActive(pathname, item.href);
    return [
      "whitespace-nowrap rounded-lg px-3 py-2 text-sm transition",
      active ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white",
      item.admin ? "border border-accent/30" : "",
    ].join(" ");
  };

  return (
    <>
      <ul className="hidden items-center gap-1 lg:flex">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={linkClass(item)} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden items-center gap-3 lg:flex">{account}</div>

      <button
        type="button"
        className="btn-ghost px-2.5 lg:hidden"
        aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full animate-fade-in border-b border-white/10 bg-panel px-4 pb-4 pt-2 shadow-2xl shadow-black/60 lg:hidden">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={`block ${linkClass(item)}`}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-white/10 pt-3">{account}</div>
        </div>
      )}
    </>
  );
}
