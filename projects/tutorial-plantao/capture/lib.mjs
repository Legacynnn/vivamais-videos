import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const APP = process.env.APP_URL || "http://localhost:8095";
export const API = process.env.MOCK_URL || "http://127.0.0.1:8788";
export const OUT = fileURLToPath(new URL("./states/", import.meta.url));
export const SHOTS = fileURLToPath(new URL("./shots/", import.meta.url));
export const VW = 402;
export const VH = 874;
export const INSETS = { top: 62, bottom: 34, left: 0, right: 0 };
const CLOCK = Date.parse("2026-09-29T14:20:00-03:00");
const CHROME =
  process.env.CHROME_PATH ||
  `${process.env.HOME}/.cache/puppeteer/chrome/mac_arm-145.0.7632.77/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;

mkdirSync(OUT, { recursive: true });
mkdirSync(SHOTS, { recursive: true });

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const mock = async (name, body) => {
  const res = await fetch(`${API}/__${name}`, { method: body ? "POST" : "GET", body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(`mock ${name} failed`);
  return res.json();
};

export async function open({ seen = true } = {}) {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    protocolTimeout: 600000,
    args: ["--hide-scrollbars", "--font-render-hinting=none", "--lang=pt-BR", "--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"],
    defaultViewport: { width: VW, height: VH, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  });
  const ctx = browser.defaultBrowserContext();
  await ctx.overridePermissions(APP, ["camera", "microphone"]);
  const page = await browser.newPage();
  await page.emulateTimezone("America/Sao_Paulo");
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const u = req.url();
    const local = u.startsWith(APP) || u.startsWith(API) || u.startsWith("data:") || u.startsWith("blob:") || u.startsWith("ws://127.0.0.1");
    if (local) req.continue();
    else req.abort();
  });
  page.on("pageerror", (e) => process.stderr.write(`pageerror: ${e.message.slice(0, 300)}\n`));
  await page.evaluateOnNewDocument(
    (insets, clock, seen) => {
      window.__vmInsets = insets;
      const lock = { released: false, type: "screen", release: async () => {}, addEventListener() {}, removeEventListener() {} };
      Object.defineProperty(navigator, "wakeLock", { value: { request: async () => lock }, configurable: true });
      const addTw = () => {
        const old = document.getElementById("vm-tw");
        if (old) old.remove();
        const l = document.createElement("link");
        l.id = "vm-tw";
        l.rel = "stylesheet";
        l.href = "/tw.css";
        document.head.append(l);
      };
      document.addEventListener("DOMContentLoaded", addTw);
      window.addEventListener("load", addTw);
      const RealDate = Date;
      const realNow = RealDate.now.bind(RealDate);
      const off = clock - realNow();
      class VmDate extends RealDate {
        constructor(...a) {
          if (a.length === 0) super(realNow() + off);
          else super(...a);
        }
        static now() {
          return realNow() + off;
        }
      }
      window.Date = VmDate;
      if (!sessionStorage.getItem("vm-init")) {
        sessionStorage.setItem("vm-init", "1");
        localStorage.clear();
        localStorage.setItem("access_token", "mock-access");
        localStorage.setItem("refresh_token", "mock-refresh");
        localStorage.setItem("@viva_mais:camera_permission", "true");
        localStorage.setItem("@viva_mais:microphone_permission", "true");
        localStorage.setItem("onboarding_seen", "true");
        if (seen) localStorage.setItem("benefits_tutorial_seen_u-ana", "true");
      }
    },
    INSETS,
    CLOCK,
    seen
  );
  return { browser, page };
}

export async function go(page, path = "/", { wait = 1500 } = {}) {
  await page.goto(`${APP}${path}`, { waitUntil: "networkidle2", timeout: 180000 });
  await page.evaluate(() => document.fonts.ready);
  await sleep(wait);
}

export async function mark(page, text, { tag = "*", nth = 0, exact = false } = {}) {
  const ok = await page.evaluate(
    ({ text, tag, nth, exact }) => {
      document.querySelectorAll("[data-cap-target]").forEach((e) => e.removeAttribute("data-cap-target"));
      const norm = (s) => s.trim().replace(/\s+/g, " ");
      const els = [...document.querySelectorAll(tag)].filter((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return false;
        const t = norm(el.textContent || el.getAttribute("aria-label") || "");
        if (exact ? t !== text : !t.includes(text)) return false;
        return ![...el.children].some((c) => {
          const ct = norm(c.textContent || "");
          return exact ? ct === text : ct.includes(text);
        });
      });
      const el = els[nth];
      if (!el) return false;
      el.setAttribute("data-cap-target", "1");
      return true;
    },
    { text, tag, nth, exact }
  );
  if (!ok) throw new Error(`mark: "${text}" not found`);
  return "[data-cap-target]";
}

export async function tap(page, text, o = {}) {
  const sel = await mark(page, text, o);
  const off = await page.$eval(sel, (e) => { const r = e.getBoundingClientRect(); return r.bottom > innerHeight - 40 || r.top < 0; });
  if (off) {
    await page.$eval(sel, (e) => e.scrollIntoView({ block: "center" }));
    await sleep(400);
  }
  const box = await (await page.$(sel)).boundingBox();
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await sleep(o.wait ?? 900);
}

export async function shot(page, name) {
  await page.screenshot({ path: `${SHOTS}${name}.png` });
}

async function canvasShots(page) {
  const boxes = await page.evaluate(() =>
    [...document.querySelectorAll("canvas")].map((c, i) => {
      c.setAttribute("data-vm-cid", String(i));
      const r = c.getBoundingClientRect();
      return { i, x: r.left, y: r.top, w: r.width, h: r.height };
    }).filter((b) => b.w > 0 && b.h > 0)
  );
  if (!boxes.length) return;
  await page.addStyleTag({ content: "body *{visibility:hidden!important}canvas{visibility:visible!important}", id: "vm-hide" });
  await sleep(120);
  for (const b of boxes) {
    const x = Math.max(0, b.x), y = Math.max(0, b.y);
    const w = Math.min(VW, b.x + b.w) - x, h = Math.min(VH, b.y + b.h) - y;
    if (w <= 0 || h <= 0) continue;
    const buf = await page.screenshot({ clip: { x, y, width: w, height: h }, omitBackground: true, encoding: "base64" });
    await page.evaluate((i, src, off) => {
      const c = document.querySelector(`canvas[data-vm-cid="${i}"]`);
      c.setAttribute("data-vm-shot", src);
      c.setAttribute("data-vm-off", JSON.stringify(off));
    }, b.i, `data:image/png;base64,${buf}`, { dx: x - b.x, dy: y - b.y, w, h });
  }
  await page.evaluate(() => document.querySelectorAll("style").forEach((s) => s.textContent.startsWith("body *{visibility:hidden") && s.remove()));
  await sleep(80);
}

export async function snapshot(page, name) {
  await canvasShots(page);
  const data = await page.evaluate(() => {
    document.querySelectorAll("[data-vm-scroll]").forEach((el) => {
      el.removeAttribute("data-vm-scroll");
      el.removeAttribute("data-vm-top");
      el.removeAttribute("data-vm-left");
    });
    document.querySelectorAll("*").forEach((el) => {
      if ((el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2) && /(auto|scroll)/.test(getComputedStyle(el).overflow + getComputedStyle(el).overflowX + getComputedStyle(el).overflowY)) {
        el.setAttribute("data-vm-scroll", `${el.scrollHeight - el.clientHeight}`);
        el.setAttribute("data-vm-top", `${el.scrollTop}`);
        el.setAttribute("data-vm-left", `${el.scrollLeft}`);
      }
    });
    document.querySelectorAll("input, textarea").forEach((el) => {
      if (el.tagName === "TEXTAREA") el.textContent = el.value;
      else el.setAttribute("value", el.value);
    });
    document.querySelectorAll("canvas[data-vm-shot]").forEach((c) => {
      const off = JSON.parse(c.getAttribute("data-vm-off"));
      const img = document.createElement("img");
      img.setAttribute("src", c.getAttribute("data-vm-shot"));
      img.setAttribute("style", `position:absolute;left:${off.dx}px;top:${off.dy}px;width:${off.w}px;height:${off.h}px;display:block`);
      img.setAttribute("data-vm-canvas", "1");
      const wrap = document.createElement("div");
      wrap.setAttribute("style", (c.getAttribute("style") || "") + ";position:relative;overflow:hidden");
      wrap.appendChild(img);
      c.setAttribute("data-vm-canvas-src", wrap.outerHTML);
    });
    document.querySelectorAll("video").forEach((v) => {
      try {
        const c = document.createElement("canvas");
        c.width = v.videoWidth;
        c.height = v.videoHeight;
        c.getContext("2d").drawImage(v, 0, 0);
        v.setAttribute("data-vm-poster", c.toDataURL("image/jpeg", 0.9));
      } catch {}
    });
    const PROPS = ["display", "padding", "border", "background-color", "font-family", "font-size", "font-weight", "line-height", "letter-spacing", "text-align", "color", "box-sizing", "align-items", "justify-content", "flex-direction", "margin", "border-radius", "overflow"];
    document.querySelectorAll("button").forEach((b) => {
      const cs = getComputedStyle(b);
      b.setAttribute("data-vm-bstyle", PROPS.map((k) => `${k}:${cs.getPropertyValue(k)}`).join(";"));
    });
    const clone = document.body.cloneNode(true);
    [...clone.querySelectorAll("button")].reverse().forEach((b) => {
      const d = document.createElement("div");
      [...b.attributes].forEach((a) => d.setAttribute(a.name, a.value));
      d.setAttribute("style", b.getAttribute("data-vm-bstyle") + ";" + (b.getAttribute("style") || ""));
      d.removeAttribute("data-vm-bstyle");
      d.setAttribute("data-vm-button", "1");
      while (b.firstChild) d.appendChild(b.firstChild);
      b.replaceWith(d);
    });
    clone.querySelectorAll("video[data-vm-poster]").forEach((v) => {
      const img = document.createElement("img");
      img.setAttribute("src", v.getAttribute("data-vm-poster"));
      img.setAttribute("style", (v.getAttribute("style") || "") + ";object-fit:" + (getComputedStyle(document.querySelector("video")).objectFit || "cover"));
      img.setAttribute("class", v.getAttribute("class") || "");
      img.setAttribute("data-vm-video", "1");
      v.replaceWith(img);
    });
    clone.querySelectorAll("canvas[data-vm-canvas-src]").forEach((c) => {
      const w = document.createElement("div");
      w.innerHTML = c.getAttribute("data-vm-canvas-src");
      c.replaceWith(w.firstChild);
    });
    clone.querySelectorAll("script, noscript, link, style, iframe").forEach((el) => el.remove());
    clone.querySelectorAll("*").forEach((el) => {
      [...el.attributes].forEach((a) => {
        if (a.name.startsWith("on")) el.removeAttribute(a.name);
      });
    });
    return { html: clone.innerHTML, width: innerWidth, height: innerHeight, path: location.pathname };
  });
  writeFileSync(`${OUT}${name}.json`, JSON.stringify(data));
  await saveCss(page);
  await page.screenshot({ path: `${SHOTS}${name}.png` });
  process.stdout.write(`snap ${name} ${data.path}\n`);
  return data;
}

const seenCss = new Map();

export async function saveCss(page) {
  const sheets = await page.evaluate(() =>
    [...document.styleSheets].map((sheet, i) => {
      let rules = [];
      try {
        rules = [...sheet.cssRules].map((r) => r.cssText);
      } catch {}
      const id = sheet.ownerNode && sheet.ownerNode.id ? sheet.ownerNode.id : sheet.href || `inline-${i}`;
      return { id, rules };
    })
  );
  const file = `${OUT}../css/raw.json`;
  if (seenCss.size === 0 && existsSync(file)) JSON.parse(readFileSync(file, "utf8")).forEach(([k, v]) => seenCss.set(k, v));
  for (const s of sheets) {
    const prev = seenCss.get(s.id) || [];
    const have = new Set(prev);
    seenCss.set(s.id, prev.concat(s.rules.filter((r) => !have.has(r))));
  }
  mkdirSync(`${OUT}../css`, { recursive: true });
  writeFileSync(file, JSON.stringify([...seenCss.entries()]));
}
