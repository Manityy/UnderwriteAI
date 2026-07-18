export function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 460"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* connective dotted lines */}
      <path
        d="M120 120C60 150 60 250 140 270"
        stroke="#1a1f36"
        strokeWidth="3"
        strokeDasharray="2 12"
        strokeLinecap="round"
        className="opacity-70"
      />
      <path
        d="M360 90c70 20 90 120 20 160"
        stroke="#1a1f36"
        strokeWidth="3"
        strokeDasharray="2 12"
        strokeLinecap="round"
        className="opacity-70"
      />

      {/* phone — floats gently */}
      <g className="origin-center animate-float" style={{ transformBox: "fill-box" }}>
        <rect x="70" y="70" width="72" height="128" rx="14" fill="#fff" stroke="#1a1f36" strokeWidth="4" />
        <rect x="84" y="90" width="44" height="10" rx="5" fill="#e8e8e8" />
        <rect x="84" y="112" width="44" height="34" rx="6" fill="#2b59c3" />
        <rect x="84" y="156" width="44" height="8" rx="4" fill="#e8e8e8" />
        <rect x="84" y="170" width="30" height="8" rx="4" fill="#e8e8e8" />
      </g>

      {/* main browser / dashboard window */}
      <g className="origin-center animate-float-x float-delay-1" style={{ transformBox: "fill-box" }}>
        <rect x="170" y="120" width="290" height="210" rx="16" fill="#fff" stroke="#1a1f36" strokeWidth="4" />
        <path d="M170 150h290" stroke="#1a1f36" strokeWidth="4" />
        <circle cx="188" cy="135" r="4" fill="#d64545" />
        <circle cx="204" cy="135" r="4" fill="#d9a419" />
        <circle cx="220" cy="135" r="4" fill="#1f9d6b" />

        {/* gauge */}
        <path
          d="M210 268a56 56 0 0 1 112 0"
          stroke="#e8e8e8"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M210 268a56 56 0 0 1 96 -40"
          stroke="#2b59c3"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <circle cx="266" cy="268" r="8" fill="#1a1f36" />
        <path d="M266 268 305 232" stroke="#1a1f36" strokeWidth="5" strokeLinecap="round" />

        {/* side bars / report card */}
        <rect x="342" y="176" width="96" height="12" rx="6" fill="#2b59c3" />
        <rect x="342" y="198" width="72" height="10" rx="5" fill="#e8e8e8" />
        <rect x="342" y="216" width="84" height="10" rx="5" fill="#e8e8e8" />
        <rect x="342" y="256" width="96" height="52" rx="10" fill="#f4f1ea" stroke="#1a1f36" strokeWidth="3" />
        <rect x="354" y="270" width="40" height="9" rx="4" fill="#2b59c3" />
        <rect x="354" y="286" width="60" height="8" rx="4" fill="#c9cfdd" />
      </g>

      {/* cursor — drifts */}
      <g className="origin-center animate-drift float-delay-2" style={{ transformBox: "fill-box" }}>
        <path
          d="M250 300 258 330 264 318 278 322z"
          fill="#fff"
          stroke="#1a1f36"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </g>

      {/* floating shield badge */}
      <g className="origin-center animate-float float-delay-3" style={{ transformBox: "fill-box" }}>
        <path
          d="M400 330c26-8 26-8 26-8s0 30-26 44c-26-14-26-44-26-44s0 0 26 8z"
          fill="#2b59c3"
          stroke="#1a1f36"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M390 350l7 7 13-14"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
