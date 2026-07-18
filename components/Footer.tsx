import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-black/5 bg-ink text-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo variant="light" />
          <p className="mt-4 text-sm leading-relaxed text-white/60">{t("tagline")}</p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white/50">{t("product")}</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white">
                {t("home")}
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                {t("howItWorks")}
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white">
                {t("insurerLogin")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white/50">{t("team")}</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>Alaa Elmir</li>
            <li>Imen Nasr</li>
            <li>Aziz Souiai</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-5 text-xs text-white/40 sm:justify-start">
          <span>{t("copyright", { year: new Date().getFullYear() })}</span>
        </div>
      </div>
    </footer>
  );
}
