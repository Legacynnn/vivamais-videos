export default {
  id: "ch06-grupos",
  num: "06",
  kicker: "Planos",
  title: "Organize em grupos",
  chip: "Grupos de assinatura",
  lead: "Cada grupo liga um plano a um número de vagas. As vidas entram no grupo certo.",
  steps: ["Criar um grupo por plano", "Gerenciar as vidas", "Vagas preenchidas"],
  seam: { axis: "z", dir: 1, technique: "zoom-through" },
  device: "laptop",
  tail: 1.7,
  urls: { grupos: "vivamais.ai/painel-empresarial/grupos-assinatura" },
  states: [
    ["grupos-1", 0],
    ["grupo-novo-empty", 0],
    ["grupo-novo-select", 0],
    ["grupo-novo-filled", 0],
    ["grupos-2-toast", 0],
    ["manage-open", 0],
    ["manage-selected", 0],
    ["grupos-3-toast", 0],
  ],
  captions: [
    { step: "Passo 1", title: "Crie um grupo por plano", body: "Em **Novo Grupo**, escolha o plano e o máximo de vidas que ele comporta." },
    { step: "Passo 2", title: "Abra Gerenciar Vidas", body: "Cada grupo mostra vagas **preenchidas** e disponíveis." },
    { step: "Passo 3", title: "Selecione e adicione", body: "Marque as vidas disponíveis e clique em **Adicionar Selecionados**." },
    { step: "Pronto", title: "Vidas dentro do plano", body: "9 das 10 vagas do **Viva+ Completo** já estão preenchidas." },
  ],
  frame: {
    title: "Organize em grupos",
    scene: "Grupos de Assinatura: novo grupo Viva+ Premium com 3 vagas, depois 9 vidas adicionadas ao Viva+ Completo",
    poster: 14,
    motion: "cursor-ui-demo (Key_Feature, static-stage tour); rules spring-pop-entrance (diálogos, dropdown), dynamic-content-sequencing (select de plano, checkboxes), waterfall-entry (linha nova), css-marker-patterns, cursor-click-ripple",
    body: "Coluna “06 · Organize em grupos”. A página Gerenciar Grupos de Assinatura mostra Viva+ Completo 0 / 10. Novo Grupo abre o diálogo; o cursor escolhe Viva+ Premium, digita 3 e cria o grupo (nova linha + toast). Em seguida Gerenciar Vidas do Completo abre a lista de funcionários disponíveis, o cursor marca “Selecionar até 10” e clica em Adicionar Selecionados. De volta à tabela, o contorno destaca 9 / 10.",
  },
  run: function (S) {
    S.boot("grupos-1");
    S.url(0, "grupos");
    S.introIn(0.5);
    S.introOut(3.1);
    var novo = S.find("grupos-1", "main button", "Novo Grupo");
    S.cam(3.4, { x: 1000, y: 300, zoom: 1.5 }, 1.1);
    S.caption(4.0, 0);
    S.cursorEnter(4.3, novo, 0.7);
    S.click(5.1, novo, { press: true });
    var open = 5.35;
    S.show(open, "grupo-novo-empty");
    S.dialogIn(open, "grupo-novo-empty");
    var dlg = S.one('[role="dialog"]', S.state("grupo-novo-empty"));
    var dr = S.rect(dlg);
    S.cam(open, { x: dr.cx, y: dr.cy + 40, zoom: 1.75, ax: 1180, ay: 440 }, 1.0);
    var combo = S.one('[role="dialog"] button[role="combobox"]', S.state("grupo-novo-empty"));
    var t = S.go(open + 0.8, combo, { move: 0.5, press: false });
    S.show(t + 0.08, "grupo-novo-select");
    S.popIn(t + 0.08, S.one('[role="listbox"]', S.state("grupo-novo-select")), { from: 0.96, dur: 0.2, origin: "50% 0%" });
    var opt = S.find("grupo-novo-select", '[role="option"]', /Premium/);
    t = S.go(t + 0.5, opt, { move: 0.35, press: false });
    S.show(t + 0.08, "grupo-novo-filled");
    var max = S.one('[role="dialog"] input[type="number"]', S.state("grupo-novo-filled"));
    t = S.go(t + 0.35, max, { move: 0.4, press: false });
    t = S.type(t + 0.15, max, "3", { dur: 0.25 });
    var criar = S.find("grupo-novo-filled", '[role="dialog"] button', "Criar Grupo");
    t = S.go(t + 0.4, criar, { move: 0.45 });
    var two = t + 0.3;
    S.show(two, "grupos-2-toast", { fade: 0.28 });
    var g2 = S.state("grupos-2-toast");
    var rows2 = S.all("main table tbody tr", g2);
    S.rows(two + 0.1, [rows2[1]], { y: 24, dur: 0.4 });
    S.toastIn(two + 0.4, "grupos-2-toast");
    S.cam(two, { x: 1000, y: 330, zoom: 1.5 }, 1.0, "power3.out");
    S.caption(two + 0.5, 1);
    var manage = S.all("main table tbody tr button", g2).filter(function (b) {
      return /Gerenciar Vidas/.test(b.textContent);
    })[0];
    t = S.go(two + 1.5, manage, { move: 0.7 });
    var m = t + 0.25;
    S.show(m, "manage-open");
    S.dialogIn(m, "manage-open");
    var mo = S.state("manage-open");
    var md = S.one('[role="dialog"]', mo);
    var mr = S.rect(md);
    S.cam(m, { x: mr.cx, y: mr.y + 330, zoom: 1.3334 }, 1.0);
    S.caption(m + 0.4, 2);
    S.rows(m + 0.3, S.all('[role="dialog"] table tbody tr', mo).slice(0, 6), { y: 18, stagger: 0.05, dur: 0.3 });
    var label = S.find("manage-open", '[role="dialog"] span', /^Selecionar até/);
    var box = label.parentElement.querySelector('button[role="checkbox"]');
    t = S.go(m + 1.3, box, { move: 0.6, press: false });
    S.show(t + 0.08, "manage-selected");
    var checks = S.all('[role="dialog"] table tbody button[role="checkbox"] span', S.state("manage-selected"));
    S.rows(t + 0.08, checks.slice(0, 6), { y: 0, stagger: 0.04, dur: 0.18 });
    var addBtn = S.find("manage-selected", '[role="dialog"] button', "Adicionar Selecionados");
    t = S.go(t + 0.9, addBtn, { move: 0.6 });
    var fin = t + 0.35;
    S.show(fin, "grupos-3-toast", { fade: 0.28 });
    S.cursorAside(fin, 60, 200, 0.6);
    S.cam(fin, { x: 1000, y: 330, zoom: 1.5 }, 1.0, "power3.out");
    S.caption(fin + 0.2, 3);
    S.toastIn(fin + 0.4, "grupos-3-toast");
    var cell = S.find("grupos-3-toast", "main table tbody span", /^\d+ \/ 10$/);
    S.mark(fin + 1.0, cell, { hold: 1.7, pad: 8, radius: 12 });
  },
};
