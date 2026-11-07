import { relative } from "node:path";
import { info, root, videos } from "./videos.mjs";

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
const rows = videos(process.argv.slice(2)).map((dir) => {
  const v = info(dir);
  return [relative(`${root}/videos`, dir), v.front.model ?? "-", v.size, fmt(v.duration), v.front.status ?? "-", String(v.renders.length)];
});
const head = ["video", "model", "size", "length", "status", "renders"];
const widths = head.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
for (const r of [head, ...rows]) console.log(r.map((c, i) => c.padEnd(widths[i])).join("  "));
