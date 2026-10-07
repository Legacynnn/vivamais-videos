import puppeteer from "puppeteer-core";
import { readFileSync } from "node:fs";
import { basename } from "node:path";

const [, , out, colsArg, ...files] = process.argv;
const cols = Number(colsArg);
const CHROME = `${process.env.HOME}/.cache/puppeteer/chrome/mac_arm-145.0.7632.77/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const cells = files
  .map((f) => {
    const b64 = readFileSync(f).toString("base64");
    const type = f.endsWith(".jpg") ? "jpeg" : "png";
    return `<figure><img src="data:image/${type};base64,${b64}"><figcaption>${basename(f)}</figcaption></figure>`;
  })
  .join("");
const html = `<style>body{margin:0;background:#111;display:grid;grid-template-columns:repeat(${cols},1fr);gap:8px;padding:8px;font:14px monospace;color:#fff}figure{margin:0}img{width:100%;display:block}figcaption{padding:4px 0}</style>${cells}`;
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, defaultViewport: { width: 1000 * cols > 2000 ? 2000 : 1000 * cols, height: 800 } });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.screenshot({ path: out, fullPage: true, type: "jpeg", quality: 80 });
await browser.close();
