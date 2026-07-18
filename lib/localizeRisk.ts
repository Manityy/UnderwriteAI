import type { Finding, ScoreDriver } from "@/lib/mockRiskEngine";

/** Map stored English finding titles → translation codes (backward compatible). */
const FINDING_TITLE_TO_CODE: Record<string, string> = {
  "Disclosure not attested": "disclosure_not_attested",
  "No human in the loop on consequential actions": "no_human_in_loop",
  "Partial human oversight": "partial_human_oversight",
  "Sensitive data exposure risk": "sensitive_data_exposure_controls_present",
  "Prompt injection and AI-specific testing gaps": "prompt_injection_gaps",
  "High advice / decision liability": "high_advice_liability",
  "No audit trail": "no_audit_trail",
  "Weak AI governance documentation": "weak_governance_docs",
  "Prior AI-related loss or regulatory action": "prior_ai_loss",
  "Strong controls observed": "strong_controls",
};

const CONDITION_EN_TO_CODE: Record<string, string> = {
  "Remediate high-severity findings before coverage is bound.": "remediate_high_severity",
  "Obtain signed attestation before quoting or binding cover.": "obtain_attestation",
  "Require human approval for all high-impact AI actions and regulated advice.":
    "require_human_approval",
  "Disable unsupervised autonomous actions until control improvements are verified.":
    "disable_autonomous",
  "Introduce quarterly red-team testing and re-assessment at renewal.": "quarterly_red_team",
  "Enable full input/output logging with 12-month retention.": "enable_logging",
  "Add PII input filtering and output scanning before binding.": "add_pii_filtering",
  "Complete AI governance documentation (policy + framework mapping) before binding cover.":
    "complete_governance_docs",
  "Provide a staging endpoint for insurer-authorized testing within 30 days.": "provide_staging",
  "Require re-test after any material model, prompt, or tool change.": "require_retest",
  "Provide incident remediation evidence before coverage is bound.": "incident_remediation",
  "Maintain current controls and re-assess at annual renewal.": "maintain_controls",
};

const DRIVER_TITLE_TO_CODE: Record<string, string> = {
  "Live system exposure": "systemStatus",
  "Elevated use-case risk": "useCase",
  "Autonomous agent use case": "useCase_agent",
  "High-stakes decision support": "useCase_decisions",
  "Users may rely on AI advice": "actionableAdvice",
  "Unsupervised actions": "autonomousActions",
  "Material financial impact": "financialImpact",
  "Non-financial liability": "nonFinancialImpact",
  "Model / vendor complexity": "modelSource",
  "Weak contractual risk transfer": "vendorContract",
  "Sensitive data in scope": "dataSensitivity",
  "Prompt and output handling": "dataHandling",
  "Incomplete PII controls": "piiFiltering",
  "Limited human oversight": "humanOversight",
  "Thin technical guardrails": "guardrails",
  "Incomplete audit logging": "logging",
  "No AI incident playbook": "incidentResponse",
  "No insurer test access": "sandboxAccess",
  "Weak governance mapping": "frameworks",
  "No approved AI policy": "aiPolicy",
  "Weak quality monitoring": "qualityMeasurement",
  "Change control gaps": "retestOnChange",
  "Prior AI-related issues": "priorIncidents",
  "Coverage overlap unclear": "existingCover",
  "Limited red-team evidence": "redTeamed",
  "Users may not know it is AI": "userDisclosure",
  "Disclosure not attested": "attestation",
  "Failed prompt-injection tests": "prompt_injection",
  "Failed jailbreak tests": "jailbreak",
  "PII leakage in testing": "pii_leakage",
  "Unsafe advice in testing": "unsafe_advice",
  "Unauthorized actions in testing": "unauthorized_action",
  "Hallucinations under test": "hallucination",
  "Bias findings in testing": "bias_discrimination",
  "System data exposed in testing": "system_data_exfiltration",
};

type Translate = {
  (key: string, values?: Record<string, string | number | Date>): string;
  has?: (key: string) => boolean;
};

function hasKey(t: Translate, key: string): boolean {
  if (typeof t.has === "function") return t.has(key);
  try {
    const msg = t(key);
    return typeof msg === "string" && !msg.includes(key);
  } catch {
    return false;
  }
}

export function localizeFinding(
  finding: Finding & { code?: string },
  t: Translate
): Finding {
  let code = finding.code;
  if (!code) {
    if (
      finding.title === "Sensitive data exposure risk" &&
      finding.detail.includes("PII filtering appears incomplete")
    ) {
      code = "sensitive_data_exposure_incomplete_pii";
    } else if (
      finding.title === "Sensitive data exposure risk" &&
      finding.detail.includes("Controls are present")
    ) {
      code = "sensitive_data_exposure_controls_present";
    } else {
      code = FINDING_TITLE_TO_CODE[finding.title];
    }
  }

  if (code && hasKey(t, `findings.${code}.title`)) {
    return {
      ...finding,
      category: hasKey(t, `categories.${finding.category}`)
        ? (t(`categories.${finding.category}`) as Finding["category"])
        : finding.category,
      title: t(`findings.${code}.title`),
      detail: t(`findings.${code}.detail`),
    };
  }

  return {
    ...finding,
    category: hasKey(t, `categories.${finding.category}`)
      ? (t(`categories.${finding.category}`) as Finding["category"])
      : finding.category,
  };
}

export function localizeCondition(condition: string, t: Translate): string {
  const code = CONDITION_EN_TO_CODE[condition] ?? condition;
  if (hasKey(t, `conditions.${code}`)) return t(`conditions.${code}`);
  return condition;
}

export function localizeDriver(driver: ScoreDriver, t: Translate): ScoreDriver {
  const code = DRIVER_TITLE_TO_CODE[driver.title];
  if (!code) return driver;

  const isTest = code.includes("_") && !code.startsWith("useCase_");
  const ns = ["prompt_injection", "jailbreak", "pii_leakage", "unsafe_advice", "unauthorized_action", "hallucination", "bias_discrimination", "system_data_exfiltration"].includes(code)
    ? "testDrivers"
    : "drivers";

  if (!hasKey(t, `${ns}.${code}.title`)) return driver;

  let detail = t(`${ns}.${code}.detail`);
  // Preserve trailing failed-test count if present in stored English detail
  const countMatch = driver.detail.match(/\((\d+) failed tests?\)\.?$/);
  if (countMatch && ns === "testDrivers") {
    const count = Number(countMatch[1]);
    const suffix =
      count === 1
        ? t(`${ns}.${code}.failedTest`, { count })
        : t(`${ns}.${code}.failedTests`, { count });
    detail = `${detail} ${suffix}`;
  }

  return {
    ...driver,
    title: t(`${ns}.${code}.title`),
    detail,
  };
}

export function localizeCategory(category: string, t: Translate): string {
  if (hasKey(t, `categories.${category}`)) return t(`categories.${category}`);
  return category;
}

export function localizeAttackCategory(category: string, t: Translate): string {
  if (hasKey(t, `attackCategories.${category}`)) return t(`attackCategories.${category}`);
  return category;
}
