import puppeteer from "puppeteer-core";
const CHROME = `${process.env.HOME}/.cache/puppeteer/chrome/mac_arm-145.0.7632.77/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files"], defaultViewport: { width: 1280, height: 800 } });
const p = await b.newPage();
p.on("pageerror", (e) => console.error(e.message));
await p.goto("file:///Users/legacyn/www/vivamais/vivamais-videos/videos/clips/landing-demo/doctor.html");
await p.evaluate(() => window.LD.ready);
for (const t of [0.5, 2.3, 3.0, 5.5]) { await p.evaluate((x) => window.LD.seek(x), t); await p.screenshot({ path: `/tmp/ld/doc-${t}.png` }); }
await b.close();
