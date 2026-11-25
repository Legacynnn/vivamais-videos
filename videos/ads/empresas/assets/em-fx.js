(function () {
  var ANG = [30, 90, 150, 210, 270, 330];
  var RAD = 64;
  function mk(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }
  function color(host, v) {
    var p = mk("div");
    p.style.backgroundColor = "var(" + v + ")";
    host.appendChild(p);
    var c = getComputedStyle(p).backgroundColor;
    p.remove();
    return c;
  }
  function prepare(chip) {
    if (chip.__emfx) return chip.__emfx;
    var tile = chip.querySelector(".em-check");
    var svg = tile.querySelector("svg");
    var path = tile.querySelector("path");
    var spans = chip.querySelectorAll(":scope > span:not(.em-check)");
    var label = spans[spans.length - 1];
    chip.classList.add("em-chip--fx");
    tile.classList.add("em-check--fx");
    var fill = mk("i", "em-fx-fill");
    tile.insertBefore(fill, tile.firstChild);
    var ring = mk("i", "em-fx-ring");
    tile.appendChild(ring);
    var sparks = ANG.map(function (a, i) {
      var s = mk("i", "em-fx-spark" + (i % 2 ? " em-fx-spark--b" : ""));
      tile.appendChild(s);
      return s;
    });
    var sweep = mk("i", "em-fx-sweep");
    var band = mk("b");
    sweep.appendChild(band);
    chip.insertBefore(sweep, chip.firstChild);
    chip.__emfx = {
      tile: tile, svg: svg, path: path, label: label, fill: fill, ring: ring, sparks: sparks, band: band,
      white: color(chip, "--em-white"), ink: color(chip, "--em-ink"), ink600: color(chip, "--vm-ink-600")
    };
    return chip.__emfx;
  }
  function check(tl, chip, t) {
    var f = prepare(chip);
    var w = chip.offsetWidth;
    gsap.set(f.tile, { scale: 0.85 });
    gsap.set(f.svg, { scale: 0.7 });
    gsap.set(f.band, { xPercent: -110 });
    gsap.set(f.label, { color: f.ink600, x: 8 });
    tl.fromTo(f.fill, { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 0.22, ease: "power2.out" }, t);
    tl.set(f.tile, { color: f.white }, t);
    tl.fromTo(f.tile, { scale: 0.85 }, { scale: 1.18, duration: 0.14, ease: "power2.out" }, t);
    tl.to(f.tile, { scale: 1, duration: 0.26, ease: "back.out(2.2)" }, t + 0.14);
    tl.fromTo(f.svg, { scale: 0.7 }, { scale: 1, duration: 0.32, ease: "back.out(2.6)" }, t + 0.03);
    tl.fromTo(f.path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.26, ease: "power2.out" }, t + 0.04);
    tl.set(f.ring, { opacity: 0.45, scale: 1 }, t);
    tl.to(f.ring, { scale: 1.9, opacity: 0, duration: 0.5, ease: "power2.out" }, t);
    f.sparks.forEach(function (s, i) {
      var r = ANG[i] * Math.PI / 180;
      var dx = Math.cos(r), dy = -Math.sin(r);
      tl.set(s, { opacity: 1, scale: 1, x: dx * RAD * 0.45, y: dy * RAD * 0.45 }, t + 0.06);
      tl.to(s, { x: dx * RAD, y: dy * RAD, scale: 0.3, opacity: 0, duration: 0.42, ease: "power2.out" }, t + 0.06);
    });
    tl.set(f.band, { opacity: 1 }, t);
    tl.fromTo(f.band, { xPercent: -110 }, { xPercent: 230, duration: 0.55, ease: "power2.inOut" }, t);
    tl.set(f.band, { opacity: 0 }, t + 0.55);
    tl.fromTo(f.label, { color: f.ink600, x: 8 }, { color: f.ink, x: 0, duration: 0.3, ease: "power3.out" }, t);
    return t + 0.6;
  }
  window.EMFX = { check: check, prepare: prepare };
})();
