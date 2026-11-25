export default {
  id: "ch06-fila",
  device: "iphone",
  speed: 1.15,
  title: "Fila em tempo real",
  lines: ["Fila em", "tempo real"],
  lead: "Acompanhe sua posição. O app avisa quando o médico chamar.",
  tail: 0.9,
  states: [
    ["fila-4", 0, "plantao-queue position-4"],
    ["fila-3", 0, "plantao-queue position-3"],
    ["fila-1", 0, "plantao-queue position-1"],
    ["lendo", 0, "plantao-called reading"],
    ["chamando", 0, "plantao-called calling"],
  ],
  layers: {
    live: `<div class="la"><div class="la-l"><img src="assets/brand/mark-white.svg" alt=""></div><div class="la-r"><b class="la-n"><em>3º</em><em>1º</em></b></div><div class="la-b"><div><b>Plantão 24h</b><span class="la-s"><em>Na fila · consulta por vídeo</em><em>Você é o próximo</em></span></div><span class="la-eta">~3 min</span></div></div>`,
  },
  css: `
.la{position:absolute;left:11px;right:11px;top:11px;height:112px;border-radius:34px;background:#0d0c12;box-shadow:0 10px 30px rgba(13,12,18,.25)}
.la-l{position:absolute;left:16px;top:6px}
.la-l img{width:36px;height:36px;max-width:none;padding:7px;border-radius:11px;background:#7e3bed;box-sizing:border-box}
.la-r{position:absolute;right:20px;top:4px}
.la-n{position:relative;display:block;width:48px;height:36px}
.la-n em{position:absolute;right:0;top:0;font-style:normal;font-family:SpaceGrotesk_700Bold;font-size:30px;letter-spacing:-.8px;color:#c6ff34}
.la-b{position:absolute;left:20px;right:20px;top:54px;display:flex;align-items:center;justify-content:space-between}
.la-b div{display:flex;flex-direction:column;gap:2px}
.la-b b{font-family:DMSans_700Bold;font-weight:400;font-size:16px;color:#fafafe}
.la-s{position:relative;display:block;height:18px;width:230px}
.la-s em{position:absolute;left:0;top:0;font-style:normal;font-family:DMSans_400Regular;font-size:13px;color:#a29fb0;white-space:nowrap}
.la-eta{padding:6px 10px;border-radius:999px;background:rgba(250,250,254,.12);font-family:DMSans_500Medium;font-size:13px;color:#fafafe}
`,
  captions: [
    { title: "Sua posição", body: "Você vê **seu lugar na fila** e a espera estimada." },
    { title: "Em tempo real", body: "O número cai **sozinho** enquanto os pacientes são atendidos." },
    { title: "Na Dynamic Island", body: "Pode sair do app: sua posição fica **no topo da tela**." },
    { title: "Enquanto você espera", body: "Histórias rápidas sobre **a chamada**, a receita e a família." },
    { title: "Super inteligência Viva", body: "Tire dúvidas com a IA **sem sair da fila**." },
    { title: "Encontramos seu médico", body: "A Dra. Camila **está lendo o seu caso**. O app avisa a hora de entrar." },
    { title: "É a sua vez", body: "A chamada abre sozinha. Ou toque em **Entrar na chamada**." },
  ],
  frame: {
    title: "Fila em tempo real",
    scene: "Sala de espera do plantão com a médica, posição caindo de 4º para 1º, histórias e Super inteligência Viva, depois Encontramos seu médico com a linha do tempo e É a sua vez com Entrar na chamada",
    poster: 6,
    motion: "rolling position number, Dynamic Island live activity, camera-with-intent, takeover push, timeline step, attached tooltips",
    body: "Título central. A fila abre em 4º com espera estimada ~12 min, cai para 3º e 1º; a Dynamic Island mostra a posição. A câmera passa por Enquanto você espera e pela Super inteligência Viva. Entra a tela Encontramos seu médico, com a Dra. Camila Rocha lendo o caso e a linha do tempo Médico encontrado, Leitura do seu caso, Chamada de vídeo. Ela vira É a sua vez! com a contagem Entrando na chamada em 3 e o toque em Entrar na chamada.",
  },
  run: function (S) {
    S.boot("fila-4");
    S.status(0, true, { dur: 0.01 });
    S.introIn(0.05);
    S.introOut(2.9);
    var hero = function (name, n) {
      return S.one('[aria-label^="Você é o ' + n + 'º da fila"]', S.state(name));
    };
    var t = 3.7;
    var h4 = hero("fila-4", 4);
    S.cam(t - 0.2, { x: 201, y: 300, zoom: 1.45 }, 1.0);
    S.caption(t + 0.4, 0, { at: S.rect(h4), side: "right" });
    S.mark(t + 0.6, h4, { hold: 1.4, pad: 4, radius: 22 });
    t += 2.6;
    S.show(t, "fila-3");
    S.popIn(t, S.pick("fila-3", "3º"), { from: 1.4, dur: 0.4, origin: "0% 50%" });
    S.caption(t + 0.3, 1, { at: S.rect(hero("fila-3", 3)), side: "right" });
    t += 1.9;
    var laL = S.layer("live");
    var la = S.one(".la", laL);
    var laS = S.all(".la-s em", la);
    var laN = S.all(".la-n em", la);
    gsap.set([laS[1], laN[1]], { opacity: 0 });
    var l0 = t;
    S.cam(l0 - 0.1, { x: 201, y: 200, zoom: 1.75 }, 0.8);
    S.caption(l0 + 0.5, 2, { at: { x: 11, y: 11, w: 380, h: 112, cx: 201, cy: 67 } });
    (function (l0) {
      S.add(function (tl) {
        tl.set(laL, { autoAlpha: 1 }, l0);
        tl.fromTo(la, { clipPath: "inset(0px 128px 76px 128px round 20px)" }, { clipPath: "inset(0px 0px 0px 0px round 32px)", duration: 0.55, ease: "power3.out", immediateRender: false }, l0);
        tl.fromTo(S.all(".la-l, .la-r, .la-b", la), { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out", immediateRender: false, stagger: 0.05 }, l0 + 0.2);
      });
    })(l0);
    t = l0 + 2.2;
    S.show(t, "fila-1");
    (function (t) {
      S.add(function (tl) {
        tl.to(laN[0], { y: -24, opacity: 0, duration: 0.25, ease: "power2.in" }, t);
        tl.fromTo(laN[1], { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power3.out", immediateRender: false }, t + 0.15);
        tl.to(laS[0], { opacity: 0, duration: 0.2, ease: "none" }, t);
        tl.to(laS[1], { opacity: 1, duration: 0.25, ease: "none" }, t + 0.2);
      });
    })(t);
    t += 1.6;
    (function (t) {
      S.add(function (tl) {
        tl.to(S.all(".la-l, .la-r, .la-b", la), { opacity: 0, duration: 0.15, ease: "none" }, t);
        tl.to(la, { clipPath: "inset(0px 128px 76px 128px round 20px)", duration: 0.45, ease: "power3.in" }, t);
        tl.set(laL, { autoAlpha: 0 }, t + 0.45);
      });
    })(t);
    var stories = S.pick("fila-1", "Enquanto você espera");
    while (stories.parentElement && !/Cuide da/.test(stories.textContent)) stories = stories.parentElement;
    S.cam(t, { x: 201, y: 540, zoom: 1.45 }, 0.9);
    S.caption(t + 0.4, 3, { at: S.rect(stories), side: "right" });
    S.mark(t + 0.7, stories, { hold: 1.3, pad: 4, radius: 22 });
    t += 2.6;
    var viva = S.pick("fila-1", "Super inteligência Viva");
    while (viva.parentElement && !/Posso tomar algo/.test(viva.textContent)) viva = viva.parentElement;
    S.cam(t, { x: 201, y: 700, zoom: 1.45 }, 0.9);
    S.caption(t + 0.4, 4, { at: S.rect(viva), side: "right" });
    S.mark(t + 0.7, viva, { hold: 1.3, pad: 4, radius: 22 });
    t += 2.6;
    S.captionOut(t - 0.1);
    t = S.nav(t, "lendo", { kind: "modal" });
    S.status(t - 0.4, false);
    var steps = S.pick("lendo", "Seu atendimento");
    while (steps.parentElement && !/Chamada de vídeo/.test(steps.textContent)) steps = steps.parentElement;
    var title = S.pick("lendo", "Encontramos seu médico");
    S.cam(t - 0.2, { x: 201, y: 380, zoom: 1.4 }, 0.9);
    S.caption(t + 0.3, 5, { at: S.rect(title), side: "right" });
    S.cam(t + 1.8, { x: 201, y: 560, zoom: 1.45 }, 0.9);
    S.mark(t + 2.0, steps, { hold: 1.4, pad: 4, radius: 20, noScroll: true });
    t += 3.8;
    S.scroll(t - 0.1, ["chamando"], 0, 0.05);
    S.show(t, "chamando", { fade: 0.35 });
    var ready = S.pick("chamando", "É a sua vez!");
    S.popIn(t + 0.1, ready, { from: 0.92, dur: 0.4, origin: "0% 50%" });
    S.confetti(t + 0.2, S.rect(ready), { count: 46, seed: 17, power: 0.7 });
    var enter = S.one('[aria-label="Entrar na chamada"]', S.state("chamando"));
    S.cam(t + 0.6, { x: 201, y: 560, zoom: 1.4 }, 0.9);
    S.caption(t + 0.6, 6, { at: S.rect(S.one('[aria-label^="Entrando na chamada em"]', S.state("chamando"))), side: "right" });
    S.cursorEnter(t + 1.4, enter, 0.6);
    S.mark(t + 2.1, enter, { hold: 1.0, pad: 5, radius: 16, noScroll: true });
    S.click(t + 2.9, enter, { press: true });
    S.note("enter", t + 2.9);
  },
};
