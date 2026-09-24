import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent
catalog_path = root / "data/catalog.json"

with open(catalog_path, "r", encoding="utf-8") as f:
    catalog = json.load(f)

# Define all 48 commercial models from AA Top 50
aa_models_48 = [
    # 1. Claude Opus 5.5 Max
    {
        "id": "claude-opus-5-5",
        "name": "Claude Opus 5.5 · Max",
        "family": "Claude Opus 5.5",
        "provider": "Anthropic",
        "released": "2026-09-22",
        "effort": "Max",
        "aaRank": 1,
        "aaIndex": 58,
        "aaTaskUsd": 5.98,
        "apiInputUsdPerM": 4.0,
        "apiOutputUsdPerM": 20.0,
        "cachedInputUsdPerM": 0.4,
        "aaUrl": "https://artificialanalysis.ai/zh/models/claude-opus-5-5",
        "apiUrl": "https://docs.anthropic.com/en/docs/models-overview",
        "releaseSourceIds": ["anthropic-opus55"],
        "apiSourceIds": ["anthropic-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 2. Claude Opus 5.5 Xhigh
    {
        "id": "claude-opus-5-5-xhigh",
        "name": "Claude Opus 5.5 · Xhigh",
        "family": "Claude Opus 5.5",
        "provider": "Anthropic",
        "released": "2026-09-22",
        "effort": "Xhigh",
        "aaRank": 2,
        "aaIndex": 56,
        "aaTaskUsd": 3.46,
        "apiInputUsdPerM": 4.0,
        "apiOutputUsdPerM": 20.0,
        "cachedInputUsdPerM": 0.4,
        "aaUrl": "https://artificialanalysis.ai/zh/models/claude-opus-5-5-xhigh",
        "apiUrl": "https://docs.anthropic.com/en/docs/models-overview",
        "releaseSourceIds": ["anthropic-opus55"],
        "apiSourceIds": ["anthropic-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 3. Claude Opus 5.5 High
    {
        "id": "claude-opus-5-5-high",
        "name": "Claude Opus 5.5 · High",
        "family": "Claude Opus 5.5",
        "provider": "Anthropic",
        "released": "2026-09-22",
        "effort": "High",
        "aaRank": 3,
        "aaIndex": 54,
        "aaTaskUsd": 1.82,
        "apiInputUsdPerM": 4.0,
        "apiOutputUsdPerM": 20.0,
        "cachedInputUsdPerM": 0.4,
        "aaUrl": "https://artificialanalysis.ai/zh/models/claude-opus-5-5-high",
        "apiUrl": "https://docs.anthropic.com/en/docs/models-overview",
        "releaseSourceIds": ["anthropic-opus55"],
        "apiSourceIds": ["anthropic-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 4. Claude Fable 5.1 Max
    {
        "id": "claude-fable-5-1",
        "name": "Claude Fable 5.1 · Max",
        "family": "Claude Fable 5.1",
        "provider": "Anthropic",
        "released": "2026-09-08",
        "effort": "Max",
        "aaRank": 4,
        "aaIndex": 53,
        "aaTaskUsd": 7.63,
        "apiInputUsdPerM": 10.0,
        "apiOutputUsdPerM": 50.0,
        "cachedInputUsdPerM": 1.0,
        "aaUrl": "https://artificialanalysis.ai/zh/models/claude-fable-5-1",
        "apiUrl": "https://docs.anthropic.com/en/docs/models-overview",
        "releaseSourceIds": ["anthropic-fable51"],
        "apiSourceIds": ["anthropic-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 5. Claude Fable 5.1 Xhigh
    {
        "id": "claude-fable-5-1-xhigh",
        "name": "Claude Fable 5.1 · Xhigh",
        "family": "Claude Fable 5.1",
        "provider": "Anthropic",
        "released": "2026-09-08",
        "effort": "Xhigh",
        "aaRank": 5,
        "aaIndex": 53,
        "aaTaskUsd": 5.98,
        "apiInputUsdPerM": 10.0,
        "apiOutputUsdPerM": 50.0,
        "cachedInputUsdPerM": 1.0,
        "aaUrl": "https://artificialanalysis.ai/zh/models/claude-fable-5-1-xhigh",
        "apiUrl": "https://docs.anthropic.com/en/docs/models-overview",
        "releaseSourceIds": ["anthropic-fable51"],
        "apiSourceIds": ["anthropic-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 6. GPT-6 Astra Max
    {
        "id": "gpt-6-astra",
        "name": "GPT-6 Astra · Max",
        "family": "GPT-6 Astra",
        "provider": "OpenAI",
        "released": "2026-09-03",
        "effort": "Max",
        "aaRank": 6,
        "aaIndex": 53,
        "aaTaskUsd": 3.26,
        "apiInputUsdPerM": 10.0,
        "apiOutputUsdPerM": 50.0,
        "cachedInputUsdPerM": 1.0,
        "aaUrl": "https://artificialanalysis.ai/zh/models/gpt-6-astra",
        "apiUrl": "https://developers.openai.com/api/docs/models/gpt-6-astra",
        "releaseSourceIds": ["openai-astra"],
        "apiSourceIds": ["openai-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 7. GPT-6 Astra Xhigh
    {
        "id": "gpt-6-astra-xhigh",
        "name": "GPT-6 Astra · Xhigh",
        "family": "GPT-6 Astra",
        "provider": "OpenAI",
        "released": "2026-09-03",
        "effort": "Xhigh",
        "aaRank": 7,
        "aaIndex": 52,
        "aaTaskUsd": 2.31,
        "apiInputUsdPerM": 10.0,
        "apiOutputUsdPerM": 50.0,
        "cachedInputUsdPerM": 1.0,
        "aaUrl": "https://artificialanalysis.ai/zh/models/gpt-6-astra-xhigh",
        "apiUrl": "https://developers.openai.com/api/docs/models/gpt-6-astra",
        "releaseSourceIds": ["openai-astra"],
        "apiSourceIds": ["openai-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 8. Claude Opus 5.5 Medium
    {
        "id": "claude-opus-5-5-medium",
        "name": "Claude Opus 5.5 · Medium",
        "family": "Claude Opus 5.5",
        "provider": "Anthropic",
        "released": "2026-09-22",
        "effort": "Medium",
        "aaRank": 8,
        "aaIndex": 51,
        "aaTaskUsd": 1.34,
        "apiInputUsdPerM": 4.0,
        "apiOutputUsdPerM": 20.0,
        "cachedInputUsdPerM": 0.4,
        "aaUrl": "https://artificialanalysis.ai/zh/models/claude-opus-5-5-medium",
        "apiUrl": "https://docs.anthropic.com/en/docs/models-overview",
        "releaseSourceIds": ["anthropic-opus55"],
        "apiSourceIds": ["anthropic-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 9. Claude Fable 5.1 High
    {
        "id": "claude-fable-5-1-high",
        "name": "Claude Fable 5.1 · High",
        "family": "Claude Fable 5.1",
        "provider": "Anthropic",
        "released": "2026-09-08",
        "effort": "High",
        "aaRank": 9,
        "aaIndex": 51,
        "aaTaskUsd": 3.91,
        "apiInputUsdPerM": 10.0,
        "apiOutputUsdPerM": 50.0,
        "cachedInputUsdPerM": 1.0,
        "aaUrl": "https://artificialanalysis.ai/zh/models/claude-fable-5-1-high",
        "apiUrl": "https://docs.anthropic.com/en/docs/models-overview",
        "releaseSourceIds": ["anthropic-fable51"],
        "apiSourceIds": ["anthropic-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 10. GPT-6 Astra High
    {
        "id": "gpt-6-astra-high",
        "name": "GPT-6 Astra · High",
        "family": "GPT-6 Astra",
        "provider": "OpenAI",
        "released": "2026-09-03",
        "effort": "High",
        "aaRank": 10,
        "aaIndex": 51,
        "aaTaskUsd": 1.73,
        "apiInputUsdPerM": 10.0,
        "apiOutputUsdPerM": 50.0,
        "cachedInputUsdPerM": 1.0,
        "aaUrl": "https://artificialanalysis.ai/zh/models/gpt-6-astra-high",
        "apiUrl": "https://developers.openai.com/api/docs/models/gpt-6-astra",
        "releaseSourceIds": ["openai-astra"],
        "apiSourceIds": ["openai-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 11. GPT-6 Astra Medium
    {
        "id": "gpt-6-astra-medium",
        "name": "GPT-6 Astra · Medium",
        "family": "GPT-6 Astra",
        "provider": "OpenAI",
        "released": "2026-09-03",
        "effort": "Medium",
        "aaRank": 11,
        "aaIndex": 50,
        "aaTaskUsd": 1.54,
        "apiInputUsdPerM": 10.0,
        "apiOutputUsdPerM": 50.0,
        "cachedInputUsdPerM": 1.0,
        "aaUrl": "https://artificialanalysis.ai/zh/models/gpt-6-astra-medium",
        "apiUrl": "https://developers.openai.com/api/docs/models/gpt-6-astra",
        "releaseSourceIds": ["openai-astra"],
        "apiSourceIds": ["openai-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 12. Claude Fable 5.1 Medium
    {
        "id": "claude-fable-5-1-medium",
        "name": "Claude Fable 5.1 · Medium",
        "family": "Claude Fable 5.1",
        "provider": "Anthropic",
        "released": "2026-09-08",
        "effort": "Medium",
        "aaRank": 12,
        "aaIndex": 49,
        "aaTaskUsd": 2.98,
        "apiInputUsdPerM": 10.0,
        "apiOutputUsdPerM": 50.0,
        "cachedInputUsdPerM": 1.0,
        "aaUrl": "https://artificialanalysis.ai/zh/models/claude-fable-5-1-medium",
        "apiUrl": "https://docs.anthropic.com/en/docs/models-overview",
        "releaseSourceIds": ["anthropic-fable51"],
        "apiSourceIds": ["anthropic-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 13. Muse Spark 1.3 Max
    {
        "id": "muse-spark-1-3",
        "name": "Muse Spark 1.3 · Max",
        "family": "Muse Spark 1.3",
        "provider": "Meta",
        "released": "2026-08-20",
        "effort": "Max",
        "aaRank": 13,
        "aaIndex": 48,
        "aaTaskUsd": 1.60,
        "apiInputUsdPerM": 1.25,
        "apiOutputUsdPerM": 4.25,
        "cachedInputUsdPerM": 0.25,
        "aaUrl": "https://artificialanalysis.ai/zh/models/muse-spark-1-3",
        "apiUrl": "https://about.meta.com/technologies/muse-spark",
        "releaseSourceIds": ["meta-muse-release"],
        "apiSourceIds": ["meta-muse-code-plans-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 14. GPT-6 Sol Max
    {
        "id": "gpt-6-sol",
        "name": "GPT-6 Sol · Max",
        "family": "GPT-6 Sol",
        "provider": "OpenAI",
        "released": "2026-09-22",
        "effort": "Max",
        "aaRank": 14,
        "aaIndex": 48,
        "aaTaskUsd": 1.06,
        "apiInputUsdPerM": 2.0,
        "apiOutputUsdPerM": 10.0,
        "cachedInputUsdPerM": 0.2,
        "aaUrl": "https://artificialanalysis.ai/zh/models/gpt-6-sol",
        "apiUrl": "https://developers.openai.com/api/docs/models/gpt-6-sol",
        "releaseSourceIds": ["openai-gpt6"],
        "apiSourceIds": ["openai-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 15. Claude Fable 5.1 Low
    {
        "id": "claude-fable-5-1-low",
        "name": "Claude Fable 5.1 · Low",
        "family": "Claude Fable 5.1",
        "provider": "Anthropic",
        "released": "2026-09-08",
        "effort": "Low",
        "aaRank": 15,
        "aaIndex": 47,
        "aaTaskUsd": 2.37,
        "apiInputUsdPerM": 10.0,
        "apiOutputUsdPerM": 50.0,
        "cachedInputUsdPerM": 1.0,
        "aaUrl": "https://artificialanalysis.ai/zh/models/claude-fable-5-1-low",
        "apiUrl": "https://docs.anthropic.com/en/docs/models-overview",
        "releaseSourceIds": ["anthropic-fable51"],
        "apiSourceIds": ["anthropic-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 16. Grok 4.7 Xhigh
    {
        "id": "grok-4-7",
        "name": "Grok 4.7 · Xhigh",
        "family": "Grok 4.7",
        "provider": "SpaceXAI",
        "released": "2026-09-17",
        "effort": "Xhigh",
        "aaRank": 16,
        "aaIndex": 46,
        "aaTaskUsd": 3.74,
        "apiInputUsdPerM": 2.0,
        "apiOutputUsdPerM": 6.0,
        "cachedInputUsdPerM": 0.5,
        "aaUrl": "https://artificialanalysis.ai/zh/models/grok-4-7",
        "apiUrl": "https://docs.x.ai/docs/models",
        "releaseSourceIds": ["xai-grok47"],
        "apiSourceIds": ["xai-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 17. Grok 4.7 High
    {
        "id": "grok-4-7-high",
        "name": "Grok 4.7 · High",
        "family": "Grok 4.7",
        "provider": "SpaceXAI",
        "released": "2026-09-17",
        "effort": "High",
        "aaRank": 17,
        "aaIndex": 46,
        "aaTaskUsd": 2.73,
        "apiInputUsdPerM": 2.0,
        "apiOutputUsdPerM": 6.0,
        "cachedInputUsdPerM": 0.5,
        "aaUrl": "https://artificialanalysis.ai/zh/models/grok-4-7-high",
        "apiUrl": "https://docs.x.ai/docs/models",
        "releaseSourceIds": ["xai-grok47"],
        "apiSourceIds": ["xai-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 18. MiMo-V2.6-Pro
    {
        "id": "mimo-v2-6-pro",
        "name": "MiMo-V2.6-Pro",
        "family": "MiMo-V2.6",
        "provider": "Xiaomi",
        "released": "2026-08-18",
        "effort": "Pro",
        "aaRank": 18,
        "aaIndex": 46,
        "aaTaskUsd": 0.13,
        "apiInputUsdPerM": 0.435,
        "apiOutputUsdPerM": 0.87,
        "cachedInputUsdPerM": 0.087,
        "aaUrl": "https://artificialanalysis.ai/zh/models/mimo-v2-6-pro",
        "apiUrl": "https://mimo.mi.com/docs/api/pricing",
        "releaseSourceIds": ["xiaomi-mimo26"],
        "apiSourceIds": ["xiaomi-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 19. GPT-6 Astra Low
    {
        "id": "gpt-6-astra-low",
        "name": "GPT-6 Astra · Low",
        "family": "GPT-6 Astra",
        "provider": "OpenAI",
        "released": "2026-09-03",
        "effort": "Low",
        "aaRank": 19,
        "aaIndex": 46,
        "aaTaskUsd": 0.82,
        "apiInputUsdPerM": 10.0,
        "apiOutputUsdPerM": 50.0,
        "cachedInputUsdPerM": 1.0,
        "aaUrl": "https://artificialanalysis.ai/zh/models/gpt-6-astra-low",
        "apiUrl": "https://developers.openai.com/api/docs/models/gpt-6-astra",
        "releaseSourceIds": ["openai-astra"],
        "apiSourceIds": ["openai-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 20. Qwen3.8 Max 0902
    {
        "id": "qwen3-8-max",
        "name": "Qwen3.8 Max · 0902",
        "family": "Qwen3.8 Max",
        "provider": "Alibaba",
        "released": "2026-09-02",
        "effort": "0902",
        "aaRank": 20,
        "aaIndex": 45,
        "aaTaskUsd": 5.41,
        "apiInputUsdPerM": 2.0,
        "apiOutputUsdPerM": 6.0,
        "cachedInputUsdPerM": 0.5,
        "aaUrl": "https://artificialanalysis.ai/zh/models/qwen3-8-max",
        "apiUrl": "https://help.aliyun.com/zh/model-studio/developer-reference/model-pricing",
        "releaseSourceIds": ["qwen-max0902"],
        "apiSourceIds": ["qwen-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 21. Muse Spark 1.3 Xhigh
    {
        "id": "muse-spark-1-3-xhigh",
        "name": "Muse Spark 1.3 · Xhigh",
        "family": "Muse Spark 1.3",
        "provider": "Meta",
        "released": "2026-08-20",
        "effort": "Xhigh",
        "aaRank": 21,
        "aaIndex": 45,
        "aaTaskUsd": 1.37,
        "apiInputUsdPerM": 1.25,
        "apiOutputUsdPerM": 4.25,
        "cachedInputUsdPerM": 0.25,
        "aaUrl": "https://artificialanalysis.ai/zh/models/muse-spark-1-3-xhigh",
        "apiUrl": "https://about.meta.com/technologies/muse-spark",
        "releaseSourceIds": ["meta-muse-release"],
        "apiSourceIds": ["meta-muse-code-plans-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 22. GLM-5.3 Max
    {
        "id": "glm-5-3",
        "name": "GLM-5.3 · Max",
        "family": "GLM-5.3",
        "provider": "Z AI",
        "released": "2026-07-30",
        "effort": "Max",
        "aaRank": 22,
        "aaIndex": 45,
        "aaTaskUsd": 2.01,
        "apiInputUsdPerM": 1.4,
        "apiOutputUsdPerM": 4.4,
        "cachedInputUsdPerM": 0.28,
        "aaUrl": "https://artificialanalysis.ai/zh/models/glm-5-3",
        "apiUrl": "https://open.bigmodel.cn/pricing",
        "releaseSourceIds": ["zhipu-glm53"],
        "apiSourceIds": ["zhipu-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 23. Grok 4.6 High
    {
        "id": "grok-4-6",
        "name": "Grok 4.6 · High",
        "family": "Grok 4.6",
        "provider": "SpaceXAI",
        "released": "2026-08-27",
        "effort": "High",
        "aaRank": 23,
        "aaIndex": 44,
        "aaTaskUsd": 1.86,
        "apiInputUsdPerM": 2.0,
        "apiOutputUsdPerM": 6.0,
        "cachedInputUsdPerM": 0.5,
        "aaUrl": "https://artificialanalysis.ai/zh/models/grok-4-6",
        "apiUrl": "https://docs.x.ai/docs/models",
        "releaseSourceIds": ["xai-grok46"],
        "apiSourceIds": ["xai-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 24. Grok 4.6 Xhigh
    {
        "id": "grok-4-6-xhigh",
        "name": "Grok 4.6 · Xhigh",
        "family": "Grok 4.6",
        "provider": "SpaceXAI",
        "released": "2026-08-27",
        "effort": "Xhigh",
        "aaRank": 24,
        "aaIndex": 44,
        "aaTaskUsd": 2.32,
        "apiInputUsdPerM": 2.0,
        "apiOutputUsdPerM": 6.0,
        "cachedInputUsdPerM": 0.5,
        "aaUrl": "https://artificialanalysis.ai/zh/models/grok-4-6-xhigh",
        "apiUrl": "https://docs.x.ai/docs/models",
        "releaseSourceIds": ["xai-grok46"],
        "apiSourceIds": ["xai-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 25. GPT-6 Sol Xhigh
    {
        "id": "gpt-6-sol-xhigh",
        "name": "GPT-6 Sol · Xhigh",
        "family": "GPT-6 Sol",
        "provider": "OpenAI",
        "released": "2026-09-22",
        "effort": "Xhigh",
        "aaRank": 25,
        "aaIndex": 44,
        "aaTaskUsd": 0.53,
        "apiInputUsdPerM": 2.0,
        "apiOutputUsdPerM": 10.0,
        "cachedInputUsdPerM": 0.2,
        "aaUrl": "https://artificialanalysis.ai/zh/models/gpt-6-sol-xhigh",
        "apiUrl": "https://developers.openai.com/api/docs/models/gpt-6-sol",
        "releaseSourceIds": ["openai-gpt6"],
        "apiSourceIds": ["openai-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 26. Step 5 Preview
    {
        "id": "step-5",
        "name": "Step 5 Preview",
        "family": "Step 5",
        "provider": "StepFun",
        "released": "2026-08-15",
        "effort": "Preview",
        "aaRank": 26,
        "aaIndex": 44,
        "aaTaskUsd": 0.72,
        "apiInputUsdPerM": 1.0,
        "apiOutputUsdPerM": 2.7,
        "cachedInputUsdPerM": 0.2,
        "aaUrl": "https://artificialanalysis.ai/zh/models/step-5",
        "apiUrl": "https://platform.stepfun.com/docs/models",
        "releaseSourceIds": ["stepfun-step5"],
        "apiSourceIds": ["stepfun-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 27. Kimi K3 Max
    {
        "id": "kimi-k3",
        "name": "Kimi K3 · Max",
        "family": "Kimi K3",
        "provider": "Kimi",
        "released": "2026-08-04",
        "effort": "Max",
        "aaRank": 27,
        "aaIndex": 44,
        "aaTaskUsd": 2.00,
        "apiInputUsdPerM": 3.0,
        "apiOutputUsdPerM": 15.0,
        "cachedInputUsdPerM": 0.3,
        "aaUrl": "https://artificialanalysis.ai/zh/models/kimi-k3",
        "apiUrl": "https://platform.moonshot.cn/docs/pricing",
        "releaseSourceIds": ["moonshot-k3"],
        "apiSourceIds": ["moonshot-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 28. Grok 4.6 Medium
    {
        "id": "grok-4-6-medium",
        "name": "Grok 4.6 · Medium",
        "family": "Grok 4.6",
        "provider": "SpaceXAI",
        "released": "2026-08-27",
        "effort": "Medium",
        "aaRank": 28,
        "aaIndex": 43,
        "aaTaskUsd": 1.50,
        "apiInputUsdPerM": 2.0,
        "apiOutputUsdPerM": 6.0,
        "cachedInputUsdPerM": 0.5,
        "aaUrl": "https://artificialanalysis.ai/zh/models/grok-4-6-medium",
        "apiUrl": "https://docs.x.ai/docs/models",
        "releaseSourceIds": ["xai-grok46"],
        "apiSourceIds": ["xai-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 29. GPT-6 Sol High
    {
        "id": "gpt-6-sol-high",
        "name": "GPT-6 Sol · High",
        "family": "GPT-6 Sol",
        "provider": "OpenAI",
        "released": "2026-09-22",
        "effort": "High",
        "aaRank": 29,
        "aaIndex": 43,
        "aaTaskUsd": 0.37,
        "apiInputUsdPerM": 2.0,
        "apiOutputUsdPerM": 10.0,
        "cachedInputUsdPerM": 0.2,
        "aaUrl": "https://artificialanalysis.ai/zh/models/gpt-6-sol-high",
        "apiUrl": "https://developers.openai.com/api/docs/models/gpt-6-sol",
        "releaseSourceIds": ["openai-gpt6"],
        "apiSourceIds": ["openai-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 30. Claude Opus 5.5 Low
    {
        "id": "claude-opus-5-5-low",
        "name": "Claude Opus 5.5 · Low",
        "family": "Claude Opus 5.5",
        "provider": "Anthropic",
        "released": "2026-09-22",
        "effort": "Low",
        "aaRank": 30,
        "aaIndex": 42,
        "aaTaskUsd": 0.55,
        "apiInputUsdPerM": 4.0,
        "apiOutputUsdPerM": 20.0,
        "cachedInputUsdPerM": 0.4,
        "aaUrl": "https://artificialanalysis.ai/zh/models/claude-opus-5-5-low",
        "apiUrl": "https://docs.anthropic.com/en/docs/models-overview",
        "releaseSourceIds": ["anthropic-opus55"],
        "apiSourceIds": ["anthropic-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 31. GPT-5.6 Terra Max
    {
        "id": "gpt-5-6-terra",
        "name": "GPT-5.6 Terra · Max",
        "family": "GPT-5.6 Terra",
        "provider": "OpenAI",
        "released": "2026-07-09",
        "effort": "Max",
        "aaRank": 31,
        "aaIndex": 42,
        "aaTaskUsd": 1.40,
        "apiInputUsdPerM": 2.0,
        "apiOutputUsdPerM": 12.0,
        "cachedInputUsdPerM": 0.2,
        "aaUrl": "https://artificialanalysis.ai/zh/models/gpt-5-6-terra",
        "apiUrl": "https://developers.openai.com/api/docs/models/gpt-5.6-terra",
        "releaseSourceIds": ["openai-gpt56"],
        "apiSourceIds": ["openai-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 32. GLM-5.3-Flash
    {
        "id": "glm-5-3-flash",
        "name": "GLM-5.3-Flash",
        "family": "GLM-5.3",
        "provider": "Z AI",
        "released": "2026-07-30",
        "effort": "Flash",
        "aaRank": 32,
        "aaIndex": 42,
        "aaTaskUsd": 0.25,
        "apiInputUsdPerM": 0.15,
        "apiOutputUsdPerM": 0.5,
        "cachedInputUsdPerM": 0.03,
        "aaUrl": "https://artificialanalysis.ai/zh/models/glm-5-3-flash",
        "apiUrl": "https://open.bigmodel.cn/pricing",
        "releaseSourceIds": ["zhipu-glm53"],
        "apiSourceIds": ["zhipu-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 33. Gemini 3.8 Flash High
    {
        "id": "gemini-3-8-flash",
        "name": "Gemini 3.8 Flash · High",
        "family": "Gemini 3.8 Flash",
        "provider": "Google",
        "released": "2026-09-15",
        "effort": "High",
        "aaRank": 33,
        "aaIndex": 41,
        "aaTaskUsd": 1.24,
        "apiInputUsdPerM": 0.75,
        "apiOutputUsdPerM": 3.75,
        "cachedInputUsdPerM": 0.075,
        "aaUrl": "https://artificialanalysis.ai/zh/models/gemini-3-8-flash",
        "apiUrl": "https://ai.google.dev/pricing",
        "releaseSourceIds": ["google-gemini38"],
        "apiSourceIds": ["google-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 34. Qwen3.8 2.4T A95B
    {
        "id": "qwen3-8-2-4t-a95b",
        "name": "Qwen3.8 2.4T A95B",
        "family": "Qwen3.8",
        "provider": "Alibaba",
        "released": "2026-08-25",
        "effort": "A95B",
        "aaRank": 34,
        "aaIndex": 40,
        "aaTaskUsd": 2.16,
        "apiInputUsdPerM": 2.0,
        "apiOutputUsdPerM": 6.0,
        "cachedInputUsdPerM": 0.5,
        "aaUrl": "https://artificialanalysis.ai/zh/models/qwen3-8-2-4t-a95b",
        "apiUrl": "https://help.aliyun.com/zh/model-studio/developer-reference/model-pricing",
        "releaseSourceIds": ["qwen-max0902"],
        "apiSourceIds": ["qwen-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 35. Qwen3.8-Flash-Next
    {
        "id": "qwen3-8-flash-next",
        "name": "Qwen3.8-Flash-Next",
        "family": "Qwen3.8",
        "provider": "Alibaba",
        "released": "2026-08-15",
        "effort": "Flash",
        "aaRank": 35,
        "aaIndex": 40,
        "aaTaskUsd": 0.37,
        "apiInputUsdPerM": 0.15,
        "apiOutputUsdPerM": 0.47,
        "cachedInputUsdPerM": 0.03,
        "aaUrl": "https://artificialanalysis.ai/zh/models/qwen3-8-flash-next",
        "apiUrl": "https://help.aliyun.com/zh/model-studio/developer-reference/model-pricing",
        "releaseSourceIds": ["qwen-max0902"],
        "apiSourceIds": ["qwen-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 36. GPT-6 Sol Medium
    {
        "id": "gpt-6-sol-medium",
        "name": "GPT-6 Sol · Medium",
        "family": "GPT-6 Sol",
        "provider": "OpenAI",
        "released": "2026-09-22",
        "effort": "Medium",
        "aaRank": 36,
        "aaIndex": 40,
        "aaTaskUsd": 0.25,
        "apiInputUsdPerM": 2.0,
        "apiOutputUsdPerM": 10.0,
        "cachedInputUsdPerM": 0.2,
        "aaUrl": "https://artificialanalysis.ai/zh/models/gpt-6-sol-medium",
        "apiUrl": "https://developers.openai.com/api/docs/models/gpt-6-sol",
        "releaseSourceIds": ["openai-gpt6"],
        "apiSourceIds": ["openai-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 37. Gemini 3.8 Flash Medium
    {
        "id": "gemini-3-8-flash-medium",
        "name": "Gemini 3.8 Flash · Medium",
        "family": "Gemini 3.8 Flash",
        "provider": "Google",
        "released": "2026-09-15",
        "effort": "Medium",
        "aaRank": 37,
        "aaIndex": 40,
        "aaTaskUsd": 0.93,
        "apiInputUsdPerM": 0.75,
        "apiOutputUsdPerM": 3.75,
        "cachedInputUsdPerM": 0.075,
        "aaUrl": "https://artificialanalysis.ai/zh/models/gemini-3-8-flash-medium",
        "apiUrl": "https://ai.google.dev/pricing",
        "releaseSourceIds": ["google-gemini38"],
        "apiSourceIds": ["google-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 38. DeepSeek V4.1 Flash Max
    {
        "id": "deepseek-v4-1-flash",
        "name": "DeepSeek V4.1 Flash · Max",
        "family": "DeepSeek V4.1 Flash",
        "provider": "DeepSeek",
        "released": "2026-08-20",
        "effort": "Max",
        "aaRank": 38,
        "aaIndex": 39,
        "aaTaskUsd": 0.27,
        "apiInputUsdPerM": 0.3,
        "apiOutputUsdPerM": 1.2,
        "cachedInputUsdPerM": 0.03,
        "aaUrl": "https://artificialanalysis.ai/zh/models/deepseek-v4-1-flash",
        "apiUrl": "https://platform.deepseek.com/api-docs/pricing/",
        "releaseSourceIds": ["deepseek-v41"],
        "apiSourceIds": ["deepseek-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 39. Claude Sonnet 5 Max
    {
        "id": "claude-sonnet-5",
        "name": "Claude Sonnet 5 · Max",
        "family": "Claude Sonnet 5",
        "provider": "Anthropic",
        "released": "2026-08-11",
        "effort": "Max",
        "aaRank": 39,
        "aaIndex": 38,
        "aaTaskUsd": 5.09,
        "apiInputUsdPerM": 2.0,
        "apiOutputUsdPerM": 10.0,
        "cachedInputUsdPerM": 0.2,
        "aaUrl": "https://artificialanalysis.ai/zh/models/claude-sonnet-5",
        "apiUrl": "https://docs.anthropic.com/en/docs/models-overview",
        "releaseSourceIds": ["anthropic-sonnet5"],
        "apiSourceIds": ["anthropic-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 40. GPT-5.6 Terra Xhigh
    {
        "id": "gpt-5-6-terra-xhigh",
        "name": "GPT-5.6 Terra · Xhigh",
        "family": "GPT-5.6 Terra",
        "provider": "OpenAI",
        "released": "2026-07-09",
        "effort": "Xhigh",
        "aaRank": 40,
        "aaIndex": 38,
        "aaTaskUsd": 0.63,
        "apiInputUsdPerM": 2.0,
        "apiOutputUsdPerM": 12.0,
        "cachedInputUsdPerM": 0.2,
        "aaUrl": "https://artificialanalysis.ai/zh/models/gpt-5-6-terra-xhigh",
        "apiUrl": "https://developers.openai.com/api/docs/models/gpt-5.6-terra",
        "releaseSourceIds": ["openai-gpt56"],
        "apiSourceIds": ["openai-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 41. GPT-6 Luna Max
    {
        "id": "gpt-6-luna",
        "name": "GPT-6 Luna · Max",
        "family": "GPT-6 Luna",
        "provider": "OpenAI",
        "released": "2026-09-22",
        "effort": "Max",
        "aaRank": 41,
        "aaIndex": 37,
        "aaTaskUsd": 0.07,
        "apiInputUsdPerM": 0.1,
        "apiOutputUsdPerM": 0.5,
        "cachedInputUsdPerM": 0.01,
        "aaUrl": "https://artificialanalysis.ai/zh/models/gpt-6-luna",
        "apiUrl": "https://developers.openai.com/api/docs/models/gpt-6-luna",
        "releaseSourceIds": ["openai-gpt6"],
        "apiSourceIds": ["openai-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 42. DeepSeek V4 Pro 0813
    {
        "id": "deepseek-v4-pro-0813",
        "name": "DeepSeek V4 Pro · 0813",
        "family": "DeepSeek V4 Pro",
        "provider": "DeepSeek",
        "released": "2026-08-13",
        "effort": "0813",
        "aaRank": 42,
        "aaIndex": 36,
        "aaTaskUsd": 0.67,
        "apiInputUsdPerM": 1.32,
        "apiOutputUsdPerM": 3.96,
        "cachedInputUsdPerM": 0.132,
        "aaUrl": "https://artificialanalysis.ai/zh/models/deepseek-v4-pro",
        "apiUrl": "https://platform.deepseek.com/api-docs/pricing/",
        "releaseSourceIds": ["deepseek-v4pro"],
        "apiSourceIds": ["deepseek-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 45. Grok 4.6 Low
    {
        "id": "grok-4-6-low",
        "name": "Grok 4.6 · Low",
        "family": "Grok 4.6",
        "provider": "SpaceXAI",
        "released": "2026-08-27",
        "effort": "Low",
        "aaRank": 45,
        "aaIndex": 35,
        "aaTaskUsd": 0.48,
        "apiInputUsdPerM": 2.0,
        "apiOutputUsdPerM": 6.0,
        "cachedInputUsdPerM": 0.5,
        "aaUrl": "https://artificialanalysis.ai/zh/models/grok-4-6-low",
        "apiUrl": "https://docs.x.ai/docs/models",
        "releaseSourceIds": ["xai-grok46"],
        "apiSourceIds": ["xai-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 46. DeepSeek V4 Flash Vision Max
    {
        "id": "deepseek-v4-flash-vision",
        "name": "DeepSeek V4 Flash Vision · Max",
        "family": "DeepSeek V4 Flash Vision",
        "provider": "DeepSeek",
        "released": "2026-08-20",
        "effort": "Max",
        "aaRank": 46,
        "aaIndex": 35,
        "aaTaskUsd": 0.31,
        "apiInputUsdPerM": 0.3,
        "apiOutputUsdPerM": 1.2,
        "cachedInputUsdPerM": 0.03,
        "aaUrl": "https://artificialanalysis.ai/zh/models/deepseek-v4-flash-vision",
        "apiUrl": "https://platform.deepseek.com/api-docs/pricing/",
        "releaseSourceIds": ["deepseek-v41"],
        "apiSourceIds": ["deepseek-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 47. Kimi K3 Low
    {
        "id": "kimi-k3-low",
        "name": "Kimi K3 · Low",
        "family": "Kimi K3",
        "provider": "Kimi",
        "released": "2026-08-04",
        "effort": "Low",
        "aaRank": 47,
        "aaIndex": 34,
        "aaTaskUsd": 0.40,
        "apiInputUsdPerM": 3.0,
        "apiOutputUsdPerM": 15.0,
        "cachedInputUsdPerM": 0.3,
        "aaUrl": "https://artificialanalysis.ai/zh/models/kimi-k3-low",
        "apiUrl": "https://platform.moonshot.cn/docs/pricing",
        "releaseSourceIds": ["moonshot-k3"],
        "apiSourceIds": ["moonshot-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 48. Claude Sonnet 5 Xhigh
    {
        "id": "claude-sonnet-5-xhigh",
        "name": "Claude Sonnet 5 · Xhigh",
        "family": "Claude Sonnet 5",
        "provider": "Anthropic",
        "released": "2026-08-11",
        "effort": "Xhigh",
        "aaRank": 48,
        "aaIndex": 34,
        "aaTaskUsd": 2.87,
        "apiInputUsdPerM": 2.0,
        "apiOutputUsdPerM": 10.0,
        "cachedInputUsdPerM": 0.2,
        "aaUrl": "https://artificialanalysis.ai/zh/models/claude-sonnet-5-xhigh",
        "apiUrl": "https://docs.anthropic.com/en/docs/models-overview",
        "releaseSourceIds": ["anthropic-sonnet5"],
        "apiSourceIds": ["anthropic-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 49. GPT-5.6 Terra High
    {
        "id": "gpt-5-6-terra-high",
        "name": "GPT-5.6 Terra · High",
        "family": "GPT-5.6 Terra",
        "provider": "OpenAI",
        "released": "2026-07-09",
        "effort": "High",
        "aaRank": 49,
        "aaIndex": 34,
        "aaTaskUsd": 0.34,
        "apiInputUsdPerM": 2.0,
        "apiOutputUsdPerM": 12.0,
        "cachedInputUsdPerM": 0.2,
        "aaUrl": "https://artificialanalysis.ai/zh/models/gpt-5-6-terra-high",
        "apiUrl": "https://developers.openai.com/api/docs/models/gpt-5.6-terra",
        "releaseSourceIds": ["openai-gpt56"],
        "apiSourceIds": ["openai-api"],
        "benchmarkSourceIds": ["aa-models"]
    },
    # 50. GPT-6 Sol Low
    {
        "id": "gpt-6-sol-low",
        "name": "GPT-6 Sol · Low",
        "family": "GPT-6 Sol",
        "provider": "OpenAI",
        "released": "2026-09-22",
        "effort": "Low",
        "aaRank": 50,
        "aaIndex": 34,
        "aaTaskUsd": 0.13,
        "apiInputUsdPerM": 2.0,
        "apiOutputUsdPerM": 10.0,
        "cachedInputUsdPerM": 0.2,
        "aaUrl": "https://artificialanalysis.ai/zh/models/gpt-6-sol-low",
        "apiUrl": "https://developers.openai.com/api/docs/models/gpt-6-sol",
        "releaseSourceIds": ["openai-gpt6"],
        "apiSourceIds": ["openai-api"],
        "benchmarkSourceIds": ["aa-models"]
    }
]

print(f"Total defined commercial models: {len(aa_models_48)}")
catalog["models"] = aa_models_48
valid_model_ids = {m["id"] for m in aa_models_48}

# Update modelAudit
model_audit = []
for m in aa_models_48:
    model_audit.append({
        "id": m["id"],
        "name": m["name"],
        "released": m["released"],
        "outcome": "included",
        "sourceIds": m["releaseSourceIds"],
        "reason": f"Artificial Analysis 官方排名前 50 核心基准模型（排名 #{m['aaRank']}，智力指数 {m['aaIndex']}，每任务成本 ${m['aaTaskUsd']:.2f}）"
    })

# Add Rank 43 and Rank 44 (Sapiens AI)
model_audit.append({
    "id": "agnes-3-0-flash",
    "name": "Agnes 3.0 Flash",
    "outcome": "excluded",
    "reason": "Artificial Analysis 虽有性能评分（#43），但官方未开放公开商业 API 单价与订阅套餐，无法进行经济性核算",
    "sourceIds": ["aa-models"]
})
model_audit.append({
    "id": "agnes-2-5-pro-beta",
    "name": "Agnes 2.5 Pro Beta",
    "outcome": "excluded",
    "reason": "Artificial Analysis 虽有性能评分（#44），但官方未开放公开商业 API 单价与订阅套餐，无法进行经济性核算",
    "sourceIds": ["aa-models"]
})

# Add older excluded models
excluded_older = [
    ("claude-opus-5", "Claude Opus 5 · Max", "2026-07-28", ["anthropic-opus5"]),
    ("gpt-5-6-sol", "GPT-5.6 Sol · Medium", "2026-07-09", ["openai-gpt56"]),
    ("gpt-5-6-luna", "GPT-5.6 Luna · Medium", "2026-07-09", ["openai-gpt56"]),
    ("gpt-5-5-instant", "GPT-5.5 Instant", "2026-05-05", ["openai-chat-models"]),
    ("kimi-k2-7-code", "Kimi K2.7 Code", "2026-06-12", ["kimi-release"]),
    ("minimax-m3", "MiniMax M3", "2026-06-01", ["aa-models"]),
    ("qwen3-7-plus", "Qwen3.7 Plus", "2026-06-01", ["qwen-max0902"]),
    ("mimo-v2-6-pro-ultraspeed", "MiMo-V2.6-Pro-Ultraspeed", "2026-09-22", ["xiaomi-mimo26"]),
    ("qwen3-8-omni-flash-realtime", "Qwen3.8 Omni Flash Realtime", "2026-09-21", ["qwen-max0902"])
]
for eid, ename, erel, esrc in excluded_older:
    model_audit.append({
        "id": eid,
        "name": ename,
        "released": erel,
        "outcome": "excluded",
        "reason": "不在 Artificial Analysis 排名前 50 范围内",
        "sourceIds": esrc
    })

catalog["meta"]["modelAudit"] = model_audit

# Update copilotRates
copilot_rates = {
    "gpt-6-astra": {"inputUsdPerM": 10, "outputUsdPerM": 50, "sourceId": "copilot-rates"},
    "gpt-6-astra-xhigh": {"inputUsdPerM": 10, "outputUsdPerM": 50, "sourceId": "copilot-rates"},
    "gpt-6-astra-high": {"inputUsdPerM": 10, "outputUsdPerM": 50, "sourceId": "copilot-rates"},
    "gpt-6-astra-medium": {"inputUsdPerM": 10, "outputUsdPerM": 50, "sourceId": "copilot-rates"},
    "gpt-6-astra-low": {"inputUsdPerM": 10, "outputUsdPerM": 50, "sourceId": "copilot-rates"},
    "gpt-6-sol": {"inputUsdPerM": 2, "outputUsdPerM": 10, "sourceId": "copilot-rates"},
    "gpt-6-sol-xhigh": {"inputUsdPerM": 2, "outputUsdPerM": 10, "sourceId": "copilot-rates"},
    "gpt-6-sol-high": {"inputUsdPerM": 2, "outputUsdPerM": 10, "sourceId": "copilot-rates"},
    "gpt-6-sol-medium": {"inputUsdPerM": 2, "outputUsdPerM": 10, "sourceId": "copilot-rates"},
    "gpt-6-sol-low": {"inputUsdPerM": 2, "outputUsdPerM": 10, "sourceId": "copilot-rates"},
    "gpt-6-luna": {"inputUsdPerM": 0.1, "outputUsdPerM": 0.5, "sourceId": "copilot-rates"},
    "gpt-5-6-terra": {"inputUsdPerM": 2, "outputUsdPerM": 12, "sourceId": "copilot-rates"},
    "gpt-5-6-terra-xhigh": {"inputUsdPerM": 2, "outputUsdPerM": 12, "sourceId": "copilot-rates"},
    "gpt-5-6-terra-high": {"inputUsdPerM": 2, "outputUsdPerM": 12, "sourceId": "copilot-rates"},
    "claude-opus-5-5": {"inputUsdPerM": 4, "outputUsdPerM": 20, "sourceId": "copilot-rates"},
    "claude-opus-5-5-xhigh": {"inputUsdPerM": 4, "outputUsdPerM": 20, "sourceId": "copilot-rates"},
    "claude-opus-5-5-high": {"inputUsdPerM": 4, "outputUsdPerM": 20, "sourceId": "copilot-rates"},
    "claude-opus-5-5-medium": {"inputUsdPerM": 4, "outputUsdPerM": 20, "sourceId": "copilot-rates"},
    "claude-opus-5-5-low": {"inputUsdPerM": 4, "outputUsdPerM": 20, "sourceId": "copilot-rates"},
    "claude-fable-5-1": {"inputUsdPerM": 10, "outputUsdPerM": 50, "sourceId": "copilot-rates"},
    "claude-fable-5-1-xhigh": {"inputUsdPerM": 10, "outputUsdPerM": 50, "sourceId": "copilot-rates"},
    "claude-fable-5-1-high": {"inputUsdPerM": 10, "outputUsdPerM": 50, "sourceId": "copilot-rates"},
    "claude-fable-5-1-medium": {"inputUsdPerM": 10, "outputUsdPerM": 50, "sourceId": "copilot-rates"},
    "claude-fable-5-1-low": {"inputUsdPerM": 10, "outputUsdPerM": 50, "sourceId": "copilot-rates"},
    "claude-sonnet-5": {"inputUsdPerM": 2, "outputUsdPerM": 10, "sourceId": "copilot-rates"},
    "claude-sonnet-5-xhigh": {"inputUsdPerM": 2, "outputUsdPerM": 10, "sourceId": "copilot-rates"},
    "gemini-3-8-flash": {"inputUsdPerM": 0.75, "outputUsdPerM": 3.75, "sourceId": "copilot-rates"},
    "gemini-3-8-flash-medium": {"inputUsdPerM": 0.75, "outputUsdPerM": 3.75, "sourceId": "copilot-rates"},
    "grok-4-6": {"inputUsdPerM": 2, "outputUsdPerM": 6, "sourceId": "copilot-rates"},
    "grok-4-6-xhigh": {"inputUsdPerM": 2, "outputUsdPerM": 6, "sourceId": "copilot-rates"},
    "grok-4-6-medium": {"inputUsdPerM": 2, "outputUsdPerM": 6, "sourceId": "copilot-rates"},
    "grok-4-6-low": {"inputUsdPerM": 2, "outputUsdPerM": 6, "sourceId": "copilot-rates"},
    "grok-4-7": {"inputUsdPerM": 2, "outputUsdPerM": 6, "sourceId": "copilot-rates"},
    "grok-4-7-high": {"inputUsdPerM": 2, "outputUsdPerM": 6, "sourceId": "copilot-rates"},
    "kimi-k3": {"inputUsdPerM": 3, "outputUsdPerM": 15, "sourceId": "copilot-rates"},
    "kimi-k3-low": {"inputUsdPerM": 3, "outputUsdPerM": 15, "sourceId": "copilot-rates"},
}
catalog["copilotRates"] = copilot_rates

# Update plans:
# 1) Replace claude-opus-5 with claude-opus-5-5
# 2) For ChatGPT plans: add all effort tiers of Astra, Sol, Terra, Luna
# 3) For Claude plans: add all effort tiers of Opus 5.5, Fable 5.1, Sonnet 5
# 4) For Grok plans: add all effort tiers of Grok 4.6 and Grok 4.7
# 5) For Gemini plans: add Flash High and Medium
# 6) For Muse plans: add Max and Xhigh
# 7) For Kimi plans: add Max and Low
# 8) For Kiro plans: replace claude-opus-5 with claude-opus-5-5

openai_reasoning_tiers = [
    "gpt-6-astra", "gpt-6-astra-xhigh", "gpt-6-astra-high", "gpt-6-astra-medium", "gpt-6-astra-low",
    "gpt-6-sol", "gpt-6-sol-xhigh", "gpt-6-sol-high", "gpt-6-sol-medium", "gpt-6-sol-low",
    "gpt-5-6-terra", "gpt-5-6-terra-xhigh", "gpt-5-6-terra-high",
    "gpt-6-luna"
]

claude_opus_tiers = [
    "claude-opus-5-5", "claude-opus-5-5-xhigh", "claude-opus-5-5-high", "claude-opus-5-5-medium", "claude-opus-5-5-low"
]
claude_fable_tiers = [
    "claude-fable-5-1", "claude-fable-5-1-xhigh", "claude-fable-5-1-high", "claude-fable-5-1-medium", "claude-fable-5-1-low"
]
claude_sonnet_tiers = [
    "claude-sonnet-5", "claude-sonnet-5-xhigh"
]

grok_tiers = [
    "grok-4-7", "grok-4-7-high",
    "grok-4-6", "grok-4-6-xhigh", "grok-4-6-medium", "grok-4-6-low"
]

gemini_tiers = ["gemini-3-8-flash", "gemini-3-8-flash-medium"]
muse_tiers = ["muse-spark-1-3", "muse-spark-1-3-xhigh"]
kimi_tiers = ["kimi-k3", "kimi-k3-low"]

for plan in catalog["plans"]:
    mids = plan.get("modelIds", [])
    new_mids = []
    
    # Replace claude-opus-5 with claude-opus-5-5
    mids = ["claude-opus-5-5" if m == "claude-opus-5" else m for m in mids]
    
    if plan["id"] in ["chatgpt-plus", "chatgpt-pro", "chatgpt-business-standard", "chatgpt-business-premium"]:
        new_mids = list(openai_reasoning_tiers)
    elif plan["id"] in ["claude-pro", "claude-team-standard"]:
        new_mids = list(claude_opus_tiers + claude_sonnet_tiers)
    elif plan["id"] in ["claude-max-5x", "claude-max-20x", "claude-team-premium", "claude-code-cli"]:
        new_mids = list(claude_opus_tiers + claude_fable_tiers + claude_sonnet_tiers)
    elif plan["id"] in ["supergrok", "supergrok-plus"]:
        new_mids = list(grok_tiers)
    elif plan["id"] in ["google-ai-pro", "google-ai-ultra-5x", "google-ai-ultra-20x"]:
        new_mids = list(gemini_tiers)
    elif plan["id"] in ["meta-muse-code-everyday", "meta-muse-code-high", "meta-muse-code-power"]:
        new_mids = list(muse_tiers)
    elif plan["id"] in ["kimi-andante", "kimi-moderato", "kimi-allegretto", "kimi-allegro"]:
        new_mids = list(kimi_tiers)
    elif plan["id"] in ["kiro-pro", "kiro-pro-plus", "kiro-pro-max", "kiro-power"]:
        new_mids = ["gpt-5-6-terra", "claude-opus-5-5", "claude-sonnet-5"]
        # Update monthlyTasksByModelId
        if plan.get("usage", {}).get("monthlyTasksByModelId"):
            tasks = plan["usage"]["monthlyTasksByModelId"]
            if "claude-opus-5" in tasks:
                tasks["claude-opus-5-5"] = tasks.pop("claude-opus-5")
    elif plan["id"] in ["cursor-pro", "cursor-pro-plus", "cursor-ultra", "cursor-team-standard", "cursor-team-premium"]:
        new_mids = [
            "claude-opus-5-5", "claude-opus-5-5-high", "claude-fable-5-1", "claude-sonnet-5",
            "gpt-6-astra", "gpt-6-sol", "gpt-5-6-terra",
            "gemini-3-8-flash", "gemini-3-8-flash-medium",
            "grok-4-6", "grok-4-7", "muse-spark-1-3"
        ]
    elif plan["id"] in ["copilot-pro"]:
        new_mids = [
            "gpt-6-luna", "gpt-5-6-terra", "claude-sonnet-5", "gemini-3-8-flash", "grok-4-6", "grok-4-7", "kimi-k3"
        ]
    elif plan["id"] in ["copilot-pro-plus", "copilot-max", "copilot-business", "copilot-enterprise"]:
        new_mids = [
            "gpt-6-astra", "gpt-6-sol", "gpt-6-luna", "gpt-5-6-terra",
            "claude-opus-5-5", "claude-fable-5-1", "claude-sonnet-5",
            "gemini-3-8-flash", "grok-4-6", "grok-4-7", "kimi-k3"
        ]
    elif plan["id"] == "cline-pass":
        new_mids = [
            "deepseek-v4-pro-0813", "deepseek-v4-1-flash", "deepseek-v4-flash-vision",
            "qwen3-8-max", "qwen3-8-flash-next", "kimi-k3", "kimi-k3-low",
            "glm-5-3", "mimo-v2-6-pro"
        ]
    elif plan["id"] in ["jetbrains-ai-pro", "jetbrains-ai-ultimate"]:
        new_mids = ["claude-sonnet-5", "claude-opus-5-5", "gemini-3-8-flash", "gpt-6-luna", "gpt-5-6-terra"]
    elif plan["id"] == "coze-china-pro":
        new_mids = ["glm-5-3", "kimi-k3", "kimi-k3-low", "qwen3-8-max", "deepseek-v4-1-flash", "deepseek-v4-pro-0813"]
    else:
        # Default: keep valid models only, deduplicated
        new_mids = [m for m in mids if m in valid_model_ids]

    # Deduplicate while preserving order
    seen = set()
    deduped = []
    for m in new_mids:
        if m in valid_model_ids and m not in seen:
            deduped.append(m)
            seen.add(m)
    plan["modelIds"] = deduped

# Also clean unpairedPlans
for plan in catalog["unpairedPlans"]:
    if "modelIds" in plan:
        mids = ["claude-opus-5-5" if m == "claude-opus-5" else m for m in plan["modelIds"]]
        plan["modelIds"] = [m for m in mids if m in valid_model_ids]

# Verify that all 48 models are compared by at least one plan
compared = set()
for p in catalog["plans"]:
    for m in p.get("modelIds", []):
        compared.add(m)

missing_compared = valid_model_ids - compared
print(f"Compared models count: {len(compared)} / {len(valid_model_ids)}")
if missing_compared:
    print(f"ERROR: Missing compared models: {missing_compared}")
    exit(1)

with open(catalog_path, "w", encoding="utf-8") as f:
    json.dump(catalog, f, ensure_ascii=False, indent=2)

print("Catalog updated successfully with all 48 models across distinct thinking depths!")
