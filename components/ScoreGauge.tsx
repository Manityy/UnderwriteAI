"use client";

import { useEffect, useState } from "react";

type Tier = "LOW" | "MEDIUM" | "HIGH";

const tierColor: Record<Tier, string> = {
  LOW: "#1f9d6b",
  MEDIUM: "#d9a419",
  HIGH: "#d64545",
};

export function ScoreGauge({
  score,
  tier,
  size = 200,
}: {
  score: number;
  tier: string;
  size?: number;
}) {
  const t = (["LOW", "MEDIUM", "HIGH"].includes(tier) ? tier : "MEDIUM") as Tier;
  const color = tierColor[t];
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setProgress(score));
    return () => cancelAnimationFrame(id);
  }, [score]);

  const offset = c - (progress / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e8e8e8" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-extrabold text-ink">{score}</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">risk score</span>
      </div>
    </div>
  );
}
