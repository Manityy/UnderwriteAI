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
export function FloatingShapes({ variant = "light" }: { variant?: Variant }) {
  const c = palette[variant];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* soft glowing blobs */}
      <div
        className={`absolute -left-20 top-8 h-72 w-72 rounded-full ${c.soft} blur-3xl animate-float`}
      />
      <div
        className={`absolute -right-24 bottom-[-3rem] h-80 w-80 rounded-full ${c.soft} blur-3xl animate-drift float-delay-2`}
      />
      <div
        className={`absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full ${c.soft} blur-2xl animate-float-x float-delay-1`}
      />

      {/* outline circle */}
      <div
        className={`absolute right-16 top-20 h-28 w-28 rounded-full border-2 ${c.ring} animate-float-x float-delay-1`}
      />
      {/* small filled dots */}
      <div
        className={`absolute left-[22%] top-28 h-3.5 w-3.5 rounded-full ${c.fill} animate-float float-delay-3`}
      />
      <div
        className={`absolute right-[30%] bottom-28 h-2.5 w-2.5 rounded-full ${c.fill} animate-float-x float-delay-2`}
      />

      {/* tilted square */}
      <div
        className={`absolute left-[10%] bottom-20 h-16 w-16 rotate-12 rounded-2xl border-2 ${c.ring} animate-drift float-delay-1`}
      />

      {/* triangle-ish diamond */}
      <div
        className={`absolute right-[8%] top-[42%] h-10 w-10 rotate-45 rounded-md border-2 ${c.ring} animate-float float-delay-3`}
      />

      {/* shield icon */}
      <svg
        className={`absolute right-[16%] bottom-20 h-14 w-14 ${c.accent} animate-float float-delay-2`}
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

      {/* spark / AI icon */}
      <svg
        className={`absolute left-[6%] top-[36%] h-11 w-11 ${c.accent} animate-drift float-delay-3`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
      </svg>

      {/* document / report icon */}
      <svg
        className={`absolute left-[40%] bottom-16 h-10 w-10 ${c.accent} animate-float-x float-delay-1`}
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

      {/* slow spinning dotted ring */}
      <div className="absolute right-[5%] top-[55%] h-24 w-24 animate-spin-slow">
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
    </div>
  );
}
