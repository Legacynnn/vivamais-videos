import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const APP = process.env.APP_URL || "http://127.0.0.1:3457";
export const API = process.env.MOCK_URL || "http://127.0.0.1:8787";
export const COMPANY_ID = "c0a1f7e2-aurora";
export const OUT = fileURLToPath(new URL("./states/", import.meta.url));
export const SHOTS = fileURLToPath(new URL("./shots/", import.meta.url));
const CHROME =
  process.env.CHROME_PATH ||
  `${process.env.HOME}/.cache/puppeteer/chrome/mac_arm-145.0.7632.77/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;

mkdirSync(OUT, { recursive: true });
mkdirSync(SHOTS, { recursive: true });

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const scenario = async (name) => {
  const res = await fetch(`${API}/__scenario/${name}`);
  if (!res.ok) throw new Error(`scenario ${name} failed`);
};

export const apiLog = async () => (await fetch(`${API}/__log`)).json();

export async function open({ width = 1280, height = 800, auth = true } = {}) {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--hide-scrollbars", "--font-render-hinting=none", "--lang=pt-BR"],
    defaultViewport: { width, height, deviceScaleFactor: 2 },
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const u = req.url();
    const local = u.startsWith(APP) || u.startsWith(API) || u.startsWith("data:") || u.startsWith("blob:");
    if (u.startsWith("https://api.ipify.org")) {
      req.respond({ status: 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" }, body: '{"ip":"203.0.113.10"}' });
      return;
    }
    if (local) req.continue();
    else req.abort();
  });
  page.on("pageerror", (e) => process.stderr.write(`pageerror: ${e.message}\n`));
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem("cookieConsent", "accepted");
    localStorage.setItem("cookieConsentDate", "2026-09-01T12:00:00.000Z");
  });
  if (auth) await login(page);
  return { browser, page };
}

export async function login(page) {
  const domain = new URL(APP).hostname;
  await page.setCookie(
    { name: "token_vivamais", value: "mock-access", domain, path: "/" },
    { name: "refresh_vivamais", value: "mock-refresh", domain, path: "/" },
    { name: "user_type_vivamais", value: "COMPANY", domain, path: "/" }
  );
}

export async function go(page, path, { wait = 1200 } = {}) {
  await page.goto(`${APP}${path}`, { waitUntil: "networkidle2", timeout: 120000 });
  await page.evaluate(() => document.fonts.ready);
  await sleep(wait);
}

export async function clickText(page, text, { tag = "button,a,[role=button],[role=menuitem],label", nth = 0 } = {}) {
  const ok = await page.evaluate(
    ({ text, tag, nth }) => {
      const els = [...document.querySelectorAll(tag)].filter(
        (el) => el.textContent.trim().replace(/\s+/g, " ").includes(text) && el.offsetParent !== null
      );
      const el = els[nth];
      if (!el) return false;
      el.scrollIntoView({ block: "center" });
      el.setAttribute("data-cap-target", "1");
      return true;
    },
    { text, tag, nth }
  );
  if (!ok) throw new Error(`clickText: "${text}" not found`);
  await page.click("[data-cap-target]");
  await page.evaluate(() => document.querySelector("[data-cap-target]")?.removeAttribute("data-cap-target"));
  await sleep(500);
}

export async function type(page, selector, value, { clear = true } = {}) {
  await page.waitForSelector(selector, { visible: true });
  await page.click(selector, { clickCount: clear ? 3 : 1 });
  if (clear) await page.keyboard.press("Backspace");
  await page.type(selector, value, { delay: 8 });
}

export async function shot(page, name) {
  await page.screenshot({ path: `${SHOTS}${name}.png` });
}

export async function snapshot(page, name, { scrollY = null } = {}) {
  if (scrollY != null) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await sleep(250);
  }
  const data = await page.evaluate(() => {
    document.querySelectorAll("input, textarea").forEach((el) => {
      if (el.type === "checkbox" || el.type === "radio") {
        if (el.checked) el.setAttribute("checked", "");
        else el.removeAttribute("checked");
        return;
      }
      if (el.type === "file") return;
      if (el.tagName === "TEXTAREA") el.textContent = el.value;
      else el.setAttribute("value", el.value);
    });
    document.querySelectorAll("select").forEach((el) => {
      [...el.options].forEach((o) => (o.selected ? o.setAttribute("selected", "") : o.removeAttribute("selected")));
    });
    const clone = document.body.cloneNode(true);
    clone
      .querySelectorAll("script, noscript, nextjs-portal, next-route-announcer, link, style, iframe, [data-nextjs-toast], [data-next-badge-root]")
      .forEach((el) => el.remove());
    clone.querySelectorAll("*").forEach((el) => {
      [...el.attributes].forEach((a) => {
        if (a.name.startsWith("on")) el.removeAttribute(a.name);
      });
    });
    return {
      bodyClass: document.body.className,
      htmlClass: document.documentElement.className,
      html: clone.innerHTML,
      scrollY: window.scrollY,
      scrollHeight: document.documentElement.scrollHeight,
      width: window.innerWidth,
      height: window.innerHeight,
      path: location.pathname,
    };
  });
  writeFileSync(`${OUT}${name}.json`, JSON.stringify(data, null, 1));
  await saveCss(page);
  await page.screenshot({ path: `${SHOTS}${name}.png` });
  process.stdout.write(`snap ${name} ${data.path} h=${data.scrollHeight}\n`);
  return data;
}

const seenCss = new Map();

export async function saveCss(page) {
  const sheets = await collectCss(page);
  if (seenCss.size === 0 && existsSync(`${OUT}../css/raw.json`)) {
    JSON.parse(readFileSync(`${OUT}../css/raw.json`, "utf8")).forEach(([k, v]) => seenCss.set(k, v));
  }
  sheets.forEach((s, i) => {
    const key = s.href ? new URL(s.href).pathname : `inline-${s.css.length}`;
    seenCss.set(key, s.css);
  });
  mkdirSync(`${OUT}../css`, { recursive: true });
  writeFileSync(`${OUT}../css/raw.json`, JSON.stringify([...seenCss.entries()]));
}

export async function collectCss(page) {
  return page.evaluate(async () => {
    const out = [];
    for (const sheet of [...document.styleSheets]) {
      try {
        out.push({ href: sheet.href, css: [...sheet.cssRules].map((r) => r.cssText).join("\n") });
      } catch {
        if (sheet.href) out.push({ href: sheet.href, css: await (await fetch(sheet.href)).text() });
      }
    }
    return out;
  });
}
