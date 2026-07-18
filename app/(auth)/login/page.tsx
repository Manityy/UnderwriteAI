"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";

const inputClass =
  "w-full rounded-2xl border border-black/[0.08] bg-white px-4 py-3.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted/60 focus:border-brand focus:shadow-[0_0_0_3px_rgba(43,89,195,0.12),0_0_20px_rgba(43,89,195,0.10)] focus:ring-0";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("insurer@demo.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand p-12 text-white md:flex lg:p-14">
        <div
          className="pointer-events-none absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-brand-dark/40 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative animate-[fade-in_0.6s_ease_both]">
          <Logo variant="light" />
        </div>

        <div className="relative max-w-md animate-[fade-up_0.7s_ease_both] [animation-delay:120ms]">
          <h2 className="text-4xl font-extrabold leading-[1.15] tracking-tight lg:text-[2.75rem]">
            Underwriting intelligence for AI risk.
          </h2>
          <p className="mt-6 max-w-[22rem] text-[17px] leading-relaxed text-white/80">
            Score, monitor, and price the AI systems your corporate clients rely on, all in one
            place.
          </p>
        </div>

        {/* Spacer keeps logo top / copy middle-bottom balance without Team Pivot */}
        <div className="relative h-6" aria-hidden="true" />
      </div>

      {/* Form panel */}
      <div className="relative flex items-center justify-center overflow-hidden bg-white px-6 py-12 sm:px-8">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/[0.06] blur-3xl"
          aria-hidden="true"
        />

        <div className="relative w-full max-w-[26rem] animate-[fade-up_0.65s_ease_both]">
          <div className="mb-8 md:hidden">
            <Logo variant="dark" />
          </div>

          <div className="rounded-[1.75rem] bg-white p-8 shadow-[0_1px_2px_rgba(26,31,54,0.04),0_16px_40px_rgba(43,89,195,0.08)] ring-1 ring-black/[0.06] sm:p-10">
            <h1 className="text-[2rem] font-extrabold tracking-tight text-ink sm:text-[2.125rem]">
              Insurer login
            </h1>
            <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
              Welcome back. Sign in to your underwriting workspace.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-ink">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-ink">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  autoComplete="current-password"
                />
              </div>
              {error && <p className="text-sm font-medium text-risk-high">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-white shadow-sm shadow-brand/25 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-brand-dark hover:shadow-[0_10px_28px_rgba(43,89,195,0.32)] disabled:translate-y-0 disabled:scale-100 disabled:opacity-60 disabled:shadow-sm"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-7 flex gap-3 rounded-2xl border border-brand/10 bg-brand/[0.04] p-4">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">Demo account</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  insurer@demo.com &middot; demo123
                </p>
              </div>
            </div>
          </div>

          <p className="mt-7 text-center text-sm text-muted">
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 font-semibold text-brand transition-all duration-200 hover:gap-2.5 hover:text-brand-dark"
            >
              <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
                &larr;
              </span>
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
