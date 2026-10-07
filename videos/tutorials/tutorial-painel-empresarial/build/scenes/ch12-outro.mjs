export default {
  id: "ch12-outro",
  tail: 1.7,
  seam: { axis: "z", dir: -1, technique: "inverse zoom-through" },
  frame: {
    title: "Fecho",
    scene: "Cartão final: sua equipe já pode se cuidar, com o caminho completo resumido",
    poster: 4,
    motion: "titlecard-reveal; rules waterfall-entry (título), stat-bars-and-fills (linha do caminho), center-outward-expansion (marcos)",
    body: "Chegada em inverse zoom-through. Logo, título “Pronto. Sua equipe já pode se cuidar.” e uma linha do caminho com cinco marcos (Empresa, Vidas, Créditos, Fatura, Consulta) que se preenche da esquerda para a direita. Endereço vivamais.ai/empresas no rodapé.",
  },
  css: `
.o0{position:absolute;inset:0;font-family:"DM Sans",sans-serif;color:#17151e}
.o0-main{position:absolute;left:96px;right:96px;top:150px;display:flex;flex-direction:column;align-items:center;text-align:center}
.o0-logo{width:340px;height:91px;margin:0 0 20px}
.o0-title{width:1300px;margin:26px 0 0;font-size:104px;font-weight:700;letter-spacing:-.045em;line-height:1;text-wrap:balance}
.o0-title span{display:inline-block}
.o0-title .v{color:#6a24db}
.o0-path{position:absolute;left:260px;right:260px;top:640px;height:150px}
.o0-line{position:absolute;left:110px;right:110px;top:29px;height:6px;border-radius:999px;background:#ebe1fd}
.o0-fill{position:absolute;left:110px;right:110px;top:29px;height:6px;border-radius:999px;background:#7e3bed;transform-origin:0 50%}
.o0-stops{position:absolute;inset:0;display:flex;justify-content:space-between}
.o0-stop{display:flex;flex-direction:column;align-items:center;gap:18px;width:220px}
.o0-stop b{display:grid;place-items:center;width:64px;height:64px;border-radius:50%;background:#7e3bed;color:#fff;font-size:26px;font-weight:700;box-shadow:0 0 0 8px #fafafe}
.o0-stop span{font-size:28px;font-weight:500;color:#17151e}
.o0-foot{position:absolute;left:0;right:0;bottom:96px;display:flex;justify-content:center;align-items:center;gap:18px;font-size:30px;font-weight:500;color:#4a4658}
.o0-foot b{padding:10px 24px 12px;border-radius:999px;background:#22084a;color:#fff;font-weight:500}
`,
  html: `<div class="vmk"><div class="o0">
<div class="o0-main">
<img class="o0-logo" src="assets/brand/wordmark.png" alt="Viva Mais">
<h1 class="o0-title"><span data-layout-allow-overlap>Pronto.</span> <span data-layout-allow-overlap>Sua</span> <span data-layout-allow-overlap>equipe</span> <span data-layout-allow-overlap>já</span> <span data-layout-allow-overlap>pode</span> <span class="v" data-layout-allow-overlap>se</span> <span class="v" data-layout-allow-overlap>cuidar.</span></h1>
</div>
<div class="o0-path"><div class="o0-line"></div><div class="o0-fill"></div><div class="o0-stops">
<div class="o0-stop"><b>1</b><span>Empresa</span></div>
<div class="o0-stop"><b>2</b><span>Vidas</span></div>
<div class="o0-stop"><b>3</b><span>Créditos</span></div>
<div class="o0-stop"><b>4</b><span>Fatura</span></div>
<div class="o0-stop"><b>5</b><span>Consulta</span></div>
</div></div>
<div class="o0-foot">Comece agora em <b>vivamais.ai/empresas</b></div>
</div></div>`,
  run: function (tl, root) {
    var q = function (s) {
      return Array.prototype.slice.call(root.querySelectorAll(s));
    };
    tl.fromTo(q(".o0-logo"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.5);
    var at = 0.7;
    var gap = 0.1;
    q(".o0-title span").forEach(function (el) {
      gsap.set(el, { opacity: 0 });
      tl.set(el, { opacity: 1 }, at);
      tl.fromTo(el, { y: 78 }, { y: 0, duration: 0.2, ease: "power4.out", immediateRender: false }, at);
      at += gap;
      gap = Math.max(0.05, gap * 0.88);
    });
    tl.fromTo(q(".o0-line"), { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" }, 1.5);
    tl.fromTo(q(".o0-fill"), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 1.7);
    q(".o0-stop").forEach(function (el, i) {
      var t = 1.7 + i * 0.4;
      tl.fromTo(el.querySelector("b"), { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.34, ease: "power3.out" }, t);
      tl.fromTo(el.querySelector("span"), { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power3.out" }, t + 0.08);
    });
    tl.fromTo(q(".o0-foot"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.42, ease: "power3.out" }, 3.6);
  },
};
