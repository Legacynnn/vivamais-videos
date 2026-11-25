import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, resolve, basename, relative } from "node:path";
import { parseArgs } from "node:util";
import { spawnSync } from "node:child_process";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, "assets/posts/generated");
const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
const ALIAS = {
  nb: "google/gemini-nano-banana-2.1",
  gpt: "openai/gpt-image-2",
  flux: "blackforestlabs/flux-2-pro",
  fluxedit: "blackforestlabs/flux-2-pro-edit",
  seedream: "bytedance/seedream-5-0-pro",
};

for (const f of [join(ROOT, ".env"), join(ROOT, ".monorepo/apps/core/.env")]) {
  if (existsSync(f)) try { process.loadEnvFile(f); } catch {}
}

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    model: { type: "string", short: "m", default: "nb" },
    ref: { type: "string", short: "r", multiple: true, default: [] },
    aspect: { type: "string", short: "a", default: "3:4" },
    res: { type: "string", default: "2K" },
    n: { type: "string", default: "1" },
    name: { type: "string" },
    raw: { type: "boolean", default: false },
    screen: { type: "boolean", default: false },
  },
});

const key = process.env.AIMLAPI_API_KEY;
const base = process.env.AIMLAPI_BASE_URL || "https://api.aimlapi.com/v1";
if (!key) {
  console.error("AIMLAPI_API_KEY missing: add it to .env at the repo root");
  process.exit(1);
}
const brief = positionals.join(" ").trim();
if (!brief) {
  console.error('usage: npm run imagine -- "brief" [-m nb,gpt,flux] [-r ref.jpg] [-a 3:4|9:16|1:1|4:5] [--n 2] [--screen] [--raw]');
  process.exit(1);
}

const style = values.raw ? "" : (await readFile(join(ROOT, "brand/imagery.md"), "utf8")).split("## Prompt")[1].split("##")[0].trim();
const prompt = style ? `${brief}\n\n${style}` : brief;
const refs = await Promise.all(values.ref.map(async (p) => {
  const buf = await readFile(resolve(p));
  return `data:${MIME[extname(p).toLowerCase()] ?? "image/png"};base64,${buf.toString("base64")}`;
}));

const sizes = { "1:1": [1024, 1024], "3:4": [1024, 1536], "4:5": [1024, 1536], "9:16": [1024, 1536], "4:3": [1536, 1024], "16:9": [1536, 1024] };

function body(model) {
  const b = { model, prompt };
  if (model.startsWith("openai/")) {
    const [w, h] = sizes[values.aspect] ?? [1024, 1536];
    Object.assign(b, { size: `${w}x${h}`, quality: "high", response_format: "b64_json" });
  } else if (model.startsWith("google/")) {
    Object.assign(b, { aspect_ratio: values.aspect === "4:5" ? "3:4" : values.aspect, resolution: values.res });
    if (refs.length) b.image_urls = refs;
  } else {
    const [w, h] = sizes[values.aspect] ?? [1024, 1536];
    b.image_size = { width: w, height: h };
    if (refs.length) b.image_urls = refs;
  }
  return b;
}

async function fetchImage(item) {
  if (item.b64_json) return Buffer.from(item.b64_json, "base64");
  const url = item.url ?? item;
  if (typeof url === "string" && url.startsWith("data:")) return Buffer.from(url.split(",")[1], "base64");
  const r = await fetch(url);
  return Buffer.from(await r.arrayBuffer());
}

const slug = values.name ?? brief.toLowerCase().normalize("NFD").replace(/[^\w\s-]/g, "").trim().split(/\s+/).slice(0, 5).join("-");
const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
const dir = join(OUT, `${stamp}-${slug}`);
await mkdir(dir, { recursive: true });

const models = values.model.split(",").map((m) => ALIAS[m.trim()] ?? m.trim());
const n = Number(values.n);
const jobs = models.flatMap((model) => Array.from({ length: n }, (_, i) => ({ model, i })));

const results = await Promise.all(jobs.map(async ({ model, i }) => {
  const t = Date.now();
  const res = await fetch(`${base}/images/generations`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body(model)),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return { model, error: `${res.status} ${JSON.stringify(json).slice(0, 300)}` };
  const items = json.data ?? json.images ?? [];
  if (!items.length) return { model, error: `no image in response ${JSON.stringify(json).slice(0, 300)}` };
  const buf = await fetchImage(items[0]);
  const file = join(dir, `${stamp}-${slug}-${basename(model)}-${i + 1}.png`);
  await writeFile(file, buf);
  return { model, file: relative(ROOT, file), seconds: Math.round((Date.now() - t) / 1000) };
}));

await writeFile(join(dir, "meta.json"), JSON.stringify({ brief, prompt, refs: values.ref, aspect: values.aspect, results }, null, 2));

for (const r of results) {
  if (r.error) { console.log(`✗ ${r.model}: ${r.error}`); continue; }
  console.log(`✓ ${r.model} ${r.seconds}s → ${r.file}`);
  if (values.screen) {
    const p = spawnSync("python3", [join(ROOT, "tools/photo-screens.py"), r.file], { cwd: ROOT, encoding: "utf8" });
    const found = JSON.parse(await readFile(join(ROOT, "assets/posts/photo-screens.json"), "utf8"))[r.file];
    console.log(found ? "  screen detected" : `  no screen: ${(p.stderr || p.stdout).trim().split("\n").pop() || "not found"}`);
  }
}
