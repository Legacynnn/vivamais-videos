const F = "data-layout-allow-overlap";
const TEXT = "Febre e dor de cabeça desde ontem.";

export default {
  id: "s07b-anamnese",
  device: "iphone",
  tail: 0.3,
  data: TEXT,
  seam: { axis: "y", dir: -1, technique: "cut-the-curve UP" },
  states: [["motivo", 0], ["dor", 0], ["dor-sheet", 0], ["dor-sheet-set", 0], ["dor-marked", 0], ["tempo", 0], ["tempo-set", 0], ["contexto", 0], ["contexto-set", 0], ["anexos", 0], ["revisao", 0], ["enviada", 0]],
  sfx: [
    { name: "type", at: 1.2, vol: 0.4, max: 1.3 },
    { name: "tap", at: 5.1, vol: 0.4 },
    { name: "tap", at: 10.2, vol: 0.4 },
    { name: "pop", at: 20.4, vol: 0.45 },
  ],
  ad: [
    { key: "h1", cls: "l top", style: "top:190px", text: "Conta o que **sente.**" },
    { key: "h2", cls: "l top", style: "top:190px", text: "Onde **dói.**" },
    { key: "h3", cls: "l top", style: "top:190px", text: "Desde **quando.**" },
    { key: "h4", cls: "l top", style: "top:190px", text: "Remédios e **alergias.**" },
    { key: "h5", cls: "l top", style: "top:190px", text: "Ela já chega **sabendo.**" },
  ],
  frame: {
    title: "Anamnese completa",
    scene: "O iPhone percorre a anamnese inteira do plantão: digita o motivo, marca a cabeça no corpo e a intensidade, diz desde quando e como está evoluindo, confirma remédios e alergias, pula os anexos, revisa e envia",
    motion: "typing, taps with press, bottom sheet, state slides, one headline swap per step, slow push per step",
    body: "Cinco passos reais do app, um título por passo: “Conta o que sente.”, “Onde dói.”, “Desde quando.”, “Remédios e alergias.” e, na revisão e no envio, “Ela já chega sabendo.”",
  },
  run: function (S, A) {
    gsap.set(S.one(".vmk-device"), { opacity: 1 });
    A.sub("revisao", "Dor de cabeça forte desde ontem, piora quando fico no computador", DATA.slice(0, -1));
    S.boot("motivo");
    var base = { x: 201, y: 437, zoom: 1.65, ax: 540, ay: 1180, free: true };
    S.cam(0, base, 0.01);
    function head(prev, next, t) {
      if (prev) A.out(t - 0.35, prev, { dir: "up" });
      A.rise(t + 0.1, next);
    }
    function tap(t, el) {
      S.cursorTo(t - 0.45, el, 0.4);
      S.click(t, el, { press: true });
    }

    head(null, "h1", 0.2);
    var ta = S.one("textarea", S.state("motivo"));
    S.cam(0.3, { x: 201, y: 330, zoom: 1.9, ax: 540, ay: 1120, free: true }, 1.2, "power2.inOut");
    S.cursorEnter(0.5, ta, 0.4);
    S.click(1.0, ta);
    var typed = S.type(1.2, ta, DATA, { cps: 24 });
    var t = typed + 0.9;
    S.cam(t - 0.7, base, 0.9, "power2.inOut");
    tap(t, S.pick("motivo", "Salvar e continuar"));

    t = S.nav(t + 0.15, "dor", { dur: 0.45 });
    head("h1", "h2", t - 0.3);
    var spot = { x: 189, y: 340, w: 24, h: 24, cx: 201, cy: 352 };
    tap(t + 0.8, spot);
    t = S.nav(t + 0.95, "dor-sheet", { kind: "fade", dur: 0.4 });
    tap(t + 1.0, S.pick("dor-sheet", "Latejante"));
    S.show(t + 1.1, "dor-sheet-set");
    tap(t + 2.0, S.pick("dor-sheet-set", "Confirmar"));
    t = S.nav(t + 2.15, "dor-marked", { kind: "fade", dur: 0.35 });
    tap(t + 1.1, S.pick("dor-marked", "Salvar e continuar"));

    t = S.nav(t + 1.25, "tempo", { dur: 0.45 });
    head("h2", "h3", t - 0.3);
    tap(t + 0.9, S.pick("tempo", "Ontem"));
    tap(t + 1.6, S.pick("tempo", "Piorando"));
    S.show(t + 1.7, "tempo-set");
    tap(t + 2.6, S.pick("tempo-set", "Salvar e continuar"));

    t = S.nav(t + 2.75, "contexto", { dur: 0.45 });
    head("h3", "h4", t - 0.3);
    tap(t + 1.0, S.pick("contexto", "Nenhuma alergia conhecida"));
    S.show(t + 1.1, "contexto-set");
    tap(t + 2.0, S.pick("contexto-set", "Salvar e continuar"));

    t = S.nav(t + 2.15, "anexos", { dur: 0.45 });
    tap(t + 1.2, S.pick("anexos", "Revisar anamnese"));

    t = S.nav(t + 1.35, "revisao", { dur: 0.45 });
    head("h4", "h5", t - 0.3);
    tap(t + 2.6, S.pick("revisao", "Enviar anamnese"));
    t = S.nav(t + 2.75, "enviada", { kind: "fade", dur: 0.4 });
    S.cursorExit(t, "down", 0.4);
    S.add(function (tl) {
      tl.set({}, {}, t + 2.0);
    });
    A.out(t + 1.7, "h5", { dir: "up" });
  },
};
