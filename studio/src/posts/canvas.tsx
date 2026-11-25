import * as React from "react";
import { ZoomContext } from "@/shell/workspace";
import type { Format } from "./formats";
import type { Frame, Layer, Override, PostDoc } from "./model";
import { FrameView, LayerView, place, type EditHandler, type Placement } from "./render";
import { SNAP_PX, guidesFor, measureScene, snapMove, snapSize, type Box, type Guides, type Scene } from "./snap";

export const FRAME_GAP = 80;

export type Selection = { frame: string; layer?: string; extra?: string[] };

export const selectedIds = (sel: Selection | null): string[] => (sel?.layer ? [sel.layer, ...(sel.extra ?? [])] : []);

export function toggleSelection(sel: Selection | null, frame: string, id: string): Selection {
  if (!sel || sel.frame !== frame || !sel.layer) return { frame, layer: id };
  const ids = selectedIds(sel);
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  return next.length ? { frame, layer: next[0], extra: next.length > 1 ? next.slice(1) : undefined } : { frame };
}

function Guides({ format, width }: { format: Format; width: number }) {
  const zoom = React.useContext(ZoomContext);
  const line = `${1.5 / zoom}px dashed rgb(18 255 215 / 0.8)`;
  const slices = format.slices ? Math.max(1, Math.round(width / 1080)) : 1;
  return (
    <div className="pointer-events-none absolute inset-0">
      {format.safe ? (
        <div
          className="absolute"
          style={{ top: format.safe.top, right: format.safe.right, bottom: format.safe.bottom, left: format.safe.left, outline: line }}
        />
      ) : null}
      {format.circle ? (
        <div
          className="absolute top-1/2 left-1/2 rounded-full"
          style={{ width: format.circle, height: format.circle, transform: "translate(-50%, -50%)", outline: line }}
        />
      ) : null}
      {Array.from({ length: slices - 1 }, (_, i) => (
        <div key={i} className="absolute top-0 bottom-0" style={{ left: ((i + 1) * width) / slices, borderLeft: line }} />
      ))}
    </div>
  );
}

type Drag = { frame: string; layer: string; sx: number; sy: number; items: { id: string; x: number; y: number }[]; box: Box; scene?: Scene; moved: boolean; copy: boolean };

function SnapGuides({ guides, zoom }: { guides: Guides; zoom: number }) {
  const color = "#FF3D7F";
  const px = 1 / zoom;
  const gap = 10 / zoom;
  return (
    <div className="pointer-events-none absolute inset-0">
      {guides.lines.map((l, i) => (
        <div
          key={i}
          className="absolute"
          style={
            l.axis === "x"
              ? { left: l.at - px / 2, top: l.from, width: px, height: l.to - l.from, background: color }
              : { top: l.at - px / 2, left: l.from, height: px, width: l.to - l.from, background: color }
          }
        />
      ))}
      {guides.marks.map((m, i) => {
        const value = Math.round(m.axis === "w" ? m.box.w : m.box.h);
        const bar =
          m.axis === "w"
            ? { left: m.box.x, top: m.box.y + m.box.h + gap, width: m.box.w, height: px }
            : { left: m.box.x + m.box.w + gap, top: m.box.y, width: px, height: m.box.h };
        return (
          <div key={`m${i}`} className="absolute" style={{ ...bar, background: color }}>
            <span
              className="absolute rounded-[3px] px-1 font-mono whitespace-nowrap text-white"
              style={{
                background: color,
                fontSize: 11 / zoom,
                lineHeight: `${16 / zoom}px`,
                ...(m.axis === "w" ? { left: "50%", top: 4 / zoom, translate: "-50% 0" } : { top: "50%", left: 4 / zoom, translate: "0 -50%" }),
              }}
            >
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function PostCanvas({
  doc,
  format,
  size,
  selection,
  guides,
  onSelect,
  onMove,
  onMoveStart,
  onDuplicate,
  onEdit,
  onTransform,
}: {
  doc: PostDoc;
  format: Format;
  size: { width: number; height: number };
  selection: Selection | null;
  guides: boolean;
  onSelect: (selection: Selection | null) => void;
  onMove: (frame: string, moves: { id: string; x: number; y: number }[]) => void;
  onMoveStart: () => void;
  onDuplicate: (frame: string, layer: string) => string | undefined;
  onEdit: (frame: string, layer: string, patch: Partial<Layer>) => void;
  onTransform: (frame: string, layer: string, patch: Partial<Layer> & Partial<Placement>) => void;
}) {
  const zoom = React.useContext(ZoomContext);
  const [editing, setEditing] = React.useState<string | null>(null);
  const drag = React.useRef<Drag | null>(null);
  const [snap, setSnap] = React.useState<{ frame: string; guides: Guides } | null>(null);
  const [marquee, setMarquee] = React.useState<{ frame: string; box: Box } | null>(null);

  function beginMarquee(event: React.PointerEvent, frame: Frame, onClick: () => void) {
    const frameEl = (event.currentTarget as HTMLElement).closest<HTMLElement>("[data-frame-view]") ?? (event.currentTarget as HTMLElement).querySelector<HTMLElement>("[data-frame-view]");
    if (!frameEl) return onClick();
    const sx = event.clientX;
    const sy = event.clientY;
    const additive = event.shiftKey;
    const base = additive && selection?.frame === frame.id ? selectedIds(selection) : [];
    let moved = false;
    const rectOf = (x: number, y: number) => {
      const f = frameEl.getBoundingClientRect();
      return { x: (Math.min(sx, x) - f.left) / zoom, y: (Math.min(sy, y) - f.top) / zoom, w: Math.abs(x - sx) / zoom, h: Math.abs(y - sy) / zoom };
    };
    const hits = (box: Box) => {
      const f = frameEl.getBoundingClientRect();
      return frame.layers
        .filter((l) => !l.fill && !l.locked && !l.hidden && l.type !== "screen")
        .filter((l) => {
          const r = frameEl.querySelector(`:scope > [data-layer="${l.id}"]`)?.getBoundingClientRect();
          if (!r) return false;
          const b = { x: (r.left - f.left) / zoom, y: (r.top - f.top) / zoom, w: r.width / zoom, h: r.height / zoom };
          return b.x < box.x + box.w && b.x + b.w > box.x && b.y < box.y + box.h && b.y + b.h > box.y;
        })
        .map((l) => l.id);
    };
    const move = (e: PointerEvent) => {
      if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) < 3) return;
      moved = true;
      setMarquee({ frame: frame.id, box: rectOf(e.clientX, e.clientY) });
    };
    const up = (e: PointerEvent) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setMarquee(null);
      if (!moved) return onClick();
      const ids = [...new Set([...base, ...hits(rectOf(e.clientX, e.clientY))])];
      onSelect(ids.length ? { frame: frame.id, layer: ids[0], extra: ids.length > 1 ? ids.slice(1) : undefined } : { frame: frame.id });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }
  const overrides = doc.format === format.id ? undefined : doc.overrides?.[format.id];

  function startDrag(event: React.PointerEvent, frame: Frame, layer: Layer) {
    if (event.button !== 0) return;
    event.stopPropagation();
    if (editing && editing !== layer.id) setEditing(null);
    if (event.shiftKey && selection?.frame === frame.id && selection.layer) {
      onSelect(toggleSelection(selection, frame.id, layer.id));
      return;
    }
    if (layer.locked || layer.fill) {
      beginMarquee(event, frame, () => onSelect({ frame: frame.id, layer: layer.id }));
      return;
    }
    const current = selection?.frame === frame.id ? selectedIds(selection) : [];
    const group = current.length > 1 && current.includes(layer.id);
    if (!group) onSelect({ frame: frame.id, layer: layer.id });
    const movable = (group ? current : [layer.id])
      .map((id) => frame.layers.find((l) => l.id === id))
      .filter((l): l is Layer => !!l && !l.locked && !l.fill && l.type !== "screen");
    if (!movable.length) return;
    const el = event.currentTarget as HTMLElement;
    const frameEl = el.closest<HTMLElement>("[data-frame-view]");
    if (!frameEl) return;
    el.setPointerCapture(event.pointerId);
    const f = frameEl.getBoundingClientRect();
    const rects = movable.map((l) => frameEl.querySelector(`:scope > [data-layer="${l.id}"]`)?.getBoundingClientRect()).filter((r): r is DOMRect => !!r);
    const x0 = Math.min(...rects.map((r) => r.left));
    const y0 = Math.min(...rects.map((r) => r.top));
    const box = {
      x: (x0 - f.left) / zoom,
      y: (y0 - f.top) / zoom,
      w: (Math.max(...rects.map((r) => r.right)) - x0) / zoom,
      h: (Math.max(...rects.map((r) => r.bottom)) - y0) / zoom,
    };
    drag.current = {
      frame: frame.id,
      layer: layer.id,
      sx: event.clientX,
      sy: event.clientY,
      items: movable.map((l) => {
        const p = place(l, size, doc.base, (overrides as Record<string, Override> | undefined)?.[l.id]);
        return { id: l.id, x: p.x, y: p.y };
      }),
      box,
      scene: measureScene(frameEl, movable.map((l) => l.id), zoom),
      moved: false,
      copy: !group && (event.altKey || event.metaKey),
    };
  }

  function endDrag() {
    drag.current = null;
    setSnap(null);
  }

  function moveDrag(event: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const dx = (event.clientX - d.sx) / zoom;
    const dy = (event.clientY - d.sy) / zoom;
    if (!d.moved && Math.hypot(dx, dy) < 3) return;
    if (!d.moved) {
      d.moved = true;
      onMoveStart();
      if (d.copy) {
        const id = onDuplicate(d.frame, d.layer);
        if (id) {
          d.layer = id;
          d.items = [{ ...d.items[0], id }];
          onSelect({ frame: d.frame, layer: id });
        }
      }
    }
    const lock = event.shiftKey ? (Math.abs(dx) > Math.abs(dy) ? "x" : "y") : undefined;
    let mx = lock === "y" ? 0 : dx;
    let my = lock === "x" ? 0 : dy;
    if (d.scene && !event.ctrlKey) {
      const s = snapMove({ ...d.box, x: d.box.x + mx, y: d.box.y + my }, d.scene, SNAP_PX / zoom, lock);
      mx += s.dx;
      my += s.dy;
      setSnap({ frame: d.frame, guides: guidesFor({ ...d.box, x: d.box.x + mx, y: d.box.y + my }, d.scene, false) });
    } else setSnap(null);
    onMove(d.frame, d.items.map((i) => ({ id: i.id, x: Math.round(i.x + mx), y: Math.round(i.y + my) })));
  }

  const outline = `${2 / zoom}px solid #9D6BF2`;

  function transformTarget(frame: Frame, layerId: string): TransformTarget | undefined {
    const layer = frame.layers.find((l) => l.id === layerId);
    if (!layer || layer.locked || layer.fill || layer.type === "screen" || editing === layer.id) return;
    const placement = place(layer, size, doc.base, (overrides as Record<string, Override> | undefined)?.[layer.id]);
    return {
      layer,
      placement,
      onStart: onMoveStart,
      onPatch: (patch) => onTransform(frame.id, layer.id, patch),
      onGuides: (guides) => setSnap(guides ? { frame: frame.id, guides } : null),
    };
  }
  const editHandler =
    (frame: Frame): EditHandler =>
    (layerId, field, value) =>
      onEdit(frame.id, layerId, field === "text" ? { text: value, runs: undefined } : { [field]: value });

  return (
    <div className="flex items-start" style={{ gap: FRAME_GAP }}>
      {doc.frames.map((frame) => {
        const frameSelected = selection?.frame === frame.id;
        return (
          <div key={frame.id} className="relative shrink-0">
            <div
              className="absolute bottom-full left-0 flex cursor-pointer justify-between pb-2 font-mono text-[12px] whitespace-nowrap tabular-nums hover:!text-[color:var(--foreground)]"
              onPointerDown={(event) => {
                if (event.button !== 0) return;
                event.stopPropagation();
                setEditing(null);
                onSelect({ frame: frame.id });
              }}
              style={{
                transform: `scale(${1 / zoom})`,
                transformOrigin: "bottom left",
                width: size.width * zoom,
                color: frameSelected ? "var(--accent)" : "color-mix(in oklab, var(--foreground) 55%, transparent)",
              }}
            >
              <span className="truncate">{frame.name}</span>
              {size.width * zoom > 220 ? (
                <span className="pl-3">
                  {size.width} × {size.height}
                </span>
              ) : null}
            </div>
            <div
              className="relative select-none shadow-[0_0_0_1px_color-mix(in_oklab,var(--foreground)_8%,transparent),0_24px_80px_-24px_rgb(0_0_0/0.6)]"
              style={{ outline: frameSelected && !selection?.layer ? outline : undefined }}
              onPointerDown={(event) => {
                if (event.button !== 0) return;
                event.stopPropagation();
                setEditing(null);
                beginMarquee(event, frame, () => onSelect({ frame: frame.id }));
              }}
            >
              <FrameView
                frame={frame}
                width={size.width}
                height={size.height}
                base={doc.base}
                overrides={overrides as Record<string, Override> | undefined}
                renderLayer={(layer, placement) => (
                  <LayerView
                    key={layer.id}
                    layer={layer}
                    placement={placement}
                    editing={editing === layer.id}
                    onEdit={editHandler(frame)}
                    className={editing === layer.id || layer.locked || layer.fill ? undefined : "cursor-move"}
                    onDoubleClick={(event) => {
                      if (layer.type !== "text" && layer.type !== "chip" && layer.type !== "group") return;
                      event.stopPropagation();
                      onSelect({ frame: frame.id, layer: layer.id });
                      setEditing(layer.id);
                    }}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setEditing(null);
                    }}
                    onPointerDown={(event) => startDrag(event, frame, layer)}
                    onPointerMove={moveDrag}
                    onPointerUp={endDrag}
                    onLostPointerCapture={endDrag}
                  />
                )}
              />
              {frameSelected
                ? selectedIds(selection).map((id, _, all) => (
                    <SelectionBox key={id} layerId={id} outline={outline} zoom={zoom} target={all.length === 1 ? transformTarget(frame, id) : undefined} />
                  ))
                : null}
              {guides ? <Guides format={format} width={size.width} /> : null}
              {snap?.frame === frame.id ? <SnapGuides guides={snap.guides} zoom={zoom} /> : null}
              {marquee?.frame === frame.id ? (
                <div
                  className="pointer-events-none absolute"
                  style={{
                    left: marquee.box.x,
                    top: marquee.box.y,
                    width: marquee.box.w,
                    height: marquee.box.h,
                    outline: `${1 / zoom}px solid #9D6BF2`,
                    background: "rgb(157 107 242 / 0.12)",
                  }}
                />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

type Handle = { hx: number; hy: number; cursor: string };

const HANDLES: Handle[] = [
  { hx: 0, hy: 0, cursor: "nwse-resize" },
  { hx: 1, hy: 0, cursor: "nesw-resize" },
  { hx: 1, hy: 1, cursor: "nwse-resize" },
  { hx: 0, hy: 1, cursor: "nesw-resize" },
  { hx: 0.5, hy: 0, cursor: "ns-resize" },
  { hx: 1, hy: 0.5, cursor: "ew-resize" },
  { hx: 0.5, hy: 1, cursor: "ns-resize" },
  { hx: 0, hy: 0.5, cursor: "ew-resize" },
];

const rad = (deg: number) => (deg * Math.PI) / 180;

function rotateVec([x, y]: [number, number], deg: number): [number, number] {
  const c = Math.cos(rad(deg));
  const s = Math.sin(rad(deg));
  return [x * c - y * s, x * s + y * c];
}

function sidesAllowed(layer: Layer): "both" | "x" | "none" {
  if (layer.type === "image" || layer.type === "rect" || layer.type === "svg" || layer.type === "group") return "both";
  if (layer.type === "text" || layer.type === "chip") return "x";
  return "none";
}

function scalePatch(layer: Layer, placement: Placement, k: number): Partial<Layer> & Partial<Placement> {
  const r = (n: number) => Math.round(n * 100) / 100;
  switch (layer.type) {
    case "text":
      return { size: Math.max(6, r(layer.size * k)), w: placement.w ? Math.round(placement.w * k) : undefined, leading: layer.leading ? r(layer.leading * k) : undefined };
    case "image":
    case "rect":
    case "svg":
      return { w: Math.round((placement.w ?? 0) * k), h: Math.round((placement.h ?? 0) * k) };
    case "phone":
      return { w: Math.round((placement.w ?? 414) * k) };
    case "logo":
      return { h: Math.round((placement.h ?? 40) * k) };
    default:
      return { scale: r((layer.scale ?? 1) * k) };
  }
}

export type TransformTarget = {
  layer: Layer;
  placement: Placement;
  onStart: () => void;
  onPatch: (patch: Partial<Layer> & Partial<Placement>) => void;
  onGuides: (guides: Guides | null) => void;
};

function SelectionBox({ layerId, outline, zoom, target }: { layerId: string; outline: string; zoom: number; target?: TransformTarget }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [box, setBox] = React.useState<{ left: number; top: number; width: number; height: number; rotate?: string } | null>(null);
  const op = React.useRef<{
    handle: Handle | "rotate";
    w0: number;
    h0: number;
    x0: number;
    y0: number;
    theta0: number;
    layer: Layer;
    placement: Placement;
    started: boolean;
    scene?: Scene;
  } | null>(null);

  React.useLayoutEffect(() => {
    const host = ref.current?.parentElement;
    const el = host?.querySelector<HTMLElement>(`[data-layer="${layerId}"], [data-child="${layerId}"]`);
    if (!host || !el) return setBox(null);
    const top = el.hasAttribute("data-layer");
    const measure = () => {
      if (top) {
        const k = Number(el.style.scale || 1);
        setBox({ left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth * k, height: el.offsetHeight * k, rotate: el.style.rotate });
        return;
      }
      const h = host.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      setBox({ left: (r.left - h.left) / zoom, top: (r.top - h.top) / zoom, width: r.width / zoom, height: r.height / zoom });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    const mutation = new MutationObserver(measure);
    mutation.observe(el, { attributes: true, attributeFilter: ["style"] });
    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, [layerId, zoom]);

  function framePoint(event: React.PointerEvent): [number, number] {
    const host = ref.current!.parentElement!.getBoundingClientRect();
    return [(event.clientX - host.left) / zoom, (event.clientY - host.top) / zoom];
  }

  function start(event: React.PointerEvent, handle: Handle | "rotate") {
    if (!target || !box) return;
    event.stopPropagation();
    event.preventDefault();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    const frameEl = ref.current?.parentElement?.querySelector<HTMLElement>("[data-frame-view]");
    op.current = {
      scene: frameEl && handle !== "rotate" && !target.placement.rotate ? measureScene(frameEl, layerId, zoom) : undefined,
      handle,
      w0: box.width,
      h0: box.height,
      x0: target.placement.x,
      y0: target.placement.y,
      theta0: target.placement.rotate ?? 0,
      layer: target.layer,
      placement: target.placement,
      started: false,
    };
  }

  function move(event: React.PointerEvent) {
    const o = op.current;
    if (!o || !target) return;
    if (!o.started) {
      o.started = true;
      target.onStart();
    }
    const [px, py] = framePoint(event);
    if (o.handle === "rotate") {
      const [cx, cy] = rotateVec([o.w0 / 2, o.h0 / 2], o.theta0);
      const center: [number, number] = [o.x0 + cx, o.y0 + cy];
      let theta = (Math.atan2(py - center[1], px - center[0]) * 180) / Math.PI + 90;
      if (event.shiftKey) theta = Math.round(theta / 15) * 15;
      theta = ((theta + 540) % 360) - 180;
      const [ox, oy] = rotateVec([o.w0 / 2, o.h0 / 2], theta);
      target.onPatch({ rotate: Math.abs(theta) < 0.01 ? undefined : Math.round(theta * 10) / 10, x: Math.round(center[0] - ox), y: Math.round(center[1] - oy) });
      return;
    }
    const { hx, hy } = o.handle;
    const local = rotateVec([px - o.x0, py - o.y0], -o.theta0);
    const anchor: [number, number] = [(1 - hx) * o.w0, (1 - hy) * o.h0];
    const corner = hx !== 0.5 && hy !== 0.5;
    const allowed = sidesAllowed(o.layer);
    const scene = event.ctrlKey ? undefined : o.scene;
    const t = SNAP_PX / zoom;
    const fitW = (w: number) => (scene && hx !== 0.5 ? snapSize(w, (s) => (hx === 1 ? o.x0 + s : o.x0 + o.w0 - s), "x", scene, t) : w);
    const fitH = (h: number) => (scene && hy !== 0.5 ? snapSize(h, (s) => (hy === 1 ? o.y0 + s : o.y0 + o.h0 - s), "y", scene, t) : h);
    let patch: Partial<Layer> & Partial<Placement>;
    let tl: [number, number];
    let size: [number, number];
    if (corner || allowed === "none") {
      const d: [number, number] = [(hx === 0.5 ? 0 : 2 * hx - 1) * o.w0, (hy === 0.5 ? 0 : 2 * hy - 1) * o.h0];
      const dd = d[0] * d[0] + d[1] * d[1];
      let k = Math.max(0.05, ((local[0] - anchor[0]) * d[0] + (local[1] - anchor[1]) * d[1]) / dd);
      if (corner && scene) {
        const kw = fitW(o.w0 * k) / o.w0;
        const kh = fitH(o.h0 * k) / o.h0;
        const ew = Math.abs(kw - k) * o.w0;
        const eh = Math.abs(kh - k) * o.h0;
        if (kw !== k && (kh === k || ew <= eh)) k = kw;
        else if (kh !== k) k = kh;
      }
      const a: [number, number] = [hx === 0.5 ? o.w0 / 2 : anchor[0], hy === 0.5 ? o.h0 / 2 : anchor[1]];
      tl = [a[0] * (1 - k), a[1] * (1 - k)];
      size = [o.w0 * k, o.h0 * k];
      patch = scalePatch(o.layer, o.placement, k);
    } else if (hy === 0.5) {
      const kx = fitW(Math.max(0.05, (local[0] - anchor[0]) / ((2 * hx - 1) * o.w0)) * o.w0) / o.w0;
      tl = [anchor[0] * (1 - kx), 0];
      size = [o.w0 * kx, o.h0];
      patch = { w: Math.round((o.placement.w ?? o.w0) * kx) };
    } else {
      if (allowed !== "both") return;
      const ky = fitH(Math.max(0.05, (local[1] - anchor[1]) / ((2 * hy - 1) * o.h0)) * o.h0) / o.h0;
      tl = [0, anchor[1] * (1 - ky)];
      size = [o.w0, o.h0 * ky];
      patch = { h: Math.round((o.placement.h ?? o.h0) * ky) };
    }
    const [wx, wy] = rotateVec(tl, o.theta0);
    target.onPatch({ ...patch, x: Math.round(o.x0 + wx), y: Math.round(o.y0 + wy) });
    target.onGuides(scene ? guidesFor({ x: o.x0 + tl[0], y: o.y0 + tl[1], w: size[0], h: size[1] }, scene, true) : null);
  }

  function end() {
    op.current = null;
    target?.onGuides(null);
  }

  const knob = 8 / zoom;
  const hit = 16 / zoom;
  const edge = 10 / zoom;
  const showSides = target ? sidesAllowed(target.layer) : "none";
  const handlers = (h: Handle | "rotate") => ({
    onPointerDown: (e: React.PointerEvent) => start(e, h),
    onPointerMove: move,
    onPointerUp: end,
    onLostPointerCapture: end,
  });

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute"
      style={box ? { ...box, outline, transformOrigin: "0 0" } : { display: "none" }}
    >
      {target && box
        ? (
            <>
              {HANDLES.filter((h) => (h.hx === 0.5 || h.hy === 0.5) && (showSides === "both" || (showSides === "x" && h.hy === 0.5))).map((h) => (
                <span
                  key={`${h.hx}-${h.hy}`}
                  className="pointer-events-auto absolute"
                  style={
                    h.hy === 0.5
                      ? { width: edge, top: hit / 2, bottom: hit / 2, left: `calc(${h.hx * 100}% - ${edge / 2}px)`, cursor: h.cursor }
                      : { height: edge, left: hit / 2, right: hit / 2, top: `calc(${h.hy * 100}% - ${edge / 2}px)`, cursor: h.cursor }
                  }
                  {...handlers(h)}
                />
              ))}
              {HANDLES.filter((h) => h.hx !== 0.5 && h.hy !== 0.5).map((h) => (
                <span
                  key={`${h.hx}-${h.hy}`}
                  className="pointer-events-auto absolute flex items-center justify-center"
                  style={{ width: hit, height: hit, left: `calc(${h.hx * 100}% - ${hit / 2}px)`, top: `calc(${h.hy * 100}% - ${hit / 2}px)`, cursor: h.cursor }}
                  {...handlers(h)}
                >
                  <span className="rounded-full bg-white" style={{ width: knob, height: knob, boxShadow: `0 0 0 ${1.5 / zoom}px #9D6BF2` }} />
                </span>
              ))}
              <span
                className="pointer-events-auto absolute rounded-full bg-white"
                title="Girar (⇧ trava em 15°)"
                style={{
                  width: knob * 1.2,
                  height: knob * 1.2,
                  left: `calc(50% - ${knob * 0.6}px)`,
                  top: -knob * 3.2,
                  boxShadow: `0 0 0 ${1.5 / zoom}px #9D6BF2`,
                  cursor: "grab",
                }}
                {...handlers("rotate")}
              />
              <span className="absolute" style={{ left: "50%", top: -knob * 2, width: 1.5 / zoom, height: knob * 2, background: "#9D6BF2" }} />
            </>
          )
        : null}
    </div>
  );
}
