import { DOCS_HTML, DOCS_CSS } from "../parts/docs.mjs";

export default {
  id: "ch08-pos",
  device: "iphone",
  speed: 1.12,
  title: "Depois da consulta",
  lines: ["Depois da", "consulta"],
  lead: "Resumo, documentos assinados e avaliação, tudo no app.",
  tail: 0.5,
  states: [["pos-skel", 0], ["pos", 0]],
  stage: DOCS_HTML,
  css: DOCS_CSS,
  captions: [
    { title: "Carregando", body: "O resumo da consulta aparece **em segundos**." },
    { title: "Consulta concluída", body: "Médica, canal, data e **duração** no topo." },
    { title: "Resumo", body: "Afastamento, remédios e exames **num só lugar**." },
    { title: "Documentos", body: "Tudo o que a médica emitiu, **assinado digitalmente**." },
    { title: "Receita simples", body: "Pronta para a farmácia, com **QR de validação**." },
    { title: "Pedido de exames", body: "Com **preparo e indicação** para o laboratório." },
    { title: "Atestado", body: "Válido e assinado. Mande direto **para o RH**." },
    { title: "Avalie", body: "Sua nota ajuda **outros pacientes** a escolher." },
    { title: "Remédios e exames", body: "Doses, horários e **preparo dos exames**, sem decorar nada." },
    { title: "Pergunte à IA", body: "Dúvida sobre um remédio? A IA responde **com base nesta consulta**." },
    { title: "Registro completo", body: "Prontuário e a sua anamnese ficam **guardados aqui**." },
  ],
  frame: {
    title: "Depois da consulta",
    scene: "Pós-consulta em skeleton e completo, resumo, lista de documentos, documentos reais abertos ao lado do iPhone (receita, pedido de exames, atestado) e avaliação com cinco estrelas",
    poster: 14,
    motion: "skeleton → content, scroll tour, phone slides left and documents open at the right (stacked papers, signature draws, seal stamps), tab pill, star rating with confetti",
    body: "Título central. O iPhone mostra o pós-consulta carregando e depois “Consulta concluída”. A página rola pelo resumo até Documentos. Toque em Receita simples: o iPhone vai para a esquerda e a receita abre à direita como papel timbrado, com remédios, assinatura que se desenha, selo ICP-Brasil e QR de validação. Pedido de exames e Atestado entram por cima, trocando a aba. Os papéis saem e a avaliação recebe cinco estrelas com confete.",
  },
  run: function (S) {
    S.boot("pos-skel");
    try { S.setText(0, S.pick("pos", /^R\$ [\d,]+ · pago$/, { hit: false }), "R$ 79,90 · crédito da empresa"); } catch (e) {}
    S.introIn(0.05);
    S.introOut(2.9);
    var t = 3.9;
    S.cam(t - 0.2, { x: 201, y: 300, zoom: 1.5 }, 1.0);
    S.caption(t + 0.3, 0, { at: S.rect(S.pick("pos-skel", "Consulta concluída")) });
    t += 1.8;
    S.show(t, "pos", { fade: 0.35 });
    var head = S.pick("pos", "Consulta concluída");
    var headBox = head;
    while (headBox.parentElement && !/14 min/.test(headBox.textContent)) headBox = headBox.parentElement;
    S.caption(t + 0.4, 1, { at: S.rect(headBox) });
    S.mark(t + 0.6, headBox, { hold: 1.3, pad: 6, radius: 16 });
    t += 2.6;
    var res = S.pick("pos", "1 dia de afastamento", { hit: false });
    var resBox = res;
    while (resBox.parentElement && !/Glicemia/.test(resBox.textContent)) resBox = resBox.parentElement;
    S.scroll(t, ["pos"], 300, 1.0);
    S.cam(t, { x: 201, y: 480, zoom: 1.4 }, 1.0);
    S.caption(t + 0.9, 2, { at: S.rect(resBox), side: "right" });
    S.mark(t + 1.0, resBox, { hold: 1.3, pad: 4, radius: 18, noScroll: true });
    t += 2.8;
    var dip = S.pick("pos", "Dipirona 500 mg", { hit: false });
    var medBox = dip;
    while (medBox.parentElement && !/Jejum de 8 horas/.test(medBox.textContent)) medBox = medBox.parentElement;
    S.scroll(t, ["pos"], 560, 1.0);
    S.cam(t, { x: 201, y: 470, zoom: 1.4 }, 1.0);
    S.caption(t + 0.9, 8, { at: S.rect(medBox), side: "right" });
    S.mark(t + 1.0, medBox, { hold: 1.4, pad: 4, radius: 18, noScroll: true });
    t += 2.9;
    var ai = S.pick("pos", "Perguntar à IA", { hit: false });
    var aiBox = ai;
    while (aiBox.parentElement && aiBox.getBoundingClientRect().height < 70) aiBox = aiBox.parentElement;
    S.scroll(t, ["pos"], 700, 0.9);
    S.cam(t, { x: 201, y: 480, zoom: 1.4 }, 0.9);
    S.caption(t + 0.8, 9, { at: S.rect(aiBox), side: "right" });
    S.mark(t + 0.9, aiBox, { hold: 1.3, pad: 4, radius: 18, noScroll: true });
    t += 2.6;
    var rx = S.pick("pos", "Receita simples", { hit: false });
    var ex = S.pick("pos", "Pedido de exames", { hit: false });
    var at = S.pick("pos", "Atestado médico", { hit: false });
    var list = rx;
    while (list.parentElement && !/Prontuário da consulta/.test(list.textContent)) list = list.parentElement;
    S.scroll(t, ["pos"], 820, 1.1);
    S.cam(t, { x: 201, y: 520, zoom: 1.4 }, 1.1);
    S.caption(t + 1.0, 3, { at: S.rect(list) });
    S.mark(t + 1.1, list, { hold: 1.3, pad: 4, radius: 20, noScroll: true });
    t += 2.9;
    S.cursorEnter(t, rx, 0.6);
    S.click(t + 0.8, rx, { press: true });

    var dv = S.one(".dv");
    var hud = S.one(".vmk-hud");
    hud.insertBefore(dv, hud.firstChild);
    var papers = S.all(".dv-paper");
    var tabs = S.all(".dv-tabs span");
    var pill = S.one(".dv-tabs u");
    var d0 = t + 0.95;
    S.cam(d0, { x: 201, y: 437, zoom: 1.05, ax: 640 }, 1.0);
    S.captionOut(d0);
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
    function paperLife(tl, p, at) {
      tl.to(p.querySelector(".dv-sig path"), { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, at + 0.5);
      tl.fromTo(p.querySelector(".dv-seal"), { scale: 1.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out", immediateRender: false, transformOrigin: "20% 50%" }, at + 1.4);
      tl.fromTo(p.querySelector(".dv-qr"), { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "none", immediateRender: false }, at + 0.9);
      tl.fromTo(p.querySelectorAll(".dv-rx li, .dv-list li, .dv-text, .dv-box, .dv-note"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power3.out", stagger: 0.08, immediateRender: false }, at + 0.25);
    }
    (function (d0) {
      S.add(function (tl) {
        tl.fromTo(dv, { opacity: 0, x: 160 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", immediateRender: false }, d0 + 0.2);
        tl.fromTo(papers[0], { rotation: 4, y: 40 }, { rotation: 0, y: 0, duration: 0.8, ease: "power3.out", immediateRender: false, transformOrigin: "50% 100%" }, d0 + 0.2);
        paperLife(tl, papers[0], d0 + 0.2);
      });
    })(d0);
    S.caption(d0 + 1.2, 4, { at: S.rect(rx), side: "left" });
    function toPaper(t, i, row) {
      S.cursorTo(t - 0.7, row, 0.5);
      S.click(t - 0.1, row, { press: true });
      (function (t) {
        S.add(function (tl) {
          tl.to(papers[i - 1], { x: -60, rotation: -3, opacity: 0, duration: 0.45, ease: "power3.in", transformOrigin: "50% 100%" }, t);
          tl.set(papers[i], { zIndex: 5 }, t);
          tl.fromTo(papers[i], { x: 80, rotation: 3, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, duration: 0.6, ease: "power3.out", immediateRender: false, transformOrigin: "50% 100%" }, t + 0.15);
          tl.to(pill, { x: tabX[i] - 5, width: tabW[i], duration: 0.4, ease: "power3.inOut" }, t);
          paperLife(tl, papers[i], t + 0.1);
        });
      })(t);
    }
    t = d0 + 3.9;
    toPaper(t, 1, ex);
    S.caption(t + 0.3, 5, { at: S.rect(ex), side: "left" });
    t += 3.4;
    toPaper(t, 2, at);
    S.caption(t + 0.3, 6, { at: S.rect(at), side: "left" });
    t += 3.4;
    S.captionOut(t - 0.1);
    S.cursorExit(t, "down", 0.4);
    (function (t) {
      S.add(function (tl) {
        tl.to(dv, { opacity: 0, x: 140, duration: 0.5, ease: "power3.in" }, t);
      });
    })(t);
    t += 0.4;
    var reg = S.pick("pos", "Registro da consulta", { hit: false });
    var regBox = reg;
    while (regBox.parentElement && !/Sua anamnese/.test(regBox.textContent)) regBox = regBox.parentElement;
    S.scroll(t, ["pos"], 1250, 1.1);
    S.cam(t, { x: 201, y: 480, zoom: 1.4 }, 1.1);
    S.caption(t + 1.0, 10, { at: S.rect(regBox), side: "right" });
    S.mark(t + 1.1, regBox, { hold: 1.3, pad: 4, radius: 18, noScroll: true });
    t += 2.8;
    S.captionOut(t - 0.1);
    S.scroll(t, ["pos"], 5000, 1.2);
    S.cam(t, { x: 201, y: 560, zoom: 1.45 }, 1.2);
    var rate = S.pick("pos", "Como foi o atendimento?", { hit: false });
    var box = rate;
    while (box.parentElement && S.all("svg", box).length < 5) box = box.parentElement;
    var stars = S.all("svg", box).slice(-5);
    S.caption(t + 1.3, 7, { at: S.rect(box), side: "right" });
    var last = stars[4];
    S.cursorEnter(t + 1.5, last, 0.6);
    S.click(t + 2.3, last, { press: true });
    var r0 = t + 2.35;
    S.add(function (tl) {
      stars.forEach(function (st, i) {
        var at = r0 + i * 0.07;
        var parts = Array.prototype.slice.call(st.querySelectorAll("path, polygon"));
        tl.to(parts, { fill: "#7e3bed", stroke: "#7e3bed", duration: 0.12, ease: "none" }, at);
        tl.fromTo(st, { scale: 1 }, { scale: 1.35, duration: 0.14, ease: "power2.out", immediateRender: false, transformOrigin: "50% 50%" }, at);
        tl.to(st, { scale: 1, duration: 0.25, ease: "power3.out", transformOrigin: "50% 50%" }, at + 0.14);
      });
    });
    S.confetti(r0 + 0.3, S.rect(stars[2]), { count: 34, seed: 13, power: 0.6 });
    S.cursorExit(r0 + 0.9, "down", 0.4);
    S.note("rated", r0);
  },
};
