const CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
import { illSvg } from "./illus.mjs";

const PERKS = [
  ["consulta", "Consulta grátis", "2 com clínico geral"],
  ["desconto", "25% de desconto", "em todas as consultas"],
  ["ia", "IA de saúde", "tire dúvidas 24h"],
  ["analise", "Análise com IA", "entenda sua consulta"],
  ["farmacia", "Farmácias parceiras", "remédios com desconto"],
];

export const WIN_HTML = `<div class="wc">
<div class="wc-glow"></div>
<div class="wc-icon"><svg viewBox="0 0 48 48" fill="none"><rect x="6" y="12" width="36" height="26" rx="6" fill="#fff" stroke="#22084a" stroke-width="3"/><path d="M8 15l16 12 16-12" stroke="#22084a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg><i></i></div>
<h1 class="wc-title">Confirme seu e-mail</h1>
<p class="wc-sub">Enviamos um código de 8 números para<br><b>maria.oliveira@email.com</b></p>
<div class="wc-boxes">${"48291375".split("").map((d) => `<div class="wc-box"><span>${d}</span></div>`).join("")}</div>
<div class="wc-ok"><b>${CHECK}</b>E-mail confirmado</div>
</div>
<div class="ww">
<div class="ww-rays"></div>
<div class="ww-ring r1"></div><div class="ww-ring r2"></div>
<div class="ww-badge"><svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path class="ww-tick" d="M20 6 9 17l-5-5" pathLength="1"/></svg></div>
<h1 class="ww-title"><span>Conta</span> <span>criada!</span></h1>
<p class="ww-sub">Bem-vinda ao Viva Mais, Maria.</p>
<div class="ww-card">
<div class="ww-head"><div><small>Seu plano está ativo</small><strong>Viva+ Empresarial</strong></div><div class="ww-count"><em>0</em><span>benefícios<br>liberados</span></div></div>
<div class="ww-grid">${PERKS.map(([k, a, b], i) => `<div class="ww-perk${i === 4 ? " wide" : ""}"><div class="ww-ill">${illSvg(k)}</div><div><strong>${a}</strong><small>${b}</small></div><b>${CHECK}</b></div>`).join("")}</div>
</div>
<div class="ww-cta">Começar a usar</div>
</div>`;

export const WIN_CSS = `
.wc,.ww{position:absolute;inset:0;font-family:"DM Sans",sans-serif}
.wc{background:#f8f6ff}
.wc-glow{position:absolute;left:-60px;top:-140px;width:520px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(126,59,237,.28),rgba(126,59,237,0) 68%)}
.wc-icon{position:absolute;left:161px;top:150px;width:80px;height:80px;border-radius:24px;background:#ebe1fd;display:grid;place-items:center}
.wc-icon svg{width:46px;height:46px}
.wc-icon i{position:absolute;right:10px;top:12px;width:14px;height:14px;border-radius:50%;background:#c6ff34;border:3px solid #22084a}
.wc-title{position:absolute;left:0;right:0;top:256px;margin:0;text-align:center;font-family:"Space Grotesk",sans-serif;font-size:28px;font-weight:700;letter-spacing:-.02em;color:#17151e}
.wc-sub{position:absolute;left:30px;right:30px;top:302px;margin:0;text-align:center;font-size:15px;line-height:22px;color:#5c5868}
.wc-sub b{color:#17151e}
.wc-boxes{position:absolute;left:21px;top:378px;display:flex;flex-direction:row;gap:8px}
.wc-box{position:relative;width:38px;height:54px;border-radius:12px;background:#fff;border:2px solid #e4e0ee;display:grid;place-items:center}
.wc-box span{font-family:"Space Grotesk",sans-serif;font-size:26px;font-weight:700;color:#17151e;opacity:0}
.wc-ok{position:absolute;left:96px;top:470px;width:210px;height:46px;border-radius:999px;background:#1f9d55;color:#fff;font-size:16px;font-weight:700;display:flex;flex-direction:row;align-items:center;justify-content:center;gap:8px;opacity:0}
.wc-ok b{width:22px;height:22px;border-radius:50%;background:#c6ff34;color:#0f5130;display:grid;place-items:center}
.wc-ok b svg{width:14px;height:14px}
.ww{background:linear-gradient(170deg,#7e3bed 0%,#5719b6 55%,#2e0a6e 100%);opacity:0;color:#fff;overflow:hidden}
.ww-rays{position:absolute;left:-199px;top:-268px;width:800px;height:800px;border-radius:50%;background:repeating-conic-gradient(from 0deg at 50% 50%,rgba(255,255,255,.07) 0deg 9deg,rgba(255,255,255,0) 9deg 22.5deg);-webkit-mask:radial-gradient(circle,#000 0%,#000 30%,transparent 62%);mask:radial-gradient(circle,#000 0%,#000 30%,transparent 62%)}
.ww-ring{position:absolute;left:111px;top:42px;width:180px;height:180px;border-radius:50%;border:3px solid rgba(198,255,52,.7);opacity:0}
.ww-badge{position:absolute;left:155px;top:86px;width:92px;height:92px;border-radius:50%;background:#c6ff34;display:grid;place-items:center;box-shadow:0 18px 40px rgba(20,4,60,.45)}
.ww-badge svg{width:50px;height:50px;stroke:#22084a}
.ww-title{position:absolute;left:0;right:0;top:198px;margin:0;text-align:center;font-family:"Space Grotesk",sans-serif;font-size:40px;font-weight:700;letter-spacing:-.03em;line-height:1}
.ww-title span{display:inline-block}
.ww-sub{position:absolute;left:0;right:0;top:248px;margin:0;text-align:center;font-size:16px;color:#e6dbff}
.ww-card{position:absolute;left:16px;right:16px;top:286px;padding:14px 12px 12px;border-radius:26px;background:#fff;color:#17151e;box-shadow:0 24px 50px rgba(20,4,60,.4)}
.ww-head{display:flex;flex-direction:row;justify-content:space-between;align-items:center;padding:0 4px 12px}
.ww-head small{display:block;font-size:12.5px;color:#7a7588}
.ww-head strong{display:block;margin-top:2px;font-family:"Space Grotesk",sans-serif;font-size:19px}
.ww-count{display:flex;flex-direction:row;align-items:center;gap:8px}
.ww-count em{font-style:normal;font-family:"Space Grotesk",sans-serif;font-size:40px;font-weight:700;color:#6a24db;line-height:1;display:inline-block}
.ww-count span{font-size:11.5px;line-height:14px;color:#5c5868}
.ww-grid{display:flex;flex-direction:row;flex-wrap:wrap;gap:8px}
.ww-perk{position:relative;width:169px;height:132px;box-sizing:border-box;padding:12px;border-radius:20px;background:#f6f2ff;display:flex;flex-direction:column;gap:6px}
.ww-perk.wide{width:100%;height:76px;flex-direction:row;align-items:center;gap:12px}
.ww-ill{width:58px;height:58px;flex:none}
.ww-perk.wide .ww-ill{width:54px;height:54px}
.ww-perk strong{display:block;font-size:15px;line-height:19px}
.ww-perk small{display:block;font-size:12px;line-height:15px;color:#7a7588}
.ww-perk b{position:absolute;right:10px;top:10px;width:24px;height:24px;border-radius:50%;background:#c6ff34;color:#22084a;display:grid;place-items:center;border:2px solid #fff}
.ww-perk b svg{width:13px;height:13px}
.ww-perk.wide b{top:26px;right:14px}
.ww-cta{position:absolute;left:20px;right:20px;bottom:36px;height:56px;border-radius:18px;background:#c6ff34;color:#22084a;font-size:18px;font-weight:700;display:grid;place-items:center;box-shadow:0 14px 30px rgba(20,4,60,.35)}
`;

export function winCode(S, t) {
  var L = S.layer("win");
  var q = function (s) {
    return S.all(s, L);
  };
  var wc = q(".wc")[0];
  var boxes = q(".wc-box");
  var ok = q(".wc-ok")[0];
  gsap.set(L, { autoAlpha: 0 });
  S.add(function (tl) {
    tl.set(L, { visibility: "visible" }, t);
    tl.fromTo(L, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out", immediateRender: false }, t);
    tl.fromTo(q(".wc-icon")[0], { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "power3.out", immediateRender: false }, t + 0.2);
    tl.fromTo(q(".wc-title, .wc-sub"), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.1, immediateRender: false }, t + 0.35);
    tl.fromTo(boxes, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.04, immediateRender: false }, t + 0.5);
    var at = t + 1.2;
    boxes.forEach(function (b, i) {
      var d = b.querySelector("span");
      tl.fromTo(d, { opacity: 0, scale: 1.6, y: -6 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power3.out", immediateRender: false }, at + i * 0.15);
      tl.fromTo(b, { borderColor: "#e4e0ee" }, { borderColor: "#7e3bed", duration: 0.15, ease: "none", immediateRender: false }, at + i * 0.15);
    });
    var done = at + 8 * 0.15 + 0.3;
    boxes.forEach(function (b, i) {
      tl.to(b, { backgroundColor: "#e5f8ea", borderColor: "#1f9d55", y: -6, duration: 0.18, ease: "power2.out" }, done + i * 0.05);
      tl.to(b, { y: 0, duration: 0.3, ease: "power3.out" }, done + 0.18 + i * 0.05);
    });
    tl.fromTo(ok, { opacity: 0, y: 18, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, done + 0.5);
  });
  return { done: t + 1.2 + 8 * 0.15 + 0.3, ok: ok, boxes: S.all(".wc-boxes", L)[0] };
}

export function winParty(S, t) {
  var L = S.layer("win");
  var q = function (s) {
    return S.all(s, L);
  };
  var ww = q(".ww")[0];
  var badge = q(".ww-badge")[0];
  var tick = q(".ww-tick")[0];
  var count = q(".ww-count em")[0];
  var n = { v: 0 };
  gsap.set(tick, { strokeDasharray: 1, strokeDashoffset: 1 });
  S.status(t, true);
  S.add(function (tl) {
    tl.to(q(".wc")[0], { opacity: 0, scale: 0.94, duration: 0.5, ease: "power2.in", transformOrigin: "50% 45%" }, t);
    tl.fromTo(ww, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out", immediateRender: false, transformOrigin: "50% 30%" }, t);
    tl.fromTo(q(".ww-rays")[0], { rotation: 0, opacity: 0 }, { rotation: 40, opacity: 1, duration: 9, ease: "none", immediateRender: false }, t);
    tl.fromTo(badge, { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.7, ease: "power3.out", immediateRender: false }, t + 0.3);
    tl.fromTo(tick, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.45, ease: "power2.out", immediateRender: false }, t + 0.75);
    q(".ww-ring").forEach(function (r, i) {
      tl.fromTo(r, { scale: 0.6, opacity: 0.9 }, { scale: 1.9, opacity: 0, duration: 1.1, ease: "power2.out", immediateRender: false }, t + 0.7 + i * 0.22);
    });
    q(".ww-title span").forEach(function (s, i) {
      tl.fromTo(s, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", immediateRender: false }, t + 1.0 + i * 0.12);
    });
    tl.fromTo(q(".ww-sub")[0], { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, t + 1.35);
    tl.fromTo(q(".ww-card")[0], { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", immediateRender: false }, t + 1.7);
    q(".ww-perk").forEach(function (p, i) {
      var at = t + 2.0 + i * 0.36;
      tl.fromTo(p, { y: 26, scale: 0.86, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)", immediateRender: false }, at);
      illIn(tl, p.querySelector("svg.il"), at + 0.05);
      tl.fromTo(p.querySelector("b"), { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.4, ease: "back.out(2.6)", immediateRender: false }, at + 0.55);
      tl.fromTo(n, { v: i }, { v: i + 1, duration: 0.01, ease: "none", immediateRender: false, onUpdate: function () { count.textContent = String(Math.round(n.v)); } }, at + 0.55);
      tl.fromTo(count, { scale: 1 }, { scale: 1.35, duration: 0.14, ease: "power2.out", yoyo: true, repeat: 1, immediateRender: false }, at + 0.55);
    });
    tl.fromTo(q(".ww-cta")[0], { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", immediateRender: false }, t + 4.2);
  });
  return { badge: badge, cta: q(".ww-cta")[0], end: t + 4.7 };
}
