function VMKit(cfg) {
  const W = 1080;
  const H = 1920;
  const G = cfg.geo;
  const root = document.querySelector('[data-composition-id="' + cfg.id + '"]');
  const one = (sel, scope) => (scope || root).querySelector(sel);
  const all = (sel, scope) => Array.from((scope || root).querySelectorAll(sel));
  const outer = one(".vmk-cam-outer");
  const inner = one(".vmk-cam-inner");
  const screenInner = one(".vmk-screen-inner");
  const overlay = one(".vmk-overlay");
  const cursor = one(".vmk-cursor");
  const hud = one(".vmk-hud");
  const device = one(".vmk-device");
  const scopeEl = one("." + cfg.scope);
  const bar = one(".vmk-progress");
  const TOUCH = !!cfg.touch;
  const BAKED = cfg.baked || null;
  const rectLog = [];
  const audits = [];
  let rectIndex = 0;
  const scrollOf = {};
  const tl = gsap.timeline();
  const master = gsap.timeline({ paused: true });
  const queue = [];
  const add = (fn) => queue.push(fn);
  const HOLD = cfg.hold || 0;
  const HOLD_FROM = 3.05;
  const CUR = 76;
  const HOT = TOUCH ? { x: CUR * 0.5, y: CUR * 0.5 } : { x: CUR * 0.21, y: CUR * 0.14 };
  const ORIGIN = TOUCH ? "50% 50%" : "21% 14%";
  const free = (el) => {
    el.setAttribute("data-layout-allow-overlap", "");
    all("*", el).forEach((n) => n.setAttribute("data-layout-allow-overlap", ""));
    return el;
  };
  const FULL_H = G.uh + G.chrome;
  let shown = null;
  let camState = { cx: G.uw / 2, cy: FULL_H / 2, zoom: G.k, wide: true };
  let curPos = null;
  let camFree = 0;

  const num = (fn) => {
    const i = rectIndex++;
    const v = BAKED && BAKED[i] ? BAKED[i][0] : fn();
    rectLog.push([+v.toFixed(2), 0, 0, 0]);
    return v;
  };
  const fx = (el, origin) => {
    if (!el.__vmk) {
      el.__vmk = true;
      el.style.setProperty("--vx", "0px");
      el.style.setProperty("--vy", "0px");
      el.style.setProperty("--vs", "1");
      el.style.transform = "translate(var(--vx, 0px), var(--vy, 0px)) scale(var(--vs, 1))";
    }
    if (origin) el.style.transformOrigin = origin;
    return el;
  };
  const px = (v) => v + "px";

  const states = {};
  const scrollers = {};
  const want = {};
  const limit = {};
  const SAFE_TOP = cfg.safeTop == null ? 118 : cfg.safeTop;
  const SAFE_BOTTOM = cfg.safeBottom == null ? 150 : cfg.safeBottom;
  all(".vmk-state").forEach((el) => {
    const name = el.getAttribute("data-state");
    states[name] = el;
    all("[data-vm-scroll]", el).forEach((n) => {
      n.scrollTop = Number(n.getAttribute("data-vm-top") || 0);
      n.scrollLeft = Number(n.getAttribute("data-vm-left") || 0);
    });
    let best = null;
    all("[data-vm-scroll]", el).forEach((n) => {
      if (n.clientWidth < 300 || n.scrollHeight - n.clientHeight < 20) return;
      if (!best || n.clientHeight > best.clientHeight) best = n;
    });
    scrollers[name] = best;
    const max = best ? num(() => best.scrollHeight - best.clientHeight) : num(() => 0);
    const y = Math.min(Number(el.getAttribute("data-scroll") || 0), max);
    if (best) best.scrollTop = y;
    limit[name] = max;
    want[name] = y;
    scrollOf[name] = y;
  });
  const layers = {};
  all(".vmk-layer").forEach((el) => {
    layers[el.getAttribute("data-vmk-layer")] = el;
  });
  const statusEl = one(".vmk-status:not(.dark)");
  const statusDark = one(".vmk-status.dark");
  const homebar = one(".vmk-homebar:not(.light)");
  const homebarLight = one(".vmk-homebar.light");
  if (statusDark) gsap.set([statusDark, homebarLight], { opacity: 0 });

  if (hud) hud.style.pointerEvents = "none";
  const layered = '[role="dialog"], [role="listbox"], [data-sonner-toaster], [data-radix-popper-content-wrapper]';
  all(layered).forEach((el) => {
    el.setAttribute("data-layout-allow-overlap", "");
    all("*", el).forEach((n) => n.setAttribute("data-layout-allow-overlap", ""));
  });
  all(".vmk-hud *").forEach((n) => n.setAttribute("data-layout-allow-overlap", ""));

  const state = (name) => {
    if (!states[name]) throw new Error("state " + name);
    return states[name];
  };

  const norm = (s) => s.replace(/\s+/g, " ").trim();

  function find(name, sel, text, nth) {
    let list = all(sel, state(name));
    if (text != null) {
      const re = text instanceof RegExp ? text : null;
      list = list.filter((el) => (re ? re.test(norm(el.textContent)) : norm(el.textContent).includes(text)));
      list.sort((a, b) => a.textContent.length - b.textContent.length);
      const shortest = list.length ? list[0].textContent.length : 0;
      list = list.filter((el) => el.textContent.length === shortest);
    }
    const el = list[nth || 0];
    if (!el) throw new Error("find " + name + " " + sel + " " + text);
    return el;
  }

  function pick(name, text, o) {
    const opt = o || {};
    const scope = opt.within || state(name);
    const re = text instanceof RegExp ? text : null;
    let list = all(opt.sel || "div", scope).filter((el) => {
      const t = norm(el.textContent || "");
      return re ? re.test(t) : t === text;
    });
    list = list.filter((el) => !list.some((x) => x !== el && el.contains(x)));
    list = list.filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return false;
      let n = el;
      while (n && n !== scope) {
        const cs = getComputedStyle(n);
        if (cs.display === "none" || /visibility:\s*hidden|display:\s*none/.test(n.getAttribute("style") || "")) return false;
        n = n.parentElement;
      }
      return true;
    });
    if (!opt.within && opt.hit !== false) {
      const st = state(name);
      const keep = [st.style.visibility, st.style.opacity, st.style.zIndex];
      st.style.visibility = "visible";
      st.style.opacity = "1";
      st.style.zIndex = "50";
      const sr = screenInner.getBoundingClientRect();
      const topList = list.filter((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        if (cx < sr.left || cx > sr.right || cy < sr.top || cy > sr.bottom) return true;
        const hit = document.elementFromPoint(cx, cy);
        return !!hit && (hit === el || el.contains(hit) || hit.contains(el));
      });
      st.style.visibility = keep[0];
      st.style.opacity = keep[1];
      st.style.zIndex = keep[2];
      if (topList.length) list = topList;
    }
    if (opt.sort === "y") list.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    let el = opt.last ? list[list.length - 1] : list[opt.nth || 0];
    if (!el) throw new Error("pick " + name + " " + text);
    if (opt.btn) el = el.closest('[role="button"], [data-vm-button], [tabindex="0"]') || el;
    for (let i = 0; i < (opt.up || 0); i++) el = el.parentElement;
    return el;
  }

  function isFixed(el, stop) {
    let n = el;
    while (n && n !== stop) {
      if (getComputedStyle(n).position === "fixed") return true;
      n = n.parentElement;
    }
    return false;
  }

  function live(el) {
    const r = el.getBoundingClientRect();
    const sr = screenInner.getBoundingClientRect();
    const k = sr.width / G.uw;
    return { x: (r.left - sr.left) / k, y: (r.top - sr.top) / k, w: r.width / k, h: r.height / k };
  }

  function rect(el) {
    const i = rectIndex++;
    let out;
    if (BAKED && BAKED[i]) {
      out = { x: BAKED[i][0], y: BAKED[i][1], w: BAKED[i][2], h: BAKED[i][3] };
    } else {
      const st = el.closest(".vmk-state");
      const scr = st ? scrollers[st.getAttribute("data-state")] : null;
      const inside = scr && scr.contains(el);
      const keep = inside ? scr.scrollTop : 0;
      if (inside) scr.scrollTop = scrollOf[st.getAttribute("data-state")];
      out = live(el);
      if (inside) scr.scrollTop = keep;
      if (el.__vmk) {
        const cs = getComputedStyle(el);
        const vs = Number(cs.getPropertyValue("--vs")) || 1;
        if (vs !== 1) {
          out.x -= (out.w / vs - out.w) / 2;
          out.y -= (out.h / vs - out.h) / 2;
          out.w /= vs;
          out.h /= vs;
        }
      }
    }
    rectLog.push([+out.x.toFixed(2), +out.y.toFixed(2), +out.w.toFixed(2), +out.h.toFixed(2)]);
    out.cx = out.x + out.w / 2;
    out.cy = out.y + out.h / 2;
    Object.defineProperty(out, "el", { value: el, enumerable: false });
    return out;
  }

  function box(el) {
    const i = rectIndex++;
    const out = BAKED && BAKED[i] ? { w: BAKED[i][2], h: BAKED[i][3] } : { w: el.offsetWidth, h: el.offsetHeight };
    rectLog.push([0, 0, out.w, out.h]);
    return out;
  }

  const focus = [];
  const claimed = [];
  const reveals = [];
  const claim = (els) => els.forEach((el) => el && claimed.push(el));
  const isClaimed = (el) => claimed.some((c) => c === el || c.contains(el) || el.contains(c));

  const anchors = [];
  const rests = [];
  function travel(t, a, b, dur) {
    for (let i = 0; i <= 4; i++) {
      const f = toFrame({ x: a.x + ((b.x - a.x) * i) / 4, y: a.y + ((b.y - a.y) * i) / 4 });
      focus.push({ a: t, b: t + dur, x: f.x, y: f.y, of: -1 });
    }
    const r = toFrame(b);
    rests.push({ t: t + dur, x: r.x, y: r.y });
  }
  function settle() {
    rests.sort((a, b) => a.t - b.t);
    rests.forEach((r, i) => {
      const next = rests[i + 1];
      focus.push({ a: r.t, b: next ? next.t : r.t + 60, x: r.x, y: r.y, of: -1 });
    });
  }
  function attend(t, target, until) {
    if (!target) return;
    const r = target instanceof Element ? rect(target) : target;
    const pts = r.w == null ? [r] : [{ x: r.x, y: r.y }, { x: r.x + r.w, y: r.y }, { x: r.x, y: r.y + r.h }, { x: r.x + r.w, y: r.y + r.h }, { x: r.cx, y: r.cy }];
    const id = anchors.length;
    if (r.w != null && r.w > 0) anchors.push({ id: id, a: t, ui: { x: r.x, y: r.y, w: r.w, h: r.h }, cam: { cx: camState.cx, cy: camState.cy, zoom: camState.zoom, wide: camState.wide } });
    pts.forEach((q) => {
      const f = toFrame(q);
      focus.push({ a: t, b: until == null ? t : until, x: f.x, y: f.y, of: r.w != null && r.w > 0 ? id : -1 });
    });
  }

  function frameAt(p, c) {
    if (c.wide) return { x: G.sx + p.x * G.k, y: G.sy + p.y * G.k };
    return { x: W / 2 + (p.x - c.cx) * c.zoom, y: H / 2 + (p.y - c.cy) * c.zoom };
  }

  function frameNow(p) {
    const sc = Number(gsap.getProperty(outer, "scale")) || 1;
    const tx = Number(gsap.getProperty(inner, "x")) || 0;
    const ty = Number(gsap.getProperty(inner, "y")) || 0;
    return { x: W / 2 + (G.sx + p.x * G.k + tx - W / 2) * sc, y: H / 2 + (G.sy + p.y * G.k + ty - H / 2) * sc };
  }

  function toFrame(p) {
    if (camState.wide) return { x: G.sx + p.x * G.k, y: G.sy + p.y * G.k };
    return { x: W / 2 + (p.x - camState.cx) * camState.zoom, y: H / 2 + (p.y - camState.cy) * camState.zoom };
  }

  function audit(kind, t, target, data) {
    const el = target instanceof Element ? target : target && target.el;
    if (el) audits.push({ kind: kind, t: t, el: el, data: data });
  }

  function pt(target) {
    if (target instanceof Element) {
      const r = rect(target);
      return { x: r.cx, y: r.cy };
    }
    if (target.cx != null) return { x: target.cx, y: target.cy };
    return target;
  }

  function show(t, name, o) {
    const el = state(name);
    const prev = shown;
    const fade = o && o.fade != null ? o.fade : 0.28;
    shown = name;
    if (t === 0 && !prev) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }
    add(() => {
      if (fade) {
        tl.set(el, { zIndex: 2 }, t);
        tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: fade, ease: "power2.out", immediateRender: false }, t);
        if (prev) tl.set(state(prev), { autoAlpha: 0 }, t + fade);
        tl.set(el, { zIndex: 0 }, t + fade);
        return;
      }
      if (prev) tl.set(state(prev), { autoAlpha: 0 }, t);
      tl.set(el, { autoAlpha: 1 }, t);
    });
  }

  const block = (n, html) => Array.from({ length: n }, () => html).join("");
  const PANEL_SKELETON =
    '<div class="min-h-screen bg-gray-50 p-4 md:p-8"><div class="mb-8 space-y-3"><div class="h-8 w-56 rounded-lg bg-gray-200"></div><div class="h-4 w-80 max-w-full rounded bg-gray-200"></div></div><div class="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">' +
    block(4, '<div class="h-28 rounded-xl border border-gray-100 bg-white shadow-sm"></div>') +
    '</div><div class="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"><div class="mb-6 h-6 w-44 rounded bg-gray-200"></div><div class="space-y-4">' +
    block(6, '<div class="h-12 rounded-lg bg-gray-100"></div>') +
    "</div></div></div>";
  const PAGE_SKELETON =
    '<div class="vmk-skel"><div class="vmk-skel-head"><i></i><b></b><b></b><b></b></div><div class="vmk-skel-body"><i class="t"></i><i class="s"></i><div class="vmk-skel-card"><i></i><i></i><i></i><i></i></div></div></div>';

  function loaderFor(name) {
    const st = state(name);
    const aside = one("aside", st);
    const x = aside && getComputedStyle(aside).display !== "none" ? rect(aside).w : 0;
    const el = document.createElement("div");
    el.className = "vmk-loader";
    el.style.left = x + "px";
    el.style.width = G.uw - x + "px";
    el.style.height = G.uh + "px";
    el.innerHTML = x ? PANEL_SKELETON : PAGE_SKELETON;
    scopeEl.appendChild(free(el));
    return { el: el, inner: el.firstChild };
  }

  function loading(L, from, out) {
    const beats = Math.max(1, Math.round((out - from) / 0.42));
    add(() => {
      tl.to(L.el, { opacity: 0, duration: 0.42, ease: "power2.inOut" }, out);
      tl.set(L.el, { visibility: "hidden" }, out + 0.42);
      if (bar) {
        tl.fromTo(bar, { scaleX: 0, opacity: 1 }, { scaleX: 0.74, duration: out - from - 0.02, ease: "power2.out", immediateRender: false }, from);
        tl.to(bar, { scaleX: 1, duration: 0.2, ease: "power2.in" }, out);
        tl.to(bar, { opacity: 0, duration: 0.22, ease: "none" }, out + 0.2);
      }
    });
  }

  function boot(name) {
    show(0, name);
    return 0;
  }

  function slide(t, name, o) {
    const opt = o || {};
    const el = state(name);
    const prev = shown;
    const pel = prev ? state(prev) : null;
    shown = name;
    const d = opt.dur || 0.52;
    const e = "power3.inOut";
    add(() => {
      tl.set(el, { autoAlpha: 1, zIndex: 3 }, t);
      if (opt.kind === "modal") {
        tl.fromTo(el, { y: G.uh, x: 0 }, { y: 0, duration: d, ease: "power3.out", immediateRender: false }, t);
        if (pel) tl.fromTo(pel, { scale: 1, y: 0 }, { scale: 0.93, y: 10, duration: d, ease: "power3.out", immediateRender: false, transformOrigin: "50% 100%" }, t);
      } else if (opt.kind === "back") {
        tl.fromTo(el, { x: -110, y: 0 }, { x: 0, duration: d, ease: e, immediateRender: false }, t);
        if (pel) {
          tl.set(pel, { zIndex: 4 }, t);
          tl.fromTo(pel, { x: 0 }, { x: G.uw, duration: d, ease: e, immediateRender: false }, t);
        }
      } else if (opt.kind === "fade") {
        tl.fromTo(el, { opacity: 0, x: 0, y: 0 }, { opacity: 1, duration: d * 0.6, ease: "power2.out", immediateRender: false }, t);
      } else {
        tl.fromTo(el, { x: G.uw, y: 0 }, { x: 0, duration: d, ease: e, immediateRender: false }, t);
        if (pel) tl.fromTo(pel, { x: 0 }, { x: -110, duration: d, ease: e, immediateRender: false }, t);
      }
      if (pel) {
        tl.set(pel, { autoAlpha: 0, x: 0, y: 0, scale: 1, zIndex: 0 }, t + d);
      }
      tl.set(el, { zIndex: 0 }, t + d);
    });
    return t + d;
  }

  function nav(t, name, o) {
    return slide(t, name, o);
  }

  function layer(name) {
    if (!layers[name]) throw new Error("layer " + name);
    return layers[name];
  }

  function layerIn(t, name, o) {
    const opt = o || {};
    const el = layer(name);
    const d = opt.dur || 0.5;
    add(() => {
      tl.set(el, { visibility: "visible", opacity: opt.from === "right" || opt.from === "up" ? 1 : 0 }, t);
      if (opt.from === "right") tl.fromTo(el, { x: G.uw }, { x: 0, duration: d, ease: "power3.inOut", immediateRender: false }, t);
      else if (opt.from === "up") tl.fromTo(el, { y: G.uh }, { y: 0, duration: d, ease: "power3.out", immediateRender: false }, t);
      else if (opt.from === "zoom") tl.fromTo(el, { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: d, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, t);
      else tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: d, ease: "power2.out", immediateRender: false }, t);
    });
    return t + d;
  }

  function layerOut(t, name, o) {
    const opt = o || {};
    const el = layer(name);
    const d = opt.dur || 0.4;
    add(() => {
      if (opt.to === "left") tl.to(el, { x: -G.uw, duration: d, ease: "power3.inOut" }, t);
      else if (opt.to === "down") tl.to(el, { y: G.uh, duration: d, ease: "power3.in" }, t);
      else if (opt.to === "zoom") tl.to(el, { scale: 0.92, opacity: 0, duration: d, ease: "power3.in", transformOrigin: "50% 50%" }, t);
      else tl.to(el, { opacity: 0, duration: d, ease: "power2.in" }, t);
      tl.set(el, { autoAlpha: 0, x: 0, y: 0, scale: 1 }, t + d);
    });
    return t + d;
  }

  function status(t, dark, o) {
    if (!statusEl) return;
    const d = (o && o.dur) || 0.25;
    add(() => {
      tl.to([statusEl, homebar], { opacity: dark ? 0 : 1, duration: d, ease: "none" }, t);
      tl.to([statusDark, homebarLight], { opacity: dark ? 1 : 0, duration: d, ease: "none" }, t);
    });
  }

  function url(t, key) {
    const items = all(".vmk-url-item");
    add(() => {
      items.forEach((el) => {
        tl.set(el, { display: el.getAttribute("data-url") === key ? "inline" : "none" }, t);
      });
    });
  }

  function clampCenter(cx, cy, zoom) {
    const halfW = W / zoom / 2;
    const halfH = H / zoom / 2;
    const mx = 70 / zoom;
    const x = G.uw * zoom >= W ? Math.min(Math.max(cx, halfW), G.uw - halfW) : Math.min(Math.max(cx, G.uw - halfW + mx), halfW - mx);
    const y = FULL_H * zoom >= H ? Math.min(Math.max(cy, halfH - 40 / zoom), FULL_H - halfH + 40 / zoom) : FULL_H / 2;
    return { x, y };
  }

  function cam(t, o, dur, ease) {
    const d = dur == null ? 1.1 : dur;
    const e = ease || "power3.inOut";
    let s = 1;
    let tx = 0;
    let ty = 0;
    if (o.wide) {
      camState = { cx: G.uw / 2, cy: FULL_H / 2, zoom: G.k, wide: true };
    } else {
      const P = cfg.portrait && !o.free;
      const zoom = P ? Math.max(o.zoom, cfg.portrait.zoom) : o.zoom;
      const px = o.x - ((o.ax == null ? W / 2 : o.ax) - W / 2) / zoom;
      const py = o.y - ((o.ay == null ? H / 2 : o.ay) - H / 2) / zoom;
      let c = o.free ? { x: px, y: py } : clampCenter(px, py, zoom);
      if (P) {
        const T0 = cfg.portrait.top;
        const ph = FULL_H * zoom;
        const lo = Math.min(T0, H - ph);
        const top = Math.max(lo, Math.min(T0, (T0 + H) / 2 - o.y * zoom));
        c = { x: G.uw / 2, y: (H / 2 - top) / zoom };
      }
      s = zoom / G.k;
      tx = -(G.sx + c.x * G.k - W / 2);
      ty = -(G.sy + c.y * G.k - H / 2);
      camState = { cx: c.x, cy: c.y, zoom, wide: false, free: !!o.free };
    }
    camFree = Math.max(camFree, t + d);
    if (t <= 0.02 && d <= 0.05) {
      gsap.set(outer, { scale: s });
      gsap.set(inner, { x: tx, y: ty });
    }
    add(() => {
      tl.to(outer, { scale: s, duration: d, ease: e }, t);
      tl.to(inner, { x: tx, y: ty, duration: d, ease: e }, t);
    });
  }

  function ensure(t, target, o) {
    const el = target instanceof Element ? target : target && target.el;
    if (!el) return;
    const opt = o || {};
    const st = el.closest(".vmk-state");
    let r = rect(el);
    const scr0 = st ? scrollers[st.getAttribute("data-state")] : null;
    if (st && scr0 && scr0.contains(el) && !opt.noScroll && r.h < G.uh - 240) {
      const name = st.getAttribute("data-state");
      const top = SAFE_TOP;
      const bottom = FULL_H - SAFE_BOTTOM;
      const delta = r.y + r.h > bottom ? r.y + r.h - bottom + 60 : r.y < top ? r.y - top - 60 : 0;
      const to = Math.max(0, Math.min(limit[name], scrollOf[name] + delta));
      if (delta && Math.abs(to - scrollOf[name]) > 1) {
        const group = Object.keys(states).filter((n) => Math.abs(scrollOf[n] - scrollOf[name]) < 0.5 && limit[n] >= to - 0.5);
        scroll(Math.max(t - 0.8, 0), group, to, 0.6);
        r = rect(el);
      }
    }
    if (camState.wide || !opt.cam) return;
    const L = 60;
    const R = W - 60;
    const T = 470;
    const B = H - 330;
    const fit = Math.min(camState.zoom, (R - L) / (r.w + 40), (B - T) / (r.h + 40));
    const zoom = opt.fit && fit < camState.zoom - 0.01 ? Math.max(fit, 1.3334) : camState.zoom;
    const a = { x: W / 2 + (r.x - camState.cx) * zoom, y: H / 2 + (r.y - camState.cy) * zoom };
    const b = { x: a.x + r.w * zoom, y: a.y + r.h * zoom };
    let dx = 0;
    let dy = 0;
    if (b.x - a.x > R - L) dx = (a.x + b.x) / 2 - W / 2;
    else if (b.x > R) dx = b.x - R;
    else if (a.x < L) dx = a.x - L;
    if (b.y - a.y > B - T) dy = (a.y + b.y) / 2 - (T + B) / 2;
    else if (b.y > B) dy = b.y - B;
    else if (a.y < T) dy = a.y - T;
    if (!dx && !dy && zoom === camState.zoom) return;
    const start = Math.max(camFree, t - 0.6);
    const dur = Math.max(0.25, Math.min(0.55, t - start));
    cam(Math.min(start, t - 0.25), { x: camState.cx + dx / zoom, y: camState.cy + dy / zoom, zoom: zoom, free: camState.free }, dur, "power3.inOut");
  }

  function camOn(t, target, o, dur, ease) {
    const opt = o || {};
    const r = target instanceof Element ? rect(target) : target;
    const pad = opt.pad == null ? 90 : opt.pad;
    const fit = Math.min(W / (r.w + pad * 2), (H - (opt.keep == null ? 0 : opt.keep)) / (r.h + pad * 2));
    const zoom = Math.max(opt.min || 1.3334, Math.min(opt.max || 2.2, fit));
    cam(t, { x: r.cx + (opt.dx || 0), y: r.cy + (opt.dy || 0), zoom, ax: opt.ax, ay: opt.ay, free: opt.free }, dur, ease);
  }

  function view() {
    if (camState.wide) return { left: 0, top: 0, right: G.uw, bottom: FULL_H };
    const halfW = W / camState.zoom / 2;
    const halfH = H / camState.zoom / 2;
    return {
      left: Math.max(0, camState.cx - halfW),
      right: Math.min(G.uw, camState.cx + halfW),
      top: Math.max(0, camState.cy - halfH),
      bottom: Math.min(FULL_H, camState.cy + halfH),
    };
  }

  gsap.set(cursor, { x: -300, y: -300 });

  function cursorEnter(t, target, dur) {
    ensure(t + (dur || 0.8), target);
    const p = pt(target);
    const v = view();
    const from = { x: p.x + 40, y: v.bottom + 90 };
    travel(t, TOUCH ? p : from, p, dur || 0.8);
    curPos = p;
    audit("point", t + (dur || 0.8), target);
    attend(t + (dur || 0.8), p);
    if (TOUCH) {
      add(() => {
        tl.set(cursor, { x: p.x - HOT.x, y: p.y - HOT.y }, t);
        tl.fromTo(
          cursor,
          { opacity: 0, scale: 1.7 },
          { opacity: 1, scale: 1, duration: dur || 0.8, ease: "power3.out", immediateRender: false, transformOrigin: ORIGIN },
          t
        );
      });
      return;
    }
    add(() => {
      tl.fromTo(
        cursor,
        { x: from.x - HOT.x, y: from.y - HOT.y },
        { x: p.x - HOT.x, y: p.y - HOT.y, duration: dur || 0.8, ease: "power3.out", immediateRender: false },
        t
      );
    });
  }

  function cursorTo(t, target, dur, ease) {
    ensure(t + (dur || 0.6), target);
    const p = pt(target);
    if (curPos) travel(t, curPos, p, dur || 0.6);
    curPos = p;
    audit("point", t + (dur || 0.6), target);
    attend(t + (dur || 0.6), p);
    add(() => {
      if (TOUCH) {
        const d = Math.min(dur || 0.6, 0.6);
        tl.set(cursor, { x: p.x - HOT.x, y: p.y - HOT.y }, t + (dur || 0.6) - d);
        tl.fromTo(cursor, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: d, ease: "power3.out", immediateRender: false, transformOrigin: ORIGIN }, t + (dur || 0.6) - d);
        return;
      }
      tl.to(cursor, { x: p.x - HOT.x, y: p.y - HOT.y, duration: dur || 0.6, ease: ease || "power2.inOut" }, t);
    });
  }

  function cursorAside(t, dx, dy, dur) {
    const p = { x: curPos.x + dx, y: curPos.y + dy };
    travel(t, curPos, p, dur || 0.7);
    curPos = p;
    add(() => {
      tl.to(cursor, { x: p.x - HOT.x, y: p.y - HOT.y, duration: dur || 0.7, ease: "power2.out" }, t);
    });
  }

  function cursorExit(t, dir, dur) {
    const v = view();
    const p =
      dir === "down"
        ? { x: curPos.x + 60, y: v.bottom + 120 }
        : dir === "left"
          ? { x: v.left - 140, y: curPos.y + 40 }
          : { x: v.right + 140, y: curPos.y + 40 };
    travel(t, curPos, p, dur || 0.55);
    curPos = p;
    add(() => {
      if (TOUCH) tl.to(cursor, { opacity: 0, scale: 1.5, duration: dur || 0.55, ease: "power2.in", transformOrigin: ORIGIN }, t);
      else tl.to(cursor, { x: p.x - HOT.x, y: p.y - HOT.y, duration: dur || 0.55, ease: "power2.in" }, t);
    });
  }

  function click(t, target, o) {
    const opt = o || {};
    if (target) ensure(t, target);
    const p = target ? pt(target) : curPos;
    const ring = document.createElement("div");
    ring.className = "vmk-ring";
    overlay.insertBefore(ring, cursor);
    gsap.set(ring, { x: p.x, y: p.y, scale: 0.2 });
    const echo = document.createElement("div");
    echo.className = "vmk-ring vmk-ring-echo";
    overlay.insertBefore(echo, cursor);
    gsap.set(echo, { x: p.x, y: p.y, scale: 0.2 });
    const dot = document.createElement("div");
    dot.className = "vmk-ring-dot";
    overlay.insertBefore(dot, cursor);
    gsap.set(dot, { x: p.x, y: p.y, scale: 0 });
    if (target) audit("click", t, target);
    attend(t, target instanceof Element ? target : p, t + 0.4);
    add(() => {
      tl.to(cursor, { scale: 0.84, duration: 0.1, ease: "power2.in", transformOrigin: ORIGIN }, t);
      tl.to(cursor, { scale: 1, duration: 0.22, ease: "power2.out", transformOrigin: ORIGIN }, t + 0.1);
      tl.fromTo(ring, { scale: 0.2, opacity: 1 }, { scale: 1.25, opacity: 0, duration: 0.5, ease: "expo.out", immediateRender: false }, t + 0.04);
      tl.fromTo(echo, { scale: 0.2, opacity: 0.8 }, { scale: 2, opacity: 0, duration: 0.75, ease: "expo.out", immediateRender: false }, t + 0.12);
      tl.fromTo(dot, { scale: 0, opacity: 0.55 }, { scale: 1, opacity: 0, duration: 0.34, ease: "power3.out", immediateRender: false }, t);
      if (TOUCH && !opt.stay) tl.to(cursor, { opacity: 0, scale: 1.3, duration: 0.35, ease: "power2.in", transformOrigin: ORIGIN }, t + 0.42);
      if (opt.press && target instanceof Element) {
        fx(target, "50% 50%");
        tl.fromTo(target, { "--vs": 1 }, { "--vs": 0.95, duration: 0.1, ease: "power2.in", immediateRender: false }, t);
        tl.fromTo(target, { "--vs": 0.95 }, { "--vs": 1, duration: 0.24, ease: "power3.out", immediateRender: false }, t + 0.1);
      }
    });
  }

  function go(t, target, o) {
    const opt = o || {};
    const move = opt.move == null ? 0.6 : opt.move;
    cursorTo(t, target, move, opt.ease);
    const at = t + move + (opt.wait == null ? 0.12 : opt.wait);
    click(at, target, { press: opt.press !== false });
    return at;
  }

  function focusRing(t, input, end) {
    const off = { boxShadow: "0 0 0 0px rgba(126,59,237,0)", borderColor: "#dcd7ea" };
    const on = { boxShadow: "0 0 0 4px rgba(126,59,237,0.22)", borderColor: "#7e3bed" };
    add(() => {
      tl.fromTo(input, off, Object.assign({ duration: 0.14, ease: "power2.out", immediateRender: false }, on), t);
      tl.fromTo(input, on, Object.assign({ duration: 0.14, ease: "power2.in", immediateRender: false }, off), end);
    });
  }

  function type(t, input, text, o) {
    const opt = o || {};
    const dur = opt.dur || text.length / (opt.cps || 15);
    const from = opt.from || "";
    const p = { n: 0 };
    input.value = from;
    input.setAttribute("value", from);
    attend(t, input, t + dur);
    if (opt.ring !== false) focusRing(t - 0.05, input, t + dur + (opt.hold == null ? 0.25 : opt.hold));
    add(() => {
      tl.to(
        p,
        {
          n: text.length,
          duration: dur,
          ease: "none",
          onUpdate: () => {
            input.value = from + text.slice(0, Math.round(p.n));
          },
        },
        t
      );
    });
    return t + dur;
  }

  function flip(t, fn) {
    const p = { v: 0 };
    fn(false);
    add(() => {
      tl.to(p, { v: 1, duration: 0.02, ease: "none", onUpdate: () => fn(p.v >= 0.5) }, t);
    });
  }

  function setText(t, el, text) {
    const old = el.textContent;
    flip(t, (on) => {
      el.textContent = on ? text : old;
    });
  }

  function count(t, el, from, to, fmt, dur) {
    claim([el]);
    const p = { v: from };
    const old = el.textContent;
    add(() => {
      tl.to(
        p,
        {
          v: to,
          duration: dur || 0.9,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = tl.time() < t + (t >= HOLD_FROM ? HOLD : 0) ? old : fmt(p.v);
          },
        },
        t
      );
    });
  }

  function tick(t, el, dur) {
    const text = el.textContent;
    const m = text.match(/\d[\d.]*(,\d+)?/);
    if (!m) return;
    const to = Number(m[0].replace(/\./g, "").replace(",", "."));
    if (!to) return;
    const digits = m[1] ? m[1].length - 1 : 0;
    const head = text.slice(0, m.index);
    const tail = text.slice(m.index + m[0].length);
    count(t, el, 0, to, (v) => head + v.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits }) + tail, dur || 0.9);
  }

  function reveal(t, name) {
    reveals.push({ t: t, name: name });
  }

  function runReveals() {
    reveals.forEach((r) => {
      const st = state(r.name);
      const picked = [];
      all("main h1, main [class*='bg-card'], main table tbody tr", st).forEach((el) => {
        if (picked.length >= 14 || isClaimed(el) || picked.some((x) => x.contains(el))) return;
        if (el.closest('[role="dialog"]')) return;
        picked.push(el);
      });
      all("main .grid .text-2xl", st)
        .filter((el) => !el.children.length && !claimed.includes(el))
        .slice(0, 6)
        .forEach((el, i) => tick(r.t + 0.15 + i * 0.08, el, 0.9));
      picked.forEach((el, i) => {
        gsap.set(fx(el), { opacity: 0 });
        tl.fromTo(el, { opacity: 0, "--vy": "22px" }, { opacity: 1, "--vy": "0px", duration: 0.36, ease: "power4.out", immediateRender: false }, r.t + i * 0.05);
      });
    });
  }

  function scroll(t, names, want_, dur, ease) {
    const y = Math.min.apply(null, [want_].concat(names.map((n) => limit[n])));
    const list = names.map((n) => ({ el: state(n), name: n, from: scrollOf[n] }));
    names.forEach((n) => {
      scrollOf[n] = y;
    });
    const p = { v: 0 };
    add(() => {
      tl.to(
        p,
        {
          v: 1,
          duration: dur || 0.9,
          ease: ease || "power3.inOut",
          onUpdate: () => {
            list.forEach((s) => {
              want[s.name] = s.from + (y - s.from) * p.v;
              if (scrollers[s.name]) scrollers[s.name].scrollTop = want[s.name];
            });
          },
        },
        t
      );
    });
  }

  function dialogIn(t, name) {
    const st = state(name);
    const panel = one('[role="dialog"]', st);
    const veil = one('[data-slot="dialog-overlay"], [data-slot="sheet-overlay"]', st);
    gsap.set(panel, { opacity: 0 });
    fx(panel, "50% 50%");
    if (veil) gsap.set(veil, { opacity: 0 });
    attend(t, panel, t + 1.2);
    add(() => {
      if (veil) tl.fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.out", immediateRender: false }, t);
      tl.fromTo(panel, { "--vs": 0.94, opacity: 0 }, { "--vs": 1, opacity: 1, duration: 0.3, ease: "power3.out", immediateRender: false }, t);
    });
  }

  function popIn(t, el, o) {
    const opt = o || {};
    gsap.set(el, { opacity: 0 });
    fx(el, opt.origin || "50% 0%");
    claim([el]);
    add(() => {
      tl.fromTo(
        el,
        { "--vs": opt.from || 0.96, opacity: 0, "--vy": px(opt.y || 0) },
        { "--vs": 1, opacity: 1, "--vy": "0px", duration: opt.dur || 0.3, ease: "power3.out", immediateRender: false },
        t
      );
    });
  }

  function toastIn(t, name) {
    const el = one("[data-sonner-toaster]", state(name));
    if (!el) throw new Error("toast " + name);
    gsap.set(el, { opacity: 0 });
    fx(el);
    add(() => {
      tl.fromTo(el, { "--vy": "60px", opacity: 0 }, { "--vy": "0px", opacity: 1, duration: 0.36, ease: "power3.out", immediateRender: false }, t);
    });
  }

  function rows(t, els, o) {
    const opt = o || {};
    const step = opt.stagger || 0.05;
    els.forEach((el) => gsap.set(fx(el), { opacity: 0 }));
    claim(els);
    els.slice(0, 8).forEach((el) => attend(t, el, t + 1.6));
    add(() => {
      els.forEach((el, i) => {
        tl.fromTo(
          el,
          { opacity: 0, "--vy": px(opt.y == null ? 18 : opt.y) },
          { opacity: 1, "--vy": "0px", duration: opt.dur || 0.3, ease: "power4.out", immediateRender: false },
          t + i * step
        );
      });
    });
  }

  const marks = [];
  function mark(t, target, o) {
    const opt = o || {};
    ensure(t, target, { fit: true, stay: opt.stay });
    const el0 = target instanceof Element ? target : target && target.el;
    const r = el0 ? rect(el0) : target;
    const pad = opt.pad == null ? 8 : opt.pad;
    const w = r.w + pad * 2;
    const h = r.h + pad * 2;
    const rad = Math.min(opt.radius || 14, h / 2, w / 2);
    const el = document.createElement("div");
    el.className = "vmk-mark";
    el.innerHTML =
      '<b></b><svg width="' +
      w +
      '" height="' +
      h +
      '" viewBox="0 0 ' +
      w +
      " " +
      h +
      '" fill="none"><rect class="halo" x="2" y="2" width="' +
      (w - 4) +
      '" height="' +
      (h - 4) +
      '" rx="' +
      rad +
      '" pathLength="1"/><rect class="line" x="2" y="2" width="' +
      (w - 4) +
      '" height="' +
      (h - 4) +
      '" rx="' +
      rad +
      '" pathLength="1"/></svg><i></i>';
    scopeEl.appendChild(free(el));
    el.style.zIndex = "40";
    gsap.set(el, { x: r.x - pad, y: r.y - pad, width: w, height: h });
    const tint = one("b", el);
    const halo = one(".halo", el);
    const line = one(".line", el);
    const spark = one("i", el);
    tint.style.borderRadius = rad + "px";
    gsap.set([halo, line], { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(tint, { opacity: 0 });
    gsap.set(spark, { opacity: 0 });
    const hold = opt.hold || 1.6;
    audit("mark", t + 0.5, target, { mark: el, pad: pad });
    attend(t, { x: r.x, y: r.y, w: r.w, h: r.h, cx: r.cx, cy: r.cy }, t + hold);
    const item = { a: t, b: t + hold, tint: tint, solo: true };
    marks.push(item);
    let tag = null;
    const tagY = opt.below ? r.y + r.h + pad + 10 : r.y - pad - 46;
    if (opt.label) {
      tag = document.createElement("div");
      tag.className = "vmk-tag";
      tag.textContent = opt.label;
      overlay.insertBefore(free(tag), cursor);
      gsap.set(tag, { x: r.x - pad, y: tagY });
    }
    add(() => {
      tl.set(el, { opacity: 1 }, t);
      tl.fromTo(line, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: "power3.inOut", immediateRender: false }, t);
      tl.fromTo(halo, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: "power3.inOut", immediateRender: false }, t + 0.06);
      tl.fromTo(tint, { opacity: 0 }, { opacity: 0.7, duration: 0.6, ease: "sine.out", immediateRender: false }, t + 0.2);
      tl.to([line, halo], { strokeDashoffset: -1, duration: 0.4, ease: "power3.in" }, t + hold);
      tl.to(tint, { opacity: 0, duration: 0.4, ease: "sine.in" }, t + hold);
      tl.set(el, { opacity: 0 }, t + hold + 0.42);
      if (tag) {
        tl.fromTo(tag, { opacity: 0, y: tagY + 14 }, { opacity: 1, y: tagY, duration: 0.28, ease: "power4.out", immediateRender: false }, t + 0.08);
        tl.to(tag, { opacity: 0, duration: 0.2, ease: "power2.in" }, t + hold);
      }
    });
  }

  function spotlights() {
    marks.forEach((m) => {
      if (m.b - m.a < 1.2) m.solo = false;
      marks.forEach((n) => {
        if (n !== m && n.a < m.b + 0.4 && n.b > m.a - 0.4) m.solo = false;
      });
      if (m.solo) m.tint.classList.add("spot");
    });
  }

  const title = one(".vmk-title");
  const bubbles = all(".vmk-bub");
  const bubSize = bubbles.map((el) => box(el));
  const capPlan = [];
  const tracked = [];
  const BW = 24;
  bubbles.forEach((el) => gsap.set(el, { opacity: 0 }));
  if (device) gsap.set(device, { opacity: 0 });

  function clearance(r, from, to, skip) {
    let best = 900;
    focus.forEach((f) => {
      if (f.b < from || f.a > to || f.of === skip) return;
      const dx = Math.max(r.x - f.x, 0, f.x - (r.x + r.w));
      const dy = Math.max(r.y - f.y, 0, f.y - (r.y + r.h));
      best = Math.min(best, Math.sqrt(dx * dx + dy * dy));
    });
    return best;
  }

  function introIn(t) {
    const step = one(".vmk-step", title);
    if (step) {
      gsap.set(step, { opacity: 0 });
      add(() => tl.fromTo(step, { opacity: 0, y: -26 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", immediateRender: false }, t));
    }
    const words = all("h2 .w", title);
    const sweep = one("h2 u", title);
    const lead = one("p", title);
    words.forEach((el) => gsap.set(el, { yPercent: 115 }));
    gsap.set(sweep, { scaleX: 0 });
    gsap.set(lead, { opacity: 0 });
    add(() => {
      let at = t;
      words.forEach((el) => {
        tl.fromTo(el, { yPercent: 115 }, { yPercent: 0, duration: 0.62, ease: "expo.out", immediateRender: false }, at);
        at += 0.09;
      });
      tl.fromTo(sweep, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power3.inOut", immediateRender: false }, at + 0.05);
      tl.fromTo(lead, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, at + 0.2);
    });
  }

  function dive(from, to, dur, ease) {
    const s = from.zoom / G.k;
    gsap.set(title, { autoAlpha: 0 });
    gsap.set(device, { opacity: 1 });
    gsap.set(outer, { scale: s });
    gsap.set(inner, { x: (from.ax - W / 2) / s + W / 2 - G.sx - from.x * G.k, y: (from.ay - H / 2) / s + H / 2 - G.sy - from.y * G.k });
    cam(0, to, dur, ease || "power2.out");
  }

  function introOut(t) {
    const lines = all("h2 .l", title);
    const lead = one("p", title);
    add(() => {
      lines.forEach((el, i) => {
        tl.to(el, { x: i % 2 ? 760 : -760, duration: 0.5, ease: "power3.in" }, t + i * 0.04);
        tl.to(el, { opacity: 0, duration: 0.3, ease: "none" }, t + 0.2 + i * 0.04);
      });
      tl.to(lead, { opacity: 0, y: 40, duration: 0.3, ease: "power2.in" }, t);
      const step = one(".vmk-step", title);
      if (step) tl.to(step, { opacity: 0, y: -26, duration: 0.3, ease: "power2.in" }, t);
      tl.fromTo(device, { y: 300, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "expo.out", immediateRender: false, transformOrigin: "50% 50%" }, t + 0.18);
    });
  }

  function caption(t, index, o) {
    const opt = o || {};
    const at = opt.at ? (opt.at instanceof Element ? rect(opt.at) : opt.at) : null;
    capPlan.push({ t: t, index: index, side: opt.side, at: at, cam: { cx: camState.cx, cy: camState.cy, zoom: camState.zoom, wide: camState.wide } });
  }

  function capTo() {}

  function captionOut(t) {
    capPlan.push({ t: t, index: -1 });
  }

  function place(c, end, size) {
    if (cfg.portrait) return { fixed: { x: (W - size.w) / 2, y: Math.max(150, cfg.portrait.top - 30 - size.h), origin: "50% 100%" }, origin: "50% 100%", size: size, ui: null };
    let anchor = c.at ? { id: -2, ui: c.at, cam: c.cam } : null;
    if (!anchor) {
      const list = anchors.filter((x) => x.a >= c.t - 0.12 && x.a < end).sort((x, y) => x.a - y.a);
      anchor = list[0] || null;
    }
    const safe = (r) => r.x >= BW && r.y >= BW && r.x + r.w <= W - BW && r.y + r.h <= H - BW && !(r.x < 330 && r.y < 124);
    if (anchor) {
      const p0 = frameAt({ x: anchor.ui.x, y: anchor.ui.y }, anchor.cam);
      const z = anchor.cam.wide ? G.k : anchor.cam.zoom;
      const R = { x: p0.x, y: p0.y, w: anchor.ui.w * z, h: anchor.ui.h * z };
      const gap = 54;
      const mid = Math.max(132, Math.min(H - BW - size.h, R.y + R.h / 2 - size.h / 2));
      const cen = Math.max(BW, Math.min(W - BW - size.w, R.x + R.w / 2 - size.w / 2));
      const pl = frameAt({ x: 0, y: 0 }, anchor.cam).x - 14 * z;
      const pr = frameAt({ x: G.uw, y: 0 }, anchor.cam).x + 14 * z;
      const options = {
        right: { x: Math.max(R.x + R.w + gap, pr + 34), y: mid, ax: anchor.ui.x + anchor.ui.w, ay: anchor.ui.y + anchor.ui.h / 2, origin: "0% 50%" },
        left: { x: Math.min(R.x - gap, pl - 34) - size.w, y: mid, ax: anchor.ui.x, ay: anchor.ui.y + anchor.ui.h / 2, origin: "100% 50%" },
        below: { x: cen, y: R.y + R.h + gap, ax: anchor.ui.x + anchor.ui.w / 2, ay: anchor.ui.y + anchor.ui.h, origin: "50% 0%" },
        above: { x: cen, y: R.y - gap - size.h, ax: anchor.ui.x + anchor.ui.w / 2, ay: anchor.ui.y, origin: "50% 100%" },
      };
      let best = null;
      let top = -1;
      (c.side ? [c.side] : ["right", "left", "below", "above"]).forEach((side, i) => {
        const q = options[side];
        const r = { x: q.x, y: q.y, w: size.w, h: size.h };
        if (!c.side && !safe(r)) return;
        const room = clearance(r, c.t - 0.1, end, anchor.id);
        if (!c.side && room < 30) return;
        const score = Math.min(room, 300) - i * 12;
        if (score > top) {
          top = score;
          best = q;
        }
      });
      if (best) {
        const a = frameAt({ x: best.ax, y: best.ay }, anchor.cam);
        return { ui: { x: best.ax, y: best.ay }, dx: best.x - a.x, dy: best.y - a.y, origin: best.origin, size: size };
      }
    }
    let slot = null;
    let top = -1;
    [
      { x: 56, y: H - 56 - size.h, origin: "0% 100%" },
      { x: W - 56 - size.w, y: H - 56 - size.h, origin: "100% 100%" },
      { x: W - 56 - size.w, y: 56, origin: "100% 0%" },
      { x: 56, y: 150, origin: "0% 0%" },
    ].forEach((q, i) => {
      const score = Math.min(clearance({ x: q.x, y: q.y, w: size.w, h: size.h }, c.t - 0.1, end, -9), 400) - i * 10;
      if (score > top) {
        top = score;
        slot = q;
      }
    });
    return { fixed: slot, origin: slot.origin, size: size, ui: null };
  }

  function layCaptions() {
    capPlan.sort((a, b) => a.t - b.t);
    const last = tl.duration();
    let prev = null;
    capPlan.forEach((c, i) => {
      const next = capPlan[i + 1];
      const end = next ? next.t : last + 0.2;
      if (c.index < 0) {
        if (prev) {
          tl.to(prev.card, { scale: 0.8, opacity: 0, duration: 0.22, ease: "power3.in" }, c.t);
          tl.to(prev.line, { scaleX: 0, duration: 0.18, ease: "power3.in" }, c.t);
          tl.to(prev.dot, { scale: 0, duration: 0.18, ease: "power3.in" }, c.t + 0.06);
        }
        prev = null;
        return;
      }
      const card = bubbles[c.index];
      const p = place(c, end, bubSize[c.index]);
      const line = document.createElement("div");
      line.className = "vmk-bub-line";
      const dot = document.createElement("div");
      dot.className = "vmk-bub-dot";
      hud.insertBefore(line, bubbles[0]);
      hud.insertBefore(dot, bubbles[0]);
      const words = all("h3 span", card);
      const body = one("p", card);
      const keys = all("p b", card);
      const rec = { card: card, line: line, dot: dot, p: p, from: prev, next: null, blend: { v: prev ? 0 : 1 }, pos: null };
      words.forEach((w) => gsap.set(w, { opacity: 0 }));
      gsap.set(body, { opacity: 0 });
      gsap.set(line, { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(dot, { scale: 0 });
      card.style.transformOrigin = p.origin;
      let w;
      if (prev) {
        prev.next = rec;
        tl.to(prev.line, { scaleX: 0, duration: 0.16, ease: "power3.in" }, c.t);
        tl.to(prev.dot, { scale: 0, duration: 0.16, ease: "power3.in" }, c.t + 0.04);
        tl.fromTo(rec.blend, { v: 0 }, { v: 1, duration: 0.62, ease: "power3.inOut", immediateRender: false }, c.t + 0.06);
        tl.to(prev.card, { opacity: 0, duration: 0.24, ease: "power2.in" }, c.t + 0.16);
        tl.fromTo(card, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.34, ease: "power3.out", immediateRender: false }, c.t + 0.3);
        tl.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.3, ease: "expo.out", immediateRender: false }, c.t + 0.58);
        tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.28, ease: "power3.out", immediateRender: false }, c.t + 0.62);
        w = c.t + 0.4;
      } else {
        tl.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.3, ease: "expo.out", immediateRender: false }, c.t);
        tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power3.out", immediateRender: false }, c.t + 0.08);
        tl.fromTo(card, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.42, ease: "expo.out", immediateRender: false }, c.t + 0.16);
        w = c.t + 0.24;
      }
      words.forEach((span) => {
        tl.set(span, { opacity: 1 }, w);
        tl.fromTo(span, { y: 26 }, { y: 0, duration: 0.24, ease: "power4.out", immediateRender: false }, w);
        w += 0.045;
      });
      tl.fromTo(body, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32, ease: "power3.out", immediateRender: false }, w + 0.03);
      keys.forEach((k) => {
        tl.fromTo(k, { backgroundSize: "0% 100%" }, { backgroundSize: "100% 100%", duration: 0.45, ease: "power3.inOut", immediateRender: false }, w + 0.3);
        tl.fromTo(k, { color: "#c6ff34" }, { color: "#22084a", duration: 0.28, ease: "power2.inOut", immediateRender: false }, w + 0.4);
      });
      prev = rec;
      tracked.push(rec);
    });
  }

  function track() {
    tracked.forEach((k) => {
      const p = k.p;
      const A = p.fixed ? null : frameNow(p.ui);
      let x;
      let y;
      if (p.fixed) {
        x = p.fixed.x;
        y = p.fixed.y;
      } else {
        x = Math.max(BW, Math.min(W - BW - p.size.w, A.x + p.dx));
        y = Math.max(BW, Math.min(H - BW - p.size.h, A.y + p.dy));
        if (x < 330 && y < 124) y = 124;
      }
      k.own = { x: x, y: y };
      k.A = A;
    });
    tracked.forEach((k) => {
      const b = k.blend.v;
      k.pos = k.from && b < 1 ? { x: k.from.own.x + (k.own.x - k.from.own.x) * b, y: k.from.own.y + (k.own.y - k.from.own.y) * b } : k.own;
    });
    tracked.forEach((k) => {
      const at = k.next && k.next.blend.v > 0 ? k.next.pos : k.pos;
      gsap.set(k.card, { x: at.x, y: at.y });
      const A = k.A;
      const seen = A && A.x > 10 && A.x < W - 10 && A.y > 10 && A.y < H - 10;
      if (!seen) {
        k.dot.style.opacity = 0;
        k.line.style.opacity = 0;
        return;
      }
      const ex = Math.max(at.x, Math.min(at.x + k.p.size.w, A.x));
      const ey = Math.max(at.y, Math.min(at.y + k.p.size.h, A.y));
      const len = Math.sqrt((ex - A.x) * (ex - A.x) + (ey - A.y) * (ey - A.y));
      const show = Math.max(0, Math.min(1, ((cfg.lineMax || 190) - len) / 50));
      k.dot.style.opacity = show;
      k.line.style.opacity = show;
      gsap.set(k.dot, { x: A.x, y: A.y });
      k.line.style.width = len + "px";
      gsap.set(k.line, { x: A.x, y: A.y, rotation: (Math.atan2(ey - A.y, ex - A.x) * 180) / Math.PI });
    });
  }

  function flash(t, lines, o) {
    const opt = o || {};
    const dur = opt.dur || 1.7;
    const from = toFrame(curPos || { x: G.uw / 2, y: FULL_H / 2 });
    const el = document.createElement("div");
    el.className = "vmk-flash";
    el.innerHTML =
      '<div class="vmk-flash-fill"><h2>' +
      lines
        .map((line, i) => '<span class="l"><span class="w' + (i === lines.length - 1 ? " k" : "") + '">' + line + "</span></span>")
        .join("") +
      "</h2></div>";
    hud.appendChild(free(el));
    const fill = one(".vmk-flash-fill", el);
    const words = all(".w", el);
    const spot = from.x + "px " + from.y + "px";
    gsap.set(el, { visibility: "hidden" });
    gsap.set(fill, { clipPath: "circle(0px at " + spot + ")" });
    words.forEach((w) => gsap.set(w, { yPercent: 115 }));
    const cover = t + 0.5;
    const out = t + dur;
    add(() => {
      tl.set(el, { visibility: "visible" }, t);
      tl.fromTo(fill, { clipPath: "circle(0px at " + spot + ")" }, { clipPath: "circle(2400px at " + spot + ")", duration: 0.62, ease: "power3.in", immediateRender: false }, t);
      words.forEach((w, i) => {
        tl.fromTo(w, { yPercent: 115 }, { yPercent: 0, duration: 0.55, ease: "expo.out", immediateRender: false }, t + 0.42 + i * 0.1);
        tl.to(w, { yPercent: -115, duration: 0.34, ease: "power3.in" }, out - 0.34 + i * 0.05);
      });
      tl.fromTo(el, { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.55, ease: "power3.inOut", immediateRender: false }, out);
      tl.set(el, { visibility: "hidden" }, out + 0.56);
    });
    return { cover: cover, out: out, end: out + 0.5 };
  }

  function drag(t, label, from, to, o) {
    const opt = o || {};
    const a = pt(from);
    const b = pt(to);
    const reach = opt.reach == null ? 0.5 : opt.reach;
    const dur = opt.dur || 0.95;
    const OFF = { x: 26, y: 30 };
    const el = document.createElement("div");
    el.className = "vmk-file";
    el.innerHTML = "<b>CSV</b>";
    el.appendChild(document.createTextNode(label));
    overlay.insertBefore(free(el), cursor);
    const ring = document.createElement("div");
    ring.className = "vmk-ring";
    overlay.insertBefore(ring, cursor);
    gsap.set(ring, { x: b.x, y: b.y, scale: 0.2 });
    const grab = t + reach + 0.1;
    const move = grab + 0.3;
    const drop = move + dur + 0.08;
    curPos = b;
    audit("point", drop, to);
    add(() => {
      tl.to(cursor, { x: a.x - HOT.x, y: a.y - HOT.y, duration: reach, ease: "power2.inOut" }, t);
      tl.to(cursor, { scale: 0.84, duration: 0.1, ease: "power2.in", transformOrigin: ORIGIN }, grab);
      tl.fromTo(
        el,
        { x: a.x + OFF.x, y: a.y + OFF.y, scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.24, ease: "power3.out", immediateRender: false, transformOrigin: "0% 0%" },
        grab + 0.04
      );
      tl.to(cursor, { x: b.x - HOT.x, y: b.y - HOT.y, duration: dur, ease: "power2.inOut" }, move);
      tl.to(el, { x: b.x + OFF.x, y: b.y + OFF.y, duration: dur, ease: "power2.inOut" }, move);
      tl.to(cursor, { scale: 1, duration: 0.22, ease: "power2.out", transformOrigin: ORIGIN }, drop);
      tl.to(el, { x: b.x - 60, y: b.y - 18, scale: 0.72, opacity: 0, duration: 0.26, ease: "power2.in", transformOrigin: "0% 0%" }, drop);
      tl.fromTo(ring, { scale: 0.2, opacity: 0.9 }, { scale: 1.5, opacity: 0, duration: 0.55, ease: "power2.out", immediateRender: false }, drop + 0.04);
    });
    return drop;
  }

  function busy(t, btn, label) {
    const keep = document.createElement("span");
    while (btn.firstChild) keep.appendChild(btn.firstChild);
    const wait = document.createElement("div");
    wait.className = "flex items-center gap-2";
    wait.style.display = "none";
    wait.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>';
    wait.appendChild(document.createTextNode(label));
    btn.appendChild(keep);
    btn.appendChild(wait);
    const spin = wait.firstChild;
    add(() => {
      tl.set(keep, { display: "none" }, t);
      tl.set(wait, { display: "flex" }, t);
      tl.set(btn, { opacity: 0.6 }, t);
      tl.fromTo(spin, { rotation: 0 }, { rotation: 1440, duration: 4, ease: "none", immediateRender: false }, t);
    });
  }

  function scan(t, target, o) {
    const opt = o || {};
    const r = target instanceof Element ? rect(target) : target;
    const pad = opt.pad == null ? 12 : opt.pad;
    const dur = opt.dur || 1.9;
    const passes = opt.passes || 3;
    const h = r.h + pad * 2;
    const box = document.createElement("div");
    box.className = "vmk-scan";
    box.innerHTML = "<i></i><i></i><i></i><i></i><b></b>";
    overlay.insertBefore(free(box), cursor);
    gsap.set(box, { x: r.x - pad, y: r.y - pad, width: r.w + pad * 2, height: h });
    const corners = all("i", box);
    const line = one("b", box);
    const lock = t + 0.3 + dur;
    audit("mark", t + 0.4, target, { mark: box, pad: pad });
    add(() => {
      tl.fromTo(box, { opacity: 0, scale: 1.14 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, t);
      tl.fromTo(line, { y: 0, opacity: 1 }, { y: h - 4, duration: dur / passes, ease: "sine.inOut", yoyo: true, repeat: passes - 1, immediateRender: false }, t + 0.3);
      tl.to(line, { opacity: 0, duration: 0.12, ease: "none" }, lock);
      tl.to(corners, { borderColor: "#16a34a", duration: 0.12, ease: "none" }, lock);
      tl.to(box, { scale: 0.94, duration: 0.12, ease: "power2.in", transformOrigin: "50% 50%" }, lock);
      tl.to(box, { scale: 1, duration: 0.3, ease: "power3.out", transformOrigin: "50% 50%" }, lock + 0.12);
      tl.to(box, { opacity: 0, duration: 0.3, ease: "power2.in" }, lock + (opt.hold == null ? 0.9 : opt.hold));
    });
    return lock;
  }

  function phone(t, qr, o) {
    const opt = o || {};
    const r = rect(qr);
    const c = toFrame({ x: r.cx, y: r.cy });
    const zoom = camState.wide ? G.k : camState.zoom;
    const PW = 380;
    const PH = 780;
    const x = Math.min(W - PW - 40, c.x + (r.w / 2) * zoom + (opt.gap == null ? 70 : opt.gap));
    const y = Math.max(120, Math.min(H - PH - 60, c.y - PH / 2 + (opt.dy || 40)));
    const dur = opt.dur || 1.9;
    const row = (k, v) => "<dt>" + k + "</dt><dd>" + v + "</dd>";
    const el = document.createElement("div");
    el.className = "vmk-phone";
    el.innerHTML =
      '<div class="vmk-phone-body"><u></u><div class="vmk-phone-screen">' +
      '<div class="vmk-ps vmk-ps-scan"><h5>Pagar com Pix</h5><p>Aponte a câmera para o QR Code</p><div class="vmk-ps-view"><img alt=""><i></i><i></i><i></i><i></i><b></b></div><em>Lendo QR Code</em></div>' +
      '<div class="vmk-ps vmk-ps-pay"><s></s><h5>Confirmar Pix</h5><strong></strong><dl>' +
      row("Para", opt.to) +
      row("Descrição", opt.about) +
      row("Quando", "Agora") +
      '</dl><span class="vmk-ps-btn"><span>Confirmar pagamento</span><a></a></span><q></q></div>' +
      '<div class="vmk-ps vmk-ps-done"><svg viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="52" fill="#16a34a"/><path d="M38 62l15 15 30-33" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg><h5>Pix enviado</h5><strong></strong><div class="vmk-ps-slip"><h6>Comprovante</h6><dl>' +
      row("Para", opt.to) +
      row("Descrição", opt.about) +
      row("Data", opt.when || "29/09/2026, 12:06") +
      row("ID", opt.code || "E1823…6A1B2") +
      "</dl></div></div></div></div>";
    hud.appendChild(free(el));
    all("strong", el).forEach((n) => {
      n.textContent = opt.amount;
    });
    one("img", el).src = qr.tagName.toLowerCase() === "img" ? qr.getAttribute("src") : "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(qr));
    const body = one(".vmk-phone-body", el);
    const finder = one(".vmk-ps-view", el);
    const img = one("img", el);
    const line = one("b", finder);
    const corners = all("i", finder);
    const pay = one(".vmk-ps-pay", el);
    const done = one(".vmk-ps-done", el);
    const btn = one(".vmk-ps-btn", el);
    const label = one(".vmk-ps-btn span", el);
    const spin = one(".vmk-ps-btn a", el);
    const tap = one("q", el);
    const check = one("path", done);
    const disc = one("svg", done);
    const slip = one(".vmk-ps-slip", el);
    const parts = [one("h5", done), one("strong", done)];
    const rows = all("dt, dd", slip);
    gsap.set(el, { x: x, y: y, opacity: 0 });
    gsap.set(pay, { y: PH });
    gsap.set(done, { opacity: 0 });
    gsap.set(tap, { opacity: 0 });
    gsap.set(spin, { opacity: 0 });
    gsap.set(check, { strokeDasharray: 70, strokeDashoffset: 70 });
    gsap.set(slip, { opacity: 0 });
    parts.concat(rows).forEach((n) => gsap.set(n, { opacity: 0 }));
    const read = t + 0.55;
    const lock = scan(read, qr, { dur: dur, pad: opt.pad, hold: 0.8 });
    const sheet = lock + 0.45;
    const press = sheet + 1.15;
    const sent = press + 0.95;
    const receipt = sent + 0.75;
    const settled = receipt + 0.9;
    const pf = { a: t };
    [
      [x, y],
      [x + PW, y],
      [x, y + PH],
      [x + PW, y + PH],
      [x + PW / 2, y + PH / 2],
      [x, y + PH / 2],
    ].forEach((q) => focus.push({ a: pf.a, b: settled + 6, x: q[0], y: q[1], of: -1 }));
    add(() => {
      tl.set(el, { opacity: 1 }, t);
      tl.fromTo(body, { y: H, rotation: 14 }, { y: 0, rotation: 3, duration: 0.8, ease: "power3.out", immediateRender: false, transformOrigin: "50% 100%" }, t);
      tl.fromTo(img, { scale: 1.5, opacity: 0.5 }, { scale: 1, opacity: 1, duration: 0.7, ease: "power2.out", immediateRender: false, transformOrigin: "50% 50%" }, read - 0.1);
      tl.fromTo(line, { y: 0, opacity: 1 }, { y: 236, duration: dur / 3, ease: "sine.inOut", yoyo: true, repeat: 2, immediateRender: false }, read + 0.3);
      tl.to(line, { opacity: 0, duration: 0.12, ease: "none" }, lock);
      tl.to(corners, { borderColor: "#4ade80", duration: 0.12, ease: "none" }, lock);
      tl.to(finder, { scale: 0.95, duration: 0.12, ease: "power2.in", transformOrigin: "50% 50%" }, lock);
      tl.to(finder, { scale: 1, duration: 0.3, ease: "power3.out", transformOrigin: "50% 50%" }, lock + 0.12);
      tl.to(pay, { y: 0, duration: 0.5, ease: "power3.out" }, sheet);
      tl.fromTo(tap, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, press - 0.4);
      tl.to(tap, { scale: 0.8, duration: 0.1, ease: "power2.in", transformOrigin: "50% 50%" }, press);
      tl.to(btn, { scale: 0.96, duration: 0.1, ease: "power2.in", transformOrigin: "50% 50%" }, press);
      tl.to(btn, { scale: 1, duration: 0.24, ease: "power3.out", transformOrigin: "50% 50%" }, press + 0.1);
      tl.to(tap, { opacity: 0, scale: 1.5, duration: 0.3, ease: "power2.out", transformOrigin: "50% 50%" }, press + 0.1);
      tl.to(label, { opacity: 0, duration: 0.12, ease: "none" }, press + 0.12);
      tl.to(spin, { opacity: 1, duration: 0.12, ease: "none" }, press + 0.2);
      tl.fromTo(spin, { rotation: 0 }, { rotation: 540, duration: 0.8, ease: "none", immediateRender: false }, press + 0.2);
      tl.to(done, { opacity: 1, duration: 0.25, ease: "power2.out" }, sent);
      tl.fromTo(disc, { scale: 0.3 }, { scale: 1, duration: 0.45, ease: "expo.out", immediateRender: false, transformOrigin: "50% 50%" }, sent);
      tl.to(check, { strokeDashoffset: 0, duration: 0.32, ease: "power2.out" }, sent + 0.2);
      parts.forEach((n, i) => {
        tl.fromTo(n, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out", immediateRender: false }, sent + 0.3 + i * 0.08);
      });
      tl.fromTo(slip, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out", immediateRender: false }, receipt);
      rows.forEach((n, i) => {
        tl.fromTo(n, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.24, ease: "power3.out", immediateRender: false }, receipt + 0.2 + Math.floor(i / 2) * 0.09);
      });
    });
    return {
      lock: lock,
      sheet: sheet,
      press: press,
      sent: sent,
      receipt: receipt,
      settled: settled,
      dock: (at, fx, fy) => {
        add(() => {
          tl.to(el, { x: fx, y: fy, duration: 0.8, ease: "power3.inOut" }, at);
          tl.to(body, { rotation: -3, scale: 0.9, duration: 0.8, ease: "power3.inOut", transformOrigin: "50% 50%" }, at);
        });
        [
          [fx, fy],
          [fx + PW, fy + PH],
          [fx, fy + PH],
          [fx + PW / 2, fy + PH / 2],
        ].forEach((q) => focus.push({ a: at, b: at + 8, x: q[0], y: q[1], of: -1 }));
      },
      out: (at) => {
        add(() => {
          tl.to(body, { y: H, rotation: 12, duration: 0.6, ease: "power3.in" }, at);
          tl.set(el, { opacity: 0 }, at + 0.6);
        });
        return at + 0.6;
      },
    };
  }

  function verify(t, card, o) {
    const opt = o || {};
    const r = card instanceof Element ? rect(card) : card;
    const steps = opt.steps || ["Aguardando o banco", "PIX recebido", "Ativando a assinatura"];
    const el = document.createElement("div");
    el.className = "vmk-verify";
    el.innerHTML =
      '<div class="vmk-verify-ring"><svg viewBox="0 0 120 120" fill="none"><circle class="bg" cx="60" cy="60" r="52"/><circle class="ok" cx="60" cy="60" r="52"/><circle class="fg" cx="60" cy="60" r="52" transform="rotate(-90 60 60)"/><path d="M38 62l15 15 30-33"/></svg></div>' +
      '<div class="vmk-verify-title"><span>' + (opt.wait || "Verificando pagamento...") + "</span><span>" +
      (opt.title || "Pagamento confirmado!") +
      '</span></div><div class="vmk-verify-step">' +
      steps.map((x) => "<span>" + x + "</span>").join("") +
      "<span>" +
      (opt.sub || "Sua assinatura está ativa.") +
      "</span></div>";
    overlay.insertBefore(free(el), cursor);
    gsap.set(el, { x: r.x, y: r.y, width: r.w, height: r.h, opacity: 0 });
    const LEN = 326.73;
    const ring = one(".vmk-verify-ring", el);
    const fg = one(".fg", el);
    const ok = one(".ok", el);
    const check = one("path", el);
    const titles = all(".vmk-verify-title span", el);
    const lines = all(".vmk-verify-step span", el);
    gsap.set(fg, { strokeDasharray: LEN, strokeDashoffset: LEN });
    gsap.set(check, { strokeDasharray: 70, strokeDashoffset: 70 });
    gsap.set(ok, { opacity: 0, scale: 0.6, transformOrigin: "50% 50%" });
    gsap.set(titles[1], { opacity: 0 });
    lines.forEach((n) => gsap.set(n, { opacity: 0 }));
    const each = opt.each || 0.8;
    const start = t + 0.3;
    const done = start + steps.length * each + 0.1;
    audit("mark", t + 0.4, card, { mark: el, pad: 0 });
    attend(t, { x: r.x, y: r.y, w: r.w, h: r.h, cx: r.cx, cy: r.cy }, done + 2);
    const swap = (from, to, at) => {
      if (from) {
        tl.to(from, { y: -14, duration: 0.18, ease: "power3.in" }, at - 0.18);
        tl.to(from, { opacity: 0, duration: 0.14, ease: "none" }, at - 0.16);
      }
      tl.fromTo(to, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power4.out", immediateRender: false }, at);
    };
    add(() => {
      tl.to(el, { opacity: 1, duration: 0.26, ease: "power2.out" }, t);
      tl.fromTo(ring, { scale: 0.7 }, { scale: 1, duration: 0.4, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, t);
      steps.forEach((x, i) => {
        const at = start + i * each;
        swap(i ? lines[i - 1] : null, lines[i], at);
        tl.to(fg, { strokeDashoffset: LEN * (1 - (i + 1) / steps.length), duration: each - 0.12, ease: "power2.inOut" }, at);
      });
      tl.to(ring, { scale: 0.9, duration: 0.12, ease: "power2.in", transformOrigin: "50% 50%" }, done);
      tl.to(ring, { scale: 1, duration: 0.45, ease: "expo.out", transformOrigin: "50% 50%" }, done + 0.12);
      tl.to(ok, { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" }, done + 0.1);
      tl.to(fg, { opacity: 0, duration: 0.2, ease: "none" }, done + 0.1);
      tl.to(check, { strokeDashoffset: 0, duration: 0.34, ease: "power2.out" }, done + 0.24);
      swap(titles[0], titles[1], done + 0.2);
      swap(lines[steps.length - 1], lines[steps.length], done + 0.3);
    });
    return {
      done: done,
      burst: done + 0.26,
      at: { x: r.cx, y: r.y + r.h * 0.36 },
      hide: (at) => add(() => tl.to(el, { opacity: 0, scale: 0.96, duration: 0.3, ease: "power2.in", transformOrigin: "50% 50%" }, at)),
    };
  }

  function confetti(t, at, o) {
    const opt = o || {};
    const p = opt.frame ? at : toFrame(pt(at));
    const n = opt.count || 80;
    const spread = opt.spread == null ? Math.PI * 1.5 : opt.spread;
    const aim = opt.aim == null ? -Math.PI / 2 : opt.aim;
    const power = opt.power || 1;
    const colors = ["#7E3BED", "#C6FF34", "#22084A", "#B98CFF", "#16A34A", "#FFFFFF"];
    let seed = opt.seed || 11;
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const box = document.createElement("div");
    box.className = "vmk-confetti";
    hud.appendChild(box);
    const parts = [];
    for (let i = 0; i < n; i++) {
      const el = document.createElement("i");
      const kind = i % 3;
      const size = 10 + rnd() * 12;
      el.style.width = (kind === 2 ? size * 0.45 : size) + "px";
      el.style.height = (kind === 0 ? size : kind === 1 ? size * 0.6 : size * 1.7) + "px";
      el.style.borderRadius = kind === 0 ? "50%" : "3px";
      el.style.background = colors[i % colors.length];
      box.appendChild(el);
      const angle = aim + (rnd() - 0.5) * spread;
      const speed = (240 + rnd() * 560) * power;
      parts.push({
        el: el,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        fall: 620 + rnd() * 520,
        drift: (rnd() - 0.5) * 220,
        rot: (rnd() - 0.5) * 1260,
        flip: 540 + rnd() * 900,
        up: 0.45 + rnd() * 0.3,
        down: 1.15 + rnd() * 0.7,
        delay: rnd() * 0.14,
      });
      gsap.set(el, { x: p.x, y: p.y, opacity: 0 });
    }
    free(box);
    add(() => {
      parts.forEach((q) => {
        const s = t + q.delay;
        tl.set(q.el, { opacity: 1 }, s);
        tl.fromTo(
          q.el,
          { x: p.x, y: p.y, scale: 0.3, rotation: 0 },
          { x: p.x + q.dx, y: p.y + q.dy, scale: 1, rotation: q.rot * 0.4, duration: q.up, ease: "power3.out", immediateRender: false },
          s
        );
        tl.to(q.el, { x: p.x + q.dx + q.drift, y: p.y + q.dy + q.fall, rotation: q.rot, duration: q.down, ease: "power1.in" }, s + q.up);
        tl.fromTo(q.el, { rotationX: 0 }, { rotationX: q.flip, duration: q.up + q.down, ease: "none", immediateRender: false }, s);
        tl.to(q.el, { opacity: 0, duration: 0.3, ease: "none" }, s + q.up + q.down - 0.3);
      });
    });
    return t + 2.2;
  }

  function note(name, t) {
    if (window.__vmNotes) window.__vmNotes[name] = +t.toFixed(2);
  }

  function done() {
    runReveals();
    spotlights();
    queue.forEach((fn) => fn(tl));
    settle();
    layCaptions();
    if (HOLD) tl.shiftChildren(HOLD, false, HOLD_FROM);
    tl.timeScale(cfg.speed || 1);
    master.add(tl, 0);
    master.eventCallback("onUpdate", () => {
      for (const name in states) {
        const scr = scrollers[name];
        if (scr && Math.abs(scr.scrollTop - want[name]) > 0.5) scr.scrollTop = want[name];
      }
      track();
    });
    track();
    window.__timelines[cfg.id] = master;
    if (window.__vmProbe) {
      window.__vmProbe[cfg.id] = {
        rects: rectLog,
        audits: audits,
        hot: HOT,
        cursor: cursor,
        live: live,
        at: (t) => (t >= HOLD_FROM ? t + HOLD : t) / (cfg.speed || 1),
      };
    }
  }

  return {
    tl,
    add,
    one,
    all,
    state,
    find,
    pick,
    rect,
    pt,
    show,
    url,
    cam,
    camOn,
    view,
    cursorEnter,
    cursorTo,
    cursorAside,
    cursorExit,
    click,
    go,
    type,
    flip,
    setText,
    count,
    scroll,
    dialogIn,
    popIn,
    toastIn,
    rows,
    mark,
    boot,
    nav,
    slide,
    layer,
    layerIn,
    layerOut,
    status,
    scrollers,
    drag,
    busy,
    scan,
    phone,
    verify,
    confetti,
    toFrame,
    flash,
    reveal,
    tick,
    attend,
    introIn,
    introOut,
    dive,
    caption,
    captionOut,
    capTo,
    focusRing,
    done,
    note,
    G,
    FULL_H,
  };
}
