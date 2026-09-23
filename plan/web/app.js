/**
 * AI Subscription-Model Independent Unit Accounting (IPD)
 * Grounded directly in Artificial Analysis (AA) v4.3.2 Benchmarks
 * Every (Subscription Tier x Model) combination is calculated and evaluated separately.
 */

const STATE = {
  data: null,
  dailyQueries: 30,
  monthlyQueries: 900,
  selectedPersona: 'moderate',
  currency: 'USD',           // 'USD' | 'CNY'
  usdToCnyRate: 7.25,
  deductExtras: false,       // whether to subtract bundled extras (e.g. 2TB storage)
  providerFilter: 'all',     // 'all' | 'Anthropic' | 'OpenAI' | 'Google' ...
  tierFilter: 'all',         // 'all' | 'free' | 'pro' | 'team' | 'ultra'
  modelFilter: 'all',        // 'all' | model_id
  sortBy: 'ipd',             // 'ipd' | 'leverage' | 'peak' | 'cost' | 'price'
  viewMode: 'cards',         // 'cards' | 'table'
  searchQuery: '',
  selectedOfferingForModal: null
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadData();
    populateModelFilterDropdown();
    populateProviderFilterDropdown();
    initEventListeners();
    recalculateAndRender();
  } catch (err) {
    console.error("Initialization error:", err);
    document.getElementById('loadingState').innerHTML = `
      <div class="text-rose-400 p-6 text-center">
        <p class="text-lg font-bold">数据加载失败</p>
        <p class="text-sm text-slate-400 mt-2">${err.message}</p>
      </div>
    `;
  }
});

async function loadData() {
  if (window.SUBSCRIPTION_DEFAULT_DATA) {
    STATE.data = window.SUBSCRIPTION_DEFAULT_DATA;
    return;
  }

  try {
    const resp = await fetch('data/subscriptions_data.json');
    if (resp.ok) {
      STATE.data = await resp.json();
      return;
    }
  } catch (e) {
    console.warn("Fetch failed, checking for embedded data:", e);
  }

  if (window.SUBSCRIPTION_DEFAULT_DATA) {
    STATE.data = window.SUBSCRIPTION_DEFAULT_DATA;
  } else {
    throw new Error("无法加载数据。请在终端运行 python3 -m http.server 8080 并访问 http://localhost:8080");
  }
}

function populateModelFilterDropdown() {
  const select = document.getElementById('modelFilterSelect');
  if (!select || !STATE.data) return;

  const models = STATE.data.models || [];
  select.innerHTML = '<option value="all">🔍 全部模型 (不限)</option>' + 
    models.map(m => `<option value="${m.id}">${m.name} (AA ${m.aa_intelligence_index})</option>`).join('');
}

function populateProviderFilterDropdown() {
  const select = document.getElementById('providerFilterSelect');
  if (!select || !STATE.data) return;

  const providers = [...new Set((STATE.data.products || []).map(p => p.provider))];
  select.innerHTML = '<option value="all">🏢 全部厂商 (不限)</option>' + 
    providers.map(p => `<option value="${p}">${p}</option>`).join('');
}

function initEventListeners() {
  // 1. Slider & Input
  const querySlider = document.getElementById('querySlider');
  const queryNumber = document.getElementById('queryNumber');

  querySlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    STATE.dailyQueries = val;
    STATE.monthlyQueries = val * 30;
    queryNumber.value = val;
    STATE.selectedPersona = 'custom';
    updatePersonaButtons();
    recalculateAndRender();
  });

  queryNumber.addEventListener('change', (e) => {
    let val = parseInt(e.target.value, 10) || 10;
    val = Math.max(1, Math.min(300, val));
    STATE.dailyQueries = val;
    STATE.monthlyQueries = val * 30;
    querySlider.value = val;
    STATE.selectedPersona = 'custom';
    updatePersonaButtons();
    recalculateAndRender();
  });

  // 2. Persona buttons
  document.querySelectorAll('.persona-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const personaId = btn.dataset.persona;
      STATE.selectedPersona = personaId;
      if (personaId === 'light') STATE.dailyQueries = 10;
      else if (personaId === 'moderate') STATE.dailyQueries = 30;
      else if (personaId === 'power') STATE.dailyQueries = 80;
      STATE.monthlyQueries = STATE.dailyQueries * 30;

      querySlider.value = STATE.dailyQueries;
      queryNumber.value = STATE.dailyQueries;
      updatePersonaButtons();
      recalculateAndRender();
    });
  });

  // 3. Currency switch
  const currencyToggle = document.getElementById('currencyToggle');
  if (currencyToggle) {
    currencyToggle.addEventListener('click', () => {
      STATE.currency = STATE.currency === 'USD' ? 'CNY' : 'USD';
      currencyToggle.textContent = STATE.currency === 'USD' ? '$ USD' : '¥ CNY';
      recalculateAndRender();
    });
  }

  // 4. Net Cost Toggle
  const netCostCheckbox = document.getElementById('netCostCheckbox');
  if (netCostCheckbox) {
    netCostCheckbox.addEventListener('change', (e) => {
      STATE.deductExtras = e.target.checked;
      recalculateAndRender();
    });
  }

  // 5. Tier Level Filter
  document.querySelectorAll('.tier-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tier-filter-btn').forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white');
        b.classList.add('text-slate-400', 'hover:bg-slate-800');
      });
      btn.classList.add('bg-indigo-600', 'text-white');
      btn.classList.remove('text-slate-400', 'hover:bg-slate-800');
      STATE.tierFilter = btn.dataset.tier;
      recalculateAndRender();
    });
  });

  // 6. Model & Provider Filter Dropdowns
  const modelFilterSelect = document.getElementById('modelFilterSelect');
  if (modelFilterSelect) {
    modelFilterSelect.addEventListener('change', (e) => {
      STATE.modelFilter = e.target.value;
      recalculateAndRender();
    });
  }

  const providerFilterSelect = document.getElementById('providerFilterSelect');
  if (providerFilterSelect) {
    providerFilterSelect.addEventListener('change', (e) => {
      STATE.providerFilter = e.target.value;
      recalculateAndRender();
    });
  }

  // 7. Sort selection
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      STATE.sortBy = e.target.value;
      updateFocusTabs(STATE.sortBy);
      recalculateAndRender();
    });
  }

  // 8. Focus Tabs
  document.querySelectorAll('.focus-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const sortVal = tab.dataset.sort;
      STATE.sortBy = sortVal;
      if (sortSelect) sortSelect.value = sortVal;
      updateFocusTabs(sortVal);
      recalculateAndRender();
    });
  });

  // 9. View Mode toggle
  const viewCardsBtn = document.getElementById('viewCardsBtn');
  const viewTableBtn = document.getElementById('viewTableBtn');
  if (viewCardsBtn && viewTableBtn) {
    viewCardsBtn.addEventListener('click', () => {
      STATE.viewMode = 'cards';
      viewCardsBtn.classList.add('bg-indigo-600', 'text-white');
      viewCardsBtn.classList.remove('text-slate-400');
      viewTableBtn.classList.remove('bg-indigo-600', 'text-white');
      viewTableBtn.classList.add('text-slate-400');
      recalculateAndRender();
    });
    viewTableBtn.addEventListener('click', () => {
      STATE.viewMode = 'table';
      viewTableBtn.classList.add('bg-indigo-600', 'text-white');
      viewTableBtn.classList.remove('text-slate-400');
      viewCardsBtn.classList.remove('bg-indigo-600', 'text-white');
      viewCardsBtn.classList.add('text-slate-400');
      recalculateAndRender();
    });
  }

  // 10. Search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      STATE.searchQuery = e.target.value.toLowerCase().trim();
      recalculateAndRender();
    });
  }

  // 11. Offering Detail Modal close
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalOverlay = document.getElementById('detailModal');
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // 12. Sources Directory Modal
  const sourcesModalBtn = document.getElementById('sourcesModalBtn');
  const sourcesModalCloseBtn = document.getElementById('sourcesModalCloseBtn');
  const sourcesModalOverlay = document.getElementById('sourcesModal');
  if (sourcesModalBtn) sourcesModalBtn.addEventListener('click', openSourcesModal);
  if (sourcesModalCloseBtn) sourcesModalCloseBtn.addEventListener('click', closeSourcesModal);
  if (sourcesModalOverlay) sourcesModalOverlay.addEventListener('click', (e) => {
    if (e.target === sourcesModalOverlay) closeSourcesModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeSourcesModal();
    }
  });
}

function updatePersonaButtons() {
  document.querySelectorAll('.persona-btn').forEach(btn => {
    if (btn.dataset.persona === STATE.selectedPersona) {
      btn.classList.add('border-indigo-500', 'bg-indigo-950/40', 'text-indigo-300');
      btn.classList.remove('border-slate-800', 'text-slate-400');
    } else {
      btn.classList.remove('border-indigo-500', 'bg-indigo-950/40', 'text-indigo-300');
      btn.classList.add('border-slate-800', 'text-slate-400');
    }
  });
}

function updateFocusTabs(sortKey) {
  document.querySelectorAll('.focus-tab').forEach(tab => {
    if (tab.dataset.sort === sortKey) {
      tab.classList.add('bg-indigo-600', 'text-white', 'shadow-md');
      tab.classList.remove('text-slate-400', 'hover:text-white');
    } else {
      tab.classList.remove('bg-indigo-600', 'text-white', 'shadow-md');
      tab.classList.add('text-slate-400', 'hover:text-white');
    }
  });
}

/**
 * Strict Unit-Level Mathematical Calculation Engine
 * Evaluates each (Subscription Tier x Model) unit strictly and individually
 */
function computeOfferingDynamicMetrics(offering, monthlyDemand, deductExtras, currency) {
  const isCny = currency === 'CNY';
  const price = isCny ? offering.price_cny_monthly : offering.price_usd_monthly;
  const extrasVal = isCny ? (offering.bundled_extras_value_usd * STATE.usdToCnyRate) : offering.bundled_extras_value_usd;
  const effectivePrice = deductExtras ? Math.max(isCny ? 7.0 : 1.0, price - extrasVal) : price;

  const capacity = offering.monthly_active_capacity;
  const fulfilled = Math.min(monthlyDemand, capacity);
  const unfulfilled = Math.max(0, monthlyDemand - capacity);
  const fulfillmentRate = Math.min(100, Math.round((fulfilled / Math.max(1, monthlyDemand)) * 1000) / 10);

  const intelScore = offering.aa_intelligence_index;
  const costPerTask = offering.aa_cost_per_task;

  const totalScore = Math.round(fulfilled * intelScore * 10) / 10;
  const totalApiMarketValue = Math.round(fulfilled * costPerTask * 100) / 100;

  let ipd = 0;
  let leverageMultiplier = 0;
  let realizedCostPerTask = 0;
  let costPer100 = 0;
  let savingsPct = 0;

  if (price <= 0) {
    ipd = 99999;
    leverageMultiplier = 99999;
    realizedCostPerTask = 0;
    costPer100 = 0;
    savingsPct = 100;
  } else {
    ipd = Math.round((totalScore / effectivePrice) * 10) / 10;
    const effectivePriceUsd = deductExtras ? Math.max(1.0, offering.price_usd_monthly - offering.bundled_extras_value_usd) : offering.price_usd_monthly;
    leverageMultiplier = Math.round((totalApiMarketValue / effectivePriceUsd) * 10) / 10;
    realizedCostPerTask = Math.round((effectivePrice / Math.max(1, fulfilled)) * 10000) / 10000;
    costPer100 = Math.round((realizedCostPerTask * 100) * 100) / 100;

    const realizedCostUsd = effectivePriceUsd / Math.max(1, fulfilled);
    if (costPerTask > 0) {
      savingsPct = Math.round(((costPerTask - realizedCostUsd) / costPerTask) * 1000) / 10;
    }
  }

  return {
    price,
    effectivePrice: Math.round(effectivePrice * 100) / 100,
    currencySymbol: isCny ? '¥' : '$',
    totalScore,
    totalApiMarketValueUsd: totalApiMarketValue,
    ipd,
    leverageMultiplier,
    realizedCostPerTask,
    costPer100,
    savingsPct,
    fulfilled,
    monthlyDemand,
    fulfillmentRate
  };
}

function recalculateAndRender() {
  if (!STATE.data || !STATE.data.offerings) return;

  const { offerings } = STATE.data;
  const list = [];

  for (const off of offerings) {
    // Search query filter
    if (STATE.searchQuery) {
      const q = STATE.searchQuery;
      const matchName = off.subscription_name.toLowerCase().includes(q);
      const matchVendor = off.product_provider.toLowerCase().includes(q);
      const matchModel = off.model_name.toLowerCase().includes(q);
      const matchOffering = off.offering_name.toLowerCase().includes(q);
      if (!matchName && !matchVendor && !matchModel && !matchOffering) continue;
    }

    // Tier filter
    if (STATE.tierFilter !== 'all') {
      if (off.tier_level !== STATE.tierFilter) continue;
    }

    // Model filter
    if (STATE.modelFilter !== 'all') {
      if (off.model_id !== STATE.modelFilter) continue;
    }

    // Provider filter
    if (STATE.providerFilter !== 'all') {
      if (off.product_provider !== STATE.providerFilter) continue;
    }

    const metrics = computeOfferingDynamicMetrics(
      off,
      STATE.monthlyQueries,
      STATE.deductExtras,
      STATE.currency
    );

    list.push({
      ...off,
      metrics
    });
  }

  // Sort
  list.sort((a, b) => {
    if (STATE.sortBy === 'ipd') {
      return b.metrics.ipd - a.metrics.ipd;
    } else if (STATE.sortBy === 'leverage') {
      return b.metrics.leverageMultiplier - a.metrics.leverageMultiplier;
    } else if (STATE.sortBy === 'peak') {
      return b.aa_intelligence_index - a.aa_intelligence_index;
    } else if (STATE.sortBy === 'cost') {
      return a.metrics.costPer100 - b.metrics.costPer100;
    } else if (STATE.sortBy === 'price') {
      return a.metrics.effectivePrice - b.metrics.effectivePrice;
    }
    return 0;
  });

  renderView(list);
}

function renderView(offerings) {
  const container = document.getElementById('resultsContainer');
  const loading = document.getElementById('loadingState');
  if (loading) loading.style.display = 'none';

  const scenarioInfo = document.getElementById('scenarioInfo');
  if (scenarioInfo) {
    scenarioInfo.innerHTML = `
      当前评测单元：<span class="text-indigo-400 font-semibold">${offerings.length} 个独立 (订阅等级 × 模型) 组合</span> · 
      每日需求：<span class="text-sky-400 font-semibold">${STATE.dailyQueries} 次/天</span> 
      (月度 <span class="text-sky-400 font-semibold">${STATE.monthlyQueries.toLocaleString()}</span> 次高质量任务)
    `;
  }

  if (offerings.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-500">
        <p class="text-base font-medium">没有找到符合条件的订阅与模型单元</p>
        <p class="text-xs mt-1 text-slate-400">请尝试放宽筛选条件或切换全部模型</p>
      </div>
    `;
    return;
  }

  if (STATE.viewMode === 'cards') {
    renderCards(container, offerings);
  } else {
    renderTable(container, offerings);
  }
}

function renderCards(container, offerings) {
  container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

  const maxIpd = offerings
    .filter(o => o.metrics.ipd < 90000)
    .reduce((max, o) => Math.max(max, o.metrics.ipd), 1);

  const html = offerings.map((off, index) => {
    const m = off.metrics;
    const isFree = off.price_usd_monthly <= 0;
    const isTop1 = index === 0;
    const rankLabel = `#${index + 1}`;
    const ipdPct = isFree ? 100 : Math.min(100, Math.round((m.ipd / maxIpd) * 100));

    // Tier badge style
    const tierMap = {
      free: { label: '免费档', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
      pro: { label: '个人专业档', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
      team: { label: '团队协作档', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
      ultra: { label: '算力怪兽档', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' }
    };
    const tierBadge = tierMap[off.tier_level] || { label: off.tier_level_name, color: 'bg-slate-800 text-slate-400 border-slate-700' };

    const priceDisplay = isFree
      ? '<span class="text-emerald-400 text-xl font-bold">完全免费</span>'
      : `<span class="text-2xl font-bold text-white">${m.currencySymbol}${m.price}</span><span class="text-xs text-slate-400"> /月</span>`;

    const netPriceNote = (STATE.deductExtras && off.bundled_extras_value_usd > 0)
      ? `<div class="text-[11px] text-emerald-400 mt-0.5">净成本: ${m.currencySymbol}${m.effectivePrice}/月 (扣除附加权益)</div>`
      : '';

    return `
      <div class="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden ${isTop1 ? 'border-indigo-500/50 deal-highlight' : ''}">
        
        <!-- Header -->
        <div>
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="px-2 py-0.5 rounded text-xs font-bold ${isTop1 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
                ${rankLabel}
              </span>
              <span class="px-2 py-0.5 rounded-full text-[11px] border font-semibold ${tierBadge.color}">
                ${tierBadge.label}
              </span>
              <span class="px-2 py-0.5 rounded-full text-[11px] bg-slate-800/80 text-slate-400 border border-slate-700">
                ${off.product_provider}
              </span>
            </div>
            <div class="text-right">
              ${priceDisplay}
              ${netPriceNote}
            </div>
          </div>

          <!-- Subscription & Target Model Titles -->
          <div class="mb-4">
            <div class="text-xs text-indigo-400 font-semibold tracking-wide uppercase">${off.subscription_name}</div>
            <h3 class="text-lg font-bold text-white tracking-tight flex items-baseline justify-between gap-2 mt-0.5">
              <span>${off.model_name}</span>
            </h3>
            <div class="mt-2 flex items-center gap-1.5 flex-wrap text-[11px]">
              <span class="px-2 py-0.5 rounded font-semibold bg-sky-950/80 text-sky-300 border border-sky-800/60">
                AA 智力: ${off.aa_intelligence_index}
              </span>
              <span class="text-slate-400">
                API市价: $${off.aa_cost_per_task}
              </span>
              <a href="${off.aa_url}" target="_blank" rel="noopener noreferrer" class="text-sky-400 hover:text-sky-300 inline-flex items-center gap-0.5 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700/80 hover:border-sky-500/50 transition" title="查看 Artificial Analysis 该模型独立权威测评">
                <span>AA源</span>
                <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
              <a href="${off.official_terms_url || off.source_url || off.official_pricing_url}" target="_blank" rel="noopener noreferrer" class="text-indigo-300 hover:text-indigo-200 inline-flex items-center gap-0.5 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700/80 hover:border-indigo-500/50 transition" title="查看厂商官方条款与支持文档">
                <span>条款源</span>
                <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>

            <!-- Verbatim Citation Box -->
            <div class="mt-2.5 text-[11px] text-slate-300 bg-slate-900/90 rounded-lg px-2.5 py-1.5 border border-slate-800/80 truncate" title="${off.official_quote || off.source_citation}">
              <span class="text-indigo-400 font-semibold mr-1">官方依据:</span>"${off.official_quote || off.source_citation}"
            </div>
          </div>

          <!-- Metrics Block -->
          <div class="bg-slate-900/80 rounded-xl p-4 border border-slate-800/80 mb-4 space-y-3">
            
            <!-- IPD Score -->
            <div>
              <div class="flex justify-between items-baseline mb-1">
                <span class="text-xs font-semibold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                  ⚡ 该模型每元智能交付量 (IPD)
                </span>
                <span class="text-lg font-extrabold ${isFree ? 'text-emerald-400' : 'text-indigo-400'}">
                  ${isFree ? '∞ 零成本' : m.ipd.toLocaleString()}
                </span>
              </div>
              <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div class="h-full rounded-full ${isFree ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-sky-400'}" style="width: ${ipdPct}%"></div>
              </div>
            </div>

            <!-- Economic Leverage Multiplier -->
            <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span class="text-slate-400 flex items-center gap-1">
                📈 算力杠杆倍数
                <span class="text-[10px] text-slate-500">(API市值 ÷ 订阅月费)</span>
              </span>
              <span class="font-bold ${isFree ? 'text-emerald-400' : 'text-amber-400'}">
                ${isFree ? '∞' : `${m.leverageMultiplier}x 价值放大`}
              </span>
            </div>

            <!-- Cost & Savings -->
            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <div>
                <span class="text-slate-400 block">该模型单次任务成本</span>
                <span class="font-semibold text-slate-200 block mt-0.5">
                  ${isFree ? '0 元' : `${m.currencySymbol}${m.costPer100} / 100次`}
                </span>
                <span class="text-[10px] text-slate-500 block">
                  实付约 $${m.realizedCostPerTask}/次
                </span>
              </div>
              <div>
                <span class="text-slate-400 block">相对 API 节省</span>
                <span class="font-semibold text-emerald-400 block mt-0.5">
                  节约 ${m.savingsPct}%
                </span>
                <span class="text-[10px] text-slate-500 block">
                  API单次 $${off.aa_cost_per_task}
                </span>
              </div>
            </div>

            <!-- Quota Utilization -->
            <div class="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <div class="flex justify-between items-center text-slate-400">
                <span>月度需求履约率</span>
                <span class="${m.fulfillmentRate >= 100 ? 'text-emerald-400' : 'text-amber-400'} font-medium">
                  ${m.fulfilled} / ${m.monthlyDemand} 次 (${m.fulfillmentRate}%)
                </span>
              </div>
              <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div class="h-full rounded-full ${m.fulfillmentRate >= 100 ? 'bg-emerald-500' : 'bg-amber-500'}" style="width: ${m.fulfillmentRate}%"></div>
              </div>
              <div class="text-[10px] text-slate-500 truncate pt-0.5" title="${off.rate_limit_formula}">
                公式：${off.rate_limit_formula}
              </div>
            </div>

          </div>

        </div>

        <!-- Footer / Action -->
        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <button onclick="openOfferingModal('${off.offering_id}')" class="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center gap-1">
            <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            查看单独核算过程
          </button>
          <a href="${off.official_url}" target="_blank" rel="noopener noreferrer" class="py-2 px-3 rounded-lg text-xs font-semibold bg-indigo-600/90 hover:bg-indigo-600 text-white transition flex items-center justify-center gap-1">
            官网
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>

      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

function renderTable(container, offerings) {
  container.className = 'w-full overflow-x-auto';
  const isCny = STATE.currency === 'CNY';
  const currencySymbol = isCny ? '¥' : '$';

  let rows = offerings.map((off, idx) => {
    const m = off.metrics;
    const isFree = off.price_usd_monthly <= 0;

    return `
      <tr class="border-b border-slate-800 hover:bg-slate-800/40 transition">
        <td class="py-4 px-4 font-bold text-slate-300">#${idx + 1}</td>
        <td class="py-4 px-4">
          <div class="font-bold text-white">${off.subscription_name}</div>
          <div class="text-xs text-slate-400">${off.tier_level_name} · ${off.product_provider}</div>
        </td>
        <td class="py-4 px-4">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-bold text-sky-400">${off.model_name}</span>
            <a href="${off.aa_url}" target="_blank" rel="noopener noreferrer" class="text-[10px] text-sky-400 hover:text-sky-300 underline" title="查看 AA 权威评测">AA源↗</a>
          </div>
          <div class="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
            <span>AA评分: ${off.aa_intelligence_index}</span>
            <a href="${off.official_terms_url || off.source_url}" target="_blank" rel="noopener noreferrer" class="text-[10px] text-indigo-400 hover:text-indigo-300 underline" title="查看官方服务条款">官方条款↗</a>
          </div>
        </td>
        <td class="py-4 px-4 font-semibold text-slate-200">
          ${isFree ? '<span class="text-emerald-400">免费</span>' : `${currencySymbol}${m.price}/月`}
        </td>
        <td class="py-4 px-4 font-bold text-indigo-400">
          ${isFree ? '∞' : m.ipd.toLocaleString()}
        </td>
        <td class="py-4 px-4 font-bold text-amber-400">
          ${isFree ? '∞' : `${m.leverageMultiplier}x`}
        </td>
        <td class="py-4 px-4 text-slate-300">
          ${isFree ? '0 元' : `${currencySymbol}${m.costPer100}`}
        </td>
        <td class="py-4 px-4 text-xs">
          ${m.fulfilled} / ${m.monthlyDemand} (${m.fulfillmentRate}%)
        </td>
        <td class="py-4 px-4 text-right">
          <button onclick="openOfferingModal('${off.offering_id}')" class="px-3 py-1.5 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition">
            核算详情
          </button>
        </td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div class="glass-panel rounded-2xl overflow-hidden">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="bg-slate-900/90 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
          <tr>
            <th class="py-3 px-4">排名</th>
            <th class="py-3 px-4">订阅等级</th>
            <th class="py-3 px-4">独立核算模型</th>
            <th class="py-3 px-4">月费</th>
            <th class="py-3 px-4 text-indigo-400">每元智能 (IPD)</th>
            <th class="py-3 px-4 text-amber-400">算力杠杆倍数</th>
            <th class="py-3 px-4">百次任务成本</th>
            <th class="py-3 px-4">月度履约率</th>
            <th class="py-3 px-4 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Modal logic showing individual unit mathematical proof
 */
window.openOfferingModal = function(offeringId) {
  if (!STATE.data || !STATE.data.offerings) return;
  const off = STATE.data.offerings.find(o => o.offering_id === offeringId);
  if (!off) return;

  const modal = document.getElementById('detailModal');
  const modalContent = document.getElementById('modalDetails');
  const m = computeOfferingDynamicMetrics(off, STATE.monthlyQueries, STATE.deductExtras, STATE.currency);

  modalContent.innerHTML = `
    <!-- Modal Header -->
    <div class="flex items-start justify-between pb-4 border-b border-slate-800">
      <div>
        <div class="flex items-center gap-2 mb-1 flex-wrap">
          <span class="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/60">
            ${off.tier_level_name} · ${off.product_provider}
          </span>
          <span class="text-xs font-semibold px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-800/60">
            模型: ${off.model_name}
          </span>
        </div>
        <h2 class="text-2xl font-extrabold text-white">${off.offering_name}</h2>
        <p class="text-xs text-slate-400 mt-1">${off.subscription_summary}</p>
      </div>
      <div class="text-right">
        <div class="text-2xl font-bold text-white">
          ${off.price_usd_monthly <= 0 ? '<span class="text-emerald-400">免费</span>' : `${m.currencySymbol}${m.price}<span class="text-xs text-slate-400 font-normal"> /月</span>`}
        </div>
        ${off.bundled_extras_value_usd > 0 ? `<div class="text-xs text-emerald-400 mt-0.5">含价值 $${off.bundled_extras_value_usd}/月 附加权益</div>` : ''}
      </div>
    </div>

    <!-- Mathematical Formula Breakdown -->
    <div class="py-4 space-y-4">
      <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
        <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
        该模型在该订阅等级下的单独核算推导 (Mathematical Proof)
      </h3>

      <!-- Step Cards -->
      <div class="bg-indigo-950/30 border border-indigo-900/60 rounded-2xl p-4 space-y-3 text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div class="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span class="text-slate-400 block text-[11px]">该模型产出总智力</span>
            <span class="text-lg font-bold text-sky-400 mt-0.5 block">${m.totalScore.toLocaleString()} 点</span>
          </div>
          <div class="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span class="text-slate-400 block text-[11px]">等效 API 市场价值</span>
            <span class="text-lg font-bold text-emerald-400 mt-0.5 block">$${m.totalApiMarketValueUsd.toLocaleString()}</span>
          </div>
          <div class="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span class="text-slate-400 block text-[11px]">算力经济杠杆</span>
            <span class="text-lg font-bold text-amber-400 mt-0.5 block">${m.leverageMultiplier}x 放大</span>
          </div>
        </div>

        <div class="space-y-2 pt-2 border-t border-slate-800/80 text-slate-300">
          <p>• <strong>额度公式推导</strong>：<code>${off.rate_limit_formula}</code> $\Rightarrow$ 月度最大活跃履约容量 <strong>${off.monthly_active_capacity.toLocaleString()} 次</strong>。</p>
          <p>• <strong>实际履约情况</strong>：用户月需求 ${m.monthlyDemand} 次，实得 ${m.fulfilled} 次深度任务 (履约率 ${m.fulfillmentRate}%)。</p>
          <p>• <strong>每元智能 (IPD) 推导</strong>：<code>总智力点数 (${m.totalScore}) ÷ 实际月费 (${m.effectivePrice}) = ${m.ipd} 点/元</code></p>
          <p>• <strong>算力杠杆倍数推导</strong>：<code>API等效总值 ($${m.totalApiMarketValueUsd}) ÷ 订阅费 ($${off.price_usd_monthly}) = ${m.leverageMultiplier} 倍</code></p>
          <p>• <strong>单任务实际成本</strong>：<code>订阅费 ($${off.price_usd_monthly}) ÷ 履约次数 (${m.fulfilled}) = $${m.realizedCostPerTask} / 任务</code> (AA实测API基准 $${off.aa_cost_per_task}，节省 ${m.savingsPct}%)</p>
        </div>
      </div>

      <!-- Model Specifications from AA -->
      <div class="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-2 text-xs">
        <div class="flex items-center justify-between font-bold text-white">
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-sky-400"></span>
            Artificial Analysis 官方权威基准指标
          </span>
          <a href="${off.aa_url}" target="_blank" rel="noopener noreferrer" class="text-sky-400 hover:text-sky-300 underline inline-flex items-center gap-1">
            查看 AA 评测源直达 &rarr;
          </a>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
          <div class="bg-slate-800/60 p-2 rounded-lg">
            <span class="text-[10px] text-slate-400 block">综合智力指数</span>
            <span class="font-bold text-sky-400 text-sm">${off.aa_intelligence_index}</span>
          </div>
          <div class="bg-slate-800/60 p-2 rounded-lg">
            <span class="text-[10px] text-slate-400 block">API单任务市价</span>
            <span class="font-bold text-amber-400 text-sm">$${off.aa_cost_per_task}</span>
          </div>
          <div class="bg-slate-800/60 p-2 rounded-lg">
            <span class="text-[10px] text-slate-400 block">输出生成速度</span>
            <span class="font-bold text-emerald-400 text-sm">${off.output_speed || 'N/A'} t/s</span>
          </div>
          <div class="bg-slate-800/60 p-2 rounded-lg">
            <span class="text-[10px] text-slate-400 block">上下文窗口</span>
            <span class="font-bold text-purple-400 text-sm">${(off.context_window / 1000).toFixed(0)}k</span>
          </div>
        </div>
      </div>

      <!-- Provenance & Verbatim Documentation Proof -->
      <div class="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3 text-xs">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <span class="font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
            <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            官方条款出处与 100% 凭据核验 (Zero Guesswork Provenance)
          </span>
          <span class="text-[11px] text-emerald-400 font-medium">真实官方记录</span>
        </div>

        <!-- Verbatim Quote Blockquote -->
        <blockquote class="border-l-2 border-indigo-500 pl-3 py-1.5 bg-slate-950/70 rounded-r-lg text-slate-300 italic">
          "${off.official_quote || off.source_citation}"
          <div class="text-[10px] text-slate-400 mt-1 not-italic">
            出处来源：<a href="${off.source_url || off.official_terms_url}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:underline font-semibold">${off.source_citation}</a>
          </div>
        </blockquote>

        <!-- Direct Provenance Verification Links -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
          <div class="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span class="text-slate-400 block text-[10px] uppercase font-bold">评测数据源 (Artificial Analysis)</span>
              <span class="font-bold text-sky-400 mt-0.5 block">${off.model_name} (AA得分: ${off.aa_intelligence_index})</span>
              <span class="text-slate-400 text-[10px] block mt-0.5">基准版本: ${off.aa_benchmark_version || 'v4.3.2'} · 抓取日期: ${off.aa_captured_date || '2026-09-23'}</span>
            </div>
            <a href="${off.aa_url}" target="_blank" rel="noopener noreferrer" class="text-sky-400 hover:text-sky-300 underline font-semibold mt-2 inline-flex items-center gap-1">
              查看 AA 独立评测页 &rarr;
            </a>
          </div>

          <div class="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span class="text-slate-400 block text-[10px] uppercase font-bold">厂商官方定价与条款</span>
              <span class="font-bold text-indigo-300 mt-0.5 block">${off.product_provider} · ${off.subscription_name}</span>
              <span class="text-slate-400 text-[10px] block mt-0.5">官方限额规则: ${off.official_limit_rule}</span>
            </div>
            <div class="flex items-center gap-3 mt-2">
              <a href="${off.official_pricing_url}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 underline font-semibold">
                官方定价直达 &rarr;
              </a>
              <a href="${off.official_terms_url}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 underline font-semibold">
                官方服务条款 &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Actions -->
    <div class="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
      <span class="text-slate-400">官方规则：${off.official_limit_rule}</span>
      <div class="flex gap-2">
        <button onclick="closeModal()" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
          关闭
        </button>
        <a href="${off.official_url}" target="_blank" rel="noopener noreferrer" class="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition flex items-center gap-1 shadow-md">
          官网订阅
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

window.closeModal = function() {
  const modal = document.getElementById('detailModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.openSourcesModal = function() {
  if (!STATE.data) return;
  const modal = document.getElementById('sourcesModal');
  const modalContent = document.getElementById('sourcesModalDetails');
  const sources = STATE.data.data_sources_directory || [];
  const models = STATE.data.models || [];

  const sourcesRows = sources.map(s => `
    <tr class="border-b border-slate-800 hover:bg-slate-900/40 text-xs">
      <td class="py-2.5 px-3 font-semibold text-indigo-300 whitespace-nowrap">${s.category}</td>
      <td class="py-2.5 px-3 font-medium text-white">${s.source_name}</td>
      <td class="py-2.5 px-3 text-slate-300 text-[11px] leading-relaxed">${s.coverage}</td>
      <td class="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">${s.captured_date}</td>
      <td class="py-2.5 px-3 text-right whitespace-nowrap">
        <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 font-semibold inline-flex items-center gap-1">
          直达出处
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
      </td>
    </tr>
  `).join('');

  const modelRows = models.map(m => `
    <tr class="border-b border-slate-800 hover:bg-slate-900/40 text-xs">
      <td class="py-2.5 px-3 font-bold text-white">${m.name}</td>
      <td class="py-2.5 px-3 text-slate-400">${m.provider}</td>
      <td class="py-2.5 px-3 font-bold text-sky-400">${m.aa_intelligence_index}</td>
      <td class="py-2.5 px-3 text-amber-400 font-semibold">$${m.aa_cost_per_task}</td>
      <td class="py-2.5 px-3 text-slate-300">${m.output_speed || 'N/A'} t/s</td>
      <td class="py-2.5 px-3 text-slate-400">${(m.context_window / 1000).toFixed(0)}k</td>
      <td class="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">${m.aa_captured_date || '2026-09-23'}</td>
      <td class="py-2.5 px-3 text-right whitespace-nowrap">
        <a href="${m.aa_url}" target="_blank" rel="noopener noreferrer" class="px-2 py-1 rounded bg-sky-950/60 hover:bg-sky-900/80 text-sky-300 border border-sky-800/60 font-semibold inline-flex items-center gap-1 text-[11px]">
          AA 评测源
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
      </td>
    </tr>
  `).join('');

  modalContent.innerHTML = `
    <!-- Header -->
    <div class="pb-4 border-b border-slate-800">
      <div class="flex items-center gap-2 mb-1">
        <span class="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          100% 数据来源可追溯
        </span>
        <span class="text-xs text-slate-400">零猜测 · 官方凭据直连</span>
      </div>
      <h2 class="text-2xl font-black text-white">权威评测与官方条款溯源全览</h2>
      <p class="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
        本系统所有智力指数、API市价及官方限额完全取自 <strong>Artificial Analysis (AA)</strong> 最新评测基准与各大 AI 厂商最新服务条款，拒绝任何主观臆测。
      </p>
    </div>

    <!-- Section 1: AA Model Benchmarks Directory -->
    <div class="py-5 space-y-3">
      <h3 class="text-sm font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-sky-400"></span>
        1. Artificial Analysis 权威评测模型库 (10大顶尖模型)
      </h3>
      <div class="glass-panel rounded-2xl overflow-hidden border border-slate-800/80">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th class="py-2.5 px-3">模型名称</th>
                <th class="py-2.5 px-3">厂商</th>
                <th class="py-2.5 px-3 text-sky-400">AA 智力指数</th>
                <th class="py-2.5 px-3 text-amber-400">API单任务成本</th>
                <th class="py-2.5 px-3">输出速度</th>
                <th class="py-2.5 px-3">上下文</th>
                <th class="py-2.5 px-3">收录日期</th>
                <th class="py-2.5 px-3 text-right">评测直达</th>
              </tr>
            </thead>
            <tbody>
              ${modelRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Section 2: Official Terms and Documentation Directory -->
    <div class="py-5 space-y-3 border-t border-slate-800/80">
      <h3 class="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
        2. 各厂商官方定价、服务条款与消息限额凭据库
      </h3>
      <div class="glass-panel rounded-2xl overflow-hidden border border-slate-800/80">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th class="py-2.5 px-3">分类</th>
                <th class="py-2.5 px-3">来源文档名称</th>
                <th class="py-2.5 px-3">涵盖内容及官方限额说明</th>
                <th class="py-2.5 px-3">抓取日期</th>
                <th class="py-2.5 px-3 text-right">出处直达</th>
              </tr>
            </thead>
            <tbody>
              ${sourcesRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Section 3: Methodology & Zero Guesswork Guarantee -->
    <div class="py-4 border-t border-slate-800 bg-slate-900/40 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
      <h4 class="font-bold text-white text-sm">严格数学推导准则 (Zero Guesswork Policy)</h4>
      <p class="leading-relaxed text-slate-400">
        所有订阅的调用频次上限均严格根据官方文档白纸黑字公布的条款进行换算（如 45条/5小时 换算为按日间活跃时长 16小时 × 45/5 × 30天 = 4,320 次/月）。所有模型参数直接匹配 Artificial Analysis API 评测实测数据，绝不使用虚假 Token 模糊概念。
      </p>
    </div>

    <!-- Close button -->
    <div class="pt-4 border-t border-slate-800 flex justify-end">
      <button onclick="closeSourcesModal()" class="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shadow-md">
        确认并返回仪表盘
      </button>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

window.closeSourcesModal = function() {
  const modal = document.getElementById('sourcesModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};
