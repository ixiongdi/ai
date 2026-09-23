import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export interface Source {
  id: string;
  title: string;
  url: string;
  type: string;
  checkedAt?: string;
}

export interface Model {
  id: string;
  released: string;
  aaIndex: number | null;
  aaTaskUsd: number | null;
  apiInputUsdPerM: number;
  apiOutputUsdPerM: number;
  benchmarkNote?: string;
  releaseSourceIds?: string[];
  apiSourceIds?: string[];
  benchmarkSourceIds?: string[];
}

export interface PlanUsage {
  kind: string;
  credits?: number;
  creditWindowDays?: number;
  modelCreditsPerMillionTokens?: Record<string, { input: number; output: number }>;
  modelBudgetUsdById?: Record<string, number>;
  label?: string;
  scope?: string;
}

export interface Plan {
  id: string;
  vendor?: string;
  currency: string;
  monthlyPrice: number;
  annualMonthlyPrice?: number;
  monthlyPriceUsd?: number;
  annualMonthlyPriceUsd?: number;
  sourceIds?: string[];
  modelIds?: string[];
  usage?: PlanUsage;
  reason?: string;
}

interface Offer {
  id: string;
  planId: string;
  modelId: string;
  metrics?: {
    scenario: { inputTokens: number; outputTokens: number };
    apiPromptCostUsd: number;
    apiEquivalentPrompts: number | null;
    aaIpd: number | null;
    estimatedTasksPerMonth: number | null;
    subscriptionIpd: number | null;
  };
}

export interface Catalog {
  meta: {
    asOf: string;
    windowStart: string;
    modelCount?: number;
    defaultScenario?: { inputTokens: number; outputTokens: number };
    usdToCny: { rate: number };
    planCount?: number;
    offerCount?: number;
    priceBandsUsd: Array<{ id: string; label: string; min: number; max: number | null }>;
    modelAudit?: Array<{
      id: string;
      name: string;
      released?: string;
      outcome: "included" | "excluded";
      reason?: string;
      sourceIds: string[];
    }>;
  };
  sources: Source[];
  models: Model[];
  plans: Plan[];
  unpairedPlans: Plan[];
  offers?: Offer[];
  copilotRates: Record<string, { inputUsdPerM: number; outputUsdPerM: number }>;
}

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const catalogPath = resolve(root, "data/catalog.json");
export const outputPath = resolve(root, "web/data/data.json");

function parseDate(value: string, label: string): number {
  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value) {
    throw new Error(`${label} must be an ISO calendar date: ${value}`);
  }
  return timestamp;
}

export function getThreeMonthWindowStart(asOf: string): string {
  const timestamp = parseDate(asOf, "meta.asOf");
  const date = new Date(timestamp);
  const originalDay = date.getUTCDate();
  const targetMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - 3, 1));
  const lastTargetDay = new Date(
    Date.UTC(targetMonth.getUTCFullYear(), targetMonth.getUTCMonth() + 1, 0),
  ).getUTCDate();
  targetMonth.setUTCDate(Math.min(originalDay, lastTargetDay));
  return targetMonth.toISOString().slice(0, 10);
}

export function validateCatalog(catalog: Catalog): void {
  const windowStart = parseDate(catalog.meta.windowStart, "meta.windowStart");
  const asOf = parseDate(catalog.meta.asOf, "meta.asOf");
  if (windowStart > asOf) throw new Error("meta.windowStart must not be after meta.asOf");
  const expectedWindowStart = getThreeMonthWindowStart(catalog.meta.asOf);
  if (catalog.meta.windowStart !== expectedWindowStart) {
    throw new Error(
      `meta.windowStart must be exactly three months before meta.asOf (${expectedWindowStart})`,
    );
  }
  if (!Array.isArray(catalog.meta.priceBandsUsd) || catalog.meta.priceBandsUsd.length === 0) {
    throw new Error("meta.priceBandsUsd must contain at least one USD price band");
  }
  if (catalog.meta.usdToCny.rate <= 0) throw new Error("USD/CNY rate must be positive");

  const sourceIds = new Set<string>();
  for (const source of catalog.sources) {
    if (sourceIds.has(source.id)) throw new Error(`Duplicate source id: ${source.id}`);
    sourceIds.add(source.id);
    if (!URL.canParse(source.url) || !source.url.startsWith("https://")) {
      throw new Error(`Source must use an HTTPS URL: ${source.id}`);
    }
    if (source.checkedAt) parseDate(source.checkedAt, `source ${source.id} checkedAt`);
  }

  const modelIds = new Set<string>();
  for (const model of catalog.models) {
    if (modelIds.has(model.id)) throw new Error(`Duplicate model id: ${model.id}`);
    modelIds.add(model.id);
    const released = parseDate(model.released, `model ${model.id} released`);
    if (released < windowStart || released > asOf) {
      throw new Error(`${model.id} is outside the three-month publication window`);
    }
    for (const key of ["apiInputUsdPerM", "apiOutputUsdPerM"] as const) {
      if (!Number.isFinite(model[key]) || model[key] <= 0) {
        throw new Error(`${model.id} must have a positive ${key}`);
      }
    }
    const hasBenchmark = model.aaIndex !== null && model.aaTaskUsd !== null;
    if (
      hasBenchmark &&
      (!Number.isFinite(model.aaIndex) ||
        (model.aaIndex ?? 0) <= 0 ||
        !Number.isFinite(model.aaTaskUsd) ||
        (model.aaTaskUsd ?? 0) <= 0)
    ) {
      throw new Error(`${model.id} must have positive benchmark values or null values for both`);
    }
    if (
      !hasBenchmark &&
      (!model.benchmarkNote || model.aaIndex !== null || model.aaTaskUsd !== null)
    ) {
      throw new Error(`${model.id} needs a benchmarkNote when AA values are unavailable`);
    }
    for (const sourceId of [
      ...(model.releaseSourceIds ?? []),
      ...(model.apiSourceIds ?? []),
      ...(model.benchmarkSourceIds ?? []),
    ]) {
      if (!sourceIds.has(sourceId)) throw new Error(`Unknown source ${sourceId} in ${model.id}`);
    }
  }

  for (const candidate of catalog.meta.modelAudit ?? []) {
    if (candidate.sourceIds.length === 0) {
      throw new Error(`Model candidate ${candidate.id} needs source citations`);
    }
    if (candidate.released) parseDate(candidate.released, `modelAudit ${candidate.id} released`);
    if (candidate.outcome === "excluded" && !candidate.reason) {
      throw new Error(`Excluded model candidate ${candidate.id} needs a reason`);
    }
    for (const sourceId of candidate.sourceIds) {
      if (!sourceIds.has(sourceId)) {
        throw new Error(`Unknown source ${sourceId} in modelAudit ${candidate.id}`);
      }
    }
    if (candidate.outcome === "included" && !modelIds.has(candidate.id)) {
      throw new Error(`Included model candidate ${candidate.id} is missing from models`);
    }
  }

  const planIds = new Set<string>();
  for (const plan of [...catalog.plans, ...catalog.unpairedPlans]) {
    if (planIds.has(plan.id)) throw new Error(`Duplicate plan id: ${plan.id}`);
    planIds.add(plan.id);
    if (!Number.isFinite(plan.monthlyPrice) || plan.monthlyPrice <= 0) {
      throw new Error(`Only paid subscription plans are allowed: ${plan.id}`);
    }
    if (plan.currency !== "USD" && plan.currency !== "CNY") {
      throw new Error(`Unsupported price currency in ${plan.id}: ${plan.currency}`);
    }
    for (const sourceId of plan.sourceIds ?? []) {
      if (!sourceIds.has(sourceId)) throw new Error(`Unknown source ${sourceId} in ${plan.id}`);
    }
    for (const modelId of plan.modelIds ?? []) {
      if (!modelIds.has(modelId)) throw new Error(`Unknown model ${modelId} in ${plan.id}`);
    }
    if (plan.usage?.kind === "perModelUsdBudget") {
      for (const modelId of plan.modelIds ?? []) {
        const budget = plan.usage.modelBudgetUsdById?.[modelId];
        if (!Number.isFinite(budget) || (budget ?? 0) <= 0) {
          throw new Error(`${plan.id} is missing a positive monthly USD budget for ${modelId}`);
        }
      }
    }
    if (plan.usage?.kind === "modelCredits") {
      if (
        plan.usage.creditWindowDays !== undefined &&
        (!Number.isFinite(plan.usage.creditWindowDays) || plan.usage.creditWindowDays <= 0)
      ) {
        throw new Error(`${plan.id} must have a positive credit reset interval`);
      }
      for (const modelId of plan.modelIds ?? []) {
        const rates = plan.usage.modelCreditsPerMillionTokens?.[modelId];
        if (
          !Number.isFinite(rates?.input) ||
          (rates?.input ?? 0) <= 0 ||
          !Number.isFinite(rates?.output) ||
          (rates?.output ?? 0) <= 0
        ) {
          throw new Error(`${plan.id} is missing positive token-credit rates for ${modelId}`);
        }
      }
      if (!Number.isFinite(plan.usage.credits) || (plan.usage.credits ?? 0) <= 0) {
        throw new Error(`${plan.id} must have a positive credit quota`);
      }
    }
    if (catalog.plans.includes(plan) && (!plan.modelIds || plan.modelIds.length === 0)) {
      throw new Error(`Comparable plans need a named model: ${plan.id}`);
    }
    if (catalog.unpairedPlans.includes(plan) && !plan.reason) {
      throw new Error(`Unpaired plans need an exclusion reason: ${plan.id}`);
    }
  }

  const comparedModelIds = new Set(catalog.plans.flatMap((plan) => plan.modelIds ?? []));
  for (const model of catalog.models) {
    if (!comparedModelIds.has(model.id)) {
      throw new Error(`${model.id} is not compared by any paid subscription plan`);
    }
  }
}

export function addComputedPrices(catalog: Catalog): Catalog {
  const rate = catalog.meta.usdToCny.rate;
  for (const plan of [...catalog.plans, ...catalog.unpairedPlans]) {
    const divisor = plan.currency === "CNY" ? rate : 1;
    plan.monthlyPriceUsd = Math.round((plan.monthlyPrice / divisor) * 100) / 100;
    if (plan.annualMonthlyPrice !== undefined) {
      plan.annualMonthlyPriceUsd = Math.round((plan.annualMonthlyPrice / divisor) * 100) / 100;
    }
  }

  const scenario = catalog.meta.defaultScenario ?? { inputTokens: 10_000, outputTokens: 2_000 };
  const modelsById = new Map(catalog.models.map((model) => [model.id, model]));
  catalog.offers = catalog.plans.flatMap((plan) =>
    (plan.modelIds ?? []).map((modelId) => {
      const model = modelsById.get(modelId);
      if (!model) throw new Error(`Unknown model ${modelId} in ${plan.id}`);
      const apiPromptCostUsd =
        (scenario.inputTokens * model.apiInputUsdPerM +
          scenario.outputTokens * model.apiOutputUsdPerM) /
        1_000_000;
      const monthlyPriceUsd = plan.monthlyPriceUsd ?? plan.monthlyPrice;
      const copilotRates = plan.vendor === "GitHub" ? catalog.copilotRates[modelId] : undefined;
      const billedInputRate = copilotRates?.inputUsdPerM ?? model.apiInputUsdPerM;
      const billedOutputRate = copilotRates?.outputUsdPerM ?? model.apiOutputUsdPerM;
      const billedPromptCostUsd =
        (scenario.inputTokens * billedInputRate + scenario.outputTokens * billedOutputRate) /
        1_000_000;
      const aaIpd =
        model.aaIndex !== null && model.aaTaskUsd !== null ? model.aaIndex / model.aaTaskUsd : null;
      const modelCreditRates = plan.usage?.modelCreditsPerMillionTokens?.[modelId];
      const modelCreditCost = modelCreditRates
        ? (scenario.inputTokens * modelCreditRates.input +
            scenario.outputTokens * modelCreditRates.output) /
          1_000_000
        : null;
      const modelBudgetUsd = plan.usage?.modelBudgetUsdById?.[modelId];
      let estimatedTasksPerMonth: number | null = null;
      if (billedPromptCostUsd > 0 && plan.usage?.kind === "usdCredits") {
        estimatedTasksPerMonth = ((plan.usage.credits ?? 0) * 0.01) / billedPromptCostUsd;
      } else if (
        billedPromptCostUsd > 0 &&
        plan.usage?.kind === "perModelUsdBudget" &&
        modelBudgetUsd !== undefined
      ) {
        estimatedTasksPerMonth = modelBudgetUsd / billedPromptCostUsd;
      } else if (
        plan.usage?.kind === "modelCredits" &&
        plan.usage.credits !== undefined &&
        modelCreditCost !== null &&
        modelCreditCost > 0
      ) {
        estimatedTasksPerMonth =
          (plan.usage.credits * (30 / (plan.usage.creditWindowDays ?? 30))) / modelCreditCost;
      }
      const subscriptionIpd =
        estimatedTasksPerMonth === null || monthlyPriceUsd <= 0 || model.aaIndex === null
          ? null
          : (estimatedTasksPerMonth * model.aaIndex) / monthlyPriceUsd;
      return {
        id: `${plan.id}--${modelId}`,
        planId: plan.id,
        modelId,
        metrics: {
          scenario,
          apiPromptCostUsd,
          apiEquivalentPrompts: apiPromptCostUsd > 0 ? monthlyPriceUsd / apiPromptCostUsd : null,
          aaIpd,
          estimatedTasksPerMonth,
          subscriptionIpd,
        },
      };
    }),
  );
  catalog.meta.offerCount = catalog.offers.length;
  catalog.meta.modelCount = new Set(catalog.offers.map((offer) => offer.modelId)).size;
  catalog.meta.planCount = catalog.plans.length + catalog.unpairedPlans.length;
  return catalog;
}

export async function writeJsonAtomically(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.${process.pid}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporaryPath, path);
}

export async function main(): Promise<void> {
  const catalog = JSON.parse(await readFile(catalogPath, "utf8")) as Catalog;
  validateCatalog(catalog);
  const data = addComputedPrices(catalog);
  await writeJsonAtomically(outputPath, data);
  console.log(
    `Exported ${data.meta.offerCount} paid plan × model comparisons across ${data.meta.modelCount} recent models.`,
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
