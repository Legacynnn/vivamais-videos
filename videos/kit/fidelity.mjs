import puppeteer from "puppeteer-core";
import { writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { buildState, VW, VH } from "./ui-css.mjs";

import { root } from "./paths.mjs";
const CHROME = `${process.env.HOME}/.cache/puppeteer/chrome/mac_arm-145.0.7632.77/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
mkdirSync(new URL("build/.tmp/", root), { recursive: true });
const names = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files"], defaultViewport: { width: VW, height: VH, deviceScaleFactor: 2 } });
for (const name of names) {
  const s = await buildState(name);
  const doc = `<!doctype html><html><head><meta charset="utf-8"><base href="${root.href}"><link rel="stylesheet" href="vm-ui-phone.css"><style>html,body{margin:0}</style></head><body><div class="vm-ph"><div class="vm-ph-body">${s.html}</div></div><script>document.querySelectorAll("[data-vm-scroll]").forEach(function(e){e.scrollTop=+e.getAttribute("data-vm-top");e.scrollLeft=+e.getAttribute("data-vm-left");});</script></body></html>`;
  const file = new URL(`build/.tmp/_fid-${name}.html`, root);
  writeFileSync(file, doc);
  const page = await browser.newPage();
  await page.goto(file.href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 300));
  const out = `/tmp/vmprobe/fid-${name}.png`;
  await page.screenshot({ path: out });
  await page.close();
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", new URL(`capture/shots/${name}.png`, root).pathname, "-i", out, "-filter_complex", "[0]scale=402:-2[a];[1]scale=402:-2[b];[a][b]hstack=2", `/tmp/vmprobe/fid2-${name}.png`]);
  process.stdout.write(`/tmp/vmprobe/fid2-${name}.png\n`);
}
await browser.close();
