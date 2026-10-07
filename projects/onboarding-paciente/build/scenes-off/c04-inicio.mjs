import { up, hold } from "../parts/ob.mjs";

export default {
  id: "c04-inicio",
  device: "iphone",
  title: "A tela Início",
  lines: ["A tela", "Início"],
  lead: "É a primeira tela do app. Tudo começa por aqui.",
  tail: 0.6,
  states: [["home", 0]],
  lib: [up, hold],
  captions: [
    { title: "Buscar médico", body: "Digite a **especialidade** ou o nome do médico." },
    { title: "Atalhos", body: "**Plantão**, agenda, documentos e parceiros a um toque." },
    { title: "Assistente de IA", body: "Tire dúvidas de saúde **a qualquer hora**." },
    { title: "Sua próxima consulta", body: "Quando você marcar, ela **aparece aqui**." },
    { title: "Seu plano", body: "Toque para ver **seus benefícios** de novo." },
    { title: "Menu de baixo", body: "Início, **Consultas**, IA, Plantão e Ações. Sempre na tela." },
  ],
  frame: {
    title: "A tela Início",
    scene: "Tour pela home real: busca, atalhos, IA, próxima consulta, plano e menu inferior",
    poster: 8,
    motion: "chapter title cascade, phone rise, camera push to each block, page scroll, highlights",
    body: "Passo 4 de 10. Bom dia, Maria. Busca de médico, atalhos (Plantão, Agenda, Documentos, Parceiros), cartão da IA, próxima consulta, Seu plano e o menu de baixo.",
  },
  run: function (S) {
    S.boot("home");
    S.introIn(0.05);
    S.introOut(2.9);
    S.cam(3.0, { x: 201, y: 437, zoom: 1.6 }, 0.01);
    var wide = function (n) { return n.getBoundingClientRect().width > 300; };
    var t = 4.2;
    var search = up(S.pick("home", "Agende sua consulta"), 110, wide);
    S.cam(t, { x: 201, y: 300, zoom: 1.95 }, 1.0);
    S.caption(t + 0.4, 0);
    S.mark(t + 0.8, search, { hold: 3.0, pad: 4, radius: 26 });
    t += 4.0;
    var quick = up(S.pick("home", "Documentos", { sort: "y" }), 60, function (n) { return /Parceiros/.test(n.textContent); });
    S.cam(t, { x: 201, y: 420, zoom: 1.95 }, 1.0);
    S.caption(t + 0.4, 1);
    S.mark(t + 0.8, quick, { hold: 3.0, pad: 6, radius: 22 });
    t += 4.0;
    var ai = up(S.pick("home", "Entenda sua consulta"), 70, wide);
    S.cam(t, { x: 201, y: 520, zoom: 1.95 }, 1.0);
    S.caption(t + 0.4, 2);
    S.mark(t + 0.8, ai, { hold: 3.0, pad: 4, radius: 22 });
    t += 4.0;
    S.cam(t, { x: 201, y: 437, zoom: 1.6 }, 1.0);
    S.scroll(t + 0.2, ["home"], 330, 1.6);
    var next = up(S.pick("home", "Nenhuma consulta agendada", { hit: false }), 60, wide);
    S.caption(t + 1.0, 3);
    S.mark(t + 1.6, next, { hold: 3.0, pad: 4, radius: 22, noScroll: true });
    t += 4.4;
    var plan = up(S.pick("home", "Viva+ Empresarial", { hit: false }), 50, wide);
    S.caption(t + 0.4, 4);
    S.mark(t + 0.8, plan, { hold: 3.0, pad: 4, radius: 20 });
    t += 4.0;
    var tabs = up(S.pick("home", "Ações", { last: true }), 50, function (n) { return /Consultas/.test(n.textContent) && /Plantão/.test(n.textContent); });
    S.cam(t, { x: 201, y: 650, zoom: 1.8 }, 1.0);
    S.caption(t + 0.4, 5);
    S.mark(t + 0.8, tabs, { hold: 2.6, pad: 4, radius: 34, noScroll: true });
    hold(S, t + 4.4);
  },
};
