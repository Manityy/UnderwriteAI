import {
  MotionSection,
  Reveal,
} from "@/components/landing/Motion";
import { ContactForm } from "@/components/ContactForm";
import { FloatingShapes } from "@/components/FloatingShapes";

export default function ContactPage() {
  return (
    <MotionSection className="overflow-hidden bg-white pt-32 pb-24" glow>
      <FloatingShapes variant="light" parallax />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2">
        <div>
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-brand">Contact</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Let&apos;s make AI insurable.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              Are you an insurer exploring AI liability cover? Tell us about your use cases and
              we&apos;ll set up a pilot.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10">
              <div className="flex items-center gap-4">
                <span className="w-16 text-xs font-bold uppercase tracking-wider text-muted">
                  Email
                </span>
                <a
                  href="mailto:hello@underwrite.ai"
                  className="text-sm font-semibold text-ink transition-colors duration-200 hover:text-brand"
                >
                  hello@underwrite.ai
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={160} className="relative">
          <div
            className="pointer-events-none absolute -right-4 -top-4 h-14 w-14 animate-float-soft rounded-2xl border-2 border-brand/20"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-3 -left-3 h-8 w-8 animate-drift-soft rounded-full bg-brand/15"
            aria-hidden="true"
          />
          <div className="group relative rounded-3xl bg-cream p-8 ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(43,89,195,0.12)] hover:ring-brand/15 sm:p-10">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </MotionSection>
  );
}
