export default {
  id: "ch04-anamnese",
  device: "iphone",
  title: "Conte o que sente",
  lines: ["Conte o", "que sente"],
  lead: "A anamnese leva o seu caso direto para o médico, antes da chamada.",
  speed: 1.42,
  tail: 0.9,
  states: [
    ["sucesso", 0],
    ["hub", 0],
    ["motivo", 0],
    ["motivo-typed", 0],
    ["dor", 0],
    ["dor-sheet", 0],
    ["dor-sheet-set", 0],
    ["dor-marked", 0],
    ["tempo", 0],
    ["tempo-set", 0],
    ["contexto", 0],
    ["contexto-set", 0],
    ["anexos", 0],
    ["revisao", 0],
    ["enviada", 0],
  ],
  captions: [
    { title: "Prepare o atendimento", body: "São **5 etapas curtas**. Cada peça mostra o que falta." },
    { title: "Com suas palavras", body: "Escreva o que está acontecendo, **sem termos médicos**." },
    { title: "Toque onde dói", body: "Marque no corpo. Pode marcar **mais de um lugar**." },
    { title: "Intensidade e tipo", body: "De **1 a 10**, e como é a dor: latejante, pontada, queimação..." },
    { title: "Desde quando?", body: "Quando começou e se está **melhorando ou piorando**." },
    { title: "Remédios e alergias", body: "Vem da sua **ficha de saúde**. Só confirme o que mudou." },
    { title: "Revise e envie", body: "É isso que o médico vai ler **antes de chamar você**." },
    { title: "Anamnese enviada", body: "O médico do plantão recebe seu caso **na hora**." },
  ],
  frame: {
    title: "Conte o que sente",
    scene: "Anamnese do plantão: mosaico de etapas, motivo digitado, dor marcada na cabeça com intensidade, início e evolução, medicamentos e alergias, revisão e envio",
    poster: 12,
    motion: "cursor-led action, typing, native push transitions, bottom sheet pop, attached tooltips",
    body: "Título central. Na tela Sua vaga está reservada, toque em Continuar para a anamnese abre Preparar atendimento com o mosaico de 5 etapas. Motivo é digitado; em Onde dói o toque na cabeça abre a folha de intensidade, Latejante e Confirmar marcam o ponto. Ontem e Piorando, Nenhuma alergia conhecida, Revisar anamnese, Enviar anamnese e a tela Anamnese enviada.",
  },
  run: function (S) {
    S.boot("sucesso");
    S.introIn(0.5);
    S.introOut(3.1);
    var t = 4.3;
    S.cam(t - 0.2, { x: 201, y: 520, zoom: 1.45 }, 0.9);
    var go = S.pick("sucesso", "Continuar para a anamnese");
    S.cursorEnter(t, go, 0.6);
    S.click(t + 0.75, go, { press: true });
    t = S.nav(t + 0.9, "hub", { kind: "modal" });
    S.cam(t - 0.3, { x: 201, y: 420, zoom: 1.45 }, 0.9);
    var count = S.pick("hub", "0 de 5 etapas preenchidas");
    S.caption(t + 0.1, 0, { at: S.rect(count) });
    S.mark(t + 0.3, count, { hold: 1.3, pad: 6, radius: 10 });
    var begin = S.pick("hub", "Começar");
    S.cursorTo(t + 1.4, begin, 0.6);
    S.click(t + 2.1, begin, { press: true });
    t = S.nav(t + 2.25, "motivo", { kind: "fade" });
    var box = S.one("textarea", S.state("motivo"));
    S.cam(t, { x: 201, y: 330, zoom: 1.6 }, 0.8);
    S.caption(t + 0.2, 1, { at: S.rect(box) });
    var typed = S.type(t + 0.6, box, "Dor de cabeça forte desde ontem, piora quando fico no computador.", { cps: 30 });
    S.show(typed + 0.1, "motivo-typed");
    var save = S.pick("motivo-typed", "Salvar e continuar");
    t = typed + 0.3;
    S.cursorTo(t, save, 0.6);
    S.click(t + 0.7, save, { press: true });
    t = S.nav(t + 0.85, "dor");
    S.cam(t - 0.3, { x: 201, y: 400, zoom: 1.5 }, 0.8);
    var head = { x: 201, y: 352, w: 30, h: 30, cx: 201, cy: 352 };
    S.caption(t + 0.1, 2, { at: head });
    S.cursorTo(t + 0.3, head, 0.6);
    S.click(t + 1.0, head);
    S.show(t + 1.1, "dor-sheet");
    var sheetTitle = S.pick("dor-sheet", "Cabeça");
    var sheet = sheetTitle;
    while (sheet.parentElement && !/Confirmar/.test(sheet.textContent)) sheet = sheet.parentElement;
    S.popIn(t + 1.1, sheet, { y: 480, from: 1, dur: 0.5 });
    t += 1.8;
    S.cam(t, { x: 201, y: 560, zoom: 1.5 }, 0.8);
    S.caption(t + 0.2, 3, { at: S.rect(S.pick("dor-sheet", "Moderada", { sort: "y" })) });
    var lat = S.pick("dor-sheet", "Latejante");
    S.cursorTo(t + 0.5, lat, 0.6);
    S.click(t + 1.2, lat, { press: true });
    S.show(t + 1.3, "dor-sheet-set");
    var conf = S.pick("dor-sheet-set", "Confirmar");
    S.cursorTo(t + 1.8, conf, 0.5);
    S.click(t + 2.4, conf, { press: true });
    S.show(t + 2.55, "dor-marked", { fade: 0.3 });
    t += 3.0;
    S.cam(t, { x: 201, y: 420, zoom: 1.5 }, 0.7);
    S.mark(t + 0.2, { x: 186, y: 330, w: 30, h: 30, cx: 201, cy: 345 }, { hold: 1.0, pad: 6, radius: 999 });
    var save2 = S.pick("dor-marked", "Salvar e continuar");
    S.cursorTo(t + 1.0, save2, 0.6);
    S.click(t + 1.7, save2, { press: true });
    t = S.nav(t + 1.85, "tempo");
    S.cam(t - 0.3, { x: 201, y: 560, zoom: 1.5 }, 0.8);
    var ontem = S.pick("tempo", "Ontem");
    S.caption(t + 0.1, 4, { at: S.rect(ontem.parentElement.parentElement) });
    S.cursorTo(t + 0.3, ontem, 0.5);
    S.click(t + 0.9, ontem, { press: true });
    var pior = S.pick("tempo", "Piorando");
    S.cursorTo(t + 1.3, pior, 0.5);
    S.click(t + 1.9, pior, { press: true });
    S.show(t + 1.95, "tempo-set");
    var save3 = S.pick("tempo-set", "Salvar e continuar");
    S.cursorTo(t + 2.6, save3, 0.5);
    S.click(t + 3.2, save3, { press: true });
    t = S.nav(t + 3.35, "contexto");
    S.cam(t - 0.3, { x: 201, y: 480, zoom: 1.5 }, 0.8);
    var none = S.pick("contexto", "Nenhuma alergia conhecida");
    S.caption(t + 0.1, 5, { at: S.rect(S.pick("contexto", "Nenhum medicamento contínuo.")) });
    S.cursorTo(t + 0.5, none, 0.6);
    S.click(t + 1.2, none, { press: true });
    S.show(t + 1.3, "contexto-set");
    var save4 = S.pick("contexto-set", "Salvar e continuar");
    S.cursorTo(t + 1.8, save4, 0.5);
    S.click(t + 2.4, save4, { press: true });
    t = S.nav(t + 2.55, "anexos");
    var rev = S.pick("anexos", "Revisar anamnese");
    S.cursorTo(t + 0.4, rev, 0.6);
    S.click(t + 1.1, rev, { press: true });
    t = S.nav(t + 1.25, "revisao");
    S.cam(t - 0.3, { x: 201, y: 330, zoom: 1.5 }, 0.8);
    var summary = S.pick("revisao", /^Dor de cabeça forte desde ontem/);
    var card = summary;
    while (card.parentElement && card.getBoundingClientRect().height < 130) card = card.parentElement;
    S.caption(t + 0.2, 6, { at: S.rect(card) });
    S.mark(t + 0.4, card, { hold: 1.8, pad: 4, radius: 18 });
    var send = S.pick("revisao", "Enviar anamnese");
    t += 2.6;
    S.cam(t, { x: 201, y: 560, zoom: 1.45 }, 0.8);
    S.cursorTo(t + 0.2, send, 0.6);
    S.click(t + 0.9, send, { press: true });
    t = S.nav(t + 1.05, "enviada", { kind: "fade" });
    var sent = S.pick("enviada", "Anamnese enviada");
    S.popIn(t, sent, { from: 0.9, y: 14, dur: 0.4, origin: "50% 50%" });
    S.caption(t + 0.3, 7, { at: S.rect(sent) });
    S.confetti(t + 0.1, S.rect(sent), { count: 46, seed: 5, power: 0.7 });
    var fila = S.pick("enviada", "Ir para a fila");
    S.cursorTo(t + 1.6, fila, 0.6);
    S.click(t + 2.4, fila, { press: true });
    S.note("filaTap", t + 2.4);
  },
};
