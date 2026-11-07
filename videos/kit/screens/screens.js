(function () {
  const E = "power3.out";

  function create(opts) {
    const root = opts.root;
    const tl = opts.tl;
    const screenEl = opts.screenEl || root.querySelector(".screen");
    const liftEl = opts.liftEl || root.querySelector(".lift");
    let screenIds = [];

    const $ = (s) => (typeof s === "string" ? root.querySelector(s) : s);
    const $$ = (s) => [...root.querySelectorAll(s)];
    const scr = (s) => (typeof s === "string" && /^[\w-]+$/.test(s) ? root.querySelector("#" + s) : $(s));

    function posIn(el) {
      let x = 0, y = 0, n = el;
      while (n && n !== screenEl) {
        x += n.offsetLeft;
        y += n.offsetTop;
        n = n.offsetParent;
      }
      return { x, y, w: el.offsetWidth, h: el.offsetHeight };
    }

    function make(cls, style, html = "") {
      const d = document.createElement("div");
      d.className = cls;
      Object.assign(d.style, style);
      d.innerHTML = html;
      liftEl.appendChild(d);
      return d;
    }

    function finalClone(el) {
      const p = posIn(el);
      const c = el.cloneNode(true);
      c.removeAttribute("id");
      c.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
      c.querySelectorAll("*").forEach((n) => { n.style.opacity = ""; n.style.transform = ""; n.style.translate = ""; n.style.rotate = ""; n.style.scale = ""; });
      c.querySelectorAll("[data-final]").forEach((n) => (n.textContent = n.dataset.final));
      c.querySelectorAll(".label").forEach((n) => { n.style.transform = "translateY(-26px) scale(0.75)"; n.style.color = "#726F80"; });
      c.querySelectorAll(".ok").forEach((n) => (n.style.opacity = 1));
      c.querySelectorAll(".press").forEach((n) => (n.style.opacity = 1));
      c.querySelectorAll(".caret").forEach((n) => n.remove());
      const wrap = make("lifted", { left: p.x + "px", top: p.y + "px", width: p.w + "px", height: p.h + "px", background: "#fff", borderRadius: "20px" });
      c.style.margin = "0";
      wrap.appendChild(c);
      return { node: wrap, p };
    }

    function touch(x, y) {
      return make("touch", { left: x + "px", top: y + "px" });
    }

    function tip(text, ax, ay, side) {
      const t = make("tip", { left: "0px", top: "0px" });
      const body = document.createElement("div");
      body.className = "tip-body";
      body.textContent = text;
      body.setAttribute("data-layout-allow-overlap", "");
      t.setAttribute("data-layout-allow-overlap", "");
      t.appendChild(body);
      const dot = make("tip-dot", { left: ax + "px", top: ay + "px", opacity: 0 });
      const stem = make("tip-stem", { left: ax - 1 + "px", opacity: 0 });
      const bw = body.offsetWidth, bh = body.offsetHeight;
      const left = Math.max(-96, Math.min(500 - bw, ax - bw / 2));
      t.style.left = left + "px";
      if (side === "up") {
        t.style.top = ay - 34 - bh + "px";
        stem.style.top = ay - 34 + "px";
      } else {
        t.style.top = ay + 34 + "px";
        stem.style.top = ay + 5 + "px";
      }
      stem.style.height = "29px";
      return { t, dot, stem, dy: side === "up" ? 14 : -14 };
    }

    function screens(ids) {
      screenIds = ids;
      ids.forEach((s, i) => tl.set(scr(s), { x: i === 0 ? 0 : 402, autoAlpha: i === 0 ? 1 : 0 }, 0));
    }

    function push(from, to, t) {
      from = scr(from);
      to = scr(to);
      tl.set(to, { autoAlpha: 1 }, t);
      tl.fromTo(to, { x: 402 }, { x: 0, duration: 0.5, ease: "power3.out" }, t);
      tl.set(from, { autoAlpha: 0 }, t + 0.52);
      tl.fromTo(from, { x: 0 }, { x: -120, duration: 0.5, ease: "power3.out" }, t);
    }

    function tap(x, y, t, target) {
      const r = touch(x, y);
      tl.fromTo(r, { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: 0.22, ease: "power2.out" }, t - 0.22);
      tl.to(r, { scale: 0.82, duration: 0.1, ease: "power2.in" }, t);
      tl.to(r, { opacity: 0, scale: 1.25, duration: 0.3, ease: "power2.out" }, t + 0.12);
      if (target) tl.fromTo($(target), { scale: 1 }, { scale: 0.97, duration: 0.1, ease: "power2.in", yoyo: true, repeat: 1 }, t);
    }

    function center(el) {
      const p = posIn($(el));
      return { x: p.x + p.w / 2, y: p.y + p.h / 2, p };
    }

    function focusField(f, t) {
      f = $(f);
      tl.fromTo(f.querySelector(".box-focus"), { opacity: 0 }, { opacity: 1, duration: 0.16, ease: "power2.out" }, t);
      tl.fromTo(f.querySelector(".label"), { y: 0, scale: 1, color: "#A29FB0" }, { y: -26, scale: 0.75, color: "#7E3BED", duration: 0.16, ease: "power4.out" }, t);
    }

    function blurField(f, t) {
      f = $(f);
      tl.to(f.querySelector(".box-focus"), { opacity: 0, duration: 0.16, ease: "power2.out" }, t);
      tl.to(f.querySelector(".label"), { color: "#726F80", duration: 0.16 }, t);
      const c = f.querySelector(".caret");
      if (c) tl.set(c, { opacity: 0 }, t);
    }

    function typeIn(f, t, dur) {
      f = $(f);
      const v = f.querySelector(".val");
      const full = v.dataset.final;
      const c = f.querySelector(".caret");
      const state = { n: 0 };
      const meas = document.createElement("span");
      meas.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;font:16px 'DM Sans'";
      document.body.appendChild(meas);
      const widths = [];
      for (let i = 0; i <= full.length; i++) {
        meas.textContent = full.slice(0, i);
        widths.push(meas.offsetWidth);
      }
      meas.remove();
      if (c) tl.set(c, { opacity: 1, x: 17 }, t);
      tl.fromTo(state, { n: 0 }, {
        n: full.length,
        duration: dur,
        ease: "none",
        onUpdate() {
          const k = Math.round(state.n);
          v.textContent = full.slice(0, k);
          if (c && !f.classList.contains("multi")) c.style.transform = `translateX(${17 + Math.min(widths[k], 330)}px)`;
        },
      }, t);
    }

    function enable(btn, t) {
      btn = $(btn);
      tl.fromTo(btn.querySelector(".on"), { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" }, t);
      tl.fromTo(btn.querySelector(".lbl"), { color: "#55525F" }, { color: "#FFFFFF", duration: 0.25 }, t);
    }

    function showTip(tp, t, hold) {
      tl.fromTo(tp.dot, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(1.6)" }, t);
      tl.fromTo(tp.stem, { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 0.2, ease: E, transformOrigin: tp.dy > 0 ? "50% 100%" : "50% 0%" }, t + 0.08);
      tl.fromTo(tp.t, { opacity: 0, y: tp.dy, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.42, ease: "back.out(1.5)" }, t + 0.14);
      tl.to([tp.t, tp.stem, tp.dot], { opacity: 0, duration: 0.25, ease: "power2.in" }, t + hold);
    }

    function liftOut(el, t, hold, dx, sc) {
      el = $(el);
      const { node } = finalClone(el);
      tl.set(el, { opacity: 0 }, t);
      tl.set(node, { opacity: 1 }, t);
      tl.fromTo(node, { scale: 1, x: 0, y: 0 }, { scale: sc, x: dx, y: -6, duration: 0.6, ease: "power3.out" }, t);
      tl.to(node, { scale: 1, x: 0, y: 0, duration: 0.45, ease: "power3.inOut" }, t + hold);
      tl.set(node, { opacity: 0 }, t + hold + 0.45);
      tl.set(el, { opacity: 1 }, t + hold + 0.45);
      return node;
    }

    function titleCard(card, o) {
      card = $(card);
      const words = card.querySelector(".chapter-words");
      const from = o.from || { y: 70 };
      const to = Object.fromEntries(Object.keys(from).map((k) => [k, 0]));
      tl.fromTo(words.querySelectorAll(".w"), { opacity: 0, ...from }, { opacity: 1, ...to, duration: 0.6, ease: "power4.out", stagger: o.stagger ?? 0.08 }, o.at);
      tl.fromTo(card.querySelector(".chapter-spark"), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: E }, o.sparkAt ?? o.at + 0.5);
      tl.to(words, { xPercent: -14, opacity: 0, duration: 0.42, ease: "power4.in" }, o.out);
    }

    return { root, tl, screenEl, liftEl, E, $, $$, posIn, make, finalClone, touch, tip, screens, push, tap, center, focusField, blurField, typeIn, enable, showTip, liftOut, titleCard };
  }

  window.VMKit = { create, E };
})();
