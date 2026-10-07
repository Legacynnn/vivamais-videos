const CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
const PIX = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.6 7.9 6.7h1.3c.8 0 1.5.3 2.1.9l.7.7.7-.7c.6-.6 1.3-.9 2.1-.9h1.3L12 2.6zM5.6 9l-3 3 3 3h2.3c.4 0 .8-.2 1.1-.5l1.4-1.4c.4-.4.9-.6 1.6-.6s1.2.2 1.6.6l1.4 1.4c.3.3.7.5 1.1.5h2.3l3-3-3-3h-2.3c-.4 0-.8.2-1.1.5l-1.4 1.4c-.9.9-2.3.9-3.2 0L9 9.5C8.7 9.2 8.3 9 7.9 9H5.6zm2.3 8.3L12 21.4l4.1-4.1h-1.3c-.8 0-1.5-.3-2.1-.9l-.7-.7-.7.7c-.6.6-1.3.9-2.1.9H7.9z"/></svg>`;
const CODE = "00020126580014br.gov.bcb.pix0136pix.asaas.com/qr/cobv/8c1f6b0e2a4d52040000530398654061 35.005802BR5909VIVA MAIS6009SAO PAULO6304A1F2";

export const BANK_HTML = `<div class="bk-toast"><b>${CHECK}</b>Código Pix copiado</div>
<div class="bk-app">
<div class="bk-scr bk-home">
<div class="bk-top"><div class="bk-av">M</div><div><small>Olá,</small><strong>Maria</strong></div></div>
<div class="bk-bal"><small>Saldo em conta</small><strong>R$ 2.418,90</strong></div>
<div class="bk-grid">
<div class="bk-act bk-pix-btn"><b>${PIX}</b><span>Pix</span></div>
<div class="bk-act"><b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/></svg></b><span>Pagar</span></div>
<div class="bk-act"><b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h12l-3-3M17 17H5l3 3"/></svg></b><span>Transferir</span></div>
<div class="bk-act"><b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20"/></svg></b><span>Cartões</span></div>
</div>
<div class="bk-list"><div class="bk-row"></div><div class="bk-row"></div><div class="bk-row"></div></div>
</div>
<div class="bk-scr bk-pixmenu">
<div class="bk-bar">Área Pix</div>
<div class="bk-opts">
<div class="bk-opt"><b>${PIX}</b><div><strong>Pagar com QR code</strong><small>Aponte a câmera</small></div></div>
<div class="bk-opt bk-cc"><b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg></b><div><strong>Pix copia e cola</strong><small>Cole o código que você copiou</small></div></div>
<div class="bk-opt"><b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h12l-3-3M17 17H5l3 3"/></svg></b><div><strong>Transferir</strong><small>Com chave Pix</small></div></div>
</div>
</div>
<div class="bk-scr bk-paste">
<div class="bk-bar">Pix copia e cola</div>
<p class="bk-lbl">Código Pix</p>
<div class="bk-field"><span class="bk-code">${CODE}</span></div>
<div class="bk-btn bk-go">Continuar</div>
</div>
<div class="bk-scr bk-confirm">
<div class="bk-bar">Confirme o pagamento</div>
<p class="bk-lbl">Você está pagando</p>
<div class="bk-val">R$ 135,00</div>
<div class="bk-to"><div class="bk-to-l">V+</div><div><strong>VIVA MAIS</strong><small>Consulta · Rafael Lima</small></div></div>
<div class="bk-kvs"><div class="bk-kv"><span>Data</span><b>Hoje</b></div>
<div class="bk-kv"><span>Forma</span><b>Pix</b></div></div>
<div class="bk-btn bk-pay">Pagar R$ 135,00</div>
</div>
<div class="bk-scr bk-done">
<div class="bk-ok"><b>${CHECK}</b></div>
<h2>Pix enviado!</h2>
<p>R$ 135,00 para VIVA MAIS</p>
</div>
</div>`;

export const BANK_CSS = `
.bk-toast{position:absolute;left:66px;top:66px;width:270px;height:46px;border-radius:999px;background:#17151e;color:#fff;font-family:"DM Sans",sans-serif;font-size:15px;font-weight:700;display:flex;flex-direction:row;align-items:center;justify-content:center;gap:8px;opacity:0;z-index:3;box-shadow:0 12px 30px rgba(0,0,0,.25)}
.bk-toast b{width:22px;height:22px;border-radius:50%;background:#c6ff34;color:#22084a;display:grid;place-items:center}
.bk-toast b svg{width:14px;height:14px}
.bk-app{position:absolute;inset:0;background:#f3f5f8;font-family:"DM Sans",sans-serif;color:#1d2433;opacity:0;overflow:hidden}
.bk-scr{position:absolute;inset:0;background:#f3f5f8;opacity:0}
.bk-home{background:linear-gradient(180deg,#14324a 0%,#14324a 300px,#f3f5f8 300px)}
.bk-top{position:absolute;left:22px;top:74px;display:flex;flex-direction:row;gap:12px;align-items:center;color:#fff}
.bk-av{width:44px;height:44px;border-radius:50%;background:#2c5b80;display:grid;place-items:center;font-weight:700;font-size:18px}
.bk-top small{display:block;font-size:13px;color:#b9cfe0}
.bk-top strong{display:block;font-size:18px}
.bk-bal{position:absolute;left:22px;top:150px;color:#fff}
.bk-bal small{display:block;font-size:13px;color:#b9cfe0}
.bk-bal strong{display:block;margin-top:4px;font-size:30px;font-weight:700}
.bk-grid{position:absolute;left:16px;right:16px;top:250px;display:flex;flex-direction:row;justify-content:space-between;padding:18px 14px;border-radius:20px;background:#fff;box-shadow:0 10px 24px rgba(20,40,60,.12)}
.bk-act{width:76px;display:flex;flex-direction:column;align-items:center;gap:8px}
.bk-act b{width:54px;height:54px;border-radius:18px;background:#e8f1f7;color:#14324a;display:grid;place-items:center}
.bk-act b svg{width:26px;height:26px}
.bk-pix-btn b{background:#0fa38f;color:#fff}
.bk-act span{font-size:14px;font-weight:700}
.bk-list{position:absolute;left:16px;right:16px;top:400px;display:flex;flex-direction:column;gap:10px}
.bk-row{height:62px;border-radius:16px;background:#fff}
.bk-bar{position:absolute;left:0;right:0;top:60px;height:56px;padding:0 22px;display:flex;align-items:center;font-size:20px;font-weight:700;background:#14324a;color:#fff;padding-top:0}
.bk-pixmenu .bk-bar,.bk-paste .bk-bar,.bk-confirm .bk-bar{top:0;height:116px;align-items:flex-end;padding-bottom:16px}
.bk-opts{position:absolute;left:16px;right:16px;top:136px;display:flex;flex-direction:column;gap:12px}
.bk-opt{position:relative;display:flex;flex-direction:row;align-items:center;gap:14px;padding:16px;border-radius:18px;background:#fff;box-shadow:0 4px 12px rgba(20,40,60,.06)}
.bk-opt b{width:46px;height:46px;border-radius:14px;background:#e3f6f3;color:#0fa38f;display:grid;place-items:center;flex:none}
.bk-opt b svg{width:24px;height:24px}
.bk-opt strong{display:block;font-size:16px}
.bk-opt small{display:block;font-size:13px;color:#6b7686}
.bk-lbl{position:absolute;left:22px;top:136px;margin:0;font-size:14px;color:#6b7686}
.bk-field{position:absolute;left:16px;right:16px;top:164px;min-height:120px;padding:14px;border-radius:16px;background:#fff;border:2px solid #0fa38f;font-family:"SFMono-Regular",monospace;font-size:13px;line-height:19px;word-break:break-all;color:#1d2433}
.bk-btn{position:absolute;left:16px;right:16px;bottom:48px;height:56px;border-radius:16px;background:#0fa38f;color:#fff;font-size:18px;font-weight:700;display:grid;place-items:center}
.bk-val{position:absolute;left:22px;top:160px;font-size:40px;font-weight:700}
.bk-to{position:absolute;left:16px;right:16px;top:228px;display:flex;flex-direction:row;align-items:center;gap:12px;padding:14px;border-radius:16px;background:#fff}
.bk-to-l{width:44px;height:44px;border-radius:12px;background:#6a24db;color:#fff;display:grid;place-items:center;font-weight:700}
.bk-to strong{display:block;font-size:16px}
.bk-to small{display:block;font-size:13px;color:#6b7686}
.bk-kvs{position:absolute;left:22px;right:22px;top:310px}
.bk-kv{position:relative;display:flex;flex-direction:row;justify-content:space-between;padding:14px 0;border-bottom:1px solid #e3e7ee;font-size:15px}
.bk-kv span{color:#6b7686}
.bk-done{background:#0fa38f;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center}
.bk-ok{width:110px;height:110px;border-radius:50%;background:#fff;color:#0fa38f;display:grid;place-items:center}
.bk-ok b svg{width:60px;height:60px}
.bk-done h2{margin:24px 0 0;font-size:32px}
.bk-done p{margin:8px 0 0;font-size:16px;color:#d8f4ef}
`;

export function bankRun(S, t, copyBtn) {
  var L = S.layer("bank");
  var q = function (s) {
    return S.all(s, L);
  };
  var app = q(".bk-app")[0];
  var scr = function (c) {
    return q(".bk-" + c)[0];
  };
  var toast = q(".bk-toast")[0];
  var code = q(".bk-code")[0];
  var full = code.textContent;
  var p = { n: 0 };
  gsap.set(L, { autoAlpha: 0 });
  S.cursorTo(t, copyBtn, 0.6);
  S.click(t + 0.7, copyBtn, { press: true });
  var pix = q(".bk-pix-btn")[0];
  var cc = q(".bk-cc")[0];
  var go = q(".bk-go")[0];
  var pay = q(".bk-pay")[0];
  var s0 = t + 2.6;
  S.cursorTo(s0 + 1.6, pix, 0.6);
  S.click(s0 + 2.3, pix, { press: true });
  S.cursorTo(s0 + 3.4, cc, 0.6);
  S.click(s0 + 4.1, cc, { press: true });
  S.cursorTo(s0 + 6.4, go, 0.6);
  S.click(s0 + 7.1, go, { press: true });
  S.cursorTo(s0 + 9.8, pay, 0.6);
  S.click(s0 + 10.5, pay, { press: true });
  S.status(s0 + 0.2, true);
  S.status(s0 + 13.6, false);
  S.add(function (tl) {
    tl.set(L, { visibility: "visible", opacity: 1 }, t + 0.8);
    tl.fromTo(toast, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", immediateRender: false }, t + 0.8);
    tl.to(toast, { opacity: 0, y: -20, duration: 0.3, ease: "power2.in" }, t + 2.3);
    tl.set(scr("home"), { opacity: 1 }, s0);
    tl.fromTo(app, { opacity: 1, x: 402, scale: 0.9, borderRadius: 40 }, { opacity: 1, x: 0, scale: 1, borderRadius: 0, duration: 0.8, ease: "power3.inOut", immediateRender: false }, s0);
    tl.fromTo(scr("pixmenu"), { opacity: 1, x: 402 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.inOut", immediateRender: false }, s0 + 2.5);
    tl.fromTo(scr("paste"), { opacity: 1, x: 402 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.inOut", immediateRender: false }, s0 + 4.3);
    tl.fromTo(p, { n: 0 }, { n: full.length, duration: 1.3, ease: "expo.in", immediateRender: false, onUpdate: function () { code.textContent = full.slice(0, Math.round(p.n)); } }, s0 + 4.3);
    tl.fromTo(scr("confirm"), { opacity: 1, x: 402 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.inOut", immediateRender: false }, s0 + 7.3);
    tl.fromTo(scr("done"), { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, s0 + 10.7);
    tl.fromTo(q(".bk-ok")[0], { scale: 0.3 }, { scale: 1, duration: 0.6, ease: "power3.out", immediateRender: false }, s0 + 10.8);
    tl.to(app, { x: 402, scale: 0.9, borderRadius: 40, duration: 0.8, ease: "power3.inOut" }, s0 + 13.0);
    tl.set(L, { autoAlpha: 0 }, s0 + 13.8);
  });
  code.textContent = "";
  return { paste: q(".bk-field")[0], confirm: q(".bk-to")[0], done: q(".bk-ok")[0], back: s0 + 13.0, at: { pix: s0, paste: s0 + 4.3, confirm: s0 + 7.3, done: s0 + 10.7 } };
}
