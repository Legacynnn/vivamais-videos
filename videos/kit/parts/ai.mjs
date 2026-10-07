import { CUES, WHO } from "./talk.mjs";

const I = (d) => `<svg viewBox="0 0 28 28" fill="none">${d}</svg>`;
const K = 'stroke="#17151e" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"';

const ICO = {
  pill: I(`<path d="M14 5.6a5.2 5.2 0 0 1 7.4 7.4L14 20.4z" fill="#c6ff34"/><rect x="2.6" y="10.4" width="22.8" height="10.4" rx="5.2" transform="rotate(-45 14 15.6)" ${K}/><path d="M10.3 9.3l7.4 7.4" ${K}/>`),
  moon: I(`<path d="M20.5 17.8A8.5 8.5 0 0 1 10.2 7.5a8.5 8.5 0 1 0 10.3 10.3z" fill="#ebe1fd" ${K}/><path d="M19 5.5v3M17.5 7h3" ${K}/>`),
  eye: I(`<path d="M3 14s4-7 11-7 11 7 11 7-4 7-11 7S3 14 3 14z" fill="#ebe1fd" ${K}/><circle cx="14" cy="14" r="3.4" fill="#c6ff34" ${K}/>`),
  drop: I(`<path d="M14 4s7 7.6 7 12.2a7 7 0 0 1-14 0C7 11.6 14 4 14 4z" fill="#ebe1fd" ${K}/><path d="M11 17a3 3 0 0 0 3 3" ${K}/>`),
  flask: I(`<path d="M8.2 19.2h11.6l2.3 4.1H5.9z" fill="#c6ff34"/><path d="M11 4.5v7.2L5 22a1.3 1.3 0 0 0 1.1 1.9h15.8A1.3 1.3 0 0 0 23 22l-6-10.3V4.5M9.4 4.5h9.2" ${K}/>`),
  warn: I(`<path d="M14 4.5l10 17.5H4z" fill="#fee2e2" stroke="#b91c1c" stroke-width="1.9" stroke-linejoin="round"/><path d="M14 11v5" stroke="#b91c1c" stroke-width="2.2" stroke-linecap="round"/><circle cx="14" cy="19" r="1.3" fill="#b91c1c"/>`),
  spark: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" fill="#c6ff34" stroke="#17151e" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#17151e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5" stroke="#fafafe" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="#726f80" stroke-width="2"/><path d="M16 16l4 4" stroke="#726f80" stroke-width="2" stroke-linecap="round"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 3h7l4 4v14H7z" stroke="#5719b6" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 3v4h4M9.5 12h5M9.5 16h5" stroke="#5719b6" stroke-width="1.8" stroke-linecap="round"/></svg>',
};

const STEPS = [
  ["pill", "Dipirona 500 mg", "1 comprimido a cada 6 h, se dor · até 2 out", "toggle"],
  ["moon", "Ciclobenzaprina 5 mg", "1 comprimido à noite · 5 dias", "toggle"],
  ["eye", "Pausas de tela", "A cada 20 min, olhe 20 s para longe", ""],
  ["drop", "Hidratação", "2 litros de água por dia", ""],
  ["flask", "Exames até 6 out", "Hemograma e glicemia · jejum de 8 h", "btn"],
];

const clean = (s) => s.replace(/^\*/, "");

export const AI_HTML = `<div class="ai">
<div class="ai-top"><div class="ai-back">${ICO.back}</div><div class="ai-ttl"><b>Análise da consulta</b><span>Dra. Camila · 29 set · 14 min</span></div></div>
<div class="ai-seg"><u></u><span>Análise IA</span><span>Transcrição</span></div>
<div class="ai-pages">
<div class="ai-page ai-pa"><div class="ai-in">
<div class="ai-src">${ICO.spark}<span>Feita com sua anamnese, a conversa e 3 documentos</span></div>
<div class="ai-load"><div class="ai-load-steps"><span><i></i>Lendo sua anamnese</span><span><i></i>Lendo a conversa</span><span><i></i>Cruzando os documentos</span></div><div class="ai-sk"><u style="width:92%"></u><u style="width:100%"></u><u style="width:74%"></u></div><div class="ai-sk ai-sk2"><u style="width:60%"></u><u style="width:84%"></u></div></div>
<div class="ai-body">
<h3 class="ai-h">Em resumo</h3>
<p class="ai-sum">Você teve uma <b>cefaleia tensional</b>, sem sinais de alarme. A dor piora com telas e não melhorou só com dipirona.</p>
<h3 class="ai-h">O que fazer agora</h3>
<ol class="ai-steps">${STEPS.map(([ic, t, s, x]) => `<li><i>${ICO[ic]}</i><div><b>${t}</b><span>${s}</span></div>${x === "toggle" ? '<em class="ai-tg"><u></u></em>' : x === "btn" ? '<em class="ai-btn">Agendar</em>' : ""}</li>`).join("")}</ol>
<div class="ai-warn"><div class="ai-warn-h">${ICO.warn}<b>Volte ao plantão se tiver</b></div><ul><li>Febre acima de 38 °C</li><li>Rigidez no pescoço</li><li>Visão turva ou dor súbita muito forte</li></ul></div>
</div>
</div></div>
<div class="ai-page ai-pb"><div class="ai-in">
<div class="ai-search">${ICO.search}<span>Buscar na conversa</span></div>
<div class="ai-meta">14 min · 2 participantes · gravada com consentimento</div>
<ul class="ai-tr">${CUES.map((c) => `<li class="${c.who}"><div class="ai-tr-m"><b>${WHO[c.who]}</b><em>${c.stamp}</em></div><p>${c.words.map(([, w]) => `<span${w.startsWith("*") ? ' class="k"' : ""}>${clean(w)}</span>`).join(" ")}</p>${c.words.some(([, w]) => w === "*receita") ? `<div class="ai-link">${ICO.doc}<span>Receita simples</span></div>` : ""}</li>`).join("")}</ul>
</div></div>
</div>
<div class="ai-scan"><i class="ai-scan-sp"></i><span class="ai-scan-t"><b>Buscando na transcrição…</b><b>Lendo a receita simples…</b><b>Conferindo o plano de cuidado…</b></span></div>
<div class="ai-ans"><div class="ai-ans-h">${ICO.spark}<b>IA Viva Mais</b><u><i></i><i></i><i></i></u></div><p class="ai-ans-p1">Pode, sim. Café não interfere na dipirona. Só respeite o intervalo de 6 horas entre as doses.</p><p class="ai-ans-p2">Se a dor voltar forte, tome a dipirona conforme a receita e faça pausas de tela. Se vier com febre acima de 38 °C ou rigidez no pescoço, volte ao plantão.</p><div class="ai-src-line"><span class="ai-src-a">${ICO.search}Transcrição · 00:12</span><span class="ai-src-b">${ICO.doc}Receita simples</span><span class="ai-src-c">${ICO.warn}Sinais de alerta</span></div></div>
<div class="ai-ask"><div class="ai-chips"><span>Posso tomar com café?</span><span>E se a dor voltar?</span></div><div class="ai-field"><span class="ai-q">Pergunte sobre sua consulta</span><i>${ICO.send}</i></div></div>
</div>`;

export const AI_CSS = `
.ai-scan{position:absolute;left:20px;right:20px;bottom:150px;display:flex;align-items:center;gap:10px;height:44px;padding:0 14px;border-radius:14px;background:#22084a;color:#fafafe;font-family:DMSans_500Medium;font-size:13px;opacity:0;box-shadow:0 12px 30px rgba(34,8,74,.3)}
.ai-scan-sp{flex:none;width:16px;height:16px;border-radius:50%;border:2.5px solid rgba(250,250,254,.25);border-top-color:#c6ff34}
.ai-scan-t{position:relative;flex:1;height:18px}
.ai-scan-t b{position:absolute;left:0;top:0;font-weight:400;white-space:nowrap;opacity:0}
.ai-ans-p2{display:none}
.ai-src-line{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.ai-src-line span{display:inline-flex;align-items:center;gap:5px;padding:4px 8px;border-radius:999px;background:#f3edff;font-family:DMSans_500Medium;font-size:11px;color:#5719b6;opacity:0}
.ai-src-line svg{width:12px;height:12px}
.ai-tr li p span.hit{background:#e4ff94;border-radius:4px;box-shadow:0 0 0 2px #e4ff94}

.ai{position:absolute;inset:0;background:#fafafe;overflow:hidden}
.ai *{box-sizing:border-box}
.ai-top{position:absolute;left:0;right:0;top:62px;height:56px;display:flex;align-items:center;gap:6px;padding:0 16px 0 8px}
.ai-back{display:grid;place-items:center;width:44px;height:44px}
.ai-back svg{width:24px;height:24px}
.ai-ttl{display:flex;flex-direction:column;gap:2px}
.ai-ttl b{font-family:DMSans_700Bold;font-weight:400;font-size:17px;color:#17151e}
.ai-ttl span{font-family:DMSans_400Regular;font-size:13px;color:#726f80}
.ai-seg{position:absolute;left:20px;right:20px;top:126px;height:44px;border-radius:14px;background:#f2f1f6;display:flex;padding:4px}
.ai-seg span{position:relative;z-index:1;flex:1;display:grid;place-items:center;font-family:DMSans_500Medium;font-size:15px;color:#403d4a}
.ai-seg u{position:absolute;left:4px;top:4px;width:calc(50% - 4px);height:36px;border-radius:11px;background:#fff;box-shadow:0 1px 3px rgba(23,21,30,.12)}
.ai-pages{position:absolute;left:0;right:0;top:182px;bottom:0;overflow:hidden}
.ai-page{position:absolute;left:0;top:0;width:402px;bottom:0;overflow:hidden}
.ai-pb{transform:translateX(402px)}
.ai-in{position:absolute;left:0;top:0;width:402px;padding:6px 20px 200px}
.ai-src{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:14px;background:#22084a;font-family:DMSans_500Medium;font-size:13px;color:#ebe1fd}
.ai-src svg{flex:none;width:18px;height:18px}
.ai-load{position:absolute;left:20px;right:20px;top:66px}
.ai-load-steps{display:flex;flex-direction:column;gap:12px}
.ai-load-steps span{display:flex;align-items:center;gap:10px;font-family:DMSans_500Medium;font-size:15px;color:#403d4a}
.ai-load-steps i{width:18px;height:18px;border-radius:50%;box-shadow:inset 0 0 0 2.5px #d6c3fb}
.ai-sk{margin-top:26px;display:flex;flex-direction:column;gap:10px}
.ai-sk u{display:block;height:14px;border-radius:7px;background:linear-gradient(90deg,#f2f1f6 0%,#ebe1fd 50%,#f2f1f6 100%);background-size:300px 100%}
.ai-sk2{margin-top:30px}
.ai-body{opacity:0}
.ai-h{margin:22px 0 8px;font-family:SpaceGrotesk_700Bold;font-weight:400;font-size:21px;letter-spacing:-.3px;color:#17151e}
.ai-sum{margin:0;font-family:DMSans_400Regular;font-size:16px;line-height:24px;color:#403d4a}
.ai-sum b{font-family:DMSans_700Bold;font-weight:400;color:#17151e}
.ai-steps{margin:0;padding:0;list-style:none}
.ai-steps li{display:flex;align-items:center;gap:14px;min-height:66px;box-shadow:inset 0 -1px 0 #e6e4ec}
.ai-steps li>i{flex:none;width:28px;height:28px}
.ai-steps li>i svg{width:28px;height:28px}
.ai-steps li>div{flex:1;display:flex;flex-direction:column;gap:3px}
.ai-steps b{font-family:DMSans_500Medium;font-weight:400;font-size:16px;color:#17151e}
.ai-steps span{font-family:DMSans_400Regular;font-size:13px;color:#726f80}
.ai-tg{position:relative;flex:none;width:44px;height:26px;border-radius:13px;background:#e6e4ec}
.ai-tg u{position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(23,21,30,.25)}
.ai-btn{flex:none;padding:7px 12px;border-radius:12px;background:#f3edff;font-style:normal;font-family:DMSans_700Bold;font-size:13px;color:#5719b6}
.ai-warn{margin-top:22px;padding:16px;border-radius:20px;background:#fef2f2;box-shadow:inset 0 0 0 1px #fecaca}
.ai-warn-h{display:flex;align-items:center;gap:10px}
.ai-warn-h svg{width:24px;height:24px}
.ai-warn-h b{font-family:DMSans_700Bold;font-weight:400;font-size:16px;color:#7f1d1d}
.ai-warn ul{margin:10px 0 0;padding:0 0 0 34px;display:flex;flex-direction:column;gap:6px;font-family:DMSans_400Regular;font-size:14px;color:#7f1d1d}
.ai-search{display:flex;align-items:center;gap:10px;height:46px;padding:0 14px;border-radius:14px;background:#f2f1f6;font-family:DMSans_400Regular;font-size:15px;color:#726f80}
.ai-search svg{width:20px;height:20px}
.ai-meta{margin:12px 0 4px;font-family:DMSans_400Regular;font-size:13px;color:#726f80}
.ai-tr{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:14px}
.ai-tr li{display:flex;flex-direction:column;gap:4px;max-width:318px;padding:12px 14px;border-radius:18px 18px 18px 6px;background:#fff;box-shadow:0 0 0 1px #ebe1fd}
.ai-tr li.pat{align-self:flex-end;border-radius:18px 18px 6px 18px;background:#f3edff;box-shadow:none}
.ai-tr-m{display:flex;align-items:baseline;gap:8px}
.ai-tr-m b{font-family:DMSans_700Bold;font-weight:400;font-size:13px;color:#5719b6}
.ai-tr li.pat .ai-tr-m b{color:#17151e}
.ai-tr-m em{font-style:normal;font-family:DMSans_400Regular;font-size:12px;color:#a29fb0}
.ai-tr p{margin:0;font-family:DMSans_400Regular;font-size:15px;line-height:21px;color:#17151e}
.ai-tr span.k{background:linear-gradient(transparent 58%,#e4ff94 58%)}
.ai-link{display:flex;align-items:center;gap:6px;margin-top:6px;align-self:flex-start;padding:6px 10px;border-radius:10px;background:#f3edff;font-family:DMSans_500Medium;font-size:13px;color:#5719b6}
.ai-link svg{width:16px;height:16px}
.ai-ans{position:absolute;left:16px;right:16px;bottom:150px;padding:14px 16px;border-radius:20px 20px 20px 6px;background:#fff;box-shadow:0 0 0 1px #ebe1fd,0 16px 36px rgba(53,14,111,.14);opacity:0;z-index:2}
.ai-ans-h{display:flex;align-items:center;gap:8px}
.ai-ans-h svg{width:18px;height:18px}
.ai-ans-h b{font-family:DMSans_700Bold;font-weight:400;font-size:13px;color:#5719b6}
.ai-ans-h u{display:flex;gap:3px;margin-left:4px;text-decoration:none}
.ai-ans-h u i{width:5px;height:5px;border-radius:50%;background:#7e3bed}
.ai-ans p{margin:6px 0 0;font-family:DMSans_400Regular;font-size:15px;line-height:21px;color:#17151e}
.ai-ask{z-index:3;position:absolute;left:0;right:0;bottom:0;padding:12px 16px 34px;background:linear-gradient(rgba(250,250,254,0),#fafafe 22%)}
.ai-chips{display:flex;gap:8px;margin-bottom:10px}
.ai-chips span{padding:8px 12px;border-radius:999px;background:#fff;box-shadow:0 0 0 1px #d6c3fb;font-family:DMSans_500Medium;font-size:13px;color:#5719b6;white-space:nowrap}
.ai-field{display:flex;align-items:center;justify-content:space-between;height:52px;padding:0 6px 0 18px;border-radius:18px;background:#fff;box-shadow:0 0 0 1px #e6e4ec,0 10px 24px rgba(53,14,111,.08)}
.ai-q{font-family:DMSans_400Regular;font-size:15px;color:#a29fb0}
.ai-field i{display:grid;place-items:center;width:40px;height:40px;border-radius:13px;background:#7e3bed}
.ai-field svg{width:20px;height:20px}
`;
