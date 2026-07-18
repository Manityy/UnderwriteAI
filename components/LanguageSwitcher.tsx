"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { useEffect, useRef, useState, useTransition } from "react";

const ABBR: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  ar: "AR",
};

type Props = {
  variant?: "nav" | "sidebar" | "compact" | "menu";
};

export function LanguageSwitcher({ variant = "nav" }: Props) {
  const t = useTranslations("languages");
  const tNav = useTranslations("navigation");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function switchLocale(next: Locale) {
    if (next === locale) {
      setOpen(false);
      return;
    }
    startTransition(() => {
      router.replace(pathname, { locale: next });
      setOpen(false);
    });
  }

  const isMenu = variant === "menu";
  const isSidebar = variant === "sidebar";

  const triggerClass = isMenu
    ? "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-[13px] font-semibold text-ink/70 transition hover:bg-cream"
    : isSidebar
      ? "flex w-full items-center justify-between rounded-xl px-3 py-2 text-[13px] font-semibold text-ink/70 transition hover:bg-cream"
      : "inline-flex h-9 items-center gap-1 rounded-full px-2.5 text-[12px] font-bold tracking-wide text-ink/65 ring-1 ring-black/5 transition hover:bg-white hover:text-brand hover:ring-brand/15";

  const panelClass = isMenu
    ? "absolute end-0 bottom-full z-50 mb-1 min-w-[8.5rem] overflow-hidden rounded-lg border border-black/5 bg-white py-0.5 shadow-md shadow-brand/10"
    : isSidebar
      ? "absolute bottom-full start-0 z-50 mb-1 w-full min-w-0 overflow-hidden rounded-xl border border-black/5 bg-white py-0.5 shadow-md shadow-brand/10"
      : "absolute end-0 top-full z-50 mt-1.5 min-w-[8.5rem] overflow-hidden rounded-xl border border-black/5 bg-white py-0.5 shadow-lg shadow-brand/10";

  return (
    <div className={`relative ${isMenu || isSidebar ? "w-full" : "shrink-0"}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        aria-label={tNav("language")}
        aria-expanded={open}
        className={triggerClass}
      >
        <span className="tabular-nums tracking-wide">{ABBR[locale]}</span>
        <svg
          viewBox="0 0 24 24"
          className={`h-3.5 w-3.5 shrink-0 opacity-60 transition-transform duration-200 ${
            open ? "rotate-180" : ""
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

      {open && (
        <div className={panelClass} role="listbox" aria-label={tNav("language")}>
          {routing.locales.map((l) => {
            const selected = l === locale;
            return (
              <button
                key={l}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => switchLocale(l)}
                className={`flex w-full items-center px-3 py-2 text-start text-[13px] transition ${
                  selected
                    ? "bg-brand/8 font-bold text-brand"
                    : "font-semibold text-ink/70 hover:bg-cream"
                }`}
              >
                {t(l)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
