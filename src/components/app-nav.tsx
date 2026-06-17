"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/today", label: "Today" },
  { href: "/groups", label: "Groups" },
  { href: "/books", label: "Books" },
  { href: "/reviews", label: "Reviews" },
  { href: "/settings", label: "Settings" }
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 border-t border-[#ded5c6] bg-[#fffdf8]/96 shadow-[0_-14px_34px_rgba(71,58,42,0.08)] backdrop-blur md:top-0 md:bottom-auto md:border-b md:border-t-0 md:shadow-[0_14px_34px_rgba(71,58,42,0.06)]">
      <div className="content-wrap flex min-h-[4.25rem] items-center justify-between gap-3 overflow-x-auto py-2">
        <Link className="hidden shrink-0 items-center gap-3 font-black text-moss md:inline-flex" href="/today">
          <span className="book-mark min-h-8" />
          <span>
            Reading Momentum
            <span className="block text-xs font-bold text-slate-500">Quiet progress together</span>
          </span>
        </Link>
        <Link
          aria-label="Reading Momentum home"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-app border border-[#c6b79f] bg-[#f2e7d8] text-sm font-black text-moss shadow-sm md:hidden"
          href="/today"
        >
          RM
        </Link>
        <div className="flex min-w-max flex-1 justify-end gap-1">
          {navItems.map((item) => (
            <Link
              aria-current={pathname === item.href ? "page" : undefined}
              className={`rounded-app px-3 py-2 text-sm font-bold transition-colors ${
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-[#315c48] text-white shadow-sm"
                  : "text-slate-700 hover:bg-[#dfece4] hover:text-moss"
              }`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
