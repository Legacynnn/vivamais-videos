export default {
  id: "ch05-acesso",
  num: "05",
  kicker: "Do lado da vida",
  title: "A vida ativa a conta",
  lines: ["A vida", "ativa a conta"],
  chip: "Primeiro acesso",
  lead: "Cada vida recebe o convite por WhatsApp ou e-mail e cria a própria senha.",
  steps: ["Abrir o convite", "Criar a senha", "Conta ativada"],
  device: "tablet",
  tail: 1.7,
  urls: { acesso: "vivamais.ai/primeiro-acesso" },
  states: [["acesso-empty", 0], ["acesso-done", 0]],
  captions: [
    { step: "Passo 1", title: "O convite abre esta tela", body: "No celular, tablet ou computador, a vida define uma **senha pessoal**." },
    { step: "Passo 2", title: "Primeiro acesso concluído", body: "Com a senha criada, a conta fica **ativada** e pronta para usar o plano." },
  ],
  frame: {
    title: "A vida ativa a conta",
    scene: "Tablet: tela Crie sua senha de acesso preenchida e confirmação de primeiro acesso concluído",
    poster: 9,
    motion: "device-surface-showcase + cursor-ui-demo; rules coordinate-target-zoom, discrete-text-sequence (senha), spring-pop-entrance (cartão de sucesso), cursor-click-ripple",
    body: "Troca de aparelho: coluna “05 · A vida ativa a conta” e um tablet com /primeiro-acesso. A câmera entra no cartão “Crie sua senha de acesso”; o cursor digita a senha nos dois campos e clica em Criar senha. O cartão troca para “Primeiro acesso concluído!” com os dados de acesso da Marina e o toast “Sua senha foi criada com sucesso!”.",
  },
  run: function (S) {
    var e = S.state("acesso-empty");
    S.boot("acesso-empty");
    S.url(0, "acesso");
    S.introIn(0.5);
    S.introOut(3.1);
    var inputs = S.all("main input", e);
    var card = S.one('main [class*="bg-card"]', e) || S.one("main > div", e);
    var cr = S.rect(card);
    S.cam(3.4, { x: cr.cx, y: cr.y + 330, zoom: 1.7, ax: 1240, ay: 470 }, 1.2);
    S.caption(4.0, 0);
    S.cursorEnter(4.4, inputs[0], 0.7);
    S.click(5.2, inputs[0]);
    var t = S.type(5.35, inputs[0], "Marina@2026", { cps: 15 });
    t = S.go(t + 0.15, inputs[1], { move: 0.4, press: false });
    t = S.type(t + 0.12, inputs[1], "Marina@2026", { cps: 15 });
    var btn = S.find("acesso-empty", "main button", "Criar senha");
    S.cam(t, { x: cr.cx, y: cr.y + 520, zoom: 1.7, ax: 1240, ay: 430 }, 0.9);
    t = S.go(t + 0.5, btn, { move: 0.55 });
    var done = t + 0.3;
    S.show(done, "acesso-done", { fade: 0.28 });
    var d = S.state("acesso-done");
    var dc = S.one('main [class*="bg-card"]', d) || S.one("main > div", d);
    var dcr = S.rect(dc);
    S.popIn(done, dc, { from: 0.95, dur: 0.4, origin: "50% 40%" });
    S.cam(done, { x: dcr.cx, y: dcr.y + 320, zoom: 1.65, ax: 1240, ay: 470 }, 1.0, "power3.out");
    S.caption(done + 0.2, 1);
    S.cursorAside(done, 250, -120, 0.7);
    S.toastIn(done + 0.5, "acesso-done");
    S.mark(done + 1.1, S.find("acesso-done", "main h1", "Primeiro acesso concluído"), { hold: 1.5, pad: 10, radius: 14 });
  },
};
