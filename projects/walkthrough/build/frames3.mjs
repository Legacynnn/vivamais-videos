import fs from 'fs';
import { NEAR, FAR, S, I, AV, sb, pill, sticky } from './common.mjs';
import { confirmadoScreen } from './screens2.mjs';
import { hubScreen, step1, step2, step3, step4, step5, revisaoScreen, enviadaScreen, TXT } from './screens3.mjs';
const M = JSON.parse(fs.readFileSync('build/measure.json','utf8'));
const cam=(k)=>({x:0,y:0,scale:NEAR.scale*k});
const camF=(k)=>({x:0,y:0,scale:FAR.scale*k});
const C=(r)=>({x:r.x+r.w/2,y:r.y+r.h/2});
export const frames=[];
const CTA={x:201,y:654};
const confFinal=(p)=>`gsap.set(q('#${p}-disc'),{opacity:1});`;

// ---- 08 Anamnese ----
const ta=C(M.a1ta), mk=C(M.a2marker), sem=C(M.a3sem), pio=C(M.a3pio), box=C(M.a4box);
const confirmY=714-M.a2sheetH+ (M.a2confirm.y - (1118.3-M.a2sheetH*1.1) ) + M.a2confirm.h/2 - (714-M.a2sheetH);
frames.push({ id:'f08-anamnese', duration:18.4, framed:false,
  body:`<div class="prev" id="n-prev">${confirmadoScreen('nc')}</div><div class="next" id="n-hub">${hubScreen('nh')}</div>
  <div class="next" id="n-flow" style="box-shadow:none"><div id="n-s1">${step1('a1')}</div><div id="n-s2" style="opacity:0">${step2('a2')}</div><div id="n-s3" style="opacity:0">${step3('a3')}</div><div id="n-s4" style="opacity:0">${step4('a4')}</div><div id="n-s5" style="opacity:0">${step5('a5')}</div></div>
  <div class="next" id="n-rev">${revisaoScreen('ar')}</div><div class="next" id="n-env">${enviadaScreen('ae')}</div>`,
  script:`
    ${confFinal('nc')}
    gsap.set(['#n-flow','#n-rev','#n-env'],{x:402});
    const fadeTo=(from,to,at)=>{ tl.to(q(from),{opacity:0,duration:.18,ease:'none'},at); tl.fromTo(q(to),{opacity:0},{opacity:1,duration:.2,ease:'none',immediateRender:false},at+.02); };
    tl.set(cur,{x:${C(M.cBtn).x},y:${C(M.cBtn).y},opacity:1},0);
    tap(tl,0,q('#nc-btn'),.98);
    iosPush(tl,q('#n-prev'),q('#n-hub'),.08,.42);
    tl.to(cur,{opacity:0,duration:.2},.15);
    fadeUp(tl,document.querySelectorAll('#nh .ent'),.45,.07,16,.32);
    curEnter(tl,${CTA.x},${CTA.y},1.3,.7);
    tap(tl,2.1,q('#nh-cta'),.98);
    iosPush(tl,q('#n-hub'),q('#n-flow'),2.15,.4);
    // step 1: motivo
    curMove(tl,${ta.x},${ta.y},2.9,.5);
    tap(tl,3.4,null);
    tl.to(q('#a1-ph'),{opacity:0,duration:.15},3.45);
    tl.set(q('#a1-caret'),{opacity:1},3.45);
    const typed=q('#a1-typed'), cnt=q('#a1-cnt'), caret=q('#a1-caret'), TXT=${JSON.stringify(TXT)};
    const ty={n:0};
    tl.to(ty,{n:TXT.length,duration:1.6,ease:'none',onUpdate:()=>{const n=Math.floor(ty.n);typed.textContent=TXT.slice(0,n);cnt.textContent=n;caret.style.opacity=((tl.time()*3)%1)<.6?1:0;}},3.5);
    tl.to(cur,{y:960,duration:.4,ease:'power3.in'},3.5);
    curEnter(tl,${CTA.x},${CTA.y},5.1,.6);
    tap(tl,5.8,q('#a1-cta'),.98);
    tl.set(q('#a1-caret'),{opacity:0},5.8);
    fadeTo('#n-s1','#n-s2',5.85);
    // step 2: onde dói
    curMove(tl,${mk.x},${mk.y},6.3,.55);
    tap(tl,6.9,null);
    tl.fromTo(q('#a2-sheet'),{y:${M.a2sheetH*1.1}},{y:0,duration:.34,ease:'power3.out',immediateRender:false},6.95);
    curMove(tl,201,${714-M.a2sheetH + (M.a2confirm.y-(714-M.a2sheetH+M.a2sheetH*1.1)) + M.a2confirm.h/2},7.5,.5);
    tap(tl,8.0,q('#a2-confirm'),.98);
    tl.to(q('#a2-sheet'),{y:${M.a2sheetH*1.1},duration:.3,ease:'power3.in'},8.05);
    tl.fromTo(q('#a2-marker'),{opacity:0,scale:0},{opacity:1,scale:1,duration:.4,ease:'back.out(2)',immediateRender:false},8.15);
    tl.fromTo(q('#a2-list'),{opacity:0,y:12},{opacity:1,y:0,duration:.3,ease:'power3.out',immediateRender:false},8.25);
    curMove(tl,${CTA.x},${CTA.y},8.6,.5);
    tap(tl,9.1,q('#a2-cta'),.98);
    fadeTo('#n-s2','#n-s3',9.15);
    // step 3: tempo
    curMove(tl,${sem.x},${sem.y},9.5,.45);
    tap(tl,9.95,q('#a3-c-sem'),.94);
    tl.to(q('#a3-c-sem'),{backgroundColor:'#EBE1FD',color:'#451391',duration:.2},9.95);
    tl.set(q('#a3-onset'),{textContent:'1 semana'},10.0);
    nudge(tl,q('#a3 .sbody'),0,-150,.5,10.15);
    curMove(tl,${pio.x},${pio.y-150},10.3,.45);
    tap(tl,10.75,q('#a3-c-pio'),.94);
    tl.to(q('#a3-c-pio'),{backgroundColor:'#EBE1FD',color:'#451391',duration:.2},10.75);
    tl.to(q('#a3-line'),{attr:{d:'M16 90 C90 90 90 66 165 66 C240 66 240 24 314 24'},duration:.6,ease:'power3.out'},10.8);
    tl.to(q('#a3-area'),{attr:{d:'M16 90 C90 90 90 66 165 66 C240 66 240 24 314 24 L314 132 L16 132Z'},duration:.6,ease:'power3.out'},10.8);
    tl.to(q('#a3-c0'),{attr:{cy:90},duration:.6,ease:'power3.out'},10.8);
    tl.to(q('#a3-c1'),{attr:{cy:24},duration:.6,ease:'power3.out'},10.8);
    curMove(tl,${CTA.x},${CTA.y},11.15,.45);
    tap(tl,11.65,q('#a3-cta'),.98);
    fadeTo('#n-s3','#n-s4',11.7);
    // step 4: contexto
    nudge(tl,q('#a4 .sbody'),0,-170,.5,11.85);
    curMove(tl,${box.x},${box.y-170},12.0,.45);
    tap(tl,12.45,q('#a4-box'),.85);
    tl.fromTo(q('#a4-boxon'),{opacity:0,scale:.6},{opacity:1,scale:1,duration:.25,ease:'back.out(2)',immediateRender:false},12.5);
    curMove(tl,${CTA.x},${CTA.y},12.85,.45);
    tap(tl,13.35,q('#a4-cta'),.98);
    fadeTo('#n-s4','#n-s5',13.4);
    // step 5: anexos
    tap(tl,14.2,q('#a5-cta'),.98);
    iosPush(tl,q('#n-flow'),q('#n-rev'),14.25,.4);
    tl.to(cur,{opacity:0,duration:.2},14.3);
    fadeUp(tl,document.querySelectorAll('#ar .ent'),14.6,.07,16,.32);
    curEnter(tl,${CTA.x},${CTA.y},15.2,.6);
    tap(tl,15.9,q('#ar-cta'),.98);
    iosPush(tl,q('#n-rev'),q('#n-env'),15.95,.4);
    tl.to(cur,{opacity:0,duration:.2},16.0);
    tl.fromTo(q('#ae-ill'),{scale:.7,opacity:0},{scale:1,opacity:1,duration:.5,ease:'back.out(1.6)',immediateRender:false},16.4);
    fadeUp(tl,document.querySelectorAll('#ae .ent'),16.6,.08,16,.34);
    tl.to(dev,{scale:${cam(.9).scale},rotationY:6,duration:.6,ease:'power3.in'},17.8);
  `});

// ---- 09 Consulta (Whereby default room) ----
const wbtn=(i,id='')=>`<div ${id?`id="${id}"`:''} class="wb" style="width:48px;height:48px;border-radius:24px;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;will-change:transform">${I(i,22,'#fff')}</div>`;
const consultaScreen=(p)=>`<div class="screen" id="${p}" style="background:#1B1B1F"><div id="${p}-vid" class="img" style="position:absolute;inset:0;background-image:url(public/app/doctors/d4.jpeg);will-change:transform"></div><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.35),transparent 25%,transparent 70%,rgba(0,0,0,.55))"></div>${sb(true)}<div style="position:absolute;left:16px;top:67px;width:40px;height:40px;border-radius:20px;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center">${I('chevron-left',22,'#fff')}</div><span class="dm5 ent" style="position:absolute;left:16px;bottom:118px;padding:4px 10px;border-radius:8px;background:rgba(0,0,0,.5);color:#fff;font-size:12px">Dra. Mariana Costa</span><div id="${p}-self" style="position:absolute;right:16px;top:120px;width:96px;height:128px;border-radius:12px;background:#3A3A44;border:1px solid rgba(255,255,255,.2);display:flex;align-items:flex-end;padding:6px;will-change:transform"><span class="dm5" style="font-size:11px;color:#fff">Você</span></div><div class="row" style="position:absolute;left:0;right:0;bottom:34px;justify-content:center;gap:12px">${wbtn('mic')}${wbtn('video')}${wbtn('message-square')}${wbtn('users')}${wbtn('ellipsis')}<div id="${p}-leave" class="wb" style="width:48px;height:48px;border-radius:24px;background:#E5484D;display:flex;align-items:center;justify-content:center;will-change:transform">${I('phone-off',22,'#fff')}</div></div><div class="hi w"></div></div>`;
frames.push({ id:'f09-consulta', duration:5.6, framed:true,
  body: consultaScreen('v'),
  script:`
    tl.fromTo(dev,{scale:${camF(1.18).scale},rotationY:6},{scale:${FAR.scale},rotationY:0,duration:.7,ease:'power3.out',immediateRender:false},0);
    tl.fromTo(q('#v-vid'),{scale:1.0},{scale:1.06,duration:5.6,ease:'none',immediateRender:false},0);
    tl.fromTo(q('#v-self'),{scale:.6,opacity:0},{scale:1,opacity:1,duration:.45,ease:'back.out(1.6)',immediateRender:false},.8);
    tl.fromTo(document.querySelectorAll('#v .wb'),{scale:.5,opacity:0},{scale:1,opacity:1,duration:.4,ease:'back.out(1.7)',stagger:.05,immediateRender:false},.9);
    fadeUp(tl,document.querySelectorAll('#v .ent'),1.1,.06,10,.3);
    curEnter(tl,351,656,4.4,.7);
  `});

// ---- 10 Até a próxima ----
const ateScreen=(p)=>`<div class="screen" id="${p}">${sb()}<div class="col" style="padding:120px 24px 0;gap:28px">
<div class="col" style="align-items:center"><div style="width:96px;height:96px;border-radius:50%;background:#EBE1FD;display:flex;align-items:center;justify-content:center"><div id="${p}-disc" style="width:72px;height:72px;border-radius:50%;background:#7E3BED;display:flex;align-items:center;justify-content:center;will-change:transform">${I('heart',36,'#fff')}</div></div><span class="dm7 ent" style="font-size:12px;letter-spacing:.1em;color:#5719B6;margin-top:16px">CONSULTA FINALIZADA</span><span class="brand dm7 ent" style="font-size:32px;line-height:38px;letter-spacing:-.7px;text-align:center;margin-top:8px">Até a próxima, Ana.</span><span class="dm4 ent" style="font-size:16px;line-height:24px;color:#726F80;text-align:center;margin-top:12px">Cuide-se. Seus documentos já estão prontos.</span></div>
<div class="col" style="gap:10px"><div class="row ent" style="border-radius:24px;background:#fff;padding:16px 20px;border:1px solid #F2F1F6;gap:12px">${I('file-text',22,'#5719B6')}<div class="col" style="flex:1"><span class="dm7" style="font-size:16px">Receita digital</span><span class="dm4" style="font-size:13px;color:#726F80">Assinada · pronta em Documentos</span></div>${I('chevron-right',18,'#A29FB0')}</div><div class="row ent" style="border-radius:24px;background:#fff;padding:16px 20px;border:1px solid #F2F1F6;gap:12px">${I('file-check',22,'#5719B6')}<div class="col" style="flex:1"><span class="dm7" style="font-size:16px">Atestado</span><span class="dm4" style="font-size:13px;color:#726F80">Assinado · pronto em Documentos</span></div>${I('chevron-right',18,'#A29FB0')}</div></div>
</div><div class="ent" style="position:absolute;left:0;right:0;bottom:0;padding:12px 24px 34px;background:#FAFAFE"><div class="pill primary">Ver documentos</div></div><div class="hi"></div></div>`;
frames.push({ id:'f10-ate-a-proxima', duration:5, framed:true,
  body:`<div class="prev" id="e-prev">${consultaScreen('ev')}</div><div class="next" id="e-next">${ateScreen('e')}</div>`,
  script:`
    gsap.set(q('#ev-vid'),{scale:1.06}); gsap.set(['#ev-self','#ev .wb','#ev .ent'],{opacity:1});
    tl.set(cur,{x:351,y:656,opacity:1},0);
    tap(tl,0,q('#ev-leave'),.9);
    iosPush(tl,q('#e-prev'),q('#e-next'),.1,.45);
    tl.to(cur,{opacity:0,duration:.2},.2);
    tl.fromTo(q('#e-disc'),{opacity:0,scale:.8,y:6},{opacity:1,scale:1,y:0,duration:.4,ease:'back.out(1.7)',immediateRender:false},.8);
    fadeUp(tl,document.querySelectorAll('#e .ent'),.9,.08,18,.36);
  `});
