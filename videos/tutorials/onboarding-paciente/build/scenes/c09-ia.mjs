import { up, hold } from "../../../../kit/parts/ob.mjs";

export default {
  id: "c09-ia",
  device: "iphone",
  title: "Perguntar à IA",
  lines: ["Perguntar", "à IA"],
  lead: "Uma assistente de saúde que responde na hora, a qualquer momento.",
  tail: 0.6,
  states: [["ia-home", 0], ["ia-med-typed", 0], ["ia-med-thinking", 0], ["ia-med-mid", 0], ["ia-med-done", 0]],
  lib: [up, hold],
  captions: [
    { title: "A aba IA", body: "Fica no **menu de baixo**, no meio." },
    { title: "Escreva sua dúvida", body: "Do jeito que você falaria. Depois toque na **seta**." },
    { title: "A IA responde", body: "Em segundos, com uma **explicação simples**." },
    { title: "Lembre-se", body: "A IA **não substitui o médico**. Em urgência, use o **Plantão**." },
  ],
  frame: {
    title: "Perguntar à IA",
    scene: "Aba IA real, pergunta sobre dipirona e remédio de pressão, resposta em streaming",
    poster: 14,
    motion: "chapter title cascade, phone rise, live typing, send tap, slide to chat, streaming answer crossfades",
    body: "Passo 9 de 10. “Oi, Maria. Sobre o que você quer falar hoje?” Pergunta digitada: “Posso tomar dipirona junto com o remédio de pressão?” A assistente analisa e responde com cuidados em lista.",
  },
  run: function (S) {
    S.boot("ia-home");
    S.pick("ia-home", "Conversas", { sel: "*" }).style.visibility = "hidden";
    ["Dipirona e pressão", "Dermatologista esta semana"].forEach(function (x) {
      up(S.pick("ia-home", x, { sel: "*" }), 36).style.visibility = "hidden";
    });
    S.introIn(0.05);
    S.introOut(2.2);
    S.cam(2.3, { x: 201, y: 437, zoom: 1.6 }, 0.01);
    var t = 3.1;
    S.caption(t, 0);
    var tab = up(S.pick("ia-home", "IA", { last: true }), 30);
    S.cam(t + 0.2, { x: 201, y: 650, zoom: 1.8 }, 1.0);
    S.mark(t + 0.8, tab, { hold: 1.8, pad: 6, radius: 22, noScroll: true });
    t += 3.0;
    var ta = S.one("textarea", S.state("ia-home")) || S.one("input", S.state("ia-home"));
    S.cam(t, { x: 201, y: 230, zoom: 2.0 }, 1.0);
    S.caption(t + 0.2, 1);
    S.cursorTo(t + 1.0, ta, 0.6);
    S.click(t + 1.7, ta);
    t = S.type(t + 1.9, ta, "Posso tomar dipirona junto com o remédio de pressão?", { cps: 13 });
    S.show(t + 0.3, "ia-med-typed", { fade: 0.3 });
    var send = S.one('[aria-label="Enviar pergunta"]', S.state("ia-med-typed"));
    S.cursorTo(t + 0.8, send, 0.6);
    S.click(t + 1.5, send, { press: true });
    t = S.nav(t + 1.7, "ia-med-thinking");
    S.cam(t, { x: 201, y: 437, zoom: 1.6 }, 1.0);
    S.caption(t - 0.2, 2);
    S.show(t + 1.8, "ia-med-mid", { fade: 0.4 });
    S.show(t + 3.6, "ia-med-done", { fade: 0.6 });
    var ans = up(S.pick("ia-med-done", "Cuidados importantes:", { sel: "*" }), 0);
    S.cam(t + 4.4, { x: 201, y: 420, zoom: 1.95 }, 1.2);
    t += 7.4;
    S.caption(t, 3);
    hold(S, t + 3.6);
  },
};
