import { CX_HTML, CX_CSS, cxLife } from "../../../../kit/parts/cx.mjs";
export default {
  id: "ch06-fila",
  device: "iphone",
  speed: 1.15,
  title: "Fila em tempo real",
  lines: ["Fila em", "tempo real"],
  lead: "Acompanhe sua posição. O app avisa quando a médica chamar.",
  tail: 0.9,
  states: [["fila-3", 0], ["fila-2", 0], ["fila-1", 0], ["fila-paired", 0], ["fila-ready", 0]],
  layers: {
    connect: `<div class="cn"><div class="cn-orbit"><img src="assets/doctors/rafael.jpg" alt=""><img src="assets/doctors/julia.jpg" alt=""><img src="assets/doctors/mariana.jpg" alt=""><img src="assets/doctors/camila.jpg" alt=""></div><div class="cn-ring"><svg viewBox="0 0 200 200" fill="none"><circle class="bg" cx="100" cy="100" r="86"/><circle class="fg" cx="100" cy="100" r="86" transform="rotate(-90 100 100)"/></svg><img src="assets/brand/mark.svg" alt=""></div><h2 class="cn-t"><span>Conectando ao plantão</span><span>Tudo pronto!</span></h2><p class="cn-s"><i></i>6 médicos online agora</p><ul class="cn-steps"><li><i><svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9"/></svg></i><span>Pago com crédito da empresa</span></li><li><i><svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9"/></svg></i><span>Anamnese entregue</span></li><li><i><svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9"/></svg></i><span>Entrando na fila</span></li></ul></div>`,
    live: `<div class="la"><div class="la-l"><img src="assets/brand/mark-white.svg" alt=""></div><div class="la-r"><b class="la-n"><em>2º</em><em>1º</em></b></div><div class="la-b"><div><b>Plantão 24h</b><span class="la-s"><em>Na fila · consulta por vídeo</em><em>Você é o próximo</em></span></div><span class="la-eta">~3 min</span></div></div>`,
    cx: CX_HTML,
    match: `<div class="mt"><div class="mt-aura"></div><div class="mt-k">MÉDICA ENCONTRADA</div><div class="mt-pic"><i></i><img src="assets/doctors/camila.jpg" alt="Camila Rocha"></div><h2 class="mt-n">Dra. Camila Rocha</h2><p class="mt-r">Clínica geral · CRM-SP 184233</p><div class="mt-stats"><span><b class="mt-c1">4,9</b> avaliação</span><span><b class="mt-c2">1.280</b> consultas</span><span><b class="mt-c3">11</b> anos</span></div><div class="mt-live"><i></i>Lendo sua anamnese<u><b></b><b></b><b></b></u></div><div class="mt-chips"><span>Dor de cabeça</span><span>Cabeça · latejante</span><span>Desde ontem</span><span>Sem alergias</span></div></div>`,
  },
  css: CX_CSS + `
.cn{position:absolute;inset:0;background:#fafafe;display:flex;flex-direction:column;align-items:center;padding-top:190px}
.cn-orbit{position:absolute;left:201px;top:280px;width:0;height:0}
.cn-orbit img{position:absolute;left:-22px;top:-22px;width:44px;height:44px;max-width:none;border-radius:50%;object-fit:cover;box-shadow:0 0 0 3px #fafafe,0 6px 14px rgba(53,14,111,.18)}
.cn-s i{display:inline-block;width:8px;height:8px;margin-right:8px;border-radius:50%;background:#8cc900;vertical-align:1px}
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
.mt-live u{display:inline-flex;gap:3px;margin-left:6px;text-decoration:none}
.mt-live u b{width:5px;height:5px;border-radius:50%;background:#7e3bed}
.mt-chips{position:relative;margin-top:18px;width:330px;display:flex;flex-wrap:wrap;justify-content:center;gap:8px}
.mt-chips span{padding:7px 12px;border-radius:999px;background:rgba(250,250,254,.1);box-shadow:inset 0 0 0 1px rgba(214,195,251,.3);font-family:DMSans_500Medium;font-size:13px;color:#ebe1fd}
.cn-ring{position:relative;width:180px;height:180px}
.cn-ring svg{position:absolute;inset:0;width:180px;height:180px}
.cn-ring .bg{stroke:#ebe1fd;stroke-width:10}
.cn-ring .fg{stroke:#7e3bed;stroke-width:10;stroke-linecap:round;stroke-dasharray:540.35;stroke-dashoffset:540.35}
.cn-ring img{position:absolute;left:52px;top:52px;width:76px;height:76px}
.cn-t{position:relative;margin:34px 0 0;height:36px;width:360px;text-align:center;font-family:SpaceGrotesk_700Bold;font-size:28px;letter-spacing:-.5px;color:#17151e}
.cn-t span{position:absolute;left:0;right:0;top:0}
.cn-s{margin:10px 0 0;font-family:DMSans_400Regular;font-size:16px;color:#726f80}
.cn-steps{list-style:none;margin:40px 0 0;padding:0;width:300px;display:flex;flex-direction:column;gap:18px}
.cn-steps li{display:flex;align-items:center;gap:14px;font-family:DMSans_500Medium;font-size:17px;color:#403d4a}
.cn-steps i{position:relative;display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#ebe1fd}
.cn-steps svg{width:18px;height:18px;fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:20;stroke-dashoffset:20}
.mt{position:absolute;inset:0;background:#22084a;display:flex;flex-direction:column;align-items:center;padding-top:118px;overflow:hidden}
.mt-aura{position:absolute;left:-120px;top:40px;width:640px;height:640px;border-radius:50%;background:radial-gradient(circle,rgba(157,107,242,.55) 0%,rgba(126,59,237,.18) 40%,rgba(34,8,74,0) 70%)}
.mt-k{position:relative;font-family:DMSans_700Bold;font-size:13px;letter-spacing:1.6px;color:#c6ff34}
.mt-pic{position:relative;margin-top:26px;width:176px;height:176px}
.mt-pic i{position:absolute;inset:-9px;border-radius:50%;border:4px solid #c6ff34}
.mt-pic img{position:absolute;inset:0;width:176px;height:176px;border-radius:50%;object-fit:cover}
.mt-n{position:relative;margin:30px 0 0;font-family:SpaceGrotesk_700Bold;font-size:32px;letter-spacing:-.6px;color:#fff}
.mt-r{position:relative;margin:8px 0 0;font-family:DMSans_400Regular;font-size:16px;color:#d6c3fb}
.mt-stats{position:relative;margin-top:34px;display:flex;gap:10px}
.mt-stats span{padding:10px 14px;border-radius:14px;background:rgba(255,255,255,.1);font-family:DMSans_400Regular;font-size:13px;color:#d6c3fb;text-align:center}
.mt-stats b{display:block;font-family:DMSans_700Bold;font-size:20px;color:#fff}
.mt-live{position:relative;margin-top:30px;display:flex;align-items:center;gap:10px;padding:12px 18px;border-radius:999px;background:#fff;font-family:DMSans_500Medium;font-size:15px;color:#22084a}
.mt-live i{width:10px;height:10px;border-radius:50%;background:#8cc900}
`,
  lib: [cxLife],
  captions: [
    { title: "Conectando", body: "Cobertura, anamnese e fila **em segundos**. Seis médicos estão online." },
    { title: "Sua posição", body: "O número cai **em tempo real** enquanto os pacientes são atendidos." },
    { title: "Você é o próximo", body: "Enquanto espera, o app mostra **dicas** para a consulta." },
    { title: "Na Dynamic Island", body: "Pode sair do app: sua posição fica **no topo da tela**." },
    { title: "Médica encontrada", body: "Você vê **quem vai te atender**. Ela já está lendo a sua anamnese." },
    { title: "Hora de entrar", body: "A médica já está na sala. Toque em **Entrar na chamada**." },
    { title: "Preparando a sala", body: "Sala segura, câmera e microfone. **A médica entra** e você é avisada." },
  ],
  frame: {
    title: "Fila em tempo real",
    scene: "Tela de conexão com anel e três etapas, posição na fila caindo de 3 para 1, médica encontrada e botão Entrar na chamada",
    poster: 16,
    motion: "sequenced-ui-life (anel, checks, contagem), zoom reveal, camera-with-intent, attached tooltips",
    body: "Título central. O iPhone abre numa tela de conexão (anel violeta que se completa, Pagamento confirmado, Anamnese entregue, Entrando na fila). Ela se afasta e revela a fila na posição 3, que cai para 2 e 1. Um cartão escuro revela a Dra. Camila Rocha com foto, CRM e avaliação. Depois “O médico está esperando você” e o toque em Entrar na chamada.",
  },
  run: function (S) {
    S.boot("fila-3");
    var cn = S.layer("connect");
    gsap.set(cn, { autoAlpha: 1 });
    var ring = S.one(".fg", cn);
    var titles = S.all(".cn-t span", cn);
    var dots = S.all(".cn-steps i", cn);
    var checks = S.all(".cn-steps path", cn);
    var rows = S.all(".cn-steps li", cn);
    var av = S.all(".cn-orbit img", cn);
    gsap.set(titles[1], { opacity: 0 });
    rows.forEach(function (r) {
      gsap.set(r, { opacity: 0.35 });
    });
    S.introIn(0.05);
    S.introOut(2.9);
    var c0 = 3.9;
    S.cam(c0 - 0.2, { x: 201, y: 420, zoom: 1.4 }, 1.0);
    S.caption(c0 + 0.3, 0, { at: S.rect(S.one(".cn-ring", cn)) });
    S.add(function (tl) {
      var t = c0;
      tl.fromTo(ring, { strokeDashoffset: 540.35 }, { strokeDashoffset: 0, duration: 2.6, ease: "power2.inOut", immediateRender: false }, t);
      av.forEach(function (a, i) {
        var o = { a: i * 90 - 60 };
        tl.fromTo(a, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out", immediateRender: false }, t + 0.1 + i * 0.12);
        tl.fromTo(
          o,
          { a: i * 90 - 60 },
          {
            a: i * 90 - 60 + 150,
            duration: 3.2,
            ease: "power1.inOut",
            immediateRender: false,
            onUpdate: function () {
              var r = (o.a * Math.PI) / 180;
              gsap.set(a, { x: Math.cos(r) * 124, y: Math.sin(r) * 124 });
            },
          },
          t
        );
        gsap.set(a, { x: Math.cos(((i * 90 - 60) * Math.PI) / 180) * 124, y: Math.sin(((i * 90 - 60) * Math.PI) / 180) * 124 });
      });
      rows.forEach(function (r, i) {
        var at = t + 0.5 + i * 0.75;
        tl.to(r, { opacity: 1, duration: 0.25, ease: "none" }, at - 0.2);
        tl.to(dots[i], { backgroundColor: "#7e3bed", duration: 0.2, ease: "none" }, at);
        tl.fromTo(dots[i], { scale: 0.7 }, { scale: 1, duration: 0.4, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, at);
        tl.to(checks[i], { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, at + 0.08);
      });
      tl.to(titles[0], { opacity: 0, y: -14, duration: 0.2, ease: "power2.in" }, t + 2.6);
      tl.fromTo(titles[1], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out", immediateRender: false }, t + 2.75);
      tl.to(av.slice(0, 3), { scale: 0, opacity: 0, duration: 0.3, ease: "power2.in", stagger: 0.05 }, t + 3.0);
    });
    var t = S.layerOut(c0 + 3.5, "connect", { to: "zoom", dur: 0.45 });
    function card(name) {
      var c = S.pick(name, "Sua posição na fila");
      while (c.parentElement && !/Aguardando há/.test(c.textContent)) c = c.parentElement;
      return c;
    }
    var c3 = card("fila-3");
    S.caption(t + 0.2, 1, { at: S.rect(S.pick("fila-3", "3", { within: c3 })) });
    S.mark(t + 0.4, c3, { hold: 1.4, pad: 4, radius: 22 });
    t += 2.2;
    var laL = S.layer("live");
    var la = S.one(".la", laL);
    var laS = S.all(".la-s em", la);
    var laN = S.all(".la-n em", la);
    gsap.set([laS[1], laN[1]], { opacity: 0 });
    S.show(t, "fila-2");
    S.popIn(t, S.pick("fila-2", "2", { within: card("fila-2") }), { from: 1.5, dur: 0.4, origin: "50% 50%" });
    var l0 = t + 0.5;
    S.cam(l0 - 0.1, { x: 201, y: 200, zoom: 1.75 }, 0.8);
    S.caption(l0 + 0.5, 3, { at: { x: 11, y: 11, w: 380, h: 112, cx: 201, cy: 67 } });
    (function (l0) {
      S.add(function (tl) {
        tl.set(laL, { autoAlpha: 1 }, l0);
        tl.fromTo(la, { clipPath: "inset(0px 128px 76px 128px round 20px)" }, { clipPath: "inset(0px 0px 0px 0px round 32px)", duration: 0.55, ease: "power3.out", immediateRender: false }, l0);
        tl.fromTo(S.all(".la-l, .la-r, .la-b", la), { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out", immediateRender: false, stagger: 0.05 }, l0 + 0.2);
      });
    })(l0);
    t = l0 + 2.2;
    S.show(t, "fila-1");
    S.popIn(t, S.pick("fila-1", "1", { within: card("fila-1") }), { from: 1.5, dur: 0.4, origin: "50% 50%" });
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
    var tips = S.pick("fila-1", "Escolha um lugar calmo");
    var tipCard = tips;
    while (tipCard.parentElement && tipCard.getBoundingClientRect().height < 110) tipCard = tipCard.parentElement;
    S.cam(t, { x: 201, y: 520, zoom: 1.45 }, 0.9);
    S.caption(t + 0.4, 2, { at: S.rect(tipCard) });
    S.mark(t + 0.7, tipCard, { hold: 1.3, pad: 4, radius: 22 });
    t += 2.6;
    S.captionOut(t - 0.1);
    S.show(t, "fila-paired");
    var mt = S.layer("match");
    S.layerIn(t, "match", { from: "zoom", dur: 0.55 });
    S.status(t + 0.1, true);
    var pic = S.one(".mt-pic", mt);
    var ringM = S.one(".mt-pic i", mt);
    var parts = S.all(".mt-k, .mt-n, .mt-r, .mt-stats span, .mt-live", mt);
    var chips = S.all(".mt-chips span", mt);
    var typing = S.all(".mt-live u b", mt);
    var m0 = t;
    S.add(function (tl) {
      var t = m0;
      tl.fromTo(pic, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, t + 0.25);
      tl.fromTo(ringM, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, t + 0.55);
      parts.forEach(function (p, i) {
        tl.fromTo(p, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.34, ease: "power3.out", immediateRender: false }, t + 0.45 + i * 0.07);
      });
      typing.forEach(function (b, i) {
        for (var k = 0; k < 6; k++) {
          tl.fromTo(b, { y: 0 }, { y: -4, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1, immediateRender: false }, t + 1.2 + k * 0.5 + i * 0.12);
        }
      });
      chips.forEach(function (c, i) {
        tl.fromTo(c, { y: 18, scale: 0.8, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.4, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, t + 1.5 + i * 0.35);
      });
    });
    S.count(m0 + 0.7, S.one(".mt-c1", mt), 0, 4.9, function (v) {
      return v.toFixed(1).replace(".", ",");
    }, 0.9);
    S.count(m0 + 0.75, S.one(".mt-c2", mt), 0, 1280, function (v) {
      return Math.round(v).toLocaleString("pt-BR");
    }, 1.0);
    S.count(m0 + 0.8, S.one(".mt-c3", mt), 0, 11, function (v) {
      return String(Math.round(v));
    }, 0.8);
    S.cam(t, { x: 201, y: 400, zoom: 1.45 }, 0.9);
    S.caption(t + 0.9, 4, { at: S.rect(S.one(".mt-chips", mt)) });
    S.confetti(t + 0.5, { x: 201, y: 230, cx: 201, cy: 230 }, { count: 50, seed: 17, power: 0.75 });
    t += 4.4;
    S.captionOut(t - 0.1);
    var cx = S.layer("cx");
    S.layerIn(t, "cx", { from: "zoom", dur: 0.5 });
    S.layerOut(t + 0.45, "match", { dur: 0.01 });
    var cl = cxLife(S, cx, t + 0.3);
    S.cam(t, { x: 201, y: 437, zoom: 1.28 }, 0.9);
    S.caption(t + 1.4, 6, { at: S.rect(S.all(".cx-steps li", cx)[0]), side: "right" });
    t = cl.fin + 0.9;
    S.captionOut(t - 0.1);
    S.layerOut(t, "cx", { to: "zoom", dur: 0.4 });
    S.status(t + 0.1, false);
    S.show(t + 0.9, "fila-ready", { fade: 0.3 });
    var ready = S.pick("fila-ready", /^O médico está esperando/);
    S.popIn(t + 1.0, ready, { from: 0.92, dur: 0.4, origin: "50% 50%" });
    var enter = S.pick("fila-ready", "Entrar na chamada");
    S.cam(t + 1.0, { x: 201, y: 520, zoom: 1.45 }, 0.9);
    S.caption(t + 1.3, 5, { at: S.rect(enter) });
    S.cursorEnter(t + 1.6, enter, 0.6);
    S.mark(t + 2.3, enter, { hold: 1.0, pad: 5, radius: 16 });
    S.click(t + 3.1, enter, { press: true });
    S.note("enter", t + 3.1);
  },
};
