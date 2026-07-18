import { notFound } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AssessmentForm } from "@/components/AssessmentForm";
import type { Answers } from "@/lib/mockRiskEngine";

export default async function EditAssessmentPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const session = await getSession();
  if (!session) {
    redirect({ href: "/login", locale });
    return null;
  }

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
