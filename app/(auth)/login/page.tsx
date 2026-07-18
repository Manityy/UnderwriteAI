"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";

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
      <div className="relative hidden flex-col justify-between bg-brand p-12 text-white md:flex">
        <Logo variant="light" />
        <div>
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
            Underwriting intelligence for AI risk.
          </h2>
          <p className="mt-4 max-w-sm text-white/70">
            Score, monitor and price the AI systems of your corporate clients — all in one place.
          </p>
        </div>
        <p className="text-sm text-white/50">Team Pivot</p>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 md:hidden">
            <Logo variant="dark" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">Insurer login</h1>
          <p className="mt-2 text-sm text-muted">Welcome back. Sign in to your underwriting workspace.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            {error && <p className="text-sm font-medium text-risk-high">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-cream p-4 text-sm text-muted ring-1 ring-black/5">
            <p className="font-semibold text-ink">Demo account</p>
            <p className="mt-1">insurer@demo.com &middot; demo123</p>
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            <Link href="/" className="font-semibold text-brand hover:text-brand-dark">
              &larr; Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
