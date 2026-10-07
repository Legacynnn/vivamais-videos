import { vid } from "../parts/stock.mjs";
import { noteHtml, LOCK_CSS } from "../parts/lock.mjs";

const F = "data-layout-allow-overlap";
const VA = 3.3;
const ICON = {
  cam: '<svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="13" height="12" rx="3"/><path d="M15.5 10.5l6-3.5v10l-6-3.5"/></svg>',
  mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>',
  cc: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 10.2a2.4 2.4 0 1 0 0 3.6M17 10.2a2.4 2.4 0 1 0 0 3.6"/></svg>',
  end: '<svg viewBox="0 0 24 24"><path d="M3.5 14.5c4.6-4.4 12.4-4.4 17 0l-2.4 2.6-3.6-1.6v-2.6a12 12 0 0 0-5 0v2.6l-3.6 1.6z"/></svg>',
};

export default {
  id: "s08-consulta",
  snap: "bar",
  device: "iphone",
  vo: "l08",
  voAt: 0.3,
  tail: 0.45,
  seam: { axis: "x", dir: -1, technique: "cut-the-curve LEFT" },
  states: [["fila-1", 0], ["fila-paired", 0]],
  layers: {
    ban: `<div class="bn8">${noteHtml({ title: "Dra. Camila está pronta", body: "Sua consulta do plantão começa agora. Toque para entrar." })}</div>`,
    call: `<div class="c8">
${vid("doctor-call", { id: "s08-doc", cls: "c8-v", at: VA, dur: 5.2 })}
<div class="c8-shade"></div>
<div class="c8-top"><span class="c8-rec"><i></i>Ao vivo</span><span class="c8-time">00:01</span></div>
<div class="c8-name"><b>Dra. Camila Rocha</b><span>Clínica geral · CRM-SP 184.203</span></div>
<div class="c8-pip"><img src="assets/video/paciente-a.jpg" alt=""></div>
<div class="c8-bar"><div class="c8-btn">${ICON.cam}</div><div class="c8-btn">${ICON.mic}</div><div class="c8-btn c8-on">${ICON.cc}</div><div class="c8-btn c8-end">${ICON.end}</div></div>
</div>`,
  },
  css: LOCK_CSS + `
.bn8{position:absolute;left:10px;right:10px;top:54px}
.c8{position:absolute;inset:0;background:#120f1a;overflow:hidden}
.c8-v{position:absolute;left:0;top:0;width:402px;height:874px;object-fit:cover}
.c8-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,4,24,.55) 0%,rgba(10,4,24,0) 22%,rgba(10,4,24,0) 62%,rgba(10,4,24,.75) 100%)}
.c8-top{position:absolute;left:18px;right:18px;top:62px;display:flex;justify-content:space-between;align-items:center;font-family:DMSans_500Medium;font-size:14px;color:#fff}
.c8-rec{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border-radius:999px;background:rgba(255,255,255,.16)}
.c8-rec i{width:8px;height:8px;border-radius:50%;background:#ef4444}
.c8-time{font-variant-numeric:tabular-nums}
.c8-name{position:absolute;left:20px;bottom:150px;color:#fff;font-family:DMSans_400Regular}
.c8-name b{display:block;font-family:DMSans_700Bold;font-weight:400;font-size:22px}
.c8-name span{font-size:14px;opacity:.8}
.c8-pip{position:absolute;right:16px;top:108px;width:108px;height:150px;border-radius:18px;overflow:hidden;border:2px solid rgba(255,255,255,.6);box-shadow:0 10px 24px rgba(0,0,0,.35)}
.c8-pip img{width:100%;height:100%;object-fit:cover}
.c8-bar{position:absolute;left:0;right:0;bottom:44px;display:flex;justify-content:center;gap:16px}
.c8-btn{display:grid;place-items:center;width:58px;height:58px;border-radius:50%;background:rgba(255,255,255,.18)}
.c8-btn svg{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.c8-on{background:#fff}
.c8-on svg{stroke:#17151e}
.c8-end{background:#ef4444}
.c8-end svg{fill:#fff;stroke:#fff}
`,
  sfx: [
    { name: "whoosh", at: 0.0, vol: 0.4 },
    { name: "pop", at: 1.1, vol: 0.4 },
    { name: "notif", at: 2.05, vol: 0.8 },
    { name: "tap", at: 2.95, vol: 0.45 },
    { name: "join", at: 3.3, vol: 0.5 },
  ],
  ad: [
    { key: "b1", cls: "xl top", style: "top:180px", text: "**Lembra?**" },
    { key: "b2", cls: "l top", style: "top:200px", text: "Consulta por **vídeo.**" },
  ],
  frame: {
    title: "A médica já está ali",
    scene: "Fila do plantão real (posição 1), médica encontrada; a mesma notificação do gancho cai no topo do iPhone; toque abre a chamada com a Dra. Camila em vídeo, câmera da Ana no canto, controles",
    motion: "cut-the-curve seam, pop, notification drop (callback to the hook), circular reveal into the call, push-in on the call, mask rise, text swap",
    body: "A fila mostra a Ana em primeiro e a médica é encontrada. Em “lembra?” a mesma notificação do começo cai no topo da tela e “Lembra?” bate à direita. O dedo toca, a chamada abre num círculo a partir da notificação: Dra. Camila em vídeo, a Ana no canto, legenda ligada. A câmera empurra para a chamada em “consulta por vídeo”.",
  },
  run: function (S, A) {
    gsap.set(S.one(".vmk-device"), { opacity: 1 });
    S.boot("fila-1");
    S.cam(0, { x: 201, y: 437, zoom: 1.65, ax: 540, ay: 1180, free: true }, 0.01);
    var card = S.pick("fila-1", "Sua posição na fila");
    while (card.parentElement && !/Aguardando há/.test(card.textContent)) card = card.parentElement;
    S.mark(0.2, card, { hold: Math.max(0.3, A.w("minutos") - 0.1 - 0.2 - 0.5), pad: 4, radius: 22 });
    S.show(A.w("minutos") - 0.1, "fila-paired", { fade: 0.25 });
    var ban = S.layer("ban");
    var note = S.one(".lk-note", ban);
    gsap.set(ban, { autoAlpha: 0 });
    var tl0 = A.w("lembra") - 0.15;
    S.add(function (tl) {
      tl.set(ban, { autoAlpha: 1 }, tl0);
      tl.fromTo(note, { y: -160, scale: 0.92 }, { y: 0, scale: 1, duration: 0.5, ease: "power3.out", immediateRender: false, transformOrigin: "50% 0%" }, tl0);
    });
    A.slam(A.w("lembra") - 0.05, "b1", { origin: "50% 50%" });
    var tt = A.w("médica") + 0.05;
    S.cursorEnter(tt - 0.45, note, 0.4);
    S.click(tt, note, { press: true });
    S.cursorExit(tt + 0.25, "down", 0.35);
    var call = S.layer("call");
    gsap.set(call, { autoAlpha: 0 });
    var nr = S.rect(note);
    var vc = 3.3;
    S.add(function (tl) {
      tl.to(note, { scale: 0.96, opacity: 0, duration: 0.25, ease: "power2.in", transformOrigin: "50% 0%" }, vc - 0.1);
      tl.set(call, { autoAlpha: 1, clipPath: "circle(0px at " + nr.cx + "px " + nr.cy + "px)" }, vc);
      tl.to(call, { clipPath: "circle(1000px at " + nr.cx + "px " + nr.cy + "px)", duration: 0.7, ease: "power3.inOut" }, vc);
      tl.fromTo(S.all(".c8-top, .c8-name, .c8-bar", call), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.08, immediateRender: false }, vc + 0.45);
      tl.fromTo(S.one(".c8-pip", call), { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "power3.out", immediateRender: false, transformOrigin: "100% 0%" }, vc + 0.55);
      tl.set(S.one(".c8-time", call), { textContent: "00:02" }, vc + 1.5);
      tl.set(S.one(".c8-time", call), { textContent: "00:03" }, vc + 2.5);
      tl.set(S.one(".c8-time", call), { textContent: "00:04" }, vc + 3.5);
    });
    S.status(vc + 0.3, true);
    var tc = A.w("Consulta") - 0.15;
    A.out(tc - 0.15, "b1", { dir: "up" });
    A.rise(tc + 0.25, "b2");
    S.cam(tc - 0.2, { x: 201, y: 437, zoom: 1.80, ax: 540, ay: 1180, free: true }, 1.6, "power2.inOut");
  },
};
