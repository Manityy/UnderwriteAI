import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-ink text-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo variant="light" />
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Underwriting intelligence for AI risk. We help insurers measure and price the risk of
            their clients&apos; AI systems.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white/50">Product</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/about" className="hover:text-white">How it works</Link></li>
            <li><Link href="/login" className="hover:text-white">Insurer login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white/50">Team Pivot</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>Alaa Elmir</li>
            <li>Imen Nasr</li>
            <li>Aziz Souiai</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-5 text-xs text-white/40 sm:justify-start">
          <span>&copy; {new Date().getFullYear()} UnderwriteAI — a Team Pivot project.</span>
        </div>
      </div>
    </footer>
  );
}
