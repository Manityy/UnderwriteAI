export type Tier = "LOW" | "MEDIUM" | "HIGH";

export type QuestionOption = {
  value: string;
  label: string;
  risk: number; // 0 (safe) .. 100 (risky)
};

export type Question = {
  id: string;
  step: number;
  section: string;
  title: string;
  help: string;
  weight: number;
  options: QuestionOption[];
};

export type Answers = Record<string, string>;

export type Finding = {
  category: "Security" | "Privacy" | "Accuracy" | "Governance" | "Compliance";
  severity: Tier;
  title: string;
  detail: string;
};

export type RiskResult = {
  score: number; // 0..100 (higher = riskier)
  tier: Tier;
  findings: Finding[];
  conditions: string[];
};

// The underwriting questionnaire. Kept short and plain-language on purpose.
export const QUESTIONS: Question[] = [
  {
    id: "useCase",
    step: 1,
    section: "The AI system",
    title: "What does the AI system mainly do?",
    help: "Higher-stakes decisions carry more potential liability.",
    weight: 1.3,
    options: [
      { value: "internal", label: "Internal productivity tool", risk: 10 },
      { value: "support", label: "Customer support / chatbot", risk: 45 },
      { value: "advice", label: "Financial or legal advice", risk: 85 },
      { value: "decisions", label: "Automated decisions (credit, claims, hiring)", risk: 95 },
    ],
  },
  {
    id: "dataSensitivity",
    step: 1,
    section: "The AI system",
    title: "What kind of data does it touch?",
    help: "Sensitive data raises the cost of a leak or misuse.",
    weight: 1.2,
    options: [
      { value: "public", label: "Only public / non-personal data", risk: 10 },
      { value: "internal", label: "Internal business data", risk: 35 },
      { value: "pii", label: "Customer personal data (PII)", risk: 75 },
      { value: "sensitive", label: "Financial / health / biometric data", risk: 95 },
    ],
  },
  {
    id: "humanOversight",
    step: 2,
    section: "Controls",
    title: "Is a human reviewing the AI's output?",
    help: "Human review is the single strongest control against AI mistakes.",
    weight: 1.4,
    options: [
      { value: "in_loop", label: "Yes — a human approves every important action", risk: 10 },
      { value: "on_loop", label: "Partly — humans spot-check some outputs", risk: 45 },
      { value: "autonomy", label: "No — the AI acts fully on its own", risk: 95 },
    ],
  },
  {
    id: "logging",
    step: 2,
    section: "Controls",
    title: "Are AI inputs and outputs logged?",
    help: "Logs make claims defensible and incidents traceable.",
    weight: 1.0,
    options: [
      { value: "full", label: "Yes — full logging and retention", risk: 10 },
      { value: "partial", label: "Partial logging", risk: 50 },
      { value: "none", label: "No logging", risk: 90 },
    ],
  },
  {
    id: "vendor",
    step: 3,
    section: "Setup & testing",
    title: "Where does the model come from?",
    help: "Major providers ship more safety tooling out of the box.",
    weight: 0.8,
    options: [
      { value: "major", label: "Major provider (OpenAI, Anthropic, Google)", risk: 20 },
      { value: "oss", label: "Open-source, self-hosted", risk: 50 },
      { value: "custom", label: "Custom in-house model", risk: 65 },
    ],
  },
  {
    id: "testing",
    step: 3,
    section: "Setup & testing",
    title: "How is the AI tested for safety?",
    help: "Red-teaming catches injection, leaks and unsafe answers before customers do.",
    weight: 1.2,
    options: [
      { value: "continuous", label: "Continuous red-teaming", risk: 10 },
      { value: "occasional", label: "Occasional manual checks", risk: 55 },
      { value: "none", label: "No structured testing", risk: 90 },
    ],
  },
  {
    id: "compliance",
    step: 3,
    section: "Setup & testing",
    title: "Is the AI use documented for compliance?",
    help: "Think DPIA, EU AI Act classification, internal AI policy.",
    weight: 1.1,
    options: [
      { value: "documented", label: "Yes — documented and reviewed", risk: 15 },
      { value: "progress", label: "In progress", risk: 55 },
      { value: "none", label: "Not documented", risk: 90 },
    ],
  },
];

export function tierFromScore(score: number): Tier {
  if (score >= 66) return "HIGH";
  if (score >= 36) return "MEDIUM";
  return "LOW";
}

function optionFor(questionId: string, value: string): QuestionOption | undefined {
  return QUESTIONS.find((q) => q.id === questionId)?.options.find((o) => o.value === value);
}

// Deterministic mock engine. No LLMs — purely rules over the answers.
export function scoreAssessment(answers: Answers): RiskResult {
  let weightedSum = 0;
  let weightTotal = 0;

  for (const q of QUESTIONS) {
    const opt = optionFor(q.id, answers[q.id]);
    const risk = opt ? opt.risk : 60; // unanswered treated as elevated
    weightedSum += risk * q.weight;
    weightTotal += q.weight;
  }

  const score = Math.round(weightTotal ? weightedSum / weightTotal : 0);
  const tier = tierFromScore(score);
  const findings = buildFindings(answers, tier);
  const conditions = buildConditions(answers, tier);

  return { score, tier, findings, conditions };
}

function buildFindings(answers: Answers, tier: Tier): Finding[] {
  const findings: Finding[] = [];

  if (answers.humanOversight === "autonomy") {
    findings.push({
      category: "Governance",
      severity: "HIGH",
      title: "No human in the loop",
      detail:
        "The AI can take consequential actions with no human approval. A single bad output can reach a customer directly.",
    });
  } else if (answers.humanOversight === "on_loop") {
    findings.push({
      category: "Governance",
      severity: "MEDIUM",
      title: "Partial human oversight",
      detail: "Only some outputs are checked. High-impact actions should require explicit human sign-off.",
    });
  }

  if (answers.dataSensitivity === "pii" || answers.dataSensitivity === "sensitive") {
    findings.push({
      category: "Privacy",
      severity: answers.dataSensitivity === "sensitive" ? "HIGH" : "MEDIUM",
      title: "Sensitive data exposure risk",
      detail:
        "Simulated probes leaked sample personal data in 2 of 50 test prompts. Output filtering appears incomplete.",
    });
  }

  if (answers.testing === "none" || answers.testing === "occasional") {
    findings.push({
      category: "Security",
      severity: answers.testing === "none" ? "HIGH" : "MEDIUM",
      title: "Prompt injection not mitigated",
      detail:
        "A crafted instruction bypassed the system guardrails and revealed hidden context. No continuous red-teaming is in place.",
    });
  }

  if (answers.useCase === "advice" || answers.useCase === "decisions") {
    findings.push({
      category: "Accuracy",
      severity: tier === "HIGH" ? "HIGH" : "MEDIUM",
      title: "Confident but wrong answers",
      detail:
        "On regulated topics the model gave confident, incorrect guidance in 4 of 20 test cases — a hallucination liability.",
    });
  }

  if (answers.logging === "none") {
    findings.push({
      category: "Governance",
      severity: "MEDIUM",
      title: "No audit trail",
      detail: "Without input/output logs, incidents cannot be reconstructed and claims are hard to defend.",
    });
  }

  if (answers.compliance === "none") {
    findings.push({
      category: "Compliance",
      severity: "MEDIUM",
      title: "Undocumented AI use",
      detail: "No DPIA or AI Act classification found. Regulatory exposure is unquantified.",
    });
  }

  if (findings.length === 0) {
    findings.push({
      category: "Governance",
      severity: "LOW",
      title: "Strong controls observed",
      detail:
        "Human oversight, logging and testing are all in place. Residual risk is limited to normal model uncertainty.",
    });
  }

  return findings;
}

function buildConditions(answers: Answers, tier: Tier): string[] {
  const conditions: string[] = [];

  if (answers.humanOversight !== "in_loop") {
    conditions.push("Require human approval for all high-impact AI actions.");
  }
  if (answers.testing !== "continuous") {
    conditions.push("Introduce quarterly red-team testing and re-assessment at renewal.");
  }
  if (answers.logging !== "full") {
    conditions.push("Enable full input/output logging with 12-month retention.");
  }
  if (answers.dataSensitivity === "pii" || answers.dataSensitivity === "sensitive") {
    conditions.push("Add PII output filtering and data-minimisation controls.");
  }
  if (answers.compliance !== "documented") {
    conditions.push("Complete a DPIA and EU AI Act classification before binding cover.");
  }

  if (conditions.length === 0) {
    conditions.push("Maintain current controls and re-assess at annual renewal.");
  }

  if (tier === "HIGH") {
    conditions.unshift("Remediate high-severity findings before coverage is bound.");
  }

  return conditions;
}
