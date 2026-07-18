import Image from "next/image";
import { Link } from "@/i18n/navigation";

/** Mark height in px — width follows the asset aspect ratio (200×218). */
const MARK_PX = {
  sm: 34,
  md: 44,
  lg: 56,
} as const;

const WORDMARK_SIZE = {
  sm: "text-[15px] sm:text-base",
  md: "text-lg sm:text-xl",
  lg: "text-xl sm:text-2xl",
} as const;

export type LogoSize = keyof typeof MARK_PX;

const ASPECT = 200 / 218;

/**
 * Brand mark — renders the logo asset at a real pixel size (not a tiny capped box).
 * Aspect ratio is preserved; no max-width / scale constraints.
 */
export function LogoMark({
  className = "",
  size = "md",
  tone = "brand",
}: {
  className?: string;
  size?: LogoSize;
  /** brand = original blue PNG; current = tinted via CSS mask to match text color */
  tone?: "brand" | "current";
}) {
  const h = MARK_PX[size];
  const w = Math.round(h * ASPECT);

  if (tone === "current") {
    return (
      <span
        role="img"
        aria-hidden="true"
        className={`inline-block shrink-0 bg-current ${className}`}
        style={{
          width: w,
          height: h,
          maskImage: "url(/brand/logo-mark.png)",
          maskSize: "100% 100%",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskImage: "url(/brand/logo-mark.png)",
          WebkitMaskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
        }}
      />
    );
  }

  return (
    <Image
      src="/brand/logo-mark.png"
      alt=""
      width={w}
      height={h}
      className={`shrink-0 object-contain ${className}`}
      style={{ width: w, height: h }}
      aria-hidden="true"
    />
  );
}

export function Logo({
  variant = "dark",
  href = "/",
  size = "md",
}: {
  variant?: "dark" | "light" | "pill";
  href?: string;
  size?: LogoSize;
}) {
  const h = MARK_PX[size];
  // ~12–14% padding top/bottom so the mark is ~72–76% of pill height
  const padY = Math.max(6, Math.round(h * 0.14));

  if (variant === "pill") {
    return (
      <Link
        href={href}
        className="inline-flex items-center gap-3 rounded-full bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
        style={{ padding: `${padY}px 18px` }}
      >
        <LogoMark size={size} tone="brand" />
        <span
          className={`font-extrabold leading-none tracking-tight text-brand ${WORDMARK_SIZE[size]}`}
        >
          UnderwriteAI
        </span>
      </Link>
    );
  }

  if (variant === "light") {
    return (
      <Link href={href} className="inline-flex items-center gap-3 text-white">
        <LogoMark size={size} tone="current" className="text-white" />
        <span className={`font-extrabold leading-none tracking-tight ${WORDMARK_SIZE[size]}`}>
          UnderwriteAI
        </span>
      </Link>
    );
  }

  return (
    <Link href={href} className="inline-flex items-center gap-3 text-brand">
      <LogoMark size={size} tone="brand" />
      <span className={`font-extrabold leading-none tracking-tight ${WORDMARK_SIZE[size]}`}>
        UnderwriteAI
      </span>
    </Link>
  );
}
