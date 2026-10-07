export default {
  id: "ch07-creditos",
  num: "07",
  kicker: "Saldo da empresa",
  title: "Defina os créditos",
  chip: "Créditos",
  lead: "Um saldo por ciclo, compartilhado entre as vidas autorizadas. Limite pessoal é opcional.",
  steps: ["Valor e dia da fatura", "Autorizar as vidas", "Limite por vida"],
  seam: { axis: "y", dir: -1, technique: "cut-the-curve UP" },
  device: "laptop",
  tail: 1.7,
  urls: { creditos: "vivamais.ai/painel-empresarial/creditos" },
  states: [
    ["cred-empty", 0],
    ["cred-saved-toast", 0],
    ["cred-adding", 0],
    ["cred-adding-selected", 0],
    ["cred-added-toast", 0],
    ["cred-edit-empty", 0],
    ["cred-edited-toast", 0],
  ],
  captions: [
    { step: "Passo 1", title: "Configure o ciclo", body: "Informe o **dia da fatura** e o valor de créditos que a empresa libera por ciclo." },
    { step: "Passo 2", title: "Saldo disponível na hora", body: "O painel mostra saldo, uso no ciclo e o **próximo faturamento**." },
    { step: "Passo 3", title: "Autorize as vidas", body: "Em **Adicionar vidas**, marque quem pode usar os créditos da empresa." },
    { step: "Passo 4", title: "Limite pessoal, se quiser", body: "No lápis, defina um teto por vida. Sem valor, ela usa o **saldo compartilhado**." },
  ],
  frame: {
    title: "Defina os créditos",
    scene: "Créditos: dia 10 e R$ 1.500 por ciclo, saldo aparece, vidas autorizadas em lote e limite pessoal de R$ 200 para uma vida",
    poster: 16,
    motion: "cursor-ui-demo (Key_Feature, chase); rules discrete-text-sequence (campos), counting-dynamic-scale (saldo), nudge-curve (scroll da página), spring-pop-entrance (painel de seleção), waterfall-entry (linhas autorizadas), css-marker-patterns",
    body: "Coluna “07 · Defina os créditos”. Na página Créditos o cursor digita 10 em Dia da fatura e 1500 em Valor de créditos por ciclo e salva: surge o aviso verde “Gestão de créditos atualizada”, o Saldo disponível sobe até R$ 1.500,00 e o próximo faturamento aparece. A página rola até Autorizações de uso; Adicionar vidas abre a lista, Selecionar todas, Adicionar selecionadas e as linhas entram em cascata como Autorizada. No lápis do Rafael Monteiro o limite pessoal vira R$ 200,00.",
  },
  run: function (S) {
    var pages = ["cred-saved-toast", "cred-adding", "cred-adding-selected", "cred-added-toast", "cred-edit-empty", "cred-edited-toast"];
    S.boot("cred-empty");
    S.url(0, "creditos");
    S.introIn(0.5);
    S.introOut(3.1);
    var e = S.state("cred-empty");
    var day = S.one('[data-id="billing-day"]', e);
    var amount = S.one('[data-id="prepaid-amount"]', e);
    var cfg = day.closest('[class*="bg-card"]') || day.closest('[class*="rounded-lg"]');
    var cr = S.rect(cfg);
    S.cam(3.4, { x: cr.cx, y: cr.cy - 40, zoom: 1.6, ax: 1060, ay: 470 }, 1.1);
    S.caption(4.0, 0);
    S.cursorEnter(4.3, day, 0.7);
    S.click(5.1, day);
    var t = S.type(5.25, day, "10", { dur: 0.4 });
    t = S.go(t + 0.25, amount, { move: 0.45, press: false });
    t = S.type(t + 0.15, amount, "1500", { dur: 0.6 });
    var save = S.find("cred-empty", "main button", "Salvar configuração");
    t = S.go(t + 0.4, save, { move: 0.55 });
    var saved = t + 0.3;
    S.show(saved, "cred-saved-toast", { fade: 0.28 });
    var s1 = S.state("cred-saved-toast");
    S.cam(saved, { x: 900, y: 330, zoom: 1.4 }, 1.0, "power3.out");
    S.caption(saved + 0.3, 1);
    S.cursorAside(saved, 120, 170, 0.6);
    var banner = S.one('main [class*="bg-emerald-50"]', s1);
    S.popIn(saved + 0.05, banner, { from: 0.98, y: -16, dur: 0.4, origin: "50% 0%" });
    S.toastIn(saved + 0.4, "cred-saved-toast");
    var values = S.all("main .grid p.text-2xl", s1);
    S.count(saved + 0.2, values[0], 0, 1500, function (v) {
      return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }, 1.0);
    S.mark(saved + 1.3, values[0].closest('[class*="rounded-lg"]'), { hold: 1.3, pad: 2, radius: 14 });
    S.mark(saved + 1.6, values[3].closest('[class*="rounded-lg"]'), { hold: 1.0, pad: 2, radius: 14 });

    var f = S.flash(saved + 3.0, ["Agora, quem", "pode usar."]);
    var t2 = f.out - 0.6;
    S.caption(f.out + 0.2, 2);
    S.scroll(t2, pages, 380, 1.0);
    S.cam(t2, { x: 900, y: 380, zoom: 1.45 }, 1.0);
    var add = S.find("cred-saved-toast", "main button", "Adicionar vidas");
    t = S.go(t2 + 0.9, add, { move: 0.6 });
    S.show(t + 0.1, "cred-adding");
    var panel = S.one('main [class*="bg-purple-50"]', S.state("cred-adding"));
    S.popIn(t + 0.1, panel, { from: 0.98, y: -14, dur: 0.34, origin: "50% 0%" });
    var allLabel = S.find("cred-adding", "main label", "Selecionar todas as vidas elegíveis");
    var allBox = allLabel.querySelector('button[role="checkbox"]');
    t = S.go(t + 0.7, allBox, { move: 0.55, press: false });
    S.show(t + 0.08, "cred-adding-selected");
    var addSel = S.find("cred-adding-selected", "main button", "Adicionar selecionadas");
    t = S.go(t + 0.7, addSel, { move: 0.6 });
    var added = t + 0.3;
    S.show(added, "cred-added-toast", { fade: 0.28 });
    var a = S.state("cred-added-toast");
    S.rows(added + 0.1, S.all("main table tbody tr", a).slice(0, 8), { y: 22, stagger: 0.06, dur: 0.32 });
    S.toastIn(added + 0.5, "cred-added-toast");
    S.cursorAside(added, -200, 120, 0.6);

    var t3 = added + 1.9;
    S.caption(t3, 3);
    var row = S.all("main table tbody tr", a)[1];
    var pencil = row.querySelector("button");
    S.camOn(t3, S.rect(row), { max: 1.75, min: 1.6, pad: 60, ax: 960, ay: 420 }, 1.0);
    t = S.go(t3 + 0.7, pencil, { move: 0.6 });
    S.show(t + 0.08, "cred-edit-empty");
    var er = S.all("main table tbody tr", S.state("cred-edit-empty"))[1];
    var limit = er.querySelector("input");
    t = S.go(t + 0.35, limit, { move: 0.5, press: false });
    t = S.type(t + 0.15, limit, "200", { dur: 0.5 });
    var ok = er.querySelector("td:last-child button");
    t = S.go(t + 0.35, ok, { move: 0.5 });
    var edited = t + 0.3;
    S.show(edited, "cred-edited-toast", { fade: 0.28 });
    S.cursorAside(edited, 40, 150, 0.6);
    S.toastIn(edited + 0.4, "cred-edited-toast");
    var cell = S.all("main table tbody tr", S.state("cred-edited-toast"))[1].querySelectorAll("td")[1];
    S.mark(edited + 0.5, cell, { hold: 1.7, pad: 0, radius: 12 });
  },
};
