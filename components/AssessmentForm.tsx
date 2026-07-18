"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, type Answers } from "@/lib/mockRiskEngine";

export const INDUSTRIES = [
  "Banking",
  "Insurance",
  "Retail",
  "Healthcare",
  "Fintech",
  "Telecom",
  "Other",
];

export type AssessmentFormInitial = {
  id?: string;
  clientName?: string;
  industry?: string;
  useCase?: string;
  answers?: Answers;
  status?: string;
};

type Props = {
  initial?: AssessmentFormInitial;
};

export function AssessmentForm({ initial }: Props) {
  const router = useRouter();
  const assessmentId = initial?.id;
  const isEdit = Boolean(assessmentId);

  const steps = useMemo(() => {
    const grouped = new Map<number, typeof QUESTIONS>();
    for (const q of QUESTIONS) {
      const arr = grouped.get(q.step) ?? [];
      arr.push(q);
      grouped.set(q.step, arr);
    }
    return Array.from(grouped.entries()).sort((a, b) => a[0] - b[0]);
  }, []);

  const totalSteps = steps.length + 1;
  const [step, setStep] = useState(0);
  const [clientName, setClientName] = useState(initial?.clientName ?? "");
  const [industry, setIndustry] = useState(initial?.industry ?? INDUSTRIES[0]);
  const [useCase, setUseCase] = useState(initial?.useCase ?? "");
  const [answers, setAnswers] = useState<Answers>(initial?.answers ?? {});
  const [submitting, setSubmitting] = useState<"draft" | "score" | null>(null);
  const [error, setError] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  const progress = Math.round(((step + 1) / totalSteps) * 100);

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setSavedMsg("");
  }

  const currentStepQuestions = step === 0 ? [] : steps[step - 1][1];
  const canProceed =
    step === 0
      ? clientName.trim().length > 0
      : currentStepQuestions.every((q) => answers[q.id]);

  const allQuestionsAnswered = QUESTIONS.every((q) => answers[q.id]);
  const canSaveDraft = clientName.trim().length > 0;

  async function submit(mode: "draft" | "score") {
    if (mode === "score" && !allQuestionsAnswered) {
      setError("Answer all questions before scoring.");
      return;
    }
    if (!canSaveDraft) {
      setError("Client name is required.");
      return;
    }

    setSubmitting(mode);
    setError("");
    setSavedMsg("");

    try {
      const url = isEdit ? `/api/assessments/${assessmentId}` : "/api/assessments";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName, industry, useCase, answers, mode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save assessment.");
        setSubmitting(null);
        return;
      }

      if (mode === "draft") {
        if (!isEdit) {
          router.replace(`/assessments/${data.id}/edit`);
          router.refresh();
          return;
        }
        setSavedMsg("Draft saved.");
        setSubmitting(null);
        router.refresh();
        return;
      }

      router.push(`/assessments/${data.id}`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(null);
    }
  }

  const title = isEdit
    ? initial?.status === "SCORED"
      ? "Edit assessment"
      : "Continue draft"
    : "New AI risk assessment";

  const subtitle = isEdit
    ? initial?.status === "SCORED"
      ? "Update answers and re-score to refresh the report."
      : "Pick up where you left off. Save anytime, score when ready."
    : "Complete the underwriting disclosure. Save a draft or score when ready.";

  const backHref =
    isEdit && initial?.status === "SCORED" && assessmentId
      ? `/assessments/${assessmentId}`
      : "/assessments";
  const backLabel =
    isEdit && initial?.status === "SCORED"
      ? "Back to report"
      : "Back to assessments";

  return (
    <div className="mx-auto max-w-2xl px-8 py-10">
      <Link
        href={backHref}
        className="inline-flex text-sm font-semibold text-brand hover:text-brand-dark"
      >
        &larr; {backLabel}
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink">{title}</h1>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>

      <div className="mt-6">
        <div className="flex justify-between text-xs font-semibold text-muted">
          <span>
            Step {step + 1} of {totalSteps}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-panel">
          <div
            className="h-full rounded-full bg-brand transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-8 rounded-3xl bg-white p-8 ring-1 ring-black/5">
        {step === 0 ? (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-brand">Client</p>
              <h2 className="mt-1 text-xl font-extrabold text-ink">Who are we assessing?</h2>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Client company name</label>
              <input
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value);
                  setSavedMsg("");
                }}
                placeholder="e.g. Helios Retail"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Industry</label>
              <select
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value);
                  setSavedMsg("");
                }}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              >
                {INDUSTRIES.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">
                What does their AI do? <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                value={useCase}
                onChange={(e) => {
                  setUseCase(e.target.value);
                  setSavedMsg("");
                }}
                placeholder="e.g. Customer-facing chatbot for financial advice"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-brand">
                {currentStepQuestions[0]?.section}
              </p>
            </div>
            {currentStepQuestions.map((q) => (
              <div key={q.id}>
                <h2 className="text-lg font-extrabold text-ink">{q.title}</h2>
                <p className="mt-1 text-sm text-muted">{q.help}</p>
                <div className="mt-4 space-y-3">
                  {q.options.map((opt) => {
                    const selected = answers[q.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAnswer(q.id, opt.value)}
                        className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition ${
                          selected
                            ? "border-brand bg-brand/5 text-ink ring-2 ring-brand/20"
                            : "border-black/10 text-ink/80 hover:border-brand/40 hover:bg-cream/50"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                            selected ? "border-brand bg-brand" : "border-black/20"
                          }`}
                        >
                          {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                        </span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="mt-6 text-sm font-medium text-risk-high">{error}</p>}
        {savedMsg && <p className="mt-6 text-sm font-medium text-risk-low">{savedMsg}</p>}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-full px-5 py-3 text-sm font-semibold text-muted transition hover:text-ink disabled:opacity-0"
          >
            &larr; Back
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {(!isEdit || initial?.status !== "SCORED") && (
              <button
                type="button"
                onClick={() => submit("draft")}
                disabled={!canSaveDraft || submitting !== null}
                className="rounded-full px-5 py-3 text-sm font-semibold text-brand ring-1 ring-brand/30 transition hover:bg-brand/5 disabled:opacity-40"
              >
                {submitting === "draft" ? "Saving..." : "Save draft"}
              </button>
            )}

            {step < totalSteps - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed}
                className="rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-40"
              >
                Continue &rarr;
              </button>
            ) : (
              <button
                type="button"
                onClick={() => submit("score")}
                disabled={!allQuestionsAnswered || submitting !== null}
                className="rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-40"
              >
                {submitting === "score"
                  ? "Scoring..."
                  : isEdit && initial?.status === "SCORED"
                    ? "Re-score"
                    : "Calculate risk score"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
