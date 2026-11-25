import type { ReactNode } from 'react';
import { Img, interpolate, spring, staticFile } from 'remotion';
import { CARD_W, clamp, glide, ramp } from '../agendamento/kit';
import { MARIANA, ReceitaDoc } from './receita';
import { type Block, ICON, Ico, Rich, Thread, blockY, u } from './ui';

export const W = {
  recede: 1416,
  drop: 1448,
  tap: 1498,
  open: 1504,
  first: 1508,
  s1: 1536,
  r1: 1558,
  s2: 1620,
  r2: 1640,
  lock: 1690,
  soon: 1716,
  skip: 1784,
  done: 1796,
  back: 1830,
  ended: 1852,
  m3: 1858,
  doc: 1868,
  pedido: 1880,
  s3: 1910,
  r3: 1930,
  s4: 1982,
  r4: 2002,
  pick: 2050,
  s5: 2056,
  r5: 2074,
  exit: 2112,
};

const TYPING = [
  [W.s1 + 8, W.r1],
  [W.s2 + 8, W.r2],
  [W.ended, W.m3],
  [W.s3 + 8, W.r3],
  [W.s4 + 8, W.r4],
  [W.s5 + 6, W.r5],
];

export const GREEN = '#25D366';
const SENT = '#D9FDD3';
const META = '#667781';
const sys = { fontFamily: '-apple-system, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif', color: '#111B21' } as const;
const display = { fontFamily: '-apple-system, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif' } as const;

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

function Meta({ me, time }: { me?: boolean; time: string }) {
  return (
    <span style={{ float: 'right', display: 'inline-flex', alignItems: 'center', gap: u(3), marginLeft: u(10), marginTop: u(8), marginBottom: -u(4), ...sys, fontSize: u(11), color: META }}>
      {time}
      {me ? <Ticks /> : null}
    </span>
  );
}

function Text({ me, s, local, time = '09:12' }: { me?: boolean; s: string; local: number; time?: string }) {
  return (
    <Bubble me={me} local={local}>
      <Rich text={s} />
      <Meta me={me} time={time} />
    </Bubble>
  );
}

function PdfBadge() {
  return <span style={{ width: u(30), height: u(36), borderRadius: u(4), background: '#E5483F', display: 'grid', placeItems: 'center', ...sys, color: '#fff', fontSize: u(9), fontWeight: 700, flexShrink: 0 }}>PDF</span>;
}

function Doc({ local }: { local: number }) {
  return (
    <Bubble local={local} width={270} pad={false}>
      <div style={{ height: u(150), borderRadius: u(12), overflow: 'hidden', background: '#F2F1F6', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '50%', top: u(8), transform: 'translateX(-50%) scale(0.7)', transformOrigin: 'top center' }}>
          <ReceitaDoc rx={MARIANA} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: u(10), padding: `${u(10)}px ${u(8)}px ${u(4)}px` }}>
        <PdfBadge />
        <div style={{ minWidth: 0 }}>
          <div style={{ ...sys, fontSize: u(15), whiteSpace: 'nowrap' }}>Receita - Helena Souza.pdf</div>
          <div style={{ ...sys, fontSize: u(12), color: META, marginTop: u(2) }}>1 página · PDF · 84 KB</div>
        </div>
      </div>
      <div style={{ textAlign: 'right', ...sys, fontSize: u(11), color: META, padding: `0 ${u(6)}px ${u(2)}px` }}>10:32</div>
    </Bubble>
  );
}

function SmallDoc({ local, name, meta }: { local: number; name: string; meta: string }) {
  return (
    <Bubble local={local} width={270} pad={false}>
      <div style={{ display: 'flex', alignItems: 'center', gap: u(10), padding: u(8), borderRadius: u(12), background: '#F5F6F6' }}>
        <PdfBadge />
        <div style={{ minWidth: 0 }}>
          <div style={{ ...sys, fontSize: u(15), whiteSpace: 'nowrap' }}>{name}</div>
          <div style={{ ...sys, fontSize: u(12), color: META, marginTop: u(2) }}>{meta}</div>
        </div>
      </div>
      <div style={{ textAlign: 'right', ...sys, fontSize: u(11), color: META, padding: `${u(3)}px ${u(6)}px ${u(2)}px` }}>10:32</div>
    </Bubble>
  );
}

export const OPTIONS = ['seg., 23/11 · 09:00', 'seg., 23/11 · 14:30', 'ter., 24/11 · 10:00'];

function Buttons({ local, frame }: { local: number; frame: number }) {
  const pick = ramp(frame, W.pick, 8);
  return (
    <div style={{ width: u(300) }}>
      <Bubble local={local}>
        A Dra. Mariana tem estes horários para o retorno:
        <Meta time="10:34" />
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

function Chip({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <span style={{ background: '#fff', borderRadius: u(8), padding: `${u(4)}px ${u(10)}px`, ...sys, fontSize: u(12.5), color: '#54656F', boxShadow: '0 1px 0.5px rgba(11,20,26,.13)' }}>{label}</span>
    </div>
  );
}

export function wppBlocks(frame: number): Block[] {
  return [
    { id: 'day', at: W.open, h: 50, render: () => <Chip label="Hoje" /> },
    { id: 'm0', at: W.first, h: 112, render: (l) => <Text local={l} time="09:10" s="Consulta confirmada: **sexta, 13/11, às 10:00** com a Dra. Mariana Lopes. Dúvidas? É só responder aqui." /> },
    { id: 's1', at: W.s1, h: 52, render: (l) => <Text me local={l} s="Como me preparo pra consulta?" /> },
    { id: 'r1', at: W.r1, h: 112, render: (l) => <Text local={l} s="Escolha um lugar calmo e com boa internet. Já deixei seu **hemograma** disponível pra Dra. Mariana." /> },
    { id: 's2', at: W.s2, h: 52, render: (l) => <Text me local={l} s="E se eu precisar remarcar?" /> },
    { id: 'r2', at: W.r2, h: 90, render: (l) => <Text local={l} s="É só me pedir aqui. E eu te aviso **5 min antes** de começar." /> },
    { id: 'end', at: W.ended, h: 50, render: () => <Chip label="Consulta encerrada · 10:31" /> },
    { id: 'm3', at: W.m3, h: 90, render: (l) => <Text local={l} time="10:32" s="Sua consulta terminou. Aqui estão seus **documentos**:" /> },
    { id: 'doc', at: W.doc, h: 238, render: (l) => <Doc local={l} /> },
    { id: 'ped', at: W.pedido, h: 84, render: (l) => <SmallDoc local={l} name="Pedido - Raio-X do joelho.pdf" meta="1 página · PDF · 62 KB" /> },
    { id: 's3', at: W.s3, h: 52, render: (l) => <Text me local={l} time="10:33" s="Como tomo esse remédio?" /> },
    { id: 'r3', at: W.r3, h: 112, render: (l) => <Text local={l} time="10:33" s="1 comprimido de **8 em 8 horas**, depois de comer, por **5 dias**. Gelo no joelho também ajuda." /> },
    { id: 's4', at: W.s4, h: 52, render: (l) => <Text me local={l} time="10:34" s="Quero marcar o retorno" /> },
    { id: 'r4', at: W.r4, h: 214, render: (l) => <Buttons local={l} frame={frame} /> },
    { id: 's5', at: W.s5, h: 52, render: (l) => <Text me local={l} time="10:34" s="seg., 23/11 · 14:30" /> },
    { id: 'r5', at: W.r5, h: 112, render: (l) => <Text local={l} time="10:34" s="Pronto! **Retorno marcado** para segunda, 23/11, às 14:30, com a Dra. Mariana. Já está no seu app." /> },
  ];
}

export const WV_TOP = 64;
export const WV_H = 625 - 60 - WV_TOP;
export const WFIT = WV_H - 10;
export const wppTop = (frame: number, id: string) => blockY(frame, wppBlocks(frame), id, WV_TOP, WFIT, true);

function Chat({ frame }: { frame: number }) {
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

export const N_SOON = { x: 12, y: 214, w: 378, h: 92 };
export const N_DONE = { x: 12, y: 214, w: 378, h: 92 };

function LockNote({ title, body, when, style }: { title: string; body: ReactNode; when: string; style?: React.CSSProperties }) {
  return (
    <div style={{ position: 'absolute', left: u(N_SOON.x), width: u(N_SOON.w), boxSizing: 'border-box', minHeight: u(N_SOON.h), display: 'flex', gap: u(10), padding: `${u(12)}px ${u(14)}px`, borderRadius: u(22), background: 'rgba(245,242,252,.82)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 30px rgba(10,0,40,.25)', ...style }}>
      <span style={{ width: u(36), height: u(36), borderRadius: u(9), background: GREEN, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <WhatsAppGlyph size={u(25)} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...sys, fontSize: u(14.5), fontWeight: 600 }}>
          {title}
          <span style={{ fontWeight: 400, fontSize: u(12.5), color: '#6E6E73' }}>{when}</span>
        </div>
        <div style={{ ...sys, fontSize: u(14.5), lineHeight: 1.3, marginTop: u(2), color: '#1C1C1E' }}>{body}</div>
      </div>
    </div>
  );
}

function Clock({ frame }: { frame: number }) {
  const t = ramp(frame, W.skip, 14, glide);
  const digits = (s: string, y: number, o: number) => (
    <div style={{ position: 'absolute', inset: 0, textAlign: 'center', transform: `translateY(${u(y)}px)`, opacity: o }}>{s}</div>
  );
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: u(82), height: u(96), overflow: 'hidden', ...display, fontWeight: 600, fontSize: u(84), letterSpacing: '-0.02em', color: 'rgba(255,255,255,.95)', lineHeight: 1.1 }}>
      {digits('09:55', -60 * t, 1 - t)}
      {digits('10:32', 60 * (1 - t), t)}
    </div>
  );
}

function Lock({ frame }: { frame: number }) {
  const soon = ramp(frame, W.soon, 16, glide);
  const done = ramp(frame, W.done, 16, glide);
  const pressSoon = interpolate(frame, [W.soon + 40, W.soon + 44, W.soon + 52], [1, 0.97, 1], clamp);
  const pressDone = interpolate(frame, [W.back - 3, W.back, W.back + 6], [1, 0.96, 1], clamp);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'linear-gradient(165deg, #1E0750 0%, #4A14A8 45%, #7E3BED 80%, #A98BF7 100%)' }}>
      <div style={{ position: 'absolute', left: '-30%', top: '35%', width: '160%', height: '70%', borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(214,195,251,.35), transparent)' }} />
      <div style={{ position: 'absolute', left: u(22), right: u(22), top: u(16), display: 'flex', justifyContent: 'space-between', ...sys, fontSize: u(13), fontWeight: 600, color: '#fff' }}>
        <span>Vivo</span>
        <span>100%</span>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: u(56), textAlign: 'center', ...sys, fontSize: u(17), fontWeight: 600, color: 'rgba(255,255,255,.85)' }}>sexta-feira, 13 de novembro</div>
      <Clock frame={frame} />
      {soon > 0 ? (
        <LockNote
          title="Viva Mais"
          when={done > 0.5 ? '37 min' : 'agora'}
          body={
            <>
              Sua consulta com a Dra. Mariana começa em <b style={{ fontWeight: 600 }}>5 min</b>. Toque para entrar na sala.
            </>
          }
          style={{ top: u(N_SOON.y + (1 - soon) * -40 + done * 104), opacity: soon * (1 - 0.45 * done), transform: `scale(${(1 - 0.06 * done) * pressSoon})` }}
        />
      ) : null}
      {done > 0 ? (
        <LockNote
          title="Viva Mais"
          when="agora"
          body={
            <>
              Sua consulta terminou. <b style={{ fontWeight: 600 }}>Receita e pedido de exame</b> já estão aqui.
            </>
          }
          style={{ top: u(N_DONE.y - (1 - done) * 40), opacity: done, transform: `scale(${pressDone})` }}
        />
      ) : null}
      <div style={{ position: 'absolute', left: u(46), right: u(46), bottom: u(40), display: 'flex', justifyContent: 'space-between' }}>
        {[ICON.phone, ICON.camera].map((d, i) => (
          <span key={i} style={{ width: u(50), height: u(50), borderRadius: 99, background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(10px)', display: 'grid', placeItems: 'center' }}>
            <Ico d={i ? ICON.camera : 'M9 2h6l1 5-2 3v11a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V10L8 7z'} size={u(22)} color="#fff" sw={1.8} />
          </span>
        ))}
      </div>
    </div>
  );
}

export function WhatsAppDevice({ frame }: { frame: number }) {
  const home = ramp(frame, W.lock, 14, glide);
  const lockIn = ramp(frame, W.lock + 4, 12);
  const back = ramp(frame, W.back + 2, 22, glide);
  const inset = (v: number) => u(v) * (1 - back);
  const clip = `inset(${inset(N_DONE.y)}px ${inset(402 - N_DONE.x - N_DONE.w)}px ${inset(625 - N_DONE.y - N_DONE.h)}px ${inset(N_DONE.x)}px round ${u(22) + (64 - u(22)) * back}px)`;
  return (
    <>
      {frame < W.lock + 16 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${1 - 0.1 * home})`, opacity: 1 - home }}>
          <Chat frame={frame} />
        </div>
      ) : null}
      {frame >= W.lock && frame < W.back + 26 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: lockIn }}>
          <Lock frame={frame} />
        </div>
      ) : null}
      {frame >= W.back + 2 ? (
        <div style={{ position: 'absolute', inset: 0, clipPath: clip }}>
          <Chat frame={frame} />
        </div>
      ) : null}
    </>
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
        <div style={{ fontSize: 31, lineHeight: 1.3, color: '#1C1C1E', marginTop: 6, opacity: ramp(local, 4, 10) }}>Consulta confirmada: sexta, 13/11, às 10:00 com a Dra. Mariana. Dúvidas? Responda aqui.</div>
      </div>
    </div>
  );
}
