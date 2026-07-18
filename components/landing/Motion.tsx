"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * Tracks pointer within a section and writes --mx/--my/--gx/--gy CSS vars.
 * No per-frame React re-renders — parallax layers read the vars directly.
 */
export function MotionSection({
  children,
  className = "",
  glow = true,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const raf = useRef(0);
  const target = useRef({ mx: 0, my: 0, gx: 50, gy: 40 });
  const current = useRef({ mx: 0, my: 0, gx: 50, gy: 40 });

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.current = {
        mx: (e.clientX - r.left) / r.width - 0.5,
        my: (e.clientY - r.top) / r.height - 0.5,
        gx: ((e.clientX - r.left) / r.width) * 100,
        gy: ((e.clientY - r.top) / r.height) * 100,
      };
    };

    const onLeave = () => {
      target.current = { mx: 0, my: 0, gx: 50, gy: 40 };
    };

    const tick = () => {
      const c = current.current;
      const t = target.current;
      const ease = 0.09;
      c.mx += (t.mx - c.mx) * ease;
      c.my += (t.my - c.my) * ease;
      c.gx += (t.gx - c.gx) * ease;
      c.gy += (t.gy - c.gy) * ease;
      el.style.setProperty("--mx", c.mx.toFixed(4));
      el.style.setProperty("--my", c.my.toFixed(4));
      el.style.setProperty("--gx", `${c.gx.toFixed(2)}%`);
      el.style.setProperty("--gy", `${c.gy.toFixed(2)}%`);
      raf.current = requestAnimationFrame(tick);
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    raf.current = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [reduced]);

  return (
    <section
      ref={ref}
      className={`relative ${className}`}
      style={
        {
          "--mx": 0,
          "--my": 0,
          "--gx": "50%",
          "--gy": "40%",
        } as CSSProperties
      }
    >
      {glow && !reduced ? (
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.55]"
          style={{
            background:
              "radial-gradient(520px circle at var(--gx) var(--gy), color-mix(in srgb, var(--color-brand) 16%, transparent), transparent 58%)",
          }}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </section>
  );
}

/** Moves children with the cursor at a given depth (positive = toward cursor). */
export function Parallax({
  children,
  depth = 12,
  className = "",
}: {
  children: ReactNode;
  depth?: number;
  className?: string;
}) {
  return (
    <div
      className={`parallax-layer ${className}`}
      style={
        {
          "--depth": depth,
          transform:
            "translate3d(calc(var(--mx, 0) * var(--depth) * 1px), calc(var(--my, 0) * var(--depth) * 1px), 0)",
          willChange: "transform",
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

/** Subtle 3D tilt toward the cursor — for the hero illustration panel. */
export function Tilt({
  children,
  className = "",
  max = 5.5,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  return (
    <div
      className={`tilt-layer ${className}`}
      style={
        {
          "--tilt": max,
          transform:
            "perspective(920px) rotateX(calc(var(--my, 0) * var(--tilt) * -1deg)) rotateY(calc(var(--mx, 0) * var(--tilt) * 1deg))",
          transformStyle: "preserve-3d",
          willChange: "transform",
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

/** Primary CTA with a soft magnetic pull toward the cursor. */
export function MagneticButton({
  href,
  children,
  className = "",
  strength = 16,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = usePrefersReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const radius = Math.max(r.width, r.height) * 1.15;
      if (dist > radius) {
        setOffset({ x: 0, y: 0 });
        return;
      }
      const t = 1 - dist / radius;
      setOffset({
        x: (dx / radius) * strength * t,
        y: (dy / radius) * strength * t,
      });
    };

    const onLeave = () => setOffset({ x: 0, y: 0 });

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, strength]);

  return (
    <Link
      ref={ref}
      href={href}
      className={className}
      style={{
        transform: `translate3d(${offset.x.toFixed(2)}px, ${offset.y.toFixed(2)}px, 0)`,
        transition:
          "transform 0.18s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.2s ease, box-shadow 0.2s ease",
        willChange: "transform",
        display: "inline-flex",
      }}
    >
      {children}
    </Link>
  );
}

/** Fade-up when the element enters the viewport. */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -5% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translate3d(0,0,0)" : "translate3d(0,16px,0)",
        transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
