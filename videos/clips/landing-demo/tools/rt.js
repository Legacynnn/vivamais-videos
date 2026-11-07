(function () {
  const W = 390;
  const H = 840;
  const $ = (s) => (typeof s === "string" ? document.querySelector(s) : s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  function pct(el) {
    const r = $(el).getBoundingClientRect();
    const f = (v) => +v.toFixed(2);
    return { x: f((r.left / W) * 100), y: f((r.top / H) * 100), w: f((r.width / W) * 100), h: f((r.height / H) * 100) };
  }

  window.RT = { W, H, $, $$, pct };
})();
