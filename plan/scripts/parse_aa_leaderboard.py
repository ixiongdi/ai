from bs4 import BeautifulSoup
import json

with open("/home/xiongdi/.gemini/antigravity-cli/brain/a1c46c7a-136a-4784-8a96-1390b146f53d/.system_generated/steps/1523/content.md", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")
table = soup.find("table")
if not table:
    print("Table not found!")
    exit(1)

rows = table.find_all("tr")
models = []
for tr in rows:
    tds = tr.find_all("td")
    if not tds:
        continue
    name_el = tds[0].find("div")
    name = name_el.get_text(strip=True) if name_el else tds[0].get_text(strip=True)
    context = tds[1].get_text(strip=True) if len(tds) > 1 else ""
    provider = tds[2].get_text(strip=True) if len(tds) > 2 else ""
    intel_index = tds[3].get_text(strip=True) if len(tds) > 3 else ""
    price = tds[4].get_text(strip=True) if len(tds) > 4 else ""
    speed = tds[5].get_text(strip=True) if len(tds) > 5 else ""
    latency = tds[6].get_text(strip=True) if len(tds) > 6 else ""
    link_el = tds[-1].find("a")
    href = link_el["href"] if link_el and "href" in link_el.attrs else ""
    
    models.append({
        "rank": len(models) + 1,
        "name": name,
        "context": context,
        "provider": provider,
        "intelligence_index": intel_index,
        "price_per_task": price,
        "speed": speed,
        "latency": latency,
        "href": href
    })

print(f"Parsed {len(models)} models from leaderboard table!")
for m in models[:50]:
    r = m["rank"]
    n = m["name"]
    p = m["provider"]
    idx = m["intelligence_index"]
    c = m["price_per_task"]
    print(f"#{r:2d} {n} ({p}) | Index: {idx} | Cost: {c}")

with open("/home/xiongdi/workspace/ai/plan/scripts/aa_top_models.json", "w", encoding="utf-8") as f:
    json.dump(models, f, ensure_ascii=False, indent=2)
