const SPARK = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" fill="#c6ff34" stroke="#17151e" stroke-width="1.6" stroke-linejoin="round"/></svg>';
const BACK = '<svg viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#17151e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const SEND = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5" stroke="#fafafe" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export const IQ_Q = "Posso tomar dipirona com paracetamol?";
export const IQ_A = "Em geral, sim, alternando os horários. Siga a dose da bula e não passe do limite diário. Se a dor durar mais de 3 dias, chame o plantão.";

export const IQ_HTML = `<div class="iq">
<div class="iq-top"><div class="iq-back">${BACK}</div><div class="iq-ttl"><b>IA de saúde</b><span>Viva Mais · responde na hora</span></div><i class="iq-live"></i></div>
<div class="iq-body">
<div class="iq-hello"><i>${SPARK}</i><p>Oi, Ana! Pergunte sobre remédios, exames ou sintomas.</p></div>
<div class="iq-me"><p>${IQ_Q.split(" ").map((w) => `<span>${w}</span>`).join(" ")}</p></div>
<div class="iq-dots"><u></u><u></u><u></u></div>
<div class="iq-ans"><div class="iq-ans-h">${SPARK}<b>IA Viva Mais</b></div><p>${IQ_A.split(" ").map((w) => `<span>${w}</span>`).join(" ")}</p><div class="iq-cta">Chamar médico agora</div></div>
</div>
<div class="iq-field"><span>Pergunte à IA</span><i>${SEND}</i></div>
</div>`;

export const IQ_CSS = `
.iq{position:absolute;inset:0;background:#fafafe;overflow:hidden;font-family:DMSans_400Regular}
.iq *{box-sizing:border-box}
.iq-top{position:absolute;left:0;right:0;top:58px;height:62px;display:flex;align-items:center;gap:6px;padding:0 18px 0 8px;border-bottom:1px solid #efecf6}
.iq-back{display:grid;place-items:center;width:44px;height:44px}
.iq-back svg{width:24px;height:24px}
.iq-ttl{flex:1;display:flex;flex-direction:column;gap:2px}
.iq-ttl b{font-family:DMSans_700Bold;font-weight:400;font-size:17px;color:#17151e}
.iq-ttl span{font-size:13px;color:#726f80}
.iq-live{width:10px;height:10px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.18)}
.iq-body{position:absolute;left:0;right:0;top:132px;bottom:96px;padding:18px 18px 0;display:flex;flex-direction:column;gap:14px}
.iq-hello{display:flex;gap:10px;align-items:flex-start}
.iq-hello i{flex:none;display:grid;place-items:center;width:34px;height:34px;border-radius:12px;background:#22084a}
.iq-hello i svg{width:20px;height:20px}
.iq-hello p{margin:0;padding:12px 14px;border-radius:4px 18px 18px 18px;background:#fff;box-shadow:0 1px 3px rgba(23,21,30,.08);font-size:15px;line-height:1.4;color:#3a3646}
.iq-me{align-self:flex-end;max-width:78%}
.iq-me p{margin:0;padding:12px 16px;border-radius:18px 18px 4px 18px;background:#7e3bed;color:#fff;font-family:DMSans_500Medium;font-size:16px;line-height:1.35}
.iq-dots{display:flex;gap:5px;padding:14px 16px;width:70px;border-radius:4px 18px 18px 18px;background:#fff;box-shadow:0 1px 3px rgba(23,21,30,.08)}
.iq-dots u{width:8px;height:8px;border-radius:50%;background:#b8b2c8}
.iq-ans{padding:14px 16px 16px;border-radius:4px 20px 20px 20px;background:#fff;box-shadow:0 6px 20px rgba(34,8,74,.08);border:1px solid #efe8ff}
.iq-ans-h{display:flex;align-items:center;gap:7px;margin-bottom:8px}
.iq-ans-h svg{width:18px;height:18px}
.iq-ans-h b{font-family:DMSans_700Bold;font-weight:400;font-size:14px;color:#5719b6}
.iq-ans p{margin:0;font-size:16px;line-height:1.45;color:#17151e}
.iq-cta{display:inline-flex;margin-top:12px;padding:10px 16px;border-radius:999px;background:#f3edff;font-family:DMSans_700Bold;font-size:14px;color:#6a24db}
.iq-field{position:absolute;left:16px;right:16px;bottom:34px;height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 6px 0 18px;border-radius:26px;background:#fff;border:1px solid #e4e0ee}
.iq-field span{font-size:15px;color:#9a96a8}
.iq-field i{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:#7e3bed}
.iq-field i svg{width:20px;height:20px}
`;
