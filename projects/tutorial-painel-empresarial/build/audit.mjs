import puppeteer from "puppeteer-core";
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";

const root = new URL("../", import.meta.url);
const CHROME = `${process.env.HOME}/.cache/puppeteer/chrome/mac_arm-145.0.7632.77/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
mkdirSync(new URL("build/.tmp/", root), { recursive: true });
const gsapSrc = readFileSync(new URL("node_modules/gsap/dist/gsap.min.js", root), "utf8");
const TOL = Number(process.env.TOL || 2);
const ids = process.argv.slice(2);
const list = (ids.length ? ids : readdirSync(new URL("compositions/", root)).filter((f) => f.endsWith(".html")).map((f) => f.replace(".html", ""))).sort();

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files"], defaultViewport: { width: 1920, height: 1080 } });
let bad = 0;
let total = 0;
for (const id of list) {
  const html = readFileSync(new URL(`compositions/${id}.html`, root), "utf8");
  const inner = html.slice(html.indexOf("<template>") + 10, html.lastIndexOf("</template>"));
  const page = await browser.newPage();
  page.on("pageerror", (e) => process.stderr.write(`[${id}] ${e.message}\n`));
  const file = new URL(`build/.tmp/audit-${id}.html`, root);
  writeFileSync(
    file,
    `<!doctype html><html><head><meta charset="utf-8"><base href="${root.href}"><style>html,body{margin:0}#host{position:relative;width:1920px;height:1080px;overflow:hidden}</style><script>${gsapSrc}</script><script>window.__timelines={};window.__vmNotes={};window.__vmProbe={};</script></head><body><div id="host">${inner}</div></body></html>`
  );
  await page.goto(file.href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 300));
  const rows = await page.evaluate((cid) => {
    const probe = window.__vmProbe[cid];
    if (!probe) return null;
    const tl = window.__timelines[cid];
    const out = [];
    const name = (el) => (el.tagName.toLowerCase() + " " + (el.getAttribute("name") || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 34)).trim();
    tl.time(tl.duration());
    tl.time(0);
    const early = {};
    probe.audits.forEach((a, i) => {
      if (a.kind !== "click") return;
      tl.time(Math.max(0, probe.at(a.t) - 0.5));
      const st = a.el.closest(".vmk-state");
      if (st && getComputedStyle(st).visibility !== "visible") return;
      const q = a.el.getBoundingClientRect();
      if (q.width < 2 || q.height < 2) early[i] = "VANISHED-BEFORE-CLICK";
    });
    tl.time(tl.duration());
    tl.time(0);
    probe.audits.forEach((a, i) => {
      tl.time(probe.at(a.t) + 0.001);
      const st = a.el.closest(".vmk-state");
      const cs = st ? getComputedStyle(st) : null;
      const visible = !st || (cs.visibility === "visible" && Number(cs.opacity) > 0.5);
      const r = probe.live(a.el);
      const row = { kind: a.kind, t: +a.t.toFixed(2), state: st ? st.getAttribute("data-state") : "", target: name(a.el), visible };
      const issues = [];
      const b = a.el.getBoundingClientRect();
      const px = b.left + b.width / 2;
      const py = b.top + b.height / 2;
      let alpha = 1;
      for (let n = a.el; n && n !== document.body; n = n.parentElement) {
        const c = getComputedStyle(n);
        alpha *= Number(c.opacity);
        if (c.visibility === "hidden" || c.display === "none") alpha = 0;
        if (n !== a.el && /(hidden|auto|scroll|clip)/.test(c.overflow + c.overflowX + c.overflowY)) {
          const q = n.getBoundingClientRect();
          if (px < q.left - 1 || px > q.right + 1 || py < q.top - 1 || py > q.bottom + 1) issues.push("CLIPPED by " + n.tagName.toLowerCase() + "." + String(n.className).split(" ")[0]);
        }
      }
      if (alpha < (a.kind === "mark" ? 0.45 : 0.9)) issues.push("NOT-RENDERED opacity=" + alpha.toFixed(2));
      if (b.width < 2 || b.height < 2) issues.push("ZERO-SIZE");
      if (early[i]) issues.push(early[i]);
      if (a.kind === "mark") {
        const vis = Math.max(0, Math.min(b.right, 1920) - Math.max(b.left, 0)) * Math.max(0, Math.min(b.bottom, 1080) - Math.max(b.top, 0));
        if (vis / (b.width * b.height || 1) < 0.85) issues.push("OFF-FRAME " + Math.round((100 * vis) / (b.width * b.height || 1)) + "% visible");
      } else {
        if (px < 8 || px > 1912 || py < 8 || py > 1072) issues.push("OFF-FRAME");
        if (px < 300 && py < 124) issues.push("UNDER-LOGO");
        const hit = document.elementFromPoint(px, py);
        if (hit && hit !== a.el && !a.el.contains(hit) && !hit.contains(a.el)) issues.push("COVERED by " + hit.tagName.toLowerCase() + "." + String(hit.className).split(" ").slice(0, 2).join("."));
        document.querySelectorAll(".vmk-hud > *").forEach((h) => {
          if (h.classList.contains("vmk-confetti") || h.classList.contains("vmk-bub-line") || h.classList.contains("vmk-bub-dot")) return;
          const c = getComputedStyle(h);
          if (c.visibility === "hidden" || Number(c.opacity) < 0.2) return;
          const boxes = h.classList.contains("vmk-title") ? Array.from(h.querySelectorAll(".l, p")) : [h];
          boxes.forEach((x) => {
            if (Number(getComputedStyle(x).opacity) < 0.2) return;
            const q = x.getBoundingClientRect();
            if (px > q.left && px < q.right && py > q.top && py < q.bottom) issues.push("UNDER " + String(h.className));
          });
        });
      }
      row.issues = issues;
      if (a.kind === "mark") {
        const m = probe.live(a.data.mark);
        const pad = a.data.pad;
        row.dx = +(m.x + m.w / 2 - (r.x + r.w / 2)).toFixed(1);
        row.dy = +(m.y + m.h / 2 - (r.y + r.h / 2)).toFixed(1);
        row.dw = +(m.w - pad * 2 - r.w).toFixed(1);
        row.dh = +(m.h - pad * 2 - r.h).toFixed(1);
      } else {
        const c = probe.live(probe.cursor);
        const k = c.w / 76;
        row.dx = +(c.x + probe.hot.x * k - (r.x + r.w / 2)).toFixed(1);
        row.dy = +(c.y + probe.hot.y * k - (r.y + r.h / 2)).toFixed(1);
        row.inside = Math.abs(row.dx) <= r.w / 2 && Math.abs(row.dy) <= r.h / 2;
      }
      out.push(row);
    });
    return out;
  }, id);
  const sweep = await page.evaluate((cid) => {
    const probe = window.__vmProbe[cid];
    if (!probe) return [];
    const tl = window.__timelines[cid];
    const out = [];
    const seen = {};
    const hit = (a, b) => a.left < b.right - 6 && a.right > b.left + 6 && a.top < b.bottom - 6 && a.bottom > b.top + 6;
    for (let t = 0; t < tl.duration(); t += 0.2) {
      tl.time(t);
      const phone = Array.from(document.querySelectorAll(".vmk-phone")).filter((p) => Number(getComputedStyle(p).opacity) > 0.5).map((p) => p.querySelector(".vmk-phone-body").getBoundingClientRect()).filter((r) => r.top < 1000);
      const c = probe.cursor.getBoundingClientRect();
      const tip = { x: c.left + probe.hot.x * (c.width / 76), y: c.top + probe.hot.y * (c.height / 76) };
      document.querySelectorAll(".vmk-bub").forEach((b, i) => {
        if (Number(getComputedStyle(b).opacity) < 0.6) return;
        const r = b.getBoundingClientRect();
        const flag = (what) => {
          const key = i + what;
          if (seen[key]) return;
          seen[key] = true;
          out.push("bubble " + i + " @" + t.toFixed(1) + "s " + what);
        };
        if (r.left < 8 || r.top < 8 || r.right > 1912 || r.bottom > 1072) flag("OFF-FRAME");
        if (r.left < 300 && r.top < 118) flag("UNDER-LOGO");
        if (phone.some((p) => hit(r, p))) flag("OVER-PHONE");
        if (tip.x > r.left && tip.x < r.right && tip.y > r.top && tip.y < r.bottom) flag("OVER-CURSOR");
      });
      document.querySelectorAll(".vmk-bub-line").forEach((l, i) => {
        const cs = getComputedStyle(l);
        if (Number(cs.opacity) > 0.3 && parseFloat(l.style.width) > 200 && !seen["l" + i]) {
          seen["l" + i] = true;
          out.push("connector " + i + " @" + t.toFixed(1) + "s LONG " + Math.round(parseFloat(l.style.width)) + "px");
        }
      });
    }
    return out;
  }, id);
  for (const line of sweep) {
    bad++;
    process.stdout.write(`${id} ${line}\n`);
  }
  await page.close();
  if (!rows) continue;
  for (const r of rows) {
    total++;
    const off = Math.max(Math.abs(r.dx), Math.abs(r.dy), Math.abs(r.dw || 0), Math.abs(r.dh || 0));
    if (off > TOL || !r.visible || r.issues.length) {
      bad++;
      process.stdout.write(`${id} ${r.kind}@${r.t} [${r.state}] ${r.target} dx=${r.dx} dy=${r.dy}${r.dw == null ? "" : ` dw=${r.dw} dh=${r.dh}`}${r.visible ? "" : " HIDDEN-STATE"} ${r.issues.join(" | ")}\n`);
    }
  }
}
await browser.close();
process.stdout.write(`audit: ${total} anchors, ${bad} off (tolerance ${TOL}px)\n`);
process.exit(bad ? 1 : 0);
