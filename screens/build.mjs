import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";
import puppeteer from "puppeteer-core";
import { findChrome } from "../tools/chrome.mjs";
import { git, readLock, requireCheckout, root } from "../tools/monorepo.mjs";
import { define, extensions, media, patchInterop, resolver } from "./resolver.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const mono = requireCheckout();
const cache = join(here, ".cache");
const dist = join(here, "dist");
const out = join(dist, "assets/screens");
const lockFile = join(here, "screens.lock.json");
const args = process.argv.slice(2);
const stamp = args.includes("--stamp");
const showKeys = args.includes("--keys");
const only = args.filter((arg) => !arg.startsWith("--"));

const blobs = new Map(
  git("ls-tree", "-r", "HEAD", "apps/mobile", "packages")
    .split("\n")
    .map((line) => line.split(/\s+/))
    .map(([, , hash, ...path]) => [path.join(" "), hash])
);

async function bundle(file) {
  const id = basename(file).replace(/\.screen\.tsx$/, "");
  const entry = `
import * as screen from ${JSON.stringify(file)};
import { createElement } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
const states = screen.states ?? { default: {} };
window.__vms = {
  meta: screen.meta ?? {},
  states: Object.keys(states),
  mount(state, el) {
    globalThis.__vmsFixture = states[state];
    globalThis.__vmsQueryLog = new Map();
    flushSync(() => createRoot(el).render(createElement(screen.default, states[state].props ?? {})));
  },
  queries: () => [...globalThis.__vmsQueryLog],
  press: (state) => states[state].press ?? [],
};`;
  const result = await build({
    stdin: { contents: entry, resolveDir: here, loader: "js" },
    outfile: join(cache, `${id}.js`),
    bundle: true,
    format: "iife",
    platform: "browser",
    jsx: "automatic",
    metafile: true,
    tsconfigRaw: {},
    logLevel: "error",
    resolveExtensions: extensions,
    loader: media,
    assetNames: "img/[name]-[hash]",
    publicPath: "assets/screens",
    define,
    plugins: [resolver],
  });
  const bundlePath = join(cache, `${id}.js`);
  const code = readFileSync(bundlePath, "utf8");
  writeFileSync(bundlePath, patchInterop(code));
  const sources = Object.keys(result.metafile.inputs)
    .map((input) => relative(mono, join(root, input)))
    .filter((path) => !path.startsWith(".."))
    .sort();
  const digest = createHash("sha1");
  for (const path of sources) digest.update(`${path}:${blobs.get(path)}\n`);
  return { id, bundlePath, sources, hash: digest.digest("hex") };
}

const files = readdirSync(join(here, "mobile"))
  .filter((name) => name.endsWith(".screen.tsx"))
  .filter((name) => !only.length || only.includes(name.replace(/\.screen\.tsx$/, "")))
  .map((name) => join(here, "mobile", name));

if (!only.length) rmSync(dist, { recursive: true, force: true });
mkdirSync(join(out, "html"), { recursive: true });
mkdirSync(join(dist, "shots"), { recursive: true });
execFileSync("npx", ["tailwindcss", "-c", join(here, "tailwind.config.cjs"), "-i", join(here, "base.css"), "-o", join(out, "screens.css"), "--minify"], { cwd: root, stdio: ["ignore", "ignore", "pipe"] });
cpSync(join(root, "brand/fonts"), join(out, "fonts"), { recursive: true });
const host = join(dist, "_host.html");
writeFileSync(host, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="assets/screens/screens.css"><style>html,body{margin:0;width:402px;height:874px;overflow:hidden}</style></head><body><div id="root" class="vms"></div></body></html>`);

const lock = existsSync(lockFile) ? JSON.parse(readFileSync(lockFile, "utf8")) : {};
const commit = readLock().sha;
const manifest = existsSync(join(dist, "manifest.json")) ? JSON.parse(readFileSync(join(dist, "manifest.json"), "utf8")) : {};
const failed = [];
const browser = await puppeteer.launch({ executablePath: findChrome(), headless: true, args: ["--disable-gpu-vsync", "--disable-frame-rate-limit"] });
const page = await browser.newPage();
await page.setViewport({ width: 402, height: 874, deviceScaleFactor: 3 });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

for (const file of files) {
  const name = basename(file);
  try {
    const screen = await bundle(file);
    if (existsSync(join(cache, "img"))) cpSync(join(cache, "img"), join(out, "img"), { recursive: true });
    await page.goto(pathToFileURL(host).href, { waitUntil: "load" });
    await page.addScriptTag({ path: screen.bundlePath });
    const { meta, states } = await page.evaluate(() => ({ meta: window.__vms.meta, states: window.__vms.states }));
    for (const state of states) {
      errors.length = 0;
      await page.goto(pathToFileURL(host).href, { waitUntil: "load" });
      await page.addScriptTag({ path: screen.bundlePath });
      await page.evaluate((name) => window.__vms.mount(name, document.getElementById("root")), state);
      if (errors.length) throw new Error(`${state}: ${errors[0]}`);
      for (const label of await page.evaluate((name) => window.__vms.press(name), state)) {
        const found = await page.evaluate((label) => {
          const root = document.getElementById("root");
          const target =
            root.querySelector(`[aria-label="${CSS.escape(label)}"]`) ??
            [...root.querySelectorAll("*")].reverse().find((el) => el.textContent.trim() === label);
          target?.click();
          return Boolean(target);
        }, label);
        if (!found) throw new Error(`${state}: nothing to press for "${label}"`);
        await new Promise((done) => setTimeout(done, 60));
      }
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
        await new Promise((done) => setTimeout(done, 150));
      });
      if (errors.length) throw new Error(`${state}: ${errors[0]}`);
      const html = await page.evaluate(() => document.getElementById("root").innerHTML);
      writeFileSync(join(out, "html", `${screen.id}--${state}.html`), `<div class="vms" data-screen="${screen.id}" data-state="${state}" data-layout-ignore>${html}</div>\n`);
      await page.screenshot({ path: join(dist, "shots", `${screen.id}--${state}.png`) });
      if (showKeys) for (const [key, hit] of await page.evaluate(() => window.__vms.queries())) console.log(`  ${screen.id}/${state} ${hit ? "fed " : "idle"} ${key}`);
    }
    const known = lock[screen.id];
    const changed = Boolean(known) && known.hash !== screen.hash && known.commit !== commit;
    if (stamp || !changed) lock[screen.id] = { hash: screen.hash, commit };
    manifest[screen.id] = { ...meta, states, sources: screen.sources.length, changed: changed && !stamp };
    console.log(`${screen.id}: ${states.join(", ")} (${screen.sources.length} app files)${changed && !stamp ? ` — app source changed since ${known.commit.slice(0, 9)}; review the shots, then \`npm run screens -- --stamp ${screen.id}\`` : ""}`);
  } catch (error) {
    failed.push(name);
    console.error(`${name}: ${String(error.message ?? error).split("\n").slice(0, 8).join("\n")}`);
  }
}

await browser.close();
rmSync(host, { force: true });
writeFileSync(lockFile, `${JSON.stringify(lock, null, 2)}\n`);
writeFileSync(join(dist, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

const cards = Object.entries(manifest)
  .flatMap(([id, entry]) =>
    entry.states.map((state) => `<figure><div class="phone">${readFileSync(join(out, "html", `${id}--${state}.html`), "utf8")}</div><figcaption><b>${id}</b> ${state}${entry.changed ? " · changed upstream" : ""}<br>${entry.title ?? ""}</figcaption></figure>`)
  )
  .join("\n");
writeFileSync(
  join(dist, "index.html"),
  `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Viva Mais screens</title><link rel="stylesheet" href="assets/screens/screens.css"><style>body{margin:0;padding:40px;background:#F3F4FA;font:14px/20px system-ui;color:#17151E;display:flex;flex-wrap:wrap;gap:40px}figure{margin:0}.phone{position:relative;width:402px;height:874px;border-radius:54px;overflow:hidden;background:#fff;box-shadow:0 20px 50px rgba(53,14,111,.18)}figcaption{margin-top:14px;color:#726F80}figcaption b{color:#17151E}</style></head><body>${cards}</body></html>\n`
);
console.log(`screens/dist: ${Object.keys(manifest).length} screens${failed.length ? `, ${failed.length} failed` : ""}`);
if (failed.length) process.exit(1);
