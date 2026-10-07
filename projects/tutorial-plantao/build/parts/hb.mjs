import { BN_ICON } from "./bn.mjs";

const INK = "#17151e";
const S = (inner) => `<svg viewBox="0 0 96 96" fill="none">${inner}</svg>`;
export const HB_ART = {
  motivo: S(`<ellipse cx="50" cy="82" rx="30" ry="5" fill="#ebe1fd"/><path d="M16 22h48a10 10 0 0 1 10 10v22a10 10 0 0 1-10 10H40l-14 12v-12h-10A10 10 0 0 1 6 54V32a10 10 0 0 1 10-10z" fill="#fafafe" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M20 38h32M20 48h22" stroke="#7e3bed" stroke-width="3" stroke-linecap="round"/><g class="hb-pen"><path d="M60 70l24-24 8 8-24 24-11 3z" fill="#c6ff34" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M78 52l8 8" stroke="${INK}" stroke-width="2.4"/><path d="M60 70l3 8" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/></g><g class="hb-spark" stroke="#7e3bed" stroke-width="2.6" stroke-linecap="round"><path d="M80 18v8M76 22h8"/><path d="M12 70l4-4M14 78h4"/></g>`),
  dor: S(`<ellipse cx="48" cy="86" rx="26" ry="4" fill="#ebe1fd"/><circle cx="48" cy="20" r="11" fill="#fafafe" stroke="${INK}" stroke-width="2.4"/><path d="M30 78V52a18 18 0 0 1 36 0v26" fill="#ebe1fd" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M30 48l-8 18M66 48l8 18M38 78v6M58 78v6" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><g class="hb-pin"><path d="M68 10a10 10 0 0 1 10 10c0 7-10 18-10 18S58 27 58 20a10 10 0 0 1 10-10z" fill="#7e3bed" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="68" cy="20" r="3.5" fill="#c6ff34"/></g><g class="hb-pulse" stroke="#7e3bed" stroke-width="2.4" stroke-linecap="round"><path d="M22 34a8 8 0 0 1 0-10"/><path d="M16 38a15 15 0 0 1 0-18"/></g>`),
  tempo: S(`<ellipse cx="48" cy="86" rx="30" ry="4" fill="#ebe1fd"/><rect x="14" y="20" width="60" height="56" rx="10" fill="#fafafe" stroke="${INK}" stroke-width="2.4"/><path d="M14 36h60" stroke="${INK}" stroke-width="2.4"/><rect x="14" y="20" width="60" height="16" rx="10" fill="#7e3bed"/><path d="M14 30a10 10 0 0 1 10-10h40a10 10 0 0 1 10 10v6H14z" fill="#7e3bed" stroke="${INK}" stroke-width="2.4"/><path d="M30 14v10M58 14v10" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><g class="hb-days" fill="#ebe1fd"><rect x="22" y="44" width="10" height="8" rx="2"/><rect x="38" y="44" width="10" height="8" rx="2"/><rect x="54" y="44" width="10" height="8" rx="2"/><rect x="22" y="58" width="10" height="8" rx="2"/></g><path class="hb-trend" d="M38 66l10-8 8 4 12-12" stroke="#7e3bed" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M62 50h6v6" stroke="#7e3bed" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="84" cy="64" r="7" fill="#c6ff34" stroke="${INK}" stroke-width="2.2"/><path d="M84 60v4l3 2" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`),
  remedios: S(`<ellipse cx="48" cy="86" rx="30" ry="4" fill="#ebe1fd"/><g class="hb-pill"><rect x="10" y="38" width="46" height="22" rx="11" transform="rotate(-35 33 49)" fill="#fafafe" stroke="${INK}" stroke-width="2.4"/><path d="M26.5 32.8l13.5 19.3" stroke="${INK}" stroke-width="2.4"/><path d="M22.4 35.6a11 11 0 0 1 17.6-2.2l-9.4 6.6z" fill="#7e3bed"/><path d="M18.7 40.2l13.4-9.4 8 11.4-13.4 9.4a11 11 0 0 1-8-11.4z" fill="#7e3bed"/></g><g class="hb-shield"><path d="M66 22l20 7v16c0 12-8 21-20 25-12-4-20-13-20-25V29z" fill="#c6ff34" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M57 45l6 6 12-13" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g><g stroke="#7e3bed" stroke-width="2.6" stroke-linecap="round"><path d="M16 20l3-3M12 26h4"/></g>`),
  anexos: S(`<ellipse cx="48" cy="86" rx="30" ry="4" fill="#ebe1fd"/><rect class="hb-photo2" x="30" y="18" width="46" height="46" rx="6" transform="rotate(8 53 41)" fill="#ebe1fd" stroke="${INK}" stroke-width="2.2"/><g class="hb-photo"><rect x="18" y="26" width="46" height="46" rx="6" fill="#fafafe" stroke="${INK}" stroke-width="2.4"/><path d="M18 62l12-12 8 8 10-12 16 16" fill="#7e3bed" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="50" cy="38" r="5" fill="#c6ff34" stroke="${INK}" stroke-width="2"/></g><g class="hb-clip"><path d="M70 30l-14 14a6 6 0 0 0 8.5 8.5L80 37a10 10 0 0 0-14-14L50 39" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`),
};

const TILES = [
  ["motivo", "01", "Motivo", "O que está acontecendo", "Começar", "big"],
  ["dor", "02", "Onde dói", "Marque no corpo", "Preencher", ""],
  ["tempo", "03", "Há quanto tempo", "Início e evolução", "Preencher", ""],
  ["remedios", "04", "Remédios e alergias", "Confirme o que já sabemos", "Preencher", ""],
  ["anexos", "05", "Anexos", "Exames, receitas ou fotos", "Opcional", ""],
];

export const HB_HTML = `<div class="hb">
<div class="hb-aura"></div>
<div class="hb-nav"><div class="hb-back">${BN_ICON.back}</div><span>Plantão 24h</span></div>
<h1 class="hb-t">Preparar atendimento</h1>
<p class="hb-s">A médica chega sabendo do seu caso.</p>
<div class="hb-prog"><div class="hb-prog-l"><b class="hb-prog-n">0 de 5 etapas</b><span>~2 min</span></div><div class="hb-bar"><u></u></div></div>
<div class="hb-grid">${TILES.map(([k, n, t, s, p, big]) => `<div class="hb-tile hb-${k} ${big}"><em>${n}</em><div class="hb-art">${HB_ART[k]}</div><div class="hb-body"><b>${t}</b><span class="hb-sub">${s}</span></div><div class="hb-pill">${p}</div><div class="hb-ok"><svg viewBox="0 0 24 24" fill="none"><path d="M6 12.5l4 4 8-9" stroke="#17151e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="20" stroke-dashoffset="20"/></svg></div></div>`).join("")}</div>
<div class="hb-cta">Revisar e enviar<span>${BN_ICON.arrow}</span></div>
</div>`;

export const HB_CSS = `
.hb{position:absolute;inset:0;background:#fafafe;overflow:hidden}
.hb *{box-sizing:border-box}
.hb-aura{position:absolute;right:-200px;top:-240px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(157,107,242,.26) 0%,rgba(157,107,242,.1) 40%,rgba(250,250,254,0) 70%)}
.hb-nav{position:absolute;left:10px;top:58px;height:44px;display:flex;align-items:center;gap:4px;font-family:DMSans_500Medium;font-size:14px;color:#726f80}
.hb-back{display:grid;place-items:center;width:44px;height:44px}
.hb-back svg{width:24px;height:24px}
.hb-t{position:absolute;left:20px;top:104px;margin:0;font-family:SpaceGrotesk_700Bold;font-size:30px;line-height:1;letter-spacing:-.8px;color:#17151e}
.hb-s{position:absolute;left:20px;top:140px;margin:0;font-family:DMSans_400Regular;font-size:14px;color:#726f80}
.hb-prog{position:absolute;left:20px;right:20px;top:170px;height:56px;padding:10px 16px;border-radius:18px;background:#fff;box-shadow:0 0 0 1px #ebe1fd}
.hb-prog-l{display:flex;justify-content:space-between;align-items:baseline;font-family:DMSans_400Regular;font-size:12px;color:#726f80}
.hb-prog-l b{font-family:DMSans_700Bold;font-weight:400;font-size:14px;color:#17151e}
.hb-bar{margin-top:8px;height:6px;border-radius:3px;background:#ebe1fd;overflow:hidden}
.hb-bar u{display:block;width:100%;height:100%;border-radius:3px;background:linear-gradient(90deg,#7e3bed,#c6ff34);transform:scaleX(0);transform-origin:0 50%}
.hb-grid{position:absolute;left:20px;right:20px;top:240px;display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:auto;gap:12px}
.hb-tile{position:relative;height:166px;padding:14px 14px 12px;border-radius:22px;background:#fff;box-shadow:0 0 0 1px #ebe1fd,0 10px 24px rgba(53,14,111,.06);display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden}
.hb-tile.big{grid-column:1/3;height:136px;flex-direction:row;align-items:flex-end;justify-content:flex-start}
.hb-tile em{position:absolute;left:14px;top:12px;font-style:normal;font-family:SpaceGrotesk_700Bold;font-size:12px;letter-spacing:.6px;color:#a29fb0}
.hb-art{position:absolute;right:8px;top:8px;width:78px;height:78px}
.hb-tile.big .hb-art{width:112px;height:112px;right:16px;top:12px}
.hb-art svg{width:100%;height:100%;overflow:visible}
.hb-body{display:flex;flex-direction:column;gap:3px;padding-right:4px}
.hb-tile.big .hb-body{flex:1;padding-right:130px}
.hb-body b{font-family:DMSans_700Bold;font-weight:400;font-size:15px;line-height:19px;color:#17151e}
.hb-body span{font-family:DMSans_400Regular;font-size:12px;line-height:16px;color:#726f80}
.hb-pill{margin-top:8px;align-self:flex-start;padding:5px 10px;border-radius:999px;background:#f3edff;font-family:DMSans_700Bold;font-size:11px;color:#5719b6}
.hb-tile.big .hb-pill{position:absolute;right:12px;bottom:12px;margin:0}
.hb-tile.big .hb-pill{background:#7e3bed;color:#fafafe}
.hb-tile:not(.big) .hb-body{padding-right:0}
.hb-tile.done .hb-pill{background:#c6ff34;color:#17151e}
.hb-ok{position:absolute;left:12px;top:8px;display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:#c6ff34;box-shadow:0 0 0 2px #fff}
.hb-ok svg{width:16px;height:16px}
.hb-cta{position:absolute;left:20px;right:20px;bottom:40px;height:54px;border-radius:18px;background:#e6e4ec;display:flex;align-items:center;justify-content:space-between;padding:0 9px 0 22px;font-family:DMSans_700Bold;font-size:16px;color:#a29fb0}
.hb-cta span{display:grid;place-items:center;width:38px;height:38px;border-radius:12px;background:#fafafe;color:#a29fb0}
.hb-cta svg{width:20px;height:20px}
`;

export function hbLife(S, hb, t0) {
  const q = (s) => S.one(s, hb);
  const qa = (s) => S.all(s, hb);
  qa(".hb-ok").forEach((o) => gsap.set(o, { scale: 0 }));
  S.add((tl) => {
    tl.fromTo([q(".hb-nav"), q(".hb-t"), q(".hb-s"), q(".hb-prog")], { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.07, immediateRender: false }, t0);
    tl.fromTo(qa(".hb-tile"), { y: 34, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "power3.out", stagger: 0.08, immediateRender: false, transformOrigin: "50% 50%" }, t0 + 0.25);
    tl.fromTo(q(".hb-cta"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, t0 + 0.7);
    tl.fromTo(q(".hb-pen"), { rotation: -12, x: 6, y: 6 }, { rotation: 0, x: 0, y: 0, duration: 0.7, ease: "power3.out", immediateRender: false, svgOrigin: "60 70" }, t0 + 0.7);
    tl.fromTo(qa(".hb-spark path"), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "power3.out", stagger: 0.1, immediateRender: false, transformOrigin: "50% 50%" }, t0 + 1.0);
    tl.fromTo(q(".hb-pin"), { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "bounce.out", immediateRender: false }, t0 + 0.85);
    tl.fromTo(q(".hb-trend"), { strokeDasharray: 50, strokeDashoffset: 50 }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.out", immediateRender: false }, t0 + 0.95);
    tl.fromTo(q(".hb-shield"), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out", immediateRender: false, svgOrigin: "66 46" }, t0 + 1.05);
    tl.fromTo(q(".hb-clip"), { rotation: 25, opacity: 0 }, { rotation: 0, opacity: 1, duration: 0.5, ease: "power3.out", immediateRender: false, svgOrigin: "70 30" }, t0 + 1.15);
  });
  return { fin: t0 + 1.4 };
}

export function hbDone(S, hb, i, at, summary) {
  const tile = S.all(".hb-tile", hb)[i];
  const pill = tile.querySelector(".hb-pill");
  const num = tile.querySelector("em");
  const ok = tile.querySelector(".hb-ok");
  const sub = tile.querySelector(".hb-sub");
  const n = S.one(".hb-prog-n", hb);
  const bar = S.one(".hb-bar u", hb);
  const next = S.all(".hb-tile", hb)[i + 1];
  const cta = S.one(".hb-cta", hb);
  S.add((tl) => {
    tl.to(pill, { backgroundColor: "#c6ff34", color: "#17151e", duration: 0.25, ease: "none" }, at + 0.1);
    tl.to(num, { opacity: 0, duration: 0.15, ease: "none" }, at + 0.1);
    tl.fromTo(ok, { scale: 0 }, { scale: 1, duration: 0.4, ease: "power3.out", immediateRender: false }, at + 0.15);
    tl.to(ok.querySelector("path"), { strokeDashoffset: 0, duration: 0.25, ease: "power2.out" }, at + 0.35);
    tl.to(bar, { scaleX: (i + 1) / 5, duration: 0.5, ease: "power3.out" }, at + 0.1);
    if (next) {
      const np = next.querySelector(".hb-pill");
      tl.to(np, { backgroundColor: "#7e3bed", color: "#fafafe", duration: 0.3, ease: "none" }, at + 0.4);
    }
    if (i === 4) {
      tl.to(cta, { backgroundColor: "#7e3bed", color: "#fafafe", duration: 0.35, ease: "none" }, at + 0.4);
      tl.to(cta.querySelector("span"), { color: "#7e3bed", duration: 0.35, ease: "none" }, at + 0.4);
    }
  });
  S.setText(at + 0.12, pill, "Feito");
  if (summary) S.setText(at + 0.12, sub, summary);
  S.setText(at + 0.2, n, i + 1 + " de 5 etapas");
  if (next) S.setText(at + 0.4, next.querySelector(".hb-pill"), i === 3 ? "Opcional" : "Começar");
}
