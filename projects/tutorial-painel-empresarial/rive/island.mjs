import fs from 'node:fs';
import { connect, call, exportRiv } from './lib.mjs';
import { Stage, c, circlePts, roundRectPts, svgPathToPolys, K } from './iso.mjs';

const T = {
  v50: '#F5F0FE', v100: '#EBE1FD', v200: '#D6C3FB', v300: '#BC9CF7', v400: '#9D6BF2', v500: '#7E3BED', v600: '#6A24DB', v700: '#5719B6', v800: '#451391', v900: '#350E6F', v950: '#22084A',
  lime: '#C6FF34', limeDark: '#8CC900', ink: '#17151E', white: '#FFFFFF', canvas: '#FAFAFE', teal: '#12FFD7',
};
const ANIMATE = process.argv.includes('--animate');
await connect();
const old = (await call('list_artboards', {})).parsed.artboards.filter((a) => a.name === 'Intro');
if (old.length) await call('delete_objects', { objectIds: old.map((a) => a.id) });

const s = new Stage('Intro', 1920, 1080, 390, [1330, 640]);
await s.init(c(T.canvas));
const prim = async (spec) => {
  const r = await call('path_editor', { command: 'createParametricShapes', data: { createParametricShapes: { shapes: [{ parentId: s.id, ...spec }] } } });
  return r.parsed.shapes[0].id;
};

const aura = await prim({ primitive: 'ellipse', name: 'Aura', x: 1330, y: 600, width: 1250, height: 980, paints: [{ paintType: 'fill', color: c(T.v500, '3a'), feather: { strength: 220 } }] });
const ground = await prim({ primitive: 'ellipse', name: 'Ground', x: 1330, y: 760, width: 1000, height: 420, paints: [{ paintType: 'fill', color: c(T.v900, '38'), feather: { strength: 70, offsetY: 30 } }] });

const base = await s.isoGroup('Island', [0, 0, 0]);
s.box(base, 'Lower', [-300, -300, -62], [600, 600, 26], [c(T.v100), c(T.v300), c(T.v400)]);
s.box(base, 'Upper', [-260, -260, -36], [520, 520, 36], [c(T.white), c(T.v200), c(T.v300)]);
{
  const p = s.local(base);
  for (const v of [-130, 0, 130]) {
    s.stroke(base, `GX${v}`, [p(v, -260, 0.4), p(v, 260, 0.4)], c(T.v100), 3);
    s.stroke(base, `GY${v}`, [p(-260, v, 0.4), p(260, v, 0.4)], c(T.v100), 3);
  }
  s.stroke(base, 'Route', [p(-120, -36, 0.6), p(-120, 95, 0.6), p(95, 95, 0.6), p(95, -120, 0.6), p(150, -120, 0.6), p(150, -215, 0.6)], c(T.lime), 12);
}
await s.commit(base);

const panel = await s.isoGroup('Call', [150, -237, 0]);
{
  const p = s.local(panel);
  s.box(panel, 'Frame', [50, -244, 0], [200, 14, 176], [c(T.v200), c(T.white), c(T.v300)]);
  const f = (x, z) => p(x, -229.6, z);
  s.fill(panel, 'Screen', [f(62, 164), f(238, 164), f(238, 12), f(62, 12)], c(T.v950));
  s.fill(panel, 'Shoulders', Array.from({ length: 17 }, (_, i) => f(150 + Math.cos((i / 16) * Math.PI) * 60, 12 + Math.sin((i / 16) * Math.PI) * 52)), c(T.v400));
  s.fill(panel, 'Head', circlePts(0, 0, 1, 26).map(([a, b]) => f(150 + a * 30, 100 + b * 30)), c(T.v200));
  s.fill(panel, 'Live', circlePts(0, 0, 1, 18).map(([a, b]) => f(218 + a * 9, 146 + b * 9)), c(T.lime));
  s.fill(panel, 'Pip', [f(72, 60), f(112, 60), f(112, 22), f(72, 22)], c(T.v700));
}
await s.commit(panel);

const tower = await s.isoGroup('Empresa', [-120, -120, 0]);
{
  const p = s.local(tower);
  s.box(tower, 'Body', [-200, -200, 0], [160, 160, 300], [c(T.v300), c(T.v500), c(T.v700)]);
  s.box(tower, 'Cap', [-176, -176, 300], [64, 64, 28], [c(T.v200), c(T.v400), c(T.v600)]);
  const right = (y, z) => p(-39.6, y, z);
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 3; col++) {
      const y0 = -184 + col * 50;
      const z0 = 246 - row * 50;
      s.fill(tower, `W${row}${col}`, [right(y0, z0), right(y0 + 30, z0), right(y0 + 30, z0 - 32), right(y0, z0 - 32)], c(T.v500));
    }
  }
  const left = (x, z) => p(x, -39.6, z);
  s.fill(tower, 'Door', [left(-142, 74), left(-98, 74), left(-98, 0), left(-142, 0)], c(T.v800));
  const svg = fs.readFileSync(new URL('../assets/brand/logo.svg', import.meta.url), 'utf8');
  const ds = [...svg.matchAll(/<path d="([^"]+)" fill="url/g)].map((m) => m[1]);
  const k = 118 / 89;
  ds.forEach((d, i) => {
    const polys = svgPathToPolys(d).map((pts, n) => (n % 2 ? pts.slice().reverse() : pts).map(([lx, ly]) => left(-120 + (lx - 80.4) * k, 186 - (ly - 80.9) * k)));
    s.fill(tower, `Mark${i}`, polys, c(T.white));
  });
}
const towerParts = await s.commit(tower);
await call('set_property_values', { propertyValues: { [towerParts.Mark0.paint]: { 40: 1 } } });

const people = [];
const crowd = [
  [30, -150, T.v500, T.v200],
  [125, -60, T.ink, T.lime],
  [-150, 30, T.v700, T.v300],
  [10, 40, T.lime, T.ink],
  [40, 195, T.v400, T.v100],
  [160, 215, T.ink, T.v300],
].sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
for (const [i, [x, y, body, head]] of crowd.entries()) {
  const g = await s.isoGroup(`Vida${i}`, [x, y, 0]);
  s.fill(g, 'Shadow', circlePts(0, 2, 34, 24, 17), c(T.v900, '30'));
  s.fill(g, 'Body', roundRectPts(-24, -84, 48, 88, 24), c(body));
  s.fill(g, 'Head', circlePts(0, -110, 22, 24), c(head));
  await s.commit(g);
  people.push(g);
}

const coins = [];
for (let i = 0; i < 3; i++) {
  const g = await s.isoGroup(`Coin${i}`, [185, 95, i * 24]);
  if (i === 0) s.fill(g, 'Shadow', circlePts(0, 8, 66, 28, 33), c(T.v900, '2c'));
  s.fill(g, 'Under', circlePts(0, 0, 58, 28, 29), c(T.limeDark));
  s.fill(g, 'Band', [[-58, -24], [58, -24], [58, 0], [-58, 0]], c(T.limeDark));
  s.fill(g, 'Top', circlePts(0, -24, 58, 28, 29), c(T.lime));
  s.stroke(g, 'Ring', circlePts(0, -24, 38, 28, 19), c(T.limeDark), 4, true);
  await s.commit(g);
  coins.push(g);
}

const calShadow = await s.isoGroup('AgendaSombra', [-150, 180, 0]);
{
  const p = s.local(calShadow);
  s.fill(calShadow, 'Shade', [p(-245, 105, 0.8), p(-55, 105, 0.8), p(-55, 255, 0.8), p(-245, 255, 0.8)], c(T.v900, '26'), { feather: { strength: 14 } });
}
await s.commit(calShadow);
const cal = await s.isoGroup('Agenda', [-150, 180, 90]);
let calParts;
{
  const p = s.local(cal);
  s.box(cal, 'Slab', [-245, 105, 90], [190, 150, 14], [c(T.white), c(T.v200), c(T.v300)]);
  const t = (x, y) => p(x, y, 104.4);
  s.fill(cal, 'Header', [t(-245, 105), t(-55, 105), t(-55, 143), t(-245, 143)], c(T.v500));
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 3; i++) {
      const x0 = -231 + i * 58;
      const y0 = 157 + j * 46;
      const on = i === 1 && j === 0;
      s.fill(cal, `Day${j}${i}`, [t(x0, y0), t(x0 + 46, y0), t(x0 + 46, y0 + 34), t(x0, y0 + 34)], c(on ? T.lime : T.v100));
    }
  }
  s.stroke(cal, 'Check', [t(-162, 176), t(-152, 184), t(-136, 164)], c(T.ink), 6);
  calParts = await s.commit(cal);
}

const sparks = [];
for (const [i, [x, y, size, color]] of [[930, 330, 54, T.lime], [1760, 470, 44, T.v300], [1690, 250, 36, T.lime], [1010, 830, 40, T.v300]].entries()) {
  sparks.push(await prim({ primitive: 'star', name: `Spark${i}`, x, y, width: size, height: size, points: 4, innerRadius: 30, paints: [{ paintType: 'fill', color: c(color) }] }));
}

if (ANIMATE) {
  const route = base.parts.Route;
  const routeTrim = await s.trim(route.paint);
  const checkTrim = await s.trim(calParts.Check.paint);
  s.kf(aura, 'opacity', [[0, 0, 'out'], [50, 100]]);
  s.scale(aura, [[0, 70, 'out'], [70, 100]]);
  s.kf(ground, 'opacity', [[0, 0, 'hold'], [10, 0, 'out'], [50, 100]]);
  s.kf(base.id, 'y', [[0, base.pos[1] + 150, 'out'], [46, base.pos[1]]]);
  s.kf(base.id, 'opacity', [[0, 0, 'out'], [24, 100]]);
  s.drop(tower, 34, 84, 520);
  const wins = Object.keys(towerParts).filter((k) => /^W\d\d$/.test(k));
  const lit = ['W01', 'W12', 'W20', 'W31', 'W02', 'W42', 'W21'];
  lit.forEach((k, i) => {
    const f = 96 + i * 9;
    s.kf(towerParts[k].solid, 'color', [[0, c(T.v500), 'hold'], [f, c(T.v500), 'out'], [f + 10, c(T.lime)]]);
  });
  void wins;
  s.kf(routeTrim, 'trimEnd', [[0, 0, 'hold'], [92, 0, 'inout'], [268, 100]]);
  people.forEach((g, i) => s.pop(g, 112 + i * 13, 134 + i * 13));
  coins.forEach((g, i) => s.drop(g, 186 + i * 16, 214 + i * 16, 340));
  s.kf(calShadow.id, 'opacity', [[0, 0, 'hold'], [232, 0, 'out'], [270, 100]]);
  s.drop(cal, 228, 274, 300);
  s.kf(checkTrim, 'trimEnd', [[0, 0, 'hold'], [276, 0, 'out'], [300, 100]]);
  s.drop(panel, 252, 300, 460);
  sparks.forEach((id, i) => {
    const f = 300 + i * 10;
    s.scale(id, [[0, 0, 'hold'], [f, 0, 'out'], [f + 22, 100]]);
    s.kf(id, 'r', [[0, -45, 'hold'], [f, -45, 'out'], [f + 30, 0]]);
  });
  await s.flush();
}
fs.mkdirSync(new URL('./out/', import.meta.url), { recursive: true });
await s.capture(new URL('./out/island.png', import.meta.url).pathname, 1536);
console.log('ok', s.id, s.anim);
if (process.argv.includes('--export')) {
  const dir = new URL('./out/', import.meta.url).pathname;
  for (const f of fs.readdirSync(dir)) if (f.endsWith('.riv')) fs.unlinkSync(dir + f);
  console.log(await exportRiv(dir.replace(/\/$/, '')));
}
