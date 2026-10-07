export default {
  id: "ch02-painel",
  num: "02",
  kicker: "Visão geral",
  title: "Conheça o painel",
  chip: "Visão geral",
  lead: "Tudo o que o RH usa no dia a dia fica a um clique, no menu lateral.",
  steps: ["Resumo da empresa", "Menu com cada área", "Atalhos rápidos"],
  device: "laptop",
  tail: 0.5,
  urls: { painel: "vivamais.ai/painel-empresarial/home" },
  states: [["dash-new", 0]],
  captions: [
    { step: "Resumo", title: "Os números da empresa", body: "Vidas cadastradas, vidas ativas, **créditos usados** no mês e planos vigentes." },
    { step: "Menu", title: "Cada área no menu lateral", body: "Vidas, grupos, créditos, agendamentos, relatórios e **financeiro**." },
    { step: "Vamos lá", title: "Comece pelas vidas", body: "Abra **Vidas** para cadastrar os colaboradores da empresa." },
  ],
  frame: {
    title: "Conheça o painel",
    scene: "Dashboard recém-criado: cards de resumo, passeio pelo menu lateral e clique em Vidas",
    poster: 7,
    motion: "cursor-ui-demo (Product_Intro, hover-inspect); rules coordinate-target-zoom, multi-phase-camera, css-marker-patterns (contorno nos itens), cursor-click-ripple",
    body: "Plano aberto com a coluna “02 · Conheça o painel”. A câmera entra no Dashboard “Bem-vindo, Aurora!”, destaca a fileira Total de Vidas · Vidas Ativas · Créditos Utilizados · Planos Ativos, depois fecha no menu lateral e o cursor percorre Vidas, Grupos de Assinatura, Créditos e Financeiro, cada item recebendo o contorno violeta. Termina com o clique em Vidas.",
  },
  run: function (S) {
    var d = S.state("dash-new");
    S.boot("dash-new");
    S.url(0, "painel");
    S.introIn(0.5);
    S.introOut(3.1);
    var grid = S.one("main .grid", d);
    S.cam(3.4, { x: 900, y: 330, zoom: 1.45 }, 1.2);
    S.caption(4.0, 0);
    var cards = S.all('[class*="bg-card"]', grid);
    cards.forEach(function (c, i) {
      S.mark(4.7 + i * 0.32, c, { hold: 2.1 - i * 0.32, pad: 4, radius: 16 });
    });

    var link = function (label) {
      return S.find("dash-new", "aside nav a", label);
    };
    var nav = S.one("aside nav", d);
    S.caption(7.3, 1);
    var nr = S.rect(nav);
    S.cam(7.3, { x: 560, y: nr.y + 260, zoom: 1.7 }, 1.1);
    S.cursorEnter(7.9, link("Vidas"), 0.7);
    var stops = ["Vidas", "Grupos de Assinatura", "Créditos", "Relatório de uso", "Financeiro"];
    var t = 8.6;
    stops.forEach(function (label, i) {
      if (i > 0) S.cursorTo(t - 0.34, link(label), 0.34, "power2.out");
      S.mark(t, link(label), { hold: 0.62, pad: 2, radius: 10 });
      t += 0.78;
    });
    S.caption(t + 0.1, 2);
    t = S.go(t + 0.5, link("Vidas"), { move: 0.55 });
    S.add(function (tl) {
      tl.set(link("Dashboard"), { backgroundColor: "rgba(0,0,0,0)", color: "#55516a" }, t + 0.08);
      tl.set(link("Vidas"), { backgroundColor: "#f3edff", color: "#6a24db" }, t + 0.08);
    });
  },
};
