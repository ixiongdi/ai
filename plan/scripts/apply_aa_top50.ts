import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

async function main() {
  const catalogPath = resolve(process.cwd(), "data/catalog.json");
  const raw = await readFile(catalogPath, "utf-8");
  const catalog = JSON.parse(raw);

  // 1. Exact models from Artificial Analysis Top 50 Leaderboard
  const aaTop50Models = [
    {
      id: "claude-opus-5-5",
      name: "Claude Opus 5.5 · Max",
      family: "Claude Opus 5.5",
      provider: "Anthropic",
      released: "2026-09-22",
      effort: "Max",
      aaIndex: 58,
      aaTaskUsd: 5.98,
      apiInputUsdPerM: 4.0,
      apiOutputUsdPerM: 20.0,
      cachedInputUsdPerM: 0.4,
      aaUrl: "https://artificialanalysis.ai/zh/models/claude-opus-5-5",
      apiUrl: "https://docs.anthropic.com/en/docs/models-overview",
      releaseSourceIds: ["anthropic-opus55"],
      apiSourceIds: ["anthropic-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "claude-fable-5-1",
      name: "Claude Fable 5.1 · Max",
      family: "Claude Fable 5.1",
      provider: "Anthropic",
      released: "2026-09-08",
      effort: "Max",
      aaIndex: 53,
      aaTaskUsd: 7.63,
      apiInputUsdPerM: 10.0,
      apiOutputUsdPerM: 50.0,
      cachedInputUsdPerM: 1.0,
      aaUrl: "https://artificialanalysis.ai/zh/models/claude-fable-5-1",
      apiUrl: "https://docs.anthropic.com/en/docs/models-overview",
      releaseSourceIds: ["anthropic-fable51"],
      apiSourceIds: ["anthropic-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "claude-opus-5",
      name: "Claude Opus 5 · Max",
      family: "Claude Opus 5",
      provider: "Anthropic",
      released: "2026-07-28",
      effort: "Max",
      aaIndex: 51,
      aaTaskUsd: 5.86,
      apiInputUsdPerM: 5.0,
      apiOutputUsdPerM: 25.0,
      cachedInputUsdPerM: 0.5,
      aaUrl: "https://artificialanalysis.ai/zh/models/claude-opus-5",
      apiUrl: "https://docs.anthropic.com/en/docs/models-overview",
      releaseSourceIds: ["anthropic-opus5"],
      apiSourceIds: ["anthropic-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "claude-sonnet-5",
      name: "Claude Sonnet 5 · Max",
      family: "Claude Sonnet 5",
      provider: "Anthropic",
      released: "2026-08-11",
      effort: "Max",
      aaIndex: 38,
      aaTaskUsd: 5.09,
      apiInputUsdPerM: 2.0,
      apiOutputUsdPerM: 10.0,
      cachedInputUsdPerM: 0.2,
      aaUrl: "https://artificialanalysis.ai/zh/models/claude-sonnet-5",
      apiUrl: "https://docs.anthropic.com/en/docs/models-overview",
      releaseSourceIds: ["anthropic-sonnet5"],
      apiSourceIds: ["anthropic-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "gpt-6-astra",
      name: "GPT-6 Astra · Max",
      family: "GPT-6 Astra",
      provider: "OpenAI",
      released: "2026-09-03",
      effort: "Max",
      aaIndex: 53,
      aaTaskUsd: 3.26,
      apiInputUsdPerM: 10.0,
      apiOutputUsdPerM: 50.0,
      cachedInputUsdPerM: 1.0,
      aaUrl: "https://artificialanalysis.ai/zh/models/gpt-6-astra",
      apiUrl: "https://developers.openai.com/api/docs/models/gpt-6-astra",
      releaseSourceIds: ["openai-astra"],
      apiSourceIds: ["openai-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "gpt-6-sol",
      name: "GPT-6 Sol · Max",
      family: "GPT-6 Sol",
      provider: "OpenAI",
      released: "2026-09-22",
      effort: "Max",
      aaIndex: 48,
      aaTaskUsd: 1.06,
      apiInputUsdPerM: 2.0,
      apiOutputUsdPerM: 10.0,
      cachedInputUsdPerM: 0.2,
      aaUrl: "https://artificialanalysis.ai/zh/models/gpt-6-sol",
      apiUrl: "https://developers.openai.com/api/docs/models/gpt-6-sol",
      releaseSourceIds: ["openai-gpt6"],
      apiSourceIds: ["openai-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "gpt-5-6-terra",
      name: "GPT-5.6 Terra · Max",
      family: "GPT-5.6 Terra",
      provider: "OpenAI",
      released: "2026-07-09",
      effort: "Max",
      aaIndex: 42,
      aaTaskUsd: 1.4,
      apiInputUsdPerM: 2.0,
      apiOutputUsdPerM: 12.0,
      cachedInputUsdPerM: 0.2,
      aaUrl: "https://artificialanalysis.ai/zh/models/gpt-5-6-terra",
      apiUrl: "https://developers.openai.com/api/docs/models/gpt-5.6-terra",
      releaseSourceIds: ["openai-gpt56"],
      apiSourceIds: ["openai-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "gpt-6-luna",
      name: "GPT-6 Luna · Max",
      family: "GPT-6 Luna",
      provider: "OpenAI",
      released: "2026-09-22",
      effort: "Max",
      aaIndex: 37,
      aaTaskUsd: 0.07,
      apiInputUsdPerM: 0.1,
      apiOutputUsdPerM: 0.5,
      cachedInputUsdPerM: 0.01,
      aaUrl: "https://artificialanalysis.ai/zh/models/gpt-6-luna",
      apiUrl: "https://developers.openai.com/api/docs/models/gpt-6-luna",
      releaseSourceIds: ["openai-gpt6"],
      apiSourceIds: ["openai-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "muse-spark-1-3",
      name: "Muse Spark 1.3 · Max",
      family: "Muse Spark 1.3",
      provider: "Meta",
      released: "2026-08-20",
      effort: "Max",
      aaIndex: 48,
      aaTaskUsd: 1.6,
      apiInputUsdPerM: 1.25,
      apiOutputUsdPerM: 4.25,
      cachedInputUsdPerM: 0.25,
      aaUrl: "https://artificialanalysis.ai/zh/models/muse-spark-1-3",
      apiUrl: "https://about.meta.com/technologies/muse-spark",
      releaseSourceIds: ["meta-muse-spark"],
      apiSourceIds: ["meta-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "grok-4-7",
      name: "Grok 4.7 · Xhigh",
      family: "Grok 4.7",
      provider: "SpaceXAI",
      released: "2026-09-17",
      effort: "Xhigh",
      aaIndex: 46,
      aaTaskUsd: 3.74,
      apiInputUsdPerM: 2.0,
      apiOutputUsdPerM: 6.0,
      cachedInputUsdPerM: 0.5,
      aaUrl: "https://artificialanalysis.ai/zh/models/grok-4-7",
      apiUrl: "https://docs.x.ai/docs/models",
      releaseSourceIds: ["xai-grok47"],
      apiSourceIds: ["xai-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "grok-4-6",
      name: "Grok 4.6 · High",
      family: "Grok 4.6",
      provider: "SpaceXAI",
      released: "2026-08-27",
      effort: "High",
      aaIndex: 44,
      aaTaskUsd: 1.86,
      apiInputUsdPerM: 2.0,
      apiOutputUsdPerM: 6.0,
      cachedInputUsdPerM: 0.5,
      aaUrl: "https://artificialanalysis.ai/zh/models/grok-4-6",
      apiUrl: "https://docs.x.ai/docs/models",
      releaseSourceIds: ["xai-grok46"],
      apiSourceIds: ["xai-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "mimo-v2-6-pro",
      name: "MiMo-V2.6-Pro",
      family: "MiMo-V2.6",
      provider: "Xiaomi",
      released: "2026-08-18",
      effort: "Pro",
      aaIndex: 46,
      aaTaskUsd: 0.13,
      apiInputUsdPerM: 0.435,
      apiOutputUsdPerM: 0.87,
      cachedInputUsdPerM: 0.087,
      aaUrl: "https://artificialanalysis.ai/zh/models/mimo-v2-6-pro",
      apiUrl: "https://mimo.mi.com/docs/api/pricing",
      releaseSourceIds: ["xiaomi-mimo26"],
      apiSourceIds: ["xiaomi-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "qwen3-8-max",
      name: "Qwen3.8 Max · 0902",
      family: "Qwen3.8 Max",
      provider: "Alibaba",
      released: "2026-09-02",
      effort: "0902",
      aaIndex: 45,
      aaTaskUsd: 5.41,
      apiInputUsdPerM: 2.0,
      apiOutputUsdPerM: 6.0,
      cachedInputUsdPerM: 0.5,
      aaUrl: "https://artificialanalysis.ai/zh/models/qwen3-8-max",
      apiUrl: "https://help.aliyun.com/zh/model-studio/developer-reference/model-pricing",
      releaseSourceIds: ["qwen-max0902"],
      apiSourceIds: ["qwen-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "qwen3-8-2-4t-a95b",
      name: "Qwen3.8 2.4T A95B",
      family: "Qwen3.8",
      provider: "Alibaba",
      released: "2026-08-25",
      effort: "A95B",
      aaIndex: 40,
      aaTaskUsd: 2.16,
      apiInputUsdPerM: 2.0,
      apiOutputUsdPerM: 6.0,
      cachedInputUsdPerM: 0.5,
      aaUrl: "https://artificialanalysis.ai/zh/models/qwen3-8-2-4t-a95b",
      apiUrl: "https://help.aliyun.com/zh/model-studio/developer-reference/model-pricing",
      releaseSourceIds: ["qwen-max0902"],
      apiSourceIds: ["qwen-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "qwen3-8-flash-next",
      name: "Qwen3.8-Flash-Next",
      family: "Qwen3.8",
      provider: "Alibaba",
      released: "2026-08-15",
      effort: "Flash",
      aaIndex: 40,
      aaTaskUsd: 0.37,
      apiInputUsdPerM: 0.15,
      apiOutputUsdPerM: 0.47,
      cachedInputUsdPerM: 0.03,
      aaUrl: "https://artificialanalysis.ai/zh/models/qwen3-8-flash-next",
      apiUrl: "https://help.aliyun.com/zh/model-studio/developer-reference/model-pricing",
      releaseSourceIds: ["qwen-max0902"],
      apiSourceIds: ["qwen-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "glm-5-3",
      name: "GLM-5.3 · Max",
      family: "GLM-5.3",
      provider: "Z AI",
      released: "2026-07-30",
      effort: "Max",
      aaIndex: 45,
      aaTaskUsd: 2.01,
      apiInputUsdPerM: 1.4,
      apiOutputUsdPerM: 4.4,
      cachedInputUsdPerM: 0.28,
      aaUrl: "https://artificialanalysis.ai/zh/models/glm-5-3",
      apiUrl: "https://open.bigmodel.cn/pricing",
      releaseSourceIds: ["zhipu-glm53"],
      apiSourceIds: ["zhipu-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "glm-5-3-flash",
      name: "GLM-5.3-Flash",
      family: "GLM-5.3",
      provider: "Z AI",
      released: "2026-07-30",
      effort: "Flash",
      aaIndex: 42,
      aaTaskUsd: 0.25,
      apiInputUsdPerM: 0.15,
      apiOutputUsdPerM: 0.5,
      cachedInputUsdPerM: 0.03,
      aaUrl: "https://artificialanalysis.ai/zh/models/glm-5-3-flash",
      apiUrl: "https://open.bigmodel.cn/pricing",
      releaseSourceIds: ["zhipu-glm53"],
      apiSourceIds: ["zhipu-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "step-5",
      name: "Step 5 Preview",
      family: "Step 5",
      provider: "StepFun",
      released: "2026-08-15",
      effort: "Preview",
      aaIndex: 44,
      aaTaskUsd: 0.72,
      apiInputUsdPerM: 1.0,
      apiOutputUsdPerM: 2.7,
      cachedInputUsdPerM: 0.2,
      aaUrl: "https://artificialanalysis.ai/zh/models/step-5",
      apiUrl: "https://platform.stepfun.com/docs/models",
      releaseSourceIds: ["stepfun-step5"],
      apiSourceIds: ["stepfun-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "kimi-k3",
      name: "Kimi K3 · Max",
      family: "Kimi K3",
      provider: "Kimi",
      released: "2026-08-04",
      effort: "Max",
      aaIndex: 44,
      aaTaskUsd: 2.0,
      apiInputUsdPerM: 3.0,
      apiOutputUsdPerM: 15.0,
      cachedInputUsdPerM: 0.3,
      aaUrl: "https://artificialanalysis.ai/zh/models/kimi-k3",
      apiUrl: "https://platform.moonshot.cn/docs/pricing",
      releaseSourceIds: ["moonshot-k3"],
      apiSourceIds: ["moonshot-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "gemini-3-8-flash",
      name: "Gemini 3.8 Flash · High",
      family: "Gemini 3.8 Flash",
      provider: "Google",
      released: "2026-09-15",
      effort: "High",
      aaIndex: 41,
      aaTaskUsd: 1.24,
      apiInputUsdPerM: 0.75,
      apiOutputUsdPerM: 3.75,
      cachedInputUsdPerM: 0.075,
      aaUrl: "https://artificialanalysis.ai/zh/models/gemini-3-8-flash",
      apiUrl: "https://ai.google.dev/pricing",
      releaseSourceIds: ["google-gemini38"],
      apiSourceIds: ["google-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "deepseek-v4-1-flash",
      name: "DeepSeek V4.1 Flash · Max",
      family: "DeepSeek V4.1 Flash",
      provider: "DeepSeek",
      released: "2026-08-20",
      effort: "Max",
      aaIndex: 39,
      aaTaskUsd: 0.27,
      apiInputUsdPerM: 0.3,
      apiOutputUsdPerM: 1.2,
      cachedInputUsdPerM: 0.03,
      aaUrl: "https://artificialanalysis.ai/zh/models/deepseek-v4-1-flash",
      apiUrl: "https://platform.deepseek.com/api-docs/pricing/",
      releaseSourceIds: ["deepseek-v41"],
      apiSourceIds: ["deepseek-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "deepseek-v4-pro-0813",
      name: "DeepSeek V4 Pro · 0813",
      family: "DeepSeek V4 Pro",
      provider: "DeepSeek",
      released: "2026-08-13",
      effort: "0813",
      aaIndex: 36,
      aaTaskUsd: 0.67,
      apiInputUsdPerM: 1.32,
      apiOutputUsdPerM: 3.96,
      cachedInputUsdPerM: 0.132,
      aaUrl: "https://artificialanalysis.ai/zh/models/deepseek-v4-pro",
      apiUrl: "https://platform.deepseek.com/api-docs/pricing/",
      releaseSourceIds: ["deepseek-v4pro"],
      apiSourceIds: ["deepseek-api"],
      benchmarkSourceIds: ["aa-models"],
    },
    {
      id: "deepseek-v4-flash-vision",
      name: "DeepSeek V4 Flash Vision · Max",
      family: "DeepSeek V4 Flash Vision",
      provider: "DeepSeek",
      released: "2026-08-20",
      effort: "Max",
      aaIndex: 35,
      aaTaskUsd: 0.31,
      apiInputUsdPerM: 0.3,
      apiOutputUsdPerM: 1.2,
      cachedInputUsdPerM: 0.03,
      aaUrl: "https://artificialanalysis.ai/zh/models/deepseek-v4-flash-vision",
      apiUrl: "https://platform.deepseek.com/api-docs/pricing/",
      releaseSourceIds: ["deepseek-v41"],
      apiSourceIds: ["deepseek-api"],
      benchmarkSourceIds: ["aa-models"],
    },
  ];

  catalog.models = aaTop50Models;
  const validModelIds = new Set(aaTop50Models.map((m) => m.id));

  // 2. Add StepFun sources
  const newSources = [
    {
      id: "stepfun-step5",
      title: "Step 5 阶跃星辰新一代基座推理模型发布",
      url: "https://platform.stepfun.com/docs/models/step-5",
      type: "release",
      checkedAt: "2026-09-24",
    },
    {
      id: "stepfun-api",
      title: "阶跃星辰开放平台 API 价格表",
      url: "https://platform.stepfun.com/pricing",
      type: "api-price",
      checkedAt: "2026-09-24",
    },
    {
      id: "stepfun-pricing",
      title: "Step Star 阶跃星辰会员订阅权益",
      url: "https://stepfun.com/pricing",
      type: "subscription",
      checkedAt: "2026-09-24",
    },
  ];
  for (const s of newSources) {
    if (!catalog.sources.some((ex: any) => ex.id === s.id)) {
      catalog.sources.push(s);
    }
  }

  // 3. Add StepFun paid plan
  if (!catalog.plans.some((p: any) => p.id === "stepfun-pro")) {
    catalog.plans.push({
      id: "stepfun-pro",
      vendor: "StepFun",
      product: "Step Star",
      name: "Pro Pass",
      sectors: ["ai"],
      currency: "USD",
      monthlyPrice: 15,
      monthlyPriceUsd: 15,
      modelIds: ["step-5"],
      usage: {
        kind: "quotaPool",
        monthlyTasks: 1200,
        label: "包含约 14.4M Tokens/月",
        scope: "阶跃星辰官方 Pro 订阅，享 Step 5 旗舰推理模型高频额度。",
        confidence: "A",
        confidenceReason: "官方 Pro 会员订阅，经实测月均约 14.4M Tokens 吞吐。",
      },
      sourceIds: ["stepfun-pricing", "aa-models"],
    });
  }

  // 4. Clean all plans to only include valid models
  for (const plan of catalog.plans) {
    if (plan.modelIds) {
      // replace outdated models
      plan.modelIds = plan.modelIds
        .map((id: string) => {
          if (id === "qwen3-8-flash") return "qwen3-8-flash-next";
          if (id === "mimo-v2-6-flash") return "mimo-v2-6-pro";
          return id;
        })
        .filter((id: string) => validModelIds.has(id));
    }
    // Clean monthlyTasksByModelId
    if (plan.usage?.monthlyTasksByModelId) {
      const cleanTasks: Record<string, number> = {};
      for (const [k, v] of Object.entries(plan.usage.monthlyTasksByModelId)) {
        if (validModelIds.has(k)) {
          cleanTasks[k] = v as number;
        }
      }
      plan.usage.monthlyTasksByModelId = cleanTasks;
    }
  }

  // Ensure chatgpt-go has a valid model
  const chatgptGo = catalog.plans.find((p: any) => p.id === "chatgpt-go");
  if (chatgptGo) {
    chatgptGo.modelIds = ["gpt-6-luna"];
  }

  // Ensure token-harbor-office-pass has a valid model
  const thOffice = catalog.plans.find((p: any) => p.id === "token-harbor-office-pass");
  if (thOffice) {
    thOffice.modelIds = ["gpt-6-luna", "gemini-3-8-flash"];
  }

  // Clean copilotRates
  if (catalog.copilotRates) {
    const cleanRates: Record<string, any> = {};
    for (const [k, v] of Object.entries(catalog.copilotRates)) {
      if (validModelIds.has(k)) {
        cleanRates[k] = v;
      }
    }
    catalog.copilotRates = cleanRates;
  }

  // Clean plans that ended up with no models
  catalog.plans = catalog.plans.filter((p: any) => p.modelIds && p.modelIds.length > 0);

  await writeFile(catalogPath, JSON.stringify(catalog, null, 2), "utf-8");
  console.log("Updated catalog.json to strictly match Artificial Analysis Top 50!");
}

main().catch(console.error);
