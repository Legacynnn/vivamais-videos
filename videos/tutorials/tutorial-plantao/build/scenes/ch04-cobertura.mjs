import { VF_HTML, VF_CSS, vfLife } from "../../../../kit/parts/vf.mjs";

const price = (src) => src.replace(/79,90/g, "59,90").replace(/220,10/g, "240,10");
const VF = price(VF_HTML);
const life = { toString: () => vfLife.toString().replace("220.1", "240.1") };
const SHEET = `.vmk-state[data-state="credito-proc"]{background:#3a3747}.vmk-state[data-state="credito-proc"] .vmk-lib{top:58px;height:816px;border-radius:14px 14px 0 0;overflow:hidden}`;

export default {
  id: "ch04-cobertura",
  device: "iphone",
  speed: 1.1,
  title: "Pago pela empresa",
  lines: ["Pago", "pela empresa"],
  lead: "O app confere conta e crédito da empresa e reserva sua vaga.",
  tail: 0.5,
  states: [["credito-proc", 0, "plantao-pay credit"], ["sucesso", 0, "plantao-success"]],
  layers: { vf: VF },
  css: VF_CSS + SHEET,
  lib: [life],
  captions: [
    { title: "Conta verificada", body: "O app confirma que **é você** antes de reservar." },
    { title: "Crédito ativo", body: "R$ 300,00 de crédito da empresa **disponíveis** neste mês." },
    { title: "Crédito aplicado", body: "Os **R$ 59,90** saem do crédito. Sobram **R$ 240,10**." },
    { title: "Vaga reservada", body: "Nada sai do seu bolso. A vaga foi **paga pela empresa**." },
    { title: "Tudo certo", body: "Você está no **Plantão 24h**. Antes da fila, conte o que sente." },
  ],
  frame: {
    title: "Pago pela empresa",
    scene: "Folha Pagar com crédito da empresa, verificação com carteira animada e quatro checagens, crédito que cai de R$ 300,00 para R$ 240,10 e a tela Pronto, você está no plantão com confete",
    poster: 8,
    motion: "circular reveal from the tapped button, vector wallet performance (card, coins → ticket), sequenced checks, count-down number, confetti, native pushes",
    body: "Título central. Do botão Confirmar · R$ 59,90 da folha Pagar com crédito da empresa nasce a verificação: a carteira violeta sobe, o cartão do plano sai, moedas lima voam para o bilhete da vaga. Conta verificada, crédito ativo, crédito aplicado (R$ 300,00 vira R$ 240,10), vaga reservada. Revela “Pronto, você está no plantão” com Pagamento confirmado e confete, e o toque em Contar o que estou sentindo.",
  },
  run: function (S) {
    S.boot("credito-proc");
    S.introIn(0.05);
    S.introOut(2.8);
    var vf = S.layer("vf");
    S.status(0, true, { dur: 0.01 });
    var conf = S.one('[aria-label^="Confirmar ·"]', S.state("credito-proc"));
    var cr = S.rect(conf);
    var t = 3.4;
    S.status(t + 0.3, false);
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
    S.status(t, false);
    var title = S.pick("sucesso", /^Pronto, você está/);
    S.cam(t, { x: 201, y: 420, zoom: 1.45 }, 0.9);
    S.popIn(t + 0.2, title, { from: 0.9, dur: 0.45, origin: "50% 50%" });
    S.confetti(t + 0.35, S.rect(title), { count: 60, seed: 23, power: 0.8 });
    S.caption(t + 0.7, 4, { at: S.rect(title), side: "right" });
    t += 2.8;
    var go = S.one('[aria-label="Contar o que estou sentindo"]', S.state("sucesso"));
    S.cam(t - 0.2, { x: 201, y: 560, zoom: 1.4 }, 0.8);
    S.cursorEnter(t, go, 0.5);
    S.click(t + 0.7, go, { press: true });
    S.captionOut(t + 0.7);
    S.note("anamnese", t + 0.85);
  },
};
