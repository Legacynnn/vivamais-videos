import { readFileSync } from "node:fs";
import { BN_HTML, BN_CSS, bnHeroLife } from "../parts/bn.mjs";

const F = "data-layout-allow-overlap";
const icon = (n) => readFileSync(new URL(`../../node_modules/lucide-static/icons/${n}.svg`, import.meta.url), "utf8").replace(/<!--[\s\S]*?-->/g, "").replace(/\s*class="[^"]*"/, "").replace("<svg", `<svg ${F}`).trim();
const chip = (ic, t, s) => `<b ${F}>${icon(ic)}</b><div ${F}>${t}<small ${F}>${s}</small></div>`;

export default {
  id: "s05-beneficios",
  device: "iphone",
  vo: "l05",
  voAt: 0.15,
  tail: 0.45,
  seam: { axis: "x", dir: -1, technique: "match cut: same phone, same framing", type: "match" },
  states: [["home", 0]],
  layers: { bn: BN_HTML, tf: `<div class="tfade"></div>` },
  css: BN_CSS,
  lib: [bnHeroLife],
  sfx: [
    { name: "tap", at: 2.1, vol: 0.45 },
    { name: "pop", at: 3.35, vol: 0.4 },
    { name: "pop", at: 5.4, vol: 0.4 },
    { name: "pop", at: 7.45, vol: 0.4 },
    { name: "pop", at: 8.25, vol: 0.4 },
    { name: "hit", at: 9.55, vol: 0.55 },
  ],
  ad: [
    { key: "c1", cls: "chip", style: "left:60px;top:186px;width:470px", html: chip("video", "Plantão <em>24h</em>", "Clínico geral por vídeo · −25%") },
    { key: "c2", cls: "chip", style: "left:550px;top:186px;width:470px", html: chip("stethoscope", "Especialistas <em>−25%</em>", "Cardio, derma, pediatria e mais 12") },
    { key: "c3", cls: "chip", style: "left:60px;top:318px;width:470px", html: chip("flask-conical", "Exames <em>até −40%</em>", "Laboratórios parceiros") },
    { key: "c4", cls: "chip", style: "left:550px;top:318px;width:470px", html: chip("pill", "Farmácias <em>até −35%</em>", "Genéricos com desconto") },
    { key: "big", cls: "xl top", style: "top:200px", text: "Tudo no **bolso.**" },
  ],
  frame: {
    title: "Tudo que a empresa oferece",
    scene: "Início real rola até Seus benefícios; toque revela a tela de benefícios (Plantão 24h por R$ 0,00, especialistas, exames, farmácias); cada benefício salta do celular como um cartão à direita no ritmo da narração; fecha com “Tudo no bolso.”",
    motion: "scroll with steady camera, circular reveal, inner scroll, cards breaking out of the device in a staggered cascade synced to VO, slam",
    body: "O mesmo iPhone continua do corte. O Início rola até o cartão Seus benefícios e o dedo toca. A tela de benefícios abre num círculo a partir do toque. Em “Plantão vinte e quatro horas”, “Especialistas com desconto”, “Exames, farmácias”, cada benefício é destacado na tela e salta como cartão à direita, em escada. “Tudo no bolso.” bate grande embaixo.",
  },
  run: function (S, A) {
    gsap.set(S.one(".vmk-device"), { opacity: 1 });
    A.sub("home", "Crédito da empresa", "Plano Viva+");
    A.sub("home", "R$ 300,00 de R$ 300,00", "ativo · renova 29 out");
    S.boot("home");
    S.cam(0, { x: 201, y: 437, zoom: 1.58, ax: 540, ay: 1180, free: true }, 0.01);
    S.cam(0.2, { x: 201, y: 437, zoom: 1.65, ax: 540, ay: 1180, free: true }, 1.6, "power2.inOut");
    S.scroll(0.25, ["home"], 560, 1.2);
    var card = S.pick("home", "Seus benefícios", { hit: false });
    while (card.parentElement && !/Plano Viva\+/.test(card.textContent)) card = card.parentElement;
    var tap = A.w("oferece") - 0.2;
    S.cursorEnter(tap - 0.55, card, 0.5);
    S.click(tap, card, { press: true });
    S.cursorExit(tap + 0.3, "down", 0.4);
    var bn = S.layer("bn");
    var sr = S.rect(card);
    var scrollEl = S.one(".bn-scroll", bn);
    var hero = S.one(".bn-hero", bn);
    var rest = S.all(".bn-sec, .bn-row, .bn-ph-c", bn);
    gsap.set(bn, { autoAlpha: 0 });
    var r0 = tap + 0.15;
    S.add(function (tl) {
      tl.set(bn, { autoAlpha: 1, clipPath: "circle(0px at " + sr.cx + "px " + sr.cy + "px)" }, r0);
      tl.to(bn, { clipPath: "circle(1000px at " + sr.cx + "px " + sr.cy + "px)", duration: 0.7, ease: "power3.inOut" }, r0);
      tl.fromTo(hero, { y: 40, scale: 0.96, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: "power3.out", immediateRender: false, transformOrigin: "50% 0%" }, r0 + 0.3);
      rest.forEach(function (el, i) {
        tl.fromTo(el, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, r0 + 0.45 + i * 0.04);
      });
    });
    bnHeroLife(S, hero, r0 + 0.4);

    var cov = S.one(".bn-hero-cov", bn);
    var tp = A.w("Plantão");
    S.mark(tp - 0.1, hero, { hold: 1.4, pad: 4, radius: 26 });
    var sy = 0;
    function scrollTo(at, y, d) {
      var from = sy;
      sy = y;
      S.add(function (tl) {
        tl.fromTo(scrollEl, { y: -from }, { y: -y, duration: d, ease: "power3.inOut", immediateRender: false }, at);
      });
    }
    function at(el) {
      var r = S.rect(el);
      return { x: r.x, y: r.y - sy, w: r.w, h: r.h, cx: r.cx, cy: r.cy - sy };
    }
    var rows = S.all(".bn-row", bn);
    var te = A.w("Especialistas");
    scrollTo(te - 0.55, 330, 0.6);
    var tfade = S.layer("tf");
    gsap.set(tfade, { autoAlpha: 0 });
    S.add(function (tl) {
      tl.fromTo(tfade, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "none", immediateRender: false }, te - 0.5);
    });
    S.mark(te - 0.05, rows[1], { hold: 0.9, pad: 4, radius: 18, noScroll: true, dy: -sy });
    var tx = A.w("Exames");
    S.mark(tx - 0.05, rows[2], { hold: 0.8, pad: 4, radius: 18, noScroll: true, dy: -sy });
    var tf = A.w("farmácias");
    S.mark(tf + 0.05, S.one(".bn-ph", bn), { hold: 0.7, pad: 4, radius: 18, noScroll: true, dy: -sy, maxW: 370 });

    [["c1", tp], ["c2", te], ["c3", tx], ["c4", tf]].forEach(function (c) {
      var el = A.line(c[0]);
      A.tw(function (tl) {
        tl.fromTo(el, { opacity: 0, y: 28, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, c[1] - 0.12);
      });
    });
    var tb = A.w("Tudo#1");
    scrollTo(tb - 0.1, 560, 0.8);
    A.slam(tb - 0.05, "big", { origin: "50% 50%" });
    A.tw(function (tl) {
      ["c1", "c2", "c3", "c4"].forEach(function (k, i) {
        tl.to(A.line(k), { y: -40, opacity: 0, duration: 0.4, ease: "power2.in" }, tb - 0.35 + i * 0.03);
      });
    });
    S.cam(tb - 0.2, { x: 201, y: 437, zoom: 1.74, ax: 540, ay: 1180, free: true }, 1.0, "power3.out");
    var ex = A.end + 0.1;
    A.tw(function (tl) {
      ["big"].forEach(function (k, i) {
        tl.to(A.line(k), { y: -200, opacity: 0, duration: 0.35, ease: "power3.in" }, ex + i * 0.03);
      });
    });
  },
};
