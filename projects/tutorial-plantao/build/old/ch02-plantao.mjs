export default {
  id: "ch02-plantao",
  device: "iphone",
  speed: 1.25,
  title: "Médico online agora",
  lines: ["Médico", "online agora"],
  lead: "Um clínico geral atende você por vídeo, sem agendamento, a qualquer hora.",
  tail: 0.9,
  states: [["plantao-loading", 0], ["plantao", 0], ["canal", 0], ["canal-chat", 0], ["checkout-skel", 0], ["checkout", 0]],
  captions: [
    { title: "Plantão 24h", body: "Sem agendar: você entra na fila e um **clínico geral** atende em minutos." },
    { title: "Como funciona", body: "Escolha vídeo ou chat, pague, conte o que sente e **aguarde a chamada**." },
    { title: "Vídeo ou chat", body: "Escolha como quer falar. Aqui vamos de **consulta por vídeo**." },
    { title: "Carregando o valor", body: "O app calcula o preço com **os benefícios do seu plano**." },
    { title: "Benefício aplicado", body: "O plano Viva+ Família tira **R$ 20,00** do plantão, automaticamente." },
    { title: "Forma de pagamento", body: "Pague com **Pix** ou cartão de crédito." },
  ],
  frame: {
    title: "Médico online agora",
    scene: "Aba Plantão carregando, tela Médico online agora, escolha do atendimento por vídeo e pagamento com benefício do plano",
    poster: 14,
    motion: "sequenced-ui-life, native push transitions, camera-with-intent, cursor-led action, attached tooltips",
    body: "Título central. O iPhone mostra a aba Plantão carregando e depois “Médico online agora”. A página rola até Como funciona. Toque em Começar por R$ 59,90 abre Atendimento: chat e vídeo são tocados, vídeo fica. Continuar abre Pagamento em skeleton, que carrega com o selo “Benefício Viva+ Família · -R$ 20,00”. Toque em Pix.",
  },
  run: function (S) {
    S.boot("plantao-loading");
    S.introIn(0.5);
    S.introOut(3.1);
    var t = 4.4;
    S.show(t, "plantao", { fade: 0.35 });
    S.cam(t, { x: 201, y: 380, zoom: 1.45 }, 1.1);
    var hero = S.pick("plantao", "Médico online agora");
    S.caption(t + 0.6, 0, { at: S.rect(hero) });
    S.mark(t + 1.0, hero.parentElement, { hold: 1.6, pad: 6, radius: 16 });
    t = 7.8;
    S.scroll(t, ["plantao"], 330, 1.1);
    S.cam(t, { x: 201, y: 560, zoom: 1.45 }, 1.1);
    S.caption(t + 0.9, 1, { at: { x: 16, y: 640, w: 370, h: 200, cx: 201, cy: 740 } });
    t = 11.2;
    S.scroll(t, ["plantao"], 0, 0.9);
    S.cam(t, { x: 201, y: 520, zoom: 1.45 }, 0.9);
    var start = S.pick("plantao", /^Começar por R\$/);
    S.cursorEnter(t + 0.6, start, 0.6);
    S.click(t + 1.35, start, { press: true });
    t = S.nav(t + 1.5, "canal");
    S.cam(t - 0.3, { x: 201, y: 380, zoom: 1.45 }, 0.9);
    var chat = S.pick("canal-chat", "Chat");
    var video = S.pick("canal", "Vídeo");
    S.caption(t + 0.2, 2, { at: S.rect(video.parentElement.parentElement) });
    S.cursorTo(t + 0.6, chat, 0.5);
    S.click(t + 1.2, chat);
    S.show(t + 1.3, "canal-chat");
    S.cursorTo(t + 1.9, S.pick("canal", "Vídeo"), 0.5);
    S.click(t + 2.5, S.pick("canal", "Vídeo"));
    S.show(t + 2.6, "canal");
    var cont = S.pick("canal", "Continuar");
    S.cursorTo(t + 3.1, cont, 0.6);
    S.click(t + 3.8, cont, { press: true });
    t = S.nav(t + 3.95, "checkout-skel");
    S.cam(t - 0.3, { x: 201, y: 330, zoom: 1.5 }, 0.8);
    S.caption(t, 3, { at: S.rect(S.pick("checkout-skel", "Total a pagar").parentElement) });
    t += 1.3;
    S.show(t, "checkout", { fade: 0.3 });
    var chip = S.pick("checkout", /^Benefício Viva\+ Família/);
    S.caption(t + 0.5, 4, { at: S.rect(chip) });
    S.mark(t + 0.7, chip, { hold: 2.2, pad: 5, radius: 999 });
    t += 3.4;
    var pix = S.pick("checkout", "Pix");
    S.cam(t - 0.2, { x: 201, y: 620, zoom: 1.5 }, 0.9);
    S.caption(t + 0.3, 5, { at: S.rect(pix.parentElement.parentElement) });
    S.cursorTo(t + 0.5, pix, 0.6);
    S.click(t + 1.3, pix, { press: true });
    S.note("pixTap", t + 1.3);
  },
};
