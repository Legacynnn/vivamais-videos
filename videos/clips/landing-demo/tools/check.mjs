import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const out = fileURLToPath(new URL("../out/", import.meta.url));
const m = JSON.parse(readFileSync(join(out, "manifest.json"), "utf8"));
const errors = [];
const probe = (f) => execFileSync("ffprobe", ["-v", "error", "-show_entries", "stream=codec_name,width,height:format=duration", "-of", "json", f], { encoding: "utf8" });
const psnr = (video, still, last) => {
  const pick = last ? ["-sseof", "-0.2", "-i", video] : ["-i", video];
  const sel = last ? "reverse,select=eq(n\\,0)" : "select=eq(n\\,0)";
  const r = spawnSync("ffmpeg", [...pick, "-i", still, "-filter_complex", `[0]${sel},scale=${m.screen.width}:${m.screen.height}:in_color_matrix=bt709:in_range=tv,format=rgb24[a];[1]format=rgb24[b];[a][b]psnr`, "-f", "null", "-"], { encoding: "utf8" });
  return +(r.stderr.match(/average:([\d.]+)/) || [0, 0])[1];
};

for (const s of m.stops) {
  const f = join(out, s.still);
  if (!existsSync(f)) { errors.push(`missing ${s.still}`); continue; }
  const st = JSON.parse(probe(f)).streams[0];
  if (st.width !== m.screen.width || st.height !== m.screen.height) errors.push(`${s.still} is ${st.width}x${st.height}`);
}
m.clips.forEach((c, i) => {
  const from = m.stops.find((s) => s.id === c.from).still;
  const to = m.stops.find((s) => s.id === c.to).still;
  for (const f of [c.mp4, c.webm]) {
    const p = join(out, f);
    if (!existsSync(p)) { errors.push(`missing ${f}`); continue; }
    const info = JSON.parse(probe(p));
    const kb = statSync(p).size / 1024;
    if (info.streams.length !== 1) errors.push(`${f} has ${info.streams.length} streams`);
    if (Math.abs(+info.format.duration - c.duration) > 0.05) errors.push(`${f} lasts ${info.format.duration}, manifest says ${c.duration}`);
    if (kb > 400) errors.push(`${f} is ${kb.toFixed(0)} KB`);
    const a = psnr(p, join(out, from), false);
    const b = psnr(p, join(out, to), true);
    console.log(`${f.padEnd(15)} ${(+info.format.duration).toFixed(3)}s ${kb.toFixed(0).padStart(4)} KB  first≈${from} ${a.toFixed(1)} dB  last≈${to} ${b.toFixed(1)} dB`);
    if (a < 36 || b < 36) errors.push(`${f} edge frame does not match its still`);
  }
});
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("ok");
