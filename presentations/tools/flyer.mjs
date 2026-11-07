import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const out = join(root, "export", "flyer");

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

const versions = [
  { file: "flyer-viva-mais-a5.pdf", bleed: 0, png: "flyer-viva-mais-a5.png" },
  { file: "flyer-viva-mais-a5-sangria-3mm.pdf", bleed: 3 },
];

mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: findChrome(), headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 560, height: 794, deviceScaleFactor: 4 });

for (const v of versions) {
  const url = pathToFileURL(join(root, "flyer.html")).href + (v.bleed ? "?bleed" : "");
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.evaluateHandle("document.fonts.ready");
  const pdf = join(out, v.file);
  await page.pdf({ path: pdf, width: `${148 + 2 * v.bleed}mm`, height: `${210 + 2 * v.bleed}mm`, printBackground: true, pageRanges: "1" });
  execFileSync("python3", [join(here, "pdf-boxes.py"), pdf, "148", "210", String(v.bleed)], { stdio: "inherit" });
  console.log(pdf);
  if (v.png) {
    await (await page.$(".page")).screenshot({ path: join(out, v.png) });
    console.log(join(out, v.png));
  }
}
await browser.close();
