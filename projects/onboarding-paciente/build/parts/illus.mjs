export function illSvg(k) {
  var D = "#22084a";
  var s = 'stroke="' + D + '" stroke-width="2.5" stroke-linejoin="round"';
  var bg = '<circle class="il-bg" cx="32" cy="32" r="30" fill="#ebe1fd"/>';
  var sp = function (x, y, r, c) {
    return '<path class="il-s" d="M' + x + " " + (y - r) + "l" + r * 0.28 + " " + r * 0.72 + "l" + r * 0.72 + " " + r * 0.28 + "l-" + r * 0.72 + " " + r * 0.28 + "l-" + r * 0.28 + " " + r * 0.72 + "l-" + r * 0.28 + " -" + r * 0.72 + "l-" + r * 0.72 + " -" + r * 0.28 + "l" + r * 0.72 + " -" + r * 0.28 + 'z" fill="' + c + '"/>';
  };
  var art = {
    consulta:
      bg +
      '<g class="il-a"><rect x="17" y="9" width="30" height="46" rx="7" fill="#fff" ' + s + '/><rect x="21" y="15" width="22" height="31" rx="4" fill="#b98cff"/>' +
      '<path d="M23.5 46c0-5.5 3.6-8.5 8.5-8.5s8.5 3 8.5 8.5z" fill="#fff" stroke="' + D + '" stroke-width="2"/>' +
      '<path d="M28.5 38.4v2.6a3.5 3.5 0 0 0 7 0v-2.6" fill="none" stroke="#7e3bed" stroke-width="1.8" stroke-linecap="round"/>' +
      '<circle cx="32" cy="28" r="5.6" fill="#ffd9c2" stroke="' + D + '" stroke-width="2"/><path d="M26.4 27.4c0-4.4 2.6-6.6 5.6-6.6s5.6 2.2 5.6 6.6c-1.8-1.6-3.6-2.4-5.6-2.4s-3.8.8-5.6 2.4z" fill="' + D + '"/>' +
      '<rect x="28" y="49.5" width="8" height="2.2" rx="1.1" fill="' + D + '"/></g>' +
      '<g class="il-b"><circle cx="49" cy="15" r="10" fill="#c6ff34" ' + s + '/><text x="49" y="19" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="11.5" fill="' + D + '">2x</text></g>',
    desconto:
      bg +
      '<g class="il-c"><ellipse cx="17" cy="51" rx="8.5" ry="3.6" fill="#c6ff34" stroke="' + D + '" stroke-width="2"/><ellipse cx="17" cy="46.5" rx="8.5" ry="3.6" fill="#c6ff34" stroke="' + D + '" stroke-width="2"/></g>' +
      '<g class="il-a"><g transform="rotate(-24 34 30)"><path d="M21 19h19l9 11-9 11H21a5 5 0 0 1-5-5V24a5 5 0 0 1 5-5z" fill="#7e3bed" ' + s + '/>' +
      '<circle cx="41.5" cy="30" r="2.6" fill="#fff" stroke="' + D + '" stroke-width="2"/>' +
      '<text x="29" y="36" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="16" fill="#c6ff34">%</text></g></g>' +
      '<g class="il-b">' + sp(51, 49, 6, "#7e3bed") + "</g>",
    ia:
      bg +
      '<g class="il-a"><path d="M13 13h30a6 6 0 0 1 6 6v15a6 6 0 0 1-6 6H25l-8 7v-7h-4a6 6 0 0 1-6-6V19a6 6 0 0 1 6-6z" fill="#7e3bed" ' + s + "/>" +
      sp(28, 26.5, 8, "#c6ff34") + sp(39, 20, 3.4, "#fff") + "</g>" +
      '<g class="il-b"><path d="M37 37h17a4.5 4.5 0 0 1 4.5 4.5v8a4.5 4.5 0 0 1-4.5 4.5h-2v5l-5.5-5H37a4.5 4.5 0 0 1-4.5-4.5v-8A4.5 4.5 0 0 1 37 37z" fill="#fff" ' + s + "/>" +
      '<circle class="il-d" cx="40.5" cy="45.5" r="1.9" fill="' + D + '"/><circle class="il-d" cx="45.5" cy="45.5" r="1.9" fill="' + D + '"/><circle class="il-d" cx="50.5" cy="45.5" r="1.9" fill="' + D + '"/></g>',
    analise:
      bg +
      '<g class="il-a"><path d="M16 8h21l11 11v33a5 5 0 0 1-5 5H16a5 5 0 0 1-5-5V13a5 5 0 0 1 5-5z" fill="#fff" ' + s + '/><path d="M37 8v11h11" fill="#ebe1fd" ' + s + "/>" +
      '<rect class="il-l" x="17" y="24" width="16" height="3.2" rx="1.6" fill="#b98cff"/><rect class="il-l" x="17" y="31" width="22" height="3.2" rx="1.6" fill="#b98cff"/><rect class="il-l" x="17" y="38" width="12" height="3.2" rx="1.6" fill="#b98cff"/></g>' +
      '<g class="il-b"><path d="M46.5 49.5l8 8" stroke="' + D + '" stroke-width="4" stroke-linecap="round"/><circle cx="40" cy="43" r="9.5" fill="#c6ff34" ' + s + "/>" + sp(40, 43, 4.6, "#7e3bed") + "</g>",
    farmacia:
      bg +
      '<g class="il-a"><g transform="rotate(-38 30 30)"><path d="M21 22h9v16h-9a8 8 0 0 1 0-16z" fill="#7e3bed"/><path d="M30 22h9a8 8 0 0 1 0 16h-9z" fill="#c6ff34"/>' +
      '<rect x="13" y="22" width="34" height="16" rx="8" fill="none" ' + s + '/><path d="M30 22v16" stroke="' + D + '" stroke-width="2"/><path d="M19 27h7" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".75"/></g></g>' +
      '<g class="il-b"><circle cx="47" cy="46" r="11" fill="#16a34a" ' + s + '/><path d="M47 40.5v11M41.5 46h11" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/></g>',
    motivo:
      bg +
      '<g class="il-a"><path d="M10 11h32a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H24l-8 7v-7h-6a6 6 0 0 1-6-6V17a6 6 0 0 1 6-6z" fill="#7e3bed" ' + s + "/>" +
      '<rect class="il-l" x="12" y="18" width="26" height="3.4" rx="1.7" fill="#fff"/><rect class="il-l" x="12" y="25" width="17" height="3.4" rx="1.7" fill="#fff"/></g>' +
      '<g class="il-b"><path d="M37 35h17a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5h-3v5l-5.5-5H37a5 5 0 0 1-5-5v-8a5 5 0 0 1 5-5z" fill="#c6ff34" ' + s + "/>" +
      '<path d="M45.5 49.5s-5-3-5-6.6a2.6 2.6 0 0 1 5-1.2 2.6 2.6 0 0 1 5 1.2c0 3.6-5 6.6-5 6.6z" fill="#7e3bed"/></g>',
    dor:
      bg +
      '<g class="il-a"><path d="M17 56V39a15 15 0 0 1 30 0v17z" fill="#fff" ' + s + '/><circle cx="32" cy="15" r="7.5" fill="#fff" ' + s + "/></g>" +
      '<circle class="il-r" cx="32" cy="40" r="7" stroke="#ff5c8a" stroke-width="2.4"/><circle class="il-r" cx="32" cy="40" r="7" stroke="#ff5c8a" stroke-width="2.4"/>' +
      '<g class="il-b"><circle cx="32" cy="40" r="4.6" fill="#ff5c8a" stroke="' + D + '" stroke-width="2"/></g>',
    tempo:
      bg +
      '<g class="il-a"><rect x="10" y="14" width="36" height="36" rx="7" fill="#fff" ' + s + '/><path d="M10 21a7 7 0 0 1 7-7h22a7 7 0 0 1 7 7v4H10z" fill="#7e3bed" ' + s + "/>" +
      '<rect x="17" y="9" width="3.4" height="9" rx="1.7" fill="' + D + '"/><rect x="35.6" y="9" width="3.4" height="9" rx="1.7" fill="' + D + '"/>' +
      '<g class="il-l"><rect x="16" y="31" width="5" height="5" rx="1.5" fill="#ddd0fb"/><rect x="25.5" y="31" width="5" height="5" rx="1.5" fill="#ddd0fb"/><rect x="35" y="31" width="5" height="5" rx="1.5" fill="#ddd0fb"/><rect x="16" y="40" width="5" height="5" rx="1.5" fill="#ddd0fb"/><rect x="25.5" y="40" width="5" height="5" rx="1.5" fill="#7e3bed"/></g></g>' +
      '<g class="il-b"><circle cx="47" cy="46" r="11" fill="#c6ff34" ' + s + '/><path d="M47 40v6.5l4 3" stroke="' + D + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></g>',
    contexto:
      bg +
      '<g class="il-a"><g transform="rotate(-8 25 33)"><rect x="9" y="14" width="32" height="38" rx="7" fill="#fff" ' + s + "/>" +
      '<circle cx="19" cy="25" r="4.4" fill="#b98cff" stroke="' + D + '" stroke-width="2"/><circle cx="31" cy="25" r="4.4" fill="#b98cff" stroke="' + D + '" stroke-width="2"/><circle cx="19" cy="40" r="4.4" fill="#b98cff" stroke="' + D + '" stroke-width="2"/><circle cx="31" cy="40" r="4.4" fill="#ebe1fd" stroke="' + D + '" stroke-width="2" stroke-dasharray="2 2"/></g></g>' +
      '<g class="il-b"><g transform="rotate(-38 46 45)"><path d="M40 39h6v12h-6a6 6 0 0 1 0-12z" fill="#7e3bed"/><path d="M46 39h6a6 6 0 0 1 0 12h-6z" fill="#c6ff34"/><rect x="34" y="39" width="24" height="12" rx="6" ' + s + "/></g></g>",
    anexos:
      bg +
      '<g class="il-a"><g transform="rotate(-7 28 33)"><rect x="11" y="13" width="34" height="40" rx="6" fill="#fff" ' + s + '/><rect x="15" y="17" width="26" height="22" rx="3" fill="#ebe1fd"/>' +
      '<path d="M15 36l8-9 6 6 4-4 8 8v2H15z" fill="#7e3bed"/><circle cx="34" cy="23" r="3" fill="#c6ff34" stroke="' + D + '" stroke-width="1.6"/><rect class="il-l" x="15" y="43" width="18" height="3.2" rx="1.6" fill="#b98cff"/></g></g>' +
      '<g class="il-b"><path d="M50 26v17a7 7 0 0 1-14 0V24a4.5 4.5 0 0 1 9 0v17a2 2 0 0 1-4 0V27" stroke="' + D + '" stroke-width="5.2" stroke-linecap="round"/><path d="M50 26v17a7 7 0 0 1-14 0V24a4.5 4.5 0 0 1 9 0v17a2 2 0 0 1-4 0V27" stroke="#c6ff34" stroke-width="2.4" stroke-linecap="round"/></g>',
    pasta:
      bg +
      '<g class="il-a"><path d="M7 22a4 4 0 0 1 4-4h11l4 4h27a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H11a4 4 0 0 1-4-4z" fill="#7e3bed" ' + s + "/></g>" +
      '<g class="il-p"><g transform="rotate(-10 25 24)"><rect x="15" y="9" width="20" height="26" rx="3" fill="#fff" ' + s + '/><rect x="19" y="15" width="12" height="2.6" rx="1.3" fill="#b98cff"/><rect x="19" y="20" width="9" height="2.6" rx="1.3" fill="#b98cff"/></g></g>' +
      '<g class="il-p"><g transform="rotate(9 38 22)"><rect x="28" y="7" width="20" height="26" rx="3" fill="#fff" ' + s + '/><rect x="32" y="13" width="12" height="2.6" rx="1.3" fill="#b98cff"/><rect x="32" y="18" width="8" height="2.6" rx="1.3" fill="#b98cff"/></g></g>' +
      '<g class="il-a"><path d="M7 31h50v19a4 4 0 0 1-4 4H11a4 4 0 0 1-4-4z" fill="#9a63f2" ' + s + "/></g>" +
      '<g class="il-b"><circle cx="52" cy="50" r="9" fill="#c6ff34" ' + s + '/><path d="M52 45.5v9M47.5 50h9" stroke="' + D + '" stroke-width="2.8" stroke-linecap="round"/></g>',
    enviada:
      bg +
      '<g class="il-a"><rect x="11" y="15" width="32" height="42" rx="6" fill="#7e3bed" ' + s + '/><rect x="15" y="21" width="24" height="31" rx="3.5" fill="#fff" stroke="' + D + '" stroke-width="2"/><rect x="19" y="11" width="16" height="8" rx="3" fill="#c6ff34" ' + s + "/>" +
      '<g class="il-l"><path d="M19 29l2 2 3.5-3.5" stroke="#16a34a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><rect x="27" y="28.4" width="9" height="2.6" rx="1.3" fill="#b98cff"/></g>' +
      '<g class="il-l"><path d="M19 37l2 2 3.5-3.5" stroke="#16a34a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><rect x="27" y="36.4" width="8" height="2.6" rx="1.3" fill="#b98cff"/></g>' +
      '<g class="il-l"><path d="M19 45l2 2 3.5-3.5" stroke="#16a34a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><rect x="27" y="44.4" width="10" height="2.6" rx="1.3" fill="#b98cff"/></g></g>' +
      '<g class="il-pl"><path d="M38 21l22-11-7 24-6.5-7.5z" fill="#fff" ' + s + '/><path d="M46.5 26.5L60 10" stroke="' + D + '" stroke-width="2"/></g>',
  };
  return '<svg class="il il-' + k + '" viewBox="0 0 64 64" fill="none">' + art[k] + "</svg>";
}

export function illIn(tl, svg, t, o) {
  var opt = o || {};
  var q = function (s) {
    return Array.prototype.slice.call(svg.querySelectorAll(s));
  };
  var k = (svg.getAttribute("class") || "").replace(/.*il-/, "");
  var f = { immediateRender: false };
  var bg = q(".il-bg");
  var a = q(".il-a");
  var b = q(".il-b");
  if (!opt.again) tl.fromTo(bg, { scale: 0, transformOrigin: "50% 50%" }, Object.assign({ scale: 1, duration: 0.45, ease: "back.out(2)" }, f), t);
  else tl.fromTo(bg, { scale: 1, transformOrigin: "50% 50%" }, Object.assign({ scale: 1.12, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 }, f), t);
  var t1 = t + (opt.again ? 0 : 0.1);
  if (!opt.again) {
    var pre = [[a, { opacity: 0 }], [b, { scale: 0 }], [q(".il-s"), { scale: 0.3 }], [q(".il-p"), { opacity: 0 }], [q(".il-r"), { opacity: 0 }], [q(".il-pl"), { opacity: 0 }], [q(".il-c ellipse"), { opacity: 0 }], [k === "analise" ? [] : q(".il-l"), { opacity: 0 }]];
    pre.forEach(function (x) {
      if (x[0].length) tl.set(x[0], x[1], t);
    });
  }
  if (k === "desconto") {
    tl.fromTo(a, { rotation: -55, y: -10, opacity: 0, transformOrigin: "80% 20%" }, Object.assign({ rotation: 0, y: 0, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.45)" }, f), t1);
    tl.fromTo(q(".il-c ellipse"), { y: -14, opacity: 0 }, Object.assign({ y: 0, opacity: 1, duration: 0.35, ease: "bounce.out", stagger: 0.1 }, f), t1 + 0.15);
  } else if (k === "farmacia") {
    tl.fromTo(a, { rotation: -200, scale: 0.4, opacity: 0, transformOrigin: "50% 50%" }, Object.assign({ rotation: 0, scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.6)" }, f), t1);
  } else if (k === "analise") {
    tl.fromTo(a, { y: 12, opacity: 0 }, Object.assign({ y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, f), t1);
    tl.fromTo(q(".il-l"), { scaleX: 0, transformOrigin: "0% 50%" }, Object.assign({ scaleX: 1, duration: 0.3, ease: "power2.out", stagger: 0.09 }, f), t1 + 0.2);
  } else {
    tl.fromTo(a, { y: 14, scale: 0.8, opacity: 0, transformOrigin: "50% 100%" }, Object.assign({ y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.8)" }, f), t1);
  }
  tl.fromTo(b, { scale: 0, rotation: -60, transformOrigin: "50% 50%" }, Object.assign({ scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2.4)" }, f), t1 + 0.3);
  var pp = q(".il-p");
  if (pp.length) tl.fromTo(pp, { y: 18, opacity: 0 }, Object.assign({ y: 0, opacity: 1, duration: 0.5, ease: "back.out(2)", stagger: 0.1 }, f), t1 + 0.15);
  var ll = k === "analise" ? [] : q(".il-l");
  if (ll.length) tl.fromTo(ll, { scaleX: 0, opacity: 0, transformOrigin: "0% 50%" }, Object.assign({ scaleX: 1, opacity: 1, duration: 0.3, ease: "power2.out", stagger: 0.1 }, f), t1 + 0.3);
  var rr = q(".il-r");
  if (rr.length) tl.fromTo(rr, { scale: 0.6, opacity: 1, transformOrigin: "50% 50%" }, Object.assign({ scale: 2.3, opacity: 0, duration: 1.0, ease: "power2.out", stagger: 0.35 }, f), t1 + 0.5);
  var pl = q(".il-pl");
  if (pl.length) tl.fromTo(pl, { x: -26, y: 22, rotation: -25, opacity: 0, transformOrigin: "50% 50%" }, Object.assign({ x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, f), t1 + 0.35);
  var s = q(".il-s");
  if (s.length) tl.fromTo(s, { rotation: -90, scale: 0.3, transformOrigin: "50% 50%" }, Object.assign({ rotation: 0, scale: 1, duration: 0.55, ease: "back.out(2.2)", stagger: 0.08 }, f), t1 + 0.35);
  var d = q(".il-d");
  if (d.length) tl.fromTo(d, { y: 0 }, Object.assign({ y: -3, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1, stagger: 0.09 }, f), t1 + 0.6);
  return t1 + 0.9;
}

export const ILL_CSS = `
.il{display:block;width:100%;height:100%;overflow:visible}
`;
