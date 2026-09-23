<script setup lang="ts" vapor>
import { computed, onMounted, reactive, ref } from "vue";

type Sector = "ai" | "cloud" | "coding";
type UsageKind = "opaque" | "usdCredits" | "kiroCredits" | "modelCredits" | "perModelUsdBudget";

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

interface Catalog {
  meta: {
    asOf: string;
    windowStart: string;
    region: string;
    planCount: number;
    modelCount: number;
    defaultScenario: { inputTokens: number; outputTokens: number; cachedInputTokens?: number };
    priceBandsUsd: Array<{ id: string; label: string; min: number; max: number | null }>;
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
  aaIpd: number | null;
  estimatedTasks: number | null;
  subscriptionIpd: number | null;
}

const catalog = ref<Catalog | null>(null);
const loadError = ref("");
const state = reactive({
  sector: "all",
  band: "all",
  model: "all",
  sort: "ipd",
  priceMode: "monthly",
  query: "",
  inputTokens: 10000,
  outputTokens: 2000,
});

const sourceTypes = {
  subscription: "订阅价格",
  access: "模型可用性",
  "api-price": "API 价格",
  benchmark: "智能评测",
  quota: "额度说明",
  fx: "汇率",
};
const sectorLabels = { ai: "AI 厂商", cloud: "云平台", coding: "Coding Agent" };

onMounted(async () => {
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
  const creditPlanIds = new Set(
    catalog.value.plans
      .filter((plan) =>
        ["usdCredits", "modelCredits", "perModelUsdBudget"].includes(plan.usage.kind),
      )
      .map((plan) => plan.id),
  );
  return catalog.value.offers.filter((offer) => creditPlanIds.has(offer.planId)).length;
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
    baseline?.apiPromptCostUsd ?? promptCost(model.apiInputUsdPerM, model.apiOutputUsdPerM);
  const aaIpd =
    baseline?.aaIpd ??
    (model.aaIndex !== null && model.aaTaskUsd !== null ? model.aaIndex / model.aaTaskUsd : null);
  const apiBudgetPrompts =
    baseline?.apiEquivalentPrompts ?? (apiPromptCost > 0 ? price.usd / apiPromptCost : null);
  const billedRates =
    plan.vendor === "GitHub" && data.copilotRates[model.id]
      ? data.copilotRates[model.id]
      : { inputUsdPerM: model.apiInputUsdPerM, outputUsdPerM: model.apiOutputUsdPerM };
  const billedPromptCost = promptCost(billedRates.inputUsdPerM, billedRates.outputUsdPerM);
  let estimatedTasks: number | null = null;
  let subscriptionIpd: number | null = null;
  if (plan.usage.kind === "usdCredits" && billedPromptCost > 0) {
    estimatedTasks =
      baseline?.estimatedTasksPerMonth ?? (plan.usage.credits * 0.01) / billedPromptCost;
    subscriptionIpd = baseline?.subscriptionIpd ?? (estimatedTasks * model.aaIndex) / price.usd;
  } else if (plan.usage.kind === "perModelUsdBudget" && billedPromptCost > 0) {
    const monthlyModelBudget = plan.usage.modelBudgetUsdById?.[model.id];
    if (monthlyModelBudget !== undefined) {
      estimatedTasks = monthlyModelBudget / billedPromptCost;
      subscriptionIpd = (estimatedTasks * model.aaIndex) / price.usd;
    }
  } else if (plan.usage.kind === "modelCredits") {
    const rates = plan.usage.modelCreditsPerMillionTokens?.[model.id];
    if (rates) {
      const modelCreditCost =
        (state.inputTokens * rates.input + state.outputTokens * rates.output) / 1_000_000;
      if (modelCreditCost > 0) {
        estimatedTasks =
          ((plan.usage.credits ?? 0) * (30 / (plan.usage.creditWindowDays ?? 30))) /
          modelCreditCost;
        subscriptionIpd =
          model.aaIndex === null ? null : (estimatedTasks * model.aaIndex) / price.usd;
      }
    }
  }
  return {
    ...offer,
    plan,
    model,
    price,
    apiPromptCost,
    apiBudgetPrompts,
    aaIpd,
    estimatedTasks,
    subscriptionIpd,
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
  const result = catalog.value.offers.map(getOfferMetrics).filter((item) => {
    const searchable =
      `${item.plan.vendor} ${item.plan.product} ${item.plan.name} ${item.model.name} ${item.model.family}`.toLowerCase();
    return (
      (state.sector === "all" || item.plan.sectors.includes(state.sector)) &&
      (state.band === "all" || state.band === bandIdFor(item.price.usd)) &&
      (state.model === "all" || state.model === item.model.id) &&
      (!state.query || searchable.includes(state.query))
    );
  });
  result.sort((a, b) => {
    if (state.sort === "price") return a.price.usd - b.price.usd;
    if (state.sort === "apiCost") return a.apiPromptCost - b.apiPromptCost;
    if (state.sort === "subscriptionIpd") {
      return (b.subscriptionIpd ?? -1) - (a.subscriptionIpd ?? -1);
    }
    return (b.aaIpd ?? -1) - (a.aaIpd ?? -1) || a.price.usd - b.price.usd;
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

function vendorInitial(vendor: string): string {
  return vendor === "Moonshot AI" ? "K" : vendor === "Anthropic" ? "A" : vendor.slice(0, 1);
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
            所有付费订阅与其明确支持的近期模型放在同一张表里。价格段只是筛选条件；标准 API
            等值、倍率与每美元智能指数按每个组合独立计算。
          </p>
        </div>
        <aside class="hero-aside">
          <div class="aside-index">本期范围 <span>↘</span></div>
          <p>
            模型发布日期<br /><strong
              >{{ catalog.meta.windowStart }} — {{ catalog.meta.asOf }}</strong
            >
          </p>
          <p>
            市场口径<br /><strong>{{ catalog.meta.region }}</strong>
          </p>
        </aside>
      </section>

      <section class="stats-row" aria-label="当前数据范围">
        <article class="stat-card stat-ink">
          <span class="stat-label">可比近期模型</span><strong>{{ catalog.meta.modelCount }}</strong
          ><small>发布于窗口内且有付费计划权益</small>
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
            @click="state.sector = 'all'"
          >
            全部厂商 <span>{{ offerCount }}</span>
          </button>
          <button
            class="sector-tab"
            :class="{ 'is-active': state.sector === 'ai' }"
            type="button"
            @click="state.sector = 'ai'"
          >
            AI 厂商
          </button>
          <button
            class="sector-tab"
            :class="{ 'is-active': state.sector === 'cloud' }"
            type="button"
            @click="state.sector = 'cloud'"
          >
            云平台
          </button>
          <button
            class="sector-tab"
            :class="{ 'is-active': state.sector === 'coding' }"
            type="button"
            @click="state.sector = 'coding'"
          >
            Coding Agent
          </button>
        </div>

        <div class="filter-grid">
          <label class="field search-field"
            ><span>搜索厂家、订阅或模型</span>
            <div class="search-wrap">
              <span aria-hidden="true">⌕</span
              ><input
                v-model="state.query"
                type="search"
                placeholder="如 OpenAI、Pro、GPT-6"
              /></div
          ></label>
          <label class="field"
            ><span>价格段</span
            ><select v-model="state.band">
              <option value="all">所有价格</option>
              <option v-for="band in catalog.meta.priceBandsUsd" :key="band.id" :value="band.id">
                {{ band.label }}
              </option>
            </select></label
          >
          <label class="field"
            ><span>模型</span
            ><select v-model="state.model">
              <option value="all">所有近期模型</option>
              <option v-for="model in modelOptions" :key="model.id" :value="model.id">
                {{ model.family }} · {{ model.effort }}
              </option>
            </select></label
          >
          <label class="field"
            ><span>排序</span
            ><select v-model="state.sort">
              <option value="ipd">每美元智能：高到低</option>
              <option value="apiCost">标准 API 成本：低到高</option>
              <option value="price">订阅月费：低到高</option>
              <option value="subscriptionIpd">订阅 IPD（可估算计划）</option>
            </select></label
          >
        </div>

        <div class="scenario-strip">
          <div class="scenario-title">
            <span class="scenario-icon">↗</span
            ><span
              ><b>标准化 API 场景</b><small>用于把输入 / 输出 token 换算成一次参考请求</small></span
            >
          </div>
          <label
            ><span>输入 tokens</span
            ><input v-model.number="state.inputTokens" type="number" min="0" step="1000"
          /></label>
          <label
            ><span>输出 tokens</span
            ><input v-model.number="state.outputTokens" type="number" min="0" step="500"
          /></label>
          <p class="scenario-note">默认不计缓存、工具调用、长上下文加价与多轮 agent 开销。</p>
        </div>
      </section>

      <section class="results-section" aria-labelledby="resultsTitle">
        <div class="results-heading">
          <div>
            <p class="eyebrow">PLAN × MODEL</p>
            <h2 id="resultsTitle">所有计划 × 模型</h2>
          </div>
          <div class="results-meta">
            <span>{{ filteredOffers.length }} 个组合</span><span class="results-separator">/</span
            ><span>价格段用于筛选，不分组</span>
          </div>
        </div>
        <div v-if="filteredOffers.length" class="comparison-scroll" aria-live="polite">
          <table class="comparison-table">
            <thead>
              <tr>
                <th scope="col">厂家</th>
                <th scope="col">订阅</th>
                <th scope="col">模型</th>
                <th scope="col">月费</th>
                <th scope="col">标准 API 等值 / 倍率</th>
                <th scope="col">智能 / API $1</th>
                <th scope="col">套餐权益</th>
                <th scope="col" aria-label="来源">源</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredOffers" :key="item.id">
                <td data-label="厂家" class="vendor-cell">
                  <span class="vendor-stamp" aria-hidden="true">{{
                    vendorInitial(item.plan.vendor)
                  }}</span>
                  <span class="vendor-name">{{ item.plan.vendor }}</span>
                  <span class="sector-chip">{{ sectorText(item.plan) }}</span>
                </td>
                <td data-label="订阅" class="subscription-cell">
                  <strong>{{ item.plan.product }}</strong>
                  <span>{{ item.plan.name }}</span>
                  <small v-if="item.plan.seat">按席位计价</small>
                </td>
                <td data-label="模型" class="model-cell">
                  <a :href="item.model.aaUrl" target="_blank" rel="noopener noreferrer">
                    {{ item.model.name }} <span aria-hidden="true">↗</span>
                  </a>
                  <small>{{ item.model.released }} · {{ item.model.effort }}</small>
                </td>
                <td data-label="月费" class="price-cell">
                  <strong>{{ formatUsd(item.price.usd) }}<small>/月</small></strong>
                  <span>{{ item.price.label }}</span>
                  <small v-if="item.plan.currency === 'CNY'"
                    >¥{{ formatNative(item.price.native) }} 原币</small
                  >
                </td>
                <td data-label="标准 API 等值 / 倍率" class="api-cell">
                  <strong class="api-cost"
                    >{{ formatUsd(item.apiPromptCost) }}<small>/次</small></strong
                  >
                  <span class="api-caption">
                    {{ formatNumber(state.inputTokens) }} 入 /
                    {{ formatNumber(state.outputTokens) }} 出
                  </span>
                  <span v-if="item.apiBudgetPrompts !== null" class="api-multiplier">
                    {{ formatNumber(item.apiBudgetPrompts) }}×
                    <small>月费等值标准请求</small>
                  </span>
                  <span v-else class="api-caption">API 单价未知，无法折算倍数</span>
                </td>
                <td data-label="智能 / API $1" class="ipd-cell">
                  <template v-if="item.aaIpd !== null">
                    <strong>{{ formatMetric(item.aaIpd) }}</strong>
                    <span>AA 智能指数 / API $1</span>
                    <small>
                      {{ item.model.aaIndex }} ÷ {{ formatUsd(item.model.aaTaskUsd ?? 0) }} 单任务
                    </small>
                  </template>
                  <template v-else>
                    <strong>暂无评测</strong>
                    <span>AA 暂无可比指数</span>
                    <small>{{ item.model.benchmarkNote }}</small>
                  </template>
                </td>
                <td data-label="套餐权益" class="quota-cell">
                  <template v-if="item.estimatedTasks !== null">
                    <span class="quota-pill is-estimate">
                      {{
                        item.plan.usage.kind === "perModelUsdBudget"
                          ? "模型专属 API 额度 · 估算"
                          : "订阅 Credits · 估算"
                      }}
                    </span>
                    <strong
                      >≈ {{ formatNumber(Math.floor(item.estimatedTasks ?? 0)) }} 次 / 月</strong
                    >
                    <small>
                      <template v-if="item.plan.usage.kind === 'perModelUsdBudget'">
                        当前模型月预算
                        {{ formatUsd(item.plan.usage.modelBudgetUsdById?.[item.model.id] ?? 0) }}；
                      </template>
                      <template v-else-if="item.plan.usage.kind === 'modelCredits'">
                        {{ formatNumber(item.plan.usage.credits ?? 0) }}
                        {{ item.plan.usage.creditWindowDays === 7 ? "周" : "月" }}度模型 Credits
                        全用于当前模型，并折算为 30 天；
                      </template>
                      <template v-else>
                        假设 {{ formatNumber(item.plan.usage.credits ?? 0) }} Credits
                        全用于当前模型；
                      </template>
                      <template v-if="item.subscriptionIpd !== null">
                        订阅 IPD {{ formatMetric(item.subscriptionIpd) }}
                      </template>
                      <template v-else>AA 暂无该模型评测，订阅 IPD 尚不可计算。</template>
                    </small>
                  </template>
                  <template v-else-if="item.plan.usage.kind === 'kiroCredits'">
                    <span class="quota-pill">额度公开 · 换算未知</span>
                    <strong>{{ item.plan.usage.label }}</strong>
                    <small>{{ item.plan.usage.scope }}</small>
                  </template>
                  <template v-else>
                    <span class="quota-pill is-unknown">模型级请求额度未公开</span>
                    <strong>{{ item.plan.usage.label }}</strong>
                    <small>{{ item.plan.usage.scope }}</small>
                  </template>
                </td>
                <td data-label="来源" class="source-cell">
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
        v-if="catalog.unpairedPlans.length"
        class="unpaired-section"
        aria-labelledby="unpairedTitle"
      >
        <div class="section-heading compact-heading">
          <div>
            <p class="eyebrow">COVERAGE NOTES</p>
            <h2 id="unpairedTitle">已纳入目录，暂不做模型级排名</h2>
          </div>
          <span class="coverage-count">{{ catalog.unpairedPlans.length }} 条计划</span>
        </div>
        <article v-for="plan in catalog.unpairedPlans" :key="plan.id" class="unpaired-card">
          <div class="unpaired-name">
            <b>{{ plan.vendor }} · {{ plan.product }} {{ plan.name }}</b
            ><span>{{ plan.usageLabel }}</span>
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
      </section>

      <section class="method-section" id="method">
        <div class="method-intro">
          <p class="eyebrow">HOW TO READ THIS</p>
          <h2>哪些数字能算，<br /><em>哪些还不能。</em></h2>
          <p>
            订阅限额经常是动态、共享或按任务复杂度扣减。没有公开模型级额度时，留空比猜测更有用。
          </p>
        </div>
        <div class="method-cards">
          <article>
            <span class="method-number">01</span>
            <h3>模型 API 价格</h3>
            <p>按官方每百万输入 / 输出 token 价格计算。标准请求成本随上方 token 数量实时更新。</p>
            <code>输入价 × 输入量 + 输出价 × 输出量</code>
          </article>
          <article>
            <span class="method-number">02</span>
            <h3>订阅实际 IPD</h3>
            <p>
              只有套餐公开 token 计价额度时才估算。Copilot 结果假设全部月度 AI Credits
              用于当前模型，属于共享额度上限场景。
            </p>
            <code>标准请求数 × AA 指数 ÷ 月费</code>
          </article>
          <article>
            <span class="method-number">03</span>
            <h3>AA 基准 IPD</h3>
            <p>
              模型指数 ÷ Artificial Analysis Intelligence Index 单任务 API 成本。它是模型 API
              侧的效率基准，不等于订阅已经包含的用量。
            </p>
            <code>AA 智能指数 ÷ AA 单任务成本</code>
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
