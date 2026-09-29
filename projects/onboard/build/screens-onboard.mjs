import { I, AV, SPEC, sb, tabsOn, sticky } from './common.mjs';
import { dayCell, docRow } from './screens.mjs';

const STEPS = [
  ['Escolha vídeo ou chat', 'Você decide como quer falar com o médico antes de pagar.'],
  ['Pague e entre na fila', 'Pix, cartão, saldo Viva ou crédito da empresa. Sua vaga fica reservada na hora.'],
  ['Conte o que está sentindo', 'Uma anamnese rápida para o médico já chegar sabendo do seu caso.'],
];
export const plantaoTab = (p) => `<div class="screen" id="${p}" style="background:#FAFAFE">${sb()}
<div class="col" style="position:absolute;left:0;right:0;top:62px;padding:8px 20px 0">
  <div class="ent" id="${p}-heroimg" style="position:relative;width:362px;height:260px;border-radius:24px;overflow:hidden;background:#EBE1FD">
    <div style="position:absolute;inset:0;background:radial-gradient(80% 90% at 70% 60%,#D6C3FB 0%,#EBE1FD 60%)"></div>
    <img src="public/app/plantao-24h.webp" style="position:absolute;left:50%;top:50%;width:210px;height:210px;margin:-95px 0 0 -105px;object-fit:contain">
    <div class="row" style="position:absolute;left:16px;top:16px;padding:6px 12px;border-radius:999px;background:#22084A"><i style="width:8px;height:8px;border-radius:4px;background:#C6FF34;margin-right:8px"></i><span class="dm7" style="font-size:12px;line-height:16px;color:#fff">Plantão 24h</span></div>
  </div>
  <div class="ent" style="margin-top:24px"><div class="brand dm5" style="font-size:28px;line-height:34px;letter-spacing:-.42px;color:#17151E">Médico online agora</div><div class="dm4" style="margin-top:8px;font-size:16px;line-height:24px;color:#726F80">Sem agendamento. Um clínico geral atende você por vídeo ou chat em minutos, a qualquer hora do dia ou da noite.</div></div>
  <div class="ent" style="margin-top:24px"><div class="pill primary" id="${p}-cta" style="will-change:transform">Começar por R$ 39,90</div><div class="dm4" style="margin-top:12px;text-align:center;font-size:13px;line-height:19px;color:#A29FB0">Saiu antes do atendimento? Você escolhe entre reembolso ou crédito.</div></div>
  <div class="ent" style="margin-top:36px"><div class="dm7" style="font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:#A29FB0">Como funciona</div>
  ${STEPS.map(([t, b], i) => `<div class="row" style="margin-top:20px;align-items:stretch"><div class="col" style="align-items:center"><div class="dm7" style="width:32px;height:32px;border-radius:16px;background:#7E3BED;color:#fff;font-size:13px;display:flex;align-items:center;justify-content:center">${i + 1}</div><i style="margin-top:4px;width:2px;flex:1;border-radius:1px;background:#D6C3FB"></i></div><div class="col" style="margin-left:16px;flex:1;padding-bottom:4px"><span class="dm7" style="font-size:15px;line-height:24px;color:#17151E">${t}</span><span class="dm4" style="margin-top:4px;font-size:14px;line-height:20px;color:#726F80">${b}</span></div></div>`).join('')}</div>
</div>${tabsOn(3, p + '-tabs')}<div class="hi"></div></div>`;

const segs = (p) => `<div class="row" style="margin-top:12px;gap:6px">${[0, 1, 2, 3].map((i) => `<i id="${p}-seg${i}" style="flex:1;height:4px;border-radius:2px;background:${i <= 1 ? '#7E3BED' : '#E6E4EC'}"></i>`).join('')}</div>`;
const aura = (size, style) => `<div style="position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:radial-gradient(circle,rgba(157,107,242,.22) 0%,rgba(188,156,247,.10) 55%,rgba(214,195,251,0) 100%);${style}"></div>`;
export const filaScreen = (p, doctor) => `<div class="screen" id="${p}" style="background:#FAFAFE">${sb()}
<div style="position:absolute;left:0;right:0;top:62px;padding:8px 20px 0">
  <div class="brand dm5" style="font-size:22px;line-height:28px;letter-spacing:-.22px;color:#17151E">Plantão 24h</div>
  <div style="margin-top:16px"><div class="row" style="justify-content:space-between;position:relative;height:24px"><span class="dm7 stepl" id="${p}-stepA" style="font-size:15px;line-height:24px;color:#17151E;position:absolute;left:0">Na fila</span><span class="dm7 stepl" id="${p}-stepB" style="font-size:15px;line-height:24px;color:#17151E;position:absolute;left:0;opacity:0">Em atendimento</span><span class="dm4" style="font-size:13px;line-height:24px;color:#726F80;position:absolute;right:0">Etapa <span id="${p}-stepn">2</span> de 4</span></div>${segs(p)}</div>
</div>
<div style="position:absolute;left:0;right:0;top:170px">
  <div id="${p}-wait" style="padding:24px 20px 0">
    <div class="ent" style="position:relative;border-radius:24px;overflow:hidden;background:#fff">${aura(280, 'top:-100px;right:-93px')}<div style="position:relative;padding:24px">
      <div class="row"><i id="${p}-live" style="width:7px;height:7px;border-radius:3.5px;background:#C6FF34"></i><span class="dm5" style="margin-left:8px;font-size:13px;line-height:24px;color:#726F80">Sua posição na fila</span></div>
      <div style="position:relative;margin-top:8px;height:76px"><span class="brand dm5" id="${p}-fig2" style="position:absolute;left:0;top:0;font-size:72px;line-height:76px;letter-spacing:-2px;color:#17151E">2</span><span class="brand dm5" id="${p}-fig1" style="position:absolute;left:0;top:0;font-size:72px;line-height:76px;letter-spacing:-2px;color:#17151E;opacity:0">1</span></div>
      <div style="position:relative;height:22px"><span class="dm4" id="${p}-det2" style="position:absolute;left:0;font-size:15px;line-height:22px;color:#55525F;white-space:nowrap">1 pessoa antes de você.</span><span class="dm4" id="${p}-det1" style="position:absolute;left:0;font-size:15px;line-height:22px;color:#55525F;opacity:0;white-space:nowrap">Você é o próximo. Fique de olho no app.</span></div>
      <div class="row" style="margin-top:20px;justify-content:space-between;border-top:1px solid #F2F1F6;padding-top:16px"><span class="dm4" style="font-size:13px;line-height:24px;color:#726F80">Aguardando há</span><span class="dm7" id="${p}-clock" style="font-size:16px;line-height:24px;color:#17151E;font-variant-numeric:tabular-nums">00:48</span></div>
    </div></div>
    <div class="ent" style="margin-top:16px;border-radius:20px;background:#F3EDFF;padding:20px"><div class="row" style="justify-content:space-between"><span class="row" style="gap:8px">${I('lightbulb', 16, '#5719B6')}<span class="dm7" style="font-size:13px;line-height:24px;letter-spacing:.05em;text-transform:uppercase;color:#5719B6">Enquanto espera</span></span><span class="dm5" style="font-size:13px;line-height:24px;color:#5719B6">1/8</span></div><div style="margin-top:10px;min-height:112px"><div class="dm7" style="font-size:16px;line-height:22px;color:#17151E">Escolha um lugar calmo</div><div class="dm4" style="margin-top:6px;font-size:15px;line-height:22px;color:#403D4A">Um canto silencioso e bem iluminado ajuda o médico a ver e ouvir você direito. Luz de frente para o rosto funciona melhor que de costas.</div></div></div>
  </div>
  <div id="${p}-ready" class="col" style="position:absolute;left:0;right:0;top:0;align-items:center;padding:32px 20px 0;opacity:0">
    <div style="position:relative;width:96px;height:96px;display:flex;align-items:center;justify-content:center">${aura(300, 'left:-102px;top:-102px')}<div id="${p}-disc" style="position:relative;width:72px;height:72px;border-radius:36px;background:#7E3BED;display:flex;align-items:center;justify-content:center;will-change:transform">${I('video', 32, '#fff')}</div></div>
    <div class="brand dm5 rdy" style="margin-top:16px;text-align:center;font-size:26px;line-height:32px;letter-spacing:-.3px;color:#17151E">O médico está esperando você</div>
    <div class="dm7 rdy" style="margin-top:8px;text-align:center;font-size:17px;line-height:24px;color:#5719B6">${doctor}</div>
    <div class="dm4 rdy" style="margin-top:8px;text-align:center;font-size:15px;line-height:22px;color:#726F80">Entre agora pelo vídeo.</div>
  </div>
</div>
${sticky(`<div style="position:relative;height:52px"><div class="pill ghost" id="${p}-leave" style="position:absolute;inset:0">Sair da fila</div><div class="pill primary" id="${p}-enter" style="position:absolute;inset:0;opacity:0;will-change:transform">Entrar na chamada</div></div>`)}<div class="hi"></div></div>`;

const wbtn = (i) => `<div class="wb" style="width:48px;height:48px;border-radius:24px;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;will-change:transform">${I(i, 22, '#fff')}</div>`;
export const consultaScreen = (p, photo, name) => `<div class="screen" id="${p}" style="background:#1B1B1F"><div id="${p}-vid" class="img" style="position:absolute;inset:0;background-image:url(public/app/doctors/${photo});will-change:transform"></div><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.35),transparent 25%,transparent 70%,rgba(0,0,0,.55))"></div>${sb(true)}<div style="position:absolute;left:16px;top:67px;width:40px;height:40px;border-radius:20px;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center">${I('chevron-left', 22, '#fff')}</div><span class="dm5 ent" style="position:absolute;left:16px;bottom:118px;padding:4px 10px;border-radius:8px;background:rgba(0,0,0,.5);color:#fff;font-size:12px">${name}</span><div id="${p}-self" style="position:absolute;right:16px;top:120px;width:96px;height:128px;border-radius:12px;background:linear-gradient(160deg,#4A4656,#2E2B36);border:1px solid rgba(255,255,255,.2);display:flex;align-items:flex-end;padding:6px;will-change:transform;overflow:hidden"><div style="position:absolute;left:24px;top:26px;width:48px;height:48px;border-radius:24px;background:#6B6778"></div><div style="position:absolute;left:12px;top:80px;width:72px;height:60px;border-radius:36px 36px 0 0;background:#6B6778"></div><span class="dm5" style="position:relative;font-size:11px;color:#fff">Você</span></div><div class="row" style="position:absolute;left:0;right:0;bottom:34px;justify-content:center;gap:12px">${wbtn('mic')}${wbtn('video')}${wbtn('message-square')}${wbtn('users')}${wbtn('ellipsis')}<div class="wb" style="width:48px;height:48px;border-radius:24px;background:#E5484D;display:flex;align-items:center;justify-content:center;will-change:transform">${I('phone-off', 22, '#fff')}</div></div><div class="hi w"></div></div>`;

const DOCS = [
  ['d2.png', 'Dra. Júlia Andrade', null, 'R$ 95', false],
  ['d1.jpeg', 'Dr. André Souza', ['5,0', '41'], 'R$ 130', true],
  [null, 'Dr. Paulo Nunes', ['4,7', '64'], 'R$ 110', false],
  ['d4.jpeg', 'Dra. Mariana Costa', ['4,9', '32'], 'R$ 89,90', true],
  [null, 'Dra. Helena Rocha', ['4,9', '87'], 'R$ 100', true],
  [null, 'Dr. Caio Mendes', null, 'R$ 90', false],
];
export const buscaScreenTall = (p) => `<div class="screen" id="${p}-busca" style="background:transparent"><div id="${p}-backdrop" style="position:absolute;inset:0;background:rgba(13,11,30,.32)"></div>
<div id="${p}-surface" style="position:absolute;left:0;top:65px;width:402px;height:809px;background:#fff;border-radius:26px;overflow:hidden;transform-origin:0 0;will-change:transform"><div id="${p}-sheet" style="position:absolute;inset:0;background:#FAFAFE">
  <div style="position:relative;z-index:2;background:#FAFAFE">
  <div style="display:flex;justify-content:center;padding:8px 0 4px"><i style="width:36px;height:4px;border-radius:2px;background:#D2CFDB"></i></div>
  <div class="sitem row" style="gap:10px;padding:8px 20px"><div class="circ" style="background:#F2F1F6">${I('arrow-left', 20, '#17151E')}</div><div class="row" style="flex:1;height:44px;border-radius:16px;border:1px solid #E6E4EC;background:#fff;padding:0 12px;gap:8px">${I('search', 18, '#A29FB0')}<span class="dm4" style="font-size:15px;color:#A29FB0">Especialidade ou médico</span></div><div class="circ" style="background:#F2F1F6;position:relative">${I('sliders-horizontal', 20, '#17151E')}<span class="dm7" id="${p}-badge" style="position:absolute;top:2px;right:2px;min-width:18px;height:18px;border-radius:9px;background:#7E3BED;color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center;padding:0 4px">1</span></div></div>
  </div>
  <div id="${p}-list" style="position:absolute;left:0;right:0;top:68px;will-change:transform">
  <div class="sitem" style="padding:4px 20px 20px"><div class="row" style="border-radius:22px;background:linear-gradient(135deg,#22084A,#451391);padding-left:18px;min-height:84px;overflow:hidden"><div class="col" style="flex:1;padding:14px 0"><span class="brand dm5" style="font-size:18px;line-height:22px;letter-spacing:-.18px;color:#fff">Plantão 24h</span><span class="dm4" style="font-size:13px;line-height:18px;color:#D6C3FB;margin-top:4px">Médico online em minutos.</span><span class="row dm7" style="font-size:13px;color:#C6FF34;margin-top:10px">Entrar na fila ${I('arrow-right', 14, '#C6FF34', 'margin-left:4px')}</span></div><img src="public/app/plantao-24h.webp" style="width:92px;height:92px;margin-right:12px;object-fit:contain"></div></div>
  <div class="sitem row" style="justify-content:space-between;padding:0 20px"><span class="dm7" style="font-size:15px">Setembro</span><span class="row" style="gap:8px"><span class="circ" style="width:28px;height:28px;background:#F2F1F6;opacity:.35">${I('chevron-left', 16, '#17151E')}</span><span class="circ" style="width:28px;height:28px;background:#F2F1F6">${I('chevron-right', 16, '#17151E')}</span></span></div>
  <div class="sitem row" style="padding:10px 20px 0;overflow:hidden">${dayCell('Hoje', 22, true, true)}${dayCell('Amanhã', 23, false, false)}${dayCell('qui', 24)}${dayCell('sex', 25)}${dayCell('sáb', 26)}${dayCell('dom', 27)}${dayCell('seg', 28)}${dayCell('ter', 29)}</div>
  <div class="sitem row" style="padding:12px 20px 0;gap:8px"><span class="row" id="${p}-fchip" style="height:32px;border-radius:999px;background:#F2F1F6;padding:0 8px 0 12px">${SPEC(16)}<span class="dm5" style="font-size:13px;color:#403D4A;margin-left:6px">Cardiologia</span>${I('x', 14, '#A29FB0', 'margin-left:6px')}</span></div>
  <div style="height:20px"></div>
  ${DOCS.map(([src, name, rating, price, today], i) => docRow(`${p}-row${i}`, src, name, rating, price, today, false)).join('')}
  </div>
</div></div></div>`;
