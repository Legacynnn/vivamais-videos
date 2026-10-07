export default {
  id: "ch04-planilha",
  num: "04",
  kicker: "Em lote",
  title: "Importe a planilha",
  chip: "Importar planilha",
  lead: "Muitas vidas? Envie um CSV ou Excel e cadastre todas de uma vez.",
  steps: ["Baixar o modelo", "Enviar o arquivo", "Vidas na lista"],
  seam: { axis: "z", dir: 1, technique: "zoom-through" },
  device: "laptop",
  tail: 1.7,
  urls: { vidas: "vivamais.ai/painel-empresarial/funcionarios" },
  states: [["vidas-one", 0], ["import-empty", 0], ["import-file", 0], ["import-success", 0], ["vidas-nine-toast", 0]],
  captions: [
    { step: "Passo 1", title: "Siga as colunas do modelo", body: "Nome, CPF, nascimento, e-mail, cargo e telefone. **Baixar Template** traz o arquivo pronto." },
    { step: "Passo 2", title: "Envie o arquivo", body: "Selecione o **CSV ou Excel** e clique em Importar. A senha de cada vida é gerada sozinha." },
    { step: "Passo 3", title: "Todas as vidas na lista", body: "8 vidas importadas de uma vez, cada uma com o **convite** já agendado." },
  ],
  frame: {
    title: "Importe a planilha",
    scene: "Diálogo Importar Vidas: colunas obrigatórias, arquivo vidas-aurora.csv, sucesso e tabela com 9 vidas",
    poster: 12,
    motion: "cursor-ui-demo (Key_Feature, drag-drop journey); rules spring-pop-entrance (diálogo, aviso de sucesso), cursor-drag (arquivo até a área pontilhada), waterfall-entry (8 linhas em cascata), css-marker-patterns",
    body: "Coluna “04 · Importe a planilha”. No notebook, a lista tem só a Marina. Clique em Importar Planilha de Vidas abre o diálogo; o contorno destaca o quadro azul das colunas obrigatórias. O arquivo vidas-aurora.csv voa até a área pontilhada, o nome aparece, clique em Importar mostra “8 funcionário(s) importado(s)”. O diálogo fecha e oito linhas entram em cascata na tabela, total de 9 funcionário(s).",
  },
  run: function (S) {
    S.boot("vidas-one");
    S.url(0, "vidas");
    S.introIn(0.5);
    S.introOut(3.1);
    var btn = S.find("vidas-one", "button", "Importar Planilha de Vidas");
    S.cam(3.4, { x: 800, y: 300, zoom: 1.6, ax: 1100, ay: 420 }, 1.1);
    S.cursorEnter(4.0, btn, 0.7);
    S.click(4.8, btn, { press: true });
    var open = 5.05;
    S.show(open, "import-empty");
    S.dialogIn(open, "import-empty");
    var e = S.state("import-empty");
    var dlg = S.one('[role="dialog"]', e);
    var dr = S.rect(dlg);
    S.cam(open, { x: dr.cx, y: dr.cy, zoom: 1.62, ax: 1250, ay: 520 }, 1.0);
    S.caption(open + 0.3, 0);
    S.cursorAside(open + 0.1, 330, 60, 0.7);
    S.mark(open + 0.9, S.one('[class*="bg-blue-50"]', dlg), { hold: 2.0, pad: 6, radius: 14 });

    var drop = S.one('[class*="border-dashed"]', dlg);
    var t = open + 3.2;
    S.caption(t, 1);
    var dropped = S.drag(t + 0.2, "vidas-aurora.csv", { x: dr.x + dr.w + 150, y: dr.y + dr.h - 60 }, drop, { dur: 0.95 });
    S.show(dropped + 0.14, "import-file");
    var imp = S.find("import-file", '[role="dialog"] button', /^Importar$/);
    t = S.go(dropped + 0.65, imp, { move: 0.5 });
    S.show(t + 0.3, "import-success");
    var ok = S.one('[role="dialog"] [class*="bg-green-50"]', S.state("import-success"));
    S.popIn(t + 0.3, ok, { from: 0.96, y: 14, dur: 0.34, origin: "50% 50%" });
    S.mark(t + 0.75, ok, { hold: 1.3, pad: 4, radius: 12 });

    var done = t + 2.4;
    S.show(done, "vidas-nine-toast", { fade: 0.28 });
    S.caption(done, 2);
    S.cursorExit(done - 0.3, "right", 0.5);
    S.cam(done, { x: 850, y: 470, zoom: 1.3334 }, 1.0, "power3.out");
    var trs = S.all("main table tbody tr", S.state("vidas-nine-toast"));
    S.rows(done + 0.15, trs.slice(1), { y: 30, stagger: 0.075, dur: 0.34 });
    S.toastIn(done + 0.5, "vidas-nine-toast");
    var sub = S.find("vidas-nine-toast", "main p", /Total de \d+ funcion/);
    S.mark(done + 1.3, sub, { hold: 1.3, pad: 8, radius: 12 });
  },
};
