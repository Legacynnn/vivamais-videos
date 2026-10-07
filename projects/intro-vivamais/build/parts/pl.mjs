import { BN_ICON } from "./bn.mjs";

const ILL = "assets/illustrations/plantao-24h.webp";
const I = (inner) => `<svg viewBox="0 0 28 28" fill="none">${inner}</svg>`;
const PICO = {
  cam: I('<rect x="3" y="7.5" width="15" height="13" rx="3.5" fill="#ebe1fd" stroke="#17151e" stroke-width="1.9"/><path d="M18 12l6.5-3.5v11L18 16" fill="#c6ff34" stroke="#17151e" stroke-width="1.9" stroke-linejoin="round"/><circle cx="8.5" cy="13" r="2" fill="#7e3bed"/>'),
  clip: I('<rect x="6" y="5" width="16" height="19" rx="3" fill="#fafafe" stroke="#17151e" stroke-width="1.9"/><rect x="10" y="3" width="8" height="4.5" rx="1.5" fill="#c6ff34" stroke="#17151e" stroke-width="1.6"/><path d="M10 13h8M10 17.5h5" stroke="#7e3bed" stroke-width="2" stroke-linecap="round"/>'),
  docs: I('<path d="M8 4h9l5 5v15H8z" fill="#ebe1fd" stroke="#17151e" stroke-width="1.9" stroke-linejoin="round"/><path d="M17 4v5h5" stroke="#17151e" stroke-width="1.9" stroke-linejoin="round"/><circle cx="18.5" cy="18.5" r="4.5" fill="#c6ff34" stroke="#17151e" stroke-width="1.6"/><path d="M16.6 18.6l1.4 1.4 2.6-3" stroke="#17151e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'),
};
const STEPS = [
  ["cam", "Escolha vídeo ou chat", "Você decide como falar com o médico."],
  ["clip", "Conte o que sente", "Anamnese rápida: ele chega sabendo do seu caso."],
  ["docs", "Receba os documentos", "Receita, atestado e exames direto no app."],
];
const DOCS = ["camila", "rafael", "julia"];

export const PL_HTML = `<div class="pl">
<div class="pl-top"><div class="pl-aura"></div>
<div class="pl-nav"><div class="pl-back">${BN_ICON.chev}</div><span>Plantão</span></div>
<div class="pl-chip"><i></i>Incluso no seu plano Viva+</div>
<h1 class="pl-t">Médico online agora</h1>
<p class="pl-s">Clínico geral por vídeo ou chat, sem agendar.</p>
<div class="pl-tile"><img class="pl-img" src="${ILL}" alt=""><div class="pl-badge"><b>24h</b><span>online</span></div></div>
</div>
<div class="pl-sheet">
<div class="pl-live"><div class="pl-avs">${DOCS.map((d) => `<img src="assets/doctors/${d}.jpg" alt="">`).join("")}</div><div class="pl-live-b"><b><u></u>6 médicos online</b><span>Espera média de <em>3 min</em></span></div><div class="pl-live-p">agora</div></div>
<div class="pl-facts"><div><b>−25%</b><span>com o plano</span></div><div><b>24h</b><span>todos os dias</span></div><div><b>R$ 59,90</b><span>para você</span></div></div>
<div class="pl-sec">Como funciona</div>
<div class="pl-steps">${STEPS.map(([ic, t, s], i) => `<div class="pl-step"><i>${PICO[ic]}</i><div><b>${t}</b><span>${s}</span></div><em>${i + 1}</em></div>`).join("")}</div>
<div class="pl-cta">Começar agora<span>${BN_ICON.arrow}</span></div>
<p class="pl-foot">Pix ou cartão, direto no app</p>
</div>
</div>`;

export const PL_CSS = `
.pl{position:absolute;inset:0;background:#fafafe;overflow:hidden}
.pl *{box-sizing:border-box}
.pl-top{position:absolute;left:0;top:0;width:402px;height:372px;background:#22084a;overflow:hidden}
.pl-aura{position:absolute;right:-160px;top:-140px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(157,107,242,.55) 0%,rgba(126,59,237,.18) 44%,rgba(34,8,74,0) 70%)}
.pl-nav{position:absolute;left:10px;top:60px;height:44px;display:flex;align-items:center;gap:4px;font-family:DMSans_500Medium;font-size:15px;color:#d6c3fb}
.pl-back{display:grid;place-items:center;width:44px;height:44px;color:#fafafe}
.pl-back svg{width:24px;height:24px;transform:rotate(180deg)}
.pl-chip{position:absolute;left:20px;top:118px;display:flex;align-items:center;gap:8px;height:28px;padding:0 12px 0 10px;border-radius:999px;background:rgba(250,250,254,.12);font-family:DMSans_500Medium;font-size:13px;color:#fafafe}
.pl-chip i{width:8px;height:8px;border-radius:50%;background:#c6ff34}
.pl-t{position:absolute;left:20px;top:160px;width:214px;margin:0;font-family:SpaceGrotesk_700Bold;font-size:31px;line-height:1.02;letter-spacing:-.9px;color:#fafafe}
.pl-s{position:absolute;left:20px;top:236px;width:200px;margin:0;font-family:DMSans_400Regular;font-size:15px;line-height:21px;color:#d6c3fb}
.pl-tile{position:absolute;right:18px;top:132px;width:140px;height:140px}
.pl-img{position:absolute;inset:0;width:140px;height:140px;border-radius:30px;object-fit:cover;box-shadow:0 26px 50px rgba(10,2,30,.45)}
.pl-badge{position:absolute;right:-14px;top:-12px;display:flex;flex-direction:column;align-items:center;justify-content:center;width:60px;height:60px;border-radius:50%;background:#c6ff34;box-shadow:0 0 0 3px #22084a;transform:rotate(-8deg)}
.pl-badge b{font-family:SpaceGrotesk_700Bold;font-weight:400;font-size:17px;line-height:1;letter-spacing:-.4px;color:#17151e}
.pl-badge span{font-family:DMSans_700Bold;font-size:9px;letter-spacing:.8px;text-transform:uppercase;color:#17151e}
.pl-sheet{position:absolute;left:0;top:340px;width:402px;height:534px;border-radius:32px 32px 0 0;background:#fafafe;padding:22px 20px 0}
.pl-live{display:flex;align-items:center;gap:12px;height:68px;padding:0 14px 0 12px;border-radius:20px;background:#fff;box-shadow:0 0 0 1px #ebe1fd,0 10px 24px rgba(53,14,111,.07)}
.pl-avs{display:flex}
.pl-avs img{width:36px;height:36px;border-radius:50%;object-fit:cover;margin-left:-10px;box-shadow:0 0 0 2.5px #fff}
.pl-avs img:first-child{margin-left:0}
.pl-live-b{flex:1;display:flex;flex-direction:column;gap:2px}
.pl-live-b b{display:flex;align-items:center;gap:7px;font-family:DMSans_700Bold;font-weight:400;font-size:15px;color:#17151e}
.pl-live-b u{width:8px;height:8px;border-radius:50%;background:#8cc900;box-shadow:0 0 0 3px #e4ff94}
.pl-live-b span{font-family:DMSans_400Regular;font-size:13px;color:#726f80}
.pl-live-b em{font-style:normal;font-family:DMSans_700Bold;color:#5719b6}
.pl-live-p{padding:5px 10px;border-radius:999px;background:#f1ffc6;font-family:DMSans_700Bold;font-size:12px;color:#46650c}
.pl-facts{margin-top:12px;display:flex;gap:10px}
.pl-facts>div{flex:1;height:64px;border-radius:18px;background:#f3edff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
.pl-facts b{font-family:SpaceGrotesk_700Bold;font-weight:400;font-size:19px;letter-spacing:-.4px;color:#22084a}
.pl-facts span{font-family:DMSans_400Regular;font-size:12px;color:#726f80}
.pl-sec{margin-top:22px;font-family:DMSans_700Bold;font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:#726f80}
.pl-steps{margin-top:6px}
.pl-step{display:flex;align-items:center;gap:14px;height:62px;box-shadow:inset 0 -1px 0 #e6e4ec}
.pl-step:last-child{box-shadow:none}
.pl-step>i{flex:none;display:grid;place-items:center;width:40px;height:40px;border-radius:13px;background:#fff;box-shadow:0 0 0 1px #ebe1fd}
.pl-step>i svg{width:26px;height:26px}
.pl-step>div{flex:1;display:flex;flex-direction:column;gap:2px}
.pl-step b{font-family:DMSans_500Medium;font-weight:400;font-size:15px;color:#17151e}
.pl-step span{font-family:DMSans_400Regular;font-size:12.5px;color:#726f80}
.pl-step em{font-style:normal;font-family:SpaceGrotesk_700Bold;font-size:13px;color:#a29fb0}
.pl-cta{position:absolute;left:20px;right:20px;bottom:64px;height:56px;border-radius:18px;background:#7e3bed;display:flex;align-items:center;justify-content:space-between;padding:0 9px 0 22px;font-family:DMSans_700Bold;font-size:17px;color:#fafafe;box-shadow:0 14px 30px rgba(126,59,237,.35)}
.pl-cta span{display:grid;place-items:center;width:40px;height:40px;border-radius:13px;background:#fafafe;color:#7e3bed}
.pl-cta svg{width:20px;height:20px}
.pl-foot{position:absolute;left:0;right:0;bottom:36px;margin:0;text-align:center;font-family:DMSans_400Regular;font-size:12.5px;color:#726f80}
`;

export function plLife(S, pl, t0) {
  const q = (s) => S.one(s, pl);
  const qa = (s) => S.all(s, pl);
  S.add((tl) => {
    tl.fromTo(q(".pl-nav"), { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", immediateRender: false }, t0 + 0.1);
    tl.fromTo([q(".pl-chip"), q(".pl-t"), q(".pl-s")], { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.08, immediateRender: false }, t0 + 0.2);
    tl.fromTo(q(".pl-badge"), { scale: 0, rotation: -60 }, { scale: 1, rotation: -8, duration: 0.55, ease: "back.out(2)", immediateRender: false, transformOrigin: "50% 50%" }, t0 + 0.55);
    tl.fromTo(q(".pl-sheet"), { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", immediateRender: false }, t0 + 0.35);
    tl.fromTo(qa(".pl-avs img"), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.08, immediateRender: false, transformOrigin: "50% 50%" }, t0 + 0.7);
    tl.fromTo(qa(".pl-facts>div"), { y: 20, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "power3.out", stagger: 0.07, immediateRender: false, transformOrigin: "50% 50%" }, t0 + 0.85);
    tl.fromTo(qa(".pl-step"), { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.09, immediateRender: false }, t0 + 1.0);
    tl.fromTo([q(".pl-cta"), q(".pl-foot")], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.06, immediateRender: false }, t0 + 1.15);
    for (let k = 0; k < 3; k++) {
    }
  });
  return { fin: t0 + 1.8 };
}
