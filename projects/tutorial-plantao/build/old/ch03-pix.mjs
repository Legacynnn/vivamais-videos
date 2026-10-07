export default {
  id: "ch03-pix",
  device: "iphone",
  speed: 1.22,
  title: "Pague com Pix",
  lines: ["Pague", "com Pix"],
  lead: "O código aparece na hora. A Viva Mais confirma o pagamento sozinha.",
  tail: 1.2,
  states: [["pagar", 0], ["pagar-qr", 0], ["sucesso", 0]],
  captions: [
    { title: "Três passos", body: "Gere o código, pague no app do banco e **entre na fila**." },
    { title: "Seu código Pix", body: "Leia o **QR Code** com outro celular ou use **Copiar código**." },
    { title: "Pague pelo banco", body: "A câmera do banco lê o QR e você **confirma o Pix**." },
    { title: "Comprovante na hora", body: "O banco mostra o **comprovante** do pagamento." },
    { title: "Confirmação automática", body: "Não precisa avisar: a Viva Mais **reconhece o Pix** sozinha." },
    { title: "Vaga garantida", body: "Pagamento confirmado. Sua vaga no **Plantão 24h** está reservada." },
  ],
  frame: {
    title: "Pague com Pix",
    scene: "Pagar com Pix: passos, QR Code gerado, celular do banco lendo o QR, comprovante, verificação automática, confete e vaga reservada",
    poster: 16,
    motion: "cursor-led action, acted-out payment (phone scan, confirm, receipt), verify ring, confetti burst, attached tooltips",
    body: "Título central. O iPhone mostra Pagar com Pix com o total R$ 59,90 e o benefício. Toque em Gerar Pix mostra o QR Code. Um segundo celular (app do banco) entra pela direita, lê o QR, confirma o Pix e mostra o comprovante. Sai de cena; sobre o QR a Viva Mais verifica sozinha, o anel se completa, confete, e a tela vira “Sua vaga está reservada”.",
  },
  run: function (S) {
    S.boot("pagar");
    S.introIn(0.5);
    S.introOut(3.1);
    var t = 4.3;
    S.cam(t - 0.2, { x: 201, y: 420, zoom: 1.5 }, 1.0);
    var how = S.pick("pagar", "Como funciona");
    S.caption(t + 0.4, 0, { at: S.rect(how.parentElement) });
    S.mark(t + 0.6, how.parentElement, { hold: 1.8, pad: 4, radius: 18 });
    var gen = S.pick("pagar", "Gerar Pix");
    t = 7.4;
    S.cursorEnter(t, gen, 0.6);
    S.click(t + 0.75, gen, { press: true });
    S.show(t + 1.0, "pagar-qr", { fade: 0.3 });
    var svgs = S.all("svg", S.state("pagar-qr")).filter(function (n) {
      var r = n.getBoundingClientRect();
      return r.width > 150 && r.height > 150;
    });
    var qr = svgs[0];
    var qrCard = qr;
    while (qrCard.parentElement && !/Aguardando pagamento/.test(qrCard.textContent)) qrCard = qrCard.parentElement;
    t = 9.0;
    S.cam(t, { x: 201, y: 540, zoom: 1.5, ax: 900 }, 1.0);
    S.caption(t + 0.4, 1, { at: S.rect(qr), side: "left" });
    S.mark(t + 0.6, qr, { hold: 1.6, pad: 10, radius: 16 });
    S.cursorExit(t + 0.3, "left", 0.5);
    t = 11.6;
    var ph = S.phone(t, qr, { amount: "R$ 59,90", to: "VIVA MAIS SA", about: "Plantão 24h", dur: 1.5, when: "29/09/2026, 14:26", code: "E3175…9A2C1", gap: 110 });
    S.caption(ph.sheet, 2, { at: S.rect(qr), side: "left" });
    S.caption(ph.receipt, 3, { at: S.rect(qr), side: "left" });
    var vt = ph.settled + 0.9;
    ph.out(vt - 0.55);
    S.cam(vt - 0.4, { x: 201, y: 540, zoom: 1.55 }, 0.9);
    var v = S.verify(vt, qrCard, { wait: "Verificando pagamento...", title: "Pagamento confirmado!", steps: ["Aguardando o banco", "Pix recebido", "Reservando sua vaga"], sub: "Sua vaga no plantão está garantida.", each: 0.75 });
    S.caption(vt + 0.3, 4, { at: S.rect(qrCard) });
    S.confetti(v.burst, v.at, { count: 90, seed: 7 });
    var ok = v.done + 1.3;
    v.hide(ok);
    S.show(ok + 0.2, "sucesso", { fade: 0.35 });
    S.cam(ok + 0.2, { x: 201, y: 420, zoom: 1.5 }, 1.0);
    var title = S.pick("sucesso", "Sua vaga está reservada");
    S.popIn(ok + 0.3, title, { from: 0.9, y: 16, dur: 0.4, origin: "50% 50%" });
    S.caption(ok + 0.7, 5, { at: S.rect(title) });
    S.confetti(ok + 0.35, S.rect(title), { count: 60, seed: 21, power: 0.8 });
    S.note("sucesso", ok + 0.2);
  },
};
