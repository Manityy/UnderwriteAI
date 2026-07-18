"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ATTACK_CATEGORIES,
  ATTACK_CATEGORY_META,
  type AttackCategory,
  type AttackPrompt,
} from "@/lib/agents/types";

export const ATTACK_PROMPTS_READY_EVENT = "underwriteai:attack-prompts-ready";

const severityStyle: Record<string, string> = {
  high: "text-risk-high",
  medium: "text-risk-medium",
  low: "text-risk-low",
};

export function AttackAgentPanel({
  assessmentId,
  initialPrompts,
  initialGeneratedAt,
}: {
  assessmentId: string;
  initialPrompts: AttackPrompt[];
  initialGeneratedAt: string | null;
}) {
  const [prompts, setPrompts] = useState<AttackPrompt[]>(initialPrompts);
  const [generatedAt, setGeneratedAt] = useState<string | null>(initialGeneratedAt);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [active, setActive] = useState<AttackCategory | "all">("all");
  const [usedLlm, setUsedLlm] = useState<boolean | null>(null);
  const [open, setOpen] = useState(initialPrompts.length > 0);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of prompts) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [prompts]);

  const visible = useMemo(
    () => (active === "all" ? prompts : prompts.filter((p) => p.category === active)),
    [prompts, active]
  );

  useEffect(() => {
    if (prompts.length > 0) {
      window.dispatchEvent(
        new CustomEvent(ATTACK_PROMPTS_READY_EVENT, { detail: { count: prompts.length } })
      );
    }
  }, [prompts.length]);

  async function generate() {
    setOpen(true);
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/assessments/${assessmentId}/attack-prompts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Generation failed.");
        return;
      }
      setPrompts(data.prompts ?? []);
      setUsedLlm(Boolean(data.usedLlm));
      setGeneratedAt(new Date().toISOString());
      setActive("all");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const hasPrompts = prompts.length > 0;

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
                Agent 1
              </span>
              <h2 className="text-xl font-extrabold tracking-tight text-ink">
                Attack agent — generated tests
              </h2>
              {hasPrompts && (
                <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-bold text-muted">
                  {prompts.length}
                </span>
              )}
              <Chevron open={open} />
            </div>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              Adversarial prompts that probe the client&apos;s AI across eight risk categories.
            </p>
          </button>
          <button
            onClick={generate}
            disabled={loading}
            className="shrink-0 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Generating..." : hasPrompts ? "Regenerate" : "Generate attack prompts"}
          </button>
        </div>

        {open && (
          <>
            {error && <p className="mt-4 text-sm font-medium text-risk-high">{error}</p>}

            {!hasPrompts && !loading && !error && (
              <EmptyState>
                No attack prompts yet. Click{" "}
                <span className="font-semibold text-ink">Generate attack prompts</span> to run Agent 1.
              </EmptyState>
            )}

            {loading && (
              <EmptyState>Running the attack agent across 8 categories...</EmptyState>
            )}

            {hasPrompts && !loading && (
              <>
                <div className="mt-7 flex flex-wrap items-center gap-2">
                  <FilterChip
                    label={`All (${prompts.length})`}
                    active={active === "all"}
                    onClick={() => setActive("all")}
                  />
                  {ATTACK_CATEGORIES.filter((c) => counts[c]).map((c) => (
                    <FilterChip
                      key={c}
                      label={`${ATTACK_CATEGORY_META[c].label} (${counts[c]})`}
                      active={active === c}
                      onClick={() => setActive(c)}
                    />
                  ))}
                </div>

                <div className="mt-5 space-y-3">
                  {visible.map((p) => (
                    <article
                      key={p.id}
                      className="rounded-2xl bg-cream/70 p-4 ring-1 ring-black/5"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted">
                          {ATTACK_CATEGORY_META[p.category].label}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide ${severityStyle[p.severityHint]}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              p.severityHint === "high"
                                ? "bg-risk-high"
                                : p.severityHint === "medium"
                                ? "bg-risk-medium"
                                : "bg-risk-low"
                            }`}
                          />
                          {p.severityHint}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted/80">
                          {p.source === "llm" ? "AI-generated" : "Seed"}
                        </span>
                      </div>
                      <p className="mt-2.5 text-sm leading-relaxed text-ink">{p.prompt}</p>
                    </article>
                  ))}
                </div>

                <p className="mt-6 border-t border-black/5 pt-4 text-xs leading-relaxed text-muted">
                  {generatedAt ? `Generated ${new Date(generatedAt).toLocaleString()}. ` : ""}
                  {usedLlm === false
                    ? "Seed fallback used (no Groq key or model unavailable). "
                    : ""}
                  Next step: Agent 2 (Judge) will send these to the client&apos;s AI and score the
                  replies.
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
