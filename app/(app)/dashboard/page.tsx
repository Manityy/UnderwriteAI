import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RiskBadge } from "@/components/RiskBadge";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

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

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted">Welcome back, {session.name.split(" ")[0]}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink">Underwriting dashboard</h1>
        </div>
        <Link
          href="/assessments/new"
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
        >
          + New assessment
        </Link>
      </header>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total assessments" value={assessments.length} />
        <StatCard label="Average risk score" value={avg} tint="brand" />
        <StatCard label="High risk clients" value={counts.HIGH} tint="high" />
        <StatCard label="Low risk clients" value={counts.LOW} tint="low" />
      </div>

      {/* Risk breakdown bar */}
      <div className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-black/5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Portfolio risk mix</h2>
        <div className="mt-4 flex h-4 overflow-hidden rounded-full bg-panel">
          <Bar count={counts.LOW} total={scored.length} className="bg-risk-low" />
          <Bar count={counts.MEDIUM} total={scored.length} className="bg-risk-medium" />
          <Bar count={counts.HIGH} total={scored.length} className="bg-risk-high" />
        </div>
        <div className="mt-4 flex flex-wrap gap-6 text-sm">
          <Legend className="bg-risk-low" label="Low" count={counts.LOW} />
          <Legend className="bg-risk-medium" label="Medium" count={counts.MEDIUM} />
          <Legend className="bg-risk-high" label="High" count={counts.HIGH} />
        </div>
      </div>

      {/* Recent */}
      <div className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-black/5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Recent assessments</h2>
          <Link href="/assessments" className="text-sm font-semibold text-brand hover:text-brand-dark">
            View all &rarr;
          </Link>
        </div>
        <div className="mt-4 divide-y divide-black/5">
          {assessments.slice(0, 5).map((a) => (
            <Link
              key={a.id}
              href={a.status === "DRAFT" ? `/assessments/${a.id}/edit` : `/assessments/${a.id}`}
              className="flex items-center justify-between gap-4 py-4 transition hover:opacity-70"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{a.clientName}</p>
                <p className="truncate text-sm text-muted">
                  {a.status === "DRAFT" ? "Draft · " : ""}
                  {a.industry}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-extrabold text-ink">
                  {a.status === "DRAFT" ? "—" : a.score}
                </span>
                <RiskBadge tier={a.tier} />
              </div>
            </Link>
          ))}
          {assessments.length === 0 && (
            <p className="py-8 text-center text-sm text-muted">
              No assessments yet.{" "}
              <Link href="/assessments/new" className="font-semibold text-brand">
                Create your first one.
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tint = "default",
}: {
  label: string;
  value: number;
  tint?: "default" | "brand" | "high" | "low";
}) {
  const color =
    tint === "brand"
      ? "text-brand"
      : tint === "high"
      ? "text-risk-high"
      : tint === "low"
      ? "text-risk-low"
      : "text-ink";
  return (
    <div className="rounded-3xl bg-white p-6 ring-1 ring-black/5">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className={`mt-2 text-4xl font-extrabold tracking-tight ${color}`}>{value}</p>
    </div>
  );
}

function Bar({ count, total, className }: { count: number; total: number; className: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  if (pct === 0) return null;
  return <div className={className} style={{ width: `${pct}%` }} />;
}

function Legend({ className, label, count }: { className: string; label: string; count: number }) {
  return (
    <span className="inline-flex items-center gap-2 text-muted">
      <span className={`h-3 w-3 rounded-full ${className}`} />
      <span className="font-semibold text-ink">{count}</span> {label}
    </span>
  );
}
