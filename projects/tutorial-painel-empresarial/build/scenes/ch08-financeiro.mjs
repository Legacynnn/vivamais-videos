export default {
  id: "ch08-financeiro",
  num: "08",
  kicker: "Pagamentos",
  title: "Pague a fatura",
  chip: "Faturas e pagamento",
  lead: "Assinatura e créditos ficam no Financeiro, com PIX direto na tela.",
  steps: ["Resumo de planos e créditos", "Fatura com QR Code", "Pagamento confirmado"],
  device: "laptop",
  tail: 1.7,
  urls: { fin: "vivamais.ai/painel-empresarial/financeiro" },
  states: [["fin-pending", 0], ["fin-copied", 760], ["fin-paid", 298]],
  captions: [
    { step: "Passo 1", title: "Tudo em um só lugar", body: "Valor da assinatura, **créditos disponíveis** e créditos utilizados no ciclo." },
    { step: "Passo 2", title: "Fatura com PIX na tela", body: "Escaneie o QR Code ou use **Copiar código PIX** e pague no app do banco." },
    { step: "Passo 3", title: "Pague pelo app do banco", body: "Aponte a câmera do celular para o QR Code e **confirme o PIX**." },
    { step: "Passo 4", title: "Comprovante na hora", body: "O banco confirma o envio e mostra o **comprovante**." },
    { step: "Pronto", title: "Fatura paga", body: "A Viva Mais confirma sozinha: o status muda para **Pago**." },
  ],
  frame: {
    title: "Pague a fatura",
    scene: "Financeiro: cards de Planos & Créditos, fatura de R$ 1.500,00 pendente com QR Code PIX, código copiado e status Pago",
    poster: 11,
    motion: "cursor-ui-demo (Key_Feature, chase); rules nudge-curve (scroll), coordinate-target-zoom (fatura, QR), css-marker-patterns, dynamic-content-sequencing (Pendente → Pago), cursor-click-ripple, press-release-spring",
    body: "Coluna “08 · Pague a fatura”. A página Financeiro abre em Planos & Créditos (R$ 499,00/mês, créditos disponíveis e utilizados). A página rola até Faturamento de Créditos: fatura de R$ 1.500,00 com selo Pendente e o bloco PIX com QR Code e código copia e cola. O cursor clica em Copiar código PIX (vira “Código copiado”). Depois do pagamento a fatura aparece com o selo Pago e Total Pago atualizado.",
  },
  run: function (S) {
    var pages = ["fin-pending"];
    S.boot("fin-pending");
    S.url(0, "fin");
    S.introIn(0.5);
    S.introOut(3.1);
    var p = S.state("fin-pending");
    S.cam(3.4, { x: 900, y: 330, zoom: 1.4 }, 1.1);
    S.caption(4.0, 0);
    var top = S.all("main .grid", p)[0];
    var cards = Array.prototype.slice.call(top.children).slice(0, 3);
    cards.forEach(function (c, i) {
      S.mark(4.7 + i * 0.3, c, { hold: 1.9 - i * 0.3, pad: 2, radius: 14 });
    });

    var t = 7.2;
    S.capTo(t - 0.2, "top");
    S.caption(t + 0.35, 1);
    S.scroll(t, pages, 760, 1.1);
    var qr = S.one('main img[alt="QR Code PIX"]', p);
    var copy = S.find("fin-pending", "main button", "Copiar código PIX");
    var pix = qr.closest('[class*="border-emerald-200"]');
    S.camOn(t, S.rect(pix), { max: 1.7, min: 1.45, pad: 60, ax: 1060, ay: 470 }, 1.1);
    S.mark(t + 1.3, qr.closest("button") || qr, { hold: 1.5, pad: 4, radius: 16 });
    S.cursorEnter(t + 1.6, copy, 0.8);
    S.click(t + 2.9, copy, { press: true });
    S.show(t + 3.05, "fin-copied");
    var copied = S.find("fin-copied", "main button", "Código copiado");
    S.mark(t + 3.15, copied, { hold: 1.2, pad: 4, radius: 12 });

    var pay = t + 4.7;
    S.caption(pay, 2);
    S.cursorExit(pay, "left", 0.5);
    var code = S.one('main img[alt="QR Code PIX"]', S.state("fin-copied"));
    var ph = S.phone(pay + 0.3, code, { amount: "R$ 1.500,00", to: "VIVA MAIS SA", about: "Créditos de saúde", dur: 1.5, when: "29/09/2026, 12:31", code: "E1823…7C4D9" });
    S.caption(ph.sent + 0.25, 3);

    var paid = ph.settled + 1.2;
    ph.out(paid - 0.55);
    S.show(paid, "fin-paid", { fade: 0.28 });
    S.caption(paid + 0.3, 4);
    var badge = S.find("fin-paid", "main *", /^Pago$/, 0);
    var all = S.all("main *", S.state("fin-paid")).filter(function (e) {
      return e.children.length === 0 && e.textContent.trim() === "Pago";
    });
    var last = all[all.length - 1] || badge;
    var inv = last.closest('[class*="rounded-xl"]') || last.parentElement;
    S.camOn(paid, S.rect(inv), { max: 1.6, min: 1.4, pad: 80, ax: 1060, ay: 470 }, 1.0, "power3.out");
    S.popIn(paid + 0.1, last, { from: 1.5, dur: 0.4, origin: "50% 50%" });
    S.mark(paid + 0.7, last, { hold: 1.7, pad: 8, radius: 999 });
    S.confetti(paid + 0.3, last, { count: 70, seed: 9 });
  },
};
