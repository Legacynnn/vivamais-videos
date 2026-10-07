const CHECK = '<svg class="vf-ck" viewBox="0 0 24 24" fill="none"><path d="M6 12.5l4 4 8-9" stroke="#fafafe" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="20" stroke-dashoffset="20"/></svg>';
const SPIN = '<svg class="vf-sp" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#ebe1fd" stroke-width="3"/><path d="M12 3a9 9 0 0 1 9 9" stroke="#7e3bed" stroke-width="3" stroke-linecap="round"/></svg>';

const ICO = {
  shield: '<svg viewBox="0 0 28 28" fill="none"><path d="M14 3.5l8.5 3.2v6.6c0 5.4-3.6 9.4-8.5 11.2-4.9-1.8-8.5-5.8-8.5-11.2V6.7z" fill="#ebe1fd" stroke="#17151e" stroke-width="1.9" stroke-linejoin="round"/><circle cx="14" cy="11.5" r="2.6" stroke="#17151e" stroke-width="1.8"/><path d="M9.6 18.4a4.6 4.6 0 0 1 8.8 0" stroke="#17151e" stroke-width="1.8" stroke-linecap="round"/></svg>',
  wallet: '<svg viewBox="0 0 28 28" fill="none"><rect x="3.5" y="7.5" width="21" height="15" rx="3.5" fill="#ebe1fd" stroke="#17151e" stroke-width="1.9"/><path d="M6 7.5l11-3.6a1.6 1.6 0 0 1 2.1 1.5v2.1" stroke="#17151e" stroke-width="1.9" stroke-linejoin="round"/><rect x="16" y="12.5" width="8.5" height="5.5" rx="2.2" fill="#c6ff34" stroke="#17151e" stroke-width="1.9"/></svg>',
  tag: '<svg viewBox="0 0 28 28" fill="none"><path d="M4.5 13.6V5.8a1.3 1.3 0 0 1 1.3-1.3h7.8l10 10-9.1 9.1z" fill="#ebe1fd" stroke="#17151e" stroke-width="1.9" stroke-linejoin="round"/><path d="M11 18.5l6-6" stroke="#17151e" stroke-width="1.9" stroke-linecap="round"/><circle cx="11.6" cy="13.2" r="1.3" fill="#17151e"/><circle cx="16.4" cy="17.8" r="1.3" fill="#17151e"/></svg>',
  seat: '<svg viewBox="0 0 28 28" fill="none"><path d="M4 8.5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2.6a3 3 0 0 0 0 5.8v2.6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.6a3 3 0 0 0 0-5.8z" fill="#c6ff34" stroke="#17151e" stroke-width="1.9" stroke-linejoin="round"/><path d="M17.5 7v14" stroke="#17151e" stroke-width="1.6" stroke-dasharray="2 2.4"/><path d="M8.5 14h5" stroke="#17151e" stroke-width="1.9" stroke-linecap="round"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9.5" rx="2.4" stroke="#726f80" stroke-width="2"/><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3" stroke="#726f80" stroke-width="2" stroke-linecap="round"/></svg>',
};

const COIN = (id) => `<g class="vf-coin vf-coin-${id}"><circle cx="0" cy="0" r="15" fill="#c6ff34" stroke="#17151e" stroke-width="2.2"/><circle cx="0" cy="0" r="9.5" stroke="#17151e" stroke-width="1.6" stroke-dasharray="2 2.6"/><path d="M-4 -4l4 8 4-8" stroke="#17151e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g>`;

export const VF_ART = `<svg class="vf-art" viewBox="0 0 240 180" fill="none">
<ellipse cx="104" cy="168" rx="72" ry="7" fill="#ebe1fd"/>
<g class="vf-leaf"><path d="M14 166c2-22 12-36 30-44-3 18-13 33-30 44z" fill="#c6ff34" stroke="#17151e" stroke-width="2"/><path d="M16 162c7-11 14-21 24-36" stroke="#17151e" stroke-width="1.6" stroke-linecap="round"/></g>
<g class="vf-card"><rect x="54" y="42" width="96" height="62" rx="10" fill="#fafafe" stroke="#17151e" stroke-width="2.2"/><rect x="54" y="56" width="96" height="10" fill="#7e3bed"/><rect x="64" y="78" width="30" height="6" rx="3" fill="#d6c3fb"/></g>
<g class="vf-wallet">
<path d="M34 88a12 12 0 0 1 12-12h122a12 12 0 0 1 12 12v58a12 12 0 0 1-12 12H46a12 12 0 0 1-12-12z" fill="#7e3bed" stroke="#17151e" stroke-width="2.4" stroke-linejoin="round"/>
<path d="M34 88c0-7 5-12 12-12h122" stroke="#17151e" stroke-width="2.4"/>
<path d="M44 96h92" stroke="#9d6bf2" stroke-width="3" stroke-linecap="round"/>
<g class="vf-flap"><path d="M140 104h44a6 6 0 0 1 6 6v18a6 6 0 0 1-6 6h-44a10 10 0 0 1-10-10v-10a10 10 0 0 1 10-10z" fill="#5719b6" stroke="#17151e" stroke-width="2.4"/><circle cx="148" cy="119" r="6" fill="#c6ff34" stroke="#17151e" stroke-width="2"/></g>
</g>
<g class="vf-coins" transform="translate(0 0)">${COIN(0)}${COIN(1)}${COIN(2)}</g>
<g class="vf-ticket"><path d="M178 22h44a6 6 0 0 1 6 6v8a6 6 0 0 0 0 12v8a6 6 0 0 1-6 6h-44a6 6 0 0 1-6-6v-8a6 6 0 0 0 0-12v-8a6 6 0 0 1 6-6z" fill="#fafafe" stroke="#17151e" stroke-width="2.2"/><path d="M206 24v36" stroke="#17151e" stroke-width="1.6" stroke-dasharray="2.4 2.6"/><circle class="vf-ticket-ok" cx="189" cy="42" r="8" fill="#7e3bed"/><path class="vf-ticket-ck" d="M185 42.5l3 3 5.5-6" stroke="#fafafe" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="14" stroke-dashoffset="14"/><path d="M212 36h8M212 43h6M212 50h8" stroke="#a29fb0" stroke-width="2" stroke-linecap="round"/></g>
<g class="vf-spark" stroke="#7e3bed" stroke-width="3" stroke-linecap="round"><path d="M160 12l3-8"/><path d="M234 14l5-5"/><path d="M168 72l-6 4"/></g>
</svg>`;

const STEPS = [
  ["shield", "Conta verificada", "Ana Souza · colaboradora"],
  ["wallet", "Crédito da empresa ativo", '<span class="vf-bar"><u></u></span>R$ 300,00 disponíveis no mês'],
  ["tag", "Crédito aplicado", "−R$ 79,90 · sobram R$ 220,10"],
  ["seat", "Vaga reservada", "Plantão 24h · consulta por vídeo"],
];

export const VF_HTML = `<div class="vf">
<div class="vf-aura"></div>
<div class="vf-prog"><u></u></div>
${VF_ART}
<h2 class="vf-t"><span>Verificando seu crédito</span><span>Aplicando o crédito</span><span>Reservando sua vaga</span><span>Atendimento confirmado</span></h2>
<div class="vf-bal"><div class="vf-bal-l">Crédito da empresa</div><div class="vf-bal-n"><span class="vf-num">R$ 300,00</span><em class="vf-delta">−R$ 79,90</em></div></div>
<ul class="vf-steps">${STEPS.map(([ic, t, s]) => `<li><i class="vf-ic">${ICO[ic]}</i><div><b>${t}</b><span>${s}</span></div><em>${SPIN}<span class="vf-ok">${CHECK}</span></em></li>`).join("")}</ul>
<div class="vf-lock">${ICO.lock}Pago pela sua empresa · sem cobrança para você</div>
</div>`;

export const VF_CSS = `
.vf{position:absolute;inset:0;background:#fafafe;overflow:hidden}
.vf *{box-sizing:border-box}
.vf-aura{position:absolute;left:-150px;top:-200px;width:700px;height:620px;border-radius:50%;background:radial-gradient(circle,rgba(157,107,242,.26) 0%,rgba(157,107,242,.08) 45%,rgba(250,250,254,0) 70%)}
.vf-prog{position:absolute;left:24px;right:24px;top:78px;height:4px;border-radius:2px;background:#ebe1fd;overflow:hidden}
.vf-prog u{position:absolute;inset:0;background:#7e3bed;transform-origin:0 50%;transform:scaleX(0)}
.vf-art{position:absolute;left:69px;top:108px;width:264px;height:198px;overflow:visible}
.vf-t{position:absolute;left:0;right:0;top:326px;height:36px;margin:0;text-align:center;font-family:SpaceGrotesk_700Bold;font-size:28px;letter-spacing:-.6px;color:#17151e}
.vf-t span{position:absolute;left:0;right:0;top:0}
.vf-bal{position:absolute;left:24px;right:24px;top:388px;height:96px;padding:18px 20px;border-radius:24px;background:#fff;box-shadow:0 0 0 1px #ebe1fd,0 12px 28px rgba(53,14,111,.08)}
.vf-bal-l{font-family:DMSans_500Medium;font-size:14px;color:#726f80}
.vf-bal-n{position:relative;margin-top:4px;display:flex;align-items:baseline;justify-content:space-between}
.vf-num{font-family:SpaceGrotesk_700Bold;font-size:36px;letter-spacing:-1px;color:#17151e;font-variant-numeric:tabular-nums}
.vf-delta{padding:5px 10px;border-radius:999px;background:#f3edff;font-style:normal;font-family:DMSans_700Bold;font-size:14px;color:#5719b6}
.vf-steps{position:absolute;left:24px;right:24px;top:512px;margin:0;padding:0;list-style:none;display:flex;flex-direction:column}
.vf-steps li{display:flex;align-items:center;gap:14px;height:66px;box-shadow:inset 0 -1px 0 #ebe1fd}
.vf-steps li:last-child{box-shadow:none}
.vf-ic{flex:none;width:28px;height:28px}
.vf-ic svg{width:28px;height:28px}
.vf-steps li>div{flex:1;display:flex;flex-direction:column;gap:3px}
.vf-steps b{font-family:DMSans_500Medium;font-weight:400;font-size:16px;color:#17151e}
.vf-steps span{display:flex;align-items:center;gap:8px;font-family:DMSans_400Regular;font-size:13px;color:#726f80}
.vf-bar{position:relative;display:inline-block;width:48px;height:5px;border-radius:3px;background:#ebe1fd;overflow:hidden}
.vf-bar u{position:absolute;left:0;top:0;bottom:0;width:33%;background:#7e3bed;transform-origin:0 50%;transform:scaleX(0)}
.vf-steps em{position:relative;flex:none;width:28px;height:28px}
.vf-sp{position:absolute;inset:0;width:28px;height:28px;opacity:0}
.vf-ok{position:absolute;inset:0;display:grid;place-items:center;border-radius:50%;background:#7e3bed;transform:scale(0)}
.vf-ck{width:18px;height:18px}
.vf-lock{position:absolute;left:0;right:0;bottom:44px;display:flex;align-items:center;justify-content:center;gap:8px;font-family:DMSans_500Medium;font-size:13px;color:#726f80}
.vf-lock svg{width:16px;height:16px}
`;

export function vfLife(S, vf, t0) {
  const q = (s) => S.one(s, vf);
  const qa = (s) => S.all(s, vf);
  const titles = qa(".vf-t span");
  const rows = qa(".vf-steps li");
  const coins = qa(".vf-coin");
  const num = q(".vf-num");
  const plan = { steps: [], done: 0 };
  titles.slice(1).forEach((el) => gsap.set(el, { opacity: 0 }));
  rows.forEach((r) => gsap.set(r, { opacity: 0.35 }));
  coins.forEach((c) => gsap.set(c, { x: 104, y: 120, opacity: 0 }));
  gsap.set(q(".vf-delta"), { opacity: 0 });
  gsap.set(q(".vf-ticket"), { opacity: 0 });
  const STEP = 1.25;
  S.add((tl) => {
    tl.fromTo(q(".vf-wallet"), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", immediateRender: false }, t0);
    tl.fromTo(q(".vf-card"), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", immediateRender: false }, t0 + 0.2);
    tl.fromTo(q(".vf-leaf"), { rotation: 20, opacity: 0 }, { rotation: 0, opacity: 1, duration: 0.6, ease: "power3.out", immediateRender: false, svgOrigin: "14 166" }, t0 + 0.3);
    tl.fromTo([q(".vf-t"), q(".vf-bal")], { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.08, immediateRender: false }, t0 + 0.2);
    tl.fromTo(rows, { y: 18 }, { y: 0, duration: 0.45, ease: "power3.out", stagger: 0.06, immediateRender: false }, t0 + 0.35);
    tl.fromTo(q(".vf-lock"), { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none", immediateRender: false }, t0 + 0.6);
    tl.fromTo(q(".vf-prog u"), { scaleX: 0 }, { scaleX: 1, duration: STEP * 4, ease: "power1.inOut", immediateRender: false }, t0 + 0.5);
    rows.forEach((r, i) => {
      const s = t0 + 0.6 + i * STEP;
      const sp = r.querySelector(".vf-sp");
      const ok = r.querySelector(".vf-ok");
      tl.to(r, { opacity: 1, duration: 0.2, ease: "none" }, s);
      tl.set(sp, { opacity: 1 }, s);
      tl.fromTo(sp, { rotation: 0 }, { rotation: 540, duration: STEP - 0.2, ease: "none", immediateRender: false, transformOrigin: "50% 50%" }, s);
      tl.set(sp, { opacity: 0 }, s + STEP - 0.2);
      tl.fromTo(ok, { scale: 0 }, { scale: 1, duration: 0.35, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, s + STEP - 0.22);
      tl.to(ok.querySelector("path"), { strokeDashoffset: 0, duration: 0.25, ease: "power2.out" }, s + STEP - 0.1);
      if (i > 0 && i < 3) {
        tl.to(titles[i - 1], { opacity: 0, y: -14, duration: 0.2, ease: "power2.in" }, s - 0.1);
        tl.fromTo(titles[i], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out", immediateRender: false }, s + 0.05);
      }
    });
    const bar = q(".vf-bar u");
    tl.to(bar, { scaleX: 1, duration: 0.7, ease: "power3.out" }, t0 + 0.6 + STEP + 0.2);
    const cardUp = t0 + 0.6 + STEP;
    tl.to(q(".vf-card"), { y: -26, duration: 0.5, ease: "power3.inOut" }, cardUp);
    tl.to(q(".vf-flap"), { x: 10, duration: 0.3, ease: "power2.out" }, cardUp);
    coins.forEach((c, i) => {
      const s = cardUp + 0.3 + i * 0.22;
      tl.set(c, { opacity: 1 }, s);
      tl.fromTo(c, { x: 104, y: 110, scale: 0.4 }, { x: 150 + i * 6, y: 40 - i * 4, scale: 1, duration: 0.45, ease: "power2.out", immediateRender: false }, s);
      tl.to(c, { x: 200, y: 42, scale: 0.3, opacity: 0, duration: 0.35, ease: "power2.in" }, s + 0.45);
    });
    const tk = cardUp + 0.2;
    tl.fromTo(q(".vf-ticket"), { opacity: 0, x: 20, rotation: 8 }, { opacity: 1, x: 0, rotation: 0, duration: 0.5, ease: "power3.out", immediateRender: false, svgOrigin: "200 42" }, tk);
    tl.fromTo(q(".vf-delta"), { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out", immediateRender: false }, t0 + 0.6 + STEP * 2 + 0.3);
    const fin = t0 + 0.6 + STEP * 3 + 0.9;
    tl.to(q(".vf-ticket-ck"), { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, fin);
    tl.fromTo(qa(".vf-spark path"), { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out", stagger: 0.06, immediateRender: false, transformOrigin: "50% 50%" }, fin + 0.1);
    tl.to(titles[2], { opacity: 0, y: -14, duration: 0.2, ease: "power2.in" }, fin + 0.2);
    tl.fromTo(titles[3], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out", immediateRender: false }, fin + 0.35);
  });
  S.count(t0 + 0.6 + STEP * 2 + 0.4, num, 300, 220.1, (v) => "R$ " + v.toFixed(2).replace(".", ","), 1.1);
  return { fin: t0 + 0.6 + STEP * 3 + 0.9, stepAt: (i) => t0 + 0.6 + i * STEP };
}
