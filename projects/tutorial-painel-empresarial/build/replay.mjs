import puppeteer from "puppeteer-core";
import { readdirSync, mkdirSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const CHROME = `${process.env.HOME}/.cache/puppeteer/chrome/mac_arm-145.0.7632.77/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
mkdirSync(new URL("build/.tmp/replay/", root), { recursive: true });
const ids = readdirSync(new URL("build/.tmp/", root)).filter((f) => f.startsWith("audit-ch")).map((f) => f.slice(6, -5)).sort();
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files"], defaultViewport: { width: 960, height: 540, deviceScaleFactor: 1 } });
const list = [];
for (const id of ids) {
  const open = async () => {
    const page = await browser.newPage();
    await page.goto(new URL(`build/.tmp/audit-${id}.html`, root).href, { waitUntil: "load" });
    await page.evaluate(() => {
      document.body.style.zoom = "0.5";
      return document.fonts.ready;
    });
    return page;
  };
  const fresh = await open();
  const dur = await fresh.evaluate((cid) => window.__timelines[cid].duration(), id);
  const times = Array.from({ length: 14 }, (_, i) => +(((i + 0.5) * dur) / 14).toFixed(2));
  for (const t of times) {
    await fresh.evaluate((cid, time) => { window.__timelines[cid].time(time); }, id, t);
    await fresh.screenshot({ path: new URL(`build/.tmp/replay/${id}-${t}-a.png`, root).pathname });
  }
  await fresh.close();
  const again = await open();
  await again.evaluate((cid) => { const tl = window.__timelines[cid]; tl.time(tl.duration()); tl.time(0); }, id);
  for (const t of times.slice().reverse()) {
    await again.evaluate((cid, time) => { window.__timelines[cid].time(time); }, id, t);
    await again.screenshot({ path: new URL(`build/.tmp/replay/${id}-${t}-b.png`, root).pathname });
  }
  await again.close();
  times.forEach((t) => list.push(`${id}-${t}`));
}
await browser.close();
writeFileSync(new URL("build/.tmp/replay/list.txt", root), list.join("\n"));
process.stdout.write(`replay: ${list.length} frame pairs\n`);
