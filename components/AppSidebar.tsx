"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Logo } from "./Logo";

const ABBR: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  ar: "AR",
};

export function AppSidebar({ userName }: { userName: string }) {
  const t = useTranslations("navigation");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const profileRef = useRef<HTMLDivElement>(null);

  const nav = [
    { href: "/dashboard" as const, label: t("dashboard"), icon: "M3 12l9-9 9 9M5 10v10h14V10" },
    { href: "/assessments" as const, label: t("assessments"), icon: "M4 5h16M4 12h16M4 19h10" },
    {
      href: "/assessments/new" as const,
      label: t("newAssessment"),
      icon: "M12 5v14M5 12h14",
    },
  ];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    setProfileOpen(false);
  }, [pathname]);

  function switchLocale(next: Locale) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-e border-black/5 bg-white px-4 py-6 print:hidden">
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
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={item.icon} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="relative border-t border-black/5 pt-4" ref={profileRef}>
        <button
          type="button"
          onClick={() => setProfileOpen((v) => !v)}
          aria-expanded={profileOpen}
          aria-haspopup="menu"
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-start transition hover:bg-cream"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
            {userName.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{userName}</p>
            <p className="truncate text-xs text-muted">
              {t("insurer")} · {ABBR[locale]}
            </p>
          </div>
          <svg
            viewBox="0 0 24 24"
            className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${
              profileOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {profileOpen && (
          <div
            role="menu"
            className="absolute bottom-full start-0 end-0 z-50 mb-2 overflow-hidden rounded-xl border border-black/5 bg-white p-1.5 shadow-lg shadow-brand/10"
          >
            <p className="px-2.5 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-wider text-muted/80">
              {t("language")}
            </p>
            <div className="flex gap-1 px-1 pb-1.5" role="group" aria-label={t("language")}>
              {routing.locales.map((l) => {
                const selected = l === locale;
                return (
                  <button
                    key={l}
                    type="button"
                    role="menuitemradio"
                    aria-checked={selected}
                    disabled={pending}
                    onClick={() => switchLocale(l)}
                    className={`flex-1 rounded-lg py-1.5 text-center text-[12px] tracking-wide transition ${
                      selected
                        ? "bg-brand/8 font-bold text-brand"
                        : "font-semibold text-ink/65 hover:bg-cream"
                    }`}
                  >
                    {ABBR[l]}
                  </button>
                );
              })}
            </div>
            <div className="my-1 border-t border-black/5" />
            <button
              type="button"
              role="menuitem"
              onClick={logout}
              className="w-full rounded-lg px-2.5 py-2 text-start text-[13px] font-semibold text-muted transition hover:bg-cream hover:text-risk-high"
            >
              {t("signOut")}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
