import type { CSSProperties, ReactNode } from 'react';
import { Img, staticFile } from 'remotion';
import { glide, ramp } from '../agendamento/kit';
import { ICON, Ico, ink, muted, violet, violetSoft, violetStrong } from './ui';

const text = { fontFamily: 'var(--vm-font-text)', color: ink } as const;

export type Rx = { doctor: string; photo: string; spec: string; crm: string; date: string; drug: string; form: string; qty: string; dose: [string, string, string, string, string]; note: string; num: string };

export const CAMILA: Rx = {
  doctor: 'Dra. Camila Rocha',
  photo: 'people/camila-rocha.jpg',
  spec: 'Clínica geral',
  crm: 'CRM-SP 123456',
  date: '06/11/2026',
  drug: 'Dipirona 500 mg',
  form: 'Comprimido',
  qty: '1 caixa',
  dose: ['Tomar 1 comprimido ', 'de 6 em 6 horas', ', ', 'só se tiver dor', '. No máximo 4 por dia.'],
  note: 'Repouso e boa hidratação. Volte se houver febre ou piora da dor.',
  num: '0381',
};

export const MARIANA: Rx = {
  doctor: 'Dra. Mariana Lopes',
  photo: 'people/mariana.jpg',
  spec: 'Ortopedia',
  crm: 'CRM-SP 148220',
  date: '13/11/2026',
  drug: 'Ibuprofeno 400 mg',
  form: 'Comprimido',
  qty: '1 caixa',
  dose: ['Tomar 1 comprimido ', 'de 8 em 8 horas', ', ', 'depois de comer', ', por 5 dias.'],
  note: 'Evite escadas e agachamentos. Gelo no joelho por 15 minutos, 2 vezes ao dia.',
  num: '0412',
};

function In({ local, at, children, style }: { local: number; at: number; children: ReactNode; style?: CSSProperties }) {
  const t = ramp(local, at, 12);
  return <div style={{ opacity: t, transform: `translateY(${(1 - t) * 14}px)`, ...style }}>{children}</div>;
}

function Mark({ on, children }: { on: number; children: ReactNode }) {
  return (
    <span style={{ backgroundImage: 'linear-gradient(#E4D6FD, #E4D6FD)', backgroundRepeat: 'no-repeat', backgroundSize: `${on * 100}% 100%`, backgroundPosition: '0 0', borderRadius: 6, padding: '0 4px', margin: '0 -4px', color: on > 0.6 ? violetStrong : undefined, fontWeight: on > 0.6 ? 500 : undefined }}>
      {children}
    </span>
  );
}

const QR = Array.from({ length: 121 }, (_, i) => {
  const r = Math.floor(i / 11);
  const c = i % 11;
  const finder = (rr: number, cc: number) => r >= rr && r < rr + 3 && c >= cc && c < cc + 3;
  if (finder(0, 0) || finder(0, 8) || finder(8, 0)) return true;
  return ((r * 31 + c * 17 + r * c) % 7) % 3 === 0;
});

export function ReceitaDoc({ rx = CAMILA, local = 999, glow = -1 }: { rx?: Rx; local?: number; glow?: number }) {
  const sign = ramp(local, 30, 22);
  const m1 = glow < 0 ? 0 : ramp(glow, 0, 14, glide);
  const m2 = glow < 0 ? 0 : ramp(glow, 16, 14, glide);
  return (
    <div style={{ width: 800, background: '#fff', borderRadius: 22, overflow: 'hidden', ...text }}>
      <div style={{ height: 12, background: violet }} />
      <div style={{ padding: '40px 52px 44px' }}>
        <In local={local} at={0} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Img src={staticFile('logos/lockup-cor.svg')} style={{ height: 40 }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 19, fontWeight: 500, letterSpacing: '0.14em', color: violetStrong }}>RECEITUÁRIO</div>
            <div style={{ fontSize: 19, color: muted, marginTop: 4 }}>Nº {rx.num}-2026</div>
          </div>
        </In>
        <In local={local} at={3} style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 34, paddingBottom: 28, borderBottom: '2px solid #F0EEF4' }}>
          <Img src={staticFile(rx.photo)} style={{ width: 68, height: 68, borderRadius: 20, objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 500, fontSize: 30 }}>{rx.doctor}</div>
            <div style={{ fontSize: 22, color: muted, marginTop: 4 }}>
              {rx.spec} · {rx.crm}
            </div>
          </div>
        </In>
        <In local={local} at={6} style={{ display: 'flex', gap: 48, marginTop: 24 }}>
          <div>
            <div style={{ fontSize: 18, color: muted, letterSpacing: '0.06em' }}>PACIENTE</div>
            <div style={{ fontSize: 26, fontWeight: 500, marginTop: 4 }}>Helena Souza</div>
          </div>
          <div>
            <div style={{ fontSize: 18, color: muted, letterSpacing: '0.06em' }}>DATA</div>
            <div style={{ fontSize: 26, fontWeight: 500, marginTop: 4 }}>{rx.date}</div>
          </div>
        </In>
        <In local={local} at={10} style={{ marginTop: 40 }}>
          <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: '0.14em', color: violetStrong }}>USO ORAL</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 14 }}>
            <span style={{ fontFamily: 'var(--vm-font-display)', fontWeight: 500, fontSize: 36, letterSpacing: '-0.02em' }}>1. {rx.drug}</span>
            <span style={{ flex: 1, borderBottom: '3px dotted #D5D2DE', transform: 'translateY(-8px)' }} />
            <span style={{ fontSize: 24, color: '#55525F' }}>{rx.qty}</span>
          </div>
          <div style={{ fontSize: 21, color: muted, marginTop: 2 }}>{rx.form}</div>
          <div style={{ fontSize: 27, lineHeight: 1.55, marginTop: 16, color: '#2E2B38' }}>
            {rx.dose[0]}
            <Mark on={m1}>{rx.dose[1]}</Mark>
            {rx.dose[2]}
            <Mark on={m2}>{rx.dose[3]}</Mark>
            {rx.dose[4]}
          </div>
        </In>
        <In local={local} at={14} style={{ marginTop: 30 }}>
          <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: '0.14em', color: violetStrong }}>ORIENTAÇÕES</div>
          <div style={{ fontSize: 24, lineHeight: 1.5, marginTop: 10, color: '#4A4756' }}>{rx.note}</div>
        </In>
        <In local={local} at={18} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 44 }}>
          <div style={{ width: 330 }}>
            <svg width={220} height={54} viewBox="0 0 110 30" fill="none" stroke="#2A1A5E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 22c6-10 10-16 13-14s-6 14-2 14 9-14 12-13-3 11 1 11 6-9 9-8 0 7 3 7 7-6 10-6 2 5 5 5 8-4 12-5 10 1 14 0" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sign} />
            </svg>
            <div style={{ height: 2, background: '#D5D2DE', marginTop: 2 }} />
            <div style={{ fontSize: 21, fontWeight: 500, marginTop: 10 }}>{rx.doctor}</div>
            <div style={{ fontSize: 18, color: muted, marginTop: 2 }}>{rx.crm}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 18, fontWeight: 500, color: violetStrong, background: violetSoft, borderRadius: 999, padding: '6px 12px' }}>
                <Ico d={ICON.check} size={16} color={violetStrong} sw={2.8} />
                Assinada digitalmente
              </div>
              <div style={{ fontSize: 16, color: muted, marginTop: 8 }}>Certificado ICP-Brasil</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 8px)', gap: 1.5, padding: 8, borderRadius: 12, border: '2px solid #F0EEF4' }}>
              {QR.map((on, i) => (
                <span key={i} style={{ width: 8, height: 8, borderRadius: 1.5, background: on ? ink : 'transparent' }} />
              ))}
            </div>
          </div>
        </In>
      </div>
    </div>
  );
}

export function RxNote({ local }: { local: number }) {
  const t = ramp(local, 0, 16);
  return (
    <div style={{ width: 800, boxSizing: 'border-box', display: 'flex', gap: 18, padding: '26px 30px', borderRadius: 26, background: '#fff', boxShadow: '0 30px 60px rgba(20,4,48,.35)', opacity: t, transform: `translateY(${(1 - t) * 40}px)`, ...text }}>
      <span style={{ width: 52, height: 52, borderRadius: 99, flexShrink: 0, background: 'radial-gradient(circle at 35% 30%, #fff 0, #D6C3FB 30%, #7E3BED 75%)', display: 'grid', placeItems: 'center' }}>
        <Ico d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" size={26} color="#fff" sw={1.6} />
      </span>
      <div>
        <div style={{ fontSize: 20, fontWeight: 500, color: muted }}>Super Inteligência explica</div>
        <div style={{ fontSize: 27, lineHeight: 1.45, marginTop: 6 }}>
          Tome <b style={{ fontWeight: 500, color: violetStrong }}>só quando doer</b>, esperando <b style={{ fontWeight: 500, color: violetStrong }}>6 horas</b> entre um comprimido e outro.
        </div>
      </div>
    </div>
  );
}
