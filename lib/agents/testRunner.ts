import { judgeResponse } from "./judgeAgent";
import { simulateReply, type TargetContext } from "./targetSimulator";
import {
  ATTACK_CATEGORIES,
  type AttackCategory,
  type AttackPrompt,
  type TestResult,
  type TestRunSummary,
} from "./types";

const DEFAULT_LIMIT = 16;
const MAX_LIMIT = 32;
const CONCURRENCY = 3;

export type TestRunInput = {
  context: TargetContext;
  prompts: AttackPrompt[];
  limit?: number;
};

export type TestRunResult = {
  results: TestResult[];
  summary: TestRunSummary;
};

function clampLimit(limit?: number): number {
  if (!limit || Number.isNaN(limit)) return DEFAULT_LIMIT;
  return Math.max(1, Math.min(MAX_LIMIT, Math.floor(limit)));
}

// Pick a balanced subset: round-robin across categories so every category is
// represented before we take a second prompt from any of them.
function selectPrompts(prompts: AttackPrompt[], limit: number): AttackPrompt[] {
  const byCategory = new Map<AttackCategory, AttackPrompt[]>();
  for (const cat of ATTACK_CATEGORIES) byCategory.set(cat, []);
  for (const p of prompts) byCategory.get(p.category)?.push(p);

  const selected: AttackPrompt[] = [];
  let added = true;
  while (selected.length < limit && added) {
    added = false;
    for (const cat of ATTACK_CATEGORIES) {
      const bucket = byCategory.get(cat);
      if (bucket && bucket.length > 0) {
        selected.push(bucket.shift()!);
        added = true;
        if (selected.length >= limit) break;
      }
    }
  }
  return selected;
}

// Simple concurrency-limited map to respect Groq rate limits.
async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index], index);
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

function buildSummary(results: TestResult[], usedLlm: boolean): TestRunSummary {
  const failuresByCategory = {} as Record<AttackCategory, number>;
  const totalByCategory = {} as Record<AttackCategory, number>;
  for (const cat of ATTACK_CATEGORIES) {
    failuresByCategory[cat] = 0;
    totalByCategory[cat] = 0;
  }

  let passed = 0;
  for (const r of results) {
    totalByCategory[r.category] += 1;
    if (r.passed) passed += 1;
    else failuresByCategory[r.category] += 1;
  }

  return {
    total: results.length,
    passed,
    failed: results.length - passed,
    failuresByCategory,
    totalByCategory,
    usedLlm,
    ranAt: new Date().toISOString(),
  };
}

/**
 * Judge Agent 2 runner: for a subset of attack prompts, simulate the client AI
 * reply, then grade each reply. Returns per-prompt results + an aggregate summary.
 */
export async function runTests(input: TestRunInput): Promise<TestRunResult> {
  const limit = clampLimit(input.limit);
  const selected = selectPrompts(input.prompts, limit);

  const results = await mapWithConcurrency(selected, CONCURRENCY, async (attack) => {
    const reply = await simulateReply(input.context, attack);
    const verdict = await judgeResponse(attack, reply.response, input.context.useCase);
    return { verdict, usedLlm: reply.usedLlm || verdict.judgedByLlm };
  });

  const testResults = results.map((r) => r.verdict);
  const usedLlm = results.some((r) => r.usedLlm);

  return {
    results: testResults,
    summary: buildSummary(testResults, usedLlm),
  };
}
