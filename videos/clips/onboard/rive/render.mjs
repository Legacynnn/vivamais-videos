import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright-core';
const [riv, out, anim = 'Main', seconds, sm = ''] = process.argv.slice(2);
const FPS = 30, SIZE = 1080, BG = '#FAFAFE';
const root = path.dirname(new URL(import.meta.url).pathname);
const mime = { '.html': 'text/html', '.mjs': 'text/javascript', '.wasm': 'application/wasm', '.riv': 'application/octet-stream' };
const srv = http.createServer((q, r) => {
  const p = q.url === '/file.riv' ? path.resolve(riv) : path.join(root, decodeURIComponent(q.url.split('?')[0]));
  if (!fs.existsSync(p)) { console.log('404', q.url); r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': mime[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(r);
}).listen(0);
const port = srv.address().port;
const exe = `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const page = await browser.newPage();
page.on('console', (m) => console.log('[page]', m.text()));
await page.goto(`http://127.0.0.1:${port}/${process.env.PAGE || 'page.html'}`);
await page.waitForFunction(() => window.setup);
await page.evaluate((ab) => { window.AB = ab; }, process.env.AB || '');
const info = await page.evaluate(([a, s, b]) => window.setup('/file.riv', 1080, a, s, b), [anim, sm, BG]);
console.log(info);
const total = Math.round((seconds ? Number(seconds) : info.duration) * FPS);
const dir = fs.mkdtempSync('/tmp/riveframes-');
for (let i = 0; i < total; i++) {
  const url = await page.evaluate((dt) => window.step(dt), i === 0 ? 0 : 1 / FPS);
  fs.writeFileSync(path.join(dir, `f${String(i).padStart(5, '0')}.png`), Buffer.from(url.split(',')[1], 'base64'));
}
await browser.close(); srv.close();
execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(dir, 'f%05d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '26', '-preset', 'slow', '-movflags', '+faststart', out], { stdio: 'inherit' });
console.log('wrote', out, total, 'frames; frames in', dir);
