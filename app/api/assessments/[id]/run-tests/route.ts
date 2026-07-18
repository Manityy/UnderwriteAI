import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { runTests } from "@/lib/agents/testRunner";
import type { AttackPrompt, TestResult, TestRunSummary } from "@/lib/agents/types";

export const maxDuration = 60;

function safeParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

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

  return NextResponse.json({
    results: safeParse<TestResult[]>(assessment.testResults, []),
    summary: safeParse<TestRunSummary | Record<string, never>>(assessment.testSummary, {}),
    ranAt: assessment.testRanAt,
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const assessment = await prisma.assessment.findFirst({
    where: { id, userId: session.userId },
  });
  if (!assessment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const prompts = safeParse<AttackPrompt[]>(assessment.attackPrompts, []);
  if (prompts.length === 0) {
    return NextResponse.json(
      { error: "No attack prompts yet. Generate Agent 1 prompts first." },
      { status: 400 }
    );
  }

  let limit: number | undefined;
  try {
    const body = await req.json();
    if (body && typeof body.limit === "number") limit = body.limit;
  } catch {
    // no body is fine
  }

  try {
    const { results, summary } = await runTests({
      context: {
        clientName: assessment.clientName,
        industry: assessment.industry,
        useCase: assessment.useCase,
      },
      prompts,
      limit,
    });

    await prisma.assessment.update({
      where: { id: assessment.id },
      data: {
        testResults: JSON.stringify(results),
        testSummary: JSON.stringify(summary),
        testRanAt: new Date(),
      },
    });

    return NextResponse.json({ results, summary });
  } catch (err) {
    console.error("[run-tests]", err);
    return NextResponse.json({ error: "Failed to run tests." }, { status: 500 });
  }
}
