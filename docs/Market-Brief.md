# UnderwriteAI — Market Brief (Tunisia + Abroad)

**Product:** B2B underwriting intelligence for AI risk — insurers score and condition coverage on clients’ AI systems without needing source code.

**Team:** Pivot — Alaa, Imen, Aziz  
**Document date:** July 2026  
**Status:** Desk research + product positioning. Treat buyer quotes as hypothesized until validated in interviews.

---

## Part A — Formal market brief

### 1. Problem statement (in buyer’s words)

**Abroad (cyber / specialty underwriter or product lead):**

> “Clients are deploying AI everywhere, but our cyber and tech E&O questionnaires don’t tell us if the model will leak data, hallucinate, or get jailbroken. We can’t get the model weights. So we either decline, price conservatively, or accept with weak conditions — and hope the broker’s narrative is true.”

**Tunisia (insurer / reinsurer / broker building cyber):**

> “We’re launching or expanding cyber for SMEs and corporates, but we don’t have local expertise to underwrite AI. Clients won’t open their systems. We need a simple, auditable way to say accept / conditions / decline — preferably in French/Arabic workflow — without building a data-science team.”

**Core pain in one line:** You can’t price what you can’t see — and AI is a black box.

---

### 2. Target customer + ICP

**Primary buyer:** Insurance carriers and reinsurers who underwrite (or want to underwrite) cyber, tech E&O, or emerging AI liability — **not** the insured company itself.

#### ICP — Tunisia (beachhead)

| Dimension | Definition |
|---|---|
| Org type | National insurer or reinsurer with cyber / specialty appetite; or broker placing cyber |
| Examples to approach | **Tunis Re** (Cyber Assurance launched Jan 2026 with **IRIS**), **STAR**, **COMAR**, **Maghrebia**, **ASTREE**, other FTUSA members; brokers formerly Marsh Tunisia / IRIS |
| Buyer persona | Head of specialty / non-life product, underwriting director, innovation / digital |
| Trigger | New cyber product, AI in portfolio clients (banks, telcos, fintech, BPOs), data-protection pressure |
| Why Tunisia first | Small market → easier intros; cyber line is nascent (few offerings, high premiums); Tunis Re already signaled demand for SME cyber |

#### ICP — Abroad (scale market)

| Dimension | Definition |
|---|---|
| Org type | Mid-size specialty / cyber carriers, MGAs, reinsurers; later large carriers |
| Regions | Europe first (EU AI Act pressure), then MENA Gulf, then US specialty |
| Buyer persona | Cyber underwriter, AI/cyber product manager, facultative cyber underwriter at reinsurer |
| Ideal account | Writing cyber today; clients include SaaS / banks / healthcare with GenAI; wants evidence-based conditions, not only questionnaires |
| Influencers | Brokers (Howden, Marsh, Aon, Gallagher), risk consultants |

**Not ICP (yet):** End-client CISOs buying security tools; pure red-team vendors’ customers; consumers.

---

### 3. Market size (ranges + sources)

Use **ranges** — vendor AI-insurance forecasts disagree a lot. Anchor on cyber (measured), treat AI liability as emerging overlay.

| Layer | Range | Notes / sources |
|---|---|---|
| TAM — Global cyber GWP | ~$15–20B (2024–2025) → ~$30–50B by 2030 | Munich Re ~$15.3B (2024); Swiss Re ~$15.6B (2025) / ~$16.4B (2026); Gallagher ~$16–20B (2025) → $30–50B by 2030 |
| TAM — AI liability / AI-related insurance | Roughly ~$0.4B–$4.5B (2025) → multi-$B by 2030s | ResearchIntelo / DataIntelo / WiseGuyReports vary widely; pitch uses ~$0.8B → ~$22B by 2034 — present as **projected**, not fact |
| SAM — Europe cyber | ~$3.3–3.9B | Munich Re ~$3.3B (2024); Gallagher ~$3.9B |
| SAM — Middle East & Africa cyber | ~$0.3B | Gallagher 2026 Cyber Outlook (~2% of global) |
| SOM — Tunisia | Very small / emerging — no reliable open GWP figure | Ken Research / 6Wresearch: emerging, limited offerings, high premiums; Tunis Re SME cyber launch (Jan 2026) = demand signal, not size |
| Demand driver (not premiums) | MENA AI market projected ~$166B by 2030 | Grand View Research — drives *need* to insure AI, not equal to insurance premiums |

**How to talk about it honestly**

- Abroad: sell into **cyber underwriting workflow** (large, real money).
- Tunisia: sell as **enablement for a new cyber/AI line** (strategic, not volume today).
- Your revenue SOM is **software/SaaS on assessments**, not the full premium pool.

---

### 4. Competitive landscape + your wedge

| Category | Players | What they do | Gap vs UnderwriteAI |
|---|---|---|---|
| Cyber carriers / platforms | Coalition, At-Bay, Cowbell, Beazley cyber | Bind cyber; some scan IT posture | Optimize IT/security, not model behavior / GenAI failure modes |
| Reinsurers / capacity | Munich Re, Swiss Re, Tunis Re | Capacity + research; Tunis Re SME cyber | Need tools for local underwriters; they don’t ship insurer-facing AI X-ray UX |
| AI security / red team | Promptfoo, Garak, Lakera, HiddenLayer | Test models for security teams | Sell to builders/CISOs, not underwriters; no policy conditions / UW decision flow |
| AI governance | Credo AI, Holistic AI | Policies, inventories, compliance | Governance ≠ insurability score + conditions for pricing |
| Consultancies | Big 4 AI risk assessments | Manual, expensive | Slow, not productized for every submission |

**Your wedge**

1. **Buyer = insurer** (decision support), not the AI builder.
2. **No source code required** — disclosure + adversarial agents.
3. **Output = underwriting artifacts** — score, tier, findings, recommended conditions, accept / conditions / decline.
4. **Tunisia angle** — first movers on cyber (Tunis Re / IRIS) need lightweight tooling; abroad you compete on specialization inside cyber submission workflows.

---

### 5. Buying criteria & objections

#### Likely buying criteria

| Criterion | Tunisia | Abroad |
|---|---|---|
| Explainability | High — must justify to committee / regulator | High — audit trail for UW file |
| Speed | Fast SME / broker turnaround | Minutes–hours per submission |
| Integration | Email / PDF / Excel OK at first | Later: API, PAS, broker portal |
| Language / local fit | French (+ Arabic later) | English (+ EU languages) |
| Evidence quality | “Better than questionnaire alone” | Comparable rigor to IT scans / pen tests |
| Liability posture | Clear: decision-support, insurer still decides | Same + data handling / client consent |
| Price | Low pilot cost; share of new cyber premiums | Per-assessment + seat SaaS |

#### Likely objections (and answers to test)

| Objection | Response to validate |
|---|---|
| “We already have cyber questionnaires / IT scans.” | Those miss GenAI-specific failure modes; we’re complementary. |
| “Clients won’t let you probe their AI.” | Consent + staging endpoint / simulator; questionnaire-only mode if blocked. |
| “You’re not an approved actuarial model.” | Decision-support only; human underwriter binds. |
| “Too early for Tunisia.” | Cyber products are launching now; AI risk arrives with every digital client. |
| “Coalition / big vendors cover this.” | They cover infrastructure cyber; not insurer-grade AI behavior scoring. |
| “Legal / data protection risk.” | No training on client data; prompts/logs retention policy; INPDP / GDPR alignment. |
| “Can we trust an LLM judge?” | Transparent rubrics, human review, seed + deterministic fallbacks. |

---

### 6. What to build next (product implications)

Ordered for **Tunisia pilot → abroad credibility**:

1. **Live client endpoint testing** — biggest credibility jump vs simulator-only.
2. **Underwriting export pack** — PDF/report + recommended conditions + decision rationale.
3. **Consent & safe-test mode** — client authorization, rate limits, staging URL, questionnaire-only fallback.
4. **French-first UX + terminology** — assurance cyber, conditions particulières.
5. **Broker / reinsurer workflow** — broker submits; carrier/reinsurer reviews.
6. **Control library mapped to conditions** — e.g. human-in-the-loop, no PII in prompts, red-team cadence.
7. **Portfolio dashboard** — mix by AI tier, renewals, deteriorating scores.
8. **Later abroad** — API to broker portals, EU AI Act / NIST mapping, multi-tenant insurer SSO.

**Go-to-market sequence**

1. Pilot with **1 Tunisian reinsurer or insurer + 1 broker** (Tunis Re / IRIS path is clearest).
2. Use pilot case studies to approach **EU specialty cyber** buyers.
3. Don’t sell “AI insurance market $22B” as your revenue — sell **faster, safer cyber/AI underwriting**.

**What this brief still needs**

- 8–12 interviews in Tunisia (UW / product / brokers) and 5–8 abroad.
- Confirmed willingness-to-pay and must-have features.
- One competitor teardown of Tunis Re Cyber Assurance questionnaire vs your assessment.

---

## Part B — Simple explanation (who buys this)

### Who you’re selling to

- UnderwriteAI is **not** sold to random companies that use AI.
- You sell it to **people who sell insurance** — mainly insurance companies.
- They use your tool to check if a client’s AI is safe enough to insure, set conditions, or refuse coverage.
- You don’t sell the insurance policy; you sell the **“X-ray”** that helps them decide.

### Tunisian insurance companies (potential buyers)

Tunisia has roughly **20+ insurers** under FTUSA and regulator CGA. Focus on **multi-branch / non-life** companies:

**Best to approach first**

- **Tunis Re** — national reinsurer; Cyber Assurance for SMEs with **IRIS** (Jan 2026). Strongest cyber signal.
- **STAR** — market leader, multi-branch
- **COMAR**
- **Maghrebia**
- **GAT Assurances**
- **ASTREE**
- **Assurances BIAT**
- **Lloyd Tunisien**
- **BH Assurance**
- **BNA Assurances**
- **Carte Assurances**
- **AMI Assurances**
- **CTAMA**
- **MAE**
- **Zitouna Takaful**, **At-takafulia**, **El Amana Takaful** (takaful multi-branch)

**Weaker fit for now (life / savings focused)**

- Hayett, Attijari Assurance, Maghrebia Vie, Carte Vie, GAT Vie, UIB Assurances, etc.

**Also important (open doors)**

- **Brokers** (e.g. **IRIS**, formerly Marsh Tunisia) — bring clients; may use your report or introduce you.
- **COTUNACE** — credit/export insurance; less central for AI cyber.

**Day-one focus:** Tunis Re + IRIS, then 2–3 big names (STAR, COMAR, Maghrebia).

### Other buyer types

| Buyer type | What they do | Why they might buy |
|---|---|---|
| Insurance company (primary) | Sells policies to banks, startups, factories, etc. | Needs score + conditions before yes/no on AI risk |
| Reinsurer (e.g. Tunis Re) | Insures the insurers | Wants better UW standards on cyber/AI |
| Insurance broker | Middleman between client and insurer | Uses your report to place the risk |
| MGA / specialty underwriter (abroad) | Writes specialty lines for a carrier | Needs fast, repeatable AI risk checks |
| Not your buyer (yet) | The company that built the chatbot | They buy security tools; you sell to their insurer |

### One paragraph to keep in your head

We sell UnderwriteAI to **insurance companies in Tunisia (and later abroad)**, not to the businesses that use AI. Those insurers want to cover cyber and AI risks but can’t see inside the client’s AI model, so they guess or say no. Our product gives them a clear risk score and recommended conditions. In Tunisia, main targets are multi-branch insurers like STAR, COMAR, Maghrebia, GAT, ASTREE, BIAT, Lloyd, BH, BNA, Carte, plus Tunis Re and brokers like IRIS. Life-only insurers are less relevant. Brokers and reinsurers can also buy or help us get in. Abroad, the same buyer types exist — bigger and more mature.

---

## Part C — Will it work? Need, competitors, who needs us most

### What the project is

- Companies use AI everywhere; AI can leak data, give wrong answers, or get tricked.
- Insurers want to cover that risk but can’t see inside the client’s AI code.
- UnderwriteAI: ask questions + run attack tests → risk score + recommended conditions.
- You don’t sell insurance — you help insurers decide whether to sell it.

### Is it needed in Tunisia?

- Need for **cyber help** → rising.
- Need for **AI-specific underwriting tools** → early / emerging, not urgent for every insurer yet.
- Best use of Tunisia → **pilot + proof**, not “get rich here tomorrow.”
- Cyber is new, small, expensive; Tunis Re’s SME cyber launch = demand signal.

### Is it needed abroad?

- **Yes, much more.**
- Global cyber already ~$15–20B.
- AI use and incidents rising; Europe pressured by EU AI Act.
- Insurers still use questionnaires / IT scans that don’t fully test GenAI behavior.

### Who needs the product most

1. Cyber / specialty underwriters at insurers
2. Reinsurers (e.g. Tunis Re)
3. Brokers (e.g. IRIS)
4. Product / innovation teams launching cyber
5. Not main buyers: AI builders or life-only insurers

### Will it work?

**Why yes**

- Real pain: insurers can’t measure AI risk.
- Timing is good (cyber starting in Tunisia; AI risk rising abroad).
- Clear wedge: insurer-facing score + conditions, no source code.
- Almost no local tool does this in Tunisia.
- Demo already shows questionnaire + attack + judge.

**Why hard / maybe no**

- Tunisia alone is too small for big revenue.
- Insurers buy slowly (trust, legal, procurement).
- Clients may refuse live AI testing.
- Some will say “nice demo, not production-ready.”
- Abroad, big players can copy parts of the idea.
- Fails if you only sell a futuristic market story instead of a practical UW tool.

**Bottom line**

- Tunisia-only → niche / pilot.
- Tunisia pilot → Europe/MENA → more realistic.
- Works if you get 1–2 real insurer pilots and prove value.

### Competitors — who they are and what they do

**Nearby tools for insurers (not exact twins)**

- Federato, Sixfold, Cytora, Guidewire → speed up underwriting workflows.
- Munich Re / Swiss Re platforms → digital underwriting products.
- Coalition, At-Bay, Cowbell → sell/scan cyber; not AI behavior scoring for other insurers.

**Same tech idea, different buyer**

- Promptfoo, Garak, Lakera → red-team AI for tech/security teams.
- Credo AI, Holistic AI → AI governance/compliance for companies.

**Same topic, different product**

- Big carriers (Munich Re, Beazley, etc.) → sell AI/cyber insurance policies.
- Big 4 consultancies → expensive manual AI risk assessments.
- Tunis Re Cyber Assurance + IRIS → local cyber product; possible partner/customer, not a software rival.

**Reality check**

- In Tunisia today, main “competitor” = Excel + questionnaires + underwriter gut feel.
- Abroad later = cyber platforms + AI security tools + in-house insurer tools.

### Tunisia vs abroad

| | Tunisia | Abroad |
|---|---|---|
| Market size | Small / early | Large (cyber already big) |
| How needed? | Growing for cyber; AI-specific early | Clearer and stronger |
| Best role | Pilot, case study, relationships | Scale and revenue |
| Who to chase | Tunis Re, IRIS, STAR, COMAR, Maghrebia… | Specialty cyber insurers, MGAs, EU carriers |
| Main risk | Nobody buys yet / long talks | Crowded, slow enterprise sales |
| Main opportunity | First mover in a tiny market | Real money if product is trusted |

### What to remember

1. Buyer = insurer / broker / reinsurer — not the AI company.
2. In Tunisia, pitch cyber + AI risk together.
3. Tunisia = prove it; abroad = grow it.
4. No exact local twin; abroad has nearby competitors.
5. Success = real pilots + practical underwriting value.

---

*Sources for market figures include Munich Re, Swiss Re, Gallagher Cyber Outlook, Ken Research / 6Wresearch (Tunisia cyber), Grand View Research (MENA AI), and specialty AI-liability vendor reports (use cautiously). Validate with customer interviews before treating as final strategy.*
