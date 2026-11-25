export default {
  id: "ch05-anamnese",
  device: "iphone",
  speed: 1.2,
  title: "Conte o que sente",
  lines: ["Conte o", "que sente"],
  lead: "Quatro etapas rápidas. O médico chega sabendo do seu caso.",
  tail: 0.5,
  states: [
    ["vazio", 0, "plantao-anamnese empty"],
    ["sintomas", 0, "plantao-anamnese symptom"],
    ["inicio", 0, "plantao-anamnese since"],
    ["dor", 0, "plantao-anamnese pain"],
    ["saude", 0, "plantao-anamnese health"],
    ["historico", 0, "plantao-anamnese done"],
    ["fila", 0, "plantao-queue position-4"],
  ],
  captions: [
    { title: "Vaga guardada", body: "Você já está na fila. Responda **enquanto espera**: são quatro etapas." },
    { title: "O que você sente", body: "Toque nos sintomas. Pode marcar **quantos quiser**." },
    { title: "Desde quando", body: "Hoje, ontem, há alguns dias: **um toque** basta." },
    { title: "Como é a dor", body: "Tipo e intensidade. Aqui, **latejante e forte**." },
    { title: "Alergias e remédios", body: "Confirme o que já está na sua **ficha de saúde**." },
    { title: "Seu histórico", body: "Escolha o que o médico **pode ver**: ficha, exames e consultas." },
    { title: "Enviada", body: "Anamnese entregue. Você **volta para a fila**." },
  ],
  frame: {
    title: "Conte o que sente",
    scene: "Anamnese do plantão em quatro etapas (Sintomas, Dor, Saúde, Compartilhar seu histórico) aberta por cima da fila, com chips tocados e envio",
    poster: 10,
    motion: "modal sheet over the queue, step fades, cursor taps on chips, stepper advancing, modal dismiss back to the queue",
    body: "Título central. A anamnese abre por cima da fila com o aviso Sua vaga está guardada. Dor de cabeça é tocada, Desde quando? recebe Ontem, Como é a sua dor? recebe Latejante e nota 7, Saúde mostra a alergia a penicilina e Não uso remédios, e Compartilhar seu histórico mostra o que o médico do plantão pode ver. Enviar anamnese fecha a folha e revela a fila.",
  },
  run: function (S) {
    S.boot("vazio");
    S.introIn(0.05);
    S.introOut(2.9);
    var by = function (name, label) {
      return S.one('[aria-label="' + label + '"]', S.state(name));
    };
    var t = 3.7;
    var notice = S.pick("vazio", "Sua vaga está guardada");
    while (notice.parentElement && notice.getBoundingClientRect().height < 48) notice = notice.parentElement;
    S.cam(t - 0.2, { x: 201, y: 260, zoom: 1.5 }, 1.0);
    S.caption(t + 0.5, 0, { at: S.rect(notice), side: "right" });
    S.mark(t + 0.7, notice, { hold: 1.5, pad: 4, radius: 18 });
    t += 2.8;

    var head = by("vazio", "Dor de cabeça");
    S.cam(t, { x: 201, y: 460, zoom: 1.45 }, 0.9);
    S.caption(t + 0.3, 1, { at: S.rect(head), side: "right" });
    S.cursorEnter(t + 0.4, head, 0.6);
    S.click(t + 1.2, head, { press: true });
    S.show(t + 1.3, "sintomas", { fade: 0.2 });
    var c0 = by("sintomas", "Continuar");
    S.cam(t + 1.7, { x: 201, y: 640, zoom: 1.4 }, 0.8);
    S.cursorTo(t + 1.9, c0, 0.5);
    S.click(t + 2.5, c0, { press: true });
    t = S.nav(t + 2.65, "inicio", { kind: "fade", dur: 0.35 });

    var ontem = by("inicio", "Ontem");
    S.cam(t - 0.2, { x: 201, y: 360, zoom: 1.5 }, 0.8);
    S.caption(t + 0.2, 2, { at: S.rect(ontem), side: "right" });
    S.cursorTo(t + 0.3, ontem, 0.5);
    S.click(t + 0.9, ontem, { press: true });
    var c1 = by("inicio", "Continuar");
    S.cam(t + 1.5, { x: 201, y: 640, zoom: 1.4 }, 0.8);
    S.cursorTo(t + 1.6, c1, 0.5);
    S.click(t + 2.2, c1, { press: true });
    t = S.nav(t + 2.35, "dor", { kind: "fade", dur: 0.35 });

    var lat = by("dor", "Latejante / pulsante");
    var seven = by("dor", "7, Forte");
    S.cam(t - 0.2, { x: 201, y: 420, zoom: 1.45 }, 0.8);
    S.caption(t + 0.2, 3, { at: S.rect(lat), side: "right" });
    S.cursorTo(t + 0.3, lat, 0.5);
    S.click(t + 0.9, lat, { press: true });
    S.cursorTo(t + 1.3, seven, 0.5);
    S.click(t + 1.9, seven, { press: true });
    S.mark(t + 2.0, seven, { hold: 0.8, pad: 4, radius: 14 });
    var c2 = by("dor", "Continuar");
    S.cam(t + 2.6, { x: 201, y: 640, zoom: 1.4 }, 0.8);
    S.cursorTo(t + 2.8, c2, 0.5);
    S.click(t + 3.4, c2, { press: true });
    t = S.nav(t + 3.55, "saude", { kind: "fade", dur: 0.35 });

    var alergia = S.pick("saude", /^Tem alguma alergia\?/, { hit: false });
    while (alergia.parentElement && !/Não tenho alergia/.test(alergia.textContent)) alergia = alergia.parentElement;
    var noMeds = S.pick("saude", "Não uso remédios");
    S.cam(t - 0.2, { x: 201, y: 420, zoom: 1.4 }, 0.8);
    S.caption(t + 0.2, 4, { at: S.rect(alergia), side: "right" });
    S.mark(t + 0.4, alergia, { hold: 1.2, pad: 4, radius: 18 });
    S.cursorTo(t + 1.4, noMeds, 0.5);
    S.click(t + 2.0, noMeds, { press: true });
    var c3 = by("saude", "Continuar");
    S.cam(t + 2.4, { x: 201, y: 640, zoom: 1.4 }, 0.8);
    S.cursorTo(t + 2.6, c3, 0.5);
    S.click(t + 3.2, c3, { press: true });
    t = S.nav(t + 3.35, "historico", { kind: "fade", dur: 0.35 });

    var share = S.pick("historico", "O que o médico do plantão pode ver?");
    while (share.parentElement && !/Outras consultas/.test(share.textContent)) share = share.parentElement;
    S.cam(t - 0.2, { x: 201, y: 380, zoom: 1.45 }, 0.8);
    S.caption(t + 0.2, 5, { at: S.rect(share), side: "right" });
    S.mark(t + 0.4, share, { hold: 1.5, pad: 4, radius: 18 });
    t += 2.4;
    var send = by("historico", "Enviar anamnese");
    S.cam(t, { x: 201, y: 640, zoom: 1.4 }, 0.8);
    S.cursorTo(t + 0.2, send, 0.5);
    S.click(t + 0.8, send, { press: true });
    S.captionOut(t + 0.8);
    var top = S.state("historico");
    var q = S.state("fila");
    (function (at) {
      S.add(function (tl) {
        tl.set(q, { autoAlpha: 1, zIndex: 0 }, at);
        tl.set(top, { zIndex: 3 }, at);
        tl.to(top, { y: 874, duration: 0.5, ease: "power3.in" }, at);
        tl.set(top, { autoAlpha: 0, y: 0 }, at + 0.5);
      });
    })(t + 0.95);
    S.status(t + 1.2, true);
    S.cursorExit(t + 1.0, "down", 0.4);
    S.cam(t + 1.0, { x: 201, y: 400, zoom: 1.35 }, 0.9);
    var pos = S.one('[aria-label^="Você é o 4º da fila"]', q);
    S.caption(t + 1.6, 6, { at: S.rect(pos), side: "right" });
    S.note("fila", t + 3.4);
    S.add(function (tl) {
      tl.set({}, {}, t + 3.4);
    });
  },
};
