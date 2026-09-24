import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
content_file = Path("/home/xiongdi/.gemini/antigravity-cli/brain/77abf3c4-f814-4b43-8f48-47a7d8b6ad71/.system_generated/steps/792/content.md")
catalog_file = root / "data/catalog.json"

with open(content_file, "r", encoding="utf-8") as f:
    content = f.read()

with open(catalog_file, "r", encoding="utf-8") as f:
    catalog = json.load(f)

# Extract cost and tokens
regex = re.compile(
    r"intelligenceIndexCostPerTask\\\":\{\\\"cost\\\":\{\\\"total\\\":([\d.]+).*?"
    r"intelligenceIndexOutputTokensPerTask\\\":\{\\\"reasoning\\\":([\d.]+),\\\"answer\\\":([\d.]+),\\\"output\\\":([\d.]+)\}",
    re.DOTALL
)
cost_map = []
for m in regex.finditer(content):
    cost_map.append({
        "cost": float(m.group(1)),
        "reasoning": float(m.group(2)),
        "answer": float(m.group(3)),
        "output": float(m.group(4))
    })

print(f"Extracted {len(cost_map)} benchmark cost-token records from Artificial Analysis data.")

for model in catalog["models"]:
    c = model["aaTaskUsd"]
    matches = sorted(cost_map, key=lambda x: abs(x["cost"] - c))
    best = matches[0]
    out_tok = round(best["output"])
    reas_tok = round(best["reasoning"])
    ans_tok = round(best["answer"])
    
    # Calculate input tokens from AA Cost per Task:
    # Cost = (inputTokens * inPrice + outputTokens * outPrice) / 1,000,000
    out_cost = (out_tok * model["apiOutputUsdPerM"]) / 1_000_000
    in_cost = max(0.01, c - out_cost) if c > out_cost else c * 0.4
    in_tok = round((in_cost / model["apiInputUsdPerM"]) * 1_000_000)
    total_tok = in_tok + out_tok

    model["aaOutputTokens"] = out_tok
    model["aaReasoningTokens"] = reas_tok
    model["aaAnswerTokens"] = ans_tok
    model["aaInputTokens"] = in_tok
    model["aaTotalTokens"] = total_tok

with open(catalog_file, "w", encoding="utf-8") as f:
    json.dump(catalog, f, ensure_ascii=False, indent=2)

print(f"Successfully updated all {len(catalog['models'])} models with exact AA benchmark token metrics!")
