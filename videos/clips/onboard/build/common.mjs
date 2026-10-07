export const S = 1080/402;
export const NEAR = { x:0, y:0, scale: 1.75 };
export const FAR = { x:0, y:0, scale: 1.08 };
export const FULL = NEAR;
export const FRAMED = FAR;
export const I = (name,size,color,extra='')=>`<i class="ic" style="width:${size}px;height:${size}px;background:${color};-webkit-mask:url(node_modules/lucide-static/icons/${name}.svg) center/contain no-repeat;mask:url(node_modules/lucide-static/icons/${name}.svg) center/contain no-repeat;${extra}"></i>`;
export const AV = (src,size,r)=>`<div class="img" style="width:${size}px;height:${size}px;border-radius:${r}px;background-image:url(public/app/doctors/${src});flex:none"></div>`;
export const SPEC = (px=18)=>`<img src="public/app/cardio.png" style="width:${px}px;height:${px}px;object-fit:contain">`;
export const sb = (w=false)=>`<div class="sb ${w?'w':''}"><span>9:41</span><span class="row" style="gap:6px">${I('signal',16,w?'#fff':'#17151E')}${I('wifi',16,w?'#fff':'#17151E')}${I('battery-full',20,w?'#fff':'#17151E')}</span></div>`;
const TABS=[['house','Início'],['calendar','Consultas'],['sparkles','IA'],['briefcase-medical','Plantão'],['layout-grid','Ações']];
export const tabsOn=(on=0,id='')=>`<div class="tabs" ${id?`id="${id}"`:''}>${TABS.map(([i,l],k)=>`<div class="tab${k===on?' on':''}" data-tab="${k}"><span class="tic" style="position:relative;width:25px;height:25px">${I(i,25,'#8E8E93','position:absolute;left:0;top:0')}<span class="ton" style="position:absolute;left:0;top:0;opacity:${k===on?1:0}">${I(i,25,'#7E3BED')}</span></span><span class="tl">${l}</span></div>`).join('')}</div>`;
export const tabs = tabsOn(0);
export const pill=(t,v='primary',extra='')=>`<div class="pill ${v}" ${extra}>${t}</div>`;
export const sticky=(inner,extra='')=>`<div class="sticky" ${extra}>${inner}</div>`;
export const hdr=(t)=>`<div class="row" style="padding:0 20px"><div class="circ" style="background:#F2F1F6">${I('chevron-left',22,'#17151E')}</div><span class="brand dm5" style="font-size:22px;line-height:28px;letter-spacing:-.22px;margin-left:12px">${t}</span></div>`;

export const css = `
@font-face{font-family:'DM Sans';font-weight:400;src:url(public/fonts/DMSans_400Regular.ttf)}
@font-face{font-family:'DM Sans';font-weight:500;src:url(public/fonts/DMSans_500Medium.ttf)}
@font-face{font-family:'DM Sans';font-weight:700;src:url(public/fonts/DMSans_700Bold.ttf)}
@font-face{font-family:'Space Grotesk';font-weight:500;src:url(public/fonts/SpaceGrotesk_500Medium.ttf)}
@font-face{font-family:'Space Grotesk';font-weight:700;src:url(public/fonts/SpaceGrotesk_700Bold.ttf)}
#root{position:absolute;inset:0;background:#F4F3F8;perspective:2600px;font-family:'DM Sans',system-ui,sans-serif;color:#17151E;overflow:hidden}
*{box-sizing:border-box}
.stage{position:absolute;inset:0;background:radial-gradient(90% 90% at 50% 42%,#FFFFFF 0%,#FAFAFE 45%,#EEEDF4 100%);overflow:hidden}
.stage .bloom{position:absolute;left:50%;top:46%;will-change:transform;width:1100px;height:1100px;margin:-550px 0 0 -550px;border-radius:50%;background:radial-gradient(circle,rgba(157,107,242,.16) 0%,rgba(188,156,247,.07) 42%,rgba(250,250,254,0) 70%)}
.device{position:absolute;left:325px;top:89px;width:430px;height:902px;transform-origin:50% 50%;border-radius:64px;background:#1C1A24;padding:14px;will-change:transform;box-shadow:0 0 0 1.5px #3A3744 inset,0 60px 90px -30px rgba(34,8,74,.30),0 24px 40px -12px rgba(23,21,30,.18)}
.phone{position:relative;width:402px;height:874px;border-radius:50px;background:#FAFAFE;overflow:hidden}
.island{position:absolute;left:50%;top:11px;width:124px;height:36px;margin-left:-62px;border-radius:18px;background:#000;z-index:60}
.screen{position:absolute;inset:0;overflow:hidden;background:#FAFAFE}
.ic{display:inline-block;flex:none}
.sb{position:absolute;left:0;right:0;top:0;height:54px;display:flex;justify-content:space-between;align-items:flex-end;padding:0 28px 10px;font-weight:600;font-size:15px;z-index:5}
.sb.w{color:#fff}
.brand{font-family:'Space Grotesk',sans-serif}
.dm4{font-weight:400}.dm5{font-weight:500}.dm7{font-weight:700}
.row{display:flex;align-items:center}.col{display:flex;flex-direction:column}
.cur{position:absolute;left:-24px;top:-24px;width:48px;height:48px;z-index:50}
.cur .d{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 34% 28%,rgba(255,255,255,.95) 0%,rgba(235,225,253,.85) 28%,rgba(188,156,247,.78) 70%,rgba(157,107,242,.8) 100%);border:1px solid rgba(255,255,255,.8);box-shadow:0 8px 20px rgba(87,25,182,.30),0 2px 5px rgba(34,8,74,.18),inset 0 -3px 6px rgba(106,36,219,.25)}
.cur .r{position:absolute;inset:0;border-radius:50%;border:2px solid rgba(157,107,242,.8);opacity:0}
.pill{height:52px;border-radius:999px;padding:0 24px;display:flex;align-items:center;justify-content:center;font-weight:500;font-size:16px;white-space:nowrap}
.pill.primary{background:#7E3BED;color:#fff}.pill.ghost{background:#fff;border:1px solid #E6E4EC;color:#5719B6}.pill.disabled{background:#F2F1F6;color:#A29FB0}
.sticky{position:absolute;left:0;right:0;bottom:0;background:#fff;padding:12px 20px 34px;box-shadow:0 -8px 24px rgba(23,21,30,.1);z-index:4}
.circ{width:44px;height:44px;border-radius:22px;display:flex;align-items:center;justify-content:center;flex:none}
.tabs{position:absolute;left:0;right:0;bottom:0;height:83px;background:rgba(249,249,249,.94);border-top:.5px solid rgba(0,0,0,.3);display:flex;padding-bottom:34px;z-index:4;backdrop-filter:blur(20px)}
.tabs .tab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font:500 10px -apple-system,system-ui;color:#8E8E93}.tabs .on{color:#7E3BED}
.img{background-size:cover;background-position:center}
.hi{position:absolute;bottom:8px;left:50%;width:134px;height:5px;margin-left:-67px;border-radius:3px;background:#17151E;opacity:.5;z-index:6}
.hi.w{background:#fff}
.scroll{position:absolute;left:0;right:0;top:0;will-change:transform}
.prev{position:absolute;inset:0;will-change:transform;z-index:2}
.next{position:absolute;inset:0;will-change:transform;z-index:3;box-shadow:-12px 0 40px rgba(0,0,0,.18)}
.vig{position:absolute;inset:0;background:rgba(0,0,0,0);pointer-events:none}
`;

export const jsHelpers = `
const q=(s)=>document.querySelector(s);
const cur=q('#__ID__-cur'), ring=q('#__ID__-cur .r');
function curEnter(tl,x,y,at,dur=.85){ tl.set(cur,{opacity:1},at); tl.fromTo(cur,{x:x,y:1120},{x:x,y:y,duration:dur,ease:'power3.out',immediateRender:false},at); }
function curMove(tl,x,y,at,dur=.6){ tl.to(cur,{x:x,y:y,duration:dur,ease:'power3.inOut'},at); }
function curExit(tl,at,dur=.6){ tl.to(cur,{y:1120,duration:dur,ease:'power3.in'},at); }
function look(tl,fy,s,at,dur=.9,ease='power3.inOut'){ tl.to(dev,{scale:s,y:(451-(14+fy))*s,duration:dur,ease:ease},at); }
function tap(tl,at,target,pressScale=.97){
  tl.to(cur,{scale:.78,duration:.1,ease:'power2.in'},at);
  tl.to(cur,{scale:1,duration:.22,ease:'power2.out'},at+.1);
  tl.fromTo(ring,{scale:1,opacity:.7},{scale:2.4,opacity:0,duration:.5,ease:'power2.out',immediateRender:false},at+.05);
  if(target){ tl.to(target,{scale:pressScale,duration:.1,ease:'power2.in'},at); tl.to(target,{scale:1,duration:.28,ease:'back.out(1.6)'},at+.1); }
}
function nudge(tl,el,from,to,dur,at){ const d=to-from; tl.fromTo(el,{y:from},{y:from+d*.10,duration:dur*.12,ease:'power3.in',immediateRender:false},at); tl.to(el,{y:from+d*.75,duration:dur*.45,ease:'none'},at+dur*.12); tl.to(el,{y:to,duration:dur*.43,ease:'power4.out'},at+dur*.57); }
function iosPush(tl,prev,next,at,dur=.38){ tl.fromTo(next,{x:402},{x:0,duration:dur,ease:'power3.out',immediateRender:false},at); tl.fromTo(prev,{x:0,autoAlpha:1},{x:-120,duration:dur,ease:'power3.out',immediateRender:false},at); tl.set(prev,{autoAlpha:0},at+dur+.02); swing(tl,at,dur); }
function swing(tl,at,dur=.38){ tl.fromTo(dev,{rotationY:0,x:0},{rotationY:-9,x:-28,duration:dur*.55,ease:'power2.out',immediateRender:false},at); tl.to(dev,{rotationY:0,x:0,duration:dur*1.6,ease:'power3.out'},at+dur*.55);  }
function vignette(tl,el,at,dur=.38){ tl.fromTo(el,{backgroundColor:'rgba(0,0,0,0)'},{backgroundColor:'rgba(0,0,0,.18)',duration:dur,ease:'power2.out',immediateRender:false},at); }
function fadeUp(tl,els,at,stagger=.06,dist=18,dur=.32){ tl.fromTo(els,{y:dist,opacity:0},{y:0,opacity:1,duration:dur,ease:'power3.out',stagger:stagger,immediateRender:false},at); }
`;

export function file(id, body, script, opts={}){
  const {framed=false, duration=5} = opts;
  const cam = framed?FAR:NEAR;
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"><title>${id}</title></head>
<body><template>
<style>${css}</style>
<div id="root" data-composition-id="${id}" data-width="1080" data-height="1080" data-duration="${duration}">
<div class="stage"><div class="bloom"></div></div>
<div class="device" id="${id}-device" style="transform:translate(0px,0px) scale(${cam.scale})"><div class="phone">${body}<div class="island"></div><div class="cur" id="${id}-cur"><div class="d"></div><div class="r"></div></div></div></div>
</div>
<script>
(function(){
const id='${id}';
${jsHelpers.replace(/__ID__/g,id)}
const tl = gsap.timeline({ paused: true });
gsap.set(cur,{opacity:0}); const dev=q('#${id}-device'); gsap.set(dev,{scale:${cam.scale},x:0,y:0,rotationY:0});
${script}
window.__timelines['${id}'] = tl;
})();
</script>
</template></body></html>`;
}
