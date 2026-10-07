export default {
  id: "ch00-intro",
  tail: 0.6,
  frame: {
    title: "Abertura",
    scene: "Marca Viva Mais, título “Médico online em minutos” e o caminho do tutorial em seis paradas (Início, Benefícios, Plantão, Cobertura, Consulta, Pós e IA)",
    poster: 3,
    motion: "titlecard-reveal; waterfall-entry (título), stat-bars-and-fills (linha do caminho), cut-the-curve LEFT na saída",
    body: "Fundo claro com aura violeta. O símbolo Viva Mais cresce no centro e dá lugar ao título “Médico online em minutos.” com a palavra final em violeta. Abaixo, a linha do caminho se preenche passando por Início, Benefícios, Plantão, Cobertura, Consulta e Pós e IA.",
  },
  css: `
.i0{position:absolute;inset:0;font-family:"DM Sans",sans-serif;color:#17151e}
.i0-aura{position:absolute;left:460px;top:-260px;width:1000px;height:1000px;border-radius:50%;background:radial-gradient(circle,rgba(126,59,237,.2) 0%,rgba(126,59,237,.07) 42%,rgba(250,250,254,0) 70%)}
.i0-mark{position:absolute;left:896px;top:170px;width:128px;height:128px}
.i0-kick{position:absolute;left:0;right:0;top:330px;text-align:center;font-size:30px;font-weight:500;color:#5719b6;letter-spacing:-.01em}
.i0-title{position:absolute;left:160px;right:160px;top:382px;margin:0;text-align:center;font-size:128px;font-weight:700;letter-spacing:-.05em;line-height:1}
.i0-title .l{display:block;overflow:hidden;padding:.02em 0 .12em}
.i0-title .w{display:inline-block}
.i0-title .v{color:#6a24db}
.i0-path{position:absolute;left:250px;right:250px;top:760px;height:130px}
.i0-line{position:absolute;left:80px;right:80px;top:25px;height:6px;border-radius:999px;background:#ebe1fd}
.i0-fill{position:absolute;left:80px;right:80px;top:25px;height:6px;border-radius:999px;background:#7e3bed;transform-origin:0 50%}
.i0-stops{position:absolute;inset:0;display:flex;justify-content:space-between}
.i0-stop{display:flex;flex-direction:column;align-items:center;gap:16px;width:160px}
.i0-stop b{display:grid;place-items:center;width:56px;height:56px;border-radius:50%;background:#7e3bed;color:#fff;font-size:22px;font-weight:700;box-shadow:0 0 0 8px #fafafe}
.i0-stop span{font-size:26px;font-weight:500;color:#403d4a}
`,
  html: `<div class="vmk"><div class="i0">
<div class="i0-aura"></div>
<img class="i0-mark" src="assets/brand/mark.svg" alt="">
<div class="i0-kick">Tutorial · Plantão 24h</div>
<h1 class="i0-title"><span class="l"><span class="w">Médico online</span></span><span class="l"><span class="w v">em minutos.</span></span></h1>
<div class="i0-path"><div class="i0-line"></div><div class="i0-fill"></div><div class="i0-stops">
<div class="i0-stop"><b>1</b><span>Início</span></div>
<div class="i0-stop"><b>2</b><span>Benefícios</span></div>
<div class="i0-stop"><b>3</b><span>Plantão</span></div>
<div class="i0-stop"><b>4</b><span>Cobertura</span></div>
<div class="i0-stop"><b>5</b><span>Consulta</span></div>
<div class="i0-stop"><b>6</b><span>Pós e IA</span></div>
</div></div>
</div></div>`,
  run: function (tl, root) {
    var q = function (s) {
      return Array.prototype.slice.call(root.querySelectorAll(s));
    };
    tl.fromTo(q(".i0-aura"), { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out", transformOrigin: "50% 50%" }, 0);
    tl.fromTo(q(".i0-mark"), { opacity: 0, scale: 0.3, rotation: -40 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.5)", transformOrigin: "50% 50%" }, 0.15);
    tl.fromTo(q(".i0-kick"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, 0.55);
    q(".i0-title .w").forEach(function (el, i) {
      tl.fromTo(el, { yPercent: 115 }, { yPercent: 0, duration: 0.62, ease: "expo.out" }, 0.7 + i * 0.12);
    });
    tl.fromTo(q(".i0-line"), { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" }, 1.3);
    tl.fromTo(q(".i0-fill"), { scaleX: 0 }, { scaleX: 1, duration: 2.1, ease: "power2.inOut" }, 1.45);
    q(".i0-stop").forEach(function (el, i) {
      var t = 1.45 + i * 0.38;
      tl.fromTo(el.querySelector("b"), { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.32, ease: "back.out(1.6)" }, t);
      tl.fromTo(el.querySelector("span"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28, ease: "power3.out" }, t + 0.06);
    });
    tl.to(q(".i0-title, .i0-kick, .i0-mark"), { x: -420, duration: 0.55, ease: "power4.in" }, 4.4);
    tl.to(q(".i0-path"), { x: -520, duration: 0.55, ease: "power4.in" }, 4.46);
  },
};
