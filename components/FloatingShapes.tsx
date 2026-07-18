"use client";

import { Parallax } from "@/components/landing/Motion";

type Variant = "light" | "dark" | "brand";

const palette: Record<
  Variant,
  { soft: string; ring: string; accent: string; fill: string }
> = {
  light: {
    soft: "bg-brand/10",
    ring: "border-brand/25",
    accent: "text-brand/35",
    fill: "bg-brand/20",
  },
  dark: {
    soft: "bg-white/8",
    ring: "border-white/20",
    accent: "text-white/30",
    fill: "bg-white/10",
  },
  brand: {
    soft: "bg-white/15",
    ring: "border-white/30",
    accent: "text-white/40",
    fill: "bg-white/20",
  },
};

/** Decorative floating shapes / icons for marketing section backgrounds. */
export function FloatingShapes({
  variant = "light",
  parallax = false,
}: {
  variant?: Variant;
  /** Enable cursor-driven depth when wrapped in MotionSection. */
  parallax?: boolean;
}) {
  const c = palette[variant];

  const Layer = ({
    depth,
    children,
    className = "",
  }: {
    depth: number;
    children: React.ReactNode;
    className?: string;
  }) =>
    parallax ? (
      <Parallax depth={depth} className={`absolute ${className}`}>
        {children}
      </Parallax>
    ) : (
      <div className={`absolute ${className}`}>{children}</div>
    );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* soft glowing blobs */}
      <Layer depth={8} className="-left-20 top-8">
        <div className={`h-72 w-72 rounded-full ${c.soft} blur-3xl animate-float-soft`} />
      </Layer>
      <Layer depth={-14} className="-right-24 bottom-[-3rem]">
        <div className={`h-80 w-80 rounded-full ${c.soft} blur-3xl animate-drift-soft`} />
      </Layer>
      <Layer depth={10} className="left-1/2 top-1/3 -translate-x-1/2">
        <div className={`h-40 w-40 rounded-full ${c.soft} blur-2xl animate-float-x-soft`} />
      </Layer>

      {/* outline circle */}
      <Layer depth={22} className="right-16 top-20">
        <div className={`h-28 w-28 rounded-full border-2 ${c.ring} animate-float-x-soft`} />
      </Layer>

      {/* small filled dots */}
      <Layer depth={28} className="left-[22%] top-28">
        <div className={`h-3.5 w-3.5 rounded-full ${c.fill} animate-float-soft`} />
      </Layer>
      <Layer depth={-18} className="right-[30%] bottom-28">
        <div className={`h-2.5 w-2.5 rounded-full ${c.fill} animate-float-x-soft`} />
      </Layer>

      {/* tilted square */}
      <Layer depth={16} className="left-[10%] bottom-20">
        <div
          className={`h-16 w-16 rotate-12 rounded-2xl border-2 ${c.ring} animate-drift-soft`}
        />
      </Layer>

      {/* triangle-ish diamond */}
      <Layer depth={-20} className="right-[8%] top-[42%]">
        <div className={`h-10 w-10 rotate-45 rounded-md border-2 ${c.ring} animate-float-soft`} />
      </Layer>

      {/* shield icon */}
      <Layer depth={24} className="right-[16%] bottom-20">
        <svg
          className={`h-14 w-14 ${c.accent} animate-float-soft`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </Layer>

      {/* spark / AI icon */}
      <Layer depth={-12} className="left-[6%] top-[36%]">
        <svg
          className={`h-11 w-11 ${c.accent} animate-drift-soft`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
        </svg>
      </Layer>

      {/* document / report icon */}
      <Layer depth={18} className="left-[40%] bottom-16">
        <svg
          className={`h-10 w-10 ${c.accent} animate-float-x-soft`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          <path d="M14 3v5h5M9 13h6M9 17h4" />
        </svg>
      </Layer>

      {/* slow spinning dotted ring */}
      <Layer depth={-8} className="right-[5%] top-[55%]">
        <div className="h-24 w-24 animate-spin-slow">
          <svg viewBox="0 0 80 80" className={c.accent} fill="none">
            <circle
              cx="40"
              cy="40"
              r="34"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="3 10"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </Layer>
    </div>
  );
}
