import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ScoreGauge } from "@/components/ScoreGauge";
import { RiskBadge } from "@/components/RiskBadge";
import {
  formatPremiumFactor,
  premiumFactorFromScore,
  type Finding,
} from "@/lib/mockRiskEngine";

const sevColor: Record<string, string> = {
  HIGH: "text-risk-high",
  MEDIUM: "text-risk-medium",
  LOW: "text-risk-low",
};

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const assessment = await prisma.assessment.findFirst({
    where: { id, userId: session.userId },
  });
  if (!assessment) notFound();

  const findings: Finding[] = safeParse(assessment.findings, []);
  const conditions: string[] = safeParse(assessment.conditions, []);
  const premiumFactor =
    assessment.premiumFactor > 0
      ? assessment.premiumFactor
      : premiumFactorFromScore(assessment.score);

  const tierMessage =
    assessment.tier === "HIGH"
      ? "Coverage should be declined or repriced until the high-severity findings are remediated."
      : assessment.tier === "MEDIUM"
      ? "Coverage is feasible with the conditions below attached to the policy."
      : "Standard coverage is appropriate. Maintain controls and re-assess at renewal.";

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <Link href="/assessments" className="text-sm font-semibold text-brand hover:text-brand-dark">
        &larr; Back to assessments
      </Link>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">{assessment.clientName}</h1>
          <p className="mt-1 text-sm text-muted">
            {assessment.industry}
            {assessment.useCase ? ` · ${assessment.useCase}` : ""}
          </p>
        </div>
        <RiskBadge tier={assessment.tier} className="mt-2" />
      </header>

      {/* Score + summary */}
      <div className="mt-8 grid gap-6 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center justify-center gap-6 rounded-3xl bg-white p-8 ring-1 ring-black/5">
          <ScoreGauge score={assessment.score} tier={assessment.tier} />
          <div className="w-full border-t border-black/5 pt-6 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              Indicative premium factor
            </p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight text-brand">
              {formatPremiumFactor(premiumFactor)}
            </p>
            <p className="mt-2 text-[11px] font-medium text-muted">
              Indicative — not actuarial
            </p>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-8 ring-1 ring-black/5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted">
            Underwriting recommendation
          </h2>
          <p className="mt-3 text-xl font-extrabold leading-snug text-ink">{tierMessage}</p>
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-black/5 pt-6 text-center sm:grid-cols-4">
            <MiniStat label="Risk score" value={String(assessment.score)} />
            <MiniStat label="Premium factor" value={formatPremiumFactor(premiumFactor)} accent />
            <MiniStat label="Findings" value={String(findings.length)} />
            <MiniStat
              label="High severity"
              value={String(findings.filter((f) => f.severity === "HIGH").length)}
            />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Premium factor uses a simple rule:{" "}
            <span className="font-semibold text-ink/70">1.00x + (score ÷ 100) × 1.50</span>
            {" "}(range 1.00x–2.50x). For underwriting judgement only — not an actuarial rate.
          </p>
        </div>
      </div>

      {/* How we tested */}
      <div className="mt-6 rounded-3xl bg-ink p-8 text-white">
        <h2 className="text-sm font-bold uppercase tracking-wider text-brand-light">
          How we assessed this
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <TestStep n="01" title="Ask" body="Client disclosures on use, data and controls." />
          <TestStep n="02" title="Test" body="Attack agent probed the system; judge agent graded every response." />
          <TestStep n="03" title="Score" body="Disclosures and test results combined into one risk score." />
        </div>
      </div>

      {/* Findings */}
      <div className="mt-6 rounded-3xl bg-white p-8 ring-1 ring-black/5">
        <h2 className="text-lg font-extrabold text-ink">Findings</h2>
        <div className="mt-5 space-y-4">
          {findings.map((f, i) => (
            <div key={i} className="flex gap-4 rounded-2xl bg-cream/60 p-5">
              <span className={`mt-1 text-lg ${sevColor[f.severity] ?? "text-muted"}`}>&#9679;</span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-ink">{f.title}</h3>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted ring-1 ring-black/5">
                    {f.category}
                  </span>
                  <span className={`text-[11px] font-bold uppercase ${sevColor[f.severity]}`}>
                    {f.severity}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended conditions */}
      <div className="mt-6 rounded-3xl bg-white p-8 ring-1 ring-black/5">
        <h2 className="text-lg font-extrabold text-ink">Recommended policy conditions</h2>
        <ul className="mt-5 space-y-3">
          {conditions.map((c, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-ink/80">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                {i + 1}
              </span>
              {c}
            </li>
          ))}
        </ul>
        <p className="mt-6 border-t border-black/5 pt-4 text-xs text-muted">
          Risk score and premium factor are indicative — not actuarial. They support underwriting
          judgement; they do not replace it.
        </p>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className={`text-2xl font-extrabold ${accent ? "text-brand" : "text-ink"}`}>{value}</p>
      <p className="text-xs font-medium text-muted">{label}</p>
    </div>
  );
}

function TestStep({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
      <span className="text-xs font-bold text-brand-light">{n}</span>
      <h3 className="mt-1 text-lg font-extrabold">{title}</h3>
      <p className="mt-1 text-sm text-white/70">{body}</p>
    </div>
  );
}

function safeParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
