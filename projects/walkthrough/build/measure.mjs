import fs from 'fs';
import { execFileSync } from 'child_process';
import { css } from './common.mjs';
import { homeScreen, perfilScreen } from './screens.mjs';
import { pagamentoScreen, pagarScreen, confirmadoScreen } from './screens2.mjs';
import { hubScreen, step1, step2, step3, step4, step5, revisaoScreen } from './screens3.mjs';
const CHROME='/Users/legacyn/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const html=`<!doctype html><html><head><meta charset="UTF-8"><style>${css.replace(/url\(public\//g,'url(../public/').replace(/url\(node_modules\//g,'url(../node_modules/')}</style></head><body>
<div id="root" style="width:1080px;height:1920px"><div class="device" style="transform:none"><div class="phone" style="position:relative">
${homeScreen('h',0)}${perfilScreen('p')}${pagamentoScreen('g')}${pagarScreen('x')}${confirmadoScreen('c')}${hubScreen('ah')}${step1('a1')}${step2('a2')}${step3('a3')}${step4('a4')}${step5('a5')}${revisaoScreen('ar')}
</div></div></div>
<script>
const r=(s)=>{const e=document.querySelector(s);const b=e.getBoundingClientRect();const ph=document.querySelector('.phone').getBoundingClientRect();return {x:b.left-ph.left,y:b.top-ph.top,w:b.width,h:b.height}};
const out={bcard:r('#h-bcard'),ben:r('#h-ben'),plan:r('#h-plan'),hero:r('#h-hero'),quick:r('#h-quick'),pscrollH:document.querySelector('#p-pscroll').scrollHeight,s6:r('#p-s6'),wcell15:r('#p-pscroll .wcell[data-day="15"] .puck'),wcell14:r('#p-pscroll .wcell[data-day="14"] .puck'),card2:r('#p-pscroll > div:nth-child(2)'),pixRow:r('#g-pix'),xBar:r('#x-bar'),xQr:r('#x-qr'),xCopy:r('#x-copy'),xPanelH:document.querySelector('#x-panel').getBoundingClientRect().height,cBtn:r('#c-btn'),a1ta:r('#a1-ta'),a2marker:r('#a2-marker'),a2confirm:r('#a2-confirm'),a2sheetH:document.querySelector('#a2-sheet').getBoundingClientRect().height,a3sem:r('#a3-c-sem'),a3pio:r('#a3-c-pio'),a4box:r('#a4-box'),cta:r('#a1-cta')};
document.body.innerHTML='<pre id="out">'+JSON.stringify(out)+'</pre>';
</script></body></html>`;
fs.writeFileSync(new URL('./_measure.html',import.meta.url),html);
const dom=execFileSync(CHROME,['--headless=new','--disable-gpu','--no-sandbox','--window-size=1080,1920','--dump-dom',new URL('./_measure.html',import.meta.url).href],{encoding:'utf8',maxBuffer:1e8});
const m=dom.match(/<pre id="out">([^<]+)<\/pre>/);
fs.writeFileSync(new URL('./measure.json',import.meta.url),m[1]);
console.log(m[1]);
