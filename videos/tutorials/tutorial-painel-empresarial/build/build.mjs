import { mkdirSync, readFileSync, readdirSync, writeFileSync, copyFileSync } from "node:fs";
import { buildState } from "./ui-css.mjs";
import { measure } from "./measure.mjs";

const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const write = (p, s) => writeFileSync(new URL(p, root), s);

const GEO = {
  laptop: { sx: 355, sy: 140, k: 0.84, uw: 1440, uh: 900, chrome: 44, left: 341, top: 126, scope: "vm-ui", css: "vm-ui-desktop.css" },
  tablet: { sx: 429, sy: 151, k: 0.9, uw: 1180, uh: 820, chrome: 44, left: 407, top: 129, scope: "vm-tab", css: "vm-ui-tablet.css" },
};

const TOUCH = `<i></i>`;
const CURSOR = `<svg viewBox="0 0 24 24" fill="none"><path d="M5 3.4v15.8l4.2-3.9 2.8 6.3 2.6-1.1-2.8-6.2h5.8z" fill="#1c1c1c" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
const LOCK = `<svg viewBox="0 0 24 24" fill="none" stroke="#726f80" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;

const FONTS = [
  ["DM Sans", 400, "DMSans-Regular"],
  ["DM Sans", 500, "DMSans-Medium"],
  ["DM Sans", 700, "DMSans-Bold"],
]
  .map(([f, w, file]) => `@font-face{font-family:"${f}";font-weight:${w};font-display:block;src:url("assets/brand/fonts/${file}.ttf") format("truetype")}`)
  .join("\n");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

const ICON = (name) => read(`node_modules/lucide-static/icons/${name}.svg`).replace(/<!--[\s\S]*?-->/g, "").replace(/\s*class="[^"]*"/, "").replace("<svg", '<svg class="h-5 w-5"').trim();
const DOCTORS = { MC: ["Mariana Costa", "d4.jpeg"], RL: ["Rafael Lima", "d0.png"], JA: ["Júlia Andrade", "d2.png"] };
const portraits = (html) =>
  html
    .replace(/style="opacity: 0(\.\d+)?; transform: translate[XY]\([^)]*\);?"/g, 'style=""')
    .replace(/ disabled="">(<div class="flex items-center justify-center gap-2">)<svg[\s\S]*?<\/svg><span>Acesso no horário agendado<\/span>/, (all, head) => `>${head}${ICON("video")}<span>Iniciar videochamada</span>${ICON("chevron-right")}`)
    .replace(/<div class="rounded-2xl border p-4 border-amber-200[^"]*">[\s\S]*?<\/p><\/div><\/div>/, "")
    .replace(/<div class="([^"]*\brounded-full\b[^"]*)">(MC|RL|JA)<\/div>/g, (all, cls, key) => `<div class="${cls}" style="overflow:hidden"><img alt="${DOCTORS[key][0]}" src="assets/doctors/${DOCTORS[key][1]}" style="display:block;width:100%;height:100%;object-fit:cover"></div>`)
    .replace(/(<img[^>]*alt="(Mariana Costa|Rafael Lima|Júlia Andrade)"[^>]*src=")[^"]*(")/g, (all, head, name, tail) => head + "assets/doctors/" + Object.values(DOCTORS).find((d) => d[0] === name)[1] + tail);

async function deviceScene(scene, baked) {
  const g = GEO[scene.device];
  const states = [];
  for (const [name, scroll] of scene.states) {
    const s = await buildState(name, { scope: g.scope });
    s.html = portraits(s.html);
    states.push(
      `<div class="vmk-state" data-state="${name}" data-scroll="${scroll || 0}"><div class="${g.scope}-body ${s.bodyClass}">${s.html}</div></div>`
    );
  }
  const urls = Object.entries(scene.urls)
    .map(([key, value], i) => `<span class="vmk-url-item${i === 0 ? " on" : ""}" data-url="${key}">${esc(value)}</span>`)
    .join("");
  const sw = Math.round(g.uw * g.k);
  const sh = Math.round((g.uh + g.chrome) * g.k);
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
  const geo = JSON.stringify({ sx: g.sx, sy: g.sy, k: g.k, uw: g.uw, uh: g.uh, chrome: g.chrome });
  const lights = scene.device === "laptop" ? `<div class="vmk-lights"><i></i><i></i><i></i></div>` : `<div class="vmk-chrome-pad"></div>`;
  return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><title>${scene.id}</title></head>
<body><template>
<link rel="stylesheet" href="vm-kit.css">
<link rel="stylesheet" href="${g.css}">
<link rel="stylesheet" href="vm-ui-polish.css">
<style>
${FONTS}
#root{position:absolute;inset:0;overflow:hidden}
${scene.css || ""}
</style>
<div id="root" data-composition-id="${scene.id}" data-width="1920" data-height="1080" data-duration="${scene.duration}">
<div class="vmk">
<div class="vmk-cam-outer"><div class="vmk-cam-inner">
<div class="vmk-device vmk-${scene.device}" style="left:${g.left}px;top:${g.top}px">
<div class="vmk-lid"><i class="vmk-cam"></i>
<div class="vmk-screen" style="width:${sw}px;height:${sh}px">
<div class="vmk-screen-inner" style="width:${g.uw}px;height:${g.uh + g.chrome}px;transform:scale(${g.k})">
<div class="vmk-chrome">${lights}<div class="vmk-url">${LOCK}${urls}</div><div class="vmk-chrome-pad"></div><i class="vmk-progress"></i></div>
<div class="${g.scope}" style="position:absolute;left:0;top:${g.chrome}px">
${states.join("\n")}
</div>
<div class="vmk-overlay"><div class="vmk-cursor${scene.device === "tablet" ? " vmk-touch" : ""}">${scene.device === "tablet" ? TOUCH : CURSOR}</div></div>
</div>
</div>
</div>
${scene.device === "laptop" ? `<div class="vmk-base"></div>` : ""}
</div>
</div></div>
<div class="vmk-hud" data-layout-allow-overlap>
<div class="vmk-title" data-layout-allow-overlap><h2 data-layout-allow-overlap>${words}</h2><p data-layout-allow-overlap>${esc(scene.lead)}</p></div>
${caps}
</div>
</div>
</div>
<script>
(function(){
${read("build/kit.js")}
var S = VMKit({ id: ${JSON.stringify(scene.id)}, geo: ${geo}, scope: ${JSON.stringify(g.scope)}, touch: ${scene.device === "tablet"}, baked: ${JSON.stringify(baked || null)}, speed: ${scene.speed || 1.18}, hold: ${scene.hold == null ? 0.5 : scene.hold} });
(${scene.run.toString()})(S);
S.done();
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
<div id="root" data-composition-id="${scene.id}" data-width="1920" data-height="1080" data-duration="${scene.duration}">
${scene.html}
</div>
<script>
(function(){
var root = document.querySelector('[data-composition-id="${scene.id}"]');
var tl = gsap.timeline({ paused: true });
(${scene.run.toString()})(tl, root);
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
copyFileSync(new URL("build/kit.css", root), new URL("vm-kit.css", root));
copyFileSync(new URL("build/polish.css", root), new URL("vm-ui-polish.css", root));

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
    `      <div id="el-${scene.id}" class="clip" data-composition-id="${scene.id}" data-composition-src="compositions/${scene.id}.html" data-start="${+at.toFixed(3)}" data-duration="${scene.duration}" data-track-index="${i % 2}" data-width="1920" data-height="1080"></div>`
  );
  if (i > 0) {
    const prev = scenes[i - 1];
    const seam = scene.seam || { axis: "x", dir: -1, technique: "cut-the-curve LEFT" };
    seams.push({
      id: `${prev.id}→${scene.id}`,
      cut: +at.toFixed(3),
      technique: seam.technique,
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
const outroAt = seams[seams.length - 1].cut;

write(
  "index.html",
  `<!DOCTYPE html>
<html lang="pt-BR" data-resolution="landscape">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1920, height=1080">
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <link rel="stylesheet" href="vm-kit.css">
    <link rel="stylesheet" href="vm-ui-desktop.css">
    <link rel="stylesheet" href="vm-ui-tablet.css">
    <link rel="stylesheet" href="vm-ui-polish.css">
    <style>
${FONTS}
      html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: #FAFAFE; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #FAFAFE; }
      #bg { position: absolute; inset: 0; background: #FAFAFE; }
      #bg-aura { position: absolute; left: 760px; top: -220px; width: 1500px; height: 1500px; border-radius: 50%; background: radial-gradient(circle, rgba(126,59,237,0.24) 0%, rgba(126,59,237,0.1) 38%, rgba(250,250,254,0) 68%); }
      #bg-grid { position: absolute; inset: 0; background-image: radial-gradient(rgba(87,25,182,0.16) 1.6px, transparent 1.6px); background-size: 48px 48px; }
      #root > .clip { position: absolute; inset: 0; }
      #seam-wipe { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 50; }
      #seam-panel { position: absolute; left: 0; top: -210px; width: 2500px; height: 1500px; background: #6A24DB; border-right: 16px solid #C6FF34; }
      #seam-mark { position: absolute; left: 1110px; top: 610px; width: 280px; height: 280px; }
      #seam-rise { position: absolute; left: -200px; top: 0; width: 2320px; height: 1500px; background: #22084A; border-top: 16px solid #C6FF34; }
      #seam-rise img { position: absolute; left: 1020px; top: 600px; width: 280px; height: 280px; }
      #brand { position: absolute; left: 56px; top: 40px; z-index: 40; padding: 13px 26px 13px 24px; border-radius: 999px; background: #fff; box-shadow: 0 14px 34px rgba(34,8,74,0.18), 0 2px 6px rgba(34,8,74,0.1); pointer-events: none; }
      #brand img { display: block; width: 172px; height: 46px; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="1920" data-height="1080">
      <div id="bg"><div id="bg-grid"></div><div id="bg-aura"></div></div>
${hosts.join("\n")}
      <div id="brand" data-layout-allow-overlap><img src="assets/brand/wordmark.png" alt="Viva Mais" data-layout-allow-overlap></div>
      <div id="seam-wipe"><div id="seam-panel"><img id="seam-mark" src="assets/brand/mark-white.svg" alt=""></div><div id="seam-rise"><img src="assets/brand/mark-white.svg" alt=""></div></div>
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
      // <seams:auto>
      // </seams:auto>
      tl.fromTo("#brand", { opacity: 0, y: -28 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.35);
      tl.to("#brand", { opacity: 0, y: -28, duration: 0.4, ease: "power3.in" }, ${+(outroAt - 0.55).toFixed(3)});
      gsap.set("#seam-panel", { x: 2300, skewX: -12 });
      gsap.set("#seam-mark", { skewX: 12 });
      gsap.set("#seam-rise", { y: 1200, skewY: -5 });
      gsap.set("#seam-rise img", { skewY: 5 });
      ${seams.filter((x) => x.exit.axis === "y").map((x) => `tl.fromTo("#seam-rise", { y: 1200 }, { y: -1800, duration: 0.95, ease: "power1.inOut", immediateRender: false }, ${+(x.cut - 0.475).toFixed(3)});`).join("\n      ")}
      ${seams.filter((x) => x.exit.axis === "x").map((x) => `tl.fromTo("#seam-panel", { x: 2300 }, { x: -2900, duration: 0.95, ease: "power1.inOut", immediateRender: false }, ${+(x.cut - 0.475).toFixed(3)});`).join("\n      ")}

    </script>
  </body>
</html>
`
);
write("ledger.json", JSON.stringify({ fps: 30, seams }, null, 2) + "\n");
write(
  "STORYBOARD.md",
  `---
format: 1920x1080
duration: ${Math.round(total)}s
message: "Do cadastro da empresa à consulta da sua equipe: tudo no Painel Empresarial Viva Mais"
arc: Abertura → cadastro e plano → painel → vidas → planilha → primeiro acesso → grupos → créditos → fatura → agendamento → consulta → relatório → fecho
audience: RH e gestores de empresas no plano empresarial Viva Mais
mode: autonomous
---

${frames.join("\n")}`
);
process.stdout.write(`total ${total}s, ${scenes.length} scenes\n`);
