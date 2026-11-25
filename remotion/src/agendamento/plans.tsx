import type { ReactNode } from 'react';
import { Easing, Img, interpolate, spring, staticFile } from 'remotion';
import { CARD_TOP, CARD_W, CARD_X, Finger, Headline, clamp, glide, ramp, rect, swap } from './kit';

type Kind = 'clinico' | 'psicologia' | 'nutricao' | 'desconto' | 'farmacia' | 'assistente' | 'whatsapp';

const ACCENT = { fill: 'currentColor', fillOpacity: 0.3 } as const;

const GLYPHS: Record<Kind, ReactNode> = {
  clinico: (
    <>
      <circle cx="18" cy="10.5" r="2.5" {...ACCENT} />
      <path d="M6 3.5v4.5a4 4 0 0 0 8 0V3.5M5 3.5h2M13 3.5h2M10 12v2.5a4 4 0 0 0 8 0V13" />
    </>
  ),
  psicologia: (
    <>
      <path d="M8.5 21v-3.2A7.5 7.5 0 1 1 19.4 11l1.6 3.4h-2.2v2.3a2.3 2.3 0 0 1-2.3 2.3h-2V21" />
      <path d="M12 13.2l-2.3-2.3a1.55 1.55 0 0 1 2.3-2.1 1.55 1.55 0 0 1 2.3 2.1z" strokeWidth={1.5} {...ACCENT} />
    </>
  ),
  nutricao: (
    <>
      <path d="M12 8c-1.6-1.1-5.3-1.3-6.6 1.9C4 13.2 6.1 21 9.4 21c1 0 1.6-.5 2.6-.5s1.6.5 2.6.5c3.3 0 5.4-7.8 4-11.1C17.3 6.7 13.6 6.9 12 8z" {...ACCENT} />
      <path d="M12 8c0-2.6 1.6-4.4 4.2-4.4 0 2.6-1.6 4.4-4.2 4.4z" fill="currentColor" />
    </>
  ),
  desconto: (
    <>
      <path d="M12.6 2.9a2 2 0 0 0-1.4-.6H4.3a2 2 0 0 0-2 2v6.9a2 2 0 0 0 .6 1.4l8.4 8.4a2.4 2.4 0 0 0 3.4 0l6.4-6.4a2.4 2.4 0 0 0 0-3.4z" {...ACCENT} />
      <circle cx="7.3" cy="7.3" r="1.3" strokeWidth={1.5} />
      <path d="M11.2 15.6l4.4-4.4" />
    </>
  ),
  farmacia: (
    <>
      <path d="M8.5 8.5 3.6 13.4a4.95 4.95 0 0 0 7 7l4.9-4.9z" stroke="none" {...ACCENT} />
      <path d="M10.6 20.4l9.8-9.8a4.95 4.95 0 0 0-7-7l-9.8 9.8a4.95 4.95 0 0 0 7 7zM8.5 8.5l7 7" />
    </>
  ),
  assistente: (
    <>
      <path d="M10.5 3c.7 4.6 2.9 6.8 7.5 7.5-4.6.7-6.8 2.9-7.5 7.5-.7-4.6-2.9-6.8-7.5-7.5 4.6-.7 6.8-2.9 7.5-7.5z" {...ACCENT} />
      <path d="M18.5 15.5c.3 1.5.9 2.1 2.4 2.4-1.5.3-2.1.9-2.4 2.4-.3-1.5-.9-2.1-2.4-2.4 1.5-.3 2.1-.9 2.4-2.4z" fill="currentColor" strokeWidth={1.2} />
    </>
  ),
  whatsapp: (
    <>
      <path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2z" {...ACCENT} />
      <path d="M9 8.4c.4-.4.9-.3 1.1.1l.7 1.4c.1.3.1.6-.2.8l-.5.4a5.4 5.4 0 0 0 2.8 2.8l.4-.5c.2-.3.5-.3.8-.2l1.4.7c.4.2.5.7.1 1.1-.7.7-1.5 1-2.4.8a7.3 7.3 0 0 1-5-5c-.2-.9.1-1.7.8-2.4z" fill="currentColor" strokeWidth={0.8} />
    </>
  ),
};

type Plan = { name: string; tagline: string; featured?: boolean; monthly: string; annual: string; saving: number; billed: string; features: [Kind, string][] };

const PLANS: Plan[] = [
  {
    name: 'Básico',
    tagline: 'O essencial para consultar pagando menos.',
    monthly: '19,90',
    annual: '16,58',
    saving: 17,
    billed: '198,96',
    features: [
      ['clinico', 'Clínica geral por R$ 39,90'],
      ['psicologia', 'Psicologia por R$ 59,90'],
      ['desconto', 'Desconto em Cardiologia'],
      ['farmacia', 'Até 12% de desconto em farmácias'],
      ['assistente', 'Assistente com IA que lê suas consultas'],
    ],
  },
  {
    name: 'Completo',
    tagline: 'Mais desconto em consultas, especialistas e farmácia.',
    featured: true,
    monthly: '39,90',
    annual: '24,92',
    saving: 38,
    billed: '299,04',
    features: [
      ['clinico', 'Clínica geral por R$ 39,90'],
      ['psicologia', 'Psicologia por R$ 59,90'],
      ['desconto', 'Desconto em Alergologia e Cardiologia'],
      ['farmacia', 'Até 15% de desconto em farmácias'],
      ['assistente', 'Assistente com IA que lê suas consultas'],
      ['whatsapp', 'Assistente também no WhatsApp'],
    ],
  },
  {
    name: 'Especialidades',
    tagline: 'Cuidado contínuo com consultas inclusas.',
    monthly: '59,90',
    annual: '57,49',
    saving: 4,
    billed: '689,88',
    features: [
      ['psicologia', 'Psicologia inclusa no plano'],
      ['nutricao', 'Nutrição inclusa no plano'],
      ['assistente', 'Assistente com IA que lê suas consultas'],
      ['whatsapp', 'Assistente também no WhatsApp'],
    ],
  },
];

const PHARMACIES = [
  { slug: 'drogasil', ratio: 500 / 81 },
  { slug: 'rd-saude', ratio: 500 / 94 },
  { slug: 'pague-menos', ratio: 500 / 158 },
  { slug: 'panvel', ratio: 500 / 105 },
  { slug: 'drogaria-sao-paulo', ratio: 500 / 90 },
];

const CW = 860;
const CX = (1080 - CW) / 2;
const TOP = 400;
const CH = 1360;
const STEP = CW + 40;
const KS = CW / 402;
const VIEW = CH / KS;

export const SLIDES = [30, 96, 124, 224, 306];
const SLIDE_DUR = 26;
const CYCLE_AT = 62;
const IA_TAP = SLIDES[2] + 52;
const ESP_TAP = SLIDES[4] + 46;
const MORPH = ESP_TAP + 32;
const MORPH_DUR = 30;
export const PLANS_FRAMES = MORPH + MORPH_DUR + 2;

const ink = '#17151E';
const muted = '#726F80';
const violet = '#7E3BED';
const tint = '#F3EDFE';

function Arrow({ color, size = 30 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Price({ plan, annual }: { plan: Plan; annual: number }) {
  const parts = (value: string) => value.split(',');
  const slot = (value: string, y: number, opacity: number) => {
    const [whole, cents] = parts(value);
    return (
      <span style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'flex-start', gap: 4, transform: `translateY(${y}%)`, opacity }}>
        <span style={{ fontFamily: 'var(--vm-font-display)', fontWeight: 400, fontSize: 150, lineHeight: 1, letterSpacing: '-0.035em', color: ink }}>{whole}</span>
        <span style={{ display: 'flex', flexDirection: 'column', paddingTop: 20 }}>
          <span style={{ fontFamily: 'var(--vm-font-display)', fontSize: 62, lineHeight: '64px', letterSpacing: '-0.02em', color: ink }}>,{cents}</span>
          <span style={{ fontFamily: 'var(--vm-font-text)', fontSize: 34, color: muted }}>/mês</span>
        </span>
      </span>
    );
  };
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <span style={{ paddingTop: 26, fontFamily: 'var(--vm-font-text)', fontSize: 44, color: muted }}>R$</span>
      <span style={{ position: 'relative', width: 380, height: 160, overflow: 'hidden' }}>
        {annual < 1 ? slot(plan.monthly, -annual * 60, 1 - annual) : null}
        {annual > 0 ? slot(plan.annual, (1 - annual) * 60, annual) : null}
      </span>
    </div>
  );
}

function PlanCard({ plan, frame, at }: { plan: Plan; frame: number; at: number }) {
  const annual = plan.featured ? ramp(frame, CYCLE_AT + 3, 14, swap) : 0;
  const trigger = annual > 0.5;
  const press = plan.featured ? interpolate(frame, [CYCLE_AT - 3, CYCLE_AT, CYCLE_AT + 6], [1, 0.95, 1], clamp) : 1;
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '108px 64px 60px', display: 'flex', flexDirection: 'column' }}>
      {plan.featured ? (
        <div style={{ position: 'absolute', left: 64, top: 0, height: 72, padding: '0 34px', borderRadius: '0 0 28px 28px', background: violet, color: '#FDFCFF', display: 'flex', alignItems: 'center', fontFamily: 'var(--vm-font-text)', fontWeight: 700, fontSize: 28, letterSpacing: '0.02em' }}>Mais escolhido</div>
      ) : null}
      <div style={{ fontFamily: 'var(--vm-font-display)', fontWeight: 400, fontSize: 72, lineHeight: 1.05, letterSpacing: '-0.02em', color: ink }}>{plan.name}</div>
      <div style={{ marginTop: 16, fontFamily: 'var(--vm-font-text)', fontSize: 34, lineHeight: 1.35, color: muted, minHeight: 92 }}>{plan.tagline}</div>
      <div style={{ marginTop: 30 }}>
        <Price plan={plan} annual={annual} />
      </div>
      <div style={{ marginTop: 6, fontFamily: 'var(--vm-font-text)', fontSize: 30, color: muted }}>{trigger ? `R$ ${plan.billed} por ano · ${plan.saving}% a menos` : 'Cobrado todo mês'}</div>
      <div style={{ marginTop: 22, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 12, height: 74, padding: '0 30px', borderRadius: 999, background: trigger ? '#F2F1F6' : tint, color: trigger ? muted : '#6A24DB', fontFamily: 'var(--vm-font-text)', fontWeight: 500, fontSize: 29, whiteSpace: 'nowrap', transform: `scale(${press})`, transformOrigin: 'left center' }}>
        {trigger ? `No mensal, R$ ${plan.monthly}/mês` : `No anual, R$ ${plan.annual}/mês · ${plan.saving}% a menos`}
        <Arrow color={trigger ? muted : '#6A24DB'} size={30} />
      </div>
      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {plan.features.map(([kind, label], i) => {
          const t = spring({ frame: frame - at - 6 - i * 3, fps: 30, config: { damping: 16, stiffness: 140 } });
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 26, minHeight: 70, opacity: Math.min(1, t * 1.5), transform: `translateY(${(1 - t) * 24}px)` }}>
              <span style={{ width: 70, height: 70, borderRadius: 22, background: tint, color: violet, display: 'grid', placeItems: 'center', flexShrink: 0, transform: `scale(${0.6 + 0.4 * t})` }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                  {GLYPHS[kind]}
                </svg>
              </span>
              <span style={{ fontFamily: 'var(--vm-font-text)', fontSize: 34, lineHeight: 1.25, color: ink }}>{label}</span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 'auto', height: 118, borderRadius: 999, background: plan.featured ? violet : ink, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px 0 54px', fontFamily: 'var(--vm-font-text)', fontWeight: 700, fontSize: 34, color: '#FDFCFF' }}>
        Assinar o {plan.name}
        <span style={{ width: 90, height: 90, borderRadius: 45, background: plan.featured ? '#FDFCFF' : violet, display: 'grid', placeItems: 'center' }}>
          <Arrow color={plan.featured ? violet : '#FDFCFF'} size={34} />
        </span>
      </div>
    </div>
  );
}

const shotSrc = (shot: string) => staticFile(`shots/${shot}.png`);

function Screen({ shot, y = 0, style }: { shot: string; y?: number; style?: React.CSSProperties }) {
  return <Img src={shotSrc(shot)} style={{ position: 'absolute', left: 0, top: -y * KS, width: CW, height: 874 * KS, maxWidth: 'none', ...style }} />;
}

function IaCard({ frame }: { frame: number }) {
  const swapT = ramp(frame, IA_TAP + 8, 10);
  const camY = (874 - VIEW) * ramp(frame, IA_TAP + 8, 30, glide);
  return (
    <>
      <Screen shot="ai-chat--empty" y={camY} style={{ opacity: 1 - swapT }} />
      <Screen shot="ai-chat--answer" y={camY} style={{ opacity: swapT, transform: `translateY(${(1 - swapT) * 40}px)` }} />
    </>
  );
}

function FarmaciaCard({ frame, at }: { frame: number; at: number }) {
  const count = spring({ frame: frame - at - 6, fps: 30, config: { damping: 200 }, durationInFrames: 34 });
  const tileW = (CW - 128 - 24) / 2;
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '72px 64px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontFamily: 'var(--vm-font-text)', fontSize: 30, color: muted }}>Farmácias parceiras</div>
      <div style={{ marginTop: 28, display: 'flex', alignItems: 'baseline', gap: 18 }}>
        <span style={{ fontFamily: 'var(--vm-font-text)', fontSize: 40, color: '#55525F' }}>até</span>
        <span style={{ fontFamily: 'var(--vm-font-display)', fontWeight: 500, fontSize: 220, lineHeight: 0.9, letterSpacing: '-0.05em', color: '#6A24DB', fontVariantNumeric: 'tabular-nums' }}>{Math.round(15 * count)}%</span>
        <span style={{ fontFamily: 'var(--vm-font-text)', fontSize: 40, color: '#55525F' }}>off</span>
      </div>
      <div style={{ marginTop: 28, fontFamily: 'var(--vm-font-text)', fontSize: 34, lineHeight: 1.3, color: '#55525F' }}>Nos remédios da receita digital da sua consulta</div>
      <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {PHARMACIES.map((p, i) => {
          const t = spring({ frame: frame - at - 14 - i * 5, fps: 30, config: { damping: 16, stiffness: 130 } });
          const full = i === PHARMACIES.length - 1;
          const h = Math.min(64, 260 / p.ratio);
          return (
            <div key={p.slug} style={{ width: full ? CW - 128 : tileW, height: 168, borderRadius: 32, background: '#F4F2F8', display: 'grid', placeItems: 'center', opacity: Math.min(1, t * 1.5), transform: `translateY(${(1 - t) * 40}px) scale(${0.94 + 0.06 * t})` }}>
              <Img src={staticFile(`logos/pharmacies/${p.slug}.svg`)} style={{ height: h, width: h * p.ratio }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EspCard({ frame, at }: { frame: number; at: number }) {
  const home = 'client-home-specialties--default';
  const list = 'search-benefit--preco';
  const strip = rect(home, 'strip');
  const homeY = 96;
  const shift = 220 * (1 - ramp(frame, at, 40, glide));
  const sheet = ramp(frame, ESP_TAP + 6, 24, Easing.bezier(0.32, 0.72, 0, 1));
  const press = interpolate(frame, [ESP_TAP - 3, ESP_TAP, ESP_TAP + 6], [1, 0.94, 1], clamp);
  const cardio = rect(home, 'cardio');
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${-homeY * KS}px)` }}>
        <Img src={staticFile(`shots/${home}--base.png`)} style={{ position: 'absolute', left: 0, top: 0, width: CW, height: 874 * KS, maxWidth: 'none' }} />
        <div style={{ position: 'absolute', left: 0, top: strip.y * KS, width: CW, height: strip.h * KS, overflow: 'hidden' }}>
          <Img src={staticFile(`shots/crops/${home}--strip.png`)} style={{ position: 'absolute', top: 0, left: (strip.x - shift) * KS, width: strip.w * KS, height: strip.h * KS, maxWidth: 'none' }} />
          <div style={{ position: 'absolute', left: (cardio.x - shift) * KS, top: 0, width: cardio.w * KS, height: cardio.h * KS, borderRadius: 999, transform: `scale(${press})`, background: frame >= ESP_TAP - 3 && frame <= ESP_TAP + 8 ? 'rgba(255,255,255,.18)' : 'transparent' }} />
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(23,21,30,.4)', opacity: sheet }} />
      {sheet > 0 ? <Screen shot={list} y={-(1 - sheet) * (VIEW + 20)} /> : null}
    </>
  );
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function Slot({ index, pos, frame, height, children, background = '#FDFCFF', grow = 0, ring = false }: { index: number; pos: number; frame: number; height: number; children: ReactNode; background?: string; grow?: number; ring?: boolean }) {
  const d = index - pos;
  if (Math.abs(d) > 1.6) return null;
  const speed = Math.abs(slidePos(frame) - slidePos(frame - 1));
  const near = Math.min(1, Math.abs(d));
  if (grow > 0) {
    // Lands exactly on the Listing scene's Card so the cut to it is invisible.
    const s = lerp(1, CARD_W / CW, grow);
    return (
      <div style={{ position: 'absolute', left: lerp(CX, CARD_X, grow), top: lerp(TOP, CARD_TOP, grow), width: CW, height: lerp(height, 874 * KS, grow), borderRadius: lerp(56, 64, grow) / s, overflow: 'hidden', background, transform: `scale(${s})`, transformOrigin: '0 0', boxShadow: `0 ${lerp(40, 50, grow) / s}px ${lerp(100, 120, grow) / s}px rgba(20,4,48,${lerp(0.4, 0.55, grow)}), 0 0 0 ${grow / s}px rgba(255,255,255,${0.08 * grow})` }}>
        {children}
      </div>
    );
  }
  return (
    <div style={{ position: 'absolute', left: CX + d * STEP, top: TOP, width: CW, height, borderRadius: 56, overflow: 'hidden', background, boxShadow: `${ring ? '0 0 0 6px #7E3BED, ' : ''}0 40px 100px rgba(20,4,48,.4)`, transform: `scale(${1 - 0.06 * near})`, filter: speed > 0.01 ? `blur(${Math.min(8, speed * 60)}px)` : undefined }}>
      {children}
    </div>
  );
}

const slidePos = (frame: number) => SLIDES.reduce((n, at) => n + ramp(frame, at, SLIDE_DUR, Easing.bezier(0.7, 0, 0.2, 1)), 0);

export function PlansCarousel({ frame }: { frame: number }) {
  const pos = slidePos(frame);
  const enter = spring({ frame: frame - 4, fps: 30, config: { damping: 22, stiffness: 110 } });
  const iaTap = rect('ai-chat--empty', 'duvida');
  const espTap = rect('client-home-specialties--default', 'cardio');
  return (
    <>
      <Headline frame={frame} lines={['Um plano que se paga']} accent={['paga']} from={2} to={SLIDES[2] - 10} />
      <Headline frame={frame} lines={['Super IA no app']} accent={['IA']} from={SLIDES[2] + 8} to={SLIDES[3] - 10} />
      <Headline frame={frame} lines={['Até 15% na farmácia']} accent={['15%']} from={SLIDES[3] + 8} to={SLIDES[4] - 10} />
      <Headline frame={frame} lines={['Especialistas', 'por R$ 99,90']} accent={['R$', '99,90']} from={SLIDES[4] + 8} to={MORPH - 4} top={170} />
      <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, enter * 1.5), transform: `translateY(${(1 - enter) * 300}px)` }}>
        {PLANS.map((plan, i) => (
          <Slot key={plan.name} index={i} pos={pos} frame={frame} height={CH} ring={plan.featured}>
            <PlanCard plan={plan} frame={frame} at={i === 0 ? 4 : SLIDES[i - 1]} />
          </Slot>
        ))}
      </div>
      <Slot index={3} pos={pos} frame={frame} height={CH}>
        <IaCard frame={frame} />
      </Slot>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - ramp(frame, MORPH, MORPH_DUR * 0.6) }}>
        <Slot index={4} pos={pos} frame={frame} height={CH}>
          <FarmaciaCard frame={frame} at={SLIDES[3]} />
        </Slot>
      </div>
      <Slot index={5} pos={pos} frame={frame} height={CH} background="#2A0B63" grow={ramp(frame, MORPH, MORPH_DUR, glide)}>
        <EspCard frame={frame} at={SLIDES[4]} />
      </Slot>
      <Finger frame={frame} at={CYCLE_AT} x={CX + 64 + 300} y={TOP + 590} />
      <Finger frame={frame} at={IA_TAP} x={CX + (iaTap.x + iaTap.w / 2) * KS} y={TOP + (iaTap.y + iaTap.h / 2) * KS} />
      <Finger frame={frame} at={ESP_TAP} x={CX + (espTap.x + espTap.w / 2) * KS} y={TOP + (espTap.y + espTap.h / 2 - 96) * KS} />
    </>
  );
}
