/** Small floating UI cards around the hero illustration. */
export function FloatingCards() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden="true">
      {/* risk badge */}
      <div className="absolute -left-4 top-[12%] z-20 animate-float rounded-2xl bg-white px-3.5 py-2.5 shadow-lg ring-1 ring-black/5 md:-left-8">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Risk tier</p>
        <p className="mt-0.5 text-sm font-extrabold text-risk-high">High</p>
      </div>

      {/* score chip */}
      <div className="absolute -right-3 top-[22%] z-20 animate-float-x float-delay-1 rounded-2xl bg-white px-3.5 py-2.5 shadow-lg ring-1 ring-black/5 md:-right-7">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Score</p>
        <p className="mt-0.5 text-sm font-extrabold text-brand">88 / 100</p>
      </div>

      {/* finding chip */}
      <div className="absolute bottom-[14%] left-[2%] z-20 animate-drift float-delay-2 rounded-2xl bg-white px-3.5 py-2.5 shadow-lg ring-1 ring-black/5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-risk-medium" />
          <p className="text-xs font-semibold text-ink">PII leak detected</p>
        </div>
      </div>

      {/* shield chip */}
      <div className="absolute bottom-[8%] right-[4%] z-20 animate-float float-delay-3 rounded-full bg-white p-3 shadow-lg ring-1 ring-black/5">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-brand"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </div>
    </div>
  );
}
