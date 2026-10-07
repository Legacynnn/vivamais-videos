import { readFileSync } from "node:fs";
const n0 = Number(process.env.N || 45);
for (const n of process.argv.slice(2)) {
  const h = JSON.parse(readFileSync(new URL(`../capture/states/${n}.json`, import.meta.url))).html;
  const t = [...h.matchAll(/>([^<>]{2,90})</g)].map((m) => m[1].trim()).filter(Boolean);
  console.log(`== ${n}: ${t.slice(-n0).join(" | ")}`);
}
