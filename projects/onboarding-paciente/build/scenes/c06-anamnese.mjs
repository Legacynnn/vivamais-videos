import { up, hold } from "../parts/ob.mjs";
import { illSvg, illIn, ILL_CSS } from "../parts/illus.mjs";
import { anSwap, anPlay } from "../parts/an.mjs";

export default {
  id: "c06-anamnese",
  device: "iphone",
  title: "Antes da consulta",
  lines: ["Antes da", "consulta"],
  lead: "Conte ao médico como você está. Leva uns dois minutos.",
  tail: 0.6,
  states: [["bk-ok", 0], ["an-hub", 0], ["an-motivo", 0], ["an-motivo-typed", 0], ["an-dor", 0], ["an-dor-skip", 0], ["an-tempo-set", 0], ["an-contexto", 0], ["an-contexto-set", 0], ["an-anexos", 0], ["an-revisao", 0], ["an-enviada", 0]],
  lib: [up, hold, illSvg, illIn, anSwap, anPlay],
  css: ILL_CSS,
  captions: [
    { title: "Preencha a anamnese", body: "Toque em **Preencher anamnese** depois de marcar." },
    { title: "Cinco etapas curtas", body: "Motivo, onde dói, tempo, remédios e anexos." },
    { title: "O motivo", body: "Escreva com suas palavras, **como se falasse** com o médico." },
    { title: "Onde dói", body: "Toque no corpo. Se não for dor, toque em **“Não é dor”**." },
    { title: "Desde quando", body: "Escolha **quando começou** e se está melhor ou pior." },
    { title: "Remédios e alergias", body: "Confira o que você usa. **Sem alergia?** Toque aqui." },
    { title: "Anexos", body: "Fotos de exames, se tiver. **É opcional.**" },
    { title: "Revise e envie", body: "Confira tudo e toque em **Enviar**." },
    { title: "Enviada!", body: "O médico lê tudo **antes da consulta**." },
    { title: "No dia da consulta", body: "Abra o app e entre na consulta **no horário marcado**." },
  ],
  frame: {
    title: "Antes da consulta",
    scene: "Anamnese real da consulta marcada: hub de 5 etapas, motivo digitado, sintoma sem dor, tempo, alergias, anexos, revisão, envio e pré-consulta",
    poster: 20,
    motion: "chapter title cascade, phone rise, slide navigation, live typing, chip taps, confetti",
    body: "Passo 6 de 10. Preencher anamnese → hub “0 de 5 etapas”. Motivo digitado (“Quero checar o coração…”), “Não é dor, é outro sintoma”, 1 mês · igual, nenhuma alergia, anexos opcionais, revisão, enviar → “Anamnese enviada” → tela da consulta.",
  },
  run: function (S) {
    var wide = function (n) { return n.getBoundingClientRect().width > 300; };
    var A = anSwap(S, { "an-motivo": "motivo", "an-motivo-typed": "motivo", "an-dor": "dor", "an-dor-skip": "tempo", "an-tempo-set": "tempo", "an-contexto": "contexto", "an-contexto-set": "contexto", "an-anexos": "anexos" }, [
      ["an-hub", /^O que está acontecendo$/, "motivo"],
      ["an-hub", /^Marque no corpo$/, "dor"],
      ["an-hub", /^Início e evolução$/, "tempo"],
      ["an-hub", /^Exames, receitas ou fotos$/, "anexos"],
      ["an-hub", /^medicamentos e alergias$/i, "contexto"],
    ]);
    S.boot("bk-ok");
    S.introIn(0.05);
    S.introOut(2.2);
    S.cam(2.3, { x: 201, y: 437, zoom: 1.6 }, 0.01);
    var t = 3.1;
    var fill = S.pick("bk-ok", "Preencher anamnese");
    S.cam(t, { x: 201, y: 620, zoom: 1.8 }, 1.0);
    S.caption(t - 0.2, 0);
    S.mark(t + 0.6, up(fill, 40), { hold: 1.6, pad: 4, radius: 22 });
    S.cursorTo(t + 2.2, fill, 0.45);
    S.click(t + 2.7, fill, { press: true });
    t = S.nav(t + 2.9, "an-hub");
    anPlay(S, A, "an-hub", t - 0.35);
    S.cam(t, { x: 201, y: 437, zoom: 1.6 }, 1.0);
    S.caption(t - 0.2, 1);
    t += 3.2;
    var start = S.pick("an-hub", "Começar");
    S.cursorTo(t, start, 0.45);
    S.click(t + 0.5, start, { press: true });
    t = S.nav(t + 0.7, "an-motivo");
    anPlay(S, A, "an-motivo", t - 0.35);
    var ta = S.one("textarea", S.state("an-motivo"));
    S.cam(t, { x: 201, y: 320, zoom: 1.9 }, 1.0);
    S.caption(t - 0.2, 2);
    S.cursorTo(t + 0.7, ta, 0.45);
    S.click(t + 1.2, ta);
    S.cursorExit(t + 1.4, "down", 0.4);
    t = S.type(t + 1.4, ta, "Quero checar o coração. Sinto falta de ar quando subo escada.", { cps: 18 });
    S.show(t + 0.3, "an-motivo-typed", { fade: 0.3 });
    var s0 = S.pick("an-motivo-typed", "Salvar e continuar");
    S.cam(t + 0.4, { x: 201, y: 560, zoom: 1.7 }, 0.9);
    S.cursorEnter(t + 1.0, s0, 0.45);
    S.click(t + 1.5, s0, { press: true });
    t = S.nav(t + 1.7, "an-dor");
    anPlay(S, A, "an-dor", t - 0.35);
    S.cam(t, { x: 201, y: 437, zoom: 1.6 }, 1.0);
    S.caption(t - 0.2, 3);
    var skip = S.pick("an-dor", "Não é dor, é outro sintoma");
    S.mark(t + 0.9, up(skip, 30), { hold: 1.6, pad: 6, radius: 20 });
    S.cursorTo(t + 2.5, skip, 0.45);
    S.click(t + 3.0, skip, { press: true });
    t = S.nav(t + 3.2, "an-dor-skip");
    anPlay(S, A, "an-dor-skip", t - 0.35);
    S.cam(t, { x: 201, y: 340, zoom: 1.85 }, 1.0);
    S.caption(t - 0.2, 4);
    var mes = S.pick("an-dor-skip", "1 mês");
    var igual = S.pick("an-dor-skip", "Igual");
    S.cursorTo(t + 0.9, mes, 0.45);
    S.click(t + 1.4, mes, { press: true });
    S.cursorTo(t + 1.9, igual, 0.45);
    S.click(t + 2.4, igual, { press: true });
    S.show(t + 2.5, "an-tempo-set", { fade: 0.3 });
    var s2 = S.pick("an-tempo-set", "Salvar e continuar");
    S.cam(t + 2.8, { x: 201, y: 560, zoom: 1.7 }, 0.9);
    S.cursorTo(t + 3.5, s2, 0.45);
    S.click(t + 4.0, s2, { press: true });
    t = S.nav(t + 4.2, "an-contexto");
    anPlay(S, A, "an-contexto", t - 0.35);
    S.cam(t, { x: 201, y: 437, zoom: 1.6 }, 1.0);
    S.caption(t - 0.2, 5);
    var noAl = S.pick("an-contexto", "Nenhuma alergia conhecida");
    S.mark(t + 0.8, up(noAl, 30), { hold: 1.6, pad: 6, radius: 20 });
    S.cursorTo(t + 2.3, noAl, 0.45);
    S.click(t + 2.8, noAl, { press: true });
    S.show(t + 2.9, "an-contexto-set", { fade: 0.3 });
    var s3 = S.pick("an-contexto-set", "Salvar e continuar");
    S.cursorTo(t + 3.5, s3, 0.45);
    S.click(t + 4.0, s3, { press: true });
    t = S.nav(t + 4.2, "an-anexos");
    anPlay(S, A, "an-anexos", t - 0.35);
    S.caption(t - 0.2, 6);
    var rev = S.pick("an-anexos", "Revisar anamnese");
    S.cursorTo(t + 2.6, rev, 0.45);
    S.click(t + 3.1, rev, { press: true });
    t = S.nav(t + 3.3, "an-revisao");
    S.caption(t - 0.2, 7);
    S.scroll(t + 0.8, ["an-revisao"], 400, 1.6);
    var send = S.pick("an-revisao", /^Enviar/, { last: true });
    S.cursorTo(t + 2.8, send, 0.45);
    S.click(t + 3.3, send, { press: true });
    t = S.nav(t + 3.5, "an-enviada", { kind: "fade", dur: 0.6 });
    anPlay(S, A, "an-enviada", t - 0.3);
    var sent = S.pick("an-enviada", "Anamnese enviada", { sel: "*" });
    S.confetti(t + 0.2, S.rect(sent), { count: 40, seed: 9, power: 0.6 });
    S.caption(t + 0.4, 8);
    S.caption(t + 3.4, 9);
    var back = S.pick("an-enviada", "Voltar para a consulta");
    S.mark(t + 3.9, back, { hold: 2.0, pad: 4, radius: 22 });
    hold(S, t + 6.6);
  },
};
