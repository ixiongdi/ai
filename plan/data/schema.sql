-- AI Subscription & Model Independent Unit Accounting Database Schema
-- All data must have fully verifiable sources (Artificial Analysis URLs + Vendor Official Docs Quotes)

PRAGMA foreign_keys = ON;

-- 1. AI Models Table (Strictly benchmarked on Artificial Analysis)
CREATE TABLE IF NOT EXISTS models (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    provider TEXT NOT NULL,
    aa_intelligence_index REAL NOT NULL,    -- Artificial Analysis Intelligence Index v4.3.2 (e.g. 57.62)
    aa_cost_per_task REAL NOT NULL,         -- Weighted average cost (USD) per Intelligence Index task on API
    output_speed REAL,                      -- Output tokens/s from AA
    context_window INTEGER DEFAULT 1000000, -- Context Window in tokens
    pricing_input_per_m REAL,               -- Input price per 1M tokens ($)
    pricing_output_per_m REAL,              -- Output price per 1M tokens ($)
    pricing_cache_hit_per_m REAL,           -- Cache hit price per 1M tokens ($)
    aa_url TEXT NOT NULL,                   -- Direct link to AA model details
    aa_benchmark_version TEXT NOT NULL,     -- Benchmark suite version: 'Artificial Analysis v4.3.2'
    aa_captured_date TEXT NOT NULL,         -- Date when data was retrieved: '2026-09-23'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. AI Products Table (Vendor / Brand)
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    provider TEXT NOT NULL,
    category TEXT NOT NULL, -- 'general', 'coding', 'search'
    website_url TEXT NOT NULL,
    logo_icon TEXT,
    description TEXT
);

-- 3. Subscriptions Table (Specific pricing tier: Free, Pro, Team, Ultra)
CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    tier_level TEXT NOT NULL,                -- 'free', 'pro', 'team', 'ultra'
    tier_level_name TEXT NOT NULL,           -- '免费档', '个人专业档', '团队协作档', '算力怪兽档'
    price_usd_monthly REAL NOT NULL,         -- Monthly sticker price ($)
    price_cny_monthly REAL NOT NULL,         -- Monthly price (¥)
    bundled_extras_value_usd REAL DEFAULT 0, -- Value of bundled storage/IDE ($)
    bundled_extras_desc TEXT,                -- Description of bundled value
    official_limit_rule TEXT NOT NULL,       -- Stated official quota rule
    official_pricing_url TEXT NOT NULL,      -- Direct link to vendor pricing page
    official_terms_url TEXT NOT NULL,        -- Direct link to vendor terms / support doc
    official_quote TEXT NOT NULL,            -- Verbatim quotation from official documentation
    features_json TEXT,                      -- Highlights
    summary TEXT
);

-- 4. Subscription Models Offerings Junction (Each Subscription x Model Pair is Independently Calculated)
CREATE TABLE IF NOT EXISTS subscription_model_offerings (
    id TEXT PRIMARY KEY,                     -- e.g. 'claude-pro--claude-3-7-sonnet'
    subscription_id TEXT NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    model_id TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    offering_name TEXT NOT NULL,             -- e.g. 'Claude Pro · Claude 3.7 Sonnet'
    window_hours REAL,                       -- Time window in hours
    window_requests INTEGER,                 -- Quota per window
    monthly_max_theoretical INTEGER NOT NULL,-- Theoretical 24h capacity
    monthly_active_capacity INTEGER NOT NULL,-- Realistic 16h waking day capacity
    rate_limit_formula TEXT NOT NULL,        -- Explanation of the exact mathematical formula
    source_citation TEXT NOT NULL,           -- Direct citation explaining the source of the quota
    source_url TEXT NOT NULL,                -- Clickable source link
    notes TEXT
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_offering_sub ON subscription_model_offerings(subscription_id);
CREATE INDEX IF NOT EXISTS idx_offering_model ON subscription_model_offerings(model_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tier ON subscriptions(tier_level);
