"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RiskBadge } from "@/components/RiskBadge";
import { INDUSTRIES } from "@/components/AssessmentForm";

export type AssessmentListItem = {
  id: string;
  clientName: string;
  industry: string;
  useCase: string;
  status: string;
  score: number;
  tier: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  assessments: AssessmentListItem[];
};

export function AssessmentsList({ assessments }: Props) {
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState("ALL");
  const [industry, setIndustry] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const industries = useMemo(() => {
    const fromData = assessments.map((a) => a.industry).filter(Boolean);
    return Array.from(new Set([...INDUSTRIES, ...fromData])).sort();
  }, [assessments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assessments.filter((a) => {
      if (q && !a.clientName.toLowerCase().includes(q)) return false;
      if (tier !== "ALL" && a.tier !== tier) return false;
      if (industry !== "ALL" && a.industry !== industry) return false;
      if (status !== "ALL" && a.status !== status) return false;
      return true;
    });
  }, [assessments, query, tier, industry, status]);

  const hasFilters = query.trim() !== "" || tier !== "ALL" || industry !== "ALL" || status !== "ALL";

  function clearFilters() {
    setQuery("");
    setTier("ALL");
    setIndustry("ALL");
    setStatus("ALL");
  }

  function hrefFor(a: AssessmentListItem) {
    return a.status === "DRAFT" ? `/assessments/${a.id}/edit` : `/assessments/${a.id}`;
  }

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">Assessments</h1>
          <p className="mt-1 text-sm text-muted">
            AI risk assessments across your client portfolio.
          </p>
        </div>
        <Link
          href="/assessments/new"
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
        >
          + New assessment
        </Link>
      </header>

      <div className="mt-6 flex flex-wrap items-end gap-3 rounded-3xl bg-white p-4 ring-1 ring-black/5">
        <div className="min-w-[180px] flex-1">
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted">
            Search client
          </label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Client name…"
            className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <FilterSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "ALL", label: "All statuses" },
            { value: "DRAFT", label: "Draft" },
            { value: "SCORED", label: "Scored" },
          ]}
        />
        <FilterSelect
          label="Risk tier"
          value={tier}
          onChange={setTier}
          options={[
            { value: "ALL", label: "All tiers" },
            { value: "HIGH", label: "High" },
            { value: "MEDIUM", label: "Medium" },
            { value: "LOW", label: "Low" },
            { value: "PENDING", label: "Not scored" },
          ]}
        />
        <FilterSelect
          label="Industry"
          value={industry}
          onChange={setIndustry}
          options={[
            { value: "ALL", label: "All industries" },
            ...industries.map((i) => ({ value: i, label: i })),
          ]}
        />
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-muted transition hover:text-ink"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl bg-white ring-1 ring-black/5">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/5 text-xs font-bold uppercase tracking-wider text-muted">
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Industry</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4">Risk</th>
              <th className="px-6 py-4 text-right">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {filtered.map((a) => (
              <tr key={a.id} className="group transition hover:bg-cream/50">
                <td className="px-6 py-4">
                  <Link
                    href={hrefFor(a)}
                    className="font-semibold text-ink group-hover:text-brand"
                  >
                    {a.clientName}
                  </Link>
                  <p className="max-w-xs truncate text-xs text-muted">{a.useCase}</p>
                </td>
                <td className="px-6 py-4 text-sm text-muted">{a.industry}</td>
                <td className="px-6 py-4">
                  <StatusPill status={a.status} />
                </td>
                <td className="px-6 py-4 text-lg font-extrabold text-ink">
                  {a.status === "DRAFT" ? "—" : a.score}
                </td>
                <td className="px-6 py-4">
                  <RiskBadge tier={a.tier} />
                </td>
                <td className="px-6 py-4 text-right text-sm text-muted">
                  {new Date(a.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {assessments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted">
                  No assessments yet.{" "}
                  <Link href="/assessments/new" className="font-semibold text-brand">
                    Create your first one.
                  </Link>
                </td>
              </tr>
            )}
            {assessments.length > 0 && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted">
                  No assessments match these filters.{" "}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="font-semibold text-brand"
                  >
                    Clear filters
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {assessments.length > 0 && (
        <p className="mt-3 text-xs text-muted">
          Showing {filtered.length} of {assessments.length}
        </p>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="min-w-[140px]">
      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const isDraft = status === "DRAFT";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ${
        isDraft
          ? "bg-panel text-muted ring-black/5"
          : "bg-brand/10 text-brand ring-brand/20"
      }`}
    >
      {isDraft ? "Draft" : "Scored"}
    </span>
  );
}
