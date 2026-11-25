import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import {
  AnamneseFillScreen,
  DoctorProfileScreen,
  HomeScreen,
  MyPlanScreen,
  SearchResultsScreen,
  SpecialtyPickerScreen,
  pickerStates,
  Chip,
  getSpecialtyImage,
  VideoCallScreen,
  anaAnamnese,
  anamneseStates,
  callStates,
  homeStates,
  myPlanStates,
  profileStates,
  searchQueries,
  searchStates,
  tomorrow,
} from './gen/app.cjs';
import { H, LiveScreen, W, chegar, clamp, trocar } from './live';
import './gen/tokens.css';
import './gen/screens.css';

export const BOOKING_FRAMES = 1390;

const S = 1.5;
const PHONE_X = (1080 - W * S) / 2;
const PHONE_Y = 560;
const GRAD_TEXT = 'linear-gradient(100deg, #E7DDFF 0%, #B79BFF 45%, #92BFF7 100%)';
const PLUS_PATH =
  'M80.4 125.28C70.72 125.28 62.85 117.41 62.85 107.73V99.86C62.85 99.07 62.2 98.42 61.41 98.42H53.54C43.86 98.42 35.99 90.55 35.99 80.87C35.99 71.19 43.86 63.32 53.54 63.32H61.41C62.2 63.32 62.85 62.67 62.85 61.88V54.01C62.85 44.33 70.72 36.46 80.4 36.46C90.08 36.46 97.95 44.33 97.95 54.01V61.88C97.95 62.67 98.6 63.32 99.39 63.32H107.26C116.94 63.32 124.81 71.19 124.81 80.87C124.81 90.55 116.94 98.42 107.26 98.42H99.39C98.6 98.42 97.95 99.07 97.95 99.86V107.73C97.95 117.41 90.08 125.28 80.4 125.28Z';

const day = String(Number(tomorrow.slice(8)));

const T = {
  hookOut: 40,
  phoneIn: 46,
  home: 46,
  plan: 132,
  search: 286,
  profile: 632,
  booked: 812,
  anamnese: 846,
  call: 1124,
  cover: 1300,
  end: 1322,
};

const scenes = {
  home: { from: T.home, to: T.plan + 20 },
  plan: { from: T.plan, to: T.search + 20 },
  search: { from: T.search, to: T.profile + 22 },
  profile: { from: T.profile, to: T.anamnese + 20 },
  anamnese: { from: T.anamnese, to: T.call + 30 },
  call: { from: T.call, to: T.end },
};

const fixtureAt = (frame: number) => ({
  ...anamneseStates.symptom,
  ...callStates['in-call'],
  anamnese: { ...anaAnamnese, answers: restAnswers },
  user: profileStates.default.user,
  queries: [
    ...profileStates.default.queries.slice(0, 3),
    ...anamneseStates.symptom.queries.slice(0, 3),
    ...callStates['in-call'].queries.slice(1),
    ...(frame >= 596 ? searchQueries.cardioTomorrow : frame >= 476 ? searchQueries.cardio : searchQueries.clinica),
    ...homeStates.default.queries,
  ],
});

const { sintomas: _s, ...restAnswers } = anaAnamnese.answers;

const headlines: { text: string; em: string[]; from: number; to: number }[] = [
  { text: 'Tudo começa no app', em: ['app'], from: T.phoneIn + 6, to: T.plan - 8 },
  { text: 'Benefícios do seu plano', em: ['Benefícios'], from: T.plan + 4, to: T.search - 8 },
  { text: 'Médicos para cada necessidade', em: ['Médicos'], from: T.search + 4, to: 378 },
  { text: 'Troque de especialidade', em: ['especialidade'], from: 386, to: 476 },
  { text: 'Filtre por dia e formato', em: ['dia', 'formato'], from: 484, to: T.profile - 10 },
  { text: 'Escolha o seu horário', em: ['horário'], from: T.profile + 2, to: T.booked - 6 },
  { text: 'Consulta agendada', em: ['agendada'], from: T.booked + 2, to: T.anamnese + 8 },
  { text: 'Conte como você está', em: ['você'], from: T.anamnese + 16, to: T.call - 12 },
  { text: 'E fale com o médico por vídeo', em: ['vídeo'], from: T.call + 34, to: T.cover - 6 },
];

function Background({ frame, shift }: { frame: number; shift: number }) {
  const d = frame / 1390;
  const blob = (color: string, size: number, x: number, y: number, opacity: number) => (
    <div style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: '50%', background: `radial-gradient(circle, ${color} 0%, transparent 66%)`, opacity }} />
  );
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(165deg, #22084A 0%, #350E6F 50%, #451391 100%)', overflow: 'hidden' }}>
      {blob('#9531FF', 1500, 1000 - d * 500 - shift * 0.4, 100 + d * 400, 0.9)}
      {blob('#7A67F8', 1400, 20 + d * 420 - shift * 0.25, 1840 - d * 360, 0.75)}
      {blob('#5A9AF0', 1100, 880 - d * 260 - shift * 0.6, 1250 - d * 300, 0.18 + 0.22 * Math.sin(d * Math.PI))}
      {blob('#C6BDF5', 700, 180 + d * 600 - shift * 0.8, 560 + d * 240, 0.2)}
    </AbsoluteFill>
  );
}

function GradWord({ children }: { children: ReactNode }) {
  return <span style={{ background: GRAD_TEXT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{children}</span>;
}

function Headline({ frame, text, em, from, to }: { frame: number; text: string; em: string[]; from: number; to: number }) {
  if (frame < from - 2 || frame > to + 16) return null;
  return (
    <div style={{ position: 'absolute', left: 72, right: 72, top: 214, display: 'flex', flexWrap: 'wrap', gap: '0 22px', fontFamily: 'var(--vm-font-display)', fontWeight: 700, fontSize: 84, lineHeight: 1.04, letterSpacing: '-0.03em', color: '#fff', zIndex: 5 }}>
      {text.split(' ').map((word, i) => {
        const inT = interpolate(frame, [from + i * 3, from + i * 3 + 18], [0, 1], { ...clamp, easing: chegar });
        const outT = interpolate(frame, [to + i * 2, to + i * 2 + 12], [0, 1], { ...clamp, easing: trocar });
        return (
          <span key={i} style={{ display: 'inline-block', opacity: inT * (1 - outT), transform: `translateY(${(1 - inT) * 70 - outT * 60}px)`, filter: `blur(${(1 - inT) * 10 + outT * 10}px)` }}>
            {em.includes(word) ? <GradWord>{word}</GradWord> : word}
          </span>
        );
      })}
    </div>
  );
}

function PlusMark({ id, size, from, to, style }: { id: string; size: number; from: string; to: string; style?: CSSProperties }) {
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

function Kinetic({ frame, lines, start, size, em }: { frame: number; lines: string[][]; start: number; size: number; em: string[] }) {
  return (
    <>
      {lines.map((line, l) => (
        <div key={l} style={{ display: 'flex', gap: size * 0.23, fontFamily: 'var(--vm-font-display)', fontWeight: 700, fontSize: size, lineHeight: 1.04, letterSpacing: '-0.035em', color: '#fff' }}>
          {line.map((word, i) => {
            const at = start + (l * 2 + i) * 4;
            const t = interpolate(frame, [at, at + 18], [0, 1], { ...clamp, easing: chegar });
            return (
              <span key={word} style={{ display: 'inline-block', opacity: t, transform: `translateY(${(1 - t) * 90}px)`, filter: `blur(${(1 - t) * 12}px)` }}>
                {em.includes(word) ? <GradWord>{word}</GradWord> : word}
              </span>
            );
          })}
        </div>
      ))}
    </>
  );
}

function Hook({ frame }: { frame: number }) {
  const out = interpolate(frame, [T.hookOut, T.hookOut + 14], [0, 1], { ...clamp, easing: Easing.in(Easing.poly(4)) });
  if (out >= 1) return null;
  const plus = spring({ frame: frame - 2, fps: 30, config: { damping: 13 } });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + out * 2.6})`, filter: `blur(${out * 18}px)`, opacity: 1 - out * 0.7 }}>
      <PlusMark id="hookPlus" size={120} from="#E7DDFF" to="#92BFF7" style={{ marginBottom: 40, transform: `scale(${plus}) rotate(${(1 - plus) * -90}deg)` }} />
      <Kinetic frame={frame} lines={[['Cuidar', 'da'], ['saúde', 'ficou'], ['simples']]} start={6} size={120} em={['saúde', 'simples']} />
    </AbsoluteFill>
  );
}

function push(frame: number, at: number, dur = 20) {
  return interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: Easing.bezier(0.32, 0.72, 0, 1) });
}

function Screens({ frame }: { frame: number }) {
  const on = (s: { from: number; to: number }) => frame >= s.from && frame < s.to;
  const toPlan = push(frame, T.plan);
  const toSearch = push(frame, T.search);
  const toProfile = interpolate(frame, [T.profile, T.profile + 22], [0, 1], { ...clamp, easing: chegar });
  const toAnamnese = push(frame, T.anamnese, 22);
  const pushOut = (t: number): CSSProperties => ({ transform: `translateX(${-t * 30}%)`, clipPath: t > 0 && t < 1 ? `inset(0 0 0 ${t * 30}% round 54px)` : undefined, filter: t > 0 ? `brightness(${1 - t * 0.35})` : undefined });
  const pushIn = (t: number): CSSProperties => ({ transform: `translateX(${(1 - t) * 100}%)`, clipPath: t < 1 ? `inset(0 ${(1 - t) * 100}% 0 0 round 54px)` : undefined, boxShadow: '-20px 0 40px rgba(20,4,48,.25)', borderRadius: 54 });

  return (
    <>
      {on(scenes.home) ? (
        <LiveScreen component={HomeScreen} fixture={fixtureAt(frame)} frame={frame} style={pushOut(toPlan)} presses={[{ at: T.plan - 4, label: 'Consultas e plantão inclusos' }]} />
      ) : null}
      {on(scenes.plan) ? (
        <LiveScreen
          component={MyPlanScreen}
          props={myPlanStates.company.props}
          fixture={fixtureAt(frame)}
          frame={frame}
          style={toSearch > 0 ? pushOut(toSearch) : pushIn(toPlan)}
          dim={0.45 * Math.max(interpolate(frame, [168, 178, 250, 262], [0, 1, 1, 0], clamp))}
          pops={[
            { label: 'Especialistas', from: 170, to: 204, dy: -30, scale: 1.14, climb: 340 },
            { label: 'Chat com IA', from: 200, to: 232, dy: -24, scale: 1.14, climb: 340 },
            { label: 'Farmácias parceiras', from: 228, to: 258, dy: -24, scale: 1.14, climb: 340 },
          ]}
          presses={[{ at: T.search - 4, label: 'Agendar consulta' }]}
        />
      ) : null}
      {frame >= T.search && frame < 482 ? (
        <LiveScreen
          component={SearchResultsScreen}
          props={searchStates.clinica.props}
          fixture={fixtureAt(frame)}
          frame={frame}
          style={pushIn(toSearch)}
          scrolls={[{ at: 330, dur: 30, y: 150 }, { at: 366, dur: 18, y: 0 }]}
          presses={[{ at: 386, label: 'Clínica geral', click: false }]}
        />
      ) : null}
      {frame >= 388 && frame < 490 ? (
        <LiveScreen
          component={SpecialtyPickerScreen}
          props={{ ...pickerStates.open.props, selected: frame >= 422 ? 'Cardiologia' : 'Clínica geral' }}
          fixture={fixtureAt(frame)}
          frame={frame}
          style={{ opacity: interpolate(frame, [388, 394, 478, 490], [0, 1, 1, 0], clamp) }}
          sheetAt={[388]}
          sheetOut={474}
          presses={[
            { at: 422, label: 'Cardiologia', click: false, scope: 'sheet' },
            { at: 466, label: 'Confirmar', click: false, scope: 'sheet' },
          ]}
          pops={[{ scope: 'sheet', label: 'Cardiologia', from: 428, to: 460, dy: -150, scale: 2, climb: 90, tilt: -3, node: <Chip label="Cardiologia" selected icon={getSpecialtyImage({ name: 'Cardiologia', icon: 'cardiologia' })} onPress={() => {}} /> }]}
        />
      ) : null}
      {frame >= 476 && on(scenes.search) ? (
        <LiveScreen
          component={SearchResultsScreen}
          props={searchStates.cardio.props}
          fixture={fixtureAt(frame)}
          frame={frame}
          style={toProfile > 0 ? { transform: `scale(${1 + toProfile * 0.06})`, opacity: 1 - toProfile, filter: `blur(${toProfile * 6}px)` } : undefined}
          sheetAt={[500]}
          sheetOut={598}
          dim={0.45 * interpolate(frame, [610, 620], [0, 1], clamp)}
          presses={[
            { at: 500, label: 'Filtros*' },
            { at: 530, label: 'Amanhã', scope: 'sheet' },
            { at: 556, label: 'Especialistas', scope: 'sheet' },
            { at: 596, label: 'Ver*', scope: 'sheet', click: false },
          ]}
          pops={[
            { scope: 'sheet', label: 'Amanhã', from: 534, to: 560, dy: -90, scale: 1.9, climb: 60, tilt: 2, node: <Chip label="Amanhã" selected onPress={() => {}} /> },
            { scope: 'sheet', label: 'Especialistas', from: 560, to: 590, dy: -90, scale: 1.9, climb: 90, tilt: -2, node: <Chip label="Especialistas" selected onPress={() => {}} /> },
            { label: 'Dr. Rafael Menezes', from: 614, to: 700, dy: -40, scale: 1.12, climb: 360 },
          ]}
        />
      ) : null}
      {on(scenes.profile) ? (
        <LiveScreen
          component={DoctorProfileScreen}
          props={profileStates.default.props}
          fixture={fixtureAt(frame)}
          frame={frame}
          style={toAnamnese > 0 ? pushOut(toAnamnese) : { opacity: toProfile, transform: `scale(${0.94 + 0.06 * toProfile})` }}
          dim={0.4 * interpolate(frame, [744, 752, 786, 796], [0, 1, 1, 0], clamp)}
          scrolls={[{ at: 668, dur: 30, y: 150 }]}
          presses={[
            { at: 700, label: day },
            { at: 726, label: 'Tarde*' },
            { at: 748, label: '14:30' },
            { at: 800, label: 'Agendar' },
          ]}
          pops={[{ label: '14:30', from: 752, to: 790, dy: -60, scale: 2, climb: 60, tilt: -2 }]}
        />
      ) : null}
      {on(scenes.anamnese) ? (
        <LiveScreen
          component={AnamneseFillScreen}
          props={anamneseStates.symptom.props}
          fixture={fixtureAt(frame)}
          frame={frame}
          style={pushIn(toAnamnese)}
          presses={[
            { at: 900, label: 'Dor de cabeça' },
            { at: 920, label: 'Cansaço' },
            { at: 946, label: 'Continuar' },
            { at: 972, label: 'Ontem', click: false },
            { at: 994, label: 'Continuar' },
            { at: 1020, label: 'Continuar' },
            { at: 1040, label: '6' },
            { at: 1070, label: 'Continuar' },
            { at: 1088, label: 'Continuar' },
            { at: 1106, label: 'Enviar anamnese' },
          ]}
          pops={[
            { label: 'Dor de cabeça', from: 904, to: 936, dy: -70, scale: 1.9, climb: 60, tilt: -2, node: <Chip label="Dor de cabeça" selected onPress={() => {}} /> },
            { label: '6', from: 1044, to: 1056, dy: -60, scale: 2.6, climb: 24 },
          ]}
        />
      ) : null}
      {on(scenes.call) ? <LiveScreen component={VideoCallScreen} props={callStates['in-call'].props} fixture={fixtureAt(frame)} frame={frame} style={{ opacity: interpolate(frame, [T.call, T.call + 10], [0, 1], clamp) }} /> : null}
    </>
  );
}

function BookedPill({ frame }: { frame: number }) {
  const t = Math.min(spring({ frame: frame - (T.booked + 4), fps: 30, config: { damping: 13 } }), 1 - spring({ frame: frame - (T.anamnese + 4), fps: 30, config: { damping: 20 } }));
  if (t <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: 540, top: 470, transform: `translate(-50%, ${(1 - t) * 60}px) scale(${0.7 + 0.3 * t})`, opacity: t, display: 'flex', alignItems: 'center', gap: 18, padding: '22px 34px', borderRadius: 999, background: 'linear-gradient(135deg, #8B45F3 0%, #6A24DB 55%, #5A1CC2 100%)', boxShadow: '0 30px 60px rgba(20,4,48,.45)', color: '#fff', fontFamily: 'var(--vm-font-text)', fontWeight: 600, fontSize: 34, whiteSpace: 'nowrap', zIndex: 20 }}>
      <span style={{ width: 44, height: 44, borderRadius: 22, background: '#fff', color: '#6A24DB', display: 'grid', placeItems: 'center', fontSize: 28, fontWeight: 700 }}>✓</span>
      Dr. Rafael · amanhã, 14:30
    </div>
  );
}

function camera(frame: number) {
  const keys = [
    { at: T.phoneIn, s: 1, x: 0, y: 0 },
    { at: 392, s: 1.1, x: 0, y: -40 },
    { at: 472, s: 1, x: 0, y: 0 },
    { at: 504, s: 1.1, x: 0, y: -40 },
    { at: 600, s: 1, x: 0, y: 0 },
    { at: 690, s: 1.08, x: 0, y: -60 },
    { at: 800, s: 0.9, x: 0, y: 40 },
    { at: T.anamnese, s: 1, x: 0, y: 0 },
  ];
  let cam = keys[0];
  for (let i = 1; i < keys.length; i++) {
    const t = interpolate(frame, [keys[i].at, keys[i].at + 22], [0, 1], { ...clamp, easing: trocar });
    cam = { at: keys[i].at, s: cam.s + (keys[i].s - cam.s) * t, x: cam.x + (keys[i].x - cam.x) * t, y: cam.y + (keys[i].y - cam.y) * t };
  }
  const dive = interpolate(frame, [T.call - 10, T.call + 26], [0, 1], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
  return { ...cam, dive };
}

function EndCard({ frame }: { frame: number }) {
  const plus = spring({ frame: frame - T.end - 2, fps: 30, config: { damping: 12 } });
  const url = interpolate(frame, [T.end + 26, T.end + 42], [0, 1], { ...clamp, easing: chegar });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <PlusMark id="endPlus" size={110} from="#FFFFFF" to="#C6BDF5" style={{ marginBottom: 44, transform: `scale(${plus}) rotate(${(1 - plus) * 120}deg)` }} />
      <Kinetic frame={frame} lines={[['Seu', 'médico,'], ['na', 'hora', 'certa']]} start={T.end + 6} size={112} em={['hora', 'certa']} />
      <div style={{ marginTop: 48, opacity: url, transform: `translateY(${(1 - url) * 24}px)`, padding: '16px 34px', borderRadius: 999, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.22)', fontFamily: 'var(--vm-font-text)', fontWeight: 600, fontSize: 40, color: '#fff' }}>vivamais.ai</div>
    </AbsoluteFill>
  );
}

export function Booking() {
  const frame = useCurrentFrame();
  const enter = spring({ frame: frame - T.phoneIn, fps: 30, config: { damping: 18, stiffness: 90 } });
  const cam = camera(frame);
  const cover = interpolate(frame, [T.cover, T.end], [0, 1], { ...clamp, easing: Easing.in(Easing.poly(3)) });

  const fill = Math.max(1080 / (W * S), 1920 / (H * S)) * 1.02;
  const scale = (cam.s * (0.86 + 0.14 * enter)) * (1 + (fill - 1) * cam.dive);
  const cx = 540 + cam.x * (1 - cam.dive);
  const cy = PHONE_Y + (H * S) / 2 + cam.y * (1 - cam.dive);
  const targetCy = 960;
  const y = cy + (targetCy - cy) * cam.dive;
  const bezel = 1 - cam.dive;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Background frame={frame} shift={cam.y} />
      {frame < T.end ? (
        <AbsoluteFill>
          <Hook frame={frame} />
          {frame >= T.phoneIn - 2 ? (
            <div style={{ position: 'absolute', left: cx - (W * S) / 2, top: y - (H * S) / 2, width: W * S, height: H * S, transform: `scale(${scale})`, transformOrigin: 'center', opacity: interpolate(frame, [T.phoneIn - 2, T.phoneIn + 8], [0, 1], clamp), filter: enter < 0.98 ? `blur(${(1 - enter) * 16}px)` : undefined }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${S})`, transformOrigin: 'top left' }}>
                <div style={{ position: 'absolute', inset: -11, borderRadius: 64, background: 'linear-gradient(145deg, #3A3346 0%, #0E0B16 35%, #0E0B16 70%, #3A3346 100%)', boxShadow: `0 70px 140px rgba(20,4,48,${0.6 * bezel})`, opacity: bezel }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: 54 * bezel, background: '#fff' }}>
                  <Screens frame={frame} />
                </div>
                <div style={{ position: 'absolute', left: W / 2 - 62, top: 11, width: 124, height: 36, borderRadius: 18, background: '#0E0B16', opacity: bezel, zIndex: 50 }} />
              </div>
            </div>
          ) : null}
          {headlines.map((h) => (
            <Headline key={h.text} frame={frame} {...h} />
          ))}
          <BookedPill frame={frame} />
        </AbsoluteFill>
      ) : null}
      {cover > 0 && frame <= T.end ? (
        <PlusMark id="coverPlus" size={200} from="#8B45F3" to="#451391" style={{ position: 'absolute', left: 440, top: 860, transform: `scale(${cover * 26}) rotate(${(1 - cover) * -90}deg)`, transformOrigin: 'center' }} />
      ) : null}
      {frame >= T.end ? (
        <AbsoluteFill>
          <Background frame={frame} shift={0} />
          <AbsoluteFill style={{ background: 'linear-gradient(160deg, rgba(139,69,243,.45) 0%, transparent 55%)' }} />
          <EndCard frame={frame} />
        </AbsoluteFill>
      ) : null}
      <img src={staticFile('logos/lockup-branco.svg')} style={{ position: 'absolute', left: 72, top: 84, height: 54, zIndex: 30 }} />
    </AbsoluteFill>
  );
}
