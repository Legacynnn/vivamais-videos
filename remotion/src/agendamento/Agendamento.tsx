import { linearTiming, springTiming, TransitionSeries } from '@remotion/transitions';
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from 'remotion';
import { focusPull } from '@/components/remocn/focus-pull';
import { pushThrough } from '@/components/remocn/push-through';
import { ShaderMeshGradient } from '@/components/remocn/shader-mesh-gradient';
import { whipPan } from '@/components/remocn/whip-pan';
import { zoomBlur } from '@/components/remocn/zoom-blur';
import { DOCS_FRAMES, Docs } from './docs';
import { PLANS_FRAMES, PlansCarousel } from './plans';
import { CARD_W, Card, Headline, K, Logo, Sheet, Shot, Tap, clamp, glide, ramp, rect, shotHeight, src, swap, track } from './kit';
import '../gen/tokens.css';

const VIOLET = ['#1A0640', '#4A14A8', '#7E3BED', '#6A5BF0'];

function Big({ frame, lines, from, size, accent }: { frame: number; lines: string[]; from: number; size: number; accent: string[] }) {
  let index = 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {lines.map((line, l) => (
        <div key={l} style={{ display: 'flex', gap: size * 0.24, fontFamily: 'var(--vm-font-display)', fontWeight: 700, fontSize: size, lineHeight: 1.02, letterSpacing: '-0.04em' }}>
          {line.split(' ').map((word) => {
            const i = index++;
            const t = spring({ frame: frame - from - i * 4, fps: 30, config: { damping: 16, stiffness: 110 } });
            return (
              <span key={word + i} style={{ display: 'inline-block', color: accent.includes(word) ? '#D6C3FB' : '#FDFCFF', opacity: Math.min(1, t * 1.4), transform: `translateY(${(1 - t) * 90}px) rotateX(${(1 - t) * 50}deg)`, filter: `blur(${Math.max(0, 1 - t) * 14}px)` }}>
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const ROLL = [
  { w: 'clínico geral?', i: 'medico' },
  { w: 'cardiologista?', i: 'cardio' },
  { w: 'dermatologista?', i: 'derma' },
  { w: 'psicólogo?', i: 'psicologia' },
  { w: 'pediatra?', i: 'pediatria' },
  { w: 'médico?', i: 'estetoscopio' },
];

function RollWord({ item, color }: { item: (typeof ROLL)[number]; color: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 20, color }}>
      <span style={{ width: 92, height: 92, borderRadius: 26, background: 'rgba(255,255,255,.92)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <Img src={staticFile(`icons/${item.i}.png`)} style={{ width: 66, height: 66 }} />
      </span>
      {item.w}
    </span>
  );
}

function Opening() {
  const frame = useCurrentFrame();
  const shot = 'client-home-specialties--default';
  const enter = spring({ frame: frame - 4, fps: 30, config: { damping: 22, stiffness: 60 } });
  const strip = rect(shot, 'strip') as ReturnType<typeof rect> & { gap: number };
  const period = strip.w + strip.gap - 16;
  const shift = (frame * 1.6) % period;
  const camY = track(frame, [{ at: 0, v: 0 }, { at: 100, v: 90, dur: 30 }]);
  const step = 15;
  const idx = Math.min(ROLL.length - 1, Math.floor(Math.max(0, frame - 16) / step));
  const local = frame - 16 - idx * step;
  const roll = idx === ROLL.length - 1 ? spring({ frame: local, fps: 30, config: { damping: 14 } }) : ramp(local, 0, 8, swap);
  const outT = ramp(frame, 104, 12, swap);
  const inT = ramp(frame, 4, 18);
  const search = rect(shot, 'search');
  const ph = rect(shot, 'placeholder');
  const typed = 'Cardiologia'.slice(0, Math.max(0, Math.floor((frame - 138) / 2.4)));
  const caret = frame >= 134 && Math.floor(frame / 8) % 2 === 0;
  const focus = ramp(frame, 132, 8);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 196, zIndex: 30, fontFamily: 'var(--vm-font-display)', fontWeight: 700, fontSize: 82, lineHeight: 1.04, letterSpacing: '-0.035em', color: '#FDFCFF', opacity: inT * (1 - outT), transform: `translateY(${(1 - inT) * 40 - outT * 40}px)`, filter: `blur(${(1 - inT) * 10 + outT * 12}px)` }}>
        <div>Precisa de um</div>
        <div style={{ height: 116, overflow: 'hidden', paddingTop: 4, position: 'relative' }}>
          {frame >= 16 ? (
            <>
              {idx > 0 ? <div style={{ position: 'absolute', transform: `translateY(${-roll * 116}px)`, opacity: 1 - roll }}><RollWord item={ROLL[idx - 1]} color="#D6C3FB" /></div> : null}
              <div style={{ position: 'absolute', transform: `translateY(${(1 - roll) * 116}px)` }}><RollWord item={ROLL[idx]} color={idx === ROLL.length - 1 ? '#FDFCFF' : '#D6C3FB'} /></div>
            </>
          ) : null}
        </div>
      </div>
      <Headline frame={frame} lines={['Digite e encontre']} accent={['encontre']} from={114} to={180} />
      <AbsoluteFill style={{ transform: `translateY(${(1 - enter) * 900}px) scale(${0.9 + 0.1 * enter})`, transformOrigin: '50% 30%' }}>
        <Card camY={camY} height={shotHeight(shot)}>
          <Img src={staticFile(`shots/${shot}--base.png`)} style={{ position: 'absolute', left: 0, top: 0, width: CARD_W, height: shotHeight(shot) * K, maxWidth: 'none' }} />
          <div style={{ position: 'absolute', left: 0, top: strip.y * K, width: CARD_W, height: strip.h * K, overflow: 'hidden' }}>
            {[0, 1].map((n) => (
              <Img key={n} src={staticFile(`shots/crops/${shot}--strip.png`)} style={{ position: 'absolute', top: 0, left: (n * period - shift) * K, width: strip.w * K, height: strip.h * K, maxWidth: 'none' }} />
            ))}
          </div>
          {frame >= 132 ? (
            <div style={{ position: 'absolute', left: (ph.x - 2) * K, top: (ph.y - 4) * K, width: ph.w * K, height: (ph.h + 8) * K, background: '#fff', display: 'flex', alignItems: 'center', fontFamily: 'var(--vm-font-text)', fontSize: 15 * K, color: '#17151E', opacity: focus }}>
              {typed}
              {caret ? <span style={{ width: 3, height: 18 * K, background: '#7E3BED', marginLeft: 3, borderRadius: 2 }} /> : null}
            </div>
          ) : null}
          <div style={{ position: 'absolute', left: search.x * K, top: search.y * K, width: search.w * K, height: search.h * K, borderRadius: search.radius * K, boxShadow: `0 0 0 ${5 * focus}px rgba(214,195,251,.7)` }} />
        </Card>
      </AbsoluteFill>
      <Tap frame={frame} at={130} camY={camY} r={search} />
    </AbsoluteFill>
  );
}

function Plans() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <PlansCarousel frame={frame} />
    </AbsoluteFill>
  );
}

function Listing() {
  const frame = useCurrentFrame();
  const list = 'search-benefit--preco';
  const camY = track(frame, [{ at: 0, v: 0 }, { at: 24, v: 220, dur: 40 }, { at: 80, v: 120, dur: 24 }]);
  const chip = rect(list, 'chip');
  const ring = interpolate(frame, [10, 22, 60, 72], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <Headline frame={frame} lines={['Médicos com desconto']} accent={['desconto']} from={4} to={78} />
      <Headline frame={frame} lines={['Escolha o médico']} accent={['médico']} from={86} />
      <Card camY={camY} height={874}>
        <Shot shot={list} />
        <div style={{ position: 'absolute', left: (chip.x - 12) * K, top: (chip.y - 9) * K, width: (chip.w + 24 + 22) * K, height: (chip.h + 18) * K, borderRadius: 999, boxShadow: `0 0 0 ${7 * ring}px rgba(126,59,237,.45)` }} />
      </Card>
      <Tap frame={frame} at={128} camY={camY} r={rect(list, 'rafaelTap')} />
    </AbsoluteFill>
  );
}

function Profile() {
  const frame = useCurrentFrame();
  const a = 'doctor-profile--preco-default';
  const open = 'doctor-calendar--preco-open';
  const picked = 'doctor-calendar--preco-picked';
  const b = 'doctor-profile--preco-day';
  const t = 'doctor-profile--preco-day-tarde';
  const c = 'doctor-profile--preco-slot';
  const T = { cal: 60, sheet: 66, day: 112, ver: 150, close: 156, tarde: 196, slot: 222, agendar: 262 };
  const camY = track(frame, [{ at: 0, v: 0 }, { at: 26, v: 330, dur: 28 }, { at: 66, v: 410, dur: 20 }, { at: 156, v: 430, dur: 22 }, { at: 236, v: 410, dur: 20 }]);
  return (
    <AbsoluteFill>
      <Headline frame={frame} lines={['Veja a agenda']} accent={['agenda']} from={8} to={T.close} />
      <Headline frame={frame} lines={['Escolha o horário']} accent={['horário']} from={T.close + 10} />
      <Card camY={camY} height={shotHeight(a)}>
        <Shot shot={a} />
        <Shot shot={b} style={{ opacity: ramp(frame, T.close + 4, 12) }} />
        <Shot shot={t} style={{ opacity: ramp(frame, T.tarde, 12) }} />
        <Shot shot={c} style={{ opacity: ramp(frame, T.slot, 12) }} />
        <Sheet frame={frame} sheet={open} open={T.sheet} close={T.close} panels={[{ shot: picked, at: T.day }]} />
      </Card>
      <Tap frame={frame} at={T.cal} camY={camY} r={rect(a, 'calBtn')} />
      <Tap frame={frame} at={T.day} camY={camY} r={rect(open, 'day')} />
      <Tap frame={frame} at={T.ver} camY={camY} r={rect(picked, 'ver')} />
      <Tap frame={frame} at={T.tarde} camY={camY} r={rect(b, 'tarde')} />
      <Tap frame={frame} at={T.slot} camY={camY} r={rect(t, 'slot')} />
      <Tap frame={frame} at={T.agendar} camY={camY} r={rect(c, 'agendar')} />
    </AbsoluteFill>
  );
}

function Booked({ frame }: { frame: number }) {
  const t = Math.min(spring({ frame: frame - 2, fps: 30, config: { damping: 14 } }), 1 - spring({ frame: frame - 26, fps: 30, config: { damping: 20 } }));
  if (t <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: 540, top: 430, zIndex: 45, transform: `translate(-50%, ${(1 - t) * 60}px) scale(${0.8 + 0.2 * t})`, opacity: t, display: 'flex', alignItems: 'center', gap: 20, padding: '22px 36px 22px 22px', borderRadius: 999, background: '#FDFCFF', boxShadow: '0 30px 60px rgba(20,4,48,.45)', color: '#17151E', fontFamily: 'var(--vm-font-text)', fontWeight: 500, fontSize: 36, whiteSpace: 'nowrap' }}>
      <span style={{ width: 52, height: 52, borderRadius: 26, background: '#7E3BED', color: '#FDFCFF', display: 'grid', placeItems: 'center', fontSize: 30, fontWeight: 700 }}>✓</span>
      Consulta agendada · amanhã, 14:30
    </div>
  );
}

const ICONS: Record<string, string> = {
  pulse: 'M3 12h4l3 -8l4 16l3 -8h4',
  pin: 'M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11zM12 12.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5',
  scale: 'M5 19v-3M9.5 19v-6M14 19v-9M18.5 19v-13',
  doc: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6',
  flask: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 15h9',
};

const SENT = [
  { t: 'Dor', s: 'Dor de cabeça forte', i: 'pulse' },
  { t: 'Onde', s: 'Lado direito, perto do olho', i: 'pin' },
  { t: 'Escala', s: '', i: 'scale', level: 7 },
  { t: 'Documentos', s: 'Receita e laudo anterior', i: 'doc' },
  { t: 'Exames', s: 'Hemograma · PDF', i: 'flask' },
];

function PainScale({ level, frame, at }: { level: number; frame: number; at: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
      {Array.from({ length: 10 }, (_, k) => {
        const on = k < level ? ramp(frame, at + 6 + k * 2, 6) : 0;
        return <span key={k} style={{ width: 30, height: 18, borderRadius: 5, background: on > 0 ? `rgba(126,59,237,${0.25 + 0.75 * on})` : '#EDE8F7' }} />;
      })}
      <span style={{ marginLeft: 12, fontFamily: 'var(--vm-font-text)', fontWeight: 500, fontSize: 30, color: '#17151E' }}>{level}/10</span>
    </div>
  );
}

function SentCard({ item, frame, at, radius }: { item: (typeof SENT)[number]; frame: number; at: number; radius: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, width: 880, height: 150, padding: '0 44px', boxSizing: 'border-box', borderRadius: radius, background: '#FDFCFF', boxShadow: '0 10px 24px rgba(20,4,48,.12)' }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9D6BF2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d={ICONS[item.i]} />
      </svg>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--vm-font-text)', fontSize: 25, color: '#726F80' }}>{item.t}</div>
        {item.level ? <PainScale level={item.level} frame={frame} at={at} /> : <div style={{ fontFamily: 'var(--vm-font-text)', fontWeight: 500, fontSize: 36, color: '#17151E', marginTop: 2, whiteSpace: 'nowrap' }}>{item.s}</div>}
      </div>
    </div>
  );
}

function Avatar({ src: image, size, label, ring = 0, badge }: { src: string; size: number; label: string; ring?: number; badge?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <div style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: '4px solid rgba(214,195,251,.9)', transform: `scale(${1 + ring * 0.25})`, opacity: ring > 0 ? 1 - ring : 0 }} />
        <Img src={staticFile(image)} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '6px solid #fff', boxShadow: '0 24px 60px rgba(20,4,48,.45)' }} />
        {badge ? (
          <div style={{ position: 'absolute', right: -6, top: -6, minWidth: 62, height: 62, borderRadius: 31, background: '#7E3BED', border: '5px solid #fff', color: '#FDFCFF', display: 'grid', placeItems: 'center', fontFamily: 'var(--vm-font-display)', fontWeight: 700, fontSize: 32 }}>{badge}</div>
        ) : null}
      </div>
      <div style={{ fontFamily: 'var(--vm-font-text)', fontWeight: 500, fontSize: 34, color: '#FDFCFF' }}>{label}</div>
    </div>
  );
}

function Anamnese() {
  const frame = useCurrentFrame();
  const DOC = { x: 540, y: 1560 };
  const LIST_TOP = 400;
  const STEP = 152;
  const appear = SENT.map((_, i) => 36 + i * 8);
  const flyStart = 140;
  const launches = SENT.map((_, i) => flyStart + (SENT.length - 1 - i) * 8);
  const travel = 28;
  const arrived = launches.filter((l) => frame >= l + travel).length;
  const lastArrival = Math.max(...launches) + travel;
  const ring = frame >= lastArrival ? ramp(frame, lastArrival, 16) : 0;
  const doc = spring({ frame: frame - (flyStart - 24), fps: 30, config: { damping: 16 } });
  const done = spring({ frame: frame - (lastArrival + 4), fps: 30, config: { damping: 14 } });
  return (
    <AbsoluteFill>
      <Booked frame={frame} />
      <Headline frame={frame} lines={['Envie tudo antes']} accent={['antes']} from={30} to={flyStart - 16} />
      <Headline frame={frame} lines={['O médico já sabe']} accent={['sabe']} from={flyStart - 4} />
      {SENT.map((item, i) => {
        const pop = spring({ frame: frame - appear[i], fps: 30, config: { damping: 16, stiffness: 120 } });
        const t = ramp(frame, launches[i], travel, Easing.bezier(0.5, 0, 0.2, 1));
        if (frame < appear[i] - 1 || t >= 1) return null;
        const y0 = LIST_TOP + i * STEP + 75;
        const loose = 10 + 26 * Math.min(1, t * 4);
        const top = i === 0 ? 40 : loose;
        const bottom = i === SENT.length - 1 ? 40 : loose;
        const radius = `${top}px ${top}px ${bottom}px ${bottom}px`;
        const side = i % 2 ? 1 : -1;
        const x = 540 + (DOC.x - 540) * t + side * Math.sin(t * Math.PI) * 140;
        const y = y0 + (DOC.y - y0) * t * t;
        const scale = (0.9 + 0.1 * pop) * (1 - t * 0.82);
        return (
          <div key={item.t} style={{ position: 'absolute', left: x, top: y + (1 - pop) * 80, transform: `translate(-50%, -50%) scale(${scale}) rotate(${t * side * 6}deg)`, opacity: Math.min(1, pop * 1.5) * (t > 0.85 ? (1 - t) / 0.15 : 1), filter: t > 0 ? `blur(${t * 4}px)` : undefined, zIndex: 10 + (t > 0 ? 10 : 0) }}>
            <SentCard item={item} frame={frame} at={appear[i]} radius={radius} />
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: DOC.x - 140, top: DOC.y - 140, transform: `scale(${doc})`, opacity: Math.min(1, doc * 1.5), zIndex: 15 }}>
        <Avatar src="people/rafael-hd.jpg" size={280} label="Dr. Rafael" ring={ring} badge={arrived || undefined} />
      </div>
      {done > 0.01 ? (
        <div style={{ position: 'absolute', left: DOC.x, top: DOC.y - 260, zIndex: 30, transform: `translate(-50%, 0) scale(${0.7 + 0.3 * done})`, opacity: done, display: 'flex', alignItems: 'center', gap: 14, padding: '16px 28px 16px 16px', borderRadius: 999, background: '#FDFCFF', boxShadow: '0 20px 40px rgba(20,4,48,.35)', whiteSpace: 'nowrap', fontFamily: 'var(--vm-font-text)', fontWeight: 500, fontSize: 30, color: '#17151E' }}>
          <span style={{ width: 44, height: 44, borderRadius: 22, background: '#7E3BED', color: '#FDFCFF', display: 'grid', placeItems: 'center', fontSize: 26 }}>✓</span>
          Recebido pelo médico
        </div>
      ) : null}
    </AbsoluteFill>
  );
}

function Call() {
  const frame = useCurrentFrame();
  const shot = 'video-call--in-call';
  const k = 1920 / 874;
  const ox = (1080 - 402 * k) / 2;
  const self = rect(shot, 'self');
  const enter = spring({ frame, fps: 30, config: { damping: 20 } });
  const ui = ramp(frame, 8, 18);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#17151E' }}>
      <OffthreadVideo src={staticFile('footage/doutora-camila.mp4')} muted playbackRate={0.88} style={{ position: 'absolute', inset: 0, width: 1080, height: 1920, objectFit: 'cover', transform: `scale(${1.08 - 0.08 * enter})` }} />
      <AbsoluteFill style={{ background: 'linear-gradient(to bottom, rgba(20,4,48,.7) 0%, rgba(20,4,48,0) 30%, rgba(20,4,48,0) 75%, rgba(20,4,48,.45) 100%)' }} />
      <Img src={staticFile(`shots/${shot}--overlay.png`)} style={{ position: 'absolute', left: ox, top: 0, width: 402 * k, height: 1920, opacity: ui }} />
      <div style={{ position: 'absolute', left: ox + self.x * k, top: self.y * k, width: self.w * k, height: self.h * k, borderRadius: self.radius * k, overflow: 'hidden', border: '3px solid #fff', opacity: ui, transform: `translateX(${(1 - ui) * 80}px)` }}>
        <OffthreadVideo src={staticFile('footage/paciente.mp4')} muted startFrom={20} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <Headline frame={frame} lines={['Na hora, é só entrar']} accent={['entrar']} from={12} top={300} />
    </AbsoluteFill>
  );
}

function End() {
  const frame = useCurrentFrame();
  const logo = spring({ frame: frame - 26, fps: 30, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', perspective: 1200 }}>
      <Big frame={frame} lines={['Seu médico,', 'na hora certa']} from={2} size={118} accent={['hora', 'certa']} />
      <Img src={staticFile('logos/lockup-branco.svg')} style={{ height: 96, marginTop: 80, opacity: logo, transform: `translateY(${(1 - logo) * 30}px)` }} />
    </AbsoluteFill>
  );
}

const D = { opening: 206, plans: PLANS_FRAMES, listing: 160, profile: 296, anamnese: 270, call: 160, docs: DOCS_FRAMES, end: 120 };
const TR = { a: 34, c: 40, d: 36, e: 40, g: 36, f: 40 };
export const AGENDAMENTO_FRAMES = Object.values(D).reduce((n, v) => n + v, 0) - Object.values(TR).reduce((n, v) => n + v, 0);

export function Agendamento() {
  const frame = useCurrentFrame();
  const endLogo = frame < AGENDAMENTO_FRAMES - D.end + 10;
  return (
    <AbsoluteFill>
      <ShaderMeshGradient colors={VIOLET} distortion={0.7} swirl={0.25} speed={0.35} />
      <AbsoluteFill style={{ background: 'radial-gradient(120% 70% at 50% 0%, rgba(20,4,48,0) 0%, rgba(20,4,48,.45) 100%)' }} />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={D.opening}>
          <Opening />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={springTiming({ durationInFrames: TR.a, config: { damping: 200 } })} presentation={zoomBlur({ blur: 12, rise: 80 })} />
        <TransitionSeries.Sequence durationInFrames={D.plans}>
          <Plans />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence durationInFrames={D.listing}>
          <Listing />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={springTiming({ durationInFrames: TR.c, config: { damping: 200 } })} presentation={pushThrough({ zoom: 1.5, blur: 10 })} />
        <TransitionSeries.Sequence durationInFrames={D.profile}>
          <Profile />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={springTiming({ durationInFrames: TR.d, config: { damping: 200 } })} presentation={zoomBlur({ blur: 12, rise: 120 })} />
        <TransitionSeries.Sequence durationInFrames={D.anamnese}>
          <Anamnese />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={springTiming({ durationInFrames: TR.e, config: { damping: 200 } })} presentation={pushThrough({ zoom: 1.8, blur: 12 })} />
        <TransitionSeries.Sequence durationInFrames={D.call}>
          <Call />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={springTiming({ durationInFrames: TR.g, config: { damping: 200 } })} presentation={zoomBlur({ blur: 12, rise: 120 })} />
        <TransitionSeries.Sequence durationInFrames={D.docs}>
          <Docs />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={springTiming({ durationInFrames: TR.f, config: { damping: 200 } })} presentation={focusPull({ blur: 14 })} />
        <TransitionSeries.Sequence durationInFrames={D.end}>
          <End />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {endLogo ? <Logo /> : null}
    </AbsoluteFill>
  );
}
