import { redirect } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssessmentsList } from "@/components/AssessmentsList";

export default async function AssessmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getSession();
  if (!session) {
    redirect({ href: "/login", locale });
    return null;
  }

  const rows = await prisma.assessment.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: "desc" },
  });

  const assessments = rows.map((a) => ({
    id: a.id,
    clientName: a.clientName,
    industry: a.industry,
    useCase: a.useCase,
    status: a.status,
    score: a.score,
    tier: a.tier,
    decision: a.decision ?? "",
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));

  return <AssessmentsList assessments={assessments} />;
}
