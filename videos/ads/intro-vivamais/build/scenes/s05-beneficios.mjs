import { readFileSync } from "node:fs";

const F = "data-layout-allow-overlap";
const icon = (n) => readFileSync(new URL(`../../node_modules/lucide-static/icons/${n}.svg`, import.meta.url), "utf8").replace(/<!--[\s\S]*?-->/g, "").replace(/\s*class="[^"]*"/, "").replace("<svg", `<svg ${F}`).trim();
const chip = (ic, t, s) => `<b ${F}>${icon(ic)}</b><div ${F}>${t}<small ${F}>${s}</small></div>`;

export default {
  id: "s05-beneficios",
  device: "iphone",
  vo: "l05",
  voAt: 0.15,
  tail: 0.45,
  seam: { axis: "x", dir: -1, technique: "match cut: same phone, same framing", type: "match" },
  states: [["home", 0, "client-home-company default"], ["plan", 0, "my-plan company"]],
  sfx: [
    { name: "tap", at: 2.1, vol: 0.45 },
    { name: "pop", at: 3.35, vol: 0.4 },
    { name: "pop", at: 5.4, vol: 0.4 },
    { name: "pop", at: 7.45, vol: 0.4 },
    { name: "pop", at: 8.25, vol: 0.4 },
    { name: "hit", at: 9.55, vol: 0.55 },
  ],
  ad: [
    { key: "c1", cls: "chip", style: "left:60px;top:186px;width:470px", html: chip("video", "Plantão <em>24h</em>", "Clínico geral por vídeo") },
    { key: "c2", cls: "chip", style: "left:550px;top:186px;width:470px", html: chip("stethoscope", "Especialistas <em>−25%</em>", "Cardio, derma, pediatria e mais 12") },
    { key: "c3", cls: "chip", style: "left:60px;top:318px;width:470px", html: chip("flask-conical", "Exames <em>até −40%</em>", "Laboratórios parceiros") },
    { key: "c4", cls: "chip", style: "left:550px;top:318px;width:470px", html: chip("pill", "Farmácias <em>até −35%</em>", "Genéricos com desconto") },
    { key: "big", cls: "xl top", style: "top:200px", text: "Tudo no **bolso.**" },
  ],
  frame: {
    title: "Tudo que a empresa oferece",
    scene: "Início real do colaborador rola até o painel Viva+ Empresarial; toque em Ver plano revela Meu plano (crédito da empresa, especialistas, Super Inteligência, farmácias); cada benefício salta do celular como cartão no ritmo da narração; fecha com “Tudo no bolso.”",
    motion: "scroll with steady camera, circular reveal, marks synced to VO, cards breaking out of the device in a staggered cascade, slam",
    body: "O mesmo iPhone continua do corte. O Início rola até o painel Viva+ Empresarial e o dedo toca Ver plano. Meu plano abre num círculo a partir do toque. Em “Plantão vinte e quatro horas”, “Especialistas com desconto”, “Exames, farmácias”, cada benefício é destacado na tela e salta como cartão, em escada. “Tudo no bolso.” bate grande em cima.",
  },
  run: function (S, A) {
    gsap.set(S.one(".vmk-device"), { opacity: 1 });
    S.boot("home");
    S.status(0, true, { dur: 0.01 });
    S.cam(0, { x: 201, y: 437, zoom: 1.58, ax: 540, ay: 1180, free: true }, 0.01);
    S.cam(0.2, { x: 201, y: 437, zoom: 1.65, ax: 540, ay: 1180, free: true }, 1.6, "power2.inOut");
    S.scroll(0.25, ["home"], 300, 1.2);
    var home = S.state("home");
    var more = S.one('[aria-label="Ver plano"]', home);
    var tap = A.w("oferece") - 0.2;
    S.cursorEnter(tap - 0.55, more, 0.5);
    S.click(tap, more, { press: true });
    S.cursorExit(tap + 0.3, "down", 0.4);
    var plan = S.state("plan");
    var sr = S.rect(more);
    var r0 = tap + 0.15;
    var blocks = S.all('[aria-label^="Crédito da empresa"], [aria-label^="Especialistas"], [aria-label^="Chat com IA"], [aria-label^="Farmácias"]', plan);
    S.add(function (tl) {
      tl.set(plan, { autoAlpha: 1, zIndex: 3, clipPath: "circle(0px at " + sr.cx + "px " + sr.cy + "px)" }, r0);
      tl.to(plan, { clipPath: "circle(1000px at " + sr.cx + "px " + sr.cy + "px)", duration: 0.7, ease: "power3.inOut" }, r0);
      tl.set(home, { autoAlpha: 0 }, r0 + 0.7);
      blocks.forEach(function (el, i) {
        tl.fromTo(el, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, r0 + 0.35 + i * 0.06);
      });
    });

    var tp = A.w("Plantão");
    var care = S.pick("plan", /^Consultas e plantão/, { hit: false });
    while (care.parentElement && care.getBoundingClientRect().height < 200) care = care.parentElement;
    S.mark(tp - 0.1, care, { hold: 1.4, pad: 2, radius: 24 });
    var te = A.w("Especialistas");
    S.mark(te - 0.05, S.one('[aria-label^="Especialistas"]', plan), { hold: 0.9, pad: 4, radius: 18 });
    var tx = A.w("Exames");
    S.scroll(tx - 0.6, ["plan"], 200, 0.55);
    S.mark(tx - 0.05, S.one('[aria-label^="Farmácias"]', plan), { hold: 1.6, pad: 4, radius: 18 });
    var tf = A.w("farmácias");

    [["c1", tp], ["c2", te], ["c3", tx], ["c4", tf]].forEach(function (c) {
      var el = A.line(c[0]);
      A.tw(function (tl) {
        tl.fromTo(el, { opacity: 0, y: 28, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, c[1] - 0.12);
      });
    });
    var tb = A.w("Tudo#1");
    S.scroll(tb - 0.1, ["plan"], 0, 0.8);
    A.slam(tb - 0.05, "big", { origin: "50% 50%" });
    A.tw(function (tl) {
      ["c1", "c2", "c3", "c4"].forEach(function (k, i) {
        tl.to(A.line(k), { y: -40, opacity: 0, duration: 0.4, ease: "power2.in" }, tb - 0.35 + i * 0.03);
      });
    });
    S.cam(tb - 0.2, { x: 201, y: 437, zoom: 1.74, ax: 540, ay: 1180, free: true }, 1.0, "power3.out");
    var ex = A.end + 0.1;
    A.tw(function (tl) {
      tl.to(A.line("big"), { y: -200, opacity: 0, duration: 0.35, ease: "power3.in" }, ex);
    });
  },
};
