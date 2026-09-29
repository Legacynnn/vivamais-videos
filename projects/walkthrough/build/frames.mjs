import fs from 'fs';
import { file, NEAR, FAR, S } from './common.mjs';
import { homeScreen, buscaScreen, perfilScreen, buscaSheetContent } from './screens.mjs';
const M = JSON.parse(fs.readFileSync('build/measure.json','utf8'));
const HOME_SCROLL = 545;
const CARD = { x: M.bcard.x, y: M.bcard.y - HOME_SCROLL, w: M.bcard.w, h: M.bcard.h };
const CARD_C = { x: CARD.x + CARD.w/2, y: CARD.y + CARD.h/2 };
export const frames = [];

// ---- 01 Abrir ----
frames.push({ id:'f01-abrir', duration:5, framed:true,
  body: homeScreen('a',0) + `<div class="hi"></div>`,
  script: `
    tl.fromTo(dev,{scale:${FAR.scale*0.86},y:120,rotationX:-10},{scale:${FAR.scale},y:0,rotationX:0,duration:.9,ease:'power3.out',immediateRender:false},0);
    curEnter(tl,201,300,.9,.9);
    tap(tl,2.0,null);
    tl.to(dev,{scale:${NEAR.scale},duration:1.3,ease:'power3.inOut'},2.05);
  `});

// ---- 02 Home ----
frames.push({ id:'f02-home', duration:4.0, framed:false,
  body: homeScreen('h',0) + `<div class="hi"></div>`,
  script: `
    tl.set(cur,{x:201,y:300,opacity:1},0);
    curMove(tl,201,620,.15,.3);
    nudge(tl,q('#h-scroll'),0,-300,.9,.5);
    tl.to(cur,{y:380,duration:.9,ease:'power2.inOut'},.5);
    curMove(tl,201,640,1.6,.35);
    nudge(tl,q('#h-scroll'),-300,-${HOME_SCROLL},.9,2.0);
    tl.to(cur,{y:400,duration:.9,ease:'power2.inOut'},2.0);
    fadeUp(tl,['#h-bcard','#h-bcard2'],2.55,.09,44,.4);
    curMove(tl,${CARD_C.x},${CARD_C.y},3.1,.6);
  `});

// ---- 03 Busca (morph) ----
const sx = CARD.w/402, sy = CARD.h/649;
frames.push({ id:'f03-busca', duration:3.2, framed:false,
  body: homeScreen('b',HOME_SCROLL).replace('opacity:0;z-index:4','opacity:1;z-index:4') + buscaScreen('s') + `<div class="hi"></div>`,
  script: `
    tl.set(cur,{x:${CARD_C.x},y:${CARD_C.y},opacity:1},0);
    tap(tl,0,q('#b-bcard'));
    tl.fromTo(q('#s-backdrop'),{opacity:0},{opacity:1,duration:.36,ease:'power2.out',immediateRender:false},.1);
    tl.fromTo(q('#s-surface'),{x:${CARD.x},y:${CARD.y-65},scaleX:${sx},scaleY:${sy},borderRadius:16},{x:0,y:0,scaleX:1,scaleY:1,borderRadius:26,duration:.4,ease:'power3.out',immediateRender:false},.1);
    tl.fromTo(q('#s-sheet'),{opacity:0},{opacity:1,duration:.18,ease:'none',immediateRender:false},.3);
    fadeUp(tl,q('#s-sheet').querySelectorAll('.sitem'),.32,.05,14,.3);
    fadeUp(tl,['#s-row1','#s-row2','#s-row3'],.42,.06,18,.32);
    tl.fromTo(q('#s-badge'),{scale:0},{scale:1,duration:.4,ease:'back.out(2)',immediateRender:false},.6);
    tl.set(q('#b-home'),{backgroundColor:'#3b1e78'},.52); tl.set(q('#b-scroll'),{autoAlpha:0},.52); tl.set(q('#b-home .tabs'),{autoAlpha:0},.52);
    tl.to(cur,{y:${CARD_C.y+40},opacity:0,duration:.25,ease:'power2.in'},.12);
    curEnter(tl,70,440,2.0,.7);
  `});

// ---- 04 Perfil e horário ----
const PSCROLL = 260;
const p15 = M.wcell15, s6 = M.s6;
frames.push({ id:'f04-perfil', duration:6.8, framed:false,
  body: `<div class="prev" id="p-prev">${homeScreen('pb',HOME_SCROLL).replace('opacity:0;z-index:4','opacity:1;z-index:4')}${buscaScreen('ps')}</div><div class="next" id="p-next">${perfilScreen('p')}</div><div class="hi w" id="p-hi"></div>`,
  script: `
    gsap.set(q('#pb-home'),{backgroundColor:'#3b1e78'}); gsap.set(q('#pb-scroll'),{autoAlpha:0}); gsap.set(q('#pb-home .tabs'),{autoAlpha:0});
    tl.set(cur,{x:70,y:440,opacity:1},0);
    tap(tl,0,q('#ps-row1'),.98);
    iosPush(tl,q('#p-prev'),q('#p-next'),.08,.42);
    tl.to(cur,{opacity:0,duration:.2},.15);
    const hero=q('#p-hero'),photo=q('#p-photo'),title=q('#p-title'),pinned=q('#p-pinned');
    const st={s:0};
    const apply=()=>{const s=st.s;const c=(v)=>Math.max(0,Math.min(1,v));hero.style.height=Math.max(155,380-s)+'px';photo.style.opacity=1-c((s-78.75)/112.5);gsap.set(photo,{scale:1+.12*c(s/225),y:40.5*c(s/225)});title.style.opacity=1-c(s/112.5);pinned.style.opacity=c((s-135)/90);};
    apply();
    curEnter(tl,300,640,.8,.6);
    nudge(tl,q('#p-pscroll'),0,-120,.8,1.1);
    tl.fromTo(st,{s:0},{s:120,duration:.8,ease:'power2.inOut',onUpdate:apply,immediateRender:false},1.1);
    tl.to(cur,{y:420,duration:.8,ease:'power2.inOut'},1.1);
    curMove(tl,300,640,2.0,.3);
    nudge(tl,q('#p-pscroll'),-120,-${PSCROLL},.8,2.35);
    tl.fromTo(st,{s:120},{s:${PSCROLL},duration:.8,ease:'power2.inOut',onUpdate:apply,immediateRender:false},2.35);
    tl.to(cur,{y:420,duration:.8,ease:'power2.inOut'},2.35);
    curMove(tl,${p15.x+20},${p15.y+20-PSCROLL},3.3,.5);
    tap(tl,3.9,null);
    tl.fromTo(q('#p-selpuck'),{opacity:0,scale:.6},{opacity:1,scale:1,duration:.35,ease:'back.out(1.7)',immediateRender:false},3.9);
    tl.to(q('#p-pscroll .wcell[data-day="15"] .wdot'),{opacity:0,duration:.1},3.9);
    tl.to(q('#p-pscroll .wcell[data-day="14"] .puck'),{backgroundColor:'rgba(126,59,237,0)',duration:.2},3.9);
    tl.to(q('#p-pscroll .wcell[data-day="14"] .puck span'),{color:'#5719B6',duration:.2},3.9);
    tl.to(q('#p-pscroll .wcell[data-day="14"] .wdot'),{backgroundColor:'#BC9CF7',duration:.2},3.9);
    curMove(tl,${s6.x+s6.w/2},${s6.y+22-PSCROLL},4.5,.5);
    tap(tl,5.1,q('#p-s6'),.95);
    tl.fromTo(q('#p-s6 .slotbg'),{opacity:0},{opacity:1,duration:.18,immediateRender:false},5.1);
    tl.to(q('#p-s6'),{color:'#ffffff',fontWeight:700,duration:.18},5.1);
    tl.to(q('#p-bar'),{backgroundColor:'#7E3BED',duration:.3},5.25);
    tl.to(q('#p-bar-a'),{opacity:0,duration:.15},5.25);
    tl.fromTo(q('#p-bar-b'),{opacity:0,y:8,color:'#ffffff'},{opacity:1,y:0,duration:.3,ease:'power3.out',immediateRender:false},5.3);
    curMove(tl,201,654,5.9,.55);
  `});
