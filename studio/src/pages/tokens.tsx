import * as React from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { Panel, PanelIconButton, PanelSection, Select } from "@/ui";
import { Workspace } from "@/shell/workspace";
import {
  SCALES,
  brandType,
  contrast,
  durations,
  easings,
  extraColors,
  familyFor,
  logoColors,
  mobileType,
  motionExtras,
  radii,
  roles,
  scale,
  shadows,
  source,
  spaces,
  springs,
  webType,
  weightFor,
  type TokenRef,
} from "@/tokens/model";

const ink = { 900: "#17151E", 600: "#55525F", 500: "#726F80", 400: "#A29FB0", 200: "#E6E4EC", 100: "#F2F1F6" };
const SECTIONS = [
  { id: "all", label: "Todas" },
  { id: "colors", label: "Cores" },
  { id: "roles", label: "Papéis" },
  { id: "type", label: "Tipografia" },
  { id: "shape", label: "Raio e espaço" },
  { id: "shadow", label: "Sombras" },
  { id: "motion", label: "Motion" },
];

type Select = (ref: TokenRef) => void;
const SelectedContext = React.createContext<{ selected?: string; select: Select }>({ select: () => {} });

function Pick({ token, children, className, style }: { token: TokenRef; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const { selected, select } = React.useContext(SelectedContext);
  const active = selected === token.id;
  return (
    <button
      type="button"
      onClick={() => select(token)}
      className={`cursor-pointer rounded-[14px] border-0 bg-transparent p-0 text-left outline-offset-4 ${className ?? ""}`}
      style={{ outline: active ? "2px solid #7E3BED" : "2px solid transparent", ...style }}
    >
      {children}
    </button>
  );
}

function Section({ id, title, lead, children }: { id: string; title: string; lead: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex flex-col gap-8 border-t pt-14" style={{ borderColor: ink[200] }}>
      <header className="flex flex-col gap-2">
        <h2 className="m-0 text-[40px] leading-[44px] font-bold tracking-[-0.02em]" style={{ fontFamily: "Space Grotesk" }}>
          {title}
        </h2>
        <p className="m-0 max-w-[720px] text-[17px] leading-[26px]" style={{ color: ink[600] }}>
          {lead}
        </p>
      </header>
      {children}
    </section>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[12px] leading-4" style={{ color: ink[500] }}>
      {children}
    </span>
  );
}

function Swatch({ token, tall }: { token: TokenRef; tall?: boolean }) {
  const light = contrast(token.value, "#FFFFFF") < 3;
  return (
    <Pick token={token} className="flex min-w-0 flex-1 flex-col gap-2">
      <span
        className="flex w-full items-end rounded-[12px] p-3 text-[12px] font-medium"
        style={{
          height: tall ? 120 : 88,
          background: token.value,
          color: light ? ink[900] : "#fff",
          boxShadow: light ? `inset 0 0 0 1px ${ink[200]}` : undefined,
        }}
      >
        {token.name.split("-").pop()}
      </span>
      <Meta>{token.value.toUpperCase()}</Meta>
    </Pick>
  );
}

function Colors() {
  return (
    <Section id="colors" title="Cores" lead="Cinco escalas de 50 a 950. Violet domina, spark é o acento secundário, iris e azure são tons de apoio (nunca preenchimento), ink é o neutro.">
      {SCALES.map((name) => (
        <div key={name} className="flex flex-col gap-3">
          <div className="flex items-baseline gap-3">
            <span className="text-[18px] font-bold capitalize">{name}</span>
            <Meta>brand-{name}-* (web) · {name}-* (mobile)</Meta>
          </div>
          <div className="flex gap-2">
            {scale(name).map((t) => (
              <Swatch key={t.id} token={t} />
            ))}
          </div>
        </div>
      ))}
      <div className="grid grid-cols-2 gap-10">
        <div className="flex flex-col gap-3">
          <span className="text-[18px] font-bold">Superfícies e status</span>
          <div className="flex gap-2">
            {extraColors.map((t) => (
              <Swatch key={t.id} token={t} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-[18px] font-bold">Logo</span>
          <div className="flex gap-2">
            {logoColors.map((t) => (
              <Swatch key={t.id} token={t} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function RoleChip({ token, bg }: { token: TokenRef; bg: string }) {
  const ratio = contrast(token.value, bg);
  return (
    <Pick token={token} className="flex items-center gap-3 px-1 py-1">
      <span className="size-9 shrink-0 rounded-[10px]" style={{ background: token.value, boxShadow: `inset 0 0 0 1px rgb(127 127 127 / 0.25)` }} />
      <span className="flex min-w-0 flex-col">
        <span className="font-mono text-[12px]" style={{ color: bg === "#FAFAFE" ? ink[900] : "#F9F8FB" }}>
          {token.value.toUpperCase()}
        </span>
        <span className="font-mono text-[11px]" style={{ color: bg === "#FAFAFE" ? ink[500] : ink[400] }}>
          {token.path.split("→ ")[1]} · {ratio.toFixed(1)}:1
        </span>
      </span>
    </Pick>
  );
}

function Roles() {
  const lightBg = roles.find((r) => r.name === "background")!.light.value;
  const darkBg = roles.find((r) => r.name === "background")!.dark.value;
  return (
    <Section id="roles" title="Papéis" lead="O que as telas usam. Mesmo nome em todas as plataformas: bg-primary no mobile e no web leem o mesmo token. A razão de contraste é contra o background do modo.">
      <div className="overflow-hidden rounded-[20px]" style={{ boxShadow: `inset 0 0 0 1px ${ink[200]}` }}>
        <div className="grid grid-cols-[260px_1fr_1fr] text-[12px] font-medium" style={{ color: ink[500] }}>
          <span className="px-6 py-3">Papel</span>
          <span className="px-6 py-3" style={{ background: lightBg }}>Claro</span>
          <span className="px-6 py-3" style={{ background: darkBg, color: ink[400] }}>Escuro</span>
        </div>
        {roles.map((role) => (
          <div key={role.name} className="grid grid-cols-[260px_1fr_1fr] items-center border-t" style={{ borderColor: ink[200] }}>
            <span className="flex flex-col px-6 py-2">
              <span className="text-[15px] font-medium">{role.name}</span>
              <Meta>--{role.name}</Meta>
            </span>
            <span className="px-5 py-2" style={{ background: lightBg }}>
              <RoleChip token={role.light} bg={lightBg} />
            </span>
            <span className="px-5 py-2" style={{ background: darkBg }}>
              <RoleChip token={role.dark} bg={darkBg} />
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Typography() {
  return (
    <Section id="type" title="Tipografia" lead="Space Grotesk nos títulos, DM Sans no texto. Três escalas: type (app mobile), webType (telas web, fixa) e brandType (site e marketing, fluida).">
      <div className="grid grid-cols-2 gap-12">
        {[
          { label: "Mobile · type", items: mobileType },
          { label: "Web · webType", items: webType },
        ].map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <span className="pb-3 text-[18px] font-bold">{group.label}</span>
            {group.items.map((t) => {
              const family = "family" in t ? (t.family as string | undefined) : undefined;
              const display = family ? familyFor(family) : ["display", "headline", "title"].includes(t.name) ? "Space Grotesk" : "DM Sans";
              return (
                <Pick key={t.ref.id} token={t.ref} className="flex items-baseline justify-between gap-6 border-b py-3" style={{ borderColor: ink[100] }}>
                  <span
                    style={{
                      fontFamily: display,
                      fontWeight: family ? weightFor(family) : ["display", "headline", "title"].includes(t.name) ? 700 : 400,
                      fontSize: t.size,
                      lineHeight: `${t.lineHeight}px`,
                      letterSpacing: `${t.letterSpacing}${family ? "px" : "em"}`,
                    }}
                  >
                    {t.name[0].toUpperCase() + t.name.slice(1)} consulta
                  </span>
                  <Meta>
                    {t.size}/{t.lineHeight}
                  </Meta>
                </Pick>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <span className="pb-3 text-[18px] font-bold">Marca · brandType</span>
        {brandType.map((t) => (
          <Pick key={t.ref.id} token={t.ref} className="flex items-baseline justify-between gap-6 border-b py-4" style={{ borderColor: ink[100] }}>
            <span
              style={{
                fontFamily: t.name === "hero" ? "Space Grotesk" : "DM Sans",
                fontWeight: t.name === "hero" ? 700 : 400,
                fontSize: t.max,
                lineHeight: t.lineHeight,
                letterSpacing: `${t.letterSpacing}em`,
                color: t.name === "lead" ? ink[600] : ink[900],
              }}
            >
              {t.name === "hero" ? "Saúde perto de você." : "Consultas por vídeo com médicos de verdade, quando você precisar."}
            </span>
            <Meta>
              {t.min}→{t.max}
            </Meta>
          </Pick>
        ))}
      </div>
    </Section>
  );
}

function Shape() {
  return (
    <Section id="shape" title="Raio e espaço" lead="Raios nomeados pelo papel do elemento: mark, tile, control, card, feature, sheet e chip. Espaço em degraus de 4 e 8.">
      <div className="flex gap-6">
        {radii.map((r) => (
          <Pick key={r.id} token={r} className="flex flex-1 flex-col gap-3">
            <span className="block h-[120px] w-full" style={{ background: "#F5F0FE", borderRadius: r.value.split(" ")[0], boxShadow: "inset 0 0 0 1.5px #BC9CF7" }} />
            <span className="flex flex-col">
              <span className="text-[15px] font-medium">{r.name}</span>
              <Meta>{r.value}</Meta>
            </span>
          </Pick>
        ))}
      </div>
      <div className="flex items-end gap-10">
        {spaces.map((s) => (
          <Pick key={s.id} token={s} className="flex flex-col gap-3">
            <span className="block rounded-[4px]" style={{ width: parseInt(s.value) * 3, height: parseInt(s.value) * 3, background: "#7E3BED" }} />
            <span className="flex flex-col">
              <span className="text-[15px] font-medium">{s.name}</span>
              <Meta>{s.value}</Meta>
            </span>
          </Pick>
        ))}
      </div>
    </Section>
  );
}

function Shadows() {
  return (
    <Section id="shadow" title="Sombras" lead="Duas elevações. float para o que flutua (sheets, popovers); pressGlow para o brilho violeta do toque no botão primário.">
      <div className="flex gap-10 rounded-[20px] p-14" style={{ background: "#F3F4FA" }}>
        {shadows.map((s) => (
          <Pick key={s.ref.id} token={s.ref} className="flex flex-1 flex-col gap-4">
            <span className="block h-[160px] w-full rounded-[20px] bg-white" style={{ boxShadow: s.css }} />
            <span className="flex flex-col">
              <span className="text-[15px] font-medium">{s.name}</span>
              <Meta>{s.ref.value}</Meta>
            </span>
          </Pick>
        ))}
      </div>
    </Section>
  );
}

function Curve({ curve }: { curve: [number, number, number, number] }) {
  const [x1, y1, x2, y2] = curve;
  const p = (x: number, y: number) => `${8 + x * 104} ${112 - y * 104}`;
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px] overflow-visible">
      <rect x="8" y="8" width="104" height="104" rx="8" fill="#F5F0FE" />
      <path d={`M${p(0, 0)} L${p(x1, y1)} M${p(1, 1)} L${p(x2, y2)}`} stroke="#BC9CF7" strokeWidth="1" />
      <path d={`M${p(0, 0)} C${p(x1, y1)} ${p(x2, y2)} ${p(1, 1)}`} stroke="#7E3BED" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

function Motion() {
  const [play, setPlay] = React.useState(false);
  React.useEffect(() => {
    const id = window.setInterval(() => setPlay((p) => !p), 1400);
    return () => window.clearInterval(id);
  }, []);
  return (
    <Section id="motion" title="Motion" lead="Durações e curvas compartilhadas por web e mobile. As bolinhas rodam cada curva em 900ms para comparar o caráter de cada uma.">
      <div className="grid grid-cols-5 gap-6">
        {easings.map((e) => (
          <Pick key={e.ref.id} token={e.ref} className="flex flex-col gap-3">
            <Curve curve={e.curve} />
            <span className="relative block h-3 w-full rounded-full" style={{ background: ink[100] }}>
              <span
                className="absolute top-0 left-0 size-3 rounded-full"
                style={{
                  background: "#7E3BED",
                  left: play ? "calc(100% - 12px)" : "0",
                  transition: `left 900ms ${e.ref.value}`,
                }}
              />
            </span>
            <span className="flex flex-col">
              <span className="text-[15px] font-medium">{e.name}</span>
              <Meta>{e.curve.join(", ")}</Meta>
            </span>
          </Pick>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-10">
        {[
          { label: "Durações", items: durations },
          { label: "Springs (mobile)", items: springs },
          { label: "Outros", items: motionExtras },
        ].map((group) => (
          <div key={group.label} className="flex flex-col">
            <span className="pb-3 text-[18px] font-bold">{group.label}</span>
            {group.items.map((t) => (
              <Pick key={t.id} token={t} className="flex items-baseline justify-between gap-4 border-b py-2.5" style={{ borderColor: ink[100] }}>
                <span className="text-[15px] font-medium">{t.name}</span>
                <Meta>{t.value}</Meta>
              </Pick>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}

function Document({ section }: { section: string }) {
  const show = (id: string) => section === "all" || section === id;
  return (
    <div className="flex flex-col gap-16 px-24 pt-20 pb-28" style={{ background: "#FAFAFE", color: ink[900], fontFamily: "DM Sans" }}>
      <header className="flex items-end justify-between">
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-medium tracking-[0.14em] uppercase" style={{ color: "#7E3BED" }}>
            Design system
          </span>
          <h1 className="m-0 text-[84px] leading-[0.98] font-bold tracking-[-0.035em]" style={{ fontFamily: "Space Grotesk" }}>
            Tokens
          </h1>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Meta>{source.file}</Meta>
          <Meta>
            {source.ref}@{source.sha.slice(0, 7)} · {source.date}
          </Meta>
        </div>
      </header>
      {show("colors") ? <Colors /> : null}
      {show("roles") ? <Roles /> : null}
      {show("type") ? <Typography /> : null}
      {show("shape") ? <Shape /> : null}
      {show("shadow") ? <Shadows /> : null}
      {show("motion") ? <Motion /> : null}
    </div>
  );
}

function CopyRow({ label, value }: { label: string; value?: string }) {
  const [done, setDone] = React.useState(false);
  if (!value) return null;
  return (
    <div className="flex items-center gap-2">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[11px] text-[color:color-mix(in_oklab,var(--foreground)_50%,transparent)]">{label}</span>
        <span className="truncate font-mono text-[12px] text-[color:var(--foreground)]">{value}</span>
      </div>
      <PanelIconButton
        label="Copiar"
        onClick={() => {
          void navigator.clipboard.writeText(value);
          setDone(true);
          window.setTimeout(() => setDone(false), 1200);
        }}
      >
        {done ? <Check /> : <Copy />}
      </PanelIconButton>
    </div>
  );
}

export function TokensPage() {
  const [section, setSection] = React.useState("all");
  const [selected, setSelected] = React.useState<TokenRef>();
  const [height, setHeight] = React.useState(4000);
  const content = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const el = content.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const label = `Tokens · ${SECTIONS.find((s) => s.id === section)!.label}`;
  const isColor = selected?.value.startsWith("#");

  const panel = (
    <Panel title="Tokens" onResetControls={() => setSection("all")} className="max-h-full">
      <PanelSection title="Mostrar">
        <Select name="Seção" value={section} onValueChange={setSection} options={SECTIONS.map((s) => ({ label: s.label, value: s.id }))} />
      </PanelSection>
      <PanelSection title="Inspetor">
        {selected ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {isColor ? (
                <span className="size-10 shrink-0 rounded-md ring-1 ring-[color:color-mix(in_oklab,var(--foreground)_15%,transparent)]" style={{ background: selected.value }} />
              ) : null}
              <div className="flex min-w-0 flex-col">
                <span className="text-[13px] font-medium">{selected.name}</span>
                <span className="font-mono text-[12px] text-[color:color-mix(in_oklab,var(--foreground)_60%,transparent)]">{selected.value}</span>
              </div>
            </div>
            <CopyRow label="tokens.json" value={selected.path} />
            <CopyRow label="CSS (web)" value={selected.cssVar ? `var(${selected.cssVar})` : undefined} />
            <CopyRow label="Tailwind (web)" value={selected.web} />
            <CopyRow label="NativeWind (mobile)" value={selected.mobile} />
            {selected.note ? <p className="m-0 text-[12px] leading-4 text-[color:color-mix(in_oklab,var(--foreground)_60%,transparent)]">{selected.note}</p> : null}
          </div>
        ) : (
          <p className="m-0 text-[12px] leading-4 text-[color:color-mix(in_oklab,var(--foreground)_55%,transparent)]">
            Clique em qualquer token no canvas para ver o valor e os nomes no código.
          </p>
        )}
      </PanelSection>
    </Panel>
  );

  return (
    <Workspace artboard={{ width: 1440, height, label }} panel={panel} fitMode="width">
      <SelectedContext.Provider value={{ selected: selected?.id, select: setSelected }}>
        <div ref={content}>
          <Document section={section} />
        </div>
      </SelectedContext.Provider>
    </Workspace>
  );
}
