import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { scoreAssessment, type Answers } from "../lib/mockRiskEngine";

const prisma = new PrismaClient();

type Sample = {
  clientName: string;
  industry: string;
  useCase: string;
  answers: Answers;
};

const samples: Sample[] = [
  {
    clientName: "UnderwriteAI",
    industry: "Banking",
    useCase: "Customer-facing AI chatbot giving financial product guidance",
    answers: {
      useCase: "advice",
      dataSensitivity: "sensitive",
      humanOversight: "autonomy",
      logging: "none",
      vendor: "custom",
      testing: "none",
      compliance: "none",
    },
  },
  {
    clientName: "Helios Retail",
    industry: "Retail",
    useCase: "Support chatbot for order tracking and returns",
    answers: {
      useCase: "support",
      dataSensitivity: "pii",
      humanOversight: "on_loop",
      logging: "partial",
      vendor: "major",
      testing: "occasional",
      compliance: "progress",
    },
  },
  {
    clientName: "Corewise Insurance",
    industry: "Insurance",
    useCase: "Internal copilot summarising policy documents for staff",
    answers: {
      useCase: "internal",
      dataSensitivity: "internal",
      humanOversight: "in_loop",
      logging: "full",
      vendor: "major",
      testing: "continuous",
      compliance: "documented",
    },
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("demo123", 10);

  const user = await prisma.user.upsert({
    where: { email: "insurer@demo.com" },
    update: {},
    create: {
      email: "insurer@demo.com",
      name: "Alex Underwriter",
      passwordHash,
      role: "INSURER",
    },
  });

  await prisma.assessment.deleteMany({ where: { userId: user.id } });

  for (const s of samples) {
    const result = scoreAssessment(s.answers);
    await prisma.assessment.create({
      data: {
        clientName: s.clientName,
        industry: s.industry,
        useCase: s.useCase,
        status: "SCORED",
        answers: JSON.stringify(s.answers),
        score: result.score,
        tier: result.tier,
        findings: JSON.stringify(result.findings),
        conditions: JSON.stringify(result.conditions),
        userId: user.id,
      },
    });
  }

  console.log("Seeded demo user (insurer@demo.com / demo123) and", samples.length, "assessments.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
