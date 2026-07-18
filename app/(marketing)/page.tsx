import {
  MotionSection,
  MagneticButton,
  Reveal,
  Tilt,
} from "@/components/landing/Motion";
import { HeroIllustration } from "@/components/HeroIllustration";
import { FloatingShapes } from "@/components/FloatingShapes";
import { FloatingCards } from "@/components/FloatingCards";
import { AnimatedStat } from "@/components/AnimatedStat";

const stats = [
  { value: "88%", label: "of companies now use AI in at least one function", source: "McKinsey, 2025" },
  { value: "+56%", label: "jump in reported AI incidents in a single year", source: "Stanford AI Index, 2025" },
  { value: "$22B+", label: "projected AI insurance market by 2034", source: "Specialty insurance reports" },
];

const steps = [
  {
    n: "01",
    title: "Ask",
    body: "The client declares how their AI is used: what it does, what data it touches, and who reviews it.",
  },
  {
    n: "02",
    title: "Test",
    body: "Two AI agents probe the system — one tries to break it, one grades the answers for leaks, injection and unsafe advice.",
  },
  {
    n: "03",
    title: "Score",
    body: "We combine disclosures and test results into one clear risk score — with findings and recommended conditions.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <MotionSection className="bg-cream" glow>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <FloatingShapes variant="light" parallax />
        </div>
        <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-6 pt-28 pb-16 md:grid-cols-2 md:pt-0">
          {/* Blue illustration panel */}
          <div className="relative order-2 md:order-1">
            <Tilt className="relative mx-auto w-full max-w-md px-4 md:max-w-lg md:px-6">
              <FloatingCards />
              <div className="relative flex aspect-square items-center justify-center rounded-[2.5rem] bg-brand p-8 shadow-[0_20px_60px_rgba(43,89,195,0.18)] md:rounded-r-[8rem]">
                <span className="absolute -right-3 -top-3 h-12 w-12 animate-pulse-ring rounded-full bg-brand/50" />
                <span
                  className="absolute -bottom-2 left-8 h-8 w-8 animate-pulse-ring rounded-full bg-brand-light/60"
                  style={{ animationDelay: "1.2s" }}
                />
                <HeroIllustration className="relative z-10 h-full w-full animate-float-soft" />
              </div>
            </Tilt>
          </div>

          {/* Copy */}
          <Reveal className="order-1 md:order-2">
            <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tight text-brand sm:text-6xl lg:text-7xl">
              UnderwriteAI
            </h1>
            <p className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
              We help insurers cover the risks of AI.
            </p>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              Every company is racing to use AI. Almost no one is insuring what could go wrong. We
              give insurers a clear risk score for their clients&apos; AI.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <MagneticButton
                href="/login"
                className="rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-sm shadow-brand/25 hover:bg-brand-dark hover:shadow-md hover:shadow-brand/30"
              >
                Open the platform
              </MagneticButton>
              <MagneticButton
                href="/about"
                strength={10}
                className="rounded-full px-5 py-3.5 text-base font-semibold text-brand hover:text-brand-dark"
              >
                See how it works &rarr;
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </MotionSection>

      {/* SHOCK STATS */}
      <MotionSection className="overflow-hidden bg-white py-24" glow>
        <FloatingShapes variant="light" parallax />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="text-center text-sm font-bold uppercase tracking-widest text-brand">
              The gap we close
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              AI is everywhere. So are its mistakes.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {stats.map((s, i) => (
              <Reveal key={s.value} delay={i * 90}>
                <div className="group rounded-3xl bg-cream p-8 text-center ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(43,89,195,0.10)] hover:ring-brand/15">
                  <div className="text-5xl font-extrabold tracking-tight text-brand transition-transform duration-300 group-hover:scale-[1.03]">
                    <AnimatedStat value={s.value} />
                  </div>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-ink/80">{s.label}</p>
                  <p className="mt-4 text-xs font-medium text-muted">{s.source}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* HOW IT WORKS */}
      <MotionSection className="overflow-hidden bg-ink py-24 text-white" glow>
        <FloatingShapes variant="dark" parallax />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-brand-light">
                How we measure the risk
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Three steps. No source code required.
              </h2>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <div className="group rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/[0.07] hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)] hover:ring-white/20">
                  <div className="text-sm font-bold text-brand-light">{s.n}</div>
                  <h3 className="mt-2 text-2xl font-extrabold">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={280}>
            <p className="mt-8 max-w-2xl text-sm text-white/50">
              More evidence, less guessing. We reduce uncertainty — the insurer still sets the final
              price.
            </p>
          </Reveal>
        </div>
      </MotionSection>

      {/* CTA BAND */}
      <MotionSection className="overflow-hidden bg-brand py-20 text-white" glow>
        <FloatingShapes variant="brand" parallax />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 text-center">
          <Reveal>
            <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              Insurers price fire, floods and cyber. We help them price AI.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <MagneticButton
              href="/login"
              className="rounded-full bg-white px-7 py-3.5 text-base font-semibold text-brand shadow-sm hover:bg-cream hover:shadow-md"
            >
              Try the demo platform
            </MagneticButton>
          </Reveal>
        </div>
      </MotionSection>
    </>
  );
}
