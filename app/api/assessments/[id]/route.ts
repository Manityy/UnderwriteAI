import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sanitizeConditionIds } from "@/lib/conditionsLibrary";
import { QUESTIONS, scoreAssessment, type Answers } from "@/lib/mockRiskEngine";
import { isUnderwritingDecision } from "@/lib/underwritingDecision";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const assessment = await prisma.assessment.findFirst({
    where: { id, userId: session.userId },
  });
  if (!assessment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ assessment });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.assessment.findFirst({
    where: { id, userId: session.userId },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await req.json();

    // Underwriting decision — decision-support record only
    if (body.mode === "decision") {
      if (existing.status !== "SCORED") {
        return NextResponse.json(
          { error: "Score the assessment before recording a decision." },
          { status: 400 }
        );
      }

      const raw = body.decision;
      const clearing = raw === "" || raw === null || raw === undefined;

      if (!clearing && !isUnderwritingDecision(raw)) {
        return NextResponse.json({ error: "Invalid underwriting decision." }, { status: 400 });
      }

      const decisionNote = String(body.decisionNote ?? "").trim().slice(0, 1000);
      const now = new Date();

      const assessment = await prisma.assessment.update({
        where: { id },
        data: clearing
          ? { decision: "", decisionNote: "", decisionAt: null }
          : {
              decision: raw,
              decisionNote,
              decisionAt: now,
            },
      });

      return NextResponse.json({
        id: assessment.id,
        decision: assessment.decision,
        decisionNote: assessment.decisionNote,
        decisionAt: assessment.decisionAt?.toISOString() ?? null,
      });
    }

    const clientName = String(body.clientName ?? existing.clientName).trim();
    const industry = String(body.industry ?? existing.industry);
    const useCase = String(body.useCase ?? existing.useCase);
    const answers = (body.answers ?? {}) as Answers;
    const mode = body.mode === "draft" ? "draft" : "score";

    if (!clientName) {
      return NextResponse.json({ error: "Client name is required." }, { status: 400 });
    }

    if (mode === "draft") {
      const assessment = await prisma.assessment.update({
        where: { id },
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
          scoreDrivers: "[]",
          decision: "",
          decisionNote: "",
          decisionAt: null,
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
    const assessment = await prisma.assessment.update({
      where: { id },
      data: {
        clientName,
        industry,
        useCase,
        status: "SCORED",
        answers: JSON.stringify(answers),
        score: result.score,
        tier: result.tier,
        premiumFactor: result.premiumFactor,
        findings: JSON.stringify(result.findings),
        conditions: JSON.stringify(result.conditions),
        scoreDrivers: JSON.stringify(result.scoreDrivers),
        // Keep existing UW decision on re-score — underwriter judgement is separate
      },
    });

    return NextResponse.json({ id: assessment.id, status: "SCORED" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
