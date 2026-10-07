const ICON = {
  back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  cam: '<svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="13" height="12" rx="3"/><path d="M15.5 10.5l6-3.5v10l-6-3.5"/></svg>',
  mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>',
  chat: '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/></svg>',
  end: '<svg viewBox="0 0 24 24"><path d="M3.5 14.5c4.6-4.4 12.4-4.4 17 0l-2.4 2.6-3.6-1.6v-2.6a12 12 0 0 0-5 0v2.6l-3.6 1.6z"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9"/></svg>',
  doc: '<svg viewBox="0 0 24 24"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M9.5 12h5M9.5 16h5"/></svg>',
};

const VIDEO_AT = 6.4;
const VIDEO_DUR = 12.2;

export default {
  id: "ch06-consulta",
  device: "iphone",
  title: "Consulta por vídeo",
  lines: ["Consulta", "por vídeo"],
  lead: "A médica já leu sua anamnese. É só conversar.",
  speed: 1,
  hold: 0,
  tail: 1.2,
  states: [["fila-ready", 0]],
  layers: {
    join: `<div class="jn"><div class="jn-aura"></div><div class="jn-pic"><svg viewBox="0 0 200 200" fill="none"><circle class="bg" cx="100" cy="100" r="92"/><circle class="fg" cx="100" cy="100" r="92" transform="rotate(-90 100 100)"/></svg><img src="assets/doctors/camila.jpg" alt=""></div><h2 class="jn-t"><span>Entrando na sala</span><span>Dra. Camila entrou</span></h2><p class="jn-s">Consulta por vídeo · Plantão 24h</p><ul class="jn-steps"><li><i>${ICON.check}</i><span>Câmera ligada</span></li><li><i>${ICON.check}</i><span>Microfone ligado</span></li><li><i>${ICON.check}</i><span>Conexão segura</span></li></ul></div>`,
    call: `<div class="cl"><video id="ch06-doc-video" class="cl-v" src="assets/video/doutora.mp4" muted playsinline data-start="${VIDEO_AT}" data-duration="${VIDEO_DUR}" data-track-index="0"></video><div class="cl-shade"></div><div class="cl-back">${ICON.back}</div><div class="cl-tag"><b>Camila Rocha</b><span><i></i><em class="cl-time">00:00</em></span></div><div class="cl-pip"><div class="cl-pip-av">A</div><span>Você</span></div><div class="cl-bar"><div class="cl-btn">${ICON.cam}<span>Câmera</span></div><div class="cl-btn">${ICON.mic}<span>Microfone</span></div><div class="cl-btn">${ICON.chat}<span>Chat</span></div><div class="cl-btn cl-end">${ICON.end}<span>Sair</span></div></div></div>`,
    ended: `<div class="en"><div class="en-ok">${ICON.check}</div><h2 class="en-t">Consulta encerrada</h2><p class="en-s">14 min com Dra. Camila Rocha</p><div class="en-docs"><div class="en-doc"><i>${ICON.doc}</i><span>Receita</span></div><div class="en-doc"><i>${ICON.doc}</i><span>Atestado</span></div><div class="en-doc"><i>${ICON.doc}</i><span>Exames</span></div></div><p class="en-n">Seus documentos já estão no app.</p></div>`,
  },
  css: `
.jn{position:absolute;inset:0;background:#22084a;display:flex;flex-direction:column;align-items:center;padding-top:170px;overflow:hidden}
.jn-aura{position:absolute;left:-140px;top:30px;width:680px;height:680px;border-radius:50%;background:radial-gradient(circle,rgba(157,107,242,.5) 0%,rgba(126,59,237,.16) 42%,rgba(34,8,74,0) 70%)}
.jn-pic{position:relative;width:200px;height:200px}
.jn-pic svg{position:absolute;inset:0;width:200px;height:200px}
.jn-pic .bg{stroke:rgba(255,255,255,.14);stroke-width:6}
.jn-pic .fg{stroke:#c6ff34;stroke-width:6;stroke-linecap:round;stroke-dasharray:578.05;stroke-dashoffset:578.05}
.jn-pic img{position:absolute;left:16px;top:16px;width:168px;height:168px;border-radius:50%;object-fit:cover}
.jn-t{position:relative;margin:34px 0 0;height:36px;width:360px;text-align:center;font-family:SpaceGrotesk_700Bold;font-size:28px;letter-spacing:-.5px;color:#fff}
.jn-t span{position:absolute;left:0;right:0;top:0}
.jn-s{position:relative;margin:10px 0 0;font-family:DMSans_400Regular;font-size:16px;color:#d6c3fb}
.jn-steps{position:relative;list-style:none;margin:40px 0 0;padding:0;width:260px;display:flex;flex-direction:column;gap:16px}
.jn-steps li{display:flex;align-items:center;gap:14px;font-family:DMSans_500Medium;font-size:17px;color:#fff}
.jn-steps i{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.12)}
.jn-steps svg{width:18px;height:18px;fill:none;stroke:#22084a;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:20;stroke-dashoffset:20}
.cl{position:absolute;inset:0;background:#0d0c12}
.cl-v{position:absolute;inset:0;width:402px;height:874px;object-fit:cover}
.cl-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,12,18,.55) 0%,rgba(13,12,18,0) 22%,rgba(13,12,18,0) 70%,rgba(13,12,18,.6) 100%)}
.cl-back{position:absolute;left:12px;top:70px;display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:rgba(23,21,30,.45)}
.cl-back svg{width:22px;height:22px;fill:none;stroke:#fff;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.cl-tag{position:absolute;left:18px;bottom:196px;display:flex;flex-direction:column;gap:4px;padding:10px 14px;border-radius:14px;background:rgba(23,21,30,.55)}
.cl-tag b{font-family:DMSans_700Bold;font-size:16px;color:#fff}
.cl-tag span{display:flex;align-items:center;gap:8px;font-family:DMSans_500Medium;font-size:13px;color:#e6e4ec}
.cl-tag i{width:8px;height:8px;border-radius:50%;background:#c6ff34}
.cl-tag em{font-style:normal;font-variant-numeric:tabular-nums}
.cl-pip{position:absolute;right:16px;top:70px;width:112px;height:152px;border-radius:18px;overflow:hidden;background:linear-gradient(160deg,#5719b6,#22084a);box-shadow:0 10px 24px rgba(0,0,0,.35);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px}
.cl-pip-av{display:grid;place-items:center;width:58px;height:58px;border-radius:50%;background:#ebe1fd;font-family:DMSans_700Bold;font-size:24px;color:#5719b6}
.cl-pip span{font-family:DMSans_500Medium;font-size:13px;color:#fff}
.cl-bar{position:absolute;left:20px;right:20px;bottom:48px;height:96px;border-radius:26px;background:rgba(23,21,30,.72);display:flex;align-items:center;justify-content:space-around;padding:0 8px}
.cl-btn{display:flex;flex-direction:column;align-items:center;gap:6px;width:72px}
.cl-btn svg{width:44px;height:44px;padding:10px;border-radius:50%;background:rgba(255,255,255,.14);fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.cl-btn span{font-family:DMSans_500Medium;font-size:12px;color:#fff}
.cl-end svg{background:#e5484d;fill:#fff;stroke:none}
.en{position:absolute;inset:0;background:#fafafe;display:flex;flex-direction:column;align-items:center;padding-top:200px}
.en-ok{display:grid;place-items:center;width:120px;height:120px;border-radius:50%;background:#7e3bed;box-shadow:0 0 0 14px #ebe1fd}
.en-ok svg{width:60px;height:60px;fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:20;stroke-dashoffset:20}
.en-t{margin:40px 0 0;font-family:SpaceGrotesk_700Bold;font-size:30px;letter-spacing:-.6px;color:#17151e}
.en-s{margin:10px 0 0;font-family:DMSans_400Regular;font-size:16px;color:#726f80}
.en-docs{margin-top:40px;display:flex;gap:12px}
.en-doc{display:flex;flex-direction:column;align-items:center;gap:10px;width:98px;padding:16px 0 14px;border-radius:18px;background:#fff;box-shadow:0 1px 0 #ebe1fd,0 8px 20px rgba(53,14,111,.08)}
.en-doc i{display:grid;place-items:center;width:44px;height:44px;border-radius:14px;background:#f5f0fe}
.en-doc svg{width:24px;height:24px;fill:none;stroke:#7e3bed;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.en-doc span{font-family:DMSans_500Medium;font-size:14px;color:#17151e}
.en-n{margin:28px 0 0;font-family:DMSans_500Medium;font-size:15px;color:#5719b6}
`,
  captions: [
    { title: "Entrando na sala", body: "O app liga **câmera e microfone** e confere a conexão." },
    { title: "A médica ao vivo", body: "Converse como numa chamada comum. Ela já sabe **o que você sente**." },
    { title: "Você na tela", body: "Sua câmera aparece aqui. Mostre **onde dói** se precisar." },
    { title: "Controles", body: "Câmera, microfone e chat na barra. **Sair** encerra a chamada." },
    { title: "Consulta encerrada", body: "Receita, atestado e pedidos de exame **chegam no app**." },
  ],
  frame: {
    title: "Consulta por vídeo",
    scene: "Tela de entrada na sala com a foto da médica, chamada de vídeo com a Dra. Camila falando, controles e encerramento com documentos",
    poster: 10,
    motion: "sequenced-ui-life (anel, checks, cronômetro), real doctor footage, cursor-led action, confetti on end",
    body: "Título central. O iPhone abre na tela escura “Entrando na sala”: o anel lima fecha em volta da foto da Dra. Camila e câmera, microfone e conexão recebem check. A chamada abre em tela cheia com o vídeo da médica falando, a etiqueta com nome e cronômetro, a miniatura “Você” e a barra com Câmera, Microfone, Chat e Sair. Toque em Sair leva a “Consulta encerrada” com receita, atestado e exames, e confete.",
  },
  run: function (S) {
    S.boot("fila-ready");
    var jn = S.layer("join");
    gsap.set(jn, { autoAlpha: 1 });
    S.status(0, true, { dur: 0.01 });
    var ring = S.one(".fg", jn);
    var titles = S.all(".jn-t span", jn);
    var dots = S.all(".jn-steps i", jn);
    var checks = S.all(".jn-steps path", jn);
    var rows = S.all(".jn-steps li", jn);
    gsap.set(titles[1], { opacity: 0 });
    rows.forEach(function (r) {
      gsap.set(r, { opacity: 0.35 });
    });
    S.introIn(0.5);
    S.introOut(3.0);
    var j0 = 3.6;
    S.cam(j0 - 0.2, { x: 201, y: 420, zoom: 1.45 }, 1.0);
    S.caption(j0 + 0.3, 0, { at: S.rect(S.one(".jn-pic", jn)) });
    S.add(function (tl) {
      var t = j0;
      tl.fromTo(ring, { strokeDashoffset: 578.05 }, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut", immediateRender: false }, t);
      rows.forEach(function (r, i) {
        var at = t + 0.4 + i * 0.6;
        tl.to(r, { opacity: 1, duration: 0.2, ease: "none" }, at - 0.15);
        tl.to(dots[i], { backgroundColor: "#c6ff34", duration: 0.2, ease: "none" }, at);
        tl.fromTo(dots[i], { scale: 0.7 }, { scale: 1, duration: 0.4, ease: "back.out(2)", immediateRender: false, transformOrigin: "50% 50%" }, at);
        tl.to(checks[i], { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, at + 0.08);
      });
      tl.to(titles[0], { opacity: 0, y: -14, duration: 0.2, ease: "power2.in" }, t + 2.25);
      tl.fromTo(titles[1], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out", immediateRender: false }, t + 2.4);
    });
    var cl = S.layer("call");
    var v0 = 6.4;
    S.layerIn(v0, "call", { from: "zoom", dur: 0.45 });
    S.layerOut(v0 + 0.45, "join", { dur: 0.01 });
    var time = S.one(".cl-time", cl);
    var tag = S.one(".cl-tag", cl);
    var pip = S.one(".cl-pip", cl);
    var bar = S.one(".cl-bar", cl);
    S.add(function (tl) {
      var p = { v: 0 };
      tl.to(
        p,
        {
          v: 11.6,
          duration: 11.6,
          ease: "none",
          onUpdate: function () {
            var s = Math.floor(p.v);
            time.textContent = "00:" + (s < 10 ? "0" : "") + s;
          },
        },
        v0
      );
      tl.fromTo(tag, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", immediateRender: false }, v0 + 0.3);
      tl.fromTo(pip, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.5)", immediateRender: false, transformOrigin: "100% 0%" }, v0 + 0.4);
      tl.fromTo(bar, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, v0 + 0.5);
    });
    S.cam(v0, { x: 201, y: 437, zoom: 1.3 }, 1.2);
    S.caption(v0 + 1.2, 1, { at: S.rect(tag) });
    S.mark(v0 + 1.4, tag, { hold: 1.8, pad: 5, radius: 16 });
    S.caption(v0 + 4.4, 2, { at: S.rect(pip), side: "right" });
    S.mark(v0 + 4.6, pip, { hold: 1.6, pad: 5, radius: 20 });
    S.caption(v0 + 7.4, 3, { at: S.rect(bar) });
    var end = S.one(".cl-end svg", cl);
    S.cursorEnter(v0 + 9.4, end, 0.7);
    S.click(v0 + 10.6, end, { press: true });
    var e0 = v0 + 10.8;
    S.captionOut(e0 - 0.2);
    var en = S.layer("ended");
    S.layerIn(e0, "ended", { from: "up", dur: 0.5 });
    S.layerOut(e0 + 0.5, "call", { dur: 0.01 });
    S.status(e0 + 0.1, false);
    var okc = S.one(".en-ok", en);
    var okp = S.one(".en-ok path", en);
    var docs = S.all(".en-doc", en);
    var txt = S.all(".en-t, .en-s, .en-n", en);
    S.add(function (tl) {
      tl.fromTo(okc, { scale: 0.3 }, { scale: 1, duration: 0.5, ease: "back.out(1.7)", immediateRender: false, transformOrigin: "50% 50%" }, e0 + 0.3);
      tl.to(okp, { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, e0 + 0.55);
      txt.forEach(function (n, i) {
        tl.fromTo(n, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32, ease: "power3.out", immediateRender: false }, e0 + 0.45 + i * 0.08 + (i === 2 ? 0.6 : 0));
      });
      docs.forEach(function (d, i) {
        tl.fromTo(d, { y: 30, scale: 0.85, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.6)", immediateRender: false }, e0 + 0.8 + i * 0.12);
      });
    });
    S.cam(e0, { x: 201, y: 420, zoom: 1.45 }, 0.9);
    S.confetti(e0 + 0.45, { x: 201, y: 260, cx: 201, cy: 260 }, { count: 70, seed: 31, power: 0.85 });
    S.caption(e0 + 1.0, 4, { at: S.rect(S.one(".en-docs", en)) });
    S.note("ended", e0);
  },
};
