import { up, hold } from "../parts/ob.mjs";

export default {
  id: "c07-historico",
  device: "iphone",
  title: "Seu histórico",
  lines: ["Seu", "histórico"],
  lead: "Consultas, receitas, exames e atestados guardados no app.",
  tail: 0.6,
  states: [["hi-list", 0], ["hi-pos", 0], ["hi-arquivos", 0], ["hi-doc", 0]],
  patch: (name, html) => (name === "hi-doc" ? html.replace(/Júlia Andrade/g, "Camila Rocha") + `<div class="pdf-sheet" data-layout-allow-overlap><img src="assets/docs/receita.png" alt="" data-layout-allow-overlap></div>` : html),
  css: `.pdf-sheet{position:absolute;left:0;top:118px;width:402px;height:756px;background:#efedf5;z-index:30}.pdf-sheet img{position:absolute;left:14px;top:14px;width:374px;border-radius:6px;box-shadow:0 10px 30px rgba(34,8,74,.18)}`,
  lib: [up, hold],
  captions: [
    { title: "Aba Consultas", body: "Todas as suas consultas, **com data e médico**." },
    { title: "Abra uma consulta", body: "Toque para ver **o que o médico deixou** para você." },
    { title: "Resumo da consulta", body: "Orientações, **remédios** e **exames** num só lugar." },
    { title: "Arquivos", body: "Receitas, exames e atestados **separados por mês**." },
    { title: "Abra o documento", body: "Mostre a receita na farmácia **direto do celular**." },
  ],
  frame: {
    title: "Seu histórico",
    scene: "Aba Consultas com consultas passadas, pós-consulta com documentos e remédios, Arquivos e a receita real em PDF",
    poster: 12,
    motion: "chapter title cascade, phone rise, row highlights, slide navigation, page scroll, document sheet",
    body: "Passo 7 de 10. Consultas: Camila Rocha, Júlia Andrade, Rafael Lima. Toque abre “Consulta concluída” com resumo, remédios e exames. Arquivos por mês. Toque na receita abre o PDF real (modelo atual do backend) de Maria Oliveira.",
  },
  run: function (S) {
    var wide = function (n) { return n.getBoundingClientRect().width > 280; };
    S.boot("hi-list");
    S.introIn(0.05);
    S.introOut(2.9);
    S.cam(3.0, { x: 201, y: 437, zoom: 1.6 }, 0.01);
    var t = 4.0;
    S.caption(t, 0);
    var row = up(S.pick("hi-list", "Dr(a). Camila Rocha"), 80, wide);
    S.cam(t + 2.0, { x: 201, y: 330, zoom: 1.9 }, 1.0);
    S.caption(t + 3.2, 1);
    S.mark(t + 3.6, row, { hold: 2.6, pad: 4, radius: 22 });
    S.cursorTo(t + 6.0, row, 0.6);
    S.click(t + 6.7, row, { press: true });
    t = S.nav(t + 6.9, "hi-pos");
    S.cam(t, { x: 201, y: 437, zoom: 1.6 }, 1.0);
    S.caption(t - 0.2, 2);
    var stats = up(S.pick("hi-pos", /remédios$/, { sel: "*" }), 20, function (n) { return /documentos/.test(n.textContent) && /exames/.test(n.textContent); });
    S.mark(t + 0.8, stats, { hold: 2.4, pad: 6, radius: 18 });
    S.scroll(t + 3.6, ["hi-pos"], 360, 2.4);
    t += 7.4;
    t = S.nav(t, "hi-arquivos", { kind: "fade", dur: 0.6 });
    S.caption(t - 0.2, 3);
    var rx = up(S.pick("hi-arquivos", "Receita", { sort: "y" }), 50, function (n) { return wide(n) && /Camila Rocha/.test(n.textContent); });
    S.cam(t + 1.0, { x: 201, y: 330, zoom: 1.9 }, 1.0);
    S.mark(t + 1.6, rx, { hold: 2.4, pad: 4, radius: 18 });
    S.cursorTo(t + 4.2, rx, 0.6);
    S.click(t + 4.9, rx, { press: true });
    t = S.nav(t + 5.1, "hi-doc", { kind: "modal", dur: 0.6 });
    S.cam(t + 0.2, { x: 201, y: 437, zoom: 1.6 }, 1.0);
    S.caption(t - 0.2, 4);
    S.cam(t + 2.4, { x: 201, y: 250, zoom: 2.8 }, 1.8);
    hold(S, t + 6.4);
  },
};
