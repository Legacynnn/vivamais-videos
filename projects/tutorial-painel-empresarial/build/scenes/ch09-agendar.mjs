export default {
  id: "ch09-agendar",
  num: "09",
  kicker: "Cuidado na prática",
  title: "Agende para uma vida",
  chip: "Agendar consulta",
  lead: "O RH pode marcar a consulta pelo colaborador. O valor entra na próxima fatura.",
  steps: ["Escolher a vida", "Especialidade e médico", "Horário e confirmação"],
  seam: { axis: "z", dir: 1, technique: "zoom-through" },
  device: "laptop",
  tail: 1.7,
  urls: { agenda: "vivamais.ai/painel-empresarial/agendamentos" },
  states: [
    ["agenda-empty", 0],
    ["agenda-employee", 0],
    ["agenda-specialty-open", 420],
    ["agenda-doctors", 420],
    ["agenda-doctor", 420],
    ["agenda-slot", 640],
    ["agenda-done-toast", 0],
    ["agenda-history", 0],
  ],
  captions: [
    { step: "Passo 1", title: "Escolha a vida", body: "Busque pelo nome, CPF ou cargo e selecione quem vai ser **atendido**." },
    { step: "Passo 2", title: "Especialidade e médico", body: "Filtre pela especialidade e veja os médicos com **horário online** livre." },
    { step: "Passo 3", title: "Horário e confirmação", body: "O resumo mostra médico, data e o **valor na próxima fatura**." },
    { step: "Pronto", title: "Consulta agendada", body: "Ela aparece no **Histórico de consultas** da empresa, com status e valor." },
  ],
  frame: {
    title: "Agende para uma vida",
    scene: "Agendar consulta para uma vida: Marina Azevedo, Cardiologia, Dra. Mariana Costa às 16:00, confirmação e histórico",
    poster: 13,
    motion: "cursor-ui-demo (Key_Feature, chase); rules control-target-sync (seleções → Resumo), spring-pop-entrance (dropdown, histórico), waterfall-entry (médicos e horários), nudge-curve (scroll), cursor-click-ripple, press-release-spring",
    body: "Coluna “09 · Agende para uma vida”. Na página Agendar consulta para uma vida o cursor seleciona o cartão da Marina Azevedo e o Resumo à direita passa a mostrar o nome. A página rola até Médico e horário: Especialidade → Cardiologia, os médicos entram em cascata com foto, clique na Dra. Mariana Costa e nos horários escolhe 16:00. O Resumo mostra R$ 189,90 na próxima fatura. Confirmar agendamento dispara o toast e o Histórico de consultas abre com a consulta Agendada.",
  },
  run: function (S) {
    S.boot("agenda-empty");
    S.url(0, "agenda");
    S.introIn(0.5);
    S.introOut(3.1);
    var card = S.find("agenda-empty", "main button", /^Marina Azevedo/);
    S.cam(3.4, { x: 760, y: 420, zoom: 1.5 }, 1.1);
    S.caption(4.0, 0);
    S.cursorEnter(4.3, card, 0.7);
    S.click(5.1, card, { press: true });
    S.show(5.2, "agenda-employee");
    var resumo = S.find("agenda-employee", 'main h2, main h3, main [class*="tracking-tight"]', "Resumo");
    var rcard = resumo.closest('[class*="bg-card"]') || resumo.parentElement.parentElement;
    S.mark(5.5, rcard.querySelector('[class*="bg-gray-50"]') || rcard, { hold: 1.4, pad: 4, radius: 16 });

    var t = 7.0;
    S.capTo(t - 0.2, "top");
    S.caption(t + 0.35, 1);
    S.scroll(t, ["agenda-employee"], 420, 1.0);
    var combo = S.all('main button[role="combobox"]', S.state("agenda-employee")).filter(function (b) {
      return /Selecione/.test(b.textContent);
    })[0];
    S.cam(t, { x: 720, y: 560, zoom: 1.5 }, 1.0);
    t = S.go(t + 0.9, combo, { move: 0.6, press: false });
    S.show(t + 0.08, "agenda-specialty-open");
    S.popIn(t + 0.08, S.one('[role="listbox"]', S.state("agenda-specialty-open")), { from: 0.96, dur: 0.2, origin: "50% 100%" });
    var cardio = S.find("agenda-specialty-open", '[role="option"]', "Cardiologia");
    t = S.go(t + 0.5, cardio, { move: 0.4, press: false });
    S.show(t + 0.1, "agenda-doctors");
    var docs = S.all("main button", S.state("agenda-doctors")).filter(function (b) {
      return /Dr\(a\)\./.test(b.textContent);
    });
    S.rows(t + 0.2, docs, { y: 26, stagger: 0.09, dur: 0.36 });
    t = S.go(t + 1.0, docs[0], { move: 0.55 });
    S.show(t + 0.1, "agenda-doctor");
    S.scroll(t + 0.15, ["agenda-doctor"], 640, 0.8);
    S.cam(t + 0.15, { x: 720, y: 620, zoom: 1.5 }, 0.8);
    var slots = S.all("main button", S.state("agenda-doctor")).filter(function (b) {
      return /^\d\d:\d\d/.test(b.textContent.trim());
    });
    S.rows(t + 0.4, slots, { y: 16, stagger: 0.05, dur: 0.28 });
    S.caption(t + 0.9, 2);
    var slot = slots.filter(function (b) {
      return /^16:00/.test(b.textContent.trim());
    })[0];
    t = S.go(t + 1.3, slot, { move: 0.5 });
    S.show(t + 0.1, "agenda-slot");
    var confirm = S.find("agenda-slot", "main button", "Confirmar agendamento");
    var sum = confirm.closest('[class*="bg-card"]') || confirm.parentElement;
    S.camOn(t + 0.3, S.rect(sum), { max: 1.6, min: 1.45, pad: 50, ax: 1200, ay: 500 }, 1.0);
    S.mark(t + 1.2, sum.querySelector('[class*="bg-gray-50"]') || sum, { hold: 1.3, pad: 4, radius: 16 });
    t = S.go(t + 2.3, confirm, { move: 0.7 });
    var done = t + 0.35;
    S.show(done, "agenda-done-toast", { fade: 0.28 });
    S.capTo(done - 0.3, "bottom");
    S.cam(done, { x: 900, y: 400, zoom: 1.4 }, 1.0, "power3.out");
    S.caption(done + 0.2, 3);
    S.toastIn(done + 0.4, "agenda-done-toast");
    var hist = S.find("agenda-done-toast", "main button", "Histórico de consultas");
    t = S.go(done + 1.4, hist, { move: 0.7 });
    S.show(t + 0.15, "agenda-history");
    S.dialogIn(t + 0.15, "agenda-history");
    var hd = S.one('[role="dialog"]', S.state("agenda-history"));
    S.camOn(t + 0.2, S.rect(hd), { max: 1.75, min: 1.4, pad: 50, ax: 1180, ay: 450 }, 1.0);
    S.cursorAside(t + 0.2, 160, 120, 0.6);
  },
};
