"use client";

import { useMemo, useState } from "react";
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
  hasAttackPrompts,
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

  const visible = useMemo(
    () => (filter === "failed" ? results.filter((r) => !r.passed) : results),
    [results, filter]
  );

  const summaryData = isSummary(summary) ? summary : null;
  const hasResults = results.length > 0;

  async function run() {
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
    <div className="mt-6 rounded-3xl bg-white p-8 ring-1 ring-black/5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand">
              Agent 2
            </span>
            <h2 className="text-lg font-extrabold text-ink">Judge agent — test results</h2>
          </div>
          <p className="mt-1 text-sm text-muted">
            Sends attack prompts to a simulated client AI, then grades each reply pass or fail.
          </p>
        </div>
        <button
          onClick={run}
          disabled={loading || !hasAttackPrompts}
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "Running tests..." : hasResults ? "Re-run tests" : "Run tests"}
        </button>
      </div>

      {error && <p className="mt-4 text-sm font-medium text-risk-high">{error}</p>}

      {!hasAttackPrompts && (
        <div className="mt-6 rounded-2xl bg-cream/60 p-8 text-center text-sm text-muted">
          Generate <span className="font-semibold text-ink">Agent 1</span> attack prompts first,
          then run the Judge agent.
        </div>
      )}

      {hasAttackPrompts && !hasResults && !loading && !error && (
        <div className="mt-6 rounded-2xl bg-cream/60 p-8 text-center text-sm text-muted">
          No test results yet. Click <span className="font-semibold text-ink">Run tests</span> to
          score the client AI&apos;s replies.
        </div>
      )}

      {loading && (
        <div className="mt-6 rounded-2xl bg-cream/60 p-8 text-center text-sm text-muted">
          Simulating replies and grading each response...
        </div>
      )}

      {hasResults && !loading && summaryData && (
        <>
          <div className="mt-6 grid grid-cols-3 gap-3">
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
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-black/5 ${
                      failed > 0 ? "bg-risk-high/10 text-risk-high" : "bg-risk-low/10 text-risk-low"
                    }`}
                  >
                    {ATTACK_CATEGORY_META[c].label}: {failed}/{summaryData.totalByCategory[c]} failed
                  </span>
                );
              })}
          </div>

          <div className="mt-6 flex items-center gap-2">
            <FilterChip label={`All (${results.length})`} active={filter === "all"} onClick={() => setFilter("all")} />
            <FilterChip
              label={`Failures (${summaryData.failed})`}
              active={filter === "failed"}
              onClick={() => setFilter("failed")}
            />
          </div>

          <div className="mt-5 space-y-3">
            {visible.map((r) => {
              const open = openId === r.promptId;
              return (
                <div key={r.promptId} className="rounded-2xl bg-cream/60 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                        r.passed ? "bg-risk-low/15 text-risk-low" : "bg-risk-high/15 text-risk-high"
                      }`}
                    >
                      {r.passed ? "Pass" : "Fail"}
                    </span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted ring-1 ring-black/5">
                      {ATTACK_CATEGORY_META[r.category].label}
                    </span>
                    {!r.passed && (
                      <span className={`text-[11px] font-bold uppercase ${severityStyle[r.severity]}`}>
                        {r.severity}
                      </span>
                    )}
                    {!r.judgedByLlm && (
                      <span className="text-[11px] font-medium uppercase tracking-wide text-muted">
                        heuristic
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-ink/90">{r.prompt}</p>
                  <p className="mt-2 text-sm text-muted">
                    <span className="font-semibold text-ink/80">Verdict:</span> {r.reason}
                  </p>

                  {r.labels.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {r.labels.map((l) => (
                        <span
                          key={l}
                          className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium text-muted ring-1 ring-black/5"
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setOpenId(open ? null : r.promptId)}
                    className="mt-3 text-xs font-semibold text-brand hover:text-brand-dark"
                  >
                    {open ? "Hide AI response" : "Show AI response"}
                  </button>
                  {open && (
                    <p className="mt-2 rounded-xl bg-white p-3 text-sm leading-relaxed text-ink/80 ring-1 ring-black/5">
                      {r.response}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <p className="mt-6 border-t border-black/5 pt-4 text-xs text-muted">
            {`Ran ${new Date(summaryData.ranAt).toLocaleString()}. `}
            {summaryData.usedLlm === false ? "Simulated fallback used (no Groq key or model unavailable). " : ""}
            Questionnaire score unchanged — these are technical test findings from the two-agent probe.
          </p>
        </>
      )}
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
    tone === "pass" ? "text-risk-low" : tone === "fail" ? "text-risk-high" : "text-ink";
  return (
    <div className="rounded-2xl bg-cream/60 p-4 text-center">
      <div className={`text-2xl font-extrabold ${toneStyle}`}>{value}</div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</div>
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
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        active ? "bg-brand text-white" : "bg-cream text-ink/70 hover:bg-panel"
      }`}
    >
      {label}
    </button>
  );
}
