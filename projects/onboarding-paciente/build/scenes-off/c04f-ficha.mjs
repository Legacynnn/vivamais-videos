import { up, hold } from "../parts/ob.mjs";

export default {
  id: "c04f-ficha",
  device: "iphone",
  title: "Ficha de saúde",
  lines: ["Sua ficha", "de saúde"],
  lead: "Conte uma vez só. O médico já chega sabendo.",
  tail: 0.6,
  states: [["fi-perfil", 0], ["fi-hub", 0], ["fi-basic", 0], ["fi-basic-filled", 0], ["fi-habitos", 0], ["fi-habitos-filled", 0], ["fi-cond", 0], ["fi-cond-filled", 0], ["fi-docs", 0], ["fi-hub-complete", 0], ["fi-privacy", 0]],
  patch: (name, html) => html.replace(/Sem crédito empresa/g, "").replace(/<textarea\b/g, '<textarea spellcheck="false"'),
  lib: [up, hold],
  captions: [
    { title: "Ficha de saúde", body: "No seu Perfil, toque em **Ficha de saúde**." },
    { title: "Comece sua ficha", body: "São **4 etapas curtas**. Toque em **Começar**." },
    { title: "Dados básicos", body: "Peso, altura e pressão. **Pode ser aproximado.**" },
    { title: "Hábitos", body: "Toma **remédio todo dia**? Ligue e escreva qual." },
    { title: "Condições", body: "Marque **pressão alta**, diabetes, alergias e outras." },
    { title: "Documentos", body: "Tem exames antigos? **Anexe aqui.** É opcional." },
    { title: "Ficha completa!", body: "O médico vê sua ficha **antes da consulta**." },
    { title: "Você decide", body: "Em **Privacidade**, escolha quem pode ver sua ficha." },
  ],
  frame: {
    title: "Ficha de saúde",
    scene: "Perfil → Ficha de saúde → quatro etapas reais preenchidas → ficha 100% → privacidade",
    poster: 20,
    motion: "chapter title cascade, phone rise, slide navigation, live typing, switch toggles, confetti, scroll to privacy",
    body: "Perfil, card Ficha de saúde 0%. Minha saúde: Começar. Dados básicos 68 kg, 162 cm, 13/8. Hábitos: remédio contínuo Losartana. Condições: pressão alta, colesterol alto. Documentos opcional. Concluir ficha → 100% Ficha completa. Perfil → Privacidade: Compartilhar ficha.",
  },
  run: function (S) {
    var wide = function (n) { return n.getBoundingClientRect().width > 300; };
    var half = function (n) { return n.getBoundingClientRect().width > 120; };
    S.boot("fi-perfil");
    S.introIn(0.05);
    S.introOut(2.6);
    S.cam(2.7, { x: 201, y: 437, zoom: 1.6 }, 0.01);
    var t = 3.6;
    S.caption(t, 0);
    var card = up(S.pick("fi-perfil", "Começar agora"), 100, half);
    S.cam(t + 0.3, { x: 280, y: 480, zoom: 1.9 }, 1.0);
    S.mark(t + 1.0, card, { hold: 2.4, pad: 4, radius: 20 });
    S.cursorTo(t + 3.2, card, 0.5);
    S.click(t + 3.8, card, { press: true });
    t = S.nav(t + 4.0, "fi-hub");

    S.cam(t, { x: 201, y: 240, zoom: 1.9 }, 1.0);
    S.caption(t - 0.2, 1);
    var start = S.pick("fi-hub", "Começar", { exact: true });
    S.mark(t + 0.8, up(S.pick("fi-hub", "Comece sua ficha"), 60, function (n) { return /0%/.test(n.textContent); }), { hold: 2.2, pad: 6, radius: 22 });
    S.cursorTo(t + 3.0, start, 0.5);
    S.click(t + 3.6, start, { press: true });
    t = S.nav(t + 3.8, "fi-basic");

    S.cam(t, { x: 201, y: 330, zoom: 1.75 }, 1.0);
    S.caption(t - 0.2, 2);
    var ins = S.all("input", S.state("fi-basic")).filter(function (e) { return e.getBoundingClientRect().width > 0 && e.type !== "checkbox"; });
    var seq = [[ins[0], "68"], [ins[1], "162"], [ins[2], "13/8"]];
    t += 1.0;
    seq.forEach(function (p, i) {
      if (i === 0) S.cursorTo(t, p[0], 0.5);
      else S.cursorEnter(t, p[0], 0.5);
      S.click(t + 0.6, p[0]);
      S.cursorExit(t + 0.8, "down", 0.4);
      t = S.type(t + 0.8, p[0], p[1], { cps: 6 }) + 0.3;
    });
    S.show(t, "fi-basic-filled", { fade: 0.5 });
    S.cam(t + 0.2, { x: 201, y: 190, zoom: 1.9 }, 1.0);
    S.mark(t + 1.0, up(S.pick("fi-basic-filled", "25.9", { sel: "*" }), 60), { hold: 1.8, pad: 10, radius: 999 });
    var c1 = S.pick("fi-basic-filled", "Continuar");
    S.cam(t + 3.0, { x: 201, y: 500, zoom: 1.6 }, 0.9);
    S.cursorTo(t + 3.4, c1, 0.5);
    S.click(t + 4.0, c1, { press: true });
    t = S.nav(t + 4.2, "fi-habitos");

    S.cam(t, { x: 201, y: 260, zoom: 1.9 }, 1.0);
    S.caption(t - 0.2, 3);
    var sw = S.all("input[role=switch]", S.state("fi-habitos")).filter(function (e) { return e.getBoundingClientRect().width > 0; })[0];
    S.cursorTo(t + 1.0, sw, 0.5);
    S.click(t + 1.6, sw, { press: true });
    S.show(t + 1.8, "fi-habitos-filled", { fade: 0.5 });
    S.mark(t + 2.6, up(S.pick("fi-habitos-filled", "Usa remédio contínuo?"), 120, wide), { hold: 2.4, pad: 4, radius: 20 });
    var c2 = S.pick("fi-habitos-filled", "Continuar");
    S.cam(t + 5.0, { x: 201, y: 500, zoom: 1.6 }, 0.9);
    S.cursorTo(t + 5.4, c2, 0.5);
    S.click(t + 6.0, c2, { press: true });
    t = S.nav(t + 6.2, "fi-cond");

    S.cam(t, { x: 201, y: 330, zoom: 1.75 }, 1.0);
    S.caption(t - 0.2, 4);
    var sw2 = S.all("input[role=switch]", S.state("fi-cond")).filter(function (e) { return e.getBoundingClientRect().width > 0; })[0];
    S.cursorTo(t + 1.0, sw2, 0.5);
    S.click(t + 1.6, sw2, { press: true });
    var chip = S.pick("fi-cond", "Colesterol alto");
    S.cursorTo(t + 2.4, chip, 0.5);
    S.click(t + 3.0, chip, { press: true });
    S.show(t + 3.2, "fi-cond-filled", { fade: 0.5 });
    S.mark(t + 3.9, up(S.pick("fi-cond-filled", "Colesterol alto"), 30), { hold: 1.8, pad: 6, radius: 999 });
    var c3 = S.pick("fi-cond-filled", "Continuar");
    S.cam(t + 5.8, { x: 201, y: 500, zoom: 1.6 }, 0.9);
    S.cursorTo(t + 6.2, c3, 0.5);
    S.click(t + 6.8, c3, { press: true });
    t = S.nav(t + 7.0, "fi-docs");

    S.cam(t, { x: 201, y: 300, zoom: 1.75 }, 1.0);
    S.caption(t - 0.2, 5);
    S.mark(t + 0.8, up(S.pick("fi-docs", "Adicionar documento"), 50, wide), { hold: 2.0, pad: 4, radius: 20 });
    var done = S.pick("fi-docs", "Concluir ficha");
    S.cam(t + 2.9, { x: 201, y: 500, zoom: 1.6 }, 0.9);
    S.cursorTo(t + 3.3, done, 0.5);
    S.click(t + 3.9, done, { press: true });
    t = S.nav(t + 4.1, "fi-hub-complete");

    var ring = up(S.pick("fi-hub-complete", "100%", { sel: "*" }), 70);
    S.cam(t, { x: 201, y: 230, zoom: 1.9 }, 1.0);
    S.confetti(t + 0.5, S.rect(ring), { count: 70, seed: 5, power: 0.9 });
    S.caption(t + 0.3, 6);
    S.mark(t + 1.0, up(S.pick("fi-hub-complete", "Ficha completa"), 60, function (n) { return /100%/.test(n.textContent); }), { hold: 2.6, pad: 6, radius: 22 });
    t += 4.4;

    t = S.nav(t, "fi-privacy", { kind: "fade", dur: 0.6 });
    S.cam(t, { x: 201, y: 437, zoom: 1.6 }, 0.6);
    S.scroll(t + 0.4, ["fi-privacy"], 837, 1.6);
    S.caption(t + 0.6, 7);
    var share = up(S.pick("fi-privacy", "Compartilhar ficha"), 40, wide);
    S.cam(t + 2.2, { x: 201, y: 330, zoom: 1.9 }, 1.0);
    S.mark(t + 3.0, share, { hold: 2.8, pad: 4, radius: 18 });
    hold(S, t + 6.4);
  },
};
