export function up(el, minH, test) {
  var n = el;
  while (n.parentElement && (n.getBoundingClientRect().height < minH || (test && !test(n)))) n = n.parentElement;
  return n;
}

export function inputs(S, name) {
  return S.all("input, textarea", S.state(name)).filter(function (el) {
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
}

export function hold(S, t) {
  S.add(function (tl) {
    tl.set({}, {}, t);
  });
}

export function typeIn(S, name, idx, t, text, label, o) {
  var el = inputs(S, name)[idx];
  var box = el;
  for (var i = 0; i < 4 && box.parentElement; i++) box = box.parentElement;
  var lab = S.all("div, span, label", box).filter(function (n) {
    return n.children.length === 0 && n.textContent.trim().replace(/\s+/g, " ").replace(/\s*\*$/, "") === label;
  });
  S.add(function (tl) {
    lab.forEach(function (n) {
      tl.to(n, { opacity: 0, duration: 0.2, ease: "power2.out" }, t);
    });
  });
  return S.type(t, el, text, o);
}
