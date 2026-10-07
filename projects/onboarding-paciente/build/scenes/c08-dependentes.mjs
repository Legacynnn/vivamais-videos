import { up, hold } from "../parts/ob.mjs";

export default {
  id: "c08-dependentes",
  device: "iphone",
  title: "Dependentes",
  lines: ["Seus", "dependentes"],
  lead: "Inclua quem você cuida e escolha um plano para essa pessoa.",
  tail: 0.6,
  states: [["de-perfil", 0], ["de-empty", 0], ["de-filled", 0], ["de-toast", 0], ["de-choose", 0], ["de-checkout", 0], ["de-pagar", 0], ["de-pix", 0], ["de-ok", 0]],
  patch: (name, html) => (name === "de-perfil" ? html.replace(/Sem crédito empresa/g, "") : html),
  lib: [up, hold],
  captions: [
    { title: "Sua família", body: "No **Perfil**, toque em **Família**." },
    { title: "Novo dependente", body: "Nome, **CPF**, nascimento e e-mail. Depois, **Salvar**." },
    { title: "Escolha o plano", body: "Toque em **Assinar** no plano da pessoa." },
    { title: "Pague com Pix", body: "Confira o valor e **gere o Pix**." },
    { title: "Plano ativo!", body: "José já pode usar **os benefícios**." },
  ],
  frame: {
    title: "Dependentes",
    scene: "Perfil → Família → Novo dependente com dados digitados, escolha do plano Viva+ Família, Pix e plano ativo",
    poster: 20,
    motion: "chapter title cascade, phone rise, slide navigation, live typing, bottom sheet, toast, confetti",
    body: "Passo 8 de 10. Perfil, “Adicione quem você cuida”, Novo dependente: José Oliveira, CPF, 02/08/1958, Masculino, e-mail. Salvar → “José entrou na família” → Viva+ Família R$ 49,90/mês → Pix → “Plano ativo” → lista com José.",
  },
  run: function (S) {
    var wide = function (n) { return n.getBoundingClientRect().width > 300; };
    S.boot("de-perfil");
    S.introIn(0.05);
    S.introOut(2.2);
    S.cam(2.3, { x: 201, y: 437, zoom: 1.6 }, 0.01);
    var t = 3.1;
    S.caption(t, 0);
    var fam = up(S.pick("de-perfil", "Adicione quem você cuida"), 50, wide);
    S.cam(t + 0.2, { x: 201, y: 560, zoom: 1.85 }, 0.9);
    S.mark(t + 0.8, fam, { hold: 1.4, pad: 4, radius: 20, noScroll: true });
    S.cursorTo(t + 2.2, fam, 0.45);
    S.click(t + 2.7, fam, { press: true });
    t = S.nav(t + 2.9, "de-empty");
    var nd = S.pick("de-empty", "Novo dependente");
    S.cam(t, { x: 201, y: 300, zoom: 1.9 }, 0.8);
    S.cursorTo(t + 0.6, nd, 0.45);
    S.click(t + 1.1, nd, { press: true });
    t = S.nav(t + 1.3, "de-filled");
    S.caption(t - 0.2, 1);
    S.cam(t, { x: 201, y: 330, zoom: 1.8 }, 0.9);
    S.mark(t + 0.7, up(S.pick("de-filled", "E-mail"), 40, wide), { hold: 1.6, pad: 4, radius: 18 });
    var save = S.pick("de-filled", "Salvar");
    S.cam(t + 2.4, { x: 300, y: 200, zoom: 1.9 }, 0.8);
    S.cursorTo(t + 2.9, save, 0.45);
    S.click(t + 3.4, save, { press: true });
    t = S.nav(t + 3.6, "de-toast", { kind: "fade", dur: 0.5 });
    S.cam(t, { x: 201, y: 437, zoom: 1.6 }, 0.9);
    S.show(t + 1.4, "de-choose", { fade: 0.5 });
    S.caption(t + 1.4, 2);
    S.scroll(t + 1.9, ["de-choose"], 330, 1.5);
    var assinar = S.pick("de-choose", "Assinar", { nth: 1, hit: false });
    S.cursorTo(t + 3.6, assinar, 0.45);
    S.click(t + 4.1, assinar, { press: true });
    t = S.nav(t + 4.3, "de-checkout");
    S.caption(t - 0.2, 3);
    var pix = up(S.pick("de-checkout", "Pix"), 50, wide);
    S.cam(t, { x: 201, y: 600, zoom: 1.7 }, 0.9);
    S.cursorTo(t + 1.2, pix, 0.45);
    S.click(t + 1.7, pix, { press: true });
    t = S.nav(t + 1.9, "de-pagar");
    var gen = S.pick("de-pagar", "Gerar Pix");
    S.cam(t, { x: 201, y: 520, zoom: 1.6 }, 0.9);
    S.cursorTo(t + 0.7, gen, 0.45);
    S.click(t + 1.2, gen, { press: true });
    S.show(t + 1.5, "de-pix", { fade: 0.5 });
    t += 3.4;
    t = S.nav(t, "de-ok", { kind: "fade", dur: 0.6 });
    var ok = S.pick("de-ok", "Plano ativo", { sel: "*" });
    S.cam(t, { x: 201, y: 437, zoom: 1.6 }, 0.9);
    S.confetti(t + 0.3, S.rect(ok), { count: 46, seed: 11, power: 0.7 });
    S.caption(t + 0.3, 4);
    hold(S, t + 3.4);
  },
};
