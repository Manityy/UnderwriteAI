import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RiskBadge } from "@/components/RiskBadge";

export default async function AssessmentsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const assessments = await prisma.assessment.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

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

      <div className="mt-8 overflow-hidden rounded-3xl bg-white ring-1 ring-black/5">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/5 text-xs font-bold uppercase tracking-wider text-muted">
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Industry</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4">Risk</th>
              <th className="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {assessments.map((a) => (
              <tr key={a.id} className="group transition hover:bg-cream/50">
                <td className="px-6 py-4">
                  <Link href={`/assessments/${a.id}`} className="font-semibold text-ink group-hover:text-brand">
                    {a.clientName}
                  </Link>
                  <p className="max-w-xs truncate text-xs text-muted">{a.useCase}</p>
                </td>
                <td className="px-6 py-4 text-sm text-muted">{a.industry}</td>
                <td className="px-6 py-4 text-lg font-extrabold text-ink">{a.score}</td>
                <td className="px-6 py-4">
                  <RiskBadge tier={a.tier} />
                </td>
                <td className="px-6 py-4 text-right text-sm text-muted">
                  {new Date(a.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {assessments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted">
                  No assessments yet.{" "}
                  <Link href="/assessments/new" className="font-semibold text-brand">
                    Create your first one.
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
