import { connect } from './lib.mjs';
import { Scene, c } from './scene.mjs';
await connect();
const T = { violet100: '#EBE1FD', violet300: '#BC9CF7', violet500: '#7E3BED', violet600: '#6A24DB', mist: '#F3EDFF', lime400: '#C6FF34', ink100: '#F2F1F6', ink200: '#E6E4EC', ink300: '#D2CFDB', ink800: '#282632', white: '#FFFFFF', canvas: '#FAFAFE', successSoft: '#DCFCE7', successStrong: '#15803D', blueSoft: '#DBEAFE', blue: '#2563EB', shadow: '#350E6F' };
const s = new Scene('Docs', 1080, 420);
await s.init(c(T.canvas));

const blob = await s.prim({ primitive: 'ellipse', name: 'Blob', x: 540, y: 560, width: 860, height: 860, paints: [{ paintType: 'fill', color: c(T.mist) }] });

const doc = await s.group('Doc', null, 540, 570);
await s.prim({ primitive: 'rectangle', name: 'DocShadow', parentId: doc, x: 0, y: 24, width: 500, height: 640, cornerRadius: 40, paints: [{ paintType: 'fill', color: c(T.shadow, '2e'), feather: { strength: 60, offsetY: 24 } }] });
await s.prim({ primitive: 'rectangle', name: 'Paper', parentId: doc, x: 0, y: 0, width: 500, height: 640, cornerRadius: 40, paints: [{ paintType: 'fill', color: c(T.white) }] });
await s.prim({ primitive: 'rectangle', name: 'Badge', parentId: doc, x: -158, y: -218, width: 88, height: 88, cornerRadius: 26, paints: [{ paintType: 'fill', color: c(T.violet500) }] });
await s.prim({ primitive: 'rectangle', name: 'CrossH', parentId: doc, x: -158, y: -218, width: 40, height: 12, cornerRadius: 6, paints: [{ paintType: 'fill', color: c(T.white) }] });
await s.prim({ primitive: 'rectangle', name: 'CrossV', parentId: doc, x: -158, y: -218, width: 12, height: 40, cornerRadius: 6, paints: [{ paintType: 'fill', color: c(T.white) }] });
await s.prim({ primitive: 'rectangle', name: 'Title', parentId: doc, x: 0, y: -236, width: 200, height: 24, cornerRadius: 12, paints: [{ paintType: 'fill', color: c(T.ink800) }] });
await s.prim({ primitive: 'rectangle', name: 'Sub', parentId: doc, x: -30, y: -198, width: 140, height: 16, cornerRadius: 8, paints: [{ paintType: 'fill', color: c(T.ink300) }] });
await s.path({ name: 'Divider', parentId: doc, x: 0, y: 0, paints: [{ paintType: 'stroke', color: c(T.ink100), width: 4 }], paths: [{ commands: [{ commandType: 'moveTo', x: -200, y: -140 }, { commandType: 'lineTo', x: 200, y: -140 }] }] });

const lineEnds = [190, 150, 200, 110];
for (let i = 0; i < lineEnds.length; i++) {
  const y = -84 + i * 52;
  const l = await s.path({ name: `Line${i}`, parentId: doc, x: 0, y: 0, paints: [{ paintType: 'stroke', color: c(T.ink200), width: 18 }], paths: [{ commands: [{ commandType: 'moveTo', x: -200, y }, { commandType: 'lineTo', x: lineEnds[i], y }] }] });
  const tr = await s.trim(l.strokes[0]);
  const f = 60 + i * 14;
  s.kf(tr, 'trimEnd', [[0, 0, 'hold'], [f, 0], [f + 32, 100]]);
}

await s.path({ name: 'SignLine', parentId: doc, x: 0, y: 0, paints: [{ paintType: 'stroke', color: c(T.ink300), width: 4 }], paths: [{ commands: [{ commandType: 'moveTo', x: -205, y: 246 }, { commandType: 'lineTo', x: 60, y: 246 }] }] });
const sign = await s.path({ name: 'Signature', parentId: doc, x: 0, y: 0, paints: [{ paintType: 'stroke', color: c(T.violet600), width: 9 }], paths: [{ commands: [
  { commandType: 'moveTo', x: -200, y: 214 },
  { commandType: 'cubicTo', control1X: -186, control1Y: 150, control2X: -150, control2Y: 146, control2Y2: 0, endX: -152, endY: 200 },
  { commandType: 'cubicTo', control1X: -154, control1Y: 246, control2X: -122, control2Y: 238, endX: -104, endY: 190 },
  { commandType: 'cubicTo', control1X: -90, control1Y: 158, control2X: -72, control2Y: 166, endX: -64, endY: 206 },
  { commandType: 'cubicTo', control1X: -54, control1Y: 238, control2X: -24, control2Y: 228, endX: -6, endY: 178 },
  { commandType: 'cubicTo', control1X: 6, control1Y: 150, control2X: 30, control2Y: 196, endX: 64, endY: 190 },
] }] });
const signTrim = await s.trim(sign.strokes[0]);
s.kf(signTrim, 'trimEnd', [[0, 0, 'hold'], [128, 0, 'inout'], [186, 100]]);

const seal = await s.group('Seal', doc, 150, 190);
await s.prim({ primitive: 'rectangle', name: 'SealShadow', parentId: seal, x: 0, y: 12, width: 160, height: 160, cornerRadius: 80, paints: [{ paintType: 'fill', color: c(T.shadow, '30'), feather: { strength: 30, offsetY: 10 } }] });
await s.prim({ primitive: 'star', name: 'SealStar', parentId: seal, x: 0, y: 0, width: 184, height: 184, points: 16, innerRadius: 86, cornerRadius: 4, paints: [{ paintType: 'fill', color: c(T.lime400) }] });
await s.prim({ primitive: 'ellipse', name: 'SealCore', parentId: seal, x: 0, y: 0, width: 124, height: 124, paints: [{ paintType: 'fill', color: c(T.violet600) }] });
const check = await s.path({ name: 'SealCheck', parentId: seal, x: 0, y: 0, paints: [{ paintType: 'stroke', color: c(T.white), width: 13 }], paths: [{ commands: [{ commandType: 'moveTo', x: -26, y: 2 }, { commandType: 'lineTo', x: -7, y: 22 }, { commandType: 'lineTo', x: 28, y: -18 }] }] });
const checkTrim = await s.trim(check.strokes[0]);
s.scale(seal, [[0, 0, 'hold'], [184, 0, 'out'], [206, 118, 'inout'], [216, 94, 'inout'], [226, 100]]);
s.kf(seal, 'r', [[0, -40, 'hold'], [184, -40], [218, 0]]);
s.kf(checkTrim, 'trimEnd', [[0, 0, 'hold'], [204, 0, 'out'], [232, 100]]);

async function card(name, x, y, iconBg, icon) {
  const g = await s.group(name, null, x, y);
  await s.prim({ primitive: 'rectangle', name: `${name}Shadow`, parentId: g, x: 0, y: 14, width: 290, height: 128, cornerRadius: 34, paints: [{ paintType: 'fill', color: c(T.shadow, '26'), feather: { strength: 40, offsetY: 14 } }] });
  await s.prim({ primitive: 'rectangle', name: `${name}Body`, parentId: g, x: 0, y: 0, width: 290, height: 128, cornerRadius: 34, paints: [{ paintType: 'fill', color: c(T.white) }] });
  await s.prim({ primitive: 'ellipse', name: `${name}IconBg`, parentId: g, x: -84, y: 0, width: 78, height: 78, paints: [{ paintType: 'fill', color: c(iconBg) }] });
  await icon(g);
  await s.prim({ primitive: 'rectangle', name: `${name}Bar1`, parentId: g, x: 36, y: -17, width: 126, height: 20, cornerRadius: 10, paints: [{ paintType: 'fill', color: c(T.ink800) }] });
  await s.prim({ primitive: 'rectangle', name: `${name}Bar2`, parentId: g, x: 17, y: 17, width: 88, height: 15, cornerRadius: 7.5, paints: [{ paintType: 'fill', color: c(T.ink300) }] });
  return g;
}
const farm = await card('Farmacia', 836, 318, T.successSoft, async (g) => {
  await s.path({ name: 'FarmCheck', parentId: g, x: -84, y: 0, paints: [{ paintType: 'stroke', color: c(T.successStrong), width: 9 }], paths: [{ commands: [{ commandType: 'moveTo', x: -15, y: 1 }, { commandType: 'lineTo', x: -4, y: 12 }, { commandType: 'lineTo', x: 17, y: -11 }] }] });
});
const emp = await card('Empresa', 244, 860, T.blueSoft, async (g) => {
  await s.prim({ primitive: 'rectangle', name: 'Building', parentId: g, x: -84, y: 3, width: 34, height: 42, cornerRadius: 5, paints: [{ paintType: 'fill', color: c(T.blue) }] });
  for (const [wx, wy] of [[-91, -8], [-77, -8], [-91, 5], [-77, 5]]) await s.prim({ primitive: 'rectangle', name: `Win${wx}${wy}`, parentId: g, x: wx, y: wy, width: 7, height: 7, cornerRadius: 1.5, paints: [{ paintType: 'fill', color: c(T.white) }] });
  await s.prim({ primitive: 'rectangle', name: 'Door', parentId: g, x: -84, y: 18, width: 8, height: 12, cornerRadius: 2, paints: [{ paintType: 'fill', color: c(T.white) }] });
});

const sparks = [];
for (const [i, [x, y, size, color]] of [[196, 300, 44, T.lime400], [930, 610, 36, T.violet300], [770, 900, 40, T.lime400], [330, 176, 30, T.violet300]].entries()) {
  const sp = await s.prim({ primitive: 'star', name: `Spark${i}`, x, y, width: size, height: size, points: 4, innerRadius: 34, paints: [{ paintType: 'fill', color: c(color) }] });
  sparks.push(sp.id);
}

s.kf(blob.id, 'opacity', [[0, 0], [34, 100, 'hold'], [378, 100, 'in'], [414, 0]]);
s.scale(blob.id, [[0, 86], [44, 100, 'hold'], [378, 100, 'in'], [414, 86]]);
s.kf(doc, 'y', [[0, 660, 'hold'], [8, 660], [52, 570, 'hold'], [372, 570, 'in'], [406, 520]]);
s.kf(doc, 'opacity', [[0, 0, 'hold'], [8, 0], [36, 100, 'hold'], [376, 100, 'in'], [404, 0]]);
s.kf(doc, 'r', [[0, 7, 'hold'], [8, 7], [58, -2.5]]);
for (const [g, x0, x1, f0, fe] of [[farm, 910, 836, 246, 362], [emp, 170, 244, 272, 368]]) {
  s.kf(g, 'x', [[0, x0, 'hold'], [f0, x0], [f0 + 34, x1]]);
  s.kf(g, 'opacity', [[0, 0, 'hold'], [f0, 0], [f0 + 22, 100, 'hold'], [fe, 100, 'in'], [fe + 30, 0]]);
}
sparks.forEach((id, i) => {
  const f = 226 + i * 12;
  s.scale(id, [[0, 0, 'hold'], [f, 0, 'out'], [f + 16, 124, 'inout'], [f + 28, 100, 'hold'], [376, 100, 'in'], [402, 0]]);
  s.kf(id, 'r', [[0, 0, 'hold'], [f, 0, 'linear'], [420, 60]]);
});
await s.flush();
await s.capture('/tmp/vv/rive-docs.png');
console.log('ok', s.id, s.anim);
