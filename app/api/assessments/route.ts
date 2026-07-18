import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { scoreAssessment, type Answers } from "@/lib/mockRiskEngine";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assessments = await prisma.assessment.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ assessments });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const clientName = String(body.clientName ?? "").trim();
    const industry = String(body.industry ?? "Financial services");
    const useCase = String(body.useCase ?? "");
    const answers = (body.answers ?? {}) as Answers;

    if (!clientName) {
      return NextResponse.json({ error: "Client name is required." }, { status: 400 });
    }

    const result = scoreAssessment(answers);

    const assessment = await prisma.assessment.create({
      data: {
        clientName,
        industry,
        useCase,
        status: "SCORED",
        answers: JSON.stringify(answers),
        score: result.score,
        tier: result.tier,
        findings: JSON.stringify(result.findings),
        conditions: JSON.stringify(result.conditions),
        userId: session.userId,
      },
    });

    return NextResponse.json({ id: assessment.id });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
