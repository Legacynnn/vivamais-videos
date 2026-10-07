const DONE = ["Criar a conta e a ficha", "Marcar e pagar a consulta", "Preencher a anamnese", "Ver receitas e exames", "Incluir dependentes", "Marcar pela IA"];

export default {
  id: "c99-fecho",
  tail: 1.6,
  frame: {
    title: "Fecho",
    scene: "Cartão final com tudo o que a pessoa aprendeu e onde pedir ajuda",
    poster: 6,
    motion: "titlecard-reveal; checklist waterfall com checks; push-in lento",
    body: "“Pronto! Agora você já sabe usar o Viva Mais.” Lista com check de cada coisa aprendida. Rodapé: dúvidas no RH da empresa ou no chat do app.",
  },
  css: `
.f0{position:absolute;inset:0;font-family:"DM Sans",sans-serif;color:#17151e}
.f0-main{position:absolute;left:80px;right:80px;top:200px;display:flex;flex-direction:column;align-items:center;text-align:center}
.f0-logo{width:360px;height:96px}
.f0-title{margin:52px 0 0;font-family:"Space Grotesk",sans-serif;font-size:112px;font-weight:700;letter-spacing:-.04em;line-height:1.02;text-wrap:balance}
.f0-title span{display:inline-block}
.f0-title .v{color:#6a24db}
.f0-list{position:absolute;left:170px;right:120px;top:820px;display:flex;flex-direction:column;gap:26px}
.f0-row{display:flex;align-items:center;gap:30px}
.f0-row b{flex:none;display:grid;place-items:center;width:64px;height:64px;border-radius:50%;background:#c6ff34;color:#22084a}
.f0-row b svg{width:36px;height:36px}
.f0-row span{font-family:"Space Grotesk",sans-serif;font-size:52px;font-weight:500}
.f0-foot{position:absolute;left:90px;right:90px;bottom:150px;padding:34px 40px;border-radius:32px;background:#22084a;color:#fff;text-align:center;font-size:42px;line-height:1.3}
.f0-foot b{color:#c6ff34;font-weight:700}
`,
  html: `<div class="vmk"><div class="f0">
<div class="f0-main">
<img class="f0-logo" src="assets/brand/wordmark.png" alt="Viva Mais">
<h1 class="f0-title"><span data-layout-allow-overlap>Pronto!</span> <span data-layout-allow-overlap>Agora</span> <span data-layout-allow-overlap>você</span> <span data-layout-allow-overlap>já</span> <span data-layout-allow-overlap>sabe</span> <span class="v" data-layout-allow-overlap>usar</span> <span class="v" data-layout-allow-overlap>o</span> <span class="v" data-layout-allow-overlap>app.</span></h1>
</div>
<div class="f0-list">
${DONE.map((s) => `<div class="f0-row"><b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></b><span>${s}</span></div>`).join("\n")}
</div>
<div class="f0-foot">Dúvidas? Fale com o <b>RH da sua empresa</b> ou pergunte à <b>IA do app</b>.</div>
</div></div>`,
  run: function (tl, root) {
    var q = function (s) {
      return Array.prototype.slice.call(root.querySelectorAll(s));
    };
    tl.fromTo(q(".f0"), { scale: 1 }, { scale: 1.035, duration: 11, ease: "sine.inOut", transformOrigin: "50% 40%" }, 0);
    tl.fromTo(q(".f0-logo"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.3);
    var at = 0.8;
    q(".f0-title span").forEach(function (el) {
      tl.fromTo(el, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, at);
      at += 0.12;
    });
    q(".f0-row").forEach(function (el, i) {
      var t = 2.8 + i * 0.5;
      tl.fromTo(el.querySelector("b"), { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "power3.out" }, t);
      tl.fromTo(el.querySelector("span"), { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, t + 0.08);
    });
    tl.fromTo(q(".f0-foot"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 7.0);
    tl.set({}, {}, 11);
  },
};
