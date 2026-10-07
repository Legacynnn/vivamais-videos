import { open, go, tap, shot, sleep, mock } from "./lib.mjs";
import { readFileSync, writeFileSync } from "node:fs";
const [, , name, auth, ...steps] = process.argv;
const { browser, page } = await open({ auth: auth !== "noauth", seen: auth !== "fresh" });
page.on("console", (m) => m.type() === "error" && process.stderr.write(`console: ${m.text().slice(0, 160)}\n`));
for (const st of steps) {
  const [op, arg, extra] = st.split("|");
  if (op === "go") await go(page, arg, { wait: Number(extra || 3000) });
  else if (op === "tap") await tap(page, arg, { exact: extra === "x", wait: 1800 });
  else if (op === "type") { await page.keyboard.type(arg, { delay: 20 }); await sleep(600); }
  else if (op === "focus") { await page.evaluate((i) => { const el = [...document.querySelectorAll("input,textarea")].filter((e) => e.getBoundingClientRect().width > 0)[Number(i)]; el && el.focus(); }, arg); await sleep(300); }
  else if (op === "wait") await sleep(Number(arg));
  else if (op === "mock") await mock("set", JSON.parse(arg));
  else if (op === "scroll") { await page.mouse.move(200, 500); await page.mouse.wheel({ deltaY: Number(arg) }); await sleep(900); }
}
await sleep(1500);
await shot(page, `x-${name}`);
const txt = await page.evaluate(() => {
  const out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const t = n.textContent.trim();
    if (!t) continue;
    const r = n.parentElement.getBoundingClientRect();
    if (r.width && r.height && r.bottom > 0 && r.top < innerHeight && getComputedStyle(n.parentElement).visibility !== "hidden") out.push(t);
  }
  return location.pathname + " :: " + out.join(" | ");
});
console.log(txt.slice(0, 1500));
const inputs = await page.evaluate(() => [...document.querySelectorAll("input,textarea")].filter((e) => e.getBoundingClientRect().width > 0).map((e) => e.placeholder || e.name).join(", "));
console.log("inputs:", inputs);
await browser.close();
