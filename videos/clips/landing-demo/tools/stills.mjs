import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const root = fileURLToPath(new URL("..", import.meta.url));
const CHROME = `${process.env.HOME}/.cache/puppeteer/chrome/mac_arm-145.0.7632.77/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const [query, out] = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files"], defaultViewport: { width: 390, height: 840, deviceScaleFactor: +(process.env.DPR || 1) } });
const page = await browser.newPage();
page.on("pageerror", (e) => console.error("pageerror", e.message));
page.on("console", (m) => m.type() === "error" && console.error("console", m.text()));
await page.goto(`${pathToFileURL(join(root, "index.html")).href}?${query}`, { waitUntil: "load" });
await page.evaluate(() => window.LD.ready);
if (query.startsWith("clip=")) for (const t of (process.env.T || "0").split(",")) {
  await page.evaluate((x) => window.LD.seek(x), +t);
  await page.screenshot({ path: out.replace(".png", `-${t}.png`) });
} else await page.screenshot({ path: out });
await browser.close();
