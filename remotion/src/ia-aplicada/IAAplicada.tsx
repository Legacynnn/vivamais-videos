import type { ReactNode } from 'react';
import { AbsoluteFill, Easing, Img, spring, staticFile, useCurrentFrame } from 'remotion';
import { ShaderMeshGradient } from '@/components/remocn/shader-mesh-gradient';
import { CARD_TOP, CARD_W, CARD_X, Finger, Headline, K, Logo, Shot, ramp, track } from '../agendamento/kit';
import { ACH_GROW, ATTACH_BTN, C, COMPOSER, ChatDevice, DOC_ROW, SEARCH_AT, EMPTY_DUVIDA, PLUS, ReceitaPop, SEND, blockTop } from './chat';
import { type CamKey, type P, camera, dev, lerp, u } from './ui';
import { N_DONE, N_SOON, Notification, W, WhatsAppDevice, wppTop } from './wpp';
import '../gen/tokens.css';

export const IA_FRAMES = 2250;

const VIOLET = ['#1A0640', '#4A14A8', '#7E3BED', '#6A5BF0'];
const HOME = 'client-home--helena';
const out4 = Easing.bezier(0.16, 1, 0.3, 1);
const in4 = Easing.bezier(0.7, 0, 0.84, 0);
const morph = Easing.bezier(0.32, 0.72, 0, 1);
const MASK = 'linear-gradient(to bottom, transparent 380px, black 452px)';

const HEADLINES: [number, number, string, string[]][] = [
  [92, 204, 'Ela mora no seu app', ['app']],
  [236, 326, 'Pergunte do seu jeito', ['jeito']],
  [338, 436, 'Resposta na hora', ['hora']],
  [446, 556, 'Entenda sua consulta', ['consulta']],
  [566, 640, 'Sem termo difícil', ['difícil']],
  [650, 760, 'Receita explicada', ['explicada']],
  [770, 822, 'Chegou o exame?', ['exame?']],
  [832, 914, 'Anexe direto do app', ['app']],
  [924, 1048, 'Ela lê com você', ['você']],
  [1058, 1148, 'E mostra a evolução', ['evolução']],
  [1158, 1278, 'Qual médico procurar?', ['médico']],
  [1290, 1434, 'Ela indica e agenda', ['agenda']],
  [1448, 1530, 'E também no WhatsApp', ['WhatsApp']],
  [1540, 1684, 'Dúvidas da consulta', ['consulta']],
  [1696, 1790, 'Aviso 5 min antes', ['antes']],
  [1800, 1968, 'Depois, os documentos', ['documentos']],
  [1978, 2108, 'Marque seu retorno', ['retorno']],
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
  const achY = blockTop(C.achado, 'a2') + 124;
  const recY = blockTop(C.receita, 'a2') + 318 + ACH_GROW;
  const examY = blockTop(960, 'a3') + 150;
  const hemoY = blockTop(C.hemo, 'a3') + 118;
  const slotY = blockTop(C.slot, 'slots') + 126;
  return [
    { at: 0, s: 1, p: MID },
    { at: 246, s: 1.18, p: EMPTY_DUVIDA },
    { at: 268, s: 1.18, p: COMPOSER, dur: 16 },
    { at: 342, s: 1, p: COMPOSER, dur: 20 },
    { at: 454, s: 1.42, p: { x: 110, y: chipY } },
    { at: 478, s: 1, p: { x: 110, y: chipY }, dur: 20 },
    { at: 556, s: 1.42, p: { x: 170, y: achY } },
    { at: 584, s: 1.18, p: { x: 201, y: achY + 30 }, dur: 18 },
    { at: 618, s: 1, p: { x: 201, y: achY + 30 }, dur: 20 },
    { at: 636, s: 1.42, p: { x: 90, y: recY } },
    { at: 660, s: 1, p: { x: 90, y: recY }, dur: 20 },
    { at: 774, s: 1.18, p: PLUS },
    { at: 794, s: 1, p: PLUS, dur: 16 },
    { at: 840, s: 1.18, p: { x: 201, y: DOC_ROW.y }, dur: 12 },
    { at: 860, s: 1.18, p: { x: 201, y: ATTACH_BTN.y - 40 }, dur: 10 },
    { at: 876, s: 1.18, p: COMPOSER, dur: 12 },
    { at: 920, s: 1, p: COMPOSER, dur: 20 },
    { at: 948, s: 1.18, p: { x: 201, y: examY }, dur: 18 },
    { at: 994, s: 1.42, p: { x: 130, y: hemoY } },
    { at: 1016, s: 1.18, p: { x: 201, y: hemoY + 90 }, dur: 18 },
    { at: 1068, s: 1, p: { x: 201, y: hemoY + 90 }, dur: 20 },
    { at: 1158, s: 1.18, p: COMPOSER },
    { at: 1234, s: 1, p: COMPOSER, dur: 20 },
    { at: 1360, s: 1.42, p: { x: 250, y: slotY } },
    { at: 1390, s: 1, p: { x: 250, y: slotY }, dur: 18 },
    { at: W.recede, s: 0.84, p: { x: 201, y: 120 }, dur: 28 },
  ];
}

function Chat({ frame, cam }: { frame: number; cam: ReturnType<typeof camera> }) {
  if (frame < 196 || frame > W.tap + 22) return null;
  const enter = ramp(frame, 198, 28, out4);
  const leave = ramp(frame, W.tap + 2, 14);
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
  const r1 = wppTop(1600, 'r1') + 40;
  const docs = wppTop(W.pedido + 20, 'doc') + 140;
  const opt = wppTop(W.pick, 'r4') + 130;
  return [
    { at: 0, s: 1, p: MID },
    { at: 1562, s: 1.18, p: { x: 160, y: r1 }, dur: 16 },
    { at: 1612, s: 1, p: { x: 160, y: r1 }, dur: 18 },
    { at: 1722, s: 1.18, p: { x: 201, y: N_SOON.y + 46 }, dur: 18 },
    { at: 1776, s: 1, p: { x: 201, y: N_SOON.y + 46 }, dur: 14 },
    { at: 1806, s: 1.18, p: { x: 201, y: N_DONE.y + 46 }, dur: 16 },
    { at: 1840, s: 1, p: { x: 201, y: N_DONE.y + 46 }, dur: 20 },
    { at: 1872, s: 1.18, p: { x: 160, y: docs }, dur: 18 },
    { at: 1904, s: 1, p: { x: 160, y: docs }, dur: 18 },
    { at: 2034, s: 1.42, p: { x: 160, y: opt } },
    { at: 2062, s: 1, p: { x: 160, y: opt }, dur: 20 },
  ];
}

function WhatsApp({ frame, cam }: { frame: number; cam: ReturnType<typeof camera> }) {
  if (frame < W.drop - 2 || frame > W.exit + 16) return null;
  const drop = ramp(frame, W.drop, 16, out4);
  const press = frame >= W.tap - 3 && frame < W.tap + 6 ? 0.97 : 1;
  const m = ramp(frame, W.tap, 26, morph);
  const target = { x: CARD_X, y: CARD_TOP, w: CARD_W, h: u(625), r: 64 };
  const box = {
    x: lerp(BANNER.x, target.x, m),
    y: lerp(BANNER.y - (1 - drop) * 200, target.y, m),
    w: lerp(BANNER.w, target.w, m),
    h: lerp(BANNER.h, target.h, m),
    r: lerp(BANNER.r, target.r, m),
  };
  const scale = box.w / CARD_W;
  const leave = ramp(frame, W.exit, 12, in4);
  const settled = m >= 1;
  const inner = (
    <div style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: box.r, overflow: 'hidden', background: m > 0 ? '#EFEAE2' : 'rgba(250,250,252,.96)', boxShadow: '0 40px 100px rgba(20,4,48,.5)', opacity: drop, transform: `scale(${m > 0 ? 1 : press})` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: CARD_W, height: u(625), transformOrigin: '0 0', transform: `scale(${scale})`, opacity: ramp(frame, W.tap + 4, 12) }}>
        <WhatsAppDevice frame={frame} />
      </div>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - ramp(frame, W.tap, 8) }}>
        <Notification local={frame - W.drop} />
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
  if (frame < W.exit + 14) return null;
  const logo = spring({ frame: frame - W.exit - 54, fps: 30, config: { damping: 18 } });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Big frame={frame} lines={['Sua saúde,', 'sempre com resposta']} from={W.exit + 18} size={104} accent={['resposta']} />
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
    { at: C.achado, p: at({ x: 170, y: blockTop(C.achado, 'a2') + 124 }, chat) },
    { at: C.receita, p: at({ x: 62, y: blockTop(C.receita, 'a2') + 318 + ACH_GROW }, chat) },
    { at: C.plus, p: at(PLUS, chat) },
    { at: C.search, p: at(SEARCH_AT, chat) },
    { at: C.doc, p: at(DOC_ROW, chat) },
    { at: C.attach, p: at(ATTACH_BTN, chat) },
    { at: C.send2, p: at(SEND, chat) },
    { at: C.hemo, p: at({ x: 120, y: blockTop(C.hemo, 'a3') + 118 }, chat) },
    { at: C.send3, p: at(SEND, chat) },
    { at: C.slot, p: at({ x: 262, y: blockTop(C.slot, 'slots') + 126 }, chat) },
    { at: W.tap, p: { x: 540, y: BANNER.y + BANNER.h / 2 } },
    { at: W.back, p: at({ x: 201, y: N_DONE.y + 46 }, wpp) },
        { at: W.pick, p: at({ x: 162, y: wppTop(W.pick, 'r4') + 130 }, wpp) },
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
        <Headline key={from} frame={frame} lines={[lines]} accent={accent} from={from} to={to} weight={500} size={76} />
      ))}
      <ReceitaPop frame={frame} />
      <Taps frame={frame} chat={chat} home={home} wpp={wpp} />
      <End frame={frame} />
      {frame < W.exit + 18 ? <div style={{ opacity: 1 - ramp(frame, W.exit, 10) }}><Logo /></div> : null}
    </AbsoluteFill>
  );
}

