"use client";

import { useEffect, useMemo, useState } from "react";
import { ATTACK_PROMPTS_READY_EVENT } from "@/components/AttackAgentPanel";
import {
  ATTACK_CATEGORY_META,
  type AttackCategory,
  type TestResult,
  type TestRunSummary,
} from "@/lib/agents/types";

const severityStyle: Record<string, string> = {
  high: "text-risk-high",
  medium: "text-risk-medium",
  low: "text-risk-low",
};

type EmptySummary = Record<string, never>;

function isSummary(s: TestRunSummary | EmptySummary): s is TestRunSummary {
  return typeof (s as TestRunSummary).total === "number";
}

export function JudgeAgentPanel({
  assessmentId,
  hasAttackPrompts: initialHasAttackPrompts,
  initialResults,
  initialSummary,
}: {
  assessmentId: string;
  hasAttackPrompts: boolean;
  initialResults: TestResult[];
  initialSummary: TestRunSummary | EmptySummary;
}) {
  const [results, setResults] = useState<TestResult[]>(initialResults);
  const [summary, setSummary] = useState<TestRunSummary | EmptySummary>(initialSummary);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "failed">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [hasAttackPrompts, setHasAttackPrompts] = useState(initialHasAttackPrompts);
  const [open, setOpen] = useState(initialResults.length > 0);

  useEffect(() => {
    function onReady() {
      setHasAttackPrompts(true);
    }
    window.addEventListener(ATTACK_PROMPTS_READY_EVENT, onReady);
    return () => window.removeEventListener(ATTACK_PROMPTS_READY_EVENT, onReady);
  }, []);

  const visible = useMemo(
    () => (filter === "failed" ? results.filter((r) => !r.passed) : results),
    [results, filter]
  );

  const summaryData = isSummary(summary) ? summary : null;
  const hasResults = results.length > 0;

  async function run() {
    setOpen(true);
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/assessments/${assessmentId}/run-tests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Test run failed.");
        return;
      }
      setResults(data.results ?? []);
      setSummary(data.summary ?? {});
      setFilter("all");
      setOpenId(null);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-6 overflow-hidden rounded-[2rem] bg-white shadow-[0_12px_40px_rgba(26,31,54,0.08)] ring-1 ring-black/5">
      <div className="h-1.5 bg-brand" />

      <div className="p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="min-w-0 flex-1 text-left"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand shadow-[0_4px_14px_rgba(43,89,195,0.18)] ring-1 ring-brand/15">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Agent 2
              </span>
              <h2 className="text-xl font-extrabold tracking-tight text-ink">
                Judge agent — test results
              </h2>
              {hasResults && summaryData && (
                <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-bold text-muted">
                  {summaryData.failed} failed / {summaryData.total}
                </span>
              )}
              <Chevron open={open} />
            </div>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              Sends attack prompts to a simulated client AI, then grades each reply pass or fail.
            </p>
          </button>
          <button
            onClick={run}
            disabled={loading || !hasAttackPrompts}
            className="shrink-0 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-brand-light disabled:opacity-70"
          >
            {loading ? "Running tests..." : hasResults ? "Re-run tests" : "Run tests"}
          </button>
        </div>

        {open && (
          <>
            {error && <p className="mt-4 text-sm font-medium text-risk-high">{error}</p>}

            {!hasAttackPrompts && (
              <EmptyState>
                Generate <span className="font-semibold text-ink">Agent 1</span> attack prompts first,
                then run the Judge agent.
              </EmptyState>
            )}

            {hasAttackPrompts && !hasResults && !loading && !error && (
              <EmptyState>
                No test results yet. Click <span className="font-semibold text-ink">Run tests</span>{" "}
                to score the client AI&apos;s replies.
              </EmptyState>
            )}

            {loading && (
              <EmptyState>Simulating replies and grading each response...</EmptyState>
            )}

            {hasResults && !loading && summaryData && (
              <>
                <div className="mt-7 grid grid-cols-3 gap-3">
                  <SummaryStat label="Tests" value={summaryData.total} tone="neutral" />
                  <SummaryStat label="Passed" value={summaryData.passed} tone="pass" />
                  <SummaryStat label="Failed" value={summaryData.failed} tone="fail" />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {(Object.keys(summaryData.totalByCategory) as AttackCategory[])
                    .filter((c) => summaryData.totalByCategory[c] > 0)
                    .map((c) => {
                      const failed = summaryData.failuresByCategory[c];
                      return (
                        <span
                          key={c}
                          className={`inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-[0_2px_8px_rgba(26,31,54,0.06)] ring-1 ${
                            failed > 0
                              ? "text-risk-high ring-risk-high/20"
                              : "text-risk-low ring-risk-low/20"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              failed > 0 ? "bg-risk-high" : "bg-risk-low"
                            }`}
                          />
                          {ATTACK_CATEGORY_META[c].label}: {failed}/
                          {summaryData.totalByCategory[c]} failed
                        </span>
                      );
                    })}
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <FilterChip
                    label={`All (${results.length})`}
                    active={filter === "all"}
                    onClick={() => setFilter("all")}
                  />
                  <FilterChip
                    label={`Failures (${summaryData.failed})`}
                    active={filter === "failed"}
                    onClick={() => setFilter("failed")}
                  />
                </div>

                <div className="mt-5 space-y-3">
                  {visible.map((r) => {
                    const rowOpen = openId === r.promptId;
                    return (
                      <article
                        key={r.promptId}
                        className="rounded-2xl bg-cream/70 p-4 ring-1 ring-black/5"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                              r.passed
                                ? "bg-risk-low/10 text-risk-low"
                                : "bg-risk-high/10 text-risk-high"
                            }`}
                          >
                            {r.passed ? "Pass" : "Fail"}
                          </span>
                          <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted">
                            {ATTACK_CATEGORY_META[r.category].label}
                          </span>
                          {!r.passed && (
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide ${severityStyle[r.severity]}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  r.severity === "high"
                                    ? "bg-risk-high"
                                    : r.severity === "medium"
                                    ? "bg-risk-medium"
                                    : "bg-risk-low"
                                }`}
                              />
                              {r.severity}
                            </span>
                          )}
                          {!r.judgedByLlm && (
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted/80">
                              Heuristic
                            </span>
                          )}
                        </div>

                        <p className="mt-2.5 text-sm leading-relaxed text-ink">{r.prompt}</p>
                        <p className="mt-2 text-sm text-muted">
                          <span className="font-semibold text-ink">Verdict:</span> {r.reason}
                        </p>

                        {r.labels.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {r.labels.map((l) => (
                              <span
                                key={l}
                                className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-medium text-muted"
                              >
                                {l}
                              </span>
                            ))}
                          </div>
                        )}

                        <button
                          onClick={() => setOpenId(rowOpen ? null : r.promptId)}
                          className="mt-3 text-xs font-semibold text-brand transition hover:text-brand-dark"
                        >
                          {rowOpen ? "Hide AI response" : "Show AI response →"}
                        </button>
                        {rowOpen && (
                          <p className="mt-2 rounded-2xl border border-black/5 bg-cream/80 p-3.5 text-sm leading-relaxed text-ink/80">
                            {r.response}
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>

                <p className="mt-6 border-t border-black/5 pt-4 text-xs leading-relaxed text-muted">
                  {`Ran ${new Date(summaryData.ranAt).toLocaleString()}. `}
                  {summaryData.usedLlm === false
                    ? "Simulated fallback used (no Groq key or model unavailable). "
                    : ""}
                  Questionnaire score unchanged — these are technical test findings from the
                  two-agent probe.
                </p>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className={`ml-auto inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream text-brand transition sm:ml-0 ${
        open ? "rotate-180" : ""
      }`}
      aria-hidden
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-7 rounded-[1.5rem] bg-cream px-6 py-10 text-center text-sm leading-relaxed text-muted">
      {children}
    </div>
  );
}

function SummaryStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "neutral" | "pass" | "fail";
}) {
  const toneStyle =
    tone === "pass" ? "text-risk-low" : tone === "fail" ? "text-risk-high" : "text-brand";
  return (
    <div className="rounded-[1.25rem] bg-cream px-4 py-5 text-center shadow-[inset_0_0_0_1px_rgba(26,31,54,0.04)]">
      <div className={`text-3xl font-extrabold tracking-tight ${toneStyle}`}>{value}</div>
      <div className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-brand text-white shadow-sm"
          : "bg-white text-ink/70 shadow-[0_2px_8px_rgba(26,31,54,0.06)] ring-1 ring-black/5 hover:text-brand hover:ring-brand/20"
      }`}
    >
      {label}
    </button>
  );
}
