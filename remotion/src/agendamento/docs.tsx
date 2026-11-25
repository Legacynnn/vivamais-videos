import type { ReactNode } from 'react';
import { AbsoluteFill, Easing, Img, spring, staticFile, useCurrentFrame } from 'remotion';
import { Card, Headline, K, Pop, Shot, Tap, glide, ramp, rect, shotHeight, track } from './kit';

const PRE = 'post-consultation--preparing';
const READY = 'post-consultation--ready';
const T = { ready: 58, docs: 104, tap: 168, sheet: 174, page: 192 };
export const DOCS_FRAMES = 300;

const ink = '#17151E';
const muted = '#726F80';

function Line({ frame, at, children, style }: { frame: number; at: number; children: ReactNode; style?: React.CSSProperties }) {
  const t = ramp(frame, at, 14);
  return <div style={{ opacity: t, transform: `translateY(${(1 - t) * 6 * K}px)`, ...style }}>{children}</div>;
}

const u = (n: number) => n * K;

export function Receita({ frame }: { frame: number }) {
  const at = (i: number) => T.page + i * 5;
  const sign = ramp(frame, at(7), 22, Easing.bezier(0.45, 0, 0.2, 1));
  return (
    <div style={{ width: u(340), padding: `${u(22)}px ${u(22)}px ${u(20)}px`, boxSizing: 'border-box', background: '#fff', borderRadius: u(6), boxShadow: `0 ${u(4)}px ${u(16)}px rgba(20,4,48,.12)`, fontFamily: 'var(--vm-font-text)', color: ink }}>
      <Line frame={frame} at={at(0)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Img src={staticFile('logos/lockup-cor.svg')} style={{ height: u(16) }} />
        <span style={{ fontSize: u(8), color: muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Receituário simples</span>
      </Line>
      <div style={{ height: 1, background: '#EFEDF4', margin: `${u(14)}px 0` }} />
      <Line frame={frame} at={at(1)} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: u(7), color: muted }}>Paciente</div>
          <div style={{ fontSize: u(10.5), fontWeight: 500, marginTop: u(2) }}>Helena Souza</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: u(7), color: muted }}>Data</div>
          <div style={{ fontSize: u(10.5), fontWeight: 500, marginTop: u(2) }}>11/11/2026</div>
        </div>
      </Line>
      <Line frame={frame} at={at(2)} style={{ marginTop: u(20), fontSize: u(7.5), fontWeight: 500, color: '#6A24DB', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Uso oral</Line>
      <Line frame={frame} at={at(3)} style={{ marginTop: u(8), display: 'flex', alignItems: 'baseline', gap: u(4), fontSize: u(11.5), fontWeight: 500 }}>
        <span>1. Dipirona 500 mg</span>
        <span style={{ flex: 1, borderBottom: `${u(0.8)}px dotted #C9C6D3`, transform: `translateY(-${u(3)}px)` }} />
        <span style={{ fontWeight: 400, color: '#55525F' }}>1 caixa</span>
      </Line>
      <Line frame={frame} at={at(4)} style={{ marginTop: u(5), fontSize: u(9.5), lineHeight: 1.45, color: '#55525F' }}>Tomar 1 comprimido de 6 em 6 horas, se tiver dor.</Line>
      <Line frame={frame} at={at(5)} style={{ marginTop: u(18), fontSize: u(7.5), fontWeight: 500, color: '#6A24DB', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Orientações</Line>
      <Line frame={frame} at={at(6)} style={{ marginTop: u(6), fontSize: u(9.5), lineHeight: 1.45, color: '#55525F' }}>Repouso e boa hidratação. Volte se houver febre ou piora da dor.</Line>
      <div style={{ marginTop: u(34), display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width={u(110)} height={u(30)} viewBox="0 0 110 30" fill="none" stroke="#2A1A5E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 22c6-10 10-16 13-14s-6 14-2 14 9-14 12-13-3 11 1 11 6-9 9-8 0 7 3 7 7-6 10-6 2 5 5 5 8-4 12-5 10 1 14 0" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sign} />
        </svg>
        <div style={{ width: u(150), height: 1, background: '#C9C6D3' }} />
        <Line frame={frame} at={at(8)} style={{ marginTop: u(6), textAlign: 'center' }}>
          <div style={{ fontSize: u(9.5), fontWeight: 500 }}>Dra. Camila Rocha</div>
          <div style={{ fontSize: u(7.5), color: muted, marginTop: u(2) }}>CRM-SP 123456 · Clínica geral</div>
        </Line>
      </div>
      <Line frame={frame} at={at(9)} style={{ marginTop: u(16), alignSelf: 'center', display: 'flex', justifyContent: 'center' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: u(5), padding: `${u(5)}px ${u(10)}px`, borderRadius: 999, background: '#F3EDFE', color: '#6A24DB', fontSize: u(8.5), fontWeight: 500 }}>
          <svg width={u(10)} height={u(10)} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3.5 8.5 3 3 6-7" />
          </svg>
          Assinada digitalmente
        </span>
      </Line>
    </div>
  );
}

function Viewer({ frame, camY }: { frame: number; camY: number }) {
  const t = ramp(frame, T.sheet, 24, Easing.bezier(0.32, 0.72, 0, 1));
  if (t <= 0) return null;
  const top = camY + 64;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(23,21,30,.4)', opacity: t }} />
      <div style={{ position: 'absolute', left: 0, top: u(top), width: '100%', height: u(900), borderRadius: `${u(28)}px ${u(28)}px 0 0`, background: '#F2F1F6', overflow: 'hidden', transform: `translateY(${(1 - t) * u(720)}px)` }}>
        <div style={{ background: '#FDFCFF', padding: `${u(10)}px ${u(20)}px ${u(14)}px` }}>
          <div style={{ width: u(36), height: u(5), borderRadius: 999, background: '#D9D6E2', margin: `0 auto ${u(12)}px` }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'var(--vm-font-display)', fontWeight: 500, fontSize: u(18), letterSpacing: '-0.01em', color: ink }}>Receita simples</div>
              <div style={{ fontFamily: 'var(--vm-font-text)', fontSize: u(12), color: muted, marginTop: u(2) }}>Dra. Camila Rocha · 11/11/2026</div>
            </div>
            <span style={{ width: u(38), height: u(38), borderRadius: u(19), background: '#F2F1F6', display: 'grid', placeItems: 'center' }}>
              <svg width={u(17)} height={u(17)} viewBox="0 0 24 24" fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
              </svg>
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: u(18) }}>
          <Receita frame={frame} />
        </div>
      </div>
    </>
  );
}

export function Docs() {
  const frame = useCurrentFrame();
  const camY = track(frame, [{ at: 0, v: 0 }, { at: T.docs, v: 520, dur: 40 }]);
  const ready = ramp(frame, T.ready, 14);
  const lift = spring({ frame: frame - T.ready - 4, fps: 30, config: { damping: 200 }, durationInFrames: 16 });
  return (
    <AbsoluteFill>
      <Headline frame={frame} lines={['Depois da consulta']} accent={['consulta']} from={8} to={T.ready + 8} />
      <Headline frame={frame} lines={['Documentos no app']} accent={['app']} from={T.ready + 20} to={T.sheet} />
      <Headline frame={frame} lines={['Abra quando quiser']} accent={['quiser']} from={T.sheet + 12} />
      <Card camY={camY} height={shotHeight(READY)}>
        <Shot shot={PRE} />
        <Shot shot={READY} style={{ opacity: ready, transform: `translateY(${(1 - lift) * 14 * K}px)` }} />
        <Viewer frame={frame} camY={camY} />
      </Card>
      <Pop frame={frame} from={T.ready + 6} to={T.ready + 40} camY={camY} shot={READY} r={rect(READY, 'docs')} lift={60} scale={1.5} />
      <Tap frame={frame} at={T.tap} camY={camY} r={rect(READY, 'receita')} />
    </AbsoluteFill>
  );
}
