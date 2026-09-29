import fs from 'fs';
import { NEAR, S } from './common.mjs';
import { perfilScreen } from './screens.mjs';
import { pagamentoScreen, pagarScreen, confirmadoScreen } from './screens2.mjs';
const M = JSON.parse(fs.readFileSync('build/measure.json','utf8'));
const cam=(k)=>({x:0,y:0,scale:NEAR.scale*k});
const C = (r)=>({x:r.x+r.w/2, y:r.y+r.h/2});
export const frames=[];
const perfilFinal = (p)=>`
  gsap.set(q('#${p}-pscroll'),{y:-260}); const hero=q('#${p}-hero'); hero.style.height='155px'; q('#${p}-photo').style.opacity=0; q('#${p}-title').style.opacity=0; q('#${p}-pinned').style.opacity=1;
  gsap.set(q('#${p}-selpuck'),{opacity:1}); gsap.set(q('#${p}-pscroll .wcell[data-day="15"] .wdot'),{opacity:0}); gsap.set(q('#${p}-pscroll .wcell[data-day="14"] .puck'),{backgroundColor:'rgba(126,59,237,0)'}); gsap.set(q('#${p}-pscroll .wcell[data-day="14"] .puck span'),{color:'#5719B6'}); gsap.set(q('#${p}-pscroll .wcell[data-day="14"] .wdot'),{backgroundColor:'#BC9CF7'});
  gsap.set(q('#${p}-s6 .slotbg'),{opacity:1}); gsap.set(q('#${p}-s6'),{color:'#ffffff',fontWeight:700}); gsap.set(q('#${p}-bar'),{backgroundColor:'#7E3BED'}); gsap.set(q('#${p}-bar-a'),{opacity:0}); gsap.set(q('#${p}-bar-b'),{opacity:1,color:'#ffffff'});`;

// ---- 05 Pagamento ----
const pix = C(M.pixRow);
frames.push({ id:'f05-pagamento', duration:3.9, framed:false,
  body:`<div class="prev" id="g-prev">${perfilScreen('gp')}</div><div class="next" id="g-next">${pagamentoScreen('g')}</div>`,
  script:`
    ${perfilFinal('gp')}
    tl.set(cur,{x:201,y:654,opacity:1},0);
    tap(tl,0,q('#gp-bar'),.98);
    iosPush(tl,q('#g-prev'),q('#g-next'),.08,.42);
    tl.to(cur,{opacity:0,duration:.2},.15);
    fadeUp(tl,['#g-amount','#g-summary','#g-how','#g-pix','#g-card'],.4,.06,16,.32);
    curEnter(tl,300,640,1.2,.5);
    nudge(tl,q('#g-pag > div:nth-of-type(2)'),0,-90,.7,1.7);
    tl.to(cur,{y:460,duration:.7,ease:'power2.inOut'},1.7);
    curMove(tl,${pix.x},${pix.y-90},2.6,.5);
  `});

// ---- 06 Pix ----
const bar = C(M.xBar), qr = M.xQr, copy = C(M.xCopy), PSCR = 150;
frames.push({ id:'f06-pix', duration:8.1, framed:false,
  body:`<div class="prev" id="x-prev">${pagamentoScreen('xp')}</div><div class="next" id="x-next">${pagarScreen('x')}</div>`,
  script:`
    gsap.set(q('#xp-pag > div:nth-of-type(2)'),{y:-90});
    tl.set(cur,{x:${pix.x},y:${pix.y-90},opacity:1},0);
    tap(tl,0,q('#xp-pix'),.98);
    iosPush(tl,q('#x-prev'),q('#x-next'),.08,.42);
    tl.to(cur,{opacity:0,duration:.2},.15);
    fadeUp(tl,['#x-amount','#x-steps','#x-sticky'],.4,.06,16,.32);
    curEnter(tl,${bar.x},${bar.y},1.2,.7);
    tap(tl,2.2,q('#x-bar'),.98);
    tl.set(q('#x-spin'),{display:'block'},2.35);
    tl.fromTo(q('#x-spin'),{rotation:0},{rotation:1440,duration:1.2,ease:'none',immediateRender:false},2.35);
    tl.to(cur,{y:960,duration:.5,ease:'power3.in'},2.5);
    // panel swap + scroll so the whole PixPanel is visible
    tl.to(q('#x-steps'),{opacity:0,y:-12,duration:.25,ease:'power2.in'},3.3);
    tl.to(q('#x-sticky'),{y:140,duration:.35,ease:'power3.in'},3.3);
    tl.fromTo(q('#x-panel'),{opacity:0,y:16},{opacity:1,y:0,duration:.35,ease:'power3.out',immediateRender:false},3.5);
    nudge(tl,q('#x-pagar > div:nth-of-type(2) > div'),0,-${PSCR},.7,3.5);
    // QR modules assemble in a diagonal wave
    const mods=Array.from(document.querySelectorAll('#x-qr .qm'));
    mods.forEach(el=>{ const d=+el.dataset.d; tl.fromTo(el,{opacity:0,scale:0},{opacity:1,scale:1,duration:.22,ease:'back.out(2)',immediateRender:false},3.75+d*0.0105); });
    // countdown ticks
    const cd={t:0}, cdEl=q('#x-cd');
    tl.to(cd,{t:8,duration:8,ease:'none',onUpdate:()=>{const r=900-Math.floor(cd.t);cdEl.textContent=String(Math.floor(r/60)).padStart(2,'0')+':'+String(r%60).padStart(2,'0');}},3.5);
    // waiting dot pulse (finite)
    tl.fromTo(q('#x-wdot'),{opacity:1},{opacity:.3,duration:.7,ease:'sine.inOut',yoyo:true,repeat:5,immediateRender:false},3.9);
    // copy code
    curEnter(tl,${copy.x},${copy.y-PSCR},4.4,.6);
    tap(tl,5.1,q('#x-copy'),.97);
    tl.to(q('#x-copy-a'),{opacity:0,duration:.12},5.15);
    tl.fromTo(q('#x-copy-b'),{opacity:0,y:6},{opacity:1,y:0,duration:.25,ease:'power3.out',immediateRender:false},5.2);
    tl.to(cur,{y:960,duration:.5,ease:'power3.in'},5.5);
    // scan sweep = the bank reading it
    tl.fromTo(q('#x-scan'),{y:0,opacity:0},{opacity:1,duration:.1,immediateRender:false},6.1);
    tl.to(q('#x-scan'),{y:270,duration:.7,ease:'power2.inOut'},6.15);
    tl.to(q('#x-scan'),{opacity:0,duration:.15},6.8);
    // stillness, then the screen recedes (Z pull) into the confirmation
    tl.to(dev,{scale:${cam(.9).scale},rotationX:-6,duration:.55,ease:'power3.in'},7.55);
  `});

// ---- 07 Confirmado ----
const btn = C(M.cBtn);
frames.push({ id:'f07-confirmado', duration:4.2, framed:false,
  body: confirmadoScreen('c'),
  script:`
    tl.fromTo(dev,{scale:${cam(1.12).scale},rotationX:6},{scale:${NEAR.scale},rotationX:0,duration:.6,ease:'power3.out',immediateRender:false},0);
    tl.fromTo(q('#c-disc'),{opacity:0,scale:.8,y:6},{opacity:1,scale:1,y:0,duration:.36,ease:'back.out(1.7)',immediateRender:false},.32);
    tl.fromTo(q('#c-ring'),{opacity:.45,scale:.9},{opacity:0,scale:1.3,duration:.7,ease:'power2.out',immediateRender:false},.4);
    // confetti burst: 36 particles, pure ballistic function of time
    const host=q('#c-conf'); const cols=['#C6FF34','#7E3BED','#BC9CF7','#ADF20D','#D6C3FB']; const parts=[];
    for(let i=0;i<36;i++){ const e=document.createElement('i'); const a=(i/36)*Math.PI*2+((i*7)%5)*.07; const v=95+((i*13)%7)*14; const w=5+((i*3)%3)*2; e.style.cssText='position:absolute;left:-'+(w/2)+'px;top:-'+(w/2)+'px;width:'+w+'px;height:'+(w*1.5)+'px;border-radius:2px;background:'+cols[i%5]+';opacity:0;will-change:transform'; host.appendChild(e); parts.push({e,vx:Math.cos(a)*v,vy:Math.sin(a)*v-120,rot:(i*37)%360}); }
    const drv={p:0};
    tl.to(drv,{p:1,duration:1.5,ease:'none',onUpdate:()=>{const t=drv.p*1.5; parts.forEach(pt=>{const x=pt.vx*t, y=pt.vy*t+220*t*t; const o=t<1.1?1:Math.max(0,1-(t-1.1)/.4); gsap.set(pt.e,{x:x,y:y,rotation:pt.rot+t*360,opacity:o});});}},.5);
    fadeUp(tl,document.querySelectorAll('#c-ok .ent'),.45,.07,18,.36);
    tl.fromTo(q('#c-bottom'),{y:40,opacity:0},{y:0,opacity:1,duration:.4,ease:'power3.out',immediateRender:false},.9);
    curEnter(tl,${btn.x},${btn.y},2.5,.7);
  `});
