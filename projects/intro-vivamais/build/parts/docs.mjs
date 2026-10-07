function qr(seed) {
  const n = 25;
  let s = seed;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const cells = [];
  const finder = (x, y) => x < 7 && y < 7;
  const inFinder = (x, y) => finder(x, y) || finder(n - 1 - x, y) || finder(x, n - 1 - y);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      if (inFinder(x, y)) continue;
      if (rnd() > 0.52) cells.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
    }
  const f = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" rx="1.2" fill="none" stroke="#17151e" stroke-width="1"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx=".6"/>`;
  return `<svg class="dv-qr" viewBox="-0.5 -0.5 ${n + 1} ${n + 1}" fill="#17151e">${f(0, 0)}${f(n - 7, 0)}${f(0, n - 7)}${cells.join("")}</svg>`;
}

const SIG = `<svg class="dv-sig" viewBox="0 0 260 90" fill="none"><path d="M12 62c10-26 22-44 30-40 7 4-8 38-2 42 8 5 18-34 26-32 6 2-4 26 2 28 7 2 12-20 20-19 7 1 2 16 8 17 9 2 16-24 26-22 6 1 1 14 7 15 12 2 26-14 40-16 16-2 30 6 50 2M70 74c30-6 70-10 120-8" stroke="#22084a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const SEAL = `<div class="dv-seal"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3l7.5 2.8v5.8c0 4.7-3.2 8.2-7.5 9.9-4.3-1.7-7.5-5.2-7.5-9.9V5.8z" fill="#ebe1fd" stroke="#5719b6" stroke-width="1.8" stroke-linejoin="round"/><path d="M8.5 12.2l2.4 2.4 4.6-5" stroke="#5719b6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><div><b>Assinado digitalmente</b><span>ICP-Brasil · 29/09/2026 14:48</span></div></div>`;

const head = (kind, num) => `<div class="dv-head"><img src="assets/brand/logo.svg" alt="Viva Mais"><div><b>${kind}</b><span>${num}</span></div></div>
<div class="dv-who"><div><em>Médica</em><b>Dra. Camila Rocha</b><span>Clínica geral · CRM-SP 184233</span></div><div><em>Paciente</em><b>Ana Souza</b><span>34 anos · CPF ***.190.457-**</span></div></div>`;

const foot = (seed, code) => `<div class="dv-foot"><div class="dv-sign">${SIG}<i></i><b>Dra. Camila Rocha</b><span>CRM-SP 184233</span></div><div class="dv-val">${qr(seed)}<span>Valide em<br><b>vivamais.ai/validar</b><br>código ${code}</span></div></div>${SEAL}`;

export const DOCS_HTML = `<div class="dv" data-layout-allow-overlap>
<div class="dv-bar"><div class="dv-tabs"><span>Receita</span><span>Exames</span><span>Atestado</span><u></u></div><div class="dv-tool"><em>PDF assinado</em><b>Compartilhar</b></div></div>
<div class="dv-stack">
<article class="dv-paper" data-doc="rx"><img src="assets/docs/receita.png" alt="Receita médica"></article>
<article class="dv-paper" data-doc="ex"><img src="assets/docs/exames.png" alt="Solicitação de exames"></article>
<article class="dv-paper" data-doc="at"><img src="assets/docs/atestado.png" alt="Atestado médico"></article>
</div>
</div>`;

export const DOCS_CSS = `
.dv{position:absolute;left:1130px;top:118px;width:640px;height:860px;font-family:"DM Sans",sans-serif;opacity:0}
.dv-bar{display:flex;align-items:center;justify-content:space-between;height:56px}
.dv-tabs{position:relative;display:flex;gap:6px;padding:5px;border-radius:999px;background:#f3edff}
.dv-tabs span{position:relative;z-index:1;padding:9px 18px;font-weight:500;font-size:18px;color:#5719b6}
.dv-tabs u{position:absolute;left:5px;top:5px;height:calc(100% - 10px);width:104px;border-radius:999px;background:#7e3bed}
.dv-tool{display:flex;align-items:center;gap:12px}
.dv-tool em{font-style:normal;font-size:16px;color:#726f80}
.dv-tool b{padding:10px 16px;border-radius:14px;background:#22084a;font-weight:700;font-size:16px;color:#fafafe}
.dv-stack{position:relative;margin-top:20px;height:780px}
.dv-paper img{display:block;width:640px;height:780px;object-fit:cover;object-position:50% 0}
.dv-paper{position:absolute;left:0;top:0;width:640px;height:780px;box-sizing:border-box;padding:0;border-radius:14px;background:#fff;box-shadow:0 0 0 1px #e6e4ec,0 30px 60px rgba(53,14,111,.14);color:#17151e;overflow:hidden}
.dv-head{display:flex;align-items:center;justify-content:space-between;padding-bottom:22px;box-shadow:inset 0 -2px 0 #7e3bed}
.dv-head img{height:34px}
.dv-head div{display:flex;flex-direction:column;align-items:flex-end;gap:4px}
.dv-head b{font-family:SpaceGrotesk_700Bold;font-weight:400;font-size:24px;letter-spacing:-.4px}
.dv-head span{font-size:14px;color:#726f80;font-variant-numeric:tabular-nums}
.dv-who{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:20px 0;box-shadow:inset 0 -1px 0 #e6e4ec}
.dv-who div{display:flex;flex-direction:column;gap:3px}
.dv-who em{font-style:normal;font-weight:700;font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:#a29fb0}
.dv-who b{font-weight:700;font-size:19px}
.dv-who span{font-size:15px;color:#726f80}
.dv-paper h4{margin:24px 0 12px;font-weight:700;font-size:13px;letter-spacing:1.4px;text-transform:uppercase;color:#5719b6}
.dv-rx{margin:0;padding:0 0 0 24px;display:flex;flex-direction:column;gap:18px}
.dv-rx li{font-size:20px}
.dv-rx li div{display:flex;align-items:baseline;gap:10px}
.dv-rx li b{font-weight:700;font-size:21px}
.dv-rx li i{flex:1;height:0;border-bottom:2px dotted #d2cfdb}
.dv-rx li em{font-style:normal;font-size:17px;color:#403d4a}
.dv-rx li p{margin:6px 0 0;font-size:18px;line-height:26px;color:#403d4a}
.dv-note{margin:22px 0 0;padding:14px 16px;border-radius:12px;background:#f9f8fb;font-size:17px;line-height:24px;color:#403d4a}
.dv-list{margin:0;padding:0 0 0 24px;display:flex;flex-direction:column;gap:12px;font-weight:700;font-size:22px}
.dv-box{margin-top:26px;display:grid;grid-template-columns:auto 1fr;gap:10px 18px;padding:18px;border-radius:12px;background:#f9f8fb;font-size:17px}
.dv-box b{font-weight:700;color:#403d4a}.dv-box span{color:#403d4a}
.dv-text{margin:0;font-size:20px;line-height:32px;color:#17151e}
.dv-cid{margin:18px 0 0;font-size:15px;color:#726f80}
.dv-foot{position:absolute;left:44px;right:44px;bottom:92px;display:flex;align-items:flex-end;justify-content:space-between}
.dv-sign{display:flex;flex-direction:column;width:260px}
.dv-sig{width:230px;height:80px}
.dv-sig path{stroke-dasharray:900;stroke-dashoffset:900}
.dv-sign i{height:0;margin:2px 0 8px;border-bottom:1.5px solid #17151e}
.dv-sign b{font-weight:700;font-size:16px}.dv-sign span{font-size:14px;color:#726f80}
.dv-val{display:flex;align-items:center;gap:14px}
.dv-qr{width:104px;height:104px}
.dv-val span{font-size:13px;line-height:19px;color:#726f80}
.dv-val b{color:#17151e;font-weight:700}
.dv-seal{position:absolute;left:44px;right:44px;bottom:28px;display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:12px;background:#f5f0fe}
.dv-seal svg{width:28px;height:28px;flex:none}
.dv-seal div{display:flex;flex-direction:column}
.dv-seal b{font-weight:700;font-size:15px;color:#22084a}.dv-seal span{font-size:13px;color:#5719b6}
`;
