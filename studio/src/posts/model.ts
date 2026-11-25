export type Style = Record<string, string | number>;

export type Anchor = "top" | "center" | "bottom";

export type LayerBase = {
  id: string;
  name: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  rotate?: number;
  opacity?: number;
  hidden?: boolean;
  locked?: boolean;
  slot?: string;
  anchor?: Anchor;
  fill?: boolean;
  style?: Style;
  scale?: number;
  blur?: number;
  backdropBlur?: number;
  blend?: BlendMode;
  stroke?: Stroke;
  dropShadow?: DropShadow;
};

export type BlendMode = "multiply" | "screen" | "overlay" | "soft-light" | "darken" | "lighten" | "color-dodge" | "luminosity";
export type Stroke = { color: string; width: number; hidden?: boolean };
export type DropShadow = { x: number; y: number; blur: number; color: string; hidden?: boolean };

export type Corners = [number, number, number, number];

export type RectLayer = LayerBase & { type: "rect"; fill?: boolean; background?: string; radius?: number; corners?: Corners; blurOutside?: boolean };

export type ImageLayer = LayerBase & {
  type: "image";
  src: string;
  fit?: "cover" | "contain";
  position?: string;
  radius?: number;
  corners?: Corners;
  shadow?: boolean;
  choices?: string[];
  screen?: string;
};

export type TextRun = { text: string; style?: Style };

export type TextLayer = LayerBase & {
  type: "text";
  text: string;
  runs?: TextRun[];
  font: "display" | "body" | "mono";
  size: number;
  weight?: number;
  color: string;
  leading?: number;
  tracking?: number;
  align?: "left" | "center" | "right";
  upper?: boolean;
};

export type PhoneLayer = LayerBase & { type: "phone"; screen: string; image?: string; frame?: "dark" | "none" };

export type ChipVariant = "pill" | "date" | "person" | "stat" | "bubble" | "cta";

export type ChipLayer = LayerBase & {
  type: "chip";
  variant: ChipVariant;
  title: string;
  subtitle?: string;
  badge?: string;
  tone?: "light" | "violet" | "dark";
};

export type LogoVariant =
  | "lockupWhite"
  | "lockupViolet"
  | "lockupColor"
  | "symbolWhite"
  | "symbolColor"
  | "symbolViolet"
  | "wordmarkWhite"
  | "wordmarkPurple"
  | "wordmarkViolet"
  | "appIcon";

export type LogoLayer = LayerBase & { type: "logo"; variant: LogoVariant };

export type SvgLayer = LayerBase & { type: "svg"; markup: string };

export type GroupLayer = LayerBase & { type: "group"; children: Layer[] };

export type ScreenLayer = LayerBase & { type: "screen"; screen: string; photo: string };

export type Layer = RectLayer | ImageLayer | TextLayer | PhoneLayer | ChipLayer | LogoLayer | SvgLayer | GroupLayer | ScreenLayer;

export type LayerType = Layer["type"];

export type Frame = { id: string; name: string; background: string; layers: Layer[] };

export type Kind = "post" | "sequence" | "cover";

export type Override = Partial<Pick<LayerBase, "x" | "y" | "w" | "h" | "rotate" | "hidden">>;

export type PostDoc = {
  id: string;
  name: string;
  kind: Kind;
  format: string;
  base: { width: number; height: number };
  frames: Frame[];
  overrides?: Record<string, Record<string, Override>>;
  style?: string;
  topics?: string[];
  source?: string;
  updatedAt: string;
};

export function uid(prefix = "l"): string {
  return `${prefix}${Math.random().toString(36).slice(2, 8)}`;
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function walk(layers: Layer[], fn: (layer: Layer, depth: number) => void, depth = 0) {
  for (const layer of layers) {
    fn(layer, depth);
    if (layer.type === "group") walk(layer.children, fn, depth + 1);
  }
}

export function findLayer(layers: Layer[], id: string): Layer | undefined {
  let found: Layer | undefined;
  walk(layers, (l) => {
    if (l.id === id) found = l;
  });
  return found;
}

export function mapLayers(layers: Layer[], fn: (layer: Layer) => Layer | null): Layer[] {
  const out: Layer[] = [];
  for (const layer of layers) {
    const next = fn(layer);
    if (!next) continue;
    out.push(next.type === "group" ? { ...next, children: mapLayers(next.children, fn) } : next);
  }
  return out;
}

export function isTopLevel(frame: Frame, id: string): boolean {
  return frame.layers.some((l) => l.id === id);
}

export function cloneWithIds<T extends Layer>(layer: T): T {
  const copy = structuredClone(layer);
  walk([copy], (l) => {
    l.id = uid();
  });
  return copy;
}
