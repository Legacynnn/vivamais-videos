import fs from 'fs';
import { file } from './common.mjs';
import { frames } from './frames.mjs';
let more=[]; try { more=(await import('./frames2.mjs')).frames; } catch(e){ if(!/Cannot find module/.test(e.message)) throw e; }
let more3=[]; try { more3=(await import('./frames3.mjs')).frames; } catch(e){ if(!/Cannot find module/.test(e.message)) throw e; }
const all=[...frames,...more,...more3];
fs.mkdirSync('compositions/frames',{recursive:true});
for(const f of all) fs.writeFileSync(`compositions/frames/${f.id}.html`, file(f.id,f.body,f.script,{framed:f.framed,duration:f.duration}));
let t=0; const hosts=all.map(f=>{const h=`  <div id="${f.id}" class="clip" data-composition-id="${f.id}" data-composition-src="compositions/frames/${f.id}.html" data-start="${t.toFixed(2)}" data-duration="${f.duration}" data-track-index="1" data-width="1080" data-height="1920"></div>`; t+=f.duration; return h;}).join('\n');
fs.writeFileSync('index.html',`<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080, height=1920"><title>Viva Mais walkthrough</title><script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script><style>body{margin:0;background:#22084A}#root{position:relative;width:100%;height:100%;overflow:hidden;background:#22084A}.clip{position:absolute;inset:0}</style></head><body><div id="root" data-composition-id="main" data-start="0" data-width="1080" data-height="1920" data-duration="${t.toFixed(2)}">\n${hosts}\n</div><script>const tl=gsap.timeline({paused:true});window.__timelines["main"]=tl;</script></body></html>`);
console.log(all.length,'frames, total',t.toFixed(2),'s');
