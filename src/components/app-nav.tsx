import Link from "next/link";

const navItems = [
  { href: "/today", label: "Today" },
  { href: "/groups", label: "Group" },
  { href: "/books", label: "Books" },
  { href: "/reviews", label: "Reviews" },
  { href: "/settings", label: "Settings" }
];

export function AppNav() {
  return (
    <nav className="sticky bottom-0 z-20 border-t border-[#dedbd2] bg-white/95 backdrop-blur md:top-0 md:bottom-auto">
      <div className="content-wrap flex min-h-16 items-center justify-between gap-2 overflow-x-auto py-2">
        <Link className="font-black text-moss" href="/today">
          Reading Momentum
        </Link>
        <div className="flex gap-1">
          {navItems.map((item) => (
            <Link
              className="rounded-app px-3 py-2 text-sm font-bold text-slate-700 hover:bg-skysoft"
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
