(function () {
  const { W, H, $, $$, pct } = RT;
  const INK = "#17151E";
  const WHITE = "#FFFFFF";

  $$("[data-i]").forEach((el) => {
    el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${ICONS[el.dataset.i]}</svg>`;
  });

  const rng = (a) => () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  function qr(seed, n) {
    const r = rng(seed);
    const g = Array.from({ length: n }, () => Array.from({ length: n }, () => (r() < 0.5 ? 1 : 0)));
    const fin = (ox, oy) => {
      for (let y = -1; y <= 7; y++)
        for (let x = -1; x <= 7; x++) {
          const gx = ox + x, gy = oy + y;
          if (gx < 0 || gy < 0 || gx >= n || gy >= n) continue;
          g[gy][gx] = x >= 0 && x <= 6 && y >= 0 && y <= 6 && (x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4)) ? 1 : 0;
        }
    };
    fin(0, 0);
    fin(n - 7, 0);
    fin(0, n - 7);
    let d = "";
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; ) {
        if (!g[y][x]) { x++; continue; }
        let l = 0;
        while (x + l < n && g[y][x + l]) l++;
        d += `M${x} ${y}h${l}v1h-${l}z`;
        x += l;
      }
    return `<svg viewBox="-1 -1 ${n + 2} ${n + 2}" shape-rendering="crispEdges"><rect x="-1" y="-1" width="${n + 2}" height="${n + 2}" fill="#fff"/><path d="${d}" fill="#17151E"/></svg>`;
  }
  $("#qr").innerHTML = qr(7, 33);
  $("#qr2").innerHTML = qr(44, 21);

  const SCREENS = $$(".scr");
  const status = $("#status");
  const homebar = $("#homebar");

  function base() {
    gsap.set(SCREENS, { autoAlpha: 0, x: 0, y: 0, zIndex: "auto" });
    gsap.set(["#veil", "#rx-veil"], { autoAlpha: 0 });
    gsap.set("#s-home", { autoAlpha: 1 });
    gsap.set(status, { color: WHITE });
    gsap.set(homebar, { backgroundColor: INK });
  }

  function touch(tl, el, t) {
    const r = $(el).getBoundingClientRect();
    const d = document.createElement("div");
    d.className = "touch";
    d.style.left = r.left + r.width / 2 + "px";
    d.style.top = r.top + r.height / 2 + "px";
    $("#app").appendChild(d);
    tl.fromTo(d, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.1, ease: "power2.out", immediateRender: false }, t);
    tl.to(d, { opacity: 0, scale: 1.45, duration: 0.28, ease: "power2.out" }, t + 0.14);
  }

  function pressBtn(tl, el, t) {
    touch(tl, el, t);
    tl.to(el, { scale: 0.98, "--p": 1, duration: 0.1, ease: "power2.out" }, t);
    tl.to(el, { scale: 1, "--p": 0, duration: 0.2, ease: "power2.out" }, t + 0.2);
  }

  function push(tl, from, to, t, d = 0.5) {
    tl.set(to, { autoAlpha: 1, x: W }, t);
    tl.to(to, { x: 0, duration: d, ease: "power3.out" }, t);
    tl.to(from, { x: -W * 0.28, duration: d, ease: "power3.out" }, t);
    tl.set(from, { autoAlpha: 0, x: 0 }, t + d);
  }

  function pop(tl, from, to, t, d = 0.5) {
    tl.set(from, { zIndex: 5 }, t);
    tl.set(to, { autoAlpha: 1, x: -W * 0.28 }, t);
    tl.to(to, { x: 0, duration: d, ease: "power3.out" }, t);
    tl.to(from, { x: W, duration: d, ease: "power3.out" }, t);
    tl.set(from, { autoAlpha: 0, x: 0, zIndex: "auto" }, t + d);
  }

  const CLIPS = [
    {
      duration: 2.75,
      cues: [{ t: 1.45, event: "crm" }],
      build(tl) {
        touch(tl, "#spec-cg", 0);
        tl.to("#spec-cg", { scale: 0.96, backgroundColor: "#EBE1FD", color: "#451391", duration: 0.12, ease: "power2.out" }, 0);
        tl.to("#spec-cg", { scale: 1, duration: 0.22, ease: "power2.out" }, 0.22);
        tl.set("#veil", { autoAlpha: 1, opacity: 0 }, 0.18);
        tl.to("#veil", { opacity: 1, duration: 0.45, ease: "power2.out" }, 0.18);
        tl.set("#s-search", { autoAlpha: 1, y: H }, 0.18);
        tl.to("#s-search", { y: 0, duration: 0.55, ease: "power3.out" }, 0.18);
        touch(tl, "#doc-julia", 0.95);
        tl.to("#doc-julia", { scale: 0.98, backgroundColor: "#F9F8FB", duration: 0.1, ease: "power2.out" }, 0.95);
        tl.to("#doc-julia", { scale: 1, duration: 0.2, ease: "power2.out" }, 1.13);
        tl.set("#s-doctor", { autoAlpha: 1, x: W }, 1.1);
        tl.to("#s-doctor", { x: 0, duration: 0.5, ease: "power3.out" }, 1.1);
        tl.to("#s-search", { x: -W * 0.28, duration: 0.5, ease: "power3.out" }, 1.1);
        tl.set(["#s-search", "#veil", "#s-home"], { autoAlpha: 0 }, 1.6);
        tl.to("#dr-scroll", { y: -300, duration: 0.75, ease: "power3.inOut" }, 1.8);
        tl.to("#hero-btns", { opacity: 0, duration: 0.2, ease: "power2.out" }, 1.95);
        tl.to("#dr-bar", { opacity: 1, duration: 0.3, ease: "power2.out" }, 2.0);
      },
    },
    {
      duration: 1.5,
      cues: [],
      build(tl) {
        touch(tl, "#slot-1530", 0);
        tl.to("#slot-1530", { scale: 0.96, duration: 0.1, ease: "power2.out" }, 0);
        tl.to("#slot-1530 .fill", { opacity: 1, duration: 0.16, ease: "power2.out" }, 0.04);
        tl.to("#slot-1530", { color: WHITE, borderColor: "#7E3BED", fontWeight: 700, duration: 0.16, ease: "power2.out" }, 0.04);
        tl.to("#slot-1530", { scale: 1, duration: 0.22, ease: "power2.out" }, 0.18);
        tl.to("#btn-agendar .on", { opacity: 1, duration: 0.25, ease: "power2.out" }, 0.16);
        tl.to("#btn-agendar .l0", { opacity: 0, duration: 0.18, ease: "power2.out" }, 0.16);
        tl.to("#btn-agendar .l1", { opacity: 1, duration: 0.25, ease: "power2.out" }, 0.22);
        pressBtn(tl, "#btn-agendar", 0.62);
        push(tl, "#s-doctor", "#s-pay", 0.8);
        tl.to(status, { color: INK, duration: 0.3, ease: "power2.out" }, 0.85);
      },
    },
    {
      duration: 2.85,
      cues: [{ t: 0.85, event: "pix-sent" }, { t: 1.45, event: "pix-confirmed" }],
      build(tl) {
        pressBtn(tl, "#btn-pix", 0);
        push(tl, "#s-pay", "#s-pix", 0.2);
        tl.set("#s-ok", { autoAlpha: 1, opacity: 0, y: 14 }, 1.3);
        tl.to("#s-ok", { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 1.3);
        tl.fromTo("#ok-ring", { scale: 0.6 }, { scale: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, 1.3);
        tl.fromTo("#ok-check", { scale: 0 }, { scale: 1, duration: 0.4, ease: "power3.out", immediateRender: false }, 1.42);
        tl.set("#s-pix", { autoAlpha: 0 }, 1.65);
        pressBtn(tl, "#btn-anam", 2.0);
        push(tl, "#s-ok", "#s-anam", 2.15);
      },
    },
    {
      duration: 1.95,
      cues: [{ t: 0.65, event: "anamnese-received" }],
      build(tl) {
        pressBtn(tl, "#btn-enviar", 0);
        push(tl, "#s-anam", "#s-sent", 0.2);
        tl.fromTo("#sent-check", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "power3.out", immediateRender: false }, 0.55);
        pressBtn(tl, "#btn-voltar", 1.15);
        pop(tl, "#s-sent", "#s-wait", 1.3);
      },
    },
    {
      duration: 5.6,
      crf: 35,
      cues: [
        { t: 1.0, event: "call-connected" },
        { t: 1.9, event: "record-writing" },
        { t: 3.2, event: "prescription-signed" },
        { t: 4.85, event: "receita-arrived" },
      ],
      build(tl) {
        pressBtn(tl, "#btn-entrar", 0);
        tl.set("#s-call", { autoAlpha: 1, y: H }, 0.2);
        tl.to("#s-call", { y: 0, duration: 0.55, ease: "power3.out" }, 0.2);
        tl.to(status, { color: WHITE, duration: 0.3, ease: "power2.out" }, 0.3);
        tl.to(homebar, { backgroundColor: WHITE, duration: 0.3, ease: "power2.out" }, 0.3);
        tl.set("#s-wait", { autoAlpha: 0 }, 0.75);
        tl.to("#call-feed", { opacity: 1, duration: 0.45, ease: "power2.out" }, 1.0);
        tl.to("#call-ui", { opacity: 1, duration: 0.45, ease: "power2.out" }, 1.05);
        tl.fromTo("#feed-img", { scale: 1 }, { scale: 1.05, duration: 3.3, ease: "sine.inOut", immediateRender: false }, 1.0);
        const clock = { s: 1 };
        const timer = $("#timer");
        const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
        tl.fromTo(clock, { s: 1 }, { s: 768, duration: 3.2, ease: "power2.in", immediateRender: false, onUpdate: () => (timer.textContent = fmt(clock.s)) }, 1.0);
        tl.fromTo("#toast-rec", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", immediateRender: false }, 1.9);
        tl.to("#toast-rec", { opacity: 0, y: -8, duration: 0.25, ease: "power2.in" }, 2.95);
        tl.fromTo("#toast-rx", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", immediateRender: false }, 3.2);
        tl.to("#toast-rx", { opacity: 0, y: -8, duration: 0.25, ease: "power2.in" }, 4.1);
        tl.to("#call-end", { opacity: 1, duration: 0.3, ease: "power2.out" }, 4.25);
        tl.set("#rx-veil", { autoAlpha: 1, opacity: 0 }, 4.55);
        tl.to("#rx-veil", { opacity: 1, duration: 0.35, ease: "power2.out" }, 4.55);
        tl.set("#s-rx", { autoAlpha: 1, y: H }, 4.55);
        tl.to("#s-rx", { y: 0, duration: 0.6, ease: "power3.out" }, 4.55);
        tl.to(homebar, { backgroundColor: INK, duration: 0.3, ease: "power2.out" }, 4.65);
        tl.fromTo("#signed", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out", immediateRender: false }, 4.95);
      },
    },
  ];

  const STOPS = [
    { id: "busca", target: "#spec-cg", label: "Tocar em Clínico geral" },
    { id: "medico", target: "#slot-1530", label: "Tocar em 15:30" },
    { id: "pagamento", target: "#btn-pix", label: "Tocar em Pagar com Pix" },
    { id: "anamnese", target: "#btn-enviar", label: "Tocar em Enviar anamnese" },
    { id: "espera", target: "#btn-entrar", label: "Tocar em Entrar na consulta" },
    { id: "receita", target: null, label: "Receita digital" },
  ];

  function build(k) {
    const tl = gsap.timeline({ paused: true });
    CLIPS[k - 1].build(tl);
    tl.set({}, {}, CLIPS[k - 1].duration);
    return tl;
  }

  function reach(n) {
    base();
    for (let k = 1; k < n; k++) {
      const tl = build(k);
      tl.progress(1, false);
      tl.kill();
      $$(".touch").forEach((d) => d.remove());
    }
  }

  let active = null;
  const q = new URLSearchParams(location.search);
  const imgs = $$("img").map((i) => (i.complete ? Promise.resolve() : new Promise((r) => (i.onload = i.onerror = r))));
  const ready = Promise.all([document.fonts.ready, ...imgs, ...$$("img").map((i) => i.decode().catch(() => {}))]).then(() => {
    if (q.has("clip")) {
      const k = +q.get("clip");
      reach(k);
      active = build(k);
      active.seek(0, false);
    } else {
      reach(+(q.get("stop") || 1));
    }
  });

  window.LD = {
    ready,
    seek: (t) => { active.seek(t, false); },
    hotspot(n) {
      const s = STOPS[n - 1];
      return s.target ? pct(s.target) : null;
    },
    meta: () => ({
      stops: STOPS.map(({ id, label }) => ({ id, label })),
      clips: CLIPS.map(({ duration, crf, cues }) => ({ duration, crf, cues })),
    }),
  };
})();
