import fs from 'node:fs';
import { call } from './lib.mjs';

export const K = { x: 13, y: 14, r: 15, sx: 16, sy: 17, opacity: 18, trimStart: 114, trimEnd: 115, cap: 48, join: 49, color: 37, closed: 32 };
const EASE = {
  out: { interpolationType: 'cubic', cubicParams: { x1: 0.22, y1: 1, x2: 0.36, y2: 1 } },
  inout: { interpolationType: 'cubic', cubicParams: { x1: 0.65, y1: 0, x2: 0.35, y2: 1 } },
  in: { interpolationType: 'cubic', cubicParams: { x1: 0.55, y1: 0, x2: 1, y2: 0.45 } },
  linear: { interpolationType: 'linear' },
  hold: { interpolationType: 'hold' },
};
const CX = 0.866;
const SY = 0.5;

export const c = (hex, a = 'ff') => `#${a}${hex.replace('#', '').toLowerCase()}`;
export const iso = (x, y, z = 0) => [(x - y) * CX, (x + y) * SY - z];
const r2 = (n) => Math.round(n * 100) / 100;

export const poly = (pts, close = true) => {
  const cmds = pts.map(([x, y], i) => ({ commandType: i === 0 ? 'moveTo' : 'lineTo', x: r2(x), y: r2(y) }));
  if (close) cmds.push({ commandType: 'close' });
  return { commands: cmds };
};

export const circlePts = (cx, cy, r, n = 28, ry = r) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * ry];
  });

export const roundRectPts = (x, y, w, h, r, n = 6) => {
  const pts = [];
  const corners = [
    [x + w - r, y + r, -90],
    [x + w - r, y + h - r, 0],
    [x + r, y + h - r, 90],
    [x + r, y + r, 180],
  ];
  for (const [cx, cy, a0] of corners) {
    for (let i = 0; i <= n; i++) {
      const a = ((a0 + (i / n) * 90) * Math.PI) / 180;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  }
  return pts;
};

export function svgPathToPolys(d, steps = 7) {
  const tokens = d.match(/[MLHVCZmlhvcz]|-?\d*\.?\d+(?:e-?\d+)?/g);
  const polys = [];
  let cur = null;
  let x = 0;
  let y = 0;
  let i = 0;
  let cmd = '';
  const num = () => Number(tokens[i++]);
  while (i < tokens.length) {
    if (/[A-Za-z]/.test(tokens[i])) cmd = tokens[i++];
    if (cmd === 'M') {
      x = num();
      y = num();
      cur = [[x, y]];
      polys.push(cur);
      cmd = 'L';
    } else if (cmd === 'L') {
      x = num();
      y = num();
      cur.push([x, y]);
    } else if (cmd === 'H') {
      x = num();
      cur.push([x, y]);
    } else if (cmd === 'V') {
      y = num();
      cur.push([x, y]);
    } else if (cmd === 'C') {
      const x1 = num();
      const y1 = num();
      const x2 = num();
      const y2 = num();
      const x3 = num();
      const y3 = num();
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const m = 1 - t;
        cur.push([
          m * m * m * x + 3 * m * m * t * x1 + 3 * m * t * t * x2 + t * t * t * x3,
          m * m * m * y + 3 * m * m * t * y1 + 3 * m * t * t * y2 + t * t * t * y3,
        ]);
      }
      x = x3;
      y = y3;
    } else if (cmd === 'Z' || cmd === 'z') {
      cmd = '';
    } else {
      throw new Error(`path cmd ${cmd}`);
    }
  }
  return polys;
}

export class Stage {
  constructor(name, width, height, frames, origin) {
    Object.assign(this, { name, width, height, frames, origin, keys: [], n: 0 });
  }

  async init(bg) {
    const a = await call('open_file_editor', { command: 'createArtboard', data: { createArtboard: [{ name: this.name, width: this.width, height: this.height }] } });
    this.id = a.parsed.artboards[0].id;
    await call('open_file_editor', { command: 'focusArtboard', data: { focusArtboard: { artboardId: this.id } } });
    const o = await call('query_objects', { objectIds: [this.id], depth: 2 });
    const fill = o.parsed.objects.find((x) => x.types.includes('Fill'));
    const solid = o.parsed.objects.find((x) => fill.children.includes(x.id));
    await call('set_property_values', { propertyValues: { [solid.id]: { [K.color]: bg } } });
    const anims = await call('animation_editor', { command: 'listLinearAnimations', data: {} });
    this.anim = anims.parsed.linearAnimations[0].id;
    await call('set_property_values', { propertyValues: { [this.anim]: { 56: 60, 57: this.frames, 59: 0, 55: 'Main' } } });
  }

  at(x, y, z = 0) {
    const [sx, sy] = iso(x, y, z);
    return [this.origin[0] + sx, this.origin[1] + sy];
  }

  async group(name, pos, parentId) {
    const g = await call('group_editor', { name, parentId: parentId ?? this.id, x: pos[0], y: pos[1] });
    const id = g.parsed.group.id;
    await call('set_property_values', { propertyValues: { [id]: { [K.x]: r2(pos[0]), [K.y]: r2(pos[1]) } } });
    return { id, pos, shapes: [] };
  }

  fill(g, name, pts, color, extra = {}) {
    g.shapes.push({ name: `${name}_${this.n++}`, key: name, paints: [{ paintType: 'fill', color, ...(extra.feather ? { feather: extra.feather } : {}) }], paths: (Array.isArray(pts[0][0]) ? pts : [pts]).map((p) => poly(p)) });
  }

  stroke(g, name, pts, color, width, close = false) {
    g.shapes.push({ name: `${name}_${this.n++}`, key: name, open: !close, paints: [{ paintType: 'stroke', color, width }], paths: [poly(pts, close)] });
  }

  async commit(g) {
    const shapes = g.shapes.map((s) => ({ parentId: g.id, name: s.name, x: 0, y: 0, paints: s.paints, paths: s.paths }));
    for (let i = 0; i < shapes.length; i += 40) {
      await call('path_editor', { command: 'createShapes', data: { createShapes: { shapes: shapes.slice(i, i + 40) } } });
    }
    const q = await call('query_objects', { objectIds: [g.id], depth: 3 });
    const objs = q.parsed.objects;
    const byId = Object.fromEntries(objs.map((o) => [o.id, o]));
    const out = {};
    const props = {};
    for (const s of g.shapes) {
      const shape = objs.find((o) => o.types.includes('Shape') && o.name === s.name);
      if (!shape) throw new Error(`shape ${s.name} missing`);
      const kids = shape.children.map((id) => byId[id]);
      const paths = kids.filter((k) => k.types.includes('PointsPath'));
      const paints = kids.filter((k) => k.types.includes('Fill') || k.types.includes('Stroke'));
      const solid = paints[0].children.map((id) => byId[id]).find((k) => k && k.types.includes('SolidColor'));
      out[s.key] = { id: shape.id, paint: paints[0].id, solid: solid?.id };
      if (s.open) {
        for (const p of paths) props[p.id] = { [K.closed]: false };
        props[paints[0].id] = { [K.cap]: 1, [K.join]: 1 };
      } else if (paints[0].types.includes('Stroke')) {
        props[paints[0].id] = { [K.join]: 1 };
      }
    }
    if (Object.keys(props).length) await call('set_property_values', { propertyValues: props });
    g.shapes = [];
    g.parts = { ...(g.parts || {}), ...out };
    return out;
  }

  box(g, name, [x, y, z], [w, d, h], [top, left, right]) {
    const o = iso(...g.world);
    const p = (px, py, pz) => {
      const [sx, sy] = iso(px, py, pz);
      return [sx - o[0], sy - o[1]];
    };
    this.fill(g, `${name}L`, [p(x, y + d, z + h), p(x + w, y + d, z + h), p(x + w, y + d, z), p(x, y + d, z)], left);
    this.fill(g, `${name}R`, [p(x + w, y, z + h), p(x + w, y + d, z + h), p(x + w, y + d, z), p(x + w, y, z)], right);
    this.fill(g, `${name}T`, [p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h)], top);
  }

  local(g) {
    const o = iso(...g.world);
    return (px, py, pz = 0) => {
      const [sx, sy] = iso(px, py, pz);
      return [sx - o[0], sy - o[1]];
    };
  }

  async isoGroup(name, world, parentId) {
    const g = await this.group(name, this.at(...world), parentId);
    g.world = world;
    return g;
  }

  async trim(paintId, end = 0) {
    const t = await call('path_editor', { command: 'addTrimPaths', data: { addTrimPaths: { paintIds: [paintId], start: 0, end } } });
    return t.parsed.trimPaths[0].id;
  }

  kf(objectId, prop, points) {
    for (const [frame, value, ease = 'out'] of points) this.keys.push({ objectId, propertyKey: K[prop] ?? prop, frame, value, ...EASE[ease] });
  }

  scale(objectId, points) {
    this.kf(objectId, 'sx', points);
    this.kf(objectId, 'sy', points);
  }

  drop(g, from, to, height = 420) {
    const y = g.pos[1];
    this.kf(g.id, 'y', [[0, y - height, 'hold'], [from, y - height, 'out'], [to, y]]);
    this.kf(g.id, 'opacity', [[0, 0, 'hold'], [from, 0, 'out'], [from + Math.round((to - from) * 0.45), 100]]);
  }

  pop(g, from, to) {
    this.scale(g.id, [[0, 0, 'hold'], [from, 0, 'out'], [to, 100]]);
    this.kf(g.id, 'opacity', [[0, 0, 'hold'], [from, 0, 'out'], [from + 8, 100]]);
  }

  async flush() {
    for (let i = 0; i < this.keys.length; i += 150) {
      await call('animation_editor', { command: 'modifyKeyFrames', data: { animationId: this.anim, add: this.keys.slice(i, i + 150) } });
    }
    this.keys = [];
  }

  async capture(file, longEdge = 1280) {
    const r = await call('capture_artboard', { artboardId: this.id, longEdge });
    const img = r.raw.content.find((x) => x.type === 'image');
    fs.writeFileSync(file, Buffer.from(img.data, 'base64'));
  }
}
