import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const args = process.argv.slice(2);
const name = args[0] && isNaN(args[0]) ? args.shift() : "index";
const out = name === "index" ? join(root, "export") : join(root, "export", name);
const page = pathToFileURL(join(root, `${name}.html`)).href;

function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const system = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  if (existsSync(system)) return system;
  const cache = join(homedir(), ".cache/puppeteer/chrome");
  if (existsSync(cache)) {
    for (const version of readdirSync(cache).sort().reverse()) {
      const bin = join(cache, version, "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing");
      if (existsSync(bin)) return bin;
    }
  }
  throw new Error("Chrome not found. Set CHROME=/path/to/chrome");
}

const chrome = findChrome();
const run = (args) => execFileSync(chrome, ["--headless=new", "--hide-scrollbars", "--disable-gpu", ...args], { stdio: "ignore" });
const total = (readFileSync(join(root, `${name}.html`), "utf8").match(/<section class="slide/g) || []).length;
const only = args.map(Number).filter(Boolean);
const targets = only.length ? only : Array.from({ length: total }, (_, i) => i + 1);

mkdirSync(out, { recursive: true });

for (const n of targets) {
  const file = join(out, `${String(n).padStart(2, "0")}.png`);
  run([`--screenshot=${file}`, "--window-size=1920,1300", "--virtual-time-budget=3000", `${page}?slide=${n}&offset=110`]);
  execFileSync("sips", ["-c", "1080", "1920", file], { stdio: "ignore" });
  console.log(file);
}

if (!only.length) {
  const pdf = join(out, name === "index" ? "apresentacao-viva-mais.pdf" : `${name}-viva-mais.pdf`);
  const sheet = join(out, "_pages.html");
  const imgs = targets.map((n) => `<img src="${String(n).padStart(2, "0")}.png">`).join("");
  writeFileSync(sheet, `<style>@page{size:1920px 1080px;margin:0}*{margin:0}img{display:block;width:1920px;height:1080px;break-after:page}</style>${imgs}`);
  run([`--print-to-pdf=${pdf}`, "--no-pdf-header-footer", "--virtual-time-budget=3000", pathToFileURL(sheet).href]);
  rmSync(sheet);
  const vector = join(out, "_vector.pdf");
  run([`--print-to-pdf=${vector}`, "--no-pdf-header-footer", "--virtual-time-budget=3000", `${page}?print`]);
  execFileSync("python3", [join(here, "pdf-links.py"), vector, pdf], { stdio: "inherit" });
  rmSync(vector);
  console.log(pdf);
}
