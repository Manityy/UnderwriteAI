import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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
