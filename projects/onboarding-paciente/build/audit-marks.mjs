import puppeteer from "puppeteer-core";
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";

const root = new URL("../", import.meta.url);
const CHROME = `${process.env.HOME}/.cache/puppeteer/chrome/mac_arm-145.0.7632.77/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const gsapSrc = readFileSync(new URL("node_modules/gsap/dist/gsap.min.js", root), "utf8");
mkdirSync(new URL("snapshots/marks/", root), { recursive: true });
const ids = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(new URL("compositions/", root)).filter((f) => f.endsWith(".html")).map((f) => f.slice(0, -5));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files"], defaultViewport: { width: 1080, height: 1920 } });
const report = [];
for (const id of ids) {
  const html = readFileSync(new URL(`compositions/${id}.html`, root), "utf8");
  if (!html.includes("VMKit(")) continue;
  const inner = html.slice(html.indexOf("<template>") + 10, html.lastIndexOf("</template>"));
  const doc = `<!doctype html><html><head><meta charset="utf-8"><base href="${root.href}"><style>html,body{margin:0;background:#FAFAFE}#host{position:relative;width:1080px;height:1920px;overflow:hidden}</style><script>${gsapSrc}</script><script>window.__timelines={};window.__vmNotes={};window.__vmProbe={};</script></head><body><div id="host">${inner}</div></body></html>`;
  const file = new URL(`build/.tmp/audit-${id}.html`, root);
  writeFileSync(file, doc);
  const page = await browser.newPage();
  await page.goto(file.href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const marks = await page.evaluate((cid) => {
    const p = window.__vmProbe[cid];
    window.__marks = p ? p.audits.filter((a) => a.kind === "mark").map((a) => Object.assign({}, a, { t: p.at(a.t) })) : [];
    return window.__marks.map((a, i) => ({ i, t: a.t, text: (a.el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 50) }));
  }, id);
  for (const m of marks) {
    const r = await page.evaluate(
      (cid, i) => {
        const a = window.__marks[i];
        window.__timelines[cid].time(a.t + 0.2);
        const box = (el) => {
          const b = el.getBoundingClientRect();
          return { x: b.left, y: b.top, w: b.width, h: b.height };
        };
        const mk = box(a.data.mark);
        const el = box(a.el);
        const pad = a.data.pad || 0;
        const dx = mk.x + pad - el.x;
        const dy = mk.y + pad - el.y;
        const dw = mk.w - 2 * pad - el.w;
        const dh = mk.h - 2 * pad - el.h;
        const seen = (el) => {
          const b = el.getBoundingClientRect();
          const cx = b.left + b.width / 2;
          const cy = b.top + Math.min(b.height, 200) / 2;
          if (cx < 0 || cx > 1080 || cy < 0 || cy > 1920) return false;
          for (let n = el; n; n = n.parentElement) {
            const cs = getComputedStyle(n);
            if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity < 0.5) return false;
          }
          return true;
        };
        let bad = null;
        const start = a.t - 0.45 / 1.1;
        for (let k = 0; k < 60; k++) {
          const tt = start + k * 0.09;
          window.__timelines[cid].time(tt);
          const op = +getComputedStyle(a.data.mark).opacity;
          if (k > 2 && op === 0) break;
          if (op > 0 && !seen(a.el)) {
            bad = +tt.toFixed(2);
            break;
          }
        }
        window.__timelines[cid].time(a.t + 0.2);
        return { mkb: mk, elb: el, mk, el, err: Math.round(Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dw), Math.abs(dh))), onScreen: bad == null, lostAt: bad, markOpacity: +getComputedStyle(a.data.mark).opacity };
      },
      id,
      m.i
    );
    await new Promise((res) => setTimeout(res, 60));
    const path = new URL(`snapshots/marks/${id}-${m.i}.jpg`, root).pathname;
    await page.screenshot({ path, type: "jpeg", quality: 70 });
    report.push({ mk: r.mk, el: r.el, id, i: m.i, t: +m.t.toFixed(2), text: m.text, err: r.err, onScreen: r.onScreen, lostAt: r.lostAt, op: r.markOpacity, file: `snapshots/marks/${id}-${m.i}.jpg` });
  }
  await page.close();
}
await browser.close();
for (const r of report) process.stdout.write(`${r.err > 10 || !r.onScreen ? "BAD " : "ok  "}${r.id}#${r.i} t=${r.t} err=${r.err}px visible=${r.onScreen}${r.lostAt != null ? " lost@" + r.lostAt : ""} "${r.text}"\n`);
writeFileSync(new URL("snapshots/marks/report.json", root), JSON.stringify(report, null, 2));
