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

/** Plain-language reason the risk score landed where it did. */
export type ScoreDriver = {
  theme: "exposure" | "controls" | "data" | "oversight" | "governance";
  title: string;
  detail: string;
  /** Relative contribution used for ranking (not shown to users). */
  weight: number;
};

export type RiskResult = {
  score: number; // 0..100 (higher = riskier)
  tier: Tier;
  /** Indicative premium multiplier, e.g. 1.45 — not actuarial */
  premiumFactor: number;
  findings: Finding[];
  conditions: string[];
  /** Top drivers explaining the score (questionnaire-based). */
  scoreDrivers: ScoreDriver[];
};

/**
 * Indicative premium factor for underwriting support only.
 * Simple linear formula (transparent for jury demos):
 *   1.00x at score 0  →  2.50x at score 100
 *   factor = 1 + (score / 100) * 1.5
 */
export function premiumFactorFromScore(score: number): number {
  const clamped = Math.max(0, Math.min(100, score));
  return Math.round((1 + (clamped / 100) * 1.5) * 100) / 100;
}

export function formatPremiumFactor(factor: number): string {
  return `${factor.toFixed(2)}x`;
}

// The underwriting questionnaire. Kept short and plain-language on purpose.
export const QUESTIONS: Question[] = [
  // ——— Step 1: System & exposure ———
  {
    id: "systemStatus",
    step: 1,
    section: "System & exposure",
    title: "What is the status of this AI system?",
    help: "Live systems create immediate underwriting exposure.",
    weight: 0.9,
    options: [
      { value: "planned", label: "Planned — not built yet", risk: 15 },
      { value: "pilot", label: "Pilot / limited rollout", risk: 35 },
      { value: "staging", label: "Staging — ready for production", risk: 45 },
      { value: "production", label: "In production", risk: 70 },
    ],
  },
  {
    id: "useCase",
    step: 1,
    section: "System & exposure",
    title: "What is the primary use case?",
    help: "Higher-stakes decisions carry more potential liability.",
    weight: 1.4,
    options: [
      { value: "support", label: "Customer support / chatbot", risk: 40 },
      { value: "content", label: "Content generation", risk: 30 },
      { value: "copilot", label: "Employee copilot", risk: 35 },
      { value: "decisions", label: "Decision support (credit, HR, claims, etc.)", risk: 85 },
      { value: "agent", label: "Autonomous agent / workflow automation", risk: 95 },
      { value: "other", label: "Other", risk: 50 },
    ],
  },
  {
    id: "actionableAdvice",
    step: 1,
    section: "System & exposure",
    title: "Can the AI give advice that users may act on?",
    help: "Actionable guidance creates advice and errors & omissions exposure.",
    weight: 1.3,
    options: [
      { value: "no", label: "No", risk: 15 },
      { value: "partial", label: "Partially — soft suggestions only", risk: 50 },
      { value: "yes", label: "Yes — users may rely on it", risk: 90 },
    ],
  },
  {
    id: "autonomousActions",
    step: 1,
    section: "System & exposure",
    title: "Can it trigger actions without a human?",
    help: "Payments, approvals, account changes, or access blocking raise severity.",
    weight: 1.5,
    options: [
      { value: "no", label: "No — humans always execute", risk: 10 },
      { value: "yes", label: "Yes — it can act on its own", risk: 95 },
    ],
  },
  {
    id: "financialImpact",
    step: 1,
    section: "System & exposure",
    title: "Worst-case financial impact if it fails?",
    help: "Sets the order of magnitude for potential claims.",
    weight: 1.2,
    options: [
      { value: "lt10k", label: "Under $10k", risk: 15 },
      { value: "10k100k", label: "$10k – $100k", risk: 40 },
      { value: "100k1m", label: "$100k – $1M", risk: 70 },
      { value: "gt1m", label: "Over $1M", risk: 95 },
      { value: "unknown", label: "Unknown", risk: 75 },
    ],
  },

  // ——— Step 2: Exposure & data ———
  {
    id: "nonFinancialImpact",
    step: 2,
    section: "Exposure & data",
    title: "What is the main non-financial risk if it fails?",
    help: "Regulatory, privacy, and safety failures drive liability and reputation loss.",
    weight: 1.1,
    options: [
      { value: "none", label: "Limited / operational only", risk: 15 },
      { value: "reputation", label: "Reputational harm", risk: 45 },
      { value: "discrimination", label: "Discrimination or unfair outcomes", risk: 75 },
      { value: "breach", label: "Data breach / privacy incident", risk: 85 },
      { value: "regulatory", label: "Regulatory fine or enforcement", risk: 90 },
      { value: "safety", label: "Safety incident", risk: 95 },
    ],
  },
  {
    id: "modelSource",
    step: 2,
    section: "Exposure & data",
    title: "Where does the model come from?",
    help: "Provider and hosting affect control surface and vendor risk.",
    weight: 0.8,
    options: [
      { value: "major", label: "Major provider API (OpenAI, Anthropic, Google, Azure)", risk: 25 },
      { value: "oss", label: "Open-source, self-hosted", risk: 50 },
      { value: "custom", label: "Custom / in-house model", risk: 65 },
      { value: "hybrid", label: "Hybrid (multiple providers)", risk: 55 },
    ],
  },
  {
    id: "vendorContract",
    step: 2,
    section: "Exposure & data",
    title: "Is there a vendor contract covering AI liability and data use?",
    help: "Contractual allocation of risk matters at claim time.",
    weight: 0.9,
    options: [
      { value: "yes", label: "Yes — liability, data use, and incident notice covered", risk: 15 },
      { value: "partial", label: "Partial — standard SaaS terms only", risk: 50 },
      { value: "no", label: "No formal AI terms", risk: 85 },
      { value: "na", label: "N/A — fully in-house", risk: 40 },
    ],
  },
  {
    id: "dataSensitivity",
    step: 2,
    section: "Exposure & data",
    title: "What is the most sensitive data it processes?",
    help: "Sensitive data raises the cost of a leak or misuse.",
    weight: 1.3,
    options: [
      { value: "public", label: "Public / non-personal only", risk: 10 },
      { value: "internal", label: "Internal business data", risk: 35 },
      { value: "pii", label: "Customer or employee personal data (PII)", risk: 70 },
      { value: "financial", label: "Financial account or transaction data", risk: 85 },
      { value: "sensitive", label: "Health, biometric, or children's data", risk: 95 },
    ],
  },
  {
    id: "dataHandling",
    step: 2,
    section: "Exposure & data",
    title: "How are prompts and outputs handled?",
    help: "Storage, training use, and third-party sharing affect privacy exposure.",
    weight: 1.1,
    options: [
      { value: "minimal", label: "Not stored; not used for training; not shared", risk: 15 },
      { value: "stored", label: "Stored for operations; not used for training", risk: 40 },
      { value: "shared", label: "Shared with third-party model providers", risk: 70 },
      { value: "training", label: "Used for training or fine-tuning", risk: 85 },
      { value: "unknown", label: "Unknown / not documented", risk: 80 },
    ],
  },

  // ——— Step 3: Controls ———
  {
    id: "piiFiltering",
    step: 3,
    section: "Controls",
    title: "Is PII filtered on input and scanned on output?",
    help: "Reduces leakage of personal data through the model.",
    weight: 1.2,
    options: [
      { value: "yes", label: "Yes — both input filtering and output scanning", risk: 15 },
      { value: "partial", label: "Partial — one side only", risk: 55 },
      { value: "no", label: "No", risk: 90 },
    ],
  },
  {
    id: "humanOversight",
    step: 3,
    section: "Controls",
    title: "Is a human reviewing high-impact AI output?",
    help: "Human review is the strongest control against AI mistakes.",
    weight: 1.5,
    options: [
      { value: "always", label: "Always — before high-impact actions or regulated advice", risk: 10 },
      { value: "sometimes", label: "Sometimes — spot-checks only", risk: 50 },
      { value: "never", label: "Never — the AI acts without human review", risk: 95 },
    ],
  },
  {
    id: "guardrails",
    step: 3,
    section: "Controls",
    title: "Which technical protections are in place?",
    help: "Injection defenses, content filters, and access controls reduce technical risk.",
    weight: 1.2,
    options: [
      { value: "full", label: "Injection defenses, content filters, and auth/rate limits", risk: 15 },
      { value: "partial", label: "Some of these controls", risk: 50 },
      { value: "none", label: "None of these", risk: 90 },
    ],
  },
  {
    id: "logging",
    step: 3,
    section: "Controls",
    title: "Are prompts, outputs, and tool calls logged?",
    help: "Logs make claims defensible and incidents traceable.",
    weight: 1.1,
    options: [
      { value: "full", label: "Yes — enough to reconstruct a claim, with retention", risk: 10 },
      { value: "partial", label: "Partial logging", risk: 50 },
      { value: "none", label: "No logging", risk: 90 },
    ],
  },
  {
    id: "incidentResponse",
    step: 3,
    section: "Controls",
    title: "Is there a documented incident response for AI failures?",
    help: "Insurers need a clear path when something goes wrong.",
    weight: 1.0,
    options: [
      { value: "yes", label: "Yes — process and notification SLA defined", risk: 15 },
      { value: "no", label: "No", risk: 80 },
    ],
  },

  // ——— Step 4: Testing & compliance ———
  {
    id: "sandboxAccess",
    step: 4,
    section: "Testing & compliance",
    title: "Is a sandbox / staging API available for insurer testing?",
    help: "Required for automated red-teaming without source code access.",
    weight: 1.0,
    options: [
      { value: "yes", label: "Yes — authorized testing allowed", risk: 15 },
      { value: "no", label: "No", risk: 70 },
    ],
  },
  {
    id: "frameworks",
    step: 4,
    section: "Testing & compliance",
    title: "Which governance frameworks do you map to?",
    help: "Shows alignment with emerging AI and data protection expectations.",
    weight: 1.0,
    options: [
      { value: "multiple", label: "EU AI Act / GDPR / sector rules (or equivalent) documented", risk: 15 },
      { value: "internal", label: "Internal AI policy only", risk: 45 },
      { value: "none", label: "None", risk: 85 },
    ],
  },
  {
    id: "aiPolicy",
    step: 4,
    section: "Testing & compliance",
    title: "Is there a written AI governance policy approved by management?",
    help: "Board-level accountability strengthens underwriting confidence.",
    weight: 0.9,
    options: [
      { value: "yes", label: "Yes", risk: 15 },
      { value: "no", label: "No", risk: 75 },
    ],
  },
  {
    id: "qualityMeasurement",
    step: 4,
    section: "Testing & compliance",
    title: "Do you measure output quality and track known failure modes?",
    help: "Accuracy monitoring reduces hallucination and advice liability.",
    weight: 1.1,
    options: [
      { value: "yes", label: "Yes — metrics and known failure modes documented", risk: 20 },
      { value: "partial", label: "Informal / ad hoc checks", risk: 55 },
      { value: "no", label: "No structured measurement", risk: 85 },
    ],
  },
  {
    id: "retestOnChange",
    step: 4,
    section: "Testing & compliance",
    title: "Do you re-test after model, prompt, or tool changes?",
    help: "Change control prevents silent risk increases between renewals.",
    weight: 1.1,
    options: [
      { value: "yes", label: "Yes — always after material changes", risk: 15 },
      { value: "sometimes", label: "Sometimes", risk: 50 },
      { value: "no", label: "No", risk: 85 },
    ],
  },

  // ——— Step 5: History & attestation ———
  {
    id: "priorIncidents",
    step: 5,
    section: "History & attestation",
    title: "Any prior AI-related loss, complaint, or regulatory action?",
    help: "Prior losses are a direct underwriting signal.",
    weight: 1.3,
    options: [
      { value: "no", label: "No", risk: 10 },
      { value: "minor", label: "Yes — minor / remediated, no material loss", risk: 55 },
      { value: "yes", label: "Yes — material loss, open dispute, or regulatory action", risk: 95 },
    ],
  },
  {
    id: "existingCover",
    step: 5,
    section: "History & attestation",
    title: "Is there existing cyber / tech E&O / PI cover that may overlap?",
    help: "Helps underwriters avoid double-counting and spot AI exclusions.",
    weight: 0.7,
    options: [
      { value: "yes_ai", label: "Yes — and AI is not excluded", risk: 25 },
      { value: "yes_excluded", label: "Yes — but AI risk is excluded or unclear", risk: 55 },
      { value: "none", label: "No overlapping cover", risk: 40 },
      { value: "unknown", label: "Unknown", risk: 50 },
    ],
  },
  {
    id: "redTeamed",
    step: 5,
    section: "History & attestation",
    title: "Has the system been independently red-teamed for AI risks?",
    help: "External testing evidence strengthens the technical risk score.",
    weight: 1.2,
    options: [
      { value: "yes", label: "Yes — within the last 12 months", risk: 15 },
      { value: "older", label: "Yes — but more than 12 months ago", risk: 45 },
      { value: "no", label: "No", risk: 80 },
    ],
  },
  {
    id: "userDisclosure",
    step: 5,
    section: "History & attestation",
    title: "Are users told they are interacting with AI?",
    help: "Transparency reduces surprise and complaint risk.",
    weight: 0.7,
    options: [
      { value: "always", label: "Always", risk: 15 },
      { value: "sometimes", label: "Sometimes", risk: 45 },
      { value: "never", label: "Never", risk: 75 },
    ],
  },
  {
    id: "attestation",
    step: 5,
    section: "History & attestation",
    title: "Do you attest that these answers are complete and accurate?",
    help: "Material misrepresentation may affect coverage at claim or renewal. You authorize agreed sandbox testing.",
    weight: 0.5,
    options: [
      { value: "yes", label: "Yes — I confirm and authorize agreed testing", risk: 0 },
      { value: "no", label: "No — I cannot attest at this time", risk: 100 },
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
  const premiumFactor = premiumFactorFromScore(score);
  const findings = buildFindings(answers, tier);
  const conditions = buildConditions(answers, tier);
  const scoreDrivers = buildScoreDrivers(answers);

  return { score, tier, premiumFactor, findings, conditions, scoreDrivers };
}

const THEME_FROM_SECTION: Record<string, ScoreDriver["theme"]> = {
  "System & exposure": "exposure",
  "Exposure & data": "data",
  Controls: "controls",
  "Testing & compliance": "governance",
  "History & attestation": "governance",
};

/** Minimum option risk to count as a score driver (avoids low-risk noise). */
const DRIVER_RISK_FLOOR = 40;

/**
 * Top score drivers from questionnaire answers: highest risk × weight.
 * Rule-based — no ML. Export for report fallback / recompute.
 */
export function buildScoreDrivers(answers: Answers, limit = 3): ScoreDriver[] {
  const ranked: ScoreDriver[] = [];

  for (const q of QUESTIONS) {
    const opt = optionFor(q.id, answers[q.id]);
    if (!opt || opt.risk < DRIVER_RISK_FLOOR) continue;

    const copy = driverCopy(q.id, opt.value, opt.label);
    if (!copy) continue;

    const theme =
      q.id === "humanOversight" || q.id === "autonomousActions"
        ? "oversight"
        : q.id === "dataSensitivity" || q.id === "dataHandling" || q.id === "piiFiltering"
          ? "data"
          : THEME_FROM_SECTION[q.section] ?? "exposure";

    ranked.push({
      theme,
      title: copy.title,
      detail: copy.detail,
      weight: Math.round(opt.risk * q.weight),
    });
  }

  ranked.sort((a, b) => b.weight - a.weight);
  return ranked.slice(0, limit);
}

function driverCopy(
  questionId: string,
  value: string,
  optionLabel: string
): { title: string; detail: string } | null {
  const byId: Record<string, (v: string, label: string) => { title: string; detail: string } | null> = {
    systemStatus: (_v, label) => ({
      title: "Live system exposure",
      detail: `The AI is ${label.toLowerCase()}, so failures can create immediate claims exposure.`,
    }),
    useCase: (v) => {
      if (v === "agent")
        return {
          title: "Autonomous agent use case",
          detail: "Workflow automation without tight bounds raises liability if the agent acts wrongly.",
        };
      if (v === "decisions")
        return {
          title: "High-stakes decision support",
          detail: "Credit, HR, claims or similar decisions create material errors-and-omissions exposure.",
        };
      return {
        title: "Elevated use-case risk",
        detail: `Primary use case (${optionLabel}) carries above-average underwriting exposure.`,
      };
    },
    actionableAdvice: () => ({
      title: "Users may rely on AI advice",
      detail: "Actionable guidance creates advice and errors-and-omissions exposure if outputs are wrong.",
    }),
    autonomousActions: () => ({
      title: "Unsupervised actions",
      detail: "The system can trigger actions without a human — payments, approvals, or access changes raise severity.",
    }),
    financialImpact: (_v, label) => ({
      title: "Material financial impact",
      detail: `Worst-case loss if the AI fails is ${label.toLowerCase()}, which sets claim severity.`,
    }),
    nonFinancialImpact: (v, label) => {
      if (v === "none") return null;
      return {
        title: "Non-financial liability",
        detail: `Main failure mode is ${label.toLowerCase()} — a key driver of regulatory and reputation risk.`,
      };
    },
    modelSource: (v) => {
      if (v === "major") return null;
      return {
        title: "Model / vendor complexity",
        detail: `Model sourcing (${optionLabel}) widens the control surface and vendor risk.`,
      };
    },
    vendorContract: (v) => {
      if (v === "yes") return null;
      return {
        title: "Weak contractual risk transfer",
        detail: "AI liability and data-use terms are incomplete — harder to allocate loss at claim time.",
      };
    },
    dataSensitivity: (v) => {
      if (v === "public") return null;
      return {
        title: "Sensitive data in scope",
        detail: `The system processes ${optionLabel.toLowerCase()}, raising the cost of a leak or misuse.`,
      };
    },
    dataHandling: (v) => {
      if (v === "minimal") return null;
      return {
        title: "Prompt and output handling",
        detail: `${optionLabel} — storage, sharing, or training use increases privacy exposure.`,
      };
    },
    piiFiltering: () => ({
      title: "Incomplete PII controls",
      detail: "Personal data is not fully filtered on input and scanned on output — leakage risk remains open.",
    }),
    humanOversight: (v) => {
      if (v === "always") return null;
      return {
        title: "Limited human oversight",
        detail:
          v === "never"
            ? "High-impact AI output is not reviewed by a human before action or regulated advice."
            : "Human review is only spot-checks — consequential mistakes can reach users unchecked.",
      };
    },
    guardrails: () => ({
      title: "Thin technical guardrails",
      detail: "Injection defenses, content filters, or access controls are incomplete — technical risk is elevated.",
    }),
    logging: () => ({
      title: "Incomplete audit logging",
      detail: "Prompts, outputs, and tool calls are not fully logged — claims and incidents are harder to defend.",
    }),
    incidentResponse: () => ({
      title: "No AI incident playbook",
      detail: "There is no documented response path for AI failures — slows containment and notification.",
    }),
    sandboxAccess: () => ({
      title: "No insurer test access",
      detail: "No staging endpoint for authorized testing — harder to verify controls without source code.",
    }),
    frameworks: () => ({
      title: "Weak governance mapping",
      detail: "Limited mapping to AI Act / GDPR / sector rules — compliance posture is harder to evidence.",
    }),
    aiPolicy: () => ({
      title: "No approved AI policy",
      detail: "Management has not approved a written AI governance policy — accountability is unclear.",
    }),
    qualityMeasurement: () => ({
      title: "Weak quality monitoring",
      detail: "Output quality and known failure modes are not measured systematically — accuracy risk stays open.",
    }),
    retestOnChange: () => ({
      title: "Change control gaps",
      detail: "The system is not always re-tested after model, prompt, or tool changes — silent risk drift between renewals.",
    }),
    priorIncidents: (v) => {
      if (v === "no") return null;
      return {
        title: "Prior AI-related issues",
        detail:
          v === "yes"
            ? "Material prior loss, dispute, or regulatory action — a direct underwriting signal."
            : "Prior minor or remediated AI issues — history still informs appetite and terms.",
      };
    },
    existingCover: (v) => {
      if (v === "yes_ai") return null;
      return {
        title: "Coverage overlap unclear",
        detail: "Existing cyber / E&O / PI may exclude AI or leave gaps — check stacking and exclusions.",
      };
    },
    redTeamed: (v) => {
      if (v === "yes") return null;
      return {
        title: "Limited red-team evidence",
        detail:
          v === "no"
            ? "No recent adversarial testing — control effectiveness is largely unproven."
            : "Red-team evidence is outdated — controls may have drifted since the last test.",
      };
    },
    userDisclosure: (v) => {
      if (v === "always") return null;
      return {
        title: "Users may not know it is AI",
        detail: "Incomplete disclosure that content is AI-generated weakens transparency and consumer-duty posture.",
      };
    },
    attestation: (v) => {
      if (v === "yes") return null;
      return {
        title: "Disclosure not attested",
        detail: "The applicant has not attested to accuracy — underwriting should not rely on unchecked answers.",
      };
    },
  };

  const fn = byId[questionId];
  return fn ? fn(value, optionLabel) : null;
}

/**
 * Optionally fold live red-team failures into drivers (e.g. after Judge Agent runs).
 * Keeps at most `limit` items; questionnaire drivers win ties on equal weight.
 */
export function mergeTestSignalDrivers(
  drivers: ScoreDriver[],
  failuresByCategory: Partial<Record<string, number>> | null | undefined,
  limit = 3
): ScoreDriver[] {
  if (!failuresByCategory) return drivers.slice(0, limit);

  const testDrivers: ScoreDriver[] = [];
  const categoryCopy: Record<string, ScoreDriver> = {
    prompt_injection: {
      theme: "controls",
      title: "Failed prompt-injection tests",
      detail: "Red-team probes bypassed guardrails — uncontrolled behaviour and liability exposure.",
      weight: 140,
    },
    jailbreak: {
      theme: "controls",
      title: "Failed jailbreak tests",
      detail: "The system accepted policy overrides in testing — safety controls did not hold.",
      weight: 135,
    },
    pii_leakage: {
      theme: "data",
      title: "PII leakage in testing",
      detail: "Test responses exposed personal data — privacy and breach cost exposure.",
      weight: 145,
    },
    unsafe_advice: {
      theme: "exposure",
      title: "Unsafe advice in testing",
      detail: "The model gave harmful or unauthorised recommendations under probe — E&O exposure.",
      weight: 130,
    },
    unauthorized_action: {
      theme: "oversight",
      title: "Unauthorized actions in testing",
      detail: "Probes showed high-impact actions without adequate human control.",
      weight: 150,
    },
    hallucination: {
      theme: "exposure",
      title: "Hallucinations under test",
      detail: "Confident false answers in testing create errors-and-omissions exposure.",
      weight: 120,
    },
    bias_discrimination: {
      theme: "governance",
      title: "Bias findings in testing",
      detail: "Unfair or discriminatory outputs under probe — fairness and compliance risk.",
      weight: 125,
    },
    system_data_exfiltration: {
      theme: "controls",
      title: "System data exposed in testing",
      detail: "Hidden context, tools, or internal docs leaked under probe — aids attackers.",
      weight: 130,
    },
  };

  for (const [cat, count] of Object.entries(failuresByCategory)) {
    if (!count || count < 1) continue;
    const base = categoryCopy[cat];
    if (!base) continue;
    testDrivers.push({
      ...base,
      weight: base.weight + count * 10,
      detail: `${base.detail} (${count} failed test${count === 1 ? "" : "s"}).`,
    });
  }

  return [...testDrivers, ...drivers]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);
}

function buildFindings(answers: Answers, tier: Tier): Finding[] {
  const findings: Finding[] = [];

  if (answers.attestation === "no") {
    findings.push({
      category: "Governance",
      severity: "HIGH",
      title: "Disclosure not attested",
      detail: "The applicant did not attest to accuracy. Coverage should not be bound without a signed attestation.",
    });
  }

  if (answers.humanOversight === "never" || answers.autonomousActions === "yes") {
    findings.push({
      category: "Governance",
      severity: "HIGH",
      title: "No human in the loop on consequential actions",
      detail:
        "The AI can take or influence consequential actions with weak or no human approval. A single bad output can reach a customer directly.",
    });
  } else if (answers.humanOversight === "sometimes") {
    findings.push({
      category: "Governance",
      severity: "MEDIUM",
      title: "Partial human oversight",
      detail: "Only some outputs are checked. High-impact actions should require explicit human sign-off.",
    });
  }

  if (
    answers.dataSensitivity === "pii" ||
    answers.dataSensitivity === "financial" ||
    answers.dataSensitivity === "sensitive"
  ) {
    findings.push({
      category: "Privacy",
      severity: answers.dataSensitivity === "sensitive" || answers.dataSensitivity === "financial" ? "HIGH" : "MEDIUM",
      title: "Sensitive data exposure risk",
      detail:
        answers.piiFiltering === "no" || answers.piiFiltering === "partial"
          ? "Sensitive data is processed and PII filtering appears incomplete. Output leakage risk is elevated."
          : "Sensitive data is in scope. Controls are present but residual privacy exposure remains.",
    });
  }

  if (answers.guardrails === "none" || answers.redTeamed === "no") {
    findings.push({
      category: "Security",
      severity: answers.guardrails === "none" ? "HIGH" : "MEDIUM",
      title: "Prompt injection and AI-specific testing gaps",
      detail:
        "Guardrails and/or independent red-teaming are insufficient. Injection, jailbreaks, and unsafe answers may reach users.",
    });
  }

  if (
    answers.useCase === "decisions" ||
    answers.useCase === "agent" ||
    answers.actionableAdvice === "yes"
  ) {
    findings.push({
      category: "Accuracy",
      severity: tier === "HIGH" ? "HIGH" : "MEDIUM",
      title: "High advice / decision liability",
      detail:
        "Users may rely on AI output for decisions or advice. Hallucinations and confident errors create material E&O exposure.",
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

  if (answers.frameworks === "none" || answers.aiPolicy === "no") {
    findings.push({
      category: "Compliance",
      severity: "MEDIUM",
      title: "Weak AI governance documentation",
      detail: "No clear mapping to AI Act / GDPR / sector rules or approved AI policy. Regulatory exposure is under-documented.",
    });
  }

  if (answers.priorIncidents === "yes") {
    findings.push({
      category: "Governance",
      severity: "HIGH",
      title: "Prior AI-related loss or regulatory action",
      detail: "Material prior incidents indicate elevated frequency risk until remediation is evidenced.",
    });
  }

  if (findings.length === 0) {
    findings.push({
      category: "Governance",
      severity: "LOW",
      title: "Strong controls observed",
      detail:
        "Oversight, logging, testing and governance are in place. Residual risk is limited to normal model uncertainty.",
    });
  }

  return findings;
}

function buildConditions(answers: Answers, tier: Tier): string[] {
  const conditions: string[] = [];

  if (answers.attestation !== "yes") {
    conditions.push("Obtain signed attestation before quoting or binding cover.");
  }
  if (answers.humanOversight !== "always") {
    conditions.push("Require human approval for all high-impact AI actions and regulated advice.");
  }
  if (answers.autonomousActions === "yes") {
    conditions.push("Disable unsupervised autonomous actions until control improvements are verified.");
  }
  if (answers.guardrails !== "full" || answers.redTeamed === "no") {
    conditions.push("Introduce quarterly red-team testing and re-assessment at renewal.");
  }
  if (answers.logging !== "full") {
    conditions.push("Enable full input/output logging with 12-month retention.");
  }
  if (
    answers.dataSensitivity === "pii" ||
    answers.dataSensitivity === "financial" ||
    answers.dataSensitivity === "sensitive"
  ) {
    if (answers.piiFiltering !== "yes") {
      conditions.push("Add PII input filtering and output scanning before binding.");
    }
  }
  if (answers.frameworks === "none" || answers.aiPolicy === "no") {
    conditions.push("Complete AI governance documentation (policy + framework mapping) before binding cover.");
  }
  if (answers.sandboxAccess !== "yes") {
    conditions.push("Provide a staging endpoint for insurer-authorized testing within 30 days.");
  }
  if (answers.retestOnChange !== "yes") {
    conditions.push("Require re-test after any material model, prompt, or tool change.");
  }
  if (answers.priorIncidents === "yes") {
    conditions.push("Provide incident remediation evidence before coverage is bound.");
  }

  if (conditions.length === 0) {
    conditions.push("Maintain current controls and re-assess at annual renewal.");
  }

  if (tier === "HIGH") {
    conditions.unshift("Remediate high-severity findings before coverage is bound.");
  }

  return conditions;
}
