import { mkdirSync, readFileSync, readdirSync, writeFileSync, copyFileSync } from "node:fs";
import { buildState, buildCss } from "../../../kit/ui-css.mjs";
import { kit, pkg } from "../../../kit/paths.mjs";
import { measure } from "../../../kit/measure.mjs";

const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const write = (p, s) => writeFileSync(new URL(p, root), s);

const FW = 1080;
const FH = 1920;
const K = 1.3;
const GEO = {
  iphone: { sx: Math.round(FW / 2 - (402 * K) / 2), sy: Math.round(1000 - (874 * K) / 2), k: K, uw: 402, uh: 874, chrome: 0, scope: "vm-ph", css: "vm-ui-phone.css" },
};
GEO.iphone.left = GEO.iphone.sx - 13;
GEO.iphone.top = GEO.iphone.sy - 13;

const STATUS = `<span>9:41</span><span class="ic"><svg width="19" height="12" viewBox="0 0 19 12" fill="currentColor"><rect x="0" y="8" width="3.2" height="4" rx="1"/><rect x="5" y="5.5" width="3.2" height="6.5" rx="1"/><rect x="10" y="3" width="3.2" height="9" rx="1"/><rect x="15" y="0" width="3.2" height="12" rx="1"/></svg><svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><path d="M8.5 2.3c2.4 0 4.6.9 6.3 2.5l1.2-1.2A10.6 10.6 0 0 0 8.5.6 10.6 10.6 0 0 0 1 3.6l1.2 1.2a9 9 0 0 1 6.3-2.5z"/><path d="M8.5 5.6c1.5 0 2.9.6 4 1.6l1.2-1.2a7.3 7.3 0 0 0-10.4 0l1.2 1.2c1.1-1 2.5-1.6 4-1.6z"/><path d="M8.5 8.9c.6 0 1.2.2 1.6.6L8.5 11.2 6.9 9.5c.4-.4 1-.6 1.6-.6z"/></svg><svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x=".5" y=".5" width="23" height="12" rx="3.8" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2.5" fill="currentColor"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity=".45"/></svg></span>`;
const TOUCH = `<i></i>`;
const CURSOR = `<svg viewBox="0 0 24 24" fill="none"><path d="M5 3.4v15.8l4.2-3.9 2.8 6.3 2.6-1.1-2.8-6.2h5.8z" fill="#1c1c1c" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
const LOCK = `<svg viewBox="0 0 24 24" fill="none" stroke="#726f80" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;

const FONTS = [
  ["DM Sans", 400, "DMSans-Regular"],
  ["DM Sans", 500, "DMSans-Medium"],
  ["DM Sans", 700, "DMSans-Bold"],
  ["DMSans_400Regular", 400, "DMSans-Regular"],
  ["DMSans_500Medium", 400, "DMSans-Medium"],
  ["DMSans_700Bold", 400, "DMSans-Bold"],
  ["Space Grotesk", 700, "SpaceGrotesk-Bold"],
  ["Space Grotesk", 500, "SpaceGrotesk-Medium"],
  ["SpaceGrotesk_700Bold", 400, "SpaceGrotesk-Bold"],
  ["SpaceGrotesk_500Medium", 400, "SpaceGrotesk-Medium"],
]
  .map(([f, w, file]) => `@font-face{font-family:"${f}";font-weight:${w};font-display:block;src:url("assets/brand/fonts/${file}.ttf") format("truetype")}`)
  .join("\n") + `\n@font-face{font-family:"SFMono-Regular";src:local("Menlo")}`;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

const ICON = (name) => readFileSync(pkg("lucide-static", `icons/${name}.svg`), "utf8").replace(/<!--[\s\S]*?-->/g, "").replace(/\s*class="[^"]*"/, "").replace("<svg", '<svg class="h-5 w-5"').trim();
async function deviceScene(scene, baked) {
  const g = GEO.iphone;
  const states = [];
  for (const [name, scroll] of scene.states) {
    const st = await buildState(name, `${scene.id}-${name}`);
    const html = scene.patch ? scene.patch(name, st.html) : st.html;
    states.push(`<div class="vmk-state" data-state="${name}" data-scroll="${scroll || 0}"><div class="${g.scope}-body">${html}</div></div>`);
  }
  const layers = Object.entries(scene.layers || {})
    .map(([name, html]) => `<div class="vmk-layer" data-vmk-layer="${name}">${html}</div>`)
    .join("\n");
  const sw = +(g.uw * g.k).toFixed(2);
  const sh = +(g.uh * g.k).toFixed(2);
  const titleWords = scene.title.split(" ");
  const titleLines = scene.lines || (titleWords.length > 1 ? [titleWords[0], titleWords.slice(1).join(" ")] : [scene.title]);
  const words = titleLines
    .map((line, i) => `<span class="l"><span class="w" data-layout-allow-overlap>${esc(line)}${i === titleLines.length - 1 ? "<u></u>" : ""}</span></span>`)
    .join("");
  const caps = scene.captions
    .map(
      (c) =>
        `<div class="vmk-bub" data-layout-allow-overlap><h3 data-layout-allow-overlap>${c.title
          .split(" ")
          .map((w) => `<span data-layout-allow-overlap>${esc(w)}</span>`)
          .join(" ")}</h3><p data-layout-allow-overlap>${rich(c.body).replace(/<b>/g, "<b data-layout-allow-overlap>")}</p></div>`
    )
    .join("");
  const geo = JSON.stringify({ sx: g.sx, sy: g.sy, k: g.k, uw: g.uw, uh: g.uh, chrome: 0 });
  return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><title>${scene.id}</title></head>
<body><template>
<link rel="stylesheet" href="vm-kit.css">
<link rel="stylesheet" href="${g.css}">
<style>
${FONTS}
#root{position:absolute;inset:0;overflow:hidden}
${scene.css || ""}
</style>
<div id="root" data-composition-id="${scene.id}" data-width="${FW}" data-height="${FH}" data-duration="${scene.duration}">
<div class="vmk">
<div class="vmk-cam-outer"><div class="vmk-cam-inner">
<div class="vmk-device vmk-iphone" style="left:${g.left}px;top:${g.top}px">
<div class="vmk-lid">
<div class="vmk-screen" style="width:${sw}px;height:${sh}px">
<div class="vmk-screen-inner" style="width:${g.uw}px;height:${g.uh}px;transform:scale(${g.k})">
<div class="${g.scope}" style="position:absolute;left:0;top:0">
${states.join("\n")}
${layers}
</div>
<div class="vmk-status">${STATUS}</div>
<div class="vmk-status dark">${STATUS}</div>
<div class="vmk-island"></div>
<div class="vmk-homebar"></div>
<div class="vmk-homebar light"></div>
<div class="vmk-overlay"><div class="vmk-cursor vmk-touch">${TOUCH}</div></div>
</div>
</div>
</div>
</div>
${scene.stage || ""}
</div></div>
<div class="vmk-hud" data-layout-allow-overlap>
<div class="vmk-title" data-layout-allow-overlap>${scene.step ? `<div class="vmk-step" data-layout-allow-overlap>${esc(scene.step)}</div>` : ""}<h2 data-layout-allow-overlap>${words}</h2><p data-layout-allow-overlap>${esc(scene.lead)}</p></div>
${caps}
</div>
</div>
</div>
<script>
(function(){
${readFileSync(new URL("kit.js", kit), "utf8")}
var S = VMKit({ id: ${JSON.stringify(scene.id)}, portrait: { zoom: 1.6, top: 470 }, geo: ${geo}, scope: ${JSON.stringify(g.scope)}, touch: true, baked: ${JSON.stringify(scene.live ? null : baked || null)}, speed: ${scene.speed || 1}, lineMax: ${scene.lineMax || 460}, hold: ${scene.hold == null ? 0.8 : scene.hold} });
var DATA = ${JSON.stringify(scene.data || null)};
${(scene.lib || []).map((f) => f.toString()).join("\n")}
(${scene.run.toString()})(S);
S.done();
window.__vmS = window.__vmS || {};
window.__vmS[${JSON.stringify(scene.id)}] = S;
var M = window.__timelines[${JSON.stringify(scene.id)}];
var DRIFT = ${scene.duration || 0};
if (DRIFT) M.fromTo(document.querySelector('[data-composition-id="${scene.id}"] .vmk'), { scale: 1 }, { scale: 1.03, duration: DRIFT, ease: "sine.inOut", immediateRender: false, transformOrigin: "50% 45%" }, 0);
M.progress(1, true).progress(0, true);
})();
</script>
</template></body></html>
`;
}

function customScene(scene) {
  return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><title>${scene.id}</title></head>
<body><template>
<link rel="stylesheet" href="vm-kit.css">
<style>
${FONTS}
#root{position:absolute;inset:0;overflow:hidden}
${scene.css}
</style>
<div id="root" data-composition-id="${scene.id}" data-width="${FW}" data-height="${FH}" data-duration="${scene.duration}">
${scene.html}
</div>
<script>
(function(){
var root = document.querySelector('[data-composition-id="${scene.id}"]');
var tl = gsap.timeline({ paused: true });
(${scene.run.toString()})(tl, root);
tl.progress(1, true).progress(0, true);
window.__timelines[${JSON.stringify(scene.id)}] = tl;
})();
</script>
</template></body></html>
`;
}

const files = readdirSync(new URL("build/scenes/", root)).filter((f) => f.endsWith(".mjs")).sort();
const only = process.argv.slice(2);
const scenes = [];
for (const f of files) scenes.push((await import(new URL(`build/scenes/${f}`, root))).default);

mkdirSync(new URL("compositions/", root), { recursive: true });
copyFileSync(new URL("kit.css", kit), new URL("vm-kit.css", root));

for (const scene of scenes) {
  write(`compositions/${scene.id}.html`, scene.device ? await deviceScene(scene) : customScene(scene));
}
const measured = await measure(scenes.map((s) => s.id));
for (const scene of scenes) {
  const m = measured[scene.id];
  if (!m) throw new Error(`no timeline for ${scene.id}`);
  scene.duration = Math.ceil((m.duration + (scene.tail == null ? 0.9 : scene.tail)) * 10) / 10;
  scene.baked = m.rects;
  process.stdout.write(`${scene.id} tl=${m.duration.toFixed(2)} dur=${scene.duration} ${JSON.stringify(m.notes)}\n`);
}

let at = 0;
const hosts = [];
const seams = [];
const frames = [];
for (const [i, scene] of scenes.entries()) {
  if (only.length === 0 || only.includes(scene.id)) {
    write(`compositions/${scene.id}.html`, scene.device ? await deviceScene(scene, scene.baked) : customScene(scene));
    process.stdout.write(`built ${scene.id} ${scene.duration}s\n`);
  }
  hosts.push(
    `      <div id="el-${scene.id}" class="clip" data-composition-id="${scene.id}" data-composition-src="compositions/${scene.id}.html" data-start="${+at.toFixed(3)}" data-duration="${scene.duration}" data-track-index="${i % 2}" data-width="${FW}" data-height="${FH}"></div>`
  );
  if (i > 0) {
    const prev = scenes[i - 1];
    const seam = scene.seam || { axis: "z", dir: 1, technique: "signature plus", sig: true };
    seams.push({
      id: `${prev.id}→${scene.id}`,
      cut: +at.toFixed(3),
      technique: seam.technique,
      ...(seam.type ? { type: seam.type } : {}),
      ...(seam.sig ? { sig: true } : {}),
      ...(seam.blur ? { blur: seam.blur } : {}),
      exit: { selector: `#el-${prev.id}`, axis: seam.axis, dir: seam.dir },
      entry: { selector: `#el-${scene.id}`, axis: seam.axis, dir: seam.dir },
    });
  }
  frames.push(`## Frame ${i + 1} — ${scene.frame.title}

- scene: ${scene.frame.scene}
- duration: ${scene.duration}s
- poster: ${scene.frame.poster}s
- transition_in: ${i === 0 ? "cut" : (scene.seam?.technique || "cut-the-curve LEFT")}
- status: animated
- src: compositions/${scene.id}.html
- motion: ${scene.frame.motion}
- start: ${+at.toFixed(3)}s

${scene.frame.body}
`);
  at += scene.duration;
}
const total = +at.toFixed(3);
const seamCode = (() => {
  const L = [];
  const r = (n) => +n.toFixed(3);
  L.push(`gsap.set(${JSON.stringify(scenes.slice(1).map((x) => `#el-${x.id}`))}, { opacity: 0 });`);
  for (const x of seams) {
    const ex = x.exit.selector;
    const en = x.entry.selector;
    const c = x.cut;
    L.push(`// SEAM ${x.id} : ${x.technique} @${c}`);
    if (x.sig) {
      L.push(`tl.fromTo("#sig-in", { "--m": "0px", opacity: 1 }, { "--m": "4400px", opacity: 1, duration: 0.42, ease: "power3.in", immediateRender: false }, ${r(c - 0.42)});`);
      L.push(`tl.to("${ex}", { scale: 1.06, duration: 0.42, ease: "power2.in", transformOrigin: "50% 45%" }, ${r(c - 0.42)});`);
      L.push(`tl.set("${ex}", { opacity: 0 }, ${c});`, `tl.set("#sig-in", { opacity: 0 }, ${c});`);
      L.push(`tl.fromTo("#sig-out", { "--m": "0px", opacity: 1 }, { "--m": "4400px", opacity: 1, duration: 0.6, ease: "power3.out", immediateRender: false }, ${c});`);
      L.push(`tl.set("#sig-out", { opacity: 0 }, ${r(c + 0.6)});`);
      L.push(`tl.fromTo("${en}", { opacity: 1, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out", immediateRender: false, transformOrigin: "50% 45%" }, ${c});`);
      continue;
    }
    if (x.type === "match") {
      L.push(`tl.set("${ex}", { opacity: 0 }, ${c});`, `tl.set("${en}", { opacity: 1 }, ${c});`);
      continue;
    }
    if (x.exit.axis === "z") {
      const out = x.exit.dir === -1 ? 0.93 : 1.08;
      const inn = x.exit.dir === -1 ? 1.06 : 0.94;
      L.push(`tl.to("${ex}", { scale: ${out}, filter: "blur(6px)", duration: 0.42, ease: "power2.in", transformOrigin: "50% 50%" }, ${r(c - 0.42)});`);
      L.push(`tl.set("${ex}", { opacity: 0 }, ${c});`);
      L.push(`tl.fromTo("${en}", { opacity: 1, scale: ${inn}, filter: "blur(6px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.75, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, ${c});`);
    } else {
      const prop = x.exit.axis === "x" ? "xPercent" : "yPercent";
      const d = x.exit.dir;
      L.push(`tl.to("${ex}", { ${prop}: ${10 * d}, duration: 0.42, ease: "power2.in" }, ${r(c - 0.42)});`);
      L.push(`tl.set("${ex}", { opacity: 0 }, ${c});`);
      L.push(`tl.fromTo("${en}", { opacity: 1, ${prop}: ${-8 * d} }, { opacity: 1, ${prop}: 0, duration: 0.75, ease: "power3.out", immediateRender: false }, ${c});`);
    }
  }
  return L.join("\n      ");
})();
const outroAt = seams[seams.length - 1].cut;

write(
  "index.html",
  `<!DOCTYPE html>
<html lang="pt-BR" data-resolution="portrait">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=${FW}, height=${FH}">
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <link rel="stylesheet" href="vm-kit.css">
    <link rel="stylesheet" href="vm-ui-phone.css">
    <style>
${FONTS}
      html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: #FAFAFE; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #FAFAFE; }
      #bg { position: absolute; inset: 0; background: #FAFAFE; }
      #bg-aura { position: absolute; left: -260px; top: 260px; width: 1500px; height: 1500px; border-radius: 50%; background: radial-gradient(circle, rgba(126,59,237,0.24) 0%, rgba(126,59,237,0.1) 38%, rgba(250,250,254,0) 68%); }
      #bg-grid { position: absolute; left: 0; top: 0; width: 1080px; height: 2400px; background-image: radial-gradient(rgba(87,25,182,0.16) 1.6px, transparent 1.6px); background-size: 48px 48px; }
      #root > .clip { position: absolute; inset: 0; }
      #sig-in, #sig-out { position: absolute; inset: 0; z-index: 60; pointer-events: none; opacity: 0; --m: 0px; background: #6A24DB; }
      #sig-in { -webkit-mask: url("assets/brand/plus-solid.svg") 50% 45% / var(--m) var(--m) no-repeat; mask: url("assets/brand/plus-solid.svg") 50% 45% / var(--m) var(--m) no-repeat; }
      #sig-out { -webkit-mask: url("assets/brand/plus-solid.svg") 50% 45% / var(--m) var(--m) no-repeat, linear-gradient(#000, #000); -webkit-mask-composite: xor; mask: url("assets/brand/plus-solid.svg") 50% 45% / var(--m) var(--m) no-repeat exclude, linear-gradient(#000, #000); }
      #brand { position: absolute; left: 56px; top: 64px; z-index: 40; padding: 13px 26px 13px 24px; border-radius: 999px; background: #fff; box-shadow: 0 14px 34px rgba(34,8,74,0.18), 0 2px 6px rgba(34,8,74,0.1); pointer-events: none; }
      #brand img { display: block; width: 172px; height: 46px; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="${FW}" data-height="${FH}">
      <div id="bg"><div id="bg-grid"></div><div id="bg-aura"></div></div>
${hosts.join("\n")}
      <div id="brand" data-layout-allow-overlap><img src="assets/brand/wordmark.png" alt="Viva Mais" data-layout-allow-overlap></div>
      <div id="sig-in" data-layout-allow-overlap></div><div id="sig-out" data-layout-allow-overlap></div>
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
      // <seams:auto>
      ${seamCode}
      // </seams:auto>
      tl.fromTo("#bg-aura", { x: -120, y: -200 }, { x: 260, y: 700, duration: ${total}, ease: "sine.inOut" }, 0);
      tl.fromTo("#bg-grid", { y: 0 }, { y: -240, duration: ${total}, ease: "none" }, 0);
      tl.fromTo("#brand", { opacity: 0, y: -28 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, ${+(seams[0].cut + 0.3).toFixed(3)});
      tl.to("#brand", { opacity: 0, y: -28, duration: 0.4, ease: "power3.in" }, ${+(outroAt - 0.55).toFixed(3)});
      tl.set({}, {}, ${total});
    </script>
  </body>
</html>
`
);
write("ledger.json", JSON.stringify({ fps: 30, seams }, null, 2) + "\n");
write(
  "STORYBOARD.md",
  `---
format: 1080x1920
duration: ${Math.round(total)}s
message: "Viva Mais passo a passo: do primeiro acesso à consulta marcada, sem dificuldade"
arc: Abertura → o que é → primeiro acesso → benefícios → início → marcar consulta → anamnese → histórico → dependentes → IA → IA agenda → fecho
audience: beneficiários PJ, muitos com 60+
mode: autonomous
---

${frames.join("\n")}`
);
process.stdout.write(`total ${total}s, ${scenes.length} scenes\n`);
