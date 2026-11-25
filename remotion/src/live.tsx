import { useLayoutEffect, useRef, useState, type ComponentType, type CSSProperties, type ReactNode } from 'react';
import { continueRender, delayRender, Easing, interpolate, spring } from 'remotion';

export const W = 402;
export const H = 874;
export const chegar = Easing.bezier(0.22, 1, 0.36, 1);
export const trocar = Easing.bezier(0.7, 0, 0.2, 1);
export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export type Rect = { x: number; y: number; w: number; h: number };
export type Press = { at: number; label: string; finger?: boolean; scope?: 'sheet'; click?: boolean };
export type Pop = { node?: ReactNode; scope?: 'sheet'; label: string; from: number; to: number; dx?: number; dy: number; scale: number; climb?: number; tilt?: number; nth?: number };
export type Scroll = { at: number; dur: number; y: number };

const fixtureHost = globalThis as { __vmsFixture?: unknown; __vmsQueryLog?: Map<string, boolean> };

function findTarget(base: HTMLElement, label: string, nth = 0, scope?: 'sheet'): HTMLElement | null {
  const sheets = [...base.querySelectorAll<HTMLElement>('div')].filter((node) => node.style.zIndex === '40');
  const root = scope === 'sheet' && sheets.length ? sheets[sheets.length - 1] : base;
  const prefix = label.endsWith('*');
  const text = prefix ? label.slice(0, -1) : label;
  const match = (value: string | null | undefined) => value != null && (prefix ? value.startsWith(text) : value === text);
  const all = [...root.querySelectorAll<HTMLElement>('*')];
  const byLabel = all.filter((el) => match(el.getAttribute('aria-label')));
  const pool = byLabel.length ? byLabel : all.filter((el) => el.childElementCount === 0 && match(el.textContent?.trim()));
  const list = pool.filter((el) => el.getClientRects().length > 0).reverse();
  return list.length ? list[Math.min(nth, list.length - 1)] : null;
}

function clickable(el: HTMLElement | null): HTMLElement | null {
  let node = el;
  while (node && !(node as HTMLElement & { onclick: unknown }).onclick && !node.getAttribute('role') && node.parentElement) {
    const props = Object.keys(node).find((key) => key.startsWith('__reactProps'));
    if (props && (node as unknown as Record<string, { onClick?: unknown }>)[props]?.onClick) return node;
    node = node.parentElement;
  }
  return node ?? el;
}

function climbTo(el: HTMLElement, minWidth: number, k: number) {
  let node: HTMLElement | null = el;
  while (node && node.getBoundingClientRect().width / k < minWidth && node.parentElement) node = node.parentElement;
  return node ?? el;
}

function settle(frames = 2) {
  const handle = delayRender('settle live screen');
  let left = frames;
  const tick = () => (left-- > 0 ? requestAnimationFrame(tick) : setTimeout(() => continueRender(handle), 40));
  requestAnimationFrame(tick);
}

export function Finger({ x, y, t, press, ring }: { x: number; y: number; t: number; press: number; ring: number }) {
  if (t <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, zIndex: 60, opacity: t, pointerEvents: 'none' }}>
      {ring > 0 && ring < 1 ? <div style={{ position: 'absolute', left: -28, top: -28, width: 56, height: 56, borderRadius: 28, border: '3px solid rgba(139,69,243,.8)', transform: `scale(${0.6 + ring * 1.1})`, opacity: 1 - ring }} /> : null}
      <div style={{ position: 'absolute', left: -21, top: -21, width: 42, height: 42, borderRadius: 21, background: 'rgba(255,255,255,.62)', border: '2px solid rgba(23,21,30,.2)', boxShadow: '0 8px 20px rgba(34,8,74,.35)', transform: `scale(${press})` }} />
    </div>
  );
}

type LiveProps = {
  component: ComponentType<any>;
  props?: Record<string, unknown>;
  fixture: unknown;
  frame: number;
  presses?: Press[];
  pops?: Pop[];
  scrolls?: Scroll[];
  sheetAt?: number[];
  sheetOut?: number;
  dim?: number;
  children?: ReactNode;
  style?: CSSProperties;
};

export function LiveScreen({ component: Screen, props, fixture, frame, presses = [], pops = [], scrolls = [], sheetAt = [], sheetOut, dim = 0, children, style }: LiveProps) {
  fixtureHost.__vmsFixture = fixture;
  fixtureHost.__vmsQueryLog ??= new Map();
  const root = useRef<HTMLDivElement>(null);
  const applied = useRef(0);
  const last = useRef(-1);
  const [mount, setMount] = useState(0);
  const [, setTick] = useState(0);
  const pending = useRef<number | null>(null);
  const [rects, setRects] = useState<Record<string, Rect>>({});
  const [clones, setClones] = useState<Record<string, { html: string; rect: Rect }>>({});

  if (frame < last.current) {
    applied.current = 0;
    last.current = -1;
    setMount((m) => m + 1);
  }

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    fixtureHost.__vmsFixture = fixture;
    last.current = frame;
    const base = el.getBoundingClientRect();
    const k = base.width / W;
    const local = (node: Element): Rect => {
      const r = node.getBoundingClientRect();
      return { x: (r.left - base.left) / k, y: (r.top - base.top) / k, w: r.width / k, h: r.height / k };
    };

    let clicked = false;
    if (applied.current < presses.length && presses[applied.current].at <= frame) {
      const press = presses[applied.current];
      const target = clickable(findTarget(el, press.label, 0, press.scope));
      if (target && press.click !== false) {
        target.click();
        clicked = true;
      } else console.warn(`live: nothing to press for "${press.label}" at ${press.at}`);
      applied.current += 1;
      if (applied.current < presses.length && presses[applied.current].at <= frame) {
        if (!pending.current) pending.current = delayRender('replay presses');
        setTimeout(() => setTick((n) => n + 1), 30);
      } else if (pending.current) {
        const handle = pending.current;
        pending.current = null;
        setTimeout(() => continueRender(handle), 60);
      }
    }

    const vertical = [...el.querySelectorAll<HTMLElement>('.rn-scroll:not(.rn-row) > .rn-scroll-content')].sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
    if (vertical && scrolls.length) {
      let y = 0;
      for (const s of scrolls) y = interpolate(frame, [s.at, s.at + s.dur], [y, s.y], { ...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1) });
      vertical.style.transform = `translateY(${-y}px)`;
    }

    const sheet = [...el.querySelectorAll<HTMLElement>('div')].find((node) => node.style.zIndex === '40');
    if (sheet && sheetAt.length) {
      const opened = [...sheetAt].reverse().find((at) => frame >= at);
      const shown = opened === undefined ? 1 : interpolate(frame, [opened, opened + 14], [0, 1], { ...clamp, easing: chegar });
      const t = sheetOut === undefined ? shown : shown * (1 - interpolate(frame, [sheetOut, sheetOut + 12], [0, 1], { ...clamp, easing: trocar }));
      const [backdrop, panel] = [...sheet.children] as HTMLElement[];
      if (backdrop) backdrop.style.opacity = String(t);
      if (panel) panel.style.transform = `translateY(${(1 - t) * 105}%)`;
    }

    const nextRects: Record<string, Rect> = {};
    const upcoming = presses.filter((p) => p.finger !== false && p.at >= frame - 14 && p.at <= frame + 30);
    for (const p of upcoming) {
      const target = findTarget(el, p.label, 0, p.scope);
      if (target) nextRects[`press:${p.at}`] = local(target);
    }
    if (JSON.stringify(nextRects) !== JSON.stringify(rects)) setRects(nextRects);

    const nextClones = { ...clones };
    let changed = false;
    for (const pop of pops) {
      const key = `${pop.label}@${pop.from}`;
      if (frame >= pop.from && frame <= pop.to + 20 && !nextClones[key]) {
        const target = findTarget(el, pop.label, pop.nth, pop.scope);
        if (target) {
          const box = climbTo(target, pop.climb ?? 0, k);
          nextClones[key] = { html: box.outerHTML, rect: local(box) };
          changed = true;
        }
      }
    }
    if (changed) setClones(nextClones);

    if (clicked) settle();
  });

  return (
    <div style={{ position: 'absolute', inset: 0, ...style }}>
      <div ref={root} className="vms" style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 54, background: '#fff' }}>
        <Screen key={mount} {...(props ?? {})} />
        {children}
      </div>
      {dim > 0 ? <div style={{ position: 'absolute', inset: 0, borderRadius: 54, background: `rgba(24,8,52,${dim})`, zIndex: 30, pointerEvents: 'none' }} /> : null}
      {pops.map((pop) => {
        const clone = clones[`${pop.label}@${pop.from}`];
        if (!clone) return null;
        const live = pop.node;
        const t = Math.min(spring({ frame: frame - pop.from, fps: 30, config: { damping: 14 } }), 1 - spring({ frame: frame - pop.to, fps: 30, config: { damping: 20 } }));
        if (t <= 0.01) return null;
        return (
          <div
            key={pop.label + pop.from}
            className="vms"
            style={{ pointerEvents: 'none', position: 'absolute', left: live ? clone.rect.x - 40 : clone.rect.x, top: clone.rect.y, width: live ? clone.rect.w + 80 : clone.rect.w, height: clone.rect.h, zIndex: 40, transform: `translate(${(pop.dx ?? 0) * t}px, ${pop.dy * t}px) scale(${1 + (pop.scale - 1) * t}) rotate(${(pop.tilt ?? 0) * t}deg)`, filter: `drop-shadow(0 ${24 * t}px ${40 * t}px rgba(34,8,74,${0.45 * t}))` }}
            {...(live ? {} : { dangerouslySetInnerHTML: { __html: clone.html } })}
          >
            {live ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>{live}</div> : null}
          </div>
        );
      })}
      {presses
        .filter((p) => p.finger !== false)
        .map((p) => {
          const r = rects[`press:${p.at}`];
          if (!r || frame < p.at - 22 || frame > p.at + 14) return null;
          const tx = r.x + r.w / 2;
          const ty = r.y + r.h / 2;
          const approach = interpolate(frame, [p.at - 22, p.at - 2], [0, 1], { ...clamp, easing: trocar });
          const fade = interpolate(frame, [p.at - 22, p.at - 14, p.at + 6, p.at + 14], [0, 1, 1, 0], clamp);
          const press = interpolate(frame, [p.at - 3, p.at, p.at + 6], [1, 0.78, 1], clamp);
          const ring = interpolate(frame, [p.at, p.at + 12], [0, 1], { ...clamp, easing: chegar });
          return <Finger key={p.at} x={tx + (1 - approach) * 70} y={ty + (1 - approach) * 120 - Math.sin(approach * Math.PI) * 24} t={fade} press={press} ring={frame >= p.at ? ring : 0} />;
        })}
    </div>
  );
}
