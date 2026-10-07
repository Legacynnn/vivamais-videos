export default {
  id: "ch01-cadastro",
  num: "01",
  kicker: "Primeiro passo",
  title: "Cadastre sua empresa",
  chip: "Cadastro da empresa",
  lead: "Em poucos minutos a empresa entra na Viva Mais e escolhe o plano da equipe.",
  steps: ["Dados da empresa", "Plano e número de vidas", "Pagamento por PIX ou cartão"],
  device: "laptop",
  tail: 1.7,
  hold: 0,
  seam: { axis: "z", dir: 1, technique: "zoom-through" },
  urls: {
    cadastro: "vivamais.ai/empresa-cadastro",
    planos: "vivamais.ai/empresa-cadastro/planos",
    painel: "vivamais.ai/painel-empresarial",
  },
  states: [["cad-empty", 0], ["planos-0", 0], ["planos-1", 0], ["planos-10", 0], ["pay-card", 0], ["pay-pix", 0], ["pay-qr", 0], ["dash-new-toast", 0]],
  captions: [
    { step: "Passo 1", title: "Preencha os dados da empresa", body: "Nome, **CNPJ**, e-mail, telefone e uma senha forte para o acesso do RH." },
    { step: "Passo 2", title: "Avance para os planos", body: "Com os dados conferidos, clique em **Próxima Etapa**." },
    { step: "Passo 3", title: "Escolha plano e quantidade", body: "Defina quantas **vidas** entram em cada plano. O total mensal aparece na hora." },
    { step: "Passo 4", title: "Pague por PIX ou cartão", body: "Escolha **PIX** e gere o QR Code da assinatura." },
    { step: "Passo 5", title: "Leia o QR Code no celular", body: "Abra o app do banco e aponte a **câmera** para o código." },
    { step: "Passo 6", title: "Confirme o PIX", body: "Confira o valor, o destinatário e toque em **Confirmar pagamento**." },
    { step: "Passo 7", title: "Comprovante na hora", body: "O banco mostra o **comprovante** do PIX enviado." },
    { step: "Passo 8", title: "A Viva Mais confirma sozinha", body: "A plataforma **confere com o banco**. Não precisa enviar comprovante." },
    { step: "Pronto", title: "Pagamento confirmado", body: "Assinatura ativa em **poucos segundos**." },
    { step: "Pronto", title: "Empresa ativa no painel", body: "O **Painel Empresarial** já está liberado para cadastrar as vidas." },
  ],
  frame: {
    title: "Cadastre sua empresa",
    scene: "Notebook: formulário Dados da Empresa digitado campo a campo, planos com 10 vidas, PIX com QR Code, chegada ao painel",
    poster: 12,
    motion: "cursor-ui-demo (Key_Feature); rules coordinate-target-zoom, multi-phase-camera, cursor-click-ripple, press-release-spring, discrete-text-sequence (digitação), counting-dynamic-scale (vidas e total), spring-pop-entrance (modal, QR), waterfall-entry (coluna de texto)",
    body: "Continua o mergulho da abertura: a tela do notebook da recepção vira o notebook com /empresa-cadastro e a câmera segue direto até o formulário, sem título no meio; o cursor clica e digita Aurora Logística, CNPJ 12.345.678/0001-90, e-mail, telefone e senha. Clique em Próxima Etapa troca para a página de planos (stepper Cadastro ✓ · Planos · Pagamento). No Viva+ Completo o “+” sobe até 10 vidas e o total chega a R$ 499,00. Ir para pagamento abre Finalizar Assinatura; PIX, Gerar QR Code PIX, QR aparece. Pagamento confirmado leva ao Dashboard com os toasts reais.",
  },
  run: function (S) {
    var f = function (n) {
      return S.find("cad-empty", 'input[name="' + n + '"]');
    };
    var card = S.one('[class*="max-w-2xl"]', S.state("cad-empty"));
    var cr = S.rect(card);
    var zoom = 1.72;

    S.show(0, "cad-empty");
    S.url(0, "cadastro");
    S.dive({ x: 0, y: 0, zoom: 0.3889, ax: 989, ay: 358 }, { x: cr.cx, y: cr.y + 250, zoom: zoom, ax: 1230, ay: 470 }, 1.4);
    S.caption(0.9, 0);

    var t = 1.2;
    S.cursorEnter(t, f("name"), 0.75);
    S.click(t + 0.8, f("name"));
    t = S.type(t + 0.95, f("name"), "Aurora Logística", { cps: 17 });
    t = S.go(t + 0.15, f("cnpj"), { move: 0.4, press: false });
    t = S.type(t + 0.15, f("cnpj"), "12.345.678/0001-90", { cps: 20 });
    t = S.go(t + 0.15, f("email"), { move: 0.4, press: false });
    t = S.type(t + 0.15, f("email"), "rh@auroralog.com.br", { cps: 20 });
    S.cam(t - 0.4, { x: cr.cx, y: cr.y + 500, zoom: zoom, ax: 1230, ay: 380 }, 1.0);
    t = S.go(t + 0.15, f("contact_phone"), { move: 0.45, press: false });
    t = S.type(t + 0.15, f("contact_phone"), "(11) 98800-1122", { cps: 20 });
    t = S.go(t + 0.15, f("password"), { move: 0.4, press: false });
    t = S.type(t + 0.15, f("password"), "Aurora@2026", { cps: 18 });
    t = S.go(t + 0.15, f("password_confirmation"), { move: 0.4, press: false });
    t = S.type(t + 0.15, f("password_confirmation"), "Aurora@2026", { cps: 18 });

    var next = S.find("cad-empty", "button", "Próxima Etapa");
    S.caption(t + 0.2, 1);
    S.cam(t + 0.2, { x: cr.cx, y: cr.y + 620, zoom: zoom, ax: 1230, ay: 430 }, 0.8);
    t = S.go(t + 0.75, next, { move: 0.55 });

    var f = S.flash(t + 0.22, ["Agora, o plano", "da equipe."]);
    S.show(f.cover + 0.2, "planos-0");
    S.url(f.cover + 0.2, "planos");
    S.cursorAside(f.cover, 140, 60, 0.6);
    S.cam(f.cover + 0.2, { x: 720, y: 430, zoom: 1.3334 }, 0.6, "power3.out");
    var cut = f.out + 0.12;
    var p0 = S.state("planos-0");
    S.rows(cut + 0.05, [S.one('[class*="max-w-xl"]', p0), S.one("h1, h2", p0)].concat(S.all('[class*="rounded-xl"][class*="flex-col"]', p0)), { y: 26, stagger: 0.07, dur: 0.36 });
    S.caption(cut + 0.3, 2);

    var pages = ["planos-0", "planos-1", "planos-10", "pay-card", "pay-pix", "pay-qr"];
    var sc = cut + 1.5;
    S.scroll(sc, pages, 330, 0.9);
    var plus0 = S.all("button", p0).filter(function (b) {
      return b.querySelector(".lucide-plus");
    })[1];
    var cardEl = plus0.closest('[class*="rounded-xl"][class*="flex-col"]');
    S.camOn(sc, cardEl, { max: 1.9, pad: 70, ax: 1260, ay: 500 }, 1.0);
    t = S.go(sc + 0.7, plus0, { move: 0.6 });
    S.show(t + 0.06, "planos-1");
    var p1 = S.state("planos-1");
    var qty = S.all('input[type="number"]', p1)[1];
    var box = qty.closest('[class*="rounded-xl"][class*="flex-col"]');
    var total = Array.prototype.slice.call(box.querySelectorAll("p")).filter(function (e) {
      return /^R\$\s*49,90/.test(e.textContent.trim());
    }).pop();
    var foot = Array.prototype.slice.call(p1.querySelectorAll("p")).filter(function (e) {
      return /colaborador/.test(e.textContent) && /mês/.test(e.textContent);
    })[0];
    var money = function (n) {
      return (n * 49.9).toFixed(2).replace(".", ",");
    };
    var plus1 = S.all("button", p1).filter(function (b) {
      return b.querySelector(".lucide-plus");
    })[1];
    var n = 1;
    S.cursorTo(t + 0.1, plus1, 0.24, "power2.out");
    var stepAt = t + 0.48;
    for (n = 2; n <= 10; n++) {
      (function (k, at) {
        S.click(at, plus1, { press: true });
        S.flip(at + 0.05, function (on) {
          if (on) {
            qty.value = String(k);
            if (total) total.firstChild.nodeValue = "R$ " + money(k);
            if (foot) foot.innerHTML = k + " colaboradores <span class=\"text-[#7E3AEE]\">• R$ " + money(k) + "/mês</span>";
          } else if (k === 2) {
            qty.value = "1";
            if (total) total.firstChild.nodeValue = "R$ " + money(1);
            if (foot) foot.innerHTML = "1 colaborador <span class=\"text-[#7E3AEE]\">• R$ " + money(1) + "/mês</span>";
          }
        });
      })(n, stepAt);
      stepAt += n < 5 ? 0.3 : 0.2;
    }
    t = stepAt + 0.1;
    S.show(t, "planos-10");
    S.mark(t + 0.1, S.one('[class*="text-center"][class*="rounded-lg"]', S.all('input[type="number"]', S.state("planos-10"))[1].closest('[class*="rounded-xl"][class*="flex-col"]')), { hold: 1.3, pad: 6, radius: 12 });

    var pay = S.find("planos-10", "button", "Ir para pagamento");
    S.cam(t + 1.0, { x: 900, y: 640, zoom: 1.3334 }, 0.9);
    t = S.go(t + 1.5, pay, { move: 0.7 });
    S.captionOut(t - 0.35);
    S.show(t + 0.1, "pay-card");
    S.dialogIn(t + 0.1, "pay-card");
    S.caption(t + 0.2, 3);
    var dlg = S.one('[role="dialog"]', S.state("pay-qr"));
    S.camOn(t + 0.15, dlg, { max: 1.5, min: 1.3334, pad: 40, ax: 1260, ay: 540 }, 0.9);
    var pix = S.find("pay-card", '[role="dialog"] button', /^PIX$/);
    t = S.go(t + 0.9, pix, { move: 0.5 });
    S.show(t + 0.08, "pay-pix");
    var gen = S.find("pay-pix", '[role="dialog"] button', "Gerar QR Code PIX");
    t = S.go(t + 0.45, gen, { move: 0.5 });
    S.busy(t + 0.06, gen, "Gerando QR Code...");
    var shown = t + 0.75;
    S.show(shown, "pay-qr", { fade: 0.24 });
    var qr = S.one('[role="dialog"] img', S.state("pay-qr"));
    var card = qr.closest('[class*="rounded-2xl"][class*="shadow-lg"]');
    S.popIn(shown, card, { from: 0.94, dur: 0.4, origin: "50% 30%" });
    S.camOn(shown, qr, { max: 1.5, min: 1.45, pad: 150, ax: 1060, ay: 520 }, 1.0);
    S.cursorExit(shown + 0.05, "left", 0.6);

    S.caption(shown + 1.0, 4);
    var ph = S.phone(shown + 1.3, qr, { amount: "R$ 499,00", to: "VIVA MAIS SA", about: "Viva+ Completo, 10 vidas" });

    S.caption(ph.sheet + 0.1, 5);
    S.caption(ph.sent + 0.25, 6);
    var auto = ph.settled + 1.0;
    S.camOn(auto - 0.2, card, { max: 1.5, min: 1.45, pad: 60, ax: 910, ay: 540 }, 0.9);
    ph.dock(auto - 0.2, 1500, 150);
    S.caption(auto + 0.3, 7);
    var v = S.verify(auto + 0.5, card, { wait: "Confirmando pagamento...", each: 0.95 });
    S.caption(v.done + 0.25, 8);
    ph.out(v.done + 1.3);
    S.confetti(v.burst, v.at, { count: 84, seed: 5 });
    S.confetti(v.burst + 0.14, { x: -30, y: 1110 }, { frame: true, aim: -1.0, spread: 0.8, power: 1.9, count: 46, seed: 21 });
    S.confetti(v.burst + 0.14, { x: 1950, y: 1110 }, { frame: true, aim: -2.14, spread: 0.8, power: 1.9, count: 46, seed: 33 });

    var fin = v.done + 2.7;
    v.hide(fin - 0.05);
    S.cam(fin, { x: 720, y: 472, zoom: 1.3334 }, 1.0, "power3.inOut");
    var land = S.nav(fin, "dash-new-toast", { url: "painel", load: 0.8 });
    S.caption(land + 0.1, 9);
    var d = S.state("dash-new-toast");
    S.rows(land + 0.05, [S.one("h1", d)].concat(S.all('main [class*="bg-card"]', d)), { y: 24, stagger: 0.05, dur: 0.34 });
    S.toastIn(land + 0.5, "dash-new-toast");
  },
};
