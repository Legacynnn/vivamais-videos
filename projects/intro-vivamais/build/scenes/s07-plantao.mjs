import { vid } from "../parts/stock.mjs";
import { PL_HTML, PL_CSS } from "../parts/pl.mjs";

const F = "data-layout-allow-overlap";

export default {
  id: "s07-plantao",
  device: "iphone",
  vo: "l07",
  voAt: 0.3,
  tail: 0.4,
  seam: { axis: "x", dir: -1, technique: "hard cut to black (pattern break)", type: "match" },
  states: [["checkout", 0], ["pagar", 0], ["pagar-qr", 0], ["sucesso", 0]],
  layers: { pl: PL_HTML, scan: `<div class="sc-box"><i></i><i></i><i></i><i></i><u></u></div><div class="sc-ok"><b></b>Pagamento confirmado</div>` },
  css: PL_CSS + `
.pb{position:absolute;inset:0;background:#0d0b12;-webkit-mask-image:radial-gradient(circle at 540px 1180px,transparent var(--r),#000 calc(var(--r) + 2px));mask-image:radial-gradient(circle at 540px 1180px,transparent var(--r),#000 calc(var(--r) + 2px))}
.pb-t{position:absolute;left:0;right:0;top:640px;text-align:center;font-family:"Space Grotesk",sans-serif;font-size:300px;font-weight:700;letter-spacing:-.06em;line-height:1;color:#fafafe;font-variant-numeric:tabular-nums}
.pb-s{position:absolute;left:60px;right:60px;top:1000px;text-align:center;font-family:"Space Grotesk",sans-serif;font-size:64px;font-weight:700;letter-spacing:-.03em;color:#f3edff}
.pb-s .am{display:inline-block;overflow:hidden;vertical-align:top;padding:.04em .05em .16em;margin:0 -.05em -.16em}
.pb-s .aw{display:inline-block}
.pb-v{position:absolute;inset:0;opacity:.42}
.pb-v .stk{position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover}
.ad.zero .aw{font-size:220px;line-height:.9}
.sc-box{position:absolute;left:0;top:0}
.sc-box i{position:absolute;width:30px;height:30px;border:4px solid #7e3bed}
.sc-box i:nth-child(1){left:0;top:0;border-right:0;border-bottom:0;border-radius:10px 0 0 0}
.sc-box i:nth-child(2){right:0;top:0;border-left:0;border-bottom:0;border-radius:0 10px 0 0}
.sc-box i:nth-child(3){left:0;bottom:0;border-right:0;border-top:0;border-radius:0 0 0 10px}
.sc-box i:nth-child(4){right:0;bottom:0;border-left:0;border-top:0;border-radius:0 0 10px 0}
.sc-box u{position:absolute;left:6px;right:6px;top:4px;height:3px;border-radius:2px;background:#7e3bed;box-shadow:0 0 14px 4px rgba(126,59,237,.45)}
.sc-ok{position:absolute;left:0;right:0;top:0;margin:0 auto;width:max-content;display:flex;align-items:center;gap:8px;padding:9px 16px 9px 10px;border-radius:999px;background:#17151e;color:#fafafe;font-family:DMSans_700Bold;font-size:14px}
.sc-ok b{width:18px;height:18px;border-radius:50%;background:#c6ff34}
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
    { key: "a2", cls: "xxl zero top", style: "top:110px", html: `<span class="am" ${F}><span class="aw v" ${F}>−25%</span></span>` },
    { key: "a3", cls: "m top", style: "top:326px", text: "com o plano." },
    { key: "a5", cls: "l top", style: "top:190px", text: "Pix pago em **segundos.**" },
  ],
  frame: {
    title: "Quando o corpo avisa",
    scene: "Quebra de padrão: tela preta, “38,2°” gigante e “E quando o corpo avisa?” em lima, batida de coração, a música para; o preto fecha num círculo e revela o iPhone no plantão; Começar, checkout, Pix com desconto do plano, “−25% com o plano”; motivo digitado na anamnese",
    motion: "pattern break with music drop, slam, iris close into the phone, taps with ripple, native push transitions, xxl slam, typing",
    body: "Corte seco para o preto: a febre “38,2°” bate enorme, “E quando o corpo avisa?” sobe em lima e o coração bate. Em “Ela abre o plantão” o preto se abre num círculo a partir do iPhone, já na tela do plantão. O dedo toca Começar, o checkout abre, toca em Crédito da empresa, o limite de R$ 300,00 aparece e a confirmação sai. “R$ 0 do bolso.” bate à direita. Em “Depois, é só contar o que sente” a anamnese sobe e o motivo é digitado.",
  },
  run: function (S, A) {
    gsap.set(S.one(".vmk-device"), { opacity: 1 });
    S.boot("checkout");
    var pl = S.layer("pl");
    gsap.set(pl, { autoAlpha: 1 });
    S.status(0, true, { dur: 0.01 });
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
    var start = S.one(".pl-cta", pl);
    var tp = A.w("plantão") + 0.05;
    S.cursorEnter(tp - 0.5, start, 0.45);
    S.click(tp, start, { press: true });
    S.add(function (tl) {
      tl.to(pl, { x: -110, duration: 0.45, ease: "power3.inOut" }, tp + 0.15);
      tl.set(pl, { autoAlpha: 0 }, tp + 0.6);
    });
    S.status(tp + 0.3, false);
    var ccRow = S.pick("checkout", "Crédito da empresa", { hit: false });
    while (ccRow.parentElement && ccRow.getBoundingClientRect().height < 60) ccRow = ccRow.parentElement;
    gsap.set(ccRow, { display: "none" });
    ["pagar", "pagar-qr"].forEach(function (n) {
      A.sub(n, "Benefício Viva+ Família", "Desconto do plano Viva+");
    });
    var total = S.pick("checkout", "Total a pagar");
    var totalCard = total;
    while (totalCard.parentElement && totalCard.getBoundingClientRect().height < 120) totalCard = totalCard.parentElement;
    S.mark(A.w("paga") - 0.05, totalCard, { hold: 0.45, pad: 4, radius: 22 });
    var pix = S.pick("checkout", "Pix");
    var tc = A.w("crédito") + 0.05;
    S.cursorTo(tc - 0.45, pix, 0.4);
    S.click(tc, pix, { press: true });
    var t = S.nav(tc + 0.12, "pagar", { dur: 0.42 });
    var off = S.pick("pagar", /−R\$ 20,00|-R\$ 20,00/, { hit: false });
    S.mark(t + 0.05, off, { hold: 0.55, pad: 5, radius: 16 });
    var gen = S.pick("pagar", "Gerar Pix");
    var tz = A.w("Zero") + 0.3;
    S.cursorTo(tz - 0.5, gen, 0.4);
    S.click(tz, gen, { press: true });
    S.show(tz + 0.1, "pagar-qr", { fade: 0.25 });
    S.cursorExit(tz + 0.3, "down", 0.35);
    A.out(A.w("Zero") - 0.75, "a1", { dir: "up" });
    A.slam(A.w("Zero") - 0.05, "a2", { origin: "50% 60%" });
    A.rise(A.w("do") - 0.1, "a3");
    var qrs = S.all("svg", S.state("pagar-qr")).sort(function (a, b) {
      return b.getBoundingClientRect().width - a.getBoundingClientRect().width;
    });
    var qr = S.rect(qrs[0]);
    var scan = S.layer("scan");
    var box = S.one(".sc-box", scan);
    var line = S.one(".sc-box u", scan);
    var ok = S.one(".sc-ok", scan);
    gsap.set(box, { x: qr.x - 12, y: qr.y - 12, width: qr.w + 24, height: qr.h + 24 });
    gsap.set(ok, { y: qr.y + qr.h + 34 });
    gsap.set(scan, { autoAlpha: 0 });
    gsap.set([ok, line, box], { opacity: 0 });
    var ts = tz + 0.75;
    S.add(function (tl) {
      tl.set(scan, { autoAlpha: 1 }, ts);
      tl.fromTo(box, { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, ts);
      tl.fromTo(line, { y: 0, opacity: 0 }, { y: qr.h + 16, opacity: 1, duration: 0.9, ease: "sine.inOut", immediateRender: false }, ts + 0.35);
      tl.to(line, { y: 0, duration: 0.9, ease: "sine.inOut" }, ts + 1.25);
      tl.to(line, { opacity: 0, duration: 0.2, ease: "none" }, ts + 2.1);
      tl.fromTo(ok, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, ts + 2.2);
      tl.to(scan, { autoAlpha: 0, duration: 0.3, ease: "none" }, ts + 3.3);
    });
    A.out(ts + 0.2, "a2", { dir: "up" });
    A.out(ts + 0.23, "a3", { dir: "up" });
    A.rise(ts + 0.75, "a5");
    S.show(ts + 3.3, "sucesso", { fade: 0.35 });
    A.out(ts + 4.6, "a5", { dir: "up" });
    S.add(function (tl) {
      tl.set({}, {}, ts + 5.1);
    });
  },
};
