import { mkdirSync, readFileSync, readdirSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { buildState } from "./ui-css.mjs";
import { buildWebState } from "./ui-web.mjs";
import { measure } from "../../../kit/measure.mjs";
import { PACE } from "./parts/stock.mjs";
import { screen as libScreen } from "./parts/screen.mjs";

const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const write = (p, s) => writeFileSync(new URL(p, root), s);

const NARRATION = false;
const pace = (scene) => scene.pace || PACE;
const FW = 1080;
const FH = 1920;
const BEAT = 0.375;
const BAR = 1.5;
const K = 1.5;
const LK = 0.7;
const GEO = {
  iphone: { sx: Math.round(FW / 2 - (402 * K) / 2), sy: Math.round(1000 - (874 * K) / 2), k: K, uw: 402, uh: 874, chrome: 0, scope: "vm-ph", css: ["vm-ui-phone.css"] },
  laptop: { sx: 36, sy: 640, k: LK, uw: 1440, uh: 900, chrome: 44, left: 22, top: 626, scope: "vm-ui", css: ["vm-ui-desktop.css", "vm-ui-polish.css"] },
};
GEO.iphone.left = GEO.iphone.sx - 13;
GEO.iphone.top = GEO.iphone.sy - 13;

const STATUS = `<span>9:41</span><span class="ic"><svg width="19" height="12" viewBox="0 0 19 12" fill="currentColor"><rect x="0" y="8" width="3.2" height="4" rx="1"/><rect x="5" y="5.5" width="3.2" height="6.5" rx="1"/><rect x="10" y="3" width="3.2" height="9" rx="1"/><rect x="15" y="0" width="3.2" height="12" rx="1"/></svg><svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><path d="M8.5 2.3c2.4 0 4.6.9 6.3 2.5l1.2-1.2A10.6 10.6 0 0 0 8.5.6 10.6 10.6 0 0 0 1 3.6l1.2 1.2a9 9 0 0 1 6.3-2.5z"/><path d="M8.5 5.6c1.5 0 2.9.6 4 1.6l1.2-1.2a7.3 7.3 0 0 0-10.4 0l1.2 1.2c1.1-1 2.5-1.6 4-1.6z"/><path d="M8.5 8.9c.6 0 1.2.2 1.6.6L8.5 11.2 6.9 9.5c.4-.4 1-.6 1.6-.6z"/></svg><svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x=".5" y=".5" width="23" height="12" rx="3.8" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2.5" fill="currentColor"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity=".45"/></svg></span>`;
const TOUCH = `<i></i>`;
const CURSOR = `<svg viewBox="0 0 24 24" fill="none"><path d="M5 3.4v15.8l4.2-3.9 2.8 6.3 2.6-1.1-2.8-6.2h5.8z" fill="#1c1c1c" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
const LOCK = `<svg viewBox="0 0 24 24" fill="none" stroke="#726f80" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;

const FONTS = [
  ["DM Sans", 400, "DMSans-Regular.ttf"],
  ["DM Sans", 500, "DMSans-Medium.ttf"],
  ["DM Sans", 700, "DMSans-Bold.ttf"],
  ["DMSans_400Regular", 400, "DMSans-Regular.ttf"],
  ["DMSans_500Medium", 400, "DMSans-Medium.ttf"],
  ["DMSans_700Bold", 400, "DMSans-Bold.ttf"],
  ["Space Grotesk", 700, "SpaceGrotesk-Bold.ttf"],
  ["Space Grotesk", 500, "SpaceGrotesk-Medium.ttf"],
  ["SpaceGrotesk_700Bold", 400, "SpaceGrotesk-Bold.ttf"],
  ["SpaceGrotesk_500Medium", 400, "SpaceGrotesk-Medium.ttf"],
]
  .map(([f, w, file]) => `@font-face{font-family:"${f}";font-weight:${w};font-display:block;src:url("assets/brand/fonts/${file}")}`)
  .join("\n");

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const FREE = "data-layout-allow-overlap";

const lines = JSON.parse(read(".media/audio/voice/lines.json"));
const VOICE = {};
for (const l of lines) {
  const d = JSON.parse(read(`.media/audio/voice/${l.id}.json`));
  const r = d.data || d;
  const words = r.word_timestamps.filter((x) => !/^<.*>$/.test(x.word)).map((x) => [+x.start.toFixed(3), +x.end.toFixed(3), x.word]);
  const dur = +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", new URL(`.media/audio/voice/${l.id}.mp3`, root).pathname]).toString().trim();
  VOICE[l.id] = { id: l.id, text: l.text, dur: +dur.toFixed(3), words };
}
const voData = (scene) => (scene.vo ? { at: scene.voAt || 0, dur: VOICE[scene.vo].dur, words: VOICE[scene.vo].words } : null);

function adMarkup(list) {
  return (list || [])
    .map((a) => {
      const words = (a.text || "")
        .split(/\s+/)
        .map((w) => {
          const v = /^\*\*(.+)\*\*$/.test(w);
          const t = v ? w.slice(2, -2) : w;
          return `<span class="am" ${FREE}><span class="aw${v ? " v" : ""}" ${FREE}>${esc(t)}</span></span>`;
        })
        .join(" ");
      const tail = a.sweep ? `<u ${FREE}></u>` : "";
      return `<div class="ad ${a.cls || ""}" data-ad="${a.key}" style="${a.style || ""}" ${FREE}>${a.html || words}${tail}</div>`;
    })
    .join("\n");
}

const VO_HELPER = `function VOW(VO){var norm=function(s){return s.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").replace(/[^a-z0-9]/g,"")};return function(n){if(!VO)return 0;var L=VO.words;if(typeof n==="number")return VO.at+L[Math.min(n,L.length-1)][0];var nth=0,m=String(n).match(/#(\\d+)$/),want=norm(String(n).replace(/#\\d+$/,""));if(m)nth=+m[1];for(var i=0;i<L.length;i++){if(norm(L[i][2])===want){if(nth===0)return VO.at+L[i][0];nth--}}throw new Error("vo word "+n)}}`;

async function deviceScene(scene, baked) {
  const g = GEO[scene.device];
  const phone = scene.device === "iphone";
  const states = [];
  for (const [name, scroll, lib] of scene.states) {
    if (lib) {
      states.push(`<div class="vmk-state" data-state="${name}" data-scroll="${scroll || 0}">${libScreen(lib)}</div>`);
    } else if (phone) {
      const st = await buildState(name, `${scene.id}-${name}`);
      states.push(`<div class="vmk-state" data-state="${name}" data-scroll="${scroll || 0}"><div class="${g.scope}-body">${st.html}</div></div>`);
    } else {
      const st = buildWebState(name);
      states.push(`<div class="vmk-state" data-state="${name}" data-scroll="${scroll || 0}"><div class="${g.scope}-body ${st.bodyClass}">${st.html}</div></div>`);
    }
  }
  const layers = Object.entries(scene.layers || {})
    .map(([name, html]) => `<div class="vmk-layer" data-vmk-layer="${name}">${html}</div>`)
    .join("\n");
  const sw = +(g.uw * g.k).toFixed(2);
  const sh = +((g.uh + g.chrome) * g.k).toFixed(2);
  const caps = (scene.captions || [])
    .map(
      (c) =>
        `<div class="vmk-bub" ${FREE}><h3 ${FREE}>${c.title
          .split(" ")
          .map((w) => `<span ${FREE}>${esc(w)}</span>`)
          .join(" ")}</h3><p ${FREE}>${esc(c.body).replace(/\*\*(.+?)\*\*/g, `<b ${FREE}>$1</b>`)}</p></div>`
    )
    .join("");
  const geo = JSON.stringify({ sx: g.sx, sy: g.sy, k: g.k, uw: g.uw, uh: g.uh, chrome: g.chrome });
  const urls = Object.entries(scene.urls || {})
    .map(([key, value], i) => `<span class="vmk-url-item${i === 0 ? " on" : ""}" data-url="${key}">${esc(value)}</span>`)
    .join("");
  const screen = phone
    ? `<div class="vmk-screen-inner" style="width:${g.uw}px;height:${g.uh}px;transform:scale(${g.k})">
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
</div>`
    : `<div class="vmk-screen-inner" style="width:${g.uw}px;height:${g.uh + g.chrome}px;transform:scale(${g.k})">
<div class="vmk-chrome"><div class="vmk-lights"><i></i><i></i><i></i></div><div class="vmk-url">${LOCK}${urls}</div><div class="vmk-chrome-pad"></div><i class="vmk-progress"></i></div>
<div class="${g.scope}" style="position:absolute;left:0;top:${g.chrome}px">
${states.join("\n")}
${layers}
</div>
<div class="vmk-overlay"><div class="vmk-cursor">${CURSOR}</div></div>
</div>`;
  return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><title>${scene.id}</title></head>
<body><template>
<link rel="stylesheet" href="vm-kit.css">
${g.css.map((c) => `<link rel="stylesheet" href="${c}">`).join("\n")}
${screen.includes("<!-- screen:") ? '<link rel="stylesheet" href="assets/screens/screens.css">' : ""}
<link rel="stylesheet" href="vm-ad.css">
<style>
${FONTS}
#root{position:absolute;inset:0;overflow:hidden}
${scene.css || ""}
</style>
<div id="root" data-composition-id="${scene.id}" data-width="${FW}" data-height="${FH}" data-duration="${scene.duration}">
<div class="vmk">
${scene.back || ""}
<div class="vmk-cam-outer"><div class="vmk-cam-inner">
<div class="vmk-device vmk-${scene.device}" style="left:${g.left}px;top:${g.top}px">
<div class="vmk-lid">${phone ? "" : '<i class="vmk-cam"></i>'}
<div class="vmk-screen" style="width:${sw}px;height:${sh}px">
${screen}
</div>
</div>
${phone ? "" : '<div class="vmk-base"></div>'}
</div>
${scene.stage || ""}
</div></div>
<div class="vmk-hud" ${FREE}>
<div class="vmk-title" ${FREE}><h2 ${FREE}></h2><p ${FREE}></p></div>
${caps}
${adMarkup(scene.ad)}
${scene.hud || ""}
</div>
</div>
</div>
<script>
(function(){
${read("build/kit.js")}
${read("build/ad.js")}
var S = VMKit({ id: ${JSON.stringify(scene.id)}, geo: ${geo}, scope: ${JSON.stringify(g.scope)}, touch: ${phone}, baked: ${JSON.stringify(baked || null)}, speed: ${pace(scene)}, lineMax: ${scene.lineMax || 460}, hold: ${scene.hold == null ? 0 : scene.hold} });
var VO = ${JSON.stringify(voData(scene))};
var A = AD(S, VO);
var DATA = ${JSON.stringify(scene.data || null)};
${(scene.lib || []).map((f) => f.toString()).join("\n")}
(${scene.run.toString()})(S, A);
S.done();
var DRIFT = ${scene.duration || 0};
if (DRIFT && !${!!scene.noDrift}) window.__timelines[${JSON.stringify(scene.id)}].fromTo(document.querySelector('[data-composition-id="${scene.id}"] .vmk'), { scale: 1 }, { scale: 1.035, duration: DRIFT, ease: "sine.inOut", immediateRender: false, transformOrigin: "50% 45%" }, 0);
window.__timelines[${JSON.stringify(scene.id)}].progress(1, true).progress(0, true);
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
<link rel="stylesheet" href="vm-ad.css">
${(scene.links || []).map((c) => `<link rel="stylesheet" href="${c}">`).join("\n")}
<style>
${FONTS}
#root{position:absolute;inset:0;overflow:hidden}
${scene.css || ""}
</style>
<div id="root" data-composition-id="${scene.id}" data-width="${FW}" data-height="${FH}" data-duration="${scene.duration}">
${scene.html}
${adMarkup(scene.ad)}
</div>
<script>
(function(){
var root = document.querySelector('[data-composition-id="${scene.id}"]');
var master = gsap.timeline({ paused: true });
var tl = gsap.timeline();
var VO = ${JSON.stringify(voData(scene))};
${VO_HELPER}
var w = VOW(VO);
${(scene.lib || []).map((f) => f.toString()).join("\n")}
(${scene.run.toString()})(tl, root, w, VO);
var DRIFT = ${scene.duration || 0};
tl.timeScale(${pace(scene)});
master.add(tl, 0);
if (DRIFT && !${!!scene.noDrift} && root.firstElementChild) master.fromTo(root.firstElementChild, { scale: 1 }, { scale: 1.035, duration: DRIFT, ease: "sine.inOut", immediateRender: false, transformOrigin: "50% 45%" }, 0);
master.progress(1, true).progress(0, true);
window.__timelines[${JSON.stringify(scene.id)}] = master;
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
copyFileSync(new URL("build/ad.css", root), new URL("vm-ad.css", root));

const html = async (scene, baked) => (scene.device ? deviceScene(scene, baked) : customScene(scene));
const cachePath = new URL("build/.tmp/measure-cache.json", root);
const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, "utf8")) : {};
const todo = only.length ? scenes.filter((s) => only.includes(s.id) || !cache[s.id]) : scenes;
for (const scene of todo) write(`compositions/${scene.id}.html`, await html(scene));
const measured = todo.length ? await measure(todo.map((s) => s.id)) : {};
for (const scene of scenes) {
  const m = measured[scene.id] || cache[scene.id];
  if (!m) throw new Error(`no timeline for ${scene.id}`);
  cache[scene.id] = m;
  const vo = scene.vo ? ((scene.voAt || 0) + VOICE[scene.vo].dur) / pace(scene) : 0;
  const tail = (scene.tail == null ? 0.5 : scene.tail) / pace(scene);
  scene.natural = scene.fixed || Math.max(m.duration, vo) + tail;
  scene.baked = m.rects;
  if (measured[scene.id]) process.stdout.write(`${scene.id} tl=${m.duration.toFixed(2)} vo=${vo.toFixed(2)} dur=${scene.duration} ${JSON.stringify(m.notes)}\n`);
}
writeFileSync(cachePath, JSON.stringify(cache));

{
  let t = 0;
  for (const scene of scenes) {
    const g = BEAT * 2;
    const end = Math.ceil((t + scene.natural - 0.06) / g) * g;
    scene.duration = +(end - t).toFixed(3);
    t = end;
  }
  for (let i = 0; i < scenes.length - 1; i++) {
    if (scenes[i + 1].snap !== "bar") continue;
    const start = scenes.slice(0, i + 1).reduce((a, x) => a + x.duration, 0);
    const pad = +(Math.ceil((start - 0.001) / BAR) * BAR - start).toFixed(3);
    scenes[i].duration = +(scenes[i].duration + pad).toFixed(3);
  }
}

let at = 0;
const hosts = [];
const seams = [];
const frames = [];
const audio = [];
const starts = {};
for (const [i, scene] of scenes.entries()) {
  if (todo.includes(scene)) write(`compositions/${scene.id}.html`, await html(scene, scene.baked));
  starts[scene.id] = +at.toFixed(3);
  hosts.push(
    `      <div id="el-${scene.id}" class="clip" data-composition-id="${scene.id}" data-composition-src="compositions/${scene.id}.html" data-start="${+at.toFixed(3)}" data-duration="${scene.duration}" data-track-index="${i % 2}" data-width="${FW}" data-height="${FH}"></div>`
  );
  if (NARRATION && scene.vo) audio.push({ id: `vo-${scene.vo}`, src: `.media/audio/voice/${scene.vo}.mp3`, start: +(at + (scene.voAt || 0)).toFixed(3), dur: VOICE[scene.vo].dur, track: 20, volume: 1 });
  if (i > 0) {
    const prev = scenes[i - 1];
    const seam = scene.seam || { axis: "x", dir: -1, technique: "cut-the-curve LEFT" };
    seams.push({
      id: `${prev.id}→${scene.id}`,
      cut: +at.toFixed(3),
      technique: seam.technique,
      ...(seam.type ? { type: seam.type } : {}),
      ...(seam.sig ? { sig: seam.sig === true ? "50% 45%" : seam.sig } : {}),
      blur: seam.blur || 8,
      exit: { selector: `#el-${prev.id}`, axis: seam.axis, dir: seam.dir, dur: 0.6 },
      entry: { selector: `#el-${scene.id}`, axis: seam.axis, dir: seam.dir, dur: 1.1, travel: 6 },
      wipe: !!seam.wipe,
    });
  }
  frames.push(`## Frame ${i + 1} — ${scene.frame.title}

- scene: ${scene.frame.scene}
- duration: ${scene.duration}s
- transition_in: ${i === 0 ? "cut" : scene.seam?.technique || "cut-the-curve LEFT"}
- status: animated
- src: compositions/${scene.id}.html
- motion: ${scene.frame.motion}
- voiceover: ${scene.vo ? `"${VOICE[scene.vo].text}"` : "—"}
- start: ${+at.toFixed(3)}s

${scene.frame.body}
`);
  at += scene.duration;
}
const total = +at.toFixed(3);

const sfxList = [];
for (const scene of scenes) for (const s of scene.sfx || []) sfxList.push({ ...s, at: +(starts[scene.id] + s.at / pace(scene)).toFixed(3) });
sfxList.forEach((s, i) => {
  const file = `.media/audio/sfx/${s.name}.mp3`;
  if (!existsSync(new URL(file, root))) {
    process.stderr.write(`sfx missing ${s.name}\n`);
    return;
  }
  const dur = +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", new URL(file, root).pathname]).toString().trim();
  audio.push({ id: `sfx-${i}-${s.name}`, src: file, start: s.at, dur: +Math.min(dur, s.max || dur).toFixed(3), track: 30 + (i % 4), volume: s.vol == null ? 0.6 : s.vol });
});

const music = JSON.parse(read("build/music.json"));
const voWin = audio.filter((a) => a.id.startsWith("vo-")).map((a) => [a.start, a.start + a.dur]);
const at0 = (key) => {
  const [id, off] = key.split("+");
  if (id === "end") return total + (+off || 0);
  if (!(id in starts)) {
    process.stderr.write(`music anchor ${id} missing, using end\n`);
    return total;
  }
  return starts[id] + (+off || 0);
};
music.segments.forEach((m, i) => {
  const start = +at0(m.from).toFixed(3);
  const stop = +at0(m.to).toFixed(3);
  if (m.drop) m.mediaStart = +(m.drop.track - (at0(m.drop.at) - start)).toFixed(3);
  if (m.mediaStart < 0) throw new Error(`music segment ${i} starts before track 0 (${m.mediaStart})`);
  process.stdout.write(`bgm-${i} ${start}→${stop} mediaStart=${m.mediaStart}\n`);
  const dur = +(stop - start).toFixed(3);
  const pts = [];
  const hi = m.level;
  const lo = m.duck;
  const fin = m.fadeIn || 0.05;
  const fout = m.fadeOut || 0.3;
  pts.push({ t: 0, v: 0 }, { t: fin, v: hi });
  for (const [a, b] of voWin) {
    const s = a - start;
    const e = b - start;
    if (e <= fin || s >= dur - fout) continue;
    pts.push({ t: Math.max(fin, s - 0.25), v: hi }, { t: Math.max(fin, s), v: lo }, { t: Math.min(dur - fout, e), v: lo }, { t: Math.min(dur - fout, e + 0.35), v: hi });
  }
  pts.push({ t: dur - fout, v: hi }, { t: dur, v: 0 });
  const clean = pts
    .map((p) => ({ t: +p.t.toFixed(3), v: +p.v.toFixed(3) }))
    .sort((a, b) => a.t - b.t)
    .filter((p, j, arr) => j === 0 || p.t > arr[j - 1].t);
  audio.push({ id: `bgm-${i}`, src: m.src, start, dur, track: 10 + i, volume: 1, mediaStart: m.mediaStart || 0, auto: { version: 1, lanes: [{ target: "volume", points: clean }] } });
});

const audioTags = audio
  .map(
    (a) =>
      `      <audio id="${a.id}" src="${a.src}" data-start="${a.start}" data-duration="${a.dur}" data-track-index="${a.track}"${a.mediaStart ? ` data-media-start="${a.mediaStart}"` : ""}${a.volume !== 1 ? ` data-volume="${a.volume}"` : ""}${a.auto ? ` data-automation='${JSON.stringify(a.auto)}'` : ""}></audio>`
  )
  .join("\n");

const brandOn = at0(music.brand.on) + (music.brand.onAt || 0);
const brandOff = Math.min(at0(music.brand.off) + (music.brand.offAt || 0), total - 0.4);

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
      L.push(`tl.fromTo("#sig-in", { "--m": "0px", opacity: 1 }, { "--m": "4400px", opacity: 1, duration: 0.6, ease: "power2.in", immediateRender: false }, ${r(c - 0.6)});`);
      L.push(`tl.to("${ex}", { scale: 1.06, duration: 0.6, ease: "power2.in", transformOrigin: "${x.sig}" }, ${r(c - 0.6)});`);
      L.push(`tl.set("${ex}", { opacity: 0 }, ${c});`, `tl.set("#sig-in", { opacity: 0 }, ${c});`);
      L.push(`tl.fromTo("#sig-out", { "--m": "0px", opacity: 1 }, { "--m": "4400px", opacity: 1, duration: 0.9, ease: "power2.out", immediateRender: false }, ${c});`);
      L.push(`tl.set("#sig-out", { opacity: 0 }, ${r(c + 0.9)});`);
      L.push(`tl.fromTo("${en}", { opacity: 1, scale: 0.94 }, { opacity: 1, scale: 1, duration: 1.1, ease: "power3.out", immediateRender: false, transformOrigin: "50% 45%" }, ${c});`);
      continue;
    }
    if (x.type === "match") {
      L.push(`tl.set("${ex}", { opacity: 0 }, ${c});`, `tl.set("${en}", { opacity: 1 }, ${c});`);
      continue;
    }
    if (x.exit.axis === "z") {
      const out = x.exit.dir === -1 ? 0.93 : 1.08;
      const inn = x.exit.dir === -1 ? 1.06 : 0.94;
      L.push(`tl.to("${ex}", { scale: ${out}, filter: "blur(4px)", duration: 0.6, ease: "power2.in", transformOrigin: "50% 50%" }, ${r(c - 0.6)});`);
      L.push(`tl.set("${ex}", { opacity: 0 }, ${c});`);
      L.push(`tl.fromTo("${en}", { opacity: 1, scale: ${inn}, filter: "blur(4px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.1, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, ${c});`);
    } else {
      const prop = x.exit.axis === "x" ? "xPercent" : "yPercent";
      const d = x.exit.dir;
      L.push(`tl.to("${ex}", { ${prop}: ${10 * d}, duration: 0.6, ease: "power2.in" }, ${r(c - 0.6)});`);
      L.push(`tl.set("${ex}", { opacity: 0 }, ${c});`);
      L.push(`tl.fromTo("${en}", { opacity: 1, ${prop}: ${-8 * d} }, { opacity: 1, ${prop}: 0, duration: 1.1, ease: "power3.out", immediateRender: false }, ${c});`);
    }
  }
  return L.join("\n      ");
})();

const capOff = [];
for (const scene of scenes) for (const [a, b] of scene.capsOff || []) capOff.push([starts[scene.id] + a, starts[scene.id] + b]);
const chunks = [];
for (const scene of scenes) {
  if (!scene.vo) continue;
  const base = starts[scene.id] + (scene.voAt || 0);
  const ws = VOICE[scene.vo].words.map(([a, b, t]) => ({ a: +(base + a).toFixed(3), b: +(base + b).toFixed(3), t, hot: (scene.hot || []).some((h) => norm(h) === norm(t)) }));
  let cur = [];
  const flush = () => {
    if (cur.length) chunks.push(cur);
    cur = [];
  };
  for (const w of ws) {
    const len = cur.map((x) => x.t).join(" ").length + w.t.length;
    if (cur.length && (cur.length >= 4 || len > 24 || w.a - cur[cur.length - 1].b > 0.45)) flush();
    cur.push(w);
    if (/[.,?!:;]$/.test(w.t)) flush();
  }
  flush();
}
const shown = !NARRATION ? [] : chunks.filter((c) => !capOff.some(([a, b]) => c[0].a >= a - 0.01 && c[0].a < b));
const capHtml = shown
  .map((c, i) => `<div class="cap" id="cap-${i}" ${FREE}><span class="cl" ${FREE}>${c.map((w) => `<span class="cw${w.hot ? " hot" : ""}" ${FREE}>${esc(w.t)}</span>`).join(" ")}</span></div>`)
  .join("\n        ");
const capTw = shown
  .map((c, i) => {
    const next = shown[i + 1];
    const a = Math.max(0, c[0].a - 0.06);
    const end = next && next[0].a - c[c.length - 1].b < 0.6 ? next[0].a - 0.06 : c[c.length - 1].b + 0.35;
    const gap = !shown[i - 1] || c[0].a - shown[i - 1][shown[i - 1].length - 1].b > 0.6;
    const lines = [gap ? `tl.fromTo("#cap-${i}", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out", immediateRender: false }, ${+a.toFixed(3)});` : `tl.set("#cap-${i}", { autoAlpha: 1 }, ${+a.toFixed(3)});`];
    c.forEach((w, k) => lines.push(`tl.fromTo("#cap-${i} .cw:nth-child(${k + 1})", { color: "rgba(255,255,255,0.5)" }, { color: "${w.hot ? "#C6FF34" : "#FFFFFF"}", duration: 0.15, ease: "none", immediateRender: false }, ${+Math.max(a, w.a - 0.04).toFixed(3)});`));
    const last = !next || next[0].a - c[c.length - 1].b >= 0.6;
    lines.push(last ? `tl.to("#cap-${i}", { autoAlpha: 0, duration: 0.2, ease: "power2.in" }, ${+(end - 0.2).toFixed(3)});` : `tl.set("#cap-${i}", { autoAlpha: 0 }, ${+end.toFixed(3)});`);
    return lines.join("\n      ");
  })
  .join("\n      ");

write(
  "index.html",
  `<!DOCTYPE html>
<html lang="pt-BR" data-resolution="portrait">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=${FW}, height=${FH}">
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <link rel="stylesheet" href="vm-kit.css">
    <link rel="stylesheet" href="vm-ad.css">
    <link rel="stylesheet" href="vm-ui-phone.css">
    <link rel="stylesheet" href="vm-ui-desktop.css">
    <link rel="stylesheet" href="vm-ui-polish.css">
    <style>
${FONTS}
      html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: #FAFAFE; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #FAFAFE; }
      #bg { position: absolute; inset: 0; background: #FAFAFE; }
      #bg-aura { position: absolute; left: -260px; top: 260px; width: 1600px; height: 1600px; border-radius: 50%; background: radial-gradient(circle, rgba(126,59,237,0.2) 0%, rgba(126,59,237,0.08) 38%, rgba(250,250,254,0) 68%); }
      #bg-grid { position: absolute; left: 0; top: 0; width: 1080px; height: 2400px; background-image: radial-gradient(rgba(87,25,182,0.14) 1.6px, transparent 1.6px); background-size: 48px 48px; }
      #root > .clip { position: absolute; inset: 0; }
      #sig-in, #sig-out { position: absolute; inset: 0; z-index: 60; pointer-events: none; opacity: 0; --m: 0px; background: #6A24DB; }
      #sig-in { -webkit-mask: url("assets/brand/plus-solid.svg") 50% 45% / var(--m) var(--m) no-repeat; mask: url("assets/brand/plus-solid.svg") 50% 45% / var(--m) var(--m) no-repeat; }
      #sig-out { -webkit-mask: url("assets/brand/plus-solid.svg") 50% 45% / var(--m) var(--m) no-repeat, linear-gradient(#000, #000); -webkit-mask-composite: xor; mask: url("assets/brand/plus-solid.svg") 50% 45% / var(--m) var(--m) no-repeat exclude, linear-gradient(#000, #000); }
      #seam-wipe { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 50; }
      #seam-panel { position: absolute; left: 0; top: -300px; width: 1700px; height: 2520px; background: #6A24DB; border-right: 16px solid #C6FF34; }
      #seam-mark { position: absolute; left: 400px; top: 1100px; width: 280px; height: 280px; }
      #seam-rise { position: absolute; left: -200px; top: 0; width: 1480px; height: 2600px; background: #22084A; border-top: 16px solid #C6FF34; }
      #seam-rise img { position: absolute; left: 600px; top: 1100px; width: 280px; height: 280px; }
      #brand { position: absolute; left: 56px; top: 64px; z-index: 40; padding: 13px 26px 13px 24px; border-radius: 999px; background: #fff; box-shadow: 0 14px 34px rgba(34,8,74,0.18), 0 2px 6px rgba(34,8,74,0.1); pointer-events: none; }
      #brand img { display: block; width: 172px; height: 46px; }
      #caps { position: absolute; left: 60px; right: 60px; top: 1610px; height: 190px; z-index: 45; pointer-events: none; }
      .cap { position: absolute; left: 0; right: 0; top: 0; text-align: center; font-family: "DM Sans", sans-serif; font-weight: 700; font-size: 62px; line-height: 1.12; letter-spacing: -0.025em; color: #fff; opacity: 0; visibility: hidden; }
      .cap .cl { display: inline-block; max-width: 900px; padding: 10px 30px 16px; border-radius: 26px; background: rgba(23,21,30,0.86); box-shadow: 0 16px 40px rgba(23,21,30,0.28); }
      .cap .cw { color: rgba(255,255,255,0.5); }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="${FW}" data-height="${FH}">
      <div id="bg"><div id="bg-grid"></div><div id="bg-aura"></div></div>
${hosts.join("\n")}
      <div id="brand" data-layout-allow-overlap><img src="assets/brand/wordmark.png" alt="Viva Mais" data-layout-allow-overlap></div>
      <div id="caps" data-layout-allow-overlap>
        ${capHtml}
      </div>
      <div id="sig-in" data-layout-allow-overlap></div><div id="sig-out" data-layout-allow-overlap></div>
      <div id="seam-wipe"><div id="seam-panel"><img id="seam-mark" src="assets/brand/mark-white.svg" alt=""></div><div id="seam-rise"><img src="assets/brand/mark-white.svg" alt=""></div></div>
${audioTags}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
      // <seams:auto>
      ${seamCode}
      // </seams:auto>
      gsap.set("#brand", { opacity: 0 });
      tl.fromTo("#bg-aura", { x: -120, y: -200 }, { x: 260, y: 700, duration: ${total}, ease: "sine.inOut" }, 0);
      tl.fromTo("#bg-grid", { y: 0 }, { y: -240, duration: ${total}, ease: "none" }, 0);
      tl.fromTo("#brand", { opacity: 0, y: -28 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, ${+brandOn.toFixed(3)});
      tl.to("#brand", { opacity: 0, y: -28, duration: 0.4, ease: "power3.in" }, ${+brandOff.toFixed(3)});
      ${capTw}
      gsap.set("#seam-panel", { x: 1300, skewX: -12 });
      gsap.set("#seam-mark", { skewX: 12 });
      gsap.set("#seam-rise", { y: 2100, skewY: -5 });
      gsap.set("#seam-rise img", { skewY: 5 });
      ${seams.filter((x) => x.wipe && x.exit.axis === "y").map((x) => `tl.fromTo("#seam-rise", { y: 2100 }, { y: -2800, duration: 0.95, ease: "power1.inOut", immediateRender: false }, ${+(x.cut - 0.475).toFixed(3)});`).join("\n      ")}
      ${seams.filter((x) => x.wipe && x.exit.axis === "x").map((x) => `tl.fromTo("#seam-panel", { x: 1300 }, { x: -2400, duration: 0.95, ease: "power1.inOut", immediateRender: false }, ${+(x.cut - 0.475).toFixed(3)});`).join("\n      ")}
      tl.set({}, {}, ${total});
    </script>
  </body>
</html>
`
);
write("ledger.json", JSON.stringify({ fps: 30, seams: seams.map(({ wipe, ...s }) => s) }, null, 2) + "\n");
write(
  "STORYBOARD.md",
  `---
format: 1080x1920
duration: ${Math.round(total)}s
message: "Sua empresa oferece. Sua equipe sente. Saúde de verdade, o dia inteiro."
arc: Gancho (4 minutos) → marca e todos os recursos → RH liga tudo → primeiro acesso → benefícios → ficha e IA → plantão → consulta → documentos → avisos → painel do RH → assinatura
audience: RH, gestores e fundadores decidindo o plano empresarial Viva Mais
music: ${music.mood}
mode: autonomous
---

${frames.join("\n")}`
);
process.stdout.write(`total ${total}s, ${scenes.length} scenes, ${audio.length} audio clips\n`);
