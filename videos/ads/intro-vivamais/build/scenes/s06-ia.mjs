export default {
  id: "s06-ia",
  device: "iphone",
  vo: "l06",
  voAt: 0.35,
  tail: 0.5,
  seam: { axis: "z", dir: 1, technique: "signature plus", sig: true },
  states: [["ficha", 0, "health-profile default"], ["home", 0, "client-home-company default"], ["chat", 0, "ai-chat-duvida answer"]],
  sfx: [
    { name: "whoosh", at: 0.0, vol: 0.4 },
    { name: "tap", at: 3.05, vol: 0.45 },
    { name: "pop", at: 4.5, vol: 0.35 },
  ],
  ad: [
    { key: "f1", cls: "l top", text: "Ficha **guardada.**" },
    { key: "i1", cls: "l top", text: "Dúvida? A IA **responde.**" },
  ],
  frame: {
    title: "Ficha e IA de saúde",
    scene: "Ficha de saúde real a 100% com peso, altura e IMC; volta ao Início, toque na sugestão “Posso tomar dipirona com paracetamol?” da Super Inteligência; chat real da IA com a pergunta e a resposta chegando palavra por palavra",
    motion: "violet wipe seam, marks, horizontal chip scroll, tap, slide-in chat, word-by-word streaming, text swap with mask rise",
    body: "O painel violeta passa. A ficha de saúde da Ana aparece a 100%, com as medidas destacadas. Em “quando bate a dúvida” o Início rola a fileira da Super Inteligência até “Posso tomar dipirona com paracetamol?” e o dedo toca. O chat abre, a pergunta entra e a resposta chega palavra por palavra em “responde na hora”.",
  },
  run: function (S, A) {
    gsap.set(S.one(".vmk-device"), { opacity: 1 });
    S.boot("ficha");
    S.status(0, true, { dur: 0.01 });
    S.cam(0, { x: 201, y: 437, zoom: 1.65, ax: 540, ay: 1180, free: true }, 0.01);
    A.rise(A.w("ficha") - 0.15, "f1");
    var pct = S.pick("ficha", "Ficha completa", { hit: false });
    while (pct.parentElement && !/100%/.test(pct.textContent)) pct = pct.parentElement;
    S.mark(A.w("ficha"), pct, { hold: 1.0, pad: 6, radius: 18, noScroll: true });
    var peso = S.pick("ficha", "Peso", { hit: false });
    var meds = peso;
    while (meds.parentElement && !/IMC/.test(meds.textContent)) meds = meds.parentElement;
    S.mark(A.w("guardada") - 0.1, meds, { hold: 0.55, pad: 4, radius: 18, noScroll: true });

    var tq = A.w("quando") - 0.2;
    A.out(tq - 0.1, "f1", { dir: "up" });
    var t = S.nav(tq, "home", { dur: 0.45 });
    var home = S.state("home");
    var chip = S.one('[aria-label="Perguntar: Posso tomar dipirona com paracetamol?"]', home);
    var box = chip.closest(".rn-scroll");
    var dx = Math.max(0, Math.min(box.scrollWidth - box.clientWidth, S.rect(chip).x - S.rect(box).x - 16));
    S.add(function (tl) {
      tl.fromTo(box, { scrollLeft: 0 }, { scrollLeft: dx, duration: 0.55, ease: "power2.inOut", immediateRender: false }, t - 0.1);
    });
    var cr = S.rect(chip);
    var chipAt = { x: cr.x - dx, y: cr.y, w: cr.w, h: cr.h, cx: cr.cx - dx, cy: cr.cy };
    S.cursorEnter(t + 0.1, chipAt, 0.4);
    S.click(t + 0.55, chipAt);
    S.cursorExit(t + 0.8, "down", 0.35);

    var chat = S.state("chat");
    var me = S.pick("chat", "Posso tomar dipirona com paracetamol?", { hit: false }).parentElement.parentElement;
    var ans = me.nextElementSibling;
    var head = ans.children[0];
    var body = ans.children[1];
    var copy = ans.children[2];
    var aw = [];
    S.all(".rn-text", body).forEach(function (p) {
      var walk = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
      var nodes = [];
      var n;
      while ((n = walk.nextNode())) nodes.push(n);
      nodes.forEach(function (node) {
        var frag = document.createDocumentFragment();
        node.nodeValue.split(/(\s+)/).forEach(function (w) {
          if (!w) return;
          if (/^\s+$/.test(w)) return frag.appendChild(document.createTextNode(w));
          var sp = document.createElement("span");
          sp.textContent = w;
          aw.push(sp);
          frag.appendChild(sp);
        });
        node.parentNode.replaceChild(frag, node);
      });
    });
    var o = S.nav(t + 0.7, "chat", { dur: 0.45 }) - 0.45;
    S.status(o + 0.2, false);
    gsap.set([me, head, copy], { opacity: 0 });
    gsap.set(aw, { opacity: 0 });
    var tr = A.w("responde") - 0.35;
    S.add(function (tl) {
      tl.fromTo(me, { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out", immediateRender: false, transformOrigin: "100% 100%" }, o + 0.35);
      tl.fromTo(head, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out", immediateRender: false }, o + 0.75);
      aw.forEach(function (x, i) {
        tl.fromTo(x, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "none", immediateRender: false }, tr + 0.2 + i * 0.04);
      });
      tl.fromTo(copy, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out", immediateRender: false }, tr + aw.length * 0.04 - 0.3);
    });
    S.cam(o + 0.2, { x: 201, y: 420, zoom: 1.72, ax: 540, ay: 1160, free: true }, 1.4, "power2.inOut");
    A.rise(A.w("IA") - 0.2, "i1");
  },
};
