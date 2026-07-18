"use client";

import { useEffect, useRef, useState } from "react";

type Parsed = {
  prefix: string;
  value: number;
  suffix: string;
};

function parseStat(raw: string): Parsed {
  const match = raw.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) return { prefix: "", value: 0, suffix: raw };
  return {
    prefix: match[1] ?? "",
    value: Number(match[2]),
    suffix: match[3] ?? "",
  };
}

/** Counts up a formatted stat (e.g. "88%", "+56%", "$22B+") when visible. */
export function AnimatedStat({
  value,
  className = "",
  duration = 1200,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const { prefix, value: target, suffix } = parseStat(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setDisplay(target);
      return;
    }

    setDisplay(0);
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
