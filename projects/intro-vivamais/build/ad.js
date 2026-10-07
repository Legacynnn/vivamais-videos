function AD(S, VO) {
  var root = S.one(".vmk-hud") ? S.one(".vmk-hud").closest("[data-composition-id]") : document;
  var q = function (sel, scope) {
    return Array.prototype.slice.call((scope || root).querySelectorAll(sel));
  };
  var line = function (key) {
    var el = typeof key === "string" ? root.querySelector('[data-ad="' + key + '"]') : key;
    if (!el) throw new Error("ad line " + key);
    return el;
  };
  var norm = function (s) {
    return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
  };
  q(".ad").forEach(function (el) {
    gsap.set(el, { opacity: 0 });
  });

  function w(n) {
    if (!VO) return 0;
    var list = VO.words;
    if (typeof n === "number") return VO.at + list[Math.min(n, list.length - 1)][0];
    var want = norm(n);
    var nth = 0;
    var m = String(n).match(/#(\d+)$/);
    if (m) {
      nth = +m[1];
      want = norm(String(n).replace(/#\d+$/, ""));
    }
    for (var i = 0; i < list.length; i++) {
      if (norm(list[i][2]) === want) {
        if (nth === 0) return VO.at + list[i][0];
        nth--;
      }
    }
    throw new Error("vo word " + n);
  }
  function we(n) {
    var t = w(n);
    var list = VO.words;
    for (var i = 0; i < list.length; i++) if (Math.abs(VO.at + list[i][0] - t) < 1e-6) return VO.at + list[i][1];
    return t + 0.3;
  }
  var end = VO ? VO.at + VO.dur : 0;

  function words(el) {
    return q(".aw", el);
  }

  function rise(t, key, o) {
    var opt = o || {};
    var el = line(key);
    var ws = words(el);
    var st = opt.stagger == null ? 0.07 : opt.stagger;
    S.add(function (tl) {
      tl.set(el, { opacity: 1 }, t);
      ws.forEach(function (x, i) {
        tl.fromTo(x, { yPercent: 118, rotation: opt.tilt || 0 }, { yPercent: 0, rotation: 0, duration: opt.dur || 0.62, ease: "power3.out", immediateRender: false }, t + i * st);
      });
      if (opt.sweep !== false) q("u", el).forEach(function (u) {
        tl.fromTo(u, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power3.inOut", immediateRender: false, transformOrigin: "0% 50%" }, t + ws.length * st + 0.1);
      });
    });
    q("u", el).forEach(function (u) {
      gsap.set(u, { scaleX: 0 });
    });
    ws.forEach(function (x) {
      gsap.set(x, { yPercent: 118 });
    });
    return t + ws.length * st + 0.6;
  }

  function sync(key, o) {
    var opt = o || {};
    var el = line(key);
    var ws = words(el);
    ws.forEach(function (x) {
      gsap.set(x, { yPercent: 118 });
    });
    var from = opt.from || 0;
    S.add(function (tl) {
      tl.set(el, { opacity: 1 }, w(from) - 0.08);
      ws.forEach(function (x, i) {
        tl.fromTo(x, { yPercent: 118 }, { yPercent: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, w(from + i) - 0.08);
      });
    });
  }

  function slam(t, key, o) {
    var opt = o || {};
    var el = line(key);
    S.add(function (tl) {
      tl.fromTo(el, { opacity: 0, scale: Math.min(opt.from || 1.18, 1.18), filter: "blur(" + (opt.blur == null ? 6 : opt.blur) + "px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: opt.dur || 0.7, ease: "power3.out", immediateRender: false, transformOrigin: opt.origin || "50% 50%" }, t);
    });
    return t + 0.5;
  }

  function pop(t, key, o) {
    var opt = o || {};
    var el = line(key);
    S.add(function (tl) {
      tl.fromTo(el, { opacity: 0, y: opt.y == null ? 26 : opt.y, scale: opt.from || 0.94 }, { opacity: 1, y: 0, scale: 1, duration: opt.dur || 0.45, ease: "power3.out", immediateRender: false, transformOrigin: opt.origin || "0% 50%" }, t);
    });
    return t + 0.45;
  }

  function out(t, key, o) {
    var opt = o || {};
    var el = line(key);
    var ws = words(el);
    var dir = opt.dir || "up";
    S.add(function (tl) {
      if (dir === "up" && ws.length) {
        ws.forEach(function (x, i) {
          tl.to(x, { yPercent: -118, duration: 0.4, ease: "power3.in" }, t + i * 0.03);
        });
        tl.set(el, { opacity: 0 }, t + 0.45 + ws.length * 0.03);
      } else if (dir === "blur") {
        tl.to(el, { opacity: 0, scale: 0.9, filter: "blur(12px)", duration: 0.35, ease: "power2.in" }, t);
      } else {
        var dx = dir === "left" ? -520 : dir === "right" ? 520 : 0;
        var dy = dir === "down" ? 200 : 0;
        tl.to(el, { x: dx, y: dy, opacity: 0, duration: 0.42, ease: "power3.in" }, t);
      }
    });
    return t + 0.45;
  }

  function count(t, el, from, to, fmt, dur) {
    var node = typeof el === "string" ? line(el).querySelector("[data-n]") || line(el) : el;
    var o = { v: from };
    node.textContent = fmt(from);
    S.add(function (tl) {
      tl.fromTo(
        o,
        { v: from },
        {
          v: to,
          duration: dur || 1,
          ease: "power2.out",
          immediateRender: false,
          onUpdate: function () {
            node.textContent = fmt(o.v);
          },
        },
        t
      );
    });
  }

  function sub(scope, from, to) {
    var el = typeof scope === "string" ? S.state(scope) : scope;
    var walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var n;
    var hits = 0;
    while ((n = walk.nextNode())) {
      if (n.nodeValue.indexOf(from) >= 0) {
        n.nodeValue = n.nodeValue.split(from).join(to);
        hits++;
      }
    }
    return hits;
  }

  function tw(fn) {
    S.add(fn);
  }

  return { w: w, we: we, end: end, line: line, rise: rise, sync: sync, slam: slam, pop: pop, out: out, count: count, sub: sub, tw: tw, q: q };
}
