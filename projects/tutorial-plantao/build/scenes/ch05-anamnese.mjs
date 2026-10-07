import { HB_HTML, HB_CSS, hbLife, hbDone } from "../parts/hb.mjs";

export default {
  id: "ch05-anamnese",
  device: "iphone",
  speed: 1.2,
  title: "Conte o que sente",
  lines: ["Conte o", "que sente"],
  lead: "Cinco etapas rápidas. A médica chega sabendo do seu caso.",
  tail: 0.5,
  states: [["hub", 0], ["motivo", 0], ["dor", 0], ["dor-sheet", 0], ["dor-sheet-set", 0], ["dor-marked", 0], ["tempo", 0], ["tempo-set", 0], ["contexto", 0], ["contexto-set", 0], ["anexos", 0], ["revisao", 0], ["enviada", 0]],
  layers: { hb: HB_HTML },
  css: HB_CSS,
  lib: [hbLife, hbDone],
  captions: [
    { title: "Cinco etapas", body: "Motivo, onde dói, tempo, remédios e anexos. Uns **dois minutos**." },
    { title: "Motivo", body: "Escreva como contaria para alguém. **Sem termos médicos**." },
    { title: "Onde dói", body: "Toque no corpo para marcar **o local**." },
    { title: "Como é a dor", body: "Intensidade e tipo. Aqui, **forte e latejante**." },
    { title: "Há quanto tempo", body: "Desde quando, e se está **piorando ou melhorando**." },
    { title: "Remédios e alergias", body: "Confirme o que já está na sua **ficha de saúde**." },
    { title: "Anexos", body: "Exames ou fotos, se tiver. Esta etapa é **opcional**." },
    { title: "Revise", body: "É exatamente isso que **a médica vai ver**." },
    { title: "Enviada", body: "Anamnese entregue. Agora é só **entrar na fila**." },
  ],
  frame: {
    title: "Conte o que sente",
    scene: "Hub da anamnese em mosaico com ilustrações próprias para cada etapa, cada etapa real sendo preenchida (texto digitado, toque no corpo, chips), tiles virando Feito, revisão e envio",
    poster: 14,
    motion: "staggered mosaic entrance, per-tile illustration performance, modal sheets, live typing, cursor taps, tile done flips with progress bar, confetti",
    body: "Título central. O hub em mosaico entra com cinco cartões ilustrados: balão com lápis (motivo), corpo com pino (onde dói), calendário com tendência (tempo), cápsula e escudo (remédios), foto com clipe (anexos). Cada cartão abre a etapa real: o texto do motivo é digitado, o toque na cabeça abre a folha de intensidade e tipo, chips de tempo e alergias são tocados. A cada volta o cartão vira Feito e a barra avança até 5 de 5. Revisar e enviar mostra a revisão e “Anamnese enviada” com confete; toque em Ir para a fila.",
  },
  run: function (S) {
    S.boot("hub");
    var hb = S.layer("hb");
    gsap.set(hb, { autoAlpha: 1 });
    S.introIn(0.05);
    S.introOut(2.9);
    var life = hbLife(S, hb, 3.0);
    var tiles = S.all(".hb-tile", hb);
    var t = 3.7;
    S.cam(t - 0.2, { x: 201, y: 437, zoom: 1.25 }, 1.0);
    S.caption(t + 0.7, 0, { at: S.rect(S.one(".hb-prog", hb)), side: "right" });
    t += 2.4;

    function open(at, i, name, kind) {
      S.captionOut(at - 0.1);
      S.cursorTo(at, tiles[i], 0.55);
      S.click(at + 0.7, tiles[i], { press: true });
      S.add(function (tl) {
        tl.to(hb, { scale: 0.94, y: 10, duration: 0.5, ease: "power3.out", transformOrigin: "50% 100%" }, at + 0.85);
        tl.set(hb, { autoAlpha: 0 }, at + 1.4);
      });
      return S.nav(at + 0.85, name, { kind: kind || "modal" });
    }
    function close(at, name, i, summary) {
      var st = S.state(name);
      S.add(function (tl) {
        tl.set(hb, { autoAlpha: 1 }, at);
        tl.to(st, { y: 874, duration: 0.45, ease: "power3.in" }, at);
        tl.set(st, { autoAlpha: 0, y: 0 }, at + 0.45);
        tl.to(hb, { scale: 1, y: 0, duration: 0.45, ease: "power3.out" }, at + 0.05);
      });
      hbDone(S, hb, i, at + 0.5, summary);
      return at + 0.9;
    }

    t = open(t, 0, "motivo");
    S.cam(t - 0.4, { x: 201, y: 330, zoom: 1.5 }, 0.9);
    var ta = S.one("textarea", S.state("motivo"));
    S.caption(t + 0.2, 1, { at: S.rect(ta), side: "right" });
    S.cursorTo(t + 0.3, ta, 0.5);
    S.click(t + 0.8, ta);
    S.cursorExit(t + 1.0, "down", 0.3);
    var typed = S.type(t + 1.0, ta, "Dor de cabeça forte desde ontem, piora quando fico no computador.", { cps: 26 });
    var save0 = S.pick("motivo", "Salvar e continuar");
    S.cam(typed - 0.2, { x: 201, y: 560, zoom: 1.4 }, 0.8);
    S.cursorEnter(typed + 0.1, save0, 0.5);
    S.click(typed + 0.7, save0, { press: true });
    t = close(typed + 0.85, "motivo", 0, "Dor de cabeça forte desde ontem…");
    S.cam(t - 0.5, { x: 201, y: 437, zoom: 1.25 }, 0.8);

    t = open(t + 0.6, 1, "dor");
    S.cam(t - 0.4, { x: 201, y: 400, zoom: 1.45 }, 0.9);
    var head = { x: 189, y: 340, w: 24, h: 24, cx: 201, cy: 352 };
    S.caption(t + 0.2, 2, { at: head, side: "right" });
    S.cursorTo(t + 0.4, head, 0.5);
    S.click(t + 1.0, head);
    t = S.nav(t + 1.1, "dor-sheet", { kind: "fade", dur: 0.4 });
    var lat = S.pick("dor-sheet", "Latejante");
    var forte = S.pick("dor-sheet", "Forte");
    S.cam(t - 0.2, { x: 201, y: 600, zoom: 1.45 }, 0.8);
    S.caption(t + 0.2, 3, { at: S.rect(forte), side: "right" });
    S.cursorTo(t + 0.3, forte, 0.5);
    S.click(t + 0.9, forte, { press: true });
    S.cursorTo(t + 1.2, lat, 0.5);
    S.click(t + 1.8, lat, { press: true });
    S.show(t + 1.9, "dor-sheet-set");
    var confirmar = S.pick("dor-sheet-set", "Confirmar");
    S.cursorTo(t + 2.2, confirmar, 0.5);
    S.click(t + 2.8, confirmar, { press: true });
    t = S.nav(t + 2.9, "dor-marked", { kind: "fade", dur: 0.35 });
    S.cam(t - 0.2, { x: 201, y: 460, zoom: 1.4 }, 0.8);
    var save1 = S.pick("dor-marked", "Salvar e continuar");
    S.cursorTo(t + 0.3, save1, 0.5);
    S.click(t + 0.9, save1, { press: true });
    t = close(t + 1.05, "dor-marked", 1, "Cabeça · forte, latejante");
    S.cam(t - 0.5, { x: 201, y: 437, zoom: 1.25 }, 0.8);

    t = open(t + 0.5, 2, "tempo");
    S.cam(t - 0.4, { x: 201, y: 380, zoom: 1.45 }, 0.9);
    var ontem = S.pick("tempo", "Ontem");
    var piorando = S.pick("tempo", "Piorando");
    S.caption(t + 0.2, 4, { at: S.rect(ontem), side: "right" });
    S.cursorTo(t + 0.3, ontem, 0.5);
    S.click(t + 0.9, ontem, { press: true });
    S.cursorTo(t + 1.2, piorando, 0.5);
    S.click(t + 1.8, piorando, { press: true });
    S.show(t + 1.9, "tempo-set");
    var save2 = S.pick("tempo-set", "Salvar e continuar");
    S.cam(t + 1.9, { x: 201, y: 520, zoom: 1.4 }, 0.7);
    S.cursorTo(t + 2.2, save2, 0.5);
    S.click(t + 2.8, save2, { press: true });
    t = close(t + 2.95, "tempo-set", 2, "Desde ontem · piorando");
    S.cam(t - 0.5, { x: 201, y: 437, zoom: 1.25 }, 0.8);

    t = open(t + 0.5, 3, "contexto");
    S.cam(t - 0.4, { x: 201, y: 380, zoom: 1.45 }, 0.9);
    var noAl = S.pick("contexto", "Nenhuma alergia conhecida");
    S.caption(t + 0.2, 5, { at: S.rect(noAl), side: "right" });
    S.cursorTo(t + 0.3, noAl, 0.5);
    S.click(t + 0.9, noAl, { press: true });
    S.show(t + 1.0, "contexto-set");
    var save3 = S.pick("contexto-set", "Salvar e continuar");
    S.cam(t + 1.0, { x: 201, y: 600, zoom: 1.4 }, 0.8);
    S.cursorTo(t + 1.4, save3, 0.5);
    S.click(t + 2.0, save3, { press: true });
    t = close(t + 2.15, "contexto-set", 3, "Sem remédios · sem alergias");
    S.cam(t - 0.5, { x: 201, y: 437, zoom: 1.25 }, 0.8);

    t = open(t + 0.5, 4, "anexos");
    S.cam(t - 0.4, { x: 201, y: 380, zoom: 1.45 }, 0.9);
    var rev = S.pick("anexos", "Revisar anamnese");
    S.caption(t + 0.2, 6, { at: S.rect(S.pick("anexos", "Galeria")), side: "right" });
    S.cam(t + 1.2, { x: 201, y: 560, zoom: 1.4 }, 0.7);
    S.cursorTo(t + 1.4, rev, 0.5);
    S.click(t + 2.0, rev, { press: true });
    S.captionOut(t + 2.0);
    t = S.nav(t + 2.15, "revisao");
    S.cam(t - 0.3, { x: 201, y: 400, zoom: 1.4 }, 0.9);
    S.caption(t + 0.3, 7, { at: S.rect(S.pick("revisao", "É isso que o médico vai ver")), side: "right" });
    t += 2.0;
    var send = S.pick("revisao", "Enviar anamnese");
    S.cam(t, { x: 201, y: 640, zoom: 1.4 }, 0.8);
    S.cursorTo(t + 0.2, send, 0.5);
    S.click(t + 0.8, send, { press: true });
    t = S.nav(t + 0.95, "enviada", { kind: "fade" });
    var sent = S.pick("enviada", "Anamnese enviada");
    S.cam(t - 0.2, { x: 201, y: 420, zoom: 1.45 }, 0.8);
    S.confetti(t + 0.1, S.rect(sent), { count: 46, seed: 5, power: 0.7 });
    S.caption(t + 0.4, 8, { at: S.rect(sent), side: "right" });
    var fila = S.pick("enviada", "Ir para a fila");
    t += 1.9;
    S.cursorTo(t, fila, 0.5);
    S.click(t + 0.7, fila, { press: true });
    S.note("fila", t + 0.7);
  },
};
