const A = 0;
const P = 11.95;
const B = 18.85;
const BM = 12.0;

const w = (base, list) => list.map(([s, word]) => [+(base + s).toFixed(2), word]);

export const DOC_A = { at: A, media: 0, dur: 11.95 };
export const DOC_LISTEN = { at: P, media: 19.6, dur: 6.9, rate: 0.16 };
export const DOC_B = { at: B, media: BM, dur: 11.2 };
export const PAT_STILL_A = { at: A, dur: 4.65 };
export const PAT_IDLE_A = { at: 4.65, media: 6.65, dur: 7.3, rate: 0.1 };
export const PAT_TALK = { at: P, media: 0, dur: 6.9 };
export const PAT_STILL_B = { at: B, dur: 0.6 };
export const PAT_IDLE_B = { at: B + 0.6, media: 6.65, dur: 7.3, rate: 0.1 };
export const CALL_END = B + 11.2;

export const CUES = [
  { who: "doc", stamp: "00:02", words: w(A, [[0.05, "Oi,"], [0.32, "Ana!"], [0.72, "Tudo"], [1.15, "bem?"], [1.91, "Eu"], [1.93, "sou"], [2.13, "a"], [2.19, "doutora"], [2.65, "Camila,"], [3.26, "do"], [3.4, "Plantão"], [3.9, "Viva"], [4.18, "Mais."]]) },
  { who: "doc", stamp: "00:06", words: w(A, [[4.6, "Já"], [4.8, "li"], [4.98, "a"], [5.07, "sua"], [5.36, "anamnese:"], [6.33, "*dor"], [6.48, "*de"], [6.54, "*cabeça"], [6.91, "forte"], [7.44, "desde"], [7.64, "ontem,"], [8.35, "*sem"], [8.48, "*febre."]]) },
  { who: "doc", stamp: "00:10", words: w(A, [[9.31, "Me"], [9.58, "conta,"], [9.86, "você"], [10.12, "tomou"], [10.46, "algum"], [10.8, "remédio"], [11.26, "até"], [11.46, "agora?"]]) },
  { who: "pat", stamp: "00:12", words: w(P, [[0.06, "Tomei"], [0.3, "uma"], [0.48, "*dipirona"], [0.96, "ontem"], [1.26, "à"], [1.32, "noite,"], [1.91, "mas"], [2.0, "hoje"], [2.31, "cedo"], [2.62, "a"], [2.7, "dor"], [2.94, "voltou."]]) },
  { who: "pat", stamp: "00:15", words: w(P, [[3.52, "E"], [3.9, "*piora"], [4.3, "bastante"], [4.56, "quando"], [5.01, "eu"], [5.16, "fico"], [5.45, "no"], [5.6, "*computador."]]) },
  { who: "doc", stamp: "00:19", words: w(B - BM, [[12.08, "Certo."], [13.2, "Vou"], [13.42, "te"], [13.56, "passar"], [14.05, "uma"], [14.22, "*receita"], [14.73, "e"], [14.8, "algumas"], [15.59, "*orientações,"]]) },
  { who: "doc", stamp: "00:23", words: w(B - BM, [[16.38, "e"], [16.49, "tudo"], [16.94, "fica"], [17.61, "salvo"], [17.94, "no"], [18.16, "app,"], [18.66, "logo"], [18.85, "depois"], [19.4, "da"], [19.54, "consulta."]]) },
  { who: "doc", stamp: "00:27", words: w(B - BM, [[20.76, "Qualquer"], [21.23, "coisa,"], [21.74, "é"], [21.84, "só"], [22.35, "voltar"], [22.64, "aqui."]]) },
];

export const WHO = { doc: "Dra. Camila", pat: "Ana" };

export function cueEnd(i) {
  const c = CUES[i];
  const next = CUES[i + 1];
  const last = c.words[c.words.length - 1][0] + 0.7;
  return next ? Math.min(next.words[0][0] - 0.05, last + 0.6) : last;
}

const clean = (s) => s.replace(/^\*/, "");

export function cueHtml(cls) {
  return CUES.map(
    (c, i) =>
      `<div class="${cls}" data-cue="${i}"><b class="${cls}-who ${c.who}">${WHO[c.who]}</b><p>${c.words
        .map(([, word]) => `<span${word.startsWith("*") ? ' class="k"' : ""}>${clean(word)}</span>`)
        .join(" ")}</p></div>`
  ).join("");
}

export function transcriptHtml() {
  return CUES.map(
    (c) =>
      `<li class="tp-row ${c.who}"><div class="tp-meta"><b>${WHO[c.who]}</b><em>${c.stamp}</em></div><p>${c.words
        .map(([, word]) => `<span${word.startsWith("*") ? ' class="k"' : ""}>${clean(word)}</span>`)
        .join(" ")}</p></li>`
  ).join("");
}

export const CUE_TIMES = CUES.map((c, i) => ({ start: c.words[0][0], end: cueEnd(i), words: c.words.map(([t]) => t) }));
