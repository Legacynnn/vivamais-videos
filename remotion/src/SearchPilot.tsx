import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ActiveFilterChips, CategoryChips, Chip, DoctorRow, SearchHeader, SkeletonBox, photos } from './gen/app.cjs';
import './gen/tokens.css';
import './gen/screens.css';

export const SEARCH_PILOT_FRAMES = 480;

const W = 402;
const H = 874;
const S = 1.5;
const PHONE_X = (1080 - W * S) / 2;
const PHONE_Y = 520;
const chegar = Easing.bezier(0.22, 1, 0.36, 1);
const trocar = Easing.bezier(0.7, 0, 0.2, 1);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const noop = () => {};

const GRAD_TEXT = 'linear-gradient(100deg, #E7DDFF 0%, #B79BFF 45%, #92BFF7 100%)';
const GRAD_PILL = 'linear-gradient(135deg, #8B45F3 0%, #6A24DB 55%, #5A1CC2 100%)';
const PLUS_PATH =
  'M80.4 125.28C70.72 125.28 62.85 117.41 62.85 107.73V99.86C62.85 99.07 62.2 98.42 61.41 98.42H53.54C43.86 98.42 35.99 90.55 35.99 80.87C35.99 71.19 43.86 63.32 53.54 63.32H61.41C62.2 63.32 62.85 62.67 62.85 61.88V54.01C62.85 44.33 70.72 36.46 80.4 36.46C90.08 36.46 97.95 44.33 97.95 54.01V61.88C97.95 62.67 98.6 63.32 99.39 63.32H107.26C116.94 63.32 124.81 71.19 124.81 80.87C124.81 90.55 116.94 98.42 107.26 98.42H99.39C98.6 98.42 97.95 99.07 97.95 99.86V107.73C97.95 117.41 90.08 125.28 80.4 125.28Z';

const categories = [
  { id: 'cg', name: 'Clínica geral' },
  { id: 'cardio', name: 'Cardiologia' },
  { id: 'derma', name: 'Dermatologia' },
  { id: 'pedi', name: 'Pediatria' },
];

type Doc = { id: string; name: string; photo: string; cat: string; rating: number; count: number; price: string; slot: string; today: boolean };

const doctors: Doc[] = [
  { id: 'camila', name: 'Dra. Camila Rocha', photo: 'camila', cat: 'cg', rating: 4.9, count: 212, price: 'R$ 89', slot: 'Hoje, 14:30', today: true },
  { id: 'rafael', name: 'Dr. Rafael Souza', photo: 'rafael', cat: 'cardio', rating: 4.8, count: 167, price: 'R$ 129', slot: 'Hoje, 16:00', today: true },
  { id: 'julia', name: 'Dra. Júlia Martins', photo: 'julia', cat: 'derma', rating: 4.9, count: 98, price: 'R$ 119', slot: 'Amanhã, 09:00', today: false },
  { id: 'andre', name: 'Dr. André Costa', photo: 'andre', cat: 'cardio', rating: 4.7, count: 84, price: 'R$ 139', slot: 'Amanhã, 10:30', today: false },
  { id: 'mariana', name: 'Dra. Mariana Alves', photo: 'mariana', cat: 'pedi', rating: 5, count: 143, price: 'R$ 99', slot: 'Hoje, 18:00', today: true },
  { id: 'helena', name: 'Dra. Helena Prado', photo: 'helena', cat: 'cardio', rating: 4.9, count: 61, price: 'R$ 149', slot: 'Hoje, 19:30', today: true },
];

const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? null;

const T = {
  hookOut: 34,
  phoneIn: 40,
  rowsIn: 66,
  scroll: 92,
  tapCat: 140,
  skeleton: 146,
  cardioRows: 162,
  catPopBack: 192,
  tapFilter: 226,
  filterPopBack: 276,
  lift: 300,
  tipRating: 326,
  tipSlot: 338,
  cover: 384,
  end: 406,
};

const filterChips = [
  { key: 'day', label: 'Hoje' },
  { key: 'mode', label: 'Vídeo' },
];

type Phase = { from: number; to: number; list: Doc[]; scroll?: boolean };

const phases: Phase[] = [
  { from: T.rowsIn, to: T.tapCat, list: doctors, scroll: true },
  { from: T.cardioRows, to: T.tapFilter + 4, list: doctors.filter((d) => d.cat === 'cardio') },
  { from: T.tapFilter + 12, to: 99999, list: doctors.filter((d) => d.cat === 'cardio' && d.today) },
];

const cams = [
  { at: T.phoneIn, x: 0, ry: 0, rz: 0, s: 1 },
  { at: T.tapCat - 30, x: 64, ry: -11, rz: -1.2, s: 1 },
  { at: T.tapFilter - 30, x: -64, ry: 11, rz: 1.2, s: 1 },
  { at: T.lift - 20, x: 0, ry: 0, rz: 0, s: 1.05 },
];

type Rect = { x: number; y: number; w: number; h: number };
type Pt = { x: number; y: number; bottom: number };

function useLocalRects(screen: RefObject<HTMLDivElement | null>, frame: number) {
  const [rects, setRects] = useState<Record<string, Rect>>({});
  useLayoutEffect(() => {
    const root = screen.current;
    if (!root) return;
    const base = root.getBoundingClientRect();
    const k = base.width / W;
    const local = (el: Element): Rect => {
      const r = el.getBoundingClientRect();
      return { x: (r.left - base.left) / k, y: (r.top - base.top) / k, w: r.width / k, h: r.height / k };
    };
    const next: Record<string, Rect> = {};
    root.querySelectorAll<HTMLElement>('[data-m]').forEach((el) => (next[el.dataset.m!] = local(el)));
    let chip: HTMLElement | null | undefined = [...root.querySelectorAll<HTMLElement>('[data-m="cats"] *')].find((el) => el.childElementCount === 0 && el.textContent === 'Cardiologia');
    while (chip && chip.getBoundingClientRect().height / k < 30) chip = chip.parentElement;
    if (chip) next.cardio = local(chip);
    const filterBtn = root.querySelector<HTMLElement>('[aria-label^="Filtros"]');
    if (filterBtn) next.filterBtn = local(filterBtn);
    root.querySelectorAll<HTMLElement>('[data-m="row-rafael"] *').forEach((el) => {
      if (el.childElementCount !== 0) return;
      if (el.textContent === '4,8') next.rating = local(el);
      if (el.textContent === 'Hoje, 16:00') next.slot = local(el);
    });
    if (JSON.stringify(next) !== JSON.stringify(rects)) setRects(next);
  }, [frame, screen, rects]);
  return rects;
}

function Background({ frame, camX, hue }: { frame: number; camX: number; hue: number }) {
  const drift = frame / 480;
  const blob = (color: string, size: number, x: number, y: number, opacity: number) => (
    <div style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: '50%', background: `radial-gradient(circle, ${color} 0%, transparent 66%)`, opacity }} />
  );
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(165deg, #22084A 0%, #350E6F 50%, #451391 100%)', overflow: 'hidden' }}>
      {blob('#9531FF', 1500, 980 - camX * 1.6 - drift * 260, 120 + drift * 220, 0.9)}
      {blob('#7A67F8', 1400, 40 - camX * 1.1 + drift * 200, 1820 - drift * 260, 0.75)}
      {blob('#5A9AF0', 1100, 900 - camX * 2 - drift * 120, 1300 - drift * 180, 0.35 * hue)}
      {blob('#C6BDF5', 700, 200 - camX * 2.4 + drift * 300, 520 + drift * 120, 0.18 + 0.12 * hue)}
    </AbsoluteFill>
  );
}

function GradWord({ children }: { children: ReactNode }) {
  return <span style={{ background: GRAD_TEXT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{children}</span>;
}

function Headline({ text, em, from, to }: { text: string; em: string[]; from: number; to: number }) {
  const frame = useCurrentFrame();
  if (frame < from - 2 || frame > to + 16) return null;
  return (
    <div style={{ position: 'absolute', left: 72, right: 72, top: 220, display: 'flex', flexWrap: 'wrap', gap: '0 22px', fontFamily: 'var(--vm-font-display)', fontWeight: 700, fontSize: 84, lineHeight: 1.04, letterSpacing: '-0.03em', color: '#fff' }}>
      {text.split(' ').map((word, i) => {
        const inT = interpolate(frame, [from + i * 3, from + i * 3 + 18], [0, 1], { ...clamp, easing: chegar });
        const outT = interpolate(frame, [to + i * 2, to + i * 2 + 12], [0, 1], { ...clamp, easing: trocar });
        return (
          <span key={i} style={{ display: 'inline-block', opacity: inT * (1 - outT), transform: `translateY(${(1 - inT) * 70 - outT * 60}px) rotate(${(1 - inT) * 4}deg)`, filter: `blur(${(1 - inT) * 10 + outT * 10}px)` }}>
            {em.includes(word) ? <GradWord>{word}</GradWord> : word}
          </span>
        );
      })}
    </div>
  );
}

function PlusMark({ id, size, from, to, style }: { id: string; size: number; from: string; to: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="32 32 98 98" width={size} height={size} style={style}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <path d={PLUS_PATH} fill={`url(#${id})`} />
    </svg>
  );
}

function Hook({ frame }: { frame: number }) {
  const out = interpolate(frame, [T.hookOut, T.hookOut + 14], [0, 1], { ...clamp, easing: Easing.in(Easing.poly(4)) });
  if (out >= 1) return null;
  const lines = [['Achar', 'médico'], ['ficou', 'simples']];
  const plus = spring({ frame: frame - 2, fps: 30, config: { damping: 13 } });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + out * 2.6})`, filter: `blur(${out * 18}px)`, opacity: 1 - out * 0.6 }}>
      <PlusMark id="hookPlus" size={120} from="#E7DDFF" to="#92BFF7" style={{ marginBottom: 40, transform: `scale(${plus}) rotate(${(1 - plus) * -90}deg)` }} />
      {lines.map((line, l) => (
        <div key={l} style={{ display: 'flex', gap: 28, fontFamily: 'var(--vm-font-display)', fontWeight: 700, fontSize: 124, lineHeight: 1.02, letterSpacing: '-0.035em', color: '#fff' }}>
          {line.map((word, i) => {
            const at = 6 + (l * 2 + i) * 4;
            const t = interpolate(frame, [at, at + 16], [0, 1], { ...clamp, easing: chegar });
            return (
              <span key={word} style={{ display: 'inline-block', opacity: t, transform: `translateY(${(1 - t) * 90}px) scale(${0.9 + 0.1 * t})`, filter: `blur(${(1 - t) * 12}px)` }}>
                {word === 'médico' || word === 'simples' ? <GradWord>{word}</GradWord> : word}
              </span>
            );
          })}
        </div>
      ))}
    </AbsoluteFill>
  );
}

function SkeletonRows({ frame }: { frame: number }) {
  const inT = interpolate(frame, [T.skeleton, T.skeleton + 6], [0, 1], clamp);
  const outT = interpolate(frame, [T.cardioRows - 2, T.cardioRows + 6], [0, 1], clamp);
  if (inT <= 0 || outT >= 1) return null;
  const pulse = 0.55 + 0.45 * Math.abs(Math.sin((frame - T.skeleton) / 5));
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, opacity: inT * (1 - outT) * pulse }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ margin: '0 16px 12px', padding: 16, borderRadius: 24, background: 'var(--vm-tile)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <SkeletonBox width={52} height={52} borderRadius={16} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SkeletonBox width={150} height={14} />
            <SkeletonBox width={90} height={12} />
          </div>
          <SkeletonBox width={56} height={16} />
        </div>
      ))}
    </div>
  );
}

function Rows({ frame }: { frame: number }) {
  return (
    <>
      <SkeletonRows frame={frame} />
      {phases.map((phase, p) => {
        if (frame < phase.from - 1 || frame > phase.to + 14) return null;
        const scrollY = phase.scroll ? interpolate(frame, [T.scroll, T.scroll + 34], [0, -210], { ...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1) }) : 0;
        return (
          <div key={p} style={{ position: 'absolute', left: 0, right: 0, top: 0, transform: `translateY(${scrollY}px)` }}>
            {phase.list.map((doc, i) => {
              const inT = interpolate(frame, [phase.from + i * 4, phase.from + i * 4 + 18], [0, 1], { ...clamp, easing: chegar });
              const outT = interpolate(frame, [phase.to + i * 2, phase.to + i * 2 + 10], [0, 1], { ...clamp, easing: trocar });
              return (
                <div key={doc.id} data-m={p === phases.length - 1 ? `row-${doc.id}` : undefined} style={{ opacity: inT * (1 - outT), transform: `translateY(${(1 - inT) * 46 - outT * 24}px) scale(${0.96 + 0.04 * inT})` }}>
                  <Row doc={doc} />
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

function Row({ doc }: { doc: Doc }) {
  return (
    <DoctorRow
      doctor={{ id: doc.id, name: doc.name, avatar_url: photos[doc.photo], rating_count: doc.count, average_rating: doc.rating, specialties: [] }}
      priceLabel={doc.price}
      specialtyName={catName(doc.cat)}
      covered={false}
      slotLabel={doc.slot}
      onPress={noop}
      onPressSlot={noop}
    />
  );
}

function Screen({ frame, screenRef }: { frame: number; screenRef: RefObject<HTMLDivElement | null> }) {
  const category = frame >= T.tapCat ? 'cardio' : null;
  const filtersOn = frame >= T.tapFilter;
  const chipsT = interpolate(frame, [T.tapFilter + 2, T.tapFilter + 14], [0, 1], { ...clamp, easing: chegar });
  const titleSwap = interpolate(frame, [T.tapCat, T.tapCat + 10], [0, 1], { ...clamp, easing: chegar });
  return (
    <div ref={screenRef} className="vms" style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 54, background: '#fff' }}>
      <div style={{ height: 54, display: 'flex', alignItems: 'center', padding: '6px 34px 0', fontFamily: 'var(--vm-font-text)', fontWeight: 600, fontSize: 16, color: '#17151E' }}>9:41</div>
      <div data-m="header">
        <SearchHeader value="" onChangeText={noop} onBack={noop} onOpenFilters={noop} filterCount={filtersOn ? filterChips.length : 0} />
      </div>
      <div style={{ position: 'relative', height: 50, overflow: 'hidden', fontFamily: 'var(--vm-font-display)', fontWeight: 700, fontSize: 26, letterSpacing: '-0.02em', color: '#17151E' }}>
        <div style={{ position: 'absolute', left: 20, top: 8 - titleSwap * 30, opacity: 1 - titleSwap }}>Médicos para você</div>
        <div style={{ position: 'absolute', left: 20, top: 8 + (1 - titleSwap) * 30, opacity: titleSwap }}>Cardiologia</div>
      </div>
      <div data-m="cats">
        <CategoryChips categories={categories} selected={category} onSelect={noop} />
      </div>
      <div data-m="filters" style={{ height: chipsT * 46, overflow: 'hidden', paddingTop: chipsT * 10 }}>
        <ActiveFilterChips chips={filterChips} onRemove={noop} onClearAll={noop} />
      </div>
      <div style={{ position: 'relative', marginTop: 16, height: 640, overflow: 'hidden' }}>
        <Rows frame={frame} />
      </div>
    </div>
  );
}

function Lift({ rect, t, dx, dy, scale, children, fit = false, tilt = 0 }: { rect: Rect; t: number; dx: number; dy: number; scale: number; children: ReactNode; fit?: boolean; tilt?: number }) {
  if (t <= 0.01) return null;
  return (
    <div className="vms" style={{ position: 'absolute', left: rect.x, top: rect.y, width: fit ? 'max-content' : rect.w, height: rect.h, background: 'transparent', transform: `translate(${dx * t}px, ${dy * t}px) scale(${1 + (scale - 1) * t}) rotate(${tilt * t}deg)`, transformOrigin: 'center', filter: `drop-shadow(0 ${26 * t}px ${44 * t}px rgba(34,8,74,${0.45 * t}))`, zIndex: 5 }}>
      {children}
    </div>
  );
}

function Tip({ x, y, label, t, stem = 34 }: { x: number; y: number; label: string; t: number; stem?: number }) {
  if (t <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, zIndex: 8 }}>
      <div style={{ position: 'absolute', left: -5, top: -5, width: 10, height: 10, borderRadius: 5, background: '#8B45F3', boxShadow: '0 0 0 3px #fff', transform: `scale(${t})` }} />
      <div style={{ position: 'absolute', left: -1, top: 0, width: 2, height: stem * t, background: 'linear-gradient(#8B45F3, #5A1CC2)' }} />
      <div style={{ position: 'absolute', top: stem + 4, left: 0, transform: `translateX(-50%) translateY(${(1 - t) * -10}px) scale(${0.8 + 0.2 * t})`, opacity: t, whiteSpace: 'nowrap', background: GRAD_PILL, color: '#fff', fontFamily: 'var(--vm-font-text)', fontWeight: 600, fontSize: 14, padding: '7px 13px', borderRadius: 999, boxShadow: '0 10px 24px rgba(34,8,74,.35)' }}>
        {label}
      </div>
    </div>
  );
}

function Finger({ frame, path }: { frame: number; path: { at: number; x: number; y: number; tap?: boolean }[] }) {
  const first = path[0].at;
  const last = path[path.length - 1].at;
  if (frame < first || frame > last + 12) return null;
  let i = 0;
  while (i < path.length - 2 && frame > path[i + 1].at) i += 1;
  const a = path[i];
  const b = path[i + 1];
  const t = interpolate(frame, [a.at, b.at], [0, 1], { ...clamp, easing: trocar });
  const arc = Math.sin(t * Math.PI) * 40;
  const x = a.x + (b.x - a.x) * t;
  const y = a.y + (b.y - a.y) * t - arc;
  const tap = path.find((p) => p.tap && frame >= p.at - 4 && frame <= p.at + 12);
  const press = tap ? interpolate(frame, [tap.at - 4, tap.at, tap.at + 6], [1, 0.78, 1], clamp) : 1;
  const ring = tap ? interpolate(frame, [tap.at, tap.at + 12], [0, 1], { ...clamp, easing: chegar }) : 0;
  const fade = interpolate(frame, [first, first + 6, last, last + 12], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: 'absolute', left: x, top: y, zIndex: 10, opacity: fade }}>
      {ring > 0 && ring < 1 ? <div style={{ position: 'absolute', left: -28, top: -28, width: 56, height: 56, borderRadius: 28, border: '3px solid rgba(139,69,243,.75)', transform: `scale(${0.6 + ring * 1.1})`, opacity: 1 - ring }} /> : null}
      <div style={{ position: 'absolute', left: -20, top: -20, width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,.6)', border: '2px solid rgba(23,21,30,.22)', boxShadow: '0 8px 18px rgba(34,8,74,.32)', transform: `scale(${press})` }} />
    </div>
  );
}

function camera(frame: number) {
  let cam = cams[0];
  for (let i = 1; i < cams.length; i++) {
    const t = interpolate(frame, [cams[i].at, cams[i].at + 30], [0, 1], { ...clamp, easing: trocar });
    const next = cams[i];
    cam = { at: next.at, x: cam.x + (next.x - cam.x) * t, ry: cam.ry + (next.ry - cam.ry) * t, rz: cam.rz + (next.rz - cam.rz) * t, s: cam.s + (next.s - cam.s) * t };
  }
  return { ...cam, ry: cam.ry + Math.sin(frame / 70) * 1.2 };
}

function EndCard({ frame }: { frame: number }) {
  const lines = [['Seu', 'médico,'], ['na', 'hora', 'certa']];
  const plus = spring({ frame: frame - T.end - 2, fps: 30, config: { damping: 12 } });
  const url = interpolate(frame, [T.end + 26, T.end + 42], [0, 1], { ...clamp, easing: chegar });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <PlusMark id="endPlus" size={110} from="#FFFFFF" to="#C6BDF5" style={{ marginBottom: 44, transform: `scale(${plus}) rotate(${(1 - plus) * 120}deg)` }} />
      {lines.map((line, l) => (
        <div key={l} style={{ display: 'flex', gap: 26, fontFamily: 'var(--vm-font-display)', fontWeight: 700, fontSize: 112, lineHeight: 1.04, letterSpacing: '-0.035em', color: '#fff' }}>
          {line.map((word, i) => {
            const at = T.end + 6 + (l * 2 + i) * 4;
            const t = interpolate(frame, [at, at + 18], [0, 1], { ...clamp, easing: chegar });
            return (
              <span key={word} style={{ display: 'inline-block', opacity: t, transform: `translateY(${(1 - t) * 80}px)`, filter: `blur(${(1 - t) * 10}px)` }}>
                {l === 1 && word !== 'na' ? <GradWord>{word}</GradWord> : word}
              </span>
            );
          })}
        </div>
      ))}
      <div style={{ marginTop: 48, opacity: url, transform: `translateY(${(1 - url) * 24}px)`, padding: '16px 34px', borderRadius: 999, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.22)', fontFamily: 'var(--vm-font-text)', fontWeight: 600, fontSize: 40, color: '#fff' }}>
        vivamais.ai
      </div>
    </AbsoluteFill>
  );
}

const center = (r?: Rect) => (r ? { x: r.x + r.w / 2, y: r.y + r.h / 2 } : { x: W / 2, y: H / 2 });

export function SearchPilot() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const screenRef = useRef<HTMLDivElement>(null);
  const rects = useLocalRects(screenRef, frame);

  const enter = spring({ frame: frame - T.phoneIn, fps, config: { damping: 17, mass: 0.9, stiffness: 80 } });
  const catLift = Math.min(spring({ frame: frame - (T.tapCat + 2), fps, config: { damping: 13 } }), 1 - spring({ frame: frame - T.catPopBack, fps, config: { damping: 20 } }));
  const filterLift = Math.min(spring({ frame: frame - (T.tapFilter + 16), fps, config: { damping: 13 } }), 1 - spring({ frame: frame - T.filterPopBack, fps, config: { damping: 20 } }));
  const rowLift = spring({ frame: frame - T.lift, fps, config: { damping: 15, stiffness: 110 } });
  const tipA = spring({ frame: frame - T.tipRating, fps, config: { damping: 15 } });
  const tipB = spring({ frame: frame - T.tipSlot, fps, config: { damping: 15 } });
  const cover = interpolate(frame, [T.cover, T.end], [0, 1], { ...clamp, easing: Easing.in(Easing.poly(3)) });
  const cam = camera(frame);
  const hue = interpolate(frame, [T.tapFilter - 30, T.tapFilter, T.cover, T.end], [0, 1, 1, 0.6], clamp);

  const cardio = center(rects.cardio);
  const filterBtn = center(rects.filterBtn);
  const rowRect = rects['row-rafael'];
  const rowLiftDy = -96;
  const rowScale = 1.2;
  const mapLifted = (r?: Rect): Pt => {
    if (!r || !rowRect) return { x: 0, y: 0, bottom: 0 };
    const c = center(rowRect);
    const p = center(r);
    const sc = 1 + (rowScale - 1) * rowLift;
    const dy = rowLiftDy * rowLift;
    return { x: c.x + (p.x - c.x) * sc, y: c.y + (p.y - c.y) * sc + dy, bottom: c.y + (r.y + r.h - c.y) * sc + dy };
  };
  const ratingPt = mapLifted(rects.rating);
  const cardBottom = mapLifted(rowRect).bottom;
  const slotPt = mapLifted(rects.slot);
  const coverAt = rowRect ? { x: PHONE_X + cam.x + center(rowRect).x * S, y: PHONE_Y + (center(rowRect).y + rowLiftDy) * S } : { x: 540, y: 960 };

  const rig = `translateX(${cam.x}px) rotateY(${cam.ry}deg) rotateZ(${cam.rz}deg) scale(${cam.s * (0.5 + 0.5 * enter)})`;
  const dim = 0.5 * Math.max(catLift, filterLift, rowLift);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Background frame={frame} camX={cam.x} hue={hue} />
      {frame < T.end ? (
        <AbsoluteFill>
          <Hook frame={frame} />
          <Headline text="Todos os médicos num só lugar" em={['médicos']} from={T.phoneIn + 6} to={T.tapCat - 16} />
          <Headline text="Troque de especialidade" em={['especialidade']} from={T.tapCat - 4} to={T.tapFilter - 18} />
          <Headline text="Filtre por dia e formato" em={['dia', 'formato']} from={T.tapFilter - 6} to={T.lift - 14} />
          <Headline text="Tudo no card do médico" em={['card']} from={T.lift - 2} to={T.cover - 4} />
          {frame >= T.phoneIn - 2 ? (
            <div style={{ position: 'absolute', left: PHONE_X, top: PHONE_Y, width: W * S, height: H * S, perspective: 2000, opacity: interpolate(frame, [T.phoneIn - 2, T.phoneIn + 6], [0, 1], clamp) }}>
              <div style={{ position: 'absolute', inset: 0, transform: `${rig} translateY(${(1 - enter) * 260}px) rotateX(${(1 - enter) * 28}deg)`, transformOrigin: '50% 40%', filter: enter < 0.98 ? `blur(${(1 - enter) * 14}px)` : undefined }}>
                <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${S})`, transformOrigin: 'top left' }}>
                  <div style={{ position: 'absolute', inset: -11, borderRadius: 64, background: 'linear-gradient(145deg, #3A3346 0%, #0E0B16 35%, #0E0B16 70%, #3A3346 100%)', boxShadow: '0 70px 140px rgba(20,4,48,.6), inset 0 0 0 1.5px #4A4258' }} />
                  <Screen frame={frame} screenRef={screenRef} />
                  <div style={{ position: 'absolute', left: W / 2 - 62, top: 11, width: 124, height: 36, borderRadius: 18, background: '#0E0B16' }} />
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 54, background: `linear-gradient(180deg, rgba(34,8,74,${dim * 0.8}) 0%, rgba(14,11,22,${dim}) 100%)`, zIndex: 4 }} />
                  {rects.cardio ? (
                    <Lift rect={rects.cardio} t={catLift} dx={-rects.cardio.x - rects.cardio.w / 2 + W / 2} dy={-rects.cardio.y - 44} scale={2.1} tilt={-3} fit>
                      <Chip label="Cardiologia" selected onPress={noop} />
                    </Lift>
                  ) : null}
                  {rects.filters ? (
                    <Lift rect={{ ...rects.filters, y: rects.filters.y + 10, h: 34 }} t={filterLift} dx={0} dy={-rects.filters.y - 54} scale={1.6} tilt={2}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                        {filterChips.map((chip) => (
                          <Chip key={chip.key} label={chip.label} selected removable onPress={noop} />
                        ))}
                      </div>
                    </Lift>
                  ) : null}
                  {rowRect ? (
                    <Lift rect={rowRect} t={rowLift} dx={0} dy={rowLiftDy} scale={rowScale}>
                      <Row doc={doctors[1]} />
                    </Lift>
                  ) : null}
                  <Tip x={ratingPt.x} y={ratingPt.bottom + 2} stem={cardBottom - ratingPt.bottom + 22} label="Avaliação de pacientes" t={tipA} />
                  <Tip x={slotPt.x - 10} y={slotPt.bottom + 6} stem={cardBottom - slotPt.bottom + 14} label="Agende no próximo horário" t={tipB} />
                  <Finger frame={frame} path={[{ at: T.tapCat - 26, x: W + 60, y: cardio.y + 240 }, { at: T.tapCat, x: cardio.x, y: cardio.y, tap: true }, { at: T.tapCat + 12, x: cardio.x + 30, y: cardio.y + 60 }]} />
                  <Finger frame={frame} path={[{ at: T.tapFilter - 26, x: W + 60, y: filterBtn.y + 280 }, { at: T.tapFilter, x: filterBtn.x, y: filterBtn.y, tap: true }, { at: T.tapFilter + 12, x: filterBtn.x + 40, y: filterBtn.y + 70 }]} />
                </div>
              </div>
            </div>
          ) : null}
        </AbsoluteFill>
      ) : null}
      {cover > 0 && frame < T.end + 1 ? (
        <PlusMark id="coverPlus" size={200} from="#8B45F3" to="#451391" style={{ position: 'absolute', left: coverAt.x - 100, top: coverAt.y - 100, transform: `scale(${cover * 26}) rotate(${(1 - cover) * -90}deg)`, transformOrigin: 'center' }} />
      ) : null}
      {frame >= T.end ? (
        <AbsoluteFill>
          <Background frame={frame} camX={0} hue={0.6} />
          <AbsoluteFill style={{ background: 'linear-gradient(160deg, rgba(139,69,243,.45) 0%, transparent 55%)' }} />
          <EndCard frame={frame} />
        </AbsoluteFill>
      ) : null}
      <img src={staticFile('logos/lockup-branco.svg')} style={{ position: 'absolute', left: 72, top: 84, height: 54 }} />
    </AbsoluteFill>
  );
}
