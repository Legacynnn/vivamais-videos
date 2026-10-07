import { BN_HTML, BN_CSS, bnHeroLife } from "../../../../kit/parts/bn.mjs";
import { PL_HTML, PL_CSS, plLife } from "../../../../kit/parts/pl.mjs";

export default {
  id: "ch02-beneficios",
  device: "iphone",
  speed: 1.15,
  title: "Seu plano, seus benefícios",
  lines: ["Seu plano,", "seus benefícios"],
  lead: "Do perfil ao plantão em três toques.",
  tail: 0.4,
  states: [["perfil", 0], ["ficha", 0]],
  layers: { bn: BN_HTML, pl: PL_HTML },
  css: BN_CSS + PL_CSS,
  lib: [bnHeroLife, plLife],
  captions: [
    { title: "Seu perfil", body: "Foto, plano e ficha de saúde. Ana usa o **Viva+ Empresarial** da empresa." },
    { title: "Crédito da empresa", body: "**R$ 300,00** por mês para consultas, pagos pela empresa." },
    { title: "Ficha de saúde", body: "Já está **100% preenchida**. Vamos conferir." },
    { title: "Medidas", body: "Peso, altura e IMC. A médica vê isso **antes da consulta**." },
    { title: "Etapas", body: "Dados básicos, hábitos, condições e documentos: tudo **preenchido**." },
    { title: "Seu plano", body: "Toque no cartão para ver **os benefícios** do plano da empresa." },
    { title: "Tudo num lugar só", body: "A tela mostra até **quanto a empresa já cobriu** em consultas." },
    { title: "Plantão 24h", body: "Clínico geral por vídeo por **R$ 0,00 para você**. A empresa paga." },
    { title: "Consultas e exames", body: "Duas consultas **grátis** no ciclo e desconto em especialistas." },
    { title: "Farmácias e crédito", body: "Até **35% em genéricos**, e R$ 300 de crédito **todo mês**." },
    { title: "Abrir o plantão", body: "Toque no cartão do Plantão e vá **direto para o atendimento**." },
    { title: "Médico online agora", body: "A tela do plantão: **6 médicos online** e espera média de 3 minutos." },
  ],
  frame: {
    title: "Seu plano, seus benefícios",
    scene: "Perfil real, cartão Seu plano, revelação da tela de benefícios com o cartão do Plantão 24h incluso, tour curto e expansão do cartão para a nova tela do plantão",
    poster: 20,
    motion: "circular reveal, staggered entrance, inner scroll tour, shared-element expand card → tela do plantão",
    body: "Título central. O iPhone mostra o Perfil com o cartão Seu plano ativo. Toque no cartão revela a tela de benefícios: hero lavanda do Plantão 24h com a ilustração do app, R$ 0,00 e 100% coberto. A tela rola por consultas, farmácias e família, volta ao hero e toca em Ver benefício: o cartão expande para a nova tela do plantão (roxa, ilustração, 6 médicos online, como funciona, Começar por R$ 0,00).",
  },
  run: function (S) {
    S.boot("perfil");
    gsap.set(S.one(".vmk-title"), { autoAlpha: 0 });
    gsap.set(S.one(".vmk-device"), { opacity: 1, y: 0, scale: 1 });
    var t = 0.6;
    var planCard = S.pick("perfil", "Seu plano");
    while (planCard.parentElement && !/Gerenciar/.test(planCard.textContent)) planCard = planCard.parentElement;
    S.cam(t - 0.2, { x: 201, y: 300, zoom: 1.5 }, 1.0);
    S.caption(t + 0.3, 0, { at: S.rect(S.pick("perfil", "Ana Souza")), side: "right" });
    t += 2.2;
    var cred = S.pick("perfil", /crédito empresa/);
    var credCard = cred;
    while (credCard.parentElement && !/Carteira|CARTEIRA/i.test(credCard.textContent)) credCard = credCard.parentElement;
    S.cam(t, { x: 201, y: 460, zoom: 1.5 }, 0.9);
    S.caption(t + 0.3, 1, { at: S.rect(cred), side: "right" });
    S.mark(t + 0.4, credCard, { hold: 1.4, pad: 4, radius: 20 });
    t += 2.4;
    var rev = S.pick("perfil", "Revisar dados");
    S.cursorEnter(t, rev, 0.6);
    S.click(t + 0.8, rev, { press: true });
    t = S.nav(t + 0.95, "ficha");
    S.cam(t - 0.3, { x: 201, y: 300, zoom: 1.5 }, 0.9);
    var pct = S.pick("ficha", "100%");
    S.caption(t + 0.3, 2, { at: S.rect(pct), side: "right" });
    S.mark(t + 0.4, pct, { hold: 1.2, pad: 6, radius: 14 });
    t += 2.2;
    var peso = S.pick("ficha", "Peso");
    var meds = peso;
    while (meds.parentElement && !/IMC/.test(meds.textContent)) meds = meds.parentElement;
    S.caption(t, 3, { at: S.rect(meds), side: "right" });
    S.mark(t + 0.1, meds, { hold: 1.3, pad: 4, radius: 18 });
    t += 2.2;
    var etapas = S.pick("ficha", "Dados básicos");
    var etBox = etapas;
    while (etBox.parentElement && !/Documentos/.test(etBox.textContent)) etBox = etBox.parentElement;
    S.cam(t, { x: 201, y: 520, zoom: 1.45 }, 0.9);
    S.caption(t + 0.3, 4, { at: S.rect(etBox), side: "right" });
    S.mark(t + 0.4, etBox, { hold: 1.4, pad: 4, radius: 18 });
    t += 2.5;
    S.captionOut(t - 0.1);
    var back = S.one('[data-state="ficha"] svg');
    S.cam(t, { x: 201, y: 300, zoom: 1.45 }, 0.8);
    S.cursorTo(t, back, 0.5);
    S.click(t + 0.6, back);
    t = S.nav(t + 0.7, "perfil", { kind: "back" });
    S.cam(t - 0.2, { x: 201, y: 330, zoom: 1.5 }, 0.8);
    S.caption(t + 0.2, 5, { at: S.rect(planCard), side: "right" });
    S.mark(t + 0.3, planCard, { hold: 1.3, pad: 4, radius: 22 });
    S.cursorTo(t + 0.5, planCard, 0.6);
    S.click(t + 1.4, planCard, { press: true });
    S.cursorExit(t + 1.9, "down", 0.4);

    var bn = S.layer("bn");
    var pl = S.layer("pl");
    var sr = S.rect(planCard);
    var scrollEl = S.one(".bn-scroll", bn);
    var bnHead = S.all(".bn-nav, .bn-eye, .bn-h1, .bn-save", bn);
    var hero = S.one(".bn-hero", bn);
    var heroImg = S.one(".bn-hero-img", bn);
    var rest = S.all(".bn-sec, .bn-row, .bn-ph-c", bn);
    gsap.set(bn, { autoAlpha: 0 });
    gsap.set(pl, { autoAlpha: 0 });
    var r0 = t + 1.5;
    S.captionOut(r0 - 0.1);
    S.add(function (tl) {
      tl.set(bn, { autoAlpha: 1, clipPath: "circle(0px at " + sr.cx + "px " + sr.cy + "px)" }, r0);
      tl.to(bn, { clipPath: "circle(1000px at " + sr.cx + "px " + sr.cy + "px)", duration: 0.75, ease: "power3.inOut" }, r0);
      bnHead.forEach(function (el, i) {
        tl.fromTo(el, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, r0 + 0.2 + i * 0.06);
      });
      tl.fromTo(hero, { y: 40, scale: 0.96, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: "power3.out", immediateRender: false, transformOrigin: "50% 0%" }, r0 + 0.42);
      rest.forEach(function (el, i) {
        tl.fromTo(el, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, r0 + 0.55 + i * 0.04);
      });
    });
    bnHeroLife(S, hero, r0 + 0.55);

    t = r0 + 0.9;
    S.cam(t, { x: 201, y: 250, zoom: 1.55 }, 0.9);
    S.caption(t + 0.4, 6, { at: S.rect(S.one(".bn-save b", bn)), side: "right" });
    t += 2.2;
    var hr = S.rect(hero);
    var hir = S.rect(heroImg);
    S.cam(t, { x: 201, y: hr.cy, zoom: 1.5 }, 0.9);
    S.caption(t + 0.4, 7, { at: S.rect(S.one(".bn-hero-cov", bn)), side: "right" });
    S.mark(t + 0.6, S.one(".bn-hero-cov", bn), { hold: 1.5, pad: 6, radius: 14 });
    t += 2.6;

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
    var rows = S.all(".bn-rows", bn);
    var meter = S.one(".bn-meter", bn);
    scrollTo(t, 400, 1.0);
    S.cam(t, { x: 201, y: 420, zoom: 1.45 }, 1.0);
    S.caption(t + 0.8, 8, { at: at(S.all(".bn-row", bn)[0]), side: "right" });
    (function (t) {
      S.add(function (tl) {
        tl.fromTo(S.all("u", meter), { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "power3.out", stagger: 0.12, immediateRender: false, transformOrigin: "0% 50%" }, t + 0.9);
      });
    })(t);
    t += 2.4;
    scrollTo(t, 760, 1.0);
    var phC = S.all(".bn-ph-c", bn);
    var fam = S.one(".bn-fam", bn);
    S.caption(t + 0.8, 9, { at: at(S.one(".bn-ph", bn)), side: "right" });
    (function (t) {
      S.add(function (tl) {
        tl.to(phC, { x: -150, duration: 1.2, ease: "power2.inOut" }, t + 1.0);
        tl.fromTo(S.all("u", fam), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.08, immediateRender: false, transformOrigin: "50% 50%" }, t + 1.4);
      });
    })(t);
    t += 2.8;
    S.captionOut(t - 0.1);
    scrollTo(t, 0, 1.1);
    S.cam(t, { x: 201, y: hr.cy + 40, zoom: 1.45 }, 1.1);
    var cta = S.one(".bn-hero-cta", bn);
    t += 1.3;
    S.caption(t, 10, { at: S.rect(cta), side: "right" });
    S.cursorEnter(t + 0.2, cta, 0.6);
    S.click(t + 1.2, cta, { press: true });
    (function (t) {
      S.add(function (tl) {
        tl.to(cta, { scale: 0.97, duration: 0.1, ease: "power2.in", transformOrigin: "50% 50%" }, t + 1.2);
        tl.to(cta, { scale: 1, duration: 0.2, ease: "power2.out", transformOrigin: "50% 50%" }, t + 1.32);
      });
    })(t);
    S.cursorExit(t + 1.6, "down", 0.4);

    var ins = function (r, rad) {
      return "inset(" + r.y + "px " + (402 - r.x - r.w) + "px " + (874 - r.y - r.h) + "px " + r.x + "px round " + rad + "px)";
    };
    var tile = S.one(".pl-tile", pl);
    var tr = S.rect(tile);
    var b0 = t + 1.45;
    S.captionOut(b0);
    S.cam(b0, { x: 201, y: 437, zoom: 1.25 }, 0.8);
    S.status(b0 + 0.25, true);
    var cr = S.rect(cta);
    var sheet = S.one(".pl-sheet", pl);
    S.add(function (tl) {
      tl.to(hero, { scale: 1.04, duration: 0.35, ease: "power2.out", transformOrigin: "50% 50%" }, b0 - 0.3);
      tl.to(S.all(".bn-hero-chip, .bn-hero-t, .bn-hero-s, .bn-hero-cov, .bn-hero-cta", bn), { opacity: 0, duration: 0.25, ease: "none" }, b0 - 0.05);
      tl.set(pl, { autoAlpha: 1, clipPath: "circle(0px at " + cr.cx + "px " + cr.cy + "px)" }, b0);
      tl.to(pl, { clipPath: "circle(1100px at " + cr.cx + "px " + cr.cy + "px)", duration: 0.85, ease: "expo.inOut" }, b0);
      tl.fromTo(tile, { x: hir.x - tr.x, y: hir.y - tr.y, scale: hir.w / tr.w, rotation: -6 }, { x: 0, y: 0, scale: 1, rotation: 0, duration: 0.9, ease: "expo.inOut", immediateRender: false, transformOrigin: "0% 0%" }, b0 + 0.05);
      tl.to(bn, { scale: 1.06, duration: 0.85, ease: "expo.inOut", transformOrigin: "50% 50%" }, b0);
      tl.set(bn, { autoAlpha: 0, scale: 1 }, b0 + 0.85);
    });
    var life = plLife(S, pl, b0 + 0.55);
    S.cam(b0 + 1.2, { x: 201, y: 400, zoom: 1.4 }, 0.9);
    S.caption(b0 + 1.9, 11, { at: S.rect(S.one(".pl-live", pl)), side: "right" });
    S.note("plantao", life.fin + 1.6);
  },
};
