import { VF_HTML, VF_CSS, vfLife } from "../parts/vf.mjs";

export default {
  id: "ch04-cobertura",
  device: "iphone",
  speed: 1.1,
  title: "Pago pela empresa",
  lines: ["Pago", "pela empresa"],
  lead: "O app confere conta e crédito da empresa e reserva sua vaga.",
  tail: 0.5,
  states: [["credito-proc", 0], ["sucesso", 0]],
  layers: { vf: VF_HTML },
  css: VF_CSS,
  lib: [vfLife],
  captions: [
    { title: "Conta verificada", body: "O app confirma que **é você** antes de reservar." },
    { title: "Crédito ativo", body: "R$ 300,00 de crédito da empresa **disponíveis** neste mês." },
    { title: "Crédito aplicado", body: "Os **R$ 79,90** saem do crédito. Sobram **R$ 220,10**." },
    { title: "Vaga reservada", body: "Sem cobrança para você. A vaga foi **paga pela empresa**." },
    { title: "Tudo certo", body: "Sua vaga no **Plantão 24h** está reservada. Agora, a anamnese." },
  ],
  frame: {
    title: "Pago pela empresa",
    scene: "Tela de verificação com carteira animada, valor que cai de R$ 79,90 para R$ 0,00, quatro checagens do plano e vaga reservada com confete",
    poster: 8,
    motion: "circular reveal from the tapped button, vector wallet performance (card, coins → ticket), sequenced checks, count-down number, confetti, native pushes",
    body: "Título central. Do botão Confirmar atendimento nasce a tela de verificação: a carteira violeta sobe, o cartão do plano sai, moedas lima voam para o bilhete da vaga. Conta verificada, plano ativo (barra de cobertura enche), plantão incluso, vaga reservada; o valor rola de R$ 79,90 para R$ 0,00 e o título vira “Atendimento confirmado”. Revela “Sua vaga está reservada” com confete. Continuar para a anamnese: motivo, mapa do corpo, revisão e “Anamnese enviada”, com toque em Ir para a fila.",
  },
  run: function (S) {
    S.boot("credito-proc");
    S.introIn(0.05);
    S.introOut(2.8);
    var vf = S.layer("vf");
    var conf = S.pick("credito-proc", "Confirmar com crédito da empresa");
    var cr = S.rect(conf);
    var t = 3.4;
    S.cam(t - 0.3, { x: 201, y: 437, zoom: 1.22 }, 0.9);
    (function (t) {
    S.add(function (tl) {
      tl.set(vf, { autoAlpha: 1, clipPath: "circle(0px at " + cr.cx + "px " + cr.cy + "px)" }, t);
      tl.to(vf, { clipPath: "circle(1000px at " + cr.cx + "px " + cr.cy + "px)", duration: 0.8, ease: "power3.inOut" }, t);
    });
    })(t);
    var life = vfLife(S, vf, t + 0.3);
    var rows = S.all(".vf-steps li", vf);
    S.caption(life.stepAt(0) + 0.1, 0, { at: S.rect(rows[0]) });
    S.cam(life.stepAt(1) - 0.3, { x: 201, y: 470, zoom: 1.4 }, 0.8);
    S.caption(life.stepAt(1) + 0.1, 1, { at: S.rect(S.one(".vf-bal", vf)) });
    S.caption(life.stepAt(2) + 0.1, 2, { at: S.rect(rows[2]) });
    S.cam(life.stepAt(3) - 0.2, { x: 201, y: 300, zoom: 1.45 }, 0.8);
    S.caption(life.stepAt(3) + 0.2, 3, { at: S.rect(S.one(".vf-art", vf)) });
    t = life.fin + 1.1;
    S.captionOut(t - 0.2);
    S.show(t, "sucesso");
    S.layerOut(t, "vf", { to: "zoom", dur: 0.45 });
    var title = S.pick("sucesso", "Sua vaga está reservada");
    S.cam(t, { x: 201, y: 420, zoom: 1.45 }, 0.9);
    S.popIn(t + 0.2, title, { from: 0.9, dur: 0.45, origin: "50% 50%" });
    S.confetti(t + 0.35, S.rect(title), { count: 60, seed: 23, power: 0.8 });
    S.caption(t + 0.7, 4, { at: S.rect(title), side: "right" });
    t += 2.8;
    var go = S.pick("sucesso", "Continuar para a anamnese");
    S.cam(t - 0.2, { x: 201, y: 560, zoom: 1.4 }, 0.8);
    S.cursorEnter(t, go, 0.5);
    S.click(t + 0.7, go, { press: true });
    S.captionOut(t + 0.7);
    S.note("anamnese", t + 0.85);
  },
};
