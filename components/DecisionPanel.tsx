"use client";

import { useMemo, useState, useTransition } from "react";
import {
  DECISION_OPTIONS,
  decisionBadgeClass,
  decisionLabel,
  type UnderwritingDecision,
} from "@/lib/underwritingDecision";

export function DecisionPanel({
  assessmentId,
  initialDecision,
  initialNote,
  initialDecidedAt,
}: {
  assessmentId: string;
  initialDecision: UnderwritingDecision | null;
  initialNote: string;
  initialDecidedAt: string | null;
}) {
  const [decision, setDecision] = useState<UnderwritingDecision | null>(initialDecision);
  const [note, setNote] = useState(initialNote);
  const [savedDecision, setSavedDecision] = useState(initialDecision);
  const [savedNote, setSavedNote] = useState(initialNote);
  const [decidedAt, setDecidedAt] = useState(initialDecidedAt);
  const [error, setError] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(() => {
    return decision !== savedDecision || note.trim() !== savedNote.trim();
  }, [decision, note, savedDecision, savedNote]);

  function save() {
    if (!decision) {
      setError("Select a decision before saving.");
      return;
    }
    startTransition(async () => {
      setError("");
      try {
        const res = await fetch(`/api/assessments/${assessmentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "decision",
            decision,
            decisionNote: note.trim(),
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Could not save decision.");
          return;
        }
        setSavedDecision(decision);
        setSavedNote(note.trim());
        setNote(note.trim());
        setDecidedAt(data.decisionAt ?? new Date().toISOString());
        setJustSaved(true);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  function clearDecision() {
    startTransition(async () => {
      setError("");
      try {
        const res = await fetch(`/api/assessments/${assessmentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "decision",
            decision: "",
            decisionNote: "",
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Could not clear decision.");
          return;
        }
        setDecision(null);
        setNote("");
        setSavedDecision(null);
        setSavedNote("");
        setDecidedAt(null);
        setJustSaved(false);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  const decidedLabel = decidedAt
    ? new Date(decidedAt).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div>
      {/* Screen controls */}
      <div className="print:hidden">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-ink">
              Underwriting decision
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Record the file decision for underwriting support. This does not bind
              coverage.
            </p>
          </div>
          {savedDecision && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${decisionBadgeClass(savedDecision)}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {decisionLabel(savedDecision)}
            </span>
          )}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {DECISION_OPTIONS.map((opt) => {
            const active = decision === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setDecision(opt.id);
                  setJustSaved(false);
                  setError("");
                }}
                className={`rounded-2xl p-4 text-left ring-1 transition ${
                  active
                    ? "bg-brand/5 ring-brand/30"
                    : "bg-cream/70 ring-black/5 hover:bg-cream"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ring-2 ${
                      active ? "ring-brand" : "ring-black/15"
                    }`}
                  >
                    {active && <span className="h-2 w-2 rounded-full bg-brand" />}
                  </span>
                  <span className="text-sm font-extrabold text-ink">{opt.label}</span>
                </span>
                <span className="mt-2 block pl-6 text-xs leading-relaxed text-muted">
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>

        <label className="mt-5 block">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Rationale (optional)
          </span>
          <textarea
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setJustSaved(false);
            }}
            rows={3}
            maxLength={1000}
            placeholder="Short note for the file — e.g. conditions required, referral reason…"
            className="mt-1.5 w-full resize-y rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={save}
            disabled={!dirty || pending || !decision}
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-brand-dark"
          >
            {pending ? "Saving…" : "Save decision"}
          </button>
          {savedDecision && (
            <button
              type="button"
              onClick={clearDecision}
              disabled={pending}
              className="rounded-full px-4 py-2.5 text-sm font-semibold text-muted ring-1 ring-black/10 hover:text-ink"
            >
              Clear
            </button>
          )}
          {decidedLabel && savedDecision && (
            <span className="text-xs text-muted">Recorded {decidedLabel}</span>
          )}
        </div>

        {error && (
          <p className="mt-3 text-sm font-medium text-risk-high">{error}</p>
        )}
        {justSaved && !dirty && (
          <p className="mt-3 text-sm font-medium text-risk-low">
            Decision saved to this assessment.
          </p>
        )}
      </div>

      {/* Print block */}
      <div className="hidden print:block">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted">
          Underwriting decision
        </h2>
        {savedDecision ? (
          <>
            <p className="mt-2 text-xl font-extrabold text-ink">
              {decisionLabel(savedDecision)}
            </p>
            {savedNote && (
              <p className="mt-2 text-sm leading-relaxed text-ink/80">{savedNote}</p>
            )}
            {decidedLabel && (
              <p className="mt-2 text-xs text-muted">Recorded {decidedLabel}</p>
            )}
            <p className="mt-3 text-[11px] text-muted">
              Decision-support record only — does not bind coverage.
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-muted">No underwriting decision recorded.</p>
        )}
      </div>
    </div>
  );
}

export function DecisionBadge({
  decision,
  className = "",
}: {
  decision: string | null | undefined;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${decisionBadgeClass(decision)} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {decision ? decisionLabel(decision) : "No decision"}
    </span>
  );
}
