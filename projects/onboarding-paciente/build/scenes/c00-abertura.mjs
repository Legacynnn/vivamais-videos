export default {
  id: "c00-abertura",
  tail: 0.4,
  frame: {
    title: "Abertura",
    scene: "Boas-vindas curtas com a marca",
    poster: 6,
    motion: "titlecard-reveal; waterfall-entry nos passos; push-in lento",
    body: "Logo Viva Mais e “Bem-vindo ao Viva Mais.” Subtítulo “Vamos aprender a usar o app juntos, passo a passo.” A lista dos dez passos entra um a um, com número em círculo violeta. Fecha em “Vamos começar?”.",
  },
  css: `
.a0{position:absolute;inset:0;font-family:"DM Sans",sans-serif;color:#17151e}
.a0-main{position:absolute;left:80px;right:80px;top:620px;display:flex;flex-direction:column;align-items:center;text-align:center}
.a0-logo{width:380px;height:101px}
.a0-title{margin:64px 0 0;font-family:"Space Grotesk",sans-serif;font-size:132px;font-weight:700;letter-spacing:-.04em;line-height:1;text-wrap:balance}
.a0-title span{display:inline-block}
.a0-title .v{color:#6a24db}
.a0-lead{margin:36px 0 0;width:860px;font-size:48px;line-height:1.3;color:#2e2a3a;text-wrap:balance}
.a0-list{position:absolute;left:150px;right:120px;top:790px;display:flex;flex-direction:column;gap:16px}
.a0-step{display:flex;align-items:center;gap:30px}
.a0-step b{flex:none;display:grid;place-items:center;width:68px;height:68px;border-radius:50%;background:#7e3bed;color:#fff;font-size:32px;font-weight:700}
.a0-step span{font-family:"Space Grotesk",sans-serif;font-size:48px;font-weight:500;color:#17151e}
.a0-go{position:absolute;left:0;right:0;bottom:150px;text-align:center;font-family:"Space Grotesk",sans-serif;font-size:64px;font-weight:700;color:#6a24db}
`,
  html: `<div class="vmk"><div class="a0">
<div class="a0-main">
<img class="a0-logo" src="assets/brand/wordmark.png" alt="Viva Mais">
<h1 class="a0-title"><span data-layout-allow-overlap>Bem-vindo</span> <span data-layout-allow-overlap>ao</span> <span class="v" data-layout-allow-overlap>Viva</span> <span class="v" data-layout-allow-overlap>Mais.</span></h1>
<p class="a0-lead">Vamos aprender a usar o app juntos, passo a passo.</p>
</div>

</div></div>`,
  run: function (tl, root) {
    var q = function (s) {
      return Array.prototype.slice.call(root.querySelectorAll(s));
    };
    tl.fromTo(q(".a0"), { scale: 1 }, { scale: 1.04, duration: 4.6, ease: "sine.inOut", transformOrigin: "50% 45%" }, 0);
    tl.fromTo(q(".a0-logo"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.2);
    var at = 0.7;
    q(".a0-title span").forEach(function (el) {
      tl.fromTo(el, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, at);
      at += 0.14;
    });
    tl.fromTo(q(".a0-lead"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 1.6);
    tl.set({}, {}, 4.6);
  },
};
