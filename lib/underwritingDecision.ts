/**
 * Underwriting decision on an assessment file.
 * Decision-support only — does not bind coverage.
 */

export const UNDERWRITING_DECISIONS = [
  "ACCEPT",
  "ACCEPT_WITH_CONDITIONS",
  "REFER",
  "DECLINE",
] as const;

export type UnderwritingDecision = (typeof UNDERWRITING_DECISIONS)[number];

export type DecisionMeta = {
  id: UnderwritingDecision;
  label: string;
  shortLabel: string;
  description: string;
};

export const DECISION_OPTIONS: DecisionMeta[] = [
  {
    id: "ACCEPT",
    label: "Accept",
    shortLabel: "Accept",
    description: "Standard terms appear appropriate based on this assessment.",
  },
  {
    id: "ACCEPT_WITH_CONDITIONS",
    label: "Accept with conditions",
    shortLabel: "Conditions",
    description: "Proceed only with the attached policy conditions.",
  },
  {
    id: "REFER",
    label: "Refer",
    shortLabel: "Refer",
    description: "Escalate to senior underwriter or specialist review.",
  },
  {
    id: "DECLINE",
    label: "Decline",
    shortLabel: "Decline",
    description: "Do not offer cover until material risks are remediated.",
  },
];

const BY_ID = new Map(DECISION_OPTIONS.map((d) => [d.id, d]));

export function isUnderwritingDecision(value: unknown): value is UnderwritingDecision {
  return (
    typeof value === "string" &&
    (UNDERWRITING_DECISIONS as readonly string[]).includes(value)
  );
}

export function parseDecision(value: string | null | undefined): UnderwritingDecision | null {
  if (!value) return null;
  return isUnderwritingDecision(value) ? value : null;
}

export function decisionLabel(value: string | null | undefined): string {
  const d = parseDecision(value);
  return d ? BY_ID.get(d)!.label : "No decision";
}

export function decisionShortLabel(value: string | null | undefined): string {
  const d = parseDecision(value);
  return d ? BY_ID.get(d)!.shortLabel : "Pending";
}

/** Badge styles — insurance-native, not celebratory. */
export function decisionBadgeClass(value: string | null | undefined): string {
  const d = parseDecision(value);
  switch (d) {
    case "ACCEPT":
      return "bg-risk-low/10 text-risk-low ring-risk-low/20";
    case "ACCEPT_WITH_CONDITIONS":
      return "bg-brand/10 text-brand ring-brand/20";
    case "REFER":
      return "bg-risk-medium/10 text-risk-medium ring-risk-medium/25";
    case "DECLINE":
      return "bg-risk-high/10 text-risk-high ring-risk-high/20";
    default:
      return "bg-panel text-muted ring-black/5";
  }
}
