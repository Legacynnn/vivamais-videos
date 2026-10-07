const CK = '<svg viewBox="0 0 24 24" fill="none"><path d="M6 12.5l4 4 8-9" stroke="#17151e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="20" stroke-dashoffset="20"/></svg>';
const PAPER = (lines, accent) => `<svg class="dg-paper" viewBox="0 0 64 80" fill="none"><path d="M6 4h36l16 16v56H6z" fill="#fafafe" stroke="#17151e" stroke-width="2.4" stroke-linejoin="round"/><path d="M42 4v16h16" fill="#ebe1fd" stroke="#17151e" stroke-width="2.4" stroke-linejoin="round"/>${lines.map((w, i) => `<path class="dg-line" d="M14 ${34 + i * 10}h${w}" stroke="${i === 0 ? accent : "#d6c3fb"}" stroke-width="4" stroke-linecap="round" pathLength="1"/>`).join("")}</svg>`;
const DOCS = [
  ["Receita simples", "Dipirona · Ciclobenzaprina", [28, 36, 22], "#7e3bed"],
  ["Pedido de exames", "Hemograma · Glicemia", [24, 34, 30], "#7e3bed"],
  ["Atestado médico", "1 dia de afastamento", [30, 26, 18], "#8cc900"],
  ["Prontuário", "Resumo assinado pela médica", [34, 32, 28], "#7e3bed"],
];

export const DG_HTML = `<div class="dg">
<div class="dg-aura"></div>
<div class="dg-k">Consulta encerrada</div>
<h2 class="dg-t"><span>Preparando seus documentos</span><span>Tudo chegou no app</span></h2>
<p class="dg-s">Assinados digitalmente pela Dra. Camila Rocha</p>
<div class="dg-list">${DOCS.map(([t, s, l, a]) => `<div class="dg-doc">${PAPER(l, a)}<div class="dg-b"><b>${t}</b><span>${s}</span></div><div class="dg-st"><i class="dg-sp"></i><u class="dg-ok">${CK}</u></div></div>`).join("")}</div>
<div class="dg-phone"><div class="dg-phone-s"><i></i><b>4 documentos</b><span>salvos em Arquivos</span></div></div>
</div>`;

const STATS = [
  ["14 min", "duração"],
  ["2", "remédios"],
  ["2", "exames"],
  ["1 dia", "afastamento"],
];

export const SM_HTML = `<div class="sm">
<div class="sm-ok"><svg viewBox="0 0 24 24" fill="none"><path d="M6 12.5l4 4 8-9" stroke="#fafafe" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="20" stroke-dashoffset="20"/></svg></div>
<h2 class="sm-t">Consulta concluída</h2>
<p class="sm-s">Plantão 24h · hoje, 14:32</p>
<div class="sm-card">
<div class="sm-doc"><img src="assets/doctors/camila.jpg" alt=""><div><b>Dra. Camila Rocha</b><span>Clínica geral · CRM-SP 184233</span></div></div>
<div class="sm-dx"><span>Diagnóstico</span><b>Cefaleia tensional</b></div>
<div class="sm-stats">${STATS.map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join("")}</div>
<div class="sm-next"><i></i>Retorno se a dor persistir por mais de 5 dias</div>
</div>
<div class="sm-cta">Ver pós-consulta<span><svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>
</div>`;

export const DG_CSS = `
.dg,.sm{position:absolute;inset:0;background:#fafafe;overflow:hidden}
.dg *,.sm *{box-sizing:border-box}
.dg-aura{position:absolute;right:-200px;top:-220px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(157,107,242,.26) 0%,rgba(157,107,242,.1) 40%,rgba(250,250,254,0) 70%)}
.dg-k{position:absolute;left:24px;top:110px;font-family:DMSans_700Bold;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#5719b6}
.dg-t{position:absolute;left:24px;right:24px;top:134px;height:76px;margin:0;font-family:SpaceGrotesk_700Bold;font-size:32px;line-height:1.05;letter-spacing:-.8px;color:#17151e}
.dg-t span{position:absolute;left:0;right:0;top:0}
.dg-s{position:absolute;left:24px;right:24px;top:216px;margin:0;font-family:DMSans_400Regular;font-size:14px;color:#726f80}
.dg-list{position:absolute;left:20px;right:20px;top:262px;display:flex;flex-direction:column;gap:12px}
.dg-doc{display:flex;align-items:center;gap:14px;height:88px;padding:0 16px 0 14px;border-radius:22px;background:#fff;box-shadow:0 0 0 1px #ebe1fd,0 10px 24px rgba(53,14,111,.06)}
.dg-paper{flex:none;width:48px;height:60px}
.dg-b{flex:1;display:flex;flex-direction:column;gap:3px}
.dg-b b{font-family:DMSans_700Bold;font-weight:400;font-size:15px;color:#17151e}
.dg-b span{font-family:DMSans_400Regular;font-size:12.5px;color:#726f80}
.dg-st{position:relative;flex:none;width:30px;height:30px}
.dg-sp{position:absolute;inset:0;border-radius:50%;border:3px solid #ebe1fd;border-top-color:#7e3bed}
.dg-ok{position:absolute;inset:0;display:grid;place-items:center;border-radius:50%;background:#c6ff34}
.dg-ok svg{width:18px;height:18px}
.dg-phone{position:absolute;left:20px;right:20px;bottom:44px}
.dg-phone-s{display:flex;align-items:center;gap:10px;height:56px;padding:0 18px;border-radius:18px;background:#22084a;color:#fafafe;font-family:DMSans_400Regular;font-size:13px}
.dg-phone-s i{width:10px;height:10px;border-radius:50%;background:#c6ff34}
.dg-phone-s b{font-family:DMSans_700Bold;font-weight:400;font-size:14px}
.dg-phone-s span{color:#d6c3fb}
.sm{display:flex;flex-direction:column;align-items:center;padding-top:120px}
.sm-ok{display:grid;place-items:center;width:104px;height:104px;border-radius:50%;background:#7e3bed;box-shadow:0 0 0 14px #ebe1fd}
.sm-ok svg{width:54px;height:54px}
.sm-t{margin:30px 0 0;font-family:SpaceGrotesk_700Bold;font-size:30px;letter-spacing:-.6px;color:#17151e}
.sm-s{margin:8px 0 0;font-family:DMSans_400Regular;font-size:15px;color:#726f80}
.sm-card{margin-top:26px;width:354px;padding:16px;border-radius:24px;background:#fff;box-shadow:0 0 0 1px #ebe1fd,0 14px 30px rgba(53,14,111,.08)}
.sm-doc{display:flex;align-items:center;gap:12px}
.sm-doc img{width:44px;height:44px;border-radius:50%;object-fit:cover}
.sm-doc b{display:block;font-family:DMSans_700Bold;font-weight:400;font-size:15px;color:#17151e}
.sm-doc span{display:block;font-family:DMSans_400Regular;font-size:12.5px;color:#726f80}
.sm-dx{margin-top:14px;padding:12px 14px;border-radius:16px;background:#f3edff}
.sm-dx span{display:block;font-family:DMSans_400Regular;font-size:12px;color:#5719b6}
.sm-dx b{display:block;margin-top:2px;font-family:SpaceGrotesk_700Bold;font-weight:400;font-size:19px;letter-spacing:-.3px;color:#22084a}
.sm-stats{margin-top:12px;display:flex;gap:8px}
.sm-stats>div{flex:1;height:56px;border-radius:14px;background:#fafafe;box-shadow:inset 0 0 0 1px #ebe1fd;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px}
.sm-stats b{font-family:SpaceGrotesk_700Bold;font-weight:400;font-size:16px;letter-spacing:-.3px;color:#17151e}
.sm-stats span{font-family:DMSans_400Regular;font-size:10.5px;color:#726f80}
.sm-next{margin-top:12px;display:flex;align-items:center;gap:8px;font-family:DMSans_400Regular;font-size:12.5px;color:#403d4a}
.sm-next i{flex:none;width:8px;height:8px;border-radius:50%;background:#c6ff34;box-shadow:0 0 0 3px #f1ffc6}
.sm-cta{position:absolute;left:24px;right:24px;bottom:48px;height:56px;border-radius:18px;background:#7e3bed;display:flex;align-items:center;justify-content:space-between;padding:0 9px 0 22px;font-family:DMSans_700Bold;font-size:17px;color:#fafafe;box-shadow:0 14px 30px rgba(126,59,237,.35)}
.sm-cta span{display:grid;place-items:center;width:40px;height:40px;border-radius:13px;background:#fafafe;color:#7e3bed}
.sm-cta svg{width:20px;height:20px}
`;

export function dgLife(S, dg, t0) {
  const q = (s) => S.one(s, dg);
  const qa = (s) => S.all(s, dg);
  const docs = qa(".dg-doc");
  const titles = qa(".dg-t span");
  const STEP = 0.85;
  gsap.set(titles[1], { opacity: 0 });
  qa(".dg-ok").forEach((o) => gsap.set(o, { scale: 0 }));
  S.add((tl) => {
    tl.fromTo([q(".dg-k"), q(".dg-t"), q(".dg-s")], { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.07, immediateRender: false }, t0);
    docs.forEach((d, i) => {
      const s = t0 + 0.4 + i * STEP;
      const sp = d.querySelector(".dg-sp");
      const ok = d.querySelector(".dg-ok");
      const lines = Array.prototype.slice.call(d.querySelectorAll(".dg-line"));
      tl.fromTo(d, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, s);
      tl.fromTo(sp, { rotation: 0 }, { rotation: 720, duration: STEP + 0.3, ease: "none", immediateRender: false, transformOrigin: "50% 50%" }, s);
      tl.fromTo(lines, { strokeDashoffset: 1, strokeDasharray: 1 }, { strokeDashoffset: 0, duration: 0.3, ease: "power2.out", stagger: 0.14, immediateRender: false }, s + 0.2);
      tl.to(sp, { opacity: 0, duration: 0.15, ease: "none" }, s + STEP + 0.15);
      tl.fromTo(ok, { scale: 0 }, { scale: 1, duration: 0.35, ease: "power3.out", immediateRender: false }, s + STEP + 0.1);
      tl.to(ok.querySelector("path"), { strokeDashoffset: 0, duration: 0.25, ease: "power2.out" }, s + STEP + 0.25);
    });
    const fin = t0 + 0.4 + 3 * STEP + STEP + 0.5;
    tl.fromTo(q(".dg-phone"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, fin - 0.2);
    tl.to(titles[0], { opacity: 0, y: -14, duration: 0.2, ease: "power2.in" }, fin);
    tl.fromTo(titles[1], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out", immediateRender: false }, fin + 0.15);
  });
  return { fin: t0 + 0.4 + 4 * STEP + 0.7 };
}

export function smLife(S, sm, t0) {
  const q = (s) => S.one(s, sm);
  const qa = (s) => S.all(s, sm);
  S.add((tl) => {
    tl.fromTo(q(".sm-ok"), { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.55, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, t0 + 0.1);
    tl.to(q(".sm-ok path"), { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, t0 + 0.4);
    tl.fromTo([q(".sm-t"), q(".sm-s")], { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.07, immediateRender: false }, t0 + 0.35);
    tl.fromTo(q(".sm-card"), { y: 40, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out", immediateRender: false, transformOrigin: "50% 0%" }, t0 + 0.6);
    tl.fromTo(qa(".sm-stats>div"), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.07, immediateRender: false }, t0 + 0.95);
    tl.fromTo(q(".sm-cta"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, t0 + 1.2);
  });
  return { fin: t0 + 1.7 };
}
