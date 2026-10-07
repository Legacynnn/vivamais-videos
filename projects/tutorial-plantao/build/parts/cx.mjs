const CK = '<svg viewBox="0 0 24 24" fill="none"><path d="M6 12.5l4 4 8-9" stroke="#fafafe" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="20" stroke-dashoffset="20"/></svg>';
const SP = '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="rgba(250,250,254,.2)" stroke-width="3"/><path d="M12 3a9 9 0 0 1 9 9" stroke="#c6ff34" stroke-width="3" stroke-linecap="round"/></svg>';
const STEPS = [
  ["Sala segura criada", "Criptografia de ponta a ponta"],
  ["Câmera e microfone prontos", "Você pode testar antes de entrar"],
  ["Dra. Camila entrou na sala", "Ela já leu sua anamnese"],
];

export const CX_HTML = `<div class="cx">
<div class="cx-aura"></div>
<div class="cx-ring"><i></i><i></i><i></i><img src="assets/doctors/camila.jpg" alt=""><svg class="cx-arc" viewBox="0 0 200 200" fill="none"><circle cx="100" cy="100" r="92" stroke="#c6ff34" stroke-width="5" stroke-linecap="round" stroke-dasharray="578" stroke-dashoffset="578" transform="rotate(-90 100 100)"/></svg><div class="cx-dot"></div></div>
<div class="cx-k">Médica encontrada</div>
<h2 class="cx-t"><span>Conectando com<br>Dra. Camila Rocha</span><span>Tudo pronto!</span></h2>
<p class="cx-s">Clínica geral · CRM-SP 184233</p>
<ul class="cx-steps">${STEPS.map(([t, s]) => `<li><em>${SP}<span class="cx-ok">${CK}</span></em><div><b>${t}</b><span>${s}</span></div></li>`).join("")}</ul>
<div class="cx-foot"><i></i>Sua anamnese já está com a médica</div>
</div>`;

export const CX_CSS = `
.cx{position:absolute;inset:0;background:#22084a;overflow:hidden}
.cx *{box-sizing:border-box}
.cx-aura{position:absolute;left:-160px;top:-40px;width:720px;height:720px;border-radius:50%;background:radial-gradient(circle,rgba(157,107,242,.5) 0%,rgba(126,59,237,.16) 42%,rgba(34,8,74,0) 70%)}
.cx-ring{position:absolute;left:101px;top:150px;width:200px;height:200px}
.cx-ring i{position:absolute;inset:0;border-radius:50%;border:2px solid rgba(198,255,52,.35)}
.cx-ring img{position:absolute;left:22px;top:22px;width:156px;height:156px;border-radius:50%;object-fit:cover;box-shadow:0 20px 50px rgba(10,2,30,.5)}
.cx-arc{position:absolute;inset:0;width:200px;height:200px}
.cx-dot{position:absolute;right:26px;bottom:26px;width:22px;height:22px;border-radius:50%;background:#8cc900;box-shadow:0 0 0 4px #22084a}
.cx-k{position:absolute;left:0;right:0;top:384px;text-align:center;font-family:DMSans_700Bold;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#c6ff34}
.cx-t{position:absolute;left:24px;right:24px;top:408px;height:76px;margin:0;text-align:center;font-family:SpaceGrotesk_700Bold;font-size:30px;line-height:1.1;letter-spacing:-.7px;color:#fafafe}
.cx-t span{position:absolute;left:0;right:0;top:0}
.cx-s{position:absolute;left:0;right:0;top:490px;margin:0;text-align:center;font-family:DMSans_400Regular;font-size:14px;color:#d6c3fb}
.cx-steps{position:absolute;left:24px;right:24px;top:540px;margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px}
.cx-steps li{display:flex;align-items:center;gap:14px;height:64px;padding:0 16px;border-radius:18px;background:rgba(250,250,254,.08);box-shadow:inset 0 0 0 1px rgba(250,250,254,.1)}
.cx-steps em{position:relative;flex:none;width:28px;height:28px}
.cx-steps em svg{position:absolute;inset:0;width:28px;height:28px}
.cx-ok{position:absolute;inset:0;display:grid;place-items:center;border-radius:50%;background:#7e3bed}
.cx-ok svg{position:static;width:18px;height:18px}
.cx-steps b{display:block;font-family:DMSans_500Medium;font-weight:400;font-size:15px;color:#fafafe}
.cx-steps span{display:block;font-family:DMSans_400Regular;font-size:12.5px;color:#bfa6f6}
.cx-foot{position:absolute;left:0;right:0;bottom:48px;display:flex;align-items:center;justify-content:center;gap:8px;font-family:DMSans_500Medium;font-size:13px;color:#d6c3fb}
.cx-foot i{width:8px;height:8px;border-radius:50%;background:#c6ff34}
`;

export function cxLife(S, cx, t0) {
  const q = (s) => S.one(s, cx);
  const qa = (s) => S.all(s, cx);
  const rings = qa(".cx-ring i");
  const rows = qa(".cx-steps li");
  const titles = qa(".cx-t span");
  const STEP = 1.0;
  gsap.set(titles[1], { opacity: 0 });
  rows.forEach((r) => gsap.set(r, { opacity: 0.4 }));
  qa(".cx-ok").forEach((o) => gsap.set(o, { scale: 0 }));
  S.add((tl) => {
    tl.fromTo(q(".cx-ring img"), { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, t0);
    tl.fromTo(q(".cx-dot"), { scale: 0 }, { scale: 1, duration: 0.4, ease: "power3.out", immediateRender: false, transformOrigin: "50% 50%" }, t0 + 0.5);
    tl.fromTo([q(".cx-k"), q(".cx-t"), q(".cx-s"), q(".cx-foot")], { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.07, immediateRender: false }, t0 + 0.2);
    tl.fromTo(rows, { y: 18 }, { y: 0, duration: 0.45, ease: "power3.out", stagger: 0.07, immediateRender: false }, t0 + 0.4);
    rings.forEach((r, i) => {
      for (let k = 0; k < 3; k++) {
        tl.fromTo(r, { scale: 1, opacity: 0.8 }, { scale: 1.55 + i * 0.1, opacity: 0, duration: 1.4, ease: "power2.out", immediateRender: false, transformOrigin: "50% 50%" }, t0 + 0.3 + i * 0.3 + k * 1.2);
      }
    });
    tl.to(q(".cx-arc circle"), { strokeDashoffset: 0, duration: STEP * 3 + 0.4, ease: "power1.inOut" }, t0 + 0.5);
    rows.forEach((r, i) => {
      const s = t0 + 0.7 + i * STEP;
      const sp = r.querySelector("em > svg");
      const ok = r.querySelector(".cx-ok");
      tl.to(r, { opacity: 1, duration: 0.2, ease: "none" }, s);
      tl.fromTo(sp, { rotation: 0 }, { rotation: 540, duration: STEP - 0.15, ease: "none", immediateRender: false, transformOrigin: "50% 50%" }, s);
      tl.set(sp, { opacity: 0 }, s + STEP - 0.15);
      tl.fromTo(ok, { scale: 0 }, { scale: 1, duration: 0.35, ease: "power3.out", immediateRender: false }, s + STEP - 0.18);
      tl.to(ok.querySelector("path"), { strokeDashoffset: 0, duration: 0.25, ease: "power2.out" }, s + STEP - 0.05);
    });
    const fin = t0 + 0.7 + STEP * 3 + 0.2;
    tl.to(titles[0], { opacity: 0, y: -14, duration: 0.2, ease: "power2.in" }, fin);
    tl.fromTo(titles[1], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out", immediateRender: false }, fin + 0.15);
  });
  return { fin: t0 + 0.7 + STEP * 3 + 0.5 };
}
