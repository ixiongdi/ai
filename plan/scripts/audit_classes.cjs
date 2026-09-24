const fs = require("fs");
const app = fs.readFileSync("web/src/App.vue", "utf8");
const css = fs.readFileSync("web/styles.css", "utf8");

const appClasses = new Set();
const classRegex = /class="([^"]+)"/g;
let m;
while ((m = classRegex.exec(app)) !== null) {
  m[1].split(/\s+/).forEach((c) => {
    if (c && !c.includes("{") && !c.includes("$") && !c.includes(":")) {
      appClasses.add(c);
    }
  });
}

const dynRegex = /'([a-zA-Z0-9_-]+)':/g;
while ((m = dynRegex.exec(app)) !== null) {
  if (m[1].startsWith("is-")) {
    appClasses.add(m[1]);
  }
}

const missing = [];
for (const cls of appClasses) {
  const re = new RegExp("\\." + cls.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([\\s,{.:\\[#>]|$)");
  if (!re.test(css)) {
    missing.push(cls);
  }
}
const bak = fs.readFileSync("web/styles.css.bak", "utf8");

const missingInBak = [];
for (const cls of appClasses) {
  const re = new RegExp("\\." + cls.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([\\s,{.:\\[#>]|$)");
  if (!re.test(bak)) {
    missingInBak.push(cls);
  }
}
console.log("Total classes in App.vue:", appClasses.size);
console.log(
  "Missing in current styles.css (" + missing.length + "):",
  missing.filter((c) => !c.includes("{") && !c.includes(">") && !c.includes("=")),
);
console.log(
  "Missing in backup styles.css (" + missingInBak.length + "):",
  missingInBak.filter((c) => !c.includes("{") && !c.includes(">") && !c.includes("=")),
);
