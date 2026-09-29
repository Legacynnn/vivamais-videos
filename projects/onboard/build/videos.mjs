import fs from 'fs';
import { FAR } from './common.mjs';
import { homeScreen, perfilScreen } from './screens.mjs';
import { plantaoTab, filaScreen, consultaScreen, buscaScreenTall } from './screens-onboard.mjs';

const M = JSON.parse(fs.readFileSync(new URL('./measure.json', import.meta.url), 'utf8'));
const C = (r) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
const DUR = 9.6;
const LOOP_AT = 8.85;
const CALL_DOC = 'Dr. Rafael Lima';

const layer = (id, inner, extra = '') => `<div class="next" id="${id}" style="box-shadow:none;${extra}">${inner}<div class="hi"></div></div>`;
const loop = (lid) => `
    tl.fromTo(q('#${lid}'),{autoAlpha:0},{autoAlpha:1,duration:.55,ease:'power1.inOut',immediateRender:false},${LOOP_AT});
    tl.to(dev,{scale:${FAR.scale},y:0,duration:.01},${DUR - 0.05});`;

const siren = C(M.qaSiren), cta = C(M.ptCta), enter = C(M.fEnter);
export const consulta = {
  id: 'onboard-consulta',
  duration: DUR,
  body: `<div class="prev" id="c-home">${homeScreen('h', 0)}<div class="hi"></div></div>
${layer('c-pt', plantaoTab('pt'), 'visibility:hidden;opacity:0')}
<div class="next" id="c-fila" style="visibility:hidden">${filaScreen('f', CALL_DOC)}</div>
${layer('c-call', consultaScreen('v', 'd0.png', CALL_DOC), 'visibility:hidden;opacity:0')}
${layer('c-loop', homeScreen('l', 0), 'visibility:hidden;opacity:0')}`,
  script: `
    look(tl,470,1.75,.3,1.0);
    curEnter(tl,${siren.x},${siren.y - 6},.45,.8);
    tap(tl,1.35,q('#h-qa-siren'),.94);
    tl.fromTo(q('#c-pt'),{autoAlpha:0},{autoAlpha:1,duration:.22,ease:'power1.out',immediateRender:false},1.47);
    fadeUp(tl,document.querySelectorAll('#pt .ent'),1.5,.06,16,.34);
    tl.set(q('#c-home'),{autoAlpha:0},1.75);
    curMove(tl,${cta.x},${cta.y},1.75,.5);
    tap(tl,2.35,q('#pt-cta'),.97);
    tl.set(q('#c-fila'),{autoAlpha:1},2.43);
    iosPush(tl,q('#c-pt'),q('#c-fila'),2.45,.42);
    tl.to(cur,{opacity:0,duration:.2},2.5);
    look(tl,437,1.75,2.5,.8);
    fadeUp(tl,document.querySelectorAll('#f .ent'),2.75,.08,18,.36);
    const clk={t:48}, clkEl=q('#f-clock');
    tl.fromTo(clk,{t:48},{t:52,duration:4,ease:'none',immediateRender:false,onUpdate:()=>{clkEl.textContent='00:'+String(Math.floor(clk.t)).padStart(2,'0');}},2.45);
    tl.fromTo(q('#f-live'),{opacity:1},{opacity:.3,duration:.7,ease:'sine.inOut',yoyo:true,repeat:3,immediateRender:false},2.6);
    tl.to(q('#f-fig2'),{opacity:0,y:-14,duration:.22,ease:'power2.in'},3.75);
    tl.fromTo(q('#f-fig1'),{opacity:0,y:14},{opacity:1,y:0,duration:.34,ease:'power3.out',immediateRender:false},3.9);
    tl.to(q('#f-det2'),{opacity:0,duration:.18},3.75);
    tl.fromTo(q('#f-det1'),{opacity:0},{opacity:1,duration:.3,immediateRender:false},3.9);
    tl.to(q('#f-wait'),{opacity:0,y:-10,duration:.22,ease:'power2.in'},4.8);
    tl.set(q('#f-wait'),{autoAlpha:0},5.05);
    tl.fromTo(q('#f-ready'),{opacity:0},{opacity:1,duration:.2,immediateRender:false},4.98);
    tl.fromTo(q('#f-disc'),{scale:.6},{scale:1,duration:.45,ease:'back.out(1.8)',immediateRender:false},5.0);
    fadeUp(tl,document.querySelectorAll('#f .rdy'),5.08,.07,14,.34);
    tl.to(['#f-seg2','#f-seg3'],{backgroundColor:'#7E3BED',duration:.25,stagger:.1,ease:'power2.out'},5.0);
    tl.to(q('#f-stepA'),{opacity:0,duration:.15},5.0);
    tl.to(q('#f-stepB'),{opacity:1,duration:.25},5.1);
    tl.set(q('#f-stepn'),{textContent:'4'},5.1);
    tl.to(q('#f-leave'),{opacity:0,duration:.18},5.05);
    tl.fromTo(q('#f-enter'),{opacity:0,scale:.96},{opacity:1,scale:1,duration:.32,ease:'back.out(1.6)',immediateRender:false},5.12);
    look(tl,500,1.5,4.95,.8);
    curEnter(tl,${enter.x},${enter.y},5.45,.7);
    tap(tl,6.25,q('#f-enter'),.97);
    tl.fromTo(q('#c-call'),{autoAlpha:0,scale:.9},{autoAlpha:1,scale:1,duration:.45,ease:'power3.out',immediateRender:false},6.35);
    tl.set(q('#c-fila'),{autoAlpha:0},6.85);
    tl.to(cur,{opacity:0,duration:.18},6.4);
    look(tl,437,1.3,6.35,1.0);
    tl.fromTo(q('#v-vid'),{scale:1.12},{scale:1.0,duration:3.2,ease:'power2.out',immediateRender:false},6.35);
    tl.fromTo(q('#v-self'),{scale:.6,opacity:0},{scale:1,opacity:1,duration:.45,ease:'back.out(1.6)',immediateRender:false},6.85);
    tl.fromTo(document.querySelectorAll('#v .wb'),{scale:.5,opacity:0},{scale:1,opacity:1,duration:.4,ease:'back.out(1.7)',stagger:.05,immediateRender:false},6.95);
    fadeUp(tl,document.querySelectorAll('#v .ent'),7.1,.06,10,.3);
    look(tl,437,${FAR.scale},7.95,.9);
    ${loop('c-loop')}
  `,
};

const cardio = M.cardio, DRAG = 300, LIST = 260;
const cardioC = { x: cardio.x - DRAG + cardio.w / 2, y: cardio.y + cardio.h / 2 };
const row3 = C(M.sRow3), sobre = C(M.pSobre);
const sx = cardio.w / 402, sy = cardio.h / 809;
export const medicos = {
  id: 'onboard-medicos',
  duration: DUR,
  body: `<div class="prev" id="m-home">${homeScreen('h', 0)}${buscaScreenTall('s')}<div class="hi"></div></div>
${layer('m-perfil', perfilScreen('p'), 'visibility:hidden')}
${layer('m-loop', homeScreen('l', 0), 'visibility:hidden;opacity:0')}`,
  script: `
    gsap.set(q('#s-busca'),{autoAlpha:0});
    look(tl,400,1.75,.3,1.0);
    curEnter(tl,320,${cardio.y + cardio.h / 2},.5,.8);
    tl.to(cur,{scale:.85,duration:.12,ease:'power2.in'},1.35);
    tl.to(cur,{x:90,duration:.5,ease:'power2.inOut'},1.4);
    tl.to(q('#h-hero .hchips'),{x:-${DRAG},duration:.85,ease:'power3.out'},1.4);
    tl.to(cur,{scale:1,duration:.2,ease:'power2.out'},1.9);
    curMove(tl,${cardioC.x},${cardioC.y},2.1,.45);
    tap(tl,2.65,q('#h-cardio'),.94);
    tl.set(q('#s-busca'),{autoAlpha:1},2.74);
    tl.fromTo(q('#s-backdrop'),{opacity:0},{opacity:1,duration:.36,ease:'power2.out',immediateRender:false},2.75);
    tl.fromTo(q('#s-surface'),{x:${cardioC.x - cardio.w / 2},y:${cardio.y - 65},scaleX:${sx},scaleY:${sy},borderRadius:14},{x:0,y:0,scaleX:1,scaleY:1,borderRadius:26,duration:.42,ease:'power3.out',immediateRender:false},2.75);
    tl.fromTo(q('#s-sheet'),{opacity:0},{opacity:1,duration:.18,ease:'none',immediateRender:false},2.9);
    fadeUp(tl,q('#s-sheet').querySelectorAll('.sitem'),2.95,.05,14,.3);
    fadeUp(tl,q('#s-list').querySelectorAll('.drow'),3.05,.06,18,.34);
    tl.fromTo(q('#s-badge'),{scale:0},{scale:1,duration:.4,ease:'back.out(2)',immediateRender:false},3.2);
    tl.set(q('#h-home'),{backgroundColor:'#3b1e78'},3.2); tl.set(q('#h-scroll'),{autoAlpha:0},3.2); tl.set(q('#h-tabs'),{autoAlpha:0},3.2);
    tl.to(cur,{opacity:0,duration:.2,ease:'power2.in'},2.8);
    look(tl,500,1.75,2.9,.8);
    curEnter(tl,260,780,3.65,.6);
    tl.to(cur,{scale:.85,duration:.12,ease:'power2.in'},4.3);
    nudge(tl,q('#s-list'),0,-${LIST},1.0,4.35);
    tl.to(cur,{y:500,duration:.8,ease:'power2.inOut'},4.35);
    tl.to(cur,{scale:1,duration:.2,ease:'power2.out'},5.1);
    curMove(tl,${row3.x},${row3.y - LIST},5.3,.45);
    tap(tl,5.85,q('#s-row3'),.98);
    tl.set(q('#m-perfil'),{autoAlpha:1},5.92);
    iosPush(tl,q('#m-home'),q('#m-perfil'),5.93,.42);
    tl.to(cur,{opacity:0,duration:.2},6.0);
    look(tl,440,1.45,6.0,.8);
    tl.fromTo(q('#p-photo'),{scale:1.08},{scale:1,duration:1.4,ease:'power2.out',immediateRender:false},5.95);
    fadeUp(tl,[q('#p-title')],6.25,.06,14,.4);
    curEnter(tl,300,${sobre.y},6.5,.55);
    tap(tl,7.1,q('#p-sobre'),.98);
    tl.to(q('#p-about'),{height:${M.pAboutH},duration:.45,ease:'power3.out'},7.15);
    tl.to(q('#p-chev'),{rotation:180,duration:.3,ease:'power2.out'},7.15);
    tl.fromTo(q('#p-aboutin'),{opacity:0,y:-8},{opacity:1,y:0,duration:.35,ease:'power3.out',immediateRender:false},7.25);
    curExit(tl,7.5,.5);
    look(tl,437,${FAR.scale},8.2,.65);
    ${loop('m-loop')}
  `,
};
