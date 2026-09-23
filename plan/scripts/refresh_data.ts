import { Codex } from "@openai/codex-sdk";
import { readFile } from "node:fs/promises";
import {
  addComputedPrices,
  catalogPath,
  outputPath,
  root,
  getThreeMonthWindowStart,
  validateCatalog,
  writeJsonAtomically,
  type Catalog,
  type Plan,
  type Source,
} from "./calculate_metrics.ts";

interface RefreshPatch {
  meta: { asOf: string; windowStart: string };
  sources: Source[];
  checkedSourceIds: string[];
  upsertPlans: Array<{ status: "paired" | "unpaired"; plan: Plan }>;
  removePlanIds: string[];
  auditedPlanIds: string[];
  upsertModels: Catalog["models"];
  removeModelIds: string[];
  auditedModelIds: string[];
  modelAudit: NonNullable<Catalog["meta"]["modelAudit"]>;
}

function parseRefreshPatch(response: string): RefreshPatch {
  const trimmed = response.trim();
  const unfenced = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const firstBrace = unfenced.indexOf("{");
  const lastBrace = unfenced.lastIndexOf("}");
  if (firstBrace < 0 || lastBrace <= firstBrace) {
    throw new Error("Codex SDK did not return a JSON catalog object.");
  }
  const patch = JSON.parse(unfenced.slice(firstBrace, lastBrace + 1)) as Partial<RefreshPatch>;
  for (const key of [
    "sources",
    "checkedSourceIds",
    "upsertPlans",
    "removePlanIds",
    "auditedPlanIds",
    "upsertModels",
    "removeModelIds",
    "auditedModelIds",
    "modelAudit",
  ] as const) {
    if (!Array.isArray(patch[key])) {
      throw new Error(`Codex refresh patch is missing the required ${key} array.`);
    }
  }
  if (!patch.meta?.asOf || !patch.meta.windowStart) {
    throw new Error("Codex refresh patch is missing meta.asOf or meta.windowStart.");
  }
  patch.modelAudit = (patch.modelAudit as RefreshPatch["modelAudit"]).map((candidate) => {
    if (!candidate.released || isExactIsoDate(candidate.released)) return candidate;
    const precisionNote = `官网仅提供不完整发布日期（${candidate.released}），未据此伪造具体日期`;
    return {
      ...candidate,
      released: undefined,
      reason: candidate.reason ? `${candidate.reason}；${precisionNote}` : precisionNote,
    };
  });
  return patch as RefreshPatch;
}

function isExactIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
}

function mergeRefreshPatch(existing: Catalog, patch: RefreshPatch): Catalog {
  const byId = new Map(existing.sources.map((source) => [source.id, source]));
  for (const source of patch.sources) byId.set(source.id, source);
  for (const sourceId of patch.checkedSourceIds) {
    const source = byId.get(sourceId);
    if (!source) throw new Error(`Codex checked an unknown source: ${sourceId}`);
    byId.set(sourceId, { ...source, checkedAt: patch.meta.asOf });
  }

  const planById = new Map<string, { status: "paired" | "unpaired"; plan: Plan }>();
  for (const plan of existing.plans) planById.set(plan.id, { status: "paired", plan });
  for (const plan of existing.unpairedPlans) planById.set(plan.id, { status: "unpaired", plan });
  for (const id of patch.removePlanIds) planById.delete(id);
  for (const entry of patch.upsertPlans) {
    const previous = planById.get(entry.plan.id);
    const plan = previous ? mergePlan(previous.plan, entry.plan) : entry.plan;
    planById.set(entry.plan.id, { ...entry, plan });
  }

  const modelById = new Map(existing.models.map((model) => [model.id, model]));
  for (const id of patch.removeModelIds) modelById.delete(id);
  for (const model of patch.upsertModels) modelById.set(model.id, model);

  const asOf = patch.meta.asOf;
  const windowStart = patch.meta.windowStart;
  const eligibleModels = [...modelById.values()].filter(
    (model) => model.released >= windowStart && model.released <= asOf,
  );
  const eligibleModelIds = new Set(eligibleModels.map((model) => model.id));
  const plans: Catalog["plans"] = [];
  const unpairedPlans: Catalog["unpairedPlans"] = [];
  for (const entry of planById.values()) {
    if (entry.status === "unpaired") {
      unpairedPlans.push(entry.plan as Catalog["unpairedPlans"][number]);
      continue;
    }
    const plan = {
      ...entry.plan,
      modelIds: (entry.plan.modelIds ?? []).filter((id) => eligibleModelIds.has(id)),
    };
    if (plan.modelIds.length > 0) {
      plans.push(plan as Catalog["plans"][number]);
    } else {
      unpairedPlans.push({
        ...entry.plan,
        modelIds: undefined,
        usageLabel: entry.plan.usage?.label ?? "付费计划；暂无符合本期窗口的已核实模型",
        reason: "该计划原配对的模型均已离开滚动三个月窗口。",
      } as unknown as Catalog["unpairedPlans"][number]);
    }
  }

  const catalog = {
    ...existing,
    meta: { ...existing.meta, asOf, windowStart, modelAudit: patch.modelAudit },
    sources: [...byId.values()],
    models: eligibleModels,
    plans,
    unpairedPlans,
  };
  return catalog;
}

function mergePlan(previous: Plan, incoming: Plan): Plan {
  const previousUsage = previous.usage;
  const incomingUsage = incoming.usage;
  if (!previousUsage || !incomingUsage) {
    return { ...previous, ...incoming, usage: incomingUsage ?? previousUsage };
  }

  const modelCreditsPerMillionTokens = {
    ...previousUsage.modelCreditsPerMillionTokens,
    ...incomingUsage.modelCreditsPerMillionTokens,
  };
  for (const [modelId, rates] of Object.entries(incomingUsage.modelCreditsPerMillionTokens ?? {})) {
    const previousRates = previousUsage.modelCreditsPerMillionTokens?.[modelId];
    modelCreditsPerMillionTokens[modelId] = {
      input: positiveOrPrevious(rates.input, previousRates?.input) ?? rates.input,
      output: positiveOrPrevious(rates.output, previousRates?.output) ?? rates.output,
    };
  }

  const modelBudgetUsdById = {
    ...previousUsage.modelBudgetUsdById,
    ...incomingUsage.modelBudgetUsdById,
  };
  for (const [modelId, budget] of Object.entries(incomingUsage.modelBudgetUsdById ?? {})) {
    modelBudgetUsdById[modelId] =
      positiveOrPrevious(budget, previousUsage.modelBudgetUsdById?.[modelId]) ?? budget;
  }

  return {
    ...previous,
    ...incoming,
    usage: {
      ...previousUsage,
      ...incomingUsage,
      credits: positiveOrPrevious(incomingUsage.credits, previousUsage.credits),
      creditWindowDays: positiveOrPrevious(
        incomingUsage.creditWindowDays,
        previousUsage.creditWindowDays,
      ),
      modelCreditsPerMillionTokens,
      modelBudgetUsdById,
    },
  };
}

function positiveOrPrevious(
  incoming: number | undefined,
  previous: number | undefined,
): number | undefined {
  if (Number.isFinite(incoming) && (incoming ?? 0) > 0) return incoming;
  if (Number.isFinite(previous) && (previous ?? 0) > 0) return previous;
  return incoming;
}

function validateRefreshEvidence(
  catalog: Catalog,
  patch: RefreshPatch,
  asOf: string,
  windowStart: string,
): void {
  if (patch.meta.asOf !== asOf || patch.meta.windowStart !== windowStart) {
    throw new Error("Codex patch must use the current date and matching three-month window.");
  }

  const checkedSourceIds = new Set(patch.checkedSourceIds);
  for (const plan of [...catalog.plans, ...catalog.unpairedPlans]) {
    if (!plan.sourceIds?.length) throw new Error(`Plan ${plan.id} has no source citations.`);
    for (const sourceId of plan.sourceIds) checkedSourceIds.add(sourceId);
  }
  for (const model of catalog.models) {
    const references = [
      ...(model.releaseSourceIds ?? []),
      ...(model.apiSourceIds ?? []),
      ...(model.benchmarkSourceIds ?? []),
    ];
    if (references.length === 0) throw new Error(`Model ${model.id} has no source citations.`);
    for (const sourceId of references) checkedSourceIds.add(sourceId);
  }
  for (const candidate of patch.modelAudit) {
    for (const sourceId of candidate.sourceIds) checkedSourceIds.add(sourceId);
  }

  const sourceById = new Map(catalog.sources.map((source) => [source.id, source]));
  for (const sourceId of checkedSourceIds) {
    if (sourceById.get(sourceId)?.checkedAt !== asOf) {
      throw new Error(`Source ${sourceId} was not marked as verified on ${asOf}.`);
    }
  }
  const activePlanIds = new Set(
    [...catalog.plans, ...catalog.unpairedPlans].map((plan) => plan.id),
  );
  const auditedPlanIds = new Set(patch.auditedPlanIds);
  const unauditedPlanIds = [...activePlanIds].filter((id) => !auditedPlanIds.has(id));
  if (unauditedPlanIds.length > 0) {
    throw new Error(
      `Codex did not audit these current plans: ${unauditedPlanIds.slice(0, 8).join(", ")}`,
    );
  }
  const currentModelIds = new Set(catalog.models.map((model) => model.id));
  const auditedModelIds = new Set(patch.auditedModelIds);
  const unauditedModelIds = [...currentModelIds].filter((id) => !auditedModelIds.has(id));
  if (unauditedModelIds.length > 0) {
    throw new Error(
      `Codex did not audit these current models: ${unauditedModelIds.slice(0, 8).join(", ")}`,
    );
  }
  if (patch.modelAudit.length < 5) {
    throw new Error("Codex must audit at least five included/excluded recent model candidates.");
  }
}

function normalizeModelAuditCoverage(
  catalog: Catalog,
  candidates: RefreshPatch["modelAudit"],
  windowStart: string,
  asOf: string,
): RefreshPatch["modelAudit"] {
  const modelIds = new Set(catalog.models.map((model) => model.id));
  return candidates.map((candidate) => {
    if (candidate.outcome !== "included" || modelIds.has(candidate.id)) return candidate;

    const reason =
      candidate.released && (candidate.released < windowStart || candidate.released > asOf)
        ? `发布日期 ${candidate.released} 不在本期窗口 ${windowStart} 至 ${asOf} 内，未纳入。`
        : "响应未提供完整模型/API 计价及套餐授权记录，无法形成可比条目，未纳入。";
    return {
      ...candidate,
      outcome: "excluded" as const,
      reason: candidate.reason ? `${candidate.reason}；${reason}` : reason,
    };
  });
}

async function main(): Promise<void> {
  const asOf = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const windowStart = getThreeMonthWindowStart(asOf);
  const existingCatalog = JSON.parse(await readFile(catalogPath, "utf8")) as Catalog;
  const prompt = `You are refreshing the paid AI subscription comparison catalog in this repository. Read ${catalogPath} as current context and return a compact JSON patch; do not modify any files.

Every run MUST do new live web research; the existing catalog is a starting point, not evidence that coverage is complete. Audit current paid tiers and plan/model matrices on official pages for OpenAI, Anthropic, Google/Gemini and Google Cloud, xAI, Meta, DeepSeek, QwenCloud/Alibaba Cloud, Z.AI, Xiaomi MiMo, Moonshot/Kimi, Mistral, Perplexity, AWS (Q Developer, Q Business, Kiro), Microsoft, GitHub Copilot, Cursor, OpenCode, Kilo, Qoder, Augment, Devin/Windsurf, Replit, JetBrains, Tabnine, Warp, Vercel/v0, StackBlitz/Bolt, and Lovable. Search for additional major vendors too. Include every currently purchasable paid tier with a published USD or CNY monthly-equivalent price, including annual commitments converted to monthly price; omit free plans, trials, custom-price enterprise tiers, and duplicate annual/monthly variants when one plan record can carry both prices. Check exact price, country/region, cadence, seat basis, included credits, model-specific budgets, and model access. Preserve unpaired paid plans with a short reason when a current price is public but a recent exact model entitlement is not.

For model coverage, search the Artificial Analysis language-model release index (https://artificialanalysis.ai/models/releases) and each reviewed provider's release notes/model picker. Audit model releases from ${windowStart} through ${asOf} inclusive; include every eligible text/reasoning/coding model with a documented paid-plan mapping. A recently released eligible model stays visible even when Artificial Analysis has not published an Intelligence Index/task-cost value: store null benchmark values, state the missing-benchmark reason, show its API-equivalent cost, and leave it unranked. Do not substitute another model's score. Record candidates you excluded in meta.modelAudit with outcome="excluded", a concrete reason, release date if known, and checked sourceIds; record included candidates there too. Use released only as an exact YYYY-MM-DD date; if a source gives only a month, omit released and explain the limited date precision in reason. Only mark a candidate included when its complete Model record is present in the current catalog or upsertModels and at least one paid plan explicitly maps to it; otherwise mark it excluded and explain what record or entitlement is missing. Exclude models outside the window and media-only models without a comparable text-task/API basis. Compare each paid plan separately with every exact model entitlement it documents. Never infer access from a generic label such as "latest models" or a provider family name.

Use official provider sources for plan/access/release/API rates and Artificial Analysis only for benchmark index/task-cost fields. API rates must match the model version and may use a provider's documented peak rate when peak/off-peak varies; explain the rate basis in source/model notes. Keep published quota types distinct: shared dollar credits use usdCredits; per-model monthly dollar caps use perModelUsdBudget plus modelBudgetUsdById; model token credits use modelCredits plus modelCreditsPerMillionTokens and creditWindowDays. Do not turn opaque requests or rolling limits into invented fixed token quotas. Keep priceBandsUsd and the recorded FX method unchanged.

Return exactly this patch schema: {"meta":{"asOf":"${asOf}","windowStart":"${windowStart}"},"sources":[new/changed full Source records only],"checkedSourceIds":[every source id actually rechecked this run],"upsertPlans":[{"status":"paired"|"unpaired","plan":full Plan record}],"removePlanIds":[ids no longer sold],"auditedPlanIds":[every currently active plan id reviewed, including unchanged plans],"upsertModels":[full changed/new Model records],"removeModelIds":[models outside the window or no longer eligible],"auditedModelIds":[every current in-window model id reviewed],"modelAudit":[included and excluded candidates with sourceIds, release dates when known, and reasons for exclusions or missing benchmarks]}. Do not return a full copy of unchanged plans/models. Include at least 80 paid plans across at least 24 distinct vendors after applying this patch, and at least five candidate audit rows. Do not fabricate/duplicate offerings to meet those floors. Every currently referenced source must appear in checkedSourceIds after you actually inspect it. Any new Source record must have checkedAt=${asOf}. Preserve IDs where possible and return ONLY JSON with no Markdown or commentary.

Current catalog follows:
${JSON.stringify(existingCatalog)}`;

  const codex = new Codex();
  const thread = codex.startThread({
    workingDirectory: root,
    sandboxMode: "read-only",
    approvalPolicy: "never",
    networkAccessEnabled: true,
    webSearchMode: "live",
  });
  const stream = await thread.runStreamed(prompt, { signal: AbortSignal.timeout(45 * 60 * 1_000) });
  let finalResponse = "";
  let liveSearchCount = 0;
  for await (const event of stream.events) {
    if (event.type === "item.completed") {
      if (event.item.type === "web_search") {
        liveSearchCount += 1;
        console.log(`Codex completed live search ${liveSearchCount}.`);
      } else if (event.item.type === "agent_message") {
        finalResponse = event.item.text;
      } else if (event.item.type === "error") {
        throw new Error(event.item.message);
      }
    } else if (event.type === "turn.failed") {
      throw new Error(event.error.message);
    } else if (event.type === "error") {
      throw new Error(event.message);
    }
  }
  if (!finalResponse.trim()) throw new Error("Codex SDK returned an empty response.");
  if (liveSearchCount < 24) {
    throw new Error(
      `Codex used only ${liveSearchCount} live web searches; at least twenty-four are required.`,
    );
  }

  const patch = parseRefreshPatch(finalResponse);
  const refreshedCatalog = mergeRefreshPatch(existingCatalog, patch);
  patch.modelAudit = normalizeModelAuditCoverage(
    refreshedCatalog,
    patch.modelAudit,
    windowStart,
    asOf,
  );
  refreshedCatalog.meta.modelAudit = patch.modelAudit;
  const paidPlans = refreshedCatalog.plans.filter(
    (plan) => Number.isFinite(plan.monthlyPrice) && plan.monthlyPrice > 0,
  );
  const paidUnpairedPlans = refreshedCatalog.unpairedPlans.filter(
    (plan) => Number.isFinite(plan.monthlyPrice) && plan.monthlyPrice > 0,
  );
  const excludedFreePlans =
    refreshedCatalog.plans.length -
    paidPlans.length +
    refreshedCatalog.unpairedPlans.length -
    paidUnpairedPlans.length;
  refreshedCatalog.plans = paidPlans;
  refreshedCatalog.unpairedPlans = paidUnpairedPlans;
  const vendorCount = new Set(
    [...paidPlans, ...paidUnpairedPlans].map((plan) => plan.vendor).filter(Boolean),
  ).size;
  if (paidPlans.length + paidUnpairedPlans.length < 80 || vendorCount < 24) {
    throw new Error(
      `Catalog coverage is below the required floor: ${paidPlans.length + paidUnpairedPlans.length} paid plans across ${vendorCount} vendors (need 80 plans and 24 vendors).`,
    );
  }
  validateCatalog(refreshedCatalog);
  validateRefreshEvidence(refreshedCatalog, patch, asOf, windowStart);
  const finalData = addComputedPrices(refreshedCatalog);

  // Commit only after the complete response passes the local TypeScript checks.
  await writeJsonAtomically(catalogPath, refreshedCatalog);
  await writeJsonAtomically(outputPath, finalData);
  console.log(
    `Codex used ${liveSearchCount} live searches across ${vendorCount} vendors, excluded ${excludedFreePlans} free/invalid-price plan(s), and refreshed ${finalData.meta.planCount} paid plans and ${finalData.meta.offerCount} paid plan × model comparisons across ${finalData.meta.modelCount} recent models.`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
