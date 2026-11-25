import { LOCK_CSS, LOCK_IN_CSS, lockInner } from "../parts/lock.mjs";

const F = "data-layout-allow-overlap";
const NOTES = [
  { title: "Consulta amanhã, 14:00", body: "Dr. Rafael Lima · Cardiologia. Veja o resumo do agendamento.", when: "ontem" },
  { title: "Falta sua anamnese", body: "Leva 2 minutos, e a médica já chega sabendo do seu caso.", when: "13:40" },
  { title: "Dra. Camila já está na sala", body: "Sua consulta começou. Toque para entrar.", when: "agora" },
];
const MSGS = [
  "Olá, Ana! Sua consulta com Dr. Rafael Lima é amanhã, 01/10, às 14:00. Resumo: vivamais.ai/pre-consulta",
  "Ana, sua consulta começa em 15 minutos. Preencha a anamnese: vivamais.ai/anamnese",
  "A Dra. Camila já está na sala esperando você. Entre agora: vivamais.ai/sala",
];

export default {
  id: "s10-avisos",
  device: "iphone",
  states: [["home", 0, "client-home-company default"]],
  vo: "l10",
  voAt: 0.3,
  tail: 0.05,
  seam: { axis: "x", dir: -1, technique: "cut-the-curve LEFT" },
  sfx: [
    { name: "whoosh", at: 0.0, vol: 0.4 },
    { name: "notif", at: 3.0, vol: 0.7 },
    { name: "notif", at: 4.15, vol: 0.7 },
    { name: "notif", at: 6.1, vol: 0.75 },
    { name: "wa", at: 9.6, vol: 0.55 },
    { name: "wa", at: 10.2, vol: 0.45 },
    { name: "wa", at: 10.8, vol: 0.45 },
  ],
  frame: {
    title: "Nada passa batido",
    scene: "“Nada passa batido.” à esquerda; iPhone bloqueado recebe três notificações reais em escada (consulta amanhã, anamnese pendente, médica já na sala); um segundo iPhone entra com o WhatsApp da Viva Mais e as mesmas mensagens chegando",
    motion: "mask rise, notifications dropping in a staggered stack synced to VO with device nudge, second device slide-in, chat bubbles cascade, label pills",
    body: "“Nada passa batido.” sobe à esquerda. O iPhone bloqueado recebe, no ritmo da narração, o lembrete da consulta, o aviso da anamnese e o aviso de que a médica já está na sala; cada chegada dá um tranco leve no aparelho. Em “No app e no WhatsApp” um segundo iPhone desliza com a conversa da Viva Mais no WhatsApp e as três mensagens chegam em cascata.",
  },
  layers: {
    wa: `<div class="wa"><div class="wa-h"><div class="wa-back"></div><img src="assets/brand/logo.svg" alt=""><div><b>Viva Mais</b><span>Conta comercial</span></div></div><div class="wa-list">${MSGS.map((m, i) => `<div class="wa-m">${m}<i>${["ontem 18:02", "13:45", "14:00"][i]}</i></div>`).join("")}</div><div class="wa-in"><span>Mensagem</span></div></div>`,
    lock: lockInner({ time: "9:41", notes: NOTES }),
  },
  css:
    LOCK_CSS +
    LOCK_IN_CSS +
    `
.il-notes{flex-direction:column-reverse;justify-content:flex-end}
.wa{position:absolute;inset:0;background:#efeae2;font-family:"DM Sans",sans-serif}
.wa-h{position:absolute;left:0;right:0;top:0;height:112px;background:#008069;display:flex;align-items:flex-end;gap:10px;padding:0 16px 12px}
.wa-back{width:10px;height:10px;margin:0 4px 16px 2px;border-left:2.5px solid #fff;border-bottom:2.5px solid #fff;transform:rotate(45deg)}
.wa-h img{width:42px;height:42px;border-radius:50%;background:#fff}
.wa-h b{display:block;font-size:18px;font-weight:700;color:#fff}
.wa-h span{display:block;font-size:13px;color:rgba(255,255,255,.8)}
.wa-list{position:absolute;left:12px;right:56px;top:132px;display:flex;flex-direction:column;gap:12px}
.wa-m{padding:10px 12px 8px;border-radius:4px 14px 14px 14px;background:#fff;box-shadow:0 1px 1px rgba(0,0,0,.12);font-size:15.5px;line-height:1.36;color:#111b21}
.wa-m i{display:block;margin-top:4px;text-align:right;font-style:normal;font-size:11px;color:#667781}
.wa-in{position:absolute;left:10px;right:10px;bottom:34px;height:46px;border-radius:24px;background:#fff;display:flex;align-items:center;padding:0 18px;font-size:15px;color:#8696a0}
.lbl{position:absolute;left:0;right:0;margin:0 auto;width:max-content;top:456px;padding:12px 28px;border-radius:999px;background:#17151e;color:#fafafe;font-family:"DM Sans",sans-serif;font-size:34px;font-weight:700}
.lbl.b{background:#008069}
`,
  hud: `<div class="lbl a" ${F}>No app</div><div class="lbl b" ${F}>No WhatsApp</div>`,
  ad: [{ key: "h", cls: "xl top", style: "top:180px", text: "Nada passa **batido.**" }],
  run: function (S, A) {
    var dev = S.one(".vmk-device");
    gsap.set(dev, { opacity: 1 });
    S.boot("home");
    var lock = S.layer("lock");
    var wa = S.layer("wa");
    gsap.set(lock, { autoAlpha: 1 });
    gsap.set(wa, { autoAlpha: 1 });
    S.status(0, true, { dur: 0.01 });
    S.cam(0, { x: 201, y: 437, zoom: 1.5, ax: 540, ay: 1280, free: true }, 0.01);
    var notes = S.all(".lk-note", lock);
    var msgs = S.all(".wa-m", wa);
    var la = S.one(".lbl.a");
    var lb = S.one(".lbl.b");
    gsap.set(notes, { opacity: 0 });
    gsap.set(msgs, { opacity: 0 });
    gsap.set([la, lb], { opacity: 0 });
    A.rise(A.w("nada") - 0.2, "h");
    var tw = A.w("WhatsApp") - 0.6;
    S.add(function (tl) {
      [A.w("consulta"), A.w("anamnese"), A.w("médica")].forEach(function (t, i) {
        tl.fromTo(notes[i], { y: -60, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out", immediateRender: false, transformOrigin: "50% 0%" }, t - 0.15);
      });
      tl.fromTo(la, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, A.w("consulta") - 0.3);
      tl.to(la, { opacity: 0, y: -14, duration: 0.35, ease: "power2.in" }, tw - 0.1);
      tl.to(lock, { y: -874, duration: 0.8, ease: "power3.inOut" }, tw);
      tl.set(lock, { autoAlpha: 0 }, tw + 0.8);
      tl.fromTo(lb, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, tw + 0.35);
      msgs.forEach(function (m, i) {
        tl.fromTo(m, { opacity: 0, y: 18, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out", immediateRender: false, transformOrigin: "0% 0%" }, tw + 0.75 + i * 0.6);
      });
      tl.set({}, {}, tw + 4.2);
    });
    S.status(tw + 0.4, true);
  },
};
