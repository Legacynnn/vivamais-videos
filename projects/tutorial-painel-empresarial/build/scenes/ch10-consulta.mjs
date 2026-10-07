export default {
  id: "ch10-consulta",
  num: "10",
  kicker: "Do lado da vida",
  title: "A vida entra na consulta",
  lines: ["A vida entra", "na consulta"],
  chip: "A consulta da vida",
  lead: "No horário marcado, a vida acessa a sala online pelo próprio dispositivo.",
  steps: ["Consulta agendada", "Médico e horário", "Sala online"],
  seam: { axis: "y", dir: -1, technique: "cut-the-curve UP" },
  device: "tablet",
  tail: 1.7,
  urls: { consulta: "vivamais.ai/consulta" },
  states: [["consulta", 0]],
  captions: [
    { step: "Passo 1", title: "A consulta aparece para a vida", body: "Especialidade, **médico**, data e horário em uma única tela." },
    { step: "Passo 2", title: "Pago pela empresa", body: "Valor de R$ 189,90 com pagamento **confirmado**: a vida não paga nada." },
    { step: "Passo 3", title: "Atendimento por vídeo", body: "Na hora marcada, **Iniciar videochamada** abre a sala online com o médico." },
  ],
  frame: {
    title: "A vida entra na consulta",
    scene: "Tablet da Marina: Sua consulta de Cardiologia com Dra. Mariana Costa, resumo com pagamento confirmado e acesso à sala",
    poster: 8,
    motion: "device-surface-showcase; rules coordinate-target-zoom, multi-phase-camera, css-marker-patterns, waterfall-entry (cartões)",
    body: "Coluna “10 · A vida entra na consulta” e o tablet com a página Sua consulta. A câmera entra no cabeçalho (Cardiologia · Médico: Mariana Costa · Agendada), passa pelos participantes com a foto da médica, destaca no Resumo o pagamento Confirmado e termina no botão de acesso no horário agendado.",
  },
  run: function (S) {
    var c = S.state("consulta");
    S.boot("consulta");
    S.url(0, "consulta");
    S.introIn(0.5);
    S.introOut(3.1);
    var title = S.find("consulta", "main h1, main h2", "Sua consulta");
    var head = title.closest('[class*="rounded"]') || title.parentElement;
    S.cam(3.4, { x: 590, y: 330, zoom: 1.7 }, 1.2);
    S.caption(4.0, 0);
    S.mark(4.8, S.rect(head), { hold: 1.5, pad: 2, radius: 18 });
    var doc = S.find("consulta", "main p, main span, main div", /^Mariana Costa$/, 1);
    var part = doc.closest('[class*="rounded-xl"], [class*="rounded-lg"]') || doc.parentElement;
    S.cursorEnter(5.2, part, 0.8);
    S.cam(6.4, { x: 480, y: 560, zoom: 1.8 }, 1.0);
    S.cursorTo(6.4, doc, 0.8);
    S.mark(7.2, S.rect(part), { hold: 1.4, pad: 4, radius: 16 });

    var pay = S.find("consulta", "main *", /^Confirmado$/);
    var t = 9.0;
    S.caption(t, 1);
    S.cam(t, { x: 880, y: 560, zoom: 1.8 }, 1.0);
    S.cursorTo(t + 0.2, pay, 0.8);
    S.mark(t + 1.0, S.rect(pay.parentElement), { hold: 1.5, pad: 6, radius: 12 });

    var btn = S.all("main button", c).filter(function (b) {
      return /Iniciar videochamada/.test(b.textContent);
    })[0];
    t = 11.8;
    S.caption(t, 2);
    S.camOn(t, S.rect(btn), { max: 1.8, min: 1.7, pad: 120, ax: 1180, ay: 430 }, 1.0);
    S.cursorTo(t + 0.3, btn, 0.8);
    S.click(t + 1.25, btn, { press: true });
    S.mark(t + 1.4, S.rect(btn), { hold: 1.5, pad: 6, radius: 14 });
  },
};
