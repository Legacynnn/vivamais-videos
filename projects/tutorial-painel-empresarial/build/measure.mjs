import puppeteer from "puppeteer-core";
import { mkdirSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const CHROME = `${process.env.HOME}/.cache/puppeteer/chrome/mac_arm-145.0.7632.77/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
mkdirSync(new URL("build/.tmp/", root), { recursive: true });
const gsapSrc = readFileSync(new URL("node_modules/gsap/dist/gsap.min.js", root), "utf8");

export async function measure(ids) {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--allow-file-access-from-files"],
    defaultViewport: { width: 1920, height: 1080 },
  });
  const out = {};
  for (const id of ids) {
    const html = readFileSync(new URL(`compositions/${id}.html`, root), "utf8");
    const inner = html.slice(html.indexOf("<template>") + 10, html.lastIndexOf("</template>"));
    const page = await browser.newPage();
    page.on("pageerror", (e) => process.stderr.write(`[${id}] ${e.message}\n`));
    page.on("console", (m) => {
      if (m.type() === "error") process.stderr.write(`[${id}] console: ${m.text()}\n`);
    });
    const cut = inner.lastIndexOf("<script>");
    const markup = inner.slice(0, cut);
    const script = inner.slice(cut + 8, inner.lastIndexOf("</script>"));
    const doc = `<!doctype html><html><head><meta charset="utf-8"><base href="${root.href}"><style>html,body{margin:0}#host{position:relative;width:1920px;height:1080px;overflow:hidden}</style><script>${gsapSrc}</script><script>window.__timelines={};window.__vmNotes={};window.__vmProbe={};</script></head><body><div id="host">${markup}</div></body></html>`;
    const file = new URL(`build/.tmp/${id}.html`, root);
    writeFileSync(file, doc);
    await page.goto(file.href, { waitUntil: "load" });
    await page.evaluate(async () => {
      await Promise.all(Array.from(document.fonts).map((f) => f.load().catch(() => null)));
      await document.fonts.ready;
      await Promise.all(Array.from(document.images).map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
    });
    await page.addScriptTag({ content: script });
    out[id] = await page.evaluate((cid) => {
      const tl = window.__timelines[cid];
      const probe = window.__vmProbe[cid];
      return tl ? { duration: tl.duration(), notes: window.__vmNotes, rects: probe ? probe.rects : null } : null;
    }, id);
    await page.close();
  }
  await browser.close();
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ids = process.argv.slice(2);
  const list = ids.length ? ids : readdirSync(new URL("compositions/", root)).map((f) => f.replace(".html", ""));
  const res = await measure(list);
  for (const [id, r] of Object.entries(res)) {
    process.stdout.write(`${id}: ${r ? r.duration.toFixed(2) : "NO TIMELINE"}s ${r ? JSON.stringify(r.notes) : ""}\n`);
  }
}
