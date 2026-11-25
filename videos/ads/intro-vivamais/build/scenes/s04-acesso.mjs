import { vid } from "../parts/stock.mjs";
import { lockInner, LOCK_CSS, LOCK_IN_CSS } from "../parts/lock.mjs";

const F = "data-layout-allow-overlap";

export default {
  id: "s04-acesso",
  device: "iphone",
  vo: "l04",
  voAt: 1.4,
  tail: 0.15,
  seam: { axis: "y", dir: -1, technique: "cut-the-curve UP" },
  states: [["home-skel", 0, "client-home-company loading"], ["home", 0, "client-home-company default"]],
  layers: {
    lock: lockInner({ time: "9:41", notes: [{ title: "Bem-vinda à Viva Mais, Ana!", body: "Sua empresa liberou seu plano Viva+ Empresarial. Toque para começar." }] }),
  },
  css: LOCK_CSS + LOCK_IN_CSS + `
.ana{position:absolute;left:0;right:0;margin:0 auto;width:max-content;top:330px;display:flex;align-items:center;gap:18px;padding:14px 28px 14px 14px;border-radius:999px;background:#fff;box-shadow:0 24px 60px rgba(34,8,74,.16),0 3px 10px rgba(34,8,74,.08);font-family:"DM Sans",sans-serif}
.ana img{width:72px;height:72px;border-radius:50%;object-fit:cover}
.ana b{display:block;font-size:30px;font-weight:700;letter-spacing:-.02em;color:#17151e}
.ana span{display:block;font-size:22px;font-weight:500;color:#726f80}
`,

  hud: `<div class="vmk-cut" ${F}>${vid("phone-pickup", { id: "s04-cut", at: 0, dur: 2.85 })}<div class="shade" ${F}></div><div class="cut-t" ${F}>Para a equipe</div></div><div class="ana" ${F}><img src="assets/app/ana.jpg" alt="" ${F}><div ${F}><b ${F}>Ana Souza</b><span ${F}>Analista de Operações</span></div></div>`,
  sfx: [
    { name: "whoosh", at: 0.0, vol: 0.45 },
    { name: "notif", at: 2.85, vol: 0.7 },
    { name: "tap", at: 3.6, vol: 0.5 },
  ],
  ad: [
    { key: "t1", cls: "xl top", style: "top:180px", text: "Primeiro **acesso.**" },
  ],
  frame: {
    title: "Primeiro acesso",
    scene: "iPhone sobe com a tela bloqueada; notificação “Bem-vinda à Viva Mais, Ana!”; toque abre o app, esqueleto do Início, Início real do colaborador; à direita “Primeiro acesso.” e o cartão da Ana",
    motion: "device rise, notification drop, tap ripple, lock screen slides up, skeleton → content, mask rise, pill pop",
    body: "O iPhone sobe pela esquerda com a tela bloqueada e a notificação da Viva Mais cai. O dedo toca, a tela bloqueada sobe, o Início carrega em skeleton e entra o conteúdo real. À direita, “Primeiro acesso.” e o cartão com a foto da Ana.",
  },
  run: function (S, A) {
    var dev = S.one(".vmk-device");
    gsap.set(dev, { opacity: 1 });
    S.boot("home-skel");
    var cutEl = S.one(".vmk-cut");
    A.tw(function (tl) {
      tl.fromTo(cutEl.querySelector("video"), { scale: 1.1 }, { scale: 1, duration: 2.85, ease: "none" }, 0);
      tl.to(cutEl, { scale: 0.6, opacity: 0, borderRadius: 90, duration: 0.9, ease: "power2.inOut", transformOrigin: "50% 58%" }, 1.95);
      tl.set(cutEl, { autoAlpha: 0 }, 2.85);
    });

    var lock = S.layer("lock");
    gsap.set(lock, { autoAlpha: 1 });
    S.status(0, true, { dur: 0.01 });
    S.cam(0, { x: 201, y: 437, zoom: 1.58, ax: 540, ay: 1180, free: true }, 0.01);
    S.add(function (tl) {
      tl.fromTo(dev, { y: 900, rotation: 6 }, { y: 0, rotation: 0, duration: 0.9, ease: "power3.out", immediateRender: false, transformOrigin: "50% 100%" }, 2.2);
    });
    var note = S.one(".lk-note", lock);
    S.add(function (tl) {
      tl.fromTo(note, { y: -120, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out", immediateRender: false, transformOrigin: "50% 0%" }, 2.85);
    });
    var ana = S.one(".ana");
    gsap.set(ana, { opacity: 0 });
    A.rise(2.6, "t1");
    var ta = A.w("Ana") - 0.45;
    S.cursorEnter(ta - 0.45, note, 0.45);
    S.click(ta + 0.1, note, { press: true });
    S.add(function (tl) {
      tl.fromTo(ana, { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out", immediateRender: false, transformOrigin: "50% 100%" }, A.w("Ana") - 0.1);
      tl.to(lock, { y: -874, duration: 0.55, ease: "power3.inOut" }, ta + 0.25);
      tl.set(lock, { autoAlpha: 0 }, ta + 0.8);
    });
    S.cursorExit(ta + 0.35, "down", 0.4);
    S.show(A.w("primeira") - 0.2, "home", { fade: 0.2 });
    var ex = A.end + 0.05;
    A.out(ex, "t1", { dir: "up" });
    S.add(function (tl) {
      tl.to(ana, { opacity: 0, y: -40, duration: 0.3, ease: "power2.in" }, ex);
    });
  },
};
