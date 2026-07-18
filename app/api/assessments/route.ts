import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { QUESTIONS, scoreAssessment, type Answers } from "@/lib/mockRiskEngine";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assessments = await prisma.assessment.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: "desc" },
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
    const mode = body.mode === "draft" ? "draft" : "score";

    if (!clientName) {
      return NextResponse.json({ error: "Client name is required." }, { status: 400 });
    }

    if (mode === "draft") {
      const assessment = await prisma.assessment.create({
        data: {
          clientName,
          industry,
          useCase,
          status: "DRAFT",
          answers: JSON.stringify(answers),
          score: 0,
          tier: "PENDING",
          findings: "[]",
          conditions: "[]",
          userId: session.userId,
        },
      });
      return NextResponse.json({ id: assessment.id, status: "DRAFT" });
    }

    const missing = QUESTIONS.filter((q) => !answers[q.id]);
    if (missing.length > 0) {
      return NextResponse.json(
        { error: "Answer all questions before scoring." },
        { status: 400 }
      );
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

    return NextResponse.json({ id: assessment.id, status: "SCORED" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
