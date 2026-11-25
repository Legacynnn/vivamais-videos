import type { ReactNode } from 'react';
import { Img, interpolate, spring, staticFile } from 'remotion';
import { CARD_W, clamp, ramp } from '../agendamento/kit';
import { Receita } from '../agendamento/docs';
import { type Block, ICON, Ico, Rich, Thread, blockY, u } from './ui';

export const W = {
  open: 1296,
  first: 1300,
  s1: 1330,
  r1: 1352,
  s2: 1426,
  r2: 1446,
  doc: 1454,
  docTap: 1492,
  s3: 1534,
  r3: 1556,
  pick: 1612,
  s4: 1618,
  r4: 1640,
};

const TYPING = [
  [W.s1 + 8, W.r1],
  [W.s2 + 8, W.r2],
  [W.s3 + 8, W.r3],
  [W.s4 + 8, W.r4],
];

export const GREEN = '#25D366';
const SENT = '#D9FDD3';
const META = '#667781';
const sys = { fontFamily: '-apple-system, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif', color: '#111B21' } as const;

export function WhatsAppGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.3 21.7l4.8-1.3A9.8 9.8 0 1 0 12 2.2z" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8.6 7.2c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.2.4 0 .6.5.8 1.1 1.6 1.8 2.2.8.7 1.6 1.1 2.4 1.5.2.1.4.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .2 0 .9-.3 1.5-.3.6-1.5 1.2-2.1 1.2-.5.1-1.2.1-3.6-.9-2.9-1.2-4.6-4.1-4.8-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4z" fill="#fff" />
    </svg>
  );
}

function Verified({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 1.5l2.6 1.9 3.2-.2 1 3 2.7 1.8-1 3 1 3-2.7 1.8-1 3-3.2-.2L12 22.5l-2.6-1.9-3.2.2-1-3-2.7-1.8 1-3-1-3 2.7-1.8 1-3 3.2.2z" fill="#0866FF" />
      <path d="m7.8 12.2 2.8 2.8 5.6-5.8" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Avatar({ size }: { size: number }) {
  return (
    <span style={{ width: size, height: size, borderRadius: 99, background: '#7E3BED', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
      <Img src={staticFile('logos/simbolo-branco.svg')} style={{ width: size * 0.56, height: size * 0.56 }} />
    </span>
  );
}

function Ticks() {
  return (
    <svg width={u(17)} height={u(11)} viewBox="0 0 17 11" fill="none" stroke="#53BDEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m1 6 3 3 6-7M7 8.5l.8.6 6-7" />
    </svg>
  );
}

function Bubble({ me, children, local, width, pad = true }: { me?: boolean; children: ReactNode; local: number; width?: number; pad?: boolean }) {
  const t = spring({ frame: local, fps: 30, config: { damping: 18, stiffness: 170 } });
  return (
    <div style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start' }}>
      <div style={{ position: 'relative', maxWidth: u(300), width: width ? u(width) : undefined, background: me ? SENT : '#fff', borderRadius: u(16), borderTopRightRadius: me ? u(4) : u(16), borderTopLeftRadius: me ? u(16) : u(4), padding: pad ? `${u(7)}px ${u(10)}px ${u(6)}px` : u(4), boxShadow: '0 1px 0.5px rgba(11,20,26,.13)', transformOrigin: me ? 'right top' : 'left top', transform: `scale(${0.9 + 0.1 * t})`, ...sys, fontSize: u(17), lineHeight: 1.3 }}>
        {children}
      </div>
    </div>
  );
}

function Meta({ me }: { me?: boolean }) {
  return (
    <span style={{ float: 'right', display: 'inline-flex', alignItems: 'center', gap: u(3), marginLeft: u(10), marginTop: u(8), marginBottom: -u(4), ...sys, fontSize: u(11), color: META }}>
      09:42
      {me ? <Ticks /> : null}
    </span>
  );
}

function Text({ me, s, local }: { me?: boolean; s: string; local: number }) {
  return (
    <Bubble me={me} local={local}>
      <Rich text={s} />
      <Meta me={me} />
    </Bubble>
  );
}

function Doc({ local, frame }: { local: number; frame: number }) {
  const grow = interpolate(frame, [W.docTap, W.docTap + 10, W.docTap + 34, W.docTap + 46], [1, 1.06, 1.06, 1], clamp);
  return (
    <div style={{ transform: `scale(${grow})`, transformOrigin: 'left center' }}>
      <Bubble local={local} width={270} pad={false}>
        <div style={{ height: u(150), borderRadius: u(12), overflow: 'hidden', background: '#F2F1F6', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '50%', top: u(10), transform: 'translateX(-50%) scale(0.62)', transformOrigin: 'top center' }}>
            <Receita frame={999} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: u(10), padding: `${u(10)}px ${u(8)}px ${u(4)}px` }}>
          <span style={{ width: u(30), height: u(36), borderRadius: u(4), background: '#E5483F', display: 'grid', placeItems: 'center', ...sys, color: '#fff', fontSize: u(9), fontWeight: 700 }}>PDF</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ ...sys, fontSize: u(15), whiteSpace: 'nowrap' }}>Receita - Helena Souza.pdf</div>
            <div style={{ ...sys, fontSize: u(12), color: META, marginTop: u(2) }}>1 página · PDF · 84 KB</div>
          </div>
        </div>
        <div style={{ textAlign: 'right', ...sys, fontSize: u(11), color: META, padding: `0 ${u(6)}px ${u(2)}px` }}>09:42</div>
      </Bubble>
    </div>
  );
}

export const OPTIONS = ['seg., 16/11 · 09:00', 'seg., 16/11 · 14:30', 'ter., 17/11 · 10:00'];

function Buttons({ local, frame }: { local: number; frame: number }) {
  const pick = ramp(frame, W.pick, 8);
  return (
    <div style={{ width: u(300) }}>
      <Bubble local={local}>
        A Dra. Camila tem estes horários:
        <Meta />
      </Bubble>
      {OPTIONS.map((o, i) => {
        const t = ramp(local, 8 + i * 5, 12);
        const chosen = i === 1;
        const press = chosen ? interpolate(frame, [W.pick - 3, W.pick, W.pick + 6], [1, 0.95, 1], clamp) : 1;
        return (
          <div key={o} style={{ marginTop: u(4), height: u(42), borderRadius: u(14), background: chosen ? `rgba(240,242,245,${pick})` : '#fff', boxShadow: '0 1px 0.5px rgba(11,20,26,.13)', display: 'grid', placeItems: 'center', ...sys, fontSize: u(16), color: '#027EB5', opacity: t, transform: `translateY(${(1 - t) * u(8)}px) scale(${press})` }}>
            {o}
          </div>
        );
      })}
    </div>
  );
}

export function wppBlocks(frame: number): Block[] {
  return [
    {
      id: 'day',
      at: W.open,
      h: 40,
      render: () => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span style={{ background: '#fff', borderRadius: u(8), padding: `${u(4)}px ${u(10)}px`, ...sys, fontSize: u(12.5), color: '#54656F', boxShadow: '0 1px 0.5px rgba(11,20,26,.13)' }}>Hoje</span>
        </div>
      ),
    },
    { id: 'm0', at: W.first, h: 88, render: (l) => <Text local={l} s="Sua consulta está marcada. Precisa de algo? É só chamar por aqui." /> },
    { id: 's1', at: W.s1, h: 52, render: (l) => <Text me local={l} s="Que horas é minha consulta?" /> },
    { id: 'r1', at: W.r1, h: 112, render: (l) => <Text local={l} s="Oi, Helena! Sua consulta é **sexta, 13/11, às 10:00**, com a Dra. Mariana Lopes (Ortopedia)." /> },
    { id: 's2', at: W.s2, h: 52, render: (l) => <Text me local={l} s="Me manda minha receita" /> },
    { id: 'r2', at: W.r2, h: 64, render: (l) => <Text local={l} s="Aqui está a receita da consulta de **06/11**." /> },
    { id: 'doc', at: W.doc, h: 240, render: (l) => <Doc local={l} frame={frame} /> },
    { id: 's3', at: W.s3, h: 52, render: (l) => <Text me local={l} s="Quero marcar meu retorno" /> },
    { id: 'r3', at: W.r3, h: 196, render: (l) => <Buttons local={l} frame={frame} /> },
    { id: 's4', at: W.s4, h: 52, render: (l) => <Text me local={l} s="seg., 16/11 · 14:30" /> },
    { id: 'r4', at: W.r4, h: 112, render: (l) => <Text local={l} s="Pronto! **Retorno marcado** para segunda, 16/11, às 14:30, com a Dra. Camila. Já está no seu app." /> },
  ];
}

export const WV_TOP = 64;
export const WV_H = 625 - 60 - WV_TOP;
export const WFIT = WV_H - 10;
export const wppTop = (frame: number, id: string) => blockY(frame, wppBlocks(frame), id, WV_TOP, WFIT, true);

export function WhatsAppDevice({ frame }: { frame: number }) {
  const typing = TYPING.some(([a, b]) => frame >= a && frame < b);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: CARD_W, height: u(625), background: '#EFEAE2', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.35, backgroundImage: 'radial-gradient(rgba(84,101,111,.18) 1.2px, transparent 1.4px)', backgroundSize: `${u(18)}px ${u(18)}px` }} />
      <Thread frame={frame} blocks={wppBlocks(frame)} top={WV_TOP} height={WV_H} viewH={WFIT} pad={12} fade={10} top0 />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: u(WV_TOP), background: '#fff', display: 'flex', alignItems: 'center', gap: u(8), padding: `0 ${u(10)}px`, borderBottom: '1px solid #E9EDEF', boxSizing: 'border-box' }}>
        <Ico d={ICON.back} size={u(26)} color="#0A7CFF" sw={2.4} />
        <Avatar size={u(38)} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: u(4), ...sys, fontSize: u(17), fontWeight: 600 }}>
            Viva Mais <Verified size={u(16)} />
          </div>
          <div style={{ ...sys, fontSize: u(12.5), color: typing ? GREEN : META, marginTop: u(1) }}>{typing ? 'digitando…' : 'conta comercial'}</div>
        </div>
        <Ico d={ICON.video} size={u(24)} color="#0A7CFF" sw={1.8} />
        <Ico d={ICON.phone} size={u(21)} color="#0A7CFF" sw={1.8} style={{ marginLeft: u(14), marginRight: u(4) }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: u(60), background: '#F6F5F3', display: 'flex', alignItems: 'center', gap: u(10), padding: `0 ${u(12)}px`, borderTop: '1px solid #E9EDEF' }}>
        <Ico d={ICON.plus} size={u(26)} color="#0A7CFF" sw={2} />
        <div style={{ flex: 1, height: u(36), borderRadius: 99, background: '#fff', border: '1px solid #E2E2E2', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: `0 ${u(10)}px` }}>
          <Ico d={ICON.sticker} size={u(20)} color="#8696A0" sw={1.8} />
        </div>
        <Ico d={ICON.camera} size={u(24)} color="#0A7CFF" sw={1.8} />
        <Ico d={ICON.mic} size={u(24)} color="#0A7CFF" sw={1.8} />
      </div>
    </div>
  );
}

export function Notification({ local }: { local: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 26, padding: '30px 34px', fontFamily: sys.fontFamily }}>
      <span style={{ width: 84, height: 84, borderRadius: 20, background: GREEN, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <WhatsAppGlyph size={58} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 34, fontWeight: 600, color: '#111' }}>
          Viva Mais <span style={{ fontWeight: 400, fontSize: 28, color: '#6E6E73' }}>agora</span>
        </div>
        <div style={{ fontSize: 31, lineHeight: 1.3, color: '#1C1C1E', marginTop: 6, opacity: ramp(local, 4, 10) }}>Sua consulta está marcada. Precisa de algo? É só chamar por aqui.</div>
      </div>
    </div>
  );
}
