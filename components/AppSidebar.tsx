"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/assessments", label: "Assessments", icon: "M4 5h16M4 12h16M4 19h10" },
  { href: "/assessments/new", label: "New assessment", icon: "M12 5v14M5 12h14" },
];

export function AppSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-black/5 bg-white px-4 py-6">
      <div className="px-2">
        <Logo variant="dark" href="/dashboard" />
      </div>

      <nav className="mt-8 flex-1 space-y-1">
        {nav.map((item) => {
          const active =
            item.href === "/assessments"
              ? pathname === "/assessments"
              : pathname === item.href ||
                (item.href === "/assessments/new" && pathname === "/assessments/new");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active ? "bg-brand text-white" : "text-ink/70 hover:bg-cream"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-black/5 pt-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
            {userName.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{userName}</p>
            <p className="truncate text-xs text-muted">Insurer</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-3 w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-muted transition hover:bg-cream hover:text-risk-high"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
