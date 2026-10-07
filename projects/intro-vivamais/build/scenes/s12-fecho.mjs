import { vid } from "../parts/stock.mjs";

const F = "data-layout-allow-overlap";

export default {
  id: "s12-fecho",
  vo: "l12",
  voAt: 0.45,
  fixed: 7.5,
  capsOff: [[0, 8]],
  seam: { axis: "z", dir: 1, technique: "signature plus", sig: true },
  sfx: [
    { name: "hit", at: 0.62, vol: 0.6 },
    { name: "sweep", at: 1.9, vol: 0.35 },
    { name: "pop", at: 5.2, vol: 0.4 },
  ],
  frame: {
    title: "Assinatura",
    scene: "Cartão com uma equipe real no escritório; a marca Viva Mais bate embaixo; “Sua empresa oferece.” e “Sua equipe sente.” sobem; pílula vivamais.ai",
    motion: "card rise with slow push-in, wordmark slam with blur, mask rise lines, pill pop",
    body: "Uma equipe real sorri no cartão, em avanço lento. A marca bate grande logo abaixo. “Sua empresa oferece.” e “Sua equipe sente.” sobem em sequência, e fecha com a pílula vivamais.ai · Fale com a gente.",
  },
  css: `
.f12{position:absolute;inset:0;overflow:hidden;background:#fafafe}
.f12-aura{position:absolute;left:-260px;top:700px;width:1600px;height:1600px;border-radius:50%;background:radial-gradient(circle,rgba(126,59,237,.2) 0%,rgba(126,59,237,.07) 40%,rgba(250,250,254,0) 66%)}
.f12-card{position:absolute;left:90px;top:150px;width:900px;height:820px;border-radius:56px;overflow:hidden;background:#17151e;box-shadow:0 60px 120px rgba(34,8,74,.24)}
.f12-card .stk{position:absolute;left:0;top:0;width:900px;height:820px;object-fit:cover}
.f12-tint{position:absolute;inset:0;background:linear-gradient(180deg,rgba(106,36,219,0) 55%,rgba(106,36,219,.55) 100%)}
.f12-mark{position:absolute;left:170px;top:1030px;width:740px;height:198px}
.f12-mark img{display:block;width:740px;height:198px}
.f12-cta{position:absolute;left:0;right:0;top:1560px;display:flex;justify-content:center}
.f12-cta div{display:flex;align-items:center;gap:14px;padding:20px 36px 20px 26px;border-radius:999px;background:#17151e;color:#fafafe;font-family:"DM Sans",sans-serif;font-size:40px;font-weight:700;letter-spacing:-.01em}
.f12-cta i{width:14px;height:14px;border-radius:50%;background:#c6ff34}
.f12-cta span{font-weight:500;color:rgba(250,250,254,.7)}
.ad.l1{left:0;right:0;top:1290px;text-align:center}
.ad.l2{left:0;right:0;top:1395px;text-align:center}
`,
  html: `<div class="f12">
<div class="f12-aura" ${F}></div>
<div class="f12-card" ${F}>${vid("team-end", { id: "s12-team", at: 0, dur: 7.5 })}<div class="f12-tint" ${F}></div></div>
<div class="f12-mark" ${F}><img src="assets/brand/wordmark.png" alt="Viva Mais" ${F}></div>
<div class="f12-cta" ${F}><div ${F}><i ${F}></i>vivamais.ai<span ${F}>· Fale com a gente</span></div></div>
</div>`,
  ad: [
    { key: "l1", cls: "l l1", text: "Sua empresa oferece." },
    { key: "l2", cls: "l l2", text: "Sua equipe **sente.**" },
  ],
  run: function (tl, root, w) {
    var q = function (s) {
      return Array.prototype.slice.call(root.querySelectorAll(s));
    };
    var one = function (s) {
      return root.querySelector(s);
    };
    var mark = one(".f12-mark");
    var cta = one(".f12-cta div");
    var card = one(".f12-card");
    ["l1", "l2"].forEach(function (k) {
      gsap.set(one('[data-ad="' + k + '"]'), { opacity: 1 });
      gsap.set(q('[data-ad="' + k + '"] .aw'), { yPercent: 118 });
    });
    gsap.set(mark, { opacity: 0 });
    gsap.set(cta, { opacity: 0 });
    tl.fromTo(card, { y: 160, scale: 0.94, opacity: 1 }, { y: 0, scale: 1, opacity: 1, duration: 0.9, ease: "power3.out", transformOrigin: "50% 100%" }, 0);
    tl.fromTo(one("#s12-team"), { scale: 1.02 }, { scale: 1.12, duration: 7.4, ease: "sine.inOut" }, 0);
    tl.fromTo(mark, { opacity: 0, scale: 1.08, filter: "blur(4px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.0, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, w("Viva") - 0.08);
    q('[data-ad="l1"] .aw').forEach(function (x, i) {
      tl.fromTo(x, { yPercent: 118 }, { yPercent: 0, duration: 0.6, ease: "power3.out", immediateRender: false }, w("Sua") - 0.12 + i * 0.08);
    });
    q('[data-ad="l2"] .aw').forEach(function (x, i) {
      tl.fromTo(x, { yPercent: 118 }, { yPercent: 0, duration: 0.6, ease: "power3.out", immediateRender: false }, w("Sua#1") - 0.12 + i * 0.08);
    });
    tl.fromTo(cta, { opacity: 0, y: 24, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, w("sente") + 0.55);
    tl.set({}, {}, 7.5);
  },
};
