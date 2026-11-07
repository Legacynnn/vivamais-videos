import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = join(root, "out");
const tmp = join(root, ".frames");
const FPS = 30;
const CHROME = `${process.env.HOME}/.cache/puppeteer/chrome/mac_arm-145.0.7632.77/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const only = process.argv.slice(2);
const clipsOnly = only.map(Number).filter(Boolean);
const url = pathToFileURL(join(root, "index.html")).href;

const ff = (args) => execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...args], { stdio: ["ignore", "pipe", "inherit"] });
const md5 = (file) => ff(["-i", file, "-f", "md5", "-"]).toString().trim();

mkdirSync(out, { recursive: true });
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--allow-file-access-from-files", "--font-render-hinting=none", "--disable-lcd-text"],
  defaultViewport: { width: 390, height: 840, deviceScaleFactor: 2 },
});

async function open(query) {
  const page = await browser.newPage();
  await page.goto(`${url}?${query}`, { waitUntil: "load" });
  await page.evaluate(() => window.LD.ready);
  return page;
}

const shot = (page, path) => page.screenshot({ path, type: "png", captureBeyondViewport: false });

const meta = await (async () => {
  const page = await open("stop=1");
  const m = await page.evaluate(() => window.LD.meta());
  await page.close();
  return m;
})();

const stopPng = (n) => join(tmp, `stop-${n}.png`);
const hotspots = [];
for (let n = 1; n <= meta.stops.length; n++) {
  const page = await open(`stop=${n}`);
  hotspots.push(await page.evaluate((i) => window.LD.hotspot(i), n));
  await shot(page, stopPng(n));
  await page.close();
  execFileSync("cwebp", ["-quiet", "-lossless", "-exact", "-z", "9", stopPng(n), "-o", join(out, `stop-${n}.webp`)]);
}

const report = [];
for (let k = 1; k < meta.stops.length; k++) {
  if (only.length && !clipsOnly.includes(k)) continue;
  const c = meta.clips[k - 1];
  const dir = join(tmp, `clip-${k}`);
  mkdirSync(dir, { recursive: true });
  const page = await open(`clip=${k}`);
  const frames = Math.round(c.duration * FPS);
  for (let i = 0; i <= frames; i++) {
    await page.evaluate((t) => window.LD.seek(t), i / FPS);
    await shot(page, join(dir, `f${String(i).padStart(4, "0")}.png`));
  }
  await page.close();
  const first = join(dir, "f0000.png");
  const last = join(dir, `f${String(frames).padStart(4, "0")}.png`);
  const firstOk = md5(first) === md5(stopPng(k));
  const lastOk = md5(last) === md5(stopPng(k + 1));
  for (const [ok, a, b, tag] of [[firstOk, first, stopPng(k), "first"], [lastOk, last, stopPng(k + 1), "last"]]) {
    if (ok) continue;
    const r = spawnSync("ffmpeg", ["-i", a, "-i", b, "-filter_complex", "psnr", "-f", "null", "-"], { encoding: "utf8" });
    console.log(`clip ${k}: rendered ${tag} frame differs from still, ${(r.stderr.match(/average:\S+/) || ["?"])[0]}; forcing still pixels`);
  }
  writeFileSync(first, readFileSync(stopPng(k)));
  writeFileSync(last, readFileSync(stopPng(k + 1)));

  const name = `clip-${k}-${k + 1}`;
  const input = ["-framerate", String(FPS), "-i", join(dir, "f%04d.png")];
  const color = ["-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv"];
  const edge = `zones=0,0,q=${c.edgeQ ?? +(process.env.EDGE || 16)}/${frames},${frames},q=${c.edgeQ ?? +(process.env.EDGE || 16)}`;
  ff([...input, ...color, "-an", "-c:v", "libx264", "-profile:v", "high", "-preset", "veryslow", "-tune", "animation", "-crf", String(c.crf ?? +(process.env.CRF || 33)), "-x264-params", edge, "-g", String(frames + 1), "-movflags", "+faststart", join(out, `${name}.mp4`)]);
  const vp9 = [...input, ...color, "-an", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", String(c.vp9crf ?? +(process.env.VP9 || 44)), "-row-mt", "1", "-deadline", "good", "-cpu-used", "1", "-g", String(frames + 1)];
  ff([...vp9, "-pass", "1", "-passlogfile", join(dir, "vp9"), "-f", "webm", "/dev/null"]);
  ff([...vp9, "-pass", "2", "-passlogfile", join(dir, "vp9"), join(out, `${name}.webm`)]);
  report.push({ name, frames: frames + 1, duration: +(frames / FPS).toFixed(3), mp4: statSync(join(out, `${name}.mp4`)).size, webm: statSync(join(out, `${name}.webm`)).size });
}

if (!only.length || process.argv.includes("doctor")) {
  const dir = join(tmp, "doctor");
  mkdirSync(dir, { recursive: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(join(root, "doctor.html")).href, { waitUntil: "load" });
  await page.evaluate(() => window.LD.ready);
  const dur = await page.evaluate(() => window.LD.duration);
  const frames = Math.round(dur * FPS);
  for (let i = 0; i <= frames; i++) {
    await page.evaluate((t) => window.LD.seek(t), i / FPS);
    await shot(page, join(dir, `f${String(i).padStart(4, "0")}.png`));
  }
  await page.close();
  const input = ["-framerate", String(FPS), "-i", join(dir, "f%04d.png")];
  const color = ["-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv"];
  ff([...input, ...color, "-an", "-c:v", "libx264", "-profile:v", "high", "-preset", "veryslow", "-tune", "animation", "-crf", "30", "-movflags", "+faststart", join(out, "doctor-side.mp4")]);
  const vp9 = [...input, ...color, "-an", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "40", "-row-mt", "1", "-deadline", "good", "-cpu-used", "1"];
  ff([...vp9, "-pass", "1", "-passlogfile", join(dir, "vp9"), "-f", "webm", "/dev/null"]);
  ff([...vp9, "-pass", "2", "-passlogfile", join(dir, "vp9"), join(out, "doctor-side.webm")]);
  report.push({ name: "doctor-side", frames: frames + 1, duration: +(frames / FPS).toFixed(3), mp4: statSync(join(out, "doctor-side.mp4")).size, webm: statSync(join(out, "doctor-side.webm")).size });
}

await browser.close();

const manifest = {
  base: "/landing/demo",
  screen: { width: 780, height: 1680 },
  stops: meta.stops.map((s, i) => ({ id: s.id, still: `stop-${i + 1}.webp`, hotspot: hotspots[i], label: s.label })),
  clips: meta.clips.map((c, i) => ({ from: meta.stops[i].id, to: meta.stops[i + 1].id, mp4: `clip-${i + 1}-${i + 2}.mp4`, webm: `clip-${i + 1}-${i + 2}.webm`, duration: +((Math.round(c.duration * FPS) + 1) / FPS).toFixed(3), cues: c.cues })),
  doctorSide: { mp4: "doctor-side.mp4", webm: "doctor-side.webm", width: 1280, height: 800, duration: +((Math.round(meta.clips[4].duration * FPS) + 1) / FPS).toFixed(3), cues: meta.clips[4].cues },
};
writeFileSync(join(out, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.table(report);
