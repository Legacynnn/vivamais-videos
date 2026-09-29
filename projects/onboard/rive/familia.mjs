import { connect } from './lib.mjs';
import { Scene, c } from './scene.mjs';
await connect();
const T = { mist: '#F3EDFF', violet100: '#EBE1FD', violet200: '#D6C3FB', violet500: '#7E3BED', violet600: '#6A24DB', violet700: '#5719B6', lime200: '#E4FF94', lime400: '#C6FF34', ink800: '#282632', ink900: '#17151E', white: '#FFFFFF', canvas: '#FAFAFE', pink100: '#FCE7F3', pink600: '#DB2777', cyan100: '#CFFAFE', cyan600: '#0891B2', blue100: '#DBEAFE', blue600: '#2563EB', shadow: '#350E6F' };
const s = new Scene('Familia', 1080, 420);
await s.init(c(T.canvas));
const C = [540, 560];
const nodes = [
  { key: 'Voce', x: 250, y: 300, d: 196, bg: T.violet100, fg: T.violet600 },
  { key: 'Par', x: 830, y: 300, d: 180, bg: T.lime200, fg: T.ink800 },
  { key: 'Avo', x: 540, y: 172, d: 150, bg: T.cyan100, fg: T.cyan600 },
  { key: 'Filho', x: 240, y: 830, d: 158, bg: T.pink100, fg: T.pink600 },
  { key: 'Empresa', x: 840, y: 830, d: 196, bg: T.blue100, fg: T.blue600, building: true },
];

const blob = await s.prim({ primitive: 'ellipse', name: 'Blob', x: 540, y: 560, width: 880, height: 880, paints: [{ paintType: 'fill', color: c(T.mist) }] });

const links = [];
for (const n of nodes) {
  const l = await s.path({ name: `Link${n.key}`, x: 0, y: 0, paints: [{ paintType: 'stroke', color: c(T.violet200), width: 10 }], paths: [{ commands: [{ commandType: 'moveTo', x: C[0], y: C[1] }, { commandType: 'lineTo', x: n.x, y: n.y }] }] });
  links.push(await s.trim(l.strokes[0]));
}

const card = await s.group('Plano', null, C[0], C[1]);
await s.prim({ primitive: 'rectangle', name: 'PlanoShadow', parentId: card, x: 0, y: 26, width: 340, height: 214, cornerRadius: 48, paints: [{ paintType: 'fill', color: c(T.violet700, '66'), feather: { strength: 56, offsetY: 24 } }] });
await s.prim({ primitive: 'rectangle', name: 'PlanoBody', parentId: card, x: 0, y: 0, width: 340, height: 214, cornerRadius: 48, paints: [{ paintType: 'fill', gradient: { type: 'linear', stops: [{ color: T.violet500, position: 0 }, { color: T.violet700, position: 100 }], startX: -170, startY: -107, endX: 170, endY: 107 } }] });
await s.prim({ primitive: 'ellipse', name: 'PlanoDot', parentId: card, x: -114, y: -60, width: 44, height: 44, paints: [{ paintType: 'fill', color: c(T.lime400) }] });
await s.prim({ primitive: 'rectangle', name: 'PlanoBar', parentId: card, x: -24, y: -60, width: 116, height: 18, cornerRadius: 9, paints: [{ paintType: 'fill', color: c(T.white, 'e6') }] });
const pulse = await s.path({ name: 'Pulse', parentId: card, x: 0, y: 0, paints: [{ paintType: 'stroke', color: c(T.white), width: 10 }], paths: [{ commands: [
  { commandType: 'moveTo', x: -130, y: 38 }, { commandType: 'lineTo', x: -56, y: 38 }, { commandType: 'lineTo', x: -34, y: -4 },
  { commandType: 'lineTo', x: -6, y: 78 }, { commandType: 'lineTo', x: 20, y: 12 }, { commandType: 'lineTo', x: 38, y: 38 }, { commandType: 'lineTo', x: 130, y: 38 }] }] });
const pulseTrim = await s.trim(pulse.strokes[0]);

const avatars = [], badges = [];
for (const n of nodes) {
  const R = n.d / 2;
  const g = await s.group(n.key, null, n.x, n.y);
  await s.prim({ primitive: 'ellipse', name: `${n.key}Shadow`, parentId: g, x: 0, y: 12, width: n.d, height: n.d, paints: [{ paintType: 'fill', color: c(T.shadow, '24'), feather: { strength: 34, offsetY: 12 } }] });
  await s.prim({ primitive: 'ellipse', name: `${n.key}Ring`, parentId: g, x: 0, y: 0, width: n.d + 16, height: n.d + 16, paints: [{ paintType: 'fill', color: c(T.white) }] });
  await s.prim({ primitive: 'ellipse', name: `${n.key}Bg`, parentId: g, x: 0, y: 0, width: n.d, height: n.d, paints: [{ paintType: 'fill', color: c(n.bg) }] });
  if (n.building) {
    await s.prim({ primitive: 'rectangle', name: 'Predio', parentId: g, x: -8, y: 8, width: 0.52 * R, height: 0.9 * R, cornerRadius: 8, paints: [{ paintType: 'fill', color: c(n.fg) }] });
    await s.prim({ primitive: 'rectangle', name: 'Anexo', parentId: g, x: 0.34 * R, y: 0.24 * R, width: 0.3 * R, height: 0.58 * R, cornerRadius: 6, paints: [{ paintType: 'fill', color: c(n.fg, '99') }] });
    for (const [i, [wx, wy]] of [[-0.21, -0.2], [-0.02, -0.2], [-0.21, 0.04], [-0.02, 0.04], [-0.21, 0.28], [-0.02, 0.28]].entries()) {
      await s.prim({ primitive: 'rectangle', name: `Janela${i}`, parentId: g, x: wx * R - 8 + 0.03 * R, y: wy * R + 8, width: 0.12 * R, height: 0.12 * R, cornerRadius: 3, paints: [{ paintType: 'fill', color: c(T.white) }] });
    }
  } else {
    await s.prim({ primitive: 'ellipse', name: `${n.key}Head`, parentId: g, x: 0, y: -0.2 * R, width: 0.6 * R, height: 0.6 * R, paints: [{ paintType: 'fill', color: c(n.fg) }] });
    await s.path({ name: `${n.key}Body`, parentId: g, x: 0, y: 0, paints: [{ paintType: 'fill', color: c(n.fg) }], paths: [{ commands: [
      { commandType: 'moveTo', x: -0.56 * R, y: 0.64 * R },
      { commandType: 'cubicTo', control1X: -0.56 * R, control1Y: 0.26 * R, control2X: -0.32 * R, control2Y: 0.16 * R, endX: 0, endY: 0.16 * R },
      { commandType: 'cubicTo', control1X: 0.32 * R, control1Y: 0.16 * R, control2X: 0.56 * R, control2Y: 0.26 * R, endX: 0.56 * R, endY: 0.64 * R },
      { commandType: 'close' }] }] });
  }
  const b = await s.group(`${n.key}Badge`, g, 0.72 * R, -0.72 * R);
  await s.prim({ primitive: 'ellipse', name: `${n.key}BadgeRing`, parentId: b, x: 0, y: 0, width: 58, height: 58, paints: [{ paintType: 'fill', color: c(T.white) }] });
  await s.prim({ primitive: 'ellipse', name: `${n.key}BadgeDot`, parentId: b, x: 0, y: 0, width: 46, height: 46, paints: [{ paintType: 'fill', color: c(T.lime400) }] });
  await s.prim({ primitive: 'rectangle', name: `${n.key}PlusH`, parentId: b, x: 0, y: 0, width: 22, height: 6, cornerRadius: 3, paints: [{ paintType: 'fill', color: c(T.ink900) }] });
  await s.prim({ primitive: 'rectangle', name: `${n.key}PlusV`, parentId: b, x: 0, y: 0, width: 6, height: 22, cornerRadius: 3, paints: [{ paintType: 'fill', color: c(T.ink900) }] });
  avatars.push(g); badges.push(b);
}

const EXIT = 372;
s.kf(blob.id, 'opacity', [[0, 0], [34, 100, 'hold'], [EXIT + 6, 100, 'in'], [414, 0]]);
s.scale(blob.id, [[0, 86], [44, 100, 'hold'], [EXIT + 6, 100, 'in'], [414, 86]]);
s.scale(card, [[0, 60, 'hold'], [14, 60, 'out'], [44, 106, 'inout'], [58, 100, 'hold'], [EXIT, 100, 'in'], [404, 90]]);
s.kf(card, 'opacity', [[0, 0, 'hold'], [14, 0], [34, 100, 'hold'], [EXIT, 100, 'in'], [404, 0]]);
s.kf(pulseTrim, 'trimEnd', [[0, 0, 'hold'], [48, 0, 'inout'], [100, 100]]);
s.kf(pulseTrim, 'trimStart', [[0, 0, 'hold'], [300, 0, 'inout'], [352, 100, 'hold'], [353, 0]]);
s.kf(pulseTrim, 'trimEnd', [[352, 100, 'hold'], [353, 0, 'inout'], [405, 100]]);
links.forEach((id, i) => {
  const f = 78 + i * 16;
  s.kf(id, 'trimEnd', [[0, 0, 'hold'], [f, 0], [f + 34, 100, 'hold'], [EXIT, 100, 'in'], [398, 0]]);
});
avatars.forEach((id, i) => {
  const f = 100 + i * 16;
  s.scale(id, [[0, 0, 'hold'], [f, 0, 'out'], [f + 18, 112, 'inout'], [f + 30, 100, 'hold'], [EXIT + i * 4, 100, 'in'], [EXIT + i * 4 + 26, 0]]);
});
badges.forEach((id, i) => {
  const f = 170 + i * 14;
  s.scale(id, [[0, 0, 'hold'], [f, 0, 'out'], [f + 14, 126, 'inout'], [f + 24, 100]]);
  s.kf(id, 'r', [[0, -90, 'hold'], [f, -90], [f + 24, 0]]);
});
await s.flush();
console.log('ok', s.id);
