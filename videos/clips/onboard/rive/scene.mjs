import fs from 'node:fs';
import { call } from './lib.mjs';

const EASE = {
  out: { interpolationType: 'cubic', cubicParams: { x1: 0.22, y1: 1, x2: 0.36, y2: 1 } },
  inout: { interpolationType: 'cubic', cubicParams: { x1: 0.65, y1: 0, x2: 0.35, y2: 1 } },
  in: { interpolationType: 'cubic', cubicParams: { x1: 0.55, y1: 0, x2: 1, y2: 0.45 } },
  linear: { interpolationType: 'linear' },
  hold: { interpolationType: 'hold' },
};
export const P = { x: 13, y: 14, r: 15, sx: 16, sy: 17, opacity: 18, trimStart: 114, trimEnd: 115, cap: 48, join: 49, color: 37 };
export const c = (hex, a = 'ff') => `#${a}${hex.replace('#', '').toLowerCase()}`;

export class Scene {
  constructor(name, size, frames) {
    this.name = name; this.size = size; this.frames = frames; this.keys = [];
  }
  async init(bg) {
    const a = await call('open_file_editor', { command: 'createArtboard', data: { createArtboard: [{ name: this.name, width: this.size, height: this.size }] } });
    this.id = a.parsed.artboards[0].id;
    await call('open_file_editor', { command: 'focusArtboard', data: { focusArtboard: { artboardId: this.id } } });
    const o = await call('query_objects', { objectIds: [this.id], depth: 2 });
    const fill = o.parsed.objects.find((x) => x.types.includes('Fill') && x.name === 'Fill 1');
    const solid = o.parsed.objects.find((x) => fill.children.includes(x.id));
    await call('set_property_values', { propertyValues: { [solid.id]: { [P.color]: bg } } });
    const anims = await call('animation_editor', { command: 'listLinearAnimations', data: {} });
    this.anim = anims.parsed.linearAnimations[0].id;
    await call('set_property_values', { propertyValues: { [this.anim]: { 56: 60, 57: this.frames, 59: 1, 55: 'Main' } } });
  }
  async group(name, parentId, x, y) {
    const g = await call('group_editor', { name, parentId: parentId ?? this.id, x, y });
    await call('set_property_values', { propertyValues: { [g.parsed.group.id]: { [P.x]: x, [P.y]: y } } });
    return g.parsed.group.id;
  }
  async prim(spec) {
    const r = await call('path_editor', { command: 'createParametricShapes', data: { createParametricShapes: { shapes: [{ parentId: this.id, ...spec }] } } });
    return this.paintsOf(r.parsed.shapes[0].id);
  }
  async path(spec) {
    const name = `${this.name}_${spec.name}`;
    await call('path_editor', { command: 'createShapes', data: { createShapes: { shapes: [{ parentId: this.id, ...spec, name }] } } });
    const f = await call('find_objects', { artboardId: this.id, name, type: 'shape' });
    const hit = f.parsed.objects.filter((x) => x.name === name);
    if (hit.length !== 1) throw new Error(`path lookup ${name}: ${hit.length}`);
    const shape = await this.paintsOf(hit[0].id);
    if (!shape.fills.length) for (const p of this.lastPaths) await call('set_property_values', { propertyValues: { [p]: { 32: false } } });
    for (const s of shape.strokes) await call('set_property_values', { propertyValues: { [s]: { [P.cap]: 1, [P.join]: 1 } } });
    return shape;
  }
  async paintsOf(id) {
    const o = await call('query_objects', { objectIds: [id], depth: 1 });
    const kids = o.parsed.objects;
    this.lastPaths = kids.filter((k) => k.types.includes('PointsPath')).map((k) => k.id);
    return { id, fills: kids.filter((k) => k.types.includes('Fill')).map((k) => k.id), strokes: kids.filter((k) => k.types.includes('Stroke')).map((k) => k.id) };
  }
  async trim(strokeId, end = 0) {
    const t = await call('path_editor', { command: 'addTrimPaths', data: { addTrimPaths: { paintIds: [strokeId], start: 0, end } } });
    return t.parsed.trimPaths[0].id;
  }
  kf(objectId, prop, points) {
    for (const [frame, value, ease = 'out'] of points) this.keys.push({ objectId, propertyKey: P[prop] ?? prop, frame, value, ...EASE[ease] });
  }
  scale(objectId, points) { this.kf(objectId, 'sx', points); this.kf(objectId, 'sy', points); }
  async flush() {
    for (let i = 0; i < this.keys.length; i += 150) {
      await call('animation_editor', { command: 'modifyKeyFrames', data: { animationId: this.anim, add: this.keys.slice(i, i + 150) } });
    }
    this.keys = [];
  }
  async capture(file, longEdge = 768) {
    const r = await call('capture_artboard', { artboardId: this.id, longEdge });
    const img = r.raw.content.find((x) => x.type === 'image');
    fs.writeFileSync(file, Buffer.from(img.data, 'base64'));
  }
}
