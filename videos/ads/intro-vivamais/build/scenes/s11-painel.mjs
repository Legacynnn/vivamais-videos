export default {
  id: "s11-painel",
  device: "laptop",
  vo: "l11",
  voAt: 0.3,
  tail: 0.4,
  seam: { axis: "z", dir: -1, technique: "inverse zoom-through (pull back to the RH desk)" },
  urls: { home: "vivamais.ai/painel-empresarial/home", uso: "vivamais.ai/painel-empresarial/credit-usage", fin: "vivamais.ai/painel-empresarial/financeiro" },
  states: [["dash-final", 0], ["uso", 0], ["fin-paid", 560]],
  sfx: [
    { name: "tick", at: 0.25, vol: 0.4 },
    { name: "pop", at: 4.3, vol: 0.35 },
    { name: "pop", at: 5.3, vol: 0.35 },
    { name: "cash", at: 6.6, vol: 0.45 },
    { name: "hit", at: 7.8, vol: 0.5 },
    { name: "hit", at: 9.05, vol: 0.55 },
  ],
  ad: [
    { key: "p", cls: "m top", style: "top:180px;font-size:60px", text: "Tudo num painel **só.**" },
    { key: "q1", cls: "m top", style: "top:262px;font-size:52px", text: "Quem usou." },
    { key: "q2", cls: "m top", style: "top:324px;font-size:52px", text: "Quanto usou." },
    { key: "q3", cls: "m top", style: "top:386px;font-size:52px", text: "Uma **fatura.**" },
    { key: "n1", cls: "l top", style: "top:196px;font-size:96px", text: "Sem planilha." },
    { key: "n2", cls: "l top", style: "top:300px;font-size:96px", text: "Sem **surpresa.**" },
  ],
  frame: {
    title: "O RH vê tudo",
    scene: "De volta ao notebook: Dashboard com créditos utilizados, Relatório de uso por colaborador (quem, especialidade, custo, crédito da empresa), Financeiro com uma fatura de créditos paga; à esquerda o texto cinético fecha em “Sem planilha. Sem surpresa.”",
    motion: "inverse zoom-through seam, cards reveal, url swaps with page cuts, rows waterfall, column marks, text column stacking then clearing for the two-beat close",
    body: "A câmera recua para o notebook do RH. O Dashboard entra com os cartões e os créditos utilizados. Em “quem usou, quanto usou” o Relatório de uso entra linha a linha com nome e custo destacados. Em “uma fatura” o Financeiro mostra a fatura de créditos paga. A coluna de texto limpa e “Sem planilha.” e “Sem surpresa.” batem um depois do outro.",
  },
  run: function (S, A) {
    gsap.set(S.one(".vmk-device"), { opacity: 1 });
    A.sub("fin-paid", "Fatura de uso de creditos", "Fatura de uso de créditos");
    A.sub("fin-paid", "Faturamento de Creditos", "Faturamento de Créditos");
    A.sub("fin-paid", "0 item(ns) de crédito", "6 item(ns) de crédito");
    A.sub("fin-paid", "0 consulta(s)", "6 consulta(s)");
    S.boot("dash-final");
    S.url(0, "home");
    S.cam(0, { x: 600, y: 472, zoom: 1.35, ax: 540, ay: 1180, free: true }, 0.01);
    A.rise(A.w("painel") - 0.35, "p");
    var tq = A.w("Quem") - 0.35;
    S.url(tq, "uso");
    S.show(tq, "uso");
    var u = S.state("uso");
    var trs = S.all("main table tbody tr", u);
    S.rows(tq + 0.05, trs, { y: 24, stagger: 0.06, dur: 0.3 });
    A.rise(A.w("Quem"), "q1");
    var first = trs[0].querySelectorAll("td");
    S.mark(A.w("Quem") + 0.05, first[0], { hold: 0.7, pad: 2, radius: 10 });
    A.rise(A.w("quanto"), "q2");
    var costIdx = 4;
    var costCol = S.all("main table tbody tr td:nth-child(" + (costIdx + 1) + ")", u).slice(0, 6);
    var cr = S.rect(costCol[0]);
    var cl = S.rect(costCol[costCol.length - 1]);
    S.mark(A.w("quanto") + 0.1, { x: cr.x, y: cr.y, w: cr.w, h: cl.y + cl.h - cr.y, cx: cr.cx, cy: (cr.y + cl.y + cl.h) / 2 }, { hold: 0.8, pad: 4, radius: 12 });
    var tf = A.w("fatura") - 0.4;
    S.url(tf, "fin");
    S.show(tf, "fin-paid");
    A.rise(A.w("fatura") - 0.1, "q3");
    var paid = S.pick("fin-paid", "Pago", { sel: "span, div", hit: false });
    var row = paid;
    while (row.parentElement && !/Vencimento/.test(row.textContent)) row = row.parentElement;
    S.mark(A.w("fatura") + 0.1, row, { hold: 1.0, pad: 14, radius: 16 });
    var ts = A.w("Sem") - 0.25;
    ["p", "q1", "q2", "q3"].forEach(function (k, i) {
      A.out(ts - 0.15 + i * 0.04, k, { dir: "up" });
    });
    A.slam(A.w("Sem"), "n1", { origin: "50% 50%", from: 1.3 });
    A.slam(A.w("Sem#1"), "n2", { origin: "50% 50%", from: 1.3 });
    S.cam(ts, { x: 620, y: 472, zoom: 1.29, ax: 540, ay: 1180, free: true }, 2.0, "power2.inOut");
  },
};
