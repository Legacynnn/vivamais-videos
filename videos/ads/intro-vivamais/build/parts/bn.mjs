const I = (d) => `<svg viewBox="0 0 28 28" fill="none">${d}</svg>`;

export const BN_ICON = {
  steth: I('<circle cx="20" cy="17.5" r="3.6" fill="#d6c3fb"/><path d="M7 4.5v6.5a5 5 0 0 0 10 0V4.5M5.2 4.5H8.8M15.2 4.5h3.6M12 16v1.5a6 6 0 0 0 6 6h0.2a2.8 2.8 0 0 0 1.8-2.6v-.4" stroke="#17151e" stroke-width="1.9" stroke-linecap="round"/><circle cx="20" cy="17.5" r="3.6" stroke="#17151e" stroke-width="1.9"/>'),
  tag: I('<path d="M4.5 13.6V5.8a1.3 1.3 0 0 1 1.3-1.3h7.8l10 10-9.1 9.1z" fill="#d6c3fb"/><path d="M4.5 13.6V5.8a1.3 1.3 0 0 1 1.3-1.3h7.8l10 10-9.1 9.1z" stroke="#17151e" stroke-width="1.9" stroke-linejoin="round"/><path d="M11 18.5l6-6" stroke="#17151e" stroke-width="1.9" stroke-linecap="round"/><circle cx="11.6" cy="13.2" r="1.3" fill="#17151e"/><circle cx="16.4" cy="17.8" r="1.3" fill="#17151e"/>'),
  pill: I('<path d="M14 5.6a5.2 5.2 0 0 1 7.4 7.4L14 20.4z" fill="#c6ff34"/><rect x="2.6" y="10.4" width="22.8" height="10.4" rx="5.2" transform="rotate(-45 14 15.6)" stroke="#17151e" stroke-width="1.9"/><path d="M10.3 9.3l7.4 7.4" stroke="#17151e" stroke-width="1.9"/>'),
  flask: I('<path d="M8.2 19.2h11.6l2.3 4.1H5.9z" fill="#d6c3fb"/><path d="M11 4.5v7.2L5 22a1.3 1.3 0 0 0 1.1 1.9h15.8A1.3 1.3 0 0 0 23 22l-6-10.3V4.5M9.4 4.5h9.2M8.4 18.2h11.2" stroke="#17151e" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>'),
  spark: I('<path d="M4.5 7.3a2.8 2.8 0 0 1 2.8-2.8h13.4a2.8 2.8 0 0 1 2.8 2.8v9.4a2.8 2.8 0 0 1-2.8 2.8H12l-5.3 4.3v-4.3h.6a2.8 2.8 0 0 1-2.8-2.8z" fill="#ebe1fd" stroke="#17151e" stroke-width="1.9" stroke-linejoin="round"/><path d="M14 7.8l1.1 2.9 2.9 1.1-2.9 1.1-1.1 2.9-1.1-2.9-2.9-1.1 2.9-1.1z" fill="#7e3bed"/>'),
  family: I('<circle cx="19.5" cy="9.5" r="3.3" fill="#c6ff34"/><circle cx="10" cy="8.8" r="3.8" stroke="#17151e" stroke-width="1.9"/><circle cx="19.5" cy="9.5" r="3.3" stroke="#17151e" stroke-width="1.9"/><path d="M3.8 22.5a6.2 6.2 0 0 1 12.4 0M15.6 17.1a5.2 5.2 0 0 1 9 3.9" stroke="#17151e" stroke-width="1.9" stroke-linecap="round"/>'),
  chev: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 5.5l6.5 6.5L9 18.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#17151e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

const PH = [
  ["DV", "Drogaria Vida", "35%", "#ebe1fd", "#5719b6"],
  ["FB", "Farma Bem", "20%", "#f1ffc6", "#46650c"],
  ["DM", "Droga Mais", "15%", "#fde7dc", "#9a3412"],
  ["PS", "Pague Saúde", "25%", "#e0f2fe", "#075985"],
];

const FAM = [
  ["A", "#7e3bed", "#fafafe"],
  ["P", "#c6ff34", "#17151e"],
  ["L", "#ebe1fd", "#5719b6"],
  ["T", "#22084a", "#fafafe"],
];


const ILL = "assets/illustrations/plantao-24h.webp";

export const BN_HTML = `<div class="bn">
<div class="bn-aura"></div>
<div class="bn-scroll">
<div class="bn-nav"><div class="bn-back">${BN_ICON.back}</div><div class="bn-plan"><i></i>Viva+ Empresarial</div></div>
<div class="bn-head">
<div class="bn-eye">Ciclo até 29 out</div>
<h1 class="bn-h1">Seus benefícios</h1>
<p class="bn-save">Neste ano você já economizou <b>R$ 640,00</b> com o plano.</p>
</div>
<div class="bn-hero">
<img class="bn-hero-img" src="${ILL}" alt="">
<div class="bn-hero-chip"><i></i>Desconto do plano</div>
<h2 class="bn-hero-t">Plantão 24h</h2>
<p class="bn-hero-s">Clínico geral por vídeo, em minutos, a qualquer hora.</p>
<div class="bn-hero-cov"><s>R$ 79,90</s><b>R$ 59,90</b><em>com o plano</em></div>
<div class="bn-hero-cta">Ver benefício<span>${BN_ICON.arrow}</span></div>
</div>
<div class="bn-sec">Consultas</div>
<div class="bn-rows">
<div class="bn-row"><i>${BN_ICON.steth}</i><div class="bn-row-b"><b>Clínico geral grátis</b><span>Agende com hora marcada</span></div><div class="bn-meter"><em>2 de 2</em><span><u></u><u></u></span></div></div>
<div class="bn-row"><i>${BN_ICON.tag}</i><div class="bn-row-b"><b>25% em especialistas</b><span>Cardio, derma, pediatria e mais 12</span></div><div class="bn-go">${BN_ICON.chev}</div></div>
<div class="bn-row"><i>${BN_ICON.flask}</i><div class="bn-row-b"><b>Exames com desconto</b><span>Até 40% em laboratórios parceiros</span></div><div class="bn-go">${BN_ICON.chev}</div></div>
</div>
<div class="bn-sec">Farmácias parceiras<em>até 35% em genéricos</em></div>
<div class="bn-ph">${PH.map(([m, n, p, bg, fg]) => `<div class="bn-ph-c"><div class="bn-ph-l" style="background:${bg};color:${fg}">${m}</div><b>${p}</b><span>${n}</span></div>`).join("")}</div>
<div class="bn-sec">Para todo dia</div>
<div class="bn-rows">
<div class="bn-row"><i>${BN_ICON.spark}</i><div class="bn-row-b"><b>IA de saúde</b><span>Tire dúvidas a qualquer hora</span></div><div class="bn-pill">Ilimitado</div></div>
<div class="bn-row"><i>${BN_ICON.family}</i><div class="bn-row-b"><b>Família no plano</b><span>Dependentes com os mesmos benefícios</span></div><div class="bn-fam">${FAM.map(([l, bg, fg]) => `<u style="background:${bg};color:${fg}">${l}</u>`).join("")}</div></div>
</div>
</div>
</div>`;

const FACTS = [
  ["Ilimitado", "no ciclo"],
  ["24h", "todos os dias"],
  ["R$ 0", "por consulta"],
];

export const BD_HTML = `<div class="bd">
<div class="bd-aura"></div>
<div class="bd-nav"><div class="bd-back">${BN_ICON.chev}</div><span>Benefício do plano</span></div>
<div class="bd-tile"><img class="bd-img" src="${ILL}" alt=""><div class="bd-badge"><b>24h</b><span>online</span></div><svg class="bd-leaf" viewBox="0 0 40 40" fill="none"><path d="M6 36c1-14 8-24 22-30-2 14-9 25-22 30z" fill="#c6ff34" stroke="#17151e" stroke-width="1.8"/><path d="M8 33c6-9 12-16 18-24" stroke="#17151e" stroke-width="1.4" stroke-linecap="round"/></svg></div>
<div class="bd-chip"><i></i>Incluso no Viva+ Família</div>
<h1 class="bd-t">Plantão 24h</h1>
<p class="bd-s">Clínico geral por vídeo, sem agendar. Você entra na fila e é atendida em minutos.</p>
<div class="bd-facts">${FACTS.map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join("")}</div>
<div class="bd-cov"><div class="bd-cov-l"><span>Cobertura do plano</span><b class="bd-cov-n">0%</b></div><div class="bd-cov-bar"><u></u></div><p>Valor cheio <s>R$ 79,90</s> · pago pela sua assinatura</p></div>
<div class="bd-cta">Chamar médico agora<span>${BN_ICON.arrow}</span></div>
</div>`;

export const BN_CSS = `
.bn{position:absolute;inset:0;background:#fafafe;overflow:hidden}
.bn *,.bd *{box-sizing:border-box}
.bn-aura{position:absolute;right:-180px;top:-220px;width:560px;height:560px;border-radius:50%;background:radial-gradient(circle,rgba(157,107,242,.28) 0%,rgba(157,107,242,.1) 40%,rgba(250,250,254,0) 70%)}
.bn-scroll{position:absolute;left:0;top:0;width:402px;padding:62px 0 48px}
.bn-nav{display:flex;align-items:center;justify-content:space-between;height:56px;padding:0 16px 0 10px}
.bn-back{display:grid;place-items:center;width:44px;height:44px}
.bn-back svg{width:24px;height:24px}
.bn-plan{display:flex;align-items:center;gap:8px;height:32px;padding:0 14px 0 12px;border-radius:999px;background:#fff;box-shadow:0 0 0 1px #e6e4ec;font-family:DMSans_500Medium;font-size:14px;color:#17151e}
.bn-plan i{width:8px;height:8px;border-radius:50%;background:#8cc900}
.bn-head{padding:14px 20px 0}
.bn-eye{font-family:DMSans_700Bold;font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:#726f80}
.bn-h1{margin:8px 0 0;font-family:SpaceGrotesk_700Bold;font-size:36px;line-height:1.02;letter-spacing:-1px;color:#17151e}
.bn-save{margin:12px 0 0;max-width:300px;font-family:DMSans_400Regular;font-size:15px;line-height:21px;color:#403d4a}
.bn-save b{font-family:DMSans_700Bold;font-weight:400;color:#17151e;background:linear-gradient(transparent 62%,#e4ff94 62%)}
.bn-hero{position:relative;margin:22px 16px 0;height:322px;border-radius:28px;background:#e5defc;overflow:hidden;box-shadow:0 0 0 1px #d6c3fb}
.bn-hero-img{position:absolute;right:-22px;top:-6px;width:214px;height:214px;object-fit:cover;border-radius:28px}
.bn-hero-chip{position:absolute;left:18px;top:18px;display:flex;align-items:center;gap:8px;height:28px;padding:0 12px 0 10px;border-radius:999px;background:#17151e;font-family:DMSans_500Medium;font-size:13px;color:#fafafe}
.bn-hero-chip i{width:8px;height:8px;border-radius:50%;background:#c6ff34}
.bn-hero-t{position:absolute;left:18px;top:76px;margin:0;font-family:SpaceGrotesk_700Bold;font-size:32px;line-height:1;letter-spacing:-.8px;color:#17151e}
.bn-hero-s{position:absolute;left:18px;top:118px;width:172px;margin:0;font-family:DMSans_400Regular;font-size:15px;line-height:21px;color:#403d4a}
.bn-hero-cov{position:absolute;left:18px;top:206px;display:flex;align-items:baseline;gap:10px}
.bn-hero-cov s{font-family:DMSans_400Regular;font-size:14px;color:#726f80}
.bn-hero-cov b{font-family:SpaceGrotesk_700Bold;font-weight:400;font-size:24px;letter-spacing:-.4px;color:#22084a}
.bn-hero-cov em{align-self:center;padding:3px 8px;border-radius:999px;background:#c6ff34;font-style:normal;font-family:DMSans_700Bold;font-size:12px;color:#17151e}
.bn-hero-cta{position:absolute;left:16px;right:16px;bottom:16px;height:52px;border-radius:16px;background:#22084a;display:flex;align-items:center;justify-content:space-between;padding:0 8px 0 20px;font-family:DMSans_700Bold;font-size:16px;color:#fafafe}
.bn-hero-cta span{display:grid;place-items:center;width:38px;height:38px;border-radius:12px;background:#7e3bed;color:#fafafe}
.bn-hero-cta svg{width:20px;height:20px}
.bn-sec{display:flex;align-items:baseline;justify-content:space-between;padding:30px 20px 6px;font-family:DMSans_700Bold;font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:#726f80}
.bn-sec em{font-style:normal;font-family:DMSans_500Medium;font-size:13px;letter-spacing:0;text-transform:none;color:#5719b6}
.bn-rows{padding:0 20px}
.bn-row{display:flex;align-items:center;gap:14px;min-height:68px;box-shadow:inset 0 -1px 0 #e6e4ec}
.bn-row:last-child{box-shadow:none}
.bn-row>i{flex:none;width:28px;height:28px}
.bn-row>i svg{width:28px;height:28px}
.bn-row-b{flex:1;display:flex;flex-direction:column;gap:3px}
.bn-row-b b{font-family:DMSans_500Medium;font-weight:400;font-size:16px;color:#17151e}
.bn-row-b span{font-family:DMSans_400Regular;font-size:13px;color:#726f80}
.bn-meter{display:flex;flex-direction:column;align-items:flex-end;gap:6px}
.bn-meter em{font-style:normal;font-family:DMSans_700Bold;font-size:13px;color:#17151e}
.bn-meter span{display:flex;gap:4px}
.bn-meter u{width:18px;height:4px;border-radius:2px;background:#7e3bed}
.bn-go{color:#a29fb0}
.bn-go svg{width:20px;height:20px}
.bn-pill{padding:5px 10px;border-radius:999px;background:#f3edff;font-family:DMSans_500Medium;font-size:12px;color:#5719b6}
.bn-ph{display:flex;gap:10px;padding:6px 20px 0;overflow:hidden}
.bn-ph-c{flex:none;width:112px;padding:14px;border-radius:20px;background:#fff;box-shadow:0 0 0 1px #ebe1fd;display:flex;flex-direction:column;gap:2px}
.bn-ph-l{display:grid;place-items:center;width:36px;height:36px;border-radius:11px;margin-bottom:12px;font-family:SpaceGrotesk_700Bold;font-size:14px;letter-spacing:-.3px}
.bn-ph-c b{font-family:SpaceGrotesk_700Bold;font-weight:400;font-size:22px;letter-spacing:-.4px;color:#17151e}
.bn-ph-c span{font-family:DMSans_400Regular;font-size:12px;color:#726f80;white-space:nowrap}
.bn-fam{display:flex}
.bn-fam u{display:grid;place-items:center;width:30px;height:30px;margin-left:-8px;border-radius:50%;box-shadow:0 0 0 2.5px #fafafe;text-decoration:none;font-family:DMSans_700Bold;font-size:12px}
.bd{position:absolute;inset:0;background:#22084a;overflow:hidden}
.bd-aura{position:absolute;left:-160px;top:40px;width:720px;height:720px;border-radius:50%;background:radial-gradient(circle,rgba(157,107,242,.5) 0%,rgba(126,59,237,.16) 42%,rgba(34,8,74,0) 70%)}
.bd-nav{position:absolute;left:10px;right:16px;top:62px;height:56px;display:flex;align-items:center;gap:6px;font-family:DMSans_500Medium;font-size:15px;color:#d6c3fb}
.bd-back{display:grid;place-items:center;width:44px;height:44px;color:#fafafe}
.bd-back svg{width:24px;height:24px;transform:rotate(180deg)}
.bd-tile{position:absolute;left:91px;top:126px;width:220px;height:220px}
.bd-img{position:absolute;inset:0;width:220px;height:220px;border-radius:40px;object-fit:cover;box-shadow:0 30px 60px rgba(10,2,30,.45)}
.bd-badge{position:absolute;right:-18px;top:-14px;display:flex;flex-direction:column;align-items:center;justify-content:center;width:70px;height:70px;border-radius:50%;background:#c6ff34;box-shadow:0 0 0 3px #22084a;transform:rotate(-8deg)}
.bd-badge b{font-family:SpaceGrotesk_700Bold;font-weight:400;font-size:20px;line-height:1;letter-spacing:-.5px;color:#17151e}
.bd-badge span{font-family:DMSans_700Bold;font-size:10px;letter-spacing:.8px;text-transform:uppercase;color:#17151e}
.bd-leaf{position:absolute;left:-22px;bottom:-8px;width:40px;height:40px}
.bd-chip{position:absolute;left:0;right:0;top:376px;margin:0 auto;width:max-content;display:flex;align-items:center;gap:8px;height:30px;padding:0 14px 0 12px;border-radius:999px;background:rgba(250,250,254,.12);font-family:DMSans_500Medium;font-size:13px;color:#fafafe}
.bd-chip i{width:8px;height:8px;border-radius:50%;background:#c6ff34}
.bd-t{position:absolute;left:0;right:0;top:418px;margin:0;text-align:center;font-family:SpaceGrotesk_700Bold;font-size:40px;line-height:1;letter-spacing:-1px;color:#fafafe}
.bd-s{position:absolute;left:40px;right:40px;top:470px;margin:0;text-align:center;font-family:DMSans_400Regular;font-size:15px;line-height:21px;color:#d6c3fb}
.bd-facts{position:absolute;left:20px;right:20px;top:534px;display:flex;gap:10px}
.bd-facts>div{flex:1;height:70px;border-radius:18px;background:rgba(250,250,254,.08);box-shadow:inset 0 0 0 1px rgba(250,250,254,.12);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}
.bd-facts b{font-family:SpaceGrotesk_700Bold;font-weight:400;font-size:20px;letter-spacing:-.4px;color:#fafafe}
.bd-facts span{font-family:DMSans_400Regular;font-size:12px;color:#bfa6f6}
.bd-cov{position:absolute;left:20px;right:20px;top:622px;padding:16px 18px;border-radius:20px;background:#fafafe}
.bd-cov-l{display:flex;justify-content:space-between;align-items:baseline;font-family:DMSans_500Medium;font-size:14px;color:#403d4a}
.bd-cov-l b{font-family:SpaceGrotesk_700Bold;font-weight:400;font-size:22px;letter-spacing:-.4px;color:#22084a}
.bd-cov-bar{margin-top:10px;height:8px;border-radius:4px;background:#ebe1fd;overflow:hidden}
.bd-cov-bar u{display:block;width:100%;height:100%;border-radius:4px;background:linear-gradient(90deg,#7e3bed,#c6ff34);transform:scaleX(0);transform-origin:0 50%}
.bd-cov p{margin:10px 0 0;font-family:DMSans_400Regular;font-size:13px;color:#726f80}
.bd-cov s{color:#a29fb0}
.bd-cta{position:absolute;left:20px;right:20px;bottom:44px;height:56px;border-radius:18px;background:#fafafe;display:flex;align-items:center;justify-content:space-between;padding:0 9px 0 22px;font-family:DMSans_700Bold;font-size:17px;color:#22084a}
.bd-cta span{display:grid;place-items:center;width:40px;height:40px;border-radius:13px;background:#7e3bed;color:#fafafe}
.bd-cta svg{width:20px;height:20px}
`;

export function bnHeroLife(S, hero, at) {
  const q = (s) => S.one(s, hero);
  S.add((tl) => {
    tl.fromTo(q(".bn-hero-img"), { x: 40, scale: 0.92, opacity: 0 }, { x: 0, scale: 1, opacity: 1, duration: 0.7, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, at);
    tl.fromTo([q(".bn-hero-chip"), q(".bn-hero-t"), q(".bn-hero-s"), q(".bn-hero-cov"), q(".bn-hero-cta")], { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.07, immediateRender: false }, at + 0.15);
    tl.fromTo(q(".bn-hero-cov em"), { scale: 0.4 }, { scale: 1, duration: 0.45, ease: "back.out(2)", immediateRender: false, transformOrigin: "50% 50%" }, at + 0.6);
  });
}

export function bdLife(S, bd, t0) {
  const q = (s) => S.one(s, bd);
  const qa = (s) => S.all(s, bd);
  S.add((tl) => {
    tl.fromTo(q(".bd-nav"), { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", immediateRender: false }, t0 + 0.2);
    tl.fromTo(q(".bd-badge"), { scale: 0, rotation: -60 }, { scale: 1, rotation: -8, duration: 0.55, ease: "back.out(2)", immediateRender: false, transformOrigin: "50% 50%" }, t0 + 0.55);
    tl.fromTo(q(".bd-leaf"), { rotation: -30, opacity: 0 }, { rotation: 0, opacity: 1, duration: 0.5, ease: "power3.out", immediateRender: false, transformOrigin: "20% 90%" }, t0 + 0.6);
    tl.fromTo([q(".bd-chip"), q(".bd-t"), q(".bd-s")], { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.08, immediateRender: false }, t0 + 0.35);
    tl.fromTo(qa(".bd-facts>div"), { y: 24, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "power3.out", stagger: 0.08, immediateRender: false, transformOrigin: "50% 50%" }, t0 + 0.7);
    tl.fromTo(q(".bd-cov"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, t0 + 0.95);
    tl.to(q(".bd-cov-bar u"), { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, t0 + 1.2);
    tl.fromTo(q(".bd-cta"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, t0 + 1.1);
  });
  S.count(t0 + 1.2, q(".bd-cov-n"), 0, 100, (v) => Math.round(v) + "%", 1.1);
  return { fin: t0 + 2.4 };
}
