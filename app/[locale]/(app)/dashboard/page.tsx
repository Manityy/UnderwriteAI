import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tierFromScore, type Tier, type Finding } from "@/lib/mockRiskEngine";
import { AnimatedScoreRing } from "@/components/AnimatedScoreRing";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { localizeCategory } from "@/lib/localizeRisk";

/** Blue intensity: darkest = highest risk. No green / yellow / red. */
const TIER_BLUE: Record<
  Tier | "PENDING",
  { bg: string; text: string; bar: string; ring: string; css: string }
> = {
  HIGH: {
    bg: "bg-brand-dark/10",
    text: "text-brand-dark",
    bar: "bg-brand-dark",
    ring: "ring-brand-dark/20",
    css: "var(--color-brand-dark)",
  },
  MEDIUM: {
    bg: "bg-brand/10",
    text: "text-brand",
    bar: "bg-brand",
    ring: "ring-brand/20",
    css: "var(--color-brand)",
  },
  LOW: {
    bg: "bg-brand-light/15",
    text: "text-brand-light",
    bar: "bg-brand-light",
    ring: "ring-brand-light/25",
    css: "var(--color-brand-light)",
  },
  PENDING: {
    bg: "bg-panel",
    text: "text-muted",
    bar: "bg-panel",
    ring: "ring-black/5",
    css: "var(--color-panel)",
  },
};

const RANK_BLUE = ["bg-brand-dark", "bg-brand", "bg-brand/65", "bg-brand-light"];

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "dashboard" });
  const tAssessment = await getTranslations({ locale, namespace: "assessment" });
  const tButtons = await getTranslations({ locale, namespace: "buttons" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tRisk = await getTranslations({ locale, namespace: "risk" });
  const session = await getSession();
  if (!session) {
    redirect({ href: "/login", locale });
    return null;
  }

  const assessments = await prisma.assessment.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  const scored = assessments.filter((a) => a.tier !== "PENDING");
  const counts = {
    HIGH: scored.filter((a) => a.tier === "HIGH").length,
    MEDIUM: scored.filter((a) => a.tier === "MEDIUM").length,
    LOW: scored.filter((a) => a.tier === "LOW").length,
  };
  const avg =
    scored.length > 0 ? Math.round(scored.reduce((s, a) => s + a.score, 0) / scored.length) : 0;

  const draftCount = assessments.filter((a) => a.status === "DRAFT").length;
  const avgTier = scored.length > 0 ? tierFromScore(avg) : ("PENDING" as Tier | "PENDING");
  const coveragePct =
    assessments.length > 0 ? Math.round((scored.length / assessments.length) * 100) : 0;
  const newThisMonth = assessments.filter(
    (a) => Date.now() - new Date(a.createdAt).getTime() <= 30 * 24 * 60 * 60 * 1000
  ).length;

  const categoryCounts = new Map<string, number>();
  for (const a of scored) {
    for (const f of safeParseFindings(a.findings)) {
      const category = localizeCategory(f.category, tRisk);
      categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
    }
  }
  const totalFindings = Array.from(categoryCounts.values()).reduce((s, n) => s + n, 0);
  const topCategories = Array.from(categoryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const recent = assessments.slice(0, 8);
  const recentScrollable = recent.length > 5;

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-9 sm:px-8 sm:py-10">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand">
            {t("welcome", { name: session.name.split(" ")[0] })}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink">
            {t("title")}
          </h1>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/assessments"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink ring-1 ring-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            {tButtons("viewPortfolio")}
          </Link>
          <Link
            href="/assessments/new"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/30"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            {tButtons("newAssessment")}
          </Link>
        </div>
      </header>

      {/* Hero — primary focal point */}
      <section className="relative mt-8 overflow-hidden rounded-[24px] bg-gradient-to-br from-white via-white to-brand/[0.05] px-6 py-6 shadow-[0_1px_2px_rgba(26,31,54,0.04),0_12px_36px_rgba(43,89,195,0.07)] ring-1 ring-brand/10 sm:px-8 sm:py-7">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, var(--color-brand) 1px, transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-brand/[0.12] blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
            <AnimatedScoreRing score={avg} tier={avgTier} size={172} />
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand/8 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand ring-1 ring-brand/15">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
                </svg>
                {t("intelligence")}
              </div>
              <p className="mt-3 text-sm font-semibold text-muted">{t("portfolioRiskScore")}</p>
              <div className="mt-1 flex flex-wrap items-baseline gap-2.5 sm:gap-3">
                <AnimatedNumber
                  value={avg}
                  className="text-6xl font-extrabold tracking-tight text-ink sm:text-7xl"
                />
                <span className="text-lg font-semibold text-muted">{t("outOf100")}</span>
                <TierPill tier={avgTier} labels={t} />
              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-2.5 sm:max-w-sm lg:max-w-[260px]">
            <HeroMetric label={t("total")} value={assessments.length} />
            <HeroMetric label={t("highRisk")} value={counts.HIGH} emphasis="dark" />
            <HeroMetric label={t("medium")} value={counts.MEDIUM} emphasis="mid" />
            <HeroMetric label={t("lowRisk")} value={counts.LOW} emphasis="light" />
          </div>
        </div>

        <div className="relative mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-brand/10 pt-5">
          <p className="text-sm text-muted">
            {t("scoringCoverage", { coveragePct })}
            {draftCount > 0 ? (
              <>
                {" "}
                · {draftCount === 1 ? t("draftOpen", { draftCount }) : t("draftsOpen", { draftCount })}
              </>
            ) : null}
          </p>
          <Link
            href="/assessments"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-all duration-200 hover:gap-2.5 hover:text-brand-dark"
          >
            {tButtons("viewFullPortfolio")}
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Compact support metrics — no repeated tier counts */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <MiniCard
          label={t("newThisMonth")}
          value={newThisMonth}
          hint={t("last30Days")}
          icon="M3 17l6-6 4 4 8-8M21 7v6h-6"
        />
        <MiniCard
          label={t("draftsInProgress")}
          value={draftCount}
          hint={t("awaitingCompletion")}
          icon="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"
        />
        <div className="group rounded-3xl bg-white p-5 shadow-sm shadow-black/[0.03] ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted">{t("coverage")}</p>
            <span className="text-base font-extrabold tabular-nums text-brand">
              <AnimatedNumber value={coveragePct} />%
            </span>
          </div>
          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-panel">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand to-brand-light transition-all duration-1000 ease-out"
              style={{ width: `${coveragePct}%` }}
            />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            {t("scoredOf", { scored: scored.length, assessments: assessments.length })}
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="mt-6 grid items-start gap-5 lg:grid-cols-12">
        {/* Recent assessments — adaptive height */}
        <div className="flex flex-col rounded-3xl bg-white p-5 shadow-sm shadow-black/[0.03] ring-1 ring-black/5 sm:p-6 lg:col-span-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted">{t("portfolio")}</p>
              <h2 className="mt-1 text-lg font-extrabold tracking-tight text-ink">
                {t("recentAssessments")}
              </h2>
            </div>
            <Link
              href="/assessments"
              className="text-sm font-semibold text-brand transition-colors duration-200 hover:text-brand-dark"
            >
              {tButtons("viewAll")}
            </Link>
          </div>

          <div
            className={`mt-4 divide-y divide-black/5 ${
              recentScrollable
                ? "max-h-[min(22rem,52vh)] overflow-y-auto overscroll-contain pr-1 [-webkit-overflow-scrolling:touch]"
                : ""
            }`}
          >
            {recent.map((a) => {
              const tier = normalizeTier(a.tier);
              return (
                <Link
                  key={a.id}
                  href={hrefFor(a)}
                  className="group flex items-center gap-3.5 py-3 transition-colors duration-200 first:pt-1.5 hover:bg-brand/[0.03] sm:px-1"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/8 text-sm font-bold text-brand transition-transform duration-200 group-hover:scale-105">
                    {a.clientName.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-ink transition-colors duration-200 group-hover:text-brand">
                        {a.clientName}
                      </p>
                      <span className="shrink-0 text-xs text-muted">
                        {new Date(a.createdAt).toLocaleDateString(locale)}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted">
                      {a.status === "DRAFT" ? t("draftPrefix") : ""}
                      {tAssessment.has(`industries.${a.industry}`)
                        ? tAssessment(`industries.${a.industry}`)
                        : a.industry}
                    </p>
                    <div className="mt-2 h-1 max-w-[180px] overflow-hidden rounded-full bg-panel">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${TIER_BLUE[tier].bar}`}
                        style={{
                          width: `${a.status === "DRAFT" || tier === "PENDING" ? 0 : a.score}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2.5">
                    <span className="text-base font-extrabold tabular-nums text-ink">
                      {a.status === "DRAFT" ? "—" : a.score}
                    </span>
                    <TierPill tier={tier} labels={t} />
                  </div>
                </Link>
              );
            })}
            {assessments.length === 0 && <EmptyState title={t("emptyTitle")} cta={t("emptyCta")} />}
          </div>
          {recentScrollable && (
            <p className="mt-3 text-center text-[11px] text-muted">
              {t("showingRecent", { count: recent.length })}
            </p>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5 lg:col-span-5">
          <div className="rounded-3xl bg-white p-5 shadow-sm shadow-black/[0.03] ring-1 ring-black/5 sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted">{t("analytics")}</p>
            <h2 className="mt-1 text-lg font-extrabold tracking-tight text-ink">
              {t("riskDistribution")}
            </h2>
            <div className="mt-5 flex items-center gap-7 sm:gap-8">
              <RiskDonut counts={counts} total={scored.length} scoredLabel={tCommon("scored")} />
              <div className="flex-1 space-y-3.5">
                <DistributionRow tier="LOW" count={counts.LOW} total={scored.length} label={t("distLow")} />
                <DistributionRow tier="MEDIUM" count={counts.MEDIUM} total={scored.length} label={t("distMedium")} />
                <DistributionRow tier="HIGH" count={counts.HIGH} total={scored.length} label={t("distHigh")} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm shadow-black/[0.03] ring-1 ring-black/5 sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted">{t("timeline")}</p>
            <h2 className="mt-1 text-lg font-extrabold tracking-tight text-ink">{t("recentActivity")}</h2>
            <div className="relative mt-4 space-y-3.5 before:absolute before:bottom-1 before:left-[7px] before:top-1 before:w-px before:bg-black/5">
              {assessments.slice(0, 4).map((a) => {
                const tier = normalizeTier(a.tier);
                return (
                  <div key={a.id} className="group relative flex items-start gap-3.5">
                    <span
                      className={`relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-white transition-transform duration-200 group-hover:scale-110 ${TIER_BLUE[tier].bar}`}
                    />
                    <div className="min-w-0 transition-transform duration-200 group-hover:translate-x-0.5">
                      <p className="truncate text-sm text-ink">
                        <span className="font-semibold">{a.clientName}</span>{" "}
                        <span className="text-muted">
                          {a.status === "SCORED" ? t("wasScored") : t("savedAsDraft")}
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted">{timeAgo(a.createdAt, tCommon, locale)}</p>
                    </div>
                  </div>
                );
              })}
              {assessments.length === 0 && (
                <p className="text-sm text-muted">{t("noActivity")}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {topCategories.length > 0 && (
        <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm shadow-black/[0.03] ring-1 ring-black/5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted">
                {t("riskIntelligence")}
              </p>
              <h2 className="mt-0.5 text-base font-extrabold tracking-tight text-ink sm:text-lg">
                {t("findingsByCategory")}
              </h2>
            </div>
            <span className="rounded-full bg-brand/8 px-2.5 py-0.5 text-[11px] font-bold text-brand">
              {t("totalFindings", { total: totalFindings })}
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {topCategories.map(([category, count], i) => (
              <div
                key={category}
                className="rounded-2xl bg-brand/[0.03] px-3.5 py-3 ring-1 ring-brand/5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand/[0.05]"
              >
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate font-semibold text-ink">{category}</span>
                  <span className="shrink-0 font-bold tabular-nums text-muted">{count}</span>
                </div>
                <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-panel">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${RANK_BLUE[i] ?? "bg-brand-light/40"}`}
                    style={{ width: `${totalFindings ? (count / totalFindings) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function normalizeTier(tier: string): Tier | "PENDING" {
  return (["LOW", "MEDIUM", "HIGH"].includes(tier) ? tier : "PENDING") as Tier | "PENDING";
}

function hrefFor(a: { id: string; status: string }) {
  return a.status === "DRAFT" ? `/assessments/${a.id}/edit` : `/assessments/${a.id}`;
}

function safeParseFindings(json: string): Finding[] {
  try {
    return JSON.parse(json) as Finding[];
  } catch {
    return [];
  }
}

function TierPill({
  tier,
  labels,
}: {
  tier: Tier | "PENDING";
  labels: (key: string) => string;
}) {
  const s = TIER_BLUE[tier];
  const label = labels(`tiers.${tier}`);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 transition-colors duration-200 ${s.bg} ${s.text} ${s.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.bar}`} />
      {label}
    </span>
  );
}

function HeroMetric({
  label,
  value,
  emphasis = "mid",
}: {
  label: string;
  value: number;
  emphasis?: "dark" | "mid" | "light";
}) {
  const valueColor =
    emphasis === "dark"
      ? "text-brand-dark"
      : emphasis === "light"
        ? "text-brand-light"
        : "text-brand";
  return (
    <div className="rounded-2xl bg-white/80 px-3.5 py-3 shadow-sm ring-1 ring-brand/10 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <p className={`text-2xl font-extrabold tracking-tight tabular-nums ${valueColor}`}>
        <AnimatedNumber value={value} />
      </p>
      <p className="mt-0.5 text-[11px] font-semibold text-muted">{label}</p>
    </div>
  );
}

function MiniCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: number;
  hint: string;
  icon: string;
}) {
  return (
    <div className="group rounded-3xl bg-white p-5 shadow-sm shadow-black/[0.03] ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/8 text-brand transition-transform duration-200 group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={icon} />
        </svg>
      </div>
      <p className="mt-5 text-3xl font-extrabold tracking-tight text-ink">
        <AnimatedNumber value={value} />
      </p>
      <p className="mt-1 text-sm font-semibold text-ink">{label}</p>
      <p className="mt-0.5 text-xs text-muted">{hint}</p>
    </div>
  );
}

function RiskDonut({
  counts,
  total,
  scoredLabel,
}: {
  counts: { LOW: number; MEDIUM: number; HIGH: number };
  total: number;
  scoredLabel: string;
}) {
  const size = 118;
  const lowPct = total ? (counts.LOW / total) * 100 : 0;
  const medPct = total ? (counts.MEDIUM / total) * 100 : 0;
  const p1 = lowPct;
  const p2 = lowPct + medPct;
  const background =
    total === 0
      ? "var(--color-panel)"
      : `conic-gradient(var(--color-brand-light) 0% ${p1}%, var(--color-brand) ${p1}% ${p2}%, var(--color-brand-dark) ${p2}% 100%)`;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className="h-full w-full rounded-full transition-transform duration-300 hover:scale-[1.03]" style={{ background }} />
      <div className="absolute inset-[15px] flex flex-col items-center justify-center rounded-full bg-white text-center">
        <span className="text-xl font-extrabold tabular-nums text-ink">{total}</span>
        <span className="text-[9px] font-semibold uppercase tracking-wide text-muted">{scoredLabel}</span>
      </div>
    </div>
  );
}

function DistributionRow({
  tier,
  count,
  total,
  label,
}: {
  tier: Tier;
  count: number;
  total: number;
  label: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: TIER_BLUE[tier].css }} />
      <span className="flex-1 text-sm font-medium text-ink">{label}</span>
      <span className="text-sm font-bold tabular-nums text-ink">{count}</span>
      <span className="w-9 text-right text-xs text-muted">{pct}%</span>
    </div>
  );
}

function EmptyState({ title, cta }: { title: string; cta: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/8 text-brand">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        </svg>
      </div>
      <p className="text-sm text-muted">
        {title}{" "}
        <Link href="/assessments/new" className="font-semibold text-brand">
          {cta}
        </Link>
      </p>
    </div>
  );
}

function timeAgo(
  date: Date | string,
  t: (key: string, values?: Record<string, number>) => string,
  locale: string
): string {
  const d = new Date(date).getTime();
  const diffMs = Date.now() - d;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return t("justNow");
  if (minutes < 60) return t("minutesAgo", { minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t("hoursAgo", { hours });
  const days = Math.floor(hours / 24);
  if (days < 30) return t("daysAgo", { days });
  return new Date(date).toLocaleDateString(locale);
}
