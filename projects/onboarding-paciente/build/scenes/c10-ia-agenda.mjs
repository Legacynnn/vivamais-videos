import { up, hold } from "../parts/ob.mjs";
import { illSvg, illIn, ILL_CSS } from "../parts/illus.mjs";
import { anSwap, anPlay } from "../parts/an.mjs";

const B = "font-family:DMSans_700Bold";
const R = "font-family:DMSans_400Regular";
const slot = (h) => `<div data-slot="${h}" style="flex:1;height:40px;border-radius:12px;border:1.5px solid #e4dcf7;background:#fff;display:flex;align-items:center;justify-content:center;${B};font-size:15px;color:#5719b6">${h}</div>`;
const SPARK = `<svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z" fill="#22084a"/></svg>`;
const SKIN = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22084a" stroke-width="2" stroke-linecap="round"><path d="M7 21V9.5a2 2 0 0 1 4 0V8a2 2 0 0 1 4 0v1a2 2 0 0 1 4 0v6a6 6 0 0 1-6 6H7z"/><circle cx="11" cy="15" r="1.2" fill="#22084a"/><circle cx="15" cy="13" r="1" fill="#22084a"/><circle cx="14" cy="17.5" r=".9" fill="#22084a"/></svg>`;

const REC = `<div data-ai-rec style="margin:12px 0 6px;border-radius:22px;background:#fff;border:1px solid #ebe8f3;box-shadow:0 6px 18px rgba(34,8,74,.08);overflow:hidden">
<div data-ai-spec style="display:flex;flex-direction:row;align-items:center;gap:10px;padding:12px 14px;background:#f6f2ff;border-bottom:1px solid #eee8fa">
<div style="width:36px;height:36px;border-radius:12px;background:#c6ff34;display:flex;align-items:center;justify-content:center">${SKIN}</div>
<div style="flex:1"><div style="${R};font-size:12px;line-height:15px;color:#726f80">Especialidade indicada</div><div style="${B};font-size:16px;line-height:21px;color:#0d0c12">Dermatologia</div></div>
<div style="display:flex;flex-direction:row;align-items:center;gap:4px;padding:4px 9px;border-radius:999px;background:#c6ff34;${B};font-size:11.5px;color:#22084a">${SPARK}pela IA</div>
</div>
<div data-ai-doc style="display:flex;flex-direction:row;align-items:center;gap:12px;padding:12px 14px">
<img src="assets/doctors/julia-d.png" alt="" style="width:52px;height:52px;border-radius:15px;object-fit:cover;flex:none">
<div style="flex:1;min-width:0"><div style="${B};font-size:15.5px;line-height:20px;color:#0d0c12">Dra. Júlia Andrade</div><div style="${R};font-size:13px;line-height:18px;color:#726f80">Dermatologista · ★ 4,9</div></div>
<div style="text-align:right;flex:none"><div style="${B};font-size:15.5px;line-height:20px;color:#0d0c12">R$ 135</div><div style="${R};font-size:11.5px;color:#a29fb0;text-decoration:line-through">R$ 180</div></div>
</div>
<div data-ai-day style="padding:0 14px 8px;${B};font-size:12.5px;color:#726f80">Quarta, 7 de outubro</div>
<div data-ai-slots style="display:flex;flex-direction:row;gap:8px;padding:0 14px 12px">${["09:30", "10:00", "11:30", "14:00"].map(slot).join("")}</div>
<div data-ai-go style="margin:0 14px 14px;height:48px;border-radius:14px;background:#d9cdf5;display:flex;align-items:center;justify-content:center;${B};font-size:16px;color:#fff">Agendar e pagar · R$ 135</div>
</div>`;

function inject(html) {
  const i = html.indexOf("levo você para o pagamento:");
  const j = html.indexOf("</div></div></div>", i) + "</div></div></div>".length;
  return html.slice(0, j) + REC + html.slice(j);
}

export default {
  id: "c10-ia-agenda",
  device: "iphone",
  title: "A IA marca para você",
  lines: ["A IA marca", "para você"],
  lead: "Conte o que sente. A IA indica a especialidade, o médico e o horário.",
  tail: 0.8,
  states: [["ia-home", 0], ["ia-book-typed", 0], ["ia-book-thinking", 0], ["ia-book-done", 0], ["ij-checkout", 0], ["ij-pix", 0], ["ij-ok", 0], ["ij-hub", 0], ["ij-motivo", 0], ["ij-revisao", 0], ["ij-enviada", 0]],
  patch: (name, html) => (name === "ia-book-done" ? inject(html) : html),
  lib: [up, hold, illSvg, illIn, anSwap, anPlay],
  css: ILL_CSS,
  captions: [
    { title: "Conte o que você sente", body: "Escreva do seu jeito: **“manchas no braço que coçam”**." },
    { title: "A IA indica a especialidade", body: "Ela entende que o certo é **dermatologia**." },
    { title: "Médica e horários no chat", body: "A IA já mostra **quem atende** e os horários livres." },
    { title: "Escolha o horário", body: "Toque no horário e em **Agendar e pagar**." },
    { title: "Direto para o pagamento", body: "Já com o **desconto do plano**. Pague com Pix." },
    { title: "Consulta marcada", body: "Agora é só **preencher a anamnese**." },
    { title: "Tudo pronto!", body: "Da conversa à consulta marcada, **em poucos toques**." },
  ],
  frame: {
    title: "A IA marca para você",
    scene: "Sintoma descrito no chat da IA, especialidade indicada, médica e horários dentro da conversa, direto para o pagamento Pix e anamnese",
    poster: 14,
    motion: "chapter title cascade, phone rise, live typing, streaming answer, inline recommendation card cascade, slot select, confetti",
    body: "“Tenho manchas vermelhas no braço que coçam. Com quem eu marco?” A IA indica dermatologia e a Dra. Júlia Andrade, com horários de quarta no próprio chat. 09:30 → Agendar e pagar → pagamento com desconto → Pix → consulta marcada → anamnese → enviada.",
  },
  run: function (S) {
    var wide = function (n) { return n.getBoundingClientRect().width > 300; };
    var A = anSwap(S, { "ij-motivo": "motivo" }, [
      ["ij-hub", /^O que está acontecendo$/, "motivo"],
      ["ij-hub", /^Marque no corpo$/, "dor"],
      ["ij-hub", /^Início e evolução$/, "tempo"],
      ["ij-hub", /^Exames, receitas ou fotos$/, "anexos"],
      ["ij-hub", /^medicamentos e alergias$/i, "contexto"],
    ]);
    S.boot("ia-home");
    try {
      up(S.pick("ia-home", "Dermatologista esta semana", { sel: "*" }), 36).style.visibility = "hidden";
    } catch (e) {}
    S.introIn(0.05);
    S.introOut(2.9);
    S.cam(3.0, { x: 201, y: 437, zoom: 1.6 }, 0.01);
    var t = 3.8;
    var ta = S.one("textarea", S.state("ia-home")) || S.one("input", S.state("ia-home"));
    S.cam(t, { x: 201, y: 230, zoom: 2.0 }, 1.0);
    S.caption(t, 0);
    S.cursorTo(t + 1.0, ta, 0.5);
    S.click(t + 1.6, ta);
    t = S.type(t + 1.8, ta, "Tenho manchas vermelhas no braço que coçam. Com quem eu marco?", { cps: 16 });
    S.show(t + 0.3, "ia-book-typed", { fade: 0.3 });
    var send = S.one('[aria-label="Enviar pergunta"]', S.state("ia-book-typed"));
    S.cursorTo(t + 0.7, send, 0.5);
    S.click(t + 1.3, send, { press: true });
    t = S.nav(t + 1.5, "ia-book-thinking");
    S.cam(t, { x: 201, y: 437, zoom: 1.6 }, 1.0);
    S.show(t + 1.4, "ia-book-done", { fade: 0.5 });
    t += 1.9;
    var st = S.state("ia-book-done");
    var spec = S.one("[data-ai-spec]", st);
    var doc = S.one("[data-ai-doc]", st);
    var rec = S.one("[data-ai-rec]", st);
    var slots = S.all("[data-slot]", st);
    var go = S.one("[data-ai-go]", st);
    S.rows(t + 0.3, [spec, doc, S.one("[data-ai-day]", st), S.one("[data-ai-slots]", st), go], { stagger: 0.25, dur: 0.55, y: 22 });
    S.cam(t + 0.2, { x: 201, y: 470, zoom: 1.85 }, 1.1);
    S.caption(t + 0.2, 1);
    S.mark(t + 1.3, spec, { hold: 2.0, pad: 4, radius: 20 });
    t += 3.5;
    S.caption(t, 2);
    S.cam(t, { x: 201, y: 560, zoom: 1.85 }, 1.0);
    S.mark(t + 0.6, doc, { hold: 1.8, pad: 4, radius: 18 });
    t += 2.6;
    S.caption(t, 3);
    var pick = slots[0];
    S.cursorTo(t + 0.6, pick, 0.5);
    S.click(t + 1.2, pick, { press: true });
    (function (at) {
      S.add(function (tl) {
        tl.to(pick, { backgroundColor: "#7e3bed", borderColor: "#7e3bed", color: "#ffffff", duration: 0.25, ease: "power2.out" }, at);
        tl.fromTo(pick, { scale: 1 }, { scale: 0.92, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1, immediateRender: false }, at);
        tl.to(slots.slice(1), { opacity: 0.5, duration: 0.3 }, at);
        tl.to(go, { backgroundColor: "#7e3bed", duration: 0.3, ease: "power2.out" }, at + 0.15);
        tl.fromTo(go, { scale: 1 }, { scale: 1.04, duration: 0.16, ease: "power2.out", yoyo: true, repeat: 1, immediateRender: false }, at + 0.15);
      });
    })(t + 1.3);
    S.cursorTo(t + 2.2, go, 0.5);
    S.click(t + 2.8, go, { press: true });
    t = S.nav(t + 3.0, "ij-checkout");
    S.cam(t, { x: 201, y: 300, zoom: 1.85 }, 1.0);
    S.caption(t - 0.2, 4);
    var tot = up(S.pick("ij-checkout", "Total a pagar"), 120, wide);
    S.mark(t + 0.8, tot, { hold: 2.2, pad: 4, radius: 24 });
    var pix = up(S.pick("ij-checkout", "Pix"), 50, wide);
    S.cam(t + 3.2, { x: 201, y: 600, zoom: 1.8 }, 1.0);
    S.cursorTo(t + 3.8, pix, 0.5);
    S.click(t + 4.4, pix, { press: true });
    t = S.nav(t + 4.6, "ij-pix");
    S.cam(t, { x: 201, y: 520, zoom: 1.6 }, 1.0);
    t += 2.6;
    t = S.nav(t, "ij-ok", { kind: "fade", dur: 0.7 });
    var okt = S.pick("ij-ok", "Sua consulta está marcada.", { sel: "*" });
    S.cam(t, { x: 201, y: 437, zoom: 1.6 }, 1.0);
    S.confetti(t + 0.3, S.rect(okt), { count: 40, seed: 13, power: 0.6 });
    S.caption(t + 0.3, 5);
    var fill = S.pick("ij-ok", "Preencher anamnese");
    S.cursorTo(t + 2.2, fill, 0.45);
    S.click(t + 2.7, fill, { press: true });
    t = S.nav(t + 2.9, "ij-hub");
    anPlay(S, A, "ij-hub", t - 0.35);
    var start = S.pick("ij-hub", "Começar");
    S.cursorTo(t + 1.6, start, 0.5);
    S.click(t + 2.2, start, { press: true });
    t = S.nav(t + 2.4, "ij-motivo");
    anPlay(S, A, "ij-motivo", t - 0.35);
    var tx = S.one("textarea", S.state("ij-motivo"));
    S.cam(t, { x: 201, y: 320, zoom: 1.9 }, 1.0);
    t = S.type(t + 0.6, tx, "Manchas vermelhas no braço que coçam há 2 semanas.", { cps: 18 });
    t = S.nav(t + 0.6, "ij-revisao");
    S.cam(t, { x: 201, y: 437, zoom: 1.6 }, 1.0);
    var sendA = S.pick("ij-revisao", /^Enviar/, { last: true });
    S.cursorTo(t + 1.2, sendA, 0.5);
    S.click(t + 1.8, sendA, { press: true });
    t = S.nav(t + 2.0, "ij-enviada", { kind: "fade", dur: 0.6 });
    anPlay(S, A, "ij-enviada", t - 0.3);
    var sent = S.pick("ij-enviada", "Anamnese enviada", { sel: "*" });
    S.confetti(t + 0.2, S.rect(sent), { count: 46, seed: 17, power: 0.7 });
    S.caption(t + 0.3, 6);
    hold(S, t + 3.2);
  },
};
