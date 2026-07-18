import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateAttackPrompts } from "@/lib/agents/attackAgent";
import type { AttackPrompt } from "@/lib/agents/types";

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

  const prompts = safeParse<AttackPrompt[]>(assessment.attackPrompts, []);
  return NextResponse.json({
    prompts,
    generatedAt: assessment.attackGeneratedAt,
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

  let perCategory: number | undefined;
  try {
    const body = await req.json();
    if (body && typeof body.perCategory === "number") perCategory = body.perCategory;
  } catch {
    // no body is fine
  }

  const answers = safeParse<Record<string, string>>(assessment.answers, {});

  try {
    const result = await generateAttackPrompts({
      clientName: assessment.clientName,
      industry: assessment.industry,
      useCase: assessment.useCase,
      answers,
      perCategory,
    });

    await prisma.assessment.update({
      where: { id: assessment.id },
      data: {
        attackPrompts: JSON.stringify(result.prompts),
        attackGeneratedAt: new Date(),
      },
    });

    return NextResponse.json({
      prompts: result.prompts,
      countsByCategory: result.countsByCategory,
      usedLlm: result.usedLlm,
      total: result.prompts.length,
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate attack prompts." }, { status: 500 });
  }
}
