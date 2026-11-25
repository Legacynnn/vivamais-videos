import type { ReactNode } from 'react';
import { AbsoluteFill, Easing, Img, spring, staticFile, useCurrentFrame } from 'remotion';
import { ShaderMeshGradient } from '@/components/remocn/shader-mesh-gradient';
import { CARD_TOP, CARD_W, CARD_X, Finger, Headline, K, Logo, Shot, ramp, track } from '../agendamento/kit';
import { C, COMPOSER, ChatDevice, DOC_ROW, EMPTY_DUVIDA, PLUS, ReceitaPop, SEND, blockTop } from './chat';
import { type CamKey, type P, camera, dev, lerp, u } from './ui';
import { Notification, W, WhatsAppDevice, wppTop } from './wpp';
import '../gen/tokens.css';

export const IA_FRAMES = 1800;

const VIOLET = ['#1A0640', '#4A14A8', '#7E3BED', '#6A5BF0'];
const HOME = 'client-home--helena';
const out4 = Easing.bezier(0.16, 1, 0.3, 1);
const in4 = Easing.bezier(0.7, 0, 0.84, 0);
const morph = Easing.bezier(0.32, 0.72, 0, 1);
const MASK = 'linear-gradient(to bottom, transparent 380px, black 452px)';

const HEADLINES: [number, number, string[], string[]][] = [
  [92, 204, ['Ela mora no seu app'], ['app']],
  [236, 326, ['Pergunte do seu jeito'], ['jeito']],
  [338, 436, ['Resposta na hora'], ['hora']],
  [446, 540, ['Não entendeu', 'a consulta?'], ['consulta?']],
  [552, 666, ['Ela explica'], ['explica']],
  [680, 788, ['Chegou o exame?'], ['exame?']],
  [800, 940, ['Ela lê com você'], ['você']],
  [952, 1070, ['Não sabe qual', 'médico procurar?'], ['médico']],
  [1082, 1226, ['Ela indica', 'e agenda'], ['agenda']],
  [1240, 1316, ['E também no', 'WhatsApp'], ['WhatsApp']],
  [1326, 1414, ['Pergunte seu horário'], ['horário']],
  [1422, 1522, ['Peça sua receita'], ['receita']],
  [1530, 1664, ['Marque seu retorno'], ['retorno']],
];

function Big({ frame, lines, from, to, size, accent }: { frame: number; lines: string[]; from: number; to?: number; size: number; accent: string[] }) {
  const leave = to === undefined ? 0 : ramp(frame, to, 12, in4);
  if (frame < from - 2 || leave >= 1) return null;
  let index = 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${-230 * leave}px)`, filter: `blur(${leave * 12}px)`, opacity: 1 - leave * 0.6 }}>
      {lines.map((line, l) => (
        <div key={l} style={{ display: 'flex', gap: size * 0.24, fontFamily: 'var(--vm-font-display)', fontWeight: 500, fontSize: size, lineHeight: 1.06, letterSpacing: '-0.035em' }}>
          {line.split(' ').map((word) => {
            const i = index++;
            const t = spring({ frame: frame - from - i * 3, fps: 30, config: { damping: 18, stiffness: 120 } });
            return (
              <span key={word + i} style={{ display: 'inline-block', color: accent.includes(word) ? '#D6C3FB' : '#FDFCFF', opacity: Math.min(1, t * 1.4), transform: `translateY(${(1 - t) * 80}px)`, filter: `blur(${Math.max(0, 1 - t) * 12}px)` }}>
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Hook({ frame }: { frame: number }) {
  if (frame > 96) return null;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: 780 }}>
        <Big frame={frame} lines={['Dúvida de saúde?']} from={4} to={36} size={112} accent={['saúde?']} />
      </div>
      <div style={{ position: 'absolute', top: 760 }}>
        <Big frame={frame} lines={['Pergunte à', 'Super Inteligência']} from={42} to={80} size={104} accent={['Super', 'Inteligência']} />
      </div>
    </AbsoluteFill>
  );
}

function Device({ children, shadow = true }: { children: ReactNode; shadow?: boolean }) {
  return (
    <div style={{ position: 'absolute', left: CARD_X, top: CARD_TOP, width: CARD_W, height: u(625), borderRadius: 64, overflow: 'hidden', background: '#FDFCFF', boxShadow: shadow ? '0 50px 120px rgba(20,4,48,.55), 0 0 0 1px rgba(255,255,255,.08)' : 'none' }}>
      {children}
    </div>
  );
}

const ABRIR = { x: 201, y: 581 - 300 };

function homeCam(frame: number) {
  return camera(frame, [
    { at: 0, s: 1, p: ABRIR },
    { at: 154, s: 1.3, p: ABRIR, dur: 18 },
  ]);
}

function Home({ frame }: { frame: number }) {
  if (frame < 76 || frame > 222) return null;
  const enter = ramp(frame, 78, 30, out4);
  const camY = track(frame, [{ at: 0, v: 0 }, { at: 110, v: 300, dur: 40 }]);
  const cam = homeCam(frame);
  const exit = ramp(frame, 190, 24, Easing.in(Easing.cubic));
  const tap = cam.map(dev(ABRIR));
  return (
    <AbsoluteFill style={{ transformOrigin: `${tap.x}px ${tap.y}px`, transform: `translateY(${(1 - enter) * 1100}px) scale(${1 + exit * 0.5})`, filter: `blur(${exit * 12}px)`, opacity: 1 - ramp(frame, 198, 12) }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: '0 0', transform: cam.transform }}>
        <div style={{ position: 'absolute', left: CARD_X, top: CARD_TOP - camY * K, width: CARD_W, height: 874 * K, borderRadius: 64, overflow: 'hidden', background: '#FDFCFF', boxShadow: '0 50px 120px rgba(20,4,48,.55)' }}>
          <Shot shot={HOME} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

const MID = { x: 201, y: 300 };

function chatKeys(): CamKey[] {
  const chipY = blockTop(C.chip, 'chips') + 18;
  const recY = blockTop(C.receita, 'a2') + 318;
  const examY = blockTop(840, 'a3') + 150;
  const slotY = blockTop(C.slot, 'slots') + 126;
  return [
    { at: 0, s: 1, p: MID },
    { at: 246, s: 1.18, p: EMPTY_DUVIDA },
    { at: 268, s: 1.18, p: COMPOSER, dur: 16 },
    { at: 342, s: 1, p: COMPOSER, dur: 20 },
    { at: 454, s: 1.42, p: { x: 110, y: chipY } },
    { at: 478, s: 1, p: { x: 110, y: chipY }, dur: 20 },
    { at: 612, s: 1.42, p: { x: 90, y: recY } },
    { at: 640, s: 1, p: { x: 90, y: recY }, dur: 20 },
    { at: 684, s: 1.18, p: COMPOSER },
    { at: 708, s: 1.18, p: { x: 201, y: DOC_ROW.y - 30 }, dur: 12 },
    { at: 728, s: 1.18, p: COMPOSER, dur: 12 },
    { at: 772, s: 1, p: COMPOSER, dur: 20 },
    { at: 804, s: 1.18, p: { x: 201, y: examY }, dur: 18 },
    { at: 904, s: 1, p: { x: 201, y: examY }, dur: 20 },
    { at: 950, s: 1.18, p: COMPOSER },
    { at: 1026, s: 1, p: COMPOSER, dur: 20 },
    { at: 1152, s: 1.42, p: { x: 250, y: slotY } },
    { at: 1182, s: 1, p: { x: 250, y: slotY }, dur: 18 },
    { at: 1208, s: 0.84, p: { x: 201, y: 120 }, dur: 28 },
  ];
}

function Chat({ frame, cam }: { frame: number; cam: ReturnType<typeof camera> }) {
  if (frame < 196 || frame > 1312) return null;
  const enter = ramp(frame, 198, 28, out4);
  const leave = ramp(frame, 1292, 14);
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, enter * 1.6) * (1 - leave), transformOrigin: '540px 1100px', transform: `scale(${0.8 + 0.2 * enter})`, filter: `blur(${(1 - enter) * 10}px)` }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: '0 0', transform: cam.transform }}>
        <Device>
          <ChatDevice frame={frame} />
        </Device>
      </div>
    </AbsoluteFill>
  );
}

const BANNER = { x: 64, y: 500, w: 952, h: 214, r: 48 };

function wppKeys(): CamKey[] {
  const r1 = wppTop(1380, 'r1') + 40;
  const doc = wppTop(W.docTap, 'doc') + 100;
  const opt = wppTop(W.pick, 'r3') + 112;
  return [
    { at: 0, s: 1, p: MID },
    { at: 1356, s: 1.18, p: { x: 160, y: r1 }, dur: 16 },
    { at: 1408, s: 1, p: { x: 160, y: r1 }, dur: 18 },
    { at: 1476, s: 1.42, p: { x: 150, y: doc } },
    { at: 1506, s: 1, p: { x: 150, y: doc }, dur: 20 },
    { at: 1596, s: 1.42, p: { x: 160, y: opt } },
    { at: 1626, s: 1, p: { x: 160, y: opt }, dur: 20 },
  ];
}

function WhatsApp({ frame, cam }: { frame: number; cam: ReturnType<typeof camera> }) {
  if (frame < 1238 || frame > 1684) return null;
  const drop = ramp(frame, 1240, 16, out4);
  const press = frame >= 1287 && frame < 1296 ? 0.97 : 1;
  const m = ramp(frame, 1290, 26, morph);
  const target = { x: CARD_X, y: CARD_TOP, w: CARD_W, h: u(625), r: 64 };
  const box = {
    x: lerp(BANNER.x, target.x, m),
    y: lerp(BANNER.y - (1 - drop) * 200, target.y, m),
    w: lerp(BANNER.w, target.w, m),
    h: lerp(BANNER.h, target.h, m),
    r: lerp(BANNER.r, target.r, m),
  };
  const scale = box.w / CARD_W;
  const leave = ramp(frame, 1668, 12, in4);
  const settled = m >= 1;
  const inner = (
    <div style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: box.r, overflow: 'hidden', background: m > 0 ? '#EFEAE2' : 'rgba(250,250,252,.96)', boxShadow: '0 40px 100px rgba(20,4,48,.5)', opacity: drop, transform: `scale(${m > 0 ? 1 : press})` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: CARD_W, height: u(625), transformOrigin: '0 0', transform: `scale(${scale})`, opacity: ramp(frame, 1294, 12) }}>
        <WhatsAppDevice frame={frame} />
      </div>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - ramp(frame, 1290, 8) }}>
        <Notification local={frame - 1240} />
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ transform: `translateY(${-230 * leave}px)`, filter: `blur(${leave * 18}px)`, opacity: 1 - leave }}>
      {settled ? <div style={{ position: 'absolute', inset: 0, transformOrigin: '0 0', transform: cam.transform }}>{inner}</div> : inner}
    </AbsoluteFill>
  );
}

function End({ frame }: { frame: number }) {
  if (frame < 1676) return null;
  const logo = spring({ frame: frame - 1716, fps: 30, config: { damping: 18 } });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Big frame={frame} lines={['Sua saúde,', 'sempre com resposta']} from={1680} size={104} accent={['resposta']} />
      <Img src={staticFile('logos/lockup-branco.svg')} style={{ height: 92, marginTop: 84, opacity: logo, transform: `translateY(${(1 - logo) * 30}px)` }} />
    </AbsoluteFill>
  );
}

function Taps({ frame, chat, home, wpp }: { frame: number; chat: ReturnType<typeof camera>; home: ReturnType<typeof camera>; wpp: ReturnType<typeof camera> }) {
  const at = (p: P, cam: ReturnType<typeof camera>) => cam.map(dev(p));
  const list: { at: number; p: P }[] = [
    { at: 186, p: at(ABRIR, home) },
    { at: C.duvida, p: at(EMPTY_DUVIDA, chat) },
    { at: C.send1, p: at(SEND, chat) },
    { at: C.chip, p: at({ x: 100, y: blockTop(C.chip, 'chips') + 18 }, chat) },
    { at: C.receita, p: at({ x: 62, y: blockTop(C.receita, 'a2') + 318 }, chat) },
    { at: C.plus, p: at(PLUS, chat) },
    { at: C.doc, p: at(DOC_ROW, chat) },
    { at: C.send2, p: at(SEND, chat) },
    { at: C.send3, p: at(SEND, chat) },
    { at: C.slot, p: at({ x: 262, y: blockTop(C.slot, 'slots') + 126 }, chat) },
    { at: 1290, p: { x: 540, y: BANNER.y + BANNER.h / 2 } },
    { at: W.docTap, p: at({ x: 150, y: wppTop(W.docTap, 'doc') + 100 }, wpp) },
    { at: W.pick, p: at({ x: 162, y: wppTop(W.pick, 'r3') + 112 }, wpp) },
  ];
  return (
    <>
      {list.map((t) => (
        <Finger key={t.at} frame={frame} at={t.at} x={t.p.x} y={t.p.y} />
      ))}
    </>
  );
}

export function IAAplicada() {
  const frame = useCurrentFrame();
  const home = homeCam(frame);
  const chat = camera(frame, chatKeys());
  const wpp = camera(frame, wppKeys());
  return (
    <AbsoluteFill>
      <ShaderMeshGradient colors={VIOLET} distortion={0.7} swirl={0.25} speed={0.35} />
      <Hook frame={frame} />
      <AbsoluteFill style={{ WebkitMaskImage: MASK, maskImage: MASK }}>
        <Home frame={frame} />
        <Chat frame={frame} cam={chat} />
        <WhatsApp frame={frame} cam={wpp} />
      </AbsoluteFill>
      {HEADLINES.map(([from, to, lines, accent]) => (
        <Headline key={from} frame={frame} lines={lines} accent={accent} from={from} to={to} weight={500} size={76} />
      ))}
      <ReceitaPop frame={frame} />
      <Taps frame={frame} chat={chat} home={home} wpp={wpp} />
      <End frame={frame} />
      {frame < 1680 ? <div style={{ opacity: 1 - ramp(frame, 1668, 10) }}><Logo /></div> : null}
    </AbsoluteFill>
  );
}

