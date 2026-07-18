type Tier = "LOW" | "MEDIUM" | "HIGH" | "PENDING";

const styles: Record<Tier, string> = {
  LOW: "bg-risk-low/10 text-risk-low ring-risk-low/20",
  MEDIUM: "bg-risk-medium/10 text-risk-medium ring-risk-medium/25",
  HIGH: "bg-risk-high/10 text-risk-high ring-risk-high/20",
  PENDING: "bg-panel text-muted ring-black/5",
};

const labels: Record<Tier, string> = {
  LOW: "Low risk",
  MEDIUM: "Medium risk",
  HIGH: "High risk",
  PENDING: "Not scored",
};

export function RiskBadge({ tier, className = "" }: { tier: string; className?: string }) {
  const t = (["LOW", "MEDIUM", "HIGH"].includes(tier) ? tier : "PENDING") as Tier;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${styles[t]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[t]}
    </span>
  );
}
