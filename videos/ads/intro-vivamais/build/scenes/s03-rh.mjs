import { vid } from "../parts/stock.mjs";

export default {
  id: "s03-rh",
  device: "laptop",
  vo: "l03",
  voAt: 1.2,
  tail: 0.45,
  seam: { axis: "z", dir: 1, technique: "signature plus", sig: true },
  urls: { vidas: "vivamais.ai/painel-empresarial/funcionarios", creditos: "vivamais.ai/painel-empresarial/creditos" },
  hud: `<div class="vmk-cut" data-layout-allow-overlap>${vid("rh-office", { id: "s03-cut", at: 0, dur: 2.9 })}<div class="shade" data-layout-allow-overlap></div><div class="cut-t" data-layout-allow-overlap>Para o RH</div></div>`,
  states: [["import-empty", 0], ["import-file", 0], ["import-success", 0], ["vidas-nine-toast", 0], ["cred-final", 0]],
  sfx: [
    { name: "tick", at: 0.3, vol: 0.4 },
    { name: "drop", at: 2.85, vol: 0.5 },
    { name: "pop", at: 4.25, vol: 0.4 },
  ],
  frame: {
    title: "O RH liga tudo",
    scene: "Notebook com o painel empresarial real: planilha arrastada para Importar Vidas, sucesso com 200 importados e convites agendados, lista cheia, página Créditos com R$ 300 por pessoa",
    motion: "cursor drag-and-drop, click ripple, rows waterfall, toast pop, url swap with page cut, offset camera leaving a kinetic text column at left",
    body: "O notebook ocupa a direita, a coluna de texto à esquerda. A planilha voa até a área pontilhada, Importar, “200 funcionário(s) importado(s). Os convites de primeiro acesso foram agendados.” A lista enche em cascata. Em “crédito de saúde” a URL troca para Créditos, o saldo conta e o limite pessoal R$ 300,00 é destacado.",
  },
  ad: [
    { key: "a1", cls: "m top", style: "top:186px;font-size:60px", text: "Uma **planilha.**" },
    { key: "a2", cls: "m top", style: "top:262px;font-size:60px", text: "Convites na **hora.**" },
    { key: "a3", cls: "m top", style: "top:338px;font-size:60px", text: "Crédito de **saúde.**" },
  ],
  run: function (S, A) {
    gsap.set(S.one(".vmk-device"), { opacity: 1 });
    A.sub("import-success", "8 funcionário(s) importado(s)", "200 funcionário(s) importado(s)");
    A.sub("vidas-nine-toast", "8 funcionário(s) importado(s)", "200 funcionário(s) importado(s)");
    A.sub("vidas-nine-toast", "Total de 9 funcionário(s)", "Total de 200 funcionário(s)");
    A.sub("cred-final", "R$ 1.500,00", "R$ 60.000,00");
    A.sub("cred-final", "Sem limite pessoal", "R$ 300,00");
    A.sub("cred-final", "R$ 200,00", "R$ 300,00");
    S.boot("import-empty");
    var cutEl = S.one(".vmk-cut");
    A.tw(function (tl) {
      tl.fromTo(cutEl.querySelector("video"), { scale: 1.1 }, { scale: 1, duration: 2.9, ease: "none" }, 0);
      tl.to(cutEl, { scale: 0.6, opacity: 0, borderRadius: 90, duration: 0.9, ease: "power2.inOut", transformOrigin: "50% 58%" }, 2.0);
      tl.set(cutEl, { autoAlpha: 0 }, 2.9);
    });

    S.url(0, "vidas");
    var e = S.state("import-empty");
    var dlg = S.one('[role="dialog"]', e);
    var dr = S.rect(dlg);
    S.cam(0, { x: 720, y: 472, zoom: 1.29, ax: 540, ay: 1180, free: true }, 0.01);
    S.cam(0.1, { x: 720, y: 472, zoom: 1.35, ax: 540, ay: 1180, free: true }, 3.2, "power2.out");

    var tp = A.w("planilha");
    A.rise(tp - 0.15, "a1");
    var drop = S.one('[class*="border-dashed"]', dlg);
    var dropped = S.drag(2.4, "colaboradores.csv", { x: dr.x + dr.w + 170, y: dr.y + dr.h - 40 }, drop, { dur: 0.65, reach: 0.35 });
    S.show(dropped + 0.1, "import-file");
    var imp = S.find("import-file", '[role="dialog"] button', /^Importar$/);
    var t = S.go(dropped + 0.2, imp, { move: 0.35 });
    S.show(t + 0.2, "import-success");
    var ok = S.one('[role="dialog"] [class*="bg-green-50"]', S.state("import-success"));
    S.popIn(t + 0.2, ok, { from: 0.96, y: 14, dur: 0.34, origin: "50% 50%" });
    S.mark(t + 0.45, ok, { hold: Math.max(0.4, A.w("cada") - 0.15 - (t + 0.45) - 0.5), pad: 4, radius: 12 });

    var list = A.w("cada") - 0.15;
    S.show(list, "vidas-nine-toast", { fade: 0.25 });
    S.cursorExit(list - 0.2, "right", 0.45);
    var vr = S.rect(S.one("main", S.state("vidas-nine-toast")));
    
    var trs = S.all("main table tbody tr", S.state("vidas-nine-toast"));
    S.rows(list + 0.1, trs.slice(1), { y: 30, stagger: 0.06, dur: 0.32 });
    S.toastIn(list + 0.35, "vidas-nine-toast");
    A.rise(A.w("convite") - 0.35, "a2");
    var badge = S.find("vidas-nine-toast", "main table tbody tr span", "Aguardando ativação");
    var col = badge.closest("td");
    var tc = A.w("crédito") - 0.45;
    var tmk = A.w("colaborador") - 0.05;
    var colR = S.rect(col);
    S.cam(tmk - 0.55, { x: colR.cx - 160, y: 472, zoom: 1.35, ax: 540, ay: 1180, free: true }, 0.55, "power2.inOut");
    S.mark(tmk, col, { hold: Math.max(0.5, tc - tmk - 0.45), pad: 4, radius: 10 });
    S.url(tc, "creditos");
    S.show(tc, "cred-final");
    var c = S.state("cred-final");
    var cr = S.rect(S.one("main", c));
    S.cam(tc, { x: 720, y: 440, zoom: 1.41, ax: 540, ay: 1180, free: true }, 1.2, "power2.out");
    var vals = S.all("main .grid p.text-2xl", c);
    if (vals[0]) S.count(tc + 0.1, vals[0], 0, 60000, function (v) {
      return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }, 0.9);
    A.rise(tc + 0.25, "a3");
    var lim = S.find("cred-final", "main table thead th", "Limite pessoal");
    var rows = S.all("main table tbody tr", c);
    S.rows(tc + 0.15, rows.slice(0, 9), { y: 18, stagger: 0.04, dur: 0.28 });
    var cell = rows[0].querySelectorAll("td")[1];
    S.mark(A.w("pago") - 0.2, cell, { hold: 1.2, pad: 2, radius: 10 });
    var ex = A.end + 0.15;
    ["a1", "a2", "a3"].forEach(function (k, i) {
      A.out(ex - 0.2 + i * 0.04, k, { dir: "up" });
    });
  },
};
