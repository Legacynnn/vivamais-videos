export default {
  id: "s07b-anamnese",
  device: "iphone",
  tail: 0.3,
  seam: { axis: "y", dir: -1, technique: "cut-the-curve UP" },
  states: [
    ["empty", 0, "plantao-anamnese empty"],
    ["symptom", 0, "plantao-anamnese symptom"],
    ["since-blank", 0, "plantao-anamnese-steps since-blank"],
    ["since", 0, "plantao-anamnese since"],
    ["where", 0, "plantao-anamnese-steps where"],
    ["pain", 0, "plantao-anamnese pain"],
    ["health", 0, "plantao-anamnese health"],
    ["done", 0, "plantao-anamnese done"],
    ["fila", 0, "plantao-queue position-3"],
  ],
  sfx: [
    { name: "tap", at: 1.2, vol: 0.4 },
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
    scene: "O iPhone percorre a anamnese real do plantão: sintomas (Dor de cabeça), desde quando (Ontem), onde dói (Cabeça), como é e quanto dói (Latejante, 7), alergias e remédios, compartilhar o histórico, enviar; volta para a fila do plantão",
    motion: "taps with press, state pushes, one headline swap per step, slow push per step",
    body: "Os passos reais do app, um título por passo: “Conta o que sente.”, “Desde quando.”, “Onde dói.”, “Remédios e alergias.” e, no compartilhamento e no envio, “Ela já chega sabendo.” Ao enviar, a fila do plantão volta com a Ana em 3º.",
  },
  run: function (S, A) {
    gsap.set(S.one(".vmk-device"), { opacity: 1 });
    S.boot("empty");
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
    S.cam(0.3, { x: 201, y: 470, zoom: 1.8, ax: 540, ay: 1120, free: true }, 1.2, "power2.inOut");
    var dc = S.pick("empty", "Dor de cabeça");
    S.cursorEnter(0.7, dc, 0.4);
    S.click(1.2, dc, { press: true });
    S.show(1.3, "symptom", { fade: 0.15 });
    var G = 0.3;
    var t = 3.6;
    S.cam(t - 0.9, base, 0.9, "power2.inOut");
    tap(t, S.pick("symptom", "Continuar"));

    t = S.nav(t + 0.15 + G, "since-blank", { dur: 0.45 });
    head("h1", "h3", t - 0.3);
    tap(t + 1.0, S.pick("since-blank", "Ontem"));
    S.show(t + 1.1, "since", { fade: 0.15 });
    tap(t + 2.1, S.pick("since", "Continuar"));

    t = S.nav(t + 2.25 + G, "where", { dur: 0.45 });
    head("h3", "h2", t - 0.3);
    tap(t + 0.9, S.pick("where", "Cabeça"));
    tap(t + 1.8, S.pick("where", "Continuar"));
    t = S.nav(t + 1.95, "pain", { dur: 0.45 });
    tap(t + 0.9, S.pick("pain", "Latejante / pulsante"));
    tap(t + 1.8, S.pick("pain", "7"));
    tap(t + 2.8, S.pick("pain", "Continuar"));

    t = S.nav(t + 2.95 + G, "health", { dur: 0.45 });
    head("h2", "h4", t - 0.3);
    S.mark(t + 0.6, S.pick("health", "Penicilina", { hit: false }), { hold: 0.8, pad: 6, radius: 14 });
    tap(t + 1.9, S.pick("health", "Não uso remédios"));
    tap(t + 2.8, S.pick("health", "Continuar"));

    t = S.nav(t + 2.95 + G, "done", { dur: 0.45 });
    head("h4", "h5", t - 0.3);
    tap(t + 2.0, S.pick("done", "Enviar anamnese"));
    t = S.nav(t + 2.15 + G, "fila", { kind: "back", dur: 0.45 });
    S.cursorExit(t, "down", 0.4);
    S.status(t - 0.3, true);
    S.add(function (tl) {
      tl.set({}, {}, t + 2.4);
    });
    A.out(t + 2.1, "h5", { dir: "up" });
  },
};
