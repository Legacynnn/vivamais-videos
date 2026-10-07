import { createServer } from "node:http";
import { existsSync, mkdtempSync, readdirSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const here = dirname(fileURLToPath(import.meta.url));
const WEB = process.env.WEB || "http://localhost:3123";
const PORT = 8787;
const out = join(here, "../assets/app/canal-denuncia.png");

const channel = {
  id: "c1",
  public_id: "aurora",
  company_name: "Aurora Logística",
  name: "Canal de denúncia",
  title: "Canal de denúncia",
  intro_text: "",
  guidance_text: "",
  is_enabled: true,
  is_public_enabled: true,
  image_url: null,
  categories: [
    { value: "ASSEDIO_MORAL", label: "Assédio moral" },
    { value: "ASSEDIO_SEXUAL", label: "Assédio sexual" },
    { value: "DISCRIMINACAO", label: "Discriminação" },
    { value: "OUTRO", label: "Outro", requires_custom_text: true },
  ],
  severities: [
    { value: "LOW", label: "Baixa" },
    { value: "MEDIUM", label: "Média" },
    { value: "HIGH", label: "Alta", is_urgent: true },
  ],
};

const server = createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.end();
  res.setHeader("Content-Type", "application/json");
  if (req.url.startsWith("/whistleblowing/public/channels/aurora/")) return res.end(JSON.stringify(channel));
  res.statusCode = 404;
  res.end("{}");
});
await new Promise((ok) => server.listen(PORT, "127.0.0.1", ok));

const files = mkdtempSync(join(tmpdir(), "denuncia-"));
const evidence = ["print_grupo.png", "audio_reuniao.mp3", "video_corredor.mp4"].map((name) => {
  const path = join(files, name);
  writeFileSync(path, Buffer.alloc(2048, 1));
  return path;
});

function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const cache = join(homedir(), ".cache/puppeteer/chrome");
  for (const version of readdirSync(cache).sort().reverse()) {
    const bin = join(cache, version, "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing");
    if (existsSync(bin)) return bin;
  }
  throw new Error("Chrome not found. Set CHROME=/path/to/chrome");
}

const browser = await puppeteer.launch({
  executablePath: findChrome(),
  headless: true,
  args: ["--lang=pt-BR"],
  protocolTimeout: 180000,
});
const page = await browser.newPage();
await page.setViewport({ width: 900, height: 1000, deviceScaleFactor: 2 });
await page.goto(`${WEB}/canal-denuncias/aurora`, { waitUntil: "networkidle0", timeout: 180000 });
await page.waitForSelector("#public-title", { timeout: 120000 });

await page.type("#public-title", "Gestor humilha a equipe nas reuniões");
await page.select("#public-category", "ASSEDIO_MORAL");
await page.select("#public-severity", "HIGH");
await page.type("#public-location", "Setor Comercial");
await page.type(
  "#public-description",
  "Nas reuniões semanais, o gestor grita e expõe colegas na frente do time. Aconteceu de novo na segunda.",
);
const input = await page.$("#public-files");
await input.uploadFile(...evidence);
await page.evaluate(() => {
  const date = document.querySelector("#public-occurred-at");
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(date, "2026-10-05T10:30");
  date.dispatchEvent(new Event("input", { bubbles: true }));
  const file = document.querySelector("#public-files");
  const fs = getComputedStyle(file);
  const style = document.createElement("style");
  style.textContent = "#public-files, #public-files::file-selector-button { color: transparent !important; }";
  document.head.append(style);
  const label = document.createElement("span");
  label.innerHTML = '<b style="font-weight:500">Escolher arquivos</b>&nbsp; Nenhum arquivo escolhido';
  const fr = file.getBoundingClientRect();
  label.style.cssText = `position:absolute;left:${fr.left + scrollX + 12}px;top:${fr.top + scrollY}px;height:${fr.height}px;z-index:10;display:flex;align-items:center;font:${fs.font};color:#111827;pointer-events:none`;
  document.body.append(label);
  document.activeElement?.blur();
  document.querySelectorAll("[data-sonner-toaster], nextjs-portal").forEach((t) => t.remove());
  for (const el of document.querySelectorAll("body *")) {
    if (getComputedStyle(el).position === "fixed") el.remove();
  }
});
await new Promise((ok) => setTimeout(ok, 600));

await page.screenshot({ path: out, fullPage: true });
console.log(out);

await browser.close();
server.close();
