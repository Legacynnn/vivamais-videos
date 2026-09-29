import fs from 'fs';
import { execFileSync } from 'child_process';
import { css } from './common.mjs';
import { homeScreen, perfilScreen } from './screens.mjs';
import { plantaoTab, filaScreen, buscaScreenTall } from './screens-onboard.mjs';
const CHROME='/Users/legacyn/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const wrap=(inner)=>`<div class="phone" style="position:relative;margin-bottom:20px">${inner}</div>`;
const html=`<!doctype html><html><head><meta charset="UTF-8"><style>${css.replace(/url\(public\//g,'url(../public/').replace(/url\(node_modules\//g,'url(../node_modules/')}</style></head><body>
<div id="root" style="position:relative;width:500px">
${wrap(homeScreen('h',0))}${wrap(plantaoTab('pt'))}${wrap(filaScreen('f','Dr. Rafael Lima'))}${wrap(buscaScreenTall('s'))}${wrap(perfilScreen('p'))}
</div>
<script>
document.fonts.ready.then(()=>setTimeout(()=>{
const r=(s)=>{const e=document.querySelector(s);const b=e.getBoundingClientRect();const ph=e.closest('.phone').getBoundingClientRect();return {x:+(b.left-ph.left).toFixed(1),y:+(b.top-ph.top).toFixed(1),w:+b.width.toFixed(1),h:+b.height.toFixed(1)}};
const out={qaSiren:r('#h-qa-siren'),hero:r('#h-hero'),cardio:r('#h-cardio'),chips:r('#h-hero .hchips'),ptCta:r('#pt-cta'),fEnter:r('#f-enter'),sRow3:r('#s-row3'),sRow0:r('#s-row0'),sFchip:r('#s-fchip'),pSobre:r('#p-sobre'),pAboutH:document.querySelector('#p-aboutin').getBoundingClientRect().height,tabPlantao:r('#h-tabs [data-tab="3"]')};
document.body.innerHTML='<pre id="out">'+JSON.stringify(out)+'</pre>';
},300));
</script></body></html>`;
fs.writeFileSync(new URL('./_measure.html',import.meta.url),html);
const dom=execFileSync(CHROME,['--headless=new','--disable-gpu','--no-sandbox','--window-size=600,5000','--virtual-time-budget=8000','--dump-dom',new URL('./_measure.html',import.meta.url).href],{encoding:'utf8',maxBuffer:1e8});
const m=dom.match(/<pre id="out">([^<]+)<\/pre>/);
fs.writeFileSync(new URL('./measure.json',import.meta.url),m[1]);
console.log(m[1]);
