(function () {
  const E = "power3.out";
  const PLUS = '<svg viewBox="32 32 98 98" xmlns="http://www.w3.org/2000/svg"><path d="M80.4 125.28C70.72 125.28 62.85 117.41 62.85 107.73V99.86C62.85 99.07 62.2 98.42 61.41 98.42H53.54C43.86 98.42 35.99 90.55 35.99 80.87C35.99 71.19 43.86 63.32 53.54 63.32H61.41C62.2 63.32 62.85 62.67 62.85 61.88V54.01C62.85 44.33 70.72 36.46 80.4 36.46C90.08 36.46 97.95 44.33 97.95 54.01V61.88C97.95 62.67 98.6 63.32 99.39 63.32H107.26C116.94 63.32 124.81 71.19 124.81 80.87C124.81 90.55 116.94 98.42 107.26 98.42H99.39C98.6 98.42 97.95 99.07 97.95 99.86V107.73C97.95 117.41 90.08 125.28 80.4 125.28Z"/></svg>';

  function create(opts) {
    const root = opts.root;
    const tl = opts.tl;
    const $ = (s) => (typeof s === "string" ? root.querySelector(s) : s);
    const $$ = (s) => [...root.querySelectorAll(s)];

    function split(el) {
      el = $(el);
      if (el.dataset.split) return [...el.querySelectorAll(".vm-w")];
      const walk = (node, accent) => {
        [...node.childNodes].forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.nodeValue.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(" "));
              const m = document.createElement("span");
              m.className = "vm-wm";
              m.setAttribute("data-layout-allow-overflow", "");
              const w = document.createElement("span");
              w.className = accent ? "vm-w vm-accent" : "vm-w";
              w.textContent = part;
              w.setAttribute("data-layout-allow-overflow", "");
              m.appendChild(w);
              frag.appendChild(m);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1 && n.tagName !== "BR") {
            if (n.tagName === "EM") {
              walk(n, true);
              n.replaceWith(...n.childNodes);
            } else walk(n, accent);
          }
        });
      };
      walk(el, false);
      el.dataset.split = "1";
      return [...el.querySelectorAll(".vm-w")];
    }

    function stagger(n, s) {
      return Math.min(s ?? 0.06, 0.5 / Math.max(n - 1, 1));
    }

    function rise(el, t, o = {}) {
      el = $(el);
      const ws = split(el);
      const st = stagger(ws.length, o.stagger);
      const dur = o.dur ?? 0.62;
      tl.set(el, { opacity: 1 }, t);
      tl.fromTo(ws, { yPercent: 112 }, { yPercent: 0, duration: dur, ease: E, stagger: st, immediateRender: true }, t);
      return t + dur + st * (ws.length - 1);
    }

    function slide(el, t, o = {}) {
      el = $(el);
      const ws = split(el);
      const st = stagger(ws.length, o.stagger);
      const dur = o.dur ?? 0.58;
      tl.fromTo(ws, { opacity: 0, x: o.x ?? 60 }, { opacity: 1, x: 0, duration: dur, ease: E, stagger: st }, t);
      return t + dur + st * (ws.length - 1);
    }

    function exit(el, t, o = {}) {
      el = $(el);
      const dur = o.dur ?? 0.42;
      const dir = o.dir || "left";
      const to = { opacity: 0, duration: dur, ease: "power3.in" };
      if (dir === "left") to.x = -(o.dist ?? 160);
      if (dir === "right") to.x = o.dist ?? 160;
      if (dir === "up") to.y = -(o.dist ?? 120);
      if (dir === "down") to.y = o.dist ?? 120;
      if (dir === "blur") Object.assign(to, { scale: 0.92, filter: "blur(12px)" });
      tl.to(el, to, t);
      return t + dur;
    }

    function pop(el, t, o = {}) {
      el = $(el);
      const dur = o.dur ?? 0.5;
      tl.fromTo(el, { opacity: 0, y: o.y ?? 28, scale: o.from ?? 0.94 }, { opacity: 1, y: 0, scale: 1, duration: dur, ease: E, transformOrigin: o.origin || "50% 50%" }, t);
      return t + dur;
    }

    function cascade(els, t, o = {}) {
      const list = typeof els === "string" ? $$(els) : els;
      const st = stagger(list.length, o.stagger ?? 0.08);
      list.forEach((el, i) => pop(el, t + i * st, o));
      return t + (o.dur ?? 0.5) + st * (list.length - 1);
    }

    function mark(el, t, o = {}) {
      el = $(el);
      tl.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: o.dur ?? 0.5, ease: "power3.inOut", transformOrigin: "0% 50%" }, t);
      return t + (o.dur ?? 0.5);
    }

    function count(el, t, to, o = {}) {
      el = $(el);
      const from = o.from ?? 0;
      const fmt = o.fmt || ((v) => Math.round(v).toLocaleString("pt-BR"));
      const s = { v: from };
      el.textContent = fmt(from);
      tl.fromTo(s, { v: from }, { v: to, duration: o.dur ?? 1.2, ease: "power2.out", onUpdate: () => (el.textContent = fmt(s.v)) }, t);
      return t + (o.dur ?? 1.2);
    }

    function device(el, t, o = {}) {
      el = $(el);
      const from = o.from || "bottom";
      const start = { opacity: 0 };
      if (from === "bottom") start.y = o.dist ?? 420;
      if (from === "right") start.x = o.dist ?? 520;
      if (from === "left") start.x = -(o.dist ?? 520);
      if (o.tilt) start.rotation = o.tilt;
      const dur = o.dur ?? 0.95;
      tl.fromTo(el, start, { opacity: 1, x: 0, y: 0, rotation: 0, duration: dur, ease: E }, t);
      return t + dur;
    }

    function swap(a, b, t, dur = 0.35) {
      a = $(a);
      b = $(b);
      tl.set(b, { autoAlpha: 1, zIndex: 2 }, t);
      tl.fromTo(b, { opacity: 0 }, { opacity: 1, duration: dur, ease: "power1.inOut" }, t);
      tl.set(a, { autoAlpha: 0 }, t + dur);
      tl.set(b, { zIndex: "" }, t + dur);
      return t + dur;
    }

    function stock(el, t, hold, o = {}) {
      el = $(el);
      const fade = o.fade ?? 0.6;
      tl.fromTo(el, { opacity: o.cut ? 1 : 0 }, { opacity: 1, duration: o.cut ? 0.01 : fade, ease: "power1.inOut" }, t);
      tl.fromTo(el, { scale: o.from ?? 1.08 }, { scale: 1, duration: hold, ease: "none" }, t);
      return t + hold;
    }

    function plusLayer(color) {
      const p = document.createElement("div");
      p.className = "vm-plus";
      p.innerHTML = PLUS;
      p.style.color = color || "var(--vm-primary)";
      p.setAttribute("data-layout-allow-overlap", "");
      p.setAttribute("data-layout-allow-occlusion", "");
      root.appendChild(p);
      return p;
    }

    function plusCover(t, o = {}) {
      const p = plusLayer(o.color);
      const dur = o.dur ?? 0.55;
      tl.fromTo(p, { scale: 0, rotation: -45, opacity: 1 }, { scale: 48, rotation: 0, duration: dur, ease: "power3.in" }, t - dur);
      return t;
    }

    function plusReveal(t, o = {}) {
      const p = plusLayer(o.color);
      const dur = o.dur ?? 0.6;
      gsap.set(p, { scale: 48, rotation: 0, opacity: 1 });
      tl.set(p, { scale: 48, rotation: 0, opacity: 1 }, 0);
      tl.to(p, { scale: 0, rotation: 45, duration: dur, ease: "power3.out" }, t);
      tl.set(p, { opacity: 0 }, t + dur);
      return t + dur;
    }

    function sting(mark, word, t) {
      mark = $(mark);
      word = $(word);
      tl.fromTo(mark, { opacity: 0, scale: 0.5, rotation: -90 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.4)" }, t);
      if (word) tl.fromTo(word, { opacity: 0, x: -40, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, x: 0, clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: E }, t + 0.45);
      return t + 1.15;
    }

    function end(card, t) {
      card = $(card);
      const lockup = card.querySelector(".vm-end-lockup");
      const line = card.querySelector(".vm-end-line");
      const cta = card.querySelector(".vm-end-cta");
      let at = pop(lockup, t, { from: 0.86, y: 0, dur: 0.7 });
      if (line) at = rise(line, t + 0.4);
      if (cta) at = pop(cta, at - 0.2, { y: 20 });
      return at;
    }

    function hold(el, t, dur, o = {}) {
      el = $(el);
      tl.fromTo(el, { scale: 1 }, { scale: o.to ?? 1.04, duration: dur, ease: "none" }, t);
      return t + dur;
    }

    function word(vo, n) {
      const norm = (x) => String(x).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
      if (typeof n === "number") return vo.at + vo.words[Math.min(n, vo.words.length - 1)][0];
      const m = String(n).match(/^(.*)#(\d+)$/);
      const want = norm(m ? m[1] : n);
      let nth = m ? +m[2] : 0;
      for (const w of vo.words) if (norm(w[2]) === want && nth-- === 0) return vo.at + w[0];
      throw new Error("vo word " + n);
    }

    return { root, tl, E, $, $$, word, split, rise, slide, exit, pop, cascade, mark, count, device, swap, stock, plusCover, plusReveal, sting, end, hold };
  }

  window.VMMotion = { create, E };
})();
