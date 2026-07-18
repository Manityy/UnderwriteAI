import { AssessmentForm } from "@/components/AssessmentForm";
import { setRequestLocale } from "next-intl/server";

export default async function NewAssessmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AssessmentForm />;
}
