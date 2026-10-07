export function anSwap(S, heads, hubs) {
  var out = {};
  var put = function (name, box, kind, size) {
    box.innerHTML = illSvg(kind);
    var sv = box.querySelector("svg");
    if (size) {
      sv.style.width = size + "px";
      sv.style.height = size + "px";
      sv.style.margin = "auto";
    }
    box.style.background = "transparent";
    box.style.overflow = "visible";
    (out[name] = out[name] || []).push(box.querySelector("svg"));
  };
  var geo = function (st) {
    var r = st.getBoundingClientRect();
    return { r: r, k: r.width / 402 };
  };
  Object.keys(heads).forEach(function (name) {
    var st = S.state(name);
    var g = geo(st);
    var svg = S.all("svg", st).filter(function (e) {
      var b = e.getBoundingClientRect();
      var w = b.width / g.k;
      return w >= 36 && w <= 72 && (b.top - g.r.top) / g.k < 140 && Math.abs(b.left + b.width / 2 - (g.r.left + g.r.width / 2)) / g.k < 40;
    })[0];
    if (!svg) return;
    var box = svg;
    while (box.parentElement && box.parentElement.getBoundingClientRect().width / g.k <= 80) box = box.parentElement;
    put(name, box, heads[name], Math.round(Math.max(svg.getBoundingClientRect().width, svg.getBoundingClientRect().height) / g.k) + 4);
  });
  (hubs || []).forEach(function (h) {
    var st = S.state(h[0]);
    var g = geo(st);
    var lab = S.all("div", st).filter(function (e) {
      return e.children.length === 0 && h[1].test((e.textContent || "").replace(/\s+/g, " ").trim());
    })[0];
    if (!lab) return;
    var tile = lab;
    var svg = null;
    while (!svg && tile.parentElement) {
      tile = tile.parentElement;
      svg = S.all("svg", tile).filter(function (e) {
        return e.getBoundingClientRect().width / g.k > 40;
      })[0];
    }
    if (!svg) return;
    var box = svg;
    while (box.parentElement && box.parentElement !== tile && box.parentElement.getBoundingClientRect().width / g.k <= 110) box = box.parentElement;
    var sz = Math.round(Math.max(svg.getBoundingClientRect().width, svg.getBoundingClientRect().height) / g.k);
    put(h[0], box, h[2], Math.min(Math.max(sz, 64), 72));
  });
  S.all("img", document).forEach(function (img) {
    var src = img.getAttribute("src") || "";
    var st = img.closest("[data-state]");
    if (!st || !/\.webp$/.test(src)) return;
    var sn = st.getAttribute("data-state");
    var kind = /anexos/.test(sn) ? "pasta" : /enviada/.test(sn) ? "enviada" : null;
    if (!kind) return;
    var box = img.parentElement;
    box.innerHTML = illSvg(kind);
    box.style.background = "transparent";
    box.style.overflow = "visible";
    if (st) (out[st.getAttribute("data-state")] = out[st.getAttribute("data-state")] || []).push(box.querySelector("svg"));
  });
  return out;
}

export function anPlay(S, A, name, at) {
  var list = A[name] || [];
  if (!list.length) return;
  S.add(function (tl) {
    list.forEach(function (svg, i) {
      tl.set(svg, { opacity: 0 }, 0);
      tl.set(svg, { opacity: 1 }, at + i * 0.15);
      illIn(tl, svg, at + i * 0.15);
    });
  });
}
