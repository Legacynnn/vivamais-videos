const D = "#22084a";
const ic = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const I = {
  peso: ic('<path d="M5 20h14l-2-12H7z"/><circle cx="12" cy="5" r="2"/>'),
  remedio: ic('<rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-35 12 12)"/><path d="M9.6 8.6l4.8 6.8"/>'),
  coracao: ic('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  exame: ic('<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h4"/>'),
  pressao: ic('<path d="M4 16a8 8 0 0 1 16 0"/><path d="M12 16l4-5"/><circle cx="12" cy="16" r="1.4" fill="currentColor"/>'),
  diabetes: ic('<path d="M12 3c3.5 4.5 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 2.5-6.5 6-11z"/>'),
  colesterol: ic('<circle cx="9" cy="10" r="4"/><circle cx="15.5" cy="14.5" r="3.5"/><circle cx="8" cy="17.5" r="2"/>'),
  asma: ic('<path d="M12 4v8"/><path d="M12 10c-1.5 0-2.5-1.8-4.5-1.8C5.5 8.2 4 11 4 15c0 3 1.3 5 3.5 5S11 18.5 11 15v-3.5"/><path d="M12 10c1.5 0 2.5-1.8 4.5-1.8 2 0 3.5 2.8 3.5 6.8 0 3-1.3 5-3.5 5S13 18.5 13 15v-3.5"/>'),
  alergia: ic('<circle cx="12" cy="12" r="2.4"/><circle cx="12" cy="6" r="2.8"/><circle cx="12" cy="18" r="2.8"/><circle cx="6" cy="12" r="2.8"/><circle cx="18" cy="12" r="2.8"/>'),
  tireoide: ic('<path d="M12 8v10"/><path d="M12 10c-2-3-7-4-7 1s4 6 7 3"/><path d="M12 10c2-3 7-4 7 1s-4 6-7 3"/>'),
  nenhuma: ic('<circle cx="12" cy="12" r="8"/><path d="M6.5 17.5l11-11"/>'),
  check: ic('<path d="M20 6 9 17l-5-5"/>'),
  x: ic('<path d="M18 6 6 18M6 6l12 12"/>'),
  back: ic('<path d="M15 5l-7 7 7 7"/>'),
  clock: ic('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  lock: ic('<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
};

const BOARD = `<svg class="fx-board" viewBox="0 0 170 200" fill="none">
<rect x="20" y="24" width="130" height="166" rx="22" fill="#7e3bed" stroke="${D}" stroke-width="3.5"/>
<rect x="34" y="40" width="102" height="136" rx="12" fill="#fff" stroke="${D}" stroke-width="3"/>
<rect class="fx-clip" x="58" y="12" width="54" height="26" rx="9" fill="#c6ff34" stroke="${D}" stroke-width="3.5"/>
<path class="fx-heart" d="M85 104s-22-13-22-29a12 12 0 0 1 22-6.5A12 12 0 0 1 107 75c0 16-22 29-22 29z" fill="#ff5c8a" stroke="${D}" stroke-width="3"/>
<path class="fx-pulse" d="M44 128h22l7-12 9 24 8-18 5 6h31" stroke="#7e3bed" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>
<rect x="48" y="150" width="74" height="6" rx="3" fill="#e4dcf7"/><rect x="48" y="162" width="50" height="6" rx="3" fill="#e4dcf7"/>
</svg>`;

const BOTTLE = `<svg class="fx-bottle" viewBox="0 0 110 110" fill="none">
<circle class="fx-bb" cx="55" cy="58" r="50" fill="#ebe1fd"/>
<g class="fx-bod"><path d="M37 34h36v52a8 8 0 0 1-8 8H45a8 8 0 0 1-8-8z" fill="#7e3bed" stroke="${D}" stroke-width="3"/>
<rect x="42" y="50" width="26" height="24" rx="4" fill="#fff" stroke="${D}" stroke-width="2"/><path d="M55 55.5v13M48.5 62h13" stroke="#7e3bed" stroke-width="3.5" stroke-linecap="round"/></g>
<g class="fx-cap"><rect x="33" y="18" width="44" height="16" rx="4" fill="#c6ff34" stroke="${D}" stroke-width="3"/></g>
<g class="fx-pill a"><g transform="translate(88 82) rotate(30)"><rect x="-11" y="-5" width="22" height="10" rx="5" fill="#fff" stroke="${D}" stroke-width="2.2"/><path d="M0 -5h6a5 5 0 0 1 0 10H0z" fill="#c6ff34" stroke="${D}" stroke-width="2.2"/></g></g>
<g class="fx-pill b"><g transform="translate(20 88) rotate(-25)"><rect x="-11" y="-5" width="22" height="10" rx="5" fill="#fff" stroke="${D}" stroke-width="2.2"/><path d="M0 -5h6a5 5 0 0 1 0 10H0z" fill="#b98cff" stroke="${D}" stroke-width="2.2"/></g></g>
</svg>`;

const PERSON = `<svg class="fx-person" viewBox="0 0 100 260" fill="none">
<circle cx="50" cy="30" r="22" fill="#b98cff" stroke="${D}" stroke-width="3"/>
<path d="M16 124a34 34 0 0 1 68 0v56H71v76H29v-76H16z" fill="#7e3bed" stroke="${D}" stroke-width="3" stroke-linejoin="round"/>
</svg>`;

const DOCS = `<svg class="fx-docs" viewBox="0 0 160 120" fill="none">
${[["d1", -14, "#ebe1fd"], ["d2", 12, "#f4efff"], ["d3", 0, "#fff"]]
  .map(([c, r, f]) => `<g class="fx-doc ${c}"><g transform="rotate(${r} 80 66)"><path d="M58 18h34l14 14v62a6 6 0 0 1-6 6H58a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6z" fill="${f}" stroke="${D}" stroke-width="3"/><path d="M92 18v14h14" stroke="${D}" stroke-width="3" stroke-linejoin="round"/><rect x="62" y="48" width="30" height="5" rx="2.5" fill="#b98cff"/><rect x="62" y="60" width="38" height="5" rx="2.5" fill="#b98cff"/><rect x="62" y="72" width="22" height="5" rx="2.5" fill="#b98cff"/></g></g>`)
  .join("")}
<g class="fx-plus"><circle cx="122" cy="96" r="15" fill="#c6ff34" stroke="${D}" stroke-width="3"/><path d="M122 89v14M115 96h14" stroke="${D}" stroke-width="3.2" stroke-linecap="round"/></g>
</svg>`;

const W0 = 30;
const PX = 12;
const ticksH = () => {
  let o = "";
  for (let v = W0; v <= 120; v++) {
    const major = v % 5 === 0;
    o += `<i class="${major ? "M" : ""}" style="left:${(v - W0) * PX}px"></i>`;
    if (major) o += `<em style="left:${(v - W0) * PX}px">${v}</em>`;
  }
  return o;
};
const H1 = 210;
const PY = 8;
const ticksV = () => {
  let o = "";
  for (let v = H1; v >= 120; v--) {
    const major = v % 5 === 0;
    o += `<i class="${major ? "M" : ""}" style="top:${(H1 - v) * PY}px"></i>`;
    if (major) o += `<em style="top:${(H1 - v) * PY}px">${v}</em>`;
  }
  return o;
};

const CONDS = [
  ["pressao", "Pressão alta"],
  ["diabetes", "Diabetes"],
  ["colesterol", "Colesterol alto"],
  ["asma", "Asma"],
  ["alergia", "Alergias"],
  ["coracao", "Coração"],
  ["tireoide", "Tireoide"],
  ["nenhuma", "Nenhuma"],
];

export const FX_HTML = `<div class="fx">
<div class="fx-wipe"></div>
<div class="fx-in">
<div class="fx-p0">
<div class="fx-orb"></div>
${BOARD}
<div class="fx-chip k1"><i>${I.peso}</i>Peso</div>
<div class="fx-chip k2"><i>${I.remedio}</i>Remédios</div>
<div class="fx-chip k3"><i>${I.coracao}</i>Condições</div>
<div class="fx-chip k4"><i>${I.exame}</i>Exames</div>
<div class="fx-time">${I.clock}Leva só 2 minutos</div>
<h1 class="fx-h"><span>Vamos montar sua</span><span>ficha de saúde?</span></h1>
<p class="fx-sub">São 4 perguntas rápidas.<br>O médico já chega sabendo de você.</p>
<div class="fx-go">Começar</div>
<div class="fx-later">Preencher depois</div>
</div>
<div class="fx-chrome">
<div class="fx-back">${I.back}</div><div class="fx-ttl">Ficha de saúde</div>
<div class="fx-n"><div class="fx-nw"><b>1</b><b>2</b><b>3</b><b>4</b></div><span>de 4</span></div>
<div class="fx-bar"><i><b></b></i><i><b></b></i><i><b></b></i><i><b></b></i></div>
</div>
<div class="fx-pg fx-p1">
<div class="fx-eb" data-c>Etapa 1 · Seu corpo</div>
<div class="fx-q1">
<h2 class="fx-q" data-c>Quanto você pesa?</h2>
<div class="fx-val" data-c><b class="fx-w">55</b><span>kg</span></div>
<div class="fx-ruler" data-c><div class="fx-strip">${ticksH()}</div><div class="fx-ind"></div></div>
<div class="fx-hint" data-c>Arraste para o lado</div>
</div>
<div class="fx-done1"><i>${I.check}</i>Peso <b>68 kg</b></div>
<div class="fx-q2">
<h2 class="fx-q">E a sua altura?</h2>
<div class="fx-fig">${PERSON}<div class="fx-head"></div></div>
<div class="fx-val v2"><b class="fx-hgt">150</b><span>cm</span></div>
<div class="fx-vr"><div class="fx-vstrip">${ticksV()}</div><div class="fx-vind"></div></div>
</div>
<div class="fx-imc"><div class="fx-imc-t"><small>Seu IMC</small><b>25,9</b></div><div class="fx-imc-r"><small>O app calcula sozinho</small><div class="fx-gb"><i></i></div></div></div>
</div>
<div class="fx-pg fx-p2">
<div class="fx-eb" data-c>Etapa 2 · Remédios</div>
<div class="fx-bw" data-c>${BOTTLE}</div>
<h2 class="fx-q c" data-c>Você toma algum<br>remédio todo dia?</h2>
<div class="fx-yn" data-c><div class="fx-opt yes"><i>${I.check}</i>Sim</div><div class="fx-opt no"><i>${I.x}</i>Não</div></div>
<div class="fx-med"><small>Qual remédio e a dose?</small><input class="fx-inp" value="" placeholder="Ex.: Losartana 50mg"/></div>
</div>
<div class="fx-pg fx-p3">
<div class="fx-eb" data-c>Etapa 3 · Condições</div>
<h2 class="fx-q" data-c>Você tem alguma<br>destas condições?</h2>
<p class="fx-qs" data-c>Toque em todas que tiver.</p>
<div class="fx-grid">${CONDS.map(([k, l]) => `<div class="fx-cd" data-k="${k}"><i>${I[k]}</i><span>${l}</span><b>${I.check}</b></div>`).join("")}</div>
<div class="fx-cnt"><div class="fx-cw"><span>1 selecionada</span><span>2 selecionadas</span></div></div>
</div>
<div class="fx-pg fx-p4">
<div class="fx-eb" data-c>Etapa 4 · Exames <em>Opcional</em></div>
<h2 class="fx-q" data-c>Tem exames ou<br>laudos recentes?</h2>
<div class="fx-drop" data-c>${DOCS}<b>Foto ou PDF do exame</b><div class="fx-att">Anexar exame</div></div>
<p class="fx-note" data-c>Não tem agora? Tudo bem.<br>Você envia quando quiser.</p>
</div>
<div class="fx-pg fx-p5">
<div class="fx-ringw"><svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="66" stroke="#ebe1fd" stroke-width="14" fill="none"/><circle class="fx-arc" cx="80" cy="80" r="66" stroke="#7e3bed" stroke-width="14" fill="none" stroke-linecap="round" pathLength="1" transform="rotate(-90 80 80)"/></svg><b class="fx-pct">0%</b><div class="fx-ok">${I.check}</div></div>
<h1 class="fx-dt">Ficha pronta!</h1>
<p class="fx-ds">${I.lock}Só os médicos que você autorizar veem.</p>
<div class="fx-sum">
<div class="fx-row"><i>${I.peso}</i><div><small>Corpo</small><b>68 kg · 1,62 m · IMC 25,9</b></div></div>
<div class="fx-row"><i>${I.remedio}</i><div><small>Remédios</small><b>Losartana 50mg, 1x ao dia</b></div></div>
<div class="fx-row"><i>${I.coracao}</i><div><small>Condições</small><b>Pressão alta, colesterol alto</b></div></div>
<div class="fx-row"><i>${I.exame}</i><div><small>Exames</small><b>Envie quando quiser</b></div></div>
</div>
</div>
<div class="fx-cta"><div class="fx-cl"><span>Continuar</span><span>Concluir ficha</span><span>Ir para o início</span></div></div>
</div>
<div class="fx-touch"></div>
</div>`;

export const FX_CSS = `
.fx{position:absolute;inset:0;font-family:"DM Sans",sans-serif;color:#17151e}
.fx-wipe{position:absolute;inset:0;background:#c6ff34;clip-path:circle(0px at 201px 810px)}
.fx-in{position:absolute;inset:0;background:#f8f6ff;clip-path:circle(0px at 201px 810px);overflow:hidden}
.fx-p0,.fx-pg{position:absolute;inset:0}
.fx-pg{opacity:0}
.fx-orb,.fx-board{opacity:0}
.fx-orb{position:absolute;left:66px;top:96px;width:270px;height:270px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#f1e9ff,#e1d2fd 70%)}
.fx-board{position:absolute;left:131px;top:124px;width:140px;height:165px}
.fx-pulse{stroke-dasharray:1;stroke-dashoffset:1}
.fx-chip{position:absolute;height:38px;padding:0 14px 0 6px;border-radius:999px;background:#fff;box-shadow:0 10px 24px rgba(60,20,140,.14);display:flex;flex-direction:row;align-items:center;gap:8px;font-size:14.5px;font-weight:700;opacity:0}
.fx-chip i{width:28px;height:28px;border-radius:50%;background:#ebe1fd;color:#6a24db;display:grid;place-items:center}
.fx-chip i svg{width:16px;height:16px}
.fx-chip.k1{left:30px;top:128px}.fx-chip.k2{left:262px;top:112px}.fx-chip.k3{left:22px;top:300px}.fx-chip.k4{left:272px;top:288px}
.fx-chip.k2 i{background:#f2ffd0;color:#3b6b00}.fx-chip.k3 i{background:#ffe3ea;color:#d6336c}
.fx-time{position:absolute;left:126px;top:392px;width:150px;height:32px;border-radius:999px;background:#ebe1fd;color:#5719b6;font-size:13.5px;font-weight:700;display:flex;flex-direction:row;align-items:center;justify-content:center;gap:6px;opacity:0}
.fx-time svg{width:16px;height:16px}
.fx-h{position:absolute;left:0;right:0;top:440px;margin:0;text-align:center;font-family:"Space Grotesk",sans-serif;font-size:31px;line-height:36px;font-weight:700;letter-spacing:-.02em}
.fx-h span{display:block;opacity:0}
.fx-sub{position:absolute;left:30px;right:30px;top:524px;margin:0;text-align:center;font-size:16.5px;line-height:24px;color:#5c5868;opacity:0}
.fx-go{position:absolute;left:24px;right:24px;top:704px;height:58px;border-radius:18px;background:#7e3bed;color:#fff;font-size:18px;font-weight:700;display:grid;place-items:center;box-shadow:0 12px 26px rgba(126,59,237,.35);opacity:0}
.fx-later{position:absolute;left:120px;width:162px;top:776px;height:40px;border-radius:12px;color:#5719b6;font-size:16.5px;font-weight:700;display:grid;place-items:center;opacity:0}
.fx-chrome{position:absolute;left:0;right:0;top:50px;height:76px;opacity:0}
.fx-back{position:absolute;left:16px;top:6px;width:36px;height:36px;border-radius:12px;background:#fff;display:grid;place-items:center;color:#17151e}
.fx-back svg{width:20px;height:20px}
.fx-ttl{position:absolute;left:0;right:0;top:14px;text-align:center;font-size:16px;font-weight:700}
.fx-n{position:absolute;right:18px;top:13px;height:22px;display:flex;flex-direction:row;align-items:center;gap:4px;font-size:14px;font-weight:700;color:#7a7588}
.fx-nw{height:22px;overflow:hidden;display:flex;flex-direction:column;color:#6a24db}
.fx-nw b{display:block;height:22px;line-height:22px;font-size:16px}
.fx-bar{position:absolute;left:24px;right:24px;top:56px;height:7px;display:flex;flex-direction:row;gap:6px}
.fx-bar i{flex:1;border-radius:4px;background:#e6def7;overflow:hidden}
.fx-bar b{display:block;height:100%;background:#7e3bed;transform:scaleX(0);transform-origin:0 50%}
.fx-eb{position:absolute;left:24px;top:142px;font-size:12.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6a24db;display:flex;flex-direction:row;align-items:center;gap:8px}
.fx-eb em{font-style:normal;letter-spacing:0;text-transform:none;font-size:12.5px;padding:3px 9px;border-radius:999px;background:#c6ff34;color:#22084a}
.fx-q{position:absolute;left:24px;right:24px;top:166px;margin:0;font-family:"Space Grotesk",sans-serif;font-size:28px;line-height:33px;font-weight:700;letter-spacing:-.02em}
.fx-q.c{text-align:center;top:300px}
.fx-qs{position:absolute;left:24px;top:240px;margin:0;font-size:16px;color:#5c5868}
.fx-q1,.fx-q2{position:absolute;inset:0}
.fx-val{position:absolute;left:0;right:0;top:226px;display:flex;flex-direction:row;align-items:baseline;justify-content:center;gap:8px}
.fx-val b{font-family:"Space Grotesk",sans-serif;font-size:96px;line-height:1;font-weight:700;letter-spacing:-.04em;color:#22084a}
.fx-val span{font-size:24px;font-weight:700;color:#7a7588}
.fx-ruler{position:absolute;left:0;right:0;top:372px;height:96px;overflow:hidden;-webkit-mask:linear-gradient(90deg,transparent,#000 22%,#000 78%,transparent);mask:linear-gradient(90deg,transparent,#000 22%,#000 78%,transparent)}
.fx-strip{position:absolute;left:0;top:0;width:1100px;height:96px;transform:translateX(-99px)}
.fx-strip i{position:absolute;top:18px;width:2px;height:22px;margin-left:-1px;border-radius:1px;background:#cfc4ea}
.fx-strip i.M{height:36px;background:#9b88c9}
.fx-strip em{position:absolute;top:62px;width:40px;margin-left:-20px;text-align:center;font-style:normal;font-size:14px;font-weight:700;color:#9b88c9}
.fx-ind{position:absolute;left:198px;top:6px;width:6px;height:52px;border-radius:3px;background:#7e3bed}
.fx-ind:before{content:"";position:absolute;left:-5px;top:-6px;width:16px;height:16px;border-radius:50%;background:#c6ff34;border:3px solid #7e3bed;box-sizing:border-box}
.fx-hint{position:absolute;left:0;right:0;top:486px;text-align:center;font-size:14px;font-weight:600;color:#9b88c9}
.fx-done1{position:absolute;left:24px;top:166px;height:40px;padding:0 16px 0 6px;border-radius:999px;background:#fff;box-shadow:0 8px 20px rgba(60,20,140,.10);display:flex;flex-direction:row;align-items:center;gap:8px;font-size:15px;font-weight:600;color:#5c5868;opacity:0}
.fx-done1 b{color:#17151e}
.fx-done1 i{width:28px;height:28px;border-radius:50%;background:#c6ff34;color:#22084a;display:grid;place-items:center}
.fx-done1 i svg{width:15px;height:15px}
.fx-q2{opacity:0}
.fx-q2 .fx-q{top:222px}
.fx-fig{position:absolute;left:44px;top:288px;width:96px;height:250px}
.fx-person{position:absolute;left:0;bottom:0;width:96px;height:250px;transform-origin:50% 100%;transform:scaleY(.926)}
.fx-val.v2{left:150px;right:96px;top:372px;justify-content:center}
.fx-val.v2 b{font-size:72px}
.fx-vr{position:absolute;left:316px;top:266px;width:70px;height:300px;overflow:hidden;-webkit-mask:linear-gradient(180deg,transparent,#000 22%,#000 78%,transparent);mask:linear-gradient(180deg,transparent,#000 22%,#000 78%,transparent)}
.fx-vstrip{position:absolute;left:0;top:0;width:70px;height:740px;transform:translateY(-330px)}
.fx-vstrip i{position:absolute;left:4px;width:18px;height:2px;margin-top:-1px;border-radius:1px;background:#cfc4ea}
.fx-vstrip i.M{width:30px;background:#9b88c9}
.fx-vstrip em{position:absolute;left:38px;height:20px;margin-top:-10px;line-height:20px;font-style:normal;font-size:13px;font-weight:700;color:#9b88c9}
.fx-vind{position:absolute;left:0;top:147px;width:40px;height:6px;border-radius:3px;background:#7e3bed}
.fx-imc{position:absolute;left:24px;right:24px;top:600px;height:104px;border-radius:22px;background:#fff;box-shadow:0 14px 30px rgba(60,20,140,.12);display:flex;flex-direction:row;align-items:center;gap:16px;padding:0 18px;box-sizing:border-box;opacity:0}
.fx-imc-t small,.fx-imc-r small{display:block;font-size:13px;color:#7a7588}
.fx-imc-t b{display:block;font-family:"Space Grotesk",sans-serif;font-size:34px;line-height:40px;color:#22084a}
.fx-imc-r{flex:1}
.fx-gb{position:relative;margin-top:10px;height:10px;border-radius:5px;background:linear-gradient(90deg,#60a5fa,#22c55e 35%,#facc15 65%,#f97316)}
.fx-gb i{position:absolute;left:0;top:-5px;width:20px;height:20px;margin-left:-10px;border-radius:50%;background:#fff;border:4px solid #22084a;box-sizing:border-box}
.fx-bw{position:absolute;left:141px;top:172px;width:120px;height:120px}
.fx-bottle{width:100%;height:100%;overflow:visible}
.fx-yn{position:absolute;left:24px;right:24px;top:394px;height:100px;display:flex;flex-direction:row;gap:12px}
.fx-opt{flex:1;border-radius:22px;background:#fff;border:2.5px solid #e4dcf7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;font-size:21px;font-weight:700}
.fx-opt i{width:34px;height:34px;border-radius:50%;background:#ebe1fd;color:#6a24db;display:grid;place-items:center}
.fx-opt i svg{width:20px;height:20px}
.fx-med{position:absolute;left:24px;right:24px;top:512px;height:118px;border-radius:22px;background:#fff;box-shadow:0 14px 30px rgba(60,20,140,.10);padding:16px 18px;box-sizing:border-box;opacity:0;transform-origin:50% 0}
.fx-med small{display:block;font-size:14px;font-weight:700;color:#6a24db}
.fx-inp{display:block;margin-top:10px;width:100%;height:50px;box-sizing:border-box;border:2px solid #e4dcf7;border-radius:14px;background:#f8f6ff;padding:0 14px;font-family:"DM Sans",sans-serif;font-size:18px;font-weight:600;color:#17151e;outline:none}
.fx-inp::placeholder{color:#b5abc9;font-weight:500}
.fx-grid{position:absolute;left:24px;right:24px;top:280px;display:flex;flex-direction:row;flex-wrap:wrap;gap:10px}
.fx-cd{position:relative;width:172px;height:68px;box-sizing:border-box;border-radius:20px;background:#fff;border:2.5px solid #ece6f8;display:flex;flex-direction:row;align-items:center;gap:10px;padding:0 12px;font-size:15.5px;font-weight:700;opacity:0}
.fx-cd i{flex:none;width:40px;height:40px;border-radius:50%;background:#ebe1fd;color:#6a24db;display:grid;place-items:center}
.fx-cd i svg{width:22px;height:22px}
.fx-cd b{position:absolute;right:-6px;top:-8px;width:26px;height:26px;border-radius:50%;background:#c6ff34;color:#22084a;border:2.5px solid #fff;display:grid;place-items:center;transform:scale(0)}
.fx-cd b svg{width:14px;height:14px}
.fx-cnt{position:absolute;left:131px;top:614px;width:140px;height:34px;border-radius:999px;background:#22084a;color:#fff;font-size:14px;font-weight:700;overflow:hidden;opacity:0}
.fx-cw{display:flex;flex-direction:column}
.fx-cw span{display:block;height:34px;line-height:34px;text-align:center}
.fx-drop{position:absolute;left:24px;right:24px;top:256px;height:270px;border-radius:26px;border:2.5px dashed #c9b6f3;background:#fbf9ff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;box-sizing:border-box}
.fx-docs{width:176px;height:132px;overflow:visible}
.fx-drop b{font-size:16px;color:#5c5868}
.fx-att{height:44px;padding:0 22px;border-radius:14px;border:2px solid #7e3bed;color:#6a24db;font-size:16px;font-weight:700;display:grid;place-items:center}
.fx-note{position:absolute;left:24px;right:24px;top:552px;margin:0;text-align:center;font-size:16.5px;line-height:24px;color:#5c5868}
.fx-ringw{position:absolute;left:121px;top:96px;width:160px;height:160px}
.fx-ringw svg{width:100%;height:100%}
.fx-arc{stroke-dasharray:1;stroke-dashoffset:1}
.fx-pct{position:absolute;inset:0;display:grid;place-items:center;font-family:"Space Grotesk",sans-serif;font-size:38px;font-weight:700;color:#22084a}
.fx-ok{position:absolute;left:40px;top:40px;width:80px;height:80px;border-radius:50%;background:#c6ff34;color:#22084a;display:grid;place-items:center;transform:scale(0)}
.fx-ok svg{width:44px;height:44px;stroke-width:3}
.fx-dt{position:absolute;left:0;right:0;top:282px;margin:0;text-align:center;font-family:"Space Grotesk",sans-serif;font-size:36px;font-weight:700;letter-spacing:-.03em;opacity:0}
.fx-ds{position:absolute;left:20px;right:20px;top:332px;margin:0;font-size:15.5px;color:#5c5868;display:flex;flex-direction:row;align-items:center;justify-content:center;gap:6px;opacity:0}
.fx-ds svg{width:17px;height:17px;color:#6a24db}
.fx-sum,.fx-ringw{opacity:0}
.fx-sum{position:absolute;left:24px;right:24px;top:380px;border-radius:24px;background:#fff;box-shadow:0 14px 30px rgba(60,20,140,.12);padding:6px 16px}
.fx-row{display:flex;flex-direction:row;align-items:center;gap:12px;padding:12px 0;opacity:0}
.fx-row+.fx-row{border-top:1px solid #f1edf8}
.fx-row i{flex:none;width:40px;height:40px;border-radius:14px;background:#ebe1fd;color:#6a24db;display:grid;place-items:center}
.fx-row i svg{width:20px;height:20px}
.fx-row small{display:block;font-size:12.5px;color:#7a7588}
.fx-row b{display:block;font-size:15.5px}
.fx-cta{position:absolute;left:24px;right:24px;top:782px;height:58px;border-radius:18px;background:#d9cdf5;color:#fff;font-size:18px;font-weight:700;overflow:hidden;opacity:0}
.fx-cl{display:flex;flex-direction:column}
.fx-cl span{display:block;height:58px;line-height:58px;text-align:center}
.fx-touch{position:absolute;left:0;top:0;width:36px;height:36px;margin:-18px 0 0 -18px;border-radius:50%;background:rgba(34,8,74,.26);border:2.5px solid rgba(255,255,255,.95);box-shadow:0 4px 10px rgba(0,0,0,.18);box-sizing:border-box;opacity:0}
`;

export function fichaFlow(S, t, cap) {
  var L = S.layer("fx");
  var q = function (s) {
    return S.all(s, L);
  };
  var one = function (s) {
    return q(s)[0];
  };
  var F = { immediateRender: false };
  var o = function (v) {
    return Object.assign({}, v, F);
  };
  var dot = one(".fx-touch");
  var cta = one(".fx-cta");
  var p = [one(".fx-p0"), one(".fx-p1"), one(".fx-p2"), one(".fx-p3"), one(".fx-p4"), one(".fx-p5")];
  var segs = q(".fx-bar b");
  var nw = q(".fx-nw b");
  var cl = one(".fx-cl");
  var add = S.add;

  function cascade(tl, page, at) {
    var els = Array.prototype.slice.call(page.querySelectorAll("[data-c]"));
    tl.fromTo(els, { y: 28, opacity: 0 }, o({ y: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.08 }), at);
  }
  function swap(tl, a, b, at, step) {
    tl.to(a, { x: -90, opacity: 0, duration: 0.45, ease: "power3.in" }, at);
    tl.set(a, { visibility: "hidden" }, at + 0.46);
    tl.fromTo(b, { x: 110, opacity: 0, visibility: "visible" }, o({ x: 0, opacity: 1, duration: 0.6, ease: "power3.out" }), at + 0.25);
    cascade(tl, b, at + 0.25);
    if (step) {
      if (step > 2) tl.fromTo(segs[step - 2], { scaleX: 0 }, o({ scaleX: 1, duration: 0.55, ease: "power3.inOut" }), at);
      tl.fromTo(segs[step - 2], { backgroundColor: "#c6ff34" }, o({ backgroundColor: "#7e3bed", duration: 0.5, ease: "none" }), at + 0.55);
      tl.fromTo(nw, { y: -22 * (step - 2) }, o({ y: -22 * (step - 1), duration: 0.5, ease: "back.inOut(1.6)" }), at + 0.2);
    }
  }
  function ctaOn(tl, at) {
    tl.fromTo(cta, { backgroundColor: "#d9cdf5" }, o({ backgroundColor: "#7e3bed", duration: 0.35, ease: "power2.out" }), at);
    tl.fromTo(cta, { scale: 1 }, o({ scale: 1.04, duration: 0.16, ease: "power2.out", yoyo: true, repeat: 1 }), at);
  }
  function ctaOff(tl, at) {
    tl.fromTo(cta, { backgroundColor: "#7e3bed" }, o({ backgroundColor: "#d9cdf5", duration: 0.3, ease: "power2.out" }), at);
  }
  function label(tl, at, i) {
    tl.fromTo(cl, { y: -58 * (i - 1) }, o({ y: -58 * i, duration: 0.5, ease: "back.inOut(1.4)" }), at);
  }
  function drag(tl, x0, y0, x1, y1, at, dur) {
    tl.set(dot, { x: x0, y: y0 }, at);
    tl.fromTo(dot, { opacity: 0, scale: 1.6 }, o({ opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" }), at);
    tl.to(dot, { scale: 0.86, duration: 0.15, ease: "power2.out" }, at + 0.3);
    tl.fromTo(dot, { x: x0, y: y0 }, o({ x: x1, y: y1, duration: dur, ease: "power2.inOut" }), at + 0.4);
    tl.to(dot, { opacity: 0, scale: 1.4, duration: 0.3, ease: "power2.in" }, at + 0.4 + dur + 0.1);
    return at + 0.4;
  }
  function count(tl, el, from, to, at, dur, fmt) {
    var n = { v: from };
    tl.fromTo(n, { v: from }, o({ v: to, duration: dur, ease: "power2.inOut", onUpdate: function () { el.textContent = fmt ? fmt(n.v) : String(Math.round(n.v)); } }), at);
  }

  var T0 = t;
  add(function (tl) {
    tl.set(L, { visibility: "visible", opacity: 1 }, T0);
    tl.fromTo(one(".fx-wipe"), { clipPath: "circle(0px at 201px 810px)" }, o({ clipPath: "circle(1000px at 201px 810px)", duration: 0.7, ease: "power3.inOut" }), T0);
    tl.fromTo(one(".fx-in"), { clipPath: "circle(0px at 201px 810px)" }, o({ clipPath: "circle(1000px at 201px 810px)", duration: 0.75, ease: "power3.inOut" }), T0 + 0.22);
    var a = T0 + 0.55;
    tl.fromTo(one(".fx-orb"), { scale: 0.3, opacity: 0 }, o({ scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.5)" }), a);
    tl.fromTo(one(".fx-board"), { y: 70, rotation: -10, opacity: 0 }, o({ y: 0, rotation: 0, opacity: 1, duration: 0.75, ease: "back.out(1.6)" }), a + 0.15);
    tl.fromTo(one(".fx-clip"), { y: -30, opacity: 0 }, o({ y: 0, opacity: 1, duration: 0.45, ease: "bounce.out" }), a + 0.6);
    tl.fromTo(one(".fx-heart"), { scale: 0, transformOrigin: "50% 60%" }, o({ scale: 1, duration: 0.5, ease: "back.out(3)" }), a + 0.75);
    tl.fromTo(one(".fx-heart"), { scale: 1 }, o({ scale: 1.16, duration: 0.14, ease: "power2.out", yoyo: true, repeat: 3, transformOrigin: "50% 60%" }), a + 1.4);
    tl.fromTo(one(".fx-pulse"), { strokeDashoffset: 1 }, o({ strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }), a + 1.0);
    q(".fx-chip").forEach(function (c, i) {
      var dx = i % 2 ? -60 : 60;
      var dy = i < 2 ? 50 : -50;
      tl.fromTo(c, { x: dx, y: dy, scale: 0.4, opacity: 0 }, o({ x: 0, y: 0, scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.8)" }), a + 1.2 + i * 0.12);
    });
    tl.fromTo(one(".fx-time"), { y: 16, opacity: 0 }, o({ y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }), a + 1.5);
    tl.fromTo(q(".fx-h span"), { y: 34, opacity: 0 }, o({ y: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.1 }), a + 1.6);
    tl.fromTo(one(".fx-sub"), { y: 20, opacity: 0 }, o({ y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }), a + 1.85);
    tl.fromTo(one(".fx-go"), { y: 40, opacity: 0 }, o({ y: 0, opacity: 1, duration: 0.55, ease: "back.out(1.6)" }), a + 2.0);
    tl.fromTo(one(".fx-later"), { y: 20, opacity: 0 }, o({ y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }), a + 2.15);
  });
  S.status(T0 + 0.5, false);
  S.cam(T0 + 0.3, { x: 201, y: 437, zoom: 1.6 }, 0.8);
  S.caption(T0 + 0.7, cap);
  S.mark(T0 + 3.7, one(".fx-later"), { hold: 2.0, pad: 6, radius: 14 });
  S.caption(T0 + 3.5, cap + 1);
  var go = one(".fx-go");
  S.cursorTo(T0 + 6.0, go, 0.45);
  S.click(T0 + 6.5, go, { press: true });

  var T1 = T0 + 6.7;
  var w = one(".fx-w");
  var hg = one(".fx-hgt");
  add(function (tl) {
    tl.to([one(".fx-orb"), one(".fx-board")].concat(q(".fx-chip")), { y: -60, scale: 1.08, opacity: 0, duration: 0.5, ease: "power3.in", stagger: 0.03 }, T1);
    tl.to([one(".fx-time"), one(".fx-h"), one(".fx-sub"), one(".fx-later")], { y: -30, opacity: 0, duration: 0.4, ease: "power3.in", stagger: 0.03 }, T1 + 0.05);
    tl.to(go, { y: 78, opacity: 0, duration: 0.45, ease: "power3.inOut" }, T1);
    tl.set(p[0], { visibility: "hidden" }, T1 + 0.6);
    tl.fromTo(cta, { y: -78, opacity: 0, backgroundColor: "#7e3bed" }, o({ y: 0, opacity: 1, backgroundColor: "#d9cdf5", duration: 0.5, ease: "power3.inOut" }), T1 + 0.05);
    tl.fromTo(one(".fx-chrome"), { y: -40, opacity: 0 }, o({ y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }), T1 + 0.35);
    tl.fromTo(segs[0], { scaleX: 0 }, o({ scaleX: 0.5, duration: 0.6, ease: "power3.out" }), T1 + 0.6);
    tl.fromTo(p[1], { opacity: 0 }, o({ opacity: 1, duration: 0.01 }), T1 + 0.45);
    cascade(tl, p[1], T1 + 0.45);
    var d0 = drag(tl, 290, 420, 134, 420, T1 + 1.2, 1.2);
    tl.fromTo(one(".fx-strip"), { x: -99 }, o({ x: -255, duration: 1.2, ease: "power2.inOut" }), d0);
    count(tl, w, 55, 68, d0, 1.2);
    tl.fromTo(w, { scale: 1 }, o({ scale: 1.1, duration: 0.16, ease: "power2.out", yoyo: true, repeat: 1, transformOrigin: "50% 80%" }), d0 + 1.25);
    tl.to(one(".fx-hint"), { opacity: 0, duration: 0.3 }, d0 + 0.4);
    var b = T1 + 3.3;
    tl.to([one(".fx-q1 .fx-q"), one(".fx-ruler")], { y: -40, opacity: 0, duration: 0.45, ease: "power3.in", stagger: 0.05 }, b);
    tl.to(one(".fx-q1 .fx-val"), { y: -70, scale: 0.3, opacity: 0, duration: 0.5, ease: "power3.in" }, b);
    tl.fromTo(one(".fx-done1"), { x: -30, scale: 0.6, opacity: 0 }, o({ x: 0, scale: 1, opacity: 1, duration: 0.55, ease: "back.out(2)" }), b + 0.35);
    tl.fromTo(segs[0], { scaleX: 0.5 }, o({ scaleX: 0.75, duration: 0.5, ease: "power3.out" }), b + 0.35);
    tl.fromTo(one(".fx-q2"), { opacity: 0 }, o({ opacity: 1, duration: 0.01 }), b + 0.4);
    tl.fromTo([one(".fx-q2 .fx-q"), one(".fx-fig"), one(".fx-val.v2"), one(".fx-vr")], { y: 40, opacity: 0 }, o({ y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.08 }), b + 0.4);
    var d1 = drag(tl, 350, 360, 350, 456, b + 1.1, 1.2);
    tl.fromTo(one(".fx-vstrip"), { y: -330 }, o({ y: -234, duration: 1.2, ease: "power2.inOut" }), d1);
    tl.fromTo(one(".fx-person"), { scaleY: 0.926 }, o({ scaleY: 1, duration: 1.2, ease: "power2.inOut" }), d1);
    count(tl, hg, 150, 162, d1, 1.2);
    tl.fromTo(hg, { scale: 1 }, o({ scale: 1.1, duration: 0.16, ease: "power2.out", yoyo: true, repeat: 1, transformOrigin: "50% 80%" }), d1 + 1.25);
    var c = b + 2.8;
    tl.fromTo(one(".fx-imc"), { y: 50, opacity: 0 }, o({ y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }), c);
    tl.fromTo(one(".fx-gb i"), { x: 0 }, o({ x: one(".fx-gb").offsetWidth * 0.436, duration: 1.0, ease: "power3.out" }), c + 0.4);
    tl.fromTo(segs[0], { scaleX: 0.75 }, o({ scaleX: 1, duration: 0.5, ease: "power3.out" }), c + 0.3);
    ctaOn(tl, c + 0.5);
  });
  S.caption(T1 + 0.2, cap + 2);
  S.cam(T1 + 0.4, { x: 201, y: 400, zoom: 1.7 }, 0.9);
  S.caption(T1 + 3.4, cap + 3);
  S.cam(T1 + 3.4, { x: 201, y: 420, zoom: 1.65 }, 0.9);
  S.cam(T1 + 5.9, { x: 201, y: 520, zoom: 1.6 }, 0.9);
  S.mark(T1 + 6.6, one(".fx-imc"), { hold: 1.2, pad: 4, radius: 24 });
  S.cursorTo(T1 + 7.8, cta, 0.45);
  S.click(T1 + 8.3, cta, { press: true });

  var T2 = T1 + 8.5;
  var yes = one(".fx-opt.yes");
  var no = one(".fx-opt.no");
  var inp = one(".fx-inp");
  add(function (tl) {
    swap(tl, p[1], p[2], T2, 2);
    ctaOff(tl, T2 + 0.2);
    var a = T2 + 0.35;
    tl.fromTo(one(".fx-bb"), { scale: 0, transformOrigin: "50% 50%" }, o({ scale: 1, duration: 0.5, ease: "back.out(1.8)" }), a);
    tl.fromTo(one(".fx-bod"), { y: 40, opacity: 0 }, o({ y: 0, opacity: 1, duration: 0.55, ease: "back.out(1.6)" }), a + 0.15);
    tl.fromTo(one(".fx-cap"), { y: -40, rotation: -25, opacity: 0, transformOrigin: "50% 50%" }, o({ y: 0, rotation: 0, opacity: 1, duration: 0.6, ease: "bounce.out" }), a + 0.4);
    tl.fromTo(q(".fx-pill"), { y: -50, rotation: -120, opacity: 0, transformOrigin: "50% 50%" }, o({ y: 0, rotation: 0, opacity: 1, duration: 0.7, ease: "bounce.out", stagger: 0.15 }), a + 0.7);
    var s = T2 + 2.6;
    tl.to(yes, { backgroundColor: "#7e3bed", borderColor: "#7e3bed", color: "#ffffff", duration: 0.3, ease: "power2.out" }, s);
    tl.to(yes.querySelector("i"), { backgroundColor: "#c6ff34", color: "#22084a", duration: 0.3 }, s);
    tl.fromTo(yes, { scale: 1 }, o({ scale: 0.94, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1 }), s);
    tl.fromTo(yes.querySelector("i"), { rotation: -90, scale: 0.5 }, o({ rotation: 0, scale: 1, duration: 0.5, ease: "back.out(2.6)" }), s + 0.1);
    tl.to(no, { opacity: 0.45, duration: 0.3 }, s);
    tl.fromTo(one(".fx-med"), { scaleY: 0.4, y: -20, opacity: 0 }, o({ scaleY: 1, y: 0, opacity: 1, duration: 0.55, ease: "back.out(1.4)" }), s + 0.25);
    tl.to(q(".fx-pill"), { y: -10, duration: 0.2, ease: "power2.out", yoyo: true, repeat: 1, stagger: 0.08 }, s);
    ctaOn(tl, s + 0.3);
  });
  S.caption(T2 + 0.2, cap + 4);
  S.cam(T2 + 0.3, { x: 201, y: 437, zoom: 1.6 }, 0.9);
  S.cursorTo(T2 + 2.05, yes, 0.45);
  S.click(T2 + 2.5, yes, { press: true });
  S.cam(T2 + 2.9, { x: 201, y: 520, zoom: 1.75 }, 0.8);
  S.type(T2 + 3.4, inp, "Losartana 50mg, 1x ao dia", { cps: 16 });
  S.cam(T2 + 5.1, { x: 201, y: 520, zoom: 1.6 }, 0.7);
  S.cursorTo(T2 + 5.4, cta, 0.45);
  S.click(T2 + 5.9, cta, { press: true });

  var T3 = T2 + 6.1;
  var cds = q(".fx-cd");
  var pick = [cds[0], cds[2]];
  add(function (tl) {
    swap(tl, p[2], p[3], T3, 3);
    ctaOff(tl, T3 + 0.2);
    tl.fromTo(cds, { y: 40, scale: 0.85, opacity: 0 }, o({ y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.6)", stagger: 0.07 }), T3 + 0.6);
    pick.forEach(function (c, i) {
      var s = T3 + 2.4 + i * 1.0;
      tl.to(c, { backgroundColor: "#7e3bed", borderColor: "#7e3bed", color: "#ffffff", duration: 0.3, ease: "power2.out" }, s);
      tl.to(c.querySelector("i"), { backgroundColor: "#c6ff34", color: "#22084a", duration: 0.3 }, s);
      tl.fromTo(c.querySelector("i"), { rotation: -30, scale: 0.6 }, o({ rotation: 0, scale: 1, duration: 0.55, ease: "elastic.out(1, 0.5)" }), s);
      tl.fromTo(c, { scale: 1 }, o({ scale: 0.93, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1 }), s);
      tl.fromTo(c.querySelector("b"), { scale: 0, rotation: -90 }, o({ scale: 1, rotation: 0, duration: 0.45, ease: "back.out(2.8)" }), s + 0.15);
    });
    tl.fromTo(one(".fx-cnt"), { y: 24, opacity: 0 }, o({ y: 0, opacity: 1, duration: 0.45, ease: "back.out(2)" }), T3 + 2.6);
    tl.fromTo(one(".fx-cw"), { y: 0 }, o({ y: -34, duration: 0.4, ease: "back.inOut(1.6)" }), T3 + 3.6);
    ctaOn(tl, T3 + 2.6);
  });
  S.caption(T3 + 0.2, cap + 5);
  S.cam(T3 + 0.3, { x: 201, y: 430, zoom: 1.65 }, 0.9);
  S.cursorTo(T3 + 1.95, pick[0], 0.45);
  S.click(T3 + 2.4, pick[0], { press: true });
  S.cursorTo(T3 + 2.95, pick[1], 0.45);
  S.click(T3 + 3.4, pick[1], { press: true });
  S.cursorTo(T3 + 4.2, cta, 0.45);
  S.click(T3 + 4.7, cta, { press: true });

  var T4 = T3 + 4.9;
  add(function (tl) {
    swap(tl, p[3], p[4], T4, 4);
    label(tl, T4 + 0.5, 1);
    tl.fromTo(one(".fx-eb em"), { scale: 0, rotation: -12 }, o({ scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2.6)" }), T4 + 0.9);
    tl.fromTo(one(".fx-doc.d1"), { rotation: 14, x: 22, opacity: 0, transformOrigin: "50% 90%" }, o({ rotation: 0, x: 0, opacity: 1, duration: 0.6, ease: "back.out(1.6)" }), T4 + 0.8);
    tl.fromTo(one(".fx-doc.d2"), { rotation: -12, x: -22, opacity: 0, transformOrigin: "50% 90%" }, o({ rotation: 0, x: 0, opacity: 1, duration: 0.6, ease: "back.out(1.6)" }), T4 + 0.9);
    tl.fromTo(one(".fx-doc.d3"), { y: 30, opacity: 0 }, o({ y: 0, opacity: 1, duration: 0.55, ease: "back.out(1.8)" }), T4 + 1.0);
    tl.fromTo(one(".fx-plus"), { scale: 0, rotation: -90, transformOrigin: "50% 50%" }, o({ scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2.6)" }), T4 + 1.3);
  });
  S.caption(T4 + 0.2, cap + 6);
  S.cam(T4 + 0.3, { x: 201, y: 437, zoom: 1.6 }, 0.9);
  S.mark(T4 + 1.4, one(".fx-note"), { hold: 1.6, pad: 8, radius: 18 });
  S.cursorTo(T4 + 3.3, cta, 0.45);
  S.click(T4 + 3.8, cta, { press: true });

  var T5 = T4 + 4.0;
  var pct = one(".fx-pct");
  var ring = one(".fx-ringw");
  add(function (tl) {
    tl.fromTo(segs[3], { scaleX: 0 }, o({ scaleX: 1, duration: 0.5, ease: "power3.inOut" }), T5);
    tl.fromTo(segs, { backgroundColor: "#7e3bed" }, o({ backgroundColor: "#c6ff34", duration: 0.2, ease: "none", stagger: 0.06 }), T5 + 0.5);
    tl.fromTo(one(".fx-bar"), { scaleY: 1 }, o({ scaleY: 1.8, duration: 0.15, ease: "power2.out", yoyo: true, repeat: 1 }), T5 + 0.6);
    tl.to(one(".fx-chrome"), { y: -30, opacity: 0, duration: 0.4, ease: "power3.in" }, T5 + 0.95);
    tl.to(p[4], { y: 40, opacity: 0, duration: 0.45, ease: "power3.in" }, T5 + 0.5);
    tl.set(p[4], { visibility: "hidden" }, T5 + 1.0);
    tl.fromTo(p[5], { opacity: 0, visibility: "visible" }, o({ opacity: 1, duration: 0.01 }), T5 + 0.9);
    tl.fromTo(ring, { scale: 0.5, opacity: 0 }, o({ scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.6)" }), T5 + 0.9);
    tl.fromTo(one(".fx-arc"), { strokeDashoffset: 1 }, o({ strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }), T5 + 1.1);
    count(tl, pct, 0, 100, T5 + 1.1, 1.2, function (v) { return Math.round(v) + "%"; });
    tl.to(pct, { scale: 0.4, opacity: 0, duration: 0.25, ease: "power2.in" }, T5 + 2.35);
    tl.fromTo(one(".fx-ok"), { scale: 0, rotation: -90 }, o({ scale: 1, rotation: 0, duration: 0.55, ease: "back.out(2.6)" }), T5 + 2.45);
    tl.to(one(".fx-arc"), { stroke: "#16a34a", duration: 0.3 }, T5 + 2.4);
    tl.fromTo(ring, { scale: 1 }, o({ scale: 1.1, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 }), T5 + 2.45);
    tl.fromTo(one(".fx-dt"), { y: 30, opacity: 0 }, o({ y: 0, opacity: 1, duration: 0.55, ease: "back.out(1.8)" }), T5 + 2.6);
    tl.fromTo(one(".fx-ds"), { y: 16, opacity: 0 }, o({ y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }), T5 + 2.8);
    tl.fromTo(one(".fx-sum"), { y: 60, opacity: 0 }, o({ y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }), T5 + 2.9);
    tl.fromTo(q(".fx-row"), { x: -26, opacity: 0 }, o({ x: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.14 }), T5 + 3.1);
    tl.fromTo(q(".fx-row i"), { scale: 0.3, rotation: -40 }, o({ scale: 1, rotation: 0, duration: 0.45, ease: "back.out(2.4)", stagger: 0.14 }), T5 + 3.15);
    label(tl, T5 + 1.0, 2);
    tl.fromTo(cta, { backgroundColor: "#7e3bed", color: "#ffffff" }, o({ backgroundColor: "#c6ff34", color: "#22084a", duration: 0.4 }), T5 + 1.0);
  });
  S.confetti(T5 + 2.5, S.rect(ring), { count: 80, seed: 21, power: 0.95 });
  S.caption(T5 + 1.0, cap + 7);
  S.cam(T5 + 0.9, { x: 201, y: 437, zoom: 1.6 }, 0.9);
  S.cursorTo(T5 + 4.9, cta, 0.45);
  S.click(T5 + 5.4, cta, { press: true });
  return T5 + 5.8;
}
