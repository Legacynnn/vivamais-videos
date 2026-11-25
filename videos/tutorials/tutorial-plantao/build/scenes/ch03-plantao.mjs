export default {
  id: "ch03-plantao",
  device: "iphone",
  speed: 1.2,
  title: "Médico online agora",
  lines: ["Médico", "online agora"],
  lead: "Sem agendar: clínico geral 24h, por vídeo ou chat.",
  tail: 0.4,
  css: `.vmk-state[data-state="credito"]{background:#3a3747}.vmk-state[data-state="credito"] .vmk-lib{top:58px;height:816px;border-radius:14px 14px 0 0;overflow:hidden}`,
  states: [["hub", 0, "plantao-hub video"], ["hub-chat", 0, "plantao-hub chat"], ["checkout", 0, "plantao-checkout default"], ["checkout-credito", 0, "plantao-checkout credit"], ["credito", 0, "plantao-pay credit"]],
  captions: [
    { title: "Plantão aberto 24h", body: "Clínico geral **a qualquer hora**, com atendimento em minutos." },
    { title: "Vídeo ou chat", body: "Escolha como quer falar. Aqui vamos de **consulta por vídeo**." },
    { title: "Entrar", body: "A empresa dá **R$ 300,00** de crédito por mês para consultas." },
    { title: "Valores", body: "R$ 79,90 com o desconto do plano: você paga **R$ 59,90**." },
    { title: "Crédito da empresa", body: "Sem Pix, sem cartão: **o limite do seu benefício**." },
    { title: "Limite do mês", body: "R$ 300,00 disponíveis. Depois da consulta sobram **R$ 240,10**." },
    { title: "Confirmar", body: "Um toque e o app **verifica seu crédito** para reservar sua vaga." },
  ],
  frame: {
    title: "Médico online agora",
    scene: "Aba Plantão com o card Plantão aberto 24h e a médica, cards com foto de Vídeo e Chat, Entrar, Confirmar com desconto do plano e crédito da empresa",
    poster: 8,
    motion: "native push transitions, camera-with-intent, cursor-led action, attached tooltips",
    body: "Título central. O iPhone mostra a aba Plantão: o card escuro Plantão aberto 24h com a médica e, abaixo, Como quer ter sua consulta? com as fotos de Vídeo e Chat. Chat é tocado, depois Vídeo, e Entrar abre Confirmar: Plantão 24h R$ 79,90, desconto do plano −R$ 20,00, total R$ 59,90. Crédito da empresa é escolhido, Pagar abre a folha Pagar com crédito da empresa (R$ 300,00 disponíveis, sobram R$ 240,10) e Confirmar · R$ 59,90 é tocado.",
  },
  run: function (S) {
    S.boot("hub");
    S.introIn(0.05);
    S.introOut(2.9);
    var t = 3.7;
    var hub = S.state("hub");
    var hero = S.pick("hub", "Plantão aberto 24h");
    while (hero.parentElement && hero.getBoundingClientRect().height < 160) hero = hero.parentElement;
    S.cam(t, { x: 201, y: 260, zoom: 1.5 }, 1.0);
    S.caption(t + 0.5, 0, { at: S.rect(hero), side: "right" });
    S.mark(t + 0.7, hero, { hold: 1.4, pad: 4, radius: 22 });
    t += 2.6;
    var vCard = S.one('[aria-label^="Vídeo."]', hub);
    var cCard = S.one('[aria-label^="Chat."]', hub);
    var tiles = S.one('[aria-label="Tipo de atendimento"]', hub);
    S.cam(t, { x: 201, y: 500, zoom: 1.45 }, 0.9);
    S.caption(t + 0.3, 1, { at: S.rect(tiles), side: "right" });
    S.cursorEnter(t + 0.4, cCard, 0.6);
    S.click(t + 1.2, cCard, { press: true });
    S.show(t + 1.3, "hub-chat");
    S.cursorTo(t + 1.9, vCard, 0.5);
    S.click(t + 2.4, vCard, { press: true });
    S.show(t + 2.5, "hub");
    t += 3.0;
    var enter = S.pick("hub", "Entrar");
    var enterBtn = enter.closest('[role="button"]') || enter;
    S.cam(t, { x: 201, y: 600, zoom: 1.45 }, 0.8);
    S.caption(t + 0.2, 2, { at: S.rect(enterBtn), side: "right" });
    S.cursorTo(t + 0.4, enterBtn, 0.5);
    S.click(t + 1.9, enterBtn, { press: true });
    t = S.nav(t + 2.05, "checkout");
    var co = S.state("checkout");
    var values = S.pick("checkout", "Valores");
    while (values.parentElement && !/Total/.test(values.textContent)) values = values.parentElement;
    S.cam(t - 0.3, { x: 201, y: 560, zoom: 1.45 }, 0.8);
    S.caption(t + 0.2, 3, { at: S.rect(values), side: "right" });
    S.mark(t + 0.3, values, { hold: 1.5, pad: 4, radius: 22, noScroll: true });
    t += 2.4;
    var ccRow = S.one('[aria-label^="Crédito da empresa"]', co);
    S.cam(t, { x: 201, y: 340, zoom: 1.45 }, 1.0);
    S.caption(t + 0.9, 4, { at: S.rect(ccRow), side: "right" });
    S.cursorTo(t + 1.0, ccRow, 0.5);
    S.click(t + 2.2, ccRow, { press: true });
    S.show(t + 2.3, "checkout-credito", { fade: 0.2 });
    var pay = S.one('[aria-label^="Pagar ·"]', S.state("checkout-credito"));
    S.cam(t + 2.6, { x: 201, y: 640, zoom: 1.4 }, 0.8);
    S.cursorTo(t + 2.8, pay, 0.5);
    S.click(t + 3.4, pay, { press: true });
    t = S.nav(t + 3.55, "credito", { kind: "modal" });
    S.status(t - 0.4, true);
    var cr = S.state("credito");
    var panel = S.pick("credito", "Disponível neste mês");
    while (panel.parentElement && !/Depois do pagamento/.test(panel.textContent)) panel = panel.parentElement;
    S.cam(t - 0.2, { x: 201, y: 300, zoom: 1.5 }, 0.9);
    S.caption(t + 0.4, 5, { at: S.rect(panel), side: "right" });
    S.mark(t + 0.5, panel, { hold: 1.8, pad: 4, radius: 22 });
    t += 3.0;
    var conf = S.one('[aria-label^="Confirmar ·"]', cr);
    S.cam(t, { x: 201, y: 640, zoom: 1.45 }, 0.9);
    S.caption(t + 0.3, 6, { at: S.rect(conf), side: "right" });
    S.cursorTo(t + 0.4, conf, 0.6);
    S.click(t + 1.3, conf, { press: true });
    S.captionOut(t + 1.9);
    S.note("confirm", t + 1.3);
  },
};
