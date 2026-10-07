import { AI_HTML, AI_CSS } from "../parts/ai.mjs";

export default {
  id: "ch09-ia",
  device: "iphone",
  speed: 1.1,
  title: "A IA explica a consulta",
  lines: ["A IA explica", "a consulta"],
  lead: "Resumo, plano de cuidado e a conversa inteira, em linguagem simples.",
  tail: 0.6,
  states: [["pos", 5000]],
  layers: { ai: AI_HTML },
  css: AI_CSS,
  captions: [
    { title: "Perguntar à IA", body: "Toque para abrir **a análise da sua consulta**." },
    { title: "Analisando", body: "A IA lê **anamnese, conversa e documentos**." },
    { title: "Em resumo", body: "O diagnóstico explicado **em linguagem simples**." },
    { title: "Plano de cuidado", body: "Remédios, pausas e exames, com **lembretes** no horário." },
    { title: "Sinais de alerta", body: "Quando **voltar ao plantão**, sem adivinhação." },
    { title: "Transcrição", body: "A conversa inteira, com os **pontos-chave destacados**." },
    { title: "Tudo conectado", body: "Da fala da médica **direto para a receita**." },
    { title: "Buscando", body: "A IA procura na **transcrição** e abre a **receita** antes de responder." },
    { title: "Resposta com fonte", body: "Cada resposta mostra **de onde veio**: fala da médica e receita." },
    { title: "Segunda pergunta", body: "Agora ela confere o **plano de cuidado** e os sinais de alerta." },
    { title: "Pergunte", body: "Tire dúvidas sobre a consulta **a qualquer hora**." },
  ],
  frame: {
    title: "A IA explica a consulta",
    scene: "Card Perguntar à IA no pós-consulta, nova tela Análise da consulta com carregamento, resumo, plano de cuidado com lembretes, sinais de alerta, aba Transcrição e pergunta respondida pela IA",
    poster: 12,
    motion: "push transition, skeleton shimmer + sequenced checks, staggered content reveal, toggles, inner scroll, segmented tab slide, typed question + answer bubble",
    body: "Título central. No pós-consulta, toque em Perguntar à IA abre a nova tela Análise da consulta: “Lendo sua anamnese, Lendo a conversa, Cruzando os documentos” com skeleton brilhando. Entra o resumo (cefaleia tensional, sem sinais de alarme) e O que fazer agora: dipirona e ciclobenzaprina com lembretes ligados, pausas de tela, hidratação e exames. A tela rola até Volte ao plantão se tiver. A aba Transcrição mostra a conversa com destaques e o link para a Receita simples. Uma pergunta é digitada e a IA responde.",
  },
  run: function (S) {
    S.boot("pos");
    S.introIn(0.05);
    S.introOut(2.9);
    var t = 3.6;
    var ask = S.pick("pos", "Perguntar à IA", { hit: false });
    var askCard = ask;
    while (askCard.parentElement && askCard.getBoundingClientRect().height < 60) askCard = askCard.parentElement;
    S.cam(t, { x: 201, y: 460, zoom: 1.45 }, 1.0);
    S.mark(t + 1.0, askCard, { hold: 1.2, pad: 4, radius: 20 });
    S.caption(t + 1.1, 0, { at: S.rect(askCard) });
    t += 2.4;
    S.cursorEnter(t, ask, 0.6);
    S.click(t + 0.8, ask, { press: true });
    S.captionOut(t + 0.9);
    var ai = S.layer("ai");
    var a0 = S.layerIn(t + 0.95, "ai", { from: "right", dur: 0.55 });
    S.cursorExit(a0, "down", 0.4);
    S.cam(a0 - 0.3, { x: 201, y: 400, zoom: 1.45 }, 0.8);
    var q = function (s) {
      return S.one(s, ai);
    };
    var qa = function (s) {
      return S.all(s, ai);
    };
    var load = q(".ai-load");
    var body = q(".ai-body");
    var dots = qa(".ai-load-steps i");
    var sk = qa(".ai-sk u");
    S.caption(a0 + 0.2, 1, { at: S.rect(load) });
    (function (a0) {
      S.add(function (tl) {
        tl.fromTo(sk, { backgroundPosition: "-300px 0" }, { backgroundPosition: "300px 0", duration: 1.1, ease: "none", repeat: 2, immediateRender: false }, a0);
        dots.forEach(function (d, i) {
          var at = a0 + 0.5 + i * 0.7;
          tl.to(d, { backgroundColor: "#7e3bed", boxShadow: "inset 0 0 0 0px #7e3bed", duration: 0.25, ease: "power2.out" }, at);
          tl.fromTo(d, { scale: 0.6 }, { scale: 1, duration: 0.35, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, at);
        });
        tl.to(load, { opacity: 0, y: -10, duration: 0.2, ease: "power2.in" }, a0 + 2.75);
        tl.set(body, { opacity: 1 }, a0 + 3.0);
        var blocks = body.querySelectorAll(".ai-h, .ai-sum, .ai-steps li, .ai-warn");
        tl.fromTo(blocks, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.09, immediateRender: false }, a0 + 3.05);
      });
    })(a0);
    t = a0 + 3.4;
    S.caption(t, 2, { at: S.rect(q(".ai-sum")) });
    S.mark(t + 0.3, q(".ai-sum"), { hold: 1.4, pad: 6, radius: 14 });
    t += 2.4;
    var inA = q(".ai-pa .ai-in");
    var sy = 0;
    function scrollTo(at, y, d, el) {
      var from = sy;
      sy = y;
      S.add(function (tl) {
        tl.fromTo(el, { y: -from }, { y: -y, duration: d, ease: "power3.inOut", immediateRender: false }, at);
      });
    }
    function at(el) {
      var r = S.rect(el);
      return { x: r.x, y: r.y - sy, w: r.w, h: r.h, cx: r.cx, cy: r.cy - sy };
    }
    scrollTo(t, 220, 0.9, inA);
    S.cam(t, { x: 201, y: 480, zoom: 1.4 }, 0.9);
    var steps = q(".ai-steps");
    var tgs = qa(".ai-tg");
    S.caption(t + 0.8, 3, { at: at(steps) });
    (function (t) {
      S.add(function (tl) {
        tgs.forEach(function (g, i) {
          var s = t + 1.2 + i * 0.35;
          tl.to(g, { backgroundColor: "#7e3bed", duration: 0.2, ease: "none" }, s);
          tl.to(g.querySelector("u"), { x: 18, duration: 0.25, ease: "power3.out" }, s);
        });
      });
    })(t);
    t += 3.0;
    scrollTo(t, 470, 0.9, inA);
    var warn = q(".ai-warn");
    S.caption(t + 0.8, 4, { at: at(warn), side: "right" });
    S.mark(t + 0.9, at(warn), { hold: 1.3, pad: 4, radius: 22 });
    t += 2.8;
    var seg = qa(".ai-seg span");
    var pill = q(".ai-seg u");
    S.captionOut(t - 0.1);
    S.cam(t, { x: 201, y: 360, zoom: 1.4 }, 0.8);
    S.cursorEnter(t + 0.2, seg[1], 0.6);
    S.click(t + 1.0, seg[1], { press: true });
    var bubbles = qa(".ai-tr li");
    var inB = q(".ai-pb .ai-in");
    var s0 = t + 1.05;
    (function (s0) {
      S.add(function (tl) {
        tl.to(pill, { xPercent: 100, duration: 0.4, ease: "power3.inOut" }, s0);
        tl.to(q(".ai-pa"), { x: -402, duration: 0.5, ease: "power3.inOut" }, s0);
        tl.fromTo(q(".ai-pb"), { x: 402 }, { x: 0, duration: 0.5, ease: "power3.inOut", immediateRender: false }, s0);
        tl.fromTo(bubbles, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.12, immediateRender: false }, s0 + 0.3);
      });
    })(s0);
    S.cursorExit(s0 + 0.4, "down", 0.4);
    S.caption(s0 + 0.7, 5, { at: S.rect(bubbles[1]) });
    t = s0 + 2.8;
    sy = 0;
    scrollTo(t, 520, 1.2, inB);
    S.cam(t, { x: 201, y: 460, zoom: 1.4 }, 1.0);
    var link = q(".ai-link");
    S.caption(t + 1.2, 6, { at: at(link) });
    S.mark(t + 1.3, at(link), { hold: 1.2, pad: 4, radius: 12 });
    t += 3.2;
    var field = q(".ai-q");
    var ans = q(".ai-ans");
    var chips = qa(".ai-chips span");
    var scan = q(".ai-scan");
    var scanT = qa(".ai-scan-t b");
    var srcs = qa(".ai-src-line span");
    var p1 = q(".ai-ans-p1");
    var p2 = q(".ai-ans-p2");
    var hits = qa(".ai-tr li p span").filter(function (w) {
      return /dipirona|remédio|receita/i.test(w.textContent);
    });
    var placeholder = field.textContent;
    function askType(k0, text) {
      var p = { n: 0 };
      S.add(function (tl) {
        tl.to(p, { n: text.length, duration: 1.0, ease: "none", immediateRender: false, onUpdate: function () {
          var n = Math.round(p.n);
          field.textContent = n < 1 ? placeholder : text.slice(0, n);
          field.style.color = n < 1 ? "" : "#17151e";
        } }, k0);
      });
      return k0 + 1.05;
    }
    function scanning(at, idx, dur) {
      S.add(function (tl) {
        tl.to(scan, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, at);
        scanT.forEach(function (b, i) {
          tl.to(b, { opacity: i === idx ? 1 : 0, duration: 0.2, ease: "none" }, at);
        });
        tl.fromTo(q(".ai-scan-sp"), { rotation: 0 }, { rotation: 360 * Math.ceil(dur), duration: dur, ease: "none", immediateRender: false, transformOrigin: "50% 50%" }, at);
      });
    }
    function scanOff(at) {
      S.add(function (tl) {
        tl.to(scan, { opacity: 0, y: 10, duration: 0.25, ease: "power2.in" }, at);
      });
    }
    S.cam(t, { x: 201, y: 700, zoom: 1.45 }, 0.9);
    S.cursorEnter(t + 0.3, chips[0], 0.6);
    S.click(t + 1.0, chips[0], { press: true });
    var k0 = askType(t + 1.1, "Posso tomar dipirona com café?");
    S.cursorExit(k0 - 0.6, "down", 0.4);
    scanning(k0, 0, 2.2);
    S.caption(k0 + 0.3, 7, { at: S.rect(scan), side: "right" });
    sy = 0;
    scrollTo(k0 + 0.2, 180, 0.9, inB);
    S.cam(k0 + 0.2, { x: 201, y: 430, zoom: 1.4 }, 0.9);
    (function (k0) {
      S.add(function (tl) {
        hits.forEach(function (w, i) {
          var at = k0 + 0.9 + i * 0.28;
          tl.fromTo(w, { backgroundColor: "rgba(228,255,148,0)" }, { backgroundColor: "#e4ff94", duration: 0.2, ease: "none", immediateRender: false }, at);
        });
        var lk = q(".ai-link");
        tl.to(lk, { backgroundColor: "#c6ff34", duration: 0.25, ease: "none" }, k0 + 2.4);
      });
    })(k0);
    scanning(k0 + 2.3, 1, 1.4);
    scanOff(k0 + 3.9);
    var a1 = k0 + 4.1;
    S.cam(a1 - 0.2, { x: 201, y: 640, zoom: 1.45 }, 0.8);
    (function (a1) {
      S.add(function (tl) {
        tl.fromTo(ans, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, a1);
        Array.prototype.slice.call(ans.querySelectorAll(".ai-ans-h u i")).forEach(function (d, i) {
          for (var k = 0; k < 2; k++) tl.fromTo(d, { y: 0 }, { y: -4, duration: 0.16, ease: "power2.out", yoyo: true, repeat: 1, immediateRender: false }, a1 + 0.1 + k * 0.4 + i * 0.1);
        });
        tl.fromTo(p1, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none", immediateRender: false }, a1 + 0.9);
        tl.to([srcs[0], srcs[1]], { opacity: 1, duration: 0.3, ease: "none", stagger: 0.15 }, a1 + 1.2);
      });
    })(a1);
    S.caption(a1 + 1.1, 8, { at: S.rect(ans), side: "right" });
    S.note("asked", a1 + 1.2);
    t = a1 + 3.4;
    S.captionOut(t - 0.1);
    S.cursorEnter(t, chips[1], 0.6);
    S.click(t + 0.7, chips[1], { press: true });
    var k1 = askType(t + 0.8, "E se a dor voltar?");
    S.cursorExit(k1 - 0.5, "down", 0.4);
    (function (k1) {
      S.add(function (tl) {
        tl.to(p1, { opacity: 0.35, duration: 0.3, ease: "none" }, k1);
        tl.to([srcs[0], srcs[1]], { opacity: 0, duration: 0.2, ease: "none" }, k1);
      });
    })(k1);
    scanning(k1, 2, 1.8);
    S.caption(k1 + 0.3, 9, { at: S.rect(scan), side: "right" });
    scanOff(k1 + 1.9);
    var a2 = k1 + 2.1;
    (function (a2) {
      S.add(function (tl) {
        tl.set(p2, { display: "block", opacity: 0 }, a2);
        tl.set(p1, { display: "none" }, a2);
        tl.fromTo(p2, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", immediateRender: false }, a2 + 0.05);
        tl.to([srcs[1], srcs[2]], { opacity: 1, duration: 0.3, ease: "none", stagger: 0.15 }, a2 + 0.5);
      });
    })(a2);
    S.caption(a2 + 0.9, 10, { at: S.rect(ans), side: "right" });
    t = a2 + 3.6;
    S.captionOut(t - 0.2);
    S.cam(t, { x: 201, y: 437, zoom: 1.1 }, 1.0);
  },
};
