import Link from "next/link";
import { FloatingShapes } from "@/components/FloatingShapes";

const story = [
  {
    step: "STEP 1 — LAUNCH",
    body: "UnderwriteAI launches an AI chatbot to advise customers on financial products. Adoption is fast. Everyone is happy. The future looks bright.",
  },
  {
    step: "STEP 2 — FAILURE",
    body: "The chatbot confidently gives wrong financial advice. Worse, it leaks a customer's private data. What seemed like innovation becomes a liability.",
  },
  {
    step: "STEP 3 — THE LAWSUIT",
    body: "The customer sues. The regulator investigates. UnderwriteAI is on the hook. And the question nobody prepared for appears: \u201cWho pays?\u201d",
  },
];

const gaps = [
  {
    title: "AI is a black box",
    body: "Clients won't share their models or source code. Traditional audits don't apply.",
  },
  {
    title: "No standard to measure it",
    body: "Insurers have no repeatable way to judge how risky an AI system really is.",
  },
  {
    title: "So they say no — or guess",
    body: "Either AI risk is refused, or priced blindly. Both cost the insurer.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Example client story — matches deck slide */}
      <section className="relative overflow-hidden bg-brand pt-32 pb-20 text-white">
        <FloatingShapes variant="brand" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
          <div className="space-y-10">
            {story.map((s, i) => (
              <div key={s.step} className="flex gap-5">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold animate-float" style={{ animationDuration: `${5 + i}s`, animationDelay: `${i * 0.4}s` }}>
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold tracking-wide">{s.step}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="relative text-center md:text-right">
            <div className="pointer-events-none absolute -right-4 top-0 h-32 w-32 animate-spin-slow rounded-full border border-dashed border-white/25 md:-right-8" aria-hidden="true" />
            <p className="text-5xl font-light tracking-tight sm:text-6xl">Meet</p>
            <p className="text-6xl font-extrabold tracking-tight sm:text-7xl">UnderwriteAI</p>
            <p className="mt-6 text-lg text-white/70">A story every insurer will soon recognise.</p>
          </div>
        </div>
      </section>

      {/* The gap */}
      <section className="relative overflow-hidden bg-white py-24">
        <FloatingShapes variant="light" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-brand">The problem</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Insurers want to cover this. But they can&apos;t measure it.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {gaps.map((g) => (
              <div
                key={g.title}
                className="rounded-3xl bg-cream p-8 ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-xl font-extrabold text-ink">{g.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{g.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The solution */}
      <section className="relative overflow-hidden bg-ink py-24 text-white">
        <FloatingShapes variant="dark" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-brand-light">
              Our solution
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              UnderwriteAI is an X-ray for AI risk.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">
              We give insurers a clear risk score for their clients&apos; AI — without ever needing
              the secret code.
            </p>
            <p className="mt-4 text-lg font-bold text-white">
              We don&apos;t sell insurance. We help insurers sell it smarter.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-white transition hover:bg-brand-light"
            >
              Explore the platform
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -right-3 -top-3 h-16 w-16 animate-float rounded-2xl border-2 border-white/15" aria-hidden="true" />
            <div className="absolute -bottom-4 -left-3 h-10 w-10 animate-drift rounded-full bg-brand/40 blur-sm" aria-hidden="true" />
            <div className="relative rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 animate-float-x" style={{ animationDuration: "9s" }}>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-sm font-bold uppercase tracking-wider text-white/50">
                  Sample output
                </span>
                <span className="rounded-full bg-risk-high/20 px-3 py-1 text-xs font-bold uppercase text-risk-high">
                  High risk
                </span>
              </div>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-3">
                  <span className="text-risk-high">&#9679;</span>
                  <span className="text-white/80">Prompt injection bypassed the chatbot guardrails.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-risk-high">&#9679;</span>
                  <span className="text-white/80">Leaked sample personal data in 2 of 50 test prompts.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-risk-medium">&#9679;</span>
                  <span className="text-white/80">Confident wrong advice on regulated topics.</span>
                </li>
              </ul>
              <p className="mt-6 text-xs text-white/40">
                Illustrative output from the mock risk engine.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
