import { DG_HTML, SM_HTML, DG_CSS, dgLife, smLife } from "../../../../kit/parts/dg.mjs";
import { DOC_A, DOC_LISTEN, DOC_B, PAT_IDLE_A, PAT_TALK, PAT_IDLE_B, CALL_END, CUE_TIMES, CUES, cueHtml, transcriptHtml } from "../../../../kit/parts/talk.mjs";

const ICON = {
  back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  cam: '<svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="13" height="12" rx="3"/><path d="M15.5 10.5l6-3.5v10l-6-3.5"/></svg>',
  mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>',
  cc: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 10.2a2.4 2.4 0 1 0 0 3.6M17 10.2a2.4 2.4 0 1 0 0 3.6"/></svg>',
  end: '<svg viewBox="0 0 24 24"><path d="M3.5 14.5c4.6-4.4 12.4-4.4 17 0l-2.4 2.6-3.6-1.6v-2.6a12 12 0 0 0-5 0v2.6l-3.6 1.6z"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9"/></svg>',
  doc: '<svg viewBox="0 0 24 24"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M9.5 12h5M9.5 16h5"/></svg>',
  text: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h10M4 18h7"/></svg>',
  spark: '<svg viewBox="0 0 24 24"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/></svg>',
};

const VA = 7.0;
const vid = (id, src, c, cls) =>
  `<video id="${id}" class="cl-v ${cls || ""}" src="${src}" muted playsinline data-start="${+(VA + c.at).toFixed(2)}" data-duration="${c.dur}" data-media-start="${c.media}"${c.rate ? ` data-playback-rate="${c.rate}"` : ""} data-track-index="0"></video>`;

const DOC = "assets/video/doutora.mp4";
const PAT = "assets/video/paciente.mp4";

export default {
  id: "ch07-consulta",
  device: "iphone",
  title: "Consulta por vídeo",
  lines: ["Consulta", "por vídeo"],
  lead: "Converse com a médica. O app legenda e transcreve tudo.",
  speed: 1,
  hold: 0,
  tail: 1.0,
  states: [["chamando", 0, "plantao-called calling"]],
  data: { VA, CUES: CUE_TIMES, WHO: CUES.map((c) => c.who), P: VA + PAT_TALK.at, B: VA + DOC_B.at, END: VA + CALL_END, IDLE_A: VA + PAT_IDLE_A.at, IDLE_B: VA + PAT_IDLE_B.at, IDLE_B_END: VA + PAT_IDLE_B.at + PAT_IDLE_B.dur },
  layers: {
    join: `<div class="jn"><div class="jn-aura"></div><div class="jn-pic"><svg viewBox="0 0 200 200" fill="none"><circle class="bg" cx="100" cy="100" r="92"/><circle class="fg" cx="100" cy="100" r="92" transform="rotate(-90 100 100)"/></svg><img src="assets/doctors/camila.jpg" alt=""></div><h2 class="jn-t"><span>Entrando na sala</span><span>Dra. Camila entrou</span></h2><p class="jn-s">Consulta por vídeo · Plantão 24h</p><ul class="jn-steps"><li><i>${ICON.check}</i><span>Câmera ligada</span></li><li><i>${ICON.check}</i><span>Microfone ligado</span></li><li><i>${ICON.check}</i><span>Conexão criptografada</span><b class="jn-net"><u></u><u></u><u></u><u></u></b></li></ul></div>`,
    call: `<div class="cl">
<div class="cl-f cl-doc">${vid("ch06-doc-a", DOC, DOC_A)}${vid("ch06-doc-l", DOC, DOC_LISTEN)}${vid("ch06-doc-b", DOC, DOC_B)}<img class="cl-v cl-doc-end" src="assets/video/doutora-end.jpg" alt=""><div class="cl-f-name">Dra. Camila Rocha</div></div>
<div class="cl-f cl-pat"><img class="cl-v cl-pst-a" src="assets/video/paciente-a.jpg" alt="">${vid("ch06-pat-a", PAT, PAT_IDLE_A)}${vid("ch06-pat-t", PAT, PAT_TALK)}${vid("ch06-pat-b", PAT, PAT_IDLE_B)}<img class="cl-v cl-pst-b" src="assets/video/paciente-b.jpg" alt=""><div class="cl-f-name">Você</div></div>
<div class="cl-shade"></div>
<div class="cl-back">${ICON.back}</div>
<div class="cl-top"><span class="cl-rec"><i></i>Transcrição ativa</span><span class="cl-time">00:00</span></div>
<div class="cl-toast"><i>${ICON.doc}</i><div><b>Receita em preparo</b><span>A Dra. Camila está escrevendo</span></div><u><b></b><b></b><b></b></u></div>
<div class="cl-cc">${cueHtml("cl-cue")}</div>
<div class="cl-bar"><div class="cl-btn">${ICON.cam}<span>Câmera</span></div><div class="cl-btn">${ICON.mic}<span>Microfone</span></div><div class="cl-btn cl-on">${ICON.cc}<span>Legenda</span></div><div class="cl-btn cl-end">${ICON.end}<span>Sair</span></div></div>
<div class="cl-dim"></div>
<div class="cl-sheet"><i></i><h3>Encerrar a consulta?</h3><p>Seus documentos, a transcrição e a análise da IA ficam prontos no app.</p><div class="cl-sheet-go">Encerrar consulta</div><div class="cl-sheet-no">Continuar na chamada</div></div>
</div>`,
    dg: DG_HTML,
    sm: SM_HTML,
  },
  stage: `<div class="tp" data-layout-allow-overlap><div class="tp-head"><div><b>Transcrição ao vivo</b><span><i></i>Gravando com seu consentimento</span></div><em>IA</em></div><div class="tp-win"><ul class="tp-list">${transcriptHtml()}</ul></div><div class="tp-foot"><b>A IA já destacou</b><div class="tp-tags"><span>Dor de cabeça desde ontem</span><span>Sem febre</span><span>Dipirona sem melhora</span><span>Piora com telas</span></div></div></div>`,
  css: DG_CSS + `
.jn{position:absolute;inset:0;background:#22084a;display:flex;flex-direction:column;align-items:center;padding-top:170px;overflow:hidden}
.jn-aura{position:absolute;left:-140px;top:30px;width:680px;height:680px;border-radius:50%;background:radial-gradient(circle,rgba(157,107,242,.5) 0%,rgba(126,59,237,.16) 42%,rgba(34,8,74,0) 70%)}
.jn-pic{position:relative;width:200px;height:200px}
.jn-pic svg{position:absolute;inset:0;width:200px;height:200px}
.jn-pic .bg{stroke:rgba(255,255,255,.14);stroke-width:6}
.jn-pic .fg{stroke:#c6ff34;stroke-width:6;stroke-linecap:round;stroke-dasharray:578.05;stroke-dashoffset:578.05}
.jn-pic img{position:absolute;left:16px;top:16px;width:168px;height:168px;border-radius:50%;object-fit:cover}
.jn-t{position:relative;margin:34px 0 0;height:36px;width:360px;text-align:center;font-family:SpaceGrotesk_700Bold;font-size:28px;letter-spacing:-.5px;color:#fafafe}
.jn-t span{position:absolute;left:0;right:0;top:0}
.jn-s{position:relative;margin:10px 0 0;font-family:DMSans_400Regular;font-size:16px;color:#d6c3fb}
.jn-steps{position:relative;list-style:none;margin:40px 0 0;padding:0;width:290px;display:flex;flex-direction:column;gap:16px}
.jn-steps li{display:flex;align-items:center;gap:14px;font-family:DMSans_500Medium;font-size:17px;color:#fafafe}
.jn-steps i{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.12)}
.jn-steps svg{width:18px;height:18px;fill:none;stroke:#22084a;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:20;stroke-dashoffset:20}
.jn-net{display:flex;align-items:flex-end;gap:3px;margin-left:auto;height:16px}
.jn-net u{width:4px;border-radius:2px;background:rgba(255,255,255,.2)}
.jn-net u:nth-child(1){height:5px}.jn-net u:nth-child(2){height:8px}.jn-net u:nth-child(3){height:12px}.jn-net u:nth-child(4){height:16px}
.cl{position:absolute;inset:0;background:#0d0c12;overflow:hidden}
.cl-f{position:absolute;left:0;top:0;width:402px;height:874px;overflow:hidden;background:#17151e}
.cl-v{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cl-f-name{position:absolute;left:12px;bottom:12px;padding:4px 10px;border-radius:10px;background:rgba(13,12,18,.55);font-family:DMSans_500Medium;font-size:12px;color:#fafafe;opacity:0}
.cl-shade,.cl-back,.cl-top,.cl-toast,.cl-cc,.cl-bar{z-index:5}
.cl-dim{z-index:6}.cl-sheet{z-index:7}
.cl-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,12,18,.6) 0%,rgba(13,12,18,0) 20%,rgba(13,12,18,0) 60%,rgba(13,12,18,.7) 100%);pointer-events:none}
.cl-back{position:absolute;left:12px;top:64px;display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:rgba(23,21,30,.45)}
.cl-back svg{width:22px;height:22px;fill:none;stroke:#fafafe;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.cl-top{position:absolute;left:66px;top:71px;display:flex;gap:8px}
.cl-top span{display:flex;align-items:center;gap:7px;height:30px;padding:0 12px;border-radius:999px;background:rgba(23,21,30,.55);font-family:DMSans_500Medium;font-size:13px;color:#fafafe}
.cl-rec i{width:8px;height:8px;border-radius:50%;background:#c6ff34}
.cl-time{font-variant-numeric:tabular-nums}
.cl-toast{position:absolute;left:14px;right:14px;top:120px;display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:20px;background:#fafafe;box-shadow:0 12px 30px rgba(13,12,18,.3);opacity:0}
.cl-toast i{display:grid;place-items:center;flex:none;width:40px;height:40px;border-radius:12px;background:#f3edff}
.cl-toast i svg{width:22px;height:22px;fill:none;stroke:#7e3bed;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.cl-toast div{flex:1;display:flex;flex-direction:column;gap:2px}
.cl-toast b{font-family:DMSans_700Bold;font-weight:400;font-size:15px;color:#17151e}
.cl-toast span{font-family:DMSans_400Regular;font-size:13px;color:#726f80}
.cl-toast u{display:flex;gap:3px;text-decoration:none}
.cl-toast u b{width:6px;height:6px;border-radius:50%;background:#7e3bed}
.cl-cc{position:absolute;left:14px;right:14px;bottom:160px;height:104px;border-radius:20px;background:rgba(13,12,18,.62)}
.cl-cue{position:absolute;left:16px;right:16px;top:14px;opacity:0}
.cl-cue-who{display:block;font-family:DMSans_700Bold;font-weight:400;font-size:12px;letter-spacing:.6px;text-transform:uppercase}
.cl-cue-who.doc{color:#c6ff34}.cl-cue-who.pat{color:#d6c3fb}
.cl-cue p{margin:5px 0 0;font-family:DMSans_500Medium;font-size:18px;line-height:24px;color:#fafafe}
.cl-cue p span{opacity:.32}
.cl-bar{position:absolute;left:20px;right:20px;bottom:48px;height:96px;border-radius:26px;background:rgba(23,21,30,.72);display:flex;align-items:center;justify-content:space-around;padding:0 8px}
.cl-btn{display:flex;flex-direction:column;align-items:center;gap:6px;width:72px}
.cl-btn svg{width:44px;height:44px;padding:10px;border-radius:50%;background:rgba(255,255,255,.14);fill:none;stroke:#fafafe;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.cl-on svg{background:#fafafe;stroke:#22084a}
.cl-btn span{font-family:DMSans_500Medium;font-size:12px;color:#fafafe}
.cl-end svg{background:#ef4444;fill:#fafafe;stroke:none}
.cl-dim{position:absolute;inset:0;background:rgba(13,12,18,.5);opacity:0}
.cl-sheet{position:absolute;left:0;right:0;bottom:0;padding:14px 20px 40px;border-radius:28px 28px 0 0;background:#fafafe;transform:translateY(420px)}
.cl-sheet i{display:block;width:40px;height:5px;margin:0 auto 20px;border-radius:3px;background:#d2cfdb}
.cl-sheet h3{margin:0;font-family:SpaceGrotesk_700Bold;font-weight:400;font-size:24px;letter-spacing:-.4px;color:#17151e}
.cl-sheet p{margin:8px 0 22px;font-family:DMSans_400Regular;font-size:15px;line-height:21px;color:#726f80}
.cl-sheet-go{display:grid;place-items:center;height:52px;border-radius:16px;background:#ef4444;font-family:DMSans_700Bold;font-size:16px;color:#fafafe}
.cl-sheet-no{display:grid;place-items:center;height:48px;margin-top:6px;font-family:DMSans_500Medium;font-size:15px;color:#5719b6}
.en{position:absolute;inset:0;background:#fafafe;display:flex;flex-direction:column;align-items:center;padding-top:190px}
.en-ok{display:grid;place-items:center;width:120px;height:120px;border-radius:50%;background:#7e3bed;box-shadow:0 0 0 14px #ebe1fd}
.en-ok svg{width:60px;height:60px;fill:none;stroke:#fafafe;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:20;stroke-dashoffset:20}
.en-t{margin:40px 0 0;font-family:SpaceGrotesk_700Bold;font-size:30px;letter-spacing:-.6px;color:#17151e}
.en-s{margin:10px 0 0;font-family:DMSans_400Regular;font-size:16px;color:#726f80}
.en-docs{margin-top:34px;width:330px;display:flex;flex-wrap:wrap;justify-content:center;gap:10px}
.en-doc{display:flex;flex-direction:column;align-items:center;gap:10px;width:100px;padding:16px 0 14px;border-radius:18px;background:#fff;box-shadow:0 0 0 1px #ebe1fd,0 8px 20px rgba(53,14,111,.07)}
.en-doc i{display:grid;place-items:center;width:44px;height:44px;border-radius:14px;background:#f5f0fe}
.en-doc svg{width:24px;height:24px;fill:none;stroke:#7e3bed;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.en-ai i{background:#22084a}.en-ai svg{stroke:#c6ff34}
.en-doc span{font-family:DMSans_500Medium;font-size:14px;color:#17151e}
.en-n{margin:26px 0 0;font-family:DMSans_500Medium;font-size:15px;color:#5719b6}
.tp{position:absolute;left:1180px;top:170px;width:600px;height:740px;border-radius:32px;background:#fff;box-shadow:0 0 0 1px #ebe1fd,0 30px 60px rgba(53,14,111,.12);font-family:"DM Sans",sans-serif;overflow:hidden;opacity:0}
.tp-head{display:flex;align-items:center;justify-content:space-between;padding:30px 34px 22px;box-shadow:inset 0 -1px 0 #ebe1fd}
.tp-head div{display:flex;flex-direction:column;gap:6px}
.tp-head b{font-family:SpaceGrotesk_700Bold;font-weight:400;font-size:30px;letter-spacing:-.6px;color:#17151e}
.tp-head span{display:flex;align-items:center;gap:8px;font-size:17px;color:#726f80}
.tp-head span i{width:10px;height:10px;border-radius:50%;background:#8cc900}
.tp-head em{padding:8px 14px;border-radius:12px;background:#22084a;font-style:normal;font-weight:700;font-size:17px;color:#c6ff34}
.tp-win{position:absolute;left:0;right:0;top:124px;bottom:176px;overflow:hidden}
.tp-list{margin:0;padding:18px 34px 0;list-style:none;display:flex;flex-direction:column;gap:20px}
.tp-row{display:flex;flex-direction:column;gap:6px;opacity:0}
.tp-meta{display:flex;align-items:baseline;gap:10px}
.tp-meta b{font-weight:700;font-size:17px;color:#5719b6}
.tp-row.pat .tp-meta b{color:#17151e}
.tp-meta em{font-style:normal;font-size:15px;color:#a29fb0;font-variant-numeric:tabular-nums}
.tp-row p{margin:0;font-size:23px;line-height:31px;color:#17151e}
.tp-row p span{opacity:.25}
.tp-row p span.k{background:linear-gradient(transparent 58%,#e4ff94 58%)}
.tp-foot{position:absolute;left:0;right:0;bottom:0;height:176px;padding:24px 34px;background:#f9f8fb;box-shadow:inset 0 1px 0 #ebe1fd}
.tp-foot b{display:block;font-weight:700;font-size:15px;letter-spacing:1.2px;text-transform:uppercase;color:#726f80}
.tp-tags{margin-top:16px;display:flex;flex-wrap:wrap;gap:10px}
.tp-tags span{padding:9px 16px;border-radius:999px;background:#22084a;font-weight:500;font-size:18px;color:#fafafe;opacity:0}
`,
  lib: [dgLife, smLife],
  captions: [
    { title: "Entrando na sala", body: "O app liga **câmera e microfone** e confere a conexão." },
    { title: "A médica ao vivo", body: "Ela já leu **sua anamnese** antes de você entrar." },
    { title: "Legenda ao vivo", body: "Tudo que é dito vira **legenda** na hora." },
    { title: "Sua vez", body: "Quem fala **ganha a tela**. A médica fica no canto." },
    { title: "Receita a caminho", body: "Enquanto conversa, a médica **já prepara seus documentos**." },
    { title: "Encerrar", body: "Toque em **Sair** quando a consulta terminar." },
    { title: "Documentos a caminho", body: "Receita, exames, atestado e prontuário são **assinados e salvos** no app." },
    { title: "Consulta concluída", body: "Diagnóstico, remédios e afastamento num **resumo rápido**." },
  ],
  frame: {
    title: "Consulta por vídeo",
    scene: "Entrada na sala, chamada de vídeo com a Dra. Camila e a paciente Ana revezando a tela, legenda ao vivo, painel de transcrição com destaques da IA ao lado do iPhone, aviso de receita, folha de encerramento e documentos",
    poster: 16,
    motion: "sequenced-ui-life (anel, checks, rede), real doctor + patient footage, speaker swap FLIP, karaoke captions, live transcript panel with scroll, cursor-led action, confetti on end",
    body: "Título central. O iPhone abre em “Entrando na sala”: anel lima, câmera, microfone e conexão criptografada. A chamada abre com a Dra. Camila falando e Ana no canto; a câmera se afasta, o iPhone vai para a esquerda e o painel Transcrição ao vivo entra à direita, palavra por palavra. Quando Ana responde, os vídeos trocam de lugar. A médica volta, um aviso “Receita em preparo” desce e a IA destaca os pontos. Toque em Sair, folha “Encerrar a consulta?”, Encerrar consulta, e a tela “Consulta encerrada” com receita, atestado, exames, transcrição e análise IA.",
  },
  run: function (S) {
    var D = DATA;
    S.boot("chamando");
    var jn = S.layer("join");
    gsap.set(jn, { autoAlpha: 1 });
    S.status(0, true, { dur: 0.01 });
    var ring = S.one(".fg", jn);
    var titles = S.all(".jn-t span", jn);
    var dots = S.all(".jn-steps i", jn);
    var checks = S.all(".jn-steps path", jn);
    var rows = S.all(".jn-steps li", jn);
    var bars = S.all(".jn-net u", jn);
    gsap.set(titles[1], { opacity: 0 });
    rows.forEach(function (r) {
      gsap.set(r, { opacity: 0.35 });
    });
    S.introIn(0.05);
    S.introOut(2.8);
    var j0 = 3.3;
    S.cam(j0 - 0.2, { x: 201, y: 420, zoom: 1.45 }, 1.0);
    S.caption(j0 + 0.3, 0, { at: S.rect(S.one(".jn-pic", jn)) });
    S.add(function (tl) {
      var t = j0;
      tl.fromTo(ring, { strokeDashoffset: 578.05 }, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut", immediateRender: false }, t);
      rows.forEach(function (r, i) {
        var at = t + 0.4 + i * 0.6;
        tl.to(r, { opacity: 1, duration: 0.2, ease: "none" }, at - 0.15);
        tl.to(dots[i], { backgroundColor: "#c6ff34", duration: 0.2, ease: "none" }, at);
        tl.fromTo(dots[i], { scale: 0.7 }, { scale: 1, duration: 0.4, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, at);
        tl.to(checks[i], { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, at + 0.08);
      });
      bars.forEach(function (b, i) {
        tl.to(b, { backgroundColor: "#c6ff34", duration: 0.12, ease: "none" }, t + 1.7 + i * 0.1);
      });
      tl.to(titles[0], { opacity: 0, y: -14, duration: 0.2, ease: "power2.in" }, t + 2.25);
      tl.fromTo(titles[1], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out", immediateRender: false }, t + 2.4);
    });

    var cl = S.layer("call");
    var fDoc = S.one(".cl-doc", cl);
    var fPat = S.one(".cl-pat", cl);
    var names = [S.one(".cl-doc .cl-f-name", cl), S.one(".cl-pat .cl-f-name", cl)];
    var FULL = { left: 0, top: 0, width: 402, height: 874, borderRadius: 0 };
    var PIP = { left: 274, top: 118, width: 112, height: 152, borderRadius: 18 };
    gsap.set(fDoc, Object.assign({ zIndex: 1 }, FULL));
    gsap.set(fPat, Object.assign({ zIndex: 2, boxShadow: "0 10px 24px rgba(0,0,0,.35)" }, PIP));
    gsap.set(names[1], { opacity: 1 });
    var pstA = S.one(".cl-pst-a", cl);
    var pstB = S.one(".cl-pst-b", cl);
    var docEnd = S.one(".cl-doc-end", cl);
    gsap.set([pstB, docEnd], { autoAlpha: 0 });
    var VA = D.VA;
    S.layerIn(VA - 0.45, "call", { from: "zoom", dur: 0.5 });
    S.layerOut(VA + 0.1, "join", { dur: 0.01 });
    S.add(function (tl) {
      tl.set(pstA, { autoAlpha: 0 }, D.IDLE_A);
      tl.set(pstB, { autoAlpha: 1 }, D.IDLE_B_END);
      tl.set(docEnd, { autoAlpha: 1 }, D.END);
    });
    S.captionOut(VA - 0.5);
    S.cam(VA - 0.45, { x: 201, y: 437, zoom: 1.28 }, 0.8);
    S.caption(VA + 0.6, 1, { at: { x: 40, y: 200, w: 320, h: 380, cx: 200, cy: 390 }, side: "left" });

    var time = S.one(".cl-time", cl);
    S.count(VA, time, 0, D.END - VA + 0.4, function (v) {
      var s = Math.floor(v);
      return "00:" + (s < 10 ? "0" + s : s);
    }, D.END - VA + 0.4);

    var cues = S.all(".cl-cue", cl);
    var tpRows = S.all(".tp-row");
    var tp = S.one(".tp");
    var tpList = S.one(".tp-list");
    var hud = S.one(".vmk-hud");
    hud.insertBefore(tp, hud.firstChild);
    var winH = S.one(".tp-win").getBoundingClientRect().height;
    S.add(function (tl) {
      D.CUES.forEach(function (c, i) {
        var s = VA + c.start;
        var e = VA + c.end;
        var el = cues[i];
        var ws = Array.prototype.slice.call(el.querySelectorAll("p span"));
        tl.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out", immediateRender: false }, s - 0.15);
        tl.to(el, { opacity: 0, duration: 0.15, ease: "none" }, e);
        var row = tpRows[i];
        var rws = Array.prototype.slice.call(row.querySelectorAll("p span"));
        tl.fromTo(row, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out", immediateRender: false }, s - 0.1);
        c.words.forEach(function (wt, k) {
          tl.to([ws[k], rws[k]], { opacity: 1, duration: 0.12, ease: "none" }, VA + wt);
        });
        var bottom = row.offsetTop + row.offsetHeight + 24;
        var shift = Math.max(0, bottom - winH);
        if (shift > 0) tl.to(tpList, { y: -shift, duration: 0.5, ease: "power3.inOut" }, s - 0.2);
      });
    });

    var panelIn = VA + 3.0;
    S.cam(panelIn, { x: 201, y: 437, zoom: 1.05, ax: 760 }, 1.1);
    S.add(function (tl) {
      tl.fromTo(tp, { opacity: 0, x: 140 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", immediateRender: false }, panelIn + 0.3);
    });
    var cc = S.one(".cl-cc", cl);
    S.caption(panelIn + 1.6, 2, { at: S.rect(cc), side: "left" });

    function swap(t, toPat) {
      var big = toPat ? fPat : fDoc;
      var small = toPat ? fDoc : fPat;
      S.add(function (tl) {
        tl.set(small, { zIndex: 2 }, t);
        tl.set(big, { zIndex: 1 }, t);
        tl.to(small, Object.assign({ duration: 0.55, ease: "power3.inOut", boxShadow: "0 10px 24px rgba(0,0,0,.35)" }, PIP), t);
        tl.to(big, Object.assign({ duration: 0.55, ease: "power3.inOut", boxShadow: "0 0 0 rgba(0,0,0,0)" }, FULL), t);
        tl.to(toPat ? names[0] : names[1], { opacity: 1, duration: 0.2, ease: "none" }, t + 0.4);
        tl.to(toPat ? names[1] : names[0], { opacity: 0, duration: 0.15, ease: "none" }, t);
      });
    }
    swap(D.P - 0.35, true);
    S.caption(D.P + 0.5, 3, { at: { x: 40, y: 240, w: 320, h: 360, cx: 200, cy: 420 }, side: "left" });
    swap(D.B - 0.35, false);

    var tags = S.all(".tp-tags span");
    var tagAt = [VA + 7.2, VA + 9.2, D.P + 1.4, D.P + 6.0];
    S.add(function (tl) {
      tags.forEach(function (tg, i) {
        tl.fromTo(tg, { opacity: 0, y: 12, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out", immediateRender: false, transformOrigin: "0% 50%" }, tagAt[i]);
      });
    });

    var toast = S.one(".cl-toast", cl);
    var rx = VA + D.CUES[5].words[5] - 0.1;
    S.add(function (tl) {
      tl.fromTo(toast, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, rx);
      Array.prototype.slice.call(toast.querySelectorAll("u b")).forEach(function (b, i) {
        for (var k = 0; k < 6; k++) tl.fromTo(b, { y: 0 }, { y: -4, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1, immediateRender: false }, rx + 0.4 + k * 0.5 + i * 0.12);
      });
      tl.to(toast, { opacity: 0, y: -20, duration: 0.3, ease: "power2.in" }, rx + 4.2);
    });
    S.caption(rx + 0.4, 4, { at: S.rect(toast), side: "left" });

    var end = S.one(".cl-end", cl);
    var e0 = D.END - 1.4;
    S.caption(e0, 5, { at: S.rect(end), side: "left" });
    S.cursorEnter(e0 + 0.2, end, 0.6);
    S.click(e0 + 1.1, end, { press: true });
    var sheet = S.one(".cl-sheet", cl);
    var go = S.one(".cl-sheet-go", cl);
    var s0 = e0 + 1.25;
    S.add(function (tl) {
      tl.to(S.one(".cl-dim", cl), { opacity: 1, duration: 0.3, ease: "none" }, s0);
      tl.fromTo(sheet, { y: 420 }, { y: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, s0);
    });
    S.status(s0, false, { dur: 0.2 });
    S.cam(s0, { x: 201, y: 700, zoom: 1.3, ax: 760 }, 0.7);
    S.cursorTo(s0 + 0.6, go, 0.5);
    S.click(s0 + 1.3, go, { press: true });
    var x0 = s0 + 1.5;
    S.captionOut(x0 - 0.1);
    S.add(function (tl) {
      tl.to(tp, { opacity: 0, x: 120, duration: 0.5, ease: "power3.in" }, x0);
    });
    var dg = S.layer("dg");
    var sm = S.layer("sm");
    S.layerIn(x0, "dg", { from: "zoom", dur: 0.5 });
    S.cursorExit(x0 + 0.2, "down", 0.4);
    var dl = dgLife(S, dg, x0 + 0.3);
    S.cam(x0, { x: 201, y: 460, zoom: 1.35 }, 0.9);
    S.caption(x0 + 1.4, 6, { at: S.rect(S.all(".dg-doc", dg)[0]), side: "right" });
    var y0 = dl.fin + 1.2;
    S.captionOut(y0 - 0.1);
    S.layerIn(y0, "sm", { from: "zoom", dur: 0.5 });
    S.layerOut(y0 + 0.45, "dg", { dur: 0.01 });
    var sl = smLife(S, sm, y0 + 0.2);
    S.cam(y0, { x: 201, y: 430, zoom: 1.35 }, 0.9);
    S.confetti(y0 + 0.5, { x: 201, y: 180, cx: 201, cy: 180 }, { count: 60, seed: 29, power: 0.8 });
    S.caption(y0 + 1.5, 7, { at: S.rect(S.one(".sm-dx", sm)), side: "right" });
    var go2 = S.one(".sm-cta", sm);
    var z0 = sl.fin + 1.8;
    S.cam(z0 - 0.2, { x: 201, y: 620, zoom: 1.4 }, 0.8);
    S.cursorEnter(z0, go2, 0.5);
    S.click(z0 + 0.7, go2, { press: true });
    S.captionOut(z0 + 0.7);
    S.note("ended", z0 + 0.85);
  },
};
