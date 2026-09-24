<script setup lang="ts" vapor>
import { computed, onMounted, reactive, ref } from "vue";

type Sector = "ai" | "cloud" | "coding";
type UsageKind = "opaque" | "usdCredits" | "kiroCredits" | "modelCredits" | "perModelUsdBudget";
type ConfidenceLevel = "S" | "A" | "B" | "C";

interface Source {
  id: string;
  title: string;
  url: string;
  type: string;
  checkedAt?: string;
}

interface Model {
  id: string;
  name: string;
  family: string;
  provider: string;
  released: string;
  effort: string;
  aaIndex: number | null;
  aaTaskUsd: number | null;
  benchmarkNote?: string;
  apiInputUsdPerM: number;
  apiOutputUsdPerM: number;
  apiPriceUntil?: string;
  aaUrl: string;
  releaseSourceIds: string[];
  apiSourceIds: string[];
  benchmarkSourceIds: string[];
  aaOutputTokens?: number;
  aaReasoningTokens?: number;
  aaAnswerTokens?: number;
  aaInputTokens?: number;
  aaTotalTokens?: number;
}

interface Plan {
  id: string;
  vendor: string;
  product: string;
  name: string;
  sectors: Sector[];
  currency: string;
  monthlyPrice: number;
  monthlyPriceUsd: number;
  annualMonthlyPrice?: number;
  annualMonthlyPriceUsd?: number;
  annualDiscountPct?: number;
  seat?: boolean;
  sourceIds: string[];
  modelIds: string[];
  usage: {
    kind: UsageKind;
    confidence?: ConfidenceLevel;
    confidenceReason?: string;
    credits?: number;
    creditWindowDays?: number;
    modelCreditsPerMillionTokens?: Record<string, { input: number; output: number }>;
    modelBudgetUsdById?: Record<string, number>;
    label: string;
    scope: string;
  };
}

interface UnpairedPlan extends Omit<Plan, "modelIds" | "usage"> {
  usageLabel: string;
  reason: string;
  confidence?: ConfidenceLevel;
  confidenceReason?: string;
}

interface Offer {
  id: string;
  planId: string;
  modelId: string;
  metrics?: {
    scenario: { inputTokens: number; outputTokens: number };
    apiPromptCostUsd: number;
    apiEquivalentPrompts: number | null;
    apiEquivalentValueUsd?: number | null;
    subsidyMultiplier?: number | null;
    aaIpd: number | null;
    estimatedTasksPerMonth: number | null;
    monthlyTokens: number | null;
    subscriptionIpd: number | null;
    confidence?: ConfidenceLevel;
    confidenceReason?: string;
  };
}

interface Catalog {
  meta: {
    asOf: string;
    windowStart: string;
    region: string;
    planCount: number;
    modelCount: number;
    defaultScenario: { inputTokens: number; outputTokens: number; cachedInputTokens?: number };
    priceBandsUsd: Array<{ id: string; label: string; min: number; max: number | null }>;
    confidenceCounts?: Record<ConfidenceLevel, number>;
    usdToCny: { rate: number; asOf: string };
  };
  models: Model[];
  plans: Plan[];
  offers: Offer[];
  unpairedPlans: UnpairedPlan[];
  sources: Source[];
  copilotRates: Record<string, { inputUsdPerM: number; outputUsdPerM: number }>;
}

interface OfferMetrics extends Offer {
  plan: Plan;
  model: Model;
  price: { usd: number; native: number; label: string };
  apiPromptCost: number;
  apiBudgetPrompts: number | null;
  apiEquivalentValue: number | null;
  subsidyMultiplier: number | null;
  aaIpd: number | null;
  estimatedTasks: number | null;
  monthlyTokens: number | null;
  subscriptionIpd: number | null;
  confidence: ConfidenceLevel;
  confidenceReason: string;
}

const catalog = ref<Catalog | null>(null);
const loadError = ref("");
const urlParams =
  typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
const state = reactive({
  sector: "all",
  vendor: "all",
  plan: "all",
  band: "all",
  model: "all",
  confidence: "all" as "all" | ConfidenceLevel,
  sort: "subscriptionIpd",
  priceMode: "monthly",
  query: "",
  inputTokens: 10000,
  outputTokens: 2000,
  viewMode: (urlParams?.get("view") === "table" ? "table" : "cards") as "cards" | "table",
});

const sourceTypes = {
  subscription: "订阅价格",
  access: "模型可用性",
  "api-price": "API 价格",
  benchmark: "智能评测",
  quota: "额度说明",
  fx: "汇率",
};
const sectorLabels: Record<Sector, string> = {
  ai: "大模型厂商",
  cloud: "云服务厂商",
  coding: "Coding Agent",
};

const confidenceMeta: Record<
  ConfidenceLevel,
  { label: string; short: string; badgeClass: string; tip: string }
> = {
  S: {
    label: "S 官方明确",
    short: "S 官方",
    badgeClass: "is-s",
    tip: "官方明确公布白纸黑字配额/点数/Token 扣除标准，具有明确 SLA 约束力",
  },
  A: {
    label: "A 多方验证",
    short: "A 验证",
    badgeClass: "is-a",
    tip: "官方限定时间滑动窗口，经多个独立第三方评测与重度实测交叉验证",
  },
  B: {
    label: "B 单方测试",
    short: "B 测试",
    badgeClass: "is-b",
    tip: "官方仅模糊估算或仅有单一评测方/小样本实测推算，缺乏长期严格 SLA",
  },
  C: {
    label: "C 不可信",
    short: "C 不可信",
    badgeClass: "is-c",
    tip: "黑盒不透明，仅宣称数倍或无限制，存在未公开后台降频/截断或不可独立复现",
  },
};

const isDark = ref(true);
const searchInput = ref<HTMLInputElement | null>(null);

function toggleTheme() {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.remove("light");
    try {
      localStorage.setItem("theme", "dark");
    } catch {}
  } else {
    document.documentElement.classList.add("light");
    try {
      localStorage.setItem("theme", "light");
    } catch {}
  }
}

onMounted(async () => {
  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      isDark.value = false;
      document.documentElement.classList.add("light");
    }
  } catch {}

  window.addEventListener("keydown", (e: KeyboardEvent) => {
    if (
      (e.key === "k" && (e.metaKey || e.ctrlKey)) ||
      (e.key === "/" &&
        (e.target as HTMLElement)?.tagName !== "INPUT" &&
        (e.target as HTMLElement)?.tagName !== "TEXTAREA")
    ) {
      e.preventDefault();
      searchInput.value?.focus();
    }
  });

  try {
    const response = await fetch("./data.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    catalog.value = (await response.json()) as Catalog;
  } catch (error) {
    loadError.value = `数据 JSON 加载失败：${error instanceof Error ? error.message : String(error)}`;
  }
});

const modelOptions = computed(() =>
  catalog.value
    ? [...catalog.value.models].sort((a, b) => b.released.localeCompare(a.released))
    : [],
);
const offerCount = computed(() => catalog.value?.offers.length ?? 0);
const knownOfferCount = computed(() => {
  if (!catalog.value) return 0;
  return catalog.value.offers.filter((offer) => offer.metrics?.estimatedTasksPerMonth !== null)
    .length;
});

const sectorCounts = computed(() => {
  const counts = { ai: 0, cloud: 0, coding: 0 };
  if (!catalog.value) return counts;
  for (const offer of catalog.value.offers) {
    const plan = catalog.value.plans.find((p) => p.id === offer.planId);
    if (plan) {
      for (const s of plan.sectors) {
        if (s in counts) counts[s as Sector]++;
      }
    }
  }
  return counts;
});

interface VendorOption {
  name: string;
  count: number;
}

interface PlanOption {
  id: string;
  vendor: string;
  name: string;
  label: string;
}

const vendorOptions = computed<VendorOption[]>(() => {
  if (!catalog.value) return [];
  const counts = new Map<string, number>();
  for (const offer of catalog.value.offers) {
    const plan = catalog.value.plans.find((p) => p.id === offer.planId);
    if (!plan) continue;
    if (state.sector !== "all" && !plan.sectors.includes(state.sector as Sector)) continue;
    counts.set(plan.vendor, (counts.get(plan.vendor) || 0) + 1);
  }
  for (const plan of catalog.value.unpairedPlans) {
    if (state.sector !== "all" && !plan.sectors.includes(state.sector as Sector)) continue;
    counts.set(plan.vendor, (counts.get(plan.vendor) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
});

const planOptions = computed<PlanOption[]>(() => {
  if (!catalog.value) return [];
  const allPlans = [...catalog.value.plans, ...catalog.value.unpairedPlans];
  const plans = allPlans.filter((p) => {
    if (state.sector !== "all" && !p.sectors.includes(state.sector as Sector)) return false;
    if (state.vendor !== "all" && p.vendor !== state.vendor) return false;
    return true;
  });
  return plans
    .map((p) => ({
      id: p.id,
      vendor: p.vendor,
      name: `${p.product} ${p.name}`,
      label:
        state.vendor === "all" ? `${p.vendor} · ${p.product} ${p.name}` : `${p.product} ${p.name}`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
});

function onSectorChange(newSector: string) {
  state.sector = newSector;
  if (state.vendor !== "all") {
    const isVendorValid = vendorOptions.value.some((v) => v.name === state.vendor);
    if (!isVendorValid) {
      state.vendor = "all";
      state.plan = "all";
    }
  }
  if (state.plan !== "all") {
    const isPlanValid = planOptions.value.some((p) => p.id === state.plan);
    if (!isPlanValid) {
      state.plan = "all";
    }
  }
}

function onVendorChange() {
  if (state.vendor !== "all" && state.plan !== "all") {
    const allPlans = [...(catalog.value?.plans || []), ...(catalog.value?.unpairedPlans || [])];
    const plan = allPlans.find((p) => p.id === state.plan);
    if (plan && plan.vendor !== state.vendor) {
      state.plan = "all";
    }
  }
}

function onPlanChange() {
  if (state.plan !== "all") {
    const allPlans = [...(catalog.value?.plans || []), ...(catalog.value?.unpairedPlans || [])];
    const plan = allPlans.find((p) => p.id === state.plan);
    if (plan && state.vendor === "all") {
      state.vendor = plan.vendor;
    }
  }
}

const hasActiveFilters = computed(() => {
  return (
    state.sector !== "all" ||
    state.vendor !== "all" ||
    state.plan !== "all" ||
    state.model !== "all" ||
    state.band !== "all" ||
    state.confidence !== "all" ||
    state.query.trim() !== ""
  );
});

function resetFilters() {
  state.sector = "all";
  state.vendor = "all";
  state.plan = "all";
  state.model = "all";
  state.band = "all";
  state.confidence = "all";
  state.query = "";
}

const filteredUnpairedPlans = computed(() => {
  if (!catalog.value) return [];
  return catalog.value.unpairedPlans.filter((plan) => {
    if (state.sector !== "all" && !plan.sectors.includes(state.sector as Sector)) return false;
    if (state.vendor !== "all" && plan.vendor !== state.vendor) return false;
    if (state.plan !== "all" && plan.id !== state.plan) return false;
    return true;
  });
});

function getPrice(plan: Plan): OfferMetrics["price"] {
  if (state.priceMode === "annual") {
    if (plan.annualMonthlyPriceUsd !== undefined) {
      return {
        usd: plan.annualMonthlyPriceUsd,
        native: plan.annualMonthlyPrice,
        label: "年付折合月价",
      };
    }
    if (plan.annualDiscountPct) {
      const annualMonthly = plan.monthlyPrice * (1 - plan.annualDiscountPct / 100);
      const divisor = plan.currency === "CNY" ? catalog.value.meta.usdToCny.rate : 1;
      return {
        usd: round(annualMonthly / divisor, 2),
        native: annualMonthly,
        label: `年付估算（省 ${plan.annualDiscountPct}%）`,
      };
    }
  }
  return {
    usd: plan.monthlyPriceUsd,
    native: plan.monthlyPrice,
    label: plan.seat ? "每席位 / 月" : "月付标价",
  };
}

function promptCost(inputRate: number, outputRate: number): number {
  return (state.inputTokens * inputRate + state.outputTokens * outputRate) / 1_000_000;
}

function getOfferMetrics(offer: Offer): OfferMetrics {
  const data = catalog.value;
  if (!data) throw new Error("Catalog is not loaded");
  const plan = data.plans.find((item) => item.id === offer.planId)!;
  const model = data.models.find((item) => item.id === offer.modelId)!;
  const price = getPrice(plan);
  const defaultScenario = data.meta.defaultScenario;
  const usesDefaultScenario =
    state.inputTokens === defaultScenario?.inputTokens &&
    state.outputTokens === defaultScenario?.outputTokens &&
    state.priceMode === "monthly";
  const baseline = usesDefaultScenario ? offer.metrics : undefined;
  const apiPromptCost =
    baseline?.apiPromptCostUsd ??
    (model.aaTaskUsd !== null && model.aaTaskUsd > 0
      ? model.aaTaskUsd
      : promptCost(model.apiInputUsdPerM, model.apiOutputUsdPerM));
  const aaIpd =
    baseline?.aaIpd ??
    (model.aaIndex !== null && model.aaTaskUsd !== null ? model.aaIndex / model.aaTaskUsd : null);
  const apiBudgetPrompts =
    baseline?.apiEquivalentPrompts ?? (apiPromptCost > 0 ? price.usd / apiPromptCost : null);
  const billedRates =
    plan.vendor === "GitHub" && data.copilotRates[model.id]
      ? data.copilotRates[model.id]
      : { inputUsdPerM: model.apiInputUsdPerM, outputUsdPerM: model.apiOutputUsdPerM };
  const promptRefCost = promptCost(model.apiInputUsdPerM, model.apiOutputUsdPerM);
  const billedPromptCost = promptCost(billedRates.inputUsdPerM, billedRates.outputUsdPerM);
  let apiEquivalentValue: number | null = baseline?.apiEquivalentValueUsd ?? null;
  let estimatedTasks: number | null = baseline?.estimatedTasksPerMonth ?? null;
  let monthlyTokens: number | null = baseline?.monthlyTokens ?? null;
  let subsidyMultiplier: number | null = baseline?.subsidyMultiplier ?? null;
  let subscriptionIpd: number | null = baseline?.subscriptionIpd ?? null;

  if (!baseline) {
    if (plan.usage.monthlyTasksByModelId?.[model.id] !== undefined) {
      const prompts = plan.usage.monthlyTasksByModelId[model.id];
      apiEquivalentValue = prompts * promptRefCost;
    } else if (plan.usage.monthlyTasks !== undefined) {
      const prompts = plan.usage.monthlyTasks;
      apiEquivalentValue = prompts * promptRefCost;
    } else if (plan.usage.kind === "usdCredits" && billedPromptCost > 0) {
      const creditUsd = (plan.usage.credits ?? 0) * 0.01;
      const prompts = creditUsd / billedPromptCost;
      apiEquivalentValue = prompts * promptRefCost;
    } else if (plan.usage.kind === "perModelUsdBudget" && billedPromptCost > 0) {
      const monthlyModelBudget = plan.usage.modelBudgetUsdById?.[model.id];
      if (monthlyModelBudget !== undefined) {
        const prompts = monthlyModelBudget / billedPromptCost;
        apiEquivalentValue = prompts * promptRefCost;
      }
    } else if (plan.usage.kind === "modelCredits") {
      const rates = plan.usage.modelCreditsPerMillionTokens?.[model.id];
      if (rates) {
        const modelCreditCost =
          (state.inputTokens * rates.input + state.outputTokens * rates.output) / 1_000_000;
        if (modelCreditCost > 0) {
          const prompts =
            ((plan.usage.credits ?? 0) * (30 / (plan.usage.creditWindowDays ?? 30))) /
            modelCreditCost;
          apiEquivalentValue = prompts * promptRefCost;
        }
      }
    }

    if (apiEquivalentValue !== null && model.aaTaskUsd !== null && model.aaTaskUsd > 0) {
      estimatedTasks = apiEquivalentValue / model.aaTaskUsd;
    }

    if (estimatedTasks !== null) {
      monthlyTokens =
        estimatedTasks * (model.aaTotalTokens ?? state.inputTokens + state.outputTokens);
    }

    subsidyMultiplier =
      apiEquivalentValue !== null && price.usd > 0 ? apiEquivalentValue / price.usd : null;

    if (estimatedTasks !== null && price.usd > 0 && model.aaIndex !== null) {
      subscriptionIpd = (estimatedTasks * model.aaIndex) / price.usd;
    }
  }

  const confidence = offer.metrics?.confidence ?? (plan.usage as any)?.confidence ?? "C";
  const confidenceReason =
    offer.metrics?.confidenceReason ?? (plan.usage as any)?.confidenceReason ?? "";

  return {
    ...offer,
    plan,
    model,
    price,
    apiPromptCost,
    apiBudgetPrompts,
    apiEquivalentValue,
    subsidyMultiplier,
    aaIpd,
    estimatedTasks,
    monthlyTokens,
    subscriptionIpd,
    confidence,
    confidenceReason,
  };
}

function bandIdFor(priceUsd: number): string {
  const bands = catalog.value?.meta.priceBandsUsd ?? [];
  if (bands.length === 0) return "";
  const match = bands.find(
    (band) => priceUsd >= band.min && (band.max === null || priceUsd < band.max),
  );
  return match ? match.id : bands.at(-1).id;
}

const filteredOffers = computed(() => {
  if (!catalog.value) return [];
  const queryStr = state.query.toLowerCase().trim();
  const result = catalog.value.offers.map(getOfferMetrics).filter((item) => {
    const searchable =
      `${item.plan.vendor} ${item.plan.product} ${item.plan.name} ${item.model.name} ${item.model.family} ${item.confidence}`.toLowerCase();
    return (
      (state.sector === "all" || item.plan.sectors.includes(state.sector as Sector)) &&
      (state.vendor === "all" || item.plan.vendor === state.vendor) &&
      (state.plan === "all" || item.plan.id === state.plan) &&
      (state.model === "all" || item.model.id === state.model) &&
      (state.band === "all" || state.band === bandIdFor(item.price.usd)) &&
      (state.confidence === "all" || state.confidence === item.confidence) &&
      (!queryStr || searchable.includes(queryStr))
    );
  });
  result.sort((a, b) => {
    if (state.sort === "confidence") {
      const confidenceOrder: Record<ConfidenceLevel, number> = { S: 4, A: 3, B: 2, C: 1 };
      return (
        confidenceOrder[b.confidence] - confidenceOrder[a.confidence] ||
        (b.subscriptionIpd ?? -1) - (a.subscriptionIpd ?? -1) ||
        a.price.usd - b.price.usd
      );
    }
    if (state.sort === "price") return a.price.usd - b.price.usd;
    if (state.sort === "apiCost") return a.apiPromptCost - b.apiPromptCost;
    if (state.sort === "subsidy") {
      return (b.subsidyMultiplier ?? -1) - (a.subsidyMultiplier ?? -1) || a.price.usd - b.price.usd;
    }
    if (state.sort === "tokens" || state.sort === "tasks") {
      return (b.monthlyTokens ?? -1) - (a.monthlyTokens ?? -1) || a.price.usd - b.price.usd;
    }
    if (state.sort === "aaIpd") {
      return (b.aaIpd ?? -1) - (a.aaIpd ?? -1) || a.price.usd - b.price.usd;
    }
    return (
      (b.subscriptionIpd ?? -1) - (a.subscriptionIpd ?? -1) ||
      (b.subsidyMultiplier ?? -1) - (a.subsidyMultiplier ?? -1) ||
      a.price.usd - b.price.usd
    );
  });
  return result;
});

function offerSources(item: OfferMetrics): Array<Source & { mark: string; label: string }> {
  const ids = [
    item.plan.sourceIds[0],
    item.model.benchmarkSourceIds[0],
    item.model.apiSourceIds[0],
  ];
  return [...new Set(ids.filter(Boolean))]
    .slice(0, 3)
    .map((id, index) => {
      const source = catalog.value.sources.find((entry) => entry.id === id);
      return source
        ? {
            ...source,
            mark: index === 0 ? "↗" : index === 1 ? "◎" : "¥",
            label: index === 0 ? `官方计划：${source.title}` : source.title,
          }
        : null;
    })
    .filter(Boolean);
}

function sectorText(plan: Plan): string {
  return plan.sectors.map((sector) => sectorLabels[sector]).join(" · ");
}

const vendorLogoMap: Record<string, string> = {
  OpenAI: "./logos/openai.svg",
  Anthropic: "./logos/anthropic.svg",
  Google: "./logos/google.svg",
  "Moonshot AI": "./logos/moonshot.svg",
  Perplexity: "./logos/perplexity.svg",
  Cursor: "./logos/cursor.svg",
  xAI: "./logos/xai.svg",
  AWS: "./logos/aws.svg",
  GitHub: "./logos/github.svg",
  QwenCloud: "./logos/qwen.svg",
  "Z.AI": "./logos/zhipu.svg",
  "Xiaomi MiMo": "./logos/xiaomi.svg",
  DeepSeek: "./logos/deepseek.svg",
  Meta: "./logos/meta.svg",
  Replit: "./logos/replit.svg",
  "Command Code": "./logos/commandcode.svg",
  "Token Harbor": "./logos/tokenharbor.svg",
  Cline: "./logos/cline.svg",
  StepFun: "./logos/stepfun.svg",
  JetBrains: "./logos/jetbrains.svg",
};

function vendorLogo(vendor: string): string | null {
  return vendorLogoMap[vendor] || null;
}

function vendorInitial(vendor: string): string {
  if (vendor === "StepFun") return "阶";
  if (vendor === "Moonshot AI") return "K";
  if (vendor === "Anthropic") return "A";
  if (vendor === "Command Code") return "CC";
  if (vendor === "Token Harbor") return "TH";
  if (vendor === "Cline") return "CL";
  return vendor.slice(0, 1);
}

function formatUsd(value: number): string {
  if (!Number.isFinite(value)) return "未知";
  if (value > 0 && value < 0.01) return `$${value.toFixed(4)}`;
  if (value > 0 && value < 1) return `$${value.toFixed(3)}`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function formatNative(value: number): string {
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value < 100 && value % 1 !== 0 ? 1 : 0,
  }).format(value);
}

function formatMetric(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

function formatTokens(tokens: number): string {
  if (!Number.isFinite(tokens) || tokens <= 0) return "未公开";
  if (tokens >= 1_000_000_000) {
    const val = tokens / 1_000_000_000;
    return `${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}B Tokens`;
  }
  if (tokens >= 1_000_000) {
    const val = tokens / 1_000_000;
    return `${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}M Tokens`;
  }
  if (tokens >= 1_000) {
    const val = tokens / 1_000;
    return `${val % 1 === 0 ? val.toFixed(0) : val.toFixed(0)}k Tokens`;
  }
  return `${tokens} Tokens`;
}

function round(value: number, decimals: number): number {
  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
}
</script>

<template>
  <div v-if="loadError" class="page-shell empty-state">
    {{ loadError }}。运行 <code>npm run data:build</code> 重新生成 JSON。
  </div>
  <div v-else-if="!catalog" class="page-shell empty-state">正在读取订阅 JSON…</div>
  <div v-else>
    <header class="topbar">
      <a class="brand" href="#top" aria-label="AI 订阅价值账本首页">
        <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="brand-name">VALUE<span>/</span>LEDGER</span>
      </a>
      <div class="topbar-right">
        <span class="data-stamp"
          ><span class="status-dot"></span> 官网资料截至 <b>{{ catalog.meta.asOf }}</b></span
        >
        <button
          class="theme-toggle"
          type="button"
          :title="isDark ? '切换浅色模式' : '切换暗黑模式'"
          @click="toggleTheme"
        >
          <span aria-hidden="true">{{ isDark ? "☀️" : "🌙" }}</span>
          <span>{{ isDark ? "浅色" : "暗黑" }}</span>
        </button>
        <a class="top-link" href="#sources">来源与口径 <span aria-hidden="true">↗</span></a>
      </div>
    </header>

    <main id="top" class="page-shell">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">
            <span>RESEARCH NOTE 01</span><span class="eyebrow-line"></span><span>订阅经济学</span>
          </p>
          <h1>每一档订阅，<br /><em>逐个模型算清。</em></h1>
          <p class="hero-lede">
            所有付费订阅与其明确支持的 Artificial Analysis 排名前 50
            模型放在同一张表里。按不同思考深度与推理档位（Max / Xhigh / High / Medium /
            Low）细分核算，每任务基准成本与智力指数独立对应，全面算清订阅真实价值。
          </p>
        </div>
        <aside class="hero-aside">
          <div class="aside-index">基准口径 <span>↘</span></div>
          <p>基准排行榜<br /><strong>Artificial Analysis Top 50（含思考档位）</strong></p>
          <p>
            市场口径<br /><strong>{{ catalog.meta.region }}</strong>
          </p>
        </aside>
      </section>

      <section class="stats-row" aria-label="当前数据范围">
        <article class="stat-card stat-ink">
          <span class="stat-label">AA Top 50 细分模型</span
          ><strong>{{ catalog.meta.modelCount }}</strong
          ><small>按思考深度细分且支持订阅</small>
        </article>
        <article class="stat-card">
          <span class="stat-label">订阅 × 模型组合</span><strong>{{ offerCount }}</strong
          ><small>每一行单独计算</small>
        </article>
        <article class="stat-card">
          <span class="stat-label">付费计划</span><strong>{{ catalog.meta.planCount }}</strong
          ><small>含云平台与 Coding Agent</small>
        </article>
        <article class="stat-card">
          <span class="stat-label">可折算额度组合</span><strong>{{ knownOfferCount }}</strong
          ><small>可估算 Credits 或模型专属 API 预算</small>
        </article>
      </section>

      <section class="workbench" aria-labelledby="filtersTitle">
        <div class="section-heading">
          <div>
            <p class="eyebrow">COMPARE</p>
            <h2 id="filtersTitle">筛选比较项</h2>
          </div>
          <label class="price-mode"
            >价格口径
            <select v-model="state.priceMode" aria-label="价格口径">
              <option value="monthly">月付标价</option>
              <option value="annual">年付折合月价（若有）</option>
            </select>
          </label>
        </div>

        <div class="sector-tabs" role="group" aria-label="厂商类别">
          <button
            class="sector-tab"
            :class="{ 'is-active': state.sector === 'all' }"
            type="button"
            @click="onSectorChange('all')"
          >
            全部类别 <span>{{ offerCount }}</span>
          </button>
          <button
            class="sector-tab"
            :class="{ 'is-active': state.sector === 'ai' }"
            type="button"
            @click="onSectorChange('ai')"
          >
            大模型厂商 <span>{{ sectorCounts.ai }}</span>
          </button>
          <button
            class="sector-tab"
            :class="{ 'is-active': state.sector === 'cloud' }"
            type="button"
            @click="onSectorChange('cloud')"
          >
            云服务厂商 <span>{{ sectorCounts.cloud }}</span>
          </button>
          <button
            class="sector-tab"
            :class="{ 'is-active': state.sector === 'coding' }"
            type="button"
            @click="onSectorChange('coding')"
          >
            Coding Agent <span>{{ sectorCounts.coding }}</span>
          </button>
        </div>

        <div class="filter-grid">
          <label class="field search-field">
            <span>搜索</span>
            <div class="search-wrap">
              <span aria-hidden="true">⌕</span>
              <input
                ref="searchInput"
                v-model="state.query"
                type="search"
                placeholder="搜索厂商、订阅或模型…"
              />
              <kbd class="search-kbd">⌘K</kbd>
            </div>
          </label>

          <label class="field">
            <span>厂商</span>
            <select v-model="state.vendor" @change="onVendorChange">
              <option value="all">所有厂商 ({{ vendorOptions.length }})</option>
              <option v-for="v in vendorOptions" :key="v.name" :value="v.name">
                {{ v.name }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>订阅计划</span>
            <select v-model="state.plan" @change="onPlanChange">
              <option value="all">所有订阅 ({{ planOptions.length }})</option>
              <option v-for="p in planOptions" :key="p.id" :value="p.id">
                {{ p.label }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>模型</span>
            <select v-model="state.model">
              <option value="all">所有模型 ({{ modelOptions.length }})</option>
              <option v-for="model in modelOptions" :key="model.id" :value="model.id">
                {{ model.family }} · {{ model.effort }} ({{ model.provider }})
              </option>
            </select>
          </label>

          <label class="field">
            <span>价格段</span>
            <select v-model="state.band">
              <option value="all">所有价格</option>
              <option v-for="band in catalog.meta.priceBandsUsd" :key="band.id" :value="band.id">
                {{ band.label }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>数据置信度</span>
            <select v-model="state.confidence">
              <option value="all">全部置信度</option>
              <option value="S">S 官方明确 ({{ catalog.meta.confidenceCounts?.S ?? 0 }})</option>
              <option value="A">A 多方验证 ({{ catalog.meta.confidenceCounts?.A ?? 0 }})</option>
              <option value="B">B 单方测试 ({{ catalog.meta.confidenceCounts?.B ?? 0 }})</option>
              <option value="C">C 不可信 ({{ catalog.meta.confidenceCounts?.C ?? 0 }})</option>
            </select>
          </label>

          <label class="field">
            <span>排序</span>
            <select v-model="state.sort">
              <option value="subscriptionIpd">每美元订阅智能（含补贴）：高到低</option>
              <option value="confidence">数据置信度：S 明确 到 C 不可信</option>
              <option value="subsidy">官方补贴倍率：高到低</option>
              <option value="tokens">包含月 Token 额度：多到少</option>
              <option value="price">订阅月费：低到高</option>
              <option value="aaIpd">AA 原生 API 效费比：高到低</option>
            </select>
          </label>
        </div>

        <div v-if="hasActiveFilters" class="active-filters-bar">
          <span class="active-filters-label">已筛选：</span>
          <span v-if="state.sector !== 'all'" class="filter-pill">
            类别：{{ sectorLabels[state.sector] }}
            <button type="button" @click="onSectorChange('all')">×</button>
          </span>
          <span v-if="state.vendor !== 'all'" class="filter-pill">
            厂商：{{ state.vendor }}
            <button
              type="button"
              @click="
                state.vendor = 'all';
                onVendorChange();
              "
            >
              ×
            </button>
          </span>
          <span v-if="state.plan !== 'all'" class="filter-pill">
            订阅：{{ planOptions.find((p) => p.id === state.plan)?.name || state.plan }}
            <button type="button" @click="state.plan = 'all'">×</button>
          </span>
          <span v-if="state.model !== 'all'" class="filter-pill">
            模型：{{ modelOptions.find((m) => m.id === state.model)?.family || state.model }}
            <button type="button" @click="state.model = 'all'">×</button>
          </span>
          <span v-if="state.band !== 'all'" class="filter-pill">
            价格：{{ catalog.meta.priceBandsUsd.find((b) => b.id === state.band)?.label }}
            <button type="button" @click="state.band = 'all'">×</button>
          </span>
          <span v-if="state.confidence !== 'all'" class="filter-pill">
            置信度：{{ state.confidence }}
            <button type="button" @click="state.confidence = 'all'">×</button>
          </span>
          <span v-if="state.query.trim()" class="filter-pill">
            关键词：“{{ state.query }}”
            <button type="button" @click="state.query = ''">×</button>
          </span>
          <button class="reset-filters-btn" type="button" @click="resetFilters">
            重置全部筛选
          </button>
        </div>

        <div class="scenario-strip">
          <div class="scenario-title">
            <span class="scenario-icon">↗</span>
            <div class="scenario-text">
              <b>标准化 API 场景</b>
              <small>用于把输入 / 输出 token 换算成一次参考请求</small>
            </div>
          </div>
          <div class="scenario-inputs">
            <label class="scenario-field">
              <span>输入 tokens</span>
              <input v-model.number="state.inputTokens" type="number" min="0" step="1000" />
            </label>
            <label class="scenario-field">
              <span>输出 tokens</span>
              <input v-model.number="state.outputTokens" type="number" min="0" step="500" />
            </label>
          </div>
          <p class="scenario-note">
            用于折算单次请求标准成本，并以此评估订阅实际提供的 API 算力价值与补贴倍率。
          </p>
        </div>

        <!-- 社区实测与 Token 核算机制权威说明 -->
        <div class="methodology-note-box">
          <div class="note-box-header">
            <span class="note-box-icon">💡</span>
            <strong>核算逻辑：以 Artificial Analysis（AA）官方实测数据为基准驱动</strong>
          </div>
          <p class="note-box-body">
            综合效费比计算链：① <b>基准锚定</b>：单任务成本与 Token 吞吐严格采用 Artificial Analysis
            真实评测数据（Cost per Task 与 Tokens per Task），彻底废除人为写死的静态假设；<br />
            ② <b>月度实测任务数</b>：根据套餐可用等值 API 算力金额除以模型在 AA
            上的实测单任务成本（aaTaskUsd），得出真实月度可完成的标准任务数；<br />
            ③ <b>月度 Token 吞吐</b>：月度标准任务数 ✖️ 该模型在 AA 测试中的单任务实际消耗 Token
            总量（包含思考推理 Reasoning Tokens 与输出 Answer Tokens）；<br />
            ④ <b>每美元订阅智能</b>：Subscription IPD ＝ （月度完成任务数 ✖️ AA 综合智能指数）➗
            订阅月费 ＝ 官方算力补贴倍率 ✖️ AA 原生 API 效费比。
          </p>
        </div>

        <!-- 置信度分级体系权威说明 -->
        <div class="confidence-legend-panel">
          <div class="legend-panel-header">
            <span class="legend-badge">置信度评级</span>
            <strong
              >数据溯源与真实度评级标准（S 官方明确 / A 多方验证 / B 单方测试 / C 不可信）</strong
            >
          </div>
          <div class="confidence-grid-cards">
            <div
              class="confidence-card-item is-s"
              :class="{ 'is-selected': state.confidence === 'S' }"
              @click="state.confidence = state.confidence === 'S' ? 'all' : 'S'"
            >
              <div class="card-item-top">
                <span class="confidence-badge is-s"
                  ><span class="confidence-dot"></span>S 官方明确</span
                >
                <span class="card-count">{{ catalog.meta.confidenceCounts?.S ?? 0 }} 组合</span>
              </div>
              <p>
                官方公布白纸黑字 SLA / 配额表（如 Copilot Credits、Cursor 500 Fast、AWS Kiro、小米
                MiMo、通义包）。
              </p>
            </div>
            <div
              class="confidence-card-item is-a"
              :class="{ 'is-selected': state.confidence === 'A' }"
              @click="state.confidence = state.confidence === 'A' ? 'all' : 'A'"
            >
              <div class="card-item-top">
                <span class="confidence-badge is-a"
                  ><span class="confidence-dot"></span>A 多方验证</span
                >
                <span class="card-count">{{ catalog.meta.confidenceCounts?.A ?? 0 }} 组合</span>
              </div>
              <p>
                官方限定 3~5h 滑动窗口，经社区重度开发者与多方第三方评测交叉验证实际 Token 吞吐（如
                ChatGPT Plus、Claude Pro）。
              </p>
            </div>
            <div
              class="confidence-card-item is-b"
              :class="{ 'is-selected': state.confidence === 'B' }"
              @click="state.confidence = state.confidence === 'B' ? 'all' : 'B'"
            >
              <div class="card-item-top">
                <span class="confidence-badge is-b"
                  ><span class="confidence-dot"></span>B 单方测试</span
                >
                <span class="card-count">{{ catalog.meta.confidenceCounts?.B ?? 0 }} 组合</span>
              </div>
              <p>
                官方仅给出模糊倍率或 Agent 任务次数粗估，缺乏白纸黑字
                SLA，源于单方样本测试或厂商粗测（如 Kimi、Claude 5x/20x）。
              </p>
            </div>
            <div
              class="confidence-card-item is-c"
              :class="{ 'is-selected': state.confidence === 'C' }"
              @click="state.confidence = state.confidence === 'C' ? 'all' : 'C'"
            >
              <div class="card-item-top">
                <span class="confidence-badge is-c"
                  ><span class="confidence-dot"></span>C 不可信</span
                >
                <span class="card-count">{{ catalog.meta.confidenceCounts?.C ?? 0 }} 组合</span>
              </div>
              <p>
                宣称无限或数倍但无基准 Baseline，存在未公开的动态截断/降频或无法独立验证（如 Google
                AI 2x/4x、xAI SuperGrok、Perplexity）。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="results-section" aria-labelledby="resultsTitle">
        <div class="results-heading">
          <div>
            <p class="eyebrow">PLAN × MODEL</p>
            <h2 id="resultsTitle">所有计划 × 模型</h2>
          </div>
          <div class="results-actions">
            <div class="results-meta">
              <span class="results-badge">{{ filteredOffers.length }} 个组合</span>
              <span class="results-separator">/</span>
              <span>按每 $1 订阅费智能量独立核算</span>
            </div>
            <div class="view-toggle" role="group" aria-label="展示视图切换">
              <button
                type="button"
                class="view-toggle-btn"
                :class="{ 'is-active': state.viewMode === 'cards' }"
                @click="state.viewMode = 'cards'"
              >
                <span class="btn-icon">🗂️</span> 卡片视图
              </button>
              <button
                type="button"
                class="view-toggle-btn"
                :class="{ 'is-active': state.viewMode === 'table' }"
                @click="state.viewMode = 'table'"
              >
                <span class="btn-icon">📋</span> 表格视图
              </button>
            </div>
          </div>
        </div>

        <!-- 1. 卡片网格视图 (默认推荐，响应式排版) -->
        <div
          v-if="filteredOffers.length && state.viewMode === 'cards'"
          class="cards-grid"
          aria-live="polite"
        >
          <article
            v-for="(item, index) in filteredOffers"
            :key="item.id"
            class="offer-card"
            :class="{ 'is-top-rank': index === 0 }"
          >
            <!-- 头部：厂商 Logo、订阅产品、月费 -->
            <div class="card-header">
              <div class="card-vendor-plan">
                <span class="vendor-stamp" :title="item.plan.vendor">
                  <img
                    v-if="vendorLogo(item.plan.vendor)"
                    :src="vendorLogo(item.plan.vendor)!"
                    :alt="item.plan.vendor"
                    class="vendor-logo-img"
                    loading="lazy"
                  />
                  <span v-else class="vendor-initial-fallback">{{
                    vendorInitial(item.plan.vendor)
                  }}</span>
                </span>
                <div class="card-vendor-info">
                  <div class="card-vendor-line">
                    <span class="vendor-name">{{ item.plan.vendor }}</span>
                    <span class="sector-chip" :class="`is-${item.plan.sectors[0]}`">{{
                      sectorText(item.plan)
                    }}</span>
                    <span
                      class="confidence-badge"
                      :class="`is-${item.confidence.toLowerCase()}`"
                      :title="`${confidenceMeta[item.confidence]?.label}：${item.confidenceReason}`"
                    >
                      <span class="confidence-dot"></span>
                      {{ confidenceMeta[item.confidence]?.label }}
                    </span>
                  </div>
                  <div class="card-plan-title">
                    <strong>{{ item.plan.product }}</strong>
                    <span class="plan-subname">{{ item.plan.name }}</span>
                    <small v-if="item.plan.seat" class="seat-badge">按席位</small>
                  </div>
                </div>
              </div>
              <div class="card-price-box">
                <div class="card-price-main">
                  <strong class="card-price-usd">{{ formatUsd(item.price.usd) }}</strong>
                  <span class="card-price-unit">/月</span>
                </div>
                <div class="card-price-caption">
                  <span>{{ item.price.label }}</span>
                  <small v-if="item.plan.currency === 'CNY'" class="native-price">
                    ¥{{ formatNative(item.price.native) }} 原币
                  </small>
                </div>
              </div>
            </div>

            <!-- 模型信息行 -->
            <div class="card-model-row">
              <div class="card-model-info">
                <a
                  :href="item.model.aaUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="model-name-link"
                >
                  {{ item.model.name }} <span class="ext-arrow" aria-hidden="true">↗</span>
                </a>
                <span class="model-meta-tag"
                  >{{ item.model.released }} · {{ item.model.effort }}</span
                >
              </div>
              <div
                v-if="item.model.aaIndex !== null"
                class="card-aa-badge"
                title="Artificial Analysis 权威综合智能指数"
              >
                <span class="aa-label">AA 指数</span>
                <span class="aa-val">{{ item.model.aaIndex }}</span>
              </div>
            </div>

            <!-- 三大核心指标看板 -->
            <div class="card-metrics-grid">
              <!-- 指标 1：每 $1 订阅费智能 (核心收益) -->
              <div class="metric-box metric-box-primary">
                <span class="metric-box-title">每 $1 订阅智能 (IPD)</span>
                <template v-if="item.subscriptionIpd !== null">
                  <strong class="metric-main-val is-green">{{
                    formatMetric(item.subscriptionIpd)
                  }}</strong>
                  <span class="metric-caption-text">
                    {{
                      item.estimatedTasks !== null
                        ? `月跑约 ${Math.round(item.estimatedTasks)} 次 AA 实测任务`
                        : "含官方额度与算力补贴"
                    }}
                  </span>
                </template>
                <template v-else-if="item.aaIpd !== null">
                  <strong class="metric-main-val">{{ formatMetric(item.aaIpd) }}</strong>
                  <span class="metric-caption-text">AA 原生 API 基准效费比</span>
                </template>
                <template v-else>
                  <strong class="metric-main-val text-muted">暂无评测</strong>
                  <span class="metric-caption-text">{{
                    item.model.benchmarkNote || "AA 暂无可比指数"
                  }}</span>
                </template>
              </div>

              <!-- 指标 2：官方算力补贴倍率 -->
              <div class="metric-box">
                <span class="metric-box-title">官方算力补贴</span>
                <template v-if="item.subsidyMultiplier !== null">
                  <div class="subsidy-badge-wrap">
                    <span
                      class="subsidy-badge"
                      :class="{
                        'is-high': item.subsidyMultiplier >= 3,
                        'is-low': item.subsidyMultiplier < 1,
                      }"
                    >
                      {{
                        item.subsidyMultiplier >= 1
                          ? `补贴 ${item.subsidyMultiplier.toFixed(1)}×`
                          : `溢价 ${item.subsidyMultiplier.toFixed(1)}× (未补贴)`
                      }}
                    </span>
                  </div>
                  <span class="metric-caption-text">
                    {{
                      item.subsidyMultiplier >= 1
                        ? `享 ${formatUsd(item.apiEquivalentValue ?? 0)} 算力价值`
                        : `仅 ${formatUsd(item.apiEquivalentValue ?? 0)} 算力（轻量模型买订阅倒贴）`
                    }}
                  </span>
                </template>
                <template v-else>
                  <div class="subsidy-badge-wrap">
                    <span class="subsidy-badge is-neutral">按量基准</span>
                  </div>
                  <span class="metric-caption-text">
                    {{
                      item.apiBudgetPrompts
                        ? formatNumber(item.apiBudgetPrompts) + "× 月费等值"
                        : "按量计费"
                    }}
                  </span>
                </template>
              </div>

              <!-- 指标 3：包含月 Token 额度与单次 API 成本 -->
              <div class="metric-box">
                <span class="metric-box-title">包含月 Token 额度</span>
                <template v-if="item.monthlyTokens !== null">
                  <strong class="metric-main-val">
                    ≈ {{ formatTokens(item.monthlyTokens) }}<small>/月</small>
                  </strong>
                  <span
                    class="metric-caption-text"
                    v-if="item.model.aaTaskUsd !== null && item.model.aaTotalTokens"
                  >
                    AA 单任务 {{ formatUsd(item.model.aaTaskUsd) }} (≈
                    {{ formatTokens(item.model.aaTotalTokens) }})
                  </span>
                  <span class="metric-caption-text" v-else>
                    单次参考 API {{ formatUsd(item.apiPromptCost) }}
                  </span>
                </template>
                <template v-else>
                  <strong class="metric-main-val text-muted">未公开/按量</strong>
                  <span class="metric-caption-text">
                    单次参考 API {{ formatUsd(item.apiPromptCost) }}
                  </span>
                </template>
              </div>
            </div>

            <!-- 卡片底部：额度规则明细与数据溯源 -->
            <div class="card-footer">
              <div class="card-footer-top">
                <div class="card-quota-rule">
                  <span class="quota-icon" aria-hidden="true">ℹ</span>
                  <span class="quota-text" :title="item.plan.usage.label">{{
                    item.plan.usage.label
                  }}</span>
                </div>
                <div class="card-sources">
                  <a
                    v-for="source in offerSources(item)"
                    :key="source.id"
                    :href="source.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    :title="source.label"
                    :aria-label="source.label"
                    class="source-chip"
                  >
                    <span class="source-chip-mark">{{ source.mark }}</span>
                    <span class="source-chip-text">{{ source.title }}</span>
                  </a>
                </div>
              </div>
              <div
                class="card-confidence-rule"
                :title="`${confidenceMeta[item.confidence]?.label}：${item.confidenceReason}`"
              >
                <span class="confidence-dot" :class="`is-${item.confidence.toLowerCase()}`"></span>
                <span class="confidence-rule-text"
                  ><b>{{ confidenceMeta[item.confidence]?.label }}</b> ·
                  {{ item.confidenceReason }}</span
                >
              </div>
            </div>
          </article>
        </div>

        <!-- 2. 表格对比视图 (适合宽屏密集对比) -->
        <div
          v-else-if="filteredOffers.length && state.viewMode === 'table'"
          class="comparison-scroll"
          aria-live="polite"
        >
          <table class="comparison-table">
            <thead>
              <tr>
                <th scope="col">厂家</th>
                <th scope="col">订阅</th>
                <th scope="col">模型</th>
                <th scope="col">置信度</th>
                <th scope="col">月费</th>
                <th scope="col">包含月 Token 额度 & 单次成本</th>
                <th scope="col">等效 API 价值 & 补贴倍率</th>
                <th scope="col">每美元订阅智能 (IPD)</th>
                <th scope="col" aria-label="来源">源</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredOffers" :key="item.id">
                <td data-label="厂家" class="vendor-cell">
                  <div class="vendor-wrap">
                    <span class="vendor-stamp" :title="item.plan.vendor">
                      <img
                        v-if="vendorLogo(item.plan.vendor)"
                        :src="vendorLogo(item.plan.vendor)!"
                        :alt="item.plan.vendor"
                        class="vendor-logo-img"
                        loading="lazy"
                      />
                      <span v-else class="vendor-initial-fallback">{{
                        vendorInitial(item.plan.vendor)
                      }}</span>
                    </span>
                    <div class="vendor-info">
                      <span class="vendor-name">{{ item.plan.vendor }}</span>
                      <span class="sector-chip" :class="`is-${item.plan.sectors[0]}`">{{
                        sectorText(item.plan)
                      }}</span>
                    </div>
                  </div>
                </td>
                <td data-label="订阅" class="subscription-cell">
                  <div class="cell-flow">
                    <strong>{{ item.plan.product }}</strong>
                    <span>{{ item.plan.name }}</span>
                    <small v-if="item.plan.seat" class="seat-badge">按席位计价</small>
                  </div>
                </td>
                <td data-label="模型" class="model-cell">
                  <div class="cell-flow">
                    <a :href="item.model.aaUrl" target="_blank" rel="noopener noreferrer">
                      {{ item.model.name }} <span aria-hidden="true">↗</span>
                    </a>
                    <small>{{ item.model.released }} · {{ item.model.effort }}</small>
                  </div>
                </td>
                <td data-label="置信度" class="confidence-cell">
                  <div class="cell-flow">
                    <span
                      class="confidence-badge"
                      :class="`is-${item.confidence.toLowerCase()}`"
                      :title="`${confidenceMeta[item.confidence]?.label}：${item.confidenceReason}`"
                    >
                      <span class="confidence-dot"></span>
                      {{ confidenceMeta[item.confidence]?.label }}
                    </span>
                    <small class="confidence-reason-text" :title="item.confidenceReason">
                      {{ item.confidenceReason }}
                    </small>
                  </div>
                </td>
                <td data-label="月费" class="price-cell">
                  <div class="cell-flow">
                    <strong>{{ formatUsd(item.price.usd) }}<small>/月</small></strong>
                    <span>{{ item.price.label }}</span>
                    <small v-if="item.plan.currency === 'CNY'" class="native-price"
                      >¥{{ formatNative(item.price.native) }} 原币</small
                    >
                  </div>
                </td>
                <td data-label="包含月 Token 额度 & 单次成本" class="api-cell">
                  <div class="cell-flow">
                    <strong class="api-cost" v-if="item.monthlyTokens !== null">
                      ≈ {{ formatTokens(item.monthlyTokens) }}<small>/月</small>
                    </strong>
                    <strong class="api-cost" v-else>未公开</strong>
                    <span
                      class="api-caption"
                      v-if="item.model.aaTaskUsd !== null && item.model.aaTotalTokens"
                    >
                      AA 单任务 {{ formatUsd(item.model.aaTaskUsd) }} (≈
                      {{ formatTokens(item.model.aaTotalTokens) }})
                    </span>
                    <span class="api-caption" v-else>
                      单次参考 API {{ formatUsd(item.apiPromptCost) }}
                    </span>
                    <small class="quota-label-text">{{ item.plan.usage.label }}</small>
                  </div>
                </td>
                <td data-label="等效 API 价值 & 补贴倍率" class="subsidy-cell">
                  <div class="cell-flow">
                    <template v-if="item.subsidyMultiplier !== null">
                      <strong
                        class="subsidy-badge"
                        :class="{
                          'is-high': item.subsidyMultiplier >= 3,
                          'is-low': item.subsidyMultiplier < 1,
                        }"
                      >
                        {{
                          item.subsidyMultiplier >= 1
                            ? `补贴 ${item.subsidyMultiplier.toFixed(1)}×`
                            : `溢价 ${item.subsidyMultiplier.toFixed(1)}× (未补贴)`
                        }}
                      </strong>
                      <span class="api-value">
                        等效 API 价值 {{ formatUsd(item.apiEquivalentValue ?? 0) }}
                      </span>
                      <small class="subsidy-note">
                        {{
                          item.subsidyMultiplier >= 1
                            ? `享 ${formatUsd(item.apiEquivalentValue ?? 0)} 算力 / ${formatUsd(item.price.usd)} 订阅费`
                            : `轻量模型 API 白菜价，买订阅倒贴，建议直接用免费版或 API`
                        }}
                      </small>
                    </template>
                    <template v-else>
                      <strong class="subsidy-badge is-neutral">按量基准</strong>
                      <span class="api-value">{{
                        item.apiBudgetPrompts
                          ? formatNumber(item.apiBudgetPrompts) + "× 月费等值"
                          : "API 单价未知"
                      }}</span>
                      <small class="subsidy-note">无固定配额</small>
                    </template>
                  </div>
                </td>
                <td data-label="每美元订阅智能 (IPD)" class="ipd-cell">
                  <div class="cell-flow">
                    <template v-if="item.subscriptionIpd !== null">
                      <strong class="sub-ipd-strong">{{
                        formatMetric(item.subscriptionIpd)
                      }}</strong>
                      <span class="sub-ipd-sub">每 $1 订阅费智能量</span>
                      <small v-if="item.aaIpd !== null">
                        AA 原生 API IPD: {{ formatMetric(item.aaIpd) }}
                      </small>
                    </template>
                    <template v-else-if="item.aaIpd !== null">
                      <strong class="no-benchmark">{{ formatMetric(item.aaIpd) }}</strong>
                      <span class="sub-ipd-sub">AA 原生 API 基准</span>
                      <small>模型自身 API 效费比</small>
                    </template>
                    <template v-else>
                      <strong class="no-benchmark">暂无评测</strong>
                      <span>AA 暂无可比指数</span>
                      <small>{{ item.model.benchmarkNote }}</small>
                    </template>
                  </div>
                </td>
                <td data-label="来源" class="source-cell">
                  <div class="source-wrap">
                    <a
                      v-for="source in offerSources(item)"
                      :key="source.id"
                      :href="source.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      :title="source.label"
                      :aria-label="source.label"
                      >{{ source.mark }}</a
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty-state">
          <span>∅</span>
          <p>没有符合条件的组合</p>
          <small>调整类别、价格段或关键词再试一次。</small>
        </div>
      </section>

      <section
        v-if="filteredUnpairedPlans.length"
        class="unpaired-section"
        aria-labelledby="unpairedTitle"
      >
        <div class="section-heading compact-heading">
          <div>
            <p class="eyebrow">COVERAGE NOTES</p>
            <h2 id="unpairedTitle">已纳入目录，暂不做模型级排名</h2>
          </div>
          <span class="coverage-count">{{ filteredUnpairedPlans.length }} 条计划</span>
        </div>
        <div class="unpaired-grid">
          <article v-for="plan in filteredUnpairedPlans" :key="plan.id" class="unpaired-card">
            <div class="unpaired-name">
              <div class="unpaired-title-row">
                <b>{{ plan.vendor }} · {{ plan.product }} {{ plan.name }}</b>
                <span
                  class="confidence-badge"
                  :class="`is-${(plan.confidence || 'a').toLowerCase()}`"
                  :title="`${confidenceMeta[plan.confidence as ConfidenceLevel]?.label || plan.confidence}：${plan.confidenceReason || plan.reason}`"
                >
                  <span class="confidence-dot"></span>
                  {{
                    confidenceMeta[plan.confidence as ConfidenceLevel]?.label ||
                    plan.confidence ||
                    "A 高可信"
                  }}
                </span>
              </div>
              <span>{{ plan.usageLabel }}</span>
            </div>
            <div class="unpaired-price">
              {{ formatUsd(plan.monthlyPriceUsd) }} / 月 {{ plan.seat ? "· 每席位" : "" }}
            </div>
            <div class="unpaired-reason">
              {{ plan.reason }}
              <a
                v-for="sourceId in plan.sourceIds"
                :key="sourceId"
                :href="catalog.sources.find((source) => source.id === sourceId)?.url"
                target="_blank"
                rel="noopener noreferrer"
                >查看来源 ↗</a
              >
            </div>
          </article>
        </div>
      </section>

      <section class="method-section" id="method">
        <div class="method-intro">
          <p class="eyebrow">HOW TO READ THIS</p>
          <h2>订阅补贴与每元智能，<br /><em>彻底算清账。</em></h2>
          <p>
            各家订阅并非简单的按量计价。ChatGPT Plus 与 Claude Pro
            等通用订阅包含了大量官方算力补贴，必须结合官方限频与额度模型综合核算。
          </p>
        </div>
        <div class="method-cards">
          <article>
            <span class="method-number">01</span>
            <h3>平台补贴 & 等效 API</h3>
            <p>
              按官方限频与额度计算每月可完成任务量，再乘以官方 API
              标准单价，算出平台实际提供了多少倍于月费的算力补贴。
            </p>
            <code>月可用任务 × 单次 API 成本 ÷ 订阅月费</code>
          </article>
          <article>
            <span class="method-number">02</span>
            <h3>每美元订阅智能 (IPD)</h3>
            <p>
              核心比较指标！每一美元订阅月费真正买到的综合智能量。结合了平台额度补贴、模型能力（AA
              指数）与订阅门槛。
            </p>
            <code>月可用任务 × 模型 AA 指数 ÷ 订阅月费</code>
          </article>
          <article>
            <span class="method-number">03</span>
            <h3>AA 原生 API 效费比</h3>
            <p>
              模型在官方原始 API 侧的单任务能效基准。它是模型底层的能效分，用于检验厂商 API
              本身是否廉价高效。
            </p>
            <code>AA 智能指数 ÷ AA 单任务 API 成本</code>
          </article>
        </div>
        <p class="method-footnote">
          <span>!</span> “月费 API 等值”只是把订阅价格按公开 API
          单价换算的假设购买力，绝不表示订阅套餐实际包含这些请求。
        </p>
      </section>

      <details class="sources-panel" id="sources">
        <summary>
          <span
            ><b>来源、汇率与数据边界</b
            ><small>逐项回到厂商官网和 Artificial Analysis 原始页面</small></span
          ><span class="summary-action">展开来源 <i>＋</i></span>
        </summary>
        <div class="source-tools">
          <span>{{ catalog.sources.length }} 个来源</span
          ><span
            >采集口径：<b>{{ catalog.meta.asOf }}</b></span
          ><span
            >人民币换算：<b
              >1 USD = {{ catalog.meta.usdToCny.rate }} CNY（{{ catalog.meta.usdToCny.asOf }}）</b
            ></span
          >
        </div>
        <div class="sources-list">
          <div v-for="source in catalog.sources" :key="source.id" class="source-item">
            <span class="source-kind">{{ sourceTypes[source.type] || source.type }}</span>
            <div class="source-detail">
              <a :href="source.url" target="_blank" rel="noopener noreferrer"
                >{{ source.title }} ↗</a
              ><small v-if="source.checkedAt">核验 {{ source.checkedAt }}</small>
            </div>
          </div>
        </div>
        <div class="source-disclosure">
          <b>纳入 / 排除说明</b>
          <p>
            只列当前公开付费订阅，不列免费档和试用。模型以真实发布日期筛选。官方未指定型号或未公开模型级额度的计划可出现在目录说明中，但不会得到推测出来的模型
            IPD。价格为公开地区标价，税费、促销、账号资格和分阶段上线可能影响实际结账。
          </p>
        </div>
      </details>
    </main>

    <footer class="footer">
      <span>VALUE/LEDGER · AI SUBSCRIPTION INDEX</span
      ><span>公开数据选型参考 · 不代表任何厂商权益承诺</span>
    </footer>
  </div>
</template>
