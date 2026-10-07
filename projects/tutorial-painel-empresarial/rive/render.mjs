import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';

const [riv, out, seconds] = process.argv.slice(2);
const FPS = 30;
const W = 1920;
const H = 1080;
const here = path.dirname(new URL(import.meta.url).pathname);
const project = path.resolve(here, '..');
const mime = { '.html': 'text/html', '.mjs': 'text/javascript', '.wasm': 'application/wasm', '.riv': 'application/octet-stream' };
const srv = http
  .createServer((q, r) => {
    const url = decodeURIComponent(q.url.split('?')[0]);
    const p = url === '/file.riv' ? path.resolve(riv) : url.startsWith('/node_modules/') ? path.join(project, url) : path.join(here, url);
    if (!fs.existsSync(p)) {
      r.writeHead(404);
      return r.end();
    }
    r.writeHead(200, { 'Content-Type': mime[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(r);
  })
  .listen(0);
const port = srv.address().port;
const exe = `${process.env.HOME}/.cache/puppeteer/chrome/mac_arm-145.0.7632.77/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const browser = await puppeteer.launch({ executablePath: exe, headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'], defaultViewport: { width: W, height: H } });
const page = await browser.newPage();
page.on('console', (m) => console.log('[page]', m.text()));
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto(`http://127.0.0.1:${port}/page.html`);
await page.waitForFunction(() => window.setup);
const info = await page.evaluate(() => window.setup('/file.riv', 1920, 1080, 'Main', '#FAFAFE'));
const total = Math.round((seconds ? Number(seconds) : info.duration) * FPS);
const dir = fs.mkdtempSync('/tmp/vm-island-');
for (let i = 0; i < total; i++) {
  const url = await page.evaluate((dt) => window.step(dt), i === 0 ? 0 : 1 / FPS);
  fs.writeFileSync(path.join(dir, `f${String(i).padStart(5, '0')}.png`), Buffer.from(url.split(',')[1], 'base64'));
}
await browser.close();
srv.close();
fs.mkdirSync(path.dirname(out), { recursive: true });
execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(dir, 'f%05d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '14', '-preset', 'slow', '-g', '1', '-movflags', '+faststart', out], { stdio: 'inherit' });
for (const t of [60, 110, 150, 195]) fs.copyFileSync(path.join(dir, `f${String(Math.min(t, total - 1)).padStart(5, '0')}.png`), path.join(here, 'out', `frame-${t}.png`));
console.log('wrote', out, total, 'frames', info);
