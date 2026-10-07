import { vid } from "../parts/stock.mjs";

const F = "data-layout-allow-overlap";
const DUR = 10.5;

export default {
  id: "s02-marca",
  snap: "bar",
  pace: 1,
  tail: 0,
  noDrift: true,
  seam: { axis: "z", dir: 1, technique: "signature plus", sig: true },
  sfx: [
    { name: "hit", at: 0.0, vol: 0.65 },
    { name: "whoosh", at: 9.7, vol: 0.4 },
  ],
  frame: {
    title: "Isso é Viva Mais",
    scene: "No drop da música a marca Viva Mais bate no topo; embaixo, um cartão grande mostra pessoas reais em planos longos que se dissolvem um no outro no dia a dia (trabalho, corrida, família, celular); o cartão avança contra a câmera",
    motion: "wordmark settle on the drop, long dissolving stock shots with one slow push, mask-rise tagline",
    body: "O celular do gancho vira violeta e, no drop, a marca bate grande no topo. O cartão embaixo fica cerca de quatro segundos em cada pessoa e dissolve para a próxima, com um avanço lento e contínuo. No fim o cartão avança contra a câmera e abre o painel do RH.",
  },
  ad: [
    { key: "l1", cls: "m", style: "left:0;right:0;top:1618px;text-align:center;font-size:58px", text: "Saúde que a empresa oferece." },
    { key: "l2", cls: "m", style: "left:0;right:0;top:1694px;text-align:center;font-size:58px", text: "E que a equipe usa de **verdade.**" },
  ],
  css: `
.m2{position:absolute;inset:0;overflow:hidden;background:#fafafe}
.m2-flash{position:absolute;inset:0;background:#6a24db}
.m2-aura{position:absolute;left:-260px;top:-300px;width:1600px;height:1600px;border-radius:50%;background:radial-gradient(circle,rgba(126,59,237,.22) 0%,rgba(126,59,237,.07) 40%,rgba(250,250,254,0) 66%)}
.m2-mark{position:absolute;left:170px;top:170px;width:740px;height:198px}
.m2-mark img{display:block;width:740px;height:198px}
.m2-card{position:absolute;left:90px;top:470px;width:900px;height:1100px;border-radius:56px;overflow:hidden;background:#17151e;box-shadow:0 60px 120px rgba(34,8,74,.28)}
.m2-card .stk{position:absolute;left:0;top:0;width:900px;height:1100px;object-fit:cover}
.m2-tag{position:absolute;left:40px;top:40px;padding:12px 24px;border-radius:999px;background:#c6ff34;font-family:"DM Sans",sans-serif;font-size:30px;font-weight:700;color:#17151e}
`,
  html: `<div class="m2">
<div class="m2-aura" ${F}></div>
<div class="m2-mark" ${F}><img src="assets/brand/wordmark.png" alt="Viva Mais" ${F}></div>
<div class="m2-card" ${F}>
${vid("montage", { id: "s02-mont", at: 0, dur: DUR, from: 0, pace: 1 })}
<div class="m2-tag" ${F}>Saúde da equipe inteira</div>
</div>
</div>`,
  run: function (tl, root) {
    var DUR = 10.5;
    var q = function (s) {
      return Array.prototype.slice.call(root.querySelectorAll(s));
    };
    var one = function (s) {
      return root.querySelector(s);
    };
    var card = one(".m2-card");
    var mark = one(".m2-mark");
    tl.fromTo(mark, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.0, ease: "power3.out", transformOrigin: "50% 50%" }, 0);
    tl.fromTo(card, { y: 140, scale: 0.96 }, { y: 0, scale: 1, duration: 1.3, ease: "power3.out", transformOrigin: "50% 0%" }, 0);
    tl.fromTo(one("#s02-mont"), { scale: 1 }, { scale: 1.08, duration: DUR, ease: "none", transformOrigin: "50% 50%" }, 0);
    tl.fromTo(one(".m2-tag"), { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", immediateRender: false }, 1.2);
    ["l1", "l2"].forEach(function (k, j) {
      gsap.set(one('[data-ad="' + k + '"]'), { opacity: 1 });
      q('[data-ad="' + k + '"] .aw').forEach(function (x, i) {
        gsap.set(x, { yPercent: 118 });
        tl.fromTo(x, { yPercent: 118 }, { yPercent: 0, duration: 0.85, ease: "power3.out", immediateRender: false }, (j ? 3.6 : 1.8) + i * 0.09);
      });
    });
    tl.set({}, {}, DUR);
  },
};
