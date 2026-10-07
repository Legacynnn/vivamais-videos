export default {
  id: "ch11-relatorio",
  num: "11",
  kicker: "Acompanhamento",
  title: "Acompanhe o uso",
  chip: "Relatório de uso",
  lead: "Veja quem usou, qual especialidade, quanto custou e se saiu dos créditos.",
  steps: ["Totais do período", "Consumo por colaborador", "Reflexo no painel"],
  device: "laptop",
  tail: 1.7,
  urls: { uso: "vivamais.ai/painel-empresarial/credit-usage", painel: "vivamais.ai/painel-empresarial/home" },
  states: [["uso", 0], ["dash-final", 0]],
  captions: [
    { step: "Passo 1", title: "Totais do período", body: "Registros, **custo total**, consultas e quantas usaram crédito da empresa." },
    { step: "Passo 2", title: "Consumo por colaborador", body: "Cada linha traz a vida, o plano, a **especialidade**, o custo e a data." },
    { step: "Pronto", title: "Tudo refletido no painel", body: "Vidas ativas, **créditos utilizados** no mês e planos vigentes, sempre atualizados." },
  ],
  frame: {
    title: "Acompanhe o uso",
    scene: "Relatório de uso com seis consultas e volta ao Dashboard com os números atualizados",
    poster: 9,
    motion: "dataviz-countup + cursor-ui-demo; rules counting-dynamic-scale (totais), waterfall-entry (linhas), coordinate-target-zoom, css-marker-patterns, cursor-click-ripple",
    body: "Coluna “11 · Acompanhe o uso”. No Relatório de uso os totais contam até 6 registros e R$ 839,50; as seis linhas de Consumo geral por colaborador entram em cascata (Marina Azevedo · Cardiologia · R$ 189,90 em destaque). O cursor clica em Dashboard e o painel mostra 9 vidas, 7 ativas, R$ 839,50 em créditos utilizados e 2 planos vigentes.",
  },
  run: function (S) {
    var u = S.state("uso");
    S.boot("uso");
    S.url(0, "uso");
    S.introIn(0.5);
    S.introOut(3.1);
    S.cam(3.4, { x: 900, y: 330, zoom: 1.45 }, 1.1);
    S.caption(4.0, 0);
    var vals = S.all("main .grid p.text-2xl", u);
    var brl = function (v) {
      return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    var int = function (v) {
      return String(Math.round(v));
    };
    S.count(4.3, vals[0], 0, 6, int, 0.8);
    S.count(4.4, vals[1], 0, 839.5, brl, 1.1);
    S.count(4.5, vals[2], 0, 6, int, 0.8);
    S.count(4.6, vals[3], 0, 6, int, 0.8);
    S.mark(5.6, vals[1].closest('[class*="rounded-lg"]'), { hold: 1.3, pad: 2, radius: 14 });

    var rows = S.all("main table tbody tr", u);
    var t = 7.3;
    S.caption(t, 1);
    S.cam(t, { x: 900, y: 560, zoom: 1.5 }, 1.0);
    S.rows(t + 0.3, rows, { y: 24, stagger: 0.08, dur: 0.34 });
    S.cursorEnter(t + 0.6, rows[0], 0.8);
    S.mark(t + 1.5, S.rect(rows[0]), { hold: 1.6, pad: 0, radius: 12 });

    var dash = S.find("uso", "aside nav a", "Dashboard");
    t = t + 3.4;
    S.cam(t, { x: 720, y: 400, zoom: 1.3334 }, 0.9);
    t = S.go(t + 0.3, dash, { move: 0.8 });
    var f = S.flash(t + 0.22, ["De volta", "ao painel."]);
    S.show(f.cover + 0.2, "dash-final");
    S.url(f.cover + 0.2, "painel");
    var d = f.out + 0.12;
    S.caption(d + 0.3, 2);
    S.cam(f.cover + 0.2, { x: 900, y: 330, zoom: 1.45 }, 0.6, "power3.out");
    S.cursorAside(f.cover, 260, 330, 0.7);
    var f = S.state("dash-final");
    var dv = S.all("main .grid h3.text-2xl", f);
    S.rows(d + 0.05, S.all('main .grid [class*="bg-card"]', f).slice(0, 4), { y: 22, stagger: 0.06, dur: 0.32 });
    S.count(d + 0.2, dv[0], 0, 9, int, 0.8);
    S.count(d + 0.3, dv[1], 0, 7, int, 0.8);
    S.count(d + 0.4, dv[2], 0, 839.5, brl, 1.1);
    S.count(d + 0.5, dv[3], 0, 2, int, 0.6);
    S.mark(d + 1.6, dv[2].closest('[class*="bg-card"]'), { hold: 1.5, pad: 2, radius: 14 });
  },
};
