import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import shotsData from '../shots.gen.json';

export type Rect = { x: number; y: number; w: number; h: number; radius: number };
const shots = shotsData as Record<string, Record<string, Rect>>;

export const K = 2.3;
export const CARD_W = 402 * K;
export const CARD_X = (1080 - CARD_W) / 2;
export const CARD_TOP = 470;
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const swap = Easing.bezier(0.65, 0, 0.35, 1);
export const glide = Easing.bezier(0.45, 0, 0.15, 1);
export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const rect = (shot: string, name: string): Rect => {
  const r = shots[shot]?.[name];
  if (!r) throw new Error(`no rect ${shot}/${name}`);
  return r;
};
export const shotHeight = (shot: string) => shots[shot]?._height?.h ?? 874;
export const src = (shot: string) => staticFile(`shots/${shot}.png`);
export const center = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

export const ramp = (frame: number, from: number, dur: number, easing = ease) => interpolate(frame, [from, from + dur], [0, 1], { ...clamp, easing });

export function track(frame: number, keys: { at: number; v: number; dur?: number }[]) {
  let v = keys[0].v;
  for (const key of keys.slice(1)) v = v + (key.v - v) * ramp(frame, key.at, key.dur ?? 36, glide);
  return v;
}

export const toFrame = (camY: number, p: { x: number; y: number }) => ({ x: CARD_X + p.x * K, y: CARD_TOP + (p.y - camY) * K });

export function Region({ shot, r, style }: { shot: string; r: Rect; style?: CSSProperties }) {
  return (
    <div style={{ position: 'absolute', left: r.x * K, top: r.y * K, width: r.w * K, height: r.h * K, overflow: 'hidden', borderRadius: Math.min(r.radius, r.h / 2) * K, ...style }}>
      <Img src={src(shot)} style={{ position: 'absolute', left: -r.x * K, top: -r.y * K, width: CARD_W, height: shotHeight(shot) * K, maxWidth: 'none' }} />
    </div>
  );
}

export function Shot({ shot, style }: { shot: string; style?: CSSProperties }) {
  return <Img src={src(shot)} style={{ position: 'absolute', left: 0, top: 0, width: CARD_W, height: shotHeight(shot) * K, maxWidth: 'none', ...style }} />;
}

export function Card({ camY, height, children }: { camY: number; height: number; children: ReactNode }) {
  return (
    <AbsoluteFill style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 380px, black 452px)', maskImage: 'linear-gradient(to bottom, transparent 380px, black 452px)' }}>
      <div style={{ position: 'absolute', left: CARD_X, top: CARD_TOP - camY * K, width: CARD_W, height: height * K, borderRadius: 64, overflow: 'hidden', background: '#FDFCFF', boxShadow: '0 50px 120px rgba(20,4,48,.55), 0 0 0 1px rgba(255,255,255,.08)' }}>
        {children}
      </div>
    </AbsoluteFill>
  );
}

export function Sheet({ frame, base, sheet, open, close, panels }: { frame: number; base?: string; sheet: string; open: number; close?: number; panels?: { shot: string; at: number }[] }) {
  const r = rect(sheet, 'sheet');
  const t = ramp(frame, open, 22, Easing.bezier(0.32, 0.72, 0, 1)) * (close === undefined ? 1 : 1 - ramp(frame, close, 20, glide));
  if (t <= 0) return null;
  const list = [{ shot: sheet, at: -9999 }, ...(panels ?? [])];
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(23,21,30,0.4)', opacity: t }} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', transform: `translateY(${(1 - t) * (shotHeight(sheet) - r.y + 20) * K}px)` }}>
        {list.map((panel, i) => {
          const next = list[i + 1];
          const opacity = next && frame >= next.at + 10 ? 0 : 1;
          const shown = ramp(frame, panel.at, 10);
          if (panel.at !== -9999 && shown <= 0) return null;
          return <Region key={panel.shot + i} shot={panel.shot} r={{ ...r, radius: 0 }} style={{ opacity: panel.at === -9999 ? opacity : shown * opacity, borderTopLeftRadius: 28 * K, borderTopRightRadius: 28 * K }} />;
        })}
      </div>
      {base ? null : null}
    </>
  );
}

export function Finger({ frame, at, x, y }: { frame: number; at: number; x: number; y: number }) {
  if (frame < at - 28 || frame > at + 18) return null;
  const approach = ramp(frame, at - 28, 26, glide);
  const fade = interpolate(frame, [at - 28, at - 18, at + 6, at + 18], [0, 1, 1, 0], clamp);
  const press = interpolate(frame, [at - 3, at, at + 6], [1, 0.8, 1], clamp);
  const ring = ramp(frame, at, 14);
  const fx = x + (1 - approach) * 160;
  const fy = y + (1 - approach) * 260 - Math.sin(approach * Math.PI) * 50;
  return (
    <div style={{ position: 'absolute', left: fx, top: fy, opacity: fade, zIndex: 50 }}>
      {frame >= at ? <div style={{ position: 'absolute', left: -60, top: -60, width: 120, height: 120, borderRadius: 60, border: '5px solid rgba(255,255,255,.9)', transform: `scale(${0.5 + ring})`, opacity: 1 - ring }} /> : null}
      <div style={{ position: 'absolute', left: -44, top: -44, width: 88, height: 88, borderRadius: 44, background: 'rgba(253,252,255,.7)', border: '3px solid #FDFCFF', boxShadow: '0 12px 30px rgba(20,4,48,.35)', transform: `scale(${press})` }} />
    </div>
  );
}

export function Tap({ frame, at, camY, r }: { frame: number; at: number; camY: number; r: Rect }) {
  const p = toFrame(camY, center(r));
  return <Finger frame={frame} at={at} x={p.x} y={p.y} />;
}

export function Pop({ frame, from, to, camY, shot, r, lift = 220, scale = 1.6, tilt = 0, x }: { frame: number; from: number; to: number; camY: number; shot: string; r: Rect; lift?: number; scale?: number; tilt?: number; x?: number }) {
  const t = Math.min(spring({ frame: frame - from, fps: 30, config: { damping: 15, stiffness: 120 } }), 1 - spring({ frame: frame - to, fps: 30, config: { damping: 22 } }));
  if (t <= 0.005) return null;
  const at = toFrame(camY, { x: r.x, y: r.y });
  const dx = x === undefined ? 0 : x - (at.x + (r.w * K) / 2);
  return (
    <div style={{ position: 'absolute', left: at.x, top: at.y, width: r.w * K, height: r.h * K, zIndex: 40, opacity: Math.min(1, t * 2.5), transform: `translate(${dx * t}px, ${-lift * t}px) scale(${1 + (scale - 1) * t}) rotate(${tilt * t}deg)`, filter: `drop-shadow(0 ${30 * t}px ${50 * t}px rgba(20,4,48,${0.5 * t}))` }}>
      <div style={{ position: 'absolute', left: -r.x * K, top: -r.y * K, width: CARD_W, height: 0 }}>
        <Region shot={shot} r={r} />
      </div>
    </div>
  );
}

export function Headline({ frame, lines, from, to, accent = [], top = 196, weight = 700, size = 82 }: { frame: number; lines: string[]; from: number; to?: number; accent?: string[]; top?: number; weight?: number; size?: number }) {
  if (frame < from - 1 || (to !== undefined && frame > to + 18)) return null;
  let index = 0;
  return (
    <div style={{ position: 'absolute', left: 80, right: 80, top, zIndex: 30 }}>
      {lines.map((line, l) => (
        <div key={l} style={{ display: 'flex', flexWrap: 'nowrap', whiteSpace: 'nowrap', gap: '0 22px', fontFamily: 'var(--vm-font-display)', fontWeight: weight, fontSize: size, lineHeight: 1.04, letterSpacing: '-0.035em', color: '#FDFCFF' }}>
          {line.split(' ').map((word) => {
            const i = index++;
            const inT = ramp(frame, from + i * 3, 26);
            const outT = to === undefined ? 0 : ramp(frame, to + i * 2, 16, glide);
            return (
              <span key={word + i} style={{ display: 'inline-block', opacity: inT * (1 - outT), transform: `translateY(${(1 - inT) * 46 - outT * 40}px)`, filter: `blur(${(1 - inT) * 12 + outT * 12}px)`, color: accent.includes(word) ? '#D6C3FB' : '#FDFCFF' }}>
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function Logo() {
  return <Img src={staticFile('logos/lockup-branco.svg')} style={{ position: 'absolute', left: 80, top: 84, height: 56, zIndex: 60 }} />;
}

export function useLocal() {
  return useCurrentFrame();
}
