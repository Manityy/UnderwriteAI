"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type Tier = "LOW" | "MEDIUM" | "HIGH" | "PENDING";

const TIER_COLOR: Record<Tier, string> = {
  HIGH: "var(--color-brand-dark)",
  MEDIUM: "var(--color-brand)",
  LOW: "var(--color-brand-light)",
  PENDING: "var(--color-panel)",
};

export function AnimatedScoreRing({
  score,
  tier,
  size = 140,
}: {
  score: number;
  tier: string;
  size?: number;
}) {
  const t = useTranslations("dashboard");
  const scoreTier = (["LOW", "MEDIUM", "HIGH"].includes(tier) ? tier : "PENDING") as Tier;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const target = Math.min(Math.max(score, 0), 100);

  const [progress, setProgress] = useState(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setProgress(target);
      setDisplay(target);
      return;
    }

    setProgress(0);
    setDisplay(0);
    const start = performance.now();
    const duration = 1100;
    let raf = 0;

    const tick = (now: number) => {
      const tNorm = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - tNorm, 3);
      setProgress(target * eased);
      setDisplay(Math.round(target * eased));
      if (tNorm < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const offset = c - (progress / 100) * c;

  return (
    <div
      className="relative shrink-0 rounded-full bg-white/80 p-1 shadow-inner ring-1 ring-brand/10 backdrop-blur-sm"
      style={{ width: size + 8, height: size + 8 }}
      aria-label={t("scoreAria", { score })}
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--color-panel)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={TIER_COLOR[scoreTier]}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke 0.3s ease" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span
            className={`font-extrabold tabular-nums tracking-tight text-ink ${
              size >= 160 ? "text-3xl" : "text-2xl"
            }`}
          >
            {display}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{t("scoreLabel")}</span>
        </div>
      </div>
    </div>
  );
}
