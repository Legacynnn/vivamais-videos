export default {
  id: "ch01-inicio",
  device: "iphone",
  speed: 1.18,
  title: "Tudo começa no Início",
  lines: ["Tudo começa", "no Início"],
  lead: "Um giro pela primeira tela do app, de cima a baixo.",
  tail: 0.7,
  states: [["home-skel", 0, "client-home-company loading"], ["home", 0, "client-home-company default"]],
  captions: [
    { title: "Abre rapidinho", body: "Enquanto carrega, a tela já mostra onde fica **cada coisa**." },
    { title: "Agende em segundos", body: "Busque por **especialidade ou sintoma** e veja os horários." },
    { title: "Atalhos", body: "**Plantão**, agenda, documentos e Super IA a um toque." },
    { title: "IA de saúde", body: "Peça para a IA **explicar sua última consulta**." },
    { title: "Seu plano", body: "Viva+ Empresarial **ativo**: o plano que a sua empresa oferece." },
    { title: "Seus benefícios", body: "Crédito da empresa: **R$ 300,00** disponíveis neste mês." },
    { title: "E mais", body: "**25% de desconto** em 6 especialidades." },
    { title: "Plantão 24h", body: "Médico online **em minutos**, por vídeo ou chat." },
    { title: "Ver plano", body: "Toque para ver **tudo o que o plano cobre**." },
  ],
  frame: {
    title: "Tudo começa no Início",
    scene: "Início do colaborador em carregamento e completo: busca, atalhos, Super Inteligência, cartões do Viva+ Empresarial e Plantão 24h, toque em Ver plano",
    poster: 8,
    motion: "skeleton → conteúdo, camera-with-intent, scroll tour, horizontal card scroll, cursor-led action",
    body: "Título central. O iPhone abre com o Início carregando e o conteúdo real entra: Olá, Ana, a busca por especialidade ou sintoma, os atalhos Agendar, Plantão, Documentos e Super IA e o cartão da Super Inteligência. A tela rola até Viva+ Empresarial (Crédito R$ 300,00 e 25% de desconto) e Plantão 24h, volta e toca em Ver plano.",
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
    var home = S.state("home");
    var scr = home.querySelector(".rn-scroll");
    var yOf = function (el) {
      var sr = scr.getBoundingClientRect();
      var k = sr.height / scr.clientHeight;
      return Math.max(0, Math.round((el.getBoundingClientRect().top - sr.top) / k + scr.scrollTop - 150));
    };
    S.boot("home-skel");
    S.status(0, true, { dur: 0.01 });
    S.introIn(0.05);
    S.introOut(3.0);
    var t = 4.1;
    var skel = S.one('[aria-label="Abrir plantão 24h"]', S.state("home-skel"));
    S.cam(t - 0.2, { x: 201, y: 330, zoom: 1.5 }, 1.0);
    S.caption(t + 0.3, 0, { at: S.rect(skel) });
    t = 5.9;
    S.show(t, "home", { fade: 0.35 });
    var search = S.one('[aria-label="Buscar especialidade ou sintoma"]', home);
    var hello = S.pick("home", "Com quem você quer falar hoje?");
    S.cam(t, { x: 201, y: 230, zoom: 1.55 }, 0.9);
    S.caption(t + 0.4, 1, { at: S.rect(search), side: "right" });
    S.mark(t + 0.6, search, { hold: 1.3, pad: 4, radius: 24 });
    t += 2.6;
    var row = S.one('[aria-label="Abrir plantão 24h"]', home);
    while (row.parentElement && !/Super IA/.test(row.textContent)) row = row.parentElement;
    S.cam(t, { x: 201, y: 420, zoom: 1.55 }, 0.9);
    S.caption(t + 0.4, 2, { at: S.rect(row), side: "right" });
    S.mark(t + 0.6, row, { hold: 1.3, pad: 6, radius: 22 });
    t += 2.4;
    var ai = S.pick("home", "Tire dúvidas sobre sua saúde");
    while (ai.parentElement && !/Entenda sua consulta/.test(ai.textContent)) ai = ai.parentElement;
    S.cam(t, { x: 201, y: 580, zoom: 1.5 }, 0.8);
    S.caption(t + 0.3, 3, { at: S.rect(ai), side: "right" });
    S.mark(t + 0.5, ai, { hold: 1.2, pad: 4, radius: 22 });
    hscroll(t + 1.0, S.pick("home", "Entenda sua consulta"), 220, 1.2);
    t += 2.6;
    var credit = S.one('[aria-label^="Crédito, Crédito da empresa"]', home);
    var plan = S.one('[aria-label="Ver plano"]', home);
    var planBox = plan;
    while (planBox.parentElement && !planBox.contains(credit)) planBox = planBox.parentElement;
    S.cam(t, { x: 201, y: 437, zoom: 1.32 }, 0.9);
    S.scroll(t + 0.2, ["home"], yOf(planBox), 1.1);
    S.status(t + 0.6, false);
    S.caption(t + 1.0, 4, { at: S.rect(planBox), side: "right" });
    S.mark(t + 1.1, planBox, { hold: 1.2, pad: 4, radius: 22, noScroll: true });
    t += 2.8;
    var cr = S.rect(credit);
    S.cam(t, { x: 201, y: cr.cy, zoom: 1.7 }, 0.9);
    S.caption(t + 0.6, 5, { at: cr, side: "right" });
    S.mark(t + 0.7, credit, { hold: 1.2, pad: 4, radius: 18, noScroll: true });
    var disc = S.one('[aria-label^="Desconto, Especialistas"]', home);
    var dr = S.rect(disc);
    var dx = Math.max(0, dr.x - cr.x);
    hscroll(t + 2.3, credit, dx, 1.2);
    t += 3.7;
    var drs = { x: dr.x - dx, y: dr.y, w: dr.w, h: dr.h, cx: dr.cx - dx, cy: dr.cy };
    S.caption(t, 6, { at: drs, side: "right" });
    S.mark(t + 0.1, drs, { hold: 1.0, pad: 4, radius: 18, noScroll: true });
    hscroll(t + 1.5, credit, 0, 1.0);
    t += 2.8;
    var pl = S.one('[aria-label^="Plantão 24h, aberto agora"]', home);
    S.scroll(t, ["home"], 5000, 1.1);
    S.cam(t, { x: 201, y: 520, zoom: 1.4 }, 1.0);
    S.caption(t + 1.0, 7, { at: S.rect(pl), side: "right" });
    S.mark(t + 1.1, pl, { hold: 1.2, pad: 4, radius: 22, noScroll: true });
    t += 3.0;
    S.captionOut(t - 0.1);
    S.scroll(t, ["home"], yOf(planBox), 1.0);
    S.cam(t, { x: 201, y: 300, zoom: 1.5 }, 1.0);
    t += 1.3;
    S.caption(t, 8, { at: S.rect(plan), side: "right" });
    S.cursorEnter(t + 0.3, plan, 0.6);
    S.click(t + 1.4, plan, { press: true });
    S.note("plano", t + 1.4);
  },
};
