import * as React from "react";
import { createPortal } from "react-dom";
import { Eyedropper, X } from "@phosphor-icons/react";
import { LinkBreak, LinkSimple } from "@phosphor-icons/react";
import { SCALE_NAMES, SEMANTIC_TOKENS, cssColor, makeRef, tokenName, tokenRef, tokenValue, tokenVar } from "./tokens";
import { cn } from "@/ui/lib/utils";

export type Rgba = { r: number; g: number; b: number; a: number };
type Hsva = { h: number; s: number; v: number; a: number };

let probe: CanvasRenderingContext2D | null = null;

export function parseColor(input: string): Rgba | undefined {
  const value = cssColor(input).trim();
  if (!value) return;
  probe ??= document.createElement("canvas").getContext("2d");
  if (!probe) return;
  probe.fillStyle = "#010203";
  probe.fillStyle = value;
  const out = probe.fillStyle;
  if (out === "#010203" && value.toLowerCase() !== "#010203") return;
  if (out.startsWith("#")) return { r: parseInt(out.slice(1, 3), 16), g: parseInt(out.slice(3, 5), 16), b: parseInt(out.slice(5, 7), 16), a: 1 };
  const m = out.match(/rgba?\(([^)]+)\)/);
  if (!m) return;
  const [r, g, b, a = "1"] = m[1].split(/[\s,/]+/).filter(Boolean);
  return { r: Number(r), g: Number(g), b: Number(b), a: Number(a) };
}

const hex2 = (n: number) => Math.round(n).toString(16).padStart(2, "0").toUpperCase();

export function formatColor({ r, g, b, a }: Rgba): string {
  return `#${hex2(r)}${hex2(g)}${hex2(b)}${a < 1 ? hex2(a * 255) : ""}`;
}

function toHsva({ r, g, b, a }: Rgba): Hsva {
  const [R, G, B] = [r / 255, g / 255, b / 255];
  const max = Math.max(R, G, B);
  const d = max - Math.min(R, G, B);
  let h = 0;
  if (d) h = max === R ? ((G - B) / d) % 6 : max === G ? (B - R) / d + 2 : (R - G) / d + 4;
  return { h: (h * 60 + 360) % 360, s: max ? d / max : 0, v: max, a };
}

function toRgba({ h, s, v, a }: Hsva): Rgba {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return (v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255;
  };
  return { r: f(5), g: f(3), b: f(1), a };
}

const RECENT_KEY = "studio:colors:recent";

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function pushRecent(color: string) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify([color, ...readRecent().filter((c) => c !== color)].slice(0, 10)));
  } catch {
    return;
  }
}

const SCALES = SCALE_NAMES.map((name) => ({
  name,
  steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"].filter((step) => tokenValue(`${name}.${step}`)).map((step) => [step, `${name}.${step}`] as const),
}));

const CHECKER = "repeating-conic-gradient(#c8c8d0 0% 25%, #ffffff 0% 50%) 0 0 / 8px 8px";

function useDrag(onMove: (x: number, y: number) => void, onEnd: () => void) {
  return (event: React.PointerEvent<HTMLElement>) => {
    const el = event.currentTarget;
    el.setPointerCapture(event.pointerId);
    const read = (e: { clientX: number; clientY: number }) => {
      const r = el.getBoundingClientRect();
      onMove(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)));
    };
    read(event);
    const move = (e: PointerEvent) => read(e);
    const up = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      onEnd();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  };
}

function Picker({ value, onChange, onClose, anchor }: { value: string; onChange: (color: string) => void; onClose: () => void; anchor: DOMRect }) {
  const initial = parseColor(value) ?? { r: 255, g: 255, b: 255, a: 1 };
  const [hsva, setHsva] = React.useState(() => toHsva(initial));
  const [mode, setMode] = React.useState<"hex" | "rgb">("hex");
  const [draft, setDraft] = React.useState<string | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);
  const recent = React.useMemo(readRecent, []);
  const rgba = toRgba(hsva);
  const current = formatColor(rgba);
  const lastSent = React.useRef(value);
  const [link, setLink] = React.useState(() => tokenRef(value)?.path ?? null);

  function send(out: string) {
    if (out === lastSent.current) return;
    lastSent.current = out;
    onChange(out);
  }

  function emit(next: Hsva) {
    setHsva(next);
    setLink(null);
    send(formatColor(toRgba(next)));
  }

  function setAlpha(a: number) {
    if (!link) return emit({ ...hsva, a });
    setHsva({ ...hsva, a });
    send(makeRef(link, a));
  }

  function pickToken(path: string, a = hsva.a) {
    const parsed = parseColor(`{${path}}`);
    if (!parsed) return;
    const next = toHsva({ ...parsed, a });
    setHsva(parsed.r === parsed.g && parsed.g === parsed.b ? { ...next, h: hsva.h } : next);
    setLink(path);
    send(makeRef(path, a));
  }

  function setFrom(color: string) {
    const parsed = parseColor(color);
    if (parsed) emit({ ...toHsva(parsed), h: parsed.r === parsed.g && parsed.g === parsed.b ? hsva.h : toHsva(parsed).h });
  }

  React.useEffect(() => {
    const down = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("pointerdown", down, true);
    window.addEventListener("keydown", key, true);
    return () => {
      window.removeEventListener("pointerdown", down, true);
      window.removeEventListener("keydown", key, true);
      pushRecent(lastSent.current);
    };
  }, [onClose]);

  const area = useDrag((x, y) => emit({ ...hsva, s: x, v: 1 - y }), () => undefined);
  const hue = useDrag((x) => emit({ ...hsva, h: x * 360 }), () => undefined);
  const alpha = useDrag((x) => setAlpha(Math.round(x * 100) / 100), () => undefined);

  const width = 248;
  const left = Math.max(8, Math.min(window.innerWidth - width - 8, anchor.right - width));
  const below = anchor.bottom + 6;
  const top = below + 470 > window.innerHeight ? Math.max(8, anchor.top - 476) : below;
  const opaque = `rgb(${rgba.r} ${rgba.g} ${rgba.b})`;
  const hueColor = `hsl(${hsva.h} 100% 50%)`;
  const eyedropper = typeof window !== "undefined" && "EyeDropper" in window;

  const field = "h-7 min-w-0 rounded-md border border-[color:color-mix(in_oklab,var(--border)_14%,transparent)] bg-[color:color-mix(in_oklab,var(--input)_6%,transparent)] px-1.5 text-center font-mono text-[11px] outline-none focus:border-[color:color-mix(in_oklab,var(--border)_35%,transparent)]";

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-label="Seletor de cor"
      className="fixed z-[1000] flex flex-col gap-3 rounded-xl border border-[color:color-mix(in_oklab,var(--border)_14%,transparent)] bg-[color:var(--popover,var(--background))] p-3 text-[color:var(--foreground)] shadow-[0_24px_64px_-12px_rgb(0_0_0/0.6)]"
      style={{ left, top, width }}
      onKeyDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between gap-2">
        {link ? (
          <span className="flex min-w-0 items-center gap-1.5 text-[11.5px] font-semibold" title={`Token ${link} · var(${tokenVar(link)})`}>
            <LinkSimple className="size-3.5 shrink-0 text-[color:var(--accent)]" />
            <span className="truncate">{tokenName(link)}</span>
            <span className="truncate font-mono text-[10.5px] font-normal opacity-50">{link}</span>
          </span>
        ) : (
          <span className="text-[11.5px] font-semibold">Cor solta</span>
        )}
        <button type="button" aria-label="Fechar" onClick={onClose} className="flex size-6 cursor-pointer items-center justify-center rounded-md opacity-60 hover:bg-[color:color-mix(in_oklab,var(--foreground)_8%,transparent)] hover:opacity-100">
          <X className="size-3.5" />
        </button>
      </div>

      <div className="relative h-[150px] cursor-crosshair touch-none rounded-lg" style={{ background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColor})` }} onPointerDown={area}>
        <span
          className="pointer-events-none absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.35),0_2px_6px_rgb(0_0_0/0.4)]"
          style={{ left: `${hsva.s * 100}%`, top: `${(1 - hsva.v) * 100}%`, background: opaque }}
        />
      </div>

      <div className="flex items-center gap-2.5">
        {eyedropper ? (
          <button
            type="button"
            title="Conta-gotas"
            aria-label="Conta-gotas"
            className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md hover:bg-[color:color-mix(in_oklab,var(--foreground)_8%,transparent)]"
            onClick={async () => {
              try {
                const picked = await new (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper().open();
                setFrom(picked.sRGBHex);
              } catch {
                return;
              }
            }}
          >
            <Eyedropper className="size-4" />
          </button>
        ) : null}
        <div className="flex flex-1 flex-col gap-2">
          <div className="relative h-3 cursor-pointer touch-none rounded-full" style={{ background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)" }} onPointerDown={hue}>
            <span className="pointer-events-none absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3)]" style={{ left: `${(hsva.h / 360) * 100}%`, background: hueColor }} />
          </div>
          <div className="relative h-3 cursor-pointer touch-none rounded-full" style={{ background: `linear-gradient(to right, transparent, ${opaque}), ${CHECKER}` }} onPointerDown={alpha}>
            <span className="pointer-events-none absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3)]" style={{ left: `${hsva.a * 100}%`, background: opaque }} />
          </div>
        </div>
        <span className="size-8 shrink-0 rounded-md shadow-[inset_0_0_0_1px_rgb(255_255_255/0.15)]" style={{ background: `linear-gradient(${current}, ${current}), ${CHECKER}` }} />
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setMode((m) => (m === "hex" ? "rgb" : "hex"))}
          className="h-7 w-11 shrink-0 cursor-pointer rounded-md text-[11px] uppercase opacity-70 hover:bg-[color:color-mix(in_oklab,var(--foreground)_8%,transparent)] hover:opacity-100"
          title="Trocar formato"
        >
          {mode}
        </button>
        {mode === "hex" ? (
          <input
            aria-label="Hex"
            className={cn(field, "flex-1 uppercase")}
            value={draft ?? current.slice(1, 7)}
            onFocus={(e) => {
              setDraft(current.slice(1, 7));
              e.currentTarget.select();
            }}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => {
              if (draft !== null) setFrom(`#${draft.replace(/^#/, "")}`.slice(0, 7) + (hsva.a < 1 ? hex2(hsva.a * 255) : ""));
              setDraft(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          />
        ) : (
          (["r", "g", "b"] as const).map((k) => (
            <input
              key={`${k}${Math.round(rgba[k])}`}
              aria-label={k.toUpperCase()}
              className={cn(field, "w-0 flex-1")}
              defaultValue={Math.round(rgba[k])}
              onFocus={(e) => e.currentTarget.select()}
              onBlur={(e) => {
                const n = Math.max(0, Math.min(255, Number(e.target.value) || 0));
                emit(toHsva({ ...rgba, [k]: n }));
              }}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            />
          ))
        )}
        <input
          aria-label="Opacidade"
          className={cn(field, "w-12 shrink-0")}
          defaultValue={`${Math.round(hsva.a * 100)}%`}
          onFocus={(e) => e.currentTarget.select()}
          key={Math.round(hsva.a * 100)}
          onBlur={(e) => {
            const n = Number.parseFloat(e.target.value);
            if (Number.isFinite(n)) setAlpha(Math.max(0, Math.min(100, n)) / 100);
          }}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        />
      </div>

      <div className="flex flex-col gap-1.5 border-t border-[color:color-mix(in_oklab,var(--border)_10%,transparent)] pt-2.5">
        <span className="text-[10.5px] font-medium tracking-[0.02em] uppercase opacity-50">Tokens</span>
        <div className="grid grid-cols-2 gap-x-1 gap-y-px">
          {SEMANTIC_TOKENS.map((t) => (
            <button
              key={t.path}
              type="button"
              title={`{${t.path}} → ${tokenValue(t.path)}`}
              onClick={() => pickToken(t.path)}
              className={cn(
                "flex h-6 min-w-0 cursor-pointer items-center gap-1.5 rounded-md px-1 text-left text-[11.5px] outline-none hover:bg-[color:color-mix(in_oklab,var(--foreground)_8%,transparent)]",
                link === t.path && "bg-[color:color-mix(in_oklab,var(--primary)_28%,transparent)]",
              )}
            >
              <span className="size-3.5 shrink-0 rounded-[4px] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.15)]" style={{ background: tokenValue(t.path) }} />
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[10.5px] font-medium tracking-[0.02em] uppercase opacity-50">Escalas</span>
        {SCALES.map(({ name, steps }) => (
          <div key={name} className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
            {steps.map(([step, path]) => (
              <Swatch key={step} color={tokenValue(path)!} label={`${name} ${step}`} active={link === path} onPick={() => pickToken(path)} />
            ))}
          </div>
        ))}
      </div>

      {recent.length ? (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10.5px] font-medium tracking-[0.02em] uppercase opacity-50">Recentes</span>
          <div className="grid grid-cols-10 gap-[3px]">
            {recent.map((c) => (
              <Swatch
                key={c}
                color={cssColor(c)}
                label={tokenRef(c) ? `${tokenName(tokenRef(c)!.path)} (token)` : c}
                active={lastSent.current === c}
                onPick={() => {
                  const r = tokenRef(c);
                  if (r) pickToken(r.path, r.alpha);
                  else setFrom(c);
                }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>,
    document.body,
  );
}

function Swatch({ color, label, active, onPick }: { color: string; label: string; active: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onPick}
      className={cn(
        "aspect-square min-w-0 cursor-pointer rounded-[4px] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)] outline-none transition-transform duration-75 hover:scale-110 focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",
        active && "ring-2 ring-[color:var(--accent)] ring-offset-1 ring-offset-[color:var(--background)]",
      )}
      style={{ background: `linear-gradient(${color}, ${color}), ${CHECKER}` }}
    />
  );
}

export function ColorInput({ value, onChange, label = "Cor" }: { value: string; onChange: (color: string) => void; label?: string }) {
  const [anchor, setAnchor] = React.useState<DOMRect | null>(null);
  const box = React.useRef<HTMLDivElement>(null);
  const parsed = parseColor(value);
  const ref = tokenRef(value);
  const hex = parsed ? formatColor({ ...parsed, a: 1 }).slice(1) : value;
  const alpha = ref ? Math.round(ref.alpha * 100) : parsed ? Math.round(parsed.a * 100) : 100;
  const close = React.useCallback(() => setAnchor(null), []);
  const toggle = () => setAnchor(anchor ? null : (box.current?.getBoundingClientRect() ?? null));
  const stop = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === "Enter") e.currentTarget.blur();
  };
  const resolved = cssColor(value);
  return (
    <div
      ref={box}
      className={cn(
        "flex h-7 min-w-0 items-center gap-2 rounded-lg border pr-1 pl-1 text-xs",
        "border-[color:color-mix(in_oklab,var(--border)_12%,transparent)] bg-[color:color-mix(in_oklab,var(--input)_5%,transparent)] hover:border-[color:color-mix(in_oklab,var(--border)_20%,transparent)]",
        anchor && "border-[color:color-mix(in_oklab,var(--border)_35%,transparent)]",
      )}
    >
      <button
        type="button"
        aria-label={`${label}: abrir seletor`}
        title="Abrir seletor de cor"
        onClick={toggle}
        className="size-5 shrink-0 cursor-pointer rounded-[5px] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.15)]"
        style={{ background: `linear-gradient(${resolved}, ${resolved}), ${CHECKER}` }}
      />
      {ref ? (
        <button
          type="button"
          onClick={toggle}
          title={`Vinculado ao token {${ref.path}} · var(${tokenVar(ref.path)}). Muda junto quando o tema mudar.`}
          className="flex h-full min-w-0 flex-1 cursor-pointer items-center gap-1.5 text-left"
        >
          <LinkSimple className="size-3 shrink-0 text-[color:var(--accent)]" />
          <span className="truncate">{tokenName(ref.path)}</span>
        </button>
      ) : (
        <input
          aria-label={`${label} hex`}
          key={hex}
          defaultValue={hex}
          title="Hex, ou nome de token (ex.: violet.500, primary)"
          onFocus={(e) => e.currentTarget.select()}
          onKeyDown={stop}
          onBlur={(e) => {
            const raw = e.target.value.trim().replace(/^\{|\}$/g, "");
            if (tokenValue(raw)) return onChange(makeRef(raw, (parsed?.a ?? 1)));
            const next = parseColor(/^[0-9a-f]{3,8}$/i.test(raw) ? `#${raw}` : raw);
            if (next) onChange(formatColor({ ...next, a: parsed?.a ?? 1 }));
          }}
          className="h-full min-w-0 flex-1 bg-transparent font-mono uppercase outline-none"
        />
      )}
      <input
        aria-label={`${label} opacidade`}
        key={`a${alpha}`}
        defaultValue={`${alpha}%`}
        onFocus={(e) => e.currentTarget.select()}
        onKeyDown={stop}
        onBlur={(e) => {
          const n = Number.parseFloat(e.target.value);
          if (!Number.isFinite(n)) return;
          const a = Math.max(0, Math.min(100, n)) / 100;
          if (ref) onChange(makeRef(ref.path, a));
          else if (parsed) onChange(formatColor({ ...parsed, a }));
        }}
        className="h-full w-9 shrink-0 bg-transparent text-right font-mono opacity-70 outline-none"
      />
      {ref ? (
        <button
          type="button"
          aria-label="Desvincular do token"
          title="Desvincular (vira cor solta, não acompanha o tema)"
          onClick={() => parsed && onChange(formatColor(parsed))}
          className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded opacity-50 hover:bg-[color:color-mix(in_oklab,var(--foreground)_8%,transparent)] hover:opacity-100"
        >
          <LinkBreak className="size-3" />
        </button>
      ) : (
        <span className="w-0.5" />
      )}
      {anchor ? <Picker value={value} anchor={anchor} onClose={close} onChange={onChange} /> : null}
    </div>
  );
}
