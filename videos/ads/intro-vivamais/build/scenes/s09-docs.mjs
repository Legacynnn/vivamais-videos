import { readFileSync } from "node:fs";
import { DOCS_HTML, DOCS_CSS } from "../parts/docs.mjs";

const F = "data-layout-allow-overlap";
const icon = (n) => readFileSync(new URL(`../../node_modules/lucide-static/icons/${n}.svg`, import.meta.url), "utf8").replace(/<!--[\s\S]*?-->/g, "").replace(/\s*class="[^"]*"/, "").replace("<svg", `<svg ${F}`).trim();

export default {
  id: "s09-docs",
  device: "iphone",
  vo: "l09",
  voAt: 0.3,
  tail: 0.5,
  seam: { axis: "z", dir: 1, technique: "signature plus", sig: true },
  layers: { tf: `<div class="tfade"></div>` },
  states: [["pos-skel", 0, "post-consultation preparing"], ["pos", 0, "post-consultation ready"]],
  stage: "",
  hud: DOCS_HTML,
  css: DOCS_CSS + `
.dv{left:102px;top:148px;zoom:1.28}
.ad.chip.d9{font-size:30px}
.dest{display:flex;gap:14px;align-items:center}
`,
  sfx: [
    { name: "whoosh", at: 0.0, vol: 0.4 },
    { name: "tap", at: 3.5, vol: 0.45 },
    { name: "paper", at: 3.75, vol: 0.5 },
    { name: "paper", at: 4.7, vol: 0.5 },
    { name: "paper", at: 5.85, vol: 0.5 },
    { name: "stamp", at: 6.95, vol: 0.6 },
    { name: "swoosh", at: 9.0, vol: 0.45 },
    { name: "swoosh", at: 9.95, vol: 0.45 },
  ],
  ad: [
    { key: "h", cls: "l top", style: "top:190px", text: "Documentos na **hora.**" },
    { key: "sig", cls: "chip d9", style: "left:270px;top:1306px", html: `<b ${F}>${icon("shield-check")}</b><div ${F}>Assinados <em>digitalmente</em><small ${F}>ICP-Brasil · QR de validação</small></div>` },
    { key: "far", cls: "chip d9", style: "left:150px;top:1306px", html: `<b ${F}>${icon("pill")}</b><div ${F}>Farmácia<small ${F}>Receita pronta</small></div>` },
    { key: "rh", cls: "chip d9", style: "left:530px;top:1306px", html: `<b ${F}>${icon("building-2")}</b><div ${F}>RH da empresa<small ${F}>Atestado enviado</small></div>` },
  ],
  frame: {
    title: "Os documentos chegam",
    scene: "Pós-consulta real com documentos em preparo; ficam prontos e a lista de documentos aparece; receita, pedido de exames e atestado abrem como papéis ao lado do iPhone com assinatura desenhada, selo e QR; selo ICP-Brasil; receita vai para a farmácia e o atestado para o RH",
    motion: "wipe seam, skeleton → content, scroll, tap, stacked papers swapping with a tab pill, signature draw, seal stamp, papers flying into destination pills",
    body: "O painel sobe. O pós-consulta mostra os documentos em preparo, ficam prontos e a tela rola até os documentos. Em “Receita” o dedo toca e o papel abre à direita, a assinatura se desenha e o selo bate. Pedido de exames e atestado entram por cima trocando a aba. Em “Assinados digitalmente” o selo ICP-Brasil aparece. Em “farmácia” e “RH” a receita e o atestado encolhem e voam para os seus destinos.",
  },
  run: function (S, A) {
    gsap.set(S.one(".vmk-device"), { opacity: 1 });
    S.boot("pos-skel");
    S.cam(0, { x: 201, y: 437, zoom: 1.65, ax: 540, ay: 1180, free: true }, 0.01);
    S.show(A.w("consulta") - 0.1, "pos", { fade: 0.3 });
    var pos = S.state("pos");
    var rx = S.one('[aria-label="Abrir Receita: Receita simples"]', pos);
    var ex = S.one('[aria-label="Abrir Pedido de exame: Pedido de exames"]', pos);
    var at = S.one('[aria-label="Abrir Atestado: Atestado médico"]', pos);
    var rail = rx.closest(".rn-scroll");
    var list = rail;
    while (list.parentElement && !/^Documentos/.test(list.textContent.trim())) list = list.parentElement;
    var tch = A.w("chegam") - 0.3;
    S.scroll(tch, ["pos"], 430, 0.9);
    var tfade = S.layer("tf");
    gsap.set(tfade, { autoAlpha: 0 });
    S.add(function (tl) {
      tl.fromTo(tfade, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "none", immediateRender: false }, tch + 0.1);
    });
    S.cam(tch, { x: 201, y: 500, zoom: 1.92, ax: 540, ay: 1301, free: true }, 0.9);
    S.mark(tch + 0.9, list, { hold: 0.45, pad: 4, radius: 20, noScroll: true, maxW: 362 });

    var dv = S.one(".dv");
    var papers = S.all(".dv-paper");
    var tabs = S.all(".dv-tabs span");
    var pill = S.one(".dv-tabs u");
    var tabX = [];
    var tabW = [];
    tabs.forEach(function (tb) {
      tabX.push(tb.offsetLeft);
      tabW.push(tb.offsetWidth);
    });
    papers.forEach(function (p, i) {
      gsap.set(p, { opacity: i === 0 ? 1 : 0, zIndex: 3 - i });
    });
    gsap.set(pill, { x: tabX[0] - 5, width: tabW[0] });
    function life(tl, p, t) {
      tl.fromTo(p.querySelector("img"), { scale: 1.04 }, { scale: 1, duration: 1.2, ease: "power2.out", immediateRender: false, transformOrigin: "50% 0%" }, t + 0.1);
    }
    var tr = A.w("Receita") - 0.3;
    A.rise(A.w("chegam") - 0.35, "h");
    A.out(tr - 0.15, "h", { dir: "up" });
    S.cursorEnter(tr - 0.45, rx, 0.4);
    S.click(tr, rx, { press: true });
    S.add(function (tl) {
      tl.fromTo(dv, { opacity: 0, y: 260, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out", immediateRender: false, transformOrigin: "50% 100%" }, tr + 0.1);
      tl.to(S.one(".vmk-device"), { y: 960, scale: 0.9, duration: 0.7, ease: "power3.inOut", transformOrigin: "50% 0%" }, tr + 0.05);
      tl.fromTo(papers[0], { rotation: 4, y: 40 }, { rotation: 0, y: 0, duration: 0.7, ease: "power3.out", immediateRender: false, transformOrigin: "50% 100%" }, tr + 0.1);
      life(tl, papers[0], tr + 0.1);
    });
    function toPaper(t, i, row) {
      S.cursorTo(t - 0.45, row, 0.35);
      S.click(t - 0.05, row, { press: true });
      S.add(function (tl) {
        tl.to(papers[i - 1], { x: -60, rotation: -3, opacity: 0, duration: 0.4, ease: "power3.in", transformOrigin: "50% 100%" }, t);
        tl.set(papers[i], { zIndex: 5 }, t);
        tl.fromTo(papers[i], { x: 80, rotation: 3, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, duration: 0.5, ease: "power3.out", immediateRender: false, transformOrigin: "50% 100%" }, t + 0.1);
        tl.to(pill, { x: tabX[i] - 5, width: tabW[i], duration: 0.35, ease: "power3.inOut" }, t);
        life(tl, papers[i], t);
      });
    }
    toPaper(A.w("pedido") - 0.1, 1, ex);
    var rr = S.rect(rail);
    var ar = S.rect(at);
    var slide = Math.max(0, Math.min(rail.scrollWidth - rail.clientWidth, ar.x + ar.w - (rr.x + rr.w) + 16));
    var ta = A.w("atestado") - 0.1;
    S.add(function (tl) {
      tl.fromTo(rail, { scrollLeft: 0 }, { scrollLeft: slide, duration: 0.4, ease: "power2.inOut", immediateRender: false }, ta - 0.75);
    });
    var atAt = { x: ar.x - slide, y: ar.y, w: ar.w, h: ar.h, cx: ar.cx - slide, cy: ar.cy };
    toPaper(ta, 2, atAt);
    S.cursorExit(A.w("atestado") + 0.3, "down", 0.4);
    A.pop(A.w("Assinados") - 0.1, "sig", { y: 20 });
    A.tw(function (tl) {
      var seal = papers[2].querySelector(".dv-seal");
    });
    var tf = A.w("farmácia") - 0.15;
    A.tw(function (tl) {
      tl.to(A.line("sig"), { opacity: 0, y: -16, duration: 0.4, ease: "power2.in" }, tf - 0.3);
    });
    A.pop(tf, "far", { y: 20 });
    var th = A.w("RH") - 0.25;
    A.pop(th, "rh", { y: 20 });
    A.tw(function (tl) {
      tl.to(S.one(".dv-stack"), { scale: 0.18, x: 260, y: 520, opacity: 0, duration: 0.6, ease: "power3.in", transformOrigin: "50% 50%" }, th + 0.1);
      tl.to(S.one(".dv-bar"), { opacity: 0, duration: 0.3, ease: "power2.in" }, th + 0.1);
    });
  },
};
