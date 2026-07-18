"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function MarketingNav() {
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { href: "/" as const, label: t("home") },
    { href: "/about" as const, label: t("about") },
    { href: "/contact" as const, label: t("contact") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5">
      <div className="pointer-events-auto mx-auto max-w-6xl">
        <nav
          className={`flex items-center justify-between gap-3 rounded-full border px-3 py-2 shadow-[0_8px_30px_rgba(43,89,195,0.08)] transition-all duration-300 sm:px-4 sm:py-2.5 ${
            scrolled
              ? "border-white/50 bg-[rgba(255,255,255,0.72)] shadow-[0_10px_36px_rgba(43,89,195,0.12)] backdrop-blur-2xl"
              : "border-white/40 bg-[rgba(255,255,255,0.12)] backdrop-blur-xl"
          }`}
          style={{
            WebkitBackdropFilter: scrolled
              ? "blur(20px) saturate(1.35)"
              : "blur(16px) saturate(1.2)",
          }}
        >
          <Logo variant="pill" />

          <div className="hidden items-center gap-1 md:flex">
            <div
              className={`me-1 flex items-center gap-0.5 rounded-full p-1 transition-colors duration-300 ${
                scrolled ? "bg-white/50 ring-1 ring-black/5" : "bg-white/25 ring-1 ring-white/40"
              }`}
            >
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`relative rounded-full px-4 py-2 text-[14px] font-semibold tracking-tight transition-all duration-200 ${
                      active
                        ? "bg-brand/10 text-brand shadow-sm ring-1 ring-brand/15"
                        : "text-ink/65 hover:bg-brand/[0.06] hover:text-brand"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
            <LanguageSwitcher variant="compact" />
            <Link
              href="/login"
              className="group inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm shadow-brand/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-md hover:shadow-brand/30"
            >
              {t("insurerLogin")}
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 rtl-flip transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher variant="compact" />
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-brand shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:bg-white hover:shadow-md hover:ring-brand/20"
              aria-label={t("toggleMenu")}
              aria-expanded={open}
            >
              <span className="relative block h-3.5 w-4">
                <span
                  className={`absolute start-0 block h-0.5 w-full rounded-full bg-current transition-all duration-200 ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute start-0 top-1.5 block h-0.5 w-full rounded-full bg-current transition-all duration-200 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute start-0 block h-0.5 w-full rounded-full bg-current transition-all duration-200 ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>

        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            open ? "mt-2 max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div
            className="rounded-[1.5rem] border border-white/50 bg-[rgba(255,255,255,0.78)] p-2 shadow-lg shadow-brand/5 backdrop-blur-2xl"
            style={{ WebkitBackdropFilter: "blur(20px)" }}
          >
            <div className="flex flex-col gap-0.5">
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-3.5 py-2.5 text-[15px] font-semibold transition-colors ${
                      active
                        ? "bg-brand/10 text-brand"
                        : "text-ink/75 hover:bg-brand/[0.05] hover:text-brand"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-brand px-3 py-2.5 text-center text-[15px] font-semibold text-white shadow-sm shadow-brand/20 transition hover:bg-brand-dark"
              >
                {t("insurerLogin")}
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 rtl-flip"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
