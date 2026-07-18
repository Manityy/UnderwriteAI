# UnderwriteAI

Underwriting intelligence for AI risk. A mock B2B platform that helps insurers measure and price
the risk of their clients' AI systems — without needing the model's source code.

Built by **Team Pivot** (Elaa, Imen, Aziz) for the "Automate or die" hackathon.

> This is a demo build. The risk engine is a deterministic mock (rules over questionnaire answers).
> There are no real LLM/agent calls yet — the two-agent "attack + judge" testing is represented in
> the UI and findings, ready to be wired to real models later.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Prisma 6 + SQLite (local file)
- Auth via signed cookie (jose) + bcrypt

## Getting started

```bash
npm install
npm run db:push   # create the SQLite schema
npm run db:seed   # seed demo insurer + sample assessments
npm run dev       # http://localhost:3000
```

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
| Report | `/assessments/[id]` | Score gauge, findings, conditions |

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
6. Back to the dashboard: the portfolio risk mix updates.
