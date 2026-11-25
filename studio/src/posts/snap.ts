export type Box = { x: number; y: number; w: number; h: number };
export type Line = { axis: "x" | "y"; at: number; from: number; to: number };
export type Mark = { axis: "w" | "h"; box: Box };
export type Guides = { lines: Line[]; marks: Mark[] };
export type Scene = { others: Box[]; frame: Box };

export const SNAP_PX = 6;

export function measureScene(frameEl: HTMLElement, exclude: string | string[], zoom: number): Scene {
  const skip = new Set(Array.isArray(exclude) ? exclude : [exclude]);
  const f = frameEl.getBoundingClientRect();
  const frame = { x: 0, y: 0, w: frameEl.offsetWidth, h: frameEl.offsetHeight };
  const others: Box[] = [];
  frameEl.querySelectorAll<HTMLElement>(":scope > [data-layer]").forEach((el) => {
    if (skip.has(el.dataset.layer ?? "")) return;
    const r = el.getBoundingClientRect();
    const b = { x: (r.left - f.left) / zoom, y: (r.top - f.top) / zoom, w: r.width / zoom, h: r.height / zoom };
    if (b.w < 1 || b.h < 1) return;
    if (b.x <= 1 && b.y <= 1 && b.w >= frame.w - 2 && b.h >= frame.h - 2) return;
    others.push(b);
  });
  return { others, frame };
}

const xs = (b: Box) => [b.x, b.x + b.w / 2, b.x + b.w];
const ys = (b: Box) => [b.y, b.y + b.h / 2, b.y + b.h];

export function targets(scene: Scene, axis: "x" | "y"): number[] {
  return [...scene.others, scene.frame].flatMap(axis === "x" ? xs : ys);
}

function nearest(points: number[], to: number[], t: number): number | undefined {
  let best: number | undefined;
  for (const p of points)
    for (const q of to) {
      const d = q - p;
      if (Math.abs(d) <= t && (best === undefined || Math.abs(d) < Math.abs(best))) best = d;
    }
  return best;
}

export function snapMove(box: Box, scene: Scene, t: number, lock?: "x" | "y"): { dx: number; dy: number } {
  return {
    dx: lock === "y" ? 0 : (nearest(xs(box), targets(scene, "x"), t) ?? 0),
    dy: lock === "x" ? 0 : (nearest(ys(box), targets(scene, "y"), t) ?? 0),
  };
}

export function snapSize(size: number, edge: (s: number) => number, axis: "x" | "y", scene: Scene, t: number): number {
  let best = size;
  let dist = t;
  for (const tv of targets(scene, axis)) {
    const s = size + (tv - edge(size)) * Math.sign(edge(size + 1) - edge(size));
    if (s > 1 && Math.abs(s - size) < dist) {
      dist = Math.abs(s - size);
      best = s;
    }
  }
  for (const o of scene.others) {
    const s = axis === "x" ? o.w : o.h;
    if (Math.abs(s - size) < dist) {
      dist = Math.abs(s - size);
      best = s;
    }
  }
  return best;
}

export function guidesFor(box: Box, scene: Scene, sizes: boolean, eps = 1): Guides {
  const lines: Line[] = [];
  const add = (axis: "x" | "y", at: number, from: number, to: number) => {
    const prev = lines.find((l) => l.axis === axis && Math.abs(l.at - at) < 0.5);
    if (!prev) return lines.push({ axis, at, from, to });
    prev.from = Math.min(prev.from, from);
    prev.to = Math.max(prev.to, to);
  };
  for (const item of [...scene.others, scene.frame]) {
    for (const p of xs(box))
      for (const q of xs(item))
        if (Math.abs(p - q) <= eps) add("x", q, Math.min(box.y, item.y), Math.max(box.y + box.h, item.y + item.h));
    for (const p of ys(box))
      for (const q of ys(item))
        if (Math.abs(p - q) <= eps) add("y", q, Math.min(box.x, item.x), Math.max(box.x + box.w, item.x + item.w));
  }
  const marks: Mark[] = [];
  if (sizes) {
    const w = scene.others.filter((o) => Math.abs(o.w - box.w) <= eps);
    const h = scene.others.filter((o) => Math.abs(o.h - box.h) <= eps);
    if (w.length) marks.push({ axis: "w", box }, ...w.map((o) => ({ axis: "w" as const, box: o })));
    if (h.length) marks.push({ axis: "h", box }, ...h.map((o) => ({ axis: "h" as const, box: o })));
  }
  return { lines, marks };
}
