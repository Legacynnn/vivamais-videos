import * as React from "react";
import { Field, selectedImageOutlineClassName } from "@/ui";
import { cn } from "@/ui/lib/utils";
import { gradients } from "@/brand";
import { people, photos, screens, type LibraryItem } from "./library";
import { SCREEN_PHOTOS, photoHasScreen } from "./photo-screen";
import { cssColor } from "./tokens";
import { uid, type Frame, type ImageLayer, type Layer, type ScreenLayer } from "./model";

type Swatch = { value: string; label: string; css?: string; src?: string };
type Category = { id: string; label: string; items: Swatch[] };

const asSwatch = (i: LibraryItem): Swatch => ({ value: i.value, label: i.label, src: i.src });
const pool = [...photos, ...people];
const byPath = (paths: string[]) => pool.filter((p) => paths.includes(p.value)).map(asSwatch);
const inFolder = (...prefixes: string[]) => pool.filter((p) => prefixes.some((x) => p.value.startsWith(x))).map(asSwatch);

const SOLIDS: [string, string][] = [
  ["Violeta", "{violet.600}"],
  ["Violeta escuro", "{violet.900}"],
  ["Ink", "{ink.950}"],
  ["Lilás claro", "{violet.50}"],
  ["Branco", "{white}"],
];

const celular = byPath(SCREEN_PHOTOS);
const comUi = inFolder("assets/posts/ui-photos/");
const seen = new Set([...celular, ...comUi].map((s) => s.value));
const pessoas = [...inFolder("assets/people/"), ...inFolder("assets/posts/photos/retrato-")].filter((s) => !seen.has(s.value));
const taken = new Set([...seen, ...pessoas.map((s) => s.value)]);
const outras = pool.filter((p) => !taken.has(p.value) && !p.value.includes("avatar-")).map(asSwatch);

export const BACKGROUNDS: Category[] = [
  {
    id: "cor",
    label: "Gradientes e cores",
    items: [
      ...Object.entries(gradients).map(([name, css]) => ({ value: css, label: name, css })),
      ...SOLIDS.map(([label, ref]) => ({ value: ref, label: `${label} · token`, css: cssColor(ref) })),
    ],
  },
  { id: "celular", label: "Celular na mão", items: celular },
  { id: "pessoas", label: "Pessoas", items: pessoas },
  { id: "outras", label: "Outras", items: outras },
].filter((c) => c.items.length);

export function backgroundLayer(frame: Frame): ImageLayer | undefined {
  return frame.layers.find((l): l is ImageLayer => l.type === "image" && !!l.fill);
}

export function currentBackground(frame: Frame): string {
  const bg = backgroundLayer(frame);
  return bg && !bg.hidden ? bg.src : frame.background;
}

export function applyBackground(frame: Frame, value: string, isPhoto: boolean): Frame {
  const bg = backgroundLayer(frame);
  if (!isPhoto) {
    return {
      ...frame,
      background: value,
      layers: frame.layers.map((l) => (bg && (l.id === bg.id || (l.type === "screen" && l.photo === bg.id)) ? { ...l, hidden: true } : l)),
    };
  }
  const screen = photoHasScreen(value);
  if (!bg) {
    const photo: ImageLayer = { id: uid(), type: "image", name: "Foto", slot: "Foto", fill: true, x: 0, y: 0, src: value, fit: "cover", position: "50%" };
    const added: Layer[] = [photo];
    if (screen) added.push({ id: uid(), type: "screen", name: "Tela no celular", slot: "Tela", x: 0, y: 0, screen: screens[0]?.value ?? "", photo: photo.id });
    return { ...frame, layers: [...added, ...frame.layers] };
  }
  const linked = frame.layers.some((l) => l.type === "screen" && l.photo === bg.id);
  let layers = frame.layers.map((l): Layer => {
    if (l.id === bg.id) return { ...bg, src: value, hidden: undefined };
    if (l.type === "screen" && l.photo === bg.id) return { ...l, hidden: screen ? undefined : true };
    return l;
  });
  if (screen && !linked) {
    const at = layers.findIndex((l) => l.id === bg.id) + 1;
    const made: ScreenLayer = { id: uid(), type: "screen", name: "Tela no celular", slot: "Tela", x: 0, y: 0, screen: screens[0]?.value ?? "", photo: bg.id };
    layers = [...layers.slice(0, at), made, ...layers.slice(at)];
  }
  return { ...frame, layers };
}

function Chips({ options, value, onChange }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "h-6 cursor-pointer rounded-full border px-2.5 text-[11px] transition-colors",
            o.value === value
              ? "border-[color:var(--link)] bg-[color:color-mix(in_oklab,var(--link)_14%,transparent)] text-[color:var(--foreground)]"
              : "border-[color:color-mix(in_oklab,var(--border)_14%,transparent)] text-[color:color-mix(in_oklab,var(--foreground)_65%,transparent)] hover:text-[color:var(--foreground)]",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Grid({ items, value, aspect, columns, onPick }: { items: Swatch[]; value: string; aspect: string; columns: number; onPick: (s: Swatch) => void }) {
  return (
    <div className="grid max-h-[320px] min-w-0 gap-2 overflow-y-auto p-1" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {items.map((s) => (
        <button
          key={s.value}
          type="button"
          title={s.label}
          data-selected={s.value === value}
          onClick={() => onPick(s)}
          className={cn(
            "relative min-w-0 cursor-pointer overflow-hidden rounded-md border border-[color:color-mix(in_oklab,var(--border)_10%,transparent)] bg-[color:var(--muted)] p-0",
            selectedImageOutlineClassName,
          )}
          style={{ aspectRatio: aspect }}
        >
          {s.src ? <img alt="" src={s.src} draggable={false} className="size-full object-cover" /> : <span className="block size-full" style={{ background: s.css }} />}
        </button>
      ))}
    </div>
  );
}

export function BackgroundPicker({ frame, onChange }: { frame: Frame; onChange: (frame: Frame) => void }) {
  const value = currentBackground(frame);
  const owner = BACKGROUNDS.find((c) => c.items.some((i) => i.value === value))?.id ?? BACKGROUNDS[0]?.id ?? "";
  const [tab, setTab] = React.useState(owner);
  React.useEffect(() => setTab(owner), [frame.id]);
  const category = BACKGROUNDS.find((c) => c.id === tab) ?? BACKGROUNDS[0];
  return (
    <Field className="min-w-0 !gap-[10px]">
      <Chips options={BACKGROUNDS.map((c) => ({ value: c.id, label: `${c.label} ${c.items.length}` }))} value={tab} onChange={setTab} />
      {category ? (
        <Grid
          items={category.items}
          value={value}
          aspect="4 / 5"
          columns={3}
          onPick={(s) => onChange(applyBackground(frame, s.value, !s.css))}
        />
      ) : null}
    </Field>
  );
}
