import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssessmentForm } from "@/components/AssessmentForm";
import type { Answers } from "@/lib/mockRiskEngine";

export default async function EditAssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const assessment = await prisma.assessment.findFirst({
    where: { id, userId: session.userId },
  });
  if (!assessment) notFound();

  let answers: Answers = {};
  try {
    answers = JSON.parse(assessment.answers) as Answers;
  } catch {
    answers = {};
  }

  return (
    <AssessmentForm
      initial={{
        id: assessment.id,
        clientName: assessment.clientName,
        industry: assessment.industry,
        useCase: assessment.useCase,
        answers,
        status: assessment.status,
      }}
    />
  );
}
