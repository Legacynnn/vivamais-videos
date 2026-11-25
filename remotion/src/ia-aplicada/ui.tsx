import type { CSSProperties, ReactNode } from 'react';
import { CARD_TOP, CARD_W, CARD_X, K, clamp, glide, ramp, track } from '../agendamento/kit';
import { interpolate } from 'remotion';

export const u = (n: number) => n * K;
export const DH = 625;
export const ink = '#17151E';
export const muted = '#726F80';
export const violet = '#7E3BED';
export const violetStrong = '#6A24DB';
export const violetSoft = '#F3EDFE';
export const panel = '#F3F4FA';

export type P = { x: number; y: number };
export const dev = (p: P): P => ({ x: CARD_X + p.x * K, y: CARD_TOP + p.y * K });

export const ICON = {
  file: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7ZM14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8',
  camera: 'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  image: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4M21 15l-3.1-3.1a2 2 0 0 0-2.8 0L6 21',
  bone: 'M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z',
  check: 'm5 12 5 5L20 7',
  up: 'M12 19V5M5 12l7-7 7 7',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  redo: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5',
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  x: 'M18 6 6 18M6 6l12 12',
  back: 'm15 18-6-6 6-6',
  video: 'm16 13 5.2 3.1a.5.5 0 0 0 .8-.4V8.3a.5.5 0 0 0-.8-.4L16 11M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
  plus: 'M12 5v14M5 12h14',
  mic: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3',
  sticker: 'M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9.5L21 14.5V5a2 2 0 0 0-2-2zM14 21v-5a2 2 0 0 1 2-2h5',
};

export function Ico({ d, size, color = 'currentColor', sw = 2, style }: { d: string; size: number; color?: string; sw?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
      <path d={d} />
    </svg>
  );
}

export function Rich({ text, bold = 700 }: { text: string; bold?: number }) {
  return (
    <>
      {text.split('**').map((part, i) => (i % 2 ? <b key={i} style={{ fontWeight: bold }}>{part}</b> : <span key={i}>{part}</span>))}
    </>
  );
}

export function Words({ text, local, start = 0, rate = 0.9, bold = 700 }: { text: string; local: number; start?: number; rate?: number; bold?: number }) {
  let index = 0;
  return (
    <>
      {text.split('**').map((part, k) =>
        part.split(/(\s+)/).map((w, j) => {
          if (/^\s+$/.test(w) || !w) return w;
          const t = ramp(local, start + index++ * rate, 8);
          return (
            <span key={`${k}-${j}`} style={{ opacity: t, fontWeight: k % 2 ? bold : undefined }}>
              {w}
            </span>
          );
        }),
      )}
    </>
  );
}

export type CamKey = { at: number; s: number; p: P; dur?: number };

export function camera(frame: number, keys: CamKey[], anchorY = 1010) {
  const k = (pick: (c: CamKey) => number) => track(frame, keys.map((c) => ({ at: c.at, v: pick(c), dur: c.dur ?? 14 })));
  const s = k((c) => c.s);
  const F = dev({ x: k((c) => c.p.x), y: k((c) => c.p.y) });
  const z = Math.max(0, Math.min(1, (s - 1) / 0.42));
  let tx = F.x + z * (540 - F.x);
  const ty = F.y + z * (anchorY - F.y);
  const width = s * CARD_W;
  if (width > 1080) {
    const left = tx + s * (CARD_X - F.x);
    const fixed = Math.min(0, Math.max(1080 - width, left));
    tx += (fixed - left) * z;
  }
  const map = (q: P): P => ({ x: tx + s * (q.x - F.x), y: ty + s * (q.y - F.y) });
  return { s, map, transform: `translate(${tx}px, ${ty}px) scale(${s}) translate(${-F.x}px, ${-F.y}px)` };
}

export type Block = { id: string; at: number; h: number; render: (local: number) => ReactNode };

export function layout(blocks: Block[]) {
  const top: Record<string, number> = {};
  let y = 0;
  for (const b of blocks) {
    top[b.id] = y;
    y += b.h;
  }
  return top;
}

export function scroll(frame: number, blocks: Block[], viewH: number, dur = 22, top0 = false) {
  const top = layout(blocks);
  const target = (b: Block) => (top0 ? Math.max(0, top[b.id] + b.h - viewH) : top[b.id] + b.h - viewH);
  return track(frame, [{ at: 0, v: target(blocks[0]) }, ...blocks.map((b) => ({ at: b.at, v: target(b), dur }))]);
}

export function Thread({ frame, blocks, top, height, viewH, pad = 16, fade = 24, top0 = false }: { frame: number; blocks: Block[]; top: number; height: number; viewH: number; pad?: number; fade?: number; top0?: boolean }) {
  const y = layout(blocks);
  const sc = scroll(frame, blocks, viewH, 22, top0);
  const mask = `linear-gradient(to bottom, transparent 0px, black ${u(fade)}px)`;
  return (
    <div style={{ position: 'absolute', left: 0, top: u(top), width: CARD_W, height: u(height), overflow: 'hidden', WebkitMaskImage: mask, maskImage: mask }}>
      {blocks.map((b) => {
        const local = frame - b.at;
        if (local < 0) return null;
        const t = ramp(local, 0, 14);
        return (
          <div key={b.id} style={{ position: 'absolute', left: u(pad), right: u(pad), top: u(y[b.id] - sc), height: u(b.h), opacity: t, transform: `translateY(${(1 - t) * u(18)}px)` }}>
            {b.render(local)}
          </div>
        );
      })}
    </div>
  );
}

export function blockY(frame: number, blocks: Block[], id: string, top: number, viewH: number, top0 = false) {
  return top + layout(blocks)[id] - scroll(frame, blocks, viewH, 22, top0);
}

export const fadeOut = (frame: number, at: number, dur = 12) => 1 - ramp(frame, at, dur, glide);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const pulse = (frame: number, at: number) => interpolate(frame, [at - 3, at, at + 6], [1, 0.94, 1], clamp);
