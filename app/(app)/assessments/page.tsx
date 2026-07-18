import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssessmentsList } from "@/components/AssessmentsList";

export default async function AssessmentsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

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
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));

  return <AssessmentsList assessments={assessments} />;
}
