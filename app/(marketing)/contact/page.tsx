import { ContactForm } from "@/components/ContactForm";
import { FloatingShapes } from "@/components/FloatingShapes";

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-24">
      <FloatingShapes variant="light" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-brand">Contact</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Let&apos;s make AI insurable.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            Are you an insurer exploring AI liability cover? Tell us about your use cases and
            we&apos;ll set up a pilot.
          </p>
          <div className="mt-10 space-y-4">
            <ContactItem label="Team" value="Pivot — Elaa, Imen, Aziz" />
            <ContactItem label="Event" value="&ldquo;Automate or die&rdquo; hackathon" />
            <ContactItem label="Email" value="hello@underwrite.ai" />
          </div>
        </div>
        <div className="relative">
          <div
            className="pointer-events-none absolute -right-4 -top-4 h-14 w-14 animate-float rounded-2xl border-2 border-brand/20"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-3 -left-3 h-8 w-8 animate-drift rounded-full bg-brand/15"
            aria-hidden="true"
          />
          <div className="relative rounded-3xl bg-cream p-8 ring-1 ring-black/5 sm:p-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-16 text-xs font-bold uppercase tracking-wider text-muted">{label}</span>
      <span className="text-sm font-semibold text-ink" dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  );
}
