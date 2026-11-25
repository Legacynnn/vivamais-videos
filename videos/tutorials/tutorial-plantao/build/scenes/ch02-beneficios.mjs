export default {
  id: "ch02-beneficios",
  device: "iphone",
  speed: 1.15,
  title: "Seu plano, seus benefícios",
  lines: ["Seu plano,", "seus benefícios"],
  lead: "Do plano ao plantão em dois toques.",
  tail: 0.4,
  states: [["plano", 0, "my-plan company"], ["home", 5000, "client-home-company default"]],
  captions: [
    { title: "Viva+ Empresarial", body: "O plano que a sua empresa oferece, **ativo** neste ciclo." },
    { title: "Crédito da empresa", body: "**R$ 300,00** por mês, descontados ao pagar uma consulta." },
    { title: "Especialistas", body: "**25% de desconto**, sem limite de consultas." },
    { title: "Super Inteligência", body: "Chat com IA **ilimitado**, que renova todo dia." },
    { title: "Farmácias parceiras", body: "Até **35% de desconto** nas farmácias parceiras." },
    { title: "Plantão 24h", body: "De volta ao Início, toque no **Plantão 24h** para falar com um médico agora." },
  ],
  frame: {
    title: "Seu plano, seus benefícios",
    scene: "Meu plano do Viva+ Empresarial (crédito da empresa, especialistas, Super Inteligência, farmácias), volta ao Início e toque no cartão Plantão 24h",
    poster: 4,
    motion: "push transition, camera-with-intent, scroll tour, back transition, cursor-led action",
    body: "Sem título: continua do toque em Ver plano. Meu plano abre com Viva+ Empresarial e o selo Plano empresarial. A câmera passa por Crédito da empresa R$ 300,00 de R$ 300,00, Especialistas com 25% de desconto, Chat com IA ilimitado e Farmácias parceiras com 35%. Voltar leva ao Início, já no cartão Plantão 24h, que é tocado.",
  },
  run: function (S) {
    S.boot("plano");
    gsap.set(S.one(".vmk-title"), { autoAlpha: 0 });
    gsap.set(S.one(".vmk-device"), { opacity: 1, y: 0, scale: 1 });
    S.status(0, true, { dur: 0.01 });
    var pl = S.state("plano");
    var row = function (prefix) {
      return S.one('[aria-label^="' + prefix + '"]', pl);
    };
    var t = 0.6;
    var title = S.pick("plano", "Viva+ Empresarial");
    var badge = S.one('[aria-label="Plano empresarial"]', pl);
    var head = title;
    while (head.parentElement && !head.contains(badge)) head = head.parentElement;
    S.cam(t - 0.2, { x: 201, y: 230, zoom: 1.55 }, 1.0);
    S.caption(t + 0.3, 0, { at: S.rect(head), side: "right" });
    S.mark(t + 0.5, badge, { hold: 1.2, pad: 4, radius: 999 });
    t += 2.4;
    var cred = row("Crédito da empresa");
    S.cam(t, { x: 201, y: 420, zoom: 1.55 }, 0.9);
    S.caption(t + 0.4, 1, { at: S.rect(cred), side: "right" });
    S.mark(t + 0.6, cred, { hold: 1.3, pad: 4, radius: 18 });
    t += 2.5;
    var spec = row("Especialistas");
    S.cam(t, { x: 201, y: 520, zoom: 1.55 }, 0.9);
    S.caption(t + 0.4, 2, { at: S.rect(spec), side: "right" });
    S.mark(t + 0.6, spec, { hold: 1.2, pad: 4, radius: 18 });
    t += 2.4;
    var ia = row("Chat com IA");
    S.cam(t, { x: 201, y: 620, zoom: 1.5 }, 0.9);
    S.caption(t + 0.4, 3, { at: S.rect(ia), side: "right" });
    S.mark(t + 0.6, ia, { hold: 1.2, pad: 4, radius: 18 });
    t += 2.4;
    var farm = row("Farmácias parceiras");
    S.cam(t, { x: 201, y: 700, zoom: 1.5 }, 0.9);
    S.caption(t + 0.4, 4, { at: S.rect(farm), side: "right" });
    S.mark(t + 0.6, farm, { hold: 1.2, pad: 4, radius: 18 });
    t += 2.6;
    S.captionOut(t - 0.1);
    var back = S.one('[aria-label="Voltar"]', pl);
    S.cam(t, { x: 201, y: 300, zoom: 1.45 }, 0.9);
    S.cursorEnter(t + 0.2, back, 0.6);
    S.click(t + 1.0, back, { press: true });
    t = S.nav(t + 1.15, "home", { kind: "back" });
    S.status(t - 0.3, false);
    var card = S.one('[aria-label^="Plantão 24h, aberto agora"]', S.state("home"));
    S.cam(t - 0.2, { x: 201, y: 560, zoom: 1.4 }, 0.9);
    S.caption(t + 0.3, 5, { at: S.rect(card), side: "right" });
    S.mark(t + 0.5, card, { hold: 1.2, pad: 4, radius: 22, noScroll: true });
    S.cursorTo(t + 0.7, card, 0.6);
    S.click(t + 2.0, card, { press: true });
    S.captionOut(t + 2.3);
    S.note("plantao", t + 2.0);
  },
};
