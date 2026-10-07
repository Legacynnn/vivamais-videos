export default {
  id: "ch99-outro",
  tail: 1.8,
  seam: { axis: "z", dir: 1, technique: "signature plus", sig: true },
  frame: {
    title: "Fecho",
    scene: "Cartão final: médico online quando precisar, com o caminho do plantão resumido",
    poster: 4,
    motion: "titlecard-reveal; waterfall-entry (título), stat-bars-and-fills (linha do caminho)",
    body: "Chegada em inverse zoom-through. Logo, título “Pronto. Médico online quando você precisar.” e a linha do caminho com seis marcos que se preenche da esquerda para a direita. Rodapé “Plantão 24h no app Viva Mais”.",
  },
  css: `
.o0{position:absolute;inset:0;font-family:"DM Sans",sans-serif;color:#17151e}
.o0-main{position:absolute;left:80px;right:80px;top:200px;display:flex;flex-direction:column;align-items:center;text-align:center}
.o0-logo{width:420px;height:112px;margin:0 0 20px}
.o0-title{width:920px;margin:40px 0 0;font-family:"Space Grotesk",sans-serif;font-size:104px;font-weight:700;letter-spacing:-.04em;line-height:1.02;text-wrap:balance}
.o0-title span{display:inline-block}
.o0-title .v{color:#6a24db}
.o0-path{position:absolute;left:250px;width:600px;top:880px;height:640px}
.o0-line{position:absolute;left:25px;top:28px;bottom:28px;width:6px;border-radius:999px;background:#ebe1fd}
.o0-fill{position:absolute;left:25px;top:28px;bottom:28px;width:6px;border-radius:999px;background:#7e3bed;transform-origin:50% 0}
.o0-stops{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between}
.o0-stop{display:flex;flex-direction:row;align-items:center;gap:30px}
.o0-stop b{display:grid;place-items:center;width:56px;height:56px;border-radius:50%;background:#7e3bed;color:#fff;font-size:24px;font-weight:700;box-shadow:0 0 0 8px #fafafe}
.o0-stop span{font-family:"Space Grotesk",sans-serif;font-size:40px;font-weight:500;color:#17151e}
.o0-foot{position:absolute;left:0;right:0;bottom:170px;display:flex;justify-content:center;align-items:center;gap:18px;font-size:36px;font-weight:500;color:#4a4658}
.o0-foot b{padding:14px 30px 16px;border-radius:999px;background:#22084a;color:#fff;font-weight:500}
.o0-foot i{display:inline-block;width:14px;height:14px;border-radius:50%;background:#c6ff34;margin-right:12px}
`,
  html: `<div class="vmk"><div class="o0">
<div class="o0-main">
<img class="o0-logo" src="assets/brand/wordmark.png" alt="Viva Mais">
<h1 class="o0-title"><span data-layout-allow-overlap>Pronto.</span> <span data-layout-allow-overlap>Médico</span> <span data-layout-allow-overlap>online</span> <span data-layout-allow-overlap>quando</span> <span class="v" data-layout-allow-overlap>você</span> <span class="v" data-layout-allow-overlap>precisar.</span></h1>
</div>
<div class="o0-path"><div class="o0-line"></div><div class="o0-fill"></div><div class="o0-stops">
<div class="o0-stop"><b>1</b><span>Início</span></div>
<div class="o0-stop"><b>2</b><span>Benefícios</span></div>
<div class="o0-stop"><b>3</b><span>Plantão</span></div>
<div class="o0-stop"><b>4</b><span>Cobertura</span></div>
<div class="o0-stop"><b>5</b><span>Consulta</span></div>
<div class="o0-stop"><b>6</b><span>Pós e IA</span></div>
</div></div>
<div class="o0-foot"><b><i></i>Plantão 24h</b> no app Viva Mais</div>
</div></div>`,
  run: function (tl, root) {
    var q = function (s) {
      return Array.prototype.slice.call(root.querySelectorAll(s));
    };
    tl.fromTo(q(".o0-main"), { scale: 0.92 }, { scale: 1, duration: 0.8, ease: "power3.out", transformOrigin: "50% 30%" }, 0);
    tl.fromTo(q(".o0-logo"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.2);
    var at = 0.45;
    var gap = 0.1;
    q(".o0-title span").forEach(function (el) {
      gsap.set(el, { opacity: 0 });
      tl.set(el, { opacity: 1 }, at);
      tl.fromTo(el, { y: 78 }, { y: 0, duration: 0.22, ease: "power4.out", immediateRender: false }, at);
      at += gap;
      gap = Math.max(0.05, gap * 0.88);
    });
    tl.fromTo(q(".o0-line"), { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" }, 1.3);
    tl.fromTo(q(".o0-fill"), { scaleY: 0 }, { scaleY: 1, duration: 1.9, ease: "power2.inOut" }, 1.45);
    q(".o0-stop").forEach(function (el, i) {
      var t = 1.45 + i * 0.34;
      tl.fromTo(el.querySelector("b"), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" }, t);
      tl.fromTo(el.querySelector("span"), { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, t + 0.06);
    });
    tl.fromTo(q(".o0-foot"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.42, ease: "power3.out" }, 3.5);
  },
};
