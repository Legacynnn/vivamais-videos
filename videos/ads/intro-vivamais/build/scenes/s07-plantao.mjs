import { vid } from "../parts/stock.mjs";
import { screen } from "../parts/screen.mjs";

const F = "data-layout-allow-overlap";

export default {
  id: "s07-plantao",
  device: "iphone",
  vo: "l07",
  voAt: 0.3,
  tail: 0.4,
  seam: { axis: "x", dir: -1, technique: "hard cut to black (pattern break)", type: "match" },
  states: [["hub", 0, "plantao-hub video"], ["checkout", 0, "plantao-checkout default"], ["credit", 0, "plantao-checkout credit"], ["sucesso", 0, "plantao-success default"]],
  layers: { pay: `<div class="py-veil"></div><div class="py-sheet"><div class="py-in">${screen("plantao-pay credit")}</div></div>` },
  css: `
.py-veil{position:absolute;inset:0;background:rgba(23,21,30,.42)}
.py-sheet{position:absolute;left:0;right:0;top:468px;bottom:0;border-radius:26px 26px 0 0;overflow:hidden;background:#fff;box-shadow:0 -12px 40px rgba(23,21,30,.18)}
.py-in{position:absolute;inset:0}
.pb{position:absolute;inset:0;background:#0d0b12;-webkit-mask-image:radial-gradient(circle at 540px 1180px,transparent var(--r),#000 calc(var(--r) + 2px));mask-image:radial-gradient(circle at 540px 1180px,transparent var(--r),#000 calc(var(--r) + 2px))}
.pb-t{position:absolute;left:0;right:0;top:640px;text-align:center;font-family:"Space Grotesk",sans-serif;font-size:300px;font-weight:700;letter-spacing:-.06em;line-height:1;color:#fafafe;font-variant-numeric:tabular-nums}
.pb-s{position:absolute;left:60px;right:60px;top:1000px;text-align:center;font-family:"Space Grotesk",sans-serif;font-size:64px;font-weight:700;letter-spacing:-.03em;color:#f3edff}
.pb-s .am{display:inline-block;overflow:hidden;vertical-align:top;padding:.04em .05em .16em;margin:0 -.05em -.16em}
.pb-s .aw{display:inline-block}
.pb-v{position:absolute;inset:0;opacity:.42}
.pb-v .stk{position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover}
.ad.zero .aw{font-size:220px;line-height:.9}
`,
  hud: `<div class="pb" style="--r:0px" ${F}><div class="pb-v" ${F}>${vid("thermometer", { id: "s07-sick", at: 0, dur: 2.9, cls: "stk", from: 2 })}</div><div class="pb-t" ${F}>38,2°</div><div class="pb-s" ${F}>${"E quando o corpo avisa?".split(" ").map((w) => `<span class="am" ${F}><span class="aw" ${F}>${w}</span></span>`).join(" ")}</div></div>`,
  sfx: [
    { name: "heart", at: 0.2, vol: 0.9 },
    { name: "hit", at: 0.52, vol: 0.5 },
    { name: "riser", at: 1.5, vol: 0.45 },
    { name: "whoosh", at: 2.85, vol: 0.5 },
    { name: "tap", at: 3.95, vol: 0.45 },
    { name: "tap", at: 5.5, vol: 0.45 },
    { name: "cash", at: 9.4, vol: 0.55 },
  ],
  ad: [
    { key: "a1", cls: "xl top", style: "top:180px", text: "Plantão **24h.**" },
    { key: "a2", cls: "xxl zero top", style: "top:110px", html: `<span class="am" ${F}><span class="aw v" ${F}>R$ 0</span></span>` },
    { key: "a3", cls: "m top", style: "top:326px", text: "do bolso." },
    { key: "a5", cls: "l top", style: "top:190px", text: "Pago pela **empresa.**" },
  ],
  frame: {
    title: "Quando o corpo avisa",
    scene: "Quebra de padrão: tela preta, “38,2°” gigante e “E quando o corpo avisa?”, batida de coração, a música para; o preto fecha num círculo e revela o iPhone no Plantão real (Vídeo); Entrar, Confirmar com Crédito da empresa, folha “Pagar com crédito da empresa”, “R$ 0 do bolso.”, tela “Pronto, você está no plantão” com “Contar o que estou sentindo”",
    motion: "pattern break with music drop, slam, iris close into the phone, taps with ripple, native push, bottom sheet rise, xxl slam, mark",
    body: "Corte seco para o preto: a febre “38,2°” bate enorme, “E quando o corpo avisa?” sobe e o coração bate. Em “Ela abre o plantão” o preto se abre num círculo a partir do iPhone, já na tela do Plantão. O dedo toca Entrar, o checkout abre, toca em Crédito da empresa e em Pagar; a folha do crédito da empresa sobe com o limite de R$ 300,00 e o dedo confirma. “R$ 0 do bolso.” bate em cima. A tela “Pronto, você está no plantão” entra e, em “contar o que sente”, o botão “Contar o que estou sentindo” é destacado e tocado.",
  },
  run: function (S, A) {
    gsap.set(S.one(".vmk-device"), { opacity: 1 });
    S.boot("hub");
    S.cam(0, { x: 201, y: 437, zoom: 1.65, ax: 540, ay: 1180, free: true }, 0.01);
    var pb = S.one(".pb");
    var pt = S.one(".pb-t");
    var ps = S.all(".pb-s .aw");
    gsap.set(ps, { yPercent: 118 });
    A.tw(function (tl) {
      tl.fromTo(pt, { opacity: 0, scale: 1.12, filter: "blur(6px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, A.w("E") - 0.08);
      ps.forEach(function (x, i) {
        tl.fromTo(x, { yPercent: 118 }, { yPercent: 0, duration: 0.55, ease: "power3.out", immediateRender: false }, A.w("quando") - 0.08 + i * 0.09);
      });
    });
    var ti = A.w("Ela") - 0.4;
    A.tw(function (tl) {
      tl.to([pt, S.one(".pb-s")], { opacity: 0, scale: 0.9, duration: 0.3, ease: "power2.in", transformOrigin: "50% 50%" }, ti - 0.1);
      tl.fromTo(pb, { "--r": "0px" }, { "--r": "1500px", duration: 0.7, ease: "expo.in", immediateRender: false }, ti);
      tl.set(pb, { autoAlpha: 0 }, ti + 0.71);
    });
    S.add(function (tl) {
      tl.fromTo(S.one(".vmk-device"), { scale: 0.86 }, { scale: 1, duration: 0.9, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, ti + 0.1);
    });
    A.rise(A.w("plantão") - 0.3, "a1");
    var enter = S.one('[aria-label="Continuar com vídeo"]', S.state("hub"));
    var tp = A.w("plantão") + 0.05;
    S.cursorEnter(tp - 0.5, enter, 0.45);
    S.click(tp, enter, { press: true });
    S.nav(tp + 0.12, "checkout", { dur: 0.42 });
    var co = S.state("checkout");
    var total = S.one('[aria-label^="Total"]', co);
    var card = total;
    while (card.parentElement && !/Valores/.test(card.textContent)) card = card.parentElement;
    S.mark(A.w("paga") - 0.05, card, { hold: 0.45, pad: 4, radius: 22 });
    var cc = S.one('[aria-label^="Crédito da empresa"]', co);
    var tc = A.w("crédito") + 0.05;
    S.cursorTo(tc - 0.45, cc, 0.4);
    S.click(tc, cc, { press: true });
    S.show(tc + 0.1, "credit", { fade: 0.18 });
    var payBtn = S.one('[aria-label^="Pagar"]', S.state("credit"));
    var tb = A.w("empresa.") + 0.3;
    S.cursorTo(tb - 0.4, payBtn, 0.35);
    S.click(tb, payBtn, { press: true });
    var pay = S.layer("pay");
    var veil = S.one(".py-veil", pay);
    var sheet = S.one(".py-sheet", pay);
    var ok = S.one('[aria-label^="Confirmar"]', pay);
    gsap.set(pay, { autoAlpha: 0 });
    S.add(function (tl) {
      tl.set(pay, { autoAlpha: 1 }, tb + 0.12);
      tl.fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out", immediateRender: false }, tb + 0.12);
      tl.fromTo(sheet, { y: 420 }, { y: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, tb + 0.12);
    });
    var okAt = ok;
    var tz = A.w("Zero") + 0.3;
    S.cursorTo(A.w("Zero") - 0.55, okAt, 0.35);
    S.click(A.w("Zero") - 0.15, okAt, { press: true });
    S.cursorExit(A.w("Zero") + 0.1, "down", 0.35);
    A.out(A.w("Zero") - 0.75, "a1", { dir: "up" });
    A.slam(A.w("Zero") - 0.05, "a2", { origin: "50% 60%" });
    A.rise(A.w("do") - 0.1, "a3");
    var ts = tz + 0.75;
    var tw = A.w("bolso.") + 0.35;
    S.show(tw, "sucesso", { fade: 0.35 });
    S.add(function (tl) {
      tl.to(sheet, { y: 420, duration: 0.4, ease: "power3.in" }, tw - 0.1);
      tl.to(veil, { opacity: 0, duration: 0.3, ease: "none" }, tw);
      tl.set(pay, { autoAlpha: 0 }, tw + 0.35);
    });
    A.out(tw + 0.1, "a2", { dir: "up" });
    A.out(tw + 0.13, "a3", { dir: "up" });
    A.rise(tw + 0.5, "a5");
    var cta = S.one('[aria-label="Contar o que estou sentindo"]', S.state("sucesso"));
    S.mark(A.w("contar") - 0.1, cta, { hold: 0.9, pad: 4, radius: 30 });
    S.cursorEnter(A.w("contar") + 0.1, cta, 0.4);
    S.click(A.w("sente.") + 0.1, cta, { press: true });
    A.out(ts + 4.6, "a5", { dir: "up" });
    S.add(function (tl) {
      tl.set({}, {}, ts + 5.1);
    });
  },
};
