export const ATTACK_CATEGORIES = [
  "prompt_injection",
  "jailbreak",
  "hallucination",
  "pii_leakage",
  "unsafe_advice",
  "unauthorized_action",
  "bias_discrimination",
  "system_data_exfiltration",
] as const;

export type AttackCategory = (typeof ATTACK_CATEGORIES)[number];

export type SeverityHint = "low" | "medium" | "high";

export type AttackPrompt = {
  id: string;
  category: AttackCategory;
  prompt: string;
  severityHint: SeverityHint;
  source: "seed" | "llm";
};

// --- Judge Agent 2 (assess the model's responses) ---

/** Verdict for a single attack prompt after the target AI replied. */
export type TestResult = {
  promptId: string;
  category: AttackCategory;
  prompt: string;
  response: string; // simulated client AI reply
  passed: boolean; // true = the AI resisted / behaved safely
  severity: SeverityHint;
  reason: string; // short plain-language explanation
  labels: string[]; // machine tags, e.g. ["injection_success", "pii_exposed"]
  judgedByLlm: boolean; // false = heuristic fallback was used
};

/** Aggregate summary of a full test run. */
export type TestRunSummary = {
  total: number;
  passed: number;
  failed: number;
  failuresByCategory: Record<AttackCategory, number>;
  totalByCategory: Record<AttackCategory, number>;
  usedLlm: boolean;
  ranAt: string; // ISO timestamp
};

export type AttackCategoryMeta = {
  id: AttackCategory;
  label: string;
  /** Why this matters for underwriting / insurers. */
  rationale: string;
  /** Existing risk-engine bucket this maps to. */
  riskBucket: "Security" | "Privacy" | "Accuracy" | "Governance" | "Compliance";
};

export const ATTACK_CATEGORY_META: Record<AttackCategory, AttackCategoryMeta> = {
  prompt_injection: {
    id: "prompt_injection",
    label: "Prompt injection",
    rationale: "Guardrail bypass leads to uncontrolled behaviour and liability.",
    riskBucket: "Security",
  },
  jailbreak: {
    id: "jailbreak",
    label: "Jailbreak",
    rationale: "System-prompt or policy override defeats safety controls.",
    riskBucket: "Security",
  },
  hallucination: {
    id: "hallucination",
    label: "Hallucination",
    rationale: "Confident false answers create errors-and-omissions exposure.",
    riskBucket: "Accuracy",
  },
  pii_leakage: {
    id: "pii_leakage",
    label: "PII leakage",
    rationale: "Leaking personal data triggers privacy and GDPR breach costs.",
    riskBucket: "Privacy",
  },
  unsafe_advice: {
    id: "unsafe_advice",
    label: "Unsafe advice",
    rationale: "Harmful or unauthorised recommendations expose the insured.",
    riskBucket: "Accuracy",
  },
  unauthorized_action: {
    id: "unauthorized_action",
    label: "Unauthorized action",
    rationale: "AI executing high-impact actions alone removes human control.",
    riskBucket: "Governance",
  },
  bias_discrimination: {
    id: "bias_discrimination",
    label: "Bias & discrimination",
    rationale: "Unfair outputs create fairness and regulatory compliance risk.",
    riskBucket: "Compliance",
  },
  system_data_exfiltration: {
    id: "system_data_exfiltration",
    label: "System data exfiltration",
    rationale: "Leaking tools, hidden context or internal docs aids attackers.",
    riskBucket: "Security",
  },
};
