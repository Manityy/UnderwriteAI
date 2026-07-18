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
      systemStatus: "production",
      useCase: "decisions",
      actionableAdvice: "yes",
      autonomousActions: "yes",
      financialImpact: "100k1m",
      nonFinancialImpact: "regulatory",
      modelSource: "custom",
      vendorContract: "no",
      dataSensitivity: "financial",
      dataHandling: "shared",
      piiFiltering: "no",
      humanOversight: "never",
      guardrails: "none",
      logging: "none",
      incidentResponse: "no",
      sandboxAccess: "no",
      frameworks: "none",
      aiPolicy: "no",
      qualityMeasurement: "no",
      retestOnChange: "no",
      priorIncidents: "minor",
      existingCover: "yes_excluded",
      redTeamed: "no",
      userDisclosure: "sometimes",
      attestation: "yes",
    },
  },
  {
    clientName: "Helios Retail",
    industry: "Retail",
    useCase: "Support chatbot for order tracking and returns",
    answers: {
      systemStatus: "production",
      useCase: "support",
      actionableAdvice: "partial",
      autonomousActions: "no",
      financialImpact: "10k100k",
      nonFinancialImpact: "breach",
      modelSource: "major",
      vendorContract: "partial",
      dataSensitivity: "pii",
      dataHandling: "stored",
      piiFiltering: "partial",
      humanOversight: "sometimes",
      guardrails: "partial",
      logging: "partial",
      incidentResponse: "yes",
      sandboxAccess: "yes",
      frameworks: "internal",
      aiPolicy: "yes",
      qualityMeasurement: "partial",
      retestOnChange: "sometimes",
      priorIncidents: "no",
      existingCover: "yes_ai",
      redTeamed: "older",
      userDisclosure: "always",
      attestation: "yes",
    },
  },
  {
    clientName: "Corewise Insurance",
    industry: "Insurance",
    useCase: "Internal copilot summarising policy documents for staff",
    answers: {
      systemStatus: "pilot",
      useCase: "copilot",
      actionableAdvice: "no",
      autonomousActions: "no",
      financialImpact: "lt10k",
      nonFinancialImpact: "none",
      modelSource: "major",
      vendorContract: "yes",
      dataSensitivity: "internal",
      dataHandling: "minimal",
      piiFiltering: "yes",
      humanOversight: "always",
      guardrails: "full",
      logging: "full",
      incidentResponse: "yes",
      sandboxAccess: "yes",
      frameworks: "multiple",
      aiPolicy: "yes",
      qualityMeasurement: "yes",
      retestOnChange: "yes",
      priorIncidents: "no",
      existingCover: "yes_ai",
      redTeamed: "yes",
      userDisclosure: "always",
      attestation: "yes",
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
