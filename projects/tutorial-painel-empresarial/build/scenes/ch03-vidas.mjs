export default {
  id: "ch03-vidas",
  num: "03",
  kicker: "Pessoas",
  title: "Cadastre as vidas",
  chip: "Cadastrar vidas",
  lead: "Vida é cada colaborador com acesso à Viva Mais. Cadastre uma a uma quando forem poucas.",
  steps: ["Abrir Cadastrar Novo", "Preencher os dados", "Convite enviado na hora"],
  seam: { axis: "y", dir: -1, technique: "cut-the-curve UP" },
  device: "laptop",
  tail: 1.7,
  urls: { vidas: "vivamais.ai/painel-empresarial/funcionarios" },
  states: [["vidas-empty", 0], ["vida-dialog-empty", 0], ["vida-dialog-gender", 0], ["vida-dialog-filled", 0], ["vidas-one-toast", 0]],
  captions: [
    { step: "Passo 1", title: "Clique em Cadastrar Novo", body: "A lista começa vazia. O botão violeta abre o formulário da **nova vida**." },
    { step: "Passo 2", title: "Preencha os dados da vida", body: "Nome, **CPF**, e-mail, nascimento, telefone e cargo. O status já vem como Ativo." },
    { step: "Passo 3", title: "Salve e o convite sai sozinho", body: "A vida entra na lista e recebe o **convite de primeiro acesso**." },
  ],
  frame: {
    title: "Cadastre as vidas",
    scene: "Gerenciar Vidas vazio, diálogo Cadastrar Novo Funcionário digitado, primeira vida na lista com convite pendente",
    poster: 12,
    motion: "cursor-ui-demo (Key_Feature, static-stage tour + chase); rules spring-pop-entrance (diálogo), discrete-text-sequence (digitação), dynamic-content-sequencing (select de gênero), waterfall-entry (linha da tabela), cursor-click-ripple, press-release-spring",
    body: "Coluna “03 · Cadastre as vidas” e o notebook em Gerenciar Vidas (Nenhuma vida cadastrada). Clique em Cadastrar Novo abre o diálogo; o cursor digita Marina Azevedo, 382.190.457-16, e-mail, 14/03/1991, telefone e Analista de RH, abre Gênero e escolhe Feminino. Cadastrar fecha o diálogo, a linha da Marina entra na tabela com o selo “Aguardando ativação” e o toast “Funcionário cadastrado. O convite de primeiro acesso foi agendado.”",
  },
  run: function (S) {
    S.boot("vidas-empty");
    S.url(0, "vidas");
    S.introIn(0.5);
    S.introOut(3.1);
    var novo = S.find("vidas-empty", "button", "Cadastrar Novo");
    S.cam(3.4, { x: 760, y: 300, zoom: 1.6, ax: 1100, ay: 420 }, 1.1);
    S.caption(4.0, 0);
    S.cursorEnter(4.3, novo, 0.7);
    S.click(5.15, novo, { press: true });
    var open = 5.4;
    S.show(open, "vida-dialog-empty");
    S.dialogIn(open, "vida-dialog-empty");
    var dlg = S.one('[role="dialog"]', S.state("vida-dialog-empty"));
    var dr = S.rect(dlg);
    var zoom = 1.62;
    S.cam(open, { x: dr.cx, y: dr.y + 250, zoom: zoom, ax: 1250, ay: 450 }, 1.0);
    S.caption(open + 0.4, 1);
    var f = function (n) {
      return S.find("vida-dialog-empty", '[role="dialog"] input[name="' + n + '"]');
    };
    var t = S.go(open + 0.9, f("full_name"), { move: 0.45, press: false });
    t = S.type(t + 0.12, f("full_name"), "Marina Azevedo", { cps: 19 });
    t = S.go(t + 0.12, f("document"), { move: 0.34, press: false });
    t = S.type(t + 0.12, f("document"), "382.190.457-16", { cps: 22 });
    t = S.go(t + 0.12, f("principal_email"), { move: 0.34, press: false });
    t = S.type(t + 0.12, f("principal_email"), "marina.azevedo@auroralog.com.br", { cps: 30 });
    S.cam(t - 0.5, { x: dr.cx, y: dr.y + 520, zoom: zoom, ax: 1250, ay: 420 }, 1.0);
    t = S.go(t + 0.12, f("birth_date"), { move: 0.34, press: false });
    t = S.type(t + 0.12, f("birth_date"), "14/03/1991", { cps: 22 });
    t = S.go(t + 0.12, f("phone"), { move: 0.34, press: false });
    t = S.type(t + 0.12, f("phone"), "(11) 98811-2233", { cps: 24 });
    t = S.go(t + 0.12, f("job_title"), { move: 0.34, press: false });
    t = S.type(t + 0.12, f("job_title"), "Analista de RH", { cps: 22 });
    S.cam(t - 0.3, { x: dr.cx, y: dr.y + 700, zoom: zoom, ax: 1250, ay: 420 }, 0.9);
    var combo = S.all('[role="dialog"] button[role="combobox"]', S.state("vida-dialog-empty"))[0];
    t = S.go(t + 0.2, combo, { move: 0.4 });
    S.show(t + 0.08, "vida-dialog-gender");
    var list = S.one('[role="listbox"]', S.state("vida-dialog-gender"));
    S.popIn(t + 0.08, list, { from: 0.95, dur: 0.2, origin: "0% 0%" });
    var fem = S.find("vida-dialog-gender", '[role="option"]', "Feminino");
    t = S.go(t + 0.4, fem, { move: 0.3, press: false });
    S.show(t + 0.08, "vida-dialog-filled");
    var save = S.find("vida-dialog-filled", '[role="dialog"] button', /^Cadastrar$/);
    S.caption(t + 0.3, 2);
    t = S.go(t + 0.5, save, { move: 0.5 });
    var done = t + 0.3;
    S.show(done, "vidas-one-toast", { fade: 0.28 });
    S.cursorAside(done, 180, -60, 0.6);
    var one = S.state("vidas-one-toast");
    var row = S.one("main table tbody tr", one);
    S.cam(done, { x: 900, y: 330, zoom: 1.5 }, 1.0, "power3.out");
    S.rows(done + 0.15, [row], { y: 26, dur: 0.4 });
    S.toastIn(done + 0.4, "vidas-one-toast");
    var badge = S.find("vidas-one-toast", "main table tbody span", "Aguardando ativação");
    S.mark(done + 1.2, badge, { hold: 1.6, pad: 6, radius: 999 });
  },
};
