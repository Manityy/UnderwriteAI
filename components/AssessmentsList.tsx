"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { RiskBadge } from "@/components/RiskBadge";
import { DecisionBadge } from "@/components/DecisionPanel";
import { INDUSTRIES } from "@/components/AssessmentForm";
import { Link } from "@/i18n/navigation";

export type AssessmentListItem = {
  id: string;
  clientName: string;
  industry: string;
  useCase: string;
  status: string;
  score: number;
  tier: string;
  decision: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  assessments: AssessmentListItem[];
};

export function AssessmentsList({ assessments }: Props) {
  const t = useTranslations("assessment");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState("ALL");
  const [industry, setIndustry] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [decision, setDecision] = useState("ALL");

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
      if (decision === "NONE" && a.decision) return false;
      if (decision !== "ALL" && decision !== "NONE" && a.decision !== decision) {
        return false;
      }
      return true;
    });
  }, [assessments, query, tier, industry, status, decision]);

  const hasFilters =
    query.trim() !== "" ||
    tier !== "ALL" ||
    industry !== "ALL" ||
    status !== "ALL" ||
    decision !== "ALL";

  function clearFilters() {
    setQuery("");
    setTier("ALL");
    setIndustry("ALL");
    setStatus("ALL");
    setDecision("ALL");
  }

  function hrefFor(a: AssessmentListItem) {
    return a.status === "DRAFT" ? `/assessments/${a.id}/edit` : `/assessments/${a.id}`;
  }

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">{t("listTitle")}</h1>
          <p className="mt-1 text-sm text-muted">
            {t("listSubtitle")}
          </p>
        </div>
        <Link
          href="/assessments/new"
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
        >
          {t("newButton")}
        </Link>
      </header>

      <div className="mt-6 flex flex-wrap items-end gap-3 rounded-3xl bg-white p-4 ring-1 ring-black/5">
        <div className="min-w-[180px] flex-1">
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted">
            {t("searchLabel")}
          </label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <FilterSelect
          label={t("status")}
          value={status}
          onChange={setStatus}
          options={[
            { value: "ALL", label: t("allStatuses") },
            { value: "DRAFT", label: t("statusDraft") },
            { value: "SCORED", label: t("statusScored") },
          ]}
        />
        <FilterSelect
          label={t("decision")}
          value={decision}
          onChange={setDecision}
          options={[
            { value: "ALL", label: t("allDecisions") },
            { value: "NONE", label: t("noDecision") },
            { value: "ACCEPT", label: t("decisionAccept") },
            { value: "ACCEPT_WITH_CONDITIONS", label: t("decisionAcceptWithConditions") },
            { value: "REFER", label: t("decisionRefer") },
            { value: "DECLINE", label: t("decisionDecline") },
          ]}
        />
        <FilterSelect
          label={t("riskTier")}
          value={tier}
          onChange={setTier}
          options={[
            { value: "ALL", label: t("allTiers") },
            { value: "HIGH", label: tCommon("high") },
            { value: "MEDIUM", label: tCommon("medium") },
            { value: "LOW", label: tCommon("low") },
            { value: "PENDING", label: tCommon("notScored") },
          ]}
        />
        <FilterSelect
          label={t("industry")}
          value={industry}
          onChange={setIndustry}
          options={[
            { value: "ALL", label: t("allIndustries") },
            ...industries.map((i) => ({ value: i, label: t.has(`industries.${i}`) ? t(`industries.${i}`) : i })),
          ]}
        />
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-muted transition hover:text-ink"
          >
            {tCommon("clear")}
          </button>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl bg-white ring-1 ring-black/5">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/5 text-xs font-bold uppercase tracking-wider text-muted">
              <th className="px-6 py-4">{t("colClient")}</th>
              <th className="px-6 py-4">{t("colIndustry")}</th>
              <th className="px-6 py-4">{t("colStatus")}</th>
              <th className="px-6 py-4">{t("colScore")}</th>
              <th className="px-6 py-4">{t("colRisk")}</th>
              <th className="px-6 py-4">{t("colDecision")}</th>
              <th className="px-6 py-4 text-right">{t("colUpdated")}</th>
              <th className="px-6 py-4 text-right">{t("colActions")}</th>
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
                <td className="px-6 py-4 text-sm text-muted">
                  {t.has(`industries.${a.industry}`) ? t(`industries.${a.industry}`) : a.industry}
                </td>
                <td className="px-6 py-4">
                  <StatusPill status={a.status} />
                </td>
                <td className="px-6 py-4 text-lg font-extrabold text-ink">
                  {a.status === "DRAFT" ? "—" : a.score}
                </td>
                <td className="px-6 py-4">
                  <RiskBadge tier={a.tier} />
                </td>
                <td className="px-6 py-4">
                  {a.status === "DRAFT" ? (
                    <span className="text-sm text-muted">—</span>
                  ) : (
                    <DecisionBadge decision={a.decision || null} />
                  )}
                </td>
                <td className="px-6 py-4 text-right text-sm text-muted">
                  {new Date(a.updatedAt).toLocaleDateString(locale)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {a.status === "DRAFT" ? (
                      <Link
                        href={`/assessments/${a.id}/edit`}
                        className="rounded-full px-3 py-1.5 text-xs font-semibold text-brand ring-1 ring-brand/30 transition hover:bg-brand/5"
                      >
                        {t("actionContinue")}
                      </Link>
                    ) : (
                      <>
                        <Link
                          href={`/assessments/${a.id}`}
                          className="rounded-full px-3 py-1.5 text-xs font-semibold text-muted ring-1 ring-black/10 transition hover:text-ink"
                        >
                          {t("actionView")}
                        </Link>
                        <Link
                          href={`/assessments/${a.id}/edit`}
                          className="rounded-full px-3 py-1.5 text-xs font-semibold text-brand ring-1 ring-brand/30 transition hover:bg-brand/5"
                        >
                          {t("actionEdit")}
                        </Link>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {assessments.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-sm text-muted">
                  {t("emptyTitle")}{" "}
                  <Link href="/assessments/new" className="font-semibold text-brand">
                    {tCommon("createFirst")}
                  </Link>
                </td>
              </tr>
            )}
            {assessments.length > 0 && filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-sm text-muted">
                  {t("emptyFiltered")}{" "}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="font-semibold text-brand"
                  >
                    {tCommon("clearFilters")}
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {assessments.length > 0 && (
        <p className="mt-3 text-xs text-muted">
          {t("showingOf", { filtered: filtered.length, total: assessments.length })}
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
  const t = useTranslations("assessment");
  const isDraft = status === "DRAFT";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ${
        isDraft
          ? "bg-panel text-muted ring-black/5"
          : "bg-brand/10 text-brand ring-brand/20"
      }`}
    >
      {isDraft ? t("statusDraft") : t("statusScored")}
    </span>
  );
}
