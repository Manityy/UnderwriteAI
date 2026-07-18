# UnderwriteAI

Underwriting intelligence for AI risk. A mock B2B platform that helps insurers measure and price
the risk of their clients' AI systems — without needing the model's source code.

Built by **Team Pivot** (Alaa, Imen, Aziz).

> This is a demo build. The risk engine is a deterministic mock (rules over questionnaire answers).
> Agent 1 (the attack agent) and Agent 2 (the judge) are real: they use Groq to generate
> adversarial prompts and grade the AI's replies. Calling a client's live AI endpoint (instead of
> the built-in simulator) is the next step.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Prisma 6 + SQLite (local file)
- Auth via signed cookie (jose) + bcrypt

## Getting started

```bash
npm install
cp .env.example .env.local   # then paste your GROQ_API_KEY
npm run db:push   # create the SQLite schema
npm run db:seed   # seed demo insurer + sample assessments
npm run dev       # http://localhost:3000
```

### Environment

Set `GROQ_API_KEY` in `.env.local` to enable the attack agent's LLM generation. Get a key at
[console.groq.com/keys](https://console.groq.com/keys). Without a key, the attack agent still works
using its built-in seed prompts. Never commit real keys. If a key was ever shared in chat or a
ticket, rotate it before using it here.

### Demo login

```
Email:    insurer@demo.com
Password: demo123
```

## What's included

| Area | Route | Notes |
|------|-------|-------|
| Landing | `/` | Hero, shock stats, how-it-works |
| About | `/about` | Example client story, problem, solution |
| Contact | `/contact` | Stores messages via API |
| Login | `/login` | Demo insurer account |
| Dashboard | `/dashboard` | Portfolio risk mix + recent |
| Assessments | `/assessments` | Full list |
| New assessment | `/assessments/new` | Multi-step questionnaire |
| Report | `/assessments/[id]` | Score gauge, findings, conditions, attack + judge agents |

## Attack agent (Agent 1)

`lib/agents/attackAgent.ts` generates adversarial prompts across 8 risk categories (prompt
injection, jailbreak, hallucination, PII leakage, unsafe advice, unauthorized action, bias, system
data exfiltration). It runs one batched Groq call per category (`openai/gpt-oss-120b`, JSON output)
and falls back to the seed bank in `lib/agents/attackSeedBank.ts` if the key is missing or a batch
fails. Prompts are stored on the assessment and shown on the report page via the "Generate attack
prompts" button.

## Judge agent (Agent 2)

`lib/agents/testRunner.ts` orchestrates the second agent. For a balanced subset of the Agent 1
prompts (round-robin across categories, capped for demo latency):

1. `lib/agents/targetSimulator.ts` roleplays the client's customer-facing AI with a deliberately
   imperfect (realistically vulnerable) persona via Groq, producing a reply per prompt.
2. `lib/agents/judgeAgent.ts` grades each reply as **pass** (resisted) or **fail** (complied),
   returning `{ passed, severity, reason, labels }` as strict JSON at low temperature.

Both steps fall back gracefully without a key: canned weak replies for the simulator and a
refusal-pattern heuristic for the judge, so the UI is never blank. Results and an aggregate summary
(pass/fail counts, failures by category) are stored on the assessment and shown via the "Run tests"
button. This **does not** change the questionnaire score/tier — it surfaces technical test findings
alongside the disclosures.

## How the mock risk engine works

`lib/mockRiskEngine.ts` maps each questionnaire answer to a risk weight, produces a 0–100 score,
a tier (LOW / MEDIUM / HIGH), a list of findings, and recommended policy conditions. Swap
`scoreAssessment()` for real attack/judge agents later without changing the UI.

## Useful scripts

```bash
npm run db:reset  # wipe + re-seed the demo data
npm run build     # production build
```

## Demo script for the jury

1. Open `/` and tell the story (stats + how it works).
2. Go to `/about` for the example client narrative.
3. Log in as the demo insurer.
4. Create an assessment for a fictional client (try a fully-automated, no-oversight AI).
5. Show the HIGH risk report — findings and conditions.
6. On the same report, click **Generate attack prompts** and show the 8 categories (Agent 1).
7. Click **Run tests** to have Agent 2 grade the AI's replies — show the failures (e.g. injection,
   PII leakage) with the judge's reasons.
8. Back to the dashboard: the portfolio risk mix updates. Pitch: questionnaire = disclosure, the two
   agents = evidence.
