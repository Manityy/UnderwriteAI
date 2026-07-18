"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MarketingNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Logo variant="pill" />

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-[15px] font-semibold transition ${
                  active ? "text-brand" : "text-ink/70 hover:text-brand"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            className="rounded-full bg-brand px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-brand-dark"
          >
            Insurer login
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand shadow-sm ring-1 ring-black/5 md:hidden"
          aria-label="Toggle menu"
        >
          <span className="text-xl leading-none">{open ? "\u00d7" : "\u2261"}</span>
        </button>
      </nav>

      {open && (
        <div className="mx-4 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-black/5 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[15px] font-semibold text-ink/80 hover:bg-cream"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-brand px-3 py-2.5 text-center text-[15px] font-semibold text-white"
            >
              Insurer login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
