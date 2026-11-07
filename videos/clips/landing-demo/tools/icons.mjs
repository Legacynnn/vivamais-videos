import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dir = fileURLToPath(new URL("../../../../node_modules/lucide-static/icons/", import.meta.url));
const names = process.argv.slice(2);
const out = {};
for (const n of names) {
  const svg = readFileSync(dir + n + ".svg", "utf8");
  out[n] = svg.replace(/<!--[\s\S]*?-->/, "").replace(/<svg[\s\S]*?>/, "").replace(/<\/svg>/, "").replace(/\s+/g, " ").trim();
}
writeFileSync(fileURLToPath(new URL("icons.js", import.meta.url)), `window.ICONS = ${JSON.stringify(out, null, 1)};\n`);
