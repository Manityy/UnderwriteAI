/**
 * Reusable AI underwriting policy conditions catalog.
 * Stable IDs are persisted on assessments; labels are resolved for display.
 */

export type ConditionCategory =
  | "Oversight"
  | "Controls"
  | "Data"
  | "Testing"
  | "Governance"
  | "General";

export type PolicyCondition = {
  id: string;
  label: string;
  category: ConditionCategory;
  /** Short underwriter hint */
  help: string;
};

export const CONDITIONS_LIBRARY: PolicyCondition[] = [
  {
    id: "remediate_high",
    label: "Remediate high-severity findings before coverage is bound.",
    category: "General",
    help: "Standard for High-tier files until critical findings are closed.",
  },
  {
    id: "attestation",
    label: "Obtain signed attestation before quoting or binding cover.",
    category: "Governance",
    help: "Locks disclosure accuracy before terms are issued.",
  },
  {
    id: "hitl",
    label: "Require human approval for all high-impact AI actions and regulated advice.",
    category: "Oversight",
    help: "Human-in-the-loop on consequential decisions.",
  },
  {
    id: "no_autonomous",
    label: "Disable unsupervised autonomous actions until control improvements are verified.",
    category: "Oversight",
    help: "Blocks the AI from acting alone until controls improve.",
  },
  {
    id: "logging",
    label: "Enable full input/output logging with 12-month retention.",
    category: "Controls",
    help: "Makes claims and incidents reconstructible.",
  },
  {
    id: "pii_filters",
    label: "Add PII input filtering and output scanning before binding.",
    category: "Data",
    help: "Reduces personal-data leakage exposure.",
  },
  {
    id: "red_team",
    label: "Introduce quarterly red-team testing and re-assessment at renewal.",
    category: "Testing",
    help: "Ongoing adversarial testing of guardrails.",
  },
  {
    id: "retest_90_days",
    label: "Require a full re-test of the AI system within 90 days of binding.",
    category: "Testing",
    help: "Early post-bind verification window.",
  },
  {
    id: "retest_on_change",
    label: "Require re-test after any material model, prompt, or tool change.",
    category: "Testing",
    help: "Change-control condition between renewals.",
  },
  {
    id: "sandbox_access",
    label: "Provide a staging endpoint for insurer-authorized testing within 30 days.",
    category: "Testing",
    help: "Enables insurer red-teaming without source code.",
  },
  {
    id: "governance_docs",
    label: "Complete AI governance documentation (policy + framework mapping) before binding cover.",
    category: "Governance",
    help: "Written policy and regulatory mapping on file.",
  },
  {
    id: "incident_evidence",
    label: "Provide incident remediation evidence before coverage is bound.",
    category: "Governance",
    help: "Used when prior AI incidents are disclosed.",
  },
  {
    id: "maintain_controls",
    label: "Maintain current controls and re-assess at annual renewal.",
    category: "General",
    help: "Light-touch condition for low residual risk.",
  },
];

const BY_ID = new Map(CONDITIONS_LIBRARY.map((c) => [c.id, c]));

/** Legacy freeform strings → catalog IDs (for older scored assessments). */
const LEGACY_TEXT_TO_ID: Record<string, string> = {
  "Obtain signed attestation before quoting or binding cover.": "attestation",
  "Require human approval for all high-impact AI actions and regulated advice.": "hitl",
  "Disable unsupervised autonomous actions until control improvements are verified.": "no_autonomous",
  "Introduce quarterly red-team testing and re-assessment at renewal.": "red_team",
  "Enable full input/output logging with 12-month retention.": "logging",
  "Add PII input filtering and output scanning before binding.": "pii_filters",
  "Complete AI governance documentation (policy + framework mapping) before binding cover.":
    "governance_docs",
  "Provide a staging endpoint for insurer-authorized testing within 30 days.": "sandbox_access",
  "Require re-test after any material model, prompt, or tool change.": "retest_on_change",
  "Provide incident remediation evidence before coverage is bound.": "incident_evidence",
  "Maintain current controls and re-assess at annual renewal.": "maintain_controls",
  "Remediate high-severity findings before coverage is bound.": "remediate_high",
};

export function getCondition(id: string): PolicyCondition | undefined {
  return BY_ID.get(id);
}

export function isConditionId(id: string): boolean {
  return BY_ID.has(id);
}

/** Keep only known catalog IDs, preserving order and uniqueness. */
export function sanitizeConditionIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of ids) {
    const id = String(raw);
    if (!BY_ID.has(id) || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

/**
 * Normalize persisted conditions (IDs or legacy freeform text) to catalog IDs.
 */
export function normalizeStoredConditions(stored: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of stored) {
    const id = BY_ID.has(item) ? item : LEGACY_TEXT_TO_ID[item];
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

export function resolveConditions(ids: string[]): PolicyCondition[] {
  return ids.map((id) => BY_ID.get(id)).filter((c): c is PolicyCondition => Boolean(c));
}
