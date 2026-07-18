"use client";

import { useMemo, useState, useTransition } from "react";
import {
  CONDITIONS_LIBRARY,
  type PolicyCondition,
} from "@/lib/conditionsLibrary";

export function ConditionsPicker({
  assessmentId,
  initialSelectedIds,
  recommendedIds,
}: {
  assessmentId: string;
  initialSelectedIds: string[];
  recommendedIds: string[];
}) {
  const recommended = useMemo(() => new Set(recommendedIds), [recommendedIds]);
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(initialSelectedIds)
  );
  const [saved, setSaved] = useState<Set<string>>(
    () => new Set(initialSelectedIds)
  );
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(() => {
    if (selected.size !== saved.size) return true;
    for (const id of selected) if (!saved.has(id)) return true;
    return false;
  }, [selected, saved]);

  function toggle(id: string) {
    setJustSaved(false);
    setError("");
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function applyRecommended() {
    setJustSaved(false);
    setError("");
    setSelected(new Set(recommendedIds));
  }

  function save() {
    startTransition(async () => {
      setError("");
      try {
        const conditions = CONDITIONS_LIBRARY.map((c) => c.id).filter((id) =>
          selected.has(id)
        );
        const res = await fetch(`/api/assessments/${assessmentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "conditions", conditions }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Could not save conditions.");
          return;
        }
        setSaved(new Set(conditions));
        setSelected(new Set(conditions));
        setJustSaved(true);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  const byCategory = useMemo(() => {
    const map = new Map<string, PolicyCondition[]>();
    for (const c of CONDITIONS_LIBRARY) {
      const list = map.get(c.category) ?? [];
      list.push(c);
      map.set(c.category, list);
    }
    return map;
  }, []);

  return (
    <div>
      {/* Screen header — matches Judge / Attack agent collapse pattern */}
      <div className="flex flex-wrap items-start justify-between gap-4 print:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-extrabold tracking-tight text-ink">
              Policy conditions
            </h2>
            <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-bold text-muted">
              {selected.size} selected
            </span>
            <Chevron open={open} />
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Select clauses to attach to this file. Engine recommendations are
            pre-checked; you can add or remove before quoting.
          </p>
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
              applyRecommended();
            }}
            className="rounded-full px-4 py-2 text-sm font-semibold text-brand ring-1 ring-brand/25 hover:bg-brand/5"
          >
            Reset to recommended
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
              save();
            }}
            disabled={!dirty || pending}
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-brand-dark"
          >
            {pending ? "Saving…" : "Save conditions"}
          </button>
        </div>
      </div>

      {open && (
        <div className="print:hidden">
          {error && (
            <p className="mt-3 text-sm font-medium text-risk-high">{error}</p>
          )}
          {justSaved && !dirty && (
            <p className="mt-3 text-sm font-medium text-risk-low">
              Conditions saved to this assessment.
            </p>
          )}

          <div className="mt-5 space-y-6">
            {[...byCategory.entries()].map(([category, items]) => (
              <div key={category}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                  {category}
                </h3>
                <ul className="mt-3 space-y-2">
                  {items.map((c) => {
                    const checked = selected.has(c.id);
                    const isRecommended = recommended.has(c.id);
                    return (
                      <li key={c.id}>
                        <label
                          className={`flex cursor-pointer gap-3 rounded-2xl p-4 ring-1 transition ${
                            checked
                              ? "bg-brand/5 ring-brand/20"
                              : "bg-cream/70 ring-black/5 hover:bg-cream"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggle(c.id)}
                            className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-brand)]"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-semibold text-ink">
                                {c.label}
                              </span>
                              {isRecommended && (
                                <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                                  Recommended
                                </span>
                              )}
                            </span>
                            <span className="mt-1 block text-xs text-muted">
                              {c.help}
                            </span>
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-6 border-t border-black/5 pt-4 text-xs leading-relaxed text-muted">
            Risk score and premium factor are indicative — not actuarial. They
            support underwriting judgement; they do not replace it. Re-scoring
            resets conditions to the engine recommendations.
          </p>
        </div>
      )}

      {/* Collapsed preview of attached clauses */}
      {!open && selected.size > 0 && (
        <ul className="mt-5 space-y-2 print:hidden">
          {CONDITIONS_LIBRARY.filter((c) => selected.has(c.id))
            .slice(0, 3)
            .map((c) => (
              <li
                key={c.id}
                className="flex items-start gap-3 text-sm text-ink/80"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
                  ✓
                </span>
                {c.label}
              </li>
            ))}
          {selected.size > 3 && (
            <li className="pl-9 text-xs font-medium text-muted">
              +{selected.size - 3} more — expand to edit
            </li>
          )}
        </ul>
      )}

      {/* Print: selected clauses only */}
      <div className="mt-5 hidden print:block">
        <h2 className="text-xl font-extrabold tracking-tight text-ink">
          Attached policy conditions
        </h2>
        {saved.size === 0 ? (
          <p className="mt-3 text-sm text-muted">No policy conditions attached.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {CONDITIONS_LIBRARY.filter((c) => saved.has(c.id)).map((c, i) => (
              <li
                key={c.id}
                className="flex items-start gap-3 text-sm text-ink/80 print:break-inside-avoid"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                {c.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
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
      <svg
        viewBox="0 0 20 20"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      >
        <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
