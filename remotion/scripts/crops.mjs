import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";
import { findChrome } from "../../tools/chrome.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const pkg = join(here, "..");
const dist = join(pkg, "../screens/dist");
const out = join(pkg, "public/shots");
const spec = JSON.parse(readFileSync(join(pkg, "shots.json"), "utf8"));

mkdirSync(join(out, "crops"), { recursive: true });
const host = join(dist, "_crops.html");
writeFileSync(host, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="assets/screens/screens.css"><style>html,body{margin:0;width:402px;overflow:hidden}[aria-label="Super IA disponível"] .rn-view{box-shadow:none!important}[aria-label="Super IA disponível"]{filter:drop-shadow(0 3px 5px rgba(106,36,219,.3))}</style></head><body><div id="root" class="vms" style="position:relative;width:402px;overflow:hidden"></div></body></html>`);

const browser = await puppeteer.launch({ executablePath: findChrome(), headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 402, height: 874, deviceScaleFactor: 3 });
const result = {};
const stripInfo = {};

for (const [shot, entry] of Object.entries(spec)) {
  const { _height: height = 874, _overlay: _o, ...targets } = entry;
  await page.setViewport({ width: 402, height, deviceScaleFactor: 3 });
  await page.goto(pathToFileURL(host).href, { waitUntil: "load" });
  await page.evaluate((h) => {
    document.documentElement.style.height = document.body.style.height = `${h}px`;
    document.getElementById("root").style.height = `${h}px`;
  }, height);
  const html = readFileSync(join(dist, "assets/screens/html", `${shot}.html`), "utf8");
  await page.evaluate((markup) => (document.getElementById("root").innerHTML = markup), html);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
  });
  const strips = Object.entries(targets).filter(([, t]) => t.strip);
  for (const [name, t] of strips) {
    const box = await page.evaluate((label) => {
      const chip = [...document.querySelectorAll("[aria-label]")].find((el) => el.getAttribute("aria-label") === label);
      if (!chip) return null;
      let row = chip.parentElement;
      while (row && row.children.length < 3) row = row.parentElement;
      row.setAttribute("data-strip", "1");
      let clip = row;
      while (clip.parentElement && clip.getBoundingClientRect().width > 410) clip = clip.parentElement;
      for (let n = row.parentElement; n; n = n.parentElement) n.style.overflow = "visible";
      document.documentElement.style.overflow = document.body.style.overflow = "visible";
      const r = row.getBoundingClientRect();
      const c = clip.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height, clipX: c.left, clipW: c.width, gap: parseFloat(getComputedStyle(row).columnGap) || 0 };
    }, t.label);
    if (!box) continue;
    await page.setViewport({ width: Math.ceil(box.x + box.w + 10), height, deviceScaleFactor: 3 });
    await page.addStyleTag({ content: "#root{visibility:hidden}[data-strip]{visibility:visible}" });
    await page.screenshot({ path: join(out, "crops", `${shot}--${name}.png`), clip: { x: box.x, y: box.y, width: box.w, height: box.h }, omitBackground: true });
    await page.addStyleTag({ content: "#root{visibility:visible}[data-strip]{visibility:hidden}" });
    await page.setViewport({ width: 402, height, deviceScaleFactor: 3 });
    await page.screenshot({ path: join(out, `${shot}--base.png`) });
    await page.addStyleTag({ content: "[data-strip]{visibility:visible}" });
    stripInfo[`${shot}:${name}`] = box;
  }
  await page.screenshot({ path: join(out, `${shot}.png`) });
  if (entry._overlay) {
    const tag = await page.addStyleTag({ content: entry._overlay });
    await page.evaluate(() => {
      for (const el of document.querySelectorAll("#root *")) {
        const r = el.getBoundingClientRect();
        if (r.width * r.height > 402 * 874 * 0.4) el.style.setProperty("background-color", "transparent", "important");
      }
    });
    await page.screenshot({ path: join(out, `${shot}--overlay.png`), omitBackground: true });
    await tag.evaluate((node) => node.remove());
  }
  result[shot] = { _height: { x: 0, y: 0, w: 402, h: height, radius: 0 } };
  for (const [name, t] of Object.entries(targets)) {
    // "@tomorrow" is the day after the screen was built, which is the day fixtures press.
    const built = statSync(join(dist, "assets/screens/html", `${shot}.html`)).mtime;
    const label = t.label === "@tomorrow" ? String(new Date(built.getTime() + 864e5).getDate()) : t.label;
    const rect = await page.evaluate(({ label, scope, climb, nth }) => {
      const base = document.getElementById("root");
      const sheets = [...base.querySelectorAll("div")].filter((n) => n.style.zIndex === "40");
      const root = scope === "sheet" && sheets.length ? sheets[sheets.length - 1] : base;
      if (label === "@sheet") {
        const panel = sheets.length ? sheets[sheets.length - 1].lastElementChild : null;
        if (!panel) return null;
        const r = panel.getBoundingClientRect();
        return { x: r.left, y: r.top, w: r.width, h: r.height, radius: 28 };
      }
      const prefix = label.endsWith("*");
      const text = prefix ? label.slice(0, -1) : label;
      const match = (v) => v != null && (prefix ? v.startsWith(text) : v === text);
      const all = [...root.querySelectorAll("*")];
      const byLabel = all.filter((el) => match(el.getAttribute("aria-label")));
      const pool = byLabel.length ? byLabel : all.filter((el) => el.childElementCount === 0 && match(el.textContent?.trim()));
      const list = pool.filter((el) => el.getClientRects().length > 0).reverse();
      let el = list[Math.min(nth ?? 0, list.length - 1)];
      if (!el) return null;
      while (climb && el.getBoundingClientRect().width < climb && el.parentElement) el = el.parentElement;
      const r = el.getBoundingClientRect();
      const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      return { x: r.left, y: r.top, w: r.width, h: r.height, radius };
    }, { ...t, label });
    if (!rect) {
      console.error(`${shot}: nothing for ${name} (${t.label})`);
      continue;
    }
    result[shot][name] = stripInfo[`${shot}:${name}`] ? { ...rect, ...stripInfo[`${shot}:${name}`], radius: 0 } : rect;
    if (t.crop) {
      await page.screenshot({ path: join(out, "crops", `${shot}--${name}.png`), clip: { x: rect.x, y: rect.y, width: rect.w, height: rect.h }, omitBackground: true });
    }
  }
}

await browser.close();
writeFileSync(join(pkg, "src/shots.gen.json"), `${JSON.stringify(result, null, 2)}\n`);
console.log(`shots: ${Object.keys(result).length} screens, ${Object.values(result).reduce((n, r) => n + Object.keys(r).length, 0)} targets`);
