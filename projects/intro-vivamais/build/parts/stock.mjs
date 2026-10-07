import { readFileSync, existsSync } from "node:fs";

const SHOTS = new URL("../../assets/stock/shots.json", import.meta.url);
const list = existsSync(SHOTS) ? JSON.parse(readFileSync(SHOTS, "utf8")) : [];
const byKey = Object.fromEntries(list.map((s) => [s.key, s]));

export function shot(key) {
  const s = byKey[key];
  if (!s) throw new Error(`stock shot ${key} missing from assets/stock/shots.json`);
  return s;
}

export const PACE = 0.78;

export function vid(key, o) {
  const s = shot(key);
  const pace = o.pace || PACE;
  const need = o.dur / pace;
  const from = o.from == null ? (s.best ? s.best[0] : 0) : o.from;
  const ms = Math.max(0, Math.min(from, s.dur - need - 0.1));
  const rate = Math.min(1, (s.dur - ms - 0.1) / need);
  const cx = o.cx == null ? s.cx : o.cx;
  const cy = o.cy == null ? s.cy : o.cy;
  const pos = `object-position:${(cx * 100).toFixed(1)}% ${(cy * 100).toFixed(1)}%`;
  return `<video id="${o.id}" class="${o.cls || "stk"}" src="assets/stock/${s.file.split("/").pop()}" muted playsinline data-start="${+(o.at / pace).toFixed(3)}" data-duration="${+need.toFixed(3)}" data-media-start="${+ms.toFixed(3)}"${rate < 0.999 ? ` data-playback-rate="${+rate.toFixed(3)}"` : ""} data-track-index="${o.track || 0}" style="${pos}" data-layout-allow-overlap></video>`;
}
