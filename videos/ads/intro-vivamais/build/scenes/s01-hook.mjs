import { vid } from "../parts/stock.mjs";

const F = "data-layout-allow-overlap";
const mask = (t, cls) => `<div class="${cls}" ${F}>${t.split(" ").map((w) => `<span class="am" ${F}><span class="aw" ${F}>${w}</span></span>`).join(" ")}</div>`;
const T = { q: 0.35, clinic: 3.1, split: 6.9, two: 8.3, one: 9.2, found: 10.1, exit: 11.2, end: 12 };

export default {
  id: "s01-hook",
  device: "iphone",
  pace: 1,
  tail: 0,
  noDrift: true,
  data: T,
  states: [["fila-3", 0], ["fila-2", 0], ["fila-1", 0], ["fila-paired", 0]],
  sfx: [
    { name: "tick", at: 0.35, vol: 0.4 },
    { name: "whoosh", at: T.clinic - 0.1, vol: 0.4 },
    { name: "hit", at: T.clinic + 0.75, vol: 0.4 },
    { name: "whoosh", at: T.split - 0.05, vol: 0.45 },
    { name: "pop", at: T.two, vol: 0.4 },
    { name: "pop", at: T.one, vol: 0.4 },
    { name: "notif", at: T.found, vol: 0.7 },
    { name: "riser", at: T.exit - 0.9, vol: 0.4 },
  ],
  frame: {
    title: "Quanto tempo até um médico?",
    scene: "Abre em violeta escuro só com texto: “Febre. Segunda, 9h da manhã.” e a pergunta grande “Quanto tempo até um médico?”. A pergunta sobe e revela a resposta de sempre: uma sala de espera real, painel de senhas “Senha atual 047 · Sua senha 112” e “3 horas na sala de espera.” Depois o vídeo encolhe para a metade de cima e o violeta sobe com o iPhone na fila real do plantão Viva Mais: posição 3, 2, 1, “Encontramos seu médico”, e “4 min até a médica na tela.”",
    motion: "word-by-word mask rise on a dark card, card lifts off the footage, slow push on footage, split squeeze, device rise, real queue countdown, device push-through",
    body: "Primeiro a pergunta, sozinha na tela, com tempo para ler. A resposta 1 é a clínica: sala de espera, senha 112, três horas. A resposta 2 é o Viva Mais: a fila real do app caindo de 3 para 1 até “Encontramos seu médico”. No fim o celular avança contra a câmera e abre a marca no drop.",
  },
  css: `
.h1-top{position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:hidden;background:#120f1a;z-index:3}
.h1-top .stk{position:absolute;left:0;top:0;width:1080px;height:100%;object-fit:cover}
.h1-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,15,26,.5) 0%,rgba(18,15,26,0) 26%,rgba(18,15,26,.2) 50%,rgba(18,15,26,.88) 100%)}
.h1-dim{position:absolute;inset:0;background:#120f1a;opacity:0}
.h1-pill{position:absolute;left:60px;padding:12px 26px;border-radius:999px;font-family:"DM Sans",sans-serif;font-size:36px;font-weight:700;letter-spacing:-.01em;z-index:4}
.h1-pill.a{top:96px;background:rgba(18,15,26,.72);color:#fafafe}
.h1-pill.b{top:1034px;background:#c6ff34;color:#17151e}
.h1-big{position:absolute;left:56px;font-family:"Space Grotesk",sans-serif;font-weight:700;letter-spacing:-.045em;line-height:.9;z-index:4}
.h1-big.a{top:1180px;font-size:230px;color:#fafafe}
.h1-big.b{top:1160px;font-size:150px;color:#fafafe}
.h1-sub{position:absolute;left:62px;font-family:"DM Sans",sans-serif;font-weight:700;font-size:58px;letter-spacing:-.03em;line-height:1.05;color:#fafafe;z-index:4}
.h1-sub.a{top:1410px;width:900px}
.h1-sub.b{top:1350px;width:440px}
.vmk-hud .am{display:inline-block;overflow:hidden;vertical-align:top;padding:.04em .05em .16em;margin:0 -.05em -.16em}
.vmk-hud .aw{display:inline-block}
.h1-board{position:absolute;right:56px;top:84px;width:330px;padding:18px 22px 20px;border-radius:22px;background:#0b0a10;box-shadow:0 20px 50px rgba(0,0,0,.45),inset 0 0 0 2px rgba(255,255,255,.06);font-family:"DM Sans",sans-serif;z-index:4}
.h1-board small{display:block;font-size:20px;font-weight:700;letter-spacing:.14em;color:rgba(255,255,255,.5)}
.h1-board .led{display:block;height:96px;overflow:hidden;font-family:"SpaceGrotesk_700Bold",sans-serif;font-size:96px;line-height:96px;letter-spacing:.04em;color:#ff4d3d;text-shadow:0 0 18px rgba(255,77,61,.55);font-variant-numeric:tabular-nums}
.h1-board .led span{display:block;height:96px}
.h1-board .you{display:flex;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.12);font-size:24px;font-weight:700;color:#fafafe}
.h1-board .you b{color:#ffb020}
.h1-rule{position:absolute;left:0;top:952px;width:1080px;height:12px;background:#c6ff34;transform-origin:0% 50%;z-index:4}
.h1-bot{position:absolute;left:0;top:964px;width:1080px;height:956px;overflow:hidden;background:#6a24db}
.h1-glow{position:absolute;left:300px;top:-200px;width:1200px;height:1200px;border-radius:50%;background:radial-gradient(circle,rgba(198,255,52,.22) 0%,rgba(198,255,52,.06) 35%,rgba(106,36,219,0) 65%)}
.h1-q{position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:hidden;background:#22084a;z-index:9}
.h1-q-glow{position:absolute;left:-300px;top:900px;width:1500px;height:1500px;border-radius:50%;background:radial-gradient(circle,rgba(126,59,237,.55) 0%,rgba(126,59,237,.16) 40%,rgba(34,8,74,0) 68%)}
.h1-q-k{position:absolute;left:72px;top:560px;display:flex;align-items:center;gap:16px;font-family:"DM Sans",sans-serif;font-size:44px;font-weight:700;letter-spacing:-.015em;color:#d9c8ff}
.h1-q-k i{width:18px;height:18px;border-radius:50%;background:#c6ff34}
.h1-q-h{position:absolute;left:68px;top:660px;width:940px;font-family:"Space Grotesk",sans-serif;font-weight:700;font-size:168px;letter-spacing:-.05em;line-height:.96;color:#fafafe}
.h1-q-f{position:absolute;left:72px;top:1390px;width:900px;font-family:"DM Sans",sans-serif;font-size:50px;font-weight:500;letter-spacing:-.02em;line-height:1.2;color:rgba(250,250,254,.72)}
`,
  back: `<div class="h1-bot" ${F}><div class="h1-glow" ${F}></div></div>`,
  hud: `<div class="h1-top" ${F}>
${vid("hook-wait", { id: "s01-wait", at: T.clinic - 0.4, dur: T.end - T.clinic + 0.4, from: 2.5, pace: 1 })}
<div class="h1-shade" ${F}></div>
<div class="h1-dim" ${F}></div>
<div class="h1-pill a" ${F}>Na clínica</div>
<div class="h1-board" ${F}><small ${F}>SENHA ATUAL</small><div class="led" ${F}><span ${F}>046</span><span ${F}>047</span></div><div class="you" ${F}><span ${F}>Sua senha</span><b ${F}>112</b></div></div>
${mask("3 horas", "h1-big a")}
${mask("na sala de espera.", "h1-sub a")}
</div>
<div class="h1-rule" ${F}></div>
<div class="h1-pill b" ${F}>No Viva Mais</div>
${mask("4 min", "h1-big b")}
${mask("até a médica na tela.", "h1-sub b")}
<div class="h1-q" ${F}>
<div class="h1-q-glow" ${F}></div>
<div class="h1-q-k" ${F}><i ${F}></i>Febre. Segunda, 9h da manhã.</div>
${mask("Quanto tempo até um médico?", "h1-q-h")}
${mask("Para a sua equipe, hoje, a resposta é uma destas duas.", "h1-q-f")}
</div>`,
  run: function (S, A) {
    var T = DATA;
    var q = function (s) {
      return S.all(s);
    };
    var one = function (s) {
      return S.one(s);
    };
    var dev = one(".vmk-device");
    gsap.set(dev, { opacity: 1 });
    S.boot("fila-3");
    S.cam(0, { x: 201, y: 437, zoom: 1.28, ax: 790, ay: 1590, free: true }, 0.01);
    var top = one(".h1-top");
    var bot = one(".h1-bot");
    var rule = one(".h1-rule");
    var pa = one(".h1-pill.a");
    var pb = one(".h1-pill.b");
    var board = one(".h1-board");
    var led = q(".h1-board .led span");
    var qq = one(".h1-q");
    var qk = one(".h1-q-k");
    q(".vmk-hud .aw").forEach(function (x) {
      gsap.set(x, { yPercent: 118 });
    });
    gsap.set([pa, pb, board, qk], { opacity: 0 });
    gsap.set(bot, { y: 956 });
    gsap.set(rule, { scaleX: 0 });
    gsap.set(dev, { y: 900, rotation: 6 });
    var rise = function (tl, sel, t, st, dur) {
      q(sel).forEach(function (x, i) {
        tl.fromTo(x, { yPercent: 118 }, { yPercent: 0, duration: dur || 0.85, ease: "power3.out", immediateRender: false }, t + i * st);
      });
    };
    A.tw(function (tl) {
      tl.fromTo(one(".h1-q-glow"), { y: 0, scale: 1 }, { y: -260, scale: 1.15, duration: T.clinic + 1, ease: "sine.inOut", transformOrigin: "50% 50%" }, 0);
      tl.fromTo(qk, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", immediateRender: false }, 0.15);
      rise(tl, ".h1-q-h .aw", T.q, 0.14);
      rise(tl, ".h1-q-f .aw", T.q + 1.25, 0.05, 0.7);
      tl.fromTo(one(".h1-q-h"), { scale: 1 }, { scale: 1.04, duration: T.clinic, ease: "none", transformOrigin: "0% 50%", immediateRender: false }, 0);

      tl.to(qq, { yPercent: -100, duration: 1.0, ease: "power3.inOut" }, T.clinic - 0.1);
      tl.fromTo(top.querySelector("video"), { scale: 1.12 }, { scale: 1, duration: T.split - T.clinic + 0.6, ease: "sine.out", transformOrigin: "50% 40%", immediateRender: false }, T.clinic - 0.1);
      tl.fromTo(pa, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", immediateRender: false }, T.clinic + 0.55);
      tl.fromTo(board, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", immediateRender: false }, T.clinic + 0.65);
      rise(tl, ".h1-big.a .aw", T.clinic + 0.75, 0.14);
      rise(tl, ".h1-sub.a .aw", T.clinic + 1.2, 0.07);
      tl.to(led, { y: -96, duration: 0.6, ease: "power3.inOut" }, T.clinic + 2.4);

      var tb = T.split;
      tl.fromTo(top, { height: 1920 }, { height: 952, duration: 1.0, ease: "power3.inOut", immediateRender: false }, tb);
      tl.fromTo(q(".h1-big.a, .h1-sub.a"), { y: 0 }, { y: -620, duration: 1.0, ease: "power3.inOut", immediateRender: false }, tb);
      tl.fromTo(bot, { y: 956 }, { y: 0, duration: 1.0, ease: "power3.inOut", immediateRender: false }, tb);
      tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.out", immediateRender: false }, tb + 0.5);
      tl.fromTo(dev, { y: 900, rotation: 6 }, { y: 0, rotation: 0, duration: 1.2, ease: "power3.out", immediateRender: false, transformOrigin: "50% 100%" }, tb + 0.25);
      tl.fromTo(one(".h1-dim"), { opacity: 0 }, { opacity: 0.45, duration: 1.0, ease: "power2.out", immediateRender: false }, tb);
      tl.fromTo(pb, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", immediateRender: false }, tb + 0.7);
      rise(tl, ".h1-big.b .aw", tb + 0.9, 0.14);
      rise(tl, ".h1-sub.b .aw", tb + 1.3, 0.07);
    });

    function pos(name, n) {
      var card = S.pick(name, "Sua posição na fila", { hit: false });
      while (card.parentElement && !/antes de você|próximo/.test(card.textContent)) card = card.parentElement;
      return S.pick(name, String(n), { within: card, hit: false });
    }
    S.show(T.two, "fila-2");
    S.popIn(T.two, pos("fila-2", 2), { from: 1.25, dur: 0.5, origin: "50% 50%" });
    S.show(T.one, "fila-1");
    S.popIn(T.one, pos("fila-1", 1), { from: 1.25, dur: 0.5, origin: "50% 50%" });
    S.show(T.found, "fila-paired", { fade: 0.35 });

    var tx = T.exit;
    A.tw(function (tl) {
      tl.to(top, { y: -952, duration: 0.8, ease: "power2.inOut" }, tx);
      tl.to(rule, { y: -952, duration: 0.8, ease: "power2.inOut" }, tx);
      tl.to(bot, { y: -964, height: 1920, duration: 0.8, ease: "power2.inOut" }, tx);
      tl.to(q(".h1-big.b, .h1-sub.b").concat(pb), { y: -300, opacity: 0, duration: 0.5, ease: "power3.in" }, tx);
    });
    S.cam(tx, { x: 201, y: 360, zoom: 2.6, ax: 540, ay: 960, free: true }, T.end - tx, "power2.inOut");
  },
};
