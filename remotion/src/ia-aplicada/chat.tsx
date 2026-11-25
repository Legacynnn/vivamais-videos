import type { ReactNode } from 'react';
import { Easing, Img, interpolate, spring, staticFile } from 'remotion';
import { CARD_W, Region, clamp, glide, ramp } from '../agendamento/kit';
import { Receita } from '../agendamento/docs';
import { type Block, ICON, Ico, Rich, Thread, Words, blockY, ink, muted, panel, u, violet, violetSoft, violetStrong } from './ui';

export const SHOT = 'ai-chat--empty';
export const VIEW_TOP = 62;
export const COMPOSER_Y = 495;
export const VIEW_H = COMPOSER_Y - VIEW_TOP;
export const FIT = VIEW_H - 14;

export const C = {
  duvida: 262,
  type1: 276,
  send1: 334,
  ai1: 344,
  chips: 432,
  chip: 470,
  ai2: 488,
  receita: 628,
  plus: 700,
  doc: 722,
  ready: 730,
  type2: 734,
  send2: 766,
  ai3: 776,
  exam3: 846,
  type3: 960,
  send3: 1020,
  ai4: 1030,
  slots: 1046,
  slot: 1168,
  booked: 1176,
};

export const Q1 = 'Posso tomar dipirona com paracetamol?';
export const Q2 = 'Explique meu último exame';
export const Q3 = 'Dor no joelho ao subir escada. Que médico?';

const text = { fontFamily: 'var(--vm-font-text)', color: ink } as const;

function Label() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: u(8), height: u(22) }}>
      <span style={{ ...text, fontWeight: 500, fontSize: u(13), color: muted }}>Super Inteligência</span>
      <span style={{ ...text, fontWeight: 700, fontSize: u(10), color: violetStrong, background: violetSoft, borderRadius: 999, padding: `${u(2)}px ${u(7)}px` }}>IA</span>
      <span style={{ ...text, fontSize: u(12), color: '#A3A0AE' }}>09:41</span>
    </div>
  );
}

function Thinking({ local }: { local: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: u(5), height: u(24), marginTop: u(6) }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: u(7), height: u(7), borderRadius: 99, background: violet, opacity: 0.35 + 0.65 * Math.abs(Math.sin((local + i * 4) / 5)) }} />
      ))}
      <span style={{ ...text, fontSize: u(14), color: muted, marginLeft: u(4) }}>Pensando</span>
    </div>
  );
}

const THINK = 12;

function AI({ local, children }: { local: number; children: (l: number) => ReactNode }) {
  return (
    <div>
      <Label />
      {local < THINK ? <Thinking local={local} /> : <div style={{ marginTop: u(6) }}>{children(local - THINK)}</div>}
    </div>
  );
}

function UserBubble({ children, local }: { children: ReactNode; local: number }) {
  const t = spring({ frame: local, fps: 30, config: { damping: 18, stiffness: 160 } });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <div style={{ maxWidth: u(290), background: violet, color: '#fff', borderRadius: `${u(22)}px ${u(22)}px ${u(6)}px ${u(22)}px`, padding: `${u(11)}px ${u(16)}px`, fontFamily: 'var(--vm-font-text)', fontSize: u(16), lineHeight: 1.38, transformOrigin: 'right bottom', transform: `scale(${0.85 + 0.15 * t})` }}>
        {children}
      </div>
      <div style={{ ...text, fontSize: u(12), color: '#A3A0AE', marginTop: u(5) }}>09:41</div>
    </div>
  );
}

function FileRow({ light }: { light?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: u(8), padding: `${u(8)}px ${u(10)}px`, borderRadius: u(14), background: light ? 'rgba(255,255,255,.16)' : panel }}>
      <Ico d={ICON.file} size={u(20)} color={light ? '#fff' : violet} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--vm-font-text)', fontWeight: 500, fontSize: u(14), color: light ? '#fff' : ink, whiteSpace: 'nowrap' }}>Hemograma - Helena Souza.pdf</div>
        <div style={{ fontFamily: 'var(--vm-font-text)', fontSize: u(12), color: light ? 'rgba(255,255,255,.7)' : muted }}>212 KB</div>
      </div>
    </div>
  );
}

function Action({ d, label }: { d: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: u(6), height: u(32), padding: `0 ${u(12)}px`, borderRadius: 999, background: '#F2F1F6', ...text, fontWeight: 500, fontSize: u(14) }}>
      <Ico d={d} size={u(15)} color={ink} />
      {label}
    </span>
  );
}

const SUMMARY = [
  { k: 'Achado', v: 'Cefaleia tensional' },
  { k: 'Receita', v: 'Dipirona 500 mg, de 6 em 6 horas se tiver dor' },
  { k: 'Exame', v: 'Hemograma completo' },
  { k: 'Retorno', v: 'Se piorar ou tiver febre' },
];

function Summary({ local, frame }: { local: number; frame: number }) {
  const ring = ramp(frame, C.receita, 8);
  const hl = ramp(frame, C.receita + 40, 12);
  return (
    <div style={{ background: panel, borderRadius: u(24), padding: u(8) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: u(12), padding: `${u(6)}px ${u(8)}px ${u(12)}px` }}>
        <Img src={staticFile('people/camila-rocha.jpg')} style={{ width: u(44), height: u(44), borderRadius: u(14), objectFit: 'cover' }} />
        <div>
          <div style={{ ...text, fontWeight: 700, fontSize: u(15) }}>Dra. Camila Rocha</div>
          <div style={{ ...text, fontSize: u(13), color: muted, marginTop: u(2) }}>Clínica geral · sex., 06/11</div>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: u(20), padding: `${u(4)}px ${u(14)}px` }}>
        {SUMMARY.map((row, i) => {
          const t = ramp(local, 4 + i * 5, 12);
          const on = row.k === 'Exame' ? hl : 0;
          return (
            <div key={row.k} style={{ display: 'flex', gap: u(10), padding: `${u(11)}px ${u(6)}px`, margin: `0 ${-u(6)}px`, borderRadius: u(10), background: `rgba(243,237,254,${on})`, borderTop: i ? '1px solid #EFEDF4' : 'none', opacity: t, transform: `translateY(${(1 - t) * u(6)}px)` }}>
              <div style={{ ...text, width: u(70), flexShrink: 0, fontSize: u(12.5), color: muted, paddingTop: u(1.5) }}>{row.k}</div>
              <div style={{ ...text, fontSize: u(15), lineHeight: 1.35, fontWeight: 500 }}>{row.v}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: u(6), padding: `${u(10)}px ${u(4)}px ${u(4)}px`, opacity: ramp(local, 28, 12) }}>
        {['Receita', 'Pedido de exame', 'Atestado'].map((label, i) => (
          <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: u(5), height: u(30), padding: `0 ${u(10)}px`, borderRadius: 999, background: '#fff', ...text, fontWeight: 500, fontSize: u(13), boxShadow: i === 0 ? `0 0 0 ${u(1.5) * ring}px ${violet}` : 'none', color: i === 0 && ring > 0 ? violetStrong : ink }}>
            <Ico d={ICON.file} size={u(13)} color={i === 0 && ring > 0 ? violetStrong : muted} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

const EXAM = [
  { n: 'Hemoglobina', v: '11,2', unit: 'g/dL', val: 11.2, lo: 12, hi: 15.5, low: true },
  { n: 'Hematócrito', v: '36', unit: '%', val: 36, lo: 35, hi: 45 },
  { n: 'Leucócitos', v: '6.800', unit: '/mm³', val: 6800, lo: 4000, hi: 10000 },
  { n: 'Plaquetas', v: '250 mil', unit: '/mm³', val: 250, lo: 150, hi: 400 },
];

function Exam({ local }: { local: number }) {
  return (
    <div style={{ background: panel, borderRadius: u(24), padding: u(8) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: u(10), padding: `${u(6)}px ${u(8)}px ${u(12)}px` }}>
        <Ico d={ICON.file} size={u(20)} color={violet} />
        <div>
          <div style={{ ...text, fontWeight: 700, fontSize: u(15) }}>Hemograma completo</div>
          <div style={{ ...text, fontSize: u(13), color: muted, marginTop: u(1) }}>Coletado em 10/11 · 4 itens</div>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: u(20), padding: `${u(4)}px ${u(14)}px` }}>
        {EXAM.map((row, i) => {
          const at = 4 + i * 6;
          const t = ramp(local, at, 12);
          const span = row.hi - row.lo;
          const min = row.lo - span * 0.5;
          const max = row.hi + span * 0.5;
          const pos = (v: number) => (v - min) / (max - min);
          const slide = ramp(local, at + 6, 16, glide);
          const mark = pos(row.lo + span / 2) + (pos(row.val) - pos(row.lo + span / 2)) * slide;
          const flag = row.low ? ramp(local, 40, 10) : 0;
          const tone = row.low && flag > 0 ? violetStrong : ink;
          return (
            <div key={row.n} style={{ padding: `${u(11)}px 0 ${u(12)}px`, borderTop: i ? '1px solid #EFEDF4' : 'none', opacity: t, transform: `translateY(${(1 - t) * u(6)}px)` }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: u(6) }}>
                  <span style={{ ...text, fontSize: u(14.5), fontWeight: 500 }}>{row.n}</span>
                  {row.low ? <span style={{ ...text, fontSize: u(11.5), fontWeight: 500, color: violetStrong, background: violetSoft, borderRadius: 999, padding: `${u(2)}px ${u(8)}px`, opacity: flag, transform: `scale(${0.8 + 0.2 * flag})` }}>abaixo</span> : null}
                </div>
                <span style={{ fontFamily: 'var(--vm-font-display)', fontWeight: 500, fontSize: u(17), color: tone }}>
                  {row.v} <span style={{ fontFamily: 'var(--vm-font-text)', fontSize: u(12), color: muted }}>{row.unit}</span>
                </span>
              </div>
              <div style={{ position: 'relative', height: u(4), borderRadius: 99, background: '#EDE8F7', marginTop: u(9) }}>
                <div style={{ position: 'absolute', left: `${pos(row.lo) * 100}%`, width: `${(pos(row.hi) - pos(row.lo)) * 100}%`, top: 0, bottom: 0, borderRadius: 99, background: '#D6C3FB' }} />
                <div style={{ position: 'absolute', left: `${mark * 100}%`, top: '50%', width: u(11), height: u(11), borderRadius: 99, background: row.low ? violetStrong : ink, border: `${u(2)}px solid #fff`, transform: 'translate(-50%, -50%)' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Specialty({ local }: { local: number }) {
  const t = ramp(local, 30, 14);
  return (
    <div>
      <div style={{ ...text, fontSize: u(16.5), lineHeight: 1.45 }}>
        <Words local={local} text="Pelo que você contou, o melhor é um **ortopedista**." />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: u(14), marginTop: u(12), background: panel, borderRadius: u(24), padding: u(14), opacity: t, transform: `translateY(${(1 - t) * u(10)}px)` }}>
        <span style={{ width: u(44), height: u(44), borderRadius: u(14), background: '#fff', display: 'grid', placeItems: 'center' }}>
          <Ico d={ICON.bone} size={u(24)} color={violet} sw={1.8} />
        </span>
        <div>
          <div style={{ fontFamily: 'var(--vm-font-display)', fontWeight: 500, fontSize: u(20), color: ink, letterSpacing: '-0.01em' }}>Ortopedia</div>
          <div style={{ ...text, fontSize: u(13), color: muted, marginTop: u(2) }}>Ossos, joelhos e articulações</div>
        </div>
      </div>
    </div>
  );
}

export const SLOTS = ['Amanhã · 09:30', 'sex., 13/11 · 10:00', 'sex., 13/11 · 15:30'];

function Slots({ local, frame }: { local: number; frame: number }) {
  const pick = ramp(frame, C.slot, 8);
  return (
    <div style={{ background: panel, borderRadius: u(24), padding: u(8) }}>
      <div style={{ background: '#fff', borderRadius: u(20), padding: u(14) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: u(12) }}>
          <Img src={staticFile('people/mariana.jpg')} style={{ width: u(44), height: u(44), borderRadius: u(14), objectFit: 'cover' }} />
          <div style={{ flex: 1 }}>
            <div style={{ ...text, fontWeight: 700, fontSize: u(15) }}>Dra. Mariana Lopes</div>
            <div style={{ ...text, fontSize: u(13), color: muted, marginTop: u(2) }}>Ortopedia · ★ 4,9 (128)</div>
          </div>
        </div>
        <div style={{ ...text, fontWeight: 500, fontSize: u(12), color: muted, marginTop: u(14) }}>Próximos horários</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: u(8), marginTop: u(8) }}>
          {SLOTS.map((s, i) => {
            const t = ramp(local, 8 + i * 4, 12);
            const chosen = i === 1;
            return (
              <span key={s} data-slot={i} style={{ display: 'inline-flex', alignItems: 'center', height: u(40), padding: `0 ${u(14)}px`, borderRadius: 999, ...text, fontWeight: 500, fontSize: u(14.5), background: chosen ? `rgba(126,59,237,${pick})` : '#F2F1F6', color: chosen && pick > 0.5 ? '#fff' : ink, opacity: t * (chosen ? 1 : 1 - 0.6 * pick), boxShadow: chosen ? `0 0 0 ${u(3) * pick}px rgba(126,59,237,.25)` : 'none', transform: `scale(${0.9 + 0.1 * t})` }}>
                {s}
              </span>
            );
          })}
        </div>
        <div style={{ marginTop: u(12), height: u(42), borderRadius: 999, border: '1.5px solid #E2E0EA', display: 'grid', placeItems: 'center', ...text, fontWeight: 500, fontSize: u(14), opacity: ramp(local, 22, 12) }}>Ver agenda completa</div>
      </div>
    </div>
  );
}

function Booked({ local }: { local: number }) {
  const t = spring({ frame: local, fps: 30, config: { damping: 15, stiffness: 140 } });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: u(10), background: violetSoft, borderRadius: u(18), padding: `${u(12)}px ${u(14)}px`, transform: `scale(${0.9 + 0.1 * t})`, transformOrigin: 'left center' }}>
      <span style={{ width: u(28), height: u(28), borderRadius: 99, background: violet, display: 'grid', placeItems: 'center' }}>
        <Ico d={ICON.check} size={u(16)} color="#fff" sw={3} />
      </span>
      <span style={{ ...text, fontWeight: 500, fontSize: u(15.5) }}>
        Consulta agendada · <b style={{ fontWeight: 700 }}>sexta, 13/11, 10:00</b>
      </span>
    </div>
  );
}

function Chips({ frame }: { frame: number }) {
  const ring = ramp(frame, C.chip, 8);
  return (
    <div style={{ display: 'flex', gap: u(8) }}>
      {['Entenda sua consulta', 'Explique um exame'].map((label, i) => (
        <span key={label} style={{ display: 'inline-flex', alignItems: 'center', height: u(36), padding: `0 ${u(14)}px`, borderRadius: 999, background: i === 0 && ring > 0 ? `rgba(221,206,252,${0.6 + 0.4 * ring})` : '#EEE6FD', ...text, fontWeight: 500, fontSize: u(14), color: '#4A14A8', whiteSpace: 'nowrap', transform: i === 0 ? `scale(${interpolate(frame, [C.chip - 3, C.chip, C.chip + 6], [1, 0.94, 1], clamp)})` : undefined }}>
          {label}
        </span>
      ))}
    </div>
  );
}

export function chatBlocks(frame: number): Block[] {
  return [
    { id: 'q1', at: C.send1, h: 82, render: (l) => <UserBubble local={l}>{Q1}</UserBubble> },
    {
      id: 'a1',
      at: C.ai1,
      h: 216,
      render: (l) => (
        <AI local={l}>
          {(k) => (
            <>
              <div style={{ ...text, fontSize: u(16.5), lineHeight: 1.45 }}>
                <Words local={k} text="Em geral, sim, alternando os horários. Siga a dose da bula e não passe do limite do dia." rate={0.7} />
              </div>
              <div style={{ ...text, fontSize: u(16.5), lineHeight: 1.45, marginTop: u(10) }}>
                <Words local={k} start={14} text="Se a dor durar mais de **3 dias**, vale chamar o plantão." rate={0.7} />
              </div>
              <div style={{ display: 'flex', gap: u(8), marginTop: u(12), opacity: ramp(k, 30, 10) }}>
                <Action d={ICON.copy} label="Copiar" />
                <Action d={ICON.redo} label="Refazer" />
              </div>
            </>
          )}
        </AI>
      ),
    },
    { id: 'chips', at: C.chips, h: 52, render: () => <Chips frame={frame} /> },
    { id: 'q2', at: C.chip + 6, h: 82, render: (l) => <UserBubble local={l}>Analise minha última consulta</UserBubble> },
    { id: 'a2', at: C.ai2, h: 372, render: (l) => <AI local={l}>{(k) => <Summary local={k} frame={frame} />}</AI> },
    {
      id: 'q3',
      at: C.send2,
      h: 142,
      render: (l) => (
        <UserBubble local={l}>
          <FileRow light />
          <div style={{ marginTop: u(8) }}>{Q2}</div>
        </UserBubble>
      ),
    },
    { id: 'a3', at: C.ai3, h: 352, render: (l) => <AI local={l}>{(k) => <Exam local={k} />}</AI> },
    {
      id: 'a3b',
      at: C.exam3,
      h: 92,
      render: (l) => (
        <div style={{ ...text, fontSize: u(16.5), lineHeight: 1.45 }}>
          <Words local={l} text="Sua **hemoglobina** está um pouco abaixo da faixa. Não é urgente, mas vale mostrar à Dra. Camila." rate={0.7} />
        </div>
      ),
    },
    { id: 'q4', at: C.send3, h: 104, render: (l) => <UserBubble local={l}>{Q3}</UserBubble> },
    { id: 'a4', at: C.ai4, h: 182, render: (l) => <AI local={l}>{(k) => <Specialty local={k} />}</AI> },
    { id: 'slots', at: C.slots, h: 262, render: (l) => <Slots local={l} frame={frame} /> },
    { id: 'booked', at: C.booked, h: 70, render: (l) => <Booked local={l} /> },
  ];
}

export const blockTop = (frame: number, id: string) => blockY(frame, chatBlocks(frame), id, VIEW_TOP, FIT);

function typed(frame: number, from: number, s: string) {
  const n = Math.max(0, Math.min(s.length, Math.floor((frame - from) * 1.1)));
  return s.slice(0, n);
}

function Composer({ frame }: { frame: number }) {
  let value = '';
  if (frame >= C.type1 && frame < C.send1 + 3) value = typed(frame, C.type1, Q1);
  if (frame >= C.type2 && frame < C.send2 + 3) value = typed(frame, C.type2, Q2);
  if (frame >= C.type3 && frame < C.send3 + 3) value = typed(frame, C.type3, Q3);
  const file = frame >= C.ready && frame < C.send2 + 3;
  const active = value.length > 0 || file;
  const sendAt = [C.send1, C.send2, C.send3].find((s) => frame >= s - 3 && frame < s + 8);
  const press = sendAt ? interpolate(frame, [sendAt - 3, sendAt, sendAt + 6], [1, 0.86, 1], clamp) : 1;
  const caret = Math.floor(frame / 8) % 2 === 0;
  return (
    <>
      {value || file ? (
        <div style={{ position: 'absolute', left: u(62), top: u(COMPOSER_Y + 10), width: u(246), height: u(68), background: '#fff', display: 'flex', alignItems: 'center' }}>
          <div style={{ ...text, fontSize: u(16), lineHeight: 1.35 }}>
            {value}
            {value.length < 50 && !file ? <span style={{ display: 'inline-block', width: u(1.5), height: u(19), background: violet, marginLeft: u(1), verticalAlign: 'middle', opacity: caret ? 1 : 0 }} /> : null}
            {file && !value ? <span style={{ color: '#A3A0AE' }}>Pergunte sobre o arquivo</span> : null}
          </div>
        </div>
      ) : null}
      {active || sendAt ? (
        <div style={{ position: 'absolute', left: u(343), top: u(COMPOSER_Y + 37), width: u(40), height: u(40), borderRadius: 99, background: violet, display: 'grid', placeItems: 'center', transform: `scale(${press})` }}>
          <Ico d={ICON.up} size={u(20)} color="#fff" sw={2.4} />
        </div>
      ) : null}
      {file ? (
        <div style={{ position: 'absolute', left: u(16), right: u(16), top: u(COMPOSER_Y - 62), opacity: ramp(frame, C.ready, 10) }}>
          <div style={{ display: 'inline-block', background: '#fff', borderRadius: u(16), boxShadow: '0 6px 20px rgba(20,4,48,.10)' }}>
            <FileRow />
          </div>
        </div>
      ) : null}
    </>
  );
}

function AttachSheet({ frame }: { frame: number }) {
  const t = ramp(frame, C.plus + 2, 18, Easing.bezier(0.32, 0.72, 0, 1)) * (1 - ramp(frame, C.doc + 4, 14, glide));
  if (t <= 0) return null;
  const rows = [
    { d: ICON.camera, l: 'Câmera' },
    { d: ICON.image, l: 'Galeria' },
    { d: ICON.file, l: 'Documento' },
  ];
  const press = ramp(frame, C.doc, 6);
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(23,21,30,.35)', opacity: t }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: u(SHEET_TOP), height: u(400), background: '#fff', borderRadius: `${u(28)}px ${u(28)}px 0 0`, transform: `translateY(${(1 - t) * u(300)}px)`, padding: `${u(10)}px ${u(20)}px` }}>
        <div style={{ width: u(36), height: u(5), borderRadius: 99, background: '#D9D6E2', margin: `0 auto ${u(14)}px` }} />
        <div style={{ fontFamily: 'var(--vm-font-display)', fontWeight: 500, fontSize: u(18), color: ink, marginBottom: u(8) }}>Anexar</div>
        {rows.map((r, i) => (
          <div key={r.l} style={{ display: 'flex', alignItems: 'center', gap: u(14), height: u(54), borderTop: i ? '1px solid #EFEDF4' : 'none', background: i === 2 ? `rgba(243,237,254,${press})` : 'transparent', margin: `0 ${-u(10)}px`, padding: `0 ${u(10)}px`, borderRadius: u(12) }}>
            <span style={{ width: u(36), height: u(36), borderRadius: u(12), background: panel, display: 'grid', placeItems: 'center' }}>
              <Ico d={r.d} size={u(19)} color={violet} />
            </span>
            <span style={{ ...text, fontWeight: 500, fontSize: u(16) }}>{r.l}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export const SHEET_TOP = 350;
export const DOC_ROW = { x: 120, y: SHEET_TOP + 10 + 5 + 14 + 30 + 54 * 2 + 27 };

export function ReceitaPop({ frame }: { frame: number }) {
  const t = Math.min(spring({ frame: frame - C.receita - 4, fps: 30, config: { damping: 17, stiffness: 120 } }), 1 - spring({ frame: frame - C.receita - 44, fps: 30, config: { damping: 22 } }));
  if (t <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: 540, top: 470, transform: `translate(-50%, ${(1 - t) * 700}px) scale(${0.6 + 0.32 * t})`, transformOrigin: 'top center', opacity: Math.min(1, t * 2), filter: `drop-shadow(0 40px 80px rgba(20,4,48,${0.5 * t}))`, zIndex: 40 }}>
      <Receita frame={192 + (frame - C.receita) * 1.4} />
    </div>
  );
}

export function ChatDevice({ frame }: { frame: number }) {
  const blocks = chatBlocks(frame);
  const empty = 1 - ramp(frame, C.duvida + 6, 12, glide);
  const rowFlash = interpolate(frame, [C.duvida - 2, C.duvida, C.duvida + 8], [0, 1, 0], clamp);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: CARD_W, height: u(625), background: '#FDFCFF', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: u(6 - 59), width: CARD_W, height: 0 }}>
        <Region shot={SHOT} r={{ x: 0, y: 59, w: 402, h: 52, radius: 0 }} />
      </div>
      {empty > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: u(VIEW_TOP + 10 - 200), width: CARD_W, height: 0, opacity: empty, transform: `translateY(${-(1 - empty) * u(30)}px)` }}>
          <Region shot={SHOT} r={{ x: 0, y: 200, w: 402, h: 420, radius: 0 }} />
          <div style={{ position: 'absolute', left: u(14), top: u(490), width: u(374), height: u(58), borderRadius: u(14), background: `rgba(126,59,237,${0.08 * rowFlash})` }} />
        </div>
      ) : null}
      <Thread frame={frame} blocks={blocks} top={VIEW_TOP} height={VIEW_H} viewH={FIT} />
      <div style={{ position: 'absolute', left: 0, top: u(COMPOSER_Y - 744), width: CARD_W, height: 0 }}>
        <Region shot={SHOT} r={{ x: 0, y: 744, w: 402, h: 130, radius: 0 }} />
      </div>
      <Composer frame={frame} />
      <AttachSheet frame={frame} />
    </div>
  );
}

export const EMPTY_DUVIDA = { x: 204, y: VIEW_TOP + 10 + (514.75 - 200) };
export const SEND = { x: 363, y: COMPOSER_Y + 57 };
export const PLUS = { x: 39, y: COMPOSER_Y + 57 };
export const COMPOSER = { x: 201, y: COMPOSER_Y + 40 };
