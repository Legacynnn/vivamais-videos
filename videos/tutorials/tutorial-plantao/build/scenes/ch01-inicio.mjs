export default {
  id: "ch01-inicio",
  device: "iphone",
  speed: 1.18,
  title: "Tudo começa no Início",
  lines: ["Tudo começa", "no Início"],
  lead: "Um giro pela primeira tela do app, de cima a baixo.",
  tail: 0.7,
  states: [["home-skel", 0], ["home", 0]],
  captions: [
    { title: "Abre rapidinho", body: "Enquanto carrega, a tela já mostra onde fica **cada coisa**." },
    { title: "Agende em segundos", body: "Busque por médico ou toque numa **especialidade**." },
    { title: "Atalhos", body: "**Plantão**, agenda, documentos e parceiros a um toque." },
    { title: "IA de saúde", body: "Peça para a IA **explicar sua última consulta**." },
    { title: "Sua agenda", body: "Consultas marcadas aparecem aqui. Hoje, **nenhuma**." },
    { title: "Seu plano", body: "Viva+ Empresarial **ativo**: o plano que a sua empresa oferece." },
    { title: "Seus benefícios", body: "Crédito da empresa: **R$ 300,00** disponíveis neste mês." },
    { title: "E mais", body: "Consultas **grátis** com clínico geral e **25%** em outras especialidades." },
    { title: "Seus médicos", body: "Quem já te atendeu fica **a um toque** de uma nova consulta." },
    { title: "Parceiros", body: "Farmácias com **até 35%** de desconto para quem tem plano." },
    { title: "Perfil", body: "Toque no avatar para ver **plano, carteira e ficha**." },
  ],
  frame: {
    title: "Tudo começa no Início",
    scene: "Home em skeleton, home completa, giro pela busca, especialidades, atalhos e IA, rolagem por agenda, plano, médicos e parceiros, toque no avatar",
    poster: 8,
    motion: "sequenced-ui-life (skeleton → conteúdo), camera-with-intent, long scroll tour, cursor-led action",
    body: "Título central. O iPhone abre com a home em skeleton e o conteúdo real entra. A câmera passa pela busca e pelas especialidades, pelos atalhos e pelo cartão de IA. A tela rola por Sua agenda, Seu plano, Seus médicos e Em destaque, volta ao topo e toca no avatar.",
  },
  run: function (S) {
    function hscroll(at, el, dx, d) {
      var c = el;
      while (c && c.parentElement && !(c.clientWidth > 300 && c.scrollWidth > c.clientWidth + 40)) c = c.parentElement;
      var box = c;
      S.add(function (tl) {
        tl.to(box, { scrollLeft: dx, duration: d, ease: "power2.inOut" }, at);
      });
      return box;
    }
    S.boot("home-skel");
    S.introIn(0.05);
    S.introOut(3.0);
    var t = 4.1;
    S.cam(t - 0.2, { x: 201, y: 330, zoom: 1.5 }, 1.0);
    S.caption(t + 0.3, 0, { at: S.rect(S.pick("home-skel", "Agende sua consulta")) });
    t = 5.9;
    S.show(t, "home", { fade: 0.35 });
    var book = S.pick("home", "Agende sua consulta");
    var bookCard = book;
    while (bookCard.parentElement && bookCard.getBoundingClientRect().height < 120) bookCard = bookCard.parentElement;
    S.caption(t + 0.4, 1, { at: S.rect(bookCard), side: "right" });
    S.mark(t + 0.6, bookCard, { hold: 1.1, pad: 4, radius: 24 });
    var chip = S.pick("home", "Dermatologia");
    var chips = chip;
    while (chips.parentElement && !/Pediatria/.test(chips.textContent)) chips = chips.parentElement;
    S.mark(t + 1.9, chips, { hold: 0.9, pad: 4, radius: 18 });
    hscroll(t + 2.0, chip, 260, 1.4);
    t += 3.6;
    var quick = S.pick("home", "Documentos", { sort: "y" });
    var row = quick;
    while (row.parentElement && !/Parceiros/.test(row.textContent)) row = row.parentElement;
    S.cam(t, { x: 201, y: 470, zoom: 1.55 }, 0.9);
    S.caption(t + 0.4, 2, { at: S.rect(row), side: "right" });
    S.mark(t + 0.6, row, { hold: 1.3, pad: 6, radius: 22 });
    t += 2.4;
    var ai = S.pick("home", "Entenda sua consulta");
    var aiCard = ai;
    while (aiCard.parentElement && aiCard.getBoundingClientRect().height < 80) aiCard = aiCard.parentElement;
    S.cam(t, { x: 201, y: 580, zoom: 1.55 }, 0.8);
    S.caption(t + 0.3, 3, { at: S.rect(aiCard), side: "right" });
    t += 2.2;
    S.cam(t, { x: 201, y: 437, zoom: 1.32 }, 0.9);
    S.scroll(t + 0.3, ["home"], 330, 1.1);
    var none = S.pick("home", "Nenhuma consulta agendada");
    var noneCard = none;
    while (noneCard.parentElement && noneCard.getBoundingClientRect().height < 60) noneCard = noneCard.parentElement;
    S.caption(t + 1.0, 4, { at: S.rect(noneCard), side: "right" });
    t += 2.4;
    S.scroll(t, ["home"], 560, 1.1);
    var plan = S.pick("home", "Viva+ Empresarial", { hit: false });
    var planRow = plan;
    while (planRow.parentElement && planRow.getBoundingClientRect().height < 56) planRow = planRow.parentElement;
    var planCard = planRow;
    while (planCard.parentElement && !/Farmácias parceiras/.test(planCard.textContent)) planCard = planCard.parentElement;
    S.caption(t + 1.0, 5, { at: S.rect(planRow), side: "right" });
    S.mark(t + 1.1, planCard, { hold: 1.2, pad: 4, radius: 22, noScroll: true });
    t += 2.8;
    var bcard = S.pick("home", "Crédito da empresa", { hit: false });
    var bcardBox = bcard;
    while (bcardBox.parentElement && !/R\$ 300,00 de R\$ 300,00/.test(bcardBox.textContent)) bcardBox = bcardBox.parentElement;
    bcardBox.style.width = "292px";
    bcardBox.style.minWidth = "292px";
    bcardBox.style.maxWidth = "none";
    S.all("*", bcardBox).forEach(function (el) {
      if (el.children.length === 0 && el.textContent.trim()) {
        el.style.whiteSpace = "normal";
        el.style.textOverflow = "clip";
        el.style.maxWidth = "none";
        el.style.webkitLineClamp = "unset";
        el.style.display = "block";
      }
    });
    var br = S.rect(bcardBox);
    var c2 = S.pick("home", "Clínico Geral", { hit: false });
    while (c2.parentElement && !/2 de 2/.test(c2.textContent)) c2 = c2.parentElement;
    var r2 = S.rect(c2);
    S.cam(t, { x: 201, y: br.cy, zoom: 1.85 }, 0.9);
    S.caption(t + 0.6, 6, { at: br, side: "right" });
    S.mark(t + 0.7, bcardBox, { hold: 1.25, pad: 4, radius: 18, noScroll: true });
    var dx1 = Math.max(0, r2.x - br.x);
    hscroll(t + 2.4, bcard, dx1, 1.3);
    t += 3.9;
    var r2s = { x: r2.x - dx1, y: r2.y, w: r2.w, h: r2.h, cx: r2.cx - dx1, cy: r2.cy };
    S.caption(t, 7, { at: r2s, side: "right" });
    S.mark(t + 0.1, r2s, { hold: 0.95, pad: 4, radius: 18, noScroll: true });
    hscroll(t + 1.5, bcard, dx1 + r2.w + 12, 1.2);
    t += 3.0;
    S.cam(t, { x: 201, y: 437, zoom: 1.32 }, 0.9);
    S.scroll(t, ["home"], 960, 1.2);
    var docs = S.pick("home", "Seus médicos");
    var docsRow = S.pick("home", "Dr. Camila Rocha");
    while (docsRow.parentElement && !/Dr\. Mariana Costa/.test(docsRow.textContent)) docsRow = docsRow.parentElement;
    var docCard = S.pick("home", "Dr. Camila Rocha");
    while (docCard.parentElement && docCard.getBoundingClientRect().height < 120) docCard = docCard.parentElement;
    S.caption(t + 1.1, 8, { at: S.rect(docCard), side: "right" });
    S.mark(t + 1.2, docCard, { hold: 1.0, pad: 4, radius: 20, noScroll: true });
    hscroll(t + 2.65, S.pick("home", "Dr. Camila Rocha"), 300, 1.1);
    t += 3.6;
    S.scroll(t, ["home"], 1340, 1.2);
    var feat = S.pick("home", "Em destaque");
    var featRow = S.pick("home", "Drogaria Vida");
    while (featRow.parentElement && !/Pague Saúde/.test(featRow.textContent)) featRow = featRow.parentElement;
    var featCard = S.pick("home", "Drogaria Vida");
    while (featCard.parentElement && featCard.getBoundingClientRect().height < 100) featCard = featCard.parentElement;
    S.caption(t + 1.1, 9, { at: S.rect(featCard), side: "right" });
    S.mark(t + 1.2, featCard, { hold: 1.0, pad: 4, radius: 20, noScroll: true });
    hscroll(t + 2.65, S.pick("home", "Drogaria Vida"), 320, 1.1);
    t += 3.6;
    S.captionOut(t - 0.1);
    S.scroll(t, ["home"], 0, 1.2, "power3.inOut");
    S.cam(t, { x: 201, y: 300, zoom: 1.5 }, 1.2);
    var avBtn = S.all('[data-state="home"] img').filter(function (im) {
      var r = S.rect(im);
      return r.y < 130 && r.x < 100 && r.w > 26 && r.w < 70;
    })[0];
    while (avBtn.parentElement && avBtn.getBoundingClientRect().width < 36) avBtn = avBtn.parentElement;
    t += 1.4;
    S.caption(t, 10, { at: S.rect(avBtn), side: "right" });
    S.mark(t + 0.1, avBtn, { hold: 1.2, pad: 6, radius: 999, noScroll: true });
    S.cursorEnter(t + 0.3, avBtn, 0.6);
    S.click(t + 1.4, avBtn, { press: true });
    S.note("perfil", t + 1.4);
  },
};
