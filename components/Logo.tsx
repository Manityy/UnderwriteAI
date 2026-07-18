import Link from "next/link";

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 22a6 6 0 0 1-.6-11.97A8 8 0 0 1 24 12.5a5.5 5.5 0 0 1-1 10.9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 12.5v8m0 0-2.6-2.6M16 20.5l2.6-2.6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  variant = "dark",
  href = "/",
}: {
  variant?: "dark" | "light" | "pill";
  href?: string;
}) {
  if (variant === "pill") {
    return (
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
      >
        <LogoMark className="h-5 w-5 text-brand" />
        <span className="text-[15px] font-extrabold tracking-tight text-brand">
          UnderwriteAI
        </span>
      </Link>
    );
  }

  const color = variant === "light" ? "text-white" : "text-brand";
  return (
    <Link href={href} className={`inline-flex items-center gap-2 ${color}`}>
      <LogoMark className="h-6 w-6" />
      <span className="text-lg font-extrabold tracking-tight">UnderwriteAI</span>
    </Link>
  );
}
