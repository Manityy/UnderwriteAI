import {
  MotionSection,
  MagneticButton,
  Reveal,
  Tilt,
} from "@/components/landing/Motion";
import { FloatingShapes } from "@/components/FloatingShapes";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tb = await getTranslations("buttons");

  const story = [
    { step: t("step1Label"), body: t("step1Body") },
    { step: t("step2Label"), body: t("step2Body") },
    { step: t("step3Label"), body: t("step3Body") },
  ];

  const gaps = [
    { title: t("gap1Title"), body: t("gap1Body") },
    { title: t("gap2Title"), body: t("gap2Body") },
    { title: t("gap3Title"), body: t("gap3Body") },
  ];

  return (
    <>
      {/* Example client story — matches deck slide */}
      <MotionSection className="overflow-hidden bg-brand pt-32 pb-20 text-white" glow>
        <FloatingShapes variant="brand" parallax />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
          <div className="space-y-10">
            {story.map((s, i) => (
              <Reveal key={s.step} delay={i * 100}>
                <div className="flex gap-5">
                  <div
                    className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold animate-float-soft"
                    style={{ animationDuration: `${7 + i}s`, animationDelay: `${i * 0.4}s` }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold tracking-wide">{s.step}</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75">{s.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={180} className="relative text-center md:text-right">
            <div
              className="pointer-events-none absolute -right-4 top-0 h-32 w-32 animate-spin-slow rounded-full border border-dashed border-white/25 md:-right-8"
              aria-hidden="true"
            />
            <p className="text-5xl font-light tracking-tight sm:text-6xl">{t("meet")}</p>
            <p className="text-6xl font-extrabold tracking-tight sm:text-7xl">UnderwriteAI</p>
            <p className="mt-6 text-lg text-white/70">{t("storyIntro")}</p>
          </Reveal>
        </div>
      </MotionSection>

      {/* The gap */}
      <MotionSection className="overflow-hidden bg-white py-24" glow>
        <FloatingShapes variant="light" parallax />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-widest text-brand">{t("problemEyebrow")}</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                {t("problemTitle")}
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {gaps.map((g, i) => (
              <Reveal key={g.title} delay={i * 90}>
                <div className="group rounded-3xl bg-cream p-8 ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(43,89,195,0.10)] hover:ring-brand/20">
                  <h3 className="text-xl font-extrabold text-ink transition-colors duration-300 group-hover:text-brand">
                    {g.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{g.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* The solution */}
      <MotionSection className="overflow-hidden bg-ink py-24 text-white" glow>
        <FloatingShapes variant="dark" parallax />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
          <Reveal>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-brand-light">
                {t("solutionEyebrow")}
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                {t("solutionTitle")}
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">
                {t("solutionBody")}
              </p>
              <p className="mt-4 text-lg font-bold text-white">
                {t("solutionFooter")}
              </p>
              <MagneticButton
                href="/login"
                className="mt-8 rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-sm shadow-brand/30 transition-all duration-300 hover:scale-[1.03] hover:bg-brand-light hover:shadow-[0_8px_28px_rgba(43,89,195,0.35)]"
              >
                {tb("explorePlatform")}
              </MagneticButton>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <Tilt max={4} className="relative">
              <div
                className="absolute -right-3 -top-3 h-16 w-16 animate-float-soft rounded-2xl border-2 border-white/15"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-4 -left-3 h-10 w-10 animate-drift-soft rounded-full bg-brand/40 blur-sm"
                aria-hidden="true"
              />
              <div
                className="group relative rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07] hover:shadow-[0_16px_40px_rgba(0,0,0,0.28)] hover:ring-brand-light/30 animate-float-x-soft"
                style={{ animationDuration: "11s" }}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-white/50">
                    {t("sampleTitle")}
                  </span>
                  <span className="rounded-full bg-risk-high/20 px-3 py-1 text-xs font-bold uppercase text-risk-high">
                    {t("sampleTier")}
                  </span>
                </div>
                <ul className="mt-5 space-y-4 text-sm">
                  <li className="flex gap-3">
                    <span className="text-risk-high">&#9679;</span>
                    <span className="text-white/80">
                      {t("sample1")}
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-risk-high">&#9679;</span>
                    <span className="text-white/80">
                      {t("sample2")}
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-risk-medium">&#9679;</span>
                    <span className="text-white/80">{t("sample3")}</span>
                  </li>
                </ul>
                <p className="mt-6 text-xs text-white/40">
                  {t("sampleNote")}
                </p>
              </div>
            </Tilt>
          </Reveal>
        </div>
      </MotionSection>
    </>
  );
}
