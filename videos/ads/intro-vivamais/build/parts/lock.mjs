const F = "data-layout-allow-overlap";

export const MARK = `<img src="assets/brand/logo.svg" alt="" ${F}>`;
export const WA = `<svg viewBox="0 0 64 64" ${F}><rect width="64" height="64" rx="16" fill="#25d366"/><path d="M32 14a17 17 0 0 0-14.6 25.7L15.5 49l9.6-2.5A17 17 0 1 0 32 14z" fill="#fff"/><path d="M25.6 23.8c-.4-.9-.8-.9-1.2-.9h-1c-.4 0-.9.1-1.4.7s-1.8 1.8-1.8 4.3 1.9 5 2.1 5.3 3.6 5.8 8.9 7.9c4.4 1.7 5.3 1.4 6.3 1.3s3.1-1.3 3.5-2.5.4-2.3.3-2.5-.4-.4-.9-.6-3.1-1.5-3.5-1.7-.8-.3-1.2.3-1.4 1.7-1.7 2-.6.4-1.1.1a13.7 13.7 0 0 1-6.8-5.9c-.5-.9.5-.8 1.5-2.7.2-.3.1-.6 0-.9s-1-2.6-1.4-3.4z" fill="#25d366"/></svg>`;

export function noteHtml(n, cls = "") {
  return `<div class="lk-note ${cls}" ${F}><i class="lk-ic" ${F}>${n.wa ? WA : MARK}</i><div class="lk-tx" ${F}><div class="lk-hd" ${F}><b ${F}>${n.app || "VIVA MAIS"}</b><span ${F}>${n.when || "agora"}</span></div><strong ${F}>${n.title}</strong><p ${F}>${n.body}</p></div></div>`;
}

export function lockHtml(o) {
  return `<div class="lk ${o.cls || ""}" ${F}><div class="lk-screen" ${F}>
<div class="lk-wall" ${F}></div>
<div class="lk-island" ${F}></div>
<div class="lk-date" ${F}>${o.date || "terça-feira, 30 de setembro"}</div>
<div class="lk-time" ${F}>${o.time}</div>
<div class="lk-notes" ${F}>${(o.notes || [o]).map((n, i) => noteHtml(n, i ? "n" + i : "")).join("")}</div>
<div class="lk-bar" ${F}></div>
</div></div>`;
}

export const LOCK_CSS = `
.lk{position:absolute;width:380px;height:800px;border-radius:64px;padding:12px;background:#0c0b12;box-shadow:0 60px 120px rgba(10,4,24,.45),0 0 0 2px rgba(255,255,255,.08) inset}
.lk-screen{position:relative;width:356px;height:776px;border-radius:52px;overflow:hidden;background:#22084a}
.lk-wall{position:absolute;inset:0;background:radial-gradient(ellipse 520px 460px at 80% 8%,rgba(198,255,52,.28) 0%,rgba(198,255,52,0) 60%),radial-gradient(ellipse 600px 700px at 10% 100%,#7e3bed 0%,rgba(126,59,237,0) 70%),linear-gradient(170deg,#3b0f86 0%,#22084a 55%,#16062f 100%)}
.lk-island{position:absolute;left:50%;top:14px;width:118px;height:34px;margin-left:-59px;border-radius:20px;background:#000}
.lk-date{position:absolute;left:0;right:0;top:96px;text-align:center;font-family:"DM Sans",sans-serif;font-size:21px;font-weight:500;color:rgba(255,255,255,.86)}
.lk-time{position:absolute;left:0;right:0;top:118px;text-align:center;font-family:"DM Sans",sans-serif;font-size:112px;font-weight:700;letter-spacing:-.04em;color:#fff;line-height:1;font-variant-numeric:tabular-nums}
.lk-notes{position:absolute;left:12px;right:12px;top:318px;display:flex;flex-direction:column;gap:10px}
.lk-note{display:flex;gap:12px;padding:14px 16px 16px 14px;border-radius:26px;background:rgba(250,248,255,.9);box-shadow:0 12px 30px rgba(10,4,24,.25);font-family:"DM Sans",sans-serif;color:#17151e}
.lk-ic{flex:none;width:42px;height:42px;display:block}
.lk-ic svg,.lk-ic img{display:block;width:42px;height:42px;border-radius:11px}
.lk-tx{flex:1;min-width:0}
.lk-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:2px}
.lk-hd b{font-size:13px;font-weight:700;letter-spacing:.06em;color:#726f80}
.lk-hd span{font-size:13px;font-weight:500;color:#726f80}
.lk-note strong{display:block;font-size:18px;font-weight:700;line-height:1.25;letter-spacing:-.01em}
.lk-note p{margin:3px 0 0;font-size:16px;line-height:1.3;color:#3a3646}
.lk-bar{position:absolute;left:50%;bottom:10px;width:132px;height:5px;margin-left:-66px;border-radius:3px;background:rgba(255,255,255,.85)}
`;

export function lockInner(o) {
  return `<div class="il" ${F}>
<div class="lk-wall" ${F}></div>
<div class="il-date" ${F}>${o.date || "terça-feira, 30 de setembro"}</div>
<div class="il-time" ${F}>${o.time}</div>
<div class="il-notes" ${F}>${(o.notes || [o]).map((n, i) => noteHtml(n, "n" + i)).join("")}</div>
<div class="il-bar" ${F}></div>
</div>`;
}

export const LOCK_IN_CSS = `
.il{position:absolute;inset:0;overflow:hidden;background:#22084a}
.il-date{position:absolute;left:0;right:0;top:108px;text-align:center;font-family:"DM Sans",sans-serif;font-size:22px;font-weight:500;color:rgba(255,255,255,.86)}
.il-time{position:absolute;left:0;right:0;top:132px;text-align:center;font-family:"DM Sans",sans-serif;font-size:120px;font-weight:700;letter-spacing:-.04em;color:#fff;line-height:1;font-variant-numeric:tabular-nums}
.il-notes{position:absolute;left:12px;right:12px;top:352px;display:flex;flex-direction:column;gap:10px}
.il-bar{position:absolute;left:50%;bottom:10px;width:140px;height:5px;margin-left:-70px;border-radius:3px;background:rgba(255,255,255,.85)}
`;
