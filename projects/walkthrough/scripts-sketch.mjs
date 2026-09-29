import fs from 'fs';
const S = 1080/402;
const css = `
#root{position:absolute;inset:0;background:#FAFAFE;font-family:'DM Sans',system-ui,sans-serif;color:#17151E;overflow:hidden}
.stage{position:absolute;inset:0;background:#22084A}
.phone{position:absolute;left:0;top:0;width:402px;height:714px;transform-origin:0 0;transform:scale(${S.toFixed(4)});background:#FAFAFE;overflow:hidden}
.framed .phone{transform-origin:50% 50%;left:50%;top:50%;width:402px;height:874px;transform:translate(-50%,-50%) scale(1.78);border-radius:56px;border:14px solid #0D0C12;box-shadow:0 60px 120px rgba(0,0,0,.5)}
.sb{height:54px;display:flex;justify-content:space-between;align-items:flex-end;padding:0 28px 8px;font-weight:700;font-size:15px}
.sb.light{color:#fff}
.hi{position:absolute;bottom:8px;left:50%;width:134px;height:5px;margin-left:-67px;border-radius:3px;background:#17151E;opacity:.6}
.px{padding:0 20px}
.t-display{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:28px;line-height:32px;letter-spacing:-.4px}
.t-head{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:22px;line-height:28px}
.t-title{font-weight:700;font-size:18px;line-height:24px}
.t-body{font-size:16px;line-height:26px}
.t-label{font-weight:500;font-size:14px;line-height:20px}
.t-cap{font-weight:500;font-size:12px;line-height:16px;color:#726F80}
.muted{color:#726F80}
.blk{background:#E6E4EC;border-radius:12px}
.card{background:#fff;border:1.5px solid #E6E4EC;border-radius:20px;padding:16px}
.row{display:flex;align-items:center;gap:12px}
.col{display:flex;flex-direction:column;gap:8px}
.chip{display:inline-block;padding:8px 14px;border-radius:999px;background:#F2F1F6;font-size:14px;font-weight:500}
.chip.on{background:#EBE1FD;color:#5719B6}
.btn{height:52px;border-radius:16px;background:#F2F1F6;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px}
.btn.primary{background:#7E3BED;color:#fff}
.btn.ghost{background:transparent;color:#5719B6}
.focal{outline:3px solid #7E3BED;outline-offset:3px}
.dot{position:absolute;width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.55);border:1.5px solid rgba(255,255,255,.7);box-shadow:0 6px 18px rgba(0,0,0,.25);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:9}
.dot::after{content:'';width:26px;height:26px;border-radius:50%;background:rgba(23,21,30,.35)}
.hdr{background:#22084A;color:#fff;border-radius:0 0 28px 28px;padding-bottom:20px}
.av{width:40px;height:40px;border-radius:50%;background:#D2CFDB;flex:none}
.av.lg{width:64px;height:64px}
.qa{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.qa div{height:74px;border-radius:16px;background:#F3F4FA;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;font-size:12px;font-weight:500}
.qa i{width:22px;height:22px;border-radius:6px;background:#D2CFDB}
.stars{color:#7E3BED;font-size:13px;letter-spacing:1px}
.seg{display:flex;gap:3px}.seg i{flex:1;height:6px;border-radius:3px;background:#E6E4EC}.seg i.on{background:#7E3BED}
.sheet{position:absolute;left:0;right:0;bottom:0;background:#fff;border-radius:28px 28px 0 0;padding:20px;box-shadow:0 -10px 40px rgba(0,0,0,.15)}
.dim{position:absolute;inset:0;background:rgba(23,21,30,.45)}
.tabs{position:absolute;left:0;right:0;bottom:0;height:78px;background:#fff;border-top:1px solid #E6E4EC;display:flex;justify-content:space-around;align-items:center;font-size:11px;font-weight:500;color:#726F80}
.tabs div{display:flex;flex-direction:column;align-items:center;gap:4px}.tabs i{width:24px;height:24px;border-radius:6px;background:#D2CFDB}.tabs .on{color:#7E3BED}.tabs .on i{background:#7E3BED}
.dots{display:flex;gap:6px}.dots i{width:8px;height:8px;border-radius:4px;background:#E6E4EC}.dots i.on{background:#7E3BED}
.qr{width:200px;height:200px;margin:0 auto;background:repeating-conic-gradient(#17151E 0 25%,#fff 0 50%) 0 0/24px 24px;border:8px solid #fff;outline:1.5px solid #E6E4EC;border-radius:12px}
.vid{position:absolute;inset:0;background:#403D4A}
`;
function file(id, body, framed=false){
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"><title>${id}</title></head>
<body><template>
<style>${css}</style>
<div id="root" data-composition-id="${id}" data-width="1080" data-height="1920">
${framed?'<div class="stage"></div>':''}
<div class="${framed?'framed':''}"><div class="phone">${body}</div></div>
</div>
<script>
const tl = gsap.timeline({ paused: true });
window.__timelines["${id}"] = tl;
</script>
</template></body></html>`;
}
const sb = (light=false)=>`<div class="sb ${light?'light':''}"><span>9:41</span><span>●●● ▲ ▮</span></div>`;
const dot = (x,y)=>`<div class="dot" style="left:${x}px;top:${y}px"></div>`;
const tabs = `<div class="tabs"><div class="on"><i></i>Início</div><div><i></i>Consultas</div><div><i></i>Ações</div><div><i></i>IA</div><div><i></i>Plantão</div></div>`;
const home = `${sb()}
<div class="px col" style="gap:14px;margin-top:-96px">
  <div class="row" style="justify-content:space-between"><div><div class="t-display">Boa tarde, Ana.</div><div class="t-body muted">Como podemos cuidar de você hoje?</div></div><div class="av"></div></div>
  <div class="card col"><div class="chip" style="background:#F2F1F6;color:#726F80;align-self:stretch">🔍 Buscar médico ou especialidade</div><div class="row" style="flex-wrap:wrap;gap:8px"><span class="chip">Clínico Geral</span><span class="chip">Cardiologia</span><span class="chip">Dermatologia</span><span class="chip">Pediatria</span></div></div>
  <div class="qa"><div><i></i>Agenda</div><div><i></i>Plantão</div><div><i></i>Documentos</div><div><i></i>Parceiros</div></div>
  <div class="card row"><div class="av"></div><div class="col" style="gap:2px"><div class="t-title">Seu plano</div><div class="t-label muted">Assinatura Viva+ · ativo</div></div></div>
  <div class="row" style="justify-content:space-between"><div class="t-head">Seus benefícios</div><div class="t-label" style="color:#5719B6">Ver plano</div></div>
  <div class="row" style="gap:10px;align-items:stretch">
    <div class="card col focal" style="width:190px;flex:none"><div class="av" style="background:#EBE1FD"></div><div class="t-title">Cardiologia</div><div class="t-cap">2 consultas restantes</div><div class="seg"><i class="on"></i><i class="on"></i><i></i><i></i></div></div>
    <div class="card col" style="width:190px;flex:none"><div class="av" style="background:#EBE1FD"></div><div class="t-title">Chat com IA</div><div class="t-cap">Ilimitado</div></div>
  </div>
</div>${tabs}${dot(120,600)}`;

const doctorRow = (name,crm,focal)=>`<div class="card row ${focal?'focal':''}"><div class="av lg"></div><div class="col" style="gap:3px;flex:1"><div class="t-title">${name}</div><div class="t-cap">Cardiologia · CRM ${crm}</div><div class="stars">★★★★★ <span class="t-cap">4,9 (32)</span></div><div class="chip on" style="align-self:flex-start;font-size:12px;padding:4px 10px">Coberto pelo seu benefício</div></div><div class="col" style="align-items:flex-end;gap:2px"><div class="t-label">Amanhã</div><div class="t-title">16:00</div></div></div>`;
const medicos = `${sb()}
<div class="px col" style="gap:14px">
  <div class="row"><span class="t-title">‹</span><div class="t-head">Cardiologia</div></div>
  <div class="chip" style="align-self:stretch;color:#726F80">🔍 Buscar especialidade ou médico</div>
  <div class="row" style="gap:8px"><span class="chip on">Online</span><span class="chip">Presencial</span><span class="chip">Qualquer</span><span class="chip">Filtros</span></div>
  <div class="row" style="gap:8px"><span class="chip on">Amanhã</span><span class="chip">ter 15</span><span class="chip">qua 16</span><span class="chip">qui 17</span></div>
  ${doctorRow('Dra. Mariana Costa','12457/MA',true)}
  ${doctorRow('Dr. Rafael Lima','88120/SP',false)}
  ${doctorRow('Dra. Júlia Andrade','40311/RJ',false)}
</div>${dot(60,300)}`;

const perfilBody = `<div class="hdr px col" style="gap:14px">${sb(true)}<div class="row" style="justify-content:space-between"><span>‹</span><div class="row"><div class="av"></div><div class="t-title">Dra. Mariana Costa</div></div><div class="t-title">R$ 89,90</div><span>♡</span></div></div>
<div class="px col" style="gap:14px;padding-top:16px">
  <div class="t-body muted">Cardiologista há 12 anos. Atendimento humano, direto ao ponto.</div>
  <div class="row"><span class="t-label muted">CRM</span><span class="t-body">12457/MA</span><span class="t-label muted" style="margin-left:12px">RQE</span><span class="t-body">45124</span></div>
  <div class="t-label muted">Especialidade</div>
  <div class="row" style="gap:8px"><span class="chip on">Cardiologia</span><span class="chip">Médico Clínico</span></div>
  <div class="t-cap">Na Viva desde 2026</div>
  <div class="row" style="justify-content:space-between"><div class="t-head">Avaliações <span class="muted">9</span></div><span>⌃</span></div>
  <div class="row" style="justify-content:space-between"><div class="col" style="gap:2px"><div class="t-body">Paciente</div><div class="t-cap">29 de mai de 2026</div></div><div class="stars">★★★★★</div></div>
  <div class="row" style="justify-content:space-between"><div class="col" style="gap:2px"><div class="t-body">Paciente</div><div class="t-cap">Excelente, muito atenciosa.</div></div><div class="stars">★★★★★</div></div>
</div>`;
const perfil = `${perfilBody}<div class="px" style="position:absolute;left:0;right:0;bottom:24px"><div class="btn primary focal">Agendar seg 14 · 16:00 · R$ 89,90</div></div>${dot(170,632)}`;
const horario = `${perfilBody}<div class="dim"></div>
<div class="sheet col" style="gap:14px"><div class="t-head">Escolha o horário</div>
<div class="row" style="gap:8px"><span class="chip on">seg 14</span><span class="chip">ter 15</span><span class="chip">qua 16</span><span class="chip">qui 17</span></div>
<div class="row" style="gap:8px;flex-wrap:wrap"><span class="chip">09:00</span><span class="chip">10:30</span><span class="chip">14:00</span><span class="chip on focal">16:00</span><span class="chip">17:30</span></div>
<div class="btn primary">Confirmar seg 14 · 16:00</div></div>${dot(250,520)}`;

const checkout = `${sb()}
<div class="px col" style="gap:14px">
  <div class="row"><span class="t-title">‹</span><div class="t-head">Pagamento</div></div>
  <div class="col" style="gap:2px"><div class="t-cap">Total a pagar</div><div class="t-display">R$ 89,90</div></div>
  <div class="card col" style="gap:10px"><div class="t-label muted">Consulta</div><div class="row"><div class="av"></div><div class="col" style="gap:2px"><div class="t-title">Dra. Mariana Costa</div><div class="t-cap">Cardiologia · seg 14 · 16:00 · Online, pelo aplicativo</div></div></div>
  <div class="row" style="justify-content:space-between"><div class="t-label">Benefício</div><div class="t-label" style="color:#5719B6">Coberto pelo seu benefício</div></div><div class="seg"><i class="on"></i><i></i><i></i><i></i></div><div class="t-cap">Tem um cupom?</div></div>
  <div class="t-label muted">Forma de pagamento</div>
  <div class="card row focal"><i style="width:22px;height:22px;border-radius:50%;border:6px solid #7E3BED"></i><div class="col" style="gap:0"><div class="t-title">Pix</div><div class="t-cap">Confirmação em segundos</div></div></div>
  <div class="card row"><i style="width:22px;height:22px;border-radius:50%;border:2px solid #D2CFDB"></i><div class="col" style="gap:0"><div class="t-title">Cartão de crédito</div><div class="t-cap">Até 3x sem juros</div></div></div>
</div><div class="px" style="position:absolute;left:0;right:0;bottom:24px"><div class="btn primary">Confirmar consulta</div></div>${dot(60,405)}`;

const pix = `${sb()}
<div class="px col" style="gap:14px">
  <div class="row"><span class="t-title">‹</span><div class="t-head">Pagamento</div></div>
  <div class="col" style="gap:2px"><div class="t-cap">Total a pagar</div><div class="t-display">R$ 89,90</div></div>
  <div class="card col" style="gap:12px;align-items:center"><div class="qr focal"></div><div class="t-label">Aguardando pagamento… <span class="muted">expira em 09:59</span></div><div class="btn" style="align-self:stretch">Copiar código</div><div class="btn ghost" style="height:40px">Já paguei</div></div>
  <div class="card col" style="gap:8px"><div class="t-title">Como funciona</div><div class="t-body">1. Toque em Gerar Pix para criar o código.</div><div class="t-body">2. Pague pelo app do seu banco: QR code ou copia e cola.</div><div class="t-body">3. A consulta é confirmada assim que o banco avisar. Leva segundos.</div></div>
  <div class="chip on" style="align-self:center">✓ Pagamento confirmado</div>
</div>`;

const confirmado = `${sb()}
<div class="px col" style="gap:14px;align-items:center;padding-top:90px;text-align:center">
  <div style="width:96px;height:96px;border-radius:50%;background:#7E3BED;color:#fff;font-size:52px;display:flex;align-items:center;justify-content:center">✓</div>
  <div class="t-display">Agendamento confirmado</div>
  <div class="t-body muted">Sua consulta está marcada.</div>
  <div class="card row" style="align-self:stretch;text-align:left"><div class="av"></div><div class="col" style="gap:2px"><div class="t-title">Dra. Mariana Costa</div><div class="t-cap">seg 14 · 16:00 · Online, pelo aplicativo</div></div></div>
  <div class="t-body">Agora, vamos preparar seu atendimento.</div>
</div>
<div class="px col" style="position:absolute;left:0;right:0;bottom:24px;gap:8px"><div class="btn primary focal">Preencher anamnese</div><div class="btn ghost">Fazer isso depois</div></div>${dot(170,560)}`;

const step = (n,title,inner,cta='Continuar')=>`<div class="px col" style="gap:14px"><div class="row" style="justify-content:space-between"><span class="t-label">Voltar</span><div class="dots">${[1,2,3,4,5].map(i=>`<i class="${i<=n?'on':''}"></i>`).join('')}</div><span class="t-label">Fechar</span></div><div class="t-cap">Sua anamnese · ${n} de 5</div><div class="t-display">${title}</div>${inner}</div><div class="px" style="position:absolute;left:0;right:0;bottom:24px"><div class="btn primary">${cta}</div></div>`;
const anamnese = `${sb()}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;transform:scale(.5);transform-origin:0 0;width:804px">
<div style="height:714px;position:relative;background:#FAFAFE"><div class="px col" style="gap:14px;padding-top:20px"><div class="blk" style="height:180px;background:#EBE1FD"></div><div class="t-cap">Sua próxima consulta</div><div class="card row"><div class="av"></div><div class="col" style="gap:2px"><div class="t-title">Dra. Mariana Costa</div><div class="t-cap">seg 14 · 16:00</div></div></div><div class="btn primary focal">Preparar consulta</div><div class="btn ghost">Preencher depois</div></div></div>
<div style="height:714px;position:relative;background:#FAFAFE">${step(1,'O que está acontecendo?','<div class="t-body muted">Escreva como você contaria para alguém. Sem termos médicos.</div><div class="card t-body" style="min-height:120px">Dor no peito ao subir escadas, há duas semanas.|</div>')}</div>
<div style="height:714px;position:relative;background:#FAFAFE">${step(2,'Onde dói?','<div class="t-body muted">Toque no corpo. Pode marcar mais de um lugar.</div><div class="blk" style="height:300px;width:160px;margin:0 auto;border-radius:80px"></div><div class="chip">Não é dor, é outro sintoma</div>')}</div>
<div style="height:714px;position:relative;background:#FAFAFE">${step(3,'Desde quando, e como está indo?','<div class="t-body muted">Ajuda o médico a entender se o quadro está mudando.</div><div class="card col"><div class="t-title">2 semanas</div><div class="blk" style="height:40px"></div></div><div class="card col"><div class="row" style="justify-content:space-between"><span class="t-cap">Início</span><span class="t-cap">Hoje</span></div><div class="blk" style="height:90px"></div><div class="chip on" style="align-self:flex-start">Piorando</div></div>')}</div>
<div style="height:714px;position:relative;background:#FAFAFE">${step(4,'Medicamentos e alergias','<div class="t-body muted">Informe o que você usa e se tem alguma alergia para este atendimento.</div><div class="t-label">Medicamentos de uso contínuo</div><div class="row"><span class="chip on">Losartana 50mg ×</span><span class="chip">Ex.: Dipirona</span></div><div class="t-label">Alergias</div><div class="row"><span class="chip">Nenhuma conhecida</span></div>','Confirmar')}</div>
<div style="height:714px;position:relative;background:#FAFAFE">${step(5,'Quer anexar alguma coisa?','<div class="t-body muted">Exames, receitas ou uma foto do que está te incomodando.</div><div class="row"><div class="qa" style="flex:1;grid-template-columns:repeat(3,1fr)"><div><i></i>Câmera</div><div><i></i>Galeria</div><div><i></i>Arquivo</div></div></div>','Continuar sem anexos')}</div>
</div>
<div class="px col" style="position:absolute;left:0;right:0;bottom:16px;gap:8px"><div class="card row" style="justify-content:space-between"><div class="col" style="gap:2px"><div class="t-title">Revisar e enviar</div><div class="t-cap">Motivo · Onde dói · Tempo · Medicamentos · Anexos</div></div><span class="t-label" style="color:#5719B6">Editar</span></div><div class="btn primary focal">Enviar anamnese</div><div class="t-cap" style="text-align:center">Enviada → O médico recebe tudo antes da consulta.</div></div>${dot(170,600)}`;

const consulta = `<div class="vid"></div>
<div class="sb light"><span>9:41</span><span>●●● ▲ ▮</span></div>
<div class="chip" style="position:absolute;left:16px;top:60px;background:rgba(0,0,0,.45);color:#fff">● Dra. Mariana Costa · Cardiologia</div>
<div class="chip" style="position:absolute;right:16px;top:60px;background:rgba(0,0,0,.45);color:#fff">00:06</div>
<div class="blk" style="position:absolute;inset:120px 60px 240px;background:#726F80"></div>
<div class="blk" style="position:absolute;right:16px;bottom:150px;width:100px;height:140px;background:#A29FB0;border:2px solid #fff"></div>
<div class="row" style="position:absolute;left:0;right:0;bottom:40px;justify-content:center;gap:16px">${['🎤','📷','💬'].map(i=>`<div style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center">${i}</div>`).join('')}<div class="focal" style="width:56px;height:56px;border-radius:50%;background:#EF4444;display:flex;align-items:center;justify-content:center;color:#fff">✕</div></div>`;

const ate = `${sb()}
<div class="px col" style="gap:14px;align-items:center;padding-top:140px;text-align:center">
  <div style="width:96px;height:96px;border-radius:50%;background:#EBE1FD;color:#7E3BED;font-size:48px;display:flex;align-items:center;justify-content:center">♥</div>
  <div class="t-display">Consulta finalizada</div>
  <div class="t-body muted">Até a próxima, Ana. Cuide-se.</div>
  <div class="card row focal" style="align-self:stretch;text-align:left"><i class="blk" style="width:40px;height:40px"></i><div class="col" style="gap:2px;flex:1"><div class="t-title">Receita digital</div><div class="t-cap">Assinada · Documentos</div></div><span>›</span></div>
  <div class="card row" style="align-self:stretch;text-align:left"><i class="blk" style="width:40px;height:40px"></i><div class="col" style="gap:2px;flex:1"><div class="t-title">Atestado</div><div class="t-cap">Assinado · Documentos</div></div><span>›</span></div>
</div>${tabs}`;

const abrir = home.replace('margin-top:-96px','margin-top:0').replace(dot(120,600), dot(300,900));
const out = {
 '01-abrir':[abrir,true],'02-home':[home,false],'03-medicos':[medicos,false],'04-perfil':[perfil,false],'05-horario':[horario,false],
 '06-checkout':[checkout,false],'07-pix':[pix,false],'08-confirmado':[confirmado,false],'09-anamnese':[anamnese,false],
 '10-consulta':[consulta,true],'11-ate-a-proxima':[ate,true]};
for (const [k,[b,f]] of Object.entries(out)) fs.writeFileSync(`compositions/frames/${k}.html`, file(k,b,f));
let sbd=fs.readFileSync('STORYBOARD.md','utf8').replace(/status: outline/g,'status: built'); fs.writeFileSync('STORYBOARD.md',sbd);
console.log(Object.keys(out).length,'sketches');
