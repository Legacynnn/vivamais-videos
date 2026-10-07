import { IQ_HTML, IQ_CSS } from "../parts/iq.mjs";

export default {
  id: "s06-ia",
  device: "iphone",
  vo: "l06",
  voAt: 0.35,
  tail: 0.5,
  seam: { axis: "z", dir: 1, technique: "signature plus", sig: true },
  states: [["ficha", 0], ["home", 0]],
  layers: { iq: IQ_HTML },
  css: IQ_CSS,
  sfx: [
    { name: "whoosh", at: 0.0, vol: 0.4 },
    { name: "tap", at: 3.05, vol: 0.45 },
    { name: "pop", at: 4.5, vol: 0.35 },
  ],
  ad: [
    { key: "f1", cls: "l top", text: "Ficha **guardada.**" },
    { key: "i1", cls: "l top", text: "Dúvida? A IA **responde.**" },
  ],
  frame: {
    title: "Ficha e IA de saúde",
    scene: "Ficha de saúde real a 100% com peso, altura e IMC; volta ao Início, toque em “Dúvida sobre remédios”; chat da IA com a pergunta digitada e a resposta chegando palavra por palavra",
    motion: "violet wipe seam, count-up ring, mark, horizontal chip scroll, tap, slide-in chat, typing dots, word-by-word streaming, text swap with mask rise",
    body: "O painel violeta passa. A ficha de saúde da Ana aparece a 100%, com as medidas destacadas. Em “quando bate a dúvida” o Início rola a fileira da IA até “Dúvida sobre remédios” e o dedo toca. O chat abre, a pergunta entra, os três pontos pulsam e a resposta chega palavra por palavra em “responde na hora”.",
  },
  run: function (S, A) {
    gsap.set(S.one(".vmk-device"), { opacity: 1 });
    S.boot("ficha");
    S.cam(0, { x: 201, y: 437, zoom: 1.65, ax: 540, ay: 1180, free: true }, 0.01);
    A.rise(A.w("ficha") - 0.15, "f1");
    var pct = S.pick("ficha", "100%");
    while (pct.parentElement && !/Ficha completa/.test(pct.textContent)) pct = pct.parentElement;
    S.mark(A.w("ficha"), pct, { hold: 1.0, pad: 6, radius: 14 });
    var peso = S.pick("ficha", "Peso");
    var meds = peso;
    while (meds.parentElement && !/IMC/.test(meds.textContent)) meds = meds.parentElement;
    S.mark(A.w("guardada") - 0.1, meds, { hold: 0.55, pad: 4, radius: 18 });

    var tq = A.w("quando") - 0.2;
    A.out(tq - 0.1, "f1", { dir: "up" });
    var t = S.nav(tq, "home", { dur: 0.45 });
    var chip = S.pick("home", "Dúvida sobre remédios", { hit: false });
    var card = chip;
    while (card.parentElement && card.getBoundingClientRect().height < 70) card = card.parentElement;
    var box = card;
    while (box && box.parentElement && !(box.clientWidth > 300 && box.scrollWidth > box.clientWidth + 40)) box = box.parentElement;
    var dx = Math.max(0, card.offsetLeft - 20);
    S.add(function (tl) {
      tl.fromTo(box, { scrollLeft: 0 }, { scrollLeft: dx, duration: 0.55, ease: "power2.inOut", immediateRender: false }, t - 0.1);
    });
    var cr = S.rect(card);
    var cardAt = { x: cr.x - dx, y: cr.y, w: cr.w, h: cr.h, cx: cr.cx - dx, cy: cr.cy };
    S.cursorEnter(t + 0.1, cardAt, 0.4);
    S.click(t + 0.55, cardAt);
    S.cursorExit(t + 0.8, "down", 0.35);

    var iq = S.layer("iq");
    gsap.set(iq, { autoAlpha: 0 });
    var o = t + 0.7;
    var me = S.all(".iq-me span", iq);
    var dots = S.all(".iq-dots u", iq);
    var ans = S.one(".iq-ans", iq);
    var aw = S.all(".iq-ans p span", iq);
    gsap.set(S.one(".iq-me", iq), { opacity: 0 });
    gsap.set(S.one(".iq-dots", iq), { opacity: 0 });
    gsap.set(ans, { opacity: 0 });
    gsap.set(aw, { opacity: 0 });
    var tr = A.w("responde") - 0.35;
    S.add(function (tl) {
      tl.set(iq, { autoAlpha: 1 }, o);
      tl.fromTo(iq, { x: 402 }, { x: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, o);
      tl.fromTo(S.one(".iq-me", iq), { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out", immediateRender: false, transformOrigin: "100% 100%" }, o + 0.35);
      tl.fromTo(S.one(".iq-dots", iq), { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "none", immediateRender: false }, o + 0.7);
      dots.forEach(function (d, i) {
        tl.fromTo(d, { y: 0 }, { y: -5, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 3, immediateRender: false }, o + 0.72 + i * 0.1);
      });
      tl.to(S.one(".iq-dots", iq), { opacity: 0, height: 0, padding: 0, duration: 0.2, ease: "power2.in" }, tr - 0.05);
      tl.fromTo(ans, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out", immediateRender: false }, tr);
      aw.forEach(function (x, i) {
        tl.fromTo(x, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "none", immediateRender: false }, tr + 0.2 + i * 0.045);
      });
    });
    S.cam(o + 0.2, { x: 201, y: 420, zoom: 1.72, ax: 540, ay: 1160, free: true }, 1.4, "power2.inOut");
    A.rise(A.w("IA") - 0.2, "i1");
  },
};
