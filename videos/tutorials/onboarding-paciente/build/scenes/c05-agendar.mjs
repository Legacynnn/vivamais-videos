import { up, hold } from "../../../../kit/parts/ob.mjs";
import { BANK_HTML, BANK_CSS, bankRun } from "../../../../kit/parts/bank.mjs";

export default {
  id: "c05-agendar",
  device: "iphone",
  title: "Marcar uma consulta",
  lines: ["Marcar uma", "consulta"],
  lead: "Escolha o médico, o dia e o horário. Pague pelo app.",
  tail: 0.6,
  states: [["home", 0], ["bk-search", 0], ["bk-results", 0], ["bk-doctor", 0], ["bk-day", 0], ["bk-day-s", 260], ["bk-slot", 260], ["bk-checkout", 0], ["bk-pagar", 0], ["bk-pix", 0], ["bk-ok", 0]],
  layers: { bank: BANK_HTML },
  css: BANK_CSS,
  lib: [up, hold, bankRun],
  captions: [
    { title: "Comece pelo Início", body: "Toque em **Buscar médico ou especialidade**." },
    { title: "Busque a especialidade", body: "Escreva, por exemplo, **Cardiologia**." },
    { title: "Escolha o médico", body: "Veja a **nota**, o preço e se atende **hoje**." },
    { title: "Perfil do médico", body: "Foto, especialidade e **avaliações de outros pacientes**." },
    { title: "Escolha o dia", body: "Os dias com **pontinho** têm horário livre." },
    { title: "Escolha o horário", body: "Toque no horário e depois em **Agendar**." },
    { title: "Desconto do plano", body: "De R$ 180 por **R$ 135**: o plano já tira 25%." },
    { title: "Pague com Pix", body: "Toque em **Pix** e depois em **Gerar Pix**." },
    { title: "Copie o código Pix", body: "Toque em **Copiar código**. Ou leia o QR code com o banco." },
    { title: "No app do seu banco", body: "Abra o Pix e escolha **Pix copia e cola**." },
    { title: "Confira e pague", body: "Aparece **Viva Mais** e o valor. Toque em **Pagar**." },
    { title: "Consulta marcada!", body: "Médico, dia e horário **confirmados**." },
  ],
  frame: {
    title: "Marcar uma consulta",
    scene: "Busca por Cardiologia, perfil do Dr. Rafael Lima, dia e horário, pagamento com desconto do plano, Pix e confirmação",
    poster: 30,
    motion: "chapter title cascade, phone rise, live typing, slide navigation, calendar taps, highlights, confetti",
    body: "Passo 5 de 10. Busca “Cardiologia” → Rafael Lima → perfil → quinta, 8 → 09:00 → Agendar. Pagamento: R$ 135,00 com Desconto do plano Viva+ (−R$ 45,00) → Pix → QR code → “Sua consulta está marcada.”",
  },
  run: function (S) {
    var wide = function (n) { return n.getBoundingClientRect().width > 300; };
    S.boot("home");
    S.introIn(0.05);
    S.introOut(2.2);
    S.cam(2.3, { x: 201, y: 437, zoom: 1.6 }, 0.01);
    var t = 3.1;
    var bar = up(S.pick("home", "Buscar médico ou especialidade", { sel: "*" }), 30);
    S.cam(t, { x: 201, y: 300, zoom: 1.95 }, 1.0);
    S.caption(t - 0.2, 0);
    S.mark(t + 0.6, bar, { hold: 1.4, pad: 6, radius: 20 });
    S.cursorTo(t + 2.0, bar, 0.45);
    S.click(t + 2.5, bar, { press: true });
    t = S.nav(t + 2.7, "bk-search", { kind: "modal", dur: 0.6 });
    var inp = S.one("input", S.state("bk-search"));
    S.cam(t, { x: 201, y: 260, zoom: 1.95 }, 1.0);
    S.caption(t - 0.2, 1);
    S.cursorTo(t + 0.7, inp, 0.45);
    S.click(t + 1.2, inp);
    t = S.type(t + 1.4, inp, "Cardiologia", { cps: 10 });
    S.show(t + 0.4, "bk-results", { fade: 0.5 });
    t += 1.0;
    var row = up(S.pick("bk-results", "Rafael Lima"), 60, wide);
    S.cam(t, { x: 201, y: 400, zoom: 1.85 }, 1.0);
    S.caption(t - 0.2, 2);
    S.mark(t + 0.6, row, { hold: 2.0, pad: 4, radius: 20 });
    S.cursorTo(t + 2.6, row, 0.45);
    S.click(t + 3.1, row, { press: true });
    t = S.nav(t + 3.3, "bk-doctor");
    S.cam(t, { x: 201, y: 300, zoom: 1.6 }, 1.0);
    S.caption(t - 0.2, 3);
    t += 2.8;
    S.cam(t, { x: 201, y: 560, zoom: 1.9 }, 1.0);
    var day = S.pick("bk-doctor", "8", { sort: "y" });
    S.caption(t - 0.2, 4);
    S.mark(t + 0.6, day, { hold: 1.6, pad: 6, radius: 30 });
    S.cursorTo(t + 2.2, day, 0.45);
    S.click(t + 2.7, day, { press: true });
    S.show(t + 2.9, "bk-day", { fade: 0.4 });
    S.show(t + 3.6, "bk-day-s", { fade: 0.7 });
    (function (at) {
      S.add(function (tl) {
        tl.fromTo(S.state("bk-day-s"), { y: 90 }, { y: 0, duration: 0.9, ease: "power3.out", immediateRender: false }, at);
      });
    })(t + 3.6);
    S.cam(t + 3.5, { x: 201, y: 437, zoom: 1.75 }, 1.0);
    t += 5.0;
    var slot = S.pick("bk-day-s", "09:00");
    S.caption(t - 0.2, 5);
    S.cursorTo(t + 0.8, slot, 0.45);
    S.click(t + 1.3, slot, { press: true });
    S.show(t + 1.5, "bk-slot", { fade: 0.4 });
    var ag = up(S.pick("bk-slot", /^Agendar qui/), 40);
    S.cam(t + 1.8, { x: 201, y: 650, zoom: 1.8 }, 0.9);
    S.mark(t + 2.3, ag, { hold: 1.4, pad: 4, radius: 22, noScroll: true });
    S.cursorTo(t + 3.6, ag, 0.45);
    S.click(t + 4.1, ag, { press: true });
    t = S.nav(t + 4.3, "bk-checkout");
    var total = up(S.pick("bk-checkout", "Total a pagar"), 120, wide);
    S.cam(t, { x: 201, y: 260, zoom: 1.85 }, 1.0);
    S.caption(t - 0.2, 6);
    S.mark(t + 0.7, total, { hold: 2.4, pad: 4, radius: 24 });
    t += 3.6;
    var pix = up(S.pick("bk-checkout", "Pix"), 50, wide);
    S.cam(t, { x: 201, y: 620, zoom: 1.8 }, 1.0);
    S.caption(t - 0.2, 7);
    S.cursorTo(t + 0.9, pix, 0.45);
    S.click(t + 1.4, pix, { press: true });
    t = S.nav(t + 1.6, "bk-pagar");
    var gen = S.pick("bk-pagar", "Gerar Pix");
    S.cam(t, { x: 201, y: 520, zoom: 1.6 }, 1.0);
    S.cursorTo(t + 0.8, gen, 0.45);
    S.click(t + 1.3, gen, { press: true });
    S.show(t + 1.6, "bk-pix", { fade: 0.5 });
    t += 2.0;
    var copy = S.pick("bk-pix", /^Copiar c/);
    S.cam(t, { x: 201, y: 560, zoom: 1.8 }, 1.0);
    S.caption(t - 0.2, 8);
    S.mark(t + 0.8, up(S.pick("bk-pix", "Código válido por"), 260, wide), { hold: 1.6, pad: 4, radius: 22 });
    var bank = bankRun(S, t + 2.6, copy);
    S.cam(bank.at.pix - 0.2, { x: 201, y: 437, zoom: 1.6 }, 0.9);
    S.caption(bank.at.pix + 0.6, 9);
    S.cam(bank.at.paste, { x: 201, y: 260, zoom: 1.95 }, 1.0);
    S.caption(bank.at.confirm, 10);
    S.cam(bank.at.confirm, { x: 201, y: 330, zoom: 1.8 }, 1.0);
    S.cam(bank.at.done, { x: 201, y: 437, zoom: 1.6 }, 0.8);
    t = bank.back + 0.2;
    t = S.nav(t, "bk-ok", { kind: "fade", dur: 0.7 });
    var okt = S.pick("bk-ok", "Sua consulta está marcada.", { sel: "*" });
    S.cam(t, { x: 201, y: 437, zoom: 1.6 }, 1.0);
    S.confetti(t + 0.3, S.rect(okt), { count: 46, seed: 7, power: 0.7 });
    S.caption(t + 0.5, 11);
    var card = up(S.pick("bk-ok", "Rafael Lima"), 150, wide);
    S.mark(t + 1.0, card, { hold: 2.2, pad: 4, radius: 22 });
    hold(S, t + 3.8);
  },
};
