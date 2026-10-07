import puppeteer from "puppeteer-core";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const root = new URL("../", import.meta.url);
const CHROME = `${process.env.HOME}/.cache/puppeteer/chrome/mac_arm-145.0.7632.77/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
mkdirSync(new URL("build/.tmp/", root), { recursive: true });
const gsapSrc = readFileSync(new URL("node_modules/gsap/dist/gsap.min.js", root), "utf8");
const [, , id, timesArg, colsArg] = process.argv;
const times = timesArg.split(",").map(Number);
const cols = Number(colsArg || 3);
mkdirSync(new URL("snapshots/", root), { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files"], defaultViewport: { width: 1080, height: 1920 } });
const html = readFileSync(new URL(`compositions/${id}.html`, root), "utf8");
const inner = html.slice(html.indexOf("<template>") + 10, html.lastIndexOf("</template>"));
const page = await browser.newPage();
page.on("pageerror", (e) => process.stderr.write(`pageerror ${e.message}\n`));
const doc = `<!doctype html><html><head><meta charset="utf-8"><base href="${root.href}"><style>html,body{margin:0;background:#FAFAFE}#host{position:relative;width:1080px;height:1920px;overflow:hidden;background:#FAFAFE radial-gradient(circle at 1510px 530px, rgba(126,59,237,0.24) 0, rgba(126,59,237,0.1) 285px, rgba(250,250,254,0) 510px)}</style><script>${gsapSrc}</script><script>window.__timelines={};window.__vmNotes={};</script></head><body><div id="host">${inner}</div></body></html>`;
const file = new URL(`build/.tmp/${id}.html`, root);
writeFileSync(file, doc);
await page.goto(file.href, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
const shots = [];
for (const t of times) {
  await page.evaluate((cid, time) => { window.__timelines[cid].time(time); }, id, t);
  await new Promise((r) => setTimeout(r, 120));
  const buf = await page.screenshot({ type: "jpeg", quality: 82 });
  shots.push({ t, b64: Buffer.from(buf).toString("base64") });
}
const sheet = await browser.newPage();
await sheet.setViewport({ width: cols * 360, height: 600 });
await sheet.setContent(
  `<style>body{margin:0;background:#111;display:grid;grid-template-columns:repeat(${cols},1fr);gap:6px;padding:6px;font:20px monospace;color:#fff}figure{margin:0;position:relative}img{width:100%;display:block}figcaption{position:absolute;left:0;top:0;background:#000c;padding:2px 8px}</style>${shots
    .map((s) => `<figure><img src="data:image/jpeg;base64,${s.b64}"><figcaption>${s.t}s</figcaption></figure>`)
    .join("")}`
);
await sheet.screenshot({ path: new URL(`snapshots/${id}.jpg`, root).pathname, fullPage: true, type: "jpeg", quality: 80 });
await browser.close();
process.stdout.write(`snapshots/${id}.jpg\n`);
