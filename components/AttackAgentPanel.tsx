"use client";

import { useMemo, useState } from "react";
import {
  ATTACK_CATEGORIES,
  ATTACK_CATEGORY_META,
  type AttackCategory,
  type AttackPrompt,
} from "@/lib/agents/types";

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

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of prompts) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [prompts]);

  const visible = useMemo(
    () => (active === "all" ? prompts : prompts.filter((p) => p.category === active)),
    [prompts, active]
  );

  async function generate() {
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
    <div className="mt-6 rounded-3xl bg-white p-8 ring-1 ring-black/5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand">
              Agent 1
            </span>
            <h2 className="text-lg font-extrabold text-ink">Attack agent — generated tests</h2>
          </div>
          <p className="mt-1 text-sm text-muted">
            Adversarial prompts that probe the client&apos;s AI across eight risk categories.
          </p>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "Generating..." : hasPrompts ? "Regenerate" : "Generate attack prompts"}
        </button>
      </div>

      {error && <p className="mt-4 text-sm font-medium text-risk-high">{error}</p>}

      {!hasPrompts && !loading && !error && (
        <div className="mt-6 rounded-2xl bg-cream/60 p-8 text-center text-sm text-muted">
          No attack prompts yet. Click <span className="font-semibold text-ink">Generate attack
          prompts</span> to run Agent 1.
        </div>
      )}

      {loading && (
        <div className="mt-6 rounded-2xl bg-cream/60 p-8 text-center text-sm text-muted">
          Running the attack agent across 8 categories...
        </div>
      )}

      {hasPrompts && !loading && (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-2">
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
              <div key={p.id} className="rounded-2xl bg-cream/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted ring-1 ring-black/5">
                    {ATTACK_CATEGORY_META[p.category].label}
                  </span>
                  <span className={`text-[11px] font-bold uppercase ${severityStyle[p.severityHint]}`}>
                    {p.severityHint}
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted">
                    {p.source === "llm" ? "AI-generated" : "seed"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink/90">{p.prompt}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 border-t border-black/5 pt-4 text-xs text-muted">
            {generatedAt ? `Generated ${new Date(generatedAt).toLocaleString()}. ` : ""}
            {usedLlm === false ? "Seed fallback used (no Groq key or model unavailable). " : ""}
            Next step: Agent 2 (Judge) will send these to the client&apos;s AI and score the replies.
          </p>
        </>
      )}
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
