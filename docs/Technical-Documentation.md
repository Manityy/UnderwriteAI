# UnderwriteAI — Technical Documentation

**Version:** 0.1.0 (Demo build)  
**Team:** Pivot — Alaa, Imen, Aziz  
**Document date:** 18 July 2026  
**Stack:** Next.js 16 · React 19 · TypeScript · Prisma · SQLite · Groq

> Underwriting intelligence for AI risk. A B2B platform that helps insurers measure and price the risk of their clients’ AI systems — without needing the model’s source code.

---

## Table of contents

1. [Purpose and scope](#1-purpose-and-scope)
2. [System overview](#2-system-overview)
3. [Technology stack](#3-technology-stack)
4. [Repository structure](#4-repository-structure)
5. [Architecture](#5-architecture)
6. [Authentication and security](#6-authentication-and-security)
7. [Data model](#7-data-model)
8. [Application routes](#8-application-routes)
9. [REST API reference](#9-rest-api-reference)
10. [Mock risk engine](#10-mock-risk-engine)
11. [Policy conditions and underwriting decisions](#11-policy-conditions-and-underwriting-decisions)
12. [Agent 1 — Attack agent](#12-agent-1--attack-agent)
13. [Agent 2 — Judge agent](#13-agent-2--judge-agent)
14. [Internationalization](#14-internationalization)
15. [Environment and configuration](#15-environment-and-configuration)
16. [Local development](#16-local-development)
17. [Deployment notes](#17-deployment-notes)
18. [Limitations and roadmap](#18-limitations-and-roadmap)
19. [File index](#19-file-index)

---

## 1. Purpose and scope

UnderwriteAI is a **demo** underwriting platform for insurers who need to assess AI-system risk disclosed by corporate clients.

| Capability | Implementation status |
|------------|----------------------|
| Questionnaire-based risk scoring | Deterministic mock rules (`lib/mockRiskEngine.ts`) |
| Adversarial prompt generation (Agent 1) | Live Groq LLM calls, with seed-bank fallback |
| Reply grading / vulnerability evidence (Agent 2) | Live Groq LLM calls, with heuristic fallback |
| Live client endpoint testing | Not implemented (planned next step) |

**In-scope for this document:** architecture, APIs, data model, scoring algorithm, agent pipelines, local setup, and known demo limitations.

**Out of scope:** production hardening checklist, legal/compliance advice, and binding insurance products. Underwriting decisions in the UI are **decision-support only** and do not bind coverage.

---

## 2. System overview

The product follows a two-layer evidence model:

1. **Disclosure** — The insurer collects structured answers about the client’s AI system (exposure, controls, testing, history).
2. **Technical evidence** — Two agents generate adversarial prompts and grade simulated (or future live) model replies.

Questionnaire score and tier are independent of agent test results. Agent failures can be merged into displayed score drivers for the report UI, but they do not rewrite the core score.

### Primary user flow

1. Insurer signs in with a demo account.
2. Creates a multi-step assessment for a client.
3. System scores answers → risk score, tier, findings, recommended conditions.
4. Optionally runs Agent 1 (attack prompts) and Agent 2 (tests + judge).
5. Records an underwriting decision and selected policy conditions.
6. Dashboard reflects portfolio risk mix.

### Demo credentials

| Field | Value |
|-------|-------|
| Email | `insurer@demo.com` |
| Password | `demo123` |

Seeded sample assessments include high-risk (DECLINE), medium (ACCEPT_WITH_CONDITIONS), and low (ACCEPT) clients.

---

## 3. Technology stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js 16.2.10 (App Router) | See `AGENTS.md` — APIs may differ from older Next.js docs |
| UI | React 19.2.4 + TypeScript 5 | Locale layouts under `app/[locale]` |
| Styling | Tailwind CSS v4 | `@tailwindcss/postcss` |
| Database | Prisma 6 + SQLite | `file:./dev.db` in `prisma/schema.prisma` |
| Auth | jose (JWT cookie) + bcryptjs | Cookie name `ua_session` |
| LLM | groq-sdk | Model: `openai/gpt-oss-120b` |
| i18n | next-intl | Locales: `en`, `fr`, `ar` (RTL for Arabic) |

---

## 4. Repository structure

```
UnderwriteAI/
├── app/
│   ├── layout.tsx                 # Root passthrough (locale owns <html>)
│   ├── globals.css
│   ├── api/                       # REST routes (no locale prefix)
│   │   ├── auth/login|logout/
│   │   ├── contact/
│   │   └── assessments/…
│   └── [locale]/                  # next-intl pages
│       ├── (marketing)/           # /, /about, /contact
│       ├── (auth)/login/
│       └── (app)/                 # dashboard, assessments (gated)
├── components/                    # UI components
├── lib/
│   ├── auth.ts, prisma.ts
│   ├── mockRiskEngine.ts          # Questionnaire scoring
│   ├── conditionsLibrary.ts
│   ├── underwritingDecision.ts
│   ├── localizeRisk.ts
│   └── agents/                    # Attack, judge, simulator, runner
├── i18n/                          # Routing & request config
├── messages/                      # en.json, fr.json, ar.json
├── prisma/                        # schema, seed, local DB
├── scripts/                       # Message build / extract helpers
├── docs/                          # Documentation (this file)
├── public/brand/
├── proxy.ts                       # next-intl middleware (Next 16)
├── next.config.ts
└── package.json
```

---

## 5. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (en | fr | ar)                                      │
│  Marketing · Login · Dashboard · Assessment form · Report    │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
                ▼                             ▼
        /api/auth/*                    /api/assessments/*
        /api/contact                   …/attack-prompts
                                       …/run-tests
                │                             │
                ▼                             ▼
        ┌───────────────┐     ┌──────────────────────────────┐
        │ jose session  │     │ mockRiskEngine               │
        │ Prisma User   │     │ conditionsLibrary            │
        └───────┬───────┘     │ underwritingDecision         │
                │             │ agents (Groq + fallbacks)    │
                ▼             └──────────────┬───────────────┘
        ┌───────────────────────────────────▼───────────────┐
        │              SQLite (Prisma)                        │
        │  User · Assessment · ContactMessage                 │
        └─────────────────────────────────────────────────────┘
                              │
                              ▼ (optional)
                         Groq API
```

### Request routing

- Locale-prefixed pages: `/{locale}/…` (always prefixed; default `en`).
- Middleware: `proxy.ts` (next-intl). Matcher excludes `api`, `_next`, and static assets.
- App shell (`app/[locale]/(app)/layout.tsx`) redirects unauthenticated users to login.
- Assessment ownership is enforced by comparing `session.userId` to the row’s `userId`.

### Assessment lifecycle

| Status | Meaning |
|--------|---------|
| `DRAFT` | Answers saved; not yet scored |
| `SCORED` | `scoreAssessment()` applied; score, tier, findings, conditions, drivers persisted |

Optional fields after scoring: `attackPrompts`, `testResults` / `testSummary`, `decision` / `decisionNote`.

---

## 6. Authentication and security

| Concern | Behavior |
|---------|----------|
| Mechanism | Email + password → bcrypt verify → HS256 JWT in HTTP-only cookie |
| Cookie | `ua_session`, 7-day expiry |
| Secret | `AUTH_SECRET` (demo default exists in code; change for any shared deploy) |
| Secure flag | `secure: true` when `NODE_ENV === production` |
| API auth | Assessment routes require a valid session |
| Secrets | Never commit `GROQ_API_KEY`; rotate if leaked |

Relevant files: `lib/auth.ts`, `app/api/auth/login/route.ts`, `app/api/auth/logout/route.ts`.

---

## 7. Data model

Defined in `prisma/schema.prisma`.

### User

| Field | Type | Notes |
|-------|------|-------|
| `id` | String (cuid) | Primary key |
| `email` | String | Unique |
| `name` | String | Display name |
| `passwordHash` | String | bcrypt |
| `role` | String | Default `INSURER` |
| `createdAt` | DateTime | |
| `assessments` | Assessment[] | One-to-many |

### Assessment

| Field | Type | Notes |
|-------|------|-------|
| `clientName`, `industry`, `useCase` | String | Client metadata |
| `status` | String | `DRAFT` \| `SCORED` |
| `answers` | String | JSON questionnaire answers |
| `score` | Int | 0–100 |
| `tier` | String | `LOW` \| `MEDIUM` \| `HIGH` \| `PENDING` |
| `premiumFactor` | Float | Indicative multiplier (e.g. 1.45) |
| `findings` | String | JSON `Finding[]` |
| `conditions` | String | JSON condition IDs (or legacy strings) |
| `scoreDrivers` | String | JSON drivers explaining score |
| `decision` | String | UW decision enum or empty |
| `decisionNote`, `decisionAt` | String / DateTime | Decision support |
| `attackPrompts`, `attackGeneratedAt` | JSON / DateTime | Agent 1 |
| `testResults`, `testSummary`, `testRanAt` | JSON / DateTime | Agent 2 |
| `userId` | String | Owner FK |

### ContactMessage

Stores marketing contact form submissions: `name`, `email`, `message`, `createdAt`.

---

## 8. Application routes

Locale prefix is required (`/en`, `/fr`, `/ar`).

| Area | Path | Description |
|------|------|-------------|
| Landing | `/{locale}` | Hero, stats, how-it-works |
| About | `/{locale}/about` | Client narrative |
| Contact | `/{locale}/contact` | Contact form → API |
| Login | `/{locale}/login` | Demo insurer login |
| Dashboard | `/{locale}/dashboard` | Portfolio risk mix |
| Assessments | `/{locale}/assessments` | Full list |
| New | `/{locale}/assessments/new` | Multi-step questionnaire |
| Report | `/{locale}/assessments/[id]` | Score, findings, agents, decision |
| Edit | `/{locale}/assessments/[id]/edit` | Re-score or save draft |

---

## 9. REST API reference

Base path: `/api` (no locale prefix).

| Method | Path | Auth | Behavior |
|--------|------|------|----------|
| `POST` | `/api/auth/login` | No | Email/password → sets session cookie |
| `POST` | `/api/auth/logout` | No | Clears session cookie |
| `POST` | `/api/contact` | No | Creates `ContactMessage` |
| `GET` | `/api/assessments` | Yes | List current user’s assessments |
| `POST` | `/api/assessments` | Yes | Create draft or scored assessment (`mode: draft \| score`) |
| `GET` | `/api/assessments/[id]` | Yes | Fetch owned assessment |
| `PATCH` | `/api/assessments/[id]` | Yes | Modes: `draft`, `score`, `conditions`, `decision` |
| `GET` | `/api/assessments/[id]/attack-prompts` | Yes | Read stored Agent 1 prompts |
| `POST` | `/api/assessments/[id]/attack-prompts` | Yes | Generate Agent 1 prompts (`maxDuration` 60s) |
| `GET` | `/api/assessments/[id]/run-tests` | Yes | Read Agent 2 results |
| `POST` | `/api/assessments/[id]/run-tests` | Yes | Run Agent 2 (requires prompts; `maxDuration` 60s) |

Unauthorized or cross-user access returns an error; ownership is checked on every assessment mutation/read.

---

## 10. Mock risk engine

**File:** `lib/mockRiskEngine.ts`

### Questionnaire

- **25 questions** across **5 steps**:
  1. System & exposure  
  2. Exposure & data  
  3. Controls  
  4. Testing & compliance  
  5. History & attestation  

Each option carries a `risk` value (0–100) and each question a `weight`.

### Scoring

| Output | Formula / rule |
|--------|----------------|
| Score | Weighted average of selected option risks; unanswered options treated as risk **60** |
| Tier | `≥66` → HIGH; `≥36` → MEDIUM; else LOW |
| Premium factor | `1 + (score/100) × 1.5` → range **1.00×–2.50×** (indicative only) |
| Findings | Rule-based from answer combinations (`buildFindings`) |
| Conditions | Catalog IDs from control gaps (`buildConditions` / `recommendConditionIds`) |
| Score drivers | Top answers by `risk × weight` (floor risk 40), max 3 |

### Display merge with tests

`mergeTestSignalDrivers()` can fold Agent 2 category failures into the **displayed** drivers on the report. Core questionnaire score/tier remain unchanged.

Entry point for UI/API: `scoreAssessment()`.

---

## 11. Policy conditions and underwriting decisions

### Conditions library (`lib/conditionsLibrary.ts`)

Stable condition IDs include:

| ID | Intent (summary) |
|----|------------------|
| `remediate_high` | Remediate high-severity issues |
| `attestation` | Formal attestation |
| `hitl` | Human-in-the-loop |
| `no_autonomous` | Restrict autonomous actions |
| `logging` | Logging / audit requirements |
| `pii_filters` | PII filtering |
| `red_team` | Red-team testing |
| `retest_90_days` | Retest within 90 days |
| `retest_on_change` | Retest on material change |
| `sandbox_access` | Sandbox access for insurer |
| `governance_docs` | Governance documentation |
| `incident_evidence` | Incident evidence |
| `maintain_controls` | Maintain declared controls |

### Decisions (`lib/underwritingDecision.ts`)

| Value | Meaning |
|-------|---------|
| `ACCEPT` | Accept as disclosed |
| `ACCEPT_WITH_CONDITIONS` | Accept subject to selected conditions |
| `REFER` | Refer for further review |
| `DECLINE` | Decline |

These values support the report UI only; they do not create a legal policy.

---

## 12. Agent 1 — Attack agent

**Files:** `lib/agents/attackAgent.ts`, `lib/agents/attackSeedBank.ts`, `lib/agents/types.ts`

### Categories (8)

1. Prompt injection  
2. Jailbreak  
3. Hallucination  
4. PII leakage  
5. Unsafe advice  
6. Unauthorized action  
7. Bias  
8. System data exfiltration  

### Behavior

- Default **5 prompts per category** (configurable up to 10).
- One Groq JSON batch call per category using model `openai/gpt-oss-120b`.
- On missing API key or batch failure → **seed bank** prompts.
- Results stored on the assessment (`attackPrompts`, `attackGeneratedAt`) and shown on the report via **Generate attack prompts**.

---

## 13. Agent 2 — Judge agent

**Files:** `lib/agents/testRunner.ts`, `lib/agents/targetSimulator.ts`, `lib/agents/judgeAgent.ts`

### Pipeline

1. Select up to **16** prompts (max 32) round-robin across categories.  
2. Run with concurrency **3**.  
3. **Target simulator** roleplays an imperfect customer-facing AI via Groq (or canned weak replies without a key).  
4. **Judge** returns `{ passed, severity, reason, labels }` as strict JSON at low temperature (or refusal-pattern heuristic without a key).  
5. Persist `TestResult[]` and `TestRunSummary` on the assessment.

### Important product rule

Agent 2 results **do not** change questionnaire score or tier. They surface technical evidence alongside disclosures. Pitch framing: questionnaire = disclosure; agents = evidence.

---

## 14. Internationalization

| Item | Detail |
|------|--------|
| Library | next-intl |
| Locales | `en` (default), `fr`, `ar` |
| Arabic | RTL layout |
| Messages | `messages/en.json`, `fr.json`, `ar.json` |
| Routing | Always prefixed (`i18n/routing.ts`) |
| Middleware | `proxy.ts` |

Risk copy can be localized via helpers in `lib/localizeRisk.ts`.

---

## 15. Environment and configuration

From `.env.example` (copy to `.env.local`):

| Variable | Required | Purpose |
|----------|----------|---------|
| `GROQ_API_KEY` | Optional | Live Agent 1/2 LLM calls; without it, seed/heuristic fallbacks apply |
| `AUTH_SECRET` | Recommended | Signs the session JWT |

Database URL is **hardcoded** in Prisma schema as `file:./dev.db` (local demo). Production would require a remote database URL and schema change.

Implicit: `NODE_ENV` affects secure cookies and Prisma logging.

---

## 16. Local development

### Prerequisites

- Node.js 20+ (project verified with modern Node; example: v24)
- npm

### Setup

```bash
npm install
cp .env.example .env.local   # set GROQ_API_KEY and AUTH_SECRET
npm run db:push              # create SQLite schema
npm run db:seed              # demo user + sample assessments
npm run dev                  # http://localhost:3000 → /en/...
```

### npm scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Development server |
| `build` | `next build` | Production build |
| `start` | `next start` | Serve production build |
| `db:push` | `prisma db push` | Sync schema to SQLite |
| `db:seed` | `tsx prisma/seed.ts` | Seed demo data |
| `db:reset` | force-reset + seed | Wipe DB and re-seed |

### Suggested jury demo script

1. Open landing (`/`) — story, stats, how-it-works.  
2. About page — example client narrative.  
3. Log in as demo insurer.  
4. Create assessment for a high-automation, low-oversight AI.  
5. Show HIGH risk report (findings + conditions).  
6. **Generate attack prompts** (Agent 1) — 8 categories.  
7. **Run tests** (Agent 2) — failures with judge reasons.  
8. Dashboard — portfolio mix updates; pitch disclosure vs evidence.

---

## 17. Deployment notes

- Suitable for Node hosting that supports Next.js (`npm run build` / `npm start`).
- SQLite file DB is **demo-oriented**; use a hosted database for shared/production environments.
- Set strong `AUTH_SECRET` and a private `GROQ_API_KEY`.
- Agent routes set `maxDuration = 60` — relevant for serverless platforms with time limits.
- Cookie `secure` requires HTTPS in production.
- No committed `vercel.json`; `.vercel` is gitignored.

---

## 18. Limitations and roadmap

| Topic | Current state | Typical next step |
|-------|---------------|-------------------|
| Risk engine | Deterministic mock over questionnaire | Calibrate with actuarial / SME input |
| Target under test | Built-in vulnerable simulator | Call client’s live AI endpoint |
| Database | Local SQLite file | Managed Postgres (or similar) + migrations |
| Auth | Single demo insurer role | Multi-tenant orgs, RBAC, SSO |
| Agents | Groq with fallbacks | Rate limits, audit logs, prompt versioning |
| Decisions | UI decision-support | Workflow integration with insurer systems |

---

## 19. File index

| Topic | Path |
|-------|------|
| Product overview | `README.md` |
| Dependencies / scripts | `package.json` |
| Env template | `.env.example` |
| Prisma schema | `prisma/schema.prisma` |
| Seed / demo login | `prisma/seed.ts` |
| Auth helpers | `lib/auth.ts` |
| Risk engine | `lib/mockRiskEngine.ts` |
| Conditions | `lib/conditionsLibrary.ts` |
| UW decisions | `lib/underwritingDecision.ts` |
| Agents | `lib/agents/` |
| API routes | `app/api/**` |
| Pages | `app/[locale]/**` |
| i18n | `i18n/`, `messages/`, `proxy.ts` |
| Agent coding notes | `AGENTS.md` |

---

*End of Technical Documentation — UnderwriteAI v0.1.0 · Team Pivot*
