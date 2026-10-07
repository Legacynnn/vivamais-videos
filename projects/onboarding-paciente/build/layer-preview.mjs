import puppeteer from "puppeteer-core";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";

const CHROME = `${process.env.HOME}/.cache/puppeteer/chrome/mac_arm-145.0.7632.77/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const root = new URL("../", import.meta.url).pathname;
const [sceneId, ...names] = process.argv.slice(2);
const scene = (await import(`./scenes/${sceneId}.mjs`)).default;
const fonts = readFileSync(new URL("./build.mjs", import.meta.url), "utf8").match(/const FONTS = \[([\s\S]*?)\]\n/)[1];
const list = eval(`[${fonts}]`);
const face = list.map(([f, w, file]) => `@font-face{font-family:"${f}";font-weight:${w};src:url("assets/brand/fonts/${file}.ttf")}`).join("\n");
mkdirSync(`${root}build/.tmp`, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files"] });
const page = await browser.newPage();
await page.setViewport({ width: 402, height: Number(process.env.H || 874), deviceScaleFactor: 2 });
const outs = [];
for (const n of names) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><base href="file://${root}"><style>${face}
html,body{margin:0;background:#fafafe}.L{position:relative;width:402px;height:${process.env.H || 874}px;overflow:hidden}
${scene.css || ""}${process.env.CSS || ""}</style></head><body><div class="L">${scene.layers[n]}</div><script>${process.env.JS || ""}</script></body></html>`;
  const f = `${root}build/.tmp/lp-${n}.html`;
  writeFileSync(f, html);
  await page.goto(`file://${f}`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 300));
  const o = `/tmp/vmprobe/lp-${n}.png`;
  await page.screenshot({ path: o });
  outs.push(o);
}
await browser.close();
if (outs.length > 1) execFileSync("ffmpeg", ["-v", "error", "-y", ...outs.flatMap((o) => ["-i", o]), "-filter_complex", `hstack=${outs.length}`, "/tmp/vmprobe/lp.png"]);
else execFileSync("cp", [outs[0], "/tmp/vmprobe/lp.png"]);
console.log("/tmp/vmprobe/lp.png");
