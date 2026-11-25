import * as React from "react";
import {
  AlignBottom,
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignLeft,
  AlignRight,
  AlignTop,
  ArrowClockwise,
  ArrowDown,
  ArrowUp,
  ArrowsDownUp,
  ArrowsLeftRight,
  ArrowsOutLineHorizontal,
  ArrowsOutLineVertical,
  BezierCurve,
  Cards,
  DeviceMobile,
  FrameCorners,
  Image as ImageIcon,
  Shapes,
  TextT,
  Copy,
  DownloadSimple,
  CornersOut,
  Drop,
  Eye,
  EyeSlash,
  Hash,
  LineSegment,
  LinkSimple,
  LinkSimpleBreak,
  Lock,
  SelectionPlus,
  SelectionSlash,
  LockOpen,
  Square,
  SquareHalf,
  Sun,
  TextAa,
  TextAlignCenter,
  TextAlignJustify,
  TextAlignLeft,
  TextAlignRight,
  TextAUnderline,
  Trash,
} from "@phosphor-icons/react";
import { ImagePicker, Select, Switch, TextInput, selectedImageOutlineClassName } from "@/ui";
import { gradients, logos, scales } from "@/brand";
import { cn } from "@/ui/lib/utils";
import { NumberField, TextAreaField } from "./fields";
import { tokenRef } from "./tokens";
import { AddButton, ColorField, EffectRow, IconButton, IconGroup, MiniSelect, RemoveButton, Row, Section, TextField } from "./props";
import { ScreenPicker } from "./screen-picker";
import { photoHasScreen } from "./photo-screen";
import { highlightIcons, people, photoChoices, screens } from "./library";
import type { BlendMode, ChipLayer, Corners, Layer, LogoVariant } from "./model";
import type { Placement } from "./render";

export const TYPE_LABEL: Record<Layer["type"], string> = {
  rect: "Forma",
  image: "Imagem",
  text: "Texto",
  phone: "Celular",
  chip: "Cartão",
  logo: "Logo",
  svg: "Vetor",
  group: "Grupo",
  screen: "Tela na foto",
};

const CHIP_VARIANTS: { label: string; value: ChipLayer["variant"] }[] = [
  { label: "Pílula ao vivo", value: "pill" },
  { label: "Agenda", value: "date" },
  { label: "Pessoa", value: "person" },
  { label: "Número", value: "stat" },
  { label: "Balão", value: "bubble" },
  { label: "Botão", value: "cta" },
];

const LOGO_VARIANTS: { label: string; value: LogoVariant }[] = [
  { label: "Lockup branco", value: "lockupWhite" },
  { label: "Lockup violeta", value: "lockupViolet" },
  { label: "Lockup cor", value: "lockupColor" },
  { label: "Símbolo branco", value: "symbolWhite" },
  { label: "Símbolo cor", value: "symbolColor" },
  { label: "Símbolo violeta", value: "symbolViolet" },
  { label: "Assinatura branca", value: "wordmarkWhite" },
  { label: "Assinatura roxa", value: "wordmarkPurple" },
  { label: "Assinatura violeta", value: "wordmarkViolet" },
  { label: "Ícone do app", value: "appIcon" },
];

function LogoPicker({ value, onChange }: { value: LogoVariant; onChange: (v: LogoVariant) => void }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span className="text-[12px] text-[color:color-mix(in_oklab,var(--foreground)_70%,transparent)]">Versão</span>
      <div className="grid grid-cols-2 gap-2 p-1">
        {LOGO_VARIANTS.map((v) => {
          const light = v.value.includes("White");
          return (
            <button
              key={v.value}
              type="button"
              title={v.label}
              data-selected={v.value === value}
              onClick={() => onChange(v.value)}
              className={cn(
                "flex h-14 cursor-pointer items-center justify-center rounded-md border border-[color:color-mix(in_oklab,var(--border)_10%,transparent)] px-3",
                selectedImageOutlineClassName,
              )}
              style={{ background: light ? scales.violet["900"] : scales.violet["50"] }}
            >
              <img src={logos[v.value]} alt={v.label} draggable={false} className="max-h-7 max-w-full" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

const muted = "text-[color:color-mix(in_oklab,var(--foreground)_45%,transparent)]";

const TYPE_ICON: Record<Layer["type"], React.ReactNode> = {
  rect: <Square />,
  image: <ImageIcon />,
  text: <TextT />,
  phone: <DeviceMobile />,
  chip: <Cards />,
  logo: <Shapes />,
  svg: <BezierCurve />,
  group: <FrameCorners />,
  screen: <DeviceMobile />,
};

export function LayerRow({
  layer,
  depth,
  active,
  onSelect,
  onToggle,
  drop,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  layer: Layer;
  depth: number;
  active: boolean;
  onSelect: (shift: boolean) => void;
  onToggle: (key: "hidden" | "locked") => void;
  drop?: "above" | "below";
  onDragStart?: () => void;
  onDragOver?: (pos: "above" | "below") => void;
  onDrop?: () => void;
}) {
  const toggle = (key: "hidden" | "locked") => (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(key);
  };
  return (
    <div
      role="button"
      tabIndex={0}
      title={`${TYPE_LABEL[layer.type]} · ${layer.name}`}
      onClick={(e) => onSelect(e.shiftKey)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(false)}
      draggable={!!onDragStart}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.();
      }}
      onDragOver={(e) => {
        if (!onDragOver) return;
        e.preventDefault();
        const r = e.currentTarget.getBoundingClientRect();
        onDragOver(e.clientY < r.top + r.height / 2 ? "above" : "below");
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.();
      }}
      className={cn(
        "relative group flex h-7 shrink-0 items-center gap-2 rounded-md pr-1 text-[12.5px] outline-none",
        "hover:bg-[color:color-mix(in_oklab,var(--foreground)_6%,transparent)] focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",
        active && "bg-[color:color-mix(in_oklab,var(--primary)_28%,transparent)]",
      )}
      style={{ paddingLeft: 8 + depth * 14 }}
    >
      {drop ? <span className={cn("pointer-events-none absolute right-1 left-1 h-0.5 rounded-full bg-[color:var(--accent)]", drop === "above" ? "-top-px" : "-bottom-px")} /> : null}
      <span className={cn("flex size-4 shrink-0 items-center justify-center [&_svg]:size-3.5", muted, layer.hidden && "opacity-50")}>{TYPE_ICON[layer.type]}</span>
      <span className={cn("min-w-0 flex-1 truncate", layer.hidden && "opacity-45")}>{layer.name}</span>
      {layer.slot ? <span className="size-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" title="Campo de conteúdo" /> : null}
      {depth === 0 ? (
        <button
          type="button"
          title={layer.locked ? "Destravar" : "Travar"}
          className={cn("flex size-5 shrink-0 items-center justify-center rounded [&_svg]:size-3.5 hover:text-[color:var(--foreground)]", muted, !layer.locked && "invisible group-hover:visible")}
          onClick={toggle("locked")}
        >
          {layer.locked ? <Lock /> : <LockOpen />}
        </button>
      ) : null}
      <button
        type="button"
        title={layer.hidden ? "Mostrar" : "Ocultar"}
        className={cn("flex size-5 shrink-0 items-center justify-center rounded [&_svg]:size-3.5 hover:text-[color:var(--foreground)]", muted, !layer.hidden && "invisible group-hover:visible")}
        onClick={toggle("hidden")}
      >
        {layer.hidden ? <EyeSlash /> : <Eye />}
      </button>
    </div>
  );
}

export function ContentFields({ layer, onChange }: { layer: Layer; onChange: (patch: Partial<Layer>) => void }) {
  const label = layer.slot ?? layer.name;
  switch (layer.type) {
    case "text":
      return <TextAreaField name={label} value={layer.text} onValueChange={(text) => onChange({ text, runs: undefined })} />;
    case "image": {
      const items = layer.src.includes("/highlights/") ? highlightIcons : photoChoices(layer.src, layer.choices);
      return (
        <>
          <ImagePicker name={label} items={items.map((p) => ({ alt: p.label, src: p.src, value: p.value }))} value={layer.src} onValueChange={(src) => onChange({ src })} />
          {!layer.fill && photoHasScreen(layer.src) ? (
            <ScreenPicker name="Tela no celular" value={layer.screen ?? ""} onChange={(screen) => onChange({ screen })} />
          ) : null}
        </>
      );
    }
    case "phone":
      return layer.image && !layer.screen ? (
        <Select
          name={`${label} (app real)`}
          value="paper"
          onValueChange={(screen) => onChange({ screen: screen === "paper" ? "" : screen })}
          options={[{ label: "Imagem do Paper (não sincroniza)", value: "paper" }, ...screens.map((s) => ({ label: s.label, value: s.value }))]}
        />
      ) : (
        <ScreenPicker name={label} value={layer.screen} onChange={(screen) => onChange({ screen })} />
      );
    case "screen":
      return <ScreenPicker name={label} value={layer.screen} onChange={(screen) => onChange({ screen })} />;
    case "chip":
      return (
        <>
          <TextAreaField name={label} value={layer.title} onValueChange={(title) => onChange({ title })} />
          {layer.variant !== "pill" && layer.variant !== "cta" ? (
            <TextInput name={layer.variant === "bubble" ? "Remetente" : "Linha 2"} value={layer.subtitle ?? ""} onValueChange={(subtitle) => onChange({ subtitle })} />
          ) : null}
        </>
      );
    default:
      return null;
  }
}

const BLEND_OPTIONS: { value: BlendMode | "normal"; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "multiply", label: "Multiplicar" },
  { value: "screen", label: "Tela" },
  { value: "overlay", label: "Sobrepor" },
  { value: "soft-light", label: "Luz suave" },
  { value: "darken", label: "Escurecer" },
  { value: "lighten", label: "Clarear" },
  { value: "color-dodge", label: "Subexpor cor" },
  { value: "luminosity", label: "Luminosidade" },
];

const WEIGHTS = [
  { value: "300", label: "Light" },
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semibold" },
  { value: "700", label: "Bold" },
];

const ANCHORS = [
  { value: "top" as const, label: "Fica no topo" },
  { value: "center" as const, label: "Fica no centro" },
  { value: "bottom" as const, label: "Fica na base" },
  { value: "fill" as const, label: "Preenche a tela" },
];

function measure(id: string): { w: number; h: number } | undefined {
  const el = document.querySelector<HTMLElement>(`[data-frame-view] [data-layer="${id}"]`);
  if (!el) return;
  const k = Number(el.style.scale || 1);
  return { w: el.offsetWidth * k, h: el.offsetHeight * k };
}

export type LayerActions = {
  forward?: () => void;
  backward?: () => void;
  duplicate?: () => void;
  remove: () => void;
  copyRef: () => void;
  exportPng?: () => void;
  ungroup?: () => void;
};

export function LayerDesign({
  layer,
  placement,
  nested,
  size,
  onChange,
  onPlace,
  actions,
}: {
  size: { width: number; height: number };
  layer: Layer;
  placement?: Placement;
  nested: boolean;
  onChange: (patch: Partial<Layer>) => void;
  onPlace: (patch: Partial<Placement>) => void;
  actions: LayerActions;
}) {
  const [ratio, setRatio] = React.useState(layer.type === "image");
  const boxed = layer.type === "image" || layer.type === "rect" || layer.type === "svg";
  const scaled = layer.type === "chip" || layer.type === "group";
  const positioned = !nested && placement && !layer.fill && layer.type !== "screen";
  const box = () => measure(layer.id) ?? { w: placement?.w ?? 0, h: placement?.h ?? 0 };

  function align(where: "left" | "hcenter" | "right" | "top" | "vcenter" | "bottom") {
    const b = box();
    if (where === "left") onPlace({ x: 0 });
    if (where === "hcenter") onPlace({ x: Math.round((size.width - b.w) / 2) });
    if (where === "right") onPlace({ x: Math.round(size.width - b.w) });
    if (where === "top") onPlace({ y: 0 });
    if (where === "vcenter") onPlace({ y: Math.round((size.height - b.h) / 2) });
    if (where === "bottom") onPlace({ y: Math.round(size.height - b.h) });
  }

  function setW(w: number) {
    if (ratio && boxed && placement?.w && placement.h) onPlace({ w, h: Math.round((w * placement.h) / placement.w) });
    else onPlace({ w });
  }
  function setH(h: number) {
    if (ratio && boxed && placement?.w && placement.h) onPlace({ h, w: Math.round((h * placement.w) / placement.h) });
    else onPlace({ h });
  }

  const stroke = layer.stroke;
  const shadow = layer.dropShadow;
  const hasImageShadow = layer.type === "image" && !!layer.shadow;
  const canStroke = layer.type === "rect" || layer.type === "image";
  const effectsMissing = [
    !shadow && !hasImageShadow ? "shadow" : null,
    !layer.blur ? "blur" : null,
    !layer.backdropBlur && (layer.type === "rect" || layer.type === "group") ? "backdrop" : null,
  ].filter(Boolean);

  function addEffect() {
    const next = effectsMissing[0];
    if (next === "shadow") onChange({ dropShadow: { x: 0, y: 24, blur: 48, color: "rgb(13 12 18 / 0.35)" } });
    if (next === "blur") onChange({ blur: 8 });
    if (next === "backdrop") onChange({ backdropBlur: 24 });
  }

  return (
    <>
      <Section
        title={`${TYPE_LABEL[layer.type]}`}
        muted
        action={
          <div className="flex items-center">
            {actions.forward ? (
              <IconButton label="Trazer pra frente" onClick={actions.forward} className="size-6">
                <ArrowUp />
              </IconButton>
            ) : null}
            {actions.backward ? (
              <IconButton label="Mandar pra trás" onClick={actions.backward} className="size-6">
                <ArrowDown />
              </IconButton>
            ) : null}
            {actions.duplicate ? (
              <IconButton label="Duplicar (⌘D)" onClick={actions.duplicate} className="size-6">
                <Copy />
              </IconButton>
            ) : null}
            {actions.ungroup ? (
              <IconButton label="Desagrupar (⌘⇧G)" onClick={actions.ungroup} className="size-6">
                <SelectionSlash />
              </IconButton>
            ) : null}
            {actions.exportPng ? (
              <IconButton label="Exportar PNG transparente" onClick={actions.exportPng} className="size-6">
                <DownloadSimple />
              </IconButton>
            ) : null}
            <IconButton label="Copiar referência (⌘C)" onClick={actions.copyRef} className="size-6">
              <Hash />
            </IconButton>
            <IconButton label={layer.locked ? "Destravar" : "Travar"} active={layer.locked} onClick={() => onChange({ locked: !layer.locked || undefined })} className="size-6">
              {layer.locked ? <Lock /> : <LockOpen />}
            </IconButton>
            <IconButton label={layer.hidden ? "Mostrar" : "Ocultar"} onClick={() => onChange({ hidden: !layer.hidden || undefined })} className="size-6">
              {layer.hidden ? <EyeSlash /> : <Eye />}
            </IconButton>
            <IconButton label="Excluir (⌫)" onClick={actions.remove} className="size-6">
              <Trash />
            </IconButton>
          </div>
        }
      >
        <TextField label="Nome da camada" value={layer.name} onCommit={(name) => onChange({ name })} />
      </Section>

      {positioned ? (
        <Section title="Posição">
          <div className="grid grid-cols-2 gap-1.5">
            <IconGroup
              value={undefined}
              onChange={align}
              options={[
                { value: "left", label: "Alinhar à esquerda", icon: <AlignLeft /> },
                { value: "hcenter", label: "Centralizar na horizontal", icon: <AlignCenterHorizontal /> },
                { value: "right", label: "Alinhar à direita", icon: <AlignRight /> },
              ]}
            />
            <IconGroup
              value={undefined}
              onChange={align}
              options={[
                { value: "top", label: "Alinhar no topo", icon: <AlignTop /> },
                { value: "vcenter", label: "Centralizar na vertical", icon: <AlignCenterVertical /> },
                { value: "bottom", label: "Alinhar na base", icon: <AlignBottom /> },
              ]}
            />
          </div>
          <Row>
            <NumberField name="X" fill={false} min={-size.width} max={size.width * 2} unit="px" value={Math.round(placement.x)} onValueChange={(x) => onPlace({ x })} />
            <NumberField name="Y" fill={false} min={-size.height} max={size.height * 2} unit="px" value={Math.round(placement.y)} onValueChange={(y) => onPlace({ y })} />
          </Row>
          <Row>
            <NumberField name="Giro" label={<ArrowClockwise />} fill={false} min={-180} max={180} step={0.5} unit="°" value={placement.rotate ?? 0} onValueChange={(r) => onPlace({ rotate: r || undefined })} />
            <MiniSelect
              label="Ao mudar de formato"
              value={layer.fill ? "fill" : (layer.anchor ?? "top")}
              options={ANCHORS}
              onChange={(v) => onChange(v === "fill" ? { fill: true } : { fill: undefined, anchor: v })}
            />
          </Row>
        </Section>
      ) : !nested && layer.fill ? (
        <Section title="Posição">
          <MiniSelect label="Ao mudar de formato" value="fill" options={ANCHORS} onChange={(v) => onChange(v === "fill" ? { fill: true } : { fill: undefined, anchor: v })} />
        </Section>
      ) : null}

      {positioned ? (
        <Section title="Layout">
          {layer.type === "text" ? (
            <IconGroup
              value={placement.w === undefined ? "auto" : "fixed"}
              onChange={(v) => (v === "auto" ? onPlace({ w: undefined }) : onPlace({ w: Math.round(box().w) }))}
              options={[
                { value: "auto", label: "Largura automática (uma linha)", icon: <ArrowsLeftRight /> },
                { value: "fixed", label: "Largura fixa (quebra linhas)", icon: <TextAlignJustify /> },
              ]}
            />
          ) : null}
          <div className="flex items-center gap-1.5">
            <div className="grid flex-1 grid-cols-2 gap-1.5">
              {layer.type === "logo" ? (
                <NumberField name="A" fill={false} min={8} max={600} unit="px" value={Math.round(placement.h ?? 40)} onValueChange={(h) => onPlace({ h })} />
              ) : scaled ? (
                <NumberField name="Escala" min={20} max={300} unit="%" value={Math.round((layer.scale ?? 1) * 100)} onValueChange={(v) => onChange({ scale: v === 100 ? undefined : v / 100 })} />
              ) : (
                <>
                  <NumberField name="L" fill={false} min={10} max={size.width * 3} unit="px" value={placement.w === undefined ? undefined : Math.round(placement.w)} onValueChange={setW} />
                  {boxed ? (
                    <NumberField name="A" fill={false} min={10} max={size.height * 3} unit="px" value={placement.h === undefined ? undefined : Math.round(placement.h)} onValueChange={setH} />
                  ) : null}
                </>
              )}
            </div>
            {boxed ? (
              <IconButton label={ratio ? "Proporção travada" : "Travar proporção"} active={ratio} onClick={() => setRatio((r) => !r)}>
                {ratio ? <LinkSimple /> : <LinkSimpleBreak />}
              </IconButton>
            ) : null}
          </div>
        </Section>
      ) : null}

      <Section title="Aparência">
        <Row>
          <NumberField name="Opacidade" label={<Drop />} min={0} max={100} unit="%" value={Math.round((layer.opacity ?? 1) * 100)} onValueChange={(v) => onChange({ opacity: v >= 100 ? undefined : v / 100 })} />
          {layer.type === "rect" || layer.type === "image" ? (
            layer.corners ? (
              <NumberField name="Raio" label={<CornersOut />} fill={false} min={0} max={1000} unit="px" value={undefined} placeholder="misto" onValueChange={(radius) => onChange({ corners: undefined, radius: radius || undefined })} />
            ) : (
              <NumberField name="Raio" label={<CornersOut />} fill={false} min={0} max={1000} unit="px" value={layer.radius ?? 0} onValueChange={(radius) => onChange({ radius: radius || undefined })} />
            )
          ) : (
            <MiniSelect label="Mistura" value={layer.blend ?? "normal"} options={BLEND_OPTIONS} onChange={(v) => onChange({ blend: v === "normal" ? undefined : v })} />
          )}
        </Row>
        {layer.type === "rect" || layer.type === "image" ? (
          <>
            <div className="flex items-center gap-1.5">
              <MiniSelect className="flex-1" label="Mistura" value={layer.blend ?? "normal"} options={BLEND_OPTIONS} onChange={(v) => onChange({ blend: v === "normal" ? undefined : v })} />
              <IconButton
                label={layer.corners ? "Raio igual nos cantos" : "Raio por canto"}
                active={!!layer.corners}
                onClick={() => {
                  const r = layer.radius ?? 0;
                  onChange(layer.corners ? { corners: undefined, radius: layer.corners[0] || undefined } : { corners: [r, r, r, r] });
                }}
              >
                <FrameCorners />
              </IconButton>
            </div>
            {layer.corners ? (
              <div className="grid grid-cols-4 gap-1">
                {(["↖", "↗", "↘", "↙"] as const).map((arrow, i) => (
                  <NumberField
                    key={arrow}
                    name={["Canto superior esquerdo", "Canto superior direito", "Canto inferior direito", "Canto inferior esquerdo"][i]}
                    label={arrow}
                    fill={false}
                    min={0}
                    max={1000}
                    unit=""
                    value={layer.corners![i]}
                    onValueChange={(v) => {
                      const corners = [...layer.corners!] as Corners;
                      corners[i] = v;
                      onChange({ corners });
                    }}
                  />
                ))}
              </div>
            ) : null}
          </>
        ) : null}
      </Section>

      {layer.type === "text" ? (
        <Section title="Texto">
          <TextAreaField name="Conteúdo" value={layer.text} onValueChange={(text) => onChange({ text, runs: undefined })} />
          <MiniSelect
            label="Fonte"
            value={layer.font}
            options={[
              { value: "display", label: "Space Grotesk" },
              { value: "body", label: "DM Sans" },
              { value: "mono", label: "DM Mono" },
            ]}
            onChange={(font) => onChange({ font })}
          />
          <Row>
            <MiniSelect label="Peso" value={String(layer.weight ?? (layer.font === "display" ? 500 : 400))} options={WEIGHTS} onChange={(v) => onChange({ weight: Number(v) })} />
            <NumberField name="Tamanho" label={<TextAa />} fill={false} min={6} max={400} unit="px" value={layer.size} onValueChange={(v) => onChange({ size: v, leading: undefined })} />
          </Row>
          <Row>
            <NumberField
              name="Entrelinha"
              label={<ArrowsDownUp />}
              fill={false}
              min={6}
              max={480}
              unit="px"
              value={layer.leading ?? Math.round(layer.size * (layer.font === "display" ? 1 : 1.35))}
              onValueChange={(leading) => onChange({ leading })}
            />
            <NumberField
              name="Espaçamento entre letras"
              label={<ArrowsLeftRight />}
              fill={false}
              min={-20}
              max={50}
              step={0.5}
              unit="%"
              value={Math.round((layer.tracking ?? (layer.font === "display" ? -0.045 : 0)) * 1000) / 10}
              onValueChange={(v) => onChange({ tracking: v / 100 })}
            />
          </Row>
          <div className="flex items-center gap-1.5">
            <div className="flex-1">
              <IconGroup
                value={layer.align ?? "left"}
                onChange={(align) => onChange({ align: align === "left" ? undefined : align })}
                options={[
                  { value: "left", label: "Alinhar texto à esquerda", icon: <TextAlignLeft /> },
                  { value: "center", label: "Centralizar texto", icon: <TextAlignCenter /> },
                  { value: "right", label: "Alinhar texto à direita", icon: <TextAlignRight /> },
                ]}
              />
            </div>
            <IconButton label="Caixa alta" active={!!layer.upper} onClick={() => onChange({ upper: !layer.upper || undefined })}>
              <TextAUnderline />
            </IconButton>
          </div>
        </Section>
      ) : null}

      {layer.type === "text" ? (
        <Section title="Preenchimento">
          <ColorField value={layer.color} onChange={(color) => onChange({ color })} />
          {layer.runs?.some((r) => r.style?.color) ? <p className="text-[11px] opacity-50">Trechos com cor própria mantêm a cor deles.</p> : null}
        </Section>
      ) : null}

      {layer.type === "rect" ? (
        <Section title="Preenchimento">
          {(() => {
            const bg = String(layer.background ?? layer.style?.backgroundImage ?? layer.style?.backgroundColor ?? "");
            const solid = /^#[0-9a-f]{6,8}$/i.test(bg) || !!tokenRef(bg);
            const set = (background: string) => onChange({ background, style: { ...layer.style, backgroundImage: undefined as never, backgroundColor: undefined as never } });
            return (
              <>
                <IconGroup
                  value={solid || !bg ? "solid" : "gradient"}
                  onChange={(v) => set(v === "solid" ? "{violet.500}" : gradients[Object.keys(gradients)[0]] ?? bg)}
                  options={[
                    { value: "solid", label: "Cor sólida", icon: <Square weight="fill" /> },
                    { value: "gradient", label: "Gradiente", icon: <SquareHalf weight="fill" /> },
                  ]}
                />
                {solid || !bg ? (
                  <ColorField value={bg || "#FFFFFF"} onChange={set} />
                ) : (
                  <>
                    <div className="grid grid-cols-6 gap-1">
                      {Object.entries(gradients).map(([name, g]) => (
                        <button
                          key={name}
                          type="button"
                          title={name}
                          onClick={() => set(g)}
                          className={cn("aspect-square cursor-pointer rounded-[5px] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)]", bg === g && "ring-2 ring-[color:var(--accent)]")}
                          style={{ background: g }}
                        />
                      ))}
                    </div>
                    <TextField label="CSS do preenchimento" mono value={bg} onCommit={set} />
                  </>
                )}
              </>
            );
          })()}
        </Section>
      ) : null}

      {layer.type === "image" || layer.type === "phone" || layer.type === "screen" || layer.type === "chip" || layer.type === "logo" ? (
        <Section title="Conteúdo">
          {layer.type === "chip" ? (
            <Row>
              <MiniSelect label="Tipo" value={layer.variant} options={CHIP_VARIANTS} onChange={(variant) => onChange({ variant })} />
              <MiniSelect
                label="Tom"
                value={layer.tone ?? "light"}
                options={[
                  { label: "Claro", value: "light" },
                  { label: "Violeta", value: "violet" },
                  { label: "Escuro", value: "dark" },
                ]}
                onChange={(v) => onChange({ tone: v === "light" ? undefined : v })}
              />
            </Row>
          ) : null}
          {layer.type === "logo" ? <LogoPicker value={layer.variant} onChange={(variant) => onChange({ variant })} /> : <ContentFields layer={layer} onChange={onChange} />}
          {layer.type === "chip" && (layer.variant === "date" || layer.variant === "stat") ? (
            <TextInput name={layer.variant === "date" ? "Data (MÊS DIA)" : "Rótulo"} value={layer.badge ?? ""} onValueChange={(badge) => onChange({ badge })} />
          ) : null}
          {layer.type === "chip" && layer.variant === "person" ? (
            <ImagePicker name="Foto" items={people.map((p) => ({ alt: p.label, src: p.src, value: p.value }))} value={layer.badge} onValueChange={(badge) => onChange({ badge })} />
          ) : null}
          {layer.type === "image" ? (
            <Row>
              <MiniSelect
                label="Encaixe"
                value={layer.fit ?? "cover"}
                options={[
                  { value: "cover", label: "Preencher" },
                  { value: "contain", label: "Caber inteira" },
                ]}
                onChange={(fit) => onChange({ fit: fit === "cover" ? undefined : fit })}
              />
              <TextField label="Enquadramento (x% y%)" mono value={layer.position ?? "50% 50%"} onCommit={(position) => onChange({ position })} />
            </Row>
          ) : null}
        </Section>
      ) : null}

      {canStroke ? (
        <Section
          title="Contorno"
          muted={!stroke}
          action={stroke ? <RemoveButton label="Remover contorno" onClick={() => onChange({ stroke: undefined })} /> : <AddButton label="Adicionar contorno" onClick={() => onChange({ stroke: { color: "#FFFFFF", width: 2 } })} />}
        >
          {stroke ? (
            <div className="grid grid-cols-[minmax(0,1fr)_84px] gap-1.5">
              <ColorField value={stroke.color} onChange={(color) => onChange({ stroke: { ...stroke, color } })} />
              <NumberField name="Espessura" label={<LineSegment />} fill={false} min={0} max={80} unit="px" value={stroke.width} onValueChange={(width) => onChange({ stroke: { ...stroke, width } })} />
            </div>
          ) : null}
        </Section>
      ) : null}

      <Section title="Efeitos" muted={!shadow && !hasImageShadow && !layer.blur && !layer.backdropBlur} action={effectsMissing.length ? <AddButton label="Adicionar efeito" onClick={addEffect} /> : null}>
        {hasImageShadow ? <EffectRow icon={<Sun />} label="Sombra padrão" onRemove={() => onChange({ shadow: undefined } as Partial<Layer>)} /> : null}
        {shadow ? (
          <EffectRow icon={<Sun />} label="Sombra" hidden={shadow.hidden} onToggle={() => onChange({ dropShadow: { ...shadow, hidden: !shadow.hidden || undefined } })} onRemove={() => onChange({ dropShadow: undefined })}>
            <Row cols={3}>
              <NumberField name="X" fill={false} min={-200} max={200} unit="" value={shadow.x} onValueChange={(x) => onChange({ dropShadow: { ...shadow, x } })} />
              <NumberField name="Y" fill={false} min={-200} max={200} unit="" value={shadow.y} onValueChange={(y) => onChange({ dropShadow: { ...shadow, y } })} />
              <NumberField name="Desfoque" label="D" fill={false} min={0} max={200} unit="" value={shadow.blur} onValueChange={(blur) => onChange({ dropShadow: { ...shadow, blur } })} />
            </Row>
            <ColorField label="Cor da sombra" value={shadow.color} onChange={(color) => onChange({ dropShadow: { ...shadow, color } })} />
          </EffectRow>
        ) : null}
        {layer.blur ? (
          <EffectRow icon={<Drop />} label="Desfoque da camada" onRemove={() => onChange({ blur: undefined })}>
            <NumberField name="Intensidade" min={0} max={80} unit="px" value={layer.blur} onValueChange={(v) => onChange({ blur: v || undefined })} />
          </EffectRow>
        ) : null}
        {layer.backdropBlur ? (
          <EffectRow icon={<SquareHalf />} label="Desfoque do fundo" onRemove={() => onChange({ backdropBlur: undefined, blurOutside: undefined } as Partial<Layer>)}>
            <NumberField name="Intensidade" min={0} max={80} unit="px" value={layer.backdropBlur} onValueChange={(v) => onChange({ backdropBlur: v || undefined })} />
            {layer.type === "rect" ? (
              <Switch name="Desfocar fora do retângulo" checked={!!layer.blurOutside} onCheckedChange={(blurOutside) => onChange({ blurOutside: blurOutside || undefined })} />
            ) : null}
          </EffectRow>
        ) : null}
      </Section>
    </>
  );
}

export function MultiDesign({
  items,
  onPatch,
  onRemove,
  onExport,
  onGroup,
}: {
  items: { layer: Layer; placement: Placement }[];
  onPatch: (patches: { id: string; patch: Partial<Layer> | Partial<Placement> }[]) => void;
  onRemove: () => void;
  onExport: () => void;
  onGroup: () => void;
}) {
  const boxes = items.map(({ layer, placement }) => {
    const m = measure(layer.id) ?? { w: placement.w ?? 0, h: placement.h ?? 0 };
    return { id: layer.id, x: placement.x, y: placement.y, w: m.w, h: m.h, locked: !!layer.locked };
  });
  const movable = boxes.filter((b) => !b.locked);
  const minX = Math.min(...boxes.map((b) => b.x));
  const minY = Math.min(...boxes.map((b) => b.y));
  const maxX = Math.max(...boxes.map((b) => b.x + b.w));
  const maxY = Math.max(...boxes.map((b) => b.y + b.h));

  function align(where: "left" | "hcenter" | "right" | "top" | "vcenter" | "bottom") {
    onPatch(
      movable.map((b) => {
        const x = where === "left" ? minX : where === "hcenter" ? (minX + maxX) / 2 - b.w / 2 : where === "right" ? maxX - b.w : b.x;
        const y = where === "top" ? minY : where === "vcenter" ? (minY + maxY) / 2 - b.h / 2 : where === "bottom" ? maxY - b.h : b.y;
        return { id: b.id, patch: where === "left" || where === "hcenter" || where === "right" ? { x: Math.round(x) } : { y: Math.round(y) } };
      }),
    );
  }

  function distribute(axis: "x" | "y") {
    const size = (b: (typeof boxes)[number]) => (axis === "x" ? b.w : b.h);
    const sorted = [...movable].sort((a, b) => a[axis] - b[axis]);
    if (sorted.length < 3) return;
    const start = sorted[0][axis];
    const end = sorted[sorted.length - 1][axis] + size(sorted[sorted.length - 1]);
    const gap = (end - start - sorted.reduce((n, b) => n + size(b), 0)) / (sorted.length - 1);
    let at = start;
    onPatch(
      sorted.map((b) => {
        const patch = { [axis]: Math.round(at) };
        at += size(b) + gap;
        return { id: b.id, patch };
      }),
    );
  }

  const opacities = [...new Set(items.map((i) => Math.round((i.layer.opacity ?? 1) * 100)))];
  const blends = [...new Set(items.map((i) => i.layer.blend ?? "normal"))];

  return (
    <>
      <Section
        title={`${items.length} camadas`}
        muted
        action={
          <div className="flex items-center">
            <IconButton label="Agrupar (⌘G)" onClick={onGroup} className="size-6">
              <SelectionPlus />
            </IconButton>
            <IconButton label="Exportar PNG transparente" onClick={onExport} className="size-6">
              <DownloadSimple />
            </IconButton>
            <IconButton label="Excluir selecionadas (⌫)" onClick={onRemove} className="size-6">
              <Trash />
            </IconButton>
          </div>
        }
      >
        <p className="text-[11px] leading-4 opacity-50">⇧ clique adiciona ou tira da seleção. Arraste qualquer uma pra mover todas. ⌘G agrupa.</p>
      </Section>
      <Section title="Alinhar entre si">
        <div className="grid grid-cols-2 gap-1.5">
          <IconGroup
            value={undefined}
            onChange={align}
            options={[
              { value: "left", label: "Alinhar à esquerda", icon: <AlignLeft /> },
              { value: "hcenter", label: "Centralizar na horizontal", icon: <AlignCenterHorizontal /> },
              { value: "right", label: "Alinhar à direita", icon: <AlignRight /> },
            ]}
          />
          <IconGroup
            value={undefined}
            onChange={align}
            options={[
              { value: "top", label: "Alinhar no topo", icon: <AlignTop /> },
              { value: "vcenter", label: "Centralizar na vertical", icon: <AlignCenterVertical /> },
              { value: "bottom", label: "Alinhar na base", icon: <AlignBottom /> },
            ]}
          />
        </div>
        {movable.length >= 3 ? (
          <IconGroup
            value={undefined}
            onChange={(v) => distribute(v)}
            options={[
              { value: "x" as const, label: "Distribuir na horizontal", icon: <ArrowsOutLineHorizontal /> },
              { value: "y" as const, label: "Distribuir na vertical", icon: <ArrowsOutLineVertical /> },
            ]}
          />
        ) : null}
      </Section>
      <Section title="Aparência">
        <Row>
          <NumberField
            name="Opacidade"
            label={<Drop />}
            min={0}
            max={100}
            unit="%"
            value={opacities.length === 1 ? opacities[0] : undefined}
            placeholder="misto"
            onValueChange={(v) => onPatch(items.map((i) => ({ id: i.layer.id, patch: { opacity: v >= 100 ? undefined : v / 100 } })))}
          />
          <MiniSelect
            label="Mistura"
            value={blends.length === 1 ? blends[0] : "normal"}
            options={BLEND_OPTIONS}
            onChange={(v) => onPatch(items.map((i) => ({ id: i.layer.id, patch: { blend: v === "normal" ? undefined : v } })))}
          />
        </Row>
      </Section>
    </>
  );
}
