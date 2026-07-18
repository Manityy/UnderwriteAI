import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ScoreGauge } from "@/components/ScoreGauge";
import { RiskBadge } from "@/components/RiskBadge";
import { PrintReportButton } from "@/components/PrintReportButton";
import { AttackAgentPanel } from "@/components/AttackAgentPanel";
import { JudgeAgentPanel } from "@/components/JudgeAgentPanel";
import { DecisionPanel } from "@/components/DecisionPanel";
import { ConditionsPicker } from "@/components/ConditionsPicker";
import { normalizeStoredConditions } from "@/lib/conditionsLibrary";
import { decisionShortLabel, parseDecision } from "@/lib/underwritingDecision";
import {
  buildScoreDrivers,
  formatPremiumFactor,
  mergeTestSignalDrivers,
  premiumFactorFromScore,
  recommendConditionIds,
  type Answers,
  type Finding,
  type ScoreDriver,
  type Tier,
} from "@/lib/mockRiskEngine";
import type { AttackPrompt, TestResult, TestRunSummary } from "@/lib/agents/types";

const sevColor: Record<string, string> = {
  HIGH: "text-risk-high",
  MEDIUM: "text-risk-medium",
  LOW: "text-risk-low",
};

const tierLabel: Record<string, string> = {
  LOW: "Low risk",
  MEDIUM: "Medium risk",
  HIGH: "High risk",
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

  if (assessment.status === "DRAFT") {
    redirect(`/assessments/${id}/edit`);
  }

  const findings: Finding[] = safeParse(assessment.findings, []);
  const storedConditions: string[] = safeParse(assessment.conditions, []);
  const selectedConditionIds = normalizeStoredConditions(storedConditions);
  const answers: Answers = safeParse(assessment.answers, {});
  const storedDrivers: ScoreDriver[] = safeParse(assessment.scoreDrivers, []);
  const recommendedConditionIds = recommendConditionIds(
    answers,
    assessment.tier as Tier
  );
  // Legacy freeform-only rows: fall back to engine recommendations so the picker isn't empty
  const initialConditionIds =
    selectedConditionIds.length > 0 ? selectedConditionIds : recommendedConditionIds;
  const premiumFactor =
    assessment.premiumFactor > 0
      ? assessment.premiumFactor
      : premiumFactorFromScore(assessment.score);
  const attackPrompts: AttackPrompt[] = safeParse(assessment.attackPrompts, []);
  const testResults: TestResult[] = safeParse(assessment.testResults, []);
  const testSummary: TestRunSummary | Record<string, never> = safeParse(
    assessment.testSummary,
    {}
  );

  const baseDrivers =
    storedDrivers.length > 0 ? storedDrivers : buildScoreDrivers(answers);
  const scoreDrivers = mergeTestSignalDrivers(
    baseDrivers,
    "failuresByCategory" in testSummary ? testSummary.failuresByCategory : null
  );

  const reportDate = new Date(assessment.updatedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const pdfTitle = `${slugify(assessment.clientName)}-AI-risk-report`;

  const tierMessage =
    assessment.tier === "HIGH"
      ? "Coverage should be declined or repriced until the high-severity findings are remediated."
      : assessment.tier === "MEDIUM"
      ? "Coverage is feasible with the conditions below attached to the policy."
      : "Standard coverage is appropriate. Maintain controls and re-assess at renewal.";

  return (
    <div className="report-print mx-auto max-w-5xl px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/assessments" className="text-sm font-semibold text-brand hover:text-brand-dark">
          &larr; Back to assessments
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/assessments/${id}/edit`}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-brand ring-1 ring-brand/30 transition hover:bg-brand/5"
          >
            Edit &amp; re-score
          </Link>
          <PrintReportButton documentTitle={pdfTitle} />
        </div>
      </div>

      {/* Print letterhead */}
      <div className="mb-6 hidden border-b border-black/15 pb-4 print:block">
        <p className="text-xs font-bold uppercase tracking-wider text-brand">UnderwriteAI</p>
        <h1 className="mt-1 text-2xl font-extrabold text-ink">AI Risk Underwriting Report</h1>
        <p className="mt-1 text-sm text-muted">
          Prepared for underwriting review · {reportDate}
        </p>
      </div>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4 print:mt-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink print:text-2xl">
            {assessment.clientName}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {assessment.industry}
            {assessment.useCase ? ` · ${assessment.useCase}` : ""}
          </p>
          <p className="mt-1 hidden text-xs text-muted print:block">Report date: {reportDate}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <RiskBadge tier={assessment.tier} className="mt-2" />
        </div>
      </header>

      {/* Underwriting decision */}
      <div className="report-card mt-6 overflow-hidden rounded-[2rem] bg-white p-0 shadow-[0_12px_40px_rgba(26,31,54,0.08)] ring-1 ring-black/5 print:mt-5 print:border print:border-black/10 print:p-6 print:shadow-none print:ring-0">
        <div className="h-1.5 bg-brand print:hidden" />
        <div className="p-8 print:p-0">
          <DecisionPanel
            assessmentId={assessment.id}
            initialDecision={parseDecision(assessment.decision)}
            initialNote={assessment.decisionNote ?? ""}
            initialDecidedAt={
              assessment.decisionAt ? assessment.decisionAt.toISOString() : null
            }
          />
        </div>
      </div>

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

        {/* Print-only key metrics (cleaner than animated gauge) */}
        <div className="report-card hidden rounded-3xl border border-black/10 bg-white p-6 print:block">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Key metrics</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <PrintMetric label="Risk score" value={String(assessment.score)} />
            <PrintMetric
              label="Risk tier"
              value={tierLabel[assessment.tier] ?? assessment.tier}
            />
            <PrintMetric label="Premium factor" value={formatPremiumFactor(premiumFactor)} />
            <PrintMetric
              label="Decision"
              value={decisionShortLabel(assessment.decision)}
            />
          </div>
          <p className="mt-3 text-[11px] text-muted">
            Premium factor: indicative — not actuarial (1.00x + score/100 × 1.50).
          </p>
        </div>

        <div className="report-card rounded-3xl bg-white p-8 ring-1 ring-black/5 print:p-6 print:ring-0 print:border print:border-black/10">
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

      {/* Why this score */}
      {scoreDrivers.length > 0 && (
        <div className="report-card mt-6 overflow-hidden rounded-[2rem] bg-white p-0 shadow-[0_12px_40px_rgba(26,31,54,0.08)] ring-1 ring-black/5 print:mt-5 print:border print:border-black/10 print:p-6 print:shadow-none print:ring-0">
          <div className="h-1.5 bg-brand print:hidden" />
          <div className="p-8 print:p-0">
            <h2 className="text-xl font-extrabold tracking-tight text-ink">Why this score</h2>
            <p className="mt-2 text-sm text-muted">
              Top drivers of the {tierLabel[assessment.tier]?.toLowerCase() ?? assessment.tier}{" "}
              rating — from disclosures
              {"failuresByCategory" in testSummary &&
              testSummary.failed &&
              testSummary.failed > 0
                ? " and red-team tests"
                : ""}
              .
            </p>
            <ol className="mt-5 space-y-4">
              {scoreDrivers.map((d, i) => (
                <li
                  key={`${d.title}-${i}`}
                  className="flex gap-4 rounded-2xl bg-cream/70 p-5 ring-1 ring-black/5 print:break-inside-avoid print:rounded-none print:border-b print:border-black/10 print:bg-transparent print:px-0 print:pb-4 print:ring-0"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-ink">{d.title}</h3>
                      <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted print:bg-transparent">
                        {d.theme}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{d.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* How we tested — screen only */}
      <div className="mt-6 overflow-hidden rounded-[2rem] bg-white shadow-[0_12px_40px_rgba(26,31,54,0.08)] ring-1 ring-black/5 print:hidden">
        <div className="h-1.5 bg-brand" />
        <div className="p-8">
          <h2 className="text-xl font-extrabold tracking-tight text-ink">How we assessed this</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <TestStep n="01" title="Ask" body="Client disclosures on use, data and controls." />
            <TestStep n="02" title="Test" body="Attack agent probed the system; judge agent graded every response." />
            <TestStep n="03" title="Score" body="Disclosures and test results combined into one risk score." />
          </div>
        </div>
      </div>

      {/* Attack agent (Agent 1) */}
      <div className="print:hidden">
        <AttackAgentPanel
          assessmentId={assessment.id}
          initialPrompts={attackPrompts}
          initialGeneratedAt={
            assessment.attackGeneratedAt ? assessment.attackGeneratedAt.toISOString() : null
          }
        />
      </div>

      {/* Judge agent (Agent 2) */}
      <div className="print:hidden">
        <JudgeAgentPanel
          assessmentId={assessment.id}
          hasAttackPrompts={attackPrompts.length > 0}
          initialResults={testResults}
          initialSummary={testSummary}
        />
      </div>

      {/* Findings */}
      <div className="report-card mt-6 overflow-hidden rounded-[2rem] bg-white p-0 shadow-[0_12px_40px_rgba(26,31,54,0.08)] ring-1 ring-black/5 print:mt-5 print:border print:border-black/10 print:p-6 print:shadow-none print:ring-0">
        <div className="h-1.5 bg-brand print:hidden" />
        <div className="p-8 print:p-0">
          <h2 className="text-xl font-extrabold tracking-tight text-ink">Findings</h2>
          <div className="mt-5 space-y-3">
            {findings.map((f, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-2xl bg-cream/70 p-5 ring-1 ring-black/5 print:break-inside-avoid print:rounded-none print:border-b print:border-black/10 print:bg-transparent print:px-0 print:pb-4 print:ring-0"
              >
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                  f.severity === "HIGH"
                    ? "bg-risk-high"
                    : f.severity === "MEDIUM"
                    ? "bg-risk-medium"
                    : "bg-risk-low"
                }`} />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-ink">{f.title}</h3>
                    <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted print:bg-transparent">
                      {f.category}
                    </span>
                    <span className={`text-[11px] font-bold uppercase tracking-wide ${sevColor[f.severity]}`}>
                      {f.severity}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Policy conditions library / picker */}
      <div className="report-card mt-6 overflow-hidden rounded-[2rem] bg-white p-0 shadow-[0_12px_40px_rgba(26,31,54,0.08)] ring-1 ring-black/5 print:mt-5 print:border print:border-black/10 print:p-6 print:shadow-none print:ring-0">
        <div className="h-1.5 bg-brand print:hidden" />
        <div className="p-8 print:p-0">
          <ConditionsPicker
            assessmentId={assessment.id}
            initialSelectedIds={initialConditionIds}
            recommendedIds={recommendedConditionIds}
          />
        </div>
      </div>

      <p className="mt-8 hidden text-[10px] text-muted print:block">
        Generated by UnderwriteAI · Confidential — for underwriting use only
      </p>
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

function PrintMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xl font-extrabold text-ink">{value}</p>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}

function TestStep({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-cream/70 p-5 ring-1 ring-black/5">
      <span className="text-xs font-bold text-brand">{n}</span>
      <h3 className="mt-1 text-lg font-extrabold tracking-tight text-ink">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function slugify(value: string): string {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "AI-risk-report";
}

function safeParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
