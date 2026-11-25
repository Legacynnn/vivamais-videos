import * as React from "react";
import { fonts, logos, scales } from "@/brand";
import type { ChipLayer, Frame, ImageLayer, Layer, PhoneLayer, ScreenLayer } from "./model";
import { assetUrl, screenUrl } from "./library";
import { cssColor } from "./tokens";
import { PhotoScreen, photoHasScreen, quadBounds } from "./photo-screen";

const INK = scales.ink["900"];
const BODY = scales.ink["600"];
const DISPLAY = fonts.display;
const TEXT = fonts.text;
const SHADOW = "0 30px 60px -18px rgb(34 8 74 / 0.45)";

function Dot({ size = 14 }: { size?: number }) {
  return (
    <span
      className="shrink-0 rounded-full"
      style={{ width: size, height: size, background: scales.spark["600"], boxShadow: `0 0 0 6px ${scales.spark["100"]}` }}
    />
  );
}

export type EditHandler = (layerId: string, field: "text" | "title" | "subtitle", value: string) => void;

const EditContext = React.createContext<{ active: boolean; onEdit?: EditHandler }>({ active: false });

function Edit({ layerId, field, value }: { layerId: string; field: "text" | "title" | "subtitle"; value: string }) {
  const { active, onEdit } = React.useContext(EditContext);
  const ref = React.useRef<HTMLSpanElement>(null);
  const first = React.useRef(true);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!active || !el || !first.current || el.closest("[data-edit-focused]")) return;
    first.current = false;
    el.closest("[data-layer]")?.setAttribute("data-edit-focused", "");
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    return () => el.closest("[data-layer]")?.removeAttribute("data-edit-focused");
  }, [active]);

  if (!active || !onEdit) return <>{value}</>;
  return (
    <span
      ref={ref}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      spellCheck={false}
      className="cursor-text outline-none select-text"
      onPointerDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Escape" || (e.key === "Enter" && (e.metaKey || e.ctrlKey))) e.currentTarget.blur();
      }}
      onBlur={(e) => {
        const next = e.currentTarget.innerText.replace(/\n$/, "");
        if (next !== value) onEdit(layerId, field, next);
      }}
    >
      {value}
    </span>
  );
}

function Chip({ layer }: { layer: ChipLayer }) {
  const dark = layer.tone === "dark";
  const violet = layer.tone === "violet";
  const surface = dark ? scales.ink["900"] : violet ? scales.violet["500"] : "#fff";
  const fg = dark || violet ? "#fff" : INK;
  const sub = dark || violet ? "rgb(255 255 255 / 0.72)" : BODY;
  const base: React.CSSProperties = { background: surface, color: fg, boxShadow: SHADOW, fontFamily: TEXT };

  if (layer.variant === "pill")
    return (
      <div className="flex items-center gap-3 rounded-full py-4 pr-6 pl-4" style={base}>
        <Dot />
        <span className="text-[24px] leading-[30px] font-medium"><Edit layerId={layer.id} field="title" value={layer.title} /></span>
      </div>
    );

  if (layer.variant === "cta")
    return (
      <div
        className="flex items-center justify-center rounded-full px-10 py-6 text-[30px] font-medium whitespace-nowrap"
        style={{ ...base, background: violet ? scales.violet["500"] : "#fff", color: violet ? "#fff" : INK }}
      >
        <Edit layerId={layer.id} field="title" value={layer.title} />
      </div>
    );

  if (layer.variant === "bubble")
    return (
      <div className="rounded-[30px] px-8 py-6" style={base}>
        {layer.subtitle ? (
          <div className="mb-2 flex items-center gap-2 text-[20px] font-medium" style={{ color: violet ? "#fff" : scales.violet["500"] }}>
            <img src={violet || dark ? logos.symbolWhite : logos.symbolColor} alt="" className="size-6" />
            <Edit layerId={layer.id} field="subtitle" value={layer.subtitle} />
          </div>
        ) : null}
        <div className="text-[26px] leading-[34px] whitespace-pre-line"><Edit layerId={layer.id} field="title" value={layer.title} /></div>
      </div>
    );

  if (layer.variant === "stat")
    return (
      <div className="flex flex-col gap-2.5 rounded-[30px] px-8 py-6" style={base}>
        {layer.badge ? (
          <div className="flex items-center gap-2.5 text-[22px] leading-7" style={{ color: sub }}>
            <Dot size={12} />
            {layer.badge}
          </div>
        ) : null}
        <div className="text-[68px] leading-[68px] font-medium tracking-[-0.04em] whitespace-nowrap" style={{ fontFamily: DISPLAY }}>
          <Edit layerId={layer.id} field="title" value={layer.title} />
        </div>
        {layer.subtitle ? (
          <div className="text-[22px] leading-7" style={{ color: sub }}>
            <Edit layerId={layer.id} field="subtitle" value={layer.subtitle} />
          </div>
        ) : null}
      </div>
    );

  const badge =
    layer.variant === "person" ? (
      <img src={assetUrl(layer.badge ?? "")} alt="" className="size-[60px] shrink-0 rounded-full object-cover object-[50%_30%]" />
    ) : (
      <div
        className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl"
        style={{ background: dark ? "rgb(255 255 255 / 0.1)" : scales.violet["50"] }}
      >
        <span className="text-[12px] leading-[14px] font-semibold" style={{ color: scales.violet[dark ? "300" : "500"] }}>
          {(layer.badge ?? "").split(" ")[0]}
        </span>
        <span className="text-[24px] leading-[26px] font-medium" style={{ fontFamily: DISPLAY }}>
          {(layer.badge ?? "").split(" ")[1]}
        </span>
      </div>
    );

  return (
    <div className="flex items-center gap-4 rounded-[26px] py-4 pr-7 pl-4" style={base}>
      {badge}
      <div className="flex flex-col gap-0.5">
        <span className="text-[23px] leading-[29px] font-medium"><Edit layerId={layer.id} field="title" value={layer.title} /></span>
        {layer.subtitle ? (
          <span className="flex items-center gap-2 text-[19px] leading-6 whitespace-nowrap" style={{ color: sub }}>
            {layer.variant === "person" ? <span className="size-2.5 rounded-full" style={{ background: scales.spark["500"] }} /> : null}
            <Edit layerId={layer.id} field="subtitle" value={layer.subtitle} />
          </span>
        ) : null}
      </div>
    </div>
  );
}

const PHONE_W = 414;
const PHONE_H = 868;

function Phone({ layer }: { layer: PhoneLayer }) {
  const scale = (layer.w ?? PHONE_W) / PHONE_W;
  const src = screenUrl(layer.screen) ?? (layer.image ? assetUrl(layer.image) : undefined);
  return (
    <div style={{ width: PHONE_W * scale, height: PHONE_H * scale }}>
      <div
        className="relative flex p-3"
        style={{
          width: PHONE_W,
          height: PHONE_H,
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
          borderRadius: 66,
          background: "linear-gradient(160deg, #3A3746 0%, #141219 38%, #0D0C12 100%)",
          boxShadow: "inset 0 0 0 2px #55525F, 0 60px 120px -30px rgb(34 8 74 / 0.55), 0 24px 40px -16px rgb(13 12 18 / 0.45)",
        }}
      >
        <div className="size-full overflow-hidden rounded-[54px]" style={{ background: scales.ink["50"] }}>
          {src ? (
            <img src={src} alt="" draggable={false} className="size-full object-cover object-top" />
          ) : (
            <div className="flex size-full items-center justify-center p-10 text-center text-[22px]" style={{ color: BODY, fontFamily: TEXT }}>
              Tela {layer.screen} não encontrada. Rode pnpm run screens.
            </div>
          )}
        </div>
        <div className="absolute top-6 left-[150px] h-[34px] w-[114px] rounded-[20px]" style={{ background: scales.ink["950"] }} />
      </div>
    </div>
  );
}

const FONT_STACK = { display: DISPLAY, body: TEXT, mono: '"DM Mono", ui-monospace, monospace' };

function resolveUrls(style: Record<string, string | number> | undefined): React.CSSProperties | undefined {
  if (!style) return undefined;
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(style)) {
    out[k] = typeof v === "string" && v.includes("url(") ? v.replace(/url\((["']?)([^)"']+)\1\)/g, (_m, _q, path) => `url("${assetUrl(path)}")`) : v;
  }
  return out as React.CSSProperties;
}

type HoleBox = { x: number; y: number; w: number; h: number; fw: number; fh: number };

function outsidePieces({ x, y, w, h, fw, fh }: HoleBox, r: number) {
  const k = Math.max(0, Math.min(r, w / 2, h / 2));
  const strips = [
    { left: 0, top: 0, width: fw, height: y },
    { left: 0, top: y + h, width: fw, height: fh - y - h },
    { left: 0, top: y, width: x, height: h },
    { left: x + w, top: y, width: fw - x - w, height: h },
  ].filter((s) => s.width > 0 && s.height > 0);
  const wedge = (cx: number, cy: number) => `path("M${cx} ${cy}H${k - cx}A${k} ${k} 0 0 ${cx === cy ? 0 : 1} ${cx} ${k - cy}Z")`;
  const corners = k
    ? [
        { left: x, top: y, width: k, height: k, clipPath: wedge(0, 0) },
        { left: x + w - k, top: y, width: k, height: k, clipPath: `path("M${k} 0H0A${k} ${k} 0 0 1 ${k} ${k}Z")` },
        { left: x, top: y + h - k, width: k, height: k, clipPath: `path("M0 ${k}V0A${k} ${k} 0 0 0 ${k} ${k}Z")` },
        { left: x + w - k, top: y + h - k, width: k, height: k, clipPath: `path("M${k} ${k}H0A${k} ${k} 0 0 0 ${k} 0Z")` },
      ]
    : [];
  return [...strips, ...corners];
}

function OutsideBlur({ amount, radius }: { amount: number; radius: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [box, setBox] = React.useState<HoleBox | null>(null);
  React.useLayoutEffect(() => {
    const el = ref.current?.parentElement;
    const frame = el?.closest<HTMLElement>("[data-frame-view]");
    if (!el || !frame) return;
    const read = () => {
      const next = { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight, fw: frame.offsetWidth, fh: frame.offsetHeight };
      setBox((b) => (b && Object.keys(next).every((k) => b[k as keyof HoleBox] === next[k as keyof HoleBox]) ? b : next));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    ro.observe(frame);
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ["style"] });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, []);
  return (
    <div ref={ref} className="pointer-events-none absolute" style={{ left: box ? -box.x : 0, top: box ? -box.y : 0, width: box?.fw ?? 0, height: box?.fh ?? 0 }}>
      {box ? outsidePieces(box, radius).map((piece, i) => <div key={i} className="absolute" style={{ ...piece, backdropFilter: `blur(${amount}px)` }} />) : null}
    </div>
  );
}

function LayerContent({ layer }: { layer: Layer }) {
  switch (layer.type) {
    case "rect":
      return (
        <>
          {layer.blurOutside && layer.backdropBlur ? <OutsideBlur amount={layer.backdropBlur} radius={layer.radius ?? 0} /> : null}
          <div
            className="relative size-full"
            style={{
              background: cssColor(layer.background),
              borderRadius: cornerRadius(layer),
              backdropFilter: !layer.blurOutside && layer.backdropBlur ? `blur(${layer.backdropBlur}px)` : undefined,
            }}
          />
        </>
      );
    case "image": {
      const img = (
        <img
          src={assetUrl(layer.src)}
          alt=""
          draggable={false}
          className="block size-full"
          style={{
            objectFit: layer.fit ?? "cover",
            objectPosition: layer.position ?? "50% 50%",
            borderRadius: cornerRadius(layer),
            boxShadow: layer.shadow ? "0 40px 80px -24px rgb(13 12 18 / 0.6)" : undefined,
            filter: layer.blur ? `blur(${layer.blur}px)` : undefined,
            scale: layer.blur ? String(1 + (layer.blur * 4) / Math.max(200, Math.min(layer.w ?? 1080, layer.h ?? 1350))) : undefined,
          }}
        />
      );
      return layer.screen && photoHasScreen(layer.src) ? <ScreenedImage layer={layer}>{img}</ScreenedImage> : img;
    }
    case "text":
      return (
        <div
          style={{
            whiteSpace: (layer.style?.whiteSpace as React.CSSProperties["whiteSpace"]) ?? "pre-line",
            fontFamily: FONT_STACK[layer.font],
            fontSize: layer.size,
            fontWeight: layer.weight ?? (layer.font === "display" ? 500 : 400),
            lineHeight: `${layer.leading ?? Math.round(layer.size * (layer.font === "display" ? 1 : 1.35))}px`,
            letterSpacing: `${layer.tracking ?? (layer.font === "display" ? -0.045 : 0)}em`,
            color: cssColor(layer.color),
            textAlign: layer.align,
            textTransform: layer.upper ? "uppercase" : undefined,
          }}
        >
          {layer.runs?.length ? (
            <RunsOrEdit layer={layer} />
          ) : (
            <Edit layerId={layer.id} field="text" value={layer.text} />
          )}
        </div>
      );
    case "phone":
      return <Phone layer={layer} />;
    case "chip":
      return <Chip layer={layer} />;
    case "logo":
      return <img src={logos[layer.variant]} alt="" draggable={false} className="block h-full w-auto max-w-none" />;
    case "svg":
      return <div className="size-full [&>svg]:block [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: layer.markup }} />;
    case "screen":
      return null;
    case "group":
      return (
        <>
          {layer.children.map((child) => (
            <NestedLayer key={child.id} layer={child} />
          ))}
        </>
      );
  }
}

function RunsOrEdit({ layer }: { layer: Extract<Layer, { type: "text" }> }) {
  const { active } = React.useContext(EditContext);
  if (active) return <Edit layerId={layer.id} field="text" value={layer.text} />;
  return (
    <>
      {layer.runs!.map((run, i) => (
        <span key={i} style={run.style?.color ? { ...resolveUrls(run.style), color: cssColor(String(run.style.color)) } : resolveUrls(run.style)}>
          {run.text}
        </span>
      ))}
    </>
  );
}

function ScreenedImage({ layer, children }: { layer: ImageLayer; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [box, setBox] = React.useState<{ w: number; h: number } | null>(null);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setBox((b) => (b && b.w === el.offsetWidth && b.h === el.offsetHeight ? b : { w: el.offsetWidth, h: el.offsetHeight }));
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const screen: ScreenLayer = { id: `${layer.id}-screen`, type: "screen", name: "Tela", x: 0, y: 0, screen: layer.screen ?? "", photo: layer.id };
  return (
    <div ref={ref} className="relative size-full overflow-hidden" style={{ borderRadius: cornerRadius(layer) }}>
      {children}
      {box && box.w > 0 ? <PhotoScreen layer={screen} photo={layer} box={{ x: 0, y: 0, ...box }} /> : null}
    </div>
  );
}

export function cornerRadius(layer: { radius?: number; corners?: [number, number, number, number] }): string | number | undefined {
  return layer.corners ? layer.corners.map((c) => `${c}px`).join(" ") : layer.radius;
}

function layerFilter(layer: Layer): React.CSSProperties {
  const out: React.CSSProperties = {};
  const filters: string[] = [];
  if (layer.blur && layer.type !== "image") filters.push(`blur(${layer.blur}px)`);
  const s = layer.dropShadow;
  if (s && !s.hidden) filters.push(`drop-shadow(${s.x}px ${s.y}px ${s.blur / 2}px ${cssColor(s.color)})`);
  if (filters.length) out.filter = filters.join(" ");
  if (layer.backdropBlur && layer.type !== "rect") out.backdropFilter = `blur(${layer.backdropBlur}px)`;
  if (layer.blend) out.mixBlendMode = layer.blend;
  const k = layer.stroke;
  if (k && !k.hidden && k.width > 0) {
    out.outline = `${k.width}px solid ${cssColor(k.color)}`;
    out.outlineOffset = -k.width;
    const r = layer.type === "rect" || layer.type === "image" ? cornerRadius(layer) : undefined;
    if (r) out.borderRadius = r;
  }
  return out;
}

function NestedLayer({ layer }: { layer: Layer }) {
  if (layer.hidden) return null;
  const sized = layer.type === "image" || layer.type === "svg" || layer.type === "rect" || layer.type === "logo";
  return (
    <div
      data-child={layer.id}
      style={{
        width: sized ? layer.w : undefined,
        height: sized ? layer.h : undefined,
        rotate: layer.rotate ? `${layer.rotate}deg` : undefined,
        opacity: layer.opacity,
        scale: layer.scale && layer.scale !== 1 ? String(layer.scale) : undefined,
        transformOrigin: layer.scale && layer.scale !== 1 ? "0 0" : undefined,
        ...resolveUrls(layer.style),
        ...layerFilter(layer),
        ...(layer.type === "image" ? { overflow: "hidden" } : {}),
      }}
    >
      <LayerContent layer={layer} />
    </div>
  );
}

export type Placement = { x: number; y: number; w?: number; h?: number; rotate?: number; hidden?: boolean };

const TALLER_TOP_SHARE = 0.43;

export function place(
  layer: Layer,
  frame: { width: number; height: number },
  base: { width: number; height: number },
  override?: Partial<Placement>,
): Placement {
  if (layer.fill) return { x: 0, y: 0, w: frame.width, h: frame.height, rotate: layer.rotate, hidden: override?.hidden ?? layer.hidden };
  const delta = frame.height - base.height;
  const dx = (frame.width - base.width) / 2;
  if (delta > 0) {
    const lift = Math.round(delta * TALLER_TOP_SHARE);
    const top = layer.y <= 0;
    const bottom = layer.h !== undefined && layer.y + layer.h >= base.height - 2;
    const y = top ? layer.y : layer.y + lift;
    const h = layer.h === undefined ? undefined : layer.h + (top ? lift : 0) + (bottom ? delta - lift : 0);
    return { x: layer.x + (frame.width === base.width ? 0 : dx), y, w: layer.w, h, rotate: layer.rotate, hidden: layer.hidden, ...override };
  }
  const anchor = layer.anchor ?? "top";
  const touchesBottom = layer.h !== undefined && layer.y + layer.h >= base.height - 2;
  const touchesTop = layer.y <= 0;
  const shift = touchesBottom && !touchesTop
    ? delta
    : touchesTop
      ? 0
      : anchor === "top"
        ? delta > 0 ? delta * 0.3 : 0
        : anchor === "bottom"
          ? delta > 0 ? delta * 0.55 : delta
          : delta / 2;
  const stretch = touchesTop && touchesBottom && layer.h !== undefined ? layer.h + delta : layer.h;
  const auto = { x: layer.x + (frame.width === base.width ? 0 : dx), y: Math.round(layer.y + shift), w: layer.w, h: stretch, rotate: layer.rotate, hidden: layer.hidden };
  return { ...auto, ...override };
}

function geometryFree(style: React.CSSProperties | undefined, placement: Placement): React.CSSProperties | undefined {
  if (!style) return style;
  const out = { ...style };
  if (placement.w !== undefined) {
    delete out.width;
    delete out.minWidth;
    delete out.maxWidth;
  }
  if (placement.h !== undefined) {
    delete out.height;
    delete out.minHeight;
    delete out.maxHeight;
  }
  return out;
}

export function LayerView({
  layer,
  placement,
  editing,
  onEdit,
  ...rest
}: { layer: Layer; placement: Placement; editing?: boolean; onEdit?: EditHandler } & React.HTMLAttributes<HTMLDivElement>) {
  if (placement.hidden) return null;
  const auto = layer.type === "text" || layer.type === "chip" || layer.type === "phone";
  const group = layer.type === "group";
  return (
    <div
      data-layer={layer.id}
      style={{
        position: "absolute",
        left: placement.x,
        top: placement.y,
        width: layer.type === "phone" ? undefined : (placement.w ?? (layer.type === "chip" ? "max-content" : undefined)),
        height: auto || (group && placement.h === undefined) ? undefined : placement.h,
        rotate: placement.rotate ? `${placement.rotate}deg` : undefined,
        transformOrigin: "0 0",
        opacity: layer.type === "screen" ? undefined : layer.opacity,
        scale: layer.scale && layer.scale !== 1 ? String(layer.scale) : undefined,
        ...geometryFree(resolveUrls(layer.style), placement),
        ...layerFilter(layer),
        ...(layer.type === "image" && (layer.style?.borderRadius || layer.blur) ? { overflow: "hidden" } : {}),
      }}
      {...rest}
    >
      <EditContext.Provider value={{ active: !!editing, onEdit }}>
        <LayerContent layer={layer} />
      </EditContext.Provider>
    </div>
  );
}

export function FrameView({
  frame,
  width,
  height,
  base,
  overrides,
  renderLayer,
}: {
  frame: Frame;
  width: number;
  height: number;
  base: { width: number; height: number };
  overrides?: Record<string, Partial<Placement>>;
  renderLayer?: (layer: Layer, placement: Placement) => React.ReactNode;
}) {
  return (
    <div
      data-frame-view=""
      className="relative overflow-hidden"
      style={{ width, height, background: cssColor(frame.background), WebkitFontSmoothing: "antialiased", fontFamily: TEXT }}
    >
      {frame.layers.map((layer) => {
        if (layer.type === "screen") {
          const photo = frame.layers.find((l) => l.id === layer.photo);
          if (!photo || photo.type !== "image" || photo.hidden) return null;
          const pp = place(photo, { width, height }, base, overrides?.[photo.id]);
          const box = { x: pp.x, y: pp.y, w: pp.w ?? width, h: pp.h ?? height, rotate: pp.rotate };
          const bounds = quadBounds(photo, box);
          if (!bounds || layer.hidden) return null;
          const placement = { x: bounds.left, y: bounds.top, w: bounds.width, h: bounds.height };
          return (
            <React.Fragment key={layer.id}>
              <PhotoScreen layer={layer} photo={photo} box={box} />
              {renderLayer ? renderLayer(layer, placement) : null}
            </React.Fragment>
          );
        }
        const placement = place(layer, { width, height }, base, overrides?.[layer.id]);
        return renderLayer ? renderLayer(layer, placement) : <LayerView key={layer.id} layer={layer} placement={placement} />;
      })}
    </div>
  );
}
