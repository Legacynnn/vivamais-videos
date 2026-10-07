import { PL_HTML, PL_CSS } from "../parts/pl.mjs";

export default {
  id: "ch03-plantao",
  device: "iphone",
  speed: 1.2,
  title: "Médico online agora",
  lines: ["Médico", "online agora"],
  lead: "Sem agendar, sem pagar nada a mais. Está no seu plano.",
  tail: 0.4,
  states: [["canal", 0], ["canal-chat", 0], ["checkout", 0], ["credito", 0], ["credito-proc", 0]],
  layers: { pl: PL_HTML },
  css: PL_CSS,
  captions: [
    { title: "Como funciona", body: "Escolha o canal, conte o que sente e **receba os documentos** no app." },
    { title: "Começar", body: "A empresa dá **R$ 300,00** de crédito por mês. O plantão custa R$ 79,90." },
    { title: "Vídeo ou chat", body: "Escolha como quer falar. Aqui vamos de **consulta por vídeo**." },
    { title: "Pagamento", body: "R$ 79,90 pelo plantão. Sem Pix, sem cartão: **crédito da empresa**." },
    { title: "Crédito da empresa", body: "Toque para usar **o limite do seu benefício**." },
    { title: "Limite do mês", body: "R$ 300,00 disponíveis. Depois da consulta sobram **R$ 220,10**." },
    { title: "Confirmar", body: "Um toque e o app **verifica seu crédito** para reservar sua vaga." },
  ],
  frame: {
    title: "Médico online agora",
    scene: "Nova tela do plantão com Começar por R$ 0,00, escolha do atendimento por vídeo com as ilustrações, checkout coberto pelo plano e confirmação sem pagamento",
    poster: 12,
    motion: "native push transitions, skeleton → content, camera-with-intent, cursor-led action, attached tooltips",
    body: "Título central. O iPhone mostra a nova tela do plantão: como funciona em três passos e Começar por R$ 0,00. Toque abre Atendimento: as ilustrações de vídeo e chat ganham zoom, chat e vídeo são tocados, vídeo fica. Continuar abre Pagamento em skeleton, que carrega com Total a pagar R$ 0,00 e o selo “Plantão incluso no Viva+ Família · −R$ 79,90”. Não há Pix nem cartão: toque em Confirmar atendimento.",
  },
  run: function (S) {
    S.boot("canal");
    var pl = S.layer("pl");
    gsap.set(pl, { autoAlpha: 1 });
    S.status(0, true);
    S.introIn(0.05);
    S.introOut(2.9);
    var t = 3.7;
    var steps = S.one(".pl-steps", pl);
    S.cam(t, { x: 201, y: 560, zoom: 1.45 }, 1.0);
    S.caption(t + 0.5, 0, { at: S.rect(steps), side: "right" });
    S.mark(t + 0.7, steps, { hold: 1.4, pad: 6, radius: 18 });
    t += 2.5;
    var start = S.one(".pl-cta", pl);
    S.cam(t, { x: 201, y: 640, zoom: 1.45 }, 0.8);
    S.caption(t + 0.2, 1, { at: S.rect(start), side: "right" });
    S.cursorEnter(t + 0.4, start, 0.6);
    S.click(t + 1.3, start, { press: true });
    (function (t) {
      S.add(function (tl) {
        tl.to(start, { scale: 0.97, duration: 0.1, ease: "power2.in", transformOrigin: "50% 50%" }, t + 1.3);
        tl.to(start, { scale: 1, duration: 0.2, ease: "power2.out", transformOrigin: "50% 50%" }, t + 1.42);
        tl.to(pl, { x: -110, duration: 0.52, ease: "power3.inOut" }, t + 1.45);
        tl.set(pl, { autoAlpha: 0 }, t + 1.97);
      });
    })(t);
    S.status(t + 1.6, false);
    t = t + 1.97;
    S.cam(t - 0.3, { x: 201, y: 330, zoom: 1.6 }, 0.9);
    var chat = S.pick("canal-chat", "Chat");
    var video = S.pick("canal", "Vídeo");
    var vCard = video;
    while (vCard.parentElement && vCard.getBoundingClientRect().height < 120) vCard = vCard.parentElement;
    var cCard = S.pick("canal", "Chat");
    while (cCard.parentElement && cCard.getBoundingClientRect().height < 80) cCard = cCard.parentElement;
    S.caption(t + 0.2, 2, { at: S.rect(vCard), side: "right" });
    S.mark(t + 0.3, vCard, { hold: 0.55, pad: 4, radius: 20 });
    S.cursorTo(t + 0.6, chat, 0.5);
    S.click(t + 1.2, chat);
    S.show(t + 1.3, "canal-chat");
    S.cursorTo(t + 1.9, S.pick("canal", "Vídeo"), 0.5);
    S.click(t + 2.4, S.pick("canal", "Vídeo"));
    S.show(t + 2.5, "canal");
    var cont = S.pick("canal", "Continuar");
    S.cam(t + 2.5, { x: 201, y: 520, zoom: 1.45 }, 0.8);
    S.cursorTo(t + 2.9, cont, 0.6);
    S.click(t + 3.5, cont, { press: true });
    t = S.nav(t + 3.65, "checkout");
    S.cam(t - 0.3, { x: 201, y: 330, zoom: 1.5 }, 0.8);
    var total = S.pick("checkout", "Total a pagar");
    var totalCard = total;
    while (totalCard.parentElement && totalCard.getBoundingClientRect().height < 120) totalCard = totalCard.parentElement;
    S.caption(t + 0.2, 3, { at: S.rect(totalCard), side: "right" });
    S.mark(t + 0.3, totalCard, { hold: 1.4, pad: 4, radius: 22 });
    t += 2.4;
    var cc = S.pick("checkout", "Crédito da empresa");
    var ccRow = cc;
    while (ccRow.parentElement && ccRow.getBoundingClientRect().height < 56) ccRow = ccRow.parentElement;
    S.cam(t, { x: 201, y: 600, zoom: 1.45 }, 1.0);
    var ccR = S.rect(cc);
    S.caption(t + 0.9, 4, { at: S.rect(ccRow), side: "right" });
    S.cursorTo(t + 1.0, ccR, 0.5);
    S.click(t + 2.2, ccR, { press: true });
    t = S.nav(t + 2.35, "credito");
    var lim = S.pick("credito", /R\$ 300,00/, { sort: "y" });
    var panel = lim;
    while (panel.parentElement && panel.getBoundingClientRect().height < 90) panel = panel.parentElement;
    S.cam(t - 0.2, { x: 201, y: 440, zoom: 1.5 }, 0.9);
    S.caption(t + 0.4, 5, { at: S.rect(panel), side: "right" });
    S.mark(t + 0.5, panel, { hold: 1.8, pad: 4, radius: 22 });
    t += 3.0;
    var conf = S.pick("credito", "Confirmar com crédito da empresa");
    S.cam(t, { x: 201, y: 640, zoom: 1.45 }, 0.9);
    S.caption(t + 0.3, 6, { at: S.rect(conf), side: "right" });
    S.cursorTo(t + 0.4, conf, 0.6);
    S.click(t + 1.3, conf, { press: true });
    S.show(t + 1.4, "credito-proc");
    S.captionOut(t + 1.9);
    S.note("confirm", t + 1.3);
  },
};
