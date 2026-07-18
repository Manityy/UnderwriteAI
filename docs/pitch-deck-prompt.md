# UnderwriteAI — Pitch Deck Prompt (Gamma / Canva AI)

Product name: **UnderwriteAI** (final). Alternatives if you rebrand: ModelGuard, RiskLens AI, AuraRisk.

---

## How to use this file

1. Copy everything between **PROMPT START** and **PROMPT END** below.
2. Paste it into [Gamma.app](https://gamma.app) ("Paste in text") or Canva AI ("Generate from prompt").
3. Generate, then add your logo and team photos manually.
4. Use the Speaker notes cheat sheet at the bottom to rehearse a 5–7 minute pitch.

---

## PROMPT START

Create a professional, modern **10–12 slide pitch deck** in **English** for a pitch competition called **UnderwriteAI**.

**Team:** Pivot — Alaa, Imen, Aziz (3 members)

**Product name:** UnderwriteAI

**One-line pitch:** UnderwriteAI is a B2B underwriting intelligence platform that helps **insurance companies** assess and price AI risk for their corporate clients — without needing access to proprietary model code.

**Audience:** Jury, including **insurance industry professionals**. The deck must convince them this is a **real, sellable product** insurers would buy — not a generic AI slide deck.

**Tone:** Confident, clear, business-first with credible technical depth. Avoid hype words like "revolutionary" or "guaranteed." Use insurance language: underwriting, exposure, controls, premium, claims, renewal, compliance.

**Visual style:** Clean fintech/insurtech aesthetic. Dark blue + white + one accent (teal or amber). Minimal text per slide. Use simple diagrams for architecture and BMC. Include icons for insurers, AI, risk, compliance, and testing. Do not use stock photos of generic robots; prefer clean business/insurtech visuals.

---

### SLIDE 1 — Title
- Title: **UnderwriteAI**
- Subtitle: *Underwriting intelligence for AI risk*
- Team: **Pivot** — Alaa · Imen · Aziz
- Event: product launch
- One visual: insurer + corporate client + AI shield

---

### SLIDE 2 — The problem
Headline: **Insurers want to cover AI. They can't price what they can't assess.**

- Companies deploy AI (chatbots, credit scoring, HR tools, copilots) that can **hallucinate, leak data, fail compliance, or cause financial harm**
- When AI fails, losses are large: wrong advice, automated bad decisions, regulatory fines, reputational damage
- **Insurers lack a standard way** to evaluate AI systems — unlike cyber, where questionnaires and controls already exist
- Corporate clients **won't share proprietary models or source code**
- Result: insurers either **refuse AI coverage**, **over-price blindly**, or **take unknown risk**

Short example: *A bank uses an LLM for customer support. It gives incorrect investment guidance. Who pays? The insurer — if they covered it without understanding the risk.*

---

### SLIDE 3 — Why now
Headline: **AI adoption is exploding. AI liability is the next underwriting gap.**

- Mass adoption of LLMs and AI agents in banking, insurance, retail, healthcare
- Rising regulation (EU AI Act, data protection, sector rules)
- Insurers already sell cyber and tech E&O — **AI liability is the natural extension**
- Market need: a **repeatable underwriting layer** for AI, not one-off expert reviews

---

### SLIDE 4 — Our solution (positioning)
Headline: **We don't sell insurance. We help insurers underwrite it.**

- **B2B SaaS** sold to insurance companies (underwriting teams, product teams, brokers)
- We assess the **AI systems of the insurer's corporate clients**
- Output: **risk score, risk tier, findings, recommended controls, underwriting conditions**
- Insurer uses our report to **accept, reject, price, or renew** AI coverage

Simple flow diagram:
1. Insurer's client applies for AI coverage
2. Client completes disclosure + optional sandbox testing
3. UnderwriteAI produces risk assessment
4. Insurer sets premium and policy conditions

---

### SLIDE 5 — How it works (system architecture)
Headline: **Two layers of evidence: governance + automated red-teaming**

Show a clean architecture diagram with these components:

**A) AI Risk Questionnaire (governance layer)**
- Structured underwriting form: use case, data sensitivity, human oversight, vendor, logging, compliance, incident history
- Same logic as cyber underwriting — disclosure required to get a quote
- Signed attestation; misrepresentation affects claims at renewal/claim time

**B) Agent 1 — Attack / Probe Agent**
- Generates diverse test inputs: hallucination traps, prompt injection, compliance edge cases, unsafe advice, PII leakage attempts
- Runs against client's **sandbox API or staging endpoint** (no source code needed)

**C) Agent 2 — Judge / Assessment Agent**
- Evaluates each response: pass/fail, severity, category (security, compliance, accuracy, safety)
- Aggregates results into measurable technical risk signals

**D) Risk Engine**
- Combines questionnaire score + test results
- Outputs: **Risk tier (Low / Medium / High)**, top findings, recommended controls, suggested premium factor (clearly labeled *indicative, not actuarial*)

Note: *We reduce uncertainty — we don't claim perfect guarantees. Continuous testing at renewal improves credibility over time.*

---

### SLIDE 6 — Key features
Headline: **What insurers get**

1. **Standardized AI risk questionnaire** — repeatable across all corporate clients
2. **Automated red-teaming** — hallucination, injection, compliance, safety probes
3. **Evidence-based risk score** — harder to game than checkboxes alone
4. **Underwriting report** — exportable PDF for actuaries and underwriters
5. **Policy conditions library** — e.g. require human-in-the-loop, logging, quarterly re-test
6. **Renewal monitoring** — re-score when models or controls change

---

### SLIDE 7 — Example scenario (demo story)
Headline: **Example: Corporate client applying for AI liability cover**

**Client:** Mid-size fintech using an LLM chatbot for customer Q&A

**Questionnaire says:** human review on financial advice, PII filtered, logs retained

**Red-team finds:** prompt injection bypasses guardrails; chatbot leaks sample PII in 2 of 50 tests; gives confident wrong tax advice

**UnderwriteAI output:**
- Risk tier: **High**
- Top issues: injection vulnerability, PII exposure, hallucination on regulated advice
- Recommended conditions: mandatory human review on financial topics, fix injection controls, re-test in 90 days
- Insurer action: **higher premium or coverage declined until fixes**

This slide should feel like a **live product demo narrative** for the jury.

---

### SLIDE 8 — Why insurers buy (value proposition)
Headline: **Built for underwriting teams, not AI labs**

For **insurers:**
- New product line: AI liability / AI errors & omissions
- Faster, cheaper underwriting vs manual expert review
- Defensible documentation at claim time
- Competitive edge vs insurers still saying "no" to AI risk

For **corporate clients (indirect):**
- Clear path to obtain coverage
- Actionable security/compliance improvements

For **regulators / compliance:**
- Structured assessment aligned with emerging AI governance expectations

---

### SLIDE 9 — Business Model Canvas
Headline: **Business Model Canvas**

Layout as a single readable BMC diagram:

- **Customer segments:** P&C insurers, specialty insurers, reinsurers; later brokers and MGAs
- **Value proposition:** Standardized, evidence-based AI risk assessment for underwriting
- **Channels:** Direct B2B sales, insurer innovation labs, partnership pilots
- **Customer relationships:** SaaS subscription + onboarding; insurer-branded client portal
- **Revenue streams:** Per-assessment fee; annual platform license; premium per monitored model at renewal
- **Key resources:** Questionnaire framework, red-team agent library, judge models, underwriting report engine
- **Key activities:** Risk assessment, test orchestration, report generation, control recommendations
- **Key partners:** Insurers (design partners), compliance/legal advisors, cloud/API providers
- **Cost structure:** LLM API costs for agents, engineering, insurer onboarding, security/compliance

---

### SLIDE 10 — Competitive differentiation
Headline: **Why us vs alternatives**

Comparison table:

| Alternative | Limitation | UnderwriteAI |
|-------------|------------|--------------|
| Manual underwriting | Slow, inconsistent, doesn't scale | Automated + standardized |
| Questionnaire only | Easy to misrepresent | Questionnaire + red-team evidence |
| Generic cyber tools | Not AI-specific (hallucination, injection, model behavior) | Built for AI failure modes |
| Client self-assessment | No insurer trust | Insurer-facing underwriting intelligence |

---

### SLIDE 11 — Go-to-market & traction plan
Headline: **From prototype to insurer pilot**

1. **Now (prototype):** Working prototype — questionnaire + 2-agent test pipeline + risk report
2. **Next 90 days:** Design partner with 1 insurer — pilot on 10 corporate AI use cases
3. **Year 1:** White-label portal for insurers; integrate into existing underwriting workflow

Metrics to track: assessments completed, time-to-quote reduction, findings accuracy, insurer pilot conversion

---

### SLIDE 12 — Closing / Ask
Headline: **Pivot asks the jury**

1. **Launch UnderwriteAI** — validate that AI underwriting intelligence is the right product for insurers today
2. **Pilot partner** — connect us with an insurer willing to test UnderwriteAI on real (anonymized) use cases
3. **Feedback from insurance experts** — refine questionnaire and risk tiers with industry input

Closing line: *"Insurers already price cyber risk from the outside. UnderwriteAI does the same for AI — with disclosure, testing, and evidence insurers can trust."*

Contact: Team Pivot — Alaa, Imen, Aziz

---

**Design instructions for Gamma/Canva:**
- Keep each slide to **3–5 bullets max**
- Use **one diagram** on the architecture slide and **one BMC visual** on slide 9
- Add speaker notes (1–2 sentences per slide) for a **5–7 minute pitch**
- End with a strong insurer-focused quote on the last slide

## PROMPT END

---

## Speaker notes cheat sheet (for live pitch, ~5–7 min)

| Slide | Say this in ~30 sec |
|-------|---------------------|
| Title | "We're Pivot. UnderwriteAI is underwriting intelligence for AI risk — sold to insurers." |
| Problem | "Insurers want AI coverage products but can't assess opaque AI systems — that's our gap." |
| Why now | "AI is everywhere and regulation is tightening; AI liability is the next cyber." |
| Solution | "We're B2B to insurers: underwriting intelligence, not the policy itself." |
| Architecture | "Questionnaire for governance, two agents for proof — attack then judge." |
| Features | "Standardized, evidence-based, exportable — it fits their existing workflow." |
| Example | Walk through the fintech chatbot: declared safe, tests found injection + PII leak, so High risk. |
| Value prop | "New product line, faster underwriting, defensible at claim time." |
| BMC | "SaaS to insurers, per-assessment + license, they keep the client relationship." |
| Differentiation | "Questionnaires can be gamed; we add automated red-team evidence built for AI failure modes." |
| GTM | "Prototype today, insurer pilot in 90 days, white-label in year one." |
| Ask | "Validate us, introduce a pilot insurer, help refine tiers with your expertise." |

---

## Insurer-persona tweak (adjust slide 8 before pitching)

- **P&C / specialty insurer jury:** stress "new product line + defensible claims documentation."
- **Bank-owned insurer jury:** stress "compliance alignment (EU AI Act) + third-party AI vendor due diligence."
- **Reinsurer in the room:** stress "portfolio-level, standardized risk signals across many cedants."
